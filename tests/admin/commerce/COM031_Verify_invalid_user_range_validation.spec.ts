import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { expect } from "allure-playwright";

const discountName = FakerData.getTagNames() + " " + "InvalidUserRangeTest";
const description = FakerData.getDescription();
const code = "DIS-" + generateCode();

test.describe.serial(`COM031 - Verify invalid user range validation in volume discount`, () => {

test(`Step 1: Create volume discount with invalid user range (12 to 0) and verify error message`, async ({ adminHome, commercehome, createCourse, discount, page }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM031 - Verify invalid user range validation` },
        { type: `Test Description`, description: `Verify "Invalid User Range" error message is displayed when user range is set as 12 to 0 in volume discount` }
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

    // Enter invalid user range: From 12 to 0
    const userFromField = page.locator(`//input[@id='nos_from_0']`);
    await userFromField.type("12");
    console.log(`🔄 Entered 'From' user range: 12`);
    
    const userToField = page.locator(`//input[@id="nos_till_0"]`);
    await userToField.type("0");
    console.log(`🔄 Entered 'To' user range: 0`);
    
    // Trigger validation by pressing Tab
    await userToField.press('Tab');
    await discount.wait('minWait');
    
    // Verify the 'To' field has 'is-invalid' class indicating validation error
    const hasInvalidClass = await userToField.evaluate((el) => el.classList.contains('is-invalid'));
    expect(hasInvalidClass).toBe(true);
    console.log(`✅ 'To' field has 'is-invalid' class indicating invalid user range`);

    
    console.log(`✅ Step 1 Passed: System correctly prevented invalid user range (12 to 0) via field validation`);
});

});
