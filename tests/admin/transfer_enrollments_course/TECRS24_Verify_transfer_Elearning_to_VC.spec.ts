import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const elInstanceName = ("Elearning_" + FakerData.getCourseName());
const vcInstanceName = ("VCInstance_" + FakerData.getCourseName());
const instructorName = credentials.INSTRUCTORNAME.username;
let instanceNames: string[] = [];

test.describe.serial(`TECRS24 - Verify that able to transfer users from E-learning to VC class of the same course`, async () => {

    test(`Create multi-instance course with E-learning and VC instances`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS24 - Step 1: Create Course with E-learning and VC Instances` },
            { type: `Test Description`, description: `Create course with E-learning and Virtual Class instances` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.selectdeliveryType("Classroom");
        await createCourse.typeDescription(description);
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

        // Add E-learning instance
        await createCourse.clickEditCourseTabs();
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("E-Learning");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", elInstanceName);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

        // Add VC instance
        await createCourse.clickEditCourseTabs();
        await createCourse.clicLickToSwitchCrsPage();
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Virtual Class");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", vcInstanceName);
        await createCourse.setMaxSeat();
        await createCourse.enterSessionName(vcInstanceName);
        await createCourse.sessionType();
        await createCourse.presenterUrl();
        await createCourse.attendeeUrl();
        await createCourse.vcSessionTimeZone("kolkata");
        await createCourse.enterDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    });

    test(`Enroll learner in E-learning instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS24 - Step 2: Enroll Learner in E-learning Instance` },
            { type: `Test Description`, description: `Enroll learner in E-learning instance` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");

        await enrollHome.selectBycourse(elInstanceName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();

        console.log(`✅ Learner enrolled in E-learning instance: ${instanceNames[0]}`);
    });


    test(`Transfer learner from E-learning to VC instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS24 - Step 4: Transfer from E-learning to VC` },
            { type: `Test Description`, description: `Transfer learner from E-learning instance to VC instance` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");

        await enrollHome.selectEnrollmentOption("Transfer Enrollment - Course");
        await enrollHome.searchCourseForTransfer(courseName);
        await enrollHome.clearFilterCrossMarks();
        await enrollHome.selectSourceInstance(elInstanceName);
        await enrollHome.selectTargetInstance(vcInstanceName);
        await enrollHome.selectlearner();
        await enrollHome.wait("minWait");

        await enrollHome.verifyLearnerStatusInTransferEnrollmentPage(credentials.LEARNERUSERNAME.username, "Enrolled");
        await enrollHome.selectLearnerForTransfer(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickTransferButton();
        await enrollHome.wait("minWait");
        await enrollHome.verifyTransferSuccessMessage();

        console.log(`✅ Transfer completed: E-learning → VC (${instanceNames[0]} → ${instanceNames[1]})`);
    });

    test(`Learner verifies enrollment in VC instance after transfer`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS24 - Step 5: Learner Verification After Transfer` },
            { type: `Test Description`, description: `Verify learner now sees VC instance in My Learning` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.wait("mediumWait");
        await learnerHome.clickMyLearning();
        await catalog.searchMyLearning(vcInstanceName);
        await catalog.verifyEnrolledCourseByTitle(vcInstanceName);
        await catalog.verifyCompletedCourse("Enrolled");
    });

});
