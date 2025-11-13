import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { AdminRoleManager } from "../../../utils/adminRoleManager";
import { UserPage } from "../../../pages/UserPage";
import { } from "../../../pages/AdminHomePage";
import { AdminGroupPage } from "../../../pages/AdminGroupPage";
import { Faker } from "@faker-js/faker";
let username = FakerData.getUserId();
let courseName = FakerData.getCourseName();
let description = FakerData.getDescription();
let adminGroupName = FakerData.getSession();
let roleName = FakerData.getFirstName() + " Admin";
let groupTitle: any;
let systemDefaultRole: any;
test.describe(`Verify whether the suspended admin group cannot be added to any entity`, async () => {
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
        groupTitle = adminGroupName + " Group_" + FakerData.getCertificationNumber();
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
    test(`Suspend admin group that is assigned to course`, async ({ adminHome, adminGroup }) => {
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.adminGroup();
        await adminGroup.searchAdmin(groupTitle);
        await adminGroup.clickGroup(groupTitle);
        await adminGroup.clickSuspend();
        await adminGroup.clickYes();
        console.log(`PASS: Admin group '${groupTitle}' successfully suspended while assigned to course '${courseName}'`);
    });
    test(`Single Instance Elearning Creation and verifying whether the suspended admin group cannot be added to any entity`, async ({ adminHome, contentHome, createCourse, editCourse }) => {
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
        await createCourse.addingSuspendedAdminGroup(groupTitle);

    })

})
