import { create } from "domain";
import { test } from "../../../customFixtures/expertusFixture";
import { readDataFromCSV } from '../../../utils/csvUtil';
import { FakerData } from '../../../utils/fakerUtils';
import { verify } from "crypto";
const OrgName = "Org"+ FakerData.getOrganizationName();
const address1 = FakerData.getAddress();
const emergencyContactName=FakerData.getFirstName();
const username = FakerData.getUserId();


test(`Create the organization with address`, async ({ adminHome, organization, CompletionCertification,createCourse,createUser }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Vidya` },
        { type: `TestCase`, description: `Verify that an organization can be successfully created with all required details` },
        { type: `Test Description`, description: `Verify that an organization can be successfully created with all required details` }
    );

      const csvFilePath = './data/US_address.csv';
    const data = await readDataFromCSV(csvFilePath);

    for (const row of data) {
        const { country,state,city,zipcode,contactName,contactNumber,contactEmail } = row;
    await adminHome.loadAndLogin("CUSTOMERADMIN");
   
    await adminHome.menuButton();
    await adminHome.people();
    await organization.organizationMenu()
    await organization.createOrganization();
    await organization.enterName(OrgName);
   await organization.selectOrgType("Internal");
    await organization.typeDescription();

     await createUser.typeAddressOrg("Address1","Address1",address1);
        await createUser.typeAddressOrg("Address2","Address2",FakerData.getAddress());
        await createUser.select("Country", country);
        await createUser.select("State/Province", state);
         await createUser.enter("city", city);
        await createUser.enter("zipcode", zipcode);
        await createUser.enter("ContactName", emergencyContactName);
        await createUser.enter("ContactNumber", contactNumber);
        await createUser.enter("ContactMail", contactEmail);



    await organization.clickSave();
    await CompletionCertification.clickProceed();
    await createCourse.verifySuccessMessage();
}})

test(`Create a manager with address and Verify the organization's address inherited to the user after mapping on the user details page`, async ({ adminHome, createUser, createCourse }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Vidya` },
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
            await createUser.searchAndSelect("organization",OrgName)

await createUser.clickRolesButton("Manager");
    await createUser.clickSave();
     await createUser.editbtn();

        await createUser.verifyInheritedAddress("Address 1","user-addr1",address1);
        
        await createUser.verifyInheritedEmergencyContactName("emrg-cont-name",emergencyContactName);


    //   await createUser.clickProceed("Proceed");
    //  await createUser.verifyUserCreationSuccessMessage();
}})

test(`Verify the manager's address inherited to the user after mapping on the user details page`, async ({ adminHome, createUser ,createCourse}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Verify that user address validation functionality working as expected` },
        { type: `Test Description`, description: `Creating the user and verifying user address validation functionality working as expected` }
    );   
  

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