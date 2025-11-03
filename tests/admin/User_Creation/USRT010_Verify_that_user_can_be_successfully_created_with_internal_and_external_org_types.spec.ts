import { credentials } from '../../../constants/credentialData';
import { test } from '../../../customFixtures/expertusFixture';
import { readDataFromCSV } from '../../../utils/csvUtil';
import { FakerData } from '../../../utils/fakerUtils';
import { updateFieldsInJSON } from '../../../utils/jsonDataHandler';

const username = FakerData.getUserId();
test.describe(`Verify_that_user_can_be_successfully_created_with_internal_and_external_org_types`, async () => {
    test.describe.configure({ mode: 'parallel' })
    test(`User Creation with Internal User type`, async ({ adminHome, createUser, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Vidya` },
            { type: `TestCase`, description: `User Creation with Internal User type` },
            { type: `Test Description`, description: `User Creation with Internal User type` }
        );
        const newData = {
            internalUser: username
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
        await createUser.enter("username", username);
        await createUser.enter("user-password", "Welcome1@");
        await createUser.selectTimeZone("USA", "Pacific Standard")
        await createUser.enterHireDate();
        await createUser.selectDepartmentType("department");
        await createUser.selectLanguage("English")
        await createUser.organizationType("Internal")
        await createUser.selectUserType("usertype")
        await createUser.selectjobTitle("jobtitle");
        await createUser.clickSave();
        await createUser.verifyUserCreationSuccessMessage();
    }
    )

    test(`User Creation with external User type`, async ({ adminHome, createUser, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Vidya` },
            { type: `TestCase`, description: `User Creation with external User type` },
            { type: `Test Description`, description: `User Creation with external User type` }
        );


        const exusername = FakerData.getUserId();
        const newData = {
            externalUser: exusername
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
        await createUser.enter("username", exusername);
        await createUser.enter("user-password", "Welcome1@");
        await createUser.selectTimeZone("USA", "Pacific Standard")
        await createUser.enterHireDate();
        await createUser.selectDepartmentType("department");
        await createUser.selectLanguage("English")
        await createUser.organizationType("External")
        await createUser.selectUserType("usertype")
        await createUser.selectjobTitle("jobtitle");
        await createUser.clickSave();
       await createUser.verifyUserCreationSuccessMessage();
    }
    )

})