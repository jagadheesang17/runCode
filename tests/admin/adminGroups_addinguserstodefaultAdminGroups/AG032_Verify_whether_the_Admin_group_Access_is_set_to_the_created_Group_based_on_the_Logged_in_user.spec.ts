import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { AdminRoleManager } from "../../../utils/adminRoleManager";
import { UserPage } from "../../../pages/UserPage";
import { } from "../../../pages/AdminHomePage";


let username = FakerData.getUserId();
const roleName1 = FakerData.getFirstName() + " Admin";
const roleName2 = FakerData.getFirstName() + " Admin";
const groupTitle = FakerData.getFirstName() + " Admin";
test.describe(`Verify whether the Admin group Access is set to the created Group based on the Logged in user`, async () => {
    test.describe.configure({ mode: 'serial' })
    test(`Verify the Custom role creation with all privileges `, async ({ adminHome, adminRoleHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `Create the Custom Role` },
            { type: `Test Description`, description: `Create the Custom Role` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton()
        await adminHome.people();
        await adminHome.clickAdminRole()
        await adminRoleHome.clickAddAdminRole()
        await adminRoleHome.enterName(roleName1);
        await adminRoleHome.clickAllPriveileges();
        await adminRoleHome.clickSave()
        await adminRoleHome.verifyRole(roleName1)
    })

    test(`Verify whether the user has been created and added to the custom admin group`, async ({ adminHome, createUser, createCourse, adminGroup }) => {
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
        await adminGroup.clickCreateGroup();
        await adminGroup.selectroleAdmin(roleName1)
        await adminGroup.enterGroupTitle(groupTitle)
        await adminGroup.searchUser(username);
        await adminGroup.clickuserCheckbox(username);
        await adminGroup.clickSelectUsers();
        await adminGroup.clickActivate();
        await adminGroup.clickSave();
        await adminGroup.clickProceed();
        await createCourse.verifySuccessMessage()
    }

    )

    test(`Verify the Custom role`, async ({ adminHome, adminRoleHome, learnerHome }) => {
        await learnerHome.basicLogin(username, "default");
        await adminHome.menuButton()
        await adminHome.people();
        await adminHome.clickAdminRole()
        await adminRoleHome.clickAddAdminRole()
        await adminRoleHome.enterName(roleName2);
        await adminRoleHome.clickAllPriveileges();
        await adminRoleHome.clickSave()
        await adminRoleHome.verifyRole(roleName2)
    })

    test(`verify whether the group access is set based on the logged in user`, async ({ adminHome, adminGroup, learnerHome, createCourse }) => {
        await learnerHome.basicLogin(username, "default");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.adminGroup();
        await adminGroup.clickCreateGroup();
        await adminGroup.selectroleAdmin(roleName2);
        await adminGroup.enterGroupTitle(FakerData.getFirstName() + " Admin");
        await adminGroup.clickActivate();
        await adminGroup.clickSave();
        await createCourse.verifySuccessMessage();
        await adminGroup.clickEditGroup();
        await adminGroup.clickProceed();
        await createCourse.clickAccessButton();
        await adminGroup.verifyAccess(groupTitle);
    });
});