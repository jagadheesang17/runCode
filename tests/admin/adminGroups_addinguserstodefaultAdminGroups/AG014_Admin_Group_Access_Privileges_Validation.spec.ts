import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

const roleBasedGroups = ["Manager", "Instructor"];

test.describe(`Verify whether admin cannot add users to the Manager/Instructor Group The users should be added to the Manager/Instructor group based on the role given in Create User`, async () => {
    test.describe.configure({ mode: 'serial' })

    test(`Verify role-based  admin groups cannot add users manually - users added automatically by role`, async ({ adminHome, adminGroup, createUser, exportPage }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `AG014_Role_Based_Admin_Group_Access_Validation` },
            { type: `Test Description`, description: `Verify that admin cannot manually add users to Manager/Instructor Groups. Users should be added automatically based on role assignment` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        
        // Loop through each role-based admin group
        for (const group of roleBasedGroups) {
            const firstName = FakerData.getFirstName();
            const username = `${group.toLowerCase()}_user_${firstName}`;
            
            console.log(`\n======= TESTING ${group.toUpperCase()} GROUP =======`);
            
            // Step 1: Open Admin Group and verify we cannot add users manually
            console.log(`\n=== STEP 1: Verifying ${group} Group - Cannot Add Users Manually ===`);
            await adminHome.menuButton();
            await adminHome.people();
            await adminHome.adminGroup();
            
            await adminGroup.searchAdmin(group);
            await adminGroup.clickGroup(group);
            
            // Verify the user search dropdown is disabled
            const isDropdownDisabled = await adminGroup.verifyUserSearchDropdownDisabled();
            if (!isDropdownDisabled) {
                throw new Error(`FAIL: User search dropdown should be disabled for ${group} group`);
            }
            console.log(`✓ PASS: User search dropdown is disabled for ${group} group`);
            
            // Step 2: Create user with specific role
            console.log(`\n=== STEP 2: Creating User with ${group} Role ===`);
            await adminHome.menuButton();
            await adminHome.people();
            await adminHome.user();
            await createUser.clickCreateUser();
            await createUser.uncheckInheritAddressIfPresent();
            await createUser.uncheckInheritEmergencyContactIfPresent();
            await createUser.uncheckAutoGenerateUsernameIfPresent();
            await createUser.enter("first_name", firstName);
            await createUser.enter("last_name", FakerData.getLastName());
            await createUser.enter("username", username);
            await createUser.enter("user-password", "Welcome1@");
            await createUser.enter("email", FakerData.getEmail());
            await createUser.enter("user-phone", FakerData.getMobileNumber());
            await createUser.typeAddress("Address 1", FakerData.getAddress());
            await createUser.typeAddress("Address 2", FakerData.getAddress());
            await createUser.select("Country", "United States");
            await createUser.select("State/Province", "California");
            // await createUser.select("Time Zone", "America/Los_Angeles");
            // await createUser.selectLanguage("English");
            // await createUser.select("Currency", "USD");
            // await createUser.enter("user-city", "Los Angeles");
            // await createUser.enter("user-zipcode", "90210");
            await createUser.enter("user-mobile", FakerData.getMobileNumber());
            
            // Assign specific role
            await createUser.clickRolesButton(group);
            
            await createUser.clickSave();
            await createUser.verifyUserCreationSuccessMessage();
            console.log(`✓ ${group} user created successfully: ${username}`);
            
            // Step 3: Verify user is automatically added to Admin Group via Export
            console.log(`\n=== STEP 3: Verifying User Automatically Added to ${group} Group via Export ===`);
            
            await adminGroup.page.reload();
            await adminHome.menuButton();
            await adminHome.people();
            await adminHome.adminGroup();
            await adminGroup.searchAdmin(group);
            await adminGroup.clickGroup(group);
            
            // Export CSV file
            await exportPage.clickExportAs("CSV");
            
            // Validate that the username exists in the exported file
            await exportPage.validateUsernamesInExport("CSV", [username]);
            console.log(`✓ PASS: User '${username}' with ${group} role automatically added to ${group} group (verified via CSV export)`);
        }
        
        console.log(`\n======= COMPREHENSIVE TEST RESULTS =======`);
        roleBasedGroups.forEach(group => {
            const username = `${group.toLowerCase()}_user`;
            console.log(`✓ ${group} Group: Manual addition disabled, automatic role-based assignment working`);
            console.log(`✓ ${group} User '${username}': Automatically added to ${group} group (verified via export)`);
        });
        console.log(`✓ PASS: All AG014 tests passed - Role-based admin group access privileges working correctly`);
        await adminHome.page.reload();
    });
});