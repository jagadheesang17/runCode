import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";
import { createILTMultiInstance } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";

const courseName = FakerData.getCourseName();

const instructorName = credentials.INSTRUCTORNAME.username;
let instanceNames: string[] = [];

test.describe.serial(`TECRS12 - Verify that the learners in the Enrolled status for the instance are listed`, async () => {

    test(`Create course with two instances`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS12 - Step 1: Create Course with Two Instances` },
            { type: `Test Description`, description: `Create a course with two instances for enrollment` }
        );

        instanceNames = await createILTMultiInstance(courseName, "published", 2);
    });

    test(`Enroll learner in first instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS12 - Step 2: Enroll Learner` },
            { type: `Test Description`, description: `Enroll learner in first instance with Enrolled status` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
                    await adminHome.menuButton();
                    await adminHome.clickEnrollmentMenu();
                    await adminHome.clickEnroll();
                    await enrollHome.selectBycourse(instanceNames[0]);
                    await enrollHome.clickSelectedLearner();
                    await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
                    await enrollHome.clickEnrollBtn();
                    await enrollHome.verifytoastMessage();
    });

    test(`Verify enrolled status learner is listed in From section`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS12 - Step 3: Verify Enrolled Status Learner Listed` },
            { type: `Test Description`, description: `Verify that learner in Enrolled status is listed when selecting the instance in From section` }
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
        await enrollHome.selectlearner();
        await enrollHome.verifyLearnerStatusInTransferEnrollmentPage(credentials.LEARNERUSERNAME.username, "Enrolled");
        
    });

});
