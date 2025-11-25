import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

const title=FakerData.getRandomTitle();
test(`Verify whether title and content type is retained when uploaded file is deleted during content creation`, async ({ adminHome ,contentHome,bannerHome,createCourse}) => {
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
    const contentType=await contentHome.getContentType();
    console.log("content type is "+contentType);
    await contentHome.dltFuncUpload("Are you sure you want to delete the attached content");
    await contentHome.compareTitle(title);
    await contentHome.autoVerifyContentType(contentType);
   
})

test(`Verify whether title and content type is retained when uploaded URL is deleted during content creation`, async ({ adminHome ,contentHome,bannerHome,createCourse}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `Upload Mp4 Content` },
        { type: `Test Description`, description: `Upload URL Content` }
    );    
    await adminHome.loadAndLogin("LEARNERADMIN");
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickContentmenu();
    await contentHome.clickCreateContent();
    await contentHome.enter("content-title",title);
    await contentHome.enterDescription("Sample video content for " +title);
    await contentHome.uploadURL("https://your-app.com/login");
    await bannerHome.clickPublish();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    await contentHome.clickEditContent();
    const contentType=await contentHome.getContentType();
    await contentHome.dltFuncUpload("Are you sure you want to delete the attached content");
    await contentHome.compareTitle(title);
    await contentHome.autoVerifyContentType(contentType);
    
})