import { credentials } from "../../../../constants/credentialData";
import { test } from "../../../../customFixtures/expertusFixture"
import { FakerData } from '../../../../utils/fakerUtils';
import enrollmentUsersData from '../../../../data/enrollmentUserData/EnrollmentUser.json';
import { createCourseAPI } from "../../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { expect } from "allure-playwright";

const courseName = "Neural Microchip Generate"; //FakerData.getCourseName();
const description = FakerData.getDescription();
const users: any[] = enrollmentUsersData;

test.describe(`Verify progress percentage reaches 100% after admin updates learner status to completed`, () => {
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
    
    test(`Setup - Create course and enroll 3 learners`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_003 - Setup course and enrollment` },
            { type: `Test Description`, description: `Create course and enroll 3 learners to test admin status update` }
        );

        // Create course
        const content = 'content testing-001';
        const result = await createCourseAPI(content, courseName, 'published', 'single', 'e-learning');
        expect(result).toBe(courseName);
        console.log(`✅ Course created: ${courseName}`);

        // Enroll all 3 users
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.clickSelectedLearner();
        
        for (let i = 0; i < users.length; i++) {
            console.log(`🔄 Enrolling user ${i + 1}: ${users[i].username}`);
            await enrollHome.enterSearchUser(users[i].username);
            await enrollHome.clickEnrollBtn();
            await enrollHome.verifytoastMessage();
            console.log(`✅ User ${i + 1} enrolled: ${users[i].username}`);
            await enrollHome.clickEnrollButton();
        }
    });

    test(`Verify all 3 learners can see course in My Learning`, async ({ catalog, learnerHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_003 - Verify My Learning` },
            { type: `Test Description`, description: `Login as all 3 learners and verify course appears in My Learning` }
        );
        
        for (let i = 0; i < users.length; i++) {
            console.log(`🔄 Logging in as User ${i + 1}: ${users[i].username}`);
            await learnerHome.basicLogin(users[i].username, "DefaultPortal");
            await catalog.searchMyLearning(courseName);
            await catalog.clickCourseInMyLearning(courseName);
            console.log(`✅ User ${i + 1} (${users[i].username}) - Course visible in My Learning`);
            
            await createUser.clickLogOutButton();
            console.log(`✅ User ${i + 1} logged out`);
        }
    });

    test(`Admin updates status - User 1: Completed, User 2: Canceled, User 3: Enrolled`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_003 - Admin status update` },
            { type: `Test Description`, description: `Admin changes User 1 to Completed, User 2 to Canceled, User 3 remains Enrolled` }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(courseName);       
        await enrollHome.clickViewLearner();

        // User 1: Change to Completed
        console.log(`🔍 Verifying initial status for User 1 (${users[0].username})`);
        await enrollHome.verifyField("Status", "Enrolled", users[0].username);
        await enrollHome.verifyField("Progress", "0", users[0].username);
        console.log(`✅ User 1 initial status verified: Enrolled with 0% progress`);
        
        console.log(`🔄 Changing status to Completed for User 1 (${users[0].username})`);
        await enrollHome.changeLearnerStatus(users[0].username, "Completed");
        
        await enrollHome.clickviewUpdateEnrollmentBtn();
        console.log(`🔍 Verifying updated status for User 1 (${users[0].username})`);
        await enrollHome.verifyField("Status", "Completed", users[0].username);
        await enrollHome.verifyField("Progress", "100", users[0].username);
        console.log(`✅ User 1 status updated: Completed with 100% progress`);
        
        // User 2: Change to Canceled
        console.log(`🔍 Verifying initial status for User 2 (${users[1].username})`);
        await enrollHome.verifyField("Status", "Enrolled", users[1].username);
        await enrollHome.verifyField("Progress", "0", users[1].username);
        console.log(`✅ User 2 initial status verified: Enrolled with 0% progress`);
        
        console.log(`🔄 Changing status to Canceled for User 2 (${users[1].username})`);
        await enrollHome.changeLearnerStatus(users[1].username, "Canceled");
        
        await enrollHome.clickviewUpdateEnrollmentBtn();
        console.log(`🔍 Verifying updated status for User 2 (${users[1].username})`);
        await enrollHome.verifyField("Status", "Canceled", users[1].username);
        await enrollHome.verifyField("Progress", "0", users[1].username);
        console.log(`✅ User 2 status updated: Canceled with 0% progress`);
        
        // User 3: Verify remains Enrolled (no change)
        console.log(`🔍 Verifying User 3 (${users[2].username}) remains Enrolled`);
        await enrollHome.verifyField("Status", "Enrolled", users[2].username);
        await enrollHome.verifyField("Progress", "0", users[2].username);
        console.log(`✅ User 3 status: Enrolled with 0% progress (no change)`);
    });

    test(`Verify learners see correct course status - User 1 & 2: Learning History, User 3: My Learning`, async ({ catalog, learnerHome, dashboard, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_003 - Verify final status for all learners` },
            { type: `Test Description`, description: `User 1 (Completed) and User 2 (Canceled) see course in Learning History, User 3 (Enrolled) sees in My Learning` }
        );
        
        // User 1: Completed - Should see in Learning History
        console.log(`🔄 User 1 (${users[0].username}) - Verifying Learning History for Completed status`);
        await learnerHome.basicLogin(users[0].username, "DefaultPortal");
        await catalog.clickDashboardLink();
        await dashboard.selectDashboardItems("Learning History");
        await dashboard.learningHistoryCourseSearch(courseName);
        await dashboard.vaidatVisibleCourse_Program(courseName, "Completed");
        console.log(`✅ User 1 (${users[0].username}) - Course appears in Learning History with Completed status`);
        await createUser.clickLogOutButton();
        
        // User 2: Canceled - Should see in Learning History
        console.log(`🔄 User 2 (${users[1].username}) - Verifying Learning History for Canceled status`);
        await learnerHome.basicLogin(users[1].username, "DefaultPortal");
        await catalog.clickDashboardLink();
        await dashboard.selectDashboardItems("Learning History");
        await dashboard.learningHistoryCourseSearch(courseName);
        await dashboard.vaidatVisibleCourse_Program(courseName, "Canceled");
        console.log(`✅ User 2 (${users[1].username}) - Course appears in Learning History with Canceled status`);
        await createUser.clickLogOutButton();
        
        // User 3: Enrolled - Should see in My Learning
        console.log(`🔄 User 3 (${users[2].username}) - Verifying My Learning for Enrolled status`);
        await learnerHome.basicLogin(users[2].username, "DefaultPortal");
        await catalog.searchMyLearning(courseName);
        await catalog.clickCourseInMyLearning(courseName);
        console.log(`✅ User 3 (${users[2].username}) - Course appears in My Learning as Enrolled`);
        await createUser.clickLogOutButton();
        
        console.log(`✅ All 3 learners verified successfully!`);
    });
});
