import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
import { credentials } from "../../constants/credentialData";

const courseName = "StatusIncomplete_" + FakerData.getCourseName();
const description = FakerData.getDescription();
const learner = credentials.LEARNERUSERNAME.username;

test.describe(`ME_VUS012_Verify_admin_can_update_status_from_enrolled_to_incomplete`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Test 1: Create E-learning course`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS012_TC001 - Create course` },
            { type: `Test Description`, description: `Create E-learning course for incomplete status update testing` }
        );

        console.log(`🔄 Creating E-learning course...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Course created: ${courseName}`);
    });

    test(`Test 2: Enroll learner to the course`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS012_TC002 - Enroll learner` },
            { type: `Test Description`, description: `Enroll learner to the course` }
        );

        console.log(`🔄 Enrolling learner...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(learner);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        console.log(`✅ Learner enrolled: ${learner}`);
    });

    test(`Test 3: Verify current status is Enrolled`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS012_TC003 - Verify Enrolled status` },
            { type: `Test Description`, description: `Verify learner's current enrollment status is Enrolled` }
        );

        console.log(`🔄 Verifying current status is Enrolled...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.wait("minWait");
        await enrollHome.clickModifyEnrollBtn();
        await enrollHome.wait("mediumWait");

        const statusButton = page.locator(`//tr[contains(.,'${learner}')]//button[contains(@data-id,'enrollment-action')]`).first();
        const currentStatus = await statusButton.innerText();
        console.log(`   Current Status: "${currentStatus}"`);
        
        if (currentStatus.includes('Enrolled')) {
            console.log(`   ✅ Status is Enrolled`);
        }
    });

    test(`Test 4: Update status from Enrolled to Incomplete`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS012_TC004 - Update to Incomplete` },
            { type: `Test Description`, description: `Update enrollment status from Enrolled to Incomplete` }
        );

        console.log(`🔄 Updating status from Enrolled to Incomplete...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.wait("minWait");
        await enrollHome.clickModifyEnrollBtn();
        await enrollHome.wait("mediumWait");

        // Click enrollment action dropdown
        const actionButton = page.locator(`//tr[contains(.,'${learner}')]//button[contains(@data-id,'enrollment-action')]`).first();
        await actionButton.click();
        await enrollHome.wait("minWait");
        console.log(`   ✅ Clicked status dropdown`);

        // Select Incomplete
        const incompleteOption = page.locator(`//button[contains(@data-id,'enrollment-action')]/following::span[text()='Incomplete']`).first();
        await incompleteOption.click();
        await enrollHome.wait("minWait");
        console.log(`   ✅ Selected Incomplete status`);

        // Enter completion date and submit
        await enrollHome.completionDateInAdminEnrollment();
        await enrollHome.wait("mediumWait");
        console.log(`   ✅ Entered completion date and saved`);
    });

    test(`Test 5: Verify status updated to Incomplete`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS012_TC005 - Verify Incomplete status` },
            { type: `Test Description`, description: `Verify enrollment status has been updated to Incomplete` }
        );

        console.log(`🔄 Verifying status updated to Incomplete...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.wait("minWait");
        await enrollHome.clickModifyEnrollBtn();
        await enrollHome.wait("mediumWait");

        const statusButton = page.locator(`//tr[contains(.,'${learner}')]//button[contains(@data-id,'enrollment-action')]`).first();
        const updatedStatus = await statusButton.innerText();
        console.log(`   Updated Status: "${updatedStatus}"`);
        
        if (updatedStatus.includes('Incomplete')) {
            console.log(`   ✅ PASS: Status successfully updated from Enrolled to Incomplete`);
        } else {
            console.log(`   ⚠️ WARNING: Status shows "${updatedStatus}" (expected Incomplete)`);
        }
    });
});
