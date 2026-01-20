import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { URLConstants } from "../../../constants/urlConstants";
import { credentials } from "../../../constants/credentialData";
import { expect } from "allure-playwright";

const courseName = FakerData.getCourseName()+"Course";
const discountName = FakerData.getTagNames() + " " + "VolumeDiscount"+FakerData.getTagNames();
const description = FakerData.getDescription();
const price = FakerData.getPrice();
const code = "DIS-" + generateCode();
let discountValue: any;

test.describe(`COM009 - Verify volume discount is applied to admin for purchasing the selected training for course`, () => {
test.describe.configure({ mode: "serial" });

test(`COM009 - Step 1: Create volume discount with percentage off`, async ({ adminHome, commercehome, createCourse, discount, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM009 - Create volume discount` },
        { type: `Test Description`, description: `Create a volume discount to verify it can be added to course details page` }
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
    discountValue = await discount.setDiscountRules("Percentage Off", "US Dollar", "10", "Volume");
    console.log(`Created volume discount with value: ${discountValue}%`);
    await SurveyAssessment.clickPublish();
    await createCourse.clickProceed();
    console.log(`✅ Volume discount '${discountName}' created successfully`);
});

test(`COM009 - Step 2: Create paid course and verify volume discount can be added`, async ({ createCourse, adminHome, editCourse }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM009 - Verify volume discount in course details` },
        { type: `Test Description`, description: `Create paid EL course and verify volume discount can be added in course details page` }
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
    
    // Edit course to verify volume discount can be added
    await createCourse.editcourse();
    await createCourse.clickCourseOption("Discount");
    
    // Select and apply volume discount to the course
    await editCourse.selectDiscountOption(discountName, "Minimum");
    console.log(`✅ Volume discount '${discountName}' selected and 'Minimum of All' option applied`);
    
    // Verify volume discount is visible after selection
    await editCourse.verifyVolumeDiscount(code);
    console.log(`✅ Volume discount '${discountName}' verified successfully in course details page`);

    
    // Save the course with volume discount
    await createCourse.clickDetailButton();
    await createCourse.typeDescription(description);
    await createCourse.clickUpdate();
    await createCourse.verifySuccessMessage();
    console.log(`✅ Course updated successfully with volume discount '${discountName}'`);
});

test(`COM009 - Step 3: Verify admin can purchase course with volume discount applied`, async ({ adminHome, createCourse, editCourse, enrollHome, costCenter, commercehome }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM009 - Admin purchase with volume discount verification` },
        { type: `Test Description`, description: `Verify volume discount is applied when admin purchases the course for a learner` }
    );

    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.menuButton();
    await editCourse.clickEnrollmentMenu();
    await enrollHome.clickEnroll();
    console.log(`✅ Navigated to course enrollments page`);

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

    // Verify volume discount is applied in order summary
    await costCenter.verifyDiscountValue();
    console.log(`✅ Volume discount verified in order summary`);

    await costCenter.billingDetails("United States", "Alaska");
    await enrollHome.clickCalculateTaxButton();
    await costCenter.wait("mediumWait");
    await costCenter.clickTermsandCondition();

    //await costCenter.clickTermsandCondition();
    // await enrollHome.paymentMethod("Purchase Order");
    // await costCenter.fillPaymentMethodInput();
    const orderSummaryId = await enrollHome.clickApproveOrderAndCaptureId();
    console.log(`📋 Captured Order Summary ID: ${orderSummaryId}`);
    await enrollHome.orderSuccessMsg();
    console.log(`✅ Order placed successfully with volume discount applied`);

    // Verify order in commerce home
    await enrollHome.clickGoToOrderList();
    await commercehome.clickInvoiceButton(orderSummaryId);
    await commercehome.validateInvoice(courseName);
    console.log(`✅ Invoice verified in commerce home for course: ${courseName}`);
});

test(`COM009 - Step 4: Delete the volume discount after verification`, async ({ adminHome, commercehome, discount }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM009 - Delete volume discount` },
        { type: `Test Description`, description: `Delete the volume discount after verifying it was applied during admin purchase` }
    );

    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.searchDiscount(discountName);
    await discount.deleteDiscount(discountName);
    await discount.verifyDeleteDiscount(discountName);
    console.log(`✅ Volume discount '${discountName}' deleted successfully`);
});

});
