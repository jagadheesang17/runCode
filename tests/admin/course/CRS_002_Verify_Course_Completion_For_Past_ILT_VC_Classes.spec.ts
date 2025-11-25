import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { credentials } from "../../../constants/credentialData";

const iltCourseName = "Past ILT Course " + FakerData.getFirstName();
const vcCourseName = "Past VC Course " + FakerData.getFirstName();
const instructorName = credentials.INSTRUCTORNAME.username;

test.describe(`CRS_002: Verify Course Completion for Past ILT and VC Classes`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create Past ILT Course and Mark as Complete`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `CRS_002_Step1: Past ILT Course Creation and Completion` },
            { type: `Test Description`, description: `Create past ILT course with instance and mark as complete` }
        );

        console.log(`📋 Test Objective: Verify past ILT class can be marked as complete`);
        console.log(`🎯 ILT Course Name: ${iltCourseName}`);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        console.log(`👤 Logged in as Customer Admin`);

        // Navigate to Create Course
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        console.log(`🗂️ Navigated to Create Course page`);

        // Create ILT Course
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", iltCourseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a past ILT course: " + iltCourseName);
        await createCourse.selectdeliveryType("Classroom");
        console.log(`✅ Selected ILT delivery type`);

        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown();
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();

        // Save course
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`📋 ILT Course created successfully: ${iltCourseName}`);

        // Add past instance/class
        await createCourse.clickEditCourseTabs();
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        
        await createCourse.enterSessionName("Session_" + iltCourseName);
        await createCourse.setMaxSeat();
        await createCourse.enterpastDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.clickHideinCatalog();
        
        console.log(`✅ Past ILT Instance details entered (Hide in Catalog enabled)`);

        // Save instance
        await createCourse.clickUpdate();
       // await createCourse.verifySuccessMessage();
        console.log(`✅ Past ILT Instance created successfully`);

        // Navigate back to edit course view
        await createCourse.editcourse();
        await createCourse.wait("mediumWait");
        console.log(`📝 Opened course in edit mode`);

        // Verify Complete button is available
        const completeButtonExists = await createCourse.verifyCompleteButtonExists();
        
        if (completeButtonExists) {
            console.log(`✅ SUCCESS: Complete button IS available for past ILT class`);
        } else {
            console.log(`❌ FAILED: Complete button is NOT available for past ILT class`);
            throw new Error("Complete button should be available for past ILT classes");
        }

        console.log(`\n📋 Past ILT Course Summary:`);
        console.log(`   • Course Name: ${iltCourseName}`);
        console.log(`   • Delivery Type: ILT (Past)`);
        console.log(`   • Complete Button Available: ✅ Yes`);
    });

    test(`Step 2: Perform Past ILT Course Completion`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `CRS_002_Step2: Past ILT Course Completion` },
            { type: `Test Description`, description: `Mark past ILT course as complete and verify` }
        );

        console.log(`✅ Test Objective: Mark past ILT course as complete`);
        console.log(`🎯 Target Course: ${iltCourseName}`);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        console.log(`👤 Logged in as Customer Admin`);

        // Navigate to course
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        console.log(`🗂️ Navigated to Course Listing`);

        // Search for ILT course
        await createCourse.searchCourse(iltCourseName);
        console.log(`🔍 Searched for course: ${iltCourseName}`);

        // Click edit icon to open course
        await createCourse.clickEditIcon();
        await createCourse.wait("mediumWait");
        console.log(`✅ Opened course for editing`);
        
        // Scroll to the instance title and click it to open instance edit view
        const instanceTitleLocator = `//div[@title='${iltCourseName}']`;
        await createCourse.page.locator(instanceTitleLocator).scrollIntoViewIfNeeded();
        await createCourse.wait("minWait");
        await createCourse.page.locator(instanceTitleLocator).click();
        console.log(`📝 Clicked on instance to open instance edit view`);

        await createCourse.wait("mediumWait");
        await createCourse.spinnerDisappear();

        // Perform completion
        await createCourse.completeCourse();
        
        console.log(`\n🎯 Past ILT Course Completion Summary:`);
        console.log(`   • Course Name: ${iltCourseName}`);
        console.log(`   • Status: Completed successfully ✅`);
        console.log(`🏁 Test Result: PASSED - Past ILT course completion completed`);
    });

    test(`Step 3: Create Past VC Course and Mark as Complete`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `CRS_002_Step3: Past VC Course Creation and Completion` },
            { type: `Test Description`, description: `Create past Virtual Class course with instance and mark as complete` }
        );

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

        // Navigate back to edit course view
        await createCourse.editcourse();
        await createCourse.wait("mediumWait");
        console.log(`📝 Opened course in edit mode`);

        // Verify Complete button is available
        const completeButtonExists = await createCourse.verifyCompleteButtonExists();
        
        if (completeButtonExists) {
            console.log(`✅ SUCCESS: Complete button IS available for past Virtual Class`);
        } else {
            console.log(`❌ FAILED: Complete button is NOT available for past Virtual Class`);
            throw new Error("Complete button should be available for past Virtual Class");
        }

        console.log(`\n📋 Past VC Course Summary:`);
        console.log(`   • Course Name: ${vcCourseName}`);
        console.log(`   • Delivery Type: Virtual Class (Past)`);
        console.log(`   • Complete Button Available: ✅ Yes`);
    });

    test(`Step 4: Perform Past VC Course Completion`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `CRS_002_Step4: Past VC Course Completion` },
            { type: `Test Description`, description: `Mark past Virtual Class course as complete and verify` }
        );

        console.log(`✅ Test Objective: Mark past Virtual Class course as complete`);
        console.log(`🎯 Target Course: ${vcCourseName}`);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        console.log(`👤 Logged in as Customer Admin`);

        // Navigate to course
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        console.log(`🗂️ Navigated to Course Listing`);

        // Search for VC course
        await createCourse.searchCourse(vcCourseName);
        console.log(`🔍 Searched for course: ${vcCourseName}`);

        // Click edit icon to open course
        await createCourse.clickEditIcon();
        await createCourse.wait("mediumWait");
        console.log(`✅ Opened course for editing`);
        
        // Scroll to the instance title and click it to open instance edit view
        const instanceTitleLocator = `//div[@title='${vcCourseName}']`;
        await createCourse.page.locator(instanceTitleLocator).scrollIntoViewIfNeeded();
        await createCourse.wait("minWait");
        await createCourse.page.locator(instanceTitleLocator).click();
        console.log(`📝 Clicked on instance to open instance edit view`);

        await createCourse.wait("mediumWait");
        await createCourse.spinnerDisappear();

        // Perform completion
        await createCourse.completeCourse();
        
        console.log(`\n🎯 Past VC Course Completion Summary:`);
        console.log(`   • Course Name: ${vcCourseName}`);
        console.log(`   • Status: Completed successfully ✅`);
        console.log(`🏁 Test Result: PASSED - Past VC course completion completed`);
        
        console.log(`\n🎯 Final Test Summary:`);
        console.log(`   ✅ Past ILT Course: Complete button available and working`);
        console.log(`   ✅ Past Virtual Class Course: Complete button available and working`);
        console.log(`🏁 Test Result: PASSED - Completion option is available for past ILT/VC classes`);
    });
});
