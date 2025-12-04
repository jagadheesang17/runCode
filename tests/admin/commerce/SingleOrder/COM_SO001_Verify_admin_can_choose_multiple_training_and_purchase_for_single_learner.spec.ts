import { test } from "../../../../customFixtures/expertusFixture";
import { FakerData } from "../../../../utils/fakerUtils";
import { createCourseAPI as createElearningCourse } from "../../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { credentials } from "../../../../constants/credentialData";
import { createILTMultiInstance } from "../../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { expect } from "allure-playwright";

const course1 = FakerData.getCourseName();
const course2 = FakerData.getCourseName();

test.describe(`SO001_Verify_admin_can_choose_multiple_training_and_purchase_for_single_learner`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Test 1: Verify admin can select multiple training for single learner`, async ({ adminHome, enrollHome, costCenter, commercehome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `SO001_TC001 -Verifying Order id ` },
            { type: `Test Description`, description: `Verify admin can choose multiple training and purchase for single learner` }
        );


        console.log(`🔄 Creating 1 E-Learning ,1 ILT courses`);
        const content = 'content testing-001';
        await createElearningCourse(content, course1, "published", "single", "e-learning", "500", "usd");

        const instanceNames = await createILTMultiInstance(course2, "published", 2, "future", "200", "usd");

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickCreateOrder();
        await enrollHome.selectBycourse(course1, "paid");
        await enrollHome.selectBycourse(instanceNames[0], "paid");
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUserForSingleOrder(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickCheckoutButton();
        const timerStatus = await enrollHome.validateTimerIsRunning();
        expect(timerStatus.isPresent).toBe(true);
        expect(timerStatus.isCountingDown).toBe(true);

        await costCenter.billingDetails("United States", "Alaska")
        await enrollHome.clickCalculateTaxButton()
        await enrollHome.paymentMethod("Purchase Order");
        await costCenter.fillPaymentMethodInput();
        await costCenter.clickTermsandCondition();
        const orderSummaryId = await enrollHome.clickApproveOrderAndCaptureId();
        console.log(`📋 Captured Order Summary ID: ${orderSummaryId}`);
        await enrollHome.orderSuccessMsg();
        console.log(`✅ Order placed successfully for multiple courses for single learner`);
        console.log(`Start validating in Commerce Home`);

        await enrollHome.clickGoToOrderList();
        await commercehome.clickInvoiceButton(orderSummaryId);
        await commercehome.validateInvoice(course1);
        await commercehome.validateInvoice(instanceNames[0]);
    });

    test(`Test 2: Verify courses are available in learner's My Learning`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `SO001_TC002 Verifying the order in learner side` },
            { type: `Test Description`, description: `Verify purchased courses appear in learner's My Learning` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickMyLearning();
        await catalog.searchMyLearning(course1);
        await catalog.clickCourseInMyLearning(course1);
        await learnerHome.clickMyLearning()
        await catalog.searchMyLearning(course2);
        await catalog.clickCourseInMyLearning(course2);
        console.log(`✅ Verified purchased courses are available in learner's My Learning`);
    });

});
