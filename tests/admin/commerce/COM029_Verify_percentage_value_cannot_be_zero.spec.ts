import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { expect } from "allure-playwright";

const discountName = FakerData.getTagNames() + " " + "ZeroPercentageTest";
const description = FakerData.getDescription();
const code = "DIS-" + generateCode();

test.describe.serial(`COM029 - Verify percentage value cannot be zero validation`, () => {

test(`Step 1: Create discount with 0% and verify error message`, async ({ adminHome, commercehome, createCourse, discount, page }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM029 - Verify percentage value cannot be zero` },
        { type: `Test Description`, description: `Verify "Percentage Value Cannot be Zero" error message is displayed when 0 value is applied in Percentage Off discount` }
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
    await discount.wait('minWait');
    
    const percentageOffOption = page.locator(`//span[text()='Percentage Off']`);
    await percentageOffOption.click();
    await discount.wait('minWait');
    console.log(`✅ Selected 'Percentage Off' as discount base`);
    
    // Enter 0 value in the discount value field
    await page.locator("//input[@id=\"disc_value\"]").type("0");
    console.log(`🔄 Entered 0 value in percentage discount field`);
    
    // Verify error message is displayed
    const errorMessage = page.locator(`//span[contains(text(),'Percentage Value Cannot be Zero') or contains(text(),'Percentage Value Cannot be zero')]`);
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
    
    const errorText = await errorMessage.innerText();
    console.log(`✅ Error message displayed: "${errorText}"`);
    
    // Verify the exact error message
    expect(errorText.trim()).toContain("Percentage Value Cannot be Zero");
    
    console.log(`✅ Step 1 Passed: System correctly prevented zero percentage and displayed error: "Percentage Value Cannot be Zero"`);

});

});