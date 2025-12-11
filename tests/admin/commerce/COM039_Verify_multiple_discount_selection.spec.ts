import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { expect } from "allure-playwright";

const courseName = FakerData.getCourseName();
const linearDiscountName = FakerData.getTagNames() + " " + "LinearDiscount";
const trainingDiscount2Name = FakerData.getTagNames() + " " + "TrainingDiscount2";
const volumeDiscountName = FakerData.getTagNames() + " " + "VolumeDiscount";
const description = FakerData.getDescription();
const linearCode = "DIS-" + generateCode();
const trainingCode2 = "DIS-" + generateCode() + "1";
const volumeCode = "DIS-" + generateCode() + "2";
const linearDiscountValue = "10";
const trainingDiscountValue2 = "20";
const volumeDiscountValue = "15";

test.describe.serial(`COM040 - Verify multiple discount selection and Training level discounts display`, () => {

test(`Step 1: Create first Linear discount at Training level`, async ({ adminHome, commercehome, createCourse, discount, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM040 - Verify multiple discount selection and Training level discounts` },
        { type: `Test Description`, description: `Verify admin can select multiple discounts and all Training level discounts appear in dropdown` }
    );
    
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.clickCreateDiscount();
    await createCourse.enter("name", linearDiscountName);
    await discount.enterDiscountDescription(description);
    await createCourse.enter("code", linearCode);
    await discount.enterValidity();
    await discount.setDiscountRules("Fixed Amount Off", "US Dollar", linearDiscountValue);
    await discount.discountCriteria("Training");
    console.log(`✅ Step 1 Passed: Created Linear discount at Training level`);
    console.log(`   - Name: ${linearDiscountName}`);
    console.log(`   - Code: ${linearCode}`);
    console.log(`   - Type: Linear (Fixed Amount Off)`);
    console.log(`   - Value: $${linearDiscountValue}`);
    console.log(`   - Criteria: Training`);
    await SurveyAssessment.clickPublish();
    await createCourse.clickProceed();
});

test(`Step 3: Create Volume discount at Domain level`, async ({ adminHome, commercehome, createCourse, discount, SurveyAssessment }) => {
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.clickCreateDiscount();
    await discount.selectVolumeDiscount();
    await createCourse.enter("name", volumeDiscountName);
    await discount.enterDiscountDescription(description);
    await createCourse.enter("code", volumeCode);
    await discount.enterValidity();
    await discount.setDiscountRules("Percentage Off", "US Dollar", volumeDiscountValue, "Volume");
    console.log(`✅ Step 3 Passed: Created Volume discount`);
    console.log(`   - Name: ${volumeDiscountName}`);
    console.log(`   - Code: ${volumeCode}`);
    console.log(`   - Type: Volume`);
    console.log(`   - Value: ${volumeDiscountValue}%`);
    console.log(`   - Criteria: Domain`);
    await SurveyAssessment.clickPublish();
    await createCourse.clickProceed();
});

test(`Step 4: Verify all Training level discounts appear in Select Discount dropdown`, async ({ adminHome, createCourse, page, editCourse }) => {
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
    await createCourse.enterPrice("100");
    await createCourse.selectCurrency();
    await createCourse.contentLibrary();
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    await createCourse.editcourse(); 
    await createCourse.clickCourseOption("Discount");
    console.log(`✅ Course '${courseName}' created with price: $100`);
    await editCourse.selectDiscountOption(linearCode, "Combine");
    await editCourse.page.reload();
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();
    await createCourse.catalogSearch(courseName);
    await createCourse.editCourseFromListingPage();
    await createCourse.clickCourseOption("Discount");
    await editCourse.selectDiscountOption(volumeCode, "Combine");
    
    
    
});

test(`Step 5: Delete first Training discount`, async ({ adminHome, commercehome, discount }) => {
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.searchDiscount(linearDiscountName);
    await discount.deleteDiscount(linearDiscountName);
    console.log(`✅ First Training discount '${linearDiscountName}' deleted`);
});

test(`Step 7: Delete Volume discount`, async ({ adminHome, commercehome, discount }) => {
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.searchDiscount(volumeDiscountName);
    await discount.deleteDiscount(volumeDiscountName);
    console.log(`✅ Step 7 Passed: Volume discount '${volumeDiscountName}' deleted`);
});

});
