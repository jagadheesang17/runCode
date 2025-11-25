import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

const contentTitle = FakerData.getRandomTitle()+FakerData.getCertificationNumber();
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();

test.describe(`CNT047 - Confirm that PNG content can be created, edited ,previewed and downloaded successfully.`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create PNG Content`, async ({ 
        adminHome, 
        contentHome, 
        createCourse,
        SurveyAssessment,
        bannerHome 
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT047 - Create PNG Content` },
            { type: `Test Description`, description: `Create PNG content and verify it can be saved successfully` }
        );

        // Step 1.1: Login as admin
        await adminHome.loadAndLogin("SUPERADMIN");

        // Step 1.2: Navigate to Content module
        await adminHome.clickMenu("Content");
        await adminHome.clickCreate("Content");

        // Step 1.3: Enter content details
        await contentHome.enter("content-title", contentTitle);
        await contentHome.enterDescription("PNG content for testing - " + contentTitle);

        // Step 1.4: Upload PNG file
        await contentHome.uploadContent("file_example_PNG_1MB.png");
        await contentHome.wait("mediumWait");
        await SurveyAssessment.clickSaveDraft();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log("✅ PNG content created successfully");
    });

    test(`Step 2: Edit PNG Content and Publish`, async ({ 
        adminHome, 
        contentHome, 
        bannerHome,
        createCourse ,
        SurveyAssessment
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT047 - Edit and Publish PNG Content` },
            { type: `Test Description`, description: `Edit the PNG content and publish it` }
        );

        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickContentmenu();

        // Step 2.2: Search for the created content
        await contentHome.contentVisiblity(contentTitle);

        // Step 2.3: Edit the content
        await contentHome.clickEditContentOnListing();
        await contentHome.enterDescription("PNG content for testing");
        await SurveyAssessment.clickPublish();
        await createCourse.verifySuccessMessage();
        console.log("✅ PNG content edited and published successfully");
    });
     test(`Step 3: Preview PNG Content`, async ({ 
            adminHome, 
            contentHome 
        }) => {
            test.info().annotations.push(
                { type: `Author`, description: `Divya` },
                { type: `TestCase`, description: `CNT047 - Preview PNG Content` },
                { type: `Test Description`, description: `Verify PNG content can be previewed` }
            );
    
            await adminHome.loadAndLogin("SUPERADMIN");
            await adminHome.menuButton();
            await adminHome.clickLearningMenu();
            await adminHome.clickContentmenu();
            // Step 3.2: Search for the published content
            await contentHome.contentVisiblity(contentTitle);
    
            // Step 3.3: Edit to access preview
            await contentHome.clickEditContentOnListing();
            await contentHome.clickPreviewIcon();
            await contentHome.wait("maxWait");
            console.log("✅ PNG content preview opened successfully");
        });
   test(`Step 4: Download PNG Content`, async ({ 
            adminHome, 
            contentHome 
        }) => {
            test.info().annotations.push(
                { type: `Author`, description: `Divya` },
                { type: `TestCase`, description: `CNT047 - Download PNG Content` },
                { type: `Test Description`, description: `Verify PNG content can be downloaded` }
            );
    
            await adminHome.loadAndLogin("SUPERADMIN");
            await adminHome.menuButton();
            await adminHome.clickLearningMenu();
            await adminHome.clickContentmenu();
            // Step 3.2: Search for the published content
            await contentHome.contentVisiblity(contentTitle);
    
            // Step 3.3: Edit to access preview
            await contentHome.clickEditContentOnListing();
            await contentHome.verifyDownloadedFileType("png");
            await contentHome.wait("maxWait");
            console.log("✅ PNG content downloaded successfully");
        });
});
