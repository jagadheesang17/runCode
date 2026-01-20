import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const additionalInfo = "Additional Information: This course provides comprehensive training on " + description + " with hands-on exercises and practical applications. Includes case studies, interactive modules, and assessment quizzes.";

test.describe(`Verify that additional information displays correctly in learner catalog`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Create course with additional information and make visible in catalog`, async ({ adminHome, createCourse, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation Team` },
            { type: `TestCase`, description: `CRS1017_Course_With_Additional_Information_Setup` },
            { type: `Test Description`, description: `Create course with detailed additional information and make it visible in learner catalog` }
        );

        // Login and create course
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        
        // Fill course basic information
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("Course with additional information test: " + description);
        await createCourse.selectDomainOption("automationtenant");
        await createCourse.contentLibrary("AutoVimeo");
        
    // Add additional information to the course (enable visibility and set content)
    await createCourse.setAdditionalInformation(additionalInfo);
    console.log("Additional information added to course");
        
        // Make course visible in catalog
        await createCourse.clickCatalog();
        console.log("Course set to show in catalog");

        
        // Save the course
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        
        console.log("SUCCESS: Course created with additional information: " + courseName);
        console.log("✓ Additional information field populated");
        console.log("✓ Course configured to display in learner catalog");
    });

    test(`Verify additional information displays in learner catalog search`, async ({ learnerHome, catalog, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation Team` },
            { type: `TestCase`, description: `CRS1017_Additional_Info_Catalog_Display` },
            { type: `Test Description`, description: `Login as learner and verify additional information appears correctly in catalog` }
        );

        // Logout admin and login as learner
     

        // Login as learner
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        
        // Navigate to catalog
        await learnerHome.clickCatalog();
        console.log("Navigated to learner catalog");

        // Search for the course with additional information
        await catalog.searchCatalog(courseName);
        console.log("Searching for course: " + courseName);

        // Click on the course to open course details/content player
        await catalog.clickMoreonCourse(courseName);
        console.log("Clicked on course: " + courseName);

        // Verify additional information in the course details/content player
        try {
            const desc = await catalog.verifyAdditionalInformationInContentPlayer(description);
            if (desc) {
                console.log("✓ SUCCESS: Additional information verified in course details");
                console.log("Description content:", desc.substring(0, 120));
            }
        } catch (err) {
            console.error("❌ Verification in course details failed:", err.message);
            throw err; // Re-throw to fail the test if verification fails
        }
        
        console.log("✓ Course with additional information visible in catalog");
    });

    
});