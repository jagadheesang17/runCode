import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

const contentTitle = FakerData.getRandomTitle()+FakerData.getCertificationNumber();
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();

test.describe(`CNT039 - Confirm that PPSX content can be created, edited and downloaded successfully.`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create PPSX Content`, async ({ 
        adminHome, 
        contentHome, 
        createCourse,
        SurveyAssessment,
        bannerHome 
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT039 - Create PPSX Content` },
            { type: `Test Description`, description: `Create PPSX content and verify it can be saved successfully` }
        );

        // Step 1.1: Login as admin
        await adminHome.loadAndLogin("SUPERADMIN");

        // Step 1.2: Navigate to Content module
        await adminHome.clickMenu("Content");
        await adminHome.clickCreate("Content");

        // Step 1.3: Enter content details
        await contentHome.enter("content-title", contentTitle);
        await contentHome.enterDescription("PPSX content for testing - " + contentTitle);

        // Step 1.4: Upload PPSX file
        await contentHome.uploadContent("example.ppsx");
        await contentHome.wait("mediumWait");
        await SurveyAssessment.clickSaveDraft();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log("✅ PPSX content created successfully");
    });

    test(`Step 2: Edit PPSX Content and Publish`, async ({ 
        adminHome, 
        contentHome, 
        bannerHome,
        createCourse ,
        SurveyAssessment
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT039 - Edit and Publish PPSX Content` },
            { type: `Test Description`, description: `Edit the PPSX content and publish it` }
        );

        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickContentmenu();

        // Step 2.2: Search for the created content
        await contentHome.contentVisiblity(contentTitle);

        // Step 2.3: Edit the content
        await contentHome.clickEditContentOnListing();
        await contentHome.enterDescription("PPSX content for testing");
        await SurveyAssessment.clickPublish();
        await createCourse.verifySuccessMessage();
        console.log("✅ PPSX content edited and published successfully");
    });

      test(`Step 3: Download PPSX Content`, async ({ 
                   adminHome, 
                   contentHome 
               }) => {
                   test.info().annotations.push(
                       { type: `Author`, description: `Divya` },
                       { type: `TestCase`, description: `CNT039 - Download PPSX Content` },
                       { type: `Test Description`, description: `Verify PPSX content can be downloaded` }
                   );
           
                   await adminHome.loadAndLogin("SUPERADMIN");
                   await adminHome.menuButton();
                   await adminHome.clickLearningMenu();
                   await adminHome.clickContentmenu();
                   // Step 3.2: Search for the published content
                   await contentHome.contentVisiblity(contentTitle );
           
                   // Step 3.3: Edit to access preview
                   await contentHome.clickEditContentOnListing();
                   await contentHome.verifyDownloadedFileType("ppsx");
                   await contentHome.wait("maxWait");
                   console.log("✅ PPSX content downloaded successfully");
               });
   
});
