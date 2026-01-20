import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { credentials } from "../../../constants/credentialData";
import { expect } from "allure-playwright";
import { URLConstants } from "../../../constants/urlConstants";

const courseName = FakerData.getCourseName();
const discountName = FakerData.getTagNames() + " " + "EuroCurrencyDiscount";
const description = FakerData.getDescription();
const coursePrice = "500";
const discountAmountEuro = "150";
const code = "DIS-" + generateCode();
let discountValue: any;

test.describe.serial(`COM024 - Verify currency conversion for Euro discount on Dollar course`, () => {

test(`Step 1: Create fixed amount discount of €150 in Euro currency`, async ({ adminHome, commercehome, createCourse, discount, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM024 - Verify Euro discount currency conversion to Dollar` },
        { type: `Test Description`, description: `Verify €150 discount gets converted to Dollar when applied to $500 course` }
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
    discountValue = await discount.setDiscountRules("Fixed Amount Off", "Euro",discountAmountEuro);
    await discount.discountCriteria("Domain");
    console.log(`✅ Step 1 Passed: Created discount with €${discountValue} fixed amount off in Euro currency`);
    await SurveyAssessment.clickPublish();
    await createCourse.clickProceed();
});

test(`Step 2: Create paid course with $500 price in US Dollar and attach discount`, async ({ createCourse, adminHome, discount, editCourse }) => {
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
    await createCourse.clickDetailButton();
    await createCourse.typeDescription(description);
    await createCourse.clickUpdate();
    await createCourse.verifySuccessMessage();
    console.log(`✅ Step 2 Passed: Euro discount '${discountName}' attached to Dollar course`);
});

test(`Step 3: Create order and verify Euro discount converted to Dollar in order details`, async ({ adminHome, editCourse, enrollHome, costCenter }) => {
    // Define exchange rates for currency conversion
    const exchangeRates = {
        EUR_to_USD: 1.0716,
        GBP_to_USD: 1.26855,
        USD_to_USD: 1.0,
    };
    
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
    
    // Verify subtotal before checkout
    const subTotalBeforeCheckout = await enrollHome.getSubTotal();
    expect(subTotalBeforeCheckout).toBe(parseFloat(coursePrice));
    console.log(`✅ Subtotal before checkout: $${subTotalBeforeCheckout} (Original price: $${coursePrice})`);
    
    await enrollHome.clickCheckoutButton();
    const timerStatus = await enrollHome.validateTimerIsRunning();
    expect(timerStatus.isPresent).toBe(true);
    console.log(`✅ Checkout timer is running`);
    
    // Get discount value applied (should be converted to Dollar)
    const discountAmountInDollar = await costCenter.getDiscountValue();
    console.log(`✅ Discount displayed in order: $${discountAmountInDollar} (converted from €${discountValue})`);
    
    // Calculate expected discount in USD using exchange rate
    const expectedDiscountInUSD = parseFloat(discountValue) * exchangeRates.EUR_to_USD;
    console.log(`✅ Expected discount conversion: €${discountValue} × ${exchangeRates.EUR_to_USD} = $${expectedDiscountInUSD.toFixed(2)}`);
    
    // Verify currency conversion with exchange rate
    expect(discountAmountInDollar).toBeCloseTo(expectedDiscountInUSD, 2);
    console.log(`✅ Currency conversion verified: Actual $${discountAmountInDollar} matches expected $${expectedDiscountInUSD.toFixed(2)}`);
    
    await costCenter.billingDetails("United States", "Alaska");
    await enrollHome.clickCalculateTaxButton();
    await costCenter.wait("mediumWait");
    
    // Validate course details in order summary
    await costCenter.validateCourseTitle([courseName]);
    await costCenter.validateCourseUserCount(courseName, 1);
    await costCenter.validateCoursePrice(courseName, parseFloat(coursePrice));
    await costCenter.validateCourseTotal(courseName, parseFloat(coursePrice));
    
    // Validate subtotal and grand total with converted discount
    const expectedSubTotal = parseFloat(coursePrice);
    await costCenter.validateSubTotal(expectedSubTotal);
    console.log(`✅ Subtotal validated: $${expectedSubTotal}`);
    
    const expectedGrandTotal = expectedSubTotal - discountAmountInDollar;
    await costCenter.validateGrandTotal(expectedGrandTotal);
    console.log(`✅ Grand Total validated: $${expectedSubTotal} - $${discountAmountInDollar} = $${expectedGrandTotal}`);
    console.log(`✅ Currency conversion verification: €${discountValue} Euro discount applied as $${discountAmountInDollar} Dollar discount`);
    
    await enrollHome.paymentMethod("Purchase Order");
    await costCenter.fillPaymentMethodInput();
    await costCenter.clickTermsandCondition();
    const orderSummaryId = await enrollHome.clickApproveOrderAndCaptureId();
    console.log(`✅ Step 3 Passed: Order ${orderSummaryId} completed with currency-converted discount`);
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
