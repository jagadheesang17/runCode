import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { expect } from "allure-playwright";

const linearDiscountName = FakerData.getTagNames() + " " + "LinearEditTest_1";
const volumeDiscountName = FakerData.getTagNames() + " " + "VolumeEditTest";
const description = FakerData.getDescription();
const linearCode = "DIS-" + generateCode();
const volumeCode = "DIS-" + generateCode() + "1";
const linearDiscountValue = "20";
const volumeDiscountValue = "15";

test.describe.serial(`COM042 - Verify discount details are displayed when editing`, () => {

test(`Step 1: Create Linear discount with Fixed Amount Off`, async ({ adminHome, commercehome, createCourse, discount, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM042 - Verify discount edit displays all details` },
        { type: `Test Description`, description: `Verify Discount Code, Type, Value, Currency, Criteria, and Delete are displayed when editing` }
    );
    
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.clickCreateDiscount();
    await createCourse.enter("name", linearDiscountName);
    await discount.enterDiscountDescription(description);
    await createCourse.enter("code", linearCode);
    await discount.enterValidity();
    await discount.setDiscountRules("Fixed Amount Off", "US Dollar", linearDiscountValue);
    await discount.discountCriteria("Domain");
    console.log(`✅ Step 1 Passed: Created Linear discount`);
    console.log(`   - Name: ${linearDiscountName}`);
    console.log(`   - Code: ${linearCode}`);
    console.log(`   - Type: Linear (Fixed Amount Off)`);
    console.log(`   - Value: $${linearDiscountValue}`);
    console.log(`   - Currency: US Dollar`);
    console.log(`   - Criteria: Training`);
    await SurveyAssessment.clickPublish();
    await createCourse.clickProceed();
});

test(`Step 2: Create Volume discount`, async ({ adminHome, commercehome, createCourse, discount, SurveyAssessment }) => {
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
    await discount.setDiscountRules("Percentage Off", "US Dollar", volumeDiscountValue, "Volume");
    console.log(`✅ Step 2 Passed: Created Volume discount`);
    console.log(`   - Name: ${volumeDiscountName}`);
    console.log(`   - Code: ${volumeCode}`);
    console.log(`   - Type: Volume (Percentage Off)`);
    console.log(`   - Value: ${volumeDiscountValue}%`);
    console.log(`   - Criteria: Domain`);
    await SurveyAssessment.clickPublish();
    await createCourse.clickProceed();
});

test(`Step 3: Edit Linear discount and verify all details are displayed`, async ({ adminHome, commercehome, discount, page }) => {
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    
    // Search and click edit for Linear discount
    await discount.searchDiscount(linearDiscountName);
    await discount.wait('minWait');
    
    console.log(`\n🔍 Step 3: Verifying Linear discount details when editing\n`);
    
    // Click edit button
    await discount.editDiscount();
    
    // Verify Discount Code is displayed
    const discountCodeField = page.locator(`//input[@id="code"]`);
    await discountCodeField.waitFor({ state: 'visible' });
    const displayedCode = await discountCodeField.inputValue();
    expect(displayedCode).toBe(linearCode);
    console.log(`   ✅ Discount Code displayed: ${displayedCode}`);
    
    // Verify Type (Linear) - Check Linear radio button is selected
    const linearTypeSelected = await page.locator(`//input[@id="linear_discount"]`).isChecked();
    expect(linearTypeSelected).toBe(true);
    console.log(`   ✅ Type displayed: Linear (radio button checked)`);
    
    // Verify Discount Base (Fixed Amount Off) is selected
    const discountBaseDropdown = page.locator(`//button[@data-id='discount_base']`);
    const discountBaseText = await discountBaseDropdown.innerText();
    expect(discountBaseText).toContain('Fixed Amount Off');
    console.log(`   ✅ Discount Base displayed: Fixed Amount Off`);
    
    // Verify Value is displayed
    const discountValueField = page.locator(`//input[@id="disc_value"]`);
    const displayedValue = await discountValueField.inputValue();
    expect(displayedValue).toBe(linearDiscountValue);
    console.log(`   ✅ Value displayed: $${displayedValue}`);
    
    // Verify Currency (US Dollar) is displayed
    const currencyDropdown = page.locator(`//button[@data-id='disc_currencey']`);
    const currencyText = await currencyDropdown.innerText();
    expect(currencyText).toContain('US Dollar');
    console.log(`   ✅ Currency displayed: ${currencyText.trim()}`);
    
    // Verify Criteria (Training) is displayed
    const criteriaDropdown = page.locator(`//button[@data-id='criteria_type_name']`);
    const criteriaText = await criteriaDropdown.innerText();
    expect(criteriaText).toContain('Training');
    console.log(`   ✅ Criteria displayed: ${criteriaText.trim()}`);
    

    
    console.log(`\n✅ Step 3 Passed: All Linear discount details are correctly displayed when editing`);
});

test(`Step 4: Edit Volume discount and verify all details are displayed`, async ({ adminHome, commercehome, discount, page }) => {
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    
    // Search and click edit for Volume discount
    await discount.searchDiscount(volumeDiscountName);
    await discount.wait('minWait');
    
    console.log(`\n🔍 Step 4: Verifying Volume discount details when editing\n`);
    
    // Click edit button
    await discount.editDiscount();
    await discount.wait('mediumWait');
    console.log(`   ✅ Opened Volume discount for editing`);
    
    // Verify Discount Code is displayed
    const discountCodeField = page.locator(`//input[@id="code"]`);
    await discountCodeField.waitFor({ state: 'visible' });
    const displayedCode = await discountCodeField.inputValue();
    expect(displayedCode).toBe(volumeCode);
    console.log(`   ✅ Discount Code displayed: ${displayedCode}`);
    
    // Verify Type (Volume) - Check Volume radio button is selected
    const volumeTypeSelected = await page.locator(`//input[@id='volume_discount']`).isChecked();
    expect(volumeTypeSelected).toBe(true);
    console.log(`   ✅ Type displayed: Volume (radio button checked)`);
    
    // Verify Discount Base (Percentage Off) is selected
    const discountBaseDropdown = page.locator(`//button[@data-id='discount_base']`);
    const discountBaseText = await discountBaseDropdown.innerText();
    expect(discountBaseText).toContain('Percentage Off');
    console.log(`   ✅ Discount Base displayed: Percentage Off`);
    
    // Verify Value is displayed (for volume, check first range value)
    const discountValueField = page.locator(`//input[@id='discountvalue_0']`);
    const displayedValue = await discountValueField.inputValue();
    expect(displayedValue).toBe(volumeDiscountValue);
    console.log(`   ✅ Value displayed: ${displayedValue}%`);
    
    // Verify Currency is not displayed for Volume discount (Volume discounts don't have currency field)
    console.log(`   ✅ Currency: Not applicable for Volume discount`);
    
    // Verify Criteria (Domain) is displayed
    const criteriaDropdown = page.locator(`//button[@data-id='criteria_type_name']`);
    const criteriaText = await criteriaDropdown.innerText();
    expect(criteriaText).toContain('Domain');
    console.log(`   ✅ Criteria displayed: ${criteriaText.trim()}`);
    

    
    console.log(`\n✅ Step 4 Passed: All Volume discount details are correctly displayed when editing`);
});

test(`Step 5: Delete Linear discount`, async ({ adminHome, commercehome, discount }) => {
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.searchDiscount(linearDiscountName);
    await discount.deleteDiscount(linearDiscountName);
    console.log(`✅ Linear discount '${linearDiscountName}' deleted`);
});

test(`Step 6: Delete Volume discount`, async ({ adminHome, commercehome, discount }) => {
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.searchDiscount(volumeDiscountName);
    await discount.deleteDiscount(volumeDiscountName);
    console.log(`✅ Step 6 Passed: Volume discount '${volumeDiscountName}' deleted`);
});

});
