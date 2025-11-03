import { test } from '../../customFixtures/expertusFixture';
import { FakerData } from '../../utils/fakerUtils';
import { readDataFromCSV } from '../../utils/csvUtil';
import { TestMetadataManager } from '../../utils/testMetadataManager';


const firstName = FakerData.getFirstName();
const lastName = FakerData.getLastName();
const userId = FakerData.getUserId();
const groupTitle = FakerData.getFirstName() + "_TwoDepartmentsGroup";

// Additional test data that supplements JSON data
const additionalTestData = {
    department1: "Visualize Blockchains",
    department2: "Benchmark ROI", 
    country: "United States",
    state: "California"
};




// Store fresh metadata for this test
let freshMetadata: any;

test.describe(`User and Learner Group Creation with Two Departments Verification`, () => {
    test.describe.configure({ mode: "serial" });

    test.beforeAll('Create Fresh Metadata', async () => {
        // Create fresh metadata for this test file
        freshMetadata = await TestMetadataManager.createFreshMetadata('User_Creation_With_Two_Departments.spec.ts');
        console.log('Fresh metadata created:', freshMetadata.summary);
    });

    test(`UC020 - Create user with two departments`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC020 - User Creation with Two Departments` },
            { type: `Test Description`, description: `Create a user with two departments: Visualize Blockchains and Benchmark ROI` }
        );

        const csvFilePath = './data/US_address.csv';
        const data = await readDataFromCSV(csvFilePath);
        const addressData = data[0]; // Use first row of address data

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.clickCreateUser();    
        await createUser.verifyCreateUserLabel();    
        await createUser.enter("first_name", firstName);
        await createUser.enter("last_name", lastName);
        await createUser.enter("username", userId);
        await createUser.enter("user-password", "Welcome1@");
        
        // Select first department
        console.log(`Selecting first department ${freshMetadata.department1}`);
        await createUser.selectDepartmentWithTestData(freshMetadata.department1);
        
        // Select second department
        console.log(`Selecting second department ${freshMetadata.department2}`);
        await createUser.selectDepartmentWithTestData(freshMetadata.department2);
        
        // Select employment type
        await createUser.selectEmploymentTypeWithTestData(freshMetadata.employmentType);
        
        // Add address information
        await createUser.clickInheritAddress(); 
        await createUser.typeAddress("Address 1", addressData.address1);
        await createUser.typeAddress("Address 2", addressData.address2);
        await createUser.select("Country", addressData.country);
        await createUser.select("State/Province", addressData.state);
        await createUser.select("Time Zone", addressData.timezone);
        await createUser.enter("user-city", addressData.city);
        await createUser.enter("user-zipcode", addressData.zipcode);
        await createUser.clickSave();
        
        
        console.log(`User created with ID ${userId} with two departments ${freshMetadata.department1} and ${freshMetadata.department2}`);
    });

    test(`UC021 - Create learner group with same two departments`, async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC021 - Learner Group Creation with Two Departments` },
            { type: `Test Description`, description: `Create a learner group with the same two departments as the user: Visualize Blockchains and Benchmark ROI` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        await learnerGroup.clickCreateGroup();
        await learnerGroup.enterGroupTitle(groupTitle);
        
        // Select first department for learner group
        console.log(`Selecting first department for group ${freshMetadata.department1}`);
        await learnerGroup.selectDepartment(freshMetadata.department1);
        
        // Wait before selecting second department
        await learnerGroup.wait('minWait');
        
        // Select second department for learner group
        console.log(`Selecting second department for group ${freshMetadata.department2}`);
        await learnerGroup.selectDepartment(freshMetadata.department2);
         await learnerGroup.wait('minWait');
        // Add learners to the group
        console.log("Adding learners to the group");
        await learnerGroup.selectLearners(userId);
        
        // Activate and save the group
        await learnerGroup.clickActivateToggle();
        await learnerGroup.clickSaveButton();
        await learnerGroup.confirmGroupCreation();
        await learnerGroup.clickProceedButton();
        await learnerGroup.clickGoToListing();
        await learnerGroup.verifySuccessMessage("Learner Group created successfully");
        await learnerGroup.searchGroup(groupTitle);
        
        console.log(`Learner group created with two departments ${groupTitle}`);
    });

    test(`UC022 - Verify user is added to learner group with matching departments`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC022 - User Association Verification with Two Departments` },
            { type: `Test Description`, description: `Verify that the user with two departments is automatically added to the learner group with the same two departments` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.userSearchField(userId);
        await createUser.clickeditUser();
        await createUser.scrollToAssociatedGroupsAndVerify(groupTitle);
        
        console.log(`User association verified - User with departments ${freshMetadata.department1} and ${freshMetadata.department2} is associated with group ${groupTitle}`);
    });

   
});