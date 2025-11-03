import { test } from "../../../customFixtures/expertusFixture";
import { AdminGroupManager } from "../../../utils/adminGroupManager";
import { AdminRoleManager } from "../../../utils/adminRoleManager";
import { FakerData } from "../../../utils/fakerUtils";


let groupData: any;
let roleData: any;
let testUsers: any[] = [];

test.describe(`Verify whether the Export Functionality is working correctly`, async () => {
    test.describe.configure({ mode: 'serial' })
    
    test.beforeAll(async () => {
        groupData = await AdminGroupManager.getGroupDataByType("basic");
        roleData = await AdminRoleManager.getRoleDataByRoleName("QA_Basic_Admin_Role");
        console.log(`Using admin group: ${groupData.groupTitle}`);
        console.log(`Using admin role: ${roleData.roleName}`);
    });

    test(`Test 1: Verify whether the Export Functionality is working correctly`, async ({ adminHome, createUser, adminGroup, exportPage }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `AG013_Test1_CSV_Export_Validation` },
            { type: `Test Description`, description: `Create 3 users, add to admin group, extract UI data (names/usernames), export CSV, and validate UI data matches CSV content` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.clickMenu("User");
        await createUser.verifyCreateUserLabel();
        // Generate 2 test users with basic details (use Manager_User_{firstname} to avoid duplicate usernames)
        for (let i = 0; i < 2; i++) {
            const firstName = FakerData.getFirstName();
            const lastName = FakerData.getLastName();
            const username = `Manager_User_${firstName}`;
            const user = {
                firstName,
                lastName,
                username,
                email: FakerData.getEmail(),
                password: "Welcome1@"
            };
            testUsers.push(user);
        }

        console.log(`Creating ${testUsers.length} test users for AG023...`);

        // Create users with basic details only
        for (let i = 0; i < testUsers.length; i++) {
            const user = testUsers[i];
            
            await createUser.enter("first_name", user.firstName);
            await createUser.enter("last_name", user.lastName);
            await createUser.enter("username", user.username);
            await createUser.enter("user-password", user.password);

            await createUser.clickSave();
            await createUser.verifyUserCreationSuccessMessage();
            console.log(`PASS: User ${i + 1} created successfully: ${user.username}`);
             if (i < testUsers.length - 1) {
              await createUser.clickCreateUser();    
            }
        }

        console.log(`PASS: All ${testUsers.length} users created successfully`);

        await adminHome.page.reload();
        await adminHome.wait("mediumWait");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.adminGroup();

        await adminGroup.searchAdmin(groupData.groupTitle);
        await adminGroup.clickGroup(groupData.groupTitle);

        console.log(`PASS: Navigated to admin group: ${groupData.groupTitle}`);

        // Add created users to the admin group
        for (const user of testUsers) {
            try {
                // Search for the user by username
                await adminGroup.selectUserSearchType("UserName");
                await adminGroup.searchUser(user.username);
                await adminGroup.wait("minWait");
                
                // Select the user if found
                await adminGroup.clickuserCheckbox(user.username);
                console.log(`PASS: User ${user.username} selected for admin group`);
            } catch (error) {
                console.log(`INFO: User ${user.username} might already be added or not found: ${error.message}`);
            }
        }

        // Click Select Users and Update
        await adminGroup.clickSelectUsers();
        await adminGroup.clickUpdate();
        console.log(`Users added to admin group successfully`);
        
        await adminHome.page.reload();
        await adminGroup.searchAdmin(groupData.groupTitle);
        await adminGroup.clickGroup(groupData.groupTitle);
        
        const uiUsers = await adminGroup.getAddedUsers();
        console.log(`Successfully extracted ${uiUsers.length} users from UI`);

        // Export Excel file
        await exportPage.clickExportAs("Excel");
        
        // Validate the exported file matches UI data
        await exportPage.validateExported("Excel");


        
    });

});