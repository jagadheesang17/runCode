import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from '../../../utils/fakerUtils';



const title = FakerData.getcertificationTitle();
test(`Verify whether the edit access push-box is opened when "No,Modify the Access" button is clicked`, async ({ adminHome, CompletionCertification }) => {

        test.info().annotations.push(   
    { type: `Author`, description: `Kathir A` },
    { type: `TestCase`, description: `Verify whether the edit access push-box is opened when "No,Modify the Access" button is clicked` },
    { type: `Test Description`, description: `Verify whether the edit access push-box is opened when "No,Modify the Access" button is clicked` }
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
    await CompletionCertification.clickModifyAccess();
    await CompletionCertification.verifyEditAccessPushBox();
});

