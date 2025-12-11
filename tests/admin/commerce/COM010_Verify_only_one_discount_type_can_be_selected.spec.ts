import { test } from "../../../customFixtures/expertusFixture";

test.describe.configure({ mode: "serial" });

test(`COM010 - Verify admin can select only one discount type (Linear or Volume)`, async ({ adminHome, commercehome, discount }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM010 - Verify mutual exclusivity of discount types` },
        { type: `Test Description`, description: `Verify that admin can select only one discount type - either Linear or Volume, not both simultaneously` }
    );
    
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.clickCreateDiscount();
    
    // Step 1: Verify Linear discount is selected by default
    await discount.verifyLinearDiscountSelected();
    console.log("✅ Step 1: Linear discount is selected by default when creating new discount");
    
    // Step 2: Select Volume discount and verify Linear is automatically deselected
    await discount.selectVolumeDiscount();
    await discount.verifyVolumeDiscountSelected();
    console.log("✅ Step 2: Volume discount is selected and Linear is automatically deselected");
    
    // Step 3: Select Linear discount again and verify Volume is automatically deselected
    await discount.selectLinearDiscount();
    await discount.verifyLinearDiscountSelected();
    console.log("✅ Step 3: Linear discount is selected and Volume is automatically deselected");
    
    // Step 4: Switch back to Volume to confirm mutual exclusivity works both ways
    await discount.selectVolumeDiscount();
    await discount.verifyVolumeDiscountSelected();
    console.log("✅ Step 4: Volume discount is selected again, confirming mutual exclusivity");
    
    console.log("✅ Test Passed: Admin can only select ONE discount type at a time (Linear OR Volume)");
});
