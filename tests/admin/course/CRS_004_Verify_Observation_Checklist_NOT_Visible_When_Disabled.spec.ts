import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

/**
 * Test Suite: CRS_004 - Verify Observation Checklist NOT Visible When Disabled
 * 
 * Test Flow:
 * 1. Navigate to Site Admin > Admin Configuration
 * 2. Check if Observation Checklist exists in Admin site configuration
 * 3. If enabled, disable it; if already disabled, skip disabling
 * 4. Reload the page
 * 5. Create an E-Learning course
 * 6. Verify Observation Checklist button does NOT appear in course creation/edit
 */

test.describe.serial("CRS_004 - Verify Observation Checklist NOT Visible When Disabled", () => {

    let courseName: string;
    let description: string;

    test("Step 1: Disable Observation Checklist in Admin Configuration", async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'AI Generated' },
            { type: 'TestCase', description: 'CRS_004_Step1_Disable_Observation_Checklist' },
            { type: 'Test Description', description: 'Navigate to Admin Configuration and disable Observation Checklist (QuestionPro) if currently enabled' }
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

        // Check if enabled, if yes disable it
        const isEnabled = await siteAdmin.isObservationChecklistEnabled();
        
        if (isEnabled) {
            await siteAdmin.disableObservationChecklist();
            console.log("✅ Observation Checklist has been disabled");
        } else {
            console.log("✅ Observation Checklist is already disabled - proceeding to next step");
        }

        // Reload the page to apply changes
        await siteAdmin.page.reload();
        await siteAdmin.wait("mediumWait");
        console.log("✅ Page reloaded successfully");
    });

    test("Step 2: Create E-Learning Course and Verify Observation Checklist Button NOT Visible", async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'AI Generated' },
            { type: 'TestCase', description: 'CRS_004_Step2_Create_ELearning_And_Verify_NO_Observation_Checklist' },
            { type: 'Test Description', description: 'Create an E-Learning course and verify that Observation Checklist button does NOT appear when disabled in Admin Configuration' }
        );

        // Generate test data
        courseName = "E-Learning_NoObsChecklist_" + FakerData.getCourseName();
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

        // Verify Observation Checklist button is NOT available
        const observationChecklistExists = await createCourse.verifyObservationChecklistButtonExists();
        
        if (!observationChecklistExists) {
            console.log("✅ SUCCESS: Observation Checklist button is NOT visible (as expected when disabled)");
        } else {
            console.log("❌ FAILED: Observation Checklist button IS visible (should NOT be visible when disabled)");
            throw new Error("Observation Checklist button should NOT be available when disabled in Admin Configuration");
        }
    });

    test("Step 3: Re-enable Observation Checklist (Cleanup)", async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'AI Generated' },
            { type: 'TestCase', description: 'CRS_004_Step3_Cleanup_Reenable_Observation_Checklist' },
            { type: 'Test Description', description: 'Re-enable Observation Checklist as cleanup step to restore original state' }
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

        // Enable Observation Checklist back
        await siteAdmin.enableObservationChecklist();
        console.log("✅ Cleanup: Observation Checklist has been re-enabled");

        // Reload the page to apply changes
        await siteAdmin.page.reload();
        await siteAdmin.wait("mediumWait");
        console.log("✅ Cleanup completed - page reloaded successfully");
    });
});
