import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { create } from "domain";
import { EditCoursePage } from "../../../pages/EditCoursePage";

const courseName = FakerData.getCourseName();
const discountName = FakerData.getTagNames() + " " + "CompletionTest";
const description = FakerData.getDescription();
const price = FakerData.getPrice();
const code = "DIS-" + generateCode();
let discountValue: any;

test.describe.serial(`COM018 - Verify training does not get disassociated from discount when training is completed`, () => {

test(`Step 1: Create linear discount`, async ({ adminHome, commercehome, createCourse, discount, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM018 - Create discount for training completion test` },
        { type: `Test Description`, description: `Verify whether the training should not get disassociated from the discount page when the training gets completed` }
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
    console.log(`✅ Paid course '${courseName}' created successfully`);
    
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

test(`Step 3: Verify course is associated with discount before completion`, async ({ adminHome, commercehome, discount }) => {
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.searchDiscount(discountName);
    await discount.editDiscount();
    await discount.wait("mediumWait");
    await discount.verifyCourseAssociated(courseName);
    console.log(`✅ Step 3 Passed: Course '${courseName}' is associated with discount before completion`);
});

test(`Step 5: Complete the training as learner`, async ({ adminHome, editCourse, createCourse }) => {
    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();
    await createCourse.catalogSearch(courseName);
    await createCourse.editCourseFromListingPage();
    await createCourse.completeCourse();
});

test(`Step 6: Verify course is still associated with discount after completion`, async ({ adminHome, commercehome, discount }) => {
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.searchDiscount(discountName);
    await discount.editDiscount();
    await discount.wait("mediumWait");
    // Verify course is still associated (should NOT be disassociated)
    await discount.verifyCourseDisAssociated();
});

test.skip(`Step 7: Delete discount`, async ({ discount , adminHome, commercehome}) => {
   await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.searchDiscount(discountName);
    await discount.deleteDiscount(discountName);
    await discount.verifyDeleteDiscount(discountName);
    console.log(`✅ Step 7 Passed: Discount '${discountName}' deleted successfully`);
});

});
