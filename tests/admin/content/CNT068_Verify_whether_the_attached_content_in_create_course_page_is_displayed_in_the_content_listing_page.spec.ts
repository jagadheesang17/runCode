import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

const contentTitle = FakerData.getRandomTitle();
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();

test.describe(`CNT068 - Verify whether the attached content in create course page is displayed in the content listing page`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create Course and Attach Content`, async ({ 
        adminHome, 
        createCourse
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT068 - Create Course and Attach Content` },
            { type: `Test Description`, description: `Create a course and attach the published content` }
        );


        // Login as admin
        await adminHome.loadAndLogin("SUPERADMIN");

        // Navigate to Course module
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");

        // Enter course details
        console.log(`\n📖 Creating course: "${courseName}"`);
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);

        // Attach content from library
        console.log(`\n📎 Attaching content: "${contentTitle}"`);
        await createCourse.contentLibrary("content testing-001");
        
        // Enable catalog and save course
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

    });


    test(`Step 2: Verify Attached Content is Displayed in Content Listing Page`, async ({ 
        adminHome, 
        contentHome
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT068 - Verify Content in Content Listing` },
            { type: `Test Description`, description: `Verify Content in Content Listing` }
        );


        // Login as admin
        await adminHome.loadAndLogin("SUPERADMIN");

        // Navigate to Content listing
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickContentmenu();
        await contentHome.contentVisiblity("content testing-001");
        console.log(`✅ Content found in listing`);
        console.log(`\n✅ TEST PASSED: Attached content displays in content listing\n`);
    });
});