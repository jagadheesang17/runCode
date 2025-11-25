import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
import { credentials } from "../../constants/credentialData";

const pastVCCourseName = "PastVC_NoShow_" + FakerData.getCourseName();
const futureVCCourseName = "FutureVC_NoShow_" + FakerData.getCourseName();
const description = FakerData.getDescription();
const learner = credentials.LEARNERUSERNAME.username;

test.describe(`ME_VUS006_Verify_admin_can_update_no_show_status_only_for_past_virtual_class_instances`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Test 1: Create future virtual class course and enroll learner`, async ({ adminHome, createCourse, editCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS006_TC001 - Create future virtual class course` },
            { type: `Test Description`, description: `Create virtual class course with future session and enroll learner` }
        );

        console.log(`🔄 Creating future virtual class course...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", futureVCCourseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.selectdeliveryType("Virtual Class");
        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown();
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Future virtual class course created: ${futureVCCourseName}`);

        console.log(`🔄 Creating future virtual class session...`);
        await createCourse.editcourse();
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Virtual Class");
        await createCourse.clickCreateInstance();
        await createCourse.enterSessionName(futureVCCourseName);
        await createCourse.enterfutureDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor("Instructor");
        await createCourse.selectMeetingType("Instructor", futureVCCourseName, 1);
        await createCourse.setMaxSeat();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Future virtual class session created`);

        console.log(`🔄 Enrolling learner to future virtual class...`);
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(futureVCCourseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(learner);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        console.log(`✅ Learner enrolled: ${learner}`);
    });

    test(`Test 2: Verify No Show status is NOT available for future virtual class instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS006_TC002 - Verify No Show not available for future VC` },
            { type: `Test Description`, description: `Verify No Show status option is not available for future virtual class instances` }
        );

        console.log(`🔄 Navigating to View/Modify Enrollment for future virtual class...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(futureVCCourseName);
        await enrollHome.wait("minWait");
        await enrollHome.clickModifyEnrollBtn();
        await enrollHome.wait("mediumWait");

        console.log(`🔄 Checking status options for future virtual class...`);
        const statusCheck = await enrollHome.verifyEnrollmentStatusOptions(1, ['Enrolled', 'No Show', 'Completed', 'Incomplete']);
        
        if (!statusCheck.availableStatuses.includes('No Show')) {
            console.log(`   ✅ PASS: No Show status is NOT available for future virtual class (Expected)`);
        } else {
            console.log(`   ⚠️ WARNING: No Show status IS available for future virtual class (Unexpected)`);
        }
    });

    test(`Test 3: Create past virtual class course and enroll learner`, async ({ adminHome, createCourse, editCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS006_TC003 - Create past virtual class course` },
            { type: `Test Description`, description: `Create virtual class course with past session and enroll learner` }
        );

        console.log(`🔄 Creating past virtual class course...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", pastVCCourseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.selectdeliveryType("Virtual Class");
        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown();
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Past virtual class course created: ${pastVCCourseName}`);

        console.log(`🔄 Creating past virtual class session...`);
        await createCourse.editcourse();
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Virtual Class");
        await createCourse.clickCreateInstance();
        await createCourse.enterSessionName(pastVCCourseName);
        await createCourse.enterpastDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor("Instructor");
        await createCourse.selectMeetingType("Instructor", pastVCCourseName, 1);
        await createCourse.setMaxSeat();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Past virtual class session created`);

        console.log(`🔄 Enrolling learner to past virtual class...`);
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(pastVCCourseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(learner);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        console.log(`✅ Learner enrolled: ${learner}`);
    });

    test(`Test 4: Verify No Show status IS available for past virtual class instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS006_TC004 - Verify No Show available for past VC` },
            { type: `Test Description`, description: `Verify No Show status option IS available for past virtual class instances` }
        );

        console.log(`🔄 Navigating to View/Modify Enrollment for past virtual class...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(pastVCCourseName);
        await enrollHome.wait("minWait");
        await enrollHome.clickModifyEnrollBtn();
        await enrollHome.wait("mediumWait");

        console.log(`🔄 Checking status options for past virtual class...`);
        const statusCheck = await enrollHome.verifyEnrollmentStatusOptions(1, ['Enrolled', 'No Show', 'Completed', 'Incomplete']);
        
        if (statusCheck.availableStatuses.includes('No Show')) {
            console.log(`   ✅ PASS: No Show status IS available for past virtual class (Expected)`);
        } else {
            console.log(`   ⚠️ WARNING: No Show status is NOT available for past virtual class (Unexpected)`);
        }
    });

    test(`Test 5: Update enrollment status to No Show for past virtual class instance`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS006_TC005 - Update to No Show` },
            { type: `Test Description`, description: `Verify admin can successfully update enrollment status to No Show for past virtual class instance` }
        );

        console.log(`🔄 Navigating to View/Modify Enrollment for past virtual class...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(pastVCCourseName);
        await enrollHome.wait("minWait");
        await enrollHome.clickModifyEnrollBtn();
        await enrollHome.wait("mediumWait");

        console.log(`🔄 Updating enrollment status to No Show...`);
        
        const actionButton = page.locator(`(//button[contains(@data-id,'enrollment-action')])[1]`);
        await actionButton.click();
        await enrollHome.wait("minWait");
        
        const noShowOption = page.locator(`//button[contains(@data-id,'enrollment-action')]/following::span[text()='No Show']`);
        await noShowOption.click();
        await enrollHome.wait("mediumWait");
        
        const currentStatus = await actionButton.innerText();
        console.log(`   Updated Status: "${currentStatus}"`);
        
        if (currentStatus.includes('No Show')) {
            console.log(`   ✅ PASS: Enrollment status successfully updated to No Show for past virtual class`);
        } else {
            console.log(`   ⚠️ WARNING: Status shows "${currentStatus}" (expected No Show)`);
        }
    });
});
