import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";
import { createILTMultiInstance } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const elInstanceName = ("Elearning_" + FakerData.getCourseName());
const iltInstanceName = FakerData.getSession();
const instructorName = credentials.INSTRUCTORNAME.username;
let instanceNames: string[] = [];

test.describe.serial(`TECRS23 - Verify that able to transfer users from E-learning to ILT class of the same course`, async () => {

    test(`Create multi-instance course with E-learning and ILT instances`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS23 - Step 1: Create Course with E-learning and ILT Instances` },
            { type: `Test Description`, description: `Create course with E-learning and Classroom instances` }
        );

        instanceNames = await createILTMultiInstance(courseName, "published", 2, "future");

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.catalogSearch(courseName);
        await createCourse.editCourseFromListingPage();
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("E-Learning");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", elInstanceName);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    });

    test(`Enroll learner in E-learning instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS23 - Step 2: Enroll Learner in E-learning Instance` },
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
    });

});

test(`Transfer learner from E-learning to ILT instance`, async ({ adminHome, enrollHome }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `TECRS23 - Step 4: Transfer from E-learning to ILT` },
        { type: `Test Description`, description: `Transfer learner from E-learning instance to ILT instance` }
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
    await enrollHome.selectTargetInstance(instanceNames[0]);
    await enrollHome.selectlearner();
    await enrollHome.wait("minWait");

    await enrollHome.verifyLearnerStatusInTransferEnrollmentPage(credentials.LEARNERUSERNAME.username, "Enrolled");
    await enrollHome.selectLearnerForTransfer(credentials.LEARNERUSERNAME.username);
    await enrollHome.clickTransferButton();
    await enrollHome.wait("minWait");
    await enrollHome.verifyTransferSuccessMessage();
});

test(`Learner verifies enrollment in ILT instance after transfer`, async ({ learnerHome, catalog }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `TECRS23 - Step 5: Learner Verification After Transfer` },
        { type: `Test Description`, description: `Verify learner now sees ILT instance in My Learning` }
    );

    await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
    await learnerHome.wait("mediumWait");
    await learnerHome.clickMyLearning();
    await catalog.searchMyLearning(courseName);
    await catalog.verifyEnrolledCourseByTitle(courseName);
    await catalog.verifyCompletedCourse("Enrolled");
});

