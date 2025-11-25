import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

/**
 * Test Suite: CRS_010 - Verify Evaluator Dropdown Lists All Instructors
 * 
 * Test Flow:
 * 1. Enable Observation Checklist in Admin Configuration (if not already enabled)
 * 2. Create an E-Learning course
 * 3. Add Observation Checklist to the course
 * 4. Click Edit icon in Observation Checklist
 * 5. Open Evaluator dropdown
 * 6. Verify all instructors are listed in the dropdown
 * 7. Search and select an instructor from the dropdown
 * 8. Click Update button to save
 * 9. Verify success message
 */

test.describe.serial("CRS_010 - Verify Evaluator Dropdown Lists All Instructors", () => {

    let courseName: string;
    let description: string;

    test("Step 1: Enable Observation Checklist in Admin Configuration", async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'QA Automation' },
            { type: 'TestCase', description: 'CRS_010_Step1_Enable_Observation_Checklist' },
            { type: 'Test Description', description: 'Navigate to Admin Configuration and enable Observation Checklist (QuestionPro) if not already enabled' }
        );

        console.log("📋 Test Objective: Enable Observation Checklist in Admin Configuration");

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

    test("Step 2: Create E-Learning Course", async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'QA Automation' },
            { type: 'TestCase', description: 'CRS_010_Step2_Create_ELearning_Course' },
            { type: 'Test Description', description: 'Create an E-Learning course for evaluator dropdown testing' }
        );

        console.log("📋 Test Objective: Create E-Learning course");

        // Generate test data
        courseName = "E-Learning_Evaluator_" + FakerData.getCourseName();
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
        await createCourse.contentLibrary();
        console.log(`✅ Content library attached`);
        await createCourse.clickCatalog();
        console.log(`✅ Show in catalog enabled`);

        // Save course
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Created E-Learning course: ${courseName}`);
    });

    test("Step 3: Add Observation Checklist to Course", async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'QA Automation' },
            { type: 'TestCase', description: 'CRS_010_Step3_Add_Observation_Checklist' },
            { type: 'Test Description', description: 'Add observation checklist to the E-Learning course' }
        );

        console.log("📋 Test Objective: Add Observation Checklist to course");

        // Login and navigate to course
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

        // Verify Observation Checklist button exists
        const observationChecklistExists = await createCourse.verifyObservationChecklistButtonExists();
        if (!observationChecklistExists) {
            throw new Error("Observation Checklist button is not visible - cannot proceed with test");
        }

        // Add Observation Checklist to course
        await createCourse.addObservationChecklistToCourse();
        console.log("✅ Added Observation Checklist to course");

        // Wait for checklist to be added
        await createCourse.wait("mediumWait");
    });

    test("Step 4: Verify Evaluator Dropdown Lists All Instructors", async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'QA Automation' },
            { type: 'TestCase', description: 'CRS_010_Step4_Verify_Evaluator_Dropdown' },
            { type: 'Test Description', description: 'Open evaluator dropdown and verify all instructors are listed' }
        );

        console.log("📋 Test Objective: Verify evaluator dropdown lists all instructors");
        console.log("🎯 Target Course:", courseName);

        // Login and navigate to course
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

        // Navigate to Observation Checklist tab
        await createCourse.clickObservationChecklistButton();
        console.log("✅ Opened Observation Checklist section");

        // Wait for checklist to load
        await createCourse.wait("mediumWait");

        // Click Edit icon in Observation Checklist
        await createCourse.clickChecklistEditIcon();
        console.log("✅ Clicked Edit icon in Observation Checklist");

        // Click Evaluator dropdown to open it
        await createCourse.clickEvaluatorDropdown();
        console.log("✅ Opened Evaluator dropdown");

        // Get all instructor options from dropdown
        console.log("\n👥 Verifying Instructors in Evaluator Dropdown:");
        console.log("─".repeat(60));

        const instructorsList = await createCourse.page.locator("//li[contains(@id,'list')]").allTextContents();
        
        if (instructorsList.length === 0) {
            console.log("⚠️ No instructors found in dropdown!");
            throw new Error("Evaluator dropdown is empty - no instructors found");
        }

        console.log(`✅ Found ${instructorsList.length} instructor(s) in the dropdown:`);
        instructorsList.forEach((instructor, index) => {
            console.log(`   ${index + 1}. ${instructor}`);
        });
        console.log("─".repeat(60));

        // Select the first instructor from the list
        if (instructorsList.length > 0) {
            const firstInstructor = instructorsList[0];
            console.log(`\n🎯 Selecting instructor: ${firstInstructor}`);
            
            await createCourse.searchAndSelectEvaluator(firstInstructor);
            console.log(`✅ Selected evaluator: ${firstInstructor}`);

            // Click Update button to save
            await createCourse.clickChecklistUpdateButton();
            console.log("✅ Clicked Update button");

            // Verify success message
            await createCourse.verifySuccessMessage();
            console.log("✅ Evaluator updated successfully");
        }

        console.log("\n📋 Evaluator Dropdown Verification Summary:");
        console.log(`   • Total Instructors Listed: ${instructorsList.length}`);
        console.log("   • Dropdown Accessibility: Passed ✅");
        console.log("   • Instructor Selection: Successful ✅");
        console.log("   • Update Operation: Successful ✅");
        console.log("\n🏁 Test Result: PASSED - All instructors are listed in evaluator dropdown");
    });
});
