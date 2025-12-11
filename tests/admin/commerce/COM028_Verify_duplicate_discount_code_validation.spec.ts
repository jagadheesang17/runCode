import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { expect } from "allure-playwright";

const discountName1 = FakerData.getTagNames() + " " + "DuplicateCodeTest1";
const discountName2 = FakerData.getTagNames() + " " + "DuplicateCodeTest2";
const description = FakerData.getDescription();
const duplicateCode = "DIS-" + generateCode();

test.describe.serial(`COM028 - Verify duplicate discount code validation`, () => {

test(`Step 1: Create first discount with a unique code`, async ({ adminHome, commercehome, createCourse, discount, SurveyAssessment, page }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM028 - Verify duplicate discount code validation` },
        { type: `Test Description`, description: `Verify system should not allow to create discount with duplicate code and displays error message` }
    );
    
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.clickCreateDiscount();
    await createCourse.enter("name", discountName1);
    await discount.enterDiscountDescription(description);
    await createCourse.enter("code", duplicateCode);
    await discount.enterValidity();
    
    // Set discount rules
    const discountValue = await discount.setDiscountRules("Percentage Off", "US Dollar","10");
    console.log(`✅ Created first discount with code: ${duplicateCode}`);
    
    // Select criteria
    await discount.discountCriteria("Domain");
    
    // Save the discount
    await SurveyAssessment.clickPublish();
    await createCourse.clickProceed();
    await discount.wait('mediumWait');
    
    console.log(`✅ Step 1 Passed: First discount '${discountName1}' created successfully with code '${duplicateCode}'`);
});

test(`Step 2: Attempt to create second discount with duplicate code and verify error message`, async ({ adminHome, commercehome, createCourse, discount, SurveyAssessment, page }) => {
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.clickCreateDiscount();
    await createCourse.enter("name", discountName2);
    await discount.enterDiscountDescription(description);
    await createCourse.enter("code", duplicateCode);
    console.log(`🔄 Attempting to create second discount with duplicate code: ${duplicateCode}`);
    await discount.enterValidity();
    
    // Set discount rules
    const discountValue = await discount.setDiscountRules("Percentage Off", "US Dollar", "10");
    console.log(`✅ Created first discount with code: ${duplicateCode}`);
    
    // Select criteria
    await discount.discountCriteria("Domain");
    
    // Save the discount
    await SurveyAssessment.clickPublish();
    
    // Wait for error message to appear
    await discount.wait('mediumWait');
    
    // Verify error message is displayed
    const errorMessage = page.locator(`//span[contains(text(),'The CODE field already exists')]`);
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
    
    const errorText = await errorMessage.innerText();
    console.log(`✅ Error message displayed: "${errorText}"`);
    
    // Verify exact error message
    expect(errorText.trim()).toBe("The CODE field already exists.");
    
    console.log(`✅ Step 2 Passed: System correctly prevented duplicate code and displayed error: "The CODE field already exists."`);
});


test(`Step 4: Delete created discounts`, async ({ adminHome, commercehome, discount }) => {
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    
    // Delete first discount
    await discount.searchDiscount(discountName1);
    await discount.deleteDiscount(discountName1);
    console.log(`✅ Deleted first discount: ${discountName1}`);
    
    // Delete second discount
    await discount.searchDiscount(discountName1);
    await discount.deleteDiscount(discountName1);
    await discount.verifyDeleteDiscount(discountName1);
    console.log(`✅ Deleted second discount: ${discountName1}`);
    
    console.log(`✅ Step 4 Passed: All test discounts cleaned up`);
});

});
