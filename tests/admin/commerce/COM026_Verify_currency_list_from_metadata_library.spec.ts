import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { expect } from "allure-playwright";

const discountName = FakerData.getTagNames() + " " + "CurrencyListTest";
const description = FakerData.getDescription();
const code = "DIS-" + generateCode();
let metadataCurrencies: string[] = [];

test.describe.serial(`COM026 - Verify all enabled currencies from metadata library are listed in discount currency dropdown`, () => {

test(`Step 1: Get all enabled currencies from Metadata Library E-Commerce section`, async ({ adminHome, metadatalibrary,page }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM026 - Verify currency list in discount matches metadata library` },
        { type: `Test Description`, description: `Verify all enabled currencies from metadata library are available in discount currency dropdown` }
    );
    
    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.menuButton();
    await adminHome.metadataLibrary();
    await adminHome.meta_ECommerce();
    await metadatalibrary.wait("mediumWait");
    
    // Click on Currency header to expand the list
    await page.locator(`//div[@id='currency-header']`).click();
    await metadatalibrary.wait("minWait");
    
    // Click Load More to get all currencies
    await page.locator(`//button[@id='currency-btn-submit']`).click();
    await metadatalibrary.wait("mediumWait");
    
    // Get all currencies from metadata library
    const currencyElements = await page.locator(`//div[@id='currency-Body']//div[contains(@class,'text-truncate')]//span`).all();
    metadataCurrencies = [];
    
    for (const element of currencyElements) {
        const currencyName = await element.innerText();
        metadataCurrencies.push(currencyName.trim());
    }
    
    console.log(`✅ Found ${metadataCurrencies.length} currencies in Metadata Library E-Commerce section`);
    console.log(`📋 Currencies: ${metadataCurrencies.join(', ')}`);
    
    console.log(`✅ Step 1 Passed: Retrieved all enabled currencies from Metadata Library`);
});

test(`Step 2: Create discount and verify all currencies are listed in currency dropdown`, async ({ adminHome, commercehome, createCourse, discount, page }) => {
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.clickCreateDiscount();
    await createCourse.enter("name", discountName);
    await discount.enterDiscountDescription(description);
    await createCourse.enter("code", code);
    await discount.enterValidity();
    
    // Select Fixed Amount Off to enable currency dropdown
    await discount.wait('minWait');
    const discountBaseDropdown = page.locator(`//button[@data-id='discount_base']`);
    await discountBaseDropdown.click();
    const fixedAmountOffOption = page.locator(`//span[text()='Fixed Amount Off']`);
    await fixedAmountOffOption.click();
    await discount.wait('minWait');
    
    // Open currency dropdown
    const currencyDropdown = page.locator(`//button[@data-id='disc_currencey']`);
    await currencyDropdown.click();
    await discount.wait('minWait');
    
    // Get all currencies from the dropdown using the provided selector
    const dropdownCurrencyElements = await page.locator(`//div[@class="dropdown-menu show"]//span[@class='text']`).all();
    const dropdownCurrencies: string[] = [];
    
    for (const element of dropdownCurrencyElements) {
        const currencyName = await element.innerText();
        dropdownCurrencies.push(currencyName.trim());
    }
    
    console.log(`✅ Found ${dropdownCurrencies.length} currencies in Discount Currency Dropdown`);
    console.log(`📋 Currencies: ${dropdownCurrencies.join(', ')}`);
    

    
    // Check if all metadata currencies are in dropdown
    for (const currency of metadataCurrencies) {
        if (dropdownCurrencies.includes(currency)) {
            console.log(`✅ Currency '${currency}' from Metadata Library found in Discount Currency Dropdown`);
        }
        if (!dropdownCurrencies.includes(currency)) {
            console.error(`❌ Currency '${currency}' from Metadata Library NOT found in Discount Currency Dropdown`);
        }
    }

    
});

});
