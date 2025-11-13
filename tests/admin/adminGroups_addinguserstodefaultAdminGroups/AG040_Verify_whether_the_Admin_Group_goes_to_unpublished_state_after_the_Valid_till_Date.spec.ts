import { test } from "../../../customFixtures/expertusFixture";
import { FakerData, getFutureDate } from '../../../utils/fakerUtils';
import { AdminRoleManager } from "../../../utils/adminRoleManager";
import { UserPage } from "../../../pages/UserPage";
import { } from "../../../pages/AdminHomePage";
import { LearnerHomePage } from "../../../pages/LearnerHomePage";
import { adminGroupDateValidity } from "../DB/DBJobs";


let username = FakerData.getUserId();
const roleName = FakerData.getFirstName() + " Admin";
let courseName = FakerData.getCourseName();
let description = FakerData.getDescription();
let groupTitle = FakerData.getRandomTitle() + " Group";
const date = getFutureDate();
test.describe(`Verify whether the Admin Group goes to unpublished state after the Valid till Date`, async () => {
    test.describe.configure({ mode: 'serial' })
    test(`Creating a role and a group for User1, and then adding User1 to the newly created group.`, async ({ adminHome, createUser, createCourse, adminGroup, adminRoleHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `Creating a role and a group for User1, and then adding User1 to the newly created group.` },
            { type: `Test Description`, description: `Creating a role and a group for User1, and then adding User1 to the newly created group.` }
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
        await createUser.enter("user-password", "Welcome1@");
        await createUser.clickSave();
        await createUser.refreshPage();
        await adminHome.menuButton()
        await adminHome.people();
        await adminHome.clickAdminRole()
        await adminRoleHome.clickAddAdminRole()
        await adminRoleHome.enterName(roleName);
        await adminRoleHome.clickAllPriveileges();
        await adminRoleHome.clickSave()
        await adminRoleHome.verifyRole(roleName)
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.adminGroup();
        await adminGroup.clickCreateGroup();
        await adminGroup.enterGroupTitle(groupTitle);
        await adminGroup.selectroleAdmin(roleName);
        await adminGroup.enterValidTillDate(date);
        await adminGroup.searchUser(username);
        await adminGroup.clickuserCheckbox(username);
        await adminGroup.clickSelectUsers();
        await adminGroup.clickActivate();
        await adminGroup.clickSaveBtn();
        await adminGroup.clickProceed();
        await createCourse.verifySuccessMessage();


    })
    test(`Admin group gets suspended through cron job if the valid till date is over`, async ({ adminHome, createUser, createCourse, adminGroup, adminRoleHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `Admin group gets suspended through cron job if the valid till date is over` },
            { type: `Test Description`, description: `Admin group gets suspended through cron job if the valid till date is over` }
        );
        await adminGroupDateValidity(groupTitle);


    })
    test(`Suspend admin group that is assigned to course`, async ({ adminHome, adminGroup }) => {
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.adminGroup();
        await adminGroup.searchAdmin(groupTitle);
        await adminGroup.clickGroup(groupTitle);
        await adminGroup.clickEditbtn();
        await adminGroup.disableActivateBtn();

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

});