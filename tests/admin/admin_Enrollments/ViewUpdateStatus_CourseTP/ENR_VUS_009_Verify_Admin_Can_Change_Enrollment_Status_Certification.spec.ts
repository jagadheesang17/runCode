import { credentials } from "../../../../constants/credentialData";
import { test } from "../../../../customFixtures/expertusFixture"
import { FakerData } from '../../../../utils/fakerUtils';
import enrollmentUsersData from '../../../../data/enrollmentUserData/EnrollmentUser.json';
import { createILTMultiInstance } from "../../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { expect } from "allure-playwright";

const courseName = FakerData.getCourseName();
const certificationName = "CERT " + FakerData.getCourseName();
const users: any[] = enrollmentUsersData;
const description = FakerData.getDescription();

test.describe(`Verify admin can change enrollment status for Certification`, () => {
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
    
    test(`Test 1: Setup - Create ILT course, Certification and enroll 3 learners`, async ({ adminHome, enrollHome, createCourse,learningPath,editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_009 - Setup Certification enrollment` },
            { type: `Test Description`, description: `Create ILT multi-instance course, add to Certification and enroll 3 learners` }
        );

        
        console.log(`🔄 Creating ILT Multi-Instance course: ${courseName}`);
        await createILTMultiInstance(courseName, "published", 2, "pastclass");
        console.log(`✅ ILT Multi-Instance course created: ${courseName}`);

        // Create Certification and assign the ILT course
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(certificationName);
        await learningPath.language();
        await learningPath.description(description);
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        console.log(`✅ Certification created: ${certificationName}`);

        // Add the ILT multi-instance course to certification
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        console.log(`✅ Added ILT course to certification: ${courseName}`);

        // Publish the certification
        await learningPath.clickDetailTab();
        await learningPath.description(description);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Certification published successfully`);

        await learningPath.clickEditCertification();    
        await editCourse.clickEnrollments();
        await enrollHome.selectEnroll();

        for (let i = 0; i < users.length; i++) {
            console.log(`🔄 Enrolling user ${i + 1} as Optional: ${users[i].username}`);
            await enrollHome.enterSearchUser(users[i].username);
            await enrollHome.clickEnrollBtn();
            await enrollHome.verifytoastMessage();
            console.log(`✅ User ${i + 1} enrolled as Optional: ${users[i].username}`);
            await enrollHome.clickEnrollButton();
        }
        console.log(`✅ All 3 users enrolled with Optional enrollment type`);
        
        await enrollHome.selectEnrollmentOption("View/update Status - Course/TP");
        for (let i = 0; i < users.length; i++) {
            console.log(`🔍 Verifying User ${i + 1} (${users[i].username}) has Optional enrollment type`);
            await enrollHome.verifyField("Enrollment Type", "Optional", users[i].username);
            console.log(`✅ User ${i + 1} confirmed as Optional`);
        }
        console.log(`✅ All 3 users verified with Optional enrollment type in admin side`);
    });

    test(`Test 2: Verify all 3 users can see the Certification in My Learning`, async ({ learnerHome, createUser, catalog, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_009 - Verify learner side Certification visibility` },
            { type: `Test Description`, description: `Login as all 3 users and verify the Certification is available in My Learning` }
        );

        for (let i = 0; i < Math.min(users.length, 3); i++) {
            console.log(`\n🔄 Verifying for User ${i + 1}: ${users[i].username}`);
            await learnerHome.basicLogin(users[i].username, "DefaultPortal");
            // await learnerHome.clickMyLearning();
            // await catalog.searchCatalog(certificationName);
            // await dashboard.searchCertification(certificationName);
            // await catalog.clickViewCertificationDetails();
            // console.log(`✅ User ${i + 1} can see the Certification in My Learning`);
            await dashboard.clickLearningPath_And_Certification();
            await dashboard.clickCertificationLink();
            await dashboard.searchCertification(certificationName);
            await dashboard.verifyTheEnrolledCertification(certificationName);
            await dashboard.clickTitle(certificationName);



            await createUser.clickLogOutButton();
        }
        
        console.log(`\n✅ All 3 users verified - Certification visible in My Learning`);
    });

    test(`Test 3: Admin changes enrollment status - All users to Canceled`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_009 - Change enrollment statuses` },
            { type: `Test Description`, description: `Admin changes all 3 users from Enrolled to Canceled (Certification can only be Enrolled or Canceled)` }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectByOption("Certification");
        await enrollHome.selectBycourse(certificationName);       
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
            { type: `TestCase`, description: `ENR_VUS_009 - Verify learner side status` },
            { type: `Test Description`, description: `All 3 users see Canceled status in Learning History` }
        );
        
        for (let i = 0; i < Math.min(users.length, 3); i++) {
            console.log(`🔄 User ${i + 1} (${users[i].username}) - Verifying Learning History for Canceled status`);
            await learnerHome.basicLogin(users[i].username, "DefaultPortal");
            await catalog.clickDashboardLink();
            await dashboard.selectDashboardItems("Learning History");
            await dashboard.navigateBookmarkLinks("Certification");
            await dashboard.learningHistoryCourseSearch(certificationName);
            await dashboard.vaidatVisibleCourse_Program(certificationName, "Canceled");
            console.log(`✅ User ${i + 1} - Certification appears in Learning History with Canceled status`);
            await createUser.clickLogOutButton();
        }
        
        console.log(`✅ All 3 learners verified successfully with Canceled status!`);
    });
});
