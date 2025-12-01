import { test } from '../../../customFixtures/expertusFixture';
import { readDataFromCSV } from '../../../utils/csvUtil';
import { FakerData } from '../../../utils/fakerUtils';

 const OrgName = FakerData.getOrganizationName()+"Organization"+(Date.now());
 const userName1 = FakerData.getUserId();
 const costcenterValue=FakerData.getPrice();
import { credentials } from "../../../constants/credentialData";
const userName2 = FakerData.getUserId();
 const courseName = FakerData.getCourseName();
 const price = FakerData.getPrice();


 let ogtypeValue:any;

 test(`Creating the organization with cost center`, async ({ adminHome, organization, CompletionCertification,createCourse }) => 
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
    await organization.enterCostCenter(costcenterValue);

    await organization.clickSave();
    await CompletionCertification.clickProceed();
   await createCourse.verifySuccessMessage();

        
   } 
 )

test(`Create a Manager with address`, async ({ adminHome, createUser, createCourse }) => {
    

 
      const csvFilePath = './data/US_address.csv';
    const data = await readDataFromCSV(csvFilePath);

    for (const row of data) {
        const { country,state,city,zipcode } = row;
    await adminHome.loadAndLogin("PEOPLEADMIN");
    await adminHome.menuButton();
    await adminHome.people();
    await adminHome.user();
    await createUser.clickCreateUser();
    await createUser.verifyCreateUserLabel();
    await createUser.enter("first_name", FakerData.getFirstName());
    await createUser.enter("last_name", FakerData.getLastName());
    await createUser.enter("username", userName1);
    await createUser.enter("user-password", "Welcome1@");
    // await createUser.uncheckInheritFrom()
    await createUser.uncheckInheritAddressIfPresent();

      await createUser.typeAddress("Address 1",FakerData.getAddress());
            await createUser.typeAddress("Address 2",FakerData.getAddress());
            await createUser.select("Country", country);
            await createUser.select("State/Province", state);
             await createUser.enter("user-city", city);
            await createUser.enter("user-zipcode", zipcode);
    await createUser.selectLanguage("English")
    
await createUser.clickRolesButton("Manager");
    await createUser.clickSave();

    //   await createUser.clickProceed("Proceed");
    //  await createUser.verifyUserCreationSuccessMessage();
}})

 test(`Create user and mapping the created manager to this user`, async ({ adminHome, createUser ,createCourse}) => {
       
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
        await createUser.enter("username", userName2);
        await createUser.enter("user-password", "Welcome1@");
       await createUser.typeAddress("Address 1",FakerData.getAddress());
        await createUser.typeAddress("Address 2",FakerData.getAddress());
  
        await createUser.select("Country", country);
        await createUser.select("State/Province", state);
        await createUser.select("Time Zone", timezone);
        await createUser.enter("user-city", city);
        await createUser.enter("user-zipcode", zipcode);
        await createUser.searchAndSelect("organization",OrgName)
                await createUser.selectManager(userName1);

        await createUser.clickSave();   
    

    }
} )


 
     test(`Single Elearning instance with Manager Approval Enabled`, async ({ adminHome, createCourse, editCourse }) => {
         
         await adminHome.loadAndLogin("LEARNERADMIN");
         await adminHome.menuButton();
         await adminHome.clickLearningMenu();
         await adminHome.clickCourseLink();
         await createCourse.clickCreateCourse();
         await createCourse.verifyCreateUserLabel("CREATE COURSE");
         await createCourse.enter("course-title", courseName);
         await createCourse.selectLanguage("English");
         await createCourse.typeDescription("This is a new course by name :" + courseName);
         await createCourse.enterPrice(price);
         await createCourse.selectCurrency();
         await createCourse.contentLibrary(); //By default youtube content will be added here
         await createCourse.clickCatalog();
         await createCourse.clickSave();
         await createCourse.clickProceed();
         await createCourse.verifySuccessMessage();
         await createCourse.clickEditCourseTabs();
         await editCourse.clickManagerApproval();
    
         await editCourse.saveApproval()
         await createCourse.typeDescription("  Added Manager Approval")
         await createCourse.clickUpdate()
     })
 
     test(`Verifying the cost center value after enrolling the course from the manager approval popup`, async ({ learnerHome, catalog }) => {
        
        await learnerHome.basicLogin(userName2, "portal1");
         await learnerHome.clickCatalog();
         await catalog.mostRecent();
         await catalog.searchCatalog(courseName);
         await catalog.clickMoreonCourse(courseName);
         await catalog.clickSelectcourse(courseName);
         await catalog.clickRequestapproval();
         await catalog.verifyCostCentrerInApprovalPopup(costcenterValue);
     })
    