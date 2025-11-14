import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';

test.describe('CC007 - Verify Domain selection and Modify Access functionality', () => {

    
    const domain = "newprod";

    test("CC007a - Verify able to select and unselect domains from domain dropdown", async ({ adminHome, CompletionCertification }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'CC007a_Verify_domain_select_unselect' },
            { type: 'Test Description', description: 'Verify whether able to select and unselect the domains from the domain drop-down' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCompletionCertification();
        await CompletionCertification.clickCreateCompletionCertificate();
        await CompletionCertification.clickDomain();
        await CompletionCertification.selectDomain(domain);
        await CompletionCertification.unselectDomain(domain);
        await CompletionCertification.selectDomain(domain);
    });

    test("CC007b - Verify certificate saved with default access when Yes Proceed is clicked", async ({ adminHome, CompletionCertification ,createCourse}) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'CC007b_Verify_save_with_default_access' },
            { type: 'Test Description', description: 'Verify whether the Completion Certificate is saved as draft/published with the default access when "Yes,Proceed" button is clicked' }
        );
        const title = FakerData.getcertificationTitle();
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCompletionCertification();
        await CompletionCertification.clickCreateCompletionCertificate();
        await CompletionCertification.clickTemplateType();
        await CompletionCertification.title(title);
        await CompletionCertification.designCertificate(FakerData.getDescription());
        await CompletionCertification.clickPublish();
        await CompletionCertification.verifyModifyAccessModalDisplayed();
        await CompletionCertification.clickProceed();
        await CompletionCertification.verifyPublishSuccessMessage(title);
    });

    test("CC007c - Verify edit access push-box opens when No Modify Access is clicked", async ({ adminHome, CompletionCertification }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'CC007c_Verify_edit_access_pushbox_opens' },
            { type: 'Test Description', description: 'Verify whether the edit access push-box is opened when "No,Modify the Access" button is clicked' }
        );
        const title = FakerData.getcertificationTitle();
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCompletionCertification();
        await CompletionCertification.clickCreateCompletionCertificate();
        await CompletionCertification.clickTemplateType();
        await CompletionCertification.title(title);
        await CompletionCertification.designCertificate(FakerData.getDescription());
        await CompletionCertification.clickPublish();
        await CompletionCertification.clickModifyAccess();
        await CompletionCertification.verifyEditAccessPushBox();
    });
});
