import { test } from '../../customFixtures/expertusFixture';
import { FakerData } from '../../utils/fakerUtils';
import { readDataFromCSV } from '../../utils/csvUtil';
import * as testData from '../../data/MetadataLibraryData/testData.json';

const firstName = FakerData.getFirstName();
const lastName = FakerData.getLastName();
const userId = FakerData.getUserId();
const groupTitle = FakerData.getFirstName() + "_SelectUnselectGroup";

// Additional test data for various attributes
const additionalTestData = {
    role: "Instructor",
    language: "English",
    country: "United States",
    state: "California",
    userType: "Deliver Action-items"
};

test.describe(`Verify Select ALL and Unselect ALL functionality for Learner Group Attributes`, () => {
    test.describe.configure({ mode: "serial" });

    test(`UC098 - Create user for Select All/Unselect All attributes test`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC098 - User Creation for Select All/Unselect All Test` },
            { type: `Test Description`, description: `Create a user with required attributes for testing Select All and Unselect All functionality in learner groups` }
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
        
       // await createUser.clickInheritAddress(); 
        await createUser.typeAddress("Address 1", addressData.address1);
        await createUser.typeAddress("Address 2", addressData.address2);
        await createUser.select("Country", addressData.country);
        await createUser.select("State/Province", addressData.state);
        await createUser.select("Time Zone", addressData.timezone);
        await createUser.enter("user-city", addressData.city);
        await createUser.enter("user-zipcode", addressData.zipcode);
        await createUser.clickSave();
        
        console.log(`User created with ID ${userId} for Select All/Unselect All testing`);
    });

    test(`UC099 - Create learner group and test Select All functionality for ALL attributes`, async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC099 - Test Select All for ALL Attributes` },
            { type: `Test Description`, description: `Create learner group and verify Select All functionality for all attributes: Department, Employment Type, Role, Job Role, User Type, and Language` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        await learnerGroup.clickCreateGroup();
        await learnerGroup.enterGroupTitle(groupTitle);
        
        console.log("🔄 Testing Select All functionality for ALL attributes");
        
        // Select All for Department
        console.log("1️⃣ Department - Select All");
        await learnerGroup.clickDepartmentField();
        await learnerGroup.clickSelectAll();
        await learnerGroup.wait('minWait');
        
        // Select All for Employment Type
        console.log("2️⃣ Employment Type - Select All");
        await learnerGroup.clickEmploymentTypeField();
        await learnerGroup.clickSelectAll();
        await learnerGroup.wait('minWait');
        
        // Select All for Role
        console.log("3️⃣ Role - Select All");
        await learnerGroup.clickRoleField();
        await learnerGroup.clickSelectAll();
        await learnerGroup.wait('minWait');
        
        // Select All for Job Role
        console.log("4️⃣ Job Role - Select All");
        await learnerGroup.clickJobRoleField();
        await learnerGroup.clickSelectAll();
        await learnerGroup.wait('minWait');
        
        // Select All for User Type
        console.log("5️⃣ User Type - Select All");
        await learnerGroup.clickUserTypeField();
        await learnerGroup.clickSelectAll();
        await learnerGroup.wait('minWait');
        
        // Select All for Language
        console.log("6️⃣ Language - Select All");
        await learnerGroup.clickLanguageField();
        await learnerGroup.clickSelectAll();
        await learnerGroup.wait('minWait');
        
        console.log("✅ All attributes Select All functionality completed");
        
        // Add learners to verify the group creation works
        await learnerGroup.selectLearners(userId);
        
        // Activate and save the group
        await learnerGroup.clickActivateToggle();
        await learnerGroup.clickSaveButton();
        await learnerGroup.confirmGroupCreation();
        await learnerGroup.clickProceedButton();
        await learnerGroup.clickGoToListing();
        
        console.log(`✅ Learner group created with Select All for ALL attributes: ${groupTitle}`);
    });

    test(`UC100 - Test Unselect All functionality for ALL attributes`, async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC100 - Test Unselect All for ALL Attributes` },
            { type: `Test Description`, description: `Open the created group and verify Unselect All functionality for all attributes: Department, Employment Type, Role, Job Role, User Type, and Language` }
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
        
        console.log("🔄 Testing Unselect All functionality for ALL attributes");
        
        // Unselect All for Department
        console.log("1️⃣ Department - Unselect All");
        await learnerGroup.clickDepartmentField();
        await learnerGroup.clickUnselectAll();
        await learnerGroup.wait('minWait');
        
        // Unselect All for Employment Type
        console.log("2️⃣ Employment Type - Unselect All");
        await learnerGroup.clickEmploymentTypeField();
        await learnerGroup.clickUnselectAll();
        await learnerGroup.wait('minWait');
        
        // Unselect All for Role
        console.log("3️⃣ Role - Unselect All");
        await learnerGroup.clickRoleField();
        await learnerGroup.clickUnselectAll();
        await learnerGroup.wait('minWait');
        
        // Unselect All for Job Role
        console.log("4️⃣ Job Role - Unselect All");
        await learnerGroup.clickJobRoleField();
        await learnerGroup.clickUnselectAll();
        await learnerGroup.wait('minWait');
        
        // Unselect All for User Type
        console.log("5️⃣ User Type - Unselect All");
        await learnerGroup.clickUserTypeField();
        await learnerGroup.clickUnselectAll();
        await learnerGroup.wait('minWait');
        
        // Unselect All for Language
        console.log("6️⃣ Language - Unselect All");
        await learnerGroup.clickLanguageField();
        await learnerGroup.clickUnselectAll();
        await learnerGroup.wait('minWait');
        
        console.log("✅ All attributes Unselect All functionality completed");
        
        // Save the group after all unselection operations
        await learnerGroup.wait('minWait');
        await learnerGroup.clickSaveButton();
        await learnerGroup.wait('mediumWait');
        
        console.log("✅ Group saved successfully after Unselect All for ALL attributes");
    });

    test(`UC101 - Verify user association after Select All/Unselect All operations`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC101 - User Association Verification After Select All/Unselect All` },
            { type: `Test Description`, description: `Verify that the user is still properly associated with the learner group after comprehensive Select All and Unselect All operations on all attributes` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.userSearchField(userId);
        await createUser.clickeditUser();
        await createUser.scrollToAssociatedGroupsAndVerify(groupTitle);
        
        console.log(`✅ User association verified after comprehensive Select All/Unselect All operations: ${groupTitle}`);
        console.log("✅ Complete Select All and Unselect All functionality test suite completed successfully");
    });
});