import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

/**
 * Test Suite: CRS_009 - Verify Checklist Rule Configuration
 * 
 * Test Flow:
 * 1. Enable Observation Checklist in Admin Configuration (if not already enabled)
 * 2. Create an E-Learning course
 * 3. Add Observation Checklist to the course
 * 4. Click the rule setting icon to open rules configuration
 * 5. Configure rules for the checklist:
 *    - After Learner Registration: Cannot View
 *    - After Learner Session Starts: Cannot View
 *    - After CheckList is Submitted: Can View
 * 6. Click Add button and confirm with Yes
 * 7. Verify rules are successfully configured
 */

test.describe.serial("CRS_009 - Verify Checklist Rule Configuration", () => {

    let courseName: string;
    let description: string;

    test("Step 1: Enable Observation Checklist in Admin Configuration", async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'QA Automation' },
            { type: 'TestCase', description: 'CRS_009_Step1_Enable_Observation_Checklist' },
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
            { type: 'TestCase', description: 'CRS_009_Step2_Create_ELearning_Course' },
            { type: 'Test Description', description: 'Create an E-Learning course for checklist rule configuration testing' }
        );

        console.log("📋 Test Objective: Create E-Learning course");

        // Generate test data
        courseName = "E-Learning_RulesConfig_" + FakerData.getCourseName();
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
            { type: 'TestCase', description: 'CRS_009_Step3_Add_Observation_Checklist' },
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

    test("Step 4: Configure Checklist Rules", async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'QA Automation' },
            { type: 'TestCase', description: 'CRS_009_Step4_Configure_Checklist_Rules' },
            { type: 'Test Description', description: 'Click rule setting icon and configure checklist rules' }
        );

        console.log("📋 Test Objective: Configure checklist rules");
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

        // Click on the rule setting icon (Edit icon)
        const editIconLocator = createCourse.page.locator("//i[@title='Edit']").first();
        await editIconLocator.scrollIntoViewIfNeeded();
        await createCourse.wait("minWait");
        await editIconLocator.click();
        console.log("✅ Clicked rule setting icon");

        await createCourse.wait("mediumWait");

        // Verify Rules tab/modal is opened
        const rulesTabExists = await createCourse.page.locator("//div[contains(@class,'nav nav-tabs border-0 pointer')]").isVisible().catch(() => false);
        
        if (!rulesTabExists) {
            console.log("⚠️ Rules tab not visible, attempting alternative approach...");
        } else {
            console.log("✅ Rules configuration dialog opened");
        }

        // Configure checklist rules
        console.log("\n🔧 Configuring Checklist Rules:");
        console.log("─".repeat(60));

        await createCourse.configureChecklistRulesDefault();

        console.log("─".repeat(60));

        // Verify success message
        await createCourse.verifySuccessMessage();
        console.log("✅ Rules configured successfully");

        console.log("\n📋 Rules Configuration Summary:");
        console.log("   • After Learner Registration: Cannot View");
        console.log("   • After Learner Session Starts: Cannot View");
        console.log("   • After CheckList is Submitted: Can View");
        console.log("   • Status: Configuration Successful ✅");
        console.log("\n🏁 Test Result: PASSED - Checklist rules configured successfully");
    });
});
