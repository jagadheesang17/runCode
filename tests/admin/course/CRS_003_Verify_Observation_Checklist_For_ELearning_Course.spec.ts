import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

/**
 * Test Suite: CRS_003 - Verify Observation Checklist for E-Learning Course
 * 
 * Test Flow:
 * 1. Navigate to Site Admin > Admin Configuration
 * 2. Check if Observation Checklist is enabled in Admin site configuration
 * 3. If disabled, enable it; if enabled, skip enabling
 * 4. Reload the page
 * 5. Create an E-Learning course
 * 6. Verify Observation Checklist button appears in course creation/edit
 * 7. Add observation checklist to the course
 */

test.describe.serial("CRS_003 - Verify Observation Checklist appears for E-Learning Course", () => {

    let courseName: string;
    let description: string;

    test("Step 1: Enable Observation Checklist in Admin Configuration", async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'AI Generated' },
            { type: 'TestCase', description: 'CRS_003_Step1_Enable_Observation_Checklist' },
            { type: 'Test Description', description: 'Navigate to Admin Configuration and enable Observation Checklist (QuestionPro) if not already enabled' }
        );

        // Login as admin
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        console.log("✅ Logged in as CUSTOMERADMIN");

        // Navigate to Site Admin > Admin Configuration
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await siteAdmin.adminConfiguration();
        console.log("✅ Navigated to Admin Configuration");

        // Click on Admin site configuration tab
        await siteAdmin.clickAdminSiteConfiguration();

        // Verify Observation Checklist option is visible
        const isVisible = await siteAdmin.verifyObservationChecklistInAdminConfig();
        if (!isVisible) {
            test.skip(true, "Observation Checklist feature is not available in this environment - skipping remaining tests");
            return;
        }

        // Check if already enabled, if not enable it
        const isEnabled = await siteAdmin.isObservationChecklistEnabled();
        
        if (!isEnabled) {
            await siteAdmin.enableObservationChecklist();
            console.log("✅ Observation Checklist has been enabled");
        } else {
            console.log("✅ Observation Checklist is already enabled - proceeding to next step");
        }

        // Reload the page to apply changes
        await siteAdmin.page.reload();
        await siteAdmin.wait("mediumWait");
        console.log("✅ Page reloaded successfully");
    });

    test("Step 2: Create E-Learning Course and Verify Observation Checklist Button", async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'AI Generated' },
            { type: 'TestCase', description: 'CRS_003_Step2_Create_ELearning_And_Verify_Observation_Checklist' },
            { type: 'Test Description', description: 'Create an E-Learning course and verify that Observation Checklist button appears correctly' }
        );

        // Generate test data
        courseName = "E-Learning_ObsChecklist_" + FakerData.getCourseName();
        description = FakerData.getDescription();
        console.log(`📝 Course Name: ${courseName}`);
        console.log(`📝 Description: ${description}`);

          await adminHome.loadAndLogin("CUSTOMERADMIN");
        console.log("✅ Logged in as CUSTOMERADMIN");

        // Navigate to Course creation
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        console.log("✅ Navigated to Course Creation page");

        // Create E-Learning course
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.selectdeliveryType("E-Learning");
        console.log(`✅ Selected E-Learning delivery type`);

        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown();
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();

        // Save course
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Created E-Learning course: ${courseName}`);

        // Wait for course creation to complete
        await createCourse.wait("mediumWait");

        // Navigate back to edit course view to check for Observation Checklist button
        await createCourse.editcourse();
        await createCourse.wait("mediumWait");
        console.log("📝 Opened course in edit mode");

        // Verify Observation Checklist button is available
        const observationChecklistExists = await createCourse.verifyObservationChecklistButtonExists();
        
        if (observationChecklistExists) {
            console.log("✅ SUCCESS: Observation Checklist button IS available for E-Learning course");
        } else {
            console.log("❌ FAILED: Observation Checklist button is NOT available for E-Learning course");
            throw new Error("Observation Checklist button should be available when enabled in Admin Configuration");
        }
    });

    test("Step 3: Add Observation Checklist to E-Learning Course", async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'AI Generated' },
            { type: 'TestCase', description: 'CRS_003_Step3_Add_Observation_Checklist_To_Course' },
            { type: 'Test Description', description: 'Add Observation Checklist to the E-Learning course and verify successful addition' }
        );

        // Search for the course
          // Login as admin
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        console.log("✅ Logged in as CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        
        await createCourse.searchCourse(courseName);
        console.log(`🔍 Searched for course: ${courseName}`);

        // Click edit icon to open course
        await createCourse.clickEditIcon();
        await createCourse.wait("mediumWait");
        console.log("✅ Opened course in edit mode");

        // Add Observation Checklist to course
        await createCourse.addObservationChecklistToCourse();
        
        // Verify success (assuming success message appears)
        await createCourse.verifySuccessMessage();
        console.log("✅ Successfully added Observation Checklist to E-Learning course");
    });
});
