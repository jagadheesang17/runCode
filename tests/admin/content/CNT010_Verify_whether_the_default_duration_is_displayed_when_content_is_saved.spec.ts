import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

const title=FakerData.getRandomTitle();
test(`Verify whether the default duration is displayed when content is saved.`, async ({ adminHome ,contentHome,bannerHome,createCourse,SurveyAssessment}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `Verify whether the default duration is displayed when content is saved` },
        { type: `Test Description`, description: `Verify whether the default duration is displayed when content is saved` }
    );    
    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.clickMenu("Content");
    await adminHome.clickCreate("Content");
    await contentHome.enterDescription("Sample video content for " +title);
    await contentHome.uploadContent("Original_recording5.mp4");
    await bannerHome.clickPublish();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    await contentHome.clickEditContent();
    await contentHome.getDefaultDuration("0 h 30 m");
})