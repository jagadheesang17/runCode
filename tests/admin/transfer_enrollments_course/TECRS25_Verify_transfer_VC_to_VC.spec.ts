import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";
import { createVCMultiInstance } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";

const courseName = FakerData.getCourseName();
let vcName: string[] = [];

test.describe.serial(`TECRS25 - Verify that able to transfer users from VC to another VC class of the same course`, async () => {

    test(`Create course with 2 VC instances using API`, async ({ }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS25 - Step 1: Create Course with Two VC Instances` },
            { type: `Test Description`, description: `Create VC course with 2 Virtual Class instances using API` }
        );

        const result = await createVCMultiInstance(courseName, "published", 2, "future");
        vcName = Array.isArray(result) ? result : [result];

        console.log(`✅ Course created with 2 VC instances: ${vcName.join(', ')}`);
    });

    test(`Enroll learner in first VC instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS25 - Step 2: Enroll Learner in First VC Instance` },
            { type: `Test Description`, description: `Enroll learner in first VC instance` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");

        await enrollHome.selectBycourse(vcName[0]);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
    });

    test(`Transfer learner from first VC to second VC instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS25 - Step 3: Transfer from VC to VC` },
            { type: `Test Description`, description: `Transfer learner from first VC instance to second VC instance` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");

        await enrollHome.selectEnrollmentOption("Transfer Enrollment - Course");
        await enrollHome.searchCourseForTransfer(courseName);
        await enrollHome.clearFilterCrossMarks();
        await enrollHome.selectSourceInstance(vcName[0]);
        await enrollHome.selectTargetInstance(vcName[1]);
        await enrollHome.selectlearner();
        await enrollHome.wait("minWait");

        await enrollHome.verifyLearnerStatusInTransferEnrollmentPage(credentials.LEARNERUSERNAME.username, "Enrolled");
        await enrollHome.selectLearnerForTransfer(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickTransferButton();
        await enrollHome.wait("minWait");
        await enrollHome.verifyTransferSuccessMessage();

        console.log(`✅ Transfer completed: VC → VC (${vcName[0]} → ${vcName[1]})`);
    });

    test(`Learner verifies enrollment in second VC instance after transfer`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS25 - Step 4: Learner Verification After Transfer` },
            { type: `Test Description`, description: `Verify learner now sees second VC instance in My Learning` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.wait("mediumWait");
        await learnerHome.clickMyLearning();
        await catalog.searchMyLearning(vcName[1]);
        await catalog.verifyEnrolledCourseByTitle(vcName[1]);
        await catalog.verifyCompletedCourse("Enrolled");

        console.log(`✅ Learner verified enrollment after transfer: ${vcName[1]}`);
    });

});
