import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { URLConstants } from "../../../constants/urlConstants";

const courseName = FakerData.getCourseName();
const discountName = FakerData.getTagNames() + " " + "AutoDiscount";
const description = FakerData.getDescription();
const price = FakerData.getPrice();
const code = "DIS-" + generateCode();
let discountValue: any;

test.describe.configure({ mode: "serial" });

test(`COM008 - Step 1: Create linear discount with percentage off`, async ({ adminHome, commercehome, createCourse, discount, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM008 - Create discount for auto-apply verification` },
        { type: `Test Description`, description: `Create a linear discount that will be auto-applied to course` }
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
    discountValue = await discount.setDiscountRules("Percentage Off", "US Dollar");
    console.log(`Created discount with value: ${discountValue}%`);
    await discount.discountCriteria("Domain");
    await SurveyAssessment.clickPublish();
    await createCourse.clickProceed();
});

test(`COM008 - Step 2: Create paid course and link discount`, async ({ createCourse, adminHome, editCourse }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM008 - Create course with discount` },
        { type: `Test Description`, description: `Create paid EL course and configure discount to auto-apply` }
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
    
    // Edit course to add discount
    await createCourse.editcourse();
    await createCourse.clickCourseOption("Discount");
    await editCourse.verifyDiscountApplied(discountName, URLConstants.portal1);
    await createCourse.clickDetailButton();
    await createCourse.typeDescription(description);
    await createCourse.clickUpdate();
    await createCourse.verifySuccessMessage();
});

test.only(`COM008 - Step 3: Delete the discount after verification`, async ({ adminHome, commercehome, discount }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM008 - Delete discount` },
        { type: `Test Description`, description: `Delete the discount after verifying it was auto-applied to the course` }
    );

    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.searchDiscount(discountName);
    await discount.deleteDiscount(discountName);
    await discount.verifyDeleteDiscount(discountName); 
});

