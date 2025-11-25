import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

const title=FakerData.getRandomTitle();
test(`Verify whether alert message is displayed when different file type is uploaded during versioning. File type should be similar to the file uploaded in previous version`, async ({ adminHome ,contentHome,bannerHome,createCourse}) => {
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
    const contentType=await contentHome.getContentType();
    console.log("content type is "+contentType);
    await contentHome.uploadContent("Q1.jpg");
    await contentHome.verifyError("Invalid file format or extensions uploaded. Please upload a valid file format.");
   
})