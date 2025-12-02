import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";
import { createVCMultiInstance } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";

const courseName = FakerData.getCourseName();
let instanceNames: string[] = [];
const elInstanceName = ("ElearningInstance_" + FakerData.getCourseName());

test.describe.serial(`TECRS27 - Verify that able to transfer users from VC to E-learning class of the same course`, async () => {

    test(`Create course with VC and E-learning instances using API`, async ({createCourse, adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS27 - Step 1: Create Course with VC and E-learning Instances` },
            { type: `Test Description`, description: `Create multi-instance course with VC and E-learning instances using API` }
        );

        const result = await createVCMultiInstance(courseName, "published", 2, "future");
        instanceNames = Array.isArray(result) ? result : [result];
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.catalogSearch(courseName);
        await createCourse.editCourseFromListingPage();
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("E-Learning");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", elInstanceName);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        
        console.log(`✅ Course created with VC and E-learning instances: ${instanceNames.join(', ')}`);
    });

    test(`Enroll learner in VC instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS27 - Step 2: Enroll Learner in VC Instance` },
            { type: `Test Description`, description: `Enroll learner in VC instance` }
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
        
        console.log(`✅ Learner enrolled in VC instance: ${instanceNames[0]}`);
    });

    test(`Transfer learner from VC to E-learning instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS27 - Step 3: Transfer from VC to E-learning` },
            { type: `Test Description`, description: `Transfer learner from VC instance to E-learning instance` }
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
        await enrollHome.selectTargetInstance(elInstanceName);
        await enrollHome.selectlearner();
        await enrollHome.wait("minWait");
        
        await enrollHome.verifyLearnerStatusInTransferEnrollmentPage(credentials.LEARNERUSERNAME.username, "Enrolled");
        await enrollHome.selectLearnerForTransfer(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickTransferButton();
        await enrollHome.wait("minWait");
        await enrollHome.verifyTransferSuccessMessage();
        
        console.log(`✅ Transfer completed: VC → E-learning (${instanceNames[0]} → ${instanceNames[1]})`);
    });

    test(`Learner verifies enrollment in E-learning instance after transfer`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS27 - Step 4: Learner Verification After Transfer` },
            { type: `Test Description`, description: `Verify learner now sees E-learning instance in My Learning` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.wait("mediumWait");
        await learnerHome.clickMyLearning();
        await catalog.searchMyLearning(elInstanceName);
        await catalog.verifyEnrolledCourseByTitle(elInstanceName);
        await catalog.verifyCompletedCourse("Enrolled");
        
        console.log(`✅ Learner verified enrollment after transfer: ${elInstanceName}`);
    });

});
