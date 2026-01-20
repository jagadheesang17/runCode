import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";
import { createVCMultiInstance, createILTMultiInstance } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";

const courseName = FakerData.getCourseName();
let vcName: string[] = [];
const instructorName = credentials.INSTRUCTORNAME.username;
let draftInstanceSession = ("Draft_ILT_" + FakerData.getCourseName());
let draftInstanceSession1: string;

test.describe.serial(`TECRS26 - Verify that able to transfer users from VC to ILT class of the same course`, async () => {

    test(`Create VC instance using API`, async ({ createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS26 - Step 1a: Create VC Instance` },
            { type: `Test Description`, description: `Create VC instance using API` }
        );

        const vcResult = await createVCMultiInstance(courseName, "published", 1, "future");
        vcName = Array.isArray(vcResult) ? vcResult : [vcResult];
        // Add first instance with future date and mark as Save as Draft

        await createCourse.loadAndLogin("CUSTOMERADMIN");
        await createCourse.menuButton();
        await createCourse.clickLearningMenu();
        await createCourse.clickCourseLink();
        await createCourse.catalogSearch(courseName);
        await createCourse.editCourseFromListingPage();
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", draftInstanceSession);
        await createCourse.setMaxSeat();
        draftInstanceSession1 = FakerData.getSession();
        await createCourse.enterSessionName(draftInstanceSession1);
        await createCourse.enterDateValue(); // Future date
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();


        console.log(`✅ VC instance created: ${vcName[0]}`);

    });


    test(`Enroll learner in VC instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS26 - Step 2: Enroll Learner in VC Instance` },
            { type: `Test Description`, description: `Enroll learner in VC instance` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");

        await enrollHome.selectBycourse(vcName[0]);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();

        console.log(`✅ Learner enrolled in VC instance: ${vcName[0]}`);
    });

    test(`Transfer learner from VC to ILT instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS26 - Step 3: Transfer from VC to ILT` },
            { type: `Test Description`, description: `Transfer learner from VC instance to ILT instance` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");

        await enrollHome.selectEnrollmentOption("Transfer Enrollment - Course");
        await enrollHome.searchCourseForTransfer(courseName);
        await enrollHome.clearFilterCrossMarks();
        await enrollHome.selectSourceInstance(vcName[0]);
        await enrollHome.selectTargetInstance(draftInstanceSession);
        await enrollHome.selectlearner();
        await enrollHome.wait("minWait");

        await enrollHome.verifyLearnerStatusInTransferEnrollmentPage(credentials.LEARNERUSERNAME.username, "Enrolled");
        await enrollHome.selectLearnerForTransfer(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickTransferButton();
        await enrollHome.wait("minWait");
        await enrollHome.verifyTransferSuccessMessage();

        console.log(`✅ Transfer completed: VC → ILT (${vcName[0]} → ${draftInstanceSession1})`);
    });

    test(`Learner verifies enrollment in ILT instance after transfer`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS26 - Step 4: Learner Verification After Transfer` },
            { type: `Test Description`, description: `Verify learner now sees ILT instance in My Learning` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.wait("mediumWait");
        await learnerHome.clickMyLearning();
        await catalog.searchMyLearning(draftInstanceSession);
        await catalog.verifyEnrolledCourseByTitle(draftInstanceSession)
        await catalog.verifyCompletedCourse("Enrolled");

        console.log(`✅ Learner verified enrollment after transfer: ${draftInstanceSession}`);
    });

});
