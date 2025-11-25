import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

const title=FakerData.getRandomTitle();
test(`Verify the version history is displayed in the edit content page once the versions are created. It should be in non-editable mode for published content`, async ({ adminHome ,contentHome,bannerHome,createCourse,SurveyAssessment}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `Verify the version history is displayed in the edit content page once the versions are created. It should be in non-editable mode for published content` },
        { type: `Test Description`, description: `Verify the version history is displayed in the edit content page once the versions are created. It should be in non-editable mode for published content` }
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
    await bannerHome.clickPublish();
    await contentHome.clickEditContent();
    await contentHome.selectVersionedContent(title);
    await contentHome.verifyFieldIsDisabled(`(//input[@id="content-title"])[2]`);
})
