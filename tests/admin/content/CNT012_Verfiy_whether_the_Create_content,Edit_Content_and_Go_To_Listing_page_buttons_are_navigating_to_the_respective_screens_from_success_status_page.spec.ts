import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

const title=FakerData.getRandomTitle();
test(`Verify  whether the edit content navigates to the edit content screen`, async ({ adminHome ,contentHome,bannerHome,createCourse,SurveyAssessment}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `Verify  whether the edit content navigates to the edit content screen` },
        { type: `Test Description`, description: `Verify whether the edit content button is navigating to the edit content screen from success status page` }
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
    await contentHome.editContentLabelVerify();
})

test(`Verify  whether the create content button navigates to the create content screen`, async ({ adminHome ,contentHome,bannerHome,createCourse,SurveyAssessment}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `Verify  whether the create content button navigates to the create content screen` },
        { type: `Test Description`, description: `Verify whether the create content button is navigating to the create content screen from success status page` }
    );    
    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.clickMenu("Content");
    await adminHome.clickCreate("Content");
    await contentHome.enterDescription("Sample video content for " +title);
    await contentHome.uploadContent("Original_recording5.mp4");
    await bannerHome.clickPublish();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    await contentHome.clickCreateContentBtn();
    await contentHome.createContentLabelVerify();
})


test(`Verify  whether the Go to listing button navigates to the content listing screen`, async ({ adminHome ,contentHome,bannerHome,createCourse,SurveyAssessment}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `Verify  whether the Go to listing button navigates to the content listing screen` },
        { type: `Test Description`, description: `Verify whether the Go to listing button is navigating to the content listing screen from success status page` }
    );    
    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.clickMenu("Content");
    await adminHome.clickCreate("Content");
    await contentHome.enterDescription("Sample video content for " +title);
    await contentHome.uploadContent("Original_recording5.mp4");
    await bannerHome.clickPublish();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    await contentHome.gotoListing();
    await contentHome.contentListingLabelVerify();
})