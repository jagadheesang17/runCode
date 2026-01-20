import { test } from "../../../../customFixtures/expertusFixture";
import { FakerData } from "../../../../utils/fakerUtils";
import { createCourseAPI as createElearningCourse } from "../../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { credentials } from "../../../../constants/credentialData";
import { createILTMultiInstance } from "../../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { expect } from "allure-playwright";

const courseName = FakerData.getCourseName();
const learningPathName = "LP " + FakerData.getCourseName();
const description = FakerData.getDescription();
const price = "4567";

test.describe(`SO006_Verify_admin_can_choose_Learning path_purchase_for_single_learner`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Test 1: Verify admin can select Learning Path training for single learner`, async ({ adminHome, enrollHome, costCenter, commercehome, learningPath, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `SO006_TC001 -Verifying Order id ` },
            { type: `Test Description`, description: `Verify admin can choose Learning Path and purchase for single learner` }
        );


        console.log(`🔄 Creating 1 E-Learning ,1 ILT courses`);
        const content = 'content testing-001';
        await createElearningCourse(content, courseName, "published", "single", "e-learning");
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
        await learningPath.title(learningPathName);
        await learningPath.language();
        await learningPath.description(description);
        await learningPath.enterPrice(price);
        await learningPath.clickCurrency();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        console.log(`✅ Learning Path created: ${learningPathName}`);


        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        console.log(`✅ Added ILT course to learning path: ${courseName}`);
        // Publish the learning path
        await learningPath.clickDetailTab();
        await learningPath.description(description);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Learning Path published successfully`);

        await learningPath.clickEditLearningPath();
        await editCourse.clickEnrollments();
        await enrollHome.selectEnrollmentOption("Create Order");


        await enrollHome.selectByOption("Learning Path");
        await enrollHome.selectBycourse(learningPathName, "paid");
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUserForSingleOrder(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickCheckoutButton();
        const timerStatus = await enrollHome.validateTimerIsRunning();
        expect(timerStatus.isPresent).toBe(true);
        expect(timerStatus.isCountingDown).toBe(true);

        await costCenter.billingDetails("United States", "Alaska")
        await enrollHome.clickCalculateTaxButton()
        const grandTotal = await costCenter.validateGrandTotal();
        await costCenter.handlePaymentMethodBasedOnGrandTotal(grandTotal);
        await costCenter.clickTermsandCondition();
        const orderSummaryId = await enrollHome.clickApproveOrderAndCaptureId();
        console.log(`📋 Captured Order Summary ID: ${orderSummaryId}`);
        await enrollHome.orderSuccessMsg();
        console.log(`✅ Order placed successfully for multiple courses for single learner`);
        console.log(`Start validating in Commerce Home`);

        await enrollHome.clickGoToOrderList();
        await commercehome.clickInvoiceButton(orderSummaryId);
        await commercehome.validateInvoice(learningPathName);
    });

    test(`Test 2: Verify courses are available in learner's My Learning`, async ({ learnerHome, catalog, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `SO001_TC002 Verifying the order in learner side` },
            { type: `Test Description`, description: `Verify purchased courses appear in learner's My Learning` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.searchCertification(learningPathName);
        await dashboard.verifyTheEnrolledCertification(learningPathName);
        console.log(`✅ Verified purchased courses are available in learner's My Learning`);
    });

});
