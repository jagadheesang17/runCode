import { test } from '../../../customFixtures/expertusFixture';
import { readDataFromCSV } from '../../../utils/csvUtil';
import { FakerData } from '../../../utils/fakerUtils';

 const OrgName = FakerData.getOrganizationName()+"Og";

 let ogtypeValue:any;



test(`Verify the admin cant able to delete the child organization which is mapped to the user and verify able to remove that from the parent organization`, async ({ adminHome,createCourse,contentHome,organization,CompletionCertification,createUser}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Balasundar` },
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
   
    const grandchildOrg=  await createOrg();
    await contentHome.gotoListing();
 


    await organization.clickEditIcon(); 
    await organization.enterParentOrg(childOrg);
    await organization.clickUpdate();
    await createCourse.verifySuccessMessage();
    await contentHome.gotoListing()

     await createCourse.catalogSearch(childOrg);
    await organization.clickEditIcon(); 
        await organization.enterParentOrg(parentOrg);

 await organization.clickUpdate();
    await createCourse.verifySuccessMessage();
    await contentHome.gotoListing();

    await createCourse.catalogSearch(parentOrg);

    await organization.verifyGrandchildOrganizationIsAddedToChildOrg(parentOrg,childOrg,grandchildOrg);



}
    
)

 