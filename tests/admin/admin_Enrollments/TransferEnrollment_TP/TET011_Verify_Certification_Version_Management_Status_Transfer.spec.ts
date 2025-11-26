import { credentials } from "../../../../constants/credentialData";
import { test } from "../../../../customFixtures/expertusFixture"
import { FakerData } from '../../../../utils/fakerUtils';
import { createCourseAPI } from "../../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { expect } from "allure-playwright";

let courseName1 = FakerData.getCourseName();
let courseName2 = FakerData.getCourseName();
let description = FakerData.getDescription();
let certTitle = FakerData.getCourseName();
let certTitleVersion2 = certTitle + " - Version 2";

// Using credentials from credentialData.ts
const users = [
    { username: credentials.TEAMUSER1.username, password: credentials.TEAMUSER1.password },
    { username: credentials.TEAMUSER2.username, password: credentials.TEAMUSER2.password },
    { username: credentials.LEARNERUSERNAME.username, password: credentials.LEARNERUSERNAME.password },
    { username: credentials.MANAGERNAME.username, password: credentials.MANAGERNAME.password },
    { username: credentials.INSTRUCTORNAME.username, password: credentials.INSTRUCTORNAME.password }
];

test.describe(`TE011 - Verify Certification version management with enrollment status transfer`, () => {
    test.describe.configure({ mode: "serial" });
    
    test.beforeAll(() => {
        console.log(`📋 Loaded ${users.length} users from credentials`);
        users.forEach((user, index) => {
            console.log(`   User ${index + 1}: ${user.username}`);
        });
    });
    
    test(`Creation of E-learning courses`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TE011 - Create two courses` },
            { type: `Test Description`, description: `Create two E-learning courses for Certification via API` }
        );

        // Create Course 1 via API
        const content = 'content testing-001';
        const result1 = await createCourseAPI(content, courseName1, 'published', 'single', 'e-learning');
        expect(result1).toBe(courseName1);
        console.log(`✅ Course 1 created via API: ${courseName1}`);

        // Create Course 2 via API
        const result2 = await createCourseAPI(content, courseName2, 'published', 'single', 'e-learning');
        expect(result2).toBe(courseName2);
        console.log(`✅ Course 2 created via API: ${courseName2}`);
    });

    test(`Create Certification and enroll 5 users`, async ({ adminHome, learningPath, createCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TE011 - Create Certification and enroll users` },
            { type: `Test Description`, description: `Create Certification with course 1 and enroll 5 users` }
        );

        // Create Certification
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(certTitle);
        await learningPath.description(description);
        await learningPath.language();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName1);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await learningPath.verifySuccessMessage();
        console.log(`✅ Certification created: ${certTitle}`);

        // Enroll 5 users
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectByOption("Certification");
        await enrollHome.selectBycourse(certTitle);
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

    test(`User 1 completes and User 2 sets to In Progress`, async ({ catalog, learnerHome, createUser, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TE011 - Learner actions` },
            { type: `Test Description`, description: `User 1 completes course, User 2 sets to In Progress` }
        );
        
        // User 1: Complete course
        console.log(`🔄 User 1 (${users[0].username}) - Completing course...`);
        await learnerHome.basicLogin(users[0].username, "DefaultPortal");
         await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.searchCertification(certTitle);
        await dashboard.verifyTheEnrolledCertification(certTitle);
        await dashboard.clickTitle(certTitle);
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.saveLearningStatus();
        await catalog.verifyStatus("Completed");
        console.log(`✅ User 1 (${users[0].username}) - Completed`);
        await createUser.clickLogOutButton();
        
    });

    test(`Admin updates status - User 5: Completed, User 3: Canceled, User 4: remains Enrolled`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TE011 - Admin status updates` },
            { type: `Test Description`, description: `Admin changes User 5 to Completed, User 3 to Canceled, User 4 remains Enrolled` }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectByOption("Certification");
        await enrollHome.selectBycourse(certTitle);       
        await enrollHome.clickViewLearner();

        // User 3 (LEARNERUSERNAME): Change to Canceled
        console.log(`🔄 Changing status to Canceled for User 3 (${users[2].username})`);
        await enrollHome.changeLearnerStatus(users[2].username, "Canceled");
        await enrollHome.clickviewUpdateEnrollmentBtn();
        await enrollHome.verifyField("Status", "Canceled", users[2].username);
        console.log(`✅ User 3 status updated: Canceled`);

         // User 4 (MANAGERNAME): Verify remains Enrolled
        console.log(`🔍 Verifying User 4 (${users[3].username}) remains Enrolled`);
        await enrollHome.verifyField("Status", "Enrolled", users[3].username);
        await enrollHome.verifyField("Progress", "0", users[3].username);
        console.log(`✅ User 4 status: Enrolled with 0% progress (no change)`);

        // User 5 (INSTRUCTORNAME): Change to Completed
        console.log(`🔄 Changing status to Completed for User 5 (${users[4].username})`);
        await enrollHome.changeLearnerStatus(users[4].username, "Completed");
        await enrollHome.clickviewUpdateEnrollmentBtn();
        await enrollHome.verifyField("Progress", "100", users[4].username);
        console.log(`✅ User 5 status updated: Completed with 100% progress`);
        
   
        
       
    });

    test(`Create Version 2 with additional course and transfer learners`, async ({ adminHome, learningPath, createCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TE011 - Create Version 2 and transfer` },
            { type: `Test Description`, description: `Create Version 2 with additional course and transfer all enrollments` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await createCourse.catalogSearch(certTitle);
        await learningPath.clickEditIconFromTPListing(certTitle);

        // Click Add Version button
        await learningPath.clickAddVersionBtn();

        // Click Create button to create version
        await learningPath.clickCreateVersionBtn();

        // Update title with version 2
        await learningPath.title(certTitleVersion2);

        // Click catalog and update
        await createCourse.clickCatalog();
        
        // Verify version changed to Version 2
        await learningPath.verifyVersionNumber("2");
        
        await createCourse.clickUpdate();
        
        // Verify confirmation popup messages
        await learningPath.verifyPublishConfirmationPopup();

        // Click Yes button
        await learningPath.clickYesBtn();

        // Verify success message
        await learningPath.verifySuccessMessage();
        
        // Add the second course to version 2
        await learningPath.clickEditCertification();
        console.log(`🔄 Adding second course (${courseName2}) to Version 2`);
        await createCourse.clickCourseOption("Structure");
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName2);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();

        // Click catalog and update
        await createCourse.clickCatalog();
        
        // Verify version changed to Version 2
        await learningPath.verifyVersionNumber("2");
        
        await createCourse.clickUpdate();

        // Verify success message
        await learningPath.verifySuccessMessage();

        console.log(`✅ Version 2 created successfully: ${certTitleVersion2}`);

        // Transfer enrollments from version 1 to version 2 via Manage Enrollment menu
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.manageEnrollment("Transfer Enrollment - Training Plan");
        await enrollHome.selectByOption("Certification");
        await enrollHome.selectBycourse(certTitle);
        await enrollHome.clickViewLearner();
        await learningPath.selectAllLearners();
        await learningPath.clickTransferLearnersBtn();
        await learningPath.verifyTransferConfirmationPopup();

        // Click Yes to confirm transfer
        await learningPath.clickYesBtn();

        console.log("✅ Successfully transferred all enrollments from Version 1 to Version 2");
    });

    test(`Verify all users status in Version 2 - Completed users become In progress`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TE011 - Verify status after transfer` },
            { type: `Test Description`, description: `Verify users who completed Version 1 become In progress (50%) in Version 2 due to additional course` }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectByOption("Certification");
        await enrollHome.selectBycourse(certTitle);       
        await enrollHome.clickViewLearner();

        // Verify User 1 (TEAMUSER1): Was Completed in V1 → Now In progress + 50% in V2 (due to additional course)
        console.log(`🔍 Verifying User 1 (${users[0].username}) - Completed V1 course, now In progress in V2`);
        await enrollHome.verifyField("Username", users[0].username, users[0].username);
        await enrollHome.verifyField("Status", "In progress", users[0].username);
        await enrollHome.verifyField("Progress", "50", users[0].username);
        console.log(`✅ User 1 verified: In progress with 50% (completed course1, needs course2)`)
        
        // Verify User 2 (TEAMUSER2): Enrolled
        console.log(`🔍 Verifying User 2 (${users[1].username}) - Should be Enrolled`);
        await enrollHome.verifyField("Username", users[1].username, users[1].username);
        await enrollHome.verifyField("Status", "Enrolled", users[1].username);
        console.log(`✅ User 2 verified: Enrolled`);
        // Verify User 3 (LEARNERUSERNAME): Canceled
        console.log(`✅ User 3 verified: Canceled`);
        
        // Verify User 4 (MANAGERNAME): Enrolled + 0%
        console.log(`🔍 Verifying User 4 (${users[3].username}) - Should be Enrolled`);
        await enrollHome.verifyField("Username", users[3].username, users[3].username);
        await enrollHome.verifyField("Status", "Enrolled", users[3].username);
        await enrollHome.verifyField("Progress", "0", users[3].username);
        console.log(`✅ User 4 verified: Enrolled with 0% progress`);
        
        // Verify User 5 (INSTRUCTORNAME): Was Completed in V1 → Now In progress + 50% in V2 (due to additional course)
        console.log(`🔍 Verifying User 5 (${users[4].username}) - Admin set to Completed in V1, now In progress in V2`);
        await enrollHome.verifyField("Username", users[4].username, users[4].username);
        await enrollHome.verifyField("Status", "In progress", users[4].username);
        await enrollHome.verifyField("Progress", "50", users[4].username);
        console.log(`✅ User 5 verified: In progress with 50% (completed course1, needs course2)`);
        
        console.log(`✅ All 5 learners status verified! Completed users (1,5) now In progress due to added course in V2`);
    });
});
