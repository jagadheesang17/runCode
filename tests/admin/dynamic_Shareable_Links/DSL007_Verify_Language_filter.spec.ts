import { test } from "../../../customFixtures/expertusFixture";
import { getLanguageNamesByStatus } from "../../../api/apiTestIntegration/courseCreation/getMetadataAPI";

test.describe('DSL007 - Verify Language filter in Dynamic Shareable Links', () => {

    const domain = "newprod";

    test("DSL007 - Verify Language filter displays only active languages (status=1) and no inactive languages (status=0)", async ({ adminHome, dynamicShareableLinks }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL007_Verify_Language_Filter' },
            { type: 'Test Description', description: 'Verify that Language filter displays only active languages (status=1) from API and no inactive languages (status=0) are shown' }
        );

        const { activeNames, inactiveNames } = await getLanguageNamesByStatus();

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption(domain);
        await dynamicShareableLinks.verifyLanguageFilter(activeNames, inactiveNames);
    });

});
