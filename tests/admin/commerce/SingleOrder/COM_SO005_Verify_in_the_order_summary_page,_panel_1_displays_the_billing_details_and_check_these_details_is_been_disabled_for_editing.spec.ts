import { test } from "../../../../customFixtures/expertusFixture";
import { expect } from "@playwright/test";
import { FakerData } from "../../../../utils/fakerUtils";
import { credentials } from "../../../../constants/credentialData";
import { createCourseAPI as createElearningCourse } from "../../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { generateOauthToken } from "../../../../api/accessToken";
import { userCreation } from "../../../../api/userAPI";
import { userCreationData } from "../../../../data/apiData/formData";


test.describe(`Verify in the order summary page, panel 1 displays the billing details and check these details is been disabled for editing`, () => {
    test.describe.configure({ mode: "serial" });
    test(`Test 1: Verify in the order summary page, panel 1 displays the billing details and check these details is been disabled for editing`, async ({ page, adminHome, enrollHome, costCenter, learnerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `SO004_TC001 - Verify  billing details and check these details is been disabled for editing` },
            { type: `Test Description`, description: `Verify in the order summary page, panel 1 displays the billing details and check these details is been disabled for editing` }
        );

        const content = 'content testing-001';
        const courseName = FakerData.getCourseName();
        const price1 = "999";

        await createElearningCourse(content, courseName, "published", "single", "e-learning", price1, "usd");
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickCreateOrder();
        await enrollHome.selectBycourse(courseName, "paid");
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUserForSingleOrder(credentials.LEARNERUSERNAME.username);

        await enrollHome.clickCheckoutButton();
        await costCenter.billingDetails("United States", "Alaska")
        await enrollHome.clickCalculateTaxButton();
        await enrollHome.paymentMethod("Purchase Order");
        await costCenter.fillPaymentMethodInput();

        await costCenter.validateBillingDetailsAreReadOnly();
        await costCenter.clickTermsandCondition();
        const orderSummaryId = await enrollHome.clickApproveOrderAndCaptureId();
        console.log(`📋 Captured Order Summary ID: ${orderSummaryId}`);
        await enrollHome.orderSuccessMsg();
    });
});