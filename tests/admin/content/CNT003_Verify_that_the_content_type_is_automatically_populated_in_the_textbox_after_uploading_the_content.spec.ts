import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

const title=FakerData.getRandomTitle();
test(`Verify that the content type is automatically populated in the textbox after uploading the content`, async ({ adminHome ,contentHome,bannerHome,createCourse}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Vidya` },
        { type: `TestCase`, description: `Create banner in sequence` },
        { type: `Test Description`, description: `Verify that banner is created` }
    );
    
    await adminHome.loadAndLogin("LEARNERADMIN");
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickContentmenu();
    await contentHome.clickCreateContent();
    await contentHome.enter("content-title",title)
    await contentHome.enterDescription("Content for " +title);
    await contentHome.uploadContent("SamplePPTX.pptx");
    await contentHome.verifyContentFileType();

  
   })


