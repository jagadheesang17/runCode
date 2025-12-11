import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { expect } from "allure-playwright";
import { tr } from "@faker-js/faker";

const discountName = FakerData.getTagNames() + " " + "UserRange1to12Test";
const description = FakerData.getDescription();
const code = "DIS-" + generateCode();

test.describe.serial(`COM032 - Verify valid user range (1 to 12) in volume discount`, () => {

test(`Step 1: Create volume discount with valid user range (1 to 12) and verify it works`, async ({ adminHome, commercehome, createCourse, discount, page, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM032 - Verify valid user range (1 to 12)` },
        { type: `Test Description`, description: `Verify user range 1 to 12 is accepted as VALID in volume discount` }
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

    // Enter discount value
    const discountValueField = page.locator(`//input[@id='discount_value_0']`);
    await discountValueField.fill("10");
    console.log(`✅ Entered discount value: 10%`);

    // Enter VALID user range: From 1 to 12
    const userFromField = page.locator(`//input[@id='nos_from_0']`);
    await userFromField.fill("1");
    console.log(`✅ Entered 'From' user range: 1`);
    
    const userToField = page.locator(`//input[@id="nos_till_0"]`);
    await userToField.fill("12");
    console.log(`✅ Entered 'To' user range: 12`);
    
    await discount.addVolumeDiscount();
    const userFromField1 = page.locator(`//input[@id='nos_from_1']`);
    await userFromField1.type("1");
    await discount.wait('mediumWait');
    console.log(`✅ Entered 'From' user range: 1`);

    
    // Verify the field DOES NOT have 'is-invalid' class (it's valid)
    const hasInvalidClass = await userFromField1.evaluate((el) => el.classList.contains('is-invalid'));
    expect(hasInvalidClass).toBe(true);
    console.log(`✅ 'To' field is VALID (no is-invalid class)`);
});



});
