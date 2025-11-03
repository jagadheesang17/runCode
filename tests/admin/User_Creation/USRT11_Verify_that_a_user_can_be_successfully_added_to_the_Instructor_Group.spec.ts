import { test } from "../../../customFixtures/expertusFixture"
import { readDataFromCSV } from "../../../utils/csvUtil";
import { FakerData } from '../../../utils/fakerUtils';
import { updateFieldsInJSON } from "../../../utils/jsonDataHandler";


const instructorName: any = FakerData.getUserId();
const firstName = FakerData.getFirstName();
const lastName = FakerData.getLastName();
test.describe(`Verify_that_a_user_can_be_successfully_added_to_the_Instructor_Group.`, async () => {
    test(`Add_user_to_the_Instructor_Group`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Ajay Michael` },
            { type: `TestCase`, description: `Add_user_to_the_Instructor_Group` },
            { type: `Test Description`, description: `Add_user_to_the_Instructor_Group` }

        );
        const newData = {
            instructorName: instructorName
        }
        updateFieldsInJSON(newData)
        const csvFilePath = './data/User.csv';
        const data = await readDataFromCSV(csvFilePath);

        for (const row of data) {
            const { country, state, timezone, currency, city, zipcode } = row;

            await adminHome.loadAndLogin("CUSTOMERADMIN");
            await adminHome.clickMenu("User");
            await createUser.verifyCreateUserLabel();
            await createUser.uncheckInheritAddressIfPresent();
            await createUser.uncheckInheritEmergencyContactIfPresent();
            await createUser.uncheckAutoGenerateUsernameIfPresent();
            await createUser.enter("first_name", firstName);
            await createUser.enter("last_name", lastName);
            await createUser.enter("username", instructorName);
            await createUser.enter("user-password", "Welcome1@");
            await createUser.enter("email", instructorName);
            await createUser.enter("user-phone", FakerData.getMobileNumber());
            await createUser.typeAddress("Address 1", FakerData.getAddress());
            await createUser.typeAddress("Address 2", FakerData.getAddress());
            await createUser.select("Country", country);
            await createUser.select("State/Province", state);
            await createUser.select("Time Zone", timezone);
            await createUser.select("Currency", currency);
            await createUser.enter("user-city", city);
            await createUser.enter("user-zipcode", zipcode);
            await createUser.enter("user-mobile", FakerData.getMobileNumber());
            await createUser.clickRolesButton("Instructor");
            await createUser.clickSave();
            await createUser.verifyUserCreationSuccessMessage();
        }
    });

       test(`Verifying created user able to login as Instructor`, async ({ learnerHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verifying created user able to login as Instructor` },
            { type: `Test Description`, description: `Verifying created user able to login as Instructor` }
        );
        await learnerHome.basicLogin(instructorName, "DefaultPortal");
        await learnerHome.verifyLandingPage("Instructor")
    })


})