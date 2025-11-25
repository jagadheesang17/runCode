import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";
import { createILTMultiInstance } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { en } from "@faker-js/faker";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
let instanceNames: string[] = [];
let instance1Name: string;
let instance2Name: string;

test.describe.serial(`TECRS13 - Verify that the learners in the Completed status for the instance should not get listed`, async () => {

    test(`Create course with two past instances using API`, async ({ adminHome, createCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS13 - Step 1: Create Course with Past Instances` },
            { type: `Test Description`, description: `Create course with 2 past instances using API` }
        );

        // Create course with 2 past instances using API
        instanceNames = await createILTMultiInstance(courseName, "published", 2, "pastclass");
        instance1Name = instanceNames[0];
        instance2Name = instanceNames[1];

        console.log(`✅ Course created with 2 past instances: ${instance1Name}, ${instance2Name}`);
    });

    test(`Enroll learner in first instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS13 - Step 2: Enroll Learner` },
            { type: `Test Description`, description: `Enroll learner in first past instance` }
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
        await enrollHome.clickEnrollButton();
        await enrollHome.enterSearchUser(credentials.TEAMUSER1.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();

    });

    test(`Mark learner as Completed in View/Update Status`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS13 - Step 3: Mark Learner as Completed` },
            { type: `Test Description`, description: `Mark enrolled learner as Completed status in View/Update Status page` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.wait("mediumWait");

        // Search for the instance
        await enrollHome.searchCourseInViewStatus(instanceNames[0]);
        await enrollHome.selectBycourse(instanceNames[0]);
        await enrollHome.clickViewLearner();
        await enrollHome.wait("minWait");
        await enrollHome.searchLearnerInViewStatus(credentials.LEARNERUSERNAME.username);
        // Mark learner as Completed
        await enrollHome.selectEnrollOrCancel("Completed");
        await enrollHome.completionDateInAdminEnrollment();
        await enrollHome.wait("minWait");
    });

    test(`Verify only non-Completed learner is available for transfer`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS13 - Step 4: Verify Only Non-Completed Learner Listed` },
            { type: `Test Description`, description: `Verify that only learners without Completed status are available for transfer` }
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
        await enrollHome.verifyLearnerStatusInTransferEnrollmentPage(credentials.LEARNERUSERNAME.username, "Completed");
        await enrollHome.verifyLearnerStatusInTransferEnrollmentPage(credentials.TEAMUSER1.username, "Enrolled");




    });

});
