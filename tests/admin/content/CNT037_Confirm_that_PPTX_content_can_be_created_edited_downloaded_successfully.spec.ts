import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

const contentTitle = FakerData.getRandomTitle()+FakerData.getCertificationNumber();
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();

test.describe(`CNT037 - Confirm that PPTX content can be created, edited and downloaded successfully.`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create PPTX Content`, async ({ 
        adminHome, 
        contentHome, 
        createCourse,
        SurveyAssessment,
        bannerHome 
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT037 - Create PPTX Content` },
            { type: `Test Description`, description: `Create PPTX content and verify it can be saved successfully` }
        );

        // Step 1.1: Login as admin
        await adminHome.loadAndLogin("SUPERADMIN");

        // Step 1.2: Navigate to Content module
        await adminHome.clickMenu("Content");
        await adminHome.clickCreate("Content");

        // Step 1.3: Enter content details
        await contentHome.enter("content-title", contentTitle);
        await contentHome.enterDescription("PPTX content for testing - " + contentTitle);

        // Step 1.4: Upload PPTX file
        await contentHome.uploadContent("SamplePPTX.pptx");
        await contentHome.wait("mediumWait");
        await SurveyAssessment.clickSaveDraft();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log("✅ PPTX content created successfully");
    });

    test(`Step 2: Edit PPTX Content and Publish`, async ({ 
        adminHome, 
        contentHome, 
        bannerHome,
        createCourse ,
        SurveyAssessment
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT037 - Edit and Publish PPTX Content` },
            { type: `Test Description`, description: `Edit the PPTX content and publish it` }
        );

        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickContentmenu();

        // Step 2.2: Search for the created content
        await contentHome.contentVisiblity(contentTitle);

        // Step 2.3: Edit the content
        await contentHome.clickEditContentOnListing();
        await contentHome.enterDescription("PPTX content for testing");
        await SurveyAssessment.clickPublish();
        await createCourse.verifySuccessMessage();
        console.log("✅ PPTX content edited and published successfully");
    });
     test(`Step 3: Download PPTX Content`, async ({ 
                       adminHome, 
                       contentHome 
                   }) => {
                       test.info().annotations.push(
                           { type: `Author`, description: `Divya` },
                           { type: `TestCase`, description: `CNT037 - Download PPTX Content` },
                           { type: `Test Description`, description: `Verify PPTX content can be downloaded` }
                       );
               
                       await adminHome.loadAndLogin("SUPERADMIN");
                       await adminHome.menuButton();
                       await adminHome.clickLearningMenu();
                       await adminHome.clickContentmenu();
                       // Step 3.2: Search for the published content
                       await contentHome.contentVisiblity(contentTitle );
               
                       // Step 3.3: Edit to access preview
                       await contentHome.clickEditContentOnListing();
                       await contentHome.verifyDownloadedFileType("pptx");
                       await contentHome.wait("maxWait");
                       console.log("✅ PPTX content downloaded successfully");
                   });
   
});
