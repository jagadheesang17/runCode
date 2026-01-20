import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const el1InstanceName = ("Elearning1_" + FakerData.getCourseName());
const el2InstanceName = ("Elearning2_" + FakerData.getCourseName());
let instanceNames: string[] = [];

test.describe.serial(`TECRS22 - Verify that able to transfer users from E-learning to E-learning class of the same course`, async () => {

    test(`Create multi-instance course with 2 E-learning instances`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS22 - Step 1: Create Course with 2 E-learning Instances` },
            { type: `Test Description`, description: `Create course with 2 E-learning instances` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.selectdeliveryType("Classroom");
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

        // Add E-learning instance 1
        await createCourse.clickEditCourseTabs();
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("E-Learning");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", el1InstanceName);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

        // Add E-learning instance 2
        await createCourse.editcourse();
        await createCourse.clicLickToSwitchCrsPage();
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("E-Learning");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", el2InstanceName);
        await createCourse.contentLibrary("AutoAudioFile");
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

    });

    test(`Enroll learner in first E-learning instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS22 - Step 2: Enroll Learner in E-learning Instance` },
            { type: `Test Description`, description: `Enroll learner in first E-learning instance` }
        );

       await adminHome.loadAndLogin("CUSTOMERADMIN");
               await adminHome.menuButton();
               await adminHome.clickEnrollmentMenu();
               await adminHome.clickEnroll();
               await enrollHome.wait("mediumWait");
       
               await enrollHome.selectBycourse(el1InstanceName);
               await enrollHome.clickSelectedLearner();
               await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
               await enrollHome.clickEnrollBtn();
               await enrollHome.verifytoastMessage();
    });

    });

    test(`Transfer learner from E-learning instance 1 to E-learning instance 2`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS22 - Step 4: Transfer from E-learning to E-learning` },
            { type: `Test Description`, description: `Transfer learner from first E-learning instance to second E-learning instance` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");
        
        await enrollHome.selectEnrollmentOption("Transfer Enrollment - Course");
        await enrollHome.searchCourseForTransfer(courseName);
        await enrollHome.clearFilterCrossMarks();
        await enrollHome.selectSourceInstance(el1InstanceName);
        await enrollHome.selectTargetInstance(el2InstanceName);
        await enrollHome.selectlearner();
        await enrollHome.wait("minWait");
        
        await enrollHome.verifyLearnerStatusInTransferEnrollmentPage(credentials.LEARNERUSERNAME.username, "Enrolled");
        await enrollHome.selectLearnerForTransfer(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickTransferButton();
        await enrollHome.wait("minWait");
        await enrollHome.verifyTransferSuccessMessage();
        
        console.log(`✅ Transfer completed: E-learning → E-learning (${instanceNames[0]} → ${instanceNames[1]})`);
    });

    test(`Learner verifies enrollment in second E-learning instance after transfer`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS22 - Step 5: Learner Verification After Transfer` },
            { type: `Test Description`, description: `Verify learner now sees second E-learning instance in My Learning` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.wait("mediumWait");
        await learnerHome.clickMyLearning();
        await catalog.searchMyLearning(el2InstanceName);
        await catalog.verifyEnrolledCourseByTitle(el2InstanceName);
        await catalog.verifyCompletedCourse("Enrolled");
    });