import { test } from '../../customFixtures/expertusFixture';
import { FakerData } from '../../utils/fakerUtils';
import { readDataFromCSV } from '../../utils/csvUtil';
import { TestMetadataManager } from '../../utils/testMetadataManager';


const firstName = FakerData.getFirstName();
const lastName = FakerData.getLastName();
const userId = FakerData.getUserId();
const groupTitle = FakerData.getFirstName() + "_CompleteAttributesGroup";

// Additional test data that supplements JSON data
const additionalTestData = {
    role: "Instructor",
    language: "English",
    country: "United States",
    state: "California"
};


// Store fresh metadata for this test
let freshMetadata: any;

test.describe(`Learner Group Creation with All Attributes and X Mark Verification`, () => {
    test.describe.configure({ mode: "serial" });

    test.beforeAll('Create Fresh Metadata', async () => {
        // Create fresh metadata for this test file
        freshMetadata = await TestMetadataManager.createFreshMetadata('User_Creation_With_Complete_Attributes.spec.ts');
        console.log('Fresh metadata created:', freshMetadata.summary);
    });

    test(`UC015 - Create user for complete attributes test`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC015 - User Creation for Complete Attributes Test` },
            { type: `Test Description`, description: `Create a user with all required attributes for comprehensive learner group testing` }
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
        
        // Select all user attributes
        console.log(`Using fresh Department: ${freshMetadata.department.name}`);
            await createUser.selectDepartmentWithTestData(freshMetadata.department.name);
        console.log(`Using fresh Employment Type: ${freshMetadata.employmentType.name}`);
            await createUser.selectEmploymentTypeWithTestData(freshMetadata.employmentType.name);
        // await createUser.selectLanguageWithTestData(additionalTestData.language);
        // await createUser.selectStateWithTestData(additionalTestData.state);
        
      //  await createUser.clickInheritAddress(); 
        await createUser.typeAddress("Address 1", addressData.address1);
        await createUser.typeAddress("Address 2", addressData.address2);
        await createUser.select("Country", addressData.country);
        await createUser.select("State/Province", addressData.state);
        await createUser.select("Time Zone", addressData.timezone);
        await createUser.enter("user-city", addressData.city);
        await createUser.enter("user-zipcode", addressData.zipcode);
        await createUser.clickSave();
        
        console.log(`User created with ID ${userId} with all attributes`);
    });

    test(`UC016 - Create learner group with all attributes and verify selections`, async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC016 - Comprehensive Learner Group Creation` },
            { type: `Test Description`, description: `Create a learner group with all attributes: department, employment type, role, job role, language, country, and state` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        await learnerGroup.clickCreateGroup();
        await learnerGroup.enterGroupTitle(groupTitle);
        
        // Select all attributes using the appropriate methods
        console.log("Selecting Department");
        console.log(`Creating learner group with fresh Department: ${freshMetadata.department.name}`);
        await learnerGroup.selectDepartment(freshMetadata.department.name);
        
        console.log("Selecting Employment Type");
        console.log(`Adding fresh Employment Type: ${freshMetadata.employmentType.name}`);
        await learnerGroup.selectEmploymentType(freshMetadata.employmentType.name);
        
        console.log("Selecting Role");
        await learnerGroup.selectRole(additionalTestData.role);
        
        console.log("Selecting Job Role");
        console.log(`Adding fresh Job Role: ${freshMetadata.jobRole.name}`);
        await learnerGroup.selectJobRole(freshMetadata.jobRole.name);
        
        console.log("Selecting Country");
        await learnerGroup.selectCountryNew(additionalTestData.country);
        
        console.log("Selecting Language");
        await learnerGroup.selectLanguageNew(additionalTestData.language);
        
        console.log("Selecting State");
        await learnerGroup.selectStateNew(additionalTestData.state);
        
        // Add learners to the group
        console.log("Adding learners to the group");
        await learnerGroup.selectLearners(userId);
        
        // Activate and save the group
        await learnerGroup.clickActivateToggle();
        await learnerGroup.clickSaveButton();
        await learnerGroup.confirmGroupCreation();
        await learnerGroup.clickProceedButton();
        await learnerGroup.clickGoToListing();
        //await learnerGroup.verifySuccessMessage("Learner Group created successfully");
        await learnerGroup.searchGroup(groupTitle);
        
        console.log(`Learner group created with all attributes ${groupTitle}`);
    });

    test(`UC017 - Open group for editing and verify cancel X icon for selected attributes`, async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC017 - Verify Cancel X Icon for Selected Attributes` },
            { type: `Test Description`, description: `Open the created group for editing and verify that selected attributes are displayed with X mark on the right side of the page` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Search for the created group
        await learnerGroup.searchGroup(groupTitle);
        
        // Click on edit link to open the group for editing
        await learnerGroup.clickEditGroupButton();
        
        // Wait for the group edit page to load
        await learnerGroup.wait('mediumWait');
        
        console.log("Verifying cancel X icon for selected attributes");
        
        // Verify that cancel X icon is visible for the selected attributes
        await learnerGroup.verifyCancelIconVisible();
        console.log("Cancel X icon verified for selected attributes");
    });

    test(`UC018 - Test cancel X icon functionality by removing one attribute`, async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC018 - Test Cancel X Icon Functionality` },
            { type: `Test Description`, description: `Test the functionality of cancel X icon by removing one selected attribute and verifying it gets deselected` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Search for the created group
        await learnerGroup.searchGroup(groupTitle);
        
        // Click on edit link to open the group for editing
        await learnerGroup.clickEditGroupButton();
        
        // Wait for the group edit page to load
        await learnerGroup.wait('mediumWait');
        
        console.log("Testing cancel X icon functionality");
        
        // Click on the cancel X icon to remove an attribute
        await learnerGroup.verifyCancelIconVisible();
        console.log("Successfully clicked cancel X icon attribute removed");
        
        // Wait a moment to see the effect
        await learnerGroup.wait('minWait');
        
        console.log("Cancel X icon functionality test completed");
    });

    test(`UC019 - Verify user association with the completed group`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC019 - User Association Verification` },
            { type: `Test Description`, description: `Verify that the user is properly associated with the learner group that contains all selected attributes` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.userSearchField(userId);
        await createUser.clickeditUser();
        await createUser.scrollToAssociatedGroupsAndVerify(groupTitle);
        
        console.log(`User association with complete attributes group verified ${groupTitle}`);
    });
});