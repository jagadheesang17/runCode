import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";
import { updateCronDataJSON } from "../../../utils/jsonDataHandler";
import { courseEnrollmentOverdueCron } from "../DB/DBJobs";
import { create } from "domain";

const courseName = ("Cron" + FakerData.getCourseName());
const description = FakerData.getDescription();
const elCourseName = ("ElearningInstance" + " " + FakerData.getCourseName());
const vcCourseName = ("VCInstance" + " " + FakerData.getCourseName());
const instructorName = credentials.INSTRUCTORNAME.username;
let instanceNames: string[] = [];

test.describe.serial(`TECRS17 - Verify that learners with Overdue status for the instance are listed for transfer`, async () => {

    test(`Create multi-instance course with E-Learning and VC instances with Complete By Rule as Overdue`, async ({ adminHome, createCourse, editCourse, learningPath }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS17 - Step 1: Create Multi-Instance Course with Complete By Rule` },
            { type: `Test Description`, description: `Create course with E-Learning and VC instances with Complete by rule set to Overdue` }
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

        // Set delivery type as Classroom
        await createCourse.selectdeliveryType("Classroom");

        // Set Complete By Rule to Overdue at course level
        await createCourse.selectCompliance();

        // Set complete by date using new method with specific ID
        await createCourse.setCompleteByDate();

        await createCourse.selectPostCompletebyOverDue(); // Sets completion rule as overdue
        await learningPath.clickExpiresButton();

        await createCourse.clickCatalog();
        // Save the course
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();



        // Add Virtual Class instance
        await createCourse.clickEditCourseTabs();
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Virtual Class");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", vcCourseName);
        await createCourse.setMaxSeat();
        await createCourse.enterSessionName(FakerData.getSession());
        await createCourse.sessionType();
        await createCourse.attendeeUrl();
        await createCourse.presenterUrl();
        await createCourse.enterDateValue();
        await createCourse.startandEndTime();
        await createCourse.vcSessionTimeZone("kolkata");
        await createCourse.selectInstructor(instructorName);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

        await createCourse.clickEditCourseTabs();
        await createCourse.clicLickToSwitchCrsPage();
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("E-Learning");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", elCourseName);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

    });

    test(`Enroll two learners in E-Learning instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS17 - Step 2: Enroll Learners in E-Learning Instance` },
            { type: `Test Description`, description: `Enroll two learners in the E-Learning instance` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");

        // Enroll first learner
        await enrollHome.selectBycourse(elCourseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();

        // Enroll second learner
        await enrollHome.clickEnrollButton();
        await enrollHome.enterSearchUser(credentials.TEAMUSER1.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();

        console.log(`✅ Learners enrolled in E-Learning instance: ${credentials.LEARNERUSERNAME.username}, ${credentials.TEAMUSER1.username}`);
    });

    test(`Execute CRON JOB to mark learners as Overdue`, async ({ }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS17 - Step 3: Execute CRON JOB` },
            { type: `Test Description`, description: `Execute cron job to mark enrolled learners as Overdue based on Complete By Rule` }
        );

        await courseEnrollmentOverdueCron();

        console.log(`✅ CRON JOB executed to mark learners as Overdue`);
    });

    test(`Verify Overdue learners are listed in transfer enrollment`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS17 - Step 4: Verify Overdue Learners Listed` },
            { type: `Test Description`, description: `Verify that learners with Overdue status are available for transfer enrollment` }
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

        // Select E-Learning instance as source and VC instance as target
        await enrollHome.selectSourceInstance(elCourseName);
        await enrollHome.selectTargetInstance(vcCourseName);

        // Click Select Learners to view the list
        await enrollHome.selectlearner();
        await enrollHome.wait("minWait");

        // Verify both learners with Overdue status are available for transfer
        await enrollHome.verifyLearnerStatusInTransferEnrollmentPage(credentials.LEARNERUSERNAME.username, "Overdue");
        await enrollHome.verifyLearnerStatusInTransferEnrollmentPage(credentials.TEAMUSER1.username, "Overdue");

        console.log(`✅ Verified: Both learners with Overdue status are listed and available for transfer`);
    });

});
