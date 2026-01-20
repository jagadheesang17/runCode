import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { credentials } from "../../../constants/credentialData";
import { expect } from "allure-playwright";

const courseName = FakerData.getCourseName();
const discountName = FakerData.getTagNames() + " " + "TrainingDiscount";
const description = FakerData.getDescription();
const price = FakerData.getPrice();
const code = "DIS-" + generateCode();
let discountValue: any;

test.describe(`COM012 - Verify discount is applied for users when set to Training Level`, () => {
test.describe.configure({ mode: "serial" });

test(`COM012 - Step 1: Create linear discount with Training criteria`, async ({ adminHome, commercehome, createCourse, discount, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM012 - Create discount with Training Level criteria` },
        { type: `Test Description`, description: `Create a linear discount with Training criteria (not Domain or Learner Group)` }
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
    discountValue = await discount.setDiscountRules("Percentage Off");
    console.log(`Created discount with value: ${discountValue}%`);
    await discount.discountCriteria("Training");
    console.log(`✅ Set discount criteria to 'Training' level`);
    await SurveyAssessment.clickPublish();
    await createCourse.clickProceed();
    console.log(`✅ Linear discount '${discountName}' created successfully with Training Level criteria`);
});

test(`COM012 - Step 2: Create paid course and link discount at training level`, async ({ createCourse, adminHome, editCourse }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM012 - Link discount to specific training` },
        { type: `Test Description`, description: `Create paid EL course and link the discount at training level` }
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
    
    // Edit course to add discount at training level
    await createCourse.editcourse();
    await createCourse.clickCourseOption("Discount");
    await editCourse.selectDiscountOption(discountName);
    console.log(`✅ Discount '${discountName}' linked to training '${courseName}'`);
    
    await createCourse.clickDetailButton();
    await createCourse.typeDescription(description);
    await createCourse.clickUpdate();
    await createCourse.verifySuccessMessage();
    console.log(`✅ Course updated successfully with training-level discount`);
});

test(`COM012 - Step 3: Verify discount is applied when admin purchases course for learner`, async ({ adminHome, createCourse, editCourse, enrollHome, costCenter, commercehome }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM012 - Verify training-level discount application` },
        { type: `Test Description`, description: `Verify discount is applied when admin purchases the course with training-level discount for a learner` }
    );

    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.menuButton();
    await editCourse.clickEnrollments();
    console.log(`✅ Navigated to course enrollments page`);
    await enrollHome.clickEnroll();
    // Create order for single learner
    await enrollHome.selectEnrollmentOption("Create Order");
    await enrollHome.selectByOption("Course");
    await enrollHome.selectBycourse(courseName, "paid");
    await enrollHome.clickSelectedLearner();
    await enrollHome.enterSearchUserForSingleOrder(credentials.LEARNERUSERNAME.username);
    console.log(`✅ Selected learner for order creation`);

    await enrollHome.clickCheckoutButton();
    const timerStatus = await enrollHome.validateTimerIsRunning();
    expect(timerStatus.isPresent).toBe(true);
    expect(timerStatus.isCountingDown).toBe(true);
    console.log(`✅ Checkout timer is running`);

    // Verify training-level discount is applied in order summary
    await costCenter.verifyDiscountValue();
    console.log(`✅ Training-level discount verified in order summary - discount is applied for the user purchasing this specific training`);

    await costCenter.billingDetails("United States", "Alaska");
    await enrollHome.clickCalculateTaxButton();
    await enrollHome.paymentMethod("Purchase Order");
    await costCenter.fillPaymentMethodInput();
    await costCenter.clickTermsandCondition();
    const orderSummaryId = await enrollHome.clickApproveOrderAndCaptureId();
    console.log(`📋 Captured Order Summary ID: ${orderSummaryId}`);
    await enrollHome.orderSuccessMsg();
    console.log(`✅ Order placed successfully with training-level discount applied`);

    // Verify order in commerce home
    await enrollHome.clickGoToOrderList();
    await commercehome.clickInvoiceButton(orderSummaryId);
    await commercehome.validateInvoice(courseName);
    console.log(`✅ Invoice verified in commerce home - training-level discount was successfully applied`);
});

test(`COM012 - Step 4: Delete the discount after verification`, async ({ adminHome, commercehome, discount }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM012 - Delete training-level discount` },
        { type: `Test Description`, description: `Delete the discount after verifying it was applied at training level during purchase` }
    );

    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.searchDiscount(discountName);
    await discount.deleteDiscount(discountName);
    console.log(`✅ Training-level discount '${discountName}' deleted successfully`);
});

});
