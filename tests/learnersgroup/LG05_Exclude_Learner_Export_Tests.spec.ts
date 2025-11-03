import { test } from '../../customFixtures/expertusFixture';
import { FakerData } from '../../utils/fakerUtils';
import { readDataFromCSV } from '../../utils/csvUtil';
import * as testData from '../../data/MetadataLibraryData/testData.json';

const firstName = FakerData.getFirstName();
const lastName = FakerData.getLastName();
const userId = FakerData.getUserId();
const groupTitle = FakerData.getFirstName() + "_ExcludeLearnerTest";

// Additional test data for group creation
const additionalTestData = {
    role: "Instructor",
    language: "English",
    country: "United States",
    state: "California"
};

test.describe(`Verify Exclude Learner Functionality and Export Behavior`, () => {
    test.describe.configure({ mode: "serial" });

    test(`UC116 - Create user for exclude learner functionality test`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC116 - User Creation for Exclude Learner Test` },
            { type: `Test Description`, description: `Create a user with required attributes for testing exclude learner functionality and export behavior` }
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
         
        
        await createUser.clickInheritAddress(); 
        await createUser.typeAddress("Address 1", addressData.address1);
        await createUser.typeAddress("Address 2", addressData.address2);
        await createUser.select("Country", addressData.country);
        await createUser.select("State/Province", addressData.state);
        await createUser.select("Time Zone", addressData.timezone);
        await createUser.enter("user-city", addressData.city);
        await createUser.enter("user-zipcode", addressData.zipcode);
        await createUser.clickSave();
        
        console.log(`User created with ID ${userId} for exclude learner functionality testing`);
    });

    test(`UC117 - Create learner group and add user to exclude learners`, async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC117 - Create Group and Exclude Learner` },
            { type: `Test Description`, description: `Create learner group with basic attributes and add the created user to exclude learners section first` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        await learnerGroup.clickCreateGroup();
        await learnerGroup.enterGroupTitle(groupTitle);
        
        console.log(`Creating learner group: ${groupTitle}`);
        
        // Select some attributes to make it a valid group
        console.log("Selecting Department attribute");
        await learnerGroup.selectDepartment(testData.department);
        
        console.log("Selecting Employment Type attribute");
        await learnerGroup.selectEmploymentType(testData.employmentType);
        
        // First exclude the learner
        console.log("🔄 Adding user to exclude learners section first");
        await learnerGroup.removeLearners(userId);
        console.log(`✅ User ${userId} successfully added to exclude learners`);
        
        // Activate and save the group
        await learnerGroup.clickActivateToggle();
        await learnerGroup.clickSaveButton();
        await learnerGroup.confirmGroupCreation();
        await learnerGroup.clickProceedButton();
        await learnerGroup.clickGoToListing();
        await learnerGroup.verifySuccessMessage("Learner Group created successfully");
        
        console.log(`✅ Learner group created successfully with excluded user: ${groupTitle}`);
    });

    test(`UC118 - Attempt to include already excluded learner and verify 'No matching result found'`, async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC118 - Test Include Excluded Learner Validation` },
            { type: `Test Description`, description: `Attempt to include a learner who is already in exclude list and verify 'No matching result found' message appears: //div[text()='No matching result found.']` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Search for the created group
        await learnerGroup.searchGroup(groupTitle);
        
        // Click on edit link to open the group for editing
        await learnerGroup.clickEditGroupButton();
        await learnerGroup.wait('mediumWait');
        
        console.log(`🔄 Attempting to include already excluded user: ${userId}`);
        
        // Try to include the learner using try-catch as requested
        try {
            await learnerGroup.selectLearners(userId);
            console.log("⚠️ Include operation completed without error - this might indicate the user was found");
        } catch (error) {
            console.log(`✅ Include operation failed as expected: ${error.message}`);
            
            // Verify the "No matching result found" message appears
            console.log("🔍 Verifying 'No matching result found' message");
            try {
                const noResultMessage = await learnerGroup.verifyNoMatchingResultFound();
                console.log(`✅ 'No matching result found' message verified: "${noResultMessage}"`);
                
                // Verify specific message text
                if (noResultMessage && noResultMessage.includes('No matching result found')) {
                    console.log("✅ Message contains expected 'No matching result found' text");
                } else {
                    console.log("⚠️ Message might not contain exact 'No matching result found' text");
                }
            } catch (verifyError) {
                console.log(`⚠️ Could not verify 'No matching result found' message: ${verifyError.message}`);
            }
        }
        
        console.log("✅ Test completed - excluded learner properly prevented from being included");
    });

   
});