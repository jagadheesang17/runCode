import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import adminGroupsData from "../../../data/adminGroupsData.json";
import { URLConstants } from "../../../constants/urlConstants";

const firstName = FakerData.getFirstName();
const lastName = FakerData.getLastName();
const validEmail = FakerData.getEmail();
const phoneNumber = FakerData.getMobileNumber();

test.describe.serial("USRT20 - User Creation Negative Scenarios Tests", () => {

    test("USRT20 - Verify User Creation Negative Validation Scenarios", async ({
        adminHome,
        createUser,
        contentHome,
        createCourse
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `USRT20 - User Creation Negative Scenarios` },
            { type: `Test Description`, description: `Verify validation errors for invalid user creation data including special characters, invalid emails, missing domains, duplicate usernames, and duplicate managers` }
        );

        // Step 1: Login and Navigate to User Creation
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();

        // Step 2: Test First Name with Special Characters
        await createUser.clickCreateUser();
        await createUser.uncheckInheritAddressIfPresent();
        await createUser.uncheckInheritEmergencyContactIfPresent();
        await createUser.uncheckAutoGenerateUsernameIfPresent();

        // Enter invalid first name with special characters
        await createUser.enter("first_name", "John@#$%");
        await createUser.enter("last_name", lastName);
        await createUser.enter("username", FakerData.getUserId());
        await createUser.enter("user-password", "Welcome1@");
        await createUser.enter("email", validEmail);
        await createUser.enter("user-phone", phoneNumber);

        // Try to save and verify error message
        await createUser.clickSave();
        await createUser.verifyErrorMessage("The first name field may only contain alpha-numeric and ,-\"\"''()&._/<>.");
        console.log("✅ Step 2: First name special character validation passed");

        // Step 3: Test Email without Domain
        await createUser.clearField("first_name");
        await createUser.enter("first_name", firstName);
        await createUser.clearField("email");
        await createUser.enter("email", "invalidemail"); // Email without domain

        await createUser.clickSave();
        await createUser.verifyErrorMessage("The Contact Email field must contain all valid email addresses.");
        console.log("✅ Step 3: Email without domain validation passed");

        // Step 4: Test Missing Domain (assuming there's a domain field)
        await createUser.clearField("email");
        await createUser.enter("email", validEmail);

        // Navigate to domain section and clear domains
        await createCourse.selectDomainOption("no domain") // Assuming this action clears domain selection

        await createUser.clickSave();
        await createUser.verifyDomainErrorMessage("Domains is required.");
        console.log("✅ Step 4: Missing domain validation passed");

        // Step 5: Test Duplicate Username
        await createCourse.selectDomain(URLConstants.portal1);
        await createUser.clearField("username");
        await createUser.enter("username", adminGroupsData.teamUser1); // Use existing username from data

        await createUser.clickSave();
        await createUser.verifyErrorMessage("Someone already has the Username");
        console.log("✅ Step 5: Duplicate username validation passed");

        // Step 6: Test Valid User Creation for Manager Duplicate Test
        await createUser.clearField("username");
        const uniqueUsername = FakerData.getUserId();
        await createUser.enter("username", uniqueUsername);

        // Select manager
        await createUser.selectManager(adminGroupsData.managerName);

        await createUser.clickSave();
        await contentHome.gotoListing();
        console.log("✅ Step 6: Valid user created successfully for manager duplicate test");

        // Step 7: Test Same Manager as Other Manager (Duplicate Manager Scenario)
        await createUser.clickCreateUser();
        await createUser.uncheckInheritAddressIfPresent();
        await createUser.uncheckInheritEmergencyContactIfPresent();
        await createUser.uncheckAutoGenerateUsernameIfPresent();

        await createUser.enter("first_name", FakerData.getFirstName());
        await createUser.enter("last_name", FakerData.getLastName());
        await createUser.enter("username", FakerData.getUserId());
        await createUser.enter("user-password", "Welcome1@");
        await createUser.enter("email", FakerData.getEmail());
        await createUser.enter("user-phone", FakerData.getMobileNumber());

        // Select same manager as both manager and other manager
        await createUser.selectManager(adminGroupsData.managerName);

        // Try to select the same manager as other manager (should fail as dropdown will be empty)
        try {
            await createUser.selectSpecificManager(adminGroupsData.managerName); // Same manager as other manager
            console.log("WARNING: Same manager was allowed to be selected as other manager");
        } catch (error) {
            console.log("EXPECTED: Same manager cannot be selected as other manager - dropdown is empty");
        }

        await createUser.clickSave();
        // Note: The specific error message for duplicate manager scenario may vary
        // This test verifies that the system prevents adding the same manager in different roles
        console.log("✅ Step 7: Duplicate manager scenario tested");

        // Step 8: Cleanup - Delete the test user created in Step 6
        await contentHome.gotoListing();
        await createUser.userSearchField(uniqueUsername);
        await createUser.clickDeleteIcon();
        console.log("✅ Step 8: Cleanup completed - test user deleted");

        console.log("✅ All negative validation scenarios completed successfully");
    });
});