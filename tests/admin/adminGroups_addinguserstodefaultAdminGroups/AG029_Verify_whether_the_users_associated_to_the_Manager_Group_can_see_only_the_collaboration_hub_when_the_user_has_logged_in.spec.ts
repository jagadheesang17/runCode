import { test } from "../../../customFixtures/expertusFixture"
import { readDataFromCSV } from "../../../utils/csvUtil";
import { FakerData } from '../../../utils/fakerUtils';
import { updateFieldsInJSON } from "../../../utils/jsonDataHandler";
import { AdminRoleManager } from "../../../utils/adminRoleManager";


const managerName: any = FakerData.getUserId();
const firstName = FakerData.getFirstName();
const lastName = FakerData.getLastName();
let systemDefaultRole: any;
const courseName = ("EL for" + " " + FakerData.getCourseName());
const description = FakerData.getDescription()
let createdCode: any
test.describe(`Verify_that_a_user_can_be_successfully_added_to_the_Manager_Group`, async () => {
    test.describe.configure({ mode: 'serial' })
    test(`Add_user_to_the_Manager_Group`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `Add_user_to_the_Manager_Group` },
            { type: `Test Description`, description: `Add_user_to_the_Manager_Group` }

        );
        

            await adminHome.loadAndLogin("CUSTOMERADMIN");
            await adminHome.clickMenu("User");
            await createUser.verifyCreateUserLabel();
            await createUser.enter("first_name", firstName);
            await createUser.enter("last_name", lastName);
            await createUser.enter("username", managerName);
            await createUser.enter("user-password", "Welcome1@");
            await createUser.enter("email", managerName);
            await createUser.clickRolesButton("Manager");
            await createUser.clickSave();
            await createUser.verifyUserCreationSuccessMessage();
        
    });
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

    test(`Verify whether the users attached to the Manager Group can see only the enrollment and reports modules`, async ({ adminHome, adminGroup,learnerHome, createUser,managerHome}) => {
                systemDefaultRole = await adminGroup.getRoleDataByRoleName("Manager");
                console.log(`Using system default role: ${systemDefaultRole.roleName}`);     
                await learnerHome.basicLogin(managerName, "default");
                await learnerHome.selectCollaborationHub();
                await managerHome.clickGuideTeamIcon(courseName);
                await adminHome.menuButton();
                await adminGroup.getPrivilegesByRoleName(systemDefaultRole.roleName);
                
              
            });



})