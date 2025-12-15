import { test } from "../../../../customFixtures/expertusFixture";
import { expect } from "@playwright/test";
import { FakerData } from "../../../../utils/fakerUtils";
import { credentials } from "../../../../constants/credentialData";
import { createCourseAPI as createElearningCourse } from "../../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { generateOauthToken } from "../../../../api/accessToken";
import { userCreation } from "../../../../api/userAPI";
import { userCreationData } from "../../../../data/apiData/formData";

let userName = FakerData.getUserId();
let access_token: any;
let createdUserId: any;

test.describe(`Verify when clicking on the terms and conditions it opens the uploaded pdf in the new tab`, () => {
    test.describe.configure({ mode: "serial" });
    test(`Test 1: Verify when clicking on the terms and conditions it opens the uploaded pdf in the new tab`, async ({ page, adminHome, enrollHome, costCenter, learnerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `SO004_TC001 - Verify terms and conditions PDF opens in new tab` },
            { type: `Test Description`, description: `Verify when clicking on the terms and conditions it opens the uploaded pdf in the new tab` }
        );
        access_token = await generateOauthToken();
        createdUserId = await userCreation(userCreationData(userName), { Authorization: access_token });

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
        await enrollHome.enterSearchUserForSingleOrder(userName);
        await enrollHome.clickCheckoutButton();
        await costCenter.billingDetails("United States", "Alaska")
        await enrollHome.clickCalculateTaxButton();

        const grandTotal = await costCenter.validateGrandTotal();
        
        const newTab = await costCenter.clickTermsAndConditionLink();
        await expect(newTab).toHaveURL(/\.pdf$/);

        await page.bringToFront();
        await costCenter.handlePaymentMethodBasedOnGrandTotal(grandTotal);
        await costCenter.clickTermsandCondition();
        const orderSummaryId = await enrollHome.clickApproveOrderAndCaptureId();
        console.log(`📋 Captured Order Summary ID: ${orderSummaryId}`);
        await enrollHome.orderSuccessMsg();
    });
}); 