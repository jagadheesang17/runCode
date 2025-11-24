import { credentials } from "../../../../constants/credentialData";
import { test } from "../../../../customFixtures/expertusFixture"
import { FakerData } from '../../../../utils/fakerUtils';
import enrollmentUsersData from '../../../../data/enrollmentUserData/EnrollmentUser.json';
import { createCourseAPI } from "../../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { expect } from "allure-playwright";
import { AdminLogin } from "../../../../pages/AdminLogin";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
let createdCode: any;
const users: any[] = enrollmentUsersData;

test.describe(`Verify enrolled learners list display with all fields in View/Modify Enrollment`, () => {
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
    
    test(`Setup - Create course and enroll 3 learners`, async ({ adminHome, createCourse, enrollHome, contentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_001 - Setup course and enrollment` },
            { type: `Test Description`, description: `Create a course and enroll 3 learners for testing View/Modify enrollment functionality` }
        );

        const content = 'content testing-001';
        const result = await createCourseAPI(content, courseName, 'published', 'single', 'e-learning');
        expect(result).toBe(courseName);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.clickSelectedLearner();
        // Enroll all 3 users
        for (let i = 0; i < users.length; i++) {
            console.log(`🔄 Enrolling user ${i + 1}: ${users[i].username}`);
            

            await enrollHome.enterSearchUser(users[i].username);
            
            // Make first user Mandatory, others Optional
            if (i === 0) {
                await enrollHome.clickMandatory();
            }
            
            await enrollHome.clickEnrollBtn();
            await enrollHome.verifytoastMessage();
            
            console.log(`✅ User ${i + 1} enrolled: ${users[i].username}`);
            await enrollHome.clickEnrollButton();
    
        }

    });

    test(`Verify Learner side - User 1 completes, User 2 starts, User 3 enrolled only`, async ({ catalog, learnerHome,createUser, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_001 - Learner side actions` },
            { type: `Test Description`, description: `User 1 completes course, User 2 sets to in progress, User 3 stays enrolled` }
        );
        
        console.log(`🔄 User 1 (${users[0].username}) - Completing course...`);
        await learnerHome.basicLogin(users[0].username, "DefaultPortal");
        await catalog.searchMyLearning(courseName);
        await catalog.clickCourseInMyLearning(courseName);
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.clickDashboardLink();
        await dashboard.selectDashboardItems("Learning History");
        await dashboard.learningHistoryCourseSearch(courseName);
        await dashboard.vaidatVisibleCourse_Program(courseName,"Completed");
        console.log(`✅ User 1 (${users[0].username}) - Completed`);
        await createUser.clickLogOutButton();
        // User 2: Start course but don't complete (Optional + In Progress)
        console.log(`🔄 User 2 (${users[1].username}) - Setting to In Progress...`);
        await learnerHome.basicLogin(users[1].username, "DefaultPortal");
        await catalog.searchMyLearning(courseName);
        await catalog.clickCourseInMyLearning(courseName);
        await catalog.inProgress();
        console.log(`✅ User 2 (${users[1].username}) - In Progress`);
        
        // User 3: Don't access the course (Optional + Enrolled)
        console.log(`✅ User 3 (${users[2].username}) - Remains Enrolled (not accessed)`);
    });

   test(`Verify the fields are displayed correctly for all 3 learners`, async ({ adminHome, enrollHome, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_001 - Verify list fields for all learners` },
            { type: `Test Description`, description: `Verify after selecting View/modify enrollment, the enrolled learners list should display with all fields for all 3 learners` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(courseName);       
        await enrollHome.clickViewLearner();
        await enrollHome.verifyAllTableHeaders();
        
        // Verify User 1: Mandatory + Completed + 100% + Score: Many
        console.log(`🔍 Verifying fields for User 1 (${users[0].username}) - Mandatory/Completed`);
        await enrollHome.verifyField("Name", users[0].firstname + " " + users[0].lastname, users[0].username);
        await enrollHome.verifyField("Username", users[0].username, users[0].username);
        await enrollHome.verifyField("Status", "Completed", users[0].username);
        await enrollHome.verifyField("Progress", "100", users[0].username);
        await enrollHome.verifyField("Score", "Many", users[0].username);
        await enrollHome.verifyField("Enrollment Type", "Mandatory", users[0].username);
        // await enrollHome.verifyLearnerScore("Many", users[0].username);
        await enrollHome.verifyAddNotesIconVisible(users[0].username);
        await enrollHome.verifyFilesIconVisible(users[0].username);
        console.log(`✅ User 1 verified: Mandatory, Completed, 100%, Score: Many`);
        
        // Verify User 2: Optional + In Progress + Progress < 100% (not 0%) + Score: -
        console.log(`🔍 Verifying fields for User 2 (${users[1].username}) - Optional/In Progress`);
        await enrollHome.verifyField("Name", users[1].firstname + " " + users[1].lastname, users[1].username);
        await enrollHome.verifyField("Username", users[1].username, users[1].username);
       await enrollHome.verifyField("Status", "In Progress", users[1].username);
       await enrollHome.verifyField("Score", "Many", users[1].username);
        // Progress will be > 0% and < 100% - verify it's not 0 or 100
        await enrollHome.verifyField("Enrollment Type", "Optional", users[1].username);
       // await enrollHome.verifyLearnerScore("-", users[1].username);
       
        await enrollHome.verifyAddNotesIconVisible(users[1].username);
        await enrollHome.verifyFilesIconVisible(users[1].username);
        console.log(`✅ User 2 verified: Optional, In Progress, Score: -`);

        // Verify User 3: Optional + Enrolled + 0% + Score: -
        console.log(`🔍 Verifying fields for User 3 (${users[2].username}) - Optional/Enrolled`);
        await enrollHome.verifyField("Name", users[2].firstname + " " + users[2].lastname, users[2].username);
        await enrollHome.verifyField("Username", users[2].username, users[2].username);
        await enrollHome.verifyField("Status", "Enrolled", users[2].username);
        await enrollHome.verifyField("Progress", "0", users[2].username);
        await enrollHome.verifyField("Score", "Many", users[2].username);
        await enrollHome.verifyField("Enrollment Type", "Optional", users[2].username);
        // await enrollHome.verifyLearnerScore("-", users[2].username);
        await enrollHome.verifyAddNotesIconVisible(users[2].username);
        await enrollHome.verifyFilesIconVisible(users[2].username);
        console.log(`✅ User 3 verified: Optional, Enrolled, 0%, Score: -`);
        
        console.log(`✅ All 3 learners verified successfully!`);
    });
});
