import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

const contentTitle = FakerData.getRandomTitle()+FakerData.getCertificationNumber();
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();

test.describe(`CNT038 - Confirm that PPS content can be created, edited and downloaded successfully.`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create PPS Content`, async ({ 
        adminHome, 
        contentHome, 
        createCourse,
        SurveyAssessment,
        bannerHome 
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT038 - Create PPS Content` },
            { type: `Test Description`, description: `Create PPS content and verify it can be saved successfully` }
        );

        // Step 1.1: Login as admin
        await adminHome.loadAndLogin("SUPERADMIN");

        // Step 1.2: Navigate to Content module
        await adminHome.clickMenu("Content");
        await adminHome.clickCreate("Content");

        // Step 1.3: Enter content details
        await contentHome.enter("content-title", contentTitle);
        await contentHome.enterDescription("PPS content for testing - " + contentTitle);

        // Step 1.4: Upload PPS file
        await contentHome.uploadContent("example.pps");
        await contentHome.wait("mediumWait");
        await SurveyAssessment.clickSaveDraft();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log("✅ PPS content created successfully");
    });

    test(`Step 2: Edit PPS Content and Publish`, async ({ 
        adminHome, 
        contentHome, 
        bannerHome,
        createCourse ,
        SurveyAssessment
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT038 - Edit and Publish PPS Content` },
            { type: `Test Description`, description: `Edit the PPS content and publish it` }
        );

        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickContentmenu();

        // Step 2.2: Search for the created content
        await contentHome.contentVisiblity(contentTitle);

        // Step 2.3: Edit the content
        await contentHome.clickEditContentOnListing();
        await contentHome.enterDescription("PPS content for testing");
        await SurveyAssessment.clickPublish();
        await createCourse.verifySuccessMessage();
        console.log("✅ PPS content edited and published successfully");
    });

     test(`Step 3: Download PPS Content`, async ({ 
                       adminHome, 
                       contentHome 
                   }) => {
                       test.info().annotations.push(
                           { type: `Author`, description: `Divya` },
                           { type: `TestCase`, description: `CNT038 - Download PPS Content` },
                           { type: `Test Description`, description: `Verify PPS content can be downloaded` }
                       );
               
                       await adminHome.loadAndLogin("SUPERADMIN");
                       await adminHome.menuButton();
                       await adminHome.clickLearningMenu();
                       await adminHome.clickContentmenu();
                       // Step 3.2: Search for the published content
                       await contentHome.contentVisiblity(contentTitle );
               
                       // Step 3.3: Edit to access preview
                       await contentHome.clickEditContentOnListing();
                       await contentHome.verifyDownloadedFileType("pps");
                       await contentHome.wait("maxWait");
                       console.log("✅ PPS content downloaded successfully");
                   });
   
});
