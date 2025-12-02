import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";
import { createILTMultiInstance } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const lpTitle = FakerData.getCourseName();
let instanceNames: string[] = [];

test.describe.serial(`TECRS18 - Verify that learners enrolled through training plan are listed for transfer`, async () => {

    test(`Create multi-instance course using API`, async ({ }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS18 - Step 1: Create Multi-Instance Course` },
            { type: `Test Description`, description: `Create ILT course with 2 instances using API` }
        );

        // Create course with 2 instances using API
        instanceNames = await createILTMultiInstance(courseName, "published", 2, "future");
        
        console.log(`✅ Multi-instance course created: ${courseName}`);
        console.log(`✅ Instances: ${instanceNames.join(', ')}`);
    });

    test(`Create Learning Path and attach multi-instance course`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS18 - Step 2: Create Learning Path with Multi-Instance Course` },
            { type: `Test Description`, description: `Create Learning Path and attach the multi-instance course` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
        await learningPath.title(lpTitle);
        await learningPath.description(description);
        await learningPath.language();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        await learningPath.clickEditLearningPath();
        await createCourse.clickCompletionCertificate();
        await createCourse.clickCertificateCheckBox();
        await createCourse.clickAdd();
        await learningPath.description(description);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Learning Path created: ${lpTitle}`);
        console.log(`✅ Course attached: ${courseName}`);
    });

    test(`Enroll learner to Learning Path`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS18 - Step 3: Enroll Learner to Learning Path` },
            { type: `Test Description`, description: `Enroll learner to the Learning Path` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");
        
        // Select Learning Path option
        await enrollHome.selectByOption("Learning Path");
        await enrollHome.selectBycourse(lpTitle);
        await enrollHome.clickSelectedLearner();
        
        // Enroll learner to Learning Path
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();

        console.log(`✅ Learner enrolled to Learning Path: ${credentials.LEARNERUSERNAME.username}`);
    });

    test(`Admin enrolls learner to specific course instance (through regular enrollment)`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS18 - Step 4: Admin Enrolls Learner to Course Instance` },
            { type: `Test Description`, description: `Admin enrolls learner to specific course instance (learner already enrolled in TP)` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");
        
        // Select the first instance (not Learning Path, but direct course instance)
        await enrollHome.selectBycourse(instanceNames[0]);
        await enrollHome.clickSelectedLearner();
        
        // Enroll the same learner to the course instance
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();

        console.log(`✅ Admin enrolled learner to course instance: ${credentials.LEARNERUSERNAME.username} → ${instanceNames[0]}`);
    });

    test(`Verify learners enrolled through training plan are listed for transfer`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS18 - Step 5: Verify TP Enrolled Learners Listed` },
            { type: `Test Description`, description: `Verify that learners enrolled through training plan are available for transfer enrollment` }
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
        
        // Select first instance as source and second instance as target
        await enrollHome.selectSourceInstance(instanceNames[0]);
        await enrollHome.selectTargetInstance(instanceNames[1]);
        
        // Click Select Learners to view the list
        await enrollHome.selectlearner();
        await enrollHome.wait("minWait");
        
        // Verify learner enrolled through training plan is available for transfer
        await enrollHome.verifyLearnerStatusInTransferEnrollmentPage(credentials.LEARNERUSERNAME.username, "Enrolled");
        
        console.log(`✅ Verified: Learner enrolled through training plan is listed for transfer`);
    });

});
