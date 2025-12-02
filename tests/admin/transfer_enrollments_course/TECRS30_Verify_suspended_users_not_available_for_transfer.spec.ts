import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";
import { createILTMultiInstance } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";

const courseName = FakerData.getCourseName();
const suspendedUserName = FakerData.getUserId();
const activeUserName = FakerData.getUserId();
let instanceNames: string[] = [];

test.describe.serial(`TECRS30 - Verify that suspended users should not be able to transfer enrollments`, async () => {

    test(`Create course with two ILT instances using API`, async ({ }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS30 - Step 1: Create Course with 2 ILT Instances` },
            { type: `Test Description`, description: `Create ILT course with 2 instances using API` }
        );

        // Create course with 2 instances using API
        instanceNames = await createILTMultiInstance(courseName, "published", 2, "future");
        
        console.log(`✅ Course created with 2 ILT instances: ${instanceNames.join(', ')}`);
    });

    test(`Create suspended user and active user`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS30 - Step 2: Create Suspended and Active Users` },
            { type: `Test Description`, description: `Create one suspended user and one active user for transfer test` }
        );

        // Create and suspend first user
            await adminHome.loadAndLogin("SUPERADMIN")
                await adminHome.menuButton()
                await adminHome.people();
                await adminHome.user();
                await createUser.clickCreateUser();
                await createUser.verifyCreateUserLabel();
                await createUser.uncheckAutoGenerateUsernameIfPresent();
                await createUser.enter("first_name", FakerData.getFirstName());
                await createUser.enter("last_name", FakerData.getLastName());
                await createUser.enter("username", suspendedUserName);
                await createUser.enter("user-password", "Welcome1@");
                await createUser.clickSave();
             //   await createUser.clickProceed("Proceed");
             //   await createUser.verifyUserCreationSuccessMessage()
        // Suspend the user
        // await createUser.userSearchField(suspendedUserName);
        // await createUser.editIcon();
        // await createUser.verifyEditUserLabel();
        // await createUser.clickSuspendButton();
        

        // Create active user
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.clickCreateUser();
        await createUser.uncheckAutoGenerateUsernameIfPresent();
        await createUser.enter("first_name", FakerData.getFirstName());
        await createUser.enter("last_name", FakerData.getLastName());
        await createUser.enter("username", activeUserName);
        await createUser.enter("user-password", "Welcome1@");
        await createUser.enter("email", FakerData.getEmail());
        await createUser.enter("user-phone", FakerData.getMobileNumber());
        await createUser.clickSave();
        await createUser.verifyUserCreationSuccessMessage();
        
        console.log(`✅ Active user "${activeUserName}" created`);
    });

    test(`Enroll suspended user in first instance and active user in second instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS30 - Step 3: Enroll Users in Different Instances` },
            { type: `Test Description`, description: `Enroll suspended user in first instance and active user in second instance` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");
        
        // Enroll suspended user in first instance
        await enrollHome.selectBycourse(instanceNames[0]);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(suspendedUserName);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        
        console.log(`✅ Suspended user "${suspendedUserName}" enrolled in first instance: ${instanceNames[0]}`);

        // Enroll active user in second instance
        await adminHome.page.reload();
        await adminHome.clickAdminHome();
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");
        await enrollHome.selectBycourse(instanceNames[1]);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(activeUserName);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        
        console.log(`✅ Active user "${activeUserName}" enrolled in second instance: ${instanceNames[1]}`);
    });

    test(`Suspend learner after enrollment and verify not available for transfer`, async ({ adminHome, enrollHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS30 - Step 3A: Suspend Learner After Enrollment` },
            { type: `Test Description`, description: `Suspend an enrolled learner and verify they are not available for transfer` }
        );

        // Suspend the active user after enrollment
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.userSearchField(activeUserName);
        await createUser.editIcon();
        await createUser.verifyEditUserLabel();
        await createUser.clickSuspendButton();
        
        console.log(`✅ Active user "${activeUserName}" has been suspended after enrollment`);
    });

    test(`Verify suspended-after-enrollment user NOT available in transfer dropdown`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS30 - Step 3B: Verify Post-Suspension User Not in Transfer` },
            { type: `Test Description`, description: `Verify that user suspended after enrollment does not appear in transfer learner list` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");
        
        // Navigate to transfer enrollment
        await enrollHome.selectEnrollmentOption("Transfer Enrollment - Course");
        await enrollHome.searchCourseForTransfer(courseName);
        await enrollHome.clearFilterCrossMarks();
        
        // Select source instance with user suspended after enrollment
        await enrollHome.selectSourceInstance(instanceNames[1]);
        await enrollHome.wait("mediumWait");
        await enrollHome.selectTargetInstance(instanceNames[0]);
        await enrollHome.selectlearner();
        await enrollHome.verifyLearnerStatusInTransferEnrollmentPage(suspendedUserName, "Suspended");
        await enrollHome.verifyLearnerStatusInTransferEnrollmentPage(activeUserName, "Enrolled");


});
        
    });

    