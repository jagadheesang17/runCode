import { test } from "../../../../customFixtures/expertusFixture";
import { expect } from "@playwright/test";
import { FakerData } from "../../../../utils/fakerUtils";
import { credentials } from "../../../../constants/credentialData";
import { createCourseAPI as createElearningCourse } from "../../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { CostcenterPage } from "../../../../pages/CostcenterPage";


test.describe(`Verify once the training is deleted the sub-total,grand total  is been updated , Validate the Training Details & Currency Conversion`, () => {
    test.describe.configure({ mode: "serial" });
    test(`Test 1: Verify once the training is deleted the sub-total is been updated`, async ({ adminHome, enrollHome, costCenter }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `SO003_TC003 - Verify sub-total updates after training addition , deletion & Currency Conversion ` },
            { type: `Test Description`, description: `Verify once the training is deleted the sub-total is been updated  with Currency Conversion` }
        );

        //REMOVING COURSE 2 FROM THE ORDER AND VALIDATING THE SUB-TOTAL UPDATION
        const content = 'content testing-001';
        const courseName = FakerData.getCourseName();
        const courseName2 = FakerData.getCourseName();
        const courseName3 = FakerData.getCourseName();
        const price1 = "999";
        const price2 = "315";
        const price3 = "215";

        await createElearningCourse(content, courseName, "published", "single", "e-learning", price1, "eur");
        await createElearningCourse(content, courseName2, "published", "single", "e-learning", price2, "gbp");
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

        // Convert all prices to USD using exchange rates shown in admin UI
        // Rates from UI screenshot:
        // EUR -> USD = 1.0716000000
        // GBP -> USD = 1.2685500000
        // USD -> USD = 1.0
        const exchangeRates = {
            EUR_to_USD: 1.0716,
            GBP_to_USD: 1.26855,
            USD_to_USD: 1.0,
        };

        const price1Usd = parseFloat(price1) * exchangeRates.EUR_to_USD;
        const price2Usd = parseFloat(price2) * exchangeRates.GBP_to_USD;
        const price3Usd = parseFloat(price3) * exchangeRates.USD_to_USD;

        console.log(`\n💱 Currency Conversion to USD:`);
        console.log(`   Course 1 (EUR ${price1}): ${price1} × ${exchangeRates.EUR_to_USD} = $${price1Usd.toFixed(2)}`);
        console.log(`   Course 2 (GBP ${price2}): ${price2} × ${exchangeRates.GBP_to_USD} = $${price2Usd.toFixed(2)}`);
        console.log(`   Course 3 (USD ${price3}): ${price3} × ${exchangeRates.USD_to_USD} = $${price3Usd.toFixed(2)}\n`);

        const expectedTotalUsd = parseFloat((price1Usd + price2Usd + price3Usd).toFixed(2));

        const subTotal = await enrollHome.getSubTotal();
        // Use close comparison for floating point currency totals (2 decimal places)
        expect(subTotal).toBeCloseTo(expectedTotalUsd, 2);
        console.log(`✅ Sub Total validation passed (USD): ${subTotal} ≈ ${expectedTotalUsd}`);

        await enrollHome.removeSelectedCourse(courseName2);
        const updatedSubTotal = await enrollHome.getSubTotal();
        const expectedUpdatedUsd = parseFloat((price1Usd + price3Usd).toFixed(2));
        console.log(`✅ Updated Sub Total after course -${courseName2} removal  validation passed (USD): ${updatedSubTotal} ≈ ${expectedUpdatedUsd}`);
        expect(updatedSubTotal).toBeCloseTo(expectedUpdatedUsd, 2);
        await enrollHome.clickCheckoutButton();
        await costCenter.billingDetails("United States", "Alaska")
        await enrollHome.clickCalculateTaxButton();

        await costCenter.validateCourseTitle([courseName, courseName3]);
        await costCenter.validateCourseUserCount(courseName, 1);
        await costCenter.validateCourseUserCount(courseName3, 1);

        const discount = await costCenter.getDiscountValue();
        // Validate prices/totals in USD (rounded to 2 decimals)
        await costCenter.validateCoursePrice(courseName, parseFloat(price1Usd.toFixed(2)));
        await costCenter.validateCoursePrice(courseName3, parseFloat(price3Usd.toFixed(2)));
        await costCenter.validateCourseTotal(courseName, parseFloat(price1Usd.toFixed(2)));
        await costCenter.validateCourseTotal(courseName3, parseFloat(price3Usd.toFixed(2)));
        await costCenter.validateSubTotal(parseFloat((price1Usd + price3Usd).toFixed(2)));
        const grandTotal = await costCenter.validateGrandTotal(parseFloat((price1Usd + price3Usd).toFixed(2)) - discount);

        // Validate payment method visibility based on grand total
        if (grandTotal === 0 || grandTotal === 0.00 ) {
            console.log(`✅ Payment method is not visible as grand total is $0.00`);
        } else {
            await enrollHome.paymentMethod("Purchase Order");
            await costCenter.fillPaymentMethodInput();
            console.log(`✅ Payment method filled as grand total is $${grandTotal}`);
        }

        await costCenter.clickTermsandCondition();
        const orderSummaryId = await enrollHome.clickApproveOrderAndCaptureId();
        console.log(`📋 Captured Order Summary ID: ${orderSummaryId}`);
        await enrollHome.orderSuccessMsg();
    });
});