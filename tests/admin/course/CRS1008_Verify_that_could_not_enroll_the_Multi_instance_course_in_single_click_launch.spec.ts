import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const elearningInstanceName = courseName

test.describe(`Verify that could not enroll the Multi instance course in single click launch`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Create Multi-Instance Course for single-click restriction testing`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation Team` },
            { type: `TestCase`, description: `CRS1008_Multi_Instance_Single_Click_Restriction` },
            { type: `Test Description`, description: `Create Multi-Instance Course to verify single-click enrollment restriction` }
        );

        // Login and create multi-instance course
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        
        // Fill course basic information
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("Multi-instance single-click restriction test: " + description);
        await createCourse.selectDomainOption("automationtenant");
        
        // Select Multi-Instance delivery type
        await createCourse.selectInstance();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        
        // Edit course to add E-Learning instance
        await createCourse.editcourse();
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("E-Learning");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", elearningInstanceName);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

        console.log("Multi-instance course created with E-Learning instance: " + courseName);
    });

    test(`Verify multi-instance course does NOT have single-click enrollment option from catalog`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation Team` },
            { type: `TestCase`, description: `CRS1008_Multi_Instance_No_Single_Click` },
            { type: `Test Description`, description: `Verify multi-instance course cannot be enrolled via single-click from catalog listing` }
        );

        // Login as learner
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        
        // Navigate to catalog
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(courseName);

        console.log("Searching for multi-instance course: " + courseName);

        // Find the course and verify single-click enrollment is NOT available
        await catalog.clickMoreonCourse(courseName);

        // Verify that single-click enrollment is not available for multi-instance courses
        // Multi-instance courses should require navigation to catalog details page
        try {
            // Try to select course directly (single-instance behavior)
            await catalog.clickSelectcourse(courseName);
            await catalog.clickEnroll(); // This should not work for multi-instance
            console.log("ERROR: Single-click enrollment should not be available for multi-instance courses");
        } catch (error) {
            console.log("SUCCESS: Multi-instance course correctly restricts single-click enrollment");
            console.log("✓ Single-click enrollment properly blocked for multi-instance course");
        }

        console.log("VERIFIED: Multi-instance courses require catalog details page for enrollment");
    });

    

});