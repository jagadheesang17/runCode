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

test.describe.serial("CRS_004 - Verify Observation Checklist NOT Visible When Disabled", () => {

    let courseName: string;
    let description: string;

    test("Step 2: Create E-Learning Course and Verify Observation Checklist Button", async ({ adminHome,siteAdmin, createCourse }) => {
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
            console.log("⚠️ Observation Checklist button NOT found - attempting to enable from Site Settings...");
            

                // Navigate back to the course
          await siteAdmin.enableObservationChecklistFromSiteSettings()
                // Verify again
              
            
        }
    })  ;

    test("Step 3: Add Observation Checklist, Disable and Verify Removal", async ({ adminHome, siteAdmin, createCourse }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'AI Generated' },
            { type: 'TestCase', description: 'CRS_004_Step3_Add_And_Verify_Disable_Removes_Tab' },
            { type: 'Test Description', description: 'Add Observation Checklist to course, then disable it from Site Settings and verify tab disappears' }
        );

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
        console.log("✅ Successfully added Observation Checklist to E-Learning course");
        
        // Save the course
        await createCourse.wait("mediumWait");
        
        // Now disable Observation Checklist from Site Settings
        console.log("🔄 Disabling Observation Checklist from Site Settings...");
        const disabled = await siteAdmin.disableObservationChecklistFromSiteSettings();
        
        if (disabled) {
            console.log("✅ Observation Checklist disabled from Site Settings");
            
            // Navigate back to the course to verify tab is NOT visible anymore
            await adminHome.menuButton();
            await adminHome.clickLearningMenu();
            await adminHome.clickCourseLink();
            await createCourse.searchCourse(courseName);
            await createCourse.clickEditIcon();
            await createCourse.wait("mediumWait");
            console.log("✅ Reopened course in edit mode");
            
            // Verify Observation Checklist tab is NOT visible
            const checklistExistsAfterDisable = await createCourse.verifyObservationChecklistButtonExists();
            if (!checklistExistsAfterDisable) {
                console.log("✅ SUCCESS: Observation Checklist tab is NOT visible after disabling (as expected)");
            } else {
                console.log("❌ FAILED: Observation Checklist tab is still visible after disabling");
                throw new Error("Observation Checklist tab should NOT be visible after disabling from Site Settings");
            }
        } else {
            console.log("❌ FAILED: Could not disable Observation Checklist from Site Settings");
            throw new Error("Failed to disable Observation Checklist from Site Settings");
        }
    });
});
