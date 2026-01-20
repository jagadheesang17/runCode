import { test } from '../../../customFixtures/expertusFixture';
import { readDataFromCSV } from '../../../utils/csvUtil';
import { FakerData } from '../../../utils/fakerUtils';

 const OrgName = FakerData.getOrganizationName()+"Organization"+(Date.now());
 const userName = FakerData.getUserId();

 let ogtypeValue:any;

 test(`Verify that an organization can be successfully created with all required details`, async ({ adminHome, organization, CompletionCertification,createCourse }) => 
    {
    test.info().annotations.push(
        { type: `Author`, description: `Balasundar` },
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


 test(`Verify the organization type after mapping to the user`, async ({ adminHome, createUser ,createCourse,organization}) => {
   
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
        await createUser.enter("first_name",FakerData.getFirstName());
        await createUser.enter("last_name",FakerData.getLastName());
        await createUser.enter("username", userName);
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
        
        await createUser.editUser();

        const ogTypeValueFromPage = await createUser.valueOfOrganizationTypeInUserPage();

if (ogtypeValue === ogTypeValueFromPage) {
    console.log("Organization type is matching");
}

 await adminHome.menuButton();
    await adminHome.people();
    await organization.organizationMenu();
    await createCourse.catalogSearch(OrgName);
    await organization.userCountInOrganizationDetailsPage(OrgName);



    }
} )

test(`Verify the mapped organization mentioned in header section of the learner profile`, async ({ learnerHome,createUser,profile}) => {
   
    
        await learnerHome.basicLogin(userName, "portal1");
        // await learnerHome.termsAndConditionScroll();
        await learnerHome.verifyMappedOrganization(OrgName,OrgName);
    }
    
)