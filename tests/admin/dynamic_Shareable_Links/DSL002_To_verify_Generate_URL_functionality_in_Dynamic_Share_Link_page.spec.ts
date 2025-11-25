import { test } from "../../../customFixtures/expertusFixture"

test.describe('DSL002 - Verify portal dropdown functionality in Dynamic Shareable Links', () => {

    test("DSL002a - To verify that no portals will be selected by default ", async ({ adminHome, dynamicShareableLinks }) => {
    
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL002a_Verify_no_portal_default_selection' },
            { type: 'Test Description', description: 'Verify that no portal is selected by default in the portal dropdown' }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        
        console.log('\n🔍 Testing: No portal selected by default');
        await dynamicShareableLinks.verifyNoPortalSelectedByDefault();
    });

    test("DSL002b - To verify whether the portal dropdown acts as a Single select dropdown", async ({ adminHome, dynamicShareableLinks }) => {
    
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL002b_Verify_portal_single_select' },
            { type: 'Test Description', description: 'Verify that the portal dropdown acts as a single select dropdown (not multi-select)' }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        
        console.log('\n🔍 Testing: Portal dropdown is single select');
        await dynamicShareableLinks.verifyPortalDropdownIsSingleSelect();
        console.log(' Verified - Portal dropdown is single select');
    });

    test("DSL002c - To verify whether the available portals are getting displayed in the portal dropdown", async ({ adminHome, dynamicShareableLinks }) => {
    
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL002c_Verify_available_portals' },
            { type: 'Test Description', description: 'Verify that available portals are displayed in the portal dropdown' }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.validatePortals();
        
        
        });
    });


