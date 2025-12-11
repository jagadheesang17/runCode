import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { expect } from "allure-playwright";

const discountName = FakerData.getTagNames() + " " + "UserRange1to1Test";
const description = FakerData.getDescription();
const code = "DIS-" + generateCode();

test.describe.serial(`COM033 - Verify invalid user range validation (1 to 1) in volume discount`, () => {

test(`Step 1: Create volume discount with invalid user range (1 to 1) and verify validation`, async ({ adminHome, commercehome, createCourse, discount, page }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM033 - Verify invalid user range validation (1 to 1)` },
        { type: `Test Description`, description: `Verify validation error when user range is set as 1 to 1 in volume discount` }
    );
    
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.clickCreateDiscount();
    await discount.selectVolumeDiscount();

    await createCourse.enter("name", discountName);
    await discount.enterDiscountDescription(description);
    await createCourse.enter("code", code);
    await discount.enterValidity();
    
    // Select Percentage Off discount base
    await discount.wait('minWait');
    const discountBaseDropdown = page.locator(`//button[@data-id='discount_base']`);
    await discountBaseDropdown.click();
    await discount.wait('minWait');
    
    const percentageOffOption = page.locator(`//span[text()='Percentage Off']`);
    await percentageOffOption.click();
    await discount.wait('minWait');
    console.log(`✅ Selected 'Percentage Off' as discount base`);

    // Enter invalid user range: From 1 to 1
    const userFromField = page.locator(`//input[@id='nos_from_0']`);
    await userFromField.type("1");
    console.log(`🔄 Entered 'From' user range: 1`);
    
    const userToField = page.locator(`//input[@id="nos_till_0"]`);
    await userToField.type("1");
    console.log(`🔄 Entered 'To' user range: 1`);

    // Verify the 'To' field has 'is-invalid' class indicating validation error
    const hasInvalidClass = await userFromField.evaluate((el) => el.classList.contains('is-invalid'));
    expect(hasInvalidClass).toBe(true);
    console.log(`✅ 'from' field has 'is-invalid' class indicating invalid user range`);
    
    
    console.log(`✅ Step 1 Passed: System correctly prevented invalid user range (1 to 1) via field validation`);
    
});

});
