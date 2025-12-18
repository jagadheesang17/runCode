import { credentials } from "../../../../constants/credentialData";
import { test } from "../../../../customFixtures/expertusFixture"
import { FakerData, getCurrentDateFormatted, gettomorrowDateFormatted } from '../../../../utils/fakerUtils';
import enrollmentUsersData from '../../../../data/enrollmentUserData/EnrollmentUser.json';
import { createCourseAPI, createCourseAPI as createElearningCourse } from "../../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { expect } from "allure-playwright";

const certificationName = FakerData.getCourseName();
const certificationCourse = FakerData.getCourseName();
const reCertificationCourse = FakerData.getCourseName();
// const certificationName = "Neural Microchip Index";
// const certificationCourse = "Solid state System Calculate";
// const reCertificationCourse = "Bluetooth Protocol Transmit"
const users: any[] = enrollmentUsersData;
const statusesToTest = ["Incomplete", "Completed", "Canceled"]; // User 0, 1, 2
let certificationCode: string = "";

test.describe(`Verify admin can change enrollment status for Recertification`, () => {
    test.describe.configure({ mode: "serial" });

    test.beforeAll(() => {
        console.log(`📋 Loaded ${users.length} users from EnrollmentUser.json`);
        if (users.length === 0 || !users[0]?.username) {
            throw new Error('EnrollmentUser.json is empty or invalid. Please run ADN_000_CreateUser.spec.ts first to create users.');
        }
        users.forEach((user, index) => {
            console.log(`   User ${index + 1}: ${user.username} (${user.firstname} ${user.lastname})`);
        });
    });

    test(`Test 1: Setup - Create certification with recertification and enroll 3 learners`, async ({ adminHome, learningPath, enrollHome, createCourse,editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_011 - Setup Recertification enrollment` },
            { type: `Test Description`, description: `Create 2 E-Learning courses, create certification (expire 9 days), enable recertification with course 2 (expire 2 days), enroll 3 learners` }
        );

        console.log(`🔄 Creating 2 E-Learning courses`);
        const content = 'content testing-001';
        const course1Code = await createElearningCourse(content, certificationCourse);
        const course2Code = await createElearningCourse(content, reCertificationCourse);
        console.log(`✅ Course 1: ${course1Code}, Course 2: ${course2Code}`);


        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        console.log(`🔄 Creating certification: ${certificationName}`);
        await learningPath.clickCreateCertification();
        await learningPath.title(certificationName);
        await learningPath.description("Recertification test - " + FakerData.getDescription());
        await learningPath.hasRecertification();
        await learningPath.language();
        await learningPath.clickExpiresDropdown();
        await learningPath.clickExpiresButtonWithType("Specific Date");
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();

        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(certificationCourse);
        await learningPath.clickAddSelectCourse();
        console.log(`✅ Added ILT course to certification: ${certificationCourse}`);
        await learningPath.clickDetailTab();
        
        
        await learningPath.clickAndSelectRecertCompleteByRule("Date");
        await learningPath.clickReCertExpiresDropdown();
        await learningPath.clickReCertExpiresButtonWithType("Specific Date");
        await learningPath.addRecertificationCourse();
        await learningPath.chooseRecertificationMethod("Add Courses Manually");
        await learningPath.searchAndClickCourseCheckBox(reCertificationCourse);
        await learningPath.clickAddSelectCourse();
        await learningPath.saveRecertification(reCertificationCourse);

        await learningPath.description("Recertification test - " + FakerData.getDescription());
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Certification published successfully`);

        await learningPath.clickEditCertification();
        await learningPath.clickEnrollmentsButton();
        await enrollHome.selectEnroll();
        // await enrollHome.selectByOption("Certification");
        // await enrollHome.selectBycourse(certificationName);
        // await enrollHome.clickSelectedLearner();

        for (let i = 0; i < Math.min(users.length, 3); i++) {
            console.log(`🔄 Enrolling user ${i + 1}: ${users[i].username} to certification`);
            await enrollHome.enterSearchUser(users[i].username);
            await enrollHome.clickEnrollBtn();
            await enrollHome.verifytoastMessage();
            console.log(`✅ User ${i + 1} enrolled to certification: ${users[i].username}`);
            await enrollHome.clickEnrollButton();
        }

        console.log(`✅ All 3 users enrolled to certification: ${certificationName}`);
    });

    test(`Test 2: Verify learners can see certification and trigger recertification flow`, async ({ learnerHome, createUser, dashboard ,catalog}) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_011 - Learner completes course and triggers recertify` },
            { type: `Test Description`, description: `Login as all 3 users, launch and complete course1, verify recertify button appears` }
        );

        for (let i = 0; i < Math.min(users.length, 3); i++) {
            console.log(`\n🔄 Test 2 - Processing User ${i + 1}: ${users[i].username}`);

            await learnerHome.basicLogin(users[i].username, "default");
            await dashboard.clickLearningPath_And_Certification();
            await dashboard.clickCertificationLink();
            await dashboard.searchCertification(certificationName);
            await dashboard.clickCertificateTitle(certificationName);
            await catalog.clickLaunchButton();
            await catalog.saveLearningStatus();
            await catalog.clickRecertify();
            await createUser.clickLogOutButton();
            console.log(`✅ User ${i + 1} completed course and recertification flow initiated`);
        }

        console.log(`\n✅ All 3 learners completed course and triggered recertification`);
    });

    test(`Test 3: Verify able to change enrollment from Enrolled to User 1: Incomplete, User 2: Completed, User 3: Canceled`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_011 - Change certification enrollment statuses` },
            { type: `Test Description`, description: `Admin changes User 1: Incomplete, User 2: Completed, User 3: Canceled for Recertification` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();

        // Select Certification from filter
        console.log(`🔄 Selecting Certification filter`);
        await enrollHome.selectByOption("Certification");

        // Select the specific certification
        console.log(`🔄 Searching and selecting certification: ${certificationName}`);
        await enrollHome.searchCourseInViewStatus(certificationName);
         await enrollHome.selectBycourse(certificationName);      
        await enrollHome.clickViewLearner();
        await enrollHome.selectRecertification();
        // Change status for all 3 users using loop
        for (let i = 0; i < Math.min(users.length, 3); i++) {
            const newStatus = statusesToTest[i];
            console.log(`🔄 Changing User ${i + 1} (${users[i].username}) from Enrolled to ${newStatus}`);
            await enrollHome.changeLearnerStatus(users[i].username, newStatus,"Recertification");
            console.log(`🔍 Verifying User ${i + 1} status changed to ${newStatus}`);
            await enrollHome.verifyField("Status", newStatus, users[i].username);
            console.log(`✅ User ${i + 1} status successfully changed to ${newStatus}`);
        }

        console.log(`✅ All users updated - User 1: ${statusesToTest[0]}, User 2: ${statusesToTest[1]}, User 3: ${statusesToTest[2]}`);
    });

    test(`Test 4: Verify learners see correct status in Learning History - User 1: Incomplete, User 2: Completed, User 3: Canceled`, async ({ learnerHome, catalog, dashboard, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_011 - Verify learner side status in Learning History & To verify that the Re-certification will be listed the learners who have Status for the recertification` },
            { type: `Test Description`, description: `User 1: Incomplete, User 2: Completed, User 3: Canceled in Learning History` }
        );

        // Verify each user sees their correct status in Learning History
        for (let i = 0; i < Math.min(users.length, 3); i++) {
            const expectedStatus = statusesToTest[i];
            console.log(`🔄 User ${i + 1} (${users[i].username}) - Verifying Learning History for ${expectedStatus} status`);

            await learnerHome.basicLogin(users[i].username, "DefaultPortal");
            await catalog.clickDashboardLink();
            await dashboard.selectDashboardItems("Learning History");
            await dashboard.learningHistoryCourseSearch(certificationName);
            await dashboard.vaidatVisibleCourse_Program(certificationName, expectedStatus);

            console.log(`✅ User ${i + 1} - Certification appears in Learning History with ${expectedStatus} status`);
            await createUser.clickLogOutButton();
        }

        console.log(`✅ All 3 learners verified successfully in Learning History!`);
    });
});
