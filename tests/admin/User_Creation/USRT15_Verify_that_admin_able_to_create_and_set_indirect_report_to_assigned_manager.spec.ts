import { URLConstants } from '../../../constants/urlConstants';
import { test } from '../../../customFixtures/expertusFixture';
import { FakerData } from '../../../utils/fakerUtils';
import { updateFieldsInJSON } from '../../../utils/jsonDataHandler';
import data from '../../../data/adminGroupsData.json'


const username = FakerData.getUserId();
test(`Verify_that_admin_able_to_create_and_set_direct_report_to_assigned_manager`, async ({ adminHome, createUser ,createCourse}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Vidya` },
        { type: `TestCase`, description: `Verify_that_admin_able_to_create_and_set_direct_report_to_assigned_manager` },
        { type: `Test Description`, description: `Verify_that_admin_able_to_create_and_set_direct_report_to_assigned_manager` }
    );   
    const newData = {
        teamUser2: username
    };
    updateFieldsInJSON(newData)
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();      
        await createUser.clickCreateUser();
        await createUser.verifyCreateUserLabel();       
             await createUser.uncheckInheritAddressIfPresent();
            await createUser.uncheckInheritEmergencyContactIfPresent();
            await createUser.uncheckAutoGenerateUsernameIfPresent(); 
        await createUser.enter("first_name", FakerData.getFirstName());
        await createUser.enter("last_name", FakerData.getLastName());
        await createUser.enter("username",username);
        await createUser.enter("user-password", "Welcome1@");
        await createUser.selectLanguage("English")
        await createUser.selectSpecificManager(data.managerName);
        await createUser.clickSave();               
      await createUser.verifyUserCreationSuccessMessage();
        
    }
)


