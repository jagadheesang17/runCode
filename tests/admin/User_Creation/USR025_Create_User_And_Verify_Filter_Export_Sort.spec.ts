import { test } from "../../../customFixtures/expertusFixture";
import { readDataFromCSV } from "../../../utils/csvUtil";
import { FakerData } from '../../../utils/fakerUtils';
import { FilterUtils } from "../../../utils/filterUtils";

const firstName = FakerData.getFirstName();
const lastName = FakerData.getLastName();
const testUserName = FakerData.getUserId();
const email = FakerData.getEmail();
const phoneNumber = FakerData.getMobileNumber();
const roles = "Manager";

let userType: string;
let jobRole: string;
let department: string;
let country: string;
let stateProvince: string;

test.describe.configure({ mode: 'serial' });

test(`Create user with manager role and verify filter, export, and sort functionality`, async ({ adminHome, createUser, exportPage, page, context, contentHome }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Create user with manager role and verify filters, export, and sort` },
        { type: `Test Description`, description: `Create user with user type, job role, department, roles, country, state/province and verify filter, export, and sort functionality` }
    );

    const csvFilePath = './data/User.csv';
    const data = await readDataFromCSV(csvFilePath);

    await adminHome.loadAndLogin("CUSTOMERADMIN");
    await adminHome.menuButton();
    await adminHome.people();
    await adminHome.user();
    
    await createUser.clickCreateUser();
    await createUser.uncheckInheritAddressIfPresent();
   await createUser.uncheckInheritEmergencyContactIfPresent();
    await createUser.uncheckAutoGenerateUsernameIfPresent();

    for (const row of data) {
        const { country: csvCountry, state: csvState, timezone, currency, city, zipcode } = row;
        country = csvCountry;
        stateProvince = csvState;

        await createUser.enter("first_name", firstName);
        await createUser.enter("last_name", lastName);
        await createUser.enter("username", testUserName);
        await createUser.enter("user-password", "Welcome1@");
        await createUser.enter("email", email);
        await createUser.enter("user-phone", phoneNumber);
        await createUser.typeAddress("Address 1", FakerData.getAddress());
        await createUser.typeAddress("Address 2", FakerData.getAddress());
        await createUser.select("Country", country);
        await createUser.select("State/Province", stateProvince);
        await createUser.select("Time Zone", timezone);
        await createUser.enter("user-city", city);
        await createUser.enter("user-zipcode", zipcode);
        await createUser.enter("user-mobile", FakerData.getMobileNumber());
        await createUser.select("Currency", currency);
    }
    
    // Select and capture User Type
    userType = await createUser.selectUserType("usertype");
    console.log(`📌 User Type selected: ${userType}`);
    
    // Select and capture Department
    department = await createUser.selectDepartmentType("department");
    console.log(`📌 Department selected: ${department}`);
    
    // Select Roles
    await createUser.clickRolesButton(roles);
    console.log(`✅ Roles selected: ${roles}`);
    
    // Select and capture Job Role
    jobRole = await createUser.selectJobRole();
    console.log(`📌 Job Role selected: ${jobRole}`);
    
    await createUser.clickSave();
    await createUser.verifyUserCreationSuccessMessage();
    console.log(`✅ User created: ${testUserName}`);

    // Navigate back to user listing
    await contentHome.gotoListing();

    // Test Export functionality
    console.log(`📤 Testing Export as Excel functionality`);
    await exportPage.clickExportAs("Excel");
    console.log(`✅ Export as Excel completed successfully`);
    
    // Test Sort functionality
    console.log(`🔄 Testing all sort options`);
    const filterUtils = new FilterUtils(page, context);
    await filterUtils.verifyAllSortOptions();
    console.log(`✅ All sort options verified successfully`);
    
    // Apply filters using the new method
    console.log(`🔍 Applying filters for user search`);
    await createUser.applyUserFilters({
        userType: userType,
        jobRole: jobRole,
        department: department,
        roles: roles,
        status: "Active"
    });
    
    // Verify user is in filtered results
    await createUser.userSearchField(testUserName);
    await createUser.wait("minWait");
    console.log(`✅ User ${testUserName} found in filtered results`);
    
 
});
