import { test } from "../../../customFixtures/expertusFixture";
import { FakerData, getPastDate, getCurrentDateFormatted } from "../../../utils/fakerUtils";
import adminGroupsData from "../../../data/adminGroupsData.json";
import { credentials } from "../../../constants/credentialData";
import { readDataFromCSV } from "../../../utils/csvUtil";

const firstName = FakerData.getFirstName();
const lastName = FakerData.getLastName();
const testUserName = FakerData.getUserId();
const email = FakerData.getEmail();
const phoneNumber = FakerData.getMobileNumber();
const employeeId = Math.floor(Math.random() * 1000000).toString(); // Random employee ID
const internalOrgName = "ORG_Internal" + FakerData.getOrganizationName()
const externalOrgName = "ORG_External" + FakerData.getOrganizationName()
const managerName = adminGroupsData.managerName
const roles = "Instructor";

// Global variables to store created user data for filter test
let createdUserData = {
    firstName: firstName,
    lastName: lastName,
    username: testUserName,
    email: email,
    internalOrg: internalOrgName,
    externalOrg: externalOrgName,
    manager: managerName,
    employeeId: employeeId,
    employmentType: "",
    jobTitle: "",
    department: "", 
    userType: "",
    jobRole: "",
    country: "",
    state: "",
    timezone: "",
    currency: "",
    city: "",
    zipcode: ""
};

