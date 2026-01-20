import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { AdminRoleManager } from "../../../utils/adminRoleManager";
import { UserPage } from "../../../pages/UserPage";
import {  } from "../../../pages/AdminHomePage";
import { AdminGroupPage } from "../../../pages/AdminGroupPage";


let username=FakerData.getUserId();


//let role:any;
let role ="Super admin - Customer";
let systemDefaultRole: any;
test.describe(`Verify whether the users attached to the Super Admin - Customer can see the following modules`, async () => {
    test.describe.configure({ mode: 'serial' })
    test(`Verify whether the users attached to the Super Admin - Customer`, async ({ adminHome, createUser ,createCourse,adminGroup}) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `Verify whether the users attached to the Super Admin - Customer` },
            { type: `Test Description`, description: `Verify whether the users attached to the Super Admin - Customer` }
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
            console.log("username is "+username);
            await createUser.enter("user-password", "Welcome1@");
            await createUser.clickSave();  
            await createUser.refreshPage();  
            await adminHome.menuButton();
            await adminHome.people();
            await adminHome.adminGroup();
            await adminGroup.searchAdmin("Super admin - Customer");
            await adminGroup.clickGroup("Super admin - Customer");
            role=await adminGroup.captureRole();
            console.log("role is "+role);
            await adminGroup.searchUser(username)
            await adminGroup.clickuserCheckbox(username)
            await adminGroup.clickSelectUsers();
            await adminGroup.clickUpdate();
            await createCourse.verifySuccessMessage();
            
        }
        
    )

    test(`Verify whether the users attached to the Super Admin - Customer can see specified modules`, async ({ adminHome, adminGroup,learnerHome, createUser}) => {
        systemDefaultRole = await adminGroup.getRoleDataByRoleName(role);
        console.log(`Using system default role: ${systemDefaultRole.roleName}`);     
        await learnerHome.basicLogin(username, "default");
        await adminHome.menuButton();
        await adminGroup.getPrivilegesByRoleName(systemDefaultRole.roleName);
        
      
    });
});