import { credentials } from "../../../../constants/credentialData";
import { test } from "../../../../customFixtures/expertusFixture"
import { FakerData } from '../../../../utils/fakerUtils';
import enrollmentUsersData from '../../../../data/enrollmentUserData/EnrollmentUser.json';
import { createILTMultiInstance } from "../../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { expect } from "allure-playwright";

const courseName = FakerData.getCourseName();
const learningPathName = "LP " + FakerData.getCourseName();
const users: any[] = enrollmentUsersData;
const description = FakerData.getDescription();
test.describe(`Verify admin can change enrollment status for Learning Path`, () => {
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
    
    test(`Test 1: Setup - Create ILT course, Learning Path and enroll 3 learners`, async ({ adminHome, enrollHome, learningPath, createCourse,editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_008 - Setup Learning Path enrollment` },
            { type: `Test Description`, description: `Create ILT multi-instance course, add to Learning Path and enroll 3 learners` }
        );

               console.log(`🔄 Creating ILT Multi-Instance course: ${courseName}`);
               await createILTMultiInstance(courseName, "published", 2,"pastclass");
               console.log(`✅ ILT Multi-Instance course created: ${courseName}`);
       
               // Create Learning Path and assign the ILT course
               await adminHome.loadAndLogin("CUSTOMERADMIN");
               await adminHome.menuButton();
               await adminHome.clickLearningMenu();
               await adminHome.clickLearningPath();
               await learningPath.clickCreateLearningPath();
               await learningPath.title(learningPathName);
               await learningPath.language();
               await learningPath.description(description);
               await learningPath.clickSave();
               await learningPath.clickProceedBtn();
               console.log(`✅ Learning Path created: ${learningPathName}`);
       
               // Add the ILT multi-instance course to learning path
               await learningPath.clickAddCourse();
               await learningPath.searchAndClickCourseCheckBox(courseName);
               await learningPath.clickAddSelectCourse();
               console.log(`✅ Added ILT course to learning path: ${courseName}`);
       
               // Publish the learning path
               await learningPath.clickDetailTab();
               await learningPath.description(description);
               await createCourse.clickCatalog();
               await createCourse.clickUpdate();
               await createCourse.verifySuccessMessage();
               console.log(`✅ Learning Path published successfully`);
       
               await learningPath.clickEditLearningPath();    
               await editCourse.clickEnrollments();
               await enrollHome.selectEnroll();
       
               
               for (let i = 0; i < users.length; i++) {
                   console.log(`🔄 Enrolling user ${i + 1}  ${users[i].username}`);
                   await enrollHome.enterSearchUser(users[i].username);
                   await enrollHome.clickEnrollBtn();
                   await enrollHome.verifytoastMessage();
                   console.log(`✅ User ${i + 1} enrolled  ${users[i].username}`);
                   await enrollHome.clickEnrollButton();
               }
               console.log(`✅ All 3 users enrolled`);
               await enrollHome.selectEnrollmentOption("View/update Status - Course/TP");
        
    });

    test(`Test 2: Verify all 3 users can see the Learning Path in My Learning`, async ({ learnerHome, createUser, catalog, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_008 - Verify learner side Learning Path visibility` },
            { type: `Test Description`, description: `Login as all 3 users and verify the Learning Path is available in My Learning` }
        );

        for (let i = 0; i < Math.min(users.length, 3); i++) {
            console.log(`\n🔄 Verifying for User ${i + 1}: ${users[i].username}`);
            await learnerHome.basicLogin(users[i].username, "DefaultPortal");
            await learnerHome.clickMyLearning();
            await catalog.searchCatalog(learningPathName);
            await catalog.clickCourseInMyLearning(learningPathName);
            console.log(`✅ User ${i + 1} can see the Learning Path in My Learning`);
            await createUser.clickLogOutButton();
        }
        
        console.log(`\n✅ All 3 users verified - Learning Path visible in My Learning`);
    });

    test(`Test 3: Admin changes enrollment status - All users to Canceled`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_008 - Change enrollment statuses` },
            { type: `Test Description`, description: `Admin changes all 3 users from Enrolled to Canceled (LP can only be Enrolled or Canceled)` }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectByOption("Learning Path");
        await enrollHome.selectBycourse(learningPathName);       
        await enrollHome.clickViewLearner();
        
        for (let i = 0; i < Math.min(users.length, 3); i++) {
            console.log(`🔄 Changing User ${i + 1} (${users[i].username}) from Enrolled to Canceled`);
            await enrollHome.changeLearnerStatus(users[i].username, "Canceled");
            await enrollHome.clickviewUpdateEnrollmentBtn();
            console.log(`🔍 Verifying User ${i + 1} status changed to Canceled`);
            await enrollHome.verifyField("Status", "Canceled", users[i].username);
            console.log(`✅ User ${i + 1} status successfully changed to Canceled`);
        }
        
        console.log(`✅ All 3 users updated to Canceled status`);
    });

    test(`Test 4: Verify learners see Canceled status in Learning History`, async ({ learnerHome, catalog, dashboard, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_008 - Verify learner side status` },
            { type: `Test Description`, description: `All 3 users see Canceled status in Learning History` }
        );
        
        for (let i = 0; i < Math.min(users.length, 3); i++) {
            console.log(`🔄 User ${i + 1} (${users[i].username}) - Verifying Learning History for Canceled status`);
            await learnerHome.basicLogin(users[i].username, "DefaultPortal");
            await catalog.clickDashboardLink();
            await dashboard.selectDashboardItems("Learning History");
            await dashboard.navigateBookmarkLinks("Learning Path");
            await dashboard.learningHistoryCourseSearch(learningPathName);
            await dashboard.vaidatVisibleCourse_Program(learningPathName, "Canceled");
            console.log(`✅ User ${i + 1} - Learning Path appears in Learning History with Canceled status`);
            await createUser.clickLogOutButton();
        }
        
        console.log(`✅ All 3 learners verified successfully with Canceled status!`);
    });
});
