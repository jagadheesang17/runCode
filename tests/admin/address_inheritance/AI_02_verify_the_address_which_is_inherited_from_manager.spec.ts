import { test } from "../../../customFixtures/expertusFixture";
import { readDataFromCSV } from '../../../utils/csvUtil';
import { FakerData } from '../../../utils/fakerUtils';


const OrgName = "Org"+ FakerData.getOrganizationName();
const address1 = FakerData.getAddress();
const username = FakerData.getUserId();


test.describe(`Verify_the_address_which_is_inherited_from_manager.spec`, async () => {
    test.describe.configure({ mode: "serial" });
test(`Create a Manager with address`, async ({ adminHome, createUser, createCourse }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Balasundar` },
        { type: `TestCase`, description: `Verify_that_admin_able_to_create_and_set_direct_report_to_assigned_manager` },
        { type: `Test Description`, description: `Verify_that_admin_able_to_create_and_set_direct_report_to_assigned_manager` }
    );

     const newData = {
        teamUser1: username
    };
      const csvFilePath = './data/US_address.csv';
    const data = await readDataFromCSV(csvFilePath);

    for (const row of data) {
        const { country,state,city,zipcode } = row;
    await adminHome.loadAndLogin("PEOPLEADMIN");
    await adminHome.menuButton();
    await adminHome.people();
    await adminHome.user();
    await createUser.clickCreateUser();
    await createUser.verifyCreateUserLabel();
    await createUser.enter("first_name", FakerData.getFirstName());
    await createUser.enter("last_name", FakerData.getLastName());
    await createUser.enter("username", username);
    await createUser.enter("user-password", "Welcome1@");
    // await createUser.uncheckInheritFrom()
    await createUser.uncheckInheritAddressIfPresent();

      await createUser.typeAddress("Address 1",address1);
            await createUser.typeAddress("Address 2",FakerData.getAddress());
            await createUser.select("Country", country);
            await createUser.select("State/Province", state);
             await createUser.enter("user-city", city);
            await createUser.enter("user-zipcode", zipcode);
    await createUser.selectLanguage("English")
    
await createUser.clickRolesButton("Manager");
    await createUser.clickSave();

    //   await createUser.clickProceed("Proceed");
    //  await createUser.verifyUserCreationSuccessMessage();
}})

test(`Verify the manager's address inherited to the user after mapping on User creation page`, async ({ adminHome, createUser ,createCourse}) => {
     
  

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.clickCreateUser();    
        await createUser.verifyCreateUserLabel();    
        await createUser.enter("first_name", FakerData.getFirstName());
        await createUser.enter("last_name", FakerData.getLastName());
        await createUser.enter("username", FakerData.getUserId());
        await createUser.enter("user-password", "Welcome1@");
        await createUser.checkInheritFrom("manager");
       
      
        // await createUser.searchAndSelect("organization",OrgName,OrgName)
        await createUser.selectManager(username);
        await createUser.clickSave();
        await createUser.editbtn();

        await createUser.verifyInheritedAddress("Address 1","user-addr1",address1);

        
        
      
    }
)
})