import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';

test.describe('CC010 - Verify tab listing and counts', () => {

    const draftTitle = FakerData.getcertificationTitle();
    const unpublishedTitle = FakerData.getcertificationTitle();

    test("CC010a - Verify Saved Draft certificates listed and count displayed", async ({ adminHome, CompletionCertification }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'CC010a_Verify_saved_draft_listing_and_count' },
            { type: 'Test Description', description: 'Verify whether the Saved Draft Completion Certificate are listed under Saved draft tab and verify the count' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCompletionCertification();
        await CompletionCertification.clickCreateCompletionCertificate();
        
        await CompletionCertification.clickTemplateType();
        await CompletionCertification.title(draftTitle);
        await CompletionCertification.designCertificate(FakerData.getDescription());
        await CompletionCertification.clickSaveDraft();
        await CompletionCertification.clickProceed();
        await CompletionCertification.clickGoToListingPage();
        
        await CompletionCertification.clickSavedDraftsTab();
        await CompletionCertification.verifySavedDraftsTabActive();
        await CompletionCertification.verifySavedDraftsCount();
    });

    test("CC010b - Verify Unpublished certificates listed and count displayed", async ({ adminHome, CompletionCertification }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'CC010b_Verify_unpublished_listing_and_count' },
            { type: 'Test Description', description: 'Verify whether the Unpublished Completion Certificate are listed under unpublished tab and verify the count' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCompletionCertification();
        await CompletionCertification.clickCreateCompletionCertificate();
        
        await CompletionCertification.clickTemplateType();
        await CompletionCertification.title(unpublishedTitle);
        await CompletionCertification.designCertificate(FakerData.getDescription());
        await CompletionCertification.clickPublish();
        await CompletionCertification.clickProceed();
        await CompletionCertification.clickGoToListingPage();
        
        await CompletionCertification.searchCompletionCertificate(unpublishedTitle);
        await CompletionCertification.clickUnpublishIcon(unpublishedTitle);
        
        await CompletionCertification.clickUnpublishedTab();
        await CompletionCertification.verifyUnpublishedTabActive();
        await CompletionCertification.verifyUnpublishedCount();
    });
});
