import { test } from '../../customFixtures/expertusFixture';
import { FakerData } from '../../utils/fakerUtils';
import { readDataFromCSV } from '../../utils/csvUtil';
import * as testData from '../../data/MetadataLibraryData/testData.json';

const firstName = FakerData.getFirstName();
const lastName = FakerData.getLastName();
const userId = FakerData.getUserId();
const duplicateGroupTitle = FakerData.getFirstName() + "_UniqueNameTest";

// Additional test data for group creation
const additionalTestData = {
    role: "Instructor",
    language: "English",
    country: "United States",
    state: "California"
};

test.describe(`Verify Learner Group Name Uniqueness Validation`, () => {
    test.describe.configure({ mode: "serial" });

    test(`UC112 - Create user for unique name validation test`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC112 - User Creation for Unique Name Test` },
            { type: `Test Description`, description: `Create a user with required attributes for testing learner group name uniqueness validation` }
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
        
        // Select user attributes for testing
        await createUser.selectDepartmentWithTestData(testData.department);
        await createUser.selectEmploymentTypeWithTestData(testData.employmentType);
        // await createUser.selectLanguageWithTestData(additionalTestData.language);
        // await createUser.selectStateWithTestData(additionalTestData.state);
        
        await createUser.clickInheritAddress(); 
        await createUser.typeAddress("Address 1", addressData.address1);
        await createUser.typeAddress("Address 2", addressData.address2);
        await createUser.select("Country", addressData.country);
        await createUser.select("State/Province", addressData.state);
        await createUser.select("Time Zone", addressData.timezone);
        await createUser.enter("user-city", addressData.city);
        await createUser.enter("user-zipcode", addressData.zipcode);
        await createUser.clickSave();
        
        console.log(`User created with ID ${userId} for unique name validation testing`);
    });

    test(`UC113 - Create first learner group with unique name`, async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC113 - Create First Learner Group` },
            { type: `Test Description`, description: `Create the first learner group with a unique name that will be used for duplication test` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        await learnerGroup.clickCreateGroup();
        await learnerGroup.enterGroupTitle(duplicateGroupTitle);
        
        console.log(`Creating first learner group with name: ${duplicateGroupTitle}`);
        
        // Select some attributes to make it a valid group
        console.log("Selecting Department attribute");
        await learnerGroup.selectDepartment(testData.department);
        
        console.log("Selecting Employment Type attribute");
        await learnerGroup.selectEmploymentType(testData.employmentType);
        
        // Add learners to the group
        console.log("Adding learners to the group");
        await learnerGroup.selectLearners(userId);
        
        // Activate and save the group
        await learnerGroup.clickActivateToggle();
        await learnerGroup.clickSaveButton();
        await learnerGroup.confirmGroupCreation();
        await learnerGroup.clickProceedButton();
        await learnerGroup.clickGoToListing();
      
        
        console.log(`✅ First learner group created successfully with name: ${duplicateGroupTitle}`);
    });

    test(`UC114 - Attempt to create second learner group with same name and verify error`, async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC114 - Test Duplicate Name Validation` },
            { type: `Test Description`, description: `Attempt to create second learner group with same name and verify unique name validation error message appears: //span[contains(text(),'already exists')]` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        await learnerGroup.clickCreateGroup();
        
        console.log(`🔄 Attempting to create second group with duplicate name: ${duplicateGroupTitle}`);
        
        // Enter the same group title as the first group
        await learnerGroup.enterGroupTitle(duplicateGroupTitle);
        
        // Select some attributes to make it a valid group
        console.log("Selecting Department attribute for duplicate group");
        await learnerGroup.selectDepartment(testData.department);
        
        console.log("Selecting Employment Type attribute for duplicate group");
        await learnerGroup.selectEmploymentType(testData.employmentType);
        
        // Add learners to the group
        console.log("Adding learners to the duplicate group");
        await learnerGroup.selectLearners(userId);
        
        // Activate the group
        await learnerGroup.clickActivateToggle();
        
        // Try to save the group - this should trigger the validation error
        console.log("🔄 Clicking Save button - expecting validation error for duplicate name");
        await learnerGroup.clickSaveButton();
           
        // Wait a moment for the validation error to appear
        await learnerGroup.wait('mediumWait');

        
        // Verify the unique name validation error appears
        console.log("🔍 Verifying unique name validation error message");
        const errorMessage = await learnerGroup.verifyUniqueNameValidationError();
        
        console.log(`✅ Unique name validation error verified: "${errorMessage}"`);
        console.log(`✅ Test completed - duplicate group name properly rejected with error message`);
        
        // Optionally, verify specific error text contains "already exists"
        if (errorMessage && errorMessage.toLowerCase().includes('already exists')) {
            console.log("✅ Error message contains expected 'already exists' text");
        } else {
            console.log("⚠️ Error message might not contain 'already exists' text");
        }
    });

   
});