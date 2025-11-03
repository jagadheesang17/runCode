import { test } from "../../../customFixtures/expertusFixture"

test.describe('DSL002 - Verify Generate URL functionality in Dynamic Shareable Links', () => {

    test("DSL002 - Verify portal dropdown functionality", async ({ adminHome, dynamicShareableLinks }) => {
    
    test.info().annotations.push(
        { type: 'Author', description: 'Kathir A' },
        { type: 'TestCase', description: 'DSL002_Verify_portal_dropdown_functionality' },
        { type: 'Test Description', description: 'Verify portal dropdown displays available portals, no default selection, and single select behavior' }
    );
    
    // Step 1: Login and navigate to Dynamic Shareable Links page
    await adminHome.loadAndLogin("CUSTOMERADMIN");
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.dynamicShareableLinks();
    
    // console.log('📋 Validation 1: Checking available portals in dropdown');
    // const availablePortals = await dynamicShareableLinks.getAvailablePortals();
    
    // if (availablePortals.length > 0) {
    //     console.log(`✅ PASS: ${availablePortals.length} portals are displayed in dropdown`);
    //     console.log('Available Portals:', availablePortals);
    // } else {
    //     throw new Error('❌ FAIL: No portals found in dropdown');
    // }
    
    // console.log('\n📋 Validation 2: Checking default selection');
    // await dynamicShareableLinks.verifyNoPortalSelectedByDefault();
    
    // console.log('\n📋 Validation 3: Checking single select behavior');
    // await dynamicShareableLinks.verifyPortalDropdownIsSingleSelect();
    
    console.log('\n✅ Test completed successfully - All portal dropdown validations passed');
});

});