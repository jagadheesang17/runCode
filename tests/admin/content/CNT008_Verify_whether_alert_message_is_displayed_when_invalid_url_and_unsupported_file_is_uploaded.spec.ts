import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

const title=FakerData.getRandomTitle();
test(`Verify whether alert message is displayed when invalid url  is uploaded
    `, async ({ adminHome ,contentHome,bannerHome,createCourse,SurveyAssessment}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `Upload Content title contains special characters` },
        { type: `Test Description`, description: `Upload Content title contains special characters` }
    );    
    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.clickMenu("Content");
    await adminHome.clickCreate("Content");
    await contentHome.enter("content-title",title)
    await contentHome.enterDescription("Sample URLcontent for " +title);
    await contentHome.uploadURL("httpss://your-app.com/login");
    await contentHome.verifyURLERRMsg("The content url field must contain a valid URL.");
    
})

test(`Verify whether alert message is displayed when unsupported file is uploaded`, async ({ adminHome ,contentHome,bannerHome,createCourse,SurveyAssessment}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `Upload Content title contains special characters` },
        { type: `Test Description`, description: `Upload Content title contains special characters` }
    );    
    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.clickMenu("Content");
    await adminHome.clickCreate("Content");
    await contentHome.enter("content-title",title)
    await contentHome.enterDescription("Sample URLcontent for " +title);
    await contentHome.uploadContent("US_address.csv");
    await contentHome.verifyURLERRMsg("Invalid file format or extensions uploaded. Please upload a valid file format.");
    
})