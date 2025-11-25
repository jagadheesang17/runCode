import { test } from "../../../customFixtures/expertusFixture"
import { AdminGroupPage } from "../../../pages/AdminGroupPage";
import { BannerPage } from "../../../pages/BannerPage";
import { FakerData } from "../../../utils/fakerUtils";

const title=FakerData.getRandomTitle();
test(`Verify whether able to unpublish the content when the content is not associated/associated to a course`, async ({ adminHome ,contentHome,   SurveyAssessment,createCourse,bannerHome}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `Verify whether for published content, the discard, update and unpublish buttons are enabled when a same file type content is replaced` },
        { type: `Test Description`, description: `Verify whether for published content, the discard, update and unpublish buttons are enabled when a same file type content is replaced` }
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
    await contentHome.clickUnpublish();


})