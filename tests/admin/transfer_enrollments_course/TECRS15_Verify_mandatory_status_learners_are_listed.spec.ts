import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";
import { createILTMultiInstance } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
let instanceNames: string[] = [];
let instance1Name: string;
let instance2Name: string;

test.describe.serial(`TECRS15 - Verify that the learners in the Mandatory status for the instance are listed`, async () => {

    test(`Create course with two instances using API`, async ({ adminHome, createCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS16 - Step 1: Create Course with Two Instances` },
            { type: `Test Description`, description: `Create course with 2 instances using API` }
        );

        // Create course with 2 instances using API
        instanceNames = await createILTMultiInstance(courseName, "published", 2);
        instance1Name = instanceNames[0];
        instance2Name = instanceNames[1];
        
        console.log(`✅ Course created with 2 instances: ${instance1Name}, ${instance2Name}`);
    });

    test(`Enroll learner as Mandatory in first instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS16 - Step 2: Enroll Learner as Mandatory` },
            { type: `Test Description`, description: `Enroll learner with Mandatory status in first instance` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");
        
        // Enroll learner as Mandatory
        await enrollHome.selectBycourse(instanceNames[0]);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickMandatory();
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        
        console.log(`✅ Learner (${credentials.LEARNERUSERNAME.username}) enrolled as Mandatory in first instance`);
    });

    test(`Verify Mandatory learner is listed in From section`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS16 - Step 3: Verify Mandatory Learner Listed` },
            { type: `Test Description`, description: `Verify that learner with Mandatory status is displayed in transfer enrollment list` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");
        
        // Click Transfer Enrollment - Course option
        await enrollHome.selectEnrollmentOption("Transfer Enrollment - Course");
        
        // Search for the course
        await enrollHome.searchCourseForTransfer(courseName);
        await enrollHome.clearFilterCrossMarks();
        
        // Select the first instance in From section
        await enrollHome.selectSourceInstance(instanceNames[0]);
        await enrollHome.selectTargetInstance(instanceNames[1]);
        
        // Click Select Learners to view the list
        await enrollHome.selectlearner();
        await enrollHome.wait("minWait");
        await enrollHome.verifyLearnerStatusInTransferEnrollmentPage(credentials.LEARNERUSERNAME.username, "Enrolled");
        
        console.log(`✅ Verified Mandatory learner is listed in transfer enrollment`);
    });

});
