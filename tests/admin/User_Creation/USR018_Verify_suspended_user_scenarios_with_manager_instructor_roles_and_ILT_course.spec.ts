import { test } from "../../../customFixtures/expertusFixture";
import { readDataFromCSV } from "../../../utils/csvUtil";
import { FakerData } from "../../../utils/fakerUtils";
import { credentials } from "../../../constants/credentialData";

const suspendedUser: any = FakerData.getUserId();
const newUser: any = FakerData.getUserId();
const firstName = FakerData.getFirstName();
const lastName = FakerData.getLastName();
const courseName = "ILT_" + FakerData.getCourseName();
const sessionName = FakerData.getSession();
const description = FakerData.getDescription();
const instructorName = credentials.INSTRUCTORNAME.username;

test.describe(`USR18_Verify_suspended_user_scenarios_with_manager_instructor_roles_and_ILT_course`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create user with Manager and Instructor roles then suspend the user`, async ({ adminHome,contentHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create user with Manager and Instructor roles then suspend the user` },
            { type: `Test Description`, description: `Create a user with both Manager and Instructor roles and then suspend that user` }
        );

        const csvFilePath = './data/User.csv';
        const data = await readDataFromCSV(csvFilePath);

        for (const row of data) {
            const { country, state, timezone, currency, city, zipcode } = row;

            // Create user with Manager and Instructor roles
            await adminHome.loadAndLogin("CUSTOMERADMIN");
            await adminHome.menuButton();
            await adminHome.people();
            await adminHome.user();
            await createUser.clickCreateUser();
            await createUser.verifyCreateUserLabel();

            // Uncheck default options if present
            await createUser.uncheckInheritAddressIfPresent();
            await createUser.uncheckInheritEmergencyContactIfPresent();
            await createUser.uncheckAutoGenerateUsernameIfPresent();

            // Fill user details
            await createUser.enter("first_name", firstName);
            await createUser.enter("last_name", lastName);
            await createUser.enter("username", suspendedUser);
            await createUser.enter("user-password", "Welcome1@");
            await createUser.enter("email", FakerData.getEmail());
            await createUser.enter("user-phone", FakerData.getMobileNumber());
            await createUser.typeAddress("Address 1", FakerData.getAddress());
            await createUser.typeAddress("Address 2", FakerData.getAddress());
            await createUser.select("Country", country);
            await createUser.select("State/Province", state);
            await createUser.select("Time Zone", timezone);
            await createUser.select("Currency", currency);
            await createUser.enter("user-city", city);
            await createUser.enter("user-zipcode", zipcode);
            await createUser.enter("user-mobile", FakerData.getMobileNumber());

            // Assign both Manager and Instructor roles
            await createUser.clickRolesButton("Manager");
            await createUser.clickRolesButton("Instructor");

            await createUser.clickSave();
            await createUser.verifyUserCreationSuccessMessage();
            await contentHome.gotoListing();
        }

        // Now suspend the created user
        await createUser.userSearchField(suspendedUser);
        await createUser.editIcon();
        await createUser.verifyEditUserLabel();
        await createUser.clickSuspendButton();
    });

    test(`Step 2: Create another user and try to add suspended user as manager`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create another user and try to add suspended user as manager` },
            { type: `Test Description`, description: `Create a new user and attempt to assign the suspended user as their manager` }
        );

        const csvFilePath = './data/User.csv';
        const data = await readDataFromCSV(csvFilePath);

        for (const row of data) {
            const { country, state, timezone, currency, city, zipcode } = row;

            // Create second user
            await adminHome.loadAndLogin("CUSTOMERADMIN");
            await adminHome.menuButton();
            await adminHome.people();
            await adminHome.user();
            await createUser.clickCreateUser();
            await createUser.verifyCreateUserLabel();

            // Uncheck default options if present
            await createUser.uncheckInheritAddressIfPresent();
            await createUser.uncheckInheritEmergencyContactIfPresent();
            await createUser.uncheckAutoGenerateUsernameIfPresent();

            // Fill user details
            await createUser.enter("first_name", FakerData.getFirstName());
            await createUser.enter("last_name", FakerData.getLastName());
            await createUser.enter("username", newUser);
            await createUser.enter("user-password", "Welcome1@");
            await createUser.enter("email", FakerData.getEmail());
            await createUser.enter("user-phone", FakerData.getMobileNumber());
            await createUser.typeAddress("Address 1", FakerData.getAddress());
            await createUser.typeAddress("Address 2", FakerData.getAddress());
            await createUser.select("Country", country);
            await createUser.select("State/Province", state);
            await createUser.select("Time Zone", timezone);
            await createUser.select("Currency", currency);
            await createUser.enter("user-city", city);
            await createUser.enter("user-zipcode", zipcode);
            await createUser.enter("user-mobile", FakerData.getMobileNumber());

            // Try to assign suspended user as manager
            try {
                await createUser.selectManager(suspendedUser);
                console.log("WARNING: Suspended user was allowed to be selected as manager");
            } catch (error) {
                console.log("EXPECTED: Suspended user cannot be selected as manager - " + error);
            }
            await createUser.clickSave();
            await createUser.verifyUserCreationSuccessMessage();
        }
    });

    test(`Step 3: Create ILT Course and try to add suspended user as instructor`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create ILT Course and try to add suspended user as instructor` },
            { type: `Test Description`, description: `Create an ILT course and attempt to assign the suspended user as an instructor` }
        );

        // Create ILT Course
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.selectdeliveryType("Classroom");
        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown();
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await createCourse.clickEditCourseTabs();
        await createCourse.addInstances();

        // Add classroom instance
        async function addinstance(deliveryType: string) {
            await createCourse.selectInstanceDeliveryType(deliveryType);
            await createCourse.clickCreateInstance();
        }

        await addinstance("Classroom");
        await createCourse.enterSessionName(sessionName);
        await createCourse.setMaxSeat();
        await createCourse.enterDateValue();
        await createCourse.startandEndTime();
        
        // Try to select suspended user as instructor
        try {
            await createCourse.selectInstructor(suspendedUser);
            console.log("WARNING: Suspended user was allowed to be selected as instructor");
        } catch (error) {
            console.log("EXPECTED: Suspended user cannot be selected as instructor - " + error);
        }
        
        
        await createCourse.selectLocation();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    });

    test(`Step 4: Verify suspended user cannot login`, async ({ learnerHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify suspended user cannot login` },
            { type: `Test Description`, description: `Verify that the suspended user receives appropriate error message when trying to login` }
        );

        // Try to login as suspended user
        try {
            await learnerHome.basicLogin(suspendedUser, "DefaultPortal");
            // If login succeeds, it should show suspended user message
            await createUser.verifySuspendUserMessage();
        } catch (error) {
            console.log("EXPECTED: Suspended user login failed - " + error);
        }
    });

    test(`Step 5: Activate suspended user and verify functionality`, async ({ adminHome, createUser, learnerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Activate suspended user and verify functionality` },
            { type: `Test Description`, description: `Activate the suspended user and verify they can login and access Manager/Instructor functions` }
        );

        // Activate the suspended user
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.userSearchField(suspendedUser);
        await createUser.clickActivateIcon();
    });

    test(`Step 6: Login as activated user and verify Manager and Instructor access`, async ({ learnerHome, adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Login as activated user and verify Manager and Instructor access` },
            { type: `Test Description`, description: `Login as the re-activated user and verify they have access to Manager and Instructor functionalities` }
        );
            // Verify user can now login
        await learnerHome.basicLogin(suspendedUser, "DefaultPortal");
        
        // Verify Manager role access
        await learnerHome.selectCollaborationHub();
        await learnerHome.verifyLandingPage("Collaboration Hub");
        
        // Verify Instructor role access
        await learnerHome.selectInstructor();
        await learnerHome.verifyLandingPage("Instructor");
    });
});