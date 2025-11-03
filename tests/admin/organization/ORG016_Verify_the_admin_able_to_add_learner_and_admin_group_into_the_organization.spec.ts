import { test } from "../../../customFixtures/expertusFixture"
import { readDataFromCSV } from "../../../utils/csvUtil";
import { FakerData } from '../../../utils/fakerUtils';
import { updateFieldsInJSON } from "../../../utils/jsonDataHandler";
import { URLConstants } from "../../../constants/urlConstants";
import { CatalogPage } from "../../../pages/CatalogPage";
const OrgName = FakerData.getOrganizationName()+"Organization"+(Date.now());
 const userName = FakerData.getUserId();

 let ogtypeValue:any;


const courseAdmin: any = FakerData.getUserId()
const roleName = FakerData.getFirstName() + " Admin"
const groupTitle: any = FakerData.getFirstName() + " Admin"
const LearnergroupTitle: any = FakerData.getFirstName() + " Learner"
const groupTitle2: any = FakerData.getFirstName() + " Admin"
const LearnergroupTitle2: any = FakerData.getFirstName() + " Learner"
let courseName = ("Cron " + FakerData.getCourseName());
const title = FakerData.getRandomTitle();
let learnerGroups: string[] = [];
let adminGroups: string[] = [];
let learnerGroupsInAccess: string[] = [];
let adminGroupsInAccess: string[] = [];




test(`Creating user and admin role`, async ({ adminHome, editCourse, createUser, learnerHome, adminRoleHome, adminGroup, createCourse, contentHome, learnerGroup }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Creating user with seperate groups` },
        { type: `Test Description`, description: `Creating user with seperate admin and learner groups` }

    );
    const newData = {
        courseAdmin: courseAdmin
    }
    updateFieldsInJSON(newData)
    const csvFilePath = './data/User.csv';


    const data = await readDataFromCSV(csvFilePath);

    //creating user
    for (const row of data) {
        const { country, state, timezone, currency, city, zipcode } = row;

        await adminHome.loadAndLogin("SUPERADMIN")
        await adminHome.menuButton()
        await adminHome.people();
        await adminHome.user();
        await createUser.clickCreateUser();
        await createUser.verifyCreateUserLabel();

        await createUser.enter("first_name", FakerData.getFirstName());
        await createUser.enter("last_name", FakerData.getLastName());
        await createUser.enter("username", courseAdmin);
        await createUser.enter("user-password", "Welcome1@");
        await createUser.enter("email", FakerData.getEmail());
        await createUser.enter("user-phone", FakerData.getMobileNumber());
        await createUser.typeAddress("Address 1",FakerData.getAddress());
            await createUser.typeAddress("Address 2",FakerData.getAddress());
        await createUser.select("Country", country);
        await createUser.select("State/Province", state);
        await createUser.select("Time Zone", timezone);
        await createUser.select("Currency", currency);
        await createUser.enter("user-city", city);
        await createUser.enter("user-zipcode", zipcode);
        await createUser.enter("user-mobile", FakerData.getMobileNumber());
        // await createUser.clickRolesButton("Manager")
        await createUser.clickSave();
        // await createUser.clickProceed("Proceed");
        await createUser.verifyUserCreationSuccessMessage();
        await contentHome.gotoListing();
    }


    //creating admin role
    await adminHome.menuButton()
    await adminHome.people();
    await adminHome.clickAdminRole()
    await adminRoleHome.clickAddAdminRole()
    await adminRoleHome.enterName(roleName);
    await adminRoleHome.clickAllPriveileges();
    await adminRoleHome.clickSave()
    await adminRoleHome.verifyRole(roleName)
});


    test(`Creating seperate Admin group`, async ({ adminHome, editCourse, createUser, learnerHome, adminRoleHome, adminGroup, createCourse, contentHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Creating user with seperate groups` },
            { type: `Test Description`, description: `Creating user with seperate admin and learner groups` }
    
        );


    //creating admin group
    await adminHome.loadAndLogin("SUPERADMIN")
    await adminHome.menuButton()
    await adminHome.people();
    await adminHome.adminGroup();
    await adminGroup.clickCreateGroup();
    await adminGroup.selectroleAdmin(roleName);
    await adminGroup.enterGroupTitle(groupTitle)
    await adminGroup.searchUser(courseAdmin)
    await adminGroup.clickuserCheckbox(courseAdmin)
    await adminGroup.clickSelelctUsers();
    await adminGroup.clickActivate();
    await adminGroup.clickSave()

    await adminGroup.clickProceed();
    await createCourse.verifySuccessMessage();
    await contentHome.gotoListing();

    //creating another group
    await adminGroup.clickCreateGroup();
    await adminGroup.selectroleAdmin(roleName);
    await adminGroup.enterGroupTitle(groupTitle2)
    await adminGroup.searchUser(courseAdmin)
    await adminGroup.clickuserCheckbox(courseAdmin)
    await adminGroup.clickSelelctUsers();
    await adminGroup.clickActivate()
    await adminGroup.clickSave();
        await adminGroup.clickYes();

    await adminGroup.clickProceed();
    await createCourse.verifySuccessMessage();
    await contentHome.gotoListing();
    adminGroups = await learnerGroup.addGroups(groupTitle, groupTitle2);
    console.log(adminGroups);
});




 test(`Creating the organization as that created user and verify the access`, async ({ adminHome, organization, CompletionCertification,createCourse ,adminGroup, learnerGroup,learnerHome}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Vidya` },
        { type: `TestCase`, description: `Verify that an organization can be successfully created with all required details` },
        { type: `Test Description`, description: `Verify that an organization can be successfully created with all required details` }
    )

  
    await learnerHome.basicLogin(courseAdmin, "portal1");

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

await createCourse.clickAccessButton();
    adminGroupsInAccess=await adminGroup.getAdminGroupsInUserPage();
    // learnerGroupsInAccess=await learnerGroup.getLearnerGroups();
    // await learnerGroup.verifyGroups(learnerGroups,learnerGroupsInAccess);
    await learnerGroup.verifyGroups(adminGroups,adminGroupsInAccess)

    await organization.clickEditIcon();
await createCourse.clickAccessButton();
    adminGroupsInAccess=await adminGroup.getAdminGroupsInUserPage();
    // learnerGroupsInAccess=await learnerGroup.getLearnerGroups();
    // await learnerGroup.verifyGroups(learnerGroups,learnerGroupsInAccess);
    await learnerGroup.verifyGroups(adminGroups,adminGroupsInAccess)
        
   } 
 )

 
 