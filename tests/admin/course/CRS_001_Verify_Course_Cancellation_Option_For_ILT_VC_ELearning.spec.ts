import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { credentials } from "../../../constants/credentialData";

const iltCourseName = "ILT Course " + FakerData.getFirstName();
const vcCourseName = "VC Course " + FakerData.getFirstName();
const elearningCourseName = "ELearning Course " + FakerData.getFirstName();
const cancellationReason = "Class canceled due to low enrollment - " + FakerData.getDescription().substring(0, 50);
const instructorName = credentials.INSTRUCTORNAME.username;

test.describe(`CRS_001: Verify Course Cancellation Option Availability`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create ILT Course and Verify Cancel Button Availability`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `CRS_001_Step1: ILT Course Creation and Cancel Button Verification` },
            { type: `Test Description`, description: `Create ILT course with instance and verify cancel button is available` }
        );

        console.log(`📋 Test Objective: Verify Cancellation option is available for ILT classes`);
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
        await createCourse.typeDescription("This is a new ILT course: " + iltCourseName);
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

        // Add instance/class
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
        console.log(`✅ ILT Instance created successfully`);

        // Navigate back to edit course view to access Cancel button
        await createCourse.editcourse();
        await createCourse.wait("mediumWait");
        console.log(`📝 Opened course in edit mode`);

        // Verify Cancel button is available
        const cancelButtonExists = await createCourse.verifyCancelButtonExists();
        
        if (cancelButtonExists) {
            console.log(`✅ SUCCESS: Cancel button IS available for ILT class`);
            console.log(`🎯 Cancellation Option Verification: PASSED for ILT`);
        } else {
            console.log(`❌ FAILED: Cancel button is NOT available for ILT class`);
            throw new Error("Cancel button should be available for ILT classes");
        }

        console.log(`\n📋 ILT Course Summary:`);
        console.log(`   • Course Name: ${iltCourseName}`);
        console.log(`   • Delivery Type: ILT`);
        console.log(`   • Cancel Button Available: ✅ Yes`);
    });

    test(`Step 2: Perform ILT Course Cancellation`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `CRS_001_Step2: ILT Course Cancellation` },
            { type: `Test Description`, description: `Cancel ILT course and verify successful cancellation` }
        );

        console.log(`🚫 Test Objective: Cancel ILT course`);
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

        // Perform cancellation
        await createCourse.cancelCourse(cancellationReason);
        
        console.log(`\n🎯 ILT Course Cancellation Summary:`);
        console.log(`   • Course Name: ${iltCourseName}`);
        console.log(`   • Cancellation Reason: ${cancellationReason}`);
        console.log(`   • Status: Canceled successfully ✅`);
        console.log(`🏁 Test Result: PASSED - ILT course cancellation completed`);
    });

    test(`Step 3: Create VC Course and Verify Cancel Button Availability`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `CRS_001_Step3: VC Course Creation and Cancel Button Verification` },
            { type: `Test Description`, description: `Create Virtual Class course with instance and verify cancel button is available` }
        );

        console.log(`📋 Test Objective: Verify Cancellation option is available for Virtual Class`);
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
        await createCourse.typeDescription("This is a new Virtual Class course: " + vcCourseName);
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

        // Add instance/class
        await createCourse.clickEditCourseTabs();
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Virtual Class");
        await createCourse.clickCreateInstance();
        
        await createCourse.selectMeetingType(instructorName, vcCourseName, 1);
        await createCourse.typeAdditionalInfo();
        await createCourse.setMaxSeat();
        await createCourse.clickCatalog();
        
        console.log(`✅ Virtual Class Instance details entered`);

        // Save instance
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Virtual Class Instance created successfully`);

        // Navigate back to edit course view to access Cancel button
        await createCourse.editcourse();
        await createCourse.wait("mediumWait");
        console.log(`📝 Opened course in edit mode`);

        // Verify Cancel button is available
        const cancelButtonExists = await createCourse.verifyCancelButtonExists();
        
        if (cancelButtonExists) {
            console.log(`✅ SUCCESS: Cancel button IS available for Virtual Class`);
            console.log(`🎯 Cancellation Option Verification: PASSED for VC`);
        } else {
            console.log(`❌ FAILED: Cancel button is NOT available for Virtual Class`);
            throw new Error("Cancel button should be available for Virtual Class");
        }

        console.log(`\n📋 VC Course Summary:`);
        console.log(`   • Course Name: ${vcCourseName}`);
        console.log(`   • Delivery Type: Virtual Class`);
        console.log(`   • Cancel Button Available: ✅ Yes`);
    });

    test(`Step 4: Perform VC Course Cancellation`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `CRS_001_Step4: VC Course Cancellation` },
            { type: `Test Description`, description: `Cancel Virtual Class course and verify successful cancellation` }
        );

        console.log(`🚫 Test Objective: Cancel Virtual Class course`);
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

        // Perform cancellation
        await createCourse.cancelCourse(cancellationReason);
        
        console.log(`\n🎯 VC Course Cancellation Summary:`);
        console.log(`   • Course Name: ${vcCourseName}`);
        console.log(`   • Cancellation Reason: ${cancellationReason}`);
        console.log(`   • Status: Canceled successfully ✅`);
        console.log(`🏁 Test Result: PASSED - VC course cancellation completed`);
    });

    test(`Step 5: Create E-Learning Course and Verify Cancel Button NOT Available`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `CRS_001_Step5: E-Learning Course Creation and Cancel Button Verification` },
            { type: `Test Description`, description: `Create E-Learning course and verify cancel button is NOT available` }
        );

        console.log(`📋 Test Objective: Verify Cancellation option is NOT available for E-Learning classes`);
        console.log(`🎯 E-Learning Course Name: ${elearningCourseName}`);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        console.log(`👤 Logged in as Customer Admin`);

        // Navigate to Create Course
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        console.log(`🗂️ Navigated to Create Course page`);

        // Create E-Learning Course
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", elearningCourseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new E-Learning course: " + elearningCourseName);
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
        console.log(`📋 E-Learning Course created successfully: ${elearningCourseName}`);

        await createCourse.wait("mediumWait");

        // Verify Cancel button is NOT available
        const cancelButtonExists = await createCourse.verifyCancelButtonExists();
        
        if (!cancelButtonExists) {
            console.log(`✅ SUCCESS: Cancel button is NOT available for E-Learning class (as expected)`);
            console.log(`🎯 Cancellation Option Verification: PASSED for E-Learning`);
        } else {
            console.log(`❌ FAILED: Cancel button IS available for E-Learning class (should not be)`);
            throw new Error("Cancel button should NOT be available for E-Learning classes");
        }

        console.log(`\n📋 E-Learning Course Summary:`);
        console.log(`   • Course Name: ${elearningCourseName}`);
        console.log(`   • Delivery Type: E-Learning`);
        console.log(`   • Cancel Button Available: ❌ No (Correct - E-Learning should not have cancel option)`);
        
        console.log(`\n🎯 Final Test Summary:`);
        console.log(`   ✅ ILT Course: Cancel button available and working`);
        console.log(`   ✅ Virtual Class Course: Cancel button available and working`);
        console.log(`   ✅ E-Learning Course: Cancel button NOT available (correct behavior)`);
        console.log(`🏁 Test Result: PASSED - Cancellation option is only available for ILT/VC classes, not for E-Learning`);
    });
});
