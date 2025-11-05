import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { AdminRoleManager } from "../../../utils/adminRoleManager";
import { UserPage } from "../../../pages/UserPage";
import { } from "../../../pages/AdminHomePage";
import { LearnerHomePage } from "../../../pages/LearnerHomePage";


let managerName = FakerData.getUserId();
let courseName = FakerData.getCourseName();
let description = FakerData.getDescription();
let createdCode: any;
let role: string[] = [];
let systemDefaultRole: any;
test.describe(`Verify for the scenario - Create admin group and attach user1 with Commerce Admin Role + Manage Role privileges - login as user1 → Commerce & Manage modules should display`, async () => {
    test.describe.configure({ mode: 'serial' })
    test(`creating a user attaching to commerce admin group and setting manager role`, async ({ adminHome, createUser, createCourse, adminGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `creating a user attaching to commerce admin group and setting manager role` },
            { type: `Test Description`, description: `creating a user attaching to commerce admin group and setting manager role` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.clickCreateUser();
        await createUser.verifyCreateUserLabel();
        await createUser.enter("first_name", FakerData.getFirstName());
        await createUser.enter("last_name", FakerData.getLastName());
        await createUser.enter("username", managerName);
        await createUser.clickRolesButton("Manager");
        role[0] = "Manager";
        await createUser.enter("user-password", "Welcome1@");
        await createUser.clickSave();
        await createUser.refreshPage();
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.adminGroup();
        await adminGroup.searchAdmin("Commerce admin");
        await adminGroup.clickGroup("Commerce admin");
        role[1] = await adminGroup.captureRole();
        console.log("role is " + role);
        await adminGroup.searchUser(managerName)
        await adminGroup.clickuserCheckbox(managerName)
        await adminGroup.clickSelectUsers();
        await adminGroup.clickUpdate();
        await createCourse.verifySuccessMessage();


    })
    test(`Single Instance Elearning Creation`, async ({ adminHome, contentHome, createCourse }) => {

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
        await contentHome.gotoListing();
        await createCourse.catalogSearch(courseName)
        createdCode = await createCourse.retriveCode()
        console.log("Extracted Code is : " + createdCode);
    })

    test(`Verify whether the users attached to the Manager Group and commerce admin can see only the enrollment, reports modules and Commerce module  `, async ({ adminHome, adminGroup, learnerHome, createUser, managerHome }) => {

        await learnerHome.basicLogin(managerName, "default");
        for (let i = 0; i < role.length; i++) {
            systemDefaultRole = await adminGroup.getRoleDataByRoleName(role[i]);
            console.log(`Using system default role: ${systemDefaultRole.roleName}`);
            if (systemDefaultRole.roleName === "Manager") {
                await learnerHome.selectCollaborationHub();
                await managerHome.clickGuideTeamIcon(courseName);
                await adminHome.menuButton();
                await adminGroup.getPrivilegesByRoleName(systemDefaultRole.roleName);
                await createUser.refreshPage();
                await adminHome.navigateToLearner();
                await learnerHome.clickMyLearning();
            }
            else {
                await learnerHome.selectAdmin();
                await adminHome.menuButton();
                await adminGroup.getPrivilegesByRoleName(systemDefaultRole.roleName);

            }
        }


    });
});