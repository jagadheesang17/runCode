import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

const title=FakerData.getRandomTitle();
test(`Verified that the content module is accessible via Quick Access and successfully published, including titles and files containing special characters.
    `, async ({ adminHome ,contentHome,bannerHome,createCourse,SurveyAssessment}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `Upload Content title contains special characters` },
        { type: `Test Description`, description: `Upload Content title contains special characters` }
    );    
    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.clickMenu("Content");
    await adminHome.clickCreate("Content");
    await contentHome.enter("content-title",title+"@2.025@#%[v1]")
    await contentHome.enterDescription("Sample video content for " +title);
    await contentHome.uploadContent("sample@2.025@#%[v1].pdf");
    await SurveyAssessment.clickSaveDraft();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    await contentHome.clickEditContent();
    await bannerHome.clickPublish();
    await createCourse.verifySuccessMessage();
})


