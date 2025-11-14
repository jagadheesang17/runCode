import { completeEnrolledCourse } from "../../../api/courseAPI";
import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from '../../../utils/fakerUtils';


const title = FakerData.getcertificationTitle();
test.describe('CC001 - Ensure that a new certificate can be created ,Edited & Published', () => {
    test(`Ensure that a new certificate can be created successfully and edited afterward`, async ({ adminHome, CompletionCertification }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Ajay Michael` },
            { type: `TestCase`, description: `Ensure that a new certificate can be created successfully and edited afterward` },
            { type: `Test Description`, description: `Ensure that a new certificate can be created successfully and edited afterward` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCompletionCertification();
        await CompletionCertification.clickCreateCompletionCertificate();
        await CompletionCertification.verify_CompletionCertificateLabel();
        await CompletionCertification.clickTemplateType();
        await CompletionCertification.title(title);
        await CompletionCertification.designCertificate(FakerData.getDescription());
        await CompletionCertification.clickPublish();
        await CompletionCertification.clickProceed();
        await CompletionCertification.clickEditCertificate();
        await CompletionCertification.title(title);
        await CompletionCertification.designCertificate(FakerData.getDescription());
        await CompletionCertification.clickUpdate();
        await CompletionCertification.verifyCeritificateSuccessMessage();
    });



    test(`Verify whether the Published Completion Certificate are listed under published tab and verify the count`, async ({ adminHome, CompletionCertification }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `Verify whether the Published Completion Certificate are listed under published tab` },
            { type: `Test Description`, description: `Verify whether the Published Completion Certificate are listed under published tab ` }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCompletionCertification();
        await CompletionCertification.searchCompletionCertificate(title)
        await CompletionCertification.verifyPublishedCount();
    });
  
});
