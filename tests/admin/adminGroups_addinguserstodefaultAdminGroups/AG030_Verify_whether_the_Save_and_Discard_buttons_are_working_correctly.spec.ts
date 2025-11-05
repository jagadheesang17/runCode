import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { AdminRoleManager } from "../../../utils/adminRoleManager";
import { UserPage } from "../../../pages/UserPage";
import { } from "../../../pages/AdminHomePage";
import { AdminGroupPage } from "../../../pages/AdminGroupPage";


let username = FakerData.getUserId();


let role: any;
let systemDefaultRole: any;
test.describe(`Verify Admin Group Save and Discard Button Functionality`, async () => {
    test.describe.configure({ mode: 'serial' })
    test(`Creating admin group and validating the Save and Discard buttons`, async ({ adminHome, createUser, createCourse, adminGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `Creating admin group and validating the Save and Discard buttons` },
            { type: `Test Description`, description: `Creating admin group and validating the Save and Discard buttons` }
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
        await adminGroup.clickCreateGroup();
        await adminGroup.enterGroupTitle(FakerData.getSession());
        await adminGroup.clickSaveBtn();
        await adminGroup.clickProceed();
        await createCourse.verifySuccessMessage();
        await adminGroup.clickEditGroup();
        await adminGroup.searchUser(username);
        await adminGroup.clickuserCheckbox(username);
        await adminGroup.clickDiscard();
        await adminGroup.validateAdminGroupListing();


    })
});