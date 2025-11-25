import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { AdminRoleManager } from "../../../utils/adminRoleManager";
import { UserPage } from "../../../pages/UserPage";
import { } from "../../../pages/AdminHomePage";
import { LearnerHomePage } from "../../../pages/LearnerHomePage";


let username = FakerData.getUserId();
let role: string[] = [];
let systemDefaultRole: any;
test.describe(`Verify scenario: user in two groups (People & Enrollment), remove one group → privilege should update`, async () => {
    test.describe.configure({ mode: 'serial' })
    test(`Creating a user and adding to the Enrollment Admin group and people admin group`, async ({ adminHome, createUser, createCourse, adminGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `Creating a user and adding to the Enrollment Admin group and people admin group` },
            { type: `Test Description`, description: `Creating a user and adding to the Enrollment Admin group and people admin group` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.clickCreateUser();
        await createUser.verifyCreateUserLabel();
        await createUser.enter("first_name", FakerData.getFirstName());
        await createUser.enter("last_name", FakerData.getLastName());
        await createUser.enter("username", username);
        console.log("username is " + username);
        await createUser.enter("user-password", "Welcome1@");
        await createUser.clickSave();
        await createUser.refreshPage();
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.adminGroup();
        await adminGroup.searchAdmin("Enrollment admin");
        await adminGroup.clickGroup("Enrollment admin");
        role[0] = await adminGroup.captureRole();
        console.log("role is " + role);
        await adminGroup.searchUser(username)
        await adminGroup.clickuserCheckbox(username)
        await adminGroup.clickSelectUsers();
        await adminGroup.clickUpdate();
        await createCourse.verifySuccessMessage();
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.adminGroup();
        await adminGroup.searchAdmin("People admin");
        await adminGroup.clickGroup("People admin");
        role[1] = await adminGroup.captureRole();
        console.log("role is " + role);
        await adminGroup.searchUser(username)
        await adminGroup.clickuserCheckbox(username)
        await adminGroup.clickSelectUsers();
        await adminGroup.clickUpdate();
        await createCourse.verifySuccessMessage();

    })
    test(`Removing a user in people admin group`, async ({ adminHome, adminGroup, learnerHome, createUser }) => {
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.adminGroup();
        await adminGroup.searchAdmin("People admin");
        await adminGroup.clickGroup("People admin");
        await adminGroup.deleteUserFromGroup(username);
        await adminGroup.clickUpdate();


    });

    test(`Verify  that the user can see only enrollment module `, async ({ adminHome, adminGroup, learnerHome, createUser }) => {

        await learnerHome.basicLogin(username, "default");
        await adminHome.menuButton();
        for (let i = 0; i < role.length; i++) {
            systemDefaultRole = await adminGroup.getRoleDataByRoleName(role[i]);
            console.log(`Using system default role: ${systemDefaultRole.roleName}`);
            await adminGroup.getPrivilegesByRoleName(systemDefaultRole.roleName);

        }

    });
});