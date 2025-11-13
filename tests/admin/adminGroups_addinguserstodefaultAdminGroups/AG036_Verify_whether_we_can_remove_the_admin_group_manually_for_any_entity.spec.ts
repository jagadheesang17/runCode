import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { AdminRoleManager } from "../../../utils/adminRoleManager";
import { UserPage } from "../../../pages/UserPage";
import { } from "../../../pages/AdminHomePage";
import { AdminGroupPage } from "../../../pages/AdminGroupPage";


let username = FakerData.getUserId();
let courseName = FakerData.getCourseName();
let description = FakerData.getDescription();
let adminGroupName = FakerData.getSession();
let roleName = FakerData.getFirstName() + " Admin";
let groupTitle: any;
let systemDefaultRole: any;
test.describe(`Verify whether we can remove the admin group manually for any entity`, async () => {
    test.describe.configure({ mode: 'serial' })
    test(`Creating a learner and adding to admin group`, async ({ adminHome, createUser, createCourse, adminGroup, adminRoleHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `Creating a learner and adding to admin group` },
            { type: `Test Description`, description: `Creating a learner and adding to admin group` }
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
        await adminHome.menuButton()
        await adminHome.people();
        await adminHome.clickAdminRole()
        await adminRoleHome.clickAddAdminRole();
        await adminRoleHome.enterName(roleName);
        await adminRoleHome.clickAllPriveileges();
        await adminRoleHome.clickSave()
        await adminRoleHome.verifyRole(roleName)
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.adminGroup();
        await adminGroup.clickCreateGroup();
        groupTitle = adminGroupName + " Group";
        await adminGroup.enterGroupTitle(groupTitle);
        console.log("groupTitle is " + groupTitle);
        await adminGroup.selectroleAdmin(roleName);
        await adminGroup.searchUser(username);
        await adminGroup.clickuserCheckbox(username);
        await adminGroup.clickActivate();
        await adminGroup.clickSaveBtn();
        await adminGroup.clickProceed();
        await createCourse.verifySuccessMessage();

    }
)
    test(`Single Instance Elearning Creation and removing the admin group from the access`, async ({ adminHome, contentHome, createCourse, editCourse }) => {

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name :" + description);
        await createCourse.contentLibrary() //By default youtube content will be added
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await createCourse.editcourse();
        await editCourse.clickAccesstab();
        await createCourse.addAdminGroup(groupTitle);
        await createCourse.saveAccessButton();
        await createCourse.removeAddedAdminGroup(groupTitle);
        await createCourse.saveAccessButton();
        await editCourse.clickClose();
        await createCourse.typeDescription("This is a new course by name :" + description);
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage()

    })





});