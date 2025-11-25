import { test } from "../../../customFixtures/expertusFixture"
import { readDataFromCSV } from "../../../utils/csvUtil";
import { FakerData } from '../../../utils/fakerUtils';
import { updateFieldsInJSON } from "../../../utils/jsonDataHandler";
import { URLConstants } from "../../../constants/urlConstants";
import { CatalogPage } from "../../../pages/CatalogPage";
const OrgName = FakerData.getOrganizationName()+"Organization1"+(Date.now());
 const userName = FakerData.getUserId();
 const courseAdmin: any = FakerData.getUserId()




test(`Verify the access icon while createing and on both edit and listing page`, async ({ adminHome, organization, CompletionCertification,createCourse ,adminGroup, learnerGroup,learnerHome}) => {
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
    await organization.verifyTheAccessIconIsEnabledOnlyWhenOrganizationIsCreated();

    await organization.clickSave();
    await CompletionCertification.clickProceed();
   await createCourse.verifySuccessMessage();
   await organization.clickGotoList();
   await createCourse.catalogSearch(OrgName);


   await organization.visibilityOfAccessIcon();

   await organization.clickEditIcon();
      await organization.visibilityOfAccessIcon();

    

})