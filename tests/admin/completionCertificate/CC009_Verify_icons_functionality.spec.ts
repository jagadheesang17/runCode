import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';

test.describe('CC009 - Verify Publish, Clone, Edit and Delete icons functionality', () => {

    const title = FakerData.getcertificationTitle();

    test("CC009a - Verify publish icon publishes certificate from Saved Drafts tab", async ({ adminHome, CompletionCertification }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'CC009a_Verify_publish_from_saved_drafts' },
            { type: 'Test Description', description: 'Verify whether publish icon from Saved Drafts tab publishes the certificate successfully' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCompletionCertification();
        await CompletionCertification.clickCreateCompletionCertificate();
        
        await CompletionCertification.clickTemplateType();
        await CompletionCertification.title(title);
        await CompletionCertification.designCertificate(FakerData.getDescription());
        await CompletionCertification.clickSaveDraft();

        await CompletionCertification.clickProceed();
        await CompletionCertification.clickGoToListingPage();
        await CompletionCertification.clickSavedDraftsTab();
        await CompletionCertification.searchCompletionCertificate(title);
        await CompletionCertification.clickPublishIcon(title);
        await CompletionCertification.clickPublishedTab();
        await CompletionCertification.searchCompletionCertificate(title);
        await CompletionCertification.verifyPublishedCount();

    });

    test("CC009b - Verify clone icon creates a copy of certificate", async ({ adminHome, CompletionCertification }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'CC009b_Verify_clone_functionality' },
            { type: 'Test Description', description: 'Verify whether edit Completion Certificate page is opened and a copy of Completion Certificate is created when clone icon is clicked' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCompletionCertification();
        await CompletionCertification.clickPublishedTab();
        await CompletionCertification.searchCompletionCertificate(title);
        await CompletionCertification.clickCloneIcon(title);
        await CompletionCertification.verifyEditCertificatePageDisplayed();
    });

});
