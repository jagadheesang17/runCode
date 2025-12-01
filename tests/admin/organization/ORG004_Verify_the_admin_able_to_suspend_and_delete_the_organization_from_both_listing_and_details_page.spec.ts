import { test } from '../../../customFixtures/expertusFixture';
import { readDataFromCSV } from '../../../utils/csvUtil';
import { FakerData } from '../../../utils/fakerUtils';

const OrgName = FakerData.getOrganizationName()+"Organization"+(Date.now());
test(`Verify that an organization can be successfully suspend and activated from listingpage`, async ({ adminHome, organization, CompletionCertification,createCourse }) => 
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
    await organization.enterName("Org "+OrgName);

    await organization.typeDropdown("Internal");
    await organization.typeDescription();
    await organization.clickSave();
    await CompletionCertification.clickProceed();
   await createCourse.verifySuccessMessage();

       await organization.clickGotoList();


  await createCourse.catalogSearch("Org "+OrgName);
  await organization.clickSuspendIcon();
  await organization.verifyAndActiveSuspendedOrganization();

        
   } 
)

test(`Verify that an organization can be successfully suspend and activated from detailspage`, async ({ adminHome, organization, CompletionCertification,createCourse }) => 
    {
  
  
await adminHome.loadAndLogin("CUSTOMERADMIN");

    await adminHome.menuButton();
    await adminHome.people();
    await organization.organizationMenu()
    await organization.createOrganization();
    // await organization.enterName("Org "+FakerData.getTagNames()+(Date.now()));
    await organization.enterName(OrgName);

    await organization.typeDropdown("Internal");
    await organization.typeDescription();
    await organization.clickSave();
    await CompletionCertification.clickProceed();
   await createCourse.verifySuccessMessage();
    // await organization.clickEditOrg();
    // await organization.enterName(OrgName+" "+"edit");
    //  await organization.typeDropdown("External");
    // await organization.typeDescription();
    // await organization.clickUpdate();
    //    await createCourse.verifySuccessMessage();
       await organization.clickEditOrg();
    await organization.suspendFromDetailsPage();
    await organization.clickGotoList();
    

  await createCourse.catalogSearch(OrgName);
  await organization.clickSuspendIcon();
  await organization.verifyAndActiveSuspendedOrganization();



  
        
   } 
)

test(`Verify that an organization can be successfully delete from listingpage`, async ({ adminHome, organization, CompletionCertification,createCourse }) => 
    {
  

  
await adminHome.loadAndLogin("CUSTOMERADMIN");

    await adminHome.menuButton();
    await adminHome.people();
    await organization.organizationMenu()
    await organization.createOrganization();
    // await organization.enterName("Org "+FakerData.getTagNames()+(Date.now()));
    await organization.enterName(OrgName);

    await organization.typeDropdown("Internal");
    await organization.typeDescription();
    await organization.clickSave();
    await CompletionCertification.clickProceed();
   await createCourse.verifySuccessMessage();
    // await organization.clickEditOrg();
    // await organization.enterName(OrgName+" "+"edit");
    //  await organization.typeDropdown("External");
    // await organization.typeDescription();
    // await organization.clickUpdate();
    //    await createCourse.verifySuccessMessage();
       await organization.clickGotoList();


  await createCourse.catalogSearch(OrgName);
  await organization.clickDeleteIcon();
    await createCourse.catalogSearch(OrgName);

  await organization.verifyTheDeletedorganization();

        
   } 
)

test(`Verify that an organization can be successfully delete from detailspage`, async ({ adminHome, organization, CompletionCertification,createCourse }) => 
    {
  

  
await adminHome.loadAndLogin("CUSTOMERADMIN");

    await adminHome.menuButton();
    await adminHome.people();
    await organization.organizationMenu()
    await organization.createOrganization();
    // await organization.enterName("Org "+FakerData.getTagNames()+(Date.now()));
    await organization.enterName(OrgName);

    await organization.typeDropdown("Internal");
    await organization.typeDescription();
    await organization.clickSave();
    await CompletionCertification.clickProceed();
   await createCourse.verifySuccessMessage();
    // await organization.clickEditOrg();
    // await organization.enterName(OrgName+" "+"edit");
    //  await organization.typeDropdown("External");
    // await organization.typeDescription();
    // await organization.clickUpdate();
    //    await createCourse.verifySuccessMessage();
       await organization.clickEditOrg();

await organization.deleteFromDetailsPage();
       await organization.clickGotoList();

    await createCourse.catalogSearch(OrgName);

  await organization.verifyTheDeletedorganization();

        
   } 
)

test(`Verify the admin able to delete the child organization`, async ({ adminHome, organization, CompletionCertification,contentHome,createCourse }) => 
    {
              
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
         await organization.clickEditIcon(); 


         await organization.enterParentOrg(parentOrg);
          await organization.clickUpdate();
    await createCourse.verifySuccessMessage();
    await contentHome.gotoListing();


       await organization.clickChildOrganization(parentOrg);
       await organization.clickThreedot();
       await organization.deleteChildOrganization(parentOrg,childOrg);

   
        
   } 
)
