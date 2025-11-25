import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";
import { create } from "domain";
import { waitForDebugger } from "inspector";

const courseName = FakerData.getCourseName();
const instanceName1 = FakerData.getCourseName()+"ILT";
const instanceName2 = FakerData.getCourseName()+"VC";
const description = FakerData.getDescription();
const instructorName = credentials.INSTRUCTORNAME.username;
let instance1Name: string;
let instance2Name: string;

test.describe.serial(`TECRS02 - Verify transfer of users between instances of the same course`, async () => {

    test(`TECRS02 - Step 1: Create multi-instance course with two instances`, async ({ adminHome, createCourse, contentHome, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS02 - Step 1: Create Multi-Instance Course` },
            { type: `Test Description`, description: `Create a course with one ILT and one VC instance for transfer enrollment testing` }
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
        await createCourse.selectdeliveryType("Classroom");
        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown();
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.clickEditCourseTabs();
        // Add first instance - ILT (Classroom)

        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", instanceName1);
        await createCourse.enterSessionName(instanceName1);
        await createCourse.setMaxSeat();
        await createCourse.enterDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        await createCourse.clickEditCourseTabs();
       await createCourse.clicLickToSwitchCrsPage();
        await createCourse.wait("mediumWait");
        // Add second instance - VC (Virtual Classroom)
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Virtual Class");
        await createCourse.clickCreateInstance();
         await createCourse.enter("course-title", instanceName2);
        await createCourse.sessionType();
        await createCourse.presenterUrl();
        await createCourse.attendeeUrl();
        instance2Name = FakerData.getSession();
        await createCourse.enterSessionName(instanceName2);
        await createCourse.vcSessionTimeZone("kolkata");
        await createCourse.setMaxSeat();
        await createCourse.enterDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.wait("mediumWait");
        
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    })                 

    test(`Enroll learner in first instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS02 - Step 2: Enroll Learner` },
            { type: `Test Description`, description: `Enroll learner in the first instance` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
            await adminHome.clickEnrollmentMenu();
            await adminHome.clickEnroll();
            await enrollHome.selectBycourse(instanceName1);
            await enrollHome.clickSelectedLearner();
            await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
            await enrollHome.clickEnrollBtn();
            await enrollHome.verifytoastMessage();
    });

    test(`Transfer learner to second instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS02 - Step 3: Transfer to Second Instance` },
            { type: `Test Description`, description: `Transfer the learner from first instance to second instance` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await enrollHome.wait("mediumWait");
        
        // Click Transfer Enrollment option
        await enrollHome.clickTransferEnrollmentOption();
        
        // Search for the course
        await enrollHome.searchCourseForTransfer(courseName);
    
        // Select source instance (first instance)
        await enrollHome.selectSourceInstance(instanceName1);
        
        // Select target instance (second instance)
        await enrollHome.selectTargetInstance(instanceName2);
        // Click Select Learners button
        await enrollHome.selectlearner();
        // Select the learner
        await enrollHome.selectLearnerForTransfer(credentials.LEARNERUSERNAME.username);
        
        // Click Transfer button
        await enrollHome.clickTransferButton();
        await enrollHome.wait("mediumWait");
        
        // Verify success message
        await enrollHome.verifyTransferSuccessMessage();
    });

    test(`Verify enrollment transfer in View/Update Status`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS02 - Step 4: Verify Transfer` },
            { type: `Test Description`, description: `Verify the enrollment is transferred to second instance in View/Update Status - Course/TP` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.wait("mediumWait");
        
        // Search for the course
        await enrollHome.selectBycourse(instanceName2);
        await enrollHome.clickViewLearner();
        await enrollHome.searchUser(credentials.LEARNERUSERNAME.username);

        
        // Verify learner is enrolled in second instance
        await enrollHome.verifyLearnerEnrolledInInstance(credentials.LEARNERUSERNAME.username);
    });
});

