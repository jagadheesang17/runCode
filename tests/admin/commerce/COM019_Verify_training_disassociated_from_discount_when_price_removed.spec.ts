import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { create } from "domain";

const courseName = FakerData.getCourseName();
const discountName = FakerData.getTagNames() + " " + "PriceRemovalTest";
const description = FakerData.getDescription();
const price = FakerData.getPrice();
const code = "DIS-" + generateCode();
let discountValue: any;

test.describe.serial(`COM019 - Verify training gets disassociated from discount when admin removes the price`, () => {

test(`Step 1: Create linear discount`, async ({ adminHome, commercehome, createCourse, discount, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM019 - Create discount for price removal test` },
        { type: `Test Description`, description: `Verify whether the training gets disassociated from the discount page when the admin removes the price` }
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
    discountValue = await discount.setDiscountRules("Percentage Off","US Dollar", "10","Volume");
    console.log(`Created volume discount with value: ${discountValue}%`);
    await SurveyAssessment.clickPublish();
    await createCourse.clickProceed();
    console.log(`✅ Volume discount '${discountName}' created successfully`);
});

test(`Step 2: Create paid course and associate discount`, async ({ createCourse, adminHome, editCourse }) => {
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
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    console.log(`✅ Paid course '${courseName}' created successfully with price: ${price}`);
    
    // Edit course to associate discount
    await createCourse.editcourse();
    await createCourse.clickCourseOption("Discount");
    await editCourse.selectDiscountOption(discountName, "Minimum");
    console.log(`✅ Discount '${discountName}' associated with course '${courseName}'`);
    
    // Save the course with discount
    await createCourse.clickDetailButton();
    await createCourse.typeDescription(description);
    await createCourse.clickUpdate();
    await createCourse.verifySuccessMessage();
    console.log(`✅ Step 2 Passed: Course updated with discount association`);
});

test(`Step 3: Verify course is associated with discount before removing price`, async ({ adminHome, commercehome, discount }) => {
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.searchDiscount(discountName);
    await discount.editDiscount();
    await discount.wait("mediumWait");
    await discount.verifyCourseAssociated(courseName);
    console.log(`✅ Step 3 Passed: Course '${courseName}' is associated with discount before price removal`);
});

test(`Step 4: Remove price from the course`, async ({ adminHome, createCourse, page }) => {
    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();
    await createCourse.catalogSearch(courseName);
    await createCourse.editCourseFromListingPage();
    await createCourse.wait("mediumWait");
    
    // Clear the price field
    const priceField = page.locator("//label[text()='Price']/following::input[1]");
    await priceField.scrollIntoViewIfNeeded({ timeout: 3000 });
    await priceField.clear();
    await priceField.fill("");
    console.log(`✅ Price removed from course '${courseName}'`);
    
    // Update the course
    await createCourse.typeDescription(description);
    await createCourse.clickUpdate();
    await createCourse.clickOKButton();
    await createCourse.verifySuccessMessage();
    console.log(`✅ Step 4 Passed: Course updated with price removed`);
});

test(`Step 5: Verify course is disassociated from discount after removing price`, async ({ adminHome, commercehome, discount }) => {
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.searchDiscount(discountName);
    await discount.editDiscount();
    await discount.wait("mediumWait");
    
    // Verify course is NO LONGER associated (should be disassociated)
    await discount.verifyCourseDisAssociated();
    console.log(`✅ Step 5 Passed: Course '${courseName}' is disassociated from discount after price removal - Training gets disassociated when price is removed`);
});

test(`Step 6: Delete discount`, async ({ discount }) => {
    await discount.wait("mediumWait");
    await discount.page.goBack();
    await discount.wait("mediumWait");
    await discount.searchDiscount(discountName);
    await discount.deleteDiscount(discountName);
    await discount.verifyDeleteDiscount(discountName);
    console.log(`✅ Step 6 Passed: Discount '${discountName}' deleted successfully`);
});

});
