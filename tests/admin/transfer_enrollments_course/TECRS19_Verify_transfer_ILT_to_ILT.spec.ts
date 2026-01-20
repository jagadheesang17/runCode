import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";
import { createILTMultiInstance } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";

const courseName = FakerData.getCourseName();
let instanceNames: string[] = [];

test.describe.serial(`TECRS19 - Verify that able to transfer users from ILT to ILT class of the same course`, async () => {

    test(`Create course with 2 ILT instances using API`, async ({ }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS19 - Step 1: Create Course with 2 ILT Instances` },
            { type: `Test Description`, description: `Create ILT course with 2 classroom instances using API` }
        );

        instanceNames = await createILTMultiInstance(courseName, "published", 2, "future");
        
        console.log(`✅ Course created with 2 ILT instances: ${instanceNames.join(', ')}`);
    });

    test(`Enroll learner in first ILT instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS19 - Step 2: Enroll Learner in ILT Instance` },
            { type: `Test Description`, description: `Enroll learner in first ILT instance` }
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


    test(`Transfer learner from ILT instance 1 to ILT instance 2`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS19 - Step 4: Transfer from ILT to ILT` },
            { type: `Test Description`, description: `Transfer learner from first ILT instance to second ILT instance` }
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
        await enrollHome.selectTargetInstance(instanceNames[1]);
        await enrollHome.selectlearner();
        await enrollHome.wait("minWait");
        await enrollHome.selectLearnerForTransfer(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickTransferButton();
        await enrollHome.wait("minWait");
        await enrollHome.verifyTransferSuccessMessage();
        
        console.log(`✅ Transfer completed: ${instanceNames[0]} → ${instanceNames[1]}`);
    });

    test(`Learner verifies enrollment in new ILT instance after transfer`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS19 - Step 5: Learner Verification After Transfer` },
            { type: `Test Description`, description: `Verify learner now sees second ILT instance in My Learning` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.wait("mediumWait");
        await learnerHome.clickMyLearning();
        await catalog.searchMyLearning(instanceNames[1]);
        await catalog.verifyEnrolledCourseByTitle(instanceNames[1]);
        await catalog.verifyCompletedCourse("Enrolled");
        
    });

});
