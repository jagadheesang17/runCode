import { test } from '../../../customFixtures/expertusFixture';
import { readDataFromCSV } from '../../../utils/csvUtil';
import { FakerData } from '../../../utils/fakerUtils';

 const OrgName = FakerData.getOrganizationName()+"Organization"+(Date.now());
 const userName = FakerData.getUserId();

 let ogtypeValue:any;

 test(`Verify the action icon when there is no child organization and no active users under the parent organization`, async ({ adminHome, organization, CompletionCertification,createCourse }) => 
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
    await organization.typeDescription();
    await organization.clickSave();
    await CompletionCertification.clickProceed();
   await createCourse.verifySuccessMessage();
   await organization.clickGotoList();
   await createCourse.catalogSearch(OrgName);

   await organization.verifyTheActionIconWhenThereIsNoActiveUserAndChildOrganization(OrgName);
   });