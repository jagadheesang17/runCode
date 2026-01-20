import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";
import { createILTMultiInstance } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";

const courseName = FakerData.getCourseName();
const vcInstanceName = ("VCInstance_" + FakerData.getCourseName());
const instructorName = credentials.INSTRUCTORNAME.username;
let instanceNames: string[] = [];

test.describe.serial(`TECRS20 - Verify that able to transfer users from ILT to VC class of the same course`, async () => {

    test(`Create multi-instance course with ILT and VC instances`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS20 - Step 1: Create Course with ILT and VC Instances` },
            { type: `Test Description`, description: `Create course with Classroom and Virtual Class instances` }
        );
        instanceNames = await createILTMultiInstance(courseName, "published", 2, "future");

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.catalogSearch(courseName);
        await createCourse.editCourseFromListingPage();
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Virtual Class");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", vcInstanceName);
        await createCourse.enterSessionName(vcInstanceName);
        await createCourse.sessionType();
        await createCourse.setMaxSeat();
        await createCourse.presenterUrl();
        await createCourse.attendeeUrl();
        await createCourse.vcSessionTimeZone("kolkata");
        await createCourse.enterDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

        console.log(`✅ Course created with ILT and VC instances: ${instanceNames.join(', ')}`);
    });

    test(`Enroll learner in ILT instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS20 - Step 2: Enroll Learner in ILT Instance` },
            { type: `Test Description`, description: `Enroll learner in Classroom instance` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");

        await enrollHome.selectBycourse(instanceNames[0]);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();

    });


    test(`Transfer learner from ILT to VC instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS20 - Step 4: Transfer from ILT to VC` },
            { type: `Test Description`, description: `Transfer learner from ILT instance to VC instance` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");

        await enrollHome.selectEnrollmentOption("Transfer Enrollment - Course");
        await enrollHome.searchCourseForTransfer(courseName);
        await enrollHome.clearFilterCrossMarks();
        await enrollHome.selectSourceInstance(instanceNames[0]);
        await enrollHome.selectTargetInstance(vcInstanceName);
        await enrollHome.selectlearner();
        await enrollHome.wait("minWait");

        await enrollHome.verifyLearnerStatusInTransferEnrollmentPage(credentials.LEARNERUSERNAME.username, "Enrolled");
        await enrollHome.selectLearnerForTransfer(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickTransferButton();
        await enrollHome.wait("minWait");
        await enrollHome.verifyTransferSuccessMessage();

    });

    test(`Learner verifies enrollment in VC instance after transfer`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS20 - Step 5: Learner Verification After Transfer` },
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
