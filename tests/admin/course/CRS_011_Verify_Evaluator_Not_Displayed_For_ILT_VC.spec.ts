import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { credentials } from "../../../constants/credentialData";

/**
 * Test Suite: CRS_011 - Verify Evaluator Dropdown Not Displayed For ILT/VC Classes
 * 
 * Test Flow:
 * 1. Enable Observation Checklist in Admin Configuration (if not already enabled)
 * 2. Create an ILT (Classroom) course with instance
 * 3. Add Observation Checklist to the course
 * 4. Click Edit icon in Observation Checklist
 * 5. Click on rule settings to configure rules
 * 6. Verify that evaluator dropdown is NOT displayed for ILT class
 * 7. Repeat test for Virtual Class (VC) course
 * 8. Verify that evaluator dropdown is NOT displayed for VC class
 */

test.describe.serial("CRS_011 - Verify Evaluator Dropdown Not Displayed For ILT/VC Classes", () => {

    let iltCourseName: string;
    let vcCourseName: string;
    let description: string;
    let instructorName: string;

    test("Step 1: Enable Observation Checklist in Admin Configuration", async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'QA Automation' },
            { type: 'TestCase', description: 'CRS_011_Step1_Enable_Observation_Checklist' },
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

    test("Step 2: Create ILT (Classroom) Course with Instance", async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'QA Automation' },
            { type: 'TestCase', description: 'CRS_011_Step2_Create_ILT_Course' },
            { type: 'Test Description', description: 'Create an ILT (Classroom) course with instance for evaluator dropdown testing' }
        );

        console.log("📋 Test Objective: Create ILT (Classroom) course");

        // Generate test data
        iltCourseName = "ILT_Evaluator_Test_" + FakerData.getCourseName();
        description = FakerData.getDescription();
        instructorName = credentials.INSTRUCTORNAME.username;
        
        console.log(`📝 ILT Course Name: ${iltCourseName}`);
        console.log(`📝 Description: ${description}`);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        console.log("✅ Logged in as CUSTOMERADMIN");

        // Navigate to Course creation
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        console.log("✅ Navigated to Course Creation page");

        // Create ILT (Classroom) course
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", iltCourseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.selectdeliveryType("Classroom");
        console.log(`✅ Selected Classroom (ILT) delivery type`);

        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown();
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();

        // Save course
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Created ILT course: ${iltCourseName}`);

        // Add Instance/Class
        console.log("\n🔄 Adding Instance to ILT Course...");
        await createCourse.clickEditCourseTabs();
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        
        await createCourse.enterSessionName("Session_" + iltCourseName);
        await createCourse.setMaxSeat();
        await createCourse.enterDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.clickCatalog();
        
        console.log(`✅ ILT Instance details entered`);

        // Save instance
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Added instance to ILT course`);
    });

    test("Step 3: Add Observation Checklist to ILT Course", async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'QA Automation' },
            { type: 'TestCase', description: 'CRS_011_Step3_Add_Checklist_To_ILT' },
            { type: 'Test Description', description: 'Add observation checklist to the ILT course' }
        );

        console.log("📋 Test Objective: Add Observation Checklist to ILT course");

        // Login and navigate to course
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        console.log("✅ Logged in as CUSTOMERADMIN");
        
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        
        await createCourse.searchCourse(iltCourseName);
        console.log(`🔍 Searched for course: ${iltCourseName}`);

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
        console.log("✅ Added Observation Checklist to ILT course");

        // Wait for checklist to be added
        await createCourse.wait("mediumWait");
    });

    test("Step 4: Verify Evaluator Dropdown NOT Displayed for ILT Class", async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'QA Automation' },
            { type: 'TestCase', description: 'CRS_011_Step4_Verify_No_Evaluator_ILT' },
            { type: 'Test Description', description: 'Verify that evaluator dropdown is NOT displayed when editing observation checklist for ILT class' }
        );

        console.log("📋 Test Objective: Verify evaluator dropdown NOT displayed for ILT class");
        console.log("🎯 Target Course:", iltCourseName);

        // Login and navigate to course
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        console.log("✅ Logged in as CUSTOMERADMIN");
        
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        
        await createCourse.searchCourse(iltCourseName);
        console.log(`🔍 Searched for course: ${iltCourseName}`);

        // Click edit icon to open course
        await createCourse.clickEditIcon();
        await createCourse.wait("mediumWait");
        console.log("✅ Opened course in edit mode");

        // Navigate to Observation Checklist section
        await createCourse.clickObservationChecklistButton();
        console.log("✅ Opened Observation Checklist section");

        await createCourse.wait("mediumWait");

        // Click Edit icon to open checklist edit modal/form
        await createCourse.clickChecklistEditIcon();
        console.log("✅ Clicked Edit icon in Observation Checklist");

        await createCourse.wait("mediumWait");

        // Verify that evaluator dropdown is NOT visible for ILT class
        console.log("\n🔍 Verifying Evaluator Dropdown is NOT displayed for ILT...");
        console.log("─".repeat(60));

        const evaluatorDropdownLocator = createCourse.page.locator("(//div[contains(@id,'observation_evaluator')])[1]");
        const isEvaluatorVisible = await evaluatorDropdownLocator.isVisible({ timeout: 3000 }).catch(() => false);

        if (isEvaluatorVisible) {
            console.log("❌ FAILED: Evaluator dropdown is visible for ILT class");
            throw new Error("Evaluator dropdown should NOT be displayed for ILT/Classroom courses");
        } else {
            console.log("✅ PASSED: Evaluator dropdown is NOT displayed for ILT class");
        }

        console.log("─".repeat(60));
        console.log("\n📋 ILT Class Verification Summary:");
        console.log("   • Course Type: ILT (Classroom)");
        console.log("   • Observation Checklist: Added ✅");
        console.log("   • Checklist Edit Mode: Opened ✅");
        console.log("   • Evaluator Dropdown: Not Displayed ✅");
        console.log("\n🏁 Test Result: PASSED - Evaluator dropdown correctly hidden for ILT class");
    });

    test("Step 5: Create Virtual Class (VC) Course with Instance", async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'QA Automation' },
            { type: 'TestCase', description: 'CRS_011_Step5_Create_VC_Course' },
            { type: 'Test Description', description: 'Create a Virtual Class course with instance for evaluator dropdown testing' }
        );

        console.log("📋 Test Objective: Create Virtual Class (VC) course");

        // Generate test data
        vcCourseName = "VC_Evaluator_Test_" + FakerData.getCourseName();
        description = FakerData.getDescription();
        
        console.log(`📝 VC Course Name: ${vcCourseName}`);
        console.log(`📝 Description: ${description}`);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        console.log("✅ Logged in as CUSTOMERADMIN");

        // Navigate to Course creation
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        console.log("✅ Navigated to Course Creation page");

        // Create Virtual Class course
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", vcCourseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.selectdeliveryType("Virtual Class");
        console.log(`✅ Selected Virtual Class (VC) delivery type`);

        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown();
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();

        // Save course
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Created VC course: ${vcCourseName}`);

        // Add Instance/Class
        console.log("\n🔄 Adding Instance to VC Course...");
        await createCourse.clickEditCourseTabs();
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Virtual Class");
        await createCourse.clickCreateInstance();
        
        await createCourse.enterSessionName("Session_" + vcCourseName);
        await createCourse.setMaxSeat();
        await createCourse.enterDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.clickCatalog();
        
        console.log(`✅ VC Instance details entered`);

        // Save instance
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Added instance to VC course`);
    });

    test("Step 6: Add Observation Checklist to VC Course", async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'QA Automation' },
            { type: 'TestCase', description: 'CRS_011_Step6_Add_Checklist_To_VC' },
            { type: 'Test Description', description: 'Add observation checklist to the Virtual Class course' }
        );

        console.log("📋 Test Objective: Add Observation Checklist to VC course");

        // Login and navigate to course
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        console.log("✅ Logged in as CUSTOMERADMIN");
        
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        
        await createCourse.searchCourse(vcCourseName);
        console.log(`🔍 Searched for course: ${vcCourseName}`);

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
        console.log("✅ Added Observation Checklist to VC course");

        // Wait for checklist to be added
        await createCourse.wait("mediumWait");
    });

    test("Step 7: Verify Evaluator Dropdown NOT Displayed for Virtual Class", async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'QA Automation' },
            { type: 'TestCase', description: 'CRS_011_Step7_Verify_No_Evaluator_VC' },
            { type: 'Test Description', description: 'Verify that evaluator dropdown is NOT displayed when editing observation checklist for Virtual Class' }
        );

        console.log("📋 Test Objective: Verify evaluator dropdown NOT displayed for Virtual Class");
        console.log("🎯 Target Course:", vcCourseName);

        // Login and navigate to course
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        console.log("✅ Logged in as CUSTOMERADMIN");
        
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        
        await createCourse.searchCourse(vcCourseName);
        console.log(`🔍 Searched for course: ${vcCourseName}`);

        // Click edit icon to open course
        await createCourse.clickEditIcon();
        await createCourse.wait("mediumWait");
        console.log("✅ Opened course in edit mode");

        // Navigate to Observation Checklist section
        await createCourse.clickObservationChecklistButton();
        console.log("✅ Opened Observation Checklist section");

        await createCourse.wait("mediumWait");

        // Click Edit icon to open checklist edit modal/form
        await createCourse.clickChecklistEditIcon();
        console.log("✅ Clicked Edit icon in Observation Checklist");

        await createCourse.wait("mediumWait");

        // Verify that evaluator dropdown is NOT visible for VC
        console.log("\n🔍 Verifying Evaluator Dropdown is NOT displayed for Virtual Class...");
        console.log("─".repeat(60));

        const evaluatorDropdownLocator = createCourse.page.locator("(//div[contains(@id,'observation_evaluator')])[1]");
        const isEvaluatorVisible = await evaluatorDropdownLocator.isVisible({ timeout: 3000 }).catch(() => false);

        if (isEvaluatorVisible) {
            console.log("❌ FAILED: Evaluator dropdown is visible for Virtual Class");
            throw new Error("Evaluator dropdown should NOT be displayed for Virtual Class courses");
        } else {
            console.log("✅ PASSED: Evaluator dropdown is NOT displayed for Virtual Class");
        }

        console.log("─".repeat(60));
        console.log("\n📋 Virtual Class Verification Summary:");
        console.log("   • Course Type: Virtual Class (VC)");
        console.log("   • Observation Checklist: Added ✅");
        console.log("   • Checklist Edit Mode: Opened ✅");
        console.log("   • Evaluator Dropdown: Not Displayed ✅");
        console.log("\n🏁 Test Result: PASSED - Evaluator dropdown correctly hidden for Virtual Class");
        
        console.log("\n" + "═".repeat(60));
        console.log("📊 FINAL TEST SUMMARY");
        console.log("═".repeat(60));
        console.log("✅ ILT (Classroom): Evaluator dropdown NOT displayed");
        console.log("✅ Virtual Class: Evaluator dropdown NOT displayed");
        console.log("═".repeat(60));
        console.log("🏆 Overall Result: ALL TESTS PASSED");
        console.log("═".repeat(60));
    });
});
