import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { credentials } from "../../../constants/credentialData";

const courseName = "ILT_Cancel_" + FakerData.getCourseName();
const description = FakerData.getDescription();
const cancellationReason = "Class canceled due to low enrollment - " + FakerData.getDescription().substring(0, 50);
const instructorName = credentials.INSTRUCTORNAME.username;
let createdCode: string;

test.describe(`CRS_006: Verify ILT Course Cancellation with User Enrollment`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create ILT Course`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `CRS_006_Step1: Create ILT Course` },
            { type: `Test Description`, description: `Create an ILT course for enrollment and cancellation testing` }
        );

        console.log(`📋 Test Objective: Create ILT course for cancellation with enrollment`);
        console.log(`🎯 Course Name: ${courseName}`);

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
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new ILT course: " + courseName);
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
        console.log(`📋 ILT Course created successfully: ${courseName}`);

        // Add instance/class
        await createCourse.clickEditCourseTabs();
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        
        await createCourse.enterSessionName("Session_" + courseName);
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

        console.log(`\n📋 Course Creation Summary:`);
        console.log(`   • Course Name: ${courseName}`);
        console.log(`   • Delivery Type: ILT`);
        console.log(`   • Instance: Created with session`);
        console.log(`   • Status: Created Successfully ✅`)
    });

    test(`Step 2: Enroll User in ILT Course`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `CRS_006_Step2: Enroll User in Course` },
            { type: `Test Description`, description: `Admin enrolls a user in the ILT course` }
        );

        console.log(`📋 Test Objective: Enroll user in ILT course`);
        console.log(`👤 User to enroll: ${credentials.LEARNERUSERNAME.username}`);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        console.log(`👤 Logged in as Customer Admin`);

        // Navigate to Enrollment
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        console.log(`🗂️ Navigated to Enrollment page`);

        // Enroll user in course
        await enrollHome.selectBycourse(courseName);
        console.log(`✅ Selected course: ${courseName}`);

        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        console.log(`✅ Selected learner: ${credentials.LEARNERUSERNAME.username}`);

        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        console.log(`✅ User enrolled successfully`);

        console.log(`\n📋 Enrollment Summary:`);
        console.log(`   • Course Name: ${courseName}`);
        console.log(`   • Enrolled User: ${credentials.LEARNERUSERNAME.username}`);
        console.log(`   • Enrollment Status: Success ✅`);
    });

    test(`Step 3: Cancel ILT Course`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `CRS_006_Step3: Cancel ILT Course` },
            { type: `Test Description`, description: `Cancel ILT course that has an enrolled user` }
        );

        console.log(`🚫 Test Objective: Cancel ILT course with enrolled user`);
        console.log(`🎯 Target Course: ${courseName}`);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        console.log(`👤 Logged in as Customer Admin`);

        // Navigate to course
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        console.log(`🗂️ Navigated to Course Listing`);

        // Search for ILT course
        await createCourse.searchCourse(courseName);
        console.log(`🔍 Searched for course: ${courseName}`);

        // Click edit icon to open course
        await createCourse.clickEditIcon();
        await createCourse.wait("mediumWait");
        console.log(`✅ Opened course for editing`);
        
        // Scroll to the instance title and click it to open instance edit view
        const instanceTitleLocator = `//div[@title='${courseName}']`;
        await createCourse.page.locator(instanceTitleLocator).scrollIntoViewIfNeeded();
        await createCourse.wait("minWait");
        await createCourse.page.locator(instanceTitleLocator).click();
        console.log(`📝 Clicked on instance to open instance edit view`);

        await createCourse.wait("mediumWait");
        await createCourse.spinnerDisappear();

        // Perform cancellation
        await createCourse.cancelCourse(cancellationReason);
        
        console.log(`\n🎯 ILT Course Cancellation Summary:`);
        console.log(`   • Course Name: ${courseName}`);
        console.log(`   • Enrolled User: ${credentials.LEARNERUSERNAME.username}`);
        console.log(`   • Cancellation Reason: ${cancellationReason}`);
        console.log(`   • Status: Canceled successfully ✅`);
        console.log(`🏁 Test Result: PASSED - ILT course with enrollment canceled successfully`)
    });
});
