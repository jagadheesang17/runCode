import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

const title=FakerData.getRandomTitle();
test(`Verify whether content title is auto-populated when the file is attached and the title field is kept blank.
    `, async ({ adminHome ,contentHome,bannerHome,createCourse,SurveyAssessment}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `Upload Content title contains special characters` },
        { type: `Test Description`, description: `Upload Content title contains special characters` }
    );    
    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.clickMenu("Content");
    await adminHome.clickCreate("Content");
    await contentHome.enterDescription("Sample video content for " +title);
    await contentHome.uploadContent("SamplePPTX.pptx");
    await SurveyAssessment.clickSaveDraft();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    await contentHome.clickEditContent();
    await bannerHome.clickPublish();
    await createCourse.verifySuccessMessage();
})