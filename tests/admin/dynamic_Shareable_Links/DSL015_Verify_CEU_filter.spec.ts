import { test } from "../../../customFixtures/expertusFixture";

test.describe('DSL015 - Verify CEU filter in Dynamic Shareable Links', () => {

    const domain = "newprod";

    test("DSL015a - Verify CEU filter is displayed", async ({ adminHome, dynamicShareableLinks }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL015a_Verify_ceu_filter_displayed' },
            { type: 'Test Description', description: 'Verify whether the CEU filter is getting displayed in the Dynamic Share Link page' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption(domain);
        await dynamicShareableLinks.verifyCEUFilterDisplayed();
    });

    // test("DSL015b - Verify CEU filter is displayed when CEU is ON in Admin Configuration", async ({ adminHome, dynamicShareableLinks }) => {
        
    //     test.info().annotations.push(
    //         { type: 'Author', description: 'Kathir A' },
    //         { type: 'TestCase', description: 'DSL015b_Verify_ceu_filter_when_on' },
    //         { type: 'Test Description', description: 'Verify whether the CEU filter is getting displayed when CEU is ON in Admin Configuration' }
    //     );

    //     await adminHome.loadAndLogin("CUSTOMERADMIN");
    //     await adminHome.menuButton();
    //     await adminHome.clickLearningMenu();
    //     await adminHome.dynamicShareableLinks();
    //     await dynamicShareableLinks.selectDomainOption(domain);
    //     await dynamicShareableLinks.verifyCEUFilterDisplayed();
    // });

    

    // test("DSL015c - Verify CEU is displayed to learner based on admin selection", async ({ adminHome, dynamicShareableLinks }) => {
        
    //     test.info().annotations.push(
    //         { type: 'Author', description: 'Kathir A' },
    //         { type: 'TestCase', description: 'DSL015c_Verify_ceu_displayed_to_learner' },
    //         { type: 'Test Description', description: 'Verify whether the CEU is displayed to the learner based on the selection of the Admin' }
    //     );

    //     await adminHome.loadAndLogin("CUSTOMERADMIN");
    //     await adminHome.menuButton();
    //     await adminHome.clickLearningMenu();
    //     await adminHome.dynamicShareableLinks();
    //     await dynamicShareableLinks.selectDomainOption(domain);
    //     await dynamicShareableLinks.selectCEUCheckbox();
    //     const generatedURL = await dynamicShareableLinks.clickGenerateURL();
    //     await dynamicShareableLinks.openGeneratedURL(generatedURL);
    //     await dynamicShareableLinks.verifyCEUDisplayedToLearner();
    // });

});
