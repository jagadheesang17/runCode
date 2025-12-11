import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { credentials } from "../../../constants/credentialData";
import { expect } from "allure-playwright";
import { URLConstants } from "../../../constants/urlConstants";

const courseName = FakerData.getCourseName();
const volumeDiscountName = FakerData.getTagNames() + " " + "VolumeDiscount";
const percentageDiscountName = FakerData.getTagNames() + " " + "PercentageDiscount";
const description = FakerData.getDescription();
const coursePrice = "100";
const volumeDiscountAmount = "10";
const percentageDiscountValue = "10";
const volumeCode = "DIS-" + generateCode();
const percentageCode = "DIS-" + generateCode()+"1";


test.describe.serial(`COM037 - Verify Volume and Percentage discount combination with Combine ALL option`, () => {

test(`Step 1: Create Volume discount of $10`, async ({ adminHome, commercehome, createCourse, discount, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM037 - Verify Volume and Percentage discount with Combine ALL` },
        { type: `Test Description`, description: `Verify both Volume ($10) and Percentage (10%) discounts apply together using "Combine ALL" option on $100 course` }
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
    console.log(`✅ Step 1 Passed: Created Volume discount with $${volumeDiscountAmount} fixed amount off in USD currency`);
    await SurveyAssessment.clickPublish();
    await createCourse.clickProceed();
});

test(`Step 2: Create Percentage discount of 10% with single domain selection`, async ({ adminHome, commercehome, createCourse, discount, SurveyAssessment, page }) => {
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.clickCreateDiscount();
    await createCourse.enter("name", percentageDiscountName);
    await discount.enterDiscountDescription(description);
    await createCourse.enter("code", percentageCode);
    await discount.enterValidity();
    await discount.setDiscountRules("Percentage Off", "US Dollar", percentageDiscountValue);
    await discount.discountCriteria("Domain");
    
    // Select only one domain (deselect all and select first domain)
    await discount.wait('minWait');
    await page.locator(`//div[@id="discount_domain_list"]`).click();
    await discount.wait('minWait');
    
    // Get all domain options
    const allDomainOptions = await page.locator(`//div[@class="dropdown-menu show"]//li/a`).all();
    
    // Deselect all domains first (click each selected domain to deselect)
    for (const domainOption of allDomainOptions) {
        const isSelected = await domainOption.evaluate((el) => {
            return el.classList.contains('selected') || 
                   el.getAttribute('aria-selected') === 'true' ||
                   el.parentElement?.classList.contains('selected');
        });
        if (isSelected) {
            await domainOption.click();
            await discount.wait('minWait');
        }
    }
    
    // Select only the first domain
    if (allDomainOptions.length > 0) {
        await allDomainOptions[0].click();
        const selectedDomainName = await allDomainOptions[0].innerText();
        console.log(`✅ Selected only one domain: ${selectedDomainName}`);
    }
    
    // Close the dropdown
    await page.locator(`//div[@id="discount_domain_list"]`).click();
    await discount.wait('minWait');
    
    console.log(`✅ Step 2 Passed: Created Percentage discount '${percentageDiscountName}' with ${percentageDiscountValue}% off for single domain`);
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
    console.log(`✅ Volume discount '${volumeDiscountName}' applied with "Combine ALL" option`);
    
    // Attach Percentage discount to course
    await editCourse.verifyDiscountApplied(percentageDiscountName, URLConstants.portal1);
    console.log(`✅ Percentage discount '${percentageDiscountName}' applied with "Combine ALL" option selected`);
    
    await createCourse.clickDetailButton();
    await createCourse.typeDescription(description);
    await createCourse.clickUpdate();
    await createCourse.verifySuccessMessage();
    console.log(`✅ Step 3 Passed: Both Volume and Percentage discounts attached with "Combine ALL" option`);
});

test(`Step 4: Create order and verify both discounts applied - Volume $10 + Percentage 10%`, async ({ adminHome, editCourse, enrollHome, costCenter }) => {
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
    
    // Get total discount value applied (Volume + Percentage)
    const totalDiscountAmount = await costCenter.getDiscountValue();
    console.log(`✅ Total discount displayed in order: $${totalDiscountAmount}`);
    
    // Expected discount calculation:
    // Base price: $100
    // Volume discount: $10 (fixed amount)
    // Percentage discount: 10% of base price = $100 * 0.10 = $10
    // Total discount: $10 + $10 = $20
    const basePrice = parseFloat(coursePrice);
    const expectedVolumeDiscount = parseFloat(volumeDiscountAmount);
    const expectedPercentageDiscount = basePrice * (parseFloat(percentageDiscountValue) / 100);
    const expectedTotalDiscount = expectedVolumeDiscount + expectedPercentageDiscount;
    
    console.log(`✅ Expected discount breakdown:`);
    console.log(`   - Volume discount: $${expectedVolumeDiscount}`);
    console.log(`   - Percentage discount: ${percentageDiscountValue}% of base $${basePrice} = $${expectedPercentageDiscount}`);
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
    
    // Expected grand total: $100 - $10 (Volume) - $10 (Percentage) = $80
    const expectedGrandTotal = expectedSubTotal - totalDiscountAmount;
    await costCenter.validateGrandTotal(expectedGrandTotal);
    console.log(`✅ Grand Total validated: $${expectedSubTotal} - $${totalDiscountAmount} = $${expectedGrandTotal}`);
    console.log(`✅ Discount calculation verified:`);
    console.log(`   - Original price: $${coursePrice}`);
    console.log(`   - After Volume discount ($${expectedVolumeDiscount}): $${basePrice - expectedVolumeDiscount}`);
    console.log(`   - After Percentage discount ($${expectedPercentageDiscount}): $${expectedGrandTotal}`);
    
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

test(`Step 7: Delete Percentage discount`, async ({ adminHome, commercehome, discount }) => {
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.searchDiscount(percentageDiscountName);
    await discount.deleteDiscount(percentageDiscountName);
    console.log(`✅ Step 7 Passed: Percentage discount '${percentageDiscountName}' deleted`);
});

});
