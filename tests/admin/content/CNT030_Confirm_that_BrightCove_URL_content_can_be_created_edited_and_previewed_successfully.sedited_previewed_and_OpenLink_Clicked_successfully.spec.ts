import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

const contentTitle = FakerData.getRandomTitle();
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const brightcove = "https://players.brightcove.net/6139825478001/default_default/index.html?videoId=6310612051112"; // Sample Vimeo URL

test.describe(`CNT030 - Confirm that Brightcove URL content can be created, edited, previewed and open link clicked successfully.`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create Brightcove URL Content`, async ({ 
        adminHome, 
        contentHome, 
        createCourse,
        SurveyAssessment,
        bannerHome 
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT030 - Create Brightcove URL Content` },
            { type: `Test Description`, description: `Create Brightcove URL content and verify it can be saved successfully` }
        );

        // Step 1.1: Login as admin
        await adminHome.loadAndLogin("SUPERADMIN");

        // Step 1.2: Navigate to Content module
        await adminHome.clickMenu("Content");
        await adminHome.clickCreate("Content");

        // Step 1.3: Enter content details
        await contentHome.enter("content-title", contentTitle);
        await contentHome.enterDescription("Brightcove URL content for testing - " + contentTitle);

        // Step 1.4: Upload Brightcove URL
        await contentHome.uploadURL(brightcove);
        await contentHome.wait("mediumWait");
        await SurveyAssessment.clickSaveDraft();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log("✅ Brightcove URL content created successfully");
    });

    test(`Step 2: Edit Brightcove URL Content and Publish`, async ({ 
        adminHome, 
        contentHome, 
        bannerHome,
        createCourse ,
        SurveyAssessment
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT030 - Edit and Publish Brightcove URL Content` },
            { type: `Test Description`, description: `Edit the Brightcove URL content and publish it` }
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
        console.log("✅ Brightcove URL content edited and published successfully");
    });

    test(`Step 3: Preview Brightcove URL Content`, async ({ 
        adminHome, 
        contentHome 
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT030 - Preview Brightcove URL Content` },
            { type: `Test Description`, description: `Verify Brightcove URL content can be previewed` }
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
        console.log("✅ Brightcove URL content preview opened successfully");
    });
    test(`Step 4: Click Open link Brightcove URL Content`, async ({ 
                    adminHome, 
                    contentHome 
                }) => {
                    test.info().annotations.push(
                        { type: `Author`, description: `Divya` },
                        { type: `TestCase`, description: `CNT030 - Open link Brightcove URL Content` },
                        { type: `Test Description`, description: `Verify Brightcove URL content can be opened` }
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
                    console.log("✅ Brightcove URL content opened successfully");
                });

   
});
