import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

const contentTitle = FakerData.getRandomTitle();
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();

test.describe(`CNT034 - Confirm that WEBM content can be created, edited, previewed and downloaded successfully.`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create WEBM Content`, async ({ 
        adminHome, 
        contentHome, 
        createCourse,
        SurveyAssessment,
        bannerHome 
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT034 - Create WEBM Content` },
            { type: `Test Description`, description: `Create WEBM content and verify it can be saved successfully` }
        );

        // Step 1.1: Login as admin
        await adminHome.loadAndLogin("SUPERADMIN");

        // Step 1.2: Navigate to Content module
        await adminHome.clickMenu("Content");
        await adminHome.clickCreate("Content");

        // Step 1.3: Enter content details
        await contentHome.enter("content-title", contentTitle);
        await contentHome.enterDescription("WEBM content for testing - " + contentTitle);

        // Step 1.4: Upload WEBM file
        await contentHome.uploadContent("sample-webm.webm");
        await contentHome.wait("mediumWait");
        await SurveyAssessment.clickSaveDraft();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log("✅ WEBM content created successfully");
    });

    test(`Step 2: Edit WEBM Content and Publish`, async ({ 
        adminHome, 
        contentHome, 
        bannerHome,
        createCourse ,
        SurveyAssessment
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT034 - Edit and Publish WEBM Content` },
            { type: `Test Description`, description: `Edit the WEBM content and publish it` }
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
        console.log("✅ WEBM content edited and published successfully");
    });

    test(`Step 3: Preview WEBM Content`, async ({ 
        adminHome, 
        contentHome 
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT034 - Preview WEBM Content` },
            { type: `Test Description`, description: `Verify WEBM content can be previewed` }
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
        console.log("✅ WEBM content preview opened successfully");
    });

    test(`Step 4: Download WEBM Content`, async ({ 
                adminHome, 
                contentHome 
            }) => {
                test.info().annotations.push(
                    { type: `Author`, description: `Divya` },
                    { type: `TestCase`, description: `CNT034 - Download WEBM Content` },
                    { type: `Test Description`, description: `Verify WEBM content can be downloaded` }
                );
        
                await adminHome.loadAndLogin("SUPERADMIN");
                await adminHome.menuButton();
                await adminHome.clickLearningMenu();
                await adminHome.clickContentmenu();
                // Step 3.2: Search for the published content
                await contentHome.contentVisiblity(contentTitle);
        
                // Step 3.3: Edit to access preview
                await contentHome.clickEditContentOnListing();
                await contentHome.verifyDownloadedFileType("webm");
                await contentHome.wait("maxWait");
                console.log("✅ WEBM content downloaded successfully");
            });
    
});
