import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { URLConstants } from "../../../constants/urlConstants";
import { create } from "domain";

const courseName = FakerData.getCourseName();
const discountName = FakerData.getTagNames() + " " + "VolumeDiscount"+FakerData.getTagNames();
const description = FakerData.getDescription();
const price = FakerData.getPrice();
const code = "DIS-" + generateCode();
let discountValue: any;

test.describe.configure({ mode: "serial" });

test(`COM011 - Step 1: Create volume discount`, async ({ adminHome, commercehome, createCourse, discount, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM011 - Create volume discount for disassociation test` },
        { type: `Test Description`, description: `Create a volume discount to verify it gets disassociated when course is deleted` }
    );
    
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.clickCreateDiscount();
    await discount.selectVolumeDiscount();
    await createCourse.enter("name", discountName);
    await discount.enterDiscountDescription(description);
    await createCourse.enter("code", code);
    await discount.enterValidity();
    discountValue = await discount.setDiscountRules("Percentage Off", "US Dollar", "10", "Volume");
    console.log(`Created volume discount with value: ${discountValue}%`);
    await SurveyAssessment.clickPublish();
    await createCourse.clickProceed();
    console.log(`✅ Volume discount '${discountName}' created successfully`);
});

test(`COM011 - Step 2: Create paid course and associate volume discount`, async ({ createCourse, adminHome, editCourse }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM011 - Associate volume discount to course` },
        { type: `Test Description`, description: `Create paid course and associate volume discount to it` }
    );

    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();
    await createCourse.clickCreateCourse();
    await createCourse.verifyCreateUserLabel("CREATE COURSE");
    await createCourse.enter("course-title", courseName);
    await createCourse.selectLanguage("English");
    await createCourse.typeDescription(description);
    await createCourse.handleCategoryADropdown();
    await createCourse.enterPrice(price);
    await createCourse.selectCurrency();
    await createCourse.contentLibrary();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    console.log(`✅ Paid course '${courseName}' created successfully`);
    
    // Edit course to associate volume discount
    await createCourse.editcourse();
    await createCourse.clickCourseOption("Discount");
    
    // Select and apply volume discount to the course
    await editCourse.selectDiscountOption(discountName, "Minimum");
    console.log(`✅ Volume discount '${discountName}' associated with course '${courseName}'`);
    
    // Save the course with volume discount
    await createCourse.clickDetailButton();
    await createCourse.typeDescription(description);
    await createCourse.clickUpdate();
    await createCourse.verifySuccessMessage();
    console.log(`✅ Course updated with volume discount association`);
});

test(`COM011 - Step 3: Verify course is associated with discount on discount page`, async ({ adminHome, commercehome, discount }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM011 - Verify course association on discount page` },
        { type: `Test Description`, description: `Verify that the course is shown as associated with the discount on the discount page` }
    );

    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    
    // Search for the discount
    await discount.searchDiscount(discountName);
    
    // Edit the discount to view associated courses
    await discount.editDiscount();
    await discount.wait("mediumWait");
    
    // Verify course is associated with the discount
    await discount.verifyCourseAssociated(courseName);
    console.log(`✅ Verified: Course '${courseName}' is associated with discount '${discountName}' on the discount page`);
});

test(`COM011 - Step 4: Delete the course and verify discount disassociation`, async ({ adminHome, createCourse }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM011 - Delete course and verify discount disassociation` },
        { type: `Test Description`, description: `Delete the course and verify that volume discount gets disassociated from it` }
    );

    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();
    
    // Search and edit the created course
    await createCourse.catalogSearch(courseName);
    await createCourse.editCourseFromListingPage();
    await createCourse.wait("minWait");
    
    // Delete the course
    await createCourse.clickHideinCatalog();
    await createCourse.clickUpdate();
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();
    
    // Search and edit the created course
    await createCourse.catalogSearch(courseName);
    await createCourse.editCourseFromListingPage();
    await createCourse.wait("minWait");
    await createCourse.clickDeleteCourse();
    console.log(`✅ Course '${courseName}' deleted successfully`);
    
    
    
});

test(`COM011 - Step 5: Verify discount is still available but disassociated from deleted course`, async ({ adminHome, commercehome, discount }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM011 - Verify discount still exists and course is disassociated` },
        { type: `Test Description`, description: `Verify that volume discount still exists but is disassociated from the deleted course` }
    );

    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    
    // Search for the discount to verify it still exists
    await discount.searchDiscount(discountName);
    console.log(`✅ Volume discount '${discountName}' still exists in the system`);
    
    // Edit the discount to verify course is no longer associated
    await discount.editDiscount();
    await discount.wait("mediumWait");
    
    // Verify course is NOT associated with the discount anymore
    await discount.verifyCourseDisAssociated();
    console.log(`✅ Verified: Course '${courseName}' is NOT associated with discount '${discountName}' after deletion`);
    console.log(`✅ Test Passed: When course was deleted, volume discount got disassociated from it`);
});

test(`COM011 - Step 6: Delete the discount after verification`, async ({ adminHome, commercehome, discount }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM011 - Delete volume discount` },
        { type: `Test Description`, description: `Delete the volume discount after verifying disassociation behavior` }
    );

    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.searchDiscount(discountName);
    await discount.deleteDiscount(discountName);
    console.log(`✅ Volume discount '${discountName}' deleted successfully`);
});
