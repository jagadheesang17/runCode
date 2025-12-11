import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { credentials } from "../../../constants/credentialData";
import { expect } from "allure-playwright";
import { URLConstants } from "../../../constants/urlConstants";

const courseName = FakerData.getCourseName();
const discountName = FakerData.getTagNames() + " " + "FixedAmountDiscount";
const description = FakerData.getDescription();
const price = "100";
const code = "DIS-" + generateCode();
let discountValue: any;

test.describe.serial(`COM023 - Verify fixed amount off discount calculation with $100 course`, () => {

test(`Step 1: Create linear discount with $10 fixed amount off`, async ({ adminHome, commercehome, createCourse, discount, SurveyAssessment , costCenter}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM023 - Verify $10 fixed amount discount on $100 course` },
        { type: `Test Description`, description: `Verify $10 fixed amount discount deducts $10 from $100 course, resulting in $90 grand total` }
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
    discountValue = await discount.setDiscountRules("Fixed Amount Off", "US Dollar", "10");
    await discount.discountCriteria("Domain");
    console.log(`✅ Step 1 Passed: Created linear discount with $${discountValue} fixed amount off`);
    await SurveyAssessment.clickPublish();
    await createCourse.clickProceed();
});

test(`Step 2: Create paid course with $100 price and attach discount`, async ({ createCourse, adminHome, discount, editCourse }) => {
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
    console.log(`✅ Paid course '${courseName}' created with price: $${price}`);
    
    // Attach discount to training
    await createCourse.editcourse();
    await createCourse.clickCourseOption("Discount");
    await editCourse.verifyDiscountApplied(discountName, URLConstants.portal1);
    await createCourse.clickDetailButton();
    await createCourse.typeDescription(description);
    await createCourse.clickUpdate();
    await createCourse.verifySuccessMessage();
    console.log(`✅ Step 2 Passed: Discount '${discountName}' attached to course`);
});

test(`Step 3: Create order and verify discount calculation`, async ({ adminHome, editCourse, enrollHome, costCenter }) => {
    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.menuButton();
    await editCourse.clickEnrollmentMenu();
    await enrollHome.clickEnroll();
    
    // Create order
    await enrollHome.selectEnrollmentOption("Create Order");
    await enrollHome.selectByOption("Course");
    await enrollHome.selectBycourse(courseName, "paid");
    await enrollHome.clickSelectedLearner();
    await enrollHome.enterSearchUserForSingleOrder(credentials.LEARNERUSERNAME.username);
    console.log(`✅ Selected course '${courseName}' for learner`);
    
    // Verify subtotal before checkout (should show original price)
    const subTotalBeforeCheckout = await enrollHome.getSubTotal();
    expect(subTotalBeforeCheckout).toBe(parseFloat(price));
    console.log(`✅ Subtotal before checkout: $${subTotalBeforeCheckout} (Original price: $${price})`);
    
    await enrollHome.clickCheckoutButton();
    const timerStatus = await enrollHome.validateTimerIsRunning();
    expect(timerStatus.isPresent).toBe(true);
    console.log(`✅ Checkout timer is running`);
    
    // Get discount value applied
    const discountAmount = await costCenter.getDiscountValue();
    console.log(`✅ Discount displayed: $${discountAmount}`);
    
    // Verify fixed amount discount is applied correctly
    expect(discountAmount).toBe(parseFloat(discountValue));
    console.log(`✅ Fixed amount discount verified: $${discountValue} deducted`);
    
    await costCenter.billingDetails("United States", "Alaska");
    await enrollHome.clickCalculateTaxButton();
    await costCenter.wait("mediumWait");
    
    // Validate course details in order summary
    await costCenter.validateCourseTitle([courseName]);
    await costCenter.validateCourseUserCount(courseName, 1);
    await costCenter.validateCoursePrice(courseName, parseFloat(price));
    await costCenter.validateCourseTotal(courseName, parseFloat(price));
    
    // Validate subtotal and grand total
    const expectedSubTotal = parseFloat(price);
    await costCenter.validateSubTotal(expectedSubTotal);
    console.log(`✅ Subtotal validated: $${expectedSubTotal}`);
    
    const expectedGrandTotal = expectedSubTotal - discountAmount;
    await costCenter.validateGrandTotal(expectedGrandTotal);
    console.log(`✅ Grand Total validated: $${expectedSubTotal} - $${discountAmount} = $${expectedGrandTotal}`);
    
    await enrollHome.paymentMethod("Purchase Order");
    await costCenter.fillPaymentMethodInput();
    await costCenter.clickTermsandCondition();
    const orderSummaryId = await enrollHome.clickApproveOrderAndCaptureId();
    console.log(`✅ Step 3 Passed: Order ${orderSummaryId} completed with correct discount calculation`);
});

test(`Step 4: Verify enrolled course is available in learner's My Learning`, async ({ learnerHome, catalog }) => {
    await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
    await learnerHome.clickMyLearning();
    await catalog.searchMyLearning(courseName);
    await catalog.clickCourseInMyLearning(courseName);
    await catalog.verifyStatus("Enrolled");
    console.log(`✅ Step 4 Passed: Course '${courseName}' verified in My Learning with 'Enrolled' status`);
});

test(`Step 5: Delete discount`, async ({ adminHome, commercehome, discount }) => {
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.searchDiscount(discountName);
    await discount.deleteDiscount(discountName);
    console.log(`✅ Step 5 Passed: Discount '${discountName}' deleted`);
});

});
