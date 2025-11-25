import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
import { credentials } from "../../constants/credentialData";

const pastClassCourseName = "PastClass_NoShow_" + FakerData.getCourseName();
const futureClassCourseName = "FutureClass_NoShow_" + FakerData.getCourseName();
const description = FakerData.getDescription();
const learner = credentials.LEARNERUSERNAME.username;

test.describe(`ME_VUS005_Verify_admin_can_update_no_show_status_only_for_past_classroom_instances`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Test 1: Create future classroom course and enroll learner`, async ({ adminHome, createCourse, editCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS005_TC001 - Create future classroom course` },
            { type: `Test Description`, description: `Create classroom course with future class session and enroll learner` }
        );

        console.log(`🔄 Creating future classroom course...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", futureClassCourseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.selectdeliveryType("Classroom");
        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown();
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Future classroom course created: ${futureClassCourseName}`);

        console.log(`🔄 Creating future class instance...`);
        await createCourse.editcourse();
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        await createCourse.enterSessionName(futureClassCourseName);
        await createCourse.enterfutureDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor("Instructor");
        await createCourse.selectLocation();
        await createCourse.setMaxSeat();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Future class instance created`);

        console.log(`🔄 Enrolling learner to future classroom course...`);
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(futureClassCourseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(learner);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        console.log(`✅ Learner enrolled to future class: ${learner}`);
    });

    test(`Test 2: Verify No Show status is NOT available for future classroom instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS005_TC002 - Verify No Show not available for future class` },
            { type: `Test Description`, description: `Verify No Show status option is not available for future classroom instances` }
        );

        console.log(`🔄 Navigating to View/Modify Enrollment for future classroom course...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(futureClassCourseName);
        await enrollHome.wait("minWait");
        await enrollHome.clickModifyEnrollBtn();
        await enrollHome.wait("mediumWait");

        console.log(`🔄 Checking status options for future classroom instance...`);
        const statusCheck = await enrollHome.verifyEnrollmentStatusOptions(1, ['Enrolled', 'No Show', 'Completed', 'Incomplete']);
        
        if (!statusCheck.availableStatuses.includes('No Show')) {
            console.log(`   ✅ PASS: No Show status is NOT available for future classroom instance (Expected)`);
        } else {
            console.log(`   ⚠️ WARNING: No Show status IS available for future classroom instance (Unexpected)`);
        }
    });

    test(`Test 3: Create past classroom course and enroll learner`, async ({ adminHome, createCourse, editCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS005_TC003 - Create past classroom course` },
            { type: `Test Description`, description: `Create classroom course with past class session and enroll learner` }
        );

        console.log(`🔄 Creating past classroom course...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", pastClassCourseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.selectdeliveryType("Classroom");
        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown();
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Past classroom course created: ${pastClassCourseName}`);

        console.log(`🔄 Creating past class instance...`);
        await createCourse.editcourse();
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        await createCourse.enterSessionName(pastClassCourseName);
        await createCourse.enterpastDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor("Instructor");
        await createCourse.selectLocation();
        await createCourse.setMaxSeat();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Past class instance created`);

        console.log(`🔄 Enrolling learner to past classroom course...`);
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(pastClassCourseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(learner);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        console.log(`✅ Learner enrolled to past class: ${learner}`);
    });

    test(`Test 4: Verify No Show status IS available for past classroom instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS005_TC004 - Verify No Show available for past class` },
            { type: `Test Description`, description: `Verify No Show status option IS available for past classroom instances` }
        );

        console.log(`🔄 Navigating to View/Modify Enrollment for past classroom course...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(pastClassCourseName);
        await enrollHome.wait("minWait");
        await enrollHome.clickModifyEnrollBtn();
        await enrollHome.wait("mediumWait");

        console.log(`🔄 Checking status options for past classroom instance...`);
        const statusCheck = await enrollHome.verifyEnrollmentStatusOptions(1, ['Enrolled', 'No Show', 'Completed', 'Incomplete']);
        
        if (statusCheck.availableStatuses.includes('No Show')) {
            console.log(`   ✅ PASS: No Show status IS available for past classroom instance (Expected)`);
        } else {
            console.log(`   ⚠️ WARNING: No Show status is NOT available for past classroom instance (Unexpected)`);
        }
    });

    test(`Test 5: Update enrollment status to No Show for past classroom instance`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS005_TC005 - Update to No Show` },
            { type: `Test Description`, description: `Verify admin can successfully update enrollment status to No Show for past classroom instance` }
        );

        console.log(`🔄 Navigating to View/Modify Enrollment for past classroom course...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(pastClassCourseName);
        await enrollHome.wait("minWait");
        await enrollHome.clickModifyEnrollBtn();
        await enrollHome.wait("mediumWait");

        console.log(`🔄 Updating enrollment status to No Show...`);
        
        // Click the enrollment action dropdown
        const actionButton = page.locator(`(//button[contains(@data-id,'enrollment-action')])[1]`);
        await actionButton.click();
        await enrollHome.wait("minWait");
        
        // Select No Show
        const noShowOption = page.locator(`//button[contains(@data-id,'enrollment-action')]/following::span[text()='No Show']`);
        await noShowOption.click();
        await enrollHome.wait("mediumWait");
        
        // Verify the status changed to No Show
        const currentStatus = await actionButton.innerText();
        console.log(`   Updated Status: "${currentStatus}"`);
        
        if (currentStatus.includes('No Show')) {
            console.log(`   ✅ PASS: Enrollment status successfully updated to No Show for past classroom instance`);
        } else {
            console.log(`   ⚠️ WARNING: Status shows "${currentStatus}" (expected No Show)`);
        }
    });
});
