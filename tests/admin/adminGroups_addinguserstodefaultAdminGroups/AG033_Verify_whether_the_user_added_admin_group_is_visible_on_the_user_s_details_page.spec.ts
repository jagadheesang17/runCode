import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';


let username = FakerData.getUserId();
const roleName1 = FakerData.getFirstName() + " Admin";
const groupTitle = FakerData.getFirstName() + " Admin";
test.describe(`Verify whether the user added admin group is visible on the user's details page`, async () => {
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
        await adminRoleHome.clickAddAdminRole();
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
    })

    test(`Verify the admin group has been added automatically on the access`, async ({ adminHome, adminGroup, createCourse, createUser
    }) => {
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.userSearchField(username);
        await createUser.editIcon();
        await createUser.clickAssociatedGroups();
        await adminGroup.verifyAccess(groupTitle);
    })


});