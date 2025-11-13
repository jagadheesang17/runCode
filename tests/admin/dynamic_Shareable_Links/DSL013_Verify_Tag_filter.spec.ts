import { test } from "../../../customFixtures/expertusFixture";

test.describe('DSL013 - Verify Tag filter in Dynamic Shareable Links', () => {

    const domain = "newprod";

    test("DSL013a - Verify tag name displays after entering 3 letters", async ({ adminHome, dynamicShareableLinks }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL013a_Verify_tag_autocomplete_3_letters' },
            { type: 'Test Description', description: 'Verify whether the tag name is getting displayed in the filter after entering 3 letters' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption(domain);
        await dynamicShareableLinks.verifyTagFilterDisplayed();
        await dynamicShareableLinks.enterTag("Agg");
        await dynamicShareableLinks.verifyAutocompleteDisplayed();
    });

    test("DSL013b - Verify autocomplete not displayed when text does not match", async ({ adminHome, dynamicShareableLinks }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL013b_Verify_no_autocomplete_no_match' },
            { type: 'Test Description', description: 'Verify whether the autocomplete is not getting displayed when the entered text does not match any records' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption(domain);
        await dynamicShareableLinks.enterTag("Izu");
        await dynamicShareableLinks.verifyAutocompleteNotDisplayed();

    });

});
