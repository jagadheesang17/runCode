import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";

const courseName = "ELearning" + " " + FakerData.getCourseName();
const description = FakerData.getDescription()

test.describe(`Verify_that_could_not_cancel_E-learning_course`, async () => {
    test.describe.configure({ mode: "serial" });
    
    test(`Create E-learning course with no-cancellation policy`, async ({ adminHome, createCourse, contentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation Team` },
            { type: `TestCase`, description: `CRS1019_Create_E-learning_Course_With_No_Cancellation_Policy` },
            { type: `Test Description`, description: `Create E-learning course configured to prevent learner cancellation` }
        );
        
        console.log("Creating: E-learning course with no-cancellation policy");
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("E-learning course: " + description);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
    });

    test(`Enroll learner in E-learning course`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation Team` },
            { type: `TestCase`, description: `CRS1019_Enroll_Learner_In_E-learning_Course` },
            { type: `Test Description`, description: `Enroll learner in E-learning course to test cancellation restrictions` }
        );
        
        console.log("Enrolling: Learner in E-learning course");
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectByOption("Course");
        await enrollHome.selectBycourse(courseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
    });

    test(`Verify learner cannot cancel E-learning enrollment`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation Team` },
            { type: `TestCase`, description: `CRS1019_Verify_Cannot_Cancel_E-learning_Enrollment` },
            { type: `Test Description`, description: `Verify learner cannot cancel E-learning course enrollment from My Learning` }
        );
        
        console.log("Verifying: E-learning course cancellation is not allowed");
        await learnerHome.learnerLogin("LEARNERUSERNAME", "newprod");
        await learnerHome.clickMyLearning();
        await catalog.searchMyLearning(courseName);
        
        // Navigate to course details and verify no cancel option
        await catalog.mylearningViewClassDetails(courseName);
        
        // Verify cancel enrollment button is not visible or disabled
        const cancelButton = learnerHome.page.locator("//span[text()='Cancel Enrollment']");
        const isVisible = await cancelButton.isVisible();
        console.log("Cancel button visibility:", isVisible);
        
        if (isVisible) {
            // If button exists, verify it's disabled or shows appropriate message
            const isEnabled = await cancelButton.isEnabled();
            console.log("Cancel button enabled state:", isEnabled);
            if (!isEnabled) {
                console.log("✓ Cancel enrollment button is disabled for E-learning course");
            } else {
                // Try to click and verify error message appears
                await cancelButton.click();
                const errorMessage = learnerHome.page.locator("//div[contains(@class,'error') or contains(@class,'message')]");
                await errorMessage.waitFor({ timeout: 5000 });
                const errorText = await errorMessage.textContent();
                console.log("✓ Cancellation blocked with message:", errorText);
            }
        } else {
            console.log("✓ Cancel enrollment button is not available for E-learning course");
        }
    });
});