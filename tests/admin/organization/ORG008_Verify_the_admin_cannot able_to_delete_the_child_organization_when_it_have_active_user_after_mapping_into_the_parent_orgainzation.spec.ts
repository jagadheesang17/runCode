import { test } from '../../../customFixtures/expertusFixture';
import { readDataFromCSV } from '../../../utils/csvUtil';
import { FakerData } from '../../../utils/fakerUtils';

 const OrgName = FakerData.getOrganizationName()+"Og";

 let ogtypeValue:any;



test(`Verify the admin cant able to delete the child organization which is mapped to the user and verify able to remove that from the parent organization`, async ({ adminHome,createCourse,contentHome,organization,CompletionCertification,createUser}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Vidya` },
        { type: `TestCase`, description: `Verify that an organization can be successfully created with a parent organization assigned and the count of organizations under the parent is accurately reflected` },
        { type: `Test Description`, description: `Verify that an organization can be successfully created with a parent organization assigned and the count of organizations under the parent is accurately reflected` }
    );           
    await adminHome.loadAndLogin("CUSTOMERADMIN");
    await adminHome.menuButton();
    await adminHome.people();
    await organization.organizationMenu()
   
    async function createOrg(){
    let orgName=OrgName+" "+FakerData.getLastName();
       await organization.createOrganization();   
      await organization.enterName(orgName)
      await organization.typeDropdown("Internal");
      await organization.typeDescription();
      await organization.clickSave();
      await CompletionCertification.clickProceed();    
      return orgName  
    }
    const parentOrg= await createOrg();
    await contentHome.gotoListing();
  
       const childOrg=  await createOrg();
    await contentHome.gotoListing();
   


        const csvFilePath = './data/US_address.csv';
    const data = await readDataFromCSV(csvFilePath);
 for (const row of data) {
        const { country,state,timezone,address1,address2,city,zipcode } = row;
      await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.clickCreateUser();    
        await createUser.verifyCreateUserLabel();    
        await createUser.enter("first_name", FakerData.getFirstName());
        await createUser.enter("last_name", FakerData.getLastName());
        await createUser.enter("username", FakerData.getUserId());
        await createUser.enter("user-password", "Welcome1@");
       await createUser.typeAddress("Address 1",FakerData.getAddress());
        await createUser.typeAddress("Address 2",FakerData.getAddress());
  
        await createUser.select("Country", country);
        await createUser.select("State/Province", state);
        await createUser.select("Time Zone", timezone);
        await createUser.enter("user-city", city);
        await createUser.enter("user-zipcode", zipcode);
 }
        await createUser.searchAndSelect("organization",childOrg)
        await createUser.clickSave(); 

         await adminHome.menuButton();
    await adminHome.people();
    await organization.organizationMenu()
         await createCourse.catalogSearch(childOrg);

    await organization.clickEditIcon(); 
    await organization.enterParentOrg(parentOrg);
    await organization.clickUpdate();
    await createCourse.verifySuccessMessage();
    await contentHome.gotoListing()

     await createCourse.catalogSearch(parentOrg);
    await organization.clickChildOrganization(parentOrg); 
    await organization.clickThreedot();
    await organization.verifyTheDeleteIconIsDisabledInChildOrg(parentOrg,childOrg);

    await organization.editChildOrganization(parentOrg,childOrg);

    await organization.clearParentOrg();
    await organization.clickUpdate();
    await createCourse.verifySuccessMessage();
    await contentHome.gotoListing();
    await createCourse.catalogSearch(childOrg); 
    await organization.verifyChildOrganizationIsRemovedFromParentOrg();


}
    
)

 