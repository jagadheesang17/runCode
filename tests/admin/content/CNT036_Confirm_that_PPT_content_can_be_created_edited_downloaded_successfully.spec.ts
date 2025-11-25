import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

const contentTitle = FakerData.getRandomTitle()+FakerData.getCertificationNumber();
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();

test.describe(`CNT036 - Confirm that PPT content can be created, edited and downloaded successfully.`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create PPT Content`, async ({ 
        adminHome, 
        contentHome, 
        createCourse,
        SurveyAssessment,
        bannerHome 
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT036 - Create PPT Content` },
            { type: `Test Description`, description: `Create PPT content and verify it can be saved successfully` }
        );

        // Step 1.1: Login as admin
        await adminHome.loadAndLogin("SUPERADMIN");

        // Step 1.2: Navigate to Content module
        await adminHome.clickMenu("Content");
        await adminHome.clickCreate("Content");

        // Step 1.3: Enter content details
        await contentHome.enter("content-title", contentTitle);
        await contentHome.enterDescription("PPT content for testing - " + contentTitle);

        // Step 1.4: Upload PPT file
        await contentHome.uploadContent("pptexamples.ppt");
        await contentHome.wait("mediumWait");
        await SurveyAssessment.clickSaveDraft();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log("✅ PPT content created successfully");
    });

    test(`Step 2: Edit PPT Content and Publish`, async ({ 
        adminHome, 
        contentHome, 
        bannerHome,
        createCourse ,
        SurveyAssessment
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT036 - Edit and Publish PPT Content` },
            { type: `Test Description`, description: `Edit the PPT content and publish it` }
        );

        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickContentmenu();

        // Step 2.2: Search for the created content
        await contentHome.contentVisiblity(contentTitle);

        // Step 2.3: Edit the content
        await contentHome.clickEditContentOnListing();
        await contentHome.enterDescription("PPT content for testing - " + contentTitle);
        await SurveyAssessment.clickPublish();
        await createCourse.verifySuccessMessage();
        console.log("✅ PPT content edited and published successfully");
    });
     test(`Step 3: Download PPT Content`, async ({ 
                       adminHome, 
                       contentHome 
                   }) => {
                       test.info().annotations.push(
                           { type: `Author`, description: `Divya` },
                           { type: `TestCase`, description: `CNT036 - Download PPT Content` },
                           { type: `Test Description`, description: `Verify PPT content can be downloaded` }
                       );
               
                       await adminHome.loadAndLogin("SUPERADMIN");
                       await adminHome.menuButton();
                       await adminHome.clickLearningMenu();
                       await adminHome.clickContentmenu();
                       // Step 3.2: Search for the published content
                       await contentHome.contentVisiblity(contentTitle );
               
                       // Step 3.3: Edit to access preview
                       await contentHome.clickEditContentOnListing();
                       await contentHome.verifyDownloadedFileType("ppt");
                       await contentHome.wait("maxWait");
                       console.log("✅ PPT content downloaded successfully");
                   });
   
});
