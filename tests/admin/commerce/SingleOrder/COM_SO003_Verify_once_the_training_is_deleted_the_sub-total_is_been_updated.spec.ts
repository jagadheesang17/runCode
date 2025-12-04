import { test } from "../../../../customFixtures/expertusFixture";
import { expect } from "@playwright/test";
import { FakerData } from "../../../../utils/fakerUtils";
import { credentials } from "../../../../constants/credentialData";
import { createCourseAPI as createElearningCourse } from "../../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { CostcenterPage } from "../../../../pages/CostcenterPage";


test.describe(`Verify once the training is deleted the sub-total,grand total  is been updated & Validate the Training Details`, () => {
    test.describe.configure({ mode: "serial" });
    test(`Test 1: Verify once the training is deleted the sub-total is been updated`, async ({ adminHome, enrollHome, costCenter }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `SO003_TC003 - Verify sub-total updates after training addition & deletion , ` },
            { type: `Test Description`, description: `Verify once the training is deleted the sub-total is been updated` }
        );

        //REMOVING COURSE 2 FROM THE ORDER AND VALIDATING THE SUB-TOTAL UPDATION
        const content = 'content testing-001';
        const courseName = FakerData.getCourseName();
        const courseName2 = FakerData.getCourseName();
        const courseName3 = FakerData.getCourseName();
        const price1 = "999";
        const price2 = "315";
        const price3 = "215";

        await createElearningCourse(content, courseName, "published", "single", "e-learning", price1, "usd");
        await createElearningCourse(content, courseName2, "published", "single", "e-learning", price2, "usd");
        await createElearningCourse(content, courseName3, "published", "single", "e-learning", price3, "usd");

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickCreateOrder();
        await enrollHome.selectBycourse(courseName, "paid");
        await enrollHome.selectBycourse(courseName2, "paid");
        await enrollHome.selectBycourse(courseName3, "paid");
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUserForSingleOrder(credentials.LEARNERUSERNAME.username);

        const subTotal = await enrollHome.getSubTotal();
        const expectedTotal = parseInt(price1) + parseInt(price2) + parseInt(price3);
        expect(subTotal).toBe(expectedTotal);
        console.log(`✅ Sub Total validation passed: ${subTotal} = ${price1} + ${price2} + ${price3}`);

        await enrollHome.removeSelectedCourse(courseName2);
        const updatedSubTotal = await enrollHome.getSubTotal();
        console.log(`✅ Updated Sub Total after course -${courseName2} removal  validation passed: ${updatedSubTotal} = ${price1} + ${price3}`);
        expect(updatedSubTotal).toBe(parseInt(price1) + parseInt(price3));
        await enrollHome.clickCheckoutButton();
        await costCenter.billingDetails("United States", "Alaska")
        await enrollHome.clickCalculateTaxButton();
        await enrollHome.paymentMethod("Purchase Order");
        await costCenter.fillPaymentMethodInput();
        

        await costCenter.validateCourseTitle([courseName, courseName3]);
        await costCenter.validateCourseUserCount(courseName, 1);
        await costCenter.validateCourseUserCount(courseName3, 1);

        // Validate Prices and Totals for all Courses in the Order
        const discount = await costCenter.getDiscountValue();
        await costCenter.validateCoursePrice(courseName, parseFloat(price1));
        await costCenter.validateCoursePrice(courseName3, parseFloat(price3));
        await costCenter.validateCourseTotal(courseName, parseFloat(price1)); 
        await costCenter.validateCourseTotal(courseName3, parseFloat(price3));
        await costCenter.validateSubTotal(parseFloat(price1) + parseFloat(price3));
        await costCenter.validateGrandTotal(parseFloat(price1) + parseFloat(price3)- discount);
        await costCenter.clickTermsandCondition();
        const orderSummaryId = await enrollHome.clickApproveOrderAndCaptureId();
        console.log(`📋 Captured Order Summary ID: ${orderSummaryId}`);
        await enrollHome.orderSuccessMsg();
    });
});