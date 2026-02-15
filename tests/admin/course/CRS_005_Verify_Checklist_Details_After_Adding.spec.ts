import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

/**
 * Test Suite: CRS_005 - Verify Checklist Details After Adding
 * 
 * Test Flow:
 * 1. Enable Observation Checklist in Admin Configuration (if not already enabled)
 * 2. Create an E-Learning course
 * 3. Add Observation Checklist to the course
 * 4. Verify checklist list includes:
 *    - Checklist Name
 *    - Checklist ID
 *    - Rule Setting Icon
 *    - Delete Option Icon
 */

test.describe.serial("CRS_005 - Verify Checklist Details After Adding", () => {

    let courseName: string;
    let description: string;

    test("Step 1: Create E-Learning Course and Check Observation Checklist", async ({ adminHome, siteAdmin, createCourse }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'AI Generated' },
            { type: 'TestCase', description: 'CRS_005_Step1_Create_Course_And_Check_Checklist' },
            { type: 'Test Description', description: 'Create an E-Learning course and verify Observation Checklist button is available' }
        );

        // Generate test data
        courseName = "E-Learning_ChecklistDetails_" + FakerData.getCourseName();
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

        // Navigate to edit course view to check for Observation Checklist button
        await createCourse.editcourse();
        await createCourse.wait("mediumWait");
        console.log("📝 Opened course in edit mode");

        // Check if Observation Checklist button exists
        const observationChecklistExists = await createCourse.verifyObservationChecklistButtonExists();
        
        if (observationChecklistExists) {
            console.log("✅ Observation Checklist button IS available - proceeding to add checklist");
        } else {
            console.log("⚠️ Observation Checklist button NOT found - enabling from Site Settings...");
            
            // Enable Observation Checklist from Site Settings
            const enabled = await siteAdmin.enableObservationChecklistFromSiteSettings();
            
            if (enabled) {
                console.log("✅ Observation Checklist enabled from Site Settings");
                
                // Navigate back to the course
                await adminHome.menuButton();
                await adminHome.clickLearningMenu();
                await adminHome.clickCourseLink();
                await createCourse.searchCourse(courseName);
                await createCourse.clickEditIcon();
                await createCourse.wait("mediumWait");
                
                // Verify again
                const checklistExistsAfterEnable = await createCourse.verifyObservationChecklistButtonExists();
                if (checklistExistsAfterEnable) {
                    console.log("✅ Observation Checklist button is now available");
                } else {
                    console.log("❌ FAILED: Observation Checklist button still not available after enabling");
                    throw new Error("Observation Checklist button should be available after enabling from Site Settings");
                }
            } else {
                console.log("❌ FAILED: Could not enable Observation Checklist from Site Settings");
                throw new Error("Failed to enable Observation Checklist from Site Settings");
            }
        }
    });

    test("Step 2: Add Observation Checklist and Verify Details", async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'AI Generated' },
            { type: 'TestCase', description: 'CRS_005_Step2_Add_And_Verify_Checklist_Details' },
            { type: 'Test Description', description: 'Add observation checklist to course and verify all details (name, ID, rule setting icon, delete icon) are displayed' }
        );

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

        // Verify all checklist details are present
        console.log("\n📋 Starting Checklist Details Verification...");
        
        const allElementsPresent = await createCourse.verifyAllChecklistElements(1);
        
        if (!allElementsPresent) {
            throw new Error("CHECKLIST VERIFICATION FAILED: Not all required elements are displayed. See detailed report above for missing elements.");
        }
        
        console.log("✅ Test Completed Successfully - All checklist elements verified");
    });
});
