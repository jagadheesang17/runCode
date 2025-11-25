import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

const title = FakerData.getRandomTitle();

test(`CNT023 - Verify whether able to delete the content when it is saved as draft using delete content button`, async ({ 
    adminHome, 
    contentHome, 
    createCourse,
    SurveyAssessment 
}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Automation Team` },
        { type: `TestCase`, description: `CNT023 - Verify whether able to delete the content when it is saved as draft using delete content button` },
        { type: `Test Description`, description: `This test verifies that content saved as draft can be successfully deleted using the delete content button` }
    );
    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.clickMenu("Content");
    await adminHome.clickCreate("Content");
    await contentHome.enter("content-title", title);
    await contentHome.enterDescription("Sample content for " + title + " - created for deletion test");
    await contentHome.uploadContent("SamplePPTX.pptx");
    await SurveyAssessment.clickSaveDraft();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    await contentHome.gotoListing();
    await contentHome.contentVisiblity(title);
    await contentHome.clickEditContentOnListing();
    await contentHome.dltFuncUpload("Are you sure you want to delete the attached content");
});
