import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { credentials } from "../../../constants/credentialData";
import { generateOauthToken } from "../../../api/accessToken";
import { userCreation } from "../../../api/userAPI";
import { userCreationData } from "../../../data/apiData/formData";
import { createILTMultiInstance, createVCMultiInstance } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { CoursePage } from '../../../pages/CoursePage';


const description = FakerData.getDescription();
const instructorName = credentials.INSTRUCTORNAME.username

let iltCourseName = FakerData.getCourseName();
const iltsessionName1 = iltCourseName + " - Session 1";
const iltsessionName2 = iltCourseName + " - Session 2";
const iltsessionName3 = iltCourseName + " - Session 3";
const ilt_VC_instance = iltCourseName + " - VC Instance 1";

test.describe.serial(`TP with Multiple Course Instances - 6 User Enrollment Scenarios`, () => {


    test(`Setup: Create ILT Course With 4 Instances`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `Setup - Create Users, Courses and Training Plan` },
            { type: `Test Description`, description: `Create 6 users, ILT course with 4 past instances, VC course with 2 active instances, and Learning Path` }
        );
        let tag: any
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.clickMenu("Course");
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", iltCourseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.selectdeliveryType("Classroom");
        await createCourse.selectCompleteByRule();
        await createCourse.typeCompleteByDate();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.editcourse();
        await createCourse.addInstances();

        async function addinstance(deliveryType: string) {
            await createCourse.selectInstanceDeliveryType(deliveryType);
            await createCourse.clickCreateInstance();
        }
        await addinstance("Classroom");
        await createCourse.enterSessionName(iltsessionName1);
        await createCourse.setMaxSeat();
        console.log("Instance 1 Session Date");
        await createCourse.enterfutureDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectLocation();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

        await createCourse.editcourse();
        await createCourse.clickinstanceClass();
        await createCourse.addInstances();
        await addinstance("Classroom");
        await createCourse.enterSessionName(iltsessionName2);
        await createCourse.setMaxSeat();
         console.log("Instance 2 Registration End Date");
        await createCourse.clickregistrationEnds();
        await createCourse.enterCurrentDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectLocation();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

        await createCourse.editcourse();
        await createCourse.clickinstanceClass();
        await createCourse.addInstances();
        await addinstance("Classroom");
        await createCourse.enterSessionName(iltsessionName3);
        await createCourse.setMaxSeat();
        await createCourse.enterpastDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectLocation();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

        await createCourse.editcourse();
        await createCourse.clickinstanceClass();
        await createCourse.addInstances();
        await addinstance("Virtual Class");
        await createCourse.selectMeetingType(instructorName, ilt_VC_instance, 1);
        await createCourse.typeDescription(description);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

    });

    // test(`Setup: Add Courses To Learning Path`, async ({ adminHome, learningPath }) => {
    //     test.info().annotations.push(
    //         { type: `Author`, description: `Kathir A` },
    //         { type: `TestCase`, description: `Setup - Create Users, Courses and Training Plan` },
    //         { type: `Test Description`, description: `Create 6 users, ILT course with 4 past instances, VC course with 2 active instances, and Learning Path` }
    //     );
    //     iltInstances = await createILTMultiInstance(iltCourseName, "published", 3, "past");
    //     vcInstances = await createVCMultiInstance(vcCourseName, "published", 2, "future") as string[];

    //     await adminHome.loadAndLogin("CUSTOMERADMIN");
    //     await adminHome.menuButton();
    //     await adminHome.clickLearningMenu();
    //     await learningPath.clickCreateLearningPath();
    //     await learningPath.title(lpName);
    //     await learningPath.language();
    //     await learningPath.description(FakerData.getDescription());
    //     await learningPath.clickSave();
    //     await learningPath.clickProceedBtn();

    //     await learningPath.clickAddCourse();
    //     await learningPath.searchAndClickCourseCheckBox(iltCourseName);
    //     await learningPath.clickAddSelectCourse();

    //     await learningPath.clickAddCourse();
    //     await learningPath.searchAndClickCourseCheckBox(vcCourseName);
    //     await learningPath.clickAddSelectCourse();

    //     await learningPath.clickDetailTab();
    //     await learningPath.clickCatalogBtn();
    //     await learningPath.clickUpdateBtn();
    //     await learningPath.verifySuccessMessage();
    // });

    // test(`Test 1: User 1 - Enroll in Course 1 Instance 1 (Past Completed By Date)`, async ({ learnerHome, catalog }) => {
    //     test.info().annotations.push(
    //         { type: `Author`, description: `Kathir A` },
    //         { type: `TestCase`, description: `User 1 - Past Completed By Instance` },
    //         { type: `Test Description`, description: `User 1 enrolls in instance with past completed by date` }
    //     );

    //     await learnerHome.basicLogin(user1, "default");
    //     await learnerHome.clickCatalog();
    //     await catalog.searchCourse(lpName);
    //     await catalog.clickCourse(lpName);
    //     await catalog.clickViewLearningPathDetails();
    //     await catalog.clickFirstOptionalCourseAndEnroll();
    //     await catalog.verifyEnrollmentSuccess();
    // });

    // test(`Test 2: User 2 - Enroll in Course 1 Instance 2 (Past Registration Date)`, async ({ learnerHome, catalog }) => {
    //     test.info().annotations.push(
    //         { type: `Author`, description: `Kathir A` },
    //         { type: `TestCase`, description: `User 2 - Past Registration Instance` },
    //         { type: `Test Description`, description: `User 2 attempts to select instance with past registration date` }
    //     );

    //     await learnerHome.signOut();
    //     await learnerHome.basicLogin(user2, "default");
    //     await learnerHome.clickCatalog();
    //     await catalog.searchCourse(lpName);
    //     await catalog.clickCourse(lpName);
    //     await catalog.clickViewLearningPathDetails();
    //     await catalog.verifyInstanceDisabledOrWarning(iltInstances[1]);
    // });

    // test(`Test 3: User 3 - Enroll in Course 1 Instance 3 (Past ILT Session)`, async ({ learnerHome, catalog }) => {
    //     test.info().annotations.push(
    //         { type: `Author`, description: `Kathir A` },
    //         { type: `TestCase`, description: `User 3 - Past ILT Session` },
    //         { type: `Test Description`, description: `User 3 enrolls in instance with past ILT session` }
    //     );

    //     await learnerHome.signOut();
    //     await learnerHome.basicLogin(user3, "default");
    //     await learnerHome.clickCatalog();
    //     await catalog.searchCourse(lpName);
    //     await catalog.clickCourse(lpName);
    //     await catalog.clickViewLearningPathDetails();
    //     await catalog.clickFirstOptionalCourseAndEnroll();
    //     await catalog.verifyEnrollmentSuccess();
    // });

    // test(`Test 4: User 4 - Enroll in Course 1 Instance 4 (Past VC Session)`, async ({ learnerHome, catalog }) => {
    //     test.info().annotations.push(
    //         { type: `Author`, description: `Kathir A` },
    //         { type: `TestCase`, description: `User 4 - Past VC Session` },
    //         { type: `Test Description`, description: `User 4 enrolls in instance with past VC session` }
    //     );

    //     await learnerHome.signOut();
    //     await learnerHome.basicLogin(user4, "default");
    //     await learnerHome.clickCatalog();
    //     await catalog.searchCourse(lpName);
    //     await catalog.clickCourse(lpName);
    //     await catalog.clickViewLearningPathDetails();
    //     await catalog.clickFirstOptionalCourseAndEnroll();
    //     await catalog.verifyEnrollmentSuccess();
    // });

    // test(`Test 5: User 5 - Enroll in Course 2 Instance 1 (Enroll Again)`, async ({ learnerHome, catalog }) => {
    //     test.info().annotations.push(
    //         { type: `Author`, description: `Kathir A` },
    //         { type: `TestCase`, description: `User 5 - Enroll Again Feature` },
    //         { type: `Test Description`, description: `User 5 enrolls in instance with Enroll Again enabled` }
    //     );

    //     await learnerHome.signOut();
    //     await learnerHome.basicLogin(user5, "default");
    //     await learnerHome.clickCatalog();
    //     await catalog.searchCourse(lpName);
    //     await catalog.clickCourse(lpName);
    //     await catalog.clickViewLearningPathDetails();
    //     await catalog.selectCourseByName(vcCourseName);
    //     await catalog.clickEnroll();
    //     await catalog.verifyEnrollmentSuccess();
    // });

    // test(`Test 6: User 6 - Enroll in Course 2 Instance 2 (Manager Approval)`, async ({ learnerHome, catalog, adminHome, enrollHome }) => {
    //     test.info().annotations.push(
    //         { type: `Author`, description: `Kathir A` },
    //         { type: `TestCase`, description: `User 6 - Manager Approval` },
    //         { type: `Test Description`, description: `User 6 requests approval for manager approval instance` }
    //     );

    //     await learnerHome.signOut();
    //     await learnerHome.basicLogin(user6, "default");
    //     await learnerHome.clickCatalog();
    //     await catalog.searchCourse(lpName);
    //     await catalog.clickCourse(lpName);
    //     await catalog.clickViewLearningPathDetails();
    //     await catalog.selectCourseByName(vcCourseName);
    //     await catalog.clickRequestapproval();
    //     await catalog.requstcostCenterdetails();
    //     await catalog.submitRequest();

    //     await adminHome.loadAndLogin("CUSTOMERADMIN");
    //     await adminHome.menuButton();
    //     await adminHome.clickEnrollmentMenu();
    //     await enrollHome.clickManagerApproval();
    //     await enrollHome.searchApprovalRequest(user6);
    //     await enrollHome.approveRequest();
    //     await enrollHome.verifyApprovalSuccess();
    // });
});
