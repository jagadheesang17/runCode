import { test } from '../../../customFixtures/expertusFixture';
import { readDataFromCSV } from '../../../utils/csvUtil';
import { FakerData } from '../../../utils/fakerUtils';

const OrgName1 = FakerData.getOrganizationName();
const OrgName2 = FakerData.getOrganizationName()

test(`Verify that an organization can be successfully created and updated`, async ({ adminHome, organization, CompletionCertification,createCourse }) => 
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
    await organization.enterName(OrgName1);

    await organization.typeDropdown("Internal");
    await organization.typeDescription();
    await organization.clickSave();
    await CompletionCertification.clickProceed();
   await createCourse.verifySuccessMessage();
    await organization.clickEditOrg();
    await organization.enterName(OrgName1+" "+"edit");
     await organization.typeDropdown("External");
    await organization.typeDescription();
    await organization.clickUpdate();
       await createCourse.verifySuccessMessage();
       await organization.clickGotoList();

  await createCourse.catalogSearch(OrgName1+" "+"edit");
  await organization.verifyTheOrgName(OrgName1+" "+"edit");
        
   } 
)
   


test(`Verify that an organization can be successfully created and updated from quick access`, async ({ adminHome, organization, CompletionCertification,createCourse }) =>
     {

    await adminHome.loadAndLogin("CUSTOMERADMIN");
    await adminHome.createModuleFromQuickAccess("Organization","Organization");
    await organization.enterName(OrgName2);

    await organization.typeDropdown("Internal");
    await organization.typeDescription();
    await organization.clickSave();
    await CompletionCertification.clickProceed();
   await createCourse.verifySuccessMessage();
   await adminHome.clickAdminHome();
   await organization.editModuleFromQuickAccess("Organization","Organization");
    await createCourse.catalogSearch(OrgName2);

   await organization.clickOrganizationEditIcon(OrgName2);
    await organization.enterName(OrgName2+" "+"edit");
     await organization.typeDropdown("External");
    await organization.typeDescription();
    await organization.clickUpdate();
       await createCourse.verifySuccessMessage();
       await organization.clickGotoList();

  await createCourse.catalogSearch(OrgName2+" "+"edit");
  await organization.verifyTheOrgName(OrgName2+" "+"edit");


//    await adminHome.editOrganizationFromQuickAccess();
    
}
)   