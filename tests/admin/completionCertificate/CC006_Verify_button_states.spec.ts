import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';

test.describe('CC006 - Verify button states based on field input', () => {

    const title = FakerData.getcertificationTitle();

    test("CC006a - Verify Discard and Save Draft buttons enabled when title is given", async ({ adminHome, CompletionCertification }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'CC006a_Verify_buttons_enabled_with_title' },
            { type: 'Test Description', description: 'Verify whether discard and save draft buttons are enabled when title is given' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCompletionCertification();
        await CompletionCertification.clickCreateCompletionCertificate();
        await CompletionCertification.title(title);
        await CompletionCertification.verifyDiscardAndSaveDraftEnabled();
    });

    test("CC006b - Verify all buttons enabled when mandatory fields are filled", async ({ adminHome, CompletionCertification }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'CC006b_Verify_all_buttons_enabled_with_mandatory_fields' },
            { type: 'Test Description', description: 'Verify whether discard, save draft and publish buttons are enabled only when all the mandatory fields are given' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCompletionCertification();
        await CompletionCertification.clickCreateCompletionCertificate();
        
        await CompletionCertification.clickTemplateType();
        await CompletionCertification.title(title);
        await CompletionCertification.designCertificate(FakerData.getDescription());
        await CompletionCertification.verifyAllButtonsEnabledAfterMandatoryFields();
    });

    test("CC006c - Verify navigation to listing page when Discard button is clicked", async ({ adminHome, CompletionCertification }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'CC006c_Verify_discard_navigation' },
            { type: 'Test Description', description: 'Verify whether the page is navigated to listing page when discard button is clicked from the edit completion certificate page' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCompletionCertification();
        await CompletionCertification.clickCreateCompletionCertificate();
        await CompletionCertification.title(title);
        await CompletionCertification.clickDiscard();
        await CompletionCertification.verifyNavigatedToListingPage();
    });
});
