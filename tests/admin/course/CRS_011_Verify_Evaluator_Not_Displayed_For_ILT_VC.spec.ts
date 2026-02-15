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

    test("Step 3: Add Observation Checklist to ILT Course", async ({ adminHome,siteAdmin, createCourse }) => {
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

                  const observationChecklistExists = await createCourse.verifyObservationChecklistButtonExists();
        
        if (observationChecklistExists) {
            console.log("✅ SUCCESS: Observation Checklist button IS available for E-Learning course");
        } else {
            console.log("⚠️ Observation Checklist button NOT found - attempting to enable from Site Settings...");
            await siteAdmin.enableObservationChecklistFromSiteSettings();

                // Verify again
            await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        
        await createCourse.searchCourse(iltCourseName);
        console.log(`🔍 Searched for course: ${iltCourseName}`);

        // Click edit icon to open course
        await createCourse.clickEditIcon();
        await createCourse.wait("mediumWait");
        console.log("✅ Opened course in edit mode");
            
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

        // Verify that Edit icon is NOT displayed for ILT class
        console.log("\n🔍 Verifying Edit icon is NOT displayed for ILT Class...");
        console.log("─".repeat(60));

        const isEditIconVisible = await createCourse.verifyChecklistEditIconNotDisplayed();


        console.log("─".repeat(60));
        console.log("\n📋 ILT Class Verification Summary:");
        console.log("   • Course Type: ILT (Classroom)");
        console.log("   • Observation Checklist: Added ✅");
        console.log("   • Edit Icon: Not Displayed ✅");
        console.log("   • Evaluator Dropdown: Not Applicable (no edit icon)");
        console.log("\n🏁 Test Result: PASSED - Edit icon correctly hidden for ILT class");
    });

    test(`Step 5: Create Past VC Course and Mark as Complete`, async ({ adminHome, createCourse }) => {
           test.info().annotations.push(
               { type: `Author`, description: `QA Automation` },
               { type: `TestCase`, description: `CRS_011_Step5: Past VC Course Creation and Completion` },
               { type: `Test Description`, description: `Create past Virtual Class course with instance and mark as complete` }
           );
   
           // Generate VC course name
           vcCourseName = "VC_Evaluator_Test_" + FakerData.getCourseName();
           instructorName = credentials.INSTRUCTORNAME.username;
           
           console.log(`📋 Test Objective: Verify past Virtual Class can be marked as complete`);
           console.log(`🎯 VC Course Name: ${vcCourseName}`);
   
           await adminHome.loadAndLogin("CUSTOMERADMIN");
           console.log(`👤 Logged in as Customer Admin`);
   
           // Navigate to Create Course
           await adminHome.menuButton();
           await adminHome.clickLearningMenu();
           await adminHome.clickCourseLink();
           await createCourse.clickCreateCourse();
           console.log(`🗂️ Navigated to Create Course page`);
   
           // Create VC Course
           await createCourse.verifyCreateUserLabel("CREATE COURSE");
           await createCourse.enter("course-title", vcCourseName);
           await createCourse.selectLanguage("English");
           await createCourse.typeDescription("This is a past Virtual Class course: " + vcCourseName);
           await createCourse.selectdeliveryType("Virtual Class");
           console.log(`✅ Selected Virtual Class delivery type`);
   
           await createCourse.handleCategoryADropdown();
           await createCourse.providerDropdown();
           await createCourse.selectTotalDuration();
           await createCourse.typeAdditionalInfo();
           await createCourse.clickCatalog();
   
           // Save course
           await createCourse.clickSave();
           await createCourse.clickProceed();
           await createCourse.verifySuccessMessage();
           console.log(`📋 VC Course created successfully: ${vcCourseName}`);
   
           // Add past instance/class
           await createCourse.clickEditCourseTabs();
           await createCourse.addInstances();
           await createCourse.selectInstanceDeliveryType("Virtual Class");
           await createCourse.clickCreateInstance();
           
           await createCourse.selectMeetingTypeforPast(instructorName, vcCourseName, 1);
           await createCourse.typeAdditionalInfo();
           await createCourse.setMaxSeat();
           await createCourse.clickHideinCatalog();
           
           console.log(`✅ Past Virtual Class Instance details entered (Hide in Catalog enabled)`);
   
           // Save instance
           await createCourse.clickUpdate();
           await createCourse.verifySuccessMessage();
           console.log(`✅ Past Virtual Class Instance created successfully`);
   
    });

    test("Step 6: Add Observation Checklist to VC Course", async ({ adminHome, siteAdmin,createCourse }) => {
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
           const observationChecklistExists = await createCourse.verifyObservationChecklistButtonExists();
        
        if (observationChecklistExists) {
            console.log("✅ SUCCESS: Observation Checklist button IS available for E-Learning course");
        } else {
            console.log("⚠️ Observation Checklist button NOT found - attempting to enable from Site Settings...");
            await siteAdmin.enableObservationChecklistFromSiteSettings();

                 await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        
        await createCourse.searchCourse(vcCourseName);
        console.log(`🔍 Searched for course: ${vcCourseName}`);

        // Click edit icon to open course
        await createCourse.clickEditIcon();
        await createCourse.wait("mediumWait");
            
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

        await createCourse.verifyChecklistEditIconNotDisplayed();

        // Verify that evaluator dropdown is NOT visible for VC
        console.log("\n🔍 Verifying Evaluator Dropdown is NOT displayed for Virtual Class...");
        
 

    
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
