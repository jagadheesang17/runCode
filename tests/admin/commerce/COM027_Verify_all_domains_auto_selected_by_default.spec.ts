import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { expect } from "allure-playwright";

const discountName = FakerData.getTagNames() + " " + "DomainAutoSelectTest";
const description = FakerData.getDescription();
const code = "DIS-" + generateCode();
let discountValue: string[];
test.describe.serial(`COM027 - Verify all domains are auto-selected by default in discount criteria`, () => {

test(`Step 1: Create discount and verify all domains are auto-selected by default`, async ({ adminHome, commercehome, createCourse, discount, page }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM027 - Verify default domain selection` },
        { type: `Test Description`, description: `Verify all domains are auto-selected by default when Domain is selected as discount criteria` }
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
    
    // Set discount rules
    const discountPercentage = await discount.setDiscountRules("Percentage Off", "US Dollar", "10");
    console.log(`✅ Created discount with ${discountPercentage}% off`);
    
    // Select Domain as criteria level
    await discount.wait('minWait');
    const criteriaTypeDropdown = page.locator(`//button[@data-id='criteria_type_name']`);
    await criteriaTypeDropdown.click();
    await discount.wait('minWait');
    
    const domainOption = page.locator(`//span[text()='Domain']`);
    await domainOption.click();
    await discount.wait('mediumWait');
    
    console.log(`✅ Selected 'Domain' as discount criteria`);
    
    // Get all domain options from dropdown
    await page.locator(`//div[@id="discount_domain_list"]`).click();
    await discount.wait('minWait');
    const allDomainOptions = await page.locator(`//div[@class="dropdown-menu show"]//li/a`).all();
    
    // Get discountValue from the dropdown options
    discountValue = await Promise.all(allDomainOptions.map(opt => opt.innerText()));
    console.log(`📋 Total domains found in dropdown: ${allDomainOptions.length}`);
    console.log(`📋 Total domains from page: ${discountValue.length}`);
    
    // Check each domain option
    const selectedDomains: string[] = [];
    const unselectedDomains: string[] = [];
    const matchedDomains: string[] = [];
    const unmatchedDomains: string[] = [];
    
    for (let i = 0; i < allDomainOptions.length; i++) {
        const domainOption = allDomainOptions[i];
        const domainLabel = (await domainOption.innerText()).trim();
        
        // Check if domain is selected (has 'selected' class or aria-selected attribute)
        const isSelected = await domainOption.evaluate((el) => {
            return el.classList.contains('selected') || 
                   el.getAttribute('aria-selected') === 'true' ||
                   el.parentElement?.classList.contains('selected');
        });
        
        // Check if domain is selected
        if (isSelected) {
            selectedDomains.push(domainLabel);
        } else {
            unselectedDomains.push(domainLabel);
        }
        
        // Compare with discountValue array
        if (discountValue.includes(domainLabel)) {
            matchedDomains.push(domainLabel);
            console.log(`✅ Domain "${domainLabel}" - Selected: ${isSelected}, Found in page list: Yes`);
        } else {
            unmatchedDomains.push(domainLabel);
            console.log(`⚠️ Domain "${domainLabel}" - Selected: ${isSelected}, Found in page list: No`);
        }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`✅ Selected domains: ${selectedDomains.length}`);
    console.log(`❌ Unselected domains: ${unselectedDomains.length}`);
    console.log(`✅ Matched domains (in both lists): ${matchedDomains.length}`);
    console.log(`⚠️ Unmatched domains: ${unmatchedDomains.length}`);

    // Compare discountValue with allDomainOptions count
    expect(discountValue.length).toBe(allDomainOptions.length);
    console.log(`✅ Domain count matches: Page list (${discountValue.length}) = Options (${allDomainOptions.length})`);
    
    // Verify all domains are selected
    expect(selectedDomains.length).toBe(allDomainOptions.length);
    expect(unselectedDomains.length).toBe(0);
    
    // Verify all domains match
    expect(matchedDomains.length).toBe(discountValue.length);
    expect(unmatchedDomains.length).toBe(0);
    
    console.log(`✅ Step 1 Passed: All ${selectedDomains.length} domains are auto-selected and match with page list`);

});

});
