import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

const title=FakerData.getRandomTitle();
test(`Verify whether the replaced file is displayed in the preview once saved`, async ({ adminHome ,contentHome,bannerHome,createCourse,SurveyAssessment}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `Verify whether the replaced file is displayed in the preview once saved` },
        { type: `Test Description`, description: `Verify whether the replaced file is displayed in the preview once saved` }
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
    await contentHome.dltFuncUpload("Are you sure you want to delete the attached content");
    await contentHome.uploadContent("Original_recording5.mp4");
    await bannerHome.clickUpdatebtn();
    await contentHome.clickEditContent();
    await contentHome.clickPreviewIcon();

})