import { test } from "../../../customFixtures/expertusFixture";

test.describe('To verify whether the active Country is getting displayed in the Country filter ', () => {

    const domain = "newprod";

    test("To verify whether the active Country is getting displayed in the Country filter", async ({ adminHome, dynamicShareableLinks }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL008a_Verify_active_country_displayed' },
            { type: 'Test Description', description: 'Verify whether the active Country is getting displayed in the Country filter' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption(domain);
        await dynamicShareableLinks.verifyActiveCountryDisplayed();
    });

    test("DSL008b - Verify ILT Class with specified country filter is displayed", async ({ adminHome, dynamicShareableLinks }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL008b_Verify_ilt_class_with_country_filter' },
            { type: 'Test Description', description: 'Verify whether the ILT Class with the specified country filter is getting displayed after applying the Country filter' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption(domain);
        await dynamicShareableLinks.selectCountry("India");
        await dynamicShareableLinks.verifyILTClassWithCountryFilter();
    });

});
