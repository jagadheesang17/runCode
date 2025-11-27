import { credentials } from "../../../../constants/credentialData";
import { test } from "../../../../customFixtures/expertusFixture"
import { FakerData } from '../../../../utils/fakerUtils';
import enrollmentUsersData from '../../../../data/enrollmentUserData/EnrollmentUser.json';
import { createVCMultiInstance } from "../../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { expect } from "allure-playwright";

const courseName = "Past VC " + FakerData.getCourseName();
const users: any[] = enrollmentUsersData;
let vcInstanceName: string = "";

test.describe(`Verify admin can change enrollment status for Past VC Class`, () => {
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
    
    test(`Test 1: Setup - Create Past VC course and enroll 3 learners to class instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_010 - Setup Past VC class enrollment` },
            { type: `Test Description`, description: `Create Past VC course and enroll 3 learners to class instance` }
        );

        console.log(`🔄 Creating Past VC course: ${courseName}`);
        vcInstanceName = await createVCMultiInstance(courseName, "published") as string;
        console.log(`🎯 VC Instance Name: ${vcInstanceName}`);

        // Enroll all 3 users to VC class instance (not the course)
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(vcInstanceName);
        await enrollHome.clickSelectedLearner();
        
        for (let i = 0; i < Math.min(users.length, 3); i++) {
            console.log(`🔄 Enrolling user ${i + 1}: ${users[i].username} to VC class instance`);
            await enrollHome.enterSearchUser(users[i].username);
            await enrollHome.clickEnrollBtn();
            await enrollHome.verifytoastMessage();
            console.log(`✅ User ${i + 1} enrolled to VC class instance: ${users[i].username}`);
            await enrollHome.clickEnrollButton();
        }
        console.log(`✅ All 3 users enrolled to Past VC class instance`);
    });

    test(`Test 2: Verify all 3 users can see the VC class instance in My Learning`, async ({ learnerHome, createUser, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_010 - Verify learner side VC class instance visibility` },
            { type: `Test Description`, description: `Login as all 3 users and verify the Past VC class instance is available in My Learning` }
        );

        for (let i = 0; i < Math.min(users.length, 3); i++) {
            console.log(`\n🔄 Verifying for User ${i + 1}: ${users[i].username}`);
            await learnerHome.basicLogin(users[i].username, "default");
            await catalog.searchMyLearning(vcInstanceName);
            await catalog.clickCourseInMyLearning(vcInstanceName);
            console.log(`✅ User ${i + 1} can see the VC class instance in My Learning`);
            await createUser.clickLogOutButton();
        }
        
        console.log(`\n✅ All 3 users verified - VC class instance visible in My Learning`);
    });

    test(`Test 3: Verify able to change enrollment from Enrolled to Canceled for Past VC Class`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_010 - Change enrollment to Canceled` },
            { type: `Test Description`, description: `Admin changes User 1 enrollment from Enrolled to Canceled for Past VC Class` }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(vcInstanceName);       
        await enrollHome.clickViewLearner();
        
        // User 1: Change to Canceled
        console.log(`🔄 Changing User 1 (${users[0].username}) from Enrolled to Canceled`);
        await enrollHome.changeLearnerStatus(users[0].username, "Canceled");
        await enrollHome.clickviewUpdateEnrollmentBtn();
        console.log(`🔍 Verifying User 1 status changed to Canceled`);
        await enrollHome.verifyField("Status", "Canceled", users[0].username);
        console.log(`✅ User 1 status successfully changed to Canceled`);
    });

    test(`Test 4: Verify able to change enrollment from Enrolled to Completed for Past VC Class`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_010 - Change enrollment to Completed` },
            { type: `Test Description`, description: `Admin changes User 2 enrollment from Enrolled to Completed for Past VC Class` }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(vcInstanceName);       
        await enrollHome.clickViewLearner();
        
        // User 2: Change to Completed
        console.log(`🔄 Changing User 2 (${users[1].username}) from Enrolled to Completed`);
        await enrollHome.changeLearnerStatus(users[1].username, "Completed");
        await enrollHome.clickviewUpdateEnrollmentBtn();
        console.log(`🔍 Verifying User 2 status changed to Completed`);
        await enrollHome.verifyField("Status", "Completed", users[1].username);
        console.log(`✅ User 2 status successfully changed to Completed`);
    });

    test(`Test 5: Verify able to change enrollment from Enrolled to Incomplete for Past VC Class`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_010 - Change enrollment to Incomplete` },
            { type: `Test Description`, description: `Admin changes User 3 enrollment from Enrolled to Incomplete for Past VC Class` }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(vcInstanceName);       
        await enrollHome.clickViewLearner();
        
        // User 3: Change to Incomplete
        console.log(`🔄 Changing User 3 (${users[2].username}) from Enrolled to Incomplete`);
        await enrollHome.changeLearnerStatus(users[2].username, "Incomplete");
        await enrollHome.clickviewUpdateEnrollmentBtn();
        console.log(`🔍 Verifying User 3 status changed to Incomplete`);
        await enrollHome.verifyField("Status", "Incomplete", users[2].username);
        console.log(`✅ User 3 status successfully changed to Incomplete`);
    });

    test(`Test 6: Verify learners see correct status in Learning History - User 1: Canceled, User 2: Completed, User 3: Incomplete`, async ({ learnerHome, catalog, dashboard, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_010 - Verify learner side status` },
            { type: `Test Description`, description: `User 1 sees Canceled, User 2 sees Completed, User 3 sees Incomplete in Learning History` }
        );
        
        // User 1: Canceled - Should see in Learning History
        console.log(`🔄 User 1 (${users[0].username}) - Verifying Learning History for Canceled status`);
        await learnerHome.basicLogin(users[0].username, "DefaultPortal");
        await catalog.clickDashboardLink();
        await dashboard.selectDashboardItems("Learning History");
        await dashboard.learningHistoryCourseSearch(vcInstanceName);
        await dashboard.vaidatVisibleCourse_Program(vcInstanceName, "Canceled");
        console.log(`✅ User 1 - VC course appears in Learning History with Canceled status`);
        await createUser.clickLogOutButton();
        
        // User 2: Completed - Should see in Learning History
        console.log(`🔄 User 2 (${users[1].username}) - Verifying Learning History for Completed status`);
        await learnerHome.basicLogin(users[1].username, "DefaultPortal");
        await catalog.clickDashboardLink();
        await dashboard.selectDashboardItems("Learning History");
        await dashboard.learningHistoryCourseSearch(vcInstanceName);
        await dashboard.vaidatVisibleCourse_Program(vcInstanceName, "Completed");
        console.log(`✅ User 2 - VC course appears in Learning History with Completed status`);
        await createUser.clickLogOutButton();
        
        // User 3: Incomplete - Should see in Learning History
        console.log(`🔄 User 3 (${users[2].username}) - Verifying Learning History for Incomplete status`);
        await learnerHome.basicLogin(users[2].username, "DefaultPortal");
        await catalog.clickDashboardLink();
        await dashboard.selectDashboardItems("Learning History");
        await dashboard.learningHistoryCourseSearch(vcInstanceName);
        await dashboard.vaidatVisibleCourse_Program(vcInstanceName, "Incomplete");
        console.log(`✅ User 3 - VC course appears in Learning History with Incomplete status`);
        await createUser.clickLogOutButton();
        
        console.log(`✅ All 3 learners verified successfully!`);
    });
});
