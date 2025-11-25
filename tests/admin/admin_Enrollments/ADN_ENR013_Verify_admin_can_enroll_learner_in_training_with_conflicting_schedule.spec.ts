import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { credentials } from "../../../constants/credentialData";

/**
 * @description: Test suite to verify that admin can enroll learner in training with conflicting schedule
 * @author: Jagadish
 * @createdOn: November 21, 2025
 */

const course1Name = "ILT1_" + FakerData.getCourseName();
const course2Name = "ILT2_" + FakerData.getCourseName();
const session1Name = "Session1_" + FakerData.getSession();
const session2Name = "Session2_" + FakerData.getSession();
const description = FakerData.getDescription();
const instructorName = credentials.INSTRUCTORNAME.username;
const learnerUsername = credentials.LEARNERUSERNAME.username;

test.describe("Verify admin can enroll learner in training with conflicting schedule", () => {
    test.describe.configure({ mode: "serial" });

    test("Test 1: Create first ILT course with specific date and time", async ({ adminHome, createCourse, contentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ADN_ENR013_TC001 - Create First ILT Course` },
            { type: `Test Description`, description: `Create first ILT course with specific session date and time` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", course1Name);
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
        console.log(`✅ First ILT course created: ${course1Name}`);
    });

    test("Test 2: Add session to first ILT course", async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ADN_ENR013_TC002 - Add Session to First Course` },
            { type: `Test Description`, description: `Add session with specific date and time to first course` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.catalogSearch(course1Name);
        await createCourse.clickEditIcon();
        await createCourse.addInstances();

        async function addinstance(deliveryType: string) {
            await createCourse.selectInstanceDeliveryType(deliveryType);
            await createCourse.clickCreateInstance();
        }

        await addinstance("Classroom");
        await createCourse.enterSessionName(session1Name);
        await createCourse.setMaxSeat();
        await createCourse.enterDateValue(); // Sets tomorrow's date
        await createCourse.startandEndTime(); // Sets specific start and end time
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Session added to first course: ${session1Name}`);
    });

    test("Test 3: Admin enrolls learner in first ILT course", async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ADN_ENR013_TC003 - Enroll Learner in First Course` },
            { type: `Test Description`, description: `Admin enrolls learner in first ILT course to establish baseline schedule` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(course1Name);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(learnerUsername);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        console.log(`✅ Learner enrolled in first course: ${learnerUsername}`);
    });

    test("Test 4: Create second ILT course", async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ADN_ENR013_TC004 - Create Second ILT Course` },
            { type: `Test Description`, description: `Create second ILT course that will have conflicting schedule` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", course2Name);
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
        console.log(`✅ Second ILT course created: ${course2Name}`);
    });

    test("Test 5: Add session with same date and time to second course (conflicting schedule)", async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ADN_ENR013_TC005 - Add Conflicting Session` },
            { type: `Test Description`, description: `Add session with same date and time as first course to create schedule conflict` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.catalogSearch(course2Name);
        await createCourse.clickEditIcon();
        await createCourse.addInstances();

        async function addinstance(deliveryType: string) {
            await createCourse.selectInstanceDeliveryType(deliveryType);
            await createCourse.clickCreateInstance();
        }

        await addinstance("Classroom");
        await createCourse.enterSessionName(session2Name);
        await createCourse.setMaxSeat();
        await createCourse.enterDateValue(); // Sets same date as first course (tomorrow)
        await createCourse.startandEndTime(); // Sets same time as first course
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Conflicting session added to second course: ${session2Name}`);
    });

    test("Test 6: Verify admin can enroll learner in conflicting schedule", async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ADN_ENR013_TC006 - Admin Enroll with Conflict` },
            { type: `Test Description`, description: `Verify that admin can enroll learner in second course despite schedule conflict with first course` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(course2Name);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(learnerUsername);
        
        // Attempt enrollment
        await enrollHome.clickEnrollBtn();
        
        // Check for session conflict popup/warning
        await enrollHome.wait("minWait");
        const sessionConflictPopup = page.locator("//span[contains(text(),'Session has conflict') or contains(text(),'conflict') or contains(text(),'schedule conflict') or contains(text(),'overlapping')]");
        const isConflictPopupVisible = await sessionConflictPopup.isVisible();
        
        if (isConflictPopupVisible) {
            const conflictText = await sessionConflictPopup.textContent();
            console.log(`⚠️ Session conflict popup displayed: ${conflictText}`);
            
            // Click Yes/OK/Proceed button to confirm enrollment despite conflict
            const confirmButtons = [
                "//button[text()='Yes']",
                "//button[text()='OK']",
                "//button[text()='Proceed']",
                "//button[contains(text(),'Continue')]"
            ];
            
            for (const buttonSelector of confirmButtons) {
                const button = page.locator(buttonSelector);
                if (await button.isVisible()) {
                    await button.click();
                    console.log(`✅ Clicked confirmation button to proceed with conflicting enrollment`);
                    break;
                }
            }
            
            await enrollHome.wait("minWait");
        } else {
            console.log(`ℹ️ No session conflict popup - system allows enrollment directly`);
        }
        
        // Verify enrollment success
        await enrollHome.verifytoastMessage();
        console.log(`✅ Admin successfully enrolled learner in conflicting schedule: ${learnerUsername} in ${course2Name}`);
    });

    test("Test 7: Verify learner is enrolled in both courses", async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ADN_ENR013_TC007 - Verify Dual Enrollment` },
            { type: `Test Description`, description: `Verify that learner has both courses enrolled in My Learning despite schedule conflict` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickMyLearning();
        
        // Search and verify first course
        await catalog.searchMyLearning(course1Name);
        await catalog.verifyEnrolledCourseByTitle(course1Name);
        console.log(`✅ Learner has first course enrolled: ${course1Name}`);
        
        // Search and verify second course
        await catalog.searchMyLearning(course2Name);
        await catalog.verifyEnrolledCourseByTitle(course2Name);
        console.log(`✅ Learner has second course enrolled: ${course2Name}`);
        
        console.log(`✅ Verification complete: Learner successfully enrolled in both conflicting courses`);
    });
});
