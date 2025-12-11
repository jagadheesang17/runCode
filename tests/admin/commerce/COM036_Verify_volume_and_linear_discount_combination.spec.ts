import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { credentials } from "../../../constants/credentialData";
import { expect } from "allure-playwright";
import { URLConstants } from "../../../constants/urlConstants";

const courseName = FakerData.getCourseName();
const volumeDiscountName = FakerData.getTagNames() + " " + "VolumeDiscount";
const linearDiscountName = FakerData.getTagNames() + " " + "LinearDiscount";
const description = FakerData.getDescription();
const coursePrice = "100";
const volumeDiscountAmount = "10";
const linearDiscountAmount = "10";
const volumeCode = "DIS-" + generateCode();
const linearCode = "DIS-" + generateCode()+"1";


test.describe.serial(`COM036 - Verify Volume and Linear discount combination with Combine ALL option`, () => {

test(`Step 1: Create Volume discount of $10`, async ({ adminHome, commercehome, createCourse, discount, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM036 - Verify Volume and Linear discount with Combine ALL` },
        { type: `Test Description`, description: `Verify both Volume ($10) and Linear ($10) discounts apply together using "Combine ALL" option on $100 course` }
    );
    
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
    await discount.setDiscountRules("Fixed Amount Off", "US Dollar", volumeDiscountAmount ,"Volume");
    console.log(`✅ Step 1 Passed: Created discount with $${volumeDiscountAmount} fixed amount off in USD currency`);
    await SurveyAssessment.clickPublish();
    await createCourse.clickProceed();
});

test(`Step 2: Create Linear (Fixed Amount) discount of $10`, async ({ adminHome, commercehome, createCourse, discount, SurveyAssessment }) => {
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.clickCreateDiscount();
    await createCourse.enter("name", linearDiscountName);
    await discount.enterDiscountDescription(description);
    await createCourse.enter("code", linearCode);
    await discount.enterValidity();
    await discount.setDiscountRules("Fixed Amount Off", "US Dollar", linearDiscountAmount);
    await discount.discountCriteria("Domain");
    console.log(`✅ Step 2 Passed: Created Linear discount '${linearDiscountName}' with $${linearDiscountAmount} fixed amount off`);
    await SurveyAssessment.clickPublish();
    await createCourse.clickProceed();
});

test(`Step 3: Create paid course with $100 price and attach both discounts`, async ({ createCourse, adminHome, discount, editCourse }) => {
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
    console.log(`✅ Paid course '${courseName}' created with price: $${coursePrice}`);
    
    // Attach Volume discount to course
    await createCourse.editcourse();
    await createCourse.clickCourseOption("Discount");
    await editCourse.selectDiscountOption(volumeDiscountName, "Combine");
    // Attach Linear discount to course and select "Combine ALL" option
    await editCourse.verifyDiscountApplied(linearDiscountName, URLConstants.portal1);
    console.log(`✅ Linear discount '${linearDiscountName}' applied with "Combine ALL" option selected`);
    
    await createCourse.clickDetailButton();
    await createCourse.typeDescription(description);
    await createCourse.clickUpdate();
    await createCourse.verifySuccessMessage();
    console.log(`✅ Step 3 Passed: Both Volume and Linear discounts attached with "Combine ALL" option`);
});

test(`Step 4: Create order and verify both discounts applied - Volume $10 + Linear $10`, async ({ adminHome, editCourse, enrollHome, costCenter }) => {
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
    
    // Get total discount value applied (Volume + Linear)
    const totalDiscountAmount = await costCenter.getDiscountValue();
    console.log(`✅ Total discount displayed in order: $${totalDiscountAmount}`);
    
    // Expected total discount: Volume ($10) + Linear ($10) = $20
    const expectedVolumeDiscount = parseFloat(volumeDiscountAmount);
    const expectedLinearDiscount = parseFloat(linearDiscountAmount);
    const expectedTotalDiscount = expectedVolumeDiscount + expectedLinearDiscount;
    
    console.log(`✅ Expected discount breakdown:`);
    console.log(`   - Volume discount: $${expectedVolumeDiscount}`);
    console.log(`   - Linear discount: $${expectedLinearDiscount}`);
    console.log(`   - Total discount: $${expectedTotalDiscount}`);
    
    // Verify total discount matches expected
    expect(totalDiscountAmount).toBeCloseTo(expectedTotalDiscount, 2);
    console.log(`✅ Both discounts verified: Actual $${totalDiscountAmount} matches expected $${expectedTotalDiscount}`);
    
    await costCenter.billingDetails("United States", "Alaska");
    await enrollHome.clickCalculateTaxButton();
    await costCenter.wait("mediumWait");
    
    // Validate course details in order summary
    await costCenter.validateCourseTitle([courseName]);
    await costCenter.validateCourseUserCount(courseName, 1);
    await costCenter.validateCoursePrice(courseName, parseFloat(coursePrice));
    await costCenter.validateCourseTotal(courseName, parseFloat(coursePrice));
    
    // Validate subtotal and grand total with both discounts
    const expectedSubTotal = parseFloat(coursePrice);
    await costCenter.validateSubTotal(expectedSubTotal);
    console.log(`✅ Subtotal validated: $${expectedSubTotal}`);
    
    // Expected grand total: $100 - $10 (Volume) - $10 (Linear) = $80
    const expectedGrandTotal = expectedSubTotal - totalDiscountAmount;
    await costCenter.validateGrandTotal(expectedGrandTotal);
    console.log(`✅ Grand Total validated: $${expectedSubTotal} - $${totalDiscountAmount} = $${expectedGrandTotal}`);
    console.log(`✅ Discount calculation verified:`);
    console.log(`   - Original price: $${coursePrice}`);
    console.log(`   - After Volume discount ($${expectedVolumeDiscount}): $${parseFloat(coursePrice) - expectedVolumeDiscount}`);
    console.log(`   - After Linear discount ($${expectedLinearDiscount}): $${expectedGrandTotal}`);
    
    await enrollHome.paymentMethod("Purchase Order");
    await costCenter.fillPaymentMethodInput();
    await costCenter.clickTermsandCondition();
    const orderSummaryId = await enrollHome.clickApproveOrderAndCaptureId();
    console.log(`✅ Step 4 Passed: Order ${orderSummaryId} completed with both discounts applied`);
});

test(`Step 5: Verify enrolled course is available in learner's My Learning`, async ({ learnerHome, catalog }) => {
    await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
    await learnerHome.clickMyLearning();
    await catalog.searchMyLearning(courseName);
    await catalog.clickCourseInMyLearning(courseName);
    await catalog.verifyStatus("Enrolled");
    console.log(`✅ Step 5 Passed: Course '${courseName}' verified in My Learning with 'Enrolled' status`);
});

test(`Step 6: Delete Volume discount`, async ({ adminHome, commercehome, discount }) => {
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.searchDiscount(volumeDiscountName);
    await discount.deleteDiscount(volumeDiscountName);
    console.log(`✅ Volume discount '${volumeDiscountName}' deleted`);
});

test(`Step 7: Delete Linear discount`, async ({ adminHome, commercehome, discount }) => {
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.searchDiscount(linearDiscountName);
    await discount.deleteDiscount(linearDiscountName);
    console.log(`✅ Step 7 Passed: Linear discount '${linearDiscountName}' deleted`);
});

});
