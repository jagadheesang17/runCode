import { test } from '../../../customFixtures/expertusFixture';
import { readDataFromCSV } from '../../../utils/csvUtil';
import { FakerData } from '../../../utils/fakerUtils';

 const OrgName = FakerData.getOrganizationName()+(Date.now());

 let ogtypeValue:any;

 test(`Creating the organization`, async ({ adminHome, organization, CompletionCertification,createCourse }) => 
    {
    test.info().annotations.push(
        { type: `Author`, description: `Vidya` },
        { type: `TestCase`, description: `Verify that an organization can be successfully created with all required details` },
        { type: `Test Description`, description: `Verify that an organization can be successfully created with all required details` }
    )

  
await adminHome.loadAndLogin("CUSTOMERADMIN");

    await adminHome.menuButton();
    await adminHome.people();
    await organization.organizationMenu()
    await organization.createOrganization();
    // await organization.enterName("Org "+FakerData.getTagNames()+(Date.now()));
    await organization.enterName(OrgName);

    await organization.typeDropdown("Internal");
    ogtypeValue=await organization.valueOfOrganizationType();
    
    
    
    await organization.typeDescription();
    await organization.clickSave();
    await CompletionCertification.clickProceed();
   await createCourse.verifySuccessMessage();

        
   } 
 )


 test(`Verify the organization type after mapping to the user`, async ({ adminHome, createUser ,createCourse}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Verify that user address validation functionality working as expected` },
        { type: `Test Description`, description: `Creating the user and verifying user address validation functionality working as expected` }
    );   
    const csvFilePath = './data/US_address.csv';
    const data = await readDataFromCSV(csvFilePath);

    for (const row of data) {
        const { country,state,timezone,address1,address2,city,zipcode } = row;

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
       await createUser.typeAddress("Address 1", FakerData.getAddress());
        await createUser.typeAddress("Address 2",FakerData.getAddress());
  
        await createUser.select("Country", country);
        await createUser.select("State/Province", state);
        await createUser.select("Time Zone", timezone);
        await createUser.enter("user-city", city);
        await createUser.enter("user-zipcode", zipcode);
        await createUser.searchAndSelect("organization",OrgName)
        await createUser.clickSave();   
        

    }
} )

test(`Verify the admin cannot able to delete the organization after mapping this into the user`, async ({ adminHome, organization, CompletionCertification,createCourse }) => 
    {
    test.info().annotations.push(
        { type: `Author`, description: `Vidya` },
        { type: `TestCase`, description: `Verify that an organization can be successfully created with all required details` },
        { type: `Test Description`, description: `Verify that an organization can be successfully created with all required details` }
    )

  
await adminHome.loadAndLogin("CUSTOMERADMIN");

    await adminHome.menuButton();
    await adminHome.people();
    await organization.organizationMenu()

    await createCourse.catalogSearch(OrgName);
    await organization.verifyTheDeleteIconIsDisabled();



        
   } 
 )

