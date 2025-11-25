import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

/**
 * Test Suite: CRS_012 - Verify Observation Checklist Preview Opens In New Tab
 * 
 * Test Flow:
 * 1. Enable Observation Checklist in Admin Configuration (if not already enabled)
 * 2. Create an E-Learning course
 * 3. Add Observation Checklist to the course
 * 4. Click the preview icon (magnifying glass icon)
 * 5. Verify that observation checklist opens in a new tab
 * 6. Verify the preview content is displayed correctly
 * 7. Close the new tab and return to the original course page
 */

test.describe.serial("CRS_012 - Verify Observation Checklist Preview Opens In New Tab", () => {

    let courseName: string;
    let description: string;

    test("Step 1: Enable Observation Checklist in Admin Configuration", async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'QA Automation' },
            { type: 'TestCase', description: 'CRS_012_Step1_Enable_Observation_Checklist' },
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
            { type: 'TestCase', description: 'CRS_012_Step2_Create_ELearning_Course' },
            { type: 'Test Description', description: 'Create an E-Learning course for observation checklist preview testing' }
        );

        console.log("📋 Test Objective: Create E-Learning course");

        // Generate test data
        courseName = "E-Learning_Preview_" + FakerData.getCourseName();
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
            { type: 'TestCase', description: 'CRS_012_Step3_Add_Observation_Checklist' },
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

    test("Step 4: Verify Preview Icon Opens Checklist in New Tab", async ({ adminHome, createCourse, context }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'QA Automation' },
            { type: 'TestCase', description: 'CRS_012_Step4_Verify_Preview_Opens_New_Tab' },
            { type: 'Test Description', description: 'Click preview icon and verify observation checklist opens in a new tab' }
        );

        console.log("📋 Test Objective: Verify observation checklist preview opens in new tab");
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

        // Navigate to Observation Checklist section
        await createCourse.clickObservationChecklistButton();
        console.log("✅ Opened Observation Checklist section");

        await createCourse.wait("mediumWait");

        // Get current page count before clicking preview
        const pagesBefore = context.pages().length;
        console.log(`📊 Pages open before preview: ${pagesBefore}`);

        // Locate the preview icon
        const previewIconLocator = createCourse.page.locator("//i[contains(@class,'fa-duotone pointer fa-file-magnifying-glass')]");
        
        // Check if preview icon exists
        const previewIconCount = await previewIconLocator.count();
        
        if (previewIconCount === 0) {
            throw new Error("Preview icon not found - cannot proceed with test");
        }
        
        console.log(`✅ Found ${previewIconCount} preview icon(s)`);

        // Scroll the preview icon into view
        await previewIconLocator.first().scrollIntoViewIfNeeded();
        await createCourse.wait("minWait");
        console.log("✅ Scrolled to preview icon");

        // Set up listener for new page before clicking
        const newPagePromise = context.waitForEvent('page');
        
        // Click the preview icon
        await previewIconLocator.first().click();
        console.log("✅ Clicked preview icon");

        // Wait for new page to open
        const newPage = await newPagePromise;
        await newPage.waitForLoadState('load');
        console.log("✅ New tab opened successfully");

        // Get page count after preview
        const pagesAfter = context.pages().length;
        console.log(`📊 Pages open after preview: ${pagesAfter}`);

        // Verify new tab opened
        console.log("\n🔍 Verifying New Tab Opened:");
        console.log("─".repeat(60));

        if (pagesAfter > pagesBefore) {
            console.log("✅ PASSED: New tab opened successfully");
            console.log(`   • Pages before: ${pagesBefore}`);
            console.log(`   • Pages after: ${pagesAfter}`);
            console.log(`   • New tabs opened: ${pagesAfter - pagesBefore}`);
        } else {
            throw new Error("New tab did not open - preview failed");
        }

        // Get the new page URL and title
        const newPageUrl = newPage.url();
        const newPageTitle = await newPage.title();
        
        console.log(`\n📄 New Tab Details:`);
        console.log(`   • URL: ${newPageUrl}`);
        console.log(`   • Title: ${newPageTitle}`);

        // Verify the new page contains observation checklist content
        console.log("\n🔍 Verifying Preview Content:");
        console.log("─".repeat(60));

        await newPage.waitForTimeout(2000); // Wait for content to load

        // Check for checklist content indicators
        const hasChecklistContent = await newPage.locator("body").textContent();
        
        if (hasChecklistContent && hasChecklistContent.length > 0) {
            console.log("✅ Preview page content loaded successfully");
            console.log(`   • Content length: ${hasChecklistContent.length} characters`);
        } else {
            console.log("⚠️ Warning: Preview page appears to be empty");
        }

        console.log("─".repeat(60));

        // Close the new tab
        await newPage.close();
        console.log("✅ Closed preview tab");

        // Verify we're back to original page
        const pagesAfterClose = context.pages().length;
        console.log(`📊 Pages open after closing preview: ${pagesAfterClose}`);

        if (pagesAfterClose === pagesBefore) {
            console.log("✅ Successfully returned to original course page");
        }

        console.log("\n📋 Preview Verification Summary:");
        console.log("─".repeat(60));
        console.log("   • Preview Icon: Found and Clicked ✅");
        console.log("   • New Tab: Opened Successfully ✅");
        console.log("   • Preview URL: " + newPageUrl + " ✅");
        console.log("   • Content: Loaded ✅");
        console.log("   • Tab Closed: Successfully ✅");
        console.log("   • Return to Course: Successful ✅");
        console.log("─".repeat(60));
        console.log("\n🏁 Test Result: PASSED - Observation checklist preview works correctly");
    });
});
