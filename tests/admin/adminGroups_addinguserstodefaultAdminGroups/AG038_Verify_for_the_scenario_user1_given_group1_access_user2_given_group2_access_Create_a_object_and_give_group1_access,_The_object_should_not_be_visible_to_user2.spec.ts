import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { AdminRoleManager } from "../../../utils/adminRoleManager";
import { UserPage } from "../../../pages/UserPage";
import { } from "../../../pages/AdminHomePage";
import { LearnerHomePage } from "../../../pages/LearnerHomePage";
import { create } from "domain";


let username1 = FakerData.getUserId();
let username2 = FakerData.getUserId();
//let username='Anastacio.Hickle@yahoo.com';
const roleName1 = FakerData.getFirstName() + " Admin";
const roleName2 = FakerData.getFirstName() + " Admin";
let courseName = FakerData.getCourseName();
let description = FakerData.getDescription();
let groupTitle1 = FakerData.getRandomTitle();
let groupTitle2 = FakerData.getRandomTitle();
let createdCode: any;
let role: string[] = [];
let systemDefaultRole: any;
test.describe(`AG038-Verify for the scenario user1 given group1 access user2 given group2 access Create a object and give group1 access, The object should not be visible to user2`, async () => {
    test.describe.configure({ mode: 'serial' })
    test(`Createing a role and a group for User1, and then adding User1 to the newly created group.`, async ({ adminHome, createUser, createCourse, adminGroup, adminRoleHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `Createing a role and a group for User1, and then adding User1 to the newly created group.` },
            { type: `Test Description`, description: `Createing a role and a group for User1, and then adding User1 to the newly created group.` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.clickCreateUser();
        await createUser.verifyCreateUserLabel();
        await createUser.enter("first_name", FakerData.getFirstName());
        await createUser.enter("last_name", FakerData.getLastName());
        await createUser.enter("username", username1);
        await createUser.enter("user-password", "Welcome1@");
        await createUser.clickSave();
        await createUser.refreshPage();
        await adminHome.menuButton()
        await adminHome.people();
        await adminHome.clickAdminRole()
        await adminRoleHome.clickAddAdminRole()
        await adminRoleHome.enterName(roleName1);
        await adminRoleHome.clickAllPriveileges();
        await adminRoleHome.clickSave()
        await adminRoleHome.verifyRole(roleName1)
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.adminGroup();
        await adminGroup.clickCreateGroup();
        await adminGroup.enterGroupTitle(groupTitle1);
        await adminGroup.selectroleAdmin(roleName1);
        await adminGroup.searchUser(username1);
        await adminGroup.clickuserCheckbox(username1);
        await adminGroup.clickSelectUsers();
        await adminGroup.clickActivate();
        await adminGroup.clickSaveBtn();
        await adminGroup.clickProceed();
        await createCourse.verifySuccessMessage();


    })
    test(`Createing a role and a group for User2, and then adding User2 to the newly created group.`, async ({ adminHome, createUser, createCourse, adminGroup, adminRoleHome }) => {

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.clickCreateUser();
        await createUser.verifyCreateUserLabel();
        await createUser.enter("first_name", FakerData.getFirstName());
        await createUser.enter("last_name", FakerData.getLastName());
        await createUser.enter("username", username2);
        await createUser.enter("user-password", "Welcome1@");
        await createUser.clickSave();
        await createUser.refreshPage();
        await adminHome.menuButton()
        await adminHome.people();
        await adminHome.clickAdminRole()
        await adminRoleHome.clickAddAdminRole()
        await adminRoleHome.enterName(roleName2);
        await adminRoleHome.clickAllPriveileges();
        await adminRoleHome.clickSave()
        await adminRoleHome.verifyRole(roleName2)
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.adminGroup();
        await adminGroup.clickCreateGroup();
        await adminGroup.enterGroupTitle(groupTitle2);
        await adminGroup.selectroleAdmin(roleName2);
        await adminGroup.searchUser(username2);
        await adminGroup.clickuserCheckbox(username2);
        await adminGroup.clickSelectUsers();
        await adminGroup.clickActivate();
        await adminGroup.clickSaveBtn();
        await adminGroup.clickProceed();
        await createCourse.verifySuccessMessage();


    })
    test(`Single Instance Elearning Creation`, async ({ adminHome, contentHome, createCourse, editCourse }) => {
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
        await createCourse.addAdminGroup(groupTitle1);
        await createCourse.addSingleAdminGroup(groupTitle1);
        await createCourse.saveAccessButton();
        await editCourse.clickClose();
        await createCourse.typeDescription("This is a new course by name :" + description);
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage()

    })

    test(`Verify whether the course is not showing for unauthorized user  `, async ({ adminHome, adminGroup, learnerHome, createCourse, managerHome }) => {

        await learnerHome.basicLogin(username2, "default");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.catalogSearch("Neural Port Calculate");
        await createCourse.msgVerify();


    });
});