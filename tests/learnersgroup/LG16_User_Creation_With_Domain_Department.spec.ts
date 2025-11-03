import { test } from '../../customFixtures/expertusFixture';
import { FakerData } from '../../utils/fakerUtils';
import { readDataFromCSV } from '../../utils/csvUtil';
import { TestMetadataManager } from '../../utils/testMetadataManager';


const firstName = FakerData.getFirstName();
const lastName = FakerData.getLastName();
const userId = FakerData.getUserId();
const groupTitle = FakerData.getFirstName() + "_DomainDepartmentGroup";

// Additional test data that supplements JSON data
const additionalTestData = {
    domain: "autoportal1",
    country: "United States",
    state: "California"
};

// Merge JSON and additional data for backward compatibility  



// Store fresh metadata for this test
let freshMetadata: any;

test.describe(`Domain and Department Matching Tests for Learner Group Association`, () => {
    test.describe.configure({ mode: "serial" });

    test.beforeAll('Create Fresh Metadata', async () => {
        // Create fresh metadata for this test file
        freshMetadata = await TestMetadataManager.createFreshMetadata('User_Creation_With_Domain_Department.spec.ts');
        console.log('Fresh metadata created:', freshMetadata.summary);
    });

    test(`UC025 - Create user with specific department and domain`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC025 - User Creation with Department and Domain` },
            { type: `Test Description`, description: `Create a user with specific department ${freshMetadata.department} and domain ${freshMetadata.domain}` }
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
        
        // Select department for the user
        console.log(`Selecting department for user: ${freshMetadata.department}`);
        console.log(`Using fresh Department: ${freshMetadata.department.name}`);
            await createUser.selectDepartmentWithTestData(freshMetadata.department.name);
        
        // Select employment type
        console.log(`Using fresh Employment Type: ${freshMetadata.employmentType.name}`);
            await createUser.selectEmploymentTypeWithTestData(freshMetadata.employmentType.name);
        
        // Handle domain selection - first uncheck all domains, then select specific domain
        console.log("Managing domain selection for user");
        await createUser.uncheckAllDomainCheckboxes();
        await createUser.selectSpecificDomain(freshMetadata.domain);
        
        // Add address information
      //  await createUser.clickInheritAddress(); 
        await createUser.typeAddress("Address 1", addressData.address1);
        await createUser.typeAddress("Address 2", addressData.address2);
        await createUser.select("Country", addressData.country);
        await createUser.select("State/Province", addressData.state);
        await createUser.select("Time Zone", addressData.timezone);
        await createUser.enter("user-city", addressData.city);
        await createUser.enter("user-zipcode", addressData.zipcode);
        await createUser.clickSave();
        
        console.log(`User created with ID ${userId} with department ${freshMetadata.department} and domain ${freshMetadata.domain}`);
    });

    test(`UC026 - Create learner group with matching department and domain`, async ({ adminHome, createUser,learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC026 - Learner Group Creation with Matching Department and Domain` },
            { type: `Test Description`, description: `Create a learner group with the same department ${freshMetadata.department} and domain ${freshMetadata.domain} as the user` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        await learnerGroup.clickCreateGroup();
        await learnerGroup.enterGroupTitle(groupTitle);
        
        // Select department for learner group
        console.log(`Selecting department for learner group: ${freshMetadata.department}`);
        console.log(`Creating learner group with fresh Department: ${freshMetadata.department.name}`);
        await learnerGroup.selectDepartment(freshMetadata.department.name);
        
        // Handle domain selection for learner group - uncheck all then select specific
        console.log("Managing domain selection for learner group");
         await createUser.uncheckAllDomainCheckboxes();
         await createUser.selectSpecificDomain(freshMetadata.domain);
        // Navigate to domain settings if needed
        // Note: Domain management in learner groups might be different - adjust as needed
        
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
        await learnerGroup.searchGroup(groupTitle);
        
        console.log(`Learner group created with department ${freshMetadata.department} and domain ${freshMetadata.domain}`);
    });

    test(`UC027 - Verify user with matching domain and department is added to learner group`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC027 - Domain and Department Matching Verification` },
            { type: `Test Description`, description: `Verify that the user with department ${freshMetadata.department} and domain ${freshMetadata.domain} is automatically added to the matching learner group` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.userSearchField(userId);
        await createUser.clickeditUser();
        await createUser.scrollToAssociatedGroupsAndVerify(groupTitle);
        
        console.log(`Verification completed - User with department ${freshMetadata.department} and domain ${freshMetadata.domain} is associated with matching learner group ${groupTitle}`);
    });

});
