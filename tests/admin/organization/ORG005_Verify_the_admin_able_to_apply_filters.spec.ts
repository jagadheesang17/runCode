import { test } from '../../../customFixtures/expertusFixture';
import { readDataFromCSV } from '../../../utils/csvUtil';
import { FakerData } from '../../../utils/fakerUtils';
const OrgName = FakerData.getOrganizationName()+(Date.now());
test(`Verify that created organization and their organization type by applying filter`, async ({ adminHome, organization, CompletionCertification,createCourse }) => 
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
    await organization.typeDescription();
    await organization.clickSave();
    await CompletionCertification.clickProceed();
   await createCourse.verifySuccessMessage();
    await organization.clickGotoList();

    await organization.clickFilterIcon();
    await organization.checkOrganizationTypeAndStatus("Internal","Active");
    await organization.verifyTheOrgName(OrgName);

   
        
   } 
)


test(`Verify that suspended organization their organization type by applying filter`, async ({ adminHome, organization, CompletionCertification,createCourse }) => 
    {
   

  
await adminHome.loadAndLogin("CUSTOMERADMIN");

    await adminHome.menuButton();
    await adminHome.people();
    await organization.organizationMenu()
    await organization.createOrganization();
    // await organization.enterName("Org "+FakerData.getTagNames()+(Date.now()));
    await organization.enterName(OrgName);

    await organization.typeDropdown("External");
    await organization.typeDescription();
    await organization.clickSave();
    await CompletionCertification.clickProceed();
   await createCourse.verifySuccessMessage();
 
 await organization.clickEditOrg();
    await organization.suspendFromDetailsPage();
    await organization.clickGotoList();

   await organization.clickFilterIcon();
    await organization.checkOrganizationTypeAndStatus("External","Suspended");
    await organization.verifyTheOrgName(OrgName);

        
   } 
)

// test(`Verify the functionality of sort`, async ({ adminHome, organization, CompletionCertification,createCourse }) => 
//     {
//     test.info().annotations.push(
//         { type: `Author`, description: `Vidya` },
//         { type: `TestCase`, description: `Verify that an organization can be successfully created with all required details` },
//         { type: `Test Description`, description: `Verify that an organization can be successfully created with all required details` }
//     )

  
// await adminHome.loadAndLogin("CUSTOMERADMIN");

//     await adminHome.menuButton();
//     await adminHome.people();
//     await organization.organizationMenu()
//     await organization.createOrganization();
//     // await organization.enterName("Org "+FakerData.getTagNames()+(Date.now()));
//     await organization.enterName(OrgName);

//     await organization.typeDropdown("External");
//     await organization.typeDescription();
//     await organization.clickSave();
//     await CompletionCertification.clickProceed();
//    await createCourse.verifySuccessMessage();
 
//     await organization.clickGotoList();

//     await organization.clickSort();


   

        
//    } 
// )