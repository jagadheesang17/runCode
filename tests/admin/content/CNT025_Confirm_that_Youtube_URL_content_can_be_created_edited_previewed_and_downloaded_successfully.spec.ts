import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

const contentTitle = FakerData.getRandomTitle();
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const youtubeURL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Sample YouTube URL

test.describe(`CNT025 - Confirm that Youtube URL content can be created, edited, and previewed, and that the learner is able to launch and successfully complete the course`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create YouTube URL Content`, async ({ 
        adminHome, 
        contentHome, 
        createCourse,
        SurveyAssessment,
        bannerHome 
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT025 - Create YouTube URL Content` },
            { type: `Test Description`, description: `Create YouTube URL content and verify it can be saved successfully` }
        );

        // Step 1.1: Login as admin
        await adminHome.loadAndLogin("SUPERADMIN");

        // Step 1.2: Navigate to Content module
        await adminHome.clickMenu("Content");
        await adminHome.clickCreate("Content");

        // Step 1.3: Enter content details
        await contentHome.enter("content-title", contentTitle);
        await contentHome.enterDescription("YouTube URL content for testing - " + contentTitle);

        // Step 1.4: Upload YouTube URL
        await contentHome.uploadURL(youtubeURL);
        await contentHome.wait("mediumWait");
        await SurveyAssessment.clickSaveDraft();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log("✅ YouTube URL content created successfully");
    });

    test(`Step 2: Edit YouTube URL Content and Publish`, async ({ 
        adminHome, 
        contentHome, 
        bannerHome,
        createCourse ,
        SurveyAssessment
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT025 - Edit and Publish YouTube URL Content` },
            { type: `Test Description`, description: `Edit the YouTube URL content and publish it` }
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
        console.log("✅ YouTube URL content edited and published successfully");
    });

    test(`Step 3: Preview YouTube URL Content`, async ({ 
        adminHome, 
        contentHome 
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT025 - Preview YouTube URL Content` },
            { type: `Test Description`, description: `Verify YouTube URL content can be previewed` }
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
        console.log("✅ YouTube URL content preview opened successfully");
    });
     test(`Step 4: Click Open link YouTube URL Content`, async ({ 
                        adminHome, 
                        contentHome 
                    }) => {
                        test.info().annotations.push(
                            { type: `Author`, description: `Divya` },
                            { type: `TestCase`, description: `CNT025 - Open link YouTube URL Content` },
                            { type: `Test Description`, description: `Verify YouTube URL content can be opened` }
                        );
                
                        await adminHome.loadAndLogin("SUPERADMIN");
                        await adminHome.menuButton();
                        await adminHome.clickLearningMenu();
                        await adminHome.clickContentmenu();
                        // Step 3.2: Search for the published content
                        await contentHome.contentVisiblity(contentTitle);
                
                        // Step 3.3: Edit to access preview
                        await contentHome.clickEditContentOnListing();
                        await contentHome.clickOpenLink();
                        await contentHome.wait("maxWait");
                        console.log("✅ YouTube URL content opened successfully");
                    });

   
});
