import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

const contentTitle = FakerData.getRandomTitle();
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const vimeoURL = "https://vimeo.com/1134227674?fl=wc"; // Sample Vimeo URL

test.describe(`CNT029 - Confirm that Vimeo URL content can be created, edited, and OpenLink clicked successfully.`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create Vimeo URL Content`, async ({ 
        adminHome, 
        contentHome, 
        createCourse,
        SurveyAssessment,
        bannerHome 
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT029 - Create Vimeo URL Content` },
            { type: `Test Description`, description: `Create Vimeo URL content and verify it can be saved successfully` }
        );

        // Step 1.1: Login as admin
        await adminHome.loadAndLogin("SUPERADMIN");

        // Step 1.2: Navigate to Content module
        await adminHome.clickMenu("Content");
        await adminHome.clickCreate("Content");

        // Step 1.3: Enter content details
        await contentHome.enter("content-title", contentTitle);
        await contentHome.enterDescription("Vimeo URL content for testing - " + contentTitle);

        // Step 1.4: Upload Vimeo URL
        await contentHome.uploadURL(vimeoURL);
        await contentHome.wait("mediumWait");
        await SurveyAssessment.clickSaveDraft();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log("✅ Vimeo URL content created successfully");
    });

    test(`Step 2: Edit Vimeo URL Content and Publish`, async ({ 
        adminHome, 
        contentHome, 
        bannerHome,
        createCourse ,
        SurveyAssessment
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT029 - Edit and Publish Vimeo URL Content` },
            { type: `Test Description`, description: `Edit the Vimeo URL content and publish it` }
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
        console.log("✅ Vimeo URL content edited and published successfully");
    });

    test(`Step 3: Preview Vimeo URL Content`, async ({ 
        adminHome, 
        contentHome 
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT029 - Preview Vimeo URL Content` },
            { type: `Test Description`, description: `Verify Vimeo URL content can be previewed` }
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
        console.log("✅ Vimeo URL content preview opened successfully");
    });
    test(`Step 4: Click Open link Vimeo URL Content`, async ({ 
                        adminHome, 
                        contentHome 
                    }) => {
                        test.info().annotations.push(
                            { type: `Author`, description: `Divya` },
                            { type: `TestCase`, description: `CNT029 - Open link Vimeo URL Content` },
                            { type: `Test Description`, description: `Verify Vimeo URL content can be opened` }
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
                        console.log("✅ Vimeo URL content opened successfully");
                    });

   });
