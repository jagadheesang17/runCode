import { credentials } from "../../../../constants/credentialData";
import { test } from "../../../../customFixtures/expertusFixture"
import { FakerData } from '../../../../utils/fakerUtils';
import enrollmentUsersData from '../../../../data/enrollmentUserData/EnrollmentUser.json';
import { createILTMultiInstance } from "../../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { expect } from "allure-playwright";

const courseName = "ILT " + FakerData.getCourseName();
const certificationName = "CERT " + FakerData.getCourseName();
const description = FakerData.getDescription();
const users: any[] = enrollmentUsersData;

test.describe(`Verify admin can update enrollment type from Mandatory to Optional - Certification`, () => {
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
    
    test(`Setup - Create ILT multi-instance course, create certification, assign course & verify`, async ({ adminHome, editCourse, enrollHome, learningPath, contentHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_CERT_001 - Setup ILT multi-instance course and certification` },
            { type: `Test Description`, description: `Create ILT multi-instance course via API, create certification, assign course, enroll 3 learners as Mandatory and verify in View/Update Status` }
        );

        // Create ILT Multi-Instance Course via API
        console.log(`🔄 Creating ILT Multi-Instance course: ${courseName}`);
        await createILTMultiInstance(courseName, "published", 2);
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
            console.log(`🔄 Enrolling user ${i + 1} as Mandatory: ${users[i].username}`);
            await enrollHome.enterSearchUser(users[i].username);
            await enrollHome.clickMandatory();
            console.log(`✅ Mandatory checkbox checked`);
            await enrollHome.clickEnrollBtn();
            await enrollHome.verifytoastMessage();
            console.log(`✅ User ${i + 1} enrolled as Mandatory: ${users[i].username}`);
            await enrollHome.clickEnrollButton();
        }
        console.log(`✅ All 3 users enrolled with Mandatory enrollment type`);
        await enrollHome.selectEnrollmentOption("View/update Status - Course/TP");
        for (let i = 0; i < users.length; i++) {
            console.log(`🔍 Verifying User ${i + 1} (${users[i].username}) has Mandatory enrollment type`);
            await enrollHome.verifyField("Enrollment Type", "Mandatory", users[i].username);
            console.log(`✅ User ${i + 1} confirmed as Mandatory`);
        }
        console.log(`✅ All 3 users verified with Mandatory enrollment type in admin side`);
    });

    test(`Verify Mandatory enrollment type from learner side - All 3 users`, async ({ catalog, learnerHome, dashboard, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_CERT_001 - Verify learner side Mandatory enrollment` },
            { type: `Test Description`, description: `All 3 users verify Mandatory text is visible in My Learning for Certification` }
        );
        
        for (let i = 0; i < users.length; i++) {
            console.log(`🔄 User ${i + 1} (${users[i].username}) - Verifying Mandatory enrollment`);
            await learnerHome.basicLogin(users[i].username, "DefaultPortal");
            await learnerHome.clickDashboardLink();
            await dashboard.clickLearningPath_And_Certification();
            await dashboard.clickCertificationLink();
            await dashboard.searchCertification(certificationName);
            await dashboard.verifyTheEnrolledCertification(certificationName);
            await dashboard.verifyEnrollmentType("Mandatory");
            console.log(`✅ User ${i + 1} - Mandatory text verified`);
            await createUser.clickLogOutButton();
        }
        
        console.log(`✅ All 3 users verified Mandatory enrollment type`);
    });

    test(`Admin updates User 1 & User 3 from Mandatory to Optional & verify`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_CERT_001 - Update enrollment type to Optional` },
            { type: `Test Description`, description: `Admin changes User 1 & User 3 to Optional, User 2 remains Mandatory` }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(certificationName);       
        await enrollHome.clickViewLearner();
        
        // Change User 1 from Mandatory to Optional
        console.log(`🔄 Changing User 1 (${users[0].username}) from Mandatory to Optional`);
        await enrollHome.changeEnrollmentType(users[0].username);
        
        // Change User 3 from Mandatory to Optional
        console.log(`🔄 Changing User 3 (${users[2].username}) from Mandatory to Optional`);
        await enrollHome.changeEnrollmentType(users[2].username);
        
        // User 2 remains Mandatory (no change)
        console.log(`ℹ️ User 2 (${users[1].username}) remains Mandatory (no change)`);
        
        // Verify all 3 users enrollment type after update
        console.log(`🔍 Verifying enrollment types after update`);
        await enrollHome.verifyField("Enrollment Type", "Optional", users[0].username);  // User 1
        await enrollHome.verifyField("Enrollment Type", "Mandatory", users[1].username); // User 2
        await enrollHome.verifyField("Enrollment Type", "Optional", users[2].username);  // User 3
    });

    test(`Verify enrollment type from learner side - All 3 users`, async ({ catalog, learnerHome, dashboard, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ENR_VUS_CERT_001 - Verify learner side enrollment type` },
            { type: `Test Description`, description: `User 1 & 3 verify Optional (no Mandatory text), User 2 verifies Mandatory text` }
        );
        
        // Verify enrollment type for all 3 users using loop with if conditions
        for (let i = 0; i < users.length; i++) {
            const expectedType = (i === 1) ? "Mandatory" : "Optional"; // User 2 (index 1) is Mandatory, others are Optional
            
            console.log(`🔄 User ${i + 1} (${users[i].username}) - Verifying ${expectedType} enrollment`);
            await learnerHome.basicLogin(users[i].username, "DefaultPortal");
            await learnerHome.clickDashboardLink();
            await dashboard.clickLearningPath_And_Certification();
            await dashboard.clickCertificationLink();
            await dashboard.searchCertification(certificationName);
            await catalog.clickViewCertificationDetails();
            
            if (i === 1) {
                // User 2: Should see Mandatory
                await dashboard.verifyEnrollmentType("Mandatory");
                console.log(`✅ User ${i + 1} - Mandatory text verified`);
            } else {
                // User 1 & User 3: Should see Optional
                await dashboard.verifyEnrollmentType("Optional");
                console.log(`✅ User ${i + 1} - Optional text verified`);
            }
            
            await createUser.clickLogOutButton();
        }
        
        console.log(`✅ All 3 users enrollment type verification completed`);
    });
});
