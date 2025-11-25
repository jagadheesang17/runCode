import { test } from "../../../customFixtures/expertusFixture"
import { SurveyAssessmentPage } from "../../../pages/SurveyAssessmentPage";
import { FakerData } from "../../../utils/fakerUtils";

const title=FakerData.getRandomTitle();
test(`Verify whether alert message is displayed when different file type is uploaded during versioning. File type should be similar to the file uploaded in previous version`, async ({ adminHome ,contentHome,bannerHome,createCourse,SurveyAssessment}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `Upload Mp4 Content` },
        { type: `Test Description`, description: `Upload Mp4 Content` }
    );    
    await adminHome.loadAndLogin("LEARNERADMIN");
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickContentmenu();
    await contentHome.clickCreateContent();
    await contentHome.enter("content-title",title);
    await contentHome.enterDescription("Sample video content for " +title);
    await contentHome.uploadContent("samplevideo.mp4");
    await bannerHome.clickPublish();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    await contentHome.clickEditContent();
    await contentHome.clickAddVersionBtn();
    await contentHome.uploadContent("Original_recording5.mp4");
    await SurveyAssessment.clickSaveDraft();
    await contentHome.clickEditContent();
    await contentHome.verifyFieldIsDisabled("//button[text()='add version']");
    
   
})