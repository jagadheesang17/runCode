import { test } from "../../../customFixtures/expertusFixture";
import { readDataFromCSV } from "../../../utils/csvUtil";
import { FakerData } from "../../../utils/fakerUtils";
import { updateFieldsInJSON } from "../../../utils/jsonDataHandler";

const managerInstructorUser: any = FakerData.getUserId();
const firstName = FakerData.getFirstName();
const lastName = FakerData.getLastName();
const groupTitle = FakerData.getFirstName() + " Admin Group";
const roleName = FakerData.getFirstName() + " Admin Role";

test.describe(`USRT17_Verify_that_a_user_with_manager_and_instructor_roles_can_be_added_to_custom_admin_group_and_login`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Create user with Manager and Instructor roles, create admin group and add user to group`, async ({ adminHome, adminRoleHome, createUser, adminGroup, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create user with Manager and Instructor roles, create admin group and add user to group` },
            { type: `Test Description`, description: `Complete workflow: Create custom admin role, create user with Manager+Instructor roles, create admin group, and add user to group` }
        );

        // Update JSON data for tracking
        const newData = {
            managerInstructorUser: managerInstructorUser
        };
        updateFieldsInJSON(newData);

        // Step 1: Create custom admin role with all privileges
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickAdminRole();

        await adminRoleHome.clickAddAdminRole();
        await adminRoleHome.enterName(roleName);
        await adminRoleHome.clickAllPriveileges();
        await adminRoleHome.clickSave();
        await adminRoleHome.verifyRole(roleName);

        // Step 2: Create user with Manager and Instructor roles
        const csvFilePath = './data/User.csv';
        const data = await readDataFromCSV(csvFilePath);

        for (const row of data) {
            const { country, state, timezone, currency, city, zipcode } = row;
            await adminHome.menuButton();
            await adminHome.people();
            await adminHome.user();
            await createUser.clickCreateUser();
            await createUser.verifyCreateUserLabel();

            // Uncheck default options if present
            await createUser.uncheckInheritAddressIfPresent();
            await createUser.uncheckInheritEmergencyContactIfPresent();
            await createUser.uncheckAutoGenerateUsernameIfPresent();

            // Fill user details
            await createUser.enter("first_name", firstName);
            await createUser.enter("last_name", lastName);
            await createUser.enter("username", managerInstructorUser);
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

            // Assign both Manager and Instructor roles
            await createUser.clickRolesButton("Manager");
            await createUser.clickRolesButton("Instructor");

            await createUser.clickSave();
            await createUser.verifyUserCreationSuccessMessage();
        }
        await adminHome.menuButton()
        await adminHome.people();
        await adminHome.adminGroup();
        await adminGroup.clickCreateGroup();
        await adminGroup.selectroleAdmin(roleName);
        await adminGroup.enterGroupTitle(groupTitle)
        await adminGroup.searchUser(managerInstructorUser)
        await adminGroup.clickuserCheckbox(managerInstructorUser)
        await adminGroup.clickSelelctUsers();
        await adminGroup.clickActivate();
        await adminGroup.clickSave()
        await adminGroup.clickProceed();
        await createCourse.verifySuccessMessage();
    });

    test(`Step 5: Login as the created admin user and verify access`, async ({ learnerHome, adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Login as the created admin user and verify access` },
            { type: `Test Description`, description: `Verify that the created user can login and has admin access with Manager and Instructor capabilities` }
        );

        // Login as the created user
        await learnerHome.basicLogin(managerInstructorUser, "DefaultPortal");
        // Verify user can access admin functions
        await adminHome.clickQuickAccess();
        await adminHome.selectingQuickAccessValue();
        //Navigate to learner side from admin page
        await adminHome.navigateToLearner();
        // Verify Manager role access
        await learnerHome.selectCollaborationHub();
        await learnerHome.verifyLandingPage("Collaboration Hub");
        // Verify Instructor role access
        await learnerHome.selectInstructor();
        await learnerHome.verifyLandingPage("Instructor");
    });
});