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
let groupTitle = FakerData.getFirstName() + "_SuspendTestGroup";

test.describe(`Suspend Group and Verify User Association Tests`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1 - Create user with metadata attributes`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC090 - Create User for Suspend Test` },
            { type: `Test Description`, description: `Create a user with department, employment type, user type, job role, and job title from JSON test data` }
        );

        const csvFilePath = './data/US_address.csv';
        const data = await readDataFromCSV(csvFilePath);
        const row = data[0]; // Use first row for this test
        const { country, state, timezone, address1, address2, city, zipcode } = row;

        // Step 1: Create User
        console.log(`Step 1: Creating user ${userid}`);
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
        console.log(`✅ User ${userid} created successfully`);
    });

    test(`Step 2 - Create learner group and add user to it`, async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC091 - Create Learner Group and Add User` },
            { type: `Test Description`, description: `Create a learner group using the same department data and add the created user to it` }
        );

        // Step 2: Create Group and Add User
        console.log(`Step 2: Creating group ${groupTitle} and adding user ${userid}`);
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
        console.log(`✅ Group ${groupTitle} created and user ${userid} added successfully`);
    });

    test(`Step 3 - Verify user is associated with group before suspension`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC092 - Verify User Association Before Suspension` },
            { type: `Test Description`, description: `Verify that the created user is associated with the learner group before suspension` }
        );

        // Step 3: Verify User Association Before Suspension
        console.log(`Step 3: Verifying user ${userid} association before suspension`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.userSearchField(userid);
        await createUser.clickeditUser();
        await createUser.scrollToAssociatedGroupsAndVerify(groupTitle);
        console.log(`✅ Verified user ${userid} is associated with group ${groupTitle}`);
    });

    test(`Step 4 - Edit group and suspend it`, async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC093 - Edit Group and Suspend It` },
            { type: `Test Description`, description: `Edit the learner group and suspend it using the suspend workflow` }
        );

        // Step 4: Edit Group and Suspend It
        console.log(`Step 4: Editing group ${groupTitle} and suspending it`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        await learnerGroup.searchGroup(groupTitle);
        await learnerGroup.clickEditLink(1);
        console.log(`✅ Clicked edit for group: ${groupTitle}`);
        
        // Suspend the group using the complete workflow
        await learnerGroup.suspendLearnerGroupComplete();
        console.log(`✅ Group ${groupTitle} suspended successfully`);
    });

    test(`Step 5 - Verify user is no longer associated with suspended group`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC094 - Verify User Not Associated After Suspension` },
            { type: `Test Description`, description: `Verify that the user is no longer associated with the suspended learner group` }
        );

        // Step 5: Verify User No Longer Associated
        console.log(`Step 5: Verifying user ${userid} is no longer associated with suspended group ${groupTitle}`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.userSearchField(userid);
        await createUser.clickeditUser();
        await createUser.verifyGroupNotInAssociatedGroups(groupTitle);
        console.log(`✅ Verified user ${userid} is no longer associated with suspended group ${groupTitle}`);
        
        console.log(`✅ Complete workflow verification passed - User successfully disassociated from suspended group`);
    });
});