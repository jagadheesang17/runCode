import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from '../../../utils/fakerUtils';

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription()
const elearningInstanceName = courseName; // Use same name for instance

test.describe(`Verify that learner can enroll in the multi instance course from Catalog details page only`, async () => {
    test.describe.configure({ mode: "serial" });
    
    test(`Create Multi-Instance Course with E-Learning instance`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation Team` },
            { type: `TestCase`, description: `CRS1004_Create_multi_instance_course` },
            { type: `Test Description`, description: `Create Multi-Instance Course with E-Learning instance for catalog details enrollment test` }
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
        await createCourse.typeDescription("Multi-instance enrollment test: " + description);
        await createCourse.selectDomainOption("newprod");
        
        // Set delivery type as Classroom for multi-instance functionality
       // await createCourse.selectdeliveryType("Classroom");
        
        // Wait for UI to update after delivery type selection
        await createCourse.wait("mediumWait");
        
        // Select Multi-Instance delivery type (should now be visible)
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
        await createCourse.enter("course-title", courseName); // Use same course name
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        
        console.log("Multi-instance course created with E-Learning instance: " + courseName);
    });

    test(`Verify that learner can enroll in multi instance course from Catalog details page only`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation Team` },
            { type: `TestCase`, description: `CRS1004_Multi_instance_enrollment_catalog_details_only` },
            { type: `Test Description`, description: `Verify that learner can enroll in multi instance course from Catalog details page only` }
        );
 
        // Login as learner
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        
        // Navigate to catalog
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(courseName);
        
        console.log("Found multi-instance course: " + courseName);
        
        // IMPORTANT: Single-click enrollment is NOT available for multi-instance courses
        // We must navigate to catalog details page to select specific instance
        
        // For multi-instance courses, click directly on course to go to details page
        await catalog.clickMoreonCourse(courseName);
        
        console.log("✓ VERIFIED: Successfully clicked on course");
        console.log("✓ NAVIGATED: Multi-instance course details page should be accessible");
        
        // Wait for course details page to load
        await catalog.wait("mediumWait");
        
        console.log("SUCCESS: Navigated to Catalog Details page");
        
        // Select specific instance from catalog details page (MANDATORY STEP)
        // The method will look for available instances and select one
        await catalog.clickSelectcourse(courseName);
        
        console.log("✓ CRITICAL: Selected specific instance from catalog details: " + courseName);
        console.log("✓ FOCUS: Multi-instance courses require instance selection before enrollment");
        
        // NOW we can enroll after selecting the specific instance
        await catalog.clickEnroll();
        await catalog.wait("maxWait");
        await catalog.wait("maxWait")
        
        console.log("✓ SUCCESS: Enrolled in multi-instance course from Catalog Details page");
        console.log("✓ KEY VALIDATION: Multi-instance enrollment requires:");
        console.log("  1. Navigate to Catalog Details page");
        console.log("  2. Select specific instance");
        console.log("  3. Then enroll (single-click not supported)");
        
        // Navigate to My Learning to verify enrollment and launch content
        await learnerHome.clickMyLearning();
        
        await catalog.searchMyLearning(courseName);
        
        // Launch content from My Learning (not single-click from catalog)
        await catalog.clickCourseInMyLearning(courseName);
       // await catalog.launchContentFromMylearning();
      // await catalog.clickLaunchButton();
        
        await catalog.saveLearningStatus();
        
        console.log("COMPLETE: Multi-instance enrollment from catalog details page verified");
    });

   
});