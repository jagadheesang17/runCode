import { test } from "../../../customFixtures/expertusFixture";

test.describe('DSL018 - Verify Dynamic Shareable Links in Admin Configuration and Toggle Menu', () => {

    test("DSL018a - To verify whether the Dynamic Shareable link is getting displayed in the Admin Configuration under Course/Training plan and in the Toggle menu bar when it is enabled", async ({ adminHome, siteAdmin, learnerHome }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL019a_Verify_DSL_displayed_in_admin_config_and_toggle_menu_when_enabled' },
            { type: 'Test Description', description: 'To verify whether the Dynamic Shareable link is getting displayed in the Admin Configuration under Course/Training plan and in the Toggle menu bar when it is enabled in Admin Configuration' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await siteAdmin.adminConfiguration();
        await siteAdmin.verifyDynamicShareableLinksInAdminConfig();
        await siteAdmin.enableDynamicShareableLinks();
        await siteAdmin.page.waitForLoadState('networkidle');
        await siteAdmin.page.reload();
        await siteAdmin.page.waitForLoadState('domcontentloaded');
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.verifyDynamicShareableLinks("Enabled");
        await adminHome.dynamicShareableLinks();
    });


    test("DSL018b - To verify whether the Dynamic Shareable link is getting displayed in the Admin Configuration under Course/Training plan and is not getting displayed in the Toggle menu bar when it is disabled", async ({ adminHome, siteAdmin, learnerHome }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL019b_Verify_DSL_not_displayed_in_toggle_menu_when_disabled' },
            { type: 'Test Description', description: 'To verify whether the Dynamic Shareable link is getting displayed in the Admin Configuration under Course/Training plan and is not getting displayed in the Toggle menu bar when it is disabled in Admin Configuration' }
        );

        // Step 1: Navigate to Admin Configuration and verify Dynamic Shareable Links is displayed
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await siteAdmin.adminConfiguration();
        await siteAdmin.verifyDynamicShareableLinksInAdminConfig();
        await siteAdmin.disableDynamicShareableLinks();
        await siteAdmin.page.waitForLoadState('networkidle');
        await siteAdmin.page.reload();
        await siteAdmin.page.waitForLoadState('domcontentloaded');
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.verifyDynamicShareableLinks("Disabled");
    });

});
