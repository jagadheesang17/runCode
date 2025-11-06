import { test } from "../../../customFixtures/expertusFixture";
import { getCategoryNames } from "../../../api/apiTestIntegration/courseCreation/getMetadataAPI";

test.describe('To verify whether the active category is getting displayed & Inactive categories are hidden in the Category filter', () => {

    const domain = "newprod";
    test("DSL006 - Verify Category filter displays only active categories from metadata library", async ({ adminHome, dynamicShareableLinks }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL006_Verify_Category_Filter' },
            { type: 'Test Description', description: 'verify whether the active category is getting displayed & Inactive categories are hidden' }
        );
        const apiCategoryNames = await getCategoryNames();
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption(domain);
        await dynamicShareableLinks.verifyCategoryFilter(apiCategoryNames);
    });

});
