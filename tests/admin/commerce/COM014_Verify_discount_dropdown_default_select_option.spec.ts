import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";

const courseName = FakerData.getCourseName();
const discountName = FakerData.getTagNames() + " " + "DefaultSelect";
const description = FakerData.getDescription();
const price = FakerData.getPrice();
const code = "DIS-" + generateCode();
let discountValue: any;

test.describe(`COM014 - Verify discount dropdown shows 'Select' as default option`, () => {
test.describe.configure({ mode: "serial" });

test(`COM014 - Step 1: Create linear discount`, async ({ adminHome, commercehome, createCourse, discount, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM014 - Create discount` },
        { type: `Test Description`, description: `Create a linear discount to test default Select option in course discount dropdown` }
    );
    
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.clickCreateDiscount();
    await createCourse.enter("name", discountName);
    await discount.enterDiscountDescription(description);
    await createCourse.enter("code", code);
    await discount.enterValidity();
    discountValue = await discount.setDiscountRules("Percentage Off", "US Dollar","30");
    console.log(`Created discount with value: ${discountValue}%`);
    await discount.discountCriteria("Domain");
    await SurveyAssessment.clickPublish();
    await createCourse.clickProceed();
    console.log(`✅ Discount '${discountName}' created successfully`);
});

test(`COM014 - Step 2: Verify 'Select' is default option in discount dropdown`, async ({ createCourse, adminHome, editCourse }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM014 - Verify default Select option` },
        { type: `Test Description`, description: `Verify that 'Select' is selected by default in Discount Base/Discount Type field when attaching discount to course` }
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
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    console.log(`✅ Paid course '${courseName}' created successfully`);
    
    // Edit course and navigate to Discount section
    await createCourse.editcourse();
    await createCourse.clickCourseOption("Discount");
    
    // Verify 'Select' is default option in discount dropdown
    await editCourse.verifyDiscountDefaultSelect();
    console.log(`✅ Verified: 'Select' is selected by default in Discount dropdown before selecting any discount`);
    
});

test(`COM014 - Step 3: Delete the discount after verification`, async ({ adminHome, commercehome, discount }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM014 - Delete discount` },
        { type: `Test Description`, description: `Delete the discount after verifying default Select option` }
    );

    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.searchDiscount(discountName);
    await discount.deleteDiscount(discountName);
    console.log(`✅ Discount '${discountName}' deleted successfully`);
});

});
