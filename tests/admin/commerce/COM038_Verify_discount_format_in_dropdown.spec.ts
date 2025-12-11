import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { expect } from "allure-playwright";

const volumeDiscountName = FakerData.getTagNames() + " " + "VolumeDiscount";
const description = FakerData.getDescription();
const code = "DIS-" + generateCode();
const discountValue = "15";

test.describe.serial(`COM038 - Verify discount format in Select Discount dropdown`, () => {

test(`Step 1: Create Volume discount`, async ({ adminHome, commercehome, createCourse, discount, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM038 - Verify discount dropdown format` },
        { type: `Test Description`, description: `Verify discount displayed in dropdown follows format: Discount Code | Type | Value` }
    );
    
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.clickCreateDiscount();
    await discount.selectVolumeDiscount();
    await createCourse.enter("name", volumeDiscountName);
    await discount.enterDiscountDescription(description);
    await createCourse.enter("code", code);
    await discount.enterValidity();
    await discount.setDiscountRules("Percentage Off", "US Dollar", discountValue, "Volume");
    console.log(`✅ Step 1 Passed: Created Volume discount with ${discountValue}% off`);
    console.log(`   - Discount Name: ${volumeDiscountName}`);
    console.log(`   - Discount Code: ${code}`);
    console.log(`   - Type: Volume`);
    console.log(`   - Value: ${discountValue}%`);
    await SurveyAssessment.clickPublish();
    await createCourse.clickProceed();
});

test(`Step 2: Verify discount format in Select Discount dropdown`, async ({ adminHome, createCourse, page , editCourse}) => {
    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();
    await createCourse.clickCreateCourse();
    await createCourse.verifyCreateUserLabel("CREATE COURSE");
    await createCourse.enter("course-title", FakerData.getCourseName());
    await createCourse.selectLanguage("English");
    await createCourse.typeDescription(description);
    await createCourse.handleCategoryADropdown();
    await createCourse.enterPrice("100");
    await createCourse.selectCurrency();
    await createCourse.contentLibrary();
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    console.log(`✅ Course created successfully`);
    
    // Navigate to Discount section
    await createCourse.editcourse();
    await createCourse.clickCourseOption("Discount");
    await editCourse.verifyVolumeDiscounts(volumeDiscountName);
    await editCourse.verifyFormatedDiscount(code,discountValue);
    
    
});

test(`Step 3: Delete Volume discount`, async ({ adminHome, commercehome, discount }) => {
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.searchDiscount(volumeDiscountName);
    await discount.deleteDiscount(volumeDiscountName);
    console.log(`✅ Step 3 Passed: Volume discount '${volumeDiscountName}' deleted`);
});

});