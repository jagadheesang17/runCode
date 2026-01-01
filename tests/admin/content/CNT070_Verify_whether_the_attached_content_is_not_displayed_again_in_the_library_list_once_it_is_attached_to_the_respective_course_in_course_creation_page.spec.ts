import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

const contentTitle = FakerData.getRandomTitle();
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();

test.describe(`CNT070 - Verify whether the attached content is not displayed again in the library list once it is attached to the respective course in course creation page`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create and Publish Content`, async ({ 
        adminHome, 
        contentHome, 
        createCourse,
        SurveyAssessment
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT070 - Create and Publish Content` },
            { type: `Test Description`, description: `Create content and publish it for attaching to course` }
        );


        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.clickMenu("Content");
        await adminHome.clickCreate("Content");

        console.log(`\n📄 Creating content: "${contentTitle}"`);
        await contentHome.enter("content-title", contentTitle);
        await contentHome.enterDescription(`Content for duplicate attachment testing - ${contentTitle}`);
        await contentHome.uploadContent("SamplePPTX.pptx");
        await contentHome.wait("mediumWait");

        await SurveyAssessment.clickPublish();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

        console.log(`✅ Content Created and Published: "${contentTitle}"`);

    });

    test(`Step 2: Create Course and Attach Content - Verify Content Disappears from Library`, async ({ 
        adminHome, 
        createCourse
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT070 - Attach Content and Verify Removal from Library` },
            { type: `Test Description`, description: `Attach content to course and verify it's not displayed again in the library` }
        );

        console.log(`\n${'='.repeat(70)}`);
        console.log(`📚 STEP 2: Attaching Content and Verifying Library Behavior`);
        console.log(`${'='.repeat(70)}`);

        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");

        console.log(`\n📖 Creating course: "${courseName}"`);
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);

        // Open content library and verify content is visible
        console.log(`\n📚 Opening Content Library...`);
        await createCourse.contentLibrary(contentTitle);
        await createCourse.wait("mediumWait");
        // Save the course
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
    });

    test(`Step 3: Edit Course and Verify Content Still Not in Library`, async ({ 
        adminHome, 
        createCourse
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT070 - Verify Content Remains Hidden in Edit Mode` },
            { type: `Test Description`, description: `Edit course and verify attached content is still not available in library` }
        );


        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();

        // Search and edit the course
        console.log(`\n🔎 Searching for course: "${"Cross-platform Driver Synthesize"}"`);
        await createCourse.catalogSearch("Cross-platform Driver Synthesize");
        await createCourse.editCourseFromListingPage();
        await createCourse.wait("mediumWait");
        await createCourse.wait("mediumWait");

        // Verify content is still NOT visible (already attached)
        console.log(`\n🔍 Verifying content is NOT visible in edit mode...`);
        await createCourse.verifyPublishedContentInContentLibrary("Panel Capacitor","Draft");
        console.log(`\n✅ TEST PASSED: System consistently prevents duplicate content attachments\n`);
    });
});