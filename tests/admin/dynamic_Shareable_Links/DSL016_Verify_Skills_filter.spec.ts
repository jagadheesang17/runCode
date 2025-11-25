import { test } from "../../../customFixtures/expertusFixture";

test.describe('DSL016 - Verify Skills filter in Dynamic Shareable Links', () => {

    const domain = "newprod";

    test("DSL016a - Verify Skills filter is displayed", async ({ adminHome, dynamicShareableLinks }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL016a_Verify_skills_filter_displayed' },
            { type: 'Test Description', description: 'Verify whether the Skills filter is getting displayed in the Dynamic Share Link page' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption(domain);
        await dynamicShareableLinks.verifySkillsFilterDisplayed();
    });

    // test("DSL016b - Verify Skills filter is displayed when Skills is ON in Admin Configuration", async ({ adminHome, dynamicShareableLinks }) => {
        
    //     test.info().annotations.push(
    //         { type: 'Author', description: 'Kathir A' },
    //         { type: 'TestCase', description: 'DSL016b_Verify_skills_filter_when_on' },
    //         { type: 'Test Description', description: 'Verify whether the Skills filter is getting displayed when Skills is ON in Admin Configuration' }
    //     );

    //     await adminHome.loadAndLogin("CUSTOMERADMIN");
    //     await adminHome.menuButton();
    //     await adminHome.clickLearningMenu();
    //     await adminHome.dynamicShareableLinks();
    //     await dynamicShareableLinks.selectDomainOption(domain);
    //     await dynamicShareableLinks.verifySkillsFilterDisplayed();
    // });

    // test("DSL016c - Verify Skills is displayed to learner based on admin selection", async ({ adminHome, dynamicShareableLinks }) => {
        
    //     test.info().annotations.push(
    //         { type: 'Author', description: 'Kathir A' },
    //         { type: 'TestCase', description: 'DSL016c_Verify_skills_displayed_to_learner' },
    //         { type: 'Test Description', description: 'Verify whether the Skills is displayed to the learner based on the selection of the Admin' }
    //     );

    //     await adminHome.loadAndLogin("CUSTOMERADMIN");
    //     await adminHome.menuButton();
    //     await adminHome.clickLearningMenu();
    //     await adminHome.dynamicShareableLinks();
    //     await dynamicShareableLinks.selectDomainOption(domain);
    //     await dynamicShareableLinks.selectSkillsCheckbox();
    //     const generatedURL = await dynamicShareableLinks.clickGenerateURL();
    //     await dynamicShareableLinks.openGeneratedURL(generatedURL);
    //     await dynamicShareableLinks.verifySkillsDisplayedToLearner();
    // });

});
