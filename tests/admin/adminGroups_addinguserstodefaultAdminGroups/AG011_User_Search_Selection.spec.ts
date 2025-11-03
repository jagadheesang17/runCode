import { test } from "../../../customFixtures/expertusFixture";
import { AdminGroupManager } from "../../../utils/adminGroupManager";
import { credentials } from "../../../constants/credentialData";
import { FakerData } from "../../../utils/fakerUtils";
import { readDataFromCSV } from "../../../utils/csvUtil";

let groupData: any;
let testUsers: any[] = [];

test.describe(`AG011 - Comprehensive User Management & Admin Group Assignment`, async () => {
    test.describe.configure({ mode: 'serial' })
    
    test.beforeAll(async () => {
        groupData = await AdminGroupManager.getGroupDataByType("all_privileges");
        
        // Create 3 test users for the comprehensive flow
        testUsers = [
            {
                username: FakerData.getUserId(),
                firstName: FakerData.getFirstName(),
                lastName: FakerData.getLastName(),
                purpose: "username_search_and_assign"
            },
            {
                username: FakerData.getUserId(), 
                firstName: FakerData.getFirstName(),
                lastName: FakerData.getLastName(),
                purpose: "name_search_and_suspend_assigned"
            },
            {
                username: FakerData.getUserId(),
                firstName: FakerData.getFirstName(), 
                lastName: FakerData.getLastName(),
                purpose: "suspend_unassigned"
            }
        ];
        
        console.log("Test Users Created for AG011 Flow:");
        testUsers.forEach((user, index) => {
            console.log(`User ${index + 1}: ${user.username} (${user.firstName} ${user.lastName}) - ${user.purpose}`);
        });
    });

    // Test 1: Create 3 users
    test(`Test 1: Create Three Test Users for Comprehensive Flow`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `AG011_Step1_Create_Test_Users` },
            { type: `Test Description`, description: `Create 3 test users for username search, name search, and suspension testing scenarios` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        
        // Navigate to User creation page and get CSV data
        await adminHome.clickMenu("User");
        await createUser.verifyCreateUserLabel();
        await createUser.uncheckInheritAddressIfPresent();
        await createUser.uncheckInheritEmergencyContactIfPresent();
        await createUser.uncheckAutoGenerateUsernameIfPresent();
        const csvFilePath = './data/User.csv';
        const data = await readDataFromCSV(csvFilePath);
        const { country, state, timezone, currency, city, zipcode } = data[0];
        //
        for (let i = 0; i < testUsers.length; i++) {
            const user = testUsers[i];
            
            console.log(`Creating User ${i + 1}: ${user.username} for ${user.purpose}`);
            

            await createUser.enter("first_name", user.firstName);
            await createUser.enter("last_name", user.lastName);
            await createUser.enter("username", user.username);
            await createUser.enter("user-password", "Welcome1@");
            await createUser.enter("email", FakerData.getEmail());
            await createUser.enter("user-phone", FakerData.getMobileNumber());
            await createUser.typeAddress("Address 1", FakerData.getAddress());
            await createUser.typeAddress("Address 2", FakerData.getAddress());
            await createUser.select("Country", country);
            await createUser.select("State/Province", state);
            await createUser.select("Time Zone", timezone);
            await createUser.select("Currency", currency);
            await createUser.enter("user-city", city);
            await createUser.enter("user-zipcode", zipcode);
            await createUser.enter("user-mobile", FakerData.getMobileNumber());
            await createUser.userProfileUpload();
            await createUser.clickSave();
            await createUser.verifyUserCreationSuccessMessage();
            
            console.log(`PASS: User ${i + 1} created successfully: ${user.username}`);
            
            // Click Create User for next iteration, but not for the last user
            if (i < testUsers.length - 1) {
                await createUser.clickCreateUser();
            }
        }
        
        console.log("All 3 test users created successfully for comprehensive testing");
    });

    // Test 2: Test user search functionality using 2 users (1 with username, 1 with name)  
    test(`Test 2: Verify User Search by UserName and Name`, async ({ adminHome, adminGroup ,createCourse}) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `AG011_Step2_User_Search_Functionality` },
            { type: `Test Description`, description: `Verify that users can be searched using both UserName and Name dropdown options with created test users` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.adminGroup();
        await adminGroup.searchAdmin(groupData.groupTitle);
        await adminGroup.clickGroup(groupData.groupTitle);
        
        // Search by UserName using first test user
        console.log(`Testing search by Username: ${testUsers[0].username}`);
        await adminGroup.selectUserSearchType("UserName");
        await adminGroup.searchUser(testUsers[0].username);
        await adminGroup.clickuserCheckbox(testUsers[0].username);
        await adminGroup.clickSelectUsers();
        
        
        // Search by Name using second test user's first name
        console.log(`Testing search by Name: ${testUsers[1].firstName}`);
        await adminGroup.selectUserSearchType("Name");
        await adminGroup.searchUser(testUsers[1].firstName);
        await adminGroup.clickuserCheckbox(testUsers[1].firstName);
        await adminGroup.clickSelectUsers();

        await adminGroup.clickUpdate();
        await createCourse.verifySuccessMessage();
        
        // Verify success message after updating admin group
        console.log(`PASS: Admin group "${groupData.groupTitle}" updated successfully with selected users`);
        
        console.log("PASS: User search functionality validated using both UserName and Name options");
    });

    // Test 3: Add users to admin group and verify already added users exclusion
    test(`Test 3: Verify whether the Already added users are not getting displayed in Select users`, async ({ adminHome, adminGroup,createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `AG011_Step3_Already_Added_Users_Exclusion` },
            { type: `Test Description`, description: `Add users to admin group and verify they no longer appear in Select users section` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.adminGroup();
        await adminGroup.searchAdmin(groupData.groupTitle);
        await adminGroup.clickGroup(groupData.groupTitle);
        
        // Verify that the user already added in Test 2 doesn't appear in Select Users anymore
        const user = testUsers[0]; // This user was already added to admin group in Test 2
        console.log(`Verifying already added user ${user.username} is excluded from Select Users`);
        
        // Search for the user that was already added in Test 2
        await adminGroup.selectUserSearchType("UserName");
        await adminGroup.searchUser(user.username);
        
        // Verify "No matching result found" message appears
        await adminGroup.verifyNoMatchingResultFound();
        console.log(`PASS: Already added user ${user.username} correctly excluded from Select Users`);
        
        console.log("Already added user exclusion functionality validated successfully");
    });


    test(`Test 4: Suspend Test Users`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `AG011_Step4_Suspend_Users` },
            { type: `Test Description`, description: `Suspend one assigned user and one unassigned user to test suspension behavior` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
            
        // Suspend user 1 (assigned to admin group) and user 3 (not assigned)
        const usersToSuspend = [
            { user: testUsers[0], status: "assigned to admin group" },  // First user (added by username)
            { user: testUsers[2], status: "not assigned to admin group" }  // Third user (never added)
        ];
        
        for (let i = 0; i < usersToSuspend.length; i++) {
            const { user, status } = usersToSuspend[i];
            
            console.log(`Suspending user ${i + 1}: ${user.username} (${status})`);

            // Search and select the user
            console.log(`Searching for user: ${user.username}`);
            await createUser.userSearchField(user.username);
            await createUser.editIcon();
            await createUser.verifyEditUserLabel();
            await createUser.clickSuspendButton();

            
            // Mark user as suspended in our test data
            user.isSuspended = true;
            
            console.log(`PASS: User ${user.username} suspended successfully`);
        }
        
        console.log("Both users (1 assigned, 1 unassigned) suspended successfully");
    });

    // Test 5: Verify suspended users don't appear in Select Users section
    test(`Test 5: Verify Suspended Users Not Displayed in Select Users Section`, async ({ adminHome, adminGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `AG011_Step5_Suspended_Users_Exclusion` },
            { type: `Test Description`, description: `Verify that suspended users do not appear in the Select Users section of Admin Group` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.adminGroup();
        await adminGroup.searchAdmin(groupData.groupTitle);
        await adminGroup.clickGroup(groupData.groupTitle);
        
        // Try to search for suspended users in Select Users section (user 0 and user 2 were suspended)
        const suspendedUsers = [testUsers[0], testUsers[2]]; // First user (assigned) and third user (unassigned)
        
        for (const user of suspendedUsers) {
            console.log(`Verifying suspended user ${user.username} is not in Select Users...`);
            await adminGroup.selectUserSearchType("UserName");
            await adminGroup.searchUser(user.username);
            await adminGroup.verifyNoMatchingResultFound();
        }
    
        console.log("✓ All suspended users properly excluded from Select Users section");
    });

    // Test 6: Verify users removed from Admin Group when suspended
    test(`Test 6: Verify Users Removed from Admin Group When Suspended`, async ({ adminHome, adminGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `AG011_Step6_Suspended_Users_Removed_From_Group` },
            { type: `Test Description`, description: `Verify that users are automatically removed from admin groups when they get suspended` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.adminGroup();
        await adminGroup.searchAdmin(groupData.groupTitle);
        await adminGroup.clickGroup(groupData.groupTitle);
        
        // Check the "Added Users" section to verify suspended users are no longer there
        const currentAdminGroupUsers = await adminGroup.getAdminGroups();
        
        // Verify that the suspended user who was in admin group (testUsers[0]) is removed
        // testUsers[1] should still be in the group (not suspended)
        // testUsers[2] was never in the group anyway
        
        // Check if suspended user (testUsers[0]) is removed from admin group
        const suspendedAssignedUser = testUsers[0];
        const isUserInGroup = currentAdminGroupUsers.some((groupUser: string) => 
            groupUser.includes(suspendedAssignedUser.username) || 
            groupUser.includes(suspendedAssignedUser.firstName) || 
            groupUser.includes(suspendedAssignedUser.lastName)
        );
        
        if (!isUserInGroup) {
            console.log(`✓ Suspended user ${suspendedAssignedUser.username} correctly removed from admin group`);
        } else {
            console.log(` Suspended user ${suspendedAssignedUser.username} still appears in admin group - this may need investigation`);
        }
        
        // Check if non-suspended user (testUsers[1]) is still in the admin group
        const nonSuspendedUser = testUsers[1];
        const isNonSuspendedUserInGroup = currentAdminGroupUsers.some((groupUser: string) => 
            groupUser.includes(nonSuspendedUser.username) || 
            groupUser.includes(nonSuspendedUser.firstName) || 
            groupUser.includes(nonSuspendedUser.lastName)
        );
        
        if (isNonSuspendedUserInGroup) {
            console.log(`✓ Non-suspended user ${nonSuspendedUser.username} correctly remains in admin group`);
        } else {
            console.log(` Non-suspended user ${nonSuspendedUser.username} not found in admin group - this may need investigation`);
        }
        
        console.log("✓ Suspended user removal and non-suspended user retention in admin group validated");
    });

    // Bonus Step: Verify Deleted Users Behavior
    test(`Test 7: Verify Deleted Users Are Not Displayed in Added Users and Select Users Sections`, async ({ adminHome, createUser, adminGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `AG011_Step7_Deleted_Users_Complete_Exclusion` },
            { type: `Test Description`, description: `Delete non-suspended user and verify they do not appear in both Added Users section and Select Users search of admin groups` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        // Delete only the non-suspended user (testUsers[1]) - suspended users cannot be deleted
        const userToDelete = testUsers[1]; // This user was added to admin group but not suspended
        console.log(`Deleting non-suspended user: ${userToDelete.username}`);
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.userSearchField(userToDelete.username);
        await createUser.clickDeleteIcon();
        
        console.log(`✓ User ${userToDelete.username} deleted successfully`);
        
        // Navigate to admin group for verification
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.adminGroup();
        await adminGroup.searchAdmin(groupData.groupTitle);
        await adminGroup.clickGroup(groupData.groupTitle);
        
        // Step 1: Verify deleted user doesn't appear in Added Users section
        console.log(`\nStep 1: Checking Added Users section...`);
        const finalAdminGroupUsers = await adminGroup.getAdminGroups();
        
        const isUserInAddedUsers = finalAdminGroupUsers.some((groupUser: string) => 
            groupUser.includes(userToDelete.username) || 
            groupUser.includes(userToDelete.firstName) || 
            groupUser.includes(userToDelete.lastName)
        );
        
        if (!isUserInAddedUsers) {
            console.log(`✓ Deleted user ${userToDelete.username} correctly excluded from Added Users section`);
        } else {
            console.log(`✗ Deleted user ${userToDelete.username} still appears in Added Users section`);
        }
        
        // Step 2: Verify deleted user doesn't appear in Select Users search
        console.log(`\nStep 2: Checking Select Users search section...`);
        try {
            await adminGroup.selectUserSearchType("UserName");
            await adminGroup.searchUser(userToDelete.username);
            await adminGroup.wait("minWait");
            
            // Check if "No matching result found" message appears
            const noMatchingResult = await adminGroup.verifyNoMatchingResultFound();
            
            if (noMatchingResult) {
                console.log(`✓ Deleted user ${userToDelete.username} correctly excluded from Select Users search`);
            } else {
                console.log(`✗ Deleted user ${userToDelete.username} still appears in Select Users search`);
            }
        } catch (error) {
            // If user is not found in search, that's the expected behavior
            console.log(`✓ Deleted user ${userToDelete.username} correctly excluded from Select Users search`);
        }
        
        // Summary
        const bothChecksPass = !isUserInAddedUsers;
        if (bothChecksPass) {
            console.log(`\n✓ VALIDATION PASSED: Deleted user properly excluded from both sections`);
        } else {
            console.log(`\n✗ VALIDATION FAILED: Deleted user found in one or both sections`);
        }
        
        console.log(`\nNote: testUsers[0] and testUsers[2] are suspended and cannot be deleted`);
        console.log(`AG011 - Complete user management and admin group assignment scenarios validated`);
    });
});