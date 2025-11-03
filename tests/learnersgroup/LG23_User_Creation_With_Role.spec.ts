import { test } from '../../customFixtures/expertusFixture';
import { FakerData } from '../../utils/fakerUtils';

import { readDataFromCSV } from '../../utils/csvUtil';
import { TestMetadataManager } from '../../utils/testMetadataManager';

const firstName = FakerData.getFirstName();
const lastName = FakerData.getLastName();
const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@test.com`;
const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
let roleName = "Instructor";
let userid = FakerData.getUserId();
let groupTitle = FakerData.getFirstName() + "_RoleGroup";

// Store fresh metadata for this test
let freshMetadata: any;

test.describe(`User Creation with Role Data Tests`, () => {
    test.describe.configure({ mode: "serial" });

    test.beforeAll('Create Fresh Metadata', async () => {
        // Create fresh metadata for this test file
        freshMetadata = await TestMetadataManager.createFreshMetadata('User_Creation_With_Role.spec.ts');
        console.log('Fresh metadata created:', freshMetadata.summary);
    });

    test(`Verify user creation with all metadata attributes using fresh metadata created via API`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC007 - User Creation with Role Data` },
            { type: `Test Description`, description: `Create a user with role, department, employment type, user type, and job title using fresh metadata created via API` }
        );

        const csvFilePath = './data/US_address.csv';
        const data = await readDataFromCSV(csvFilePath);

        for (const row of data) {
            const { country, state, timezone, address1, address2, city, zipcode } = row;

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
            
            console.log(`Using fresh Department: ${freshMetadata.department.name}`);
            await createUser.selectDepartmentWithTestData(freshMetadata.department.name);
            console.log(`Using fresh Employment Type: ${freshMetadata.employmentType.name}`);
            await createUser.selectEmploymentTypeWithTestData(freshMetadata.employmentType.name);
            console.log(`Using fresh User Type: ${freshMetadata.userType.name}`);
            await createUser.selectUserTypeWithTestData(freshMetadata.userType.name);
            console.log(`Using fresh Job Role: ${freshMetadata.jobRole.name}`);
            await createUser.selectJobTitleWithTestData(freshMetadata.jobRole.name);
            await createUser.clickInheritAddress();
            await createUser.typeAddress("Address 1", address1);
            await createUser.typeAddress("Address 2", address2);
            await createUser.select("Country", country);
            await createUser.select("State/Province", state);
            await createUser.select("Time Zone", timezone);
            await createUser.enter("user-city", city);
            await createUser.enter("user-zipcode", zipcode);
            // await createUser.clickVerifyAddressBtn();
            // await createUser.verifyUserAddress();
            await createUser.clickSave();               
            //  await createUser.clickProceed("Proceed");
        }
    });

    test(`Create learner group with same role from user data`, async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC008 - Learner Group Creation with User Role Data` },
            { type: `Test Description`, description: `Create a learner group using the same role data from the user creation test` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        await learnerGroup.clickCreateGroup();
        await learnerGroup.enterGroupTitle(groupTitle);
        await learnerGroup.selectRole(roleName);
        await learnerGroup.selectLearners(userid);
        await learnerGroup.clickActivateToggle();
        await learnerGroup.clickSaveButton();
        await learnerGroup.confirmGroupCreation();
        await learnerGroup.clickProceedButton();
        await learnerGroup.clickGoToListing();
        
        await learnerGroup.searchGroup(groupTitle);
    });

    test(`verify`, async ({ adminHome, learnerGroup, createUser }) => {
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.userSearchField(userid);
        await createUser.clickeditUser();
        await createUser.scrollToAssociatedGroupsAndVerify(groupTitle);
    });
});