import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

const contentTitle = FakerData.getRandomTitle();
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const youtubeURL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Sample YouTube URL

test.describe(`CNT024 - Confirm that AICC content can be created, edited, previewed and downloaded successfully `, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create AICC Content`, async ({ 
        adminHome, 
        contentHome, 
        createCourse,
        SurveyAssessment,
        bannerHome 
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT024 - Create AICC Content` },
            { type: `Test Description`, description: `Create AICC content and verify it can be saved successfully` }
        );

        // Step 1.1: Login as admin
        await adminHome.loadAndLogin("SUPERADMIN");

        // Step 1.2: Navigate to Content module
        await adminHome.clickMenu("Content");
        await adminHome.clickCreate("Content");

        // Step 1.3: Enter content details
        await contentHome.enter("content-title", contentTitle);
        await contentHome.enterDescription("YouTube URL content for testing - " + contentTitle);

        // Step 1.4: Upload AICC file
        await contentHome.uploadContent("Passed_Failed_AICC_Storyline_output (2).zip");
        await contentHome.wait("mediumWait");
        await SurveyAssessment.clickSaveDraft();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log("✅ AICC content created successfully");
    });

    test(`Step 2: Edit AICC Content and Publish`, async ({ 
        adminHome, 
        contentHome, 
        bannerHome,
        createCourse ,
        SurveyAssessment
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT024 - Edit and Publish AICC Content` },
            { type: `Test Description`, description: `Edit the AICC content and publish it` }
        );

        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickContentmenu();

        // Step 2.2: Search for the created content
        await contentHome.contentVisiblity(contentTitle);

        // Step 2.3: Edit the content
        await contentHome.clickEditContentOnListing();
        await SurveyAssessment.clickPublish();
        await createCourse.verifySuccessMessage();
        console.log("✅ AICC content edited and published successfully");
    });

    test(`Step 3: Preview AICC Content`, async ({ 
        adminHome, 
        contentHome 
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT024 - Preview AICC Content` },
            { type: `Test Description`, description: `Verify AICC content can be previewed` }
        );

        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickContentmenu();
        // Step 3.2: Search for the published content
        await contentHome.contentVisiblity(contentTitle);

        // Step 3.3: Edit to access preview
        await contentHome.clickEditContentOnListing();

        // Step 3.4: Click preview icon
        await contentHome.clickPreviewIcon();
        await contentHome.wait("maxWait");
        console.log("✅ AICC content preview opened successfully");
    });
test(`Step 4: Download AICC Content`, async ({ 
                   adminHome, 
                   contentHome 
               }) => {
                   test.info().annotations.push(
                       { type: `Author`, description: `Divya` },
                       { type: `TestCase`, description: `CNT024 - Download AICC Content` },
                       { type: `Test Description`, description: `Verify AICC content can be downloaded` }
                   );
           
                   await adminHome.loadAndLogin("SUPERADMIN");
                   await adminHome.menuButton();
                   await adminHome.clickLearningMenu();
                   await adminHome.clickContentmenu();
                   // Step 3.2: Search for the published content
                   await contentHome.contentVisiblity(contentTitle);
           
                   // Step 3.3: Edit to access preview
                   await contentHome.clickEditContentOnListing();
                   await contentHome.verifyDownloadedFileType("zip");
                   await contentHome.wait("maxWait");
                   console.log("✅ AICC content downloaded successfully");
               });
   
});
