import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';

test.describe('CC005 - Verify default Published tab and Create Completion Certificate screen', () => {

    test("CC005a - Verify Published tab is displayed by default when navigating to Completion Certificate listing page", async ({ adminHome, CompletionCertification }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'CC005a_Verify_default_published_tab' },
            { type: 'Test Description', description: 'Verify whether by default Published tab is displayed when navigating to Completion Certificate listing page' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCompletionCertification();
        await CompletionCertification.verifyCompletionCertificatePageLoad();
        await CompletionCertification.verifyPublishedTabIsActive();
        await CompletionCertification.verifyAllTabsAreVisible();
    });

    test("CC005b - Verify create Completion Certificate screen is displayed on clicking create button", async ({ adminHome, CompletionCertification }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'CC005b_Verify_create_screen_displayed' },
            { type: 'Test Description', description: 'Verify whether create Completion Certificate screen is displayed on clicking create Completion Certificate button' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCompletionCertification();
        await CompletionCertification.clickCreateCompletionCertificate();
        await CompletionCertification.verifyCreateCertificatePageDisplayed();
    });
});
