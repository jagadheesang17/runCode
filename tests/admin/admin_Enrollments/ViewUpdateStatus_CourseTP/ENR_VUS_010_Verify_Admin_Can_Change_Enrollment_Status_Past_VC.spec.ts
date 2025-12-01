import { credentials } from "../../../../constants/credentialData";
import { test } from "../../../../customFixtures/expertusFixture"
import { FakerData } from '../../../../utils/fakerUtils';
import enrollmentUsersData from '../../../../data/enrollmentUserData/EnrollmentUser.json';
import { createVCMultiInstance } from "../../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { expect } from "allure-playwright";

const courseName = "Past VC " + FakerData.getCourseName();
const users: any[] = enrollmentUsersData;
let vcInstanceNames: string[] = [];
const statusesToTest = ["Incomplete", "Completed", "Canceled"]; // User 0, 1, 2

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
            { type: `Test Description`, description: `Create Past VC course with 2 instances and enroll 3 learners to first instance` }
        );

        console.log(`🔄 Creating Past VC course with 2 instances: ${courseName}`);
        vcInstanceNames = await createVCMultiInstance(courseName, "published", 2, "pastclass") as string[];

        // Enroll all 3 users to FIRST VC class instance
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(vcInstanceNames[0]); // Use first instance
        await enrollHome.clickSelectedLearner();
        
        for (let i = 0; i < Math.min(users.length, 3); i++) {
            console.log(`🔄 Enrolling user ${i + 1}: ${users[i].username} to VC first instance`);
            await enrollHome.enterSearchUser(users[i].username);
            await enrollHome.clickEnrollBtn();
            await enrollHome.verifytoastMessage();
            console.log(`✅ User ${i + 1} enrolled to VC first instance: ${users[i].username}`);
            await enrollHome.clickEnrollButton();
        }
        console.log(`✅ All 3 users enrolled to first Past VC class instance: ${vcInstanceNames[0]}`);
    });

    test(`Test 2: Verify all 3 users can see the VC class instance in My Learning`, async ({ learnerHome, createUser, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_010 - Verify learner side VC class instance visibility` },
            { type: `Test Description`, description: `Login as all 3 users and verify the Past VC first instance is available in My Learning` }
        );

        for (let i = 0; i < Math.min(users.length, 3); i++) {
            console.log(`\n🔄 Verifying for User ${i + 1}: ${users[i].username}`);
            await learnerHome.basicLogin(users[i].username, "default");
            await catalog.searchMyLearning(vcInstanceNames[0]); // Check first instance
            await catalog.clickCourseInMyLearning(vcInstanceNames[0]);
            console.log(`✅ User ${i + 1} can see the VC first instance in My Learning`);
            await createUser.clickLogOutButton();
        }
        
        console.log(`\n✅ All 3 users verified - VC first instance visible in My Learning`);
    });

    test(`Test 3: Verify able to change enrollment from Enrolled to User 1: Incomplete, User 2: Completed, User 3: Canceled`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_010 - Change enrollment statuses` },
            { type: `Test Description`, description: `Admin changes User 1: Incomplete, User 2: Completed, User 3: Canceled for Past VC Class` }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(vcInstanceNames[0]); // Use first instance      
        await enrollHome.clickViewLearner();
        
        // Change status for all 3 users using loop
        for (let i = 0; i < Math.min(users.length, 3); i++) {
            const newStatus = statusesToTest[i];
            console.log(`🔄 Changing User ${i + 1} (${users[i].username}) from Enrolled to ${newStatus}`);
            await enrollHome.changeLearnerStatus(users[i].username, newStatus);
            await enrollHome.clickviewUpdateEnrollmentBtn();
            console.log(`🔍 Verifying User ${i + 1} status changed to ${newStatus}`);
            await enrollHome.verifyField("Status", newStatus, users[i].username);
            console.log(`✅ User ${i + 1} status successfully changed to ${newStatus}`);
        }
        
        console.log(`✅ All users updated - User 1: ${statusesToTest[0]}, User 2: ${statusesToTest[1]}, User 3: ${statusesToTest[2]}`);
    });

    
    test(`Test 4: Verify learners see correct status in Learning History - User 1: Incomplete, User 2: Completed, User 3: Canceled`, async ({ learnerHome, catalog, dashboard, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_010 - Verify learner side status` },
            { type: `Test Description`, description: `User 1: Incomplete, User 2: Completed, User 3: Canceled in Learning History` }
        );
        
        // Verify each user sees their correct status in Learning History
        for (let i = 0; i < Math.min(users.length, 3); i++) {
            const expectedStatus = statusesToTest[i];
            console.log(`🔄 User ${i + 1} (${users[i].username}) - Verifying Learning History for ${expectedStatus} status`);
            
            await learnerHome.basicLogin(users[i].username, "DefaultPortal");
            await catalog.clickDashboardLink();
            await dashboard.selectDashboardItems("Learning History");
            await dashboard.learningHistoryCourseSearch(vcInstanceNames[0]); // Check first instance
            await dashboard.vaidatVisibleCourse_Program(vcInstanceNames[0], expectedStatus);
            
            console.log(`✅ User ${i + 1} - VC course appears in Learning History with ${expectedStatus} status`);
            await createUser.clickLogOutButton();
        }
        
        console.log(`✅ All 3 learners verified successfully!`);
    });
});
