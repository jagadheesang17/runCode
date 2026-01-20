import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";
import { createCEUProvider } from "../../../api/metaDataLibraryAPI";
import { createILTMultiInstance } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const iltInstanceName = FakerData.getSession();
const elInstanceName = ("ElearningInstance_" + FakerData.getCourseName());
const instructorName = credentials.INSTRUCTORNAME.username;
let instanceNames: string[] = [];

test.describe.serial(`TECRS21 - Verify that able to transfer users from ILT to E-learning class of the same course`, async () => {

    test(`Create multi-instance course with ILT and E-learning instances`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS21 - Step 1: Create Course with ILT and E-learning Instances` },
            { type: `Test Description`, description: `Create course with Classroom and E-learning instances` }
        );

        instanceNames = await createILTMultiInstance(courseName, "published", 2, "future");

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
    });

    test(`Enroll learner in ILT instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS21 - Step 2: Enroll Learner in ILT Instance` },
            { type: `Test Description`, description: `Enroll learner in Classroom instance` }
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
        
    });


    test(`Transfer learner from ILT to E-learning instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS21 - Step 4: Transfer from ILT to E-learning` },
            { type: `Test Description`, description: `Transfer learner from ILT instance to E-learning instance` }
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
        await enrollHome.selectLearnerForTransfer(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickTransferButton();
        await enrollHome.wait("minWait");
        await enrollHome.verifyTransferSuccessMessage();

        console.log(`✅ Transfer completed: ILT → E-learning (${instanceNames[0]} → ${instanceNames[1]})`);
    });

    test(`Learner verifies enrollment in E-learning instance after transfer`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS21 - Step 5: Learner Verification After Transfer` },
            { type: `Test Description`, description: `Verify learner now sees E-learning instance in My Learning` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.wait("mediumWait");
        await learnerHome.clickMyLearning();
        await catalog.searchMyLearning(elInstanceName);
        await catalog.verifyEnrolledCourseByTitle(elInstanceName);
        await catalog.verifyCompletedCourse("Enrolled");
    });

});
