import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

const contentTitle = FakerData.getRandomTitle();
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();

test.describe(`CNT033 - Confirm that MP4 content can be created, edited, previewed and downloaded successfully.`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create MP4 Content`, async ({ 
        adminHome, 
        contentHome, 
        createCourse,
        SurveyAssessment,
        bannerHome 
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT033 - Create MP4 Content` },
            { type: `Test Description`, description: `Create MP4 content and verify it can be saved successfully` }
        );

        // Step 1.1: Login as admin
        await adminHome.loadAndLogin("SUPERADMIN");

        // Step 1.2: Navigate to Content module
        await adminHome.clickMenu("Content");
        await adminHome.clickCreate("Content");

        // Step 1.3: Enter content details
        await contentHome.enter("content-title", contentTitle);
        await contentHome.enterDescription("MP4 content for testing - " + contentTitle);

        // Step 1.4: Upload MP4 file
        await contentHome.uploadContent("samplevideo.mp4");
        await contentHome.wait("mediumWait");
        await SurveyAssessment.clickSaveDraft();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log("✅ MP4 content created successfully");
    });

    test(`Step 2: Edit mp4 Content and Publish`, async ({ 
        adminHome, 
        contentHome, 
        bannerHome,
        createCourse ,
        SurveyAssessment
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT033 - Edit and Publish MP4 Content` },
            { type: `Test Description`, description: `Edit the MP4 content and publish it` }
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
        console.log("✅ MP4 content edited and published successfully");
    });

    test(`Step 3: Preview MP4 Content`, async ({ 
        adminHome, 
        contentHome 
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT033 - Preview MP4 Content` },
            { type: `Test Description`, description: `Verify MP4 content can be previewed` }
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
        console.log("✅ MP4 content preview opened successfully");
    });

    test(`Step 4: Download MP4 Content`, async ({ 
                adminHome, 
                contentHome 
            }) => {
                test.info().annotations.push(
                    { type: `Author`, description: `Divya` },
                    { type: `TestCase`, description: `CNT033 - Download MP4 Content` },
                    { type: `Test Description`, description: `Verify MP4 content can be downloaded` }
                );
        
                await adminHome.loadAndLogin("SUPERADMIN");
                await adminHome.menuButton();
                await adminHome.clickLearningMenu();
                await adminHome.clickContentmenu();
                // Step 3.2: Search for the published content
                await contentHome.contentVisiblity(contentTitle);
        
                // Step 3.3: Edit to access preview
                await contentHome.clickEditContentOnListing();
                await contentHome.verifyDownloadedFileType("mp4");
                await contentHome.wait("maxWait");
                console.log("✅ MP4 content downloaded successfully");
            });
    
});
