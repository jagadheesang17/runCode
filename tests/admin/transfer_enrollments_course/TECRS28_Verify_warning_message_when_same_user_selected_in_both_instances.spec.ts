import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";
import { createILTMultiInstance } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";

const courseName = FakerData.getCourseName();
let instanceNames: string[] = [];

test.describe.serial(`TECRS28 - Verify that warning message is displayed when same user is selected in both the instances`, async () => {

    test(`Create course with 2 ILT instances using API`, async ({ }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS28 - Step 1: Create Course with 2 ILT Instances` },
            { type: `Test Description`, description: `Create ILT course with 2 instances using API` }
        );

        instanceNames = await createILTMultiInstance(courseName, "published", 2, "future");
        
        console.log(`✅ Course created with 2 ILT instances: ${instanceNames.join(', ')}`);
    });

    test(`Enroll learner in first ILT instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS28 - Step 2: Enroll Learner in First Instance` },
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
        
        console.log(`✅ Learner enrolled in first ILT instance: ${instanceNames[0]}`);
    });

    test(`Enroll same learner in second ILT instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS28 - Step 3: Enroll Same Learner in Second Instance` },
            { type: `Test Description`, description: `Enroll same learner in second ILT instance` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");
        
        await enrollHome.selectBycourse(instanceNames[1]);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        
        console.log(`✅ Learner enrolled in second ILT instance: ${instanceNames[1]}`);
    });

    test(`Verify warning message when same user selected in both source and target instances`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS28 - Step 4: Verify Warning Message` },
            { type: `Test Description`, description: `Verify warning message displayed when attempting to transfer learner who is already enrolled in target instance` }
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
        
        await enrollHome.verifyLearnerStatusInTransferEnrollmentPage(credentials.LEARNERUSERNAME.username, "Enrolled");
        await enrollHome.selectLearnerForTransfer(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickTransferButton();
        await enrollHome.wait("minWait");
        await enrollHome.verifyWarningMsgForTransferToSameInstance();
        
        console.log(`✅ Warning message verified: Same user cannot be enrolled in both source and target instances`);
    });

});