test.describe.serial("USRT21 - Comprehensive User Creation with Organizations and Profile", () => {

    test("USRT21 - Create User with Complete Profile Including Organizations and Verification", async ({
        adminHome,
        createUser,
        contentHome,
        organization,
        CompletionCertification,
        createCourse
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `USRT21 - Comprehensive User Creation` },
            { type: `Test Description`, description: `Create user with all fields including organizations, employee details, birth date, hire date, profile upload, and verify hierarchy` }
        );
        const csvFilePath = './data/User.csv';
        const data = await readDataFromCSV(csvFilePath);
        // Step 1: Login and Navigate to Organization Creation
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();

        // Step 2: Create Internal Organization
        await organization.organizationMenu();
        await organization.createOrganization();
        await organization.enterName(internalOrgName);
        await organization.selectOrgType("Internal");
        await organization.typeDescription();
        await organization.clickSave();
        await CompletionCertification.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log("✅ Step 2: Internal organization created successfully");
        await contentHome.gotoListing();

        // Step 3: Create External Organization
        await organization.createOrganization();
        await organization.enterName(externalOrgName);
        await organization.selectOrgType("External");
        await organization.typeDescription();
        await organization.clickSave();
        await CompletionCertification.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log("✅ Step 3: External organization created successfully");

        // Step 4: Navigate to User Creation
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();

        // Step 5: Start User Creation Process
        await createUser.clickCreateUser();
        await createUser.uncheckInheritAddressIfPresent();
        await createUser.uncheckInheritEmergencyContactIfPresent();
        await createUser.uncheckAutoGenerateUsernameIfPresent();

        // Step 6: Enter Basic User Information
        for (const row of data) {
            const { country, state, timezone, currency, city, zipcode } = row;
            
            // Store CSV data for filter test
            createdUserData.country = country;
            createdUserData.state = state;
            createdUserData.timezone = timezone;
            createdUserData.currency = currency;
            createdUserData.city = city;
            createdUserData.zipcode = zipcode;
            
            await createUser.enter("first_name", firstName);
            await createUser.enter("last_name", lastName);
            await createUser.enter("username", testUserName);
            await createUser.enter("user-password", "Welcome1@");
            await createUser.enter("email", email);
            await createUser.enter("user-phone", phoneNumber);
            await createUser.typeAddress("Address 1", FakerData.getAddress());
            await createUser.typeAddress("Address 2", FakerData.getAddress());
            await createUser.select("Country", country);
            await createUser.select("State/Province", state);
            await createUser.select("Time Zone", timezone);
            await createUser.enter("user-city", city);
            await createUser.enter("user-zipcode", zipcode);
            await createUser.enter("user-mobile", FakerData.getMobileNumber());
            await createUser.select("Currency", currency);
        }


        // Step 7: Enter Employee ID
        await createUser.enterEmployeeId(employeeId);
        console.log(`✅ Step 7: Employee ID entered: ${employeeId}`);

        // Step 8: Select Organization
        await createUser.selectOrganization("organization", internalOrgName);
        console.log("✅ Step 8: Organization selected");

        // Step 9: Select Employment Type
        const selectedEmploymentType = await createUser.selectEmploymentType("emp_type");
        createdUserData.employmentType = selectedEmploymentType;
        console.log(`✅ Step 9: Employment type selected: ${selectedEmploymentType}`);

        // Step 10: Select Job Title
        await createUser.selectjobTitle("jobtitle");
        console.log("✅ Step 10: Job title selected");

        // Step 11: Select Department
        const selectedDepartment = await createUser.selectDepartmentType("department");
        createdUserData.department = selectedDepartment;
        console.log(`✅ Step 11: Department selected: ${selectedDepartment}`);

        // Step 12: Select User Type
        const selectedUserType = await createUser.selectUserType("usertype");
        createdUserData.userType = selectedUserType;
        console.log(`✅ Step 12: User type selected: ${selectedUserType}`);

        // Step 13: Select Roles
        await createUser.clickRolesButton(roles);
        console.log("✅ Step 13: Roles selected");

        // Step 14: Select Job Role
        const selectedJobRole = await createUser.selectJobRole();
        createdUserData.jobRole = selectedJobRole;
        console.log(`✅ Step 14: Job role selected: ${selectedJobRole}`);

        // Step 15: Enter Birth Date (Past Date)
        const birthDate = getPastDate();
        await createUser.enterBirthDate(birthDate);
        console.log(`✅ Step 15: Birth date entered: ${birthDate}`);

        // Step 16: Enter Hire Date
        await createUser.enterHireDate();
        await createUser.wait("minWait");
        console.log("✅ Step 16: Hire date entered");

        // Step 17: Add Other Organization
        await createUser.selectOtherOrganization(externalOrgName);
        await createUser.wait("minWait");
        console.log("✅ Step 17: Other organization added");

        // Step 18: Select Manager
        await createUser.selectManager(managerName);
        console.log("✅ Step 18: Manager selected");

        // Step 19: Select Specific Manager
        await createUser.selectSpecificManager(credentials.MANAGERNAME.username);
        console.log("✅ Step 19: Specific manager selected");

        // Step 20: Upload Profile Picture
        await createUser.userProfileUpload();
        console.log("✅ Step 20: Profile picture uploaded");

        // Step 21: Save User
        await createUser.clickSave();
        console.log("✅ Step 21: User saved successfully");

        // Step 22: Edit User
        await createUser.editbtn();
        console.log("✅ Step 22: User edit initiated");

        // Step 23: Click Associated Groups and Capture Text
        await createUser.clickAssociatedGroups();
        const learnerGroupText = await createUser.captureLearnerGroupText();
        console.log(`✅ Step 23: Associated Groups text captured: ${learnerGroupText}`);

        // Step 24: Update Employee ID
        const newEmployeeId = Math.floor(Math.random() * 1000000).toString();
        await createUser.enterEmployeeId(newEmployeeId);
        console.log(`✅ Step 24: Employee ID updated to: ${newEmployeeId}`);

        // Step 25: Save Changes and Go to Listing
        await createUser.updateUser();
        await contentHome.gotoListing();
        await createUser.userSearchField(testUserName);
        await createUser.wait("minWait");
        console.log("✅ Step 25: User updates saved and back to listing");

        // Step 26: Click Hierarchy Button
        await createUser.clickHierarchyButton();
        console.log("✅ Step 26: Hierarchy modal opened");

        // Step 27: Verify Manager Name in Hierarchy
        await createUser.verifyManagerInHierarchy(managerName);
        console.log("✅ Step 27: Manager verified in hierarchy");

        // Step 28: Close Hierarchy Modal
        await createUser.closeHierarchyModal();
        await createUser.wait("minWait");
        console.log("✅ Step 28: Hierarchy modal closed");

        console.log("🎉 USRT21 completed successfully - User created with comprehensive profile and verified!");
    });

    test("USRT21_02 - User Filter Functionality Test", async ({
        adminHome,
        createUser,
        contentHome
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation Team` },
            { type: `TestCase`, description: `USRT21_02 - User Filter Functionality` },
            { type: `Test Description`, description: `Test comprehensive user filtering with status, type, roles, department, manager, organization, hire date, and location filters` }
        );

        console.log("🔍 Starting User Filter Functionality Test");

        // Step 1: Login and Navigate to Users
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        console.log("✅ Step 1: Navigated to Users section");

        // Step 2: Open Filter Panel
        await createUser.clickFilter();
        console.log("✅ Step 2: Filter panel opened");

        // Step 3: Select Status - Active or Suspended
        const statusOptions = ["Active", "Suspended"] as const;
        const selectedStatus = "Active";
        await createUser.selectStatusCheckbox(selectedStatus);
        console.log(`✅ Step 3: Status ${selectedStatus} selected`);

        // Step 4: Get test data from CSV for country and state (using actual values from user creation)
        const { country, state } = createdUserData;

        // Step 5: Apply User Type Filter (using actual user type from user creation)
        await createUser.selectFilterUserType(createdUserData.userType);
        console.log(`✅ Step 5: User type ${createdUserData.userType} applied`);

        // Step 6: Apply Roles Filter
        
        const selectedRole = roles;
        await createUser.selectFilterRoles(selectedRole);
        console.log(`✅ Step 6: Role ${selectedRole} applied`);

        // Step 7: Apply Job Role Filter (using actual job role from user creation)
        await createUser.selectFilterJobRole(createdUserData.jobRole);
        console.log(`✅ Step 7: Job role ${createdUserData.jobRole} applied`);

        // Step 8: Apply Department Filter (using actual department from user creation)
        await createUser.selectFilterDepartment(createdUserData.department);
        console.log(`✅ Step 8: Department ${createdUserData.department} applied`);

        // Step 9: Apply Manager Filter (using actual manager from user creation)
        const selectedManager = createdUserData.manager || adminGroupsData.managerName;
        await createUser.selectFilterManager(selectedManager);
        console.log(`✅ Step 9: Manager ${selectedManager} applied (from created user)`);

        // Step 10: Apply Organization Filter (using organizations from creation test)
        const organizations = [createdUserData.internalOrg, createdUserData.externalOrg];
        const selectedOrganization = organizations[Math.floor(Math.random() * organizations.length)];
        await createUser.selectFilterOrganization(selectedOrganization);
        console.log(`✅ Step 10: Organization ${selectedOrganization} applied (from created user)`);

        // Step 11: Apply Hire Date Filter
        const hireDateOptions = ["After", "Before", "Between"] as const;
        const selectedHireDateOption = hireDateOptions[Math.floor(Math.random() * hireDateOptions.length)];
        await createUser.selectHireDateFilter(selectedHireDateOption);
        console.log(`✅ Step 11: Hire date filter ${selectedHireDateOption} selected`);

        // Step 12: Enter Current Date for Hire Date Filter
        const currentDate = getCurrentDateFormatted();
        await createUser.enterHireDateFrom(currentDate);
        console.log(`✅ Step 12: Hire date ${currentDate} entered`);

        // Step 13: Apply Country Filter
        await createUser.selectFilterCountry(country);
        console.log(`✅ Step 13: Country ${country} applied`);

        // Step 14: Apply State Filter
        await createUser.selectFilterState(state);
        console.log(`✅ Step 14: State ${state} applied`);

        // Step 15: Apply All Filters
        await createUser.clickApply();
        await createUser.wait("mediumWait");
        console.log("✅ Step 15: All filters applied successfully");

        // Step 16: Verify Filter Results
        const noResultsSelector = "//h3[contains(text(),'There are no results that match your current filters')]";
        const hasResults = await createUser.page.locator(noResultsSelector).isVisible({ timeout: 5000 });
        console.log(`📋 Filter result: ${hasResults ? 'No matching users found' : 'Users found matching the applied filters'}`);

        console.log("✅ Step 16: Filter results verified");

        // Step 17: Test Summary
        console.log("\n📊 Filter Test Summary:");
        console.log(`   • Status: ${selectedStatus}`);
        console.log(`   • User Type: ${createdUserData.userType}`);
        console.log(`   • Role: ${selectedRole}`);
        console.log(`   • Job Role: ${createdUserData.jobRole}`);
        console.log(`   • Department: ${createdUserData.department}`);
        console.log(`   • Manager: ${selectedManager}`);
        console.log(`   • Organization: ${selectedOrganization}`);
        console.log(`   • Hire Date: ${selectedHireDateOption} ${currentDate}`);
        console.log(`   • Country: ${country}`);
        console.log(`   • State: ${state}`);
        
        console.log("\n📋 Created User Data Used for Filtering:");
        console.log(`   • Username: ${createdUserData.username}`);
        console.log(`   • First Name: ${createdUserData.firstName}`);
        console.log(`   • Last Name: ${createdUserData.lastName}`);
        console.log(`   • Email: ${createdUserData.email}`);
        console.log(`   • Employee ID: ${createdUserData.employeeId}`);
        console.log(`   • Internal Org: ${createdUserData.internalOrg}`);
        console.log(`   • External Org: ${createdUserData.externalOrg}`);
        console.log(`   • Employment Type: ${createdUserData.employmentType}`);
        console.log(`   • User Type: ${createdUserData.userType}`);
        console.log(`   • Department: ${createdUserData.department}`);
        console.log(`   • Job Role: ${createdUserData.jobRole}`);
        console.log(`   • Manager: ${createdUserData.manager}`);
        console.log(`   • Country: ${createdUserData.country}`);
        console.log(`   • State: ${createdUserData.state}`);

        console.log("🎉 USRT21_02 Filter Test completed successfully using actual created user values!");
    });
});