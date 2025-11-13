import { test } from "../../../customFixtures/expertusFixture"
import { AdminRoleManager } from "../../../utils/adminRoleManager";
import { readDataFromCSV } from "../../../utils/csvUtil";
import { FakerData } from '../../../utils/fakerUtils';
import { updateFieldsInJSON } from "../../../utils/jsonDataHandler";


const instructorName: any = FakerData.getUserId();
const firstName = FakerData.getFirstName();
const lastName = FakerData.getLastName();
const courseName: any = FakerData.getCourseName();
let role:any;
let systemDefaultRole: any;
test.describe(`Check that users assigned to the Instructor Role can only see the instructor Group when they log in (Discussion - View/Create, Reports - View/Create/Edit/Delete)`, async () => {
    test(`Add_user_to_the_Instructor_Group`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `Add_user_to_the_Instructor_Group` },
            { type: `Test Description`, description: `Add_user_to_the_Instructor_Group` }

        );
            await adminHome.loadAndLogin("CUSTOMERADMIN");
            await adminHome.clickMenu("User");
            await createUser.verifyCreateUserLabel();
            await createUser.enter("first_name", firstName);
            await createUser.enter("last_name", lastName);
            await createUser.enter("username", instructorName);
            await createUser.enter("user-password", "Welcome1@");
            await createUser.enter("email", instructorName);
            await createUser.clickRolesButton("Instructor");
            await createUser.clickSave();
            await createUser.verifyUserCreationSuccessMessage();

        

    });
    test(`Past ILT Course Creation`, async ({ adminHome, createCourse, editCourse }) => {
            await adminHome.loadAndLogin("CUSTOMERADMIN")
            await adminHome.menuButton();
            await adminHome.clickLearningMenu();
            await adminHome.clickCourseLink();
            await createCourse.clickCreateCourse();
            await createCourse.verifyCreateUserLabel("CREATE COURSE");
            await createCourse.enter("course-title", courseName)
            await createCourse.selectLanguage("English");
            await createCourse.typeDescription("This is a new course by name :" + courseName);
            await createCourse.selectdeliveryType("Classroom")
            await createCourse.clickCatalog();
            await createCourse.clickSave();
            await createCourse.clickProceed()
            await createCourse.verifySuccessMessage();
            await createCourse.editcourse();
            await createCourse.addInstances();
            async function addinstance(deliveryType: string) {
                await createCourse.selectInstanceDeliveryType(deliveryType);
                await createCourse.clickCreateInstance();
            }
            await addinstance("Classroom");
            await createCourse.enterSessionName(courseName);
            await createCourse.enterfutureDateValue();
            await createCourse.startandEndTime();
            await createCourse.selectInstructor(instructorName)
            await createCourse.typeAdditionalInfo()
            await createCourse.selectLocation();
            await createCourse.setMaxSeat();
            await createCourse.typeDescription("Check the instance class for the availed course")
            await createCourse.clickCatalog();   
            await createCourse.clickUpdate();
            await createCourse.verifySuccessMessage();
        })
    
      test(`Verify whether the users attached to the instructor Group can see only the enrollment and reports modules`, async ({ adminHome, adminGroup,learnerHome, createUser,instructorHome}) => {
            systemDefaultRole = await adminGroup.getRoleDataByRoleName("Instructor");
            console.log(`Using system default role: ${systemDefaultRole.roleName}`);     
            await learnerHome.basicLogin("Pete3@hotmail.com", "default");
            await instructorHome.clickClassList();
            await instructorHome.clickFilter();
            await instructorHome.selectDeliveryType()
            await instructorHome.clickApplyButton();
            await instructorHome.entersearchField(courseName)
            await instructorHome.clickEnrollmentIcon(courseName);
            await adminHome.menuButton();
            await adminGroup.getPrivilegesByRoleName(systemDefaultRole.roleName);
            
          
        });



})