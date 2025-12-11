import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";
import { createILTMultiInstance } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";

const prerequisiteCourseName = FakerData.getCourseName();
const mainCourseName = FakerData.getCourseName();
const description = FakerData.getDescription();
let mainInstanceNames: string[] = [];

test.describe.serial(`TECRS34 - Verify learner completed prerequisite for instance in TO list during transfer enrollment`, async () => {

    test(`Create prerequisite E-learning course`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS34 - Step 1: Create Prerequisite Course` },
            { type: `Test Description`, description: `Create prerequisite E-learning course that must be completed before main course` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", prerequisiteCourseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        
        console.log(`✅ Prerequisite course created: ${prerequisiteCourseName}`);
    });

    test(`Create main multi-instance ILT course with prerequisite`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS34 - Step 2: Create Main Course with Prerequisite` },
            { type: `Test Description`, description: `Create multi-instance ILT course and set prerequisite requirement` }
        );

        // Create multi-instance ILT course
        mainInstanceNames = await createILTMultiInstance(mainCourseName, "published", 2, "future");
        
        console.log(`✅ Main multi-instance course created: ${mainCourseName}`);
        console.log(`✅ Instances: ${mainInstanceNames.join(', ')}`);

        // Add prerequisite to main course
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.searchCourse(mainCourseName);
        await createCourse.editCourseFromListingPage();
        await createCourse.clickCourseOption("Prerequisite");
        await createCourse.addSinglePrerequisiteCourse(prerequisiteCourseName);
        await createCourse.save_editedcoursedetails();
        await createCourse.verifySuccessMessage();
        
        console.log(`✅ Prerequisite "${prerequisiteCourseName}" added to main course "${mainCourseName}"`);
    });

    test(`Enroll learner in first instance of main course`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS34 - Step 3: Enroll Learner in First Instance` },
            { type: `Test Description`, description: `Enroll learner in first instance of main course` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");
        
        await enrollHome.selectBycourse(mainInstanceNames[0]);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        
        console.log(`✅ Learner enrolled in first instance: ${mainInstanceNames[0]}`);
    });

    test(`Learner completes prerequisite course`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS34 - Step 4: Complete Prerequisite` },
            { type: `Test Description`, description: `Learner completes prerequisite course to enable transfer to second instance` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickMyLearning();
        await catalog.searchCatalog(prerequisiteCourseName);
        await catalog.clickCourseInMyLearning(prerequisiteCourseName);
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        // Verify prerequisite completed
        await catalog.clickMyLearning();
        await catalog.clickCompletedButton();
        await catalog.searchMyLearning(prerequisiteCourseName);
        await catalog.verifyCompletedCourse(prerequisiteCourseName);
        
        console.log(`✅ Prerequisite course "${prerequisiteCourseName}" completed`);
    });

    test(`Verify second instance appears in TO list after prerequisite completion`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS34 - Step 5: Verify TO List Shows Instance After Prerequisite` },
            { type: `Test Description`, description: `Verify second instance is available in TO list since learner has completed prerequisite` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");
        
        // Navigate to transfer enrollment
        await enrollHome.selectEnrollmentOption("Transfer Enrollment - Course");
        await enrollHome.searchCourseForTransfer(mainCourseName);
        await enrollHome.clearFilterCrossMarks();
        
        // Select source instance
        await enrollHome.selectSourceInstance(mainInstanceNames[0]);
        await enrollHome.wait("mediumWait");
        
        // Select learner
        await enrollHome.selectLearnerForTransfer(credentials.LEARNERUSERNAME.username);
        
        // Verify second instance is available in TO list (prerequisite completed)
        await enrollHome.selectTargetInstance(mainInstanceNames[1]);
        
        console.log(`✅ Second instance "${mainInstanceNames[1]}" is available in TO list`);
        console.log(`✅ Prerequisite requirement satisfied - learner can be transferred`);
    });

    test(`Transfer learner to second instance after prerequisite completion`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS34 - Step 6: Transfer Learner to Second Instance` },
            { type: `Test Description`, description: `Transfer learner to second instance after prerequisite is completed` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");
        
        // Navigate to transfer enrollment
        await enrollHome.selectEnrollmentOption("Transfer Enrollment - Course");
        await enrollHome.searchCourseForTransfer(mainCourseName);
        await enrollHome.clearFilterCrossMarks();
        
        // Select source and target
        await enrollHome.selectSourceInstance(mainInstanceNames[0]);
        await enrollHome.wait("mediumWait");
        await enrollHome.selectLearnerForTransfer(credentials.LEARNERUSERNAME.username);
        await enrollHome.selectTargetInstance(mainInstanceNames[1]);
        await enrollHome.wait("mediumWait");
        
        // Perform transfer
        await enrollHome.clickTransferButton();
        await enrollHome.wait("minWait");
        await enrollHome.verifyTransferSuccessMessage();
        
        console.log(`✅ Learner transferred from: ${mainInstanceNames[0]}`);
        console.log(`✅ Learner transferred to: ${mainInstanceNames[1]}`);
    });

    test(`Verify transfer completed in admin View/Update Status`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS34 - Step 7: Verify Transfer in Admin Side` },
            { type: `Test Description`, description: `Verify learner is enrolled in second instance after transfer` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.wait("mediumWait");
        
        // Verify learner in second instance
        await enrollHome.selectBycourse(mainInstanceNames[1]);
        await enrollHome.clickViewLearner();
        await enrollHome.searchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.verifyLearnerEnrolledInInstance(credentials.LEARNERUSERNAME.username);
        
        console.log(`✅ Verified: Learner successfully enrolled in second instance after completing prerequisite`);
    });

});
