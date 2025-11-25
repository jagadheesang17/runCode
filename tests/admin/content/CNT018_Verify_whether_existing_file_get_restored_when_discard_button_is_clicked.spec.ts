import { test } from "../../../customFixtures/expertusFixture"
import { AdminGroupPage } from "../../../pages/AdminGroupPage";
import { FakerData } from "../../../utils/fakerUtils";

const title=FakerData.getRandomTitle();
test(`Verify whether existing file get restored when discard button is clicked`, async ({ adminHome ,contentHome,   SurveyAssessment,createCourse,adminGroup}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `Verify whether existing file get restored when discard button is clicked` },
        { type: `Test Description`, description: `Verify whether existing file get restored when discard button is clicked` }
    );    
    await adminHome.loadAndLogin("LEARNERADMIN");
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickContentmenu();
    await contentHome.clickCreateContent();
    await contentHome.enter("content-title",title);
    await contentHome.enterDescription("Sample video content for " +title);
    await contentHome.uploadContent("samplevideo.mp4");
    await SurveyAssessment.clickPublish();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    await contentHome.clickEditContent();
    const contentCode = await contentHome.getCntCode();
    await contentHome.dltFuncUpload("Are you sure you want to delete the attached content");
    await contentHome.verifyBtnEnabled("Discard");
    await adminGroup.clickDiscard();
    await contentHome.contentVisiblity(contentCode);
    await contentHome.clickEditContentOnListing();
    await contentHome.verifycontentTitle("samplevideo.mp4");
    
})