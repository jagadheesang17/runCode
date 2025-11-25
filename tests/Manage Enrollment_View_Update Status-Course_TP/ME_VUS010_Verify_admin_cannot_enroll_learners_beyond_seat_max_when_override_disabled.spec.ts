import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
import { credentials } from "../../constants/credentialData";

const classroomCourseName = "ClassSeatMax_" + FakerData.getCourseName();
const description = FakerData.getDescription();
const learner1 = credentials.LEARNERUSERNAME.username;
const learner2 = credentials.LEARNERUSERNAME2?.username || credentials.TEAMUSER2?.username || "learner2@example.com";
const learner3 = credentials.TEAMUSER1.username;

test.describe(`ME_VUS010_Verify_admin_cannot_enroll_learners_beyond_seat_max_when_override_disabled`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Test 1: Disable seat max override in site settings`, async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS010_TC001 - Disable seat max override` },
            { type: `Test Description`, description: `Disable seat max override in Business Rules` }
        );

        console.log(`🔄 Disabling seat max override...`);
        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.isSignOut();
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await adminHome.siteAdmin_Adminconfig();
        await siteAdmin.clickBusinessRulesEditIcon();
        await siteAdmin.maxSeatOverRideInBusinessRules('Uncheck');
        console.log(`✅ Seat max override disabled`);
    });

    test(`Test 2: Create classroom course with seat max 2`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS010_TC002 - Create classroom course` },
            { type: `Test Description`, description: `Create classroom course with seat max set to 2` }
        );

        console.log(`🔄 Creating classroom course with seat max = 2...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", classroomCourseName);
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
        console.log(`✅ Classroom course created: ${classroomCourseName}`);

        console.log(`🔄 Creating class session with seat max = 2...`);
        await createCourse.editcourse();
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        await createCourse.enterSessionName(classroomCourseName);
        await createCourse.enterfutureDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor("Instructor");
        await createCourse.selectLocation();
        await createCourse.page.locator("//input[@data-id='seat-max']").fill("2");
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Class session created with seat max = 2`);
    });

    test(`Test 3: Enroll first learner (1/2 seats)`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS010_TC003 - Enroll first learner` },
            { type: `Test Description`, description: `Enroll first learner successfully (1 out of 2 seats)` }
        );

        console.log(`🔄 Enrolling first learner (1/2 seats)...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(classroomCourseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(learner1);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        console.log(`✅ First learner enrolled: ${learner1} (1/2 seats used)`);
    });

    test(`Test 4: Enroll second learner (2/2 seats)`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS010_TC004 - Enroll second learner` },
            { type: `Test Description`, description: `Enroll second learner successfully (2 out of 2 seats - full)` }
        );

        console.log(`🔄 Enrolling second learner (2/2 seats - full)...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(classroomCourseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(learner2);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        console.log(`✅ Second learner enrolled: ${learner2} (2/2 seats - FULL)`);
    });

    test(`Test 5: Verify cannot enroll third learner - seats full`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS010_TC005 - Cannot enroll beyond seat max` },
            { type: `Test Description`, description: `Verify admin cannot enroll third learner when seat max override is disabled and seats are full` }
        );

        console.log(`🔄 Attempting to enroll third learner (should fail - no seats)...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(classroomCourseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(learner3);
        await enrollHome.clickEnrollBtn();
        
        // Verify error message - seat max popup
        await enrollHome.verifyMaxSeatPopup(); // Expects "only for 0 users" message
        console.log(`✅ PASS: Cannot enroll third learner - seat max reached and override disabled`);
    });
});