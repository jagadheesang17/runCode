import { test } from "../../../customFixtures/expertusFixture";

test.describe('DSL009 - Verify Location filter in Dynamic Shareable Links', () => {

    const domain = "newprod";

    test("DSL009 - Verify location filter displays autocomplete when text matches", async ({ adminHome, dynamicShareableLinks }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL009_Verify_location_filter_autocomplete' },
            { type: 'Test Description', description: 'Verify that the location filter is getting displayed and displays the autocomplete box when the text matches' }
        );
        const location = "Eco";
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption(domain);
        await dynamicShareableLinks.searchLocation(location);
        await dynamicShareableLinks.verifyLocationFilterWithAutocomplete(location);
    });
});
