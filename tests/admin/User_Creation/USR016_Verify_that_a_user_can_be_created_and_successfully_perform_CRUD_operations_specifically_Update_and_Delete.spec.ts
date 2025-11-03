import { expect } from '@playwright/test';
import { test } from '../../../customFixtures/expertusFixture';
import { readDataFromCSV } from '../../../utils/csvUtil';
import { FakerData } from '../../../utils/fakerUtils';


const username = FakerData.getUserId();
test.describe(`TC034 CrudUser`, async () => {
    test.describe.configure({ mode: 'serial' })
    test(`Verify_that_a_user_can_be_created_and_successfully_perform_CRUD_operations_specifically_Update_and_Delete`, async ({ adminHome, createUser, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Vidya` },
            { type: `TestCase`, description: `Create User for CRUD Operation` },
            { type: `Test Description`, description: `Create User for CRUD Operation` }
        );

        await adminHome.loadAndLogin("PEOPLEADMIN");
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
        await createUser.selectUserType("usertype")
        await createUser.selectjobTitle("jobtitle");
        await createUser.clickSave();
       await createUser.verifyUserCreationSuccessMessage();
    }
    )



    test(`TC034_Update User for CRUD Operation`, async ({ adminHome, createUser, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Vidya` },
            { type: `TestCase`, description: `Update User for CRUD Operation` },
            { type: `Test Description`, description: `Update User for CRUD Operation` }
        );

        await adminHome.loadAndLogin("PEOPLEADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.userSearchField(username);
        await createUser.editIcon();
        const empType = await createUser.selectEmploymentType("emp_type")
        await createUser.updateUser();
        await createUser.verifyUserCreationSuccessMessage();
        // await createUser.editbtn();
        // const empTypeUpdated = await createUser.selectEmploymentType("emp_type");
        // expect(empType).not.toContain(empTypeUpdated);
    }
    )


    test(`TC034_Delete User for CRUD Operation`, async ({ adminHome, createUser, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Vidya` },
            { type: `TestCase`, description: `Delete User for CRUD Operation` },
            { type: `Test Description`, description: `Delete User for CRUD Operation` }
        );

        await adminHome.loadAndLogin("PEOPLEADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.userSearchField(username);
        await createUser.clickdeleteIcon();
        await createUser.verifyUserdeleteSuccessMessage()
    }
    )

})