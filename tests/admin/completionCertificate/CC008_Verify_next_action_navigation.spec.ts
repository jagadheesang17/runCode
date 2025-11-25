import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';

test.describe('CC008 - Verify Next Action page navigation buttons', () => {

    const title = FakerData.getcertificationTitle();

    test("CC008 - Verify next action page buttons navigate to respective screens", async ({ adminHome, CompletionCertification }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'CC008_Verify_next_action_buttons_navigation' },
            { type: 'Test Description', description: 'Verify whether the Create Completion Certificate, Edit Completion Certificate and Go To Listing page buttons are navigating to the respective screens from the next action page' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCompletionCertification();
        await CompletionCertification.clickCreateCompletionCertificate();
        
        await CompletionCertification.clickTemplateType();
        await CompletionCertification.title(title);
        await CompletionCertification.designCertificate(FakerData.getDescription());
        await CompletionCertification.clickPublish();
        await CompletionCertification.clickProceed();
        
        await CompletionCertification.clickEditCertificate();
        await CompletionCertification.verifyEditCertificatePageDisplayed();
        await CompletionCertification.designCertificate(FakerData.getDescription());
        await CompletionCertification.clickUpdate();

        await CompletionCertification.clickGoToListingPage();
        await CompletionCertification.verifyNavigatedToListingPage();
    });
});
