import { test } from "../../../customFixtures/expertusFixture";

test.describe('DSL017 - Verify Clear, Generate URL, Copy and Share buttons in Dynamic Shareable Links', () => {

    const domain = "newprod";

    test("DSL017 - Verify Generate URL, Copy, Share and Clear button functionality", async ({ adminHome, dynamicShareableLinks }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL017_Verify_all_action_buttons_functionality' },
            { type: 'Test Description', description: 'Verify Generate URL, Copy, Share and Clear button functionality in a single test to reduce execution time' }
        );

        // Setup: Login and navigate to Dynamic Shareable Links
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption(domain);
        
        // Apply filters to populate the form
        
        await dynamicShareableLinks.selectTrainingType("Course");
        await dynamicShareableLinks.enterTag("Agg");
        await dynamicShareableLinks.selectRating("4");
        await dynamicShareableLinks.clickGenerateURLButton();
        await dynamicShareableLinks.verifyURLGenerated();
        await dynamicShareableLinks.verifyCopyButtonDisplayed();
        await dynamicShareableLinks.clickCopyButton();
        await dynamicShareableLinks.verifyShareButtonDisplayed();
        await dynamicShareableLinks.clickClearButton();
        await dynamicShareableLinks.verifySearchInputCleared();
    });

});
