import { credentials } from "../../../../constants/credentialData";
import { test } from "../../../../customFixtures/expertusFixture"
import { FakerData } from '../../../../utils/fakerUtils';
import enrollmentUsersData from '../../../../data/enrollmentUserData/EnrollmentUser.json';
import { createILTMultiInstance } from "../../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { expect } from "allure-playwright";

const courseName = "Past ILT " + FakerData.getCourseName();
const users: any[] = enrollmentUsersData;
let instanceNames: string[] = [];

test.describe(`Verify admin can change enrollment status from Enrolled to Incomplete for Past ILT Class`, () => {
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
    
    test(`Test 1: Setup - Create Past ILT course and enroll 3 learners to class instances`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_007 - Setup Past ILT class enrollment` },
            { type: `Test Description`, description: `Create Past ILT multi-instance course and enroll 3 learners to class instances` }
        );

        console.log(`🔄 Creating Past ILT Multi-Instance course: ${courseName}`);
        instanceNames = await createILTMultiInstance(courseName, "published", 2, "pastclass");
        console.log(`🎯 Instance Names:`, instanceNames);

        // Enroll all 3 users to class instances (not the course)
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(instanceNames[0]);
        await enrollHome.clickSelectedLearner();
        
        for (let i = 0; i < Math.min(users.length, 3); i++) {
            console.log(`🔄 Enrolling user ${i + 1}: ${users[i].username} to class instance`);
            await enrollHome.enterSearchUser(users[i].username);
            await enrollHome.clickEnrollBtn();
            await enrollHome.verifytoastMessage();
            console.log(`✅ User ${i + 1} enrolled to class instance: ${users[i].username}`);
            await enrollHome.clickEnrollButton();
        }
        console.log(`✅ All 3 users enrolled to Past ILT class instance`);
    });

    test(`Test 2: Verify all 3 users can see the class instance in My Learning`, async ({ learnerHome, createUser, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_007 - Verify learner side class instance visibility` },
            { type: `Test Description`, description: `Login as all 3 users and verify the Past ILT class instance is available in My Learning` }
        );

        for (let i = 0; i < Math.min(users.length, 3); i++) {
            console.log(`\n🔄 Verifying for User ${i + 1}: ${users[i].username}`);
            await learnerHome.basicLogin(users[i].username, "default");
            await catalog.searchMyLearning(instanceNames[0]);
            await catalog.clickCourseInMyLearning(instanceNames[0]);
            console.log(`✅ User ${i + 1} can see the class instance in My Learning`);
            await createUser.clickLogOutButton();
        }
        
        console.log(`\n✅ All 3 users verified - class instances visible in My Learning`);
    });

    test(`Test 3: Admin changes enrollment status - User 1: Incomplete, User 2: Completed, User 3: Canceled`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_007 - Change enrollment statuses` },
            { type: `Test Description`, description: `Admin changes User 1 to Incomplete, User 2 to Completed, User 3 to Canceled` }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(instanceNames[0]);       
        await enrollHome.clickViewLearner();
        
        // User 1: Change to Incomplete
        console.log(`🔄 Changing User 1 (${users[0].username}) from Enrolled to Incomplete`);
        await enrollHome.changeLearnerStatus(users[0].username, "Incomplete");
        await enrollHome.clickviewUpdateEnrollmentBtn();
        console.log(`🔍 Verifying User 1 status changed to Incomplete`);
        await enrollHome.verifyField("Status", "Incomplete", users[0].username);
        console.log(`✅ User 1 status successfully changed to Incomplete`);
        
        // User 2: Change to Completed
        console.log(`🔄 Changing User 2 (${users[1].username}) from Enrolled to Completed`);
        await enrollHome.changeLearnerStatus(users[1].username, "Completed");
        await enrollHome.clickviewUpdateEnrollmentBtn();
        console.log(`🔍 Verifying User 2 status changed to Completed`);
        await enrollHome.verifyField("Status", "Completed", users[1].username);
        console.log(`✅ User 2 status successfully changed to Completed`);
        
        // User 3: Change to Canceled
        console.log(`🔄 Changing User 3 (${users[2].username}) from Enrolled to Canceled`);
        await enrollHome.changeLearnerStatus(users[2].username, "Canceled");
        await enrollHome.clickviewUpdateEnrollmentBtn();
        console.log(`🔍 Verifying User 3 status changed to Canceled`);
        await enrollHome.verifyField("Status", "Canceled", users[2].username);
        console.log(`✅ User 3 status successfully changed to Canceled`);
        
        console.log(`✅ All users updated - User 1: Incomplete, User 2: Completed, User 3: Canceled`);
    });

    test(`Test 4: Verify learners see correct status in Learning History - User 1: Incomplete, User 2: Completed, User 3: Canceled`, async ({ learnerHome, catalog, dashboard, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_007 - Verify learner side status` },
            { type: `Test Description`, description: `User 1 sees Incomplete, User 2 sees Completed, User 3 sees Canceled in Learning History` }
        );
        
        // User 1: Incomplete - Should see in Learning History
        console.log(`🔄 User 1 (${users[0].username}) - Verifying Learning History for Incomplete status`);
        await learnerHome.basicLogin(users[0].username, "DefaultPortal");
        await catalog.clickDashboardLink();
        await dashboard.selectDashboardItems("Learning History");
        await dashboard.learningHistoryCourseSearch(instanceNames[0]);
        await dashboard.vaidatVisibleCourse_Program(instanceNames[0], "Incomplete");
        console.log(`✅ User 1 - Course appears in Learning History with Incomplete status`);
        await createUser.clickLogOutButton();
        
        // User 2: Completed - Should see in Learning History
        console.log(`🔄 User 2 (${users[1].username}) - Verifying Learning History for Completed status`);
        await learnerHome.basicLogin(users[1].username, "DefaultPortal");
        await catalog.clickDashboardLink();
        await dashboard.selectDashboardItems("Learning History");
        await dashboard.learningHistoryCourseSearch(instanceNames[0]);
        await dashboard.vaidatVisibleCourse_Program(instanceNames[0], "Completed");
        console.log(`✅ User 2 - Course appears in Learning History with Completed status`);
        await createUser.clickLogOutButton();
        
        // User 3: Canceled - Should see in Learning History
        console.log(`🔄 User 3 (${users[2].username}) - Verifying Learning History for Canceled status`);
        await learnerHome.basicLogin(users[2].username, "DefaultPortal");
        await catalog.clickDashboardLink();
        await dashboard.selectDashboardItems("Learning History");
        await dashboard.learningHistoryCourseSearch(instanceNames[0]);
        await dashboard.vaidatVisibleCourse_Program(instanceNames[0], "Canceled");
        console.log(`✅ User 3 - Course appears in Learning History with Canceled status`);
        await createUser.clickLogOutButton();
        
        console.log(`✅ All 3 learners verified successfully!`);
    });
});
