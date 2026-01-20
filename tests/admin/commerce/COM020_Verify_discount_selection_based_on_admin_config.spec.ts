import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";

const courseName = FakerData.getCourseName();
const discountName = FakerData.getTagNames() + " " + "ConfigTest";
const description = FakerData.getDescription();
const price = FakerData.getPrice();
const code = "DIS-" + generateCode();
let discountValue: any;

test.describe.serial(`COM020 - Verify discount selection based on site admin configuration`, () => {

test(`Step 1: Create discount`, async ({ adminHome, commercehome, createCourse, discount, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM020 - Verify discount selection reflects site admin config` },
        { type: `Test Description`, description: `Verify whether Minimum, Maximum and Combine All will be selected based on the admin config setting` }
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

test(`Step 2: Create course`, async ({ createCourse, adminHome }) => {
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
    console.log(`✅ Step 2 Passed: Course created`);
});

test(`Step 3: Go to Site Admin and change config to "Minimum of All"`, async ({ adminHome, siteAdmin }) => {
    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.menuButton();
    await adminHome.siteAdmin();
    await adminHome.siteAdmin_Adminconfig();
    await siteAdmin.clickEditCommerce();
    await siteAdmin.selectDiscountOption("Minimum");
    console.log(`✅ Step 3 Passed: Changed config to "Minimum of All"`);
});

test(`Step 4: Reload page, go to course and verify "Minimum of All" is selected`, async ({ adminHome, createCourse, editCourse, page }) => {
    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();
    await createCourse.catalogSearch(courseName);
    await createCourse.editCourseFromListingPage();
    await createCourse.clickCourseOption("Discount");
    await editCourse.verifyDiscountDefaultSelection("Minimum");
    console.log(`✅ Step 4 Passed: "Minimum of All" verified on course`);
});

test(`Step 5: Go to Site Admin and change config to "Maximum of All"`, async ({ adminHome, siteAdmin }) => {
    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.menuButton();
    await adminHome.siteAdmin();
    await adminHome.siteAdmin_Adminconfig();
    await siteAdmin.clickEditCommerce();
    await siteAdmin.selectDiscountOption("Maximum");
    console.log(`✅ Step 5 Passed: Changed config to "Maximum of All"`);
});

test(`Step 6: Reload page, go to course and verify "Maximum of All" is selected`, async ({ adminHome, createCourse, editCourse, page }) => {
    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();
    await createCourse.catalogSearch(courseName);
    await createCourse.editCourseFromListingPage();
    await createCourse.clickCourseOption("Discount");
    await editCourse.verifyDiscountDefaultSelection("Maximum");
    console.log(`✅ Step 6 Passed: "Maximum of All" verified on course`);
});

test(`Step 7: Go to Site Admin and change config to "Combine All"`, async ({ adminHome, siteAdmin}) => {
    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.menuButton();
    await adminHome.siteAdmin();
    await adminHome.siteAdmin_Adminconfig();
    await siteAdmin.clickEditCommerce();
    await siteAdmin.selectDiscountOption("Combine All");
    console.log(`✅ Step 7 Passed: Changed config to "Combine All"`);
});

test(`Step 8: Reload page, go to course and verify "Combine All" is selected`, async ({ adminHome, createCourse, editCourse, page }) => {
    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();
    await createCourse.catalogSearch(courseName);
    await createCourse.editCourseFromListingPage();
    await createCourse.clickCourseOption("Discount");
    await editCourse.verifyDiscountDefaultSelection("Combine");
    console.log(`✅ Step 8 Passed: "Combine All" verified on course`);
});

test(`Step 9: Delete discount`, async ({ adminHome, commercehome, discount }) => {
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.searchDiscount(discountName);
    await discount.deleteDiscount(discountName);
    await discount.verifyDeleteDiscount(discountName);
    console.log(`✅ Step 9 Passed: Discount deleted`);
});

});
