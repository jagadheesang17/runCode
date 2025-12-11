import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { expect } from "allure-playwright";

const discountName = FakerData.getTagNames() + " " + "CurrencyFieldTest";
const description = FakerData.getDescription();
const code = "DIS-" + generateCode();

test.describe.serial(`COM025 - Verify currency field enabled only for Fixed Amount Off discount`, () => {

test(`Step 1: Verify currency field is disabled for Percentage Off discount type`, async ({ adminHome, commercehome, createCourse, discount, page }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM025 - Verify currency field availability` },
        { type: `Test Description`, description: `Verify currency field is enabled only when Fixed Amount Off is selected` }
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
    
    // Select Percentage Off discount type
    await discount.wait('minWait');
    const discountBaseDropdown = page.locator(`//button[@data-id='discount_base']`);
    await discountBaseDropdown.click();
    const percentageOffOption = page.locator(`//span[text()='Percentage Off']`);
    await percentageOffOption.click();
    await discount.wait('minWait');
    
    // Verify currency field is disabled/not visible for Percentage Off
    const currencyDropdown = page.locator(`//button[@data-id='disc_currencey']`);
    const isCurrencyVisible = await currencyDropdown.isVisible();
    const isCurrencyEnabled = isCurrencyVisible ? await currencyDropdown.isEnabled() : false;
    
    if (isCurrencyVisible) {
        expect(isCurrencyEnabled).toBe(false);
        console.log(`✅ Step 1 Passed: Currency field is visible but DISABLED for Percentage Off discount type`);
    } else {
        expect(isCurrencyVisible).toBe(false);
        console.log(`✅ Step 1 Passed: Currency field is NOT visible for Percentage Off discount type`);
    }
});



});
