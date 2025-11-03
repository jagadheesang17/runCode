import { test } from '../../customFixtures/expertusFixture';
import { FakerData } from '../../utils/fakerUtils';
import * as testData from '../../data/MetadataLibraryData/testData.json';
import { readDataFromCSV } from '../../utils/csvUtil';

const firstName = FakerData.getFirstName();
const lastName = FakerData.getLastName();
const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@test.com`;
const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
let department = testData.department;
let userid = FakerData.getUserId();
let groupTitle = FakerData.getFirstName() + "_EditListSuspendGroup";

test.describe(`Edit List Suspend Group Tests`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Create user for edit list suspend test`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC095 - Create User for Edit List Suspend Test` },
            { type: `Test Description`, description: `Create a user with all metadata attributes for edit list suspend workflow` }
        );

        const csvFilePath = './data/US_address.csv';
        const data = await readDataFromCSV(csvFilePath);
        const row = data[0]; // Use first row for this test
        const { country, state, timezone, address1, address2, city, zipcode } = row;

        // Step 1: Create User
        console.log(`Creating user ${userid} for edit list suspend test`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.clickCreateUser();    
        await createUser.verifyCreateUserLabel();    
        await createUser.enter("first_name", FakerData.getFirstName());
        await createUser.enter("last_name", FakerData.getLastName());
        await createUser.enter("username", userid);
        await createUser.enter("user-password", "Welcome1@");
        
        await createUser.selectDepartmentWithTestData(department);
        await createUser.selectEmploymentTypeWithTestData(testData.employmentType);
        await createUser.selectUserTypeWithTestData(testData.userType);
        await createUser.selectJobTitleWithTestData(testData.jobTitle);
        await createUser.clickInheritAddress(); 
        await createUser.typeAddress("Address 1", address1);
        await createUser.typeAddress("Address 2", address2);
        await createUser.select("Country", country);
        await createUser.select("State/Province", state);
        await createUser.select("Time Zone", timezone);
        await createUser.enter("user-city", city);
        await createUser.enter("user-zipcode", zipcode);
        await createUser.clickSave();               
        console.log(`✅ User ${userid} created successfully for edit list suspend test`);
    });

    test(`Create group and add user for edit list suspend test`, async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC096 - Create Group for Edit List Suspend Test` },
            { type: `Test Description`, description: `Create a learner group and add user for edit list suspend workflow` }
        );

        // Create Group and Add User
        console.log(`Creating group ${groupTitle} and adding user ${userid}`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        await learnerGroup.clickCreateGroup();
        await learnerGroup.enterGroupTitle(groupTitle);
        await learnerGroup.selectDepartment(department);
        await learnerGroup.selectLearners(userid);
        await learnerGroup.clickActivateToggle();
        await learnerGroup.clickSaveButton();
        await learnerGroup.confirmGroupCreation();
        await learnerGroup.clickProceedButton();
        await learnerGroup.clickGoToListing();
        await learnerGroup.verifySuccessMessage("Learner Group created successfully");
        console.log(`✅ Group ${groupTitle} created successfully with user ${userid}`);
    });

    test(`Suspend group from edit list and verify user association`, async ({ adminHome, learnerGroup, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC097 - Suspend Group from Edit List and Verify` },
            { type: `Test Description`, description: `Go to listing, suspend group using clickSuspendInEditList method, and verify user is no longer associated` }
        );

        // Step 1: Navigate to learner group listing and suspend using edit list method
        console.log(`Step 1: Suspending group ${groupTitle} from edit list`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Search for the group to ensure it's visible
        await learnerGroup.searchGroup(groupTitle);
        console.log(`Searched for group: ${groupTitle}`);
        
        // Use the clickSuspendInEditList method to suspend from listing page
        await learnerGroup.clickSuspendInEditList();
        console.log(`✅ Group ${groupTitle} suspended successfully using edit list method`);

        // Step 2: Verify user is no longer associated with the suspended group
        console.log(`Step 2: Verifying user ${userid} is no longer associated with suspended group ${groupTitle}`);
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.userSearchField(userid);
        await createUser.clickeditUser();
        
        // Verify group is NOT in associated groups
        await createUser.verifyGroupNotInAssociatedGroups(groupTitle);
        console.log(`✅ Verified user ${userid} is no longer associated with suspended group ${groupTitle}`);
        
        console.log(`✅ Complete edit list suspend workflow test passed`);
    });
});