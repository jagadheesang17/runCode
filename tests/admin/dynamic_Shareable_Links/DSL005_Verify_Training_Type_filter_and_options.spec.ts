import { test } from "../../../customFixtures/expertusFixture";

test.describe('DSL005 - Verify Training Type filter in Dynamic Shareable Links', () => {

    const domain = "newprod";

    test("DSL005 - Verify Training Type filter and validate Certification and Learning Path options", async ({ adminHome, dynamicShareableLinks }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL005_Verify_training_type_filter_and_options' },
            { type: 'Test Description', description: 'Verify that Training Type filter is displayed and Certification and Learning Path options are displayed in Training Type dropdown when enabled in Admin Configuration' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption(domain);

        // Verify Training Type filter is displayed
        await dynamicShareableLinks.verifyTrainingTypeFilterDisplayed();

        // Click on Training Type dropdown
        await dynamicShareableLinks.clickTrainingTypeDropdown();

        // Verify Certification and Learning Path options are displayed
        const expectedTrainingTypes = [
            "Course",
            "Certification",
            "Learning Path"
        ];
        await dynamicShareableLinks.validateTrainingTypeOptions(expectedTrainingTypes);

    });

});
