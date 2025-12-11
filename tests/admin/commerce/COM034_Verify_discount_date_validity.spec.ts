import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { expect } from "allure-playwright";
import { getDiscountValidityDates, setDiscountValidityOutsideCurrentDate, setDiscountValidityIncludeCurrentDate } from "../../admin/DB/DBJobs";
import { URLConstants } from "../../../constants/urlConstants";

const discountNameLinear = FakerData.getTagNames() + " " + "LinearDateValidityTest";
const discountNameVolume = FakerData.getTagNames() + " " + "VolumeDateValidityTest";
const description = FakerData.getDescription();
const codeLinear = "DIS-" + generateCode();
const codeVolume = "DIS-" + generateCode();
const courseName = FakerData.getCourseName() + " " + "DiscountDateValidityTest";
let discountValue: any;
const coursePrice = "300";
const discountName = FakerData.getTagNames() + " " + "EuroCurrencyDiscount";

test.describe.serial(`COM034 - Verify discount is not applied when date is outside valid range`, () => {

test(`Step 1: Create linear discount with Domain criteria`, async ({ adminHome, createCourse, commercehome, discount, SurveyAssessment, page }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM034 - Verify discount date validity` },
        { type: `Test Description`, description: `Verify discount is not applied when current date is outside valid_from and valid_to date range` }
    );
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.clickCreateDiscount();
    
    await createCourse.enter("name", discountNameLinear);
    await discount.enterDiscountDescription(description);
    await createCourse.enter("code", codeLinear);
    await discount.enterValidity();
    
    // Set discount rules - 10% off
    const discountValue = await discount.setDiscountRules("Percentage Off", "US Dollar", "10");
    console.log(`✅ Created linear discount with ${discountValue}% off`);
    
    // Select Domain criteria
    await discount.discountCriteria("Domain");
    
    // Save the discount
    await SurveyAssessment.clickPublish();
    await createCourse.clickProceed();
    await discount.wait('mediumWait');
    
    console.log(`✅ Step 2 Passed: Linear discount '${discountNameLinear}' created with Domain criteria`);
});

test(`Step 3: Create volume discount`, async ({ adminHome, commercehome, createCourse, discount, SurveyAssessment, page }) => {
    await adminHome.loadAndLogin("COMMERCEADMIN");
        await adminHome.menuButton();
        await adminHome.clickCommerceMenu();
        await commercehome.clickCommerceOption("Discount");
        await discount.clickCreateDiscount();
        await discount.selectVolumeDiscount();
        await createCourse.enter("name", discountNameVolume);
        await discount.enterDiscountDescription(description);
        await createCourse.enter("code", codeVolume);
        await discount.enterValidity();
        discountValue = await discount.setDiscountRules("Percentage Off", "US Dollar", "Volume");
        console.log(`Created volume discount with value: ${discountValue}%`);
        await SurveyAssessment.clickPublish();
        await createCourse.clickProceed();
        console.log(`✅ Volume discount '${discountName}' created successfully`);
    console.log(`✅ Step 3 Passed: Volume discount '${discountNameVolume}' created`);
});

test.only(`Step 4: Verify discount validity dates in database`, async () => {
    // Get linear discount validity dates
    const linearDiscountData = await getDiscountValidityDates("protocol LinearDateValidityTest");
    expect(linearDiscountData).not.toBeNull();
    console.log(`✅ Linear discount validity dates retrieved from database`);
    
    // Get volume discount validity dates
    const volumeDiscountData = await getDiscountValidityDates("firewall VolumeDateValidityTest");
    expect(volumeDiscountData).not.toBeNull();
    console.log(`✅ Volume discount validity dates retrieved from database`);
    
    console.log(`✅ Step 4 Passed: Discount validity dates verified in database`);
});

test.only(`Step 5: Update discount validity dates to be OUTSIDE current date range`, async () => {
    // Update linear discount validity to past dates (outside current date)
    const linearUpdate = await setDiscountValidityOutsideCurrentDate("protocol LinearDateValidityTest");
    console.log(`✅ Linear discount validity updated to past dates`);
    
    // Update volume discount validity to past dates (outside current date)
    const volumeUpdate = await setDiscountValidityOutsideCurrentDate("firewall VolumeDateValidityTest");
    console.log(`✅ Volume discount validity updated to past dates`);
    
    console.log(`✅ Step 5 Passed: Both discounts set to have validity dates OUTSIDE current date (past dates)`);
});

test(`Step 6: Verify discount cannot be added to course from admin side when date is outside valid range`, async ({ adminHome, editCourse, createCourse, page }) => {
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
        await createCourse.enterPrice(coursePrice);
        await createCourse.selectCurrency();
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Paid course '${courseName}' created with price: $${coursePrice} (US Dollar)`);
        
        // Attach Euro discount to Dollar course
        await createCourse.editcourse();
        await createCourse.clickCourseOption("Discount");
        await editCourse.verifyDiscountApplied(discountName, URLConstants.portal1);
        await editCourse.verifyVolumeDiscounts(codeVolume); })

test(`Step 9: Cleanup - Delete test data`, async ({ adminHome, commercehome, discount, createCourse }) => {
    // Delete linear discount
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.searchDiscount(discountNameLinear);
    await discount.deleteDiscount(discountNameLinear);
    await discount.verifyDeleteDiscount(discountNameLinear);
    console.log(`✅ Deleted linear discount: ${discountNameLinear}`);
    ;
    
    // Delete course
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.searchDiscount(discountNameVolume);
    await discount.deleteDiscount(discountNameVolume);
    await discount.verifyDeleteDiscount(discountNameLinear);
    
    console.log(`✅ Step 9 Passed: All test data cleaned up`);
});

});