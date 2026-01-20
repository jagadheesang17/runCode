import { create } from "domain";
import { test } from "../../../customFixtures/expertusFixture";
import { readDataFromCSV } from '../../../utils/csvUtil';
import { FakerData } from '../../../utils/fakerUtils';
import { verify } from "crypto";
const OrgName = "Org"+ FakerData.getOrganizationName();
const address1 = FakerData.getAddress();
const emergencyContactName=FakerData.getFirstName();

test.describe(`Verify_the_address_which_is_inherited_from_organization`, async () => {
    test.describe.configure({ mode: "serial" });
test(`Enable the Address inheritance from site settings`, async ({ siteAdmin,adminHome}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Balasundar` },
        { type: `TestCase`, description: `Enable company login alone in site settings` },
        { type: `Test Description`, description: `Enable company login alone in site settings` }

    );
    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.menuButton();
    await adminHome.siteAdmin();
    await adminHome.siteAdmin_Adminconfig();
    await siteAdmin.enableAddressInheritance();

})

test(`Create the organization with address`, async ({ adminHome, organization, CompletionCertification,createCourse,createUser }) => {
   

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

     await createUser.typeAddressOrg("Address1","Address1", address1);
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

test(`Verify the organization's address inherited to the user after mapping on User creation page`, async ({ adminHome, createUser ,createCourse}) => {
    
  

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
       
      
        await createUser.searchAndSelect("organization",OrgName);

        await createUser.clickSave();
        await createUser.editbtn();

        await createUser.verifyInheritedAddress("Address 1","user-addr1",address1);
        
        await createUser.verifyInheritedEmergencyContactName("emrg-cont-name",emergencyContactName);

      
    }
)}
)