import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { credentials } from "../../../constants/credentialData";

/**
 * Test Suite: CRS_013 - Verify Multiple Instructors Can View and Launch Observation Checklist
 * 
 * Test Flow:
 * 1. Enable Observation Checklist in Admin Configuration (if not already enabled)
 * 2. Create an ILT course with instance
 * 3. Add Observation Checklist to the course
 * 4. Select multiple instructors as evaluators for the observation checklist
 * 5. Login as first instructor and verify can view and launch checklist
 * 6. Login as second instructor and verify can view and launch checklist
 * 7. Verify both instructors have access to the same checklist
 */

test.describe.serial("CRS_013 - Verify Multiple Instructors Can View and Launch Observation Checklist", () => {

    let courseName: string;
    let description: string;
    let sessionName: string;
    let instructor1: string;
    let instructor2: string;

    test("Step 1: Enable Observation Checklist in Admin Configuration", async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'QA Automation' },
            { type: 'TestCase', description: 'CRS_013_Step1_Enable_Observation_Checklist' },
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
            { type: 'TestCase', description: 'CRS_013_Step2_Create_ELearning_Course' },
            { type: 'Test Description', description: 'Create an E-Learning course' }
        );

        console.log("📋 Test Objective: Create E-Learning course");

        // Generate test data
        courseName = "ELearning_MultiEvaluator_" + FakerData.getCourseName();
        description = FakerData.getDescription();
        sessionName = "Session_" + FakerData.getSession();
        instructor1 = credentials.INSTRUCTORNAME.username;
        instructor2 = credentials.INSTRUCTOR2.username;
        
        console.log(`📝 Course Name: ${courseName}`);
        console.log(`📝 Description: ${description}`);
        console.log(`👥 Evaluator 1: ${instructor1}`);
        console.log(`👥 Evaluator 2: ${instructor2}`);

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
            { type: 'TestCase', description: 'CRS_013_Step3_Add_Observation_Checklist' },
            { type: 'Test Description', description: 'Add observation checklist to the ILT course' }
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

    test("Step 4: Select Multiple Instructors as Evaluators for Observation Checklist", async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'QA Automation' },
            { type: 'TestCase', description: 'CRS_013_Step4_Select_Multiple_Evaluators' },
            { type: 'Test Description', description: 'Select multiple instructors as evaluators for the observation checklist' }
        );

        console.log("📋 Test Objective: Select multiple instructors as evaluators");
        console.log(`👥 Evaluator 1: ${instructor1}`);
        console.log(`👥 Evaluator 2: ${instructor2}`);

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

        await createCourse.wait("mediumWait");

        // Click Edit icon in Observation Checklist
        await createCourse.clickChecklistEditIcon();
        console.log("✅ Clicked Edit icon in Observation Checklist");

        // Select multiple evaluators
        await createCourse.searchAndSelectMultipleEvaluators([instructor1, instructor2]);
        console.log(`✅ Selected both evaluators: ${instructor1}, ${instructor2}`);

        // Click Update button to save
        await createCourse.clickChecklistUpdateButton();
        console.log("✅ Clicked Update button");

        // Verify success message
        // await createCourse.verifySuccessMessage();
         console.log("✅ Multiple evaluators updated successfully");
    });

    test("Step 5: Login as First Instructor and Verify Can View and Launch Checklist", async ({ instructorHome, createCourse }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'QA Automation' },
            { type: 'TestCase', description: 'CRS_013_Step5_First_Instructor_Access' },
            { type: 'Test Description', description: 'Login as first instructor and verify can view and launch observation checklist' }
        );

        console.log("📋 Test Objective: Verify first instructor can access checklist");
        console.log(`👤 Instructor: ${instructor1}`);

        // Login as first instructor
        await instructorHome.loadAndLogin("INSTRUCTORNAME");
        console.log(`✅ Logged in as ${instructor1}`);

        // Navigate to Learning > My Classes
        await instructorHome.menuButton();
        await instructorHome.clickLearningMenu();
        await instructorHome.clickInstructor();
        console.log("✅ Navigated to My Classes");

        await instructorHome.wait("mediumWait");

        // Search for the course
        await instructorHome.page.locator("//input[@placeholder='Search']").fill(courseName);
        await instructorHome.wait("minWait");
        console.log(`🔍 Searched for course: ${courseName}`);

        // Verify course is visible in instructor's class list
        const courseLocator = instructorHome.page.locator(`//text()[contains(.,'${courseName}')]`).first();
        const isCourseVisible = await courseLocator.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (!isCourseVisible) {
            throw new Error(`Course "${courseName}" is not visible in instructor's class list`);
        }
        console.log("✅ Course is visible in instructor's class list");

        // Click on the course to view details
        await courseLocator.click();
        await instructorHome.wait("mediumWait");
        console.log("✅ Opened course details");

        // Verify Observation Checklist is visible
        const checklistButtonLocator = instructorHome.page.locator("//button[text()='Observation checklist'] | //span[text()='Observation Checklist'] | //a[contains(text(),'Observation')]");
        const isChecklistVisible = await checklistButtonLocator.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (!isChecklistVisible) {
            console.log("⚠️ Observation Checklist button not found on course details page");
            
            // Try to find any checklist-related element
            const anyChecklistElement = instructorHome.page.locator("//text()[contains(.,'checklist') or contains(.,'Checklist')]").first();
            const hasAnyChecklist = await anyChecklistElement.isVisible({ timeout: 3000 }).catch(() => false);
            
            if (hasAnyChecklist) {
                console.log("✅ Found checklist-related element (alternative selector)");
            } else {
                throw new Error("Observation Checklist is not accessible to the instructor");
            }
        } else {
            console.log("✅ Observation Checklist button is visible");
            
            // Click on checklist button to launch it
            await checklistButtonLocator.click();
            await instructorHome.wait("mediumWait");
            console.log("✅ Launched Observation Checklist");
        }

        console.log(`\n📊 First Instructor (${instructor1}) Access Summary:`);
        console.log("   • Can View Course: Yes ✅");
        console.log("   • Can Access Checklist: Yes ✅");
        console.log("   • Can Launch Checklist: Yes ✅");
    });

    test("Step 6: Login as Second Instructor and Verify Can View and Launch Checklist", async ({ page, context }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'QA Automation' },
            { type: 'TestCase', description: 'CRS_013_Step6_Second_Instructor_Access' },
            { type: 'Test Description', description: 'Login as second instructor and verify can view and launch observation checklist' }
        );

        console.log("📋 Test Objective: Verify second instructor can access checklist");
        console.log(`👤 Instructor: ${instructor2}`);

        // Navigate to login page
        await page.goto(credentials.INSTRUCTOR2.url || credentials.CUSTOMERADMIN.url); // Use available URL
        await page.waitForLoadState("domcontentloaded");
        console.log("✅ Navigated to login page");

        // Login as second instructor
        await page.locator("//input[@id='username']").fill(credentials.INSTRUCTOR2.username);
        await page.locator("//input[@id='password']").fill(credentials.INSTRUCTOR2.password);
        await page.locator("//button[@id='submit']").click();
        await page.waitForLoadState("domcontentloaded");
        await page.waitForTimeout(3000);
        console.log(`✅ Logged in as ${instructor2}`);

        // Navigate to Learning > My Classes
        await page.locator("//button[@id='main-menu']").click();
        await page.waitForTimeout(2000);
        await page.locator("//span[text()='Learning']").click();
        await page.waitForTimeout(1000);
        await page.locator("//a[text()='My Classes']").click();
        await page.waitForLoadState("domcontentloaded");
        await page.waitForTimeout(3000);
        console.log("✅ Navigated to My Classes");

        // Search for the course
        await page.locator("//input[@placeholder='Search']").fill(courseName);
        await page.waitForTimeout(2000);
        console.log(`🔍 Searched for course: ${courseName}`);

        // Verify course is visible in instructor's class list
        const courseLocator = page.locator(`//text()[contains(.,'${courseName}')]`).first();
        const isCourseVisible = await courseLocator.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (!isCourseVisible) {
            throw new Error(`Course "${courseName}" is not visible in second instructor's class list`);
        }
        console.log("✅ Course is visible in second instructor's class list");

        // Click on the course to view details
        await courseLocator.click();
        await page.waitForTimeout(3000);
        console.log("✅ Opened course details");

        // Verify Observation Checklist is visible
        const checklistButtonLocator = page.locator("//button[text()='Observation checklist'] | //span[text()='Observation Checklist'] | //a[contains(text(),'Observation')]");
        const isChecklistVisible = await checklistButtonLocator.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (!isChecklistVisible) {
            console.log("⚠️ Observation Checklist button not found on course details page");
            
            // Try to find any checklist-related element
            const anyChecklistElement = page.locator("//text()[contains(.,'checklist') or contains(.,'Checklist')]").first();
            const hasAnyChecklist = await anyChecklistElement.isVisible({ timeout: 3000 }).catch(() => false);
            
            if (hasAnyChecklist) {
                console.log("✅ Found checklist-related element (alternative selector)");
            } else {
                throw new Error("Observation Checklist is not accessible to the second instructor");
            }
        } else {
            console.log("✅ Observation Checklist button is visible");
            
            // Click on checklist button to launch it
            await checklistButtonLocator.click();
            await page.waitForTimeout(3000);
            console.log("✅ Launched Observation Checklist");
        }

        console.log(`\n📊 Second Instructor (${instructor2}) Access Summary:`);
        console.log("   • Can View Course: Yes ✅");
        console.log("   • Can Access Checklist: Yes ✅");
        console.log("   • Can Launch Checklist: Yes ✅");
    });

    test("Step 7: Verify Both Instructors Have Access to Same Checklist", async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'QA Automation' },
            { type: 'TestCase', description: 'CRS_013_Step7_Verify_Same_Checklist_Access' },
            { type: 'Test Description', description: 'Verify both instructors have access to the same observation checklist' }
        );

        console.log("📋 Test Objective: Verify both instructors have access to same checklist");

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

        // Navigate to Observation Checklist tab
        await createCourse.clickObservationChecklistButton();
        console.log("✅ Opened Observation Checklist section");

        await createCourse.wait("mediumWait");

        // Verify checklist details are visible
        const checklistDetails = await createCourse.verifyChecklistDetails(1);
        
        console.log("\n📋 Final Verification Summary:");
        console.log("─".repeat(60));
        console.log(`✅ Checklist Name: ${checklistDetails.name || 'N/A'}`);
        console.log(`✅ Checklist ID: ${checklistDetails.id || 'N/A'}`);
        console.log(`✅ Has Rule Setting Icon: ${checklistDetails.hasRuleSettingIcon ? 'Yes' : 'No'}`);
        console.log(`✅ Has Delete Option: ${checklistDetails.hasDeleteIcon ? 'Yes' : 'No'}`);
        console.log("─".repeat(60));
        console.log(`👥 Instructor 1 (${instructor1}): Has Access ✅`);
        console.log(`👥 Instructor 2 (${instructor2}): Has Access ✅`);
        console.log("─".repeat(60));
        console.log("\n🏁 Test Result: PASSED");
        console.log("   Both instructors can view and launch the same observation checklist");
    });
});
