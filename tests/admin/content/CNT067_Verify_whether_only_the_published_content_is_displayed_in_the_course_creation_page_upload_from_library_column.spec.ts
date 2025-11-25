import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

const draftContentTitle = FakerData.getRandomTitle() + "_DRAFT";
const publishedContentTitle = FakerData.getRandomTitle() + "_PUBLISHED";
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();

test.describe(`CNT067 - Verify whether only the published content is displayed in the course creation page - upload from library column`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create Draft Content (Should NOT appear in course library)`, async ({ 
        adminHome, 
        contentHome, 
        createCourse,
        SurveyAssessment
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT067 - Create Draft Content` },
            { type: `Test Description`, description: `Create content and save as draft to verify it doesn't appear in course library` }
        );

     

        // Login as admin
        await adminHome.loadAndLogin("SUPERADMIN");

        // Navigate to Content module
        await adminHome.clickMenu("Content");
        await adminHome.clickCreate("Content");

        // Create content
        await contentHome.enter("content-title", draftContentTitle);
        await contentHome.enterDescription(`Draft content for testing - ${draftContentTitle}`);
        await contentHome.uploadContent("SamplePPTX.pptx");
        await contentHome.wait("mediumWait");

        // Save as DRAFT (not published)
        await SurveyAssessment.clickSaveDraft();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
    });

    test(`Step 2: Create Published Content (Should appear in course library)`, async ({ 
        adminHome, 
        contentHome, 
        createCourse,
        SurveyAssessment
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT067 - Create Published Content` },
            { type: `Test Description`, description: `Create and publish content to verify it appears in course library` }
        );



        // Login as admin
        await adminHome.loadAndLogin("SUPERADMIN");

        // Navigate to Content module
        await adminHome.clickMenu("Content");
        await adminHome.clickCreate("Content");

        // Create content
        await contentHome.enter("content-title", publishedContentTitle);
        await contentHome.enterDescription(`Published content for testing - ${publishedContentTitle}`);
        await contentHome.uploadContent("SamplePPTX.pptx");
        await contentHome.wait("mediumWait");

        // Publish the content
        await SurveyAssessment.clickPublish();
    });

    test(`Step 3: Verify Only Published Content Appears in Course Content Library`, async ({ 
        adminHome, 
        createCourse
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT067 - Verify Content Library Filtering` },
            { type: `Test Description`, description: `Verify that only published content is visible in course creation content library` }
        );

        await adminHome.loadAndLogin("LEARNERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name :" + courseName);
        await createCourse.verifyPublishedContentInContentLibrary(publishedContentTitle,"Published");
        await createCourse.page.reload();
        await createCourse.verifyPublishedContentInContentLibrary(draftContentTitle,"Draft");
    });
});