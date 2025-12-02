import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";
import { createILTMultiInstance } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
let instanceNames: string[] = [];
let instance1Name: string;
let instance2Name: string;

test.describe.serial(`TECRS16 - Verify that the learners in the In-complete status for the instance should not get listed`, async () => {

    test(`Create course with two past instances using API`, async ({ adminHome, createCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS16 - Step 1: Create Course with Past Instances` },
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

    test(`Mark learner as No Show in View/Update Status`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS13 - Step 3: Mark Learner as No Show` },
            { type: `Test Description`, description: `Mark enrolled learner as No Show status in View/Update Status page` }
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
        // Mark learner as No Show
        await enrollHome.selectEnrollOrCancel("Incomplete");
        await enrollHome.saveBtn();
        await enrollHome.wait("minWait");
    });

    test(`Verify No Show learner is listed in From section and can be transferred`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS13 - Step 4: Verify No Show Learner Listed and Transfer` },
            { type: `Test Description`, description: `Verify that learner with No Show status is listed in From section and can be transferred to another instance` }
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
        await enrollHome.verifyLearnerStatusInTransferEnrollmentPage(credentials.LEARNERUSERNAME.username, "Incomplete");


    });

});
