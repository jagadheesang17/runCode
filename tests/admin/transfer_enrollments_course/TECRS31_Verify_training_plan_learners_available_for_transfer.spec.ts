import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";
import { createILTMultiInstance } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const lpTitle = FakerData.getCourseName();
const el1InstanceName = ("Elearning1_" + FakerData.getCourseName());
const el2InstanceName = ("Elearning2_" + FakerData.getCourseName());

test.describe.serial(`TECRS31 - Verify that learners enrolled through training plan are available for transfer`, async () => {

    test(`Create multi-instance course using API`, async ({adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS31 - Step 1: Create Multi-Instance Course` },
            { type: `Test Description`, description: `Create ILT course with 2 instances using API` }
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

    test(`Create Learning Path and attach multi-instance course`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS31 - Step 2: Create Learning Path with Multi-Instance Course` },
            { type: `Test Description`, description: `Create Learning Path and attach the multi-instance course` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
        await learningPath.title(lpTitle);
        await learningPath.description(description);
        await learningPath.language();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        
        console.log(`✅ Learning Path created: ${lpTitle}`);
        console.log(`✅ Course attached: ${courseName}`);
    });

    test(`Enroll learner to Learning Path (Training Plan)`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS31 - Step 3: Enroll Learner to Training Plan` },
            { type: `Test Description`, description: `Enroll learner to the Learning Path (Training Plan)` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");
        
        // Select Learning Path option
        await enrollHome.selectByOption("Learning Path");
        await enrollHome.selectBycourse(lpTitle);
        await enrollHome.clickSelectedLearner();
        
        // Enroll learner
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        
        console.log(`✅ Learner "${credentials.LEARNERUSERNAME.username}" enrolled in Learning Path: ${lpTitle}`);
    });
test(`Verify that multi instance course and Enroll the required instance from Certification path`, async ({ adminHome, enrollHome, catalog, editCourse, learnerHome }) => {

    await adminHome.loadAndLogin("CUSTOMERADMIN1")
    await adminHome.menuButton()
    await adminHome.clickEnrollmentMenu();
    await adminHome.clickEnroll();
    await enrollHome.selectByOption("Learning Path");
    await enrollHome.selectBycourse(lpTitle)
    await enrollHome.clickSelectedLearner();

    await enrollHome.manageEnrollment("View Status/Enroll Learner to TP Courses");
    await enrollHome.searchUser(credentials.LEARNERUSERNAME.username)
    await enrollHome.clickSearchUserCheckbox(credentials.LEARNERUSERNAME.username)

    await enrollHome.clickSelectLearner();
    await enrollHome.searchandSelectTP(lpTitle)
    await enrollHome.selectCls();

    // Verify courses inside TP and enroll the EL course
    await enrollHome.verifyTPHasCourses([el1InstanceName]);
    await enrollHome.enrollCourseByName(el1InstanceName);

    await enrollHome.searchUser(credentials.LEARNERUSERNAME.username)
    await enrollHome.clickSearchUserCheckbox(credentials.LEARNERUSERNAME.username)

    await enrollHome.clickSelectLearner();
    await enrollHome.searchandSelectTP(lpTitle)
    await enrollHome.selectCls();

    await enrollHome.verifyCourseEnrolledInTP(el1InstanceName);


  })
    test(`Verify Training Plan enrolled learner available for transfer from first instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS31 - Step 4: Verify Training Plan Learner Available for Transfer` },
            { type: `Test Description`, description: `Verify that learner enrolled via Training Plan appears in transfer learner list` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");
        
        // Navigate to transfer enrollment
        await enrollHome.selectEnrollmentOption("Transfer Enrollment - Course");
        await enrollHome.searchCourseForTransfer(courseName);
        await enrollHome.clearFilterCrossMarks();
        
        // Select source instance and learner
        await enrollHome.selectSourceInstance(el1InstanceName);
        
        // Select target instance
        await enrollHome.selectTargetInstance(el2InstanceName);
        await enrollHome.selectlearner();
        
        // Verify learner enrolled via training plan is visible for transfer
        await enrollHome.verifyLearnerStatusInTransferEnrollmentPage(credentials.LEARNERUSERNAME.username, "Enrolled");
        await enrollHome.selectLearnerForTransfer(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickTransferButton();
        await enrollHome.wait("minWait");
        await enrollHome.verifyTransferSuccessMessage();
        
        console.log(`✅ Learner enrolled via Training Plan is available in transfer list`);
    });



});
