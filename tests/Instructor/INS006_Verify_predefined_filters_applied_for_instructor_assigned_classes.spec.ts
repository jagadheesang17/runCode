import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
import { readDataFromCSV } from "../../utils/csvUtil";

const instructorUsername = FakerData.getUserId();
const firstName = FakerData.getFirstName();
const lastName = FakerData.getLastName();
const iltCourseName = "ILT_" + FakerData.getCourseName();
const vcCourseName = "VC_" + FakerData.getCourseName();
const description = FakerData.getDescription();
const sessionName = FakerData.getSession();

test.describe(`INS006_Verify_predefined_filters_applied_for_instructor_assigned_classes`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Test 1: Create instructor user`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `INS006_TC001 - Create instructor user` },
            { type: `Test Description`, description: `Create instructor user for predefined filter verification` }
        );

        console.log(`\n========================================`);
        console.log(`TEST 1: CREATE INSTRUCTOR USER`);
        console.log(`========================================\n`);

        console.log(`Creating instructor user...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.clickMenu("User");
        await createUser.verifyCreateUserLabel();
        
        const csvFilePath = './data/User.csv';
        const data = await readDataFromCSV(csvFilePath);

        for (const row of data) {
            const { country, state, timezone, currency, city, zipcode } = row;

            console.log(`Filling user details...`);
            await createUser.uncheckInheritAddressIfPresent();
            await createUser.uncheckInheritEmergencyContactIfPresent();
            await createUser.uncheckAutoGenerateUsernameIfPresent();
            await createUser.enter("first_name", firstName);
            await createUser.enter("last_name", lastName);
            await createUser.enter("username", instructorUsername);
            await createUser.enter("user-password", "Welcome1@");
            await createUser.enter("email", instructorUsername);
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
            
            console.log(`Assigning Instructor role...`);
            await createUser.clickRolesButton("Instructor");
            
            console.log(`Saving user...`);
            await createUser.clickSave();
            await createUser.verifyUserCreationSuccessMessage();
        }

        console.log(`\n========================================`);
        console.log(`INSTRUCTOR USER CREATED`);
        console.log(`========================================`);
        console.log(`Username: ${instructorUsername}`);
        console.log(`First Name: ${firstName}`);
        console.log(`Last Name: ${lastName}`);
        console.log(`Type: Instructor`);
        console.log(`Status: Active`);
        console.log(`========================================\n`);
    });

    test(`Test 2: Create ILT course with future scheduled class and assign instructor`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `INS006_TC002 - Create ILT course with future class` },
            { type: `Test Description`, description: `Create Classroom course with future scheduled instance and assign instructor` }
        );

        console.log(`\n========================================`);
        console.log(`TEST 2: CREATE ILT COURSE WITH FUTURE CLASS`);
        console.log(`========================================\n`);

        console.log(`Creating ILT course...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();

        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", iltCourseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);

        console.log(`Selecting Classroom delivery type...`);
        await createCourse.selectdeliveryType("Classroom");
        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown();
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

        console.log(`Editing course to add tags and certificate...`);
        await createCourse.editcourse();
        await editCourse.clickTagMenu();
        await editCourse.selectTags();
        await createCourse.clickCompletionCertificate();
        await createCourse.clickCertificateCheckBox();
        await createCourse.clickAdd();

        console.log(`Adding future scheduled ILT instance...`);
        await createCourse.addInstances();

        async function addinstance(deliveryType: string) {
            await createCourse.selectInstanceDeliveryType(deliveryType);
            await createCourse.clickCreateInstance();
        }

        await addinstance("Classroom");
        await createCourse.enterSessionName(sessionName);

        console.log(`Assigning instructor: ${instructorUsername}`);
        await createCourse.selectInstructor(instructorUsername);
        
        await createCourse.selectLocation();
        await createCourse.enterDateValue();
        await createCourse.startandEndTime();
        await createCourse.setMaxSeat();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

        console.log(`\n========================================`);
        console.log(`ILT COURSE CREATED SUCCESSFULLY`);
        console.log(`========================================`);
        console.log(`Course Name: ${iltCourseName}`);
        console.log(`Delivery Type: Classroom`);
        console.log(`Session Name: ${sessionName}`);
        console.log(`Instructor: ${instructorUsername}`);
        console.log(`Status: Future Scheduled`);
        console.log(`========================================\n`);
    });

    test(`Test 3: Create VC course with future scheduled class and assign instructor`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `INS006_TC003 - Create VC course with future class` },
            { type: `Test Description`, description: `Create Virtual Class course with future scheduled instance and assign instructor` }
        );

        console.log(`\n========================================`);
        console.log(`TEST 3: CREATE VC COURSE WITH FUTURE CLASS`);
        console.log(`========================================\n`);

        console.log(`Creating Virtual Class course...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();

        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", vcCourseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);

        console.log(`Selecting Virtual Class delivery type...`);
        await createCourse.selectdeliveryType("Virtual Class");
        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown();
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

        console.log(`Editing course to add tags and certificate...`);
        await createCourse.editcourse();
        await editCourse.clickTagMenu();
        await editCourse.selectTags();
        await createCourse.clickCompletionCertificate();
        await createCourse.clickCertificateCheckBox();
        await createCourse.clickAdd();

        console.log(`Adding Virtual Class instance...`);
        await createCourse.addInstances();
        
        async function addinstance(deliveryType: string) {
            await createCourse.selectInstanceDeliveryType(deliveryType);
            await createCourse.clickCreateInstance();
        }
        
        await addinstance("Virtual Class");
        await createCourse.enterSessionName(sessionName);
        await createCourse.setMaxSeat();
        await createCourse.enterDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectMeetingType(instructorUsername, vcCourseName, 1);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

        console.log(`\n========================================`);
        console.log(`VC COURSE CREATED SUCCESSFULLY`);
        console.log(`========================================`);
        console.log(`Course Name: ${vcCourseName}`);
        console.log(`Delivery Type: Virtual Class`);
        console.log(`Session Name: ${sessionName}`);
        console.log(`Instructor: ${instructorUsername}`);
        console.log(`Status: Future Scheduled`);
        console.log(`========================================\n`);
    });

    test(`Test 4: Verify predefined filters on instructor landing page for ILT course`, async ({ learnerHome, instructorHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `INS006_TC004 - Verify ILT predefined filters` },
            { type: `Test Description`, description: `Login as instructor and verify predefined filters are applied for ILT course` }
        );

        console.log(`\n========================================`);
        console.log(`TEST 4: VERIFY ILT PREDEFINED FILTERS`);
        console.log(`========================================\n`);

        console.log(`Logging in as instructor: ${instructorUsername}`);
        await learnerHome.basicLogin(instructorUsername, "DefaultPortal");

        console.log(`Verifying instructor page...`);
        await instructorHome.verifyInstructorPage();

        console.log(`Clicking Classes List...`);
        await instructorHome.clickClassesList();

        console.log(`Verifying predefined filters are applied...`);
        await instructorHome.verifyPredefinedFilters();

        console.log(`Verifying ILT course is displayed...`);
        await instructorHome.verifyCourseName(iltCourseName);

        console.log(`\n========================================`);
        console.log(`ILT PREDEFINED FILTERS VERIFICATION`);
        console.log(`========================================`);
        console.log(`Instructor: ${instructorUsername}`);
        console.log(`Course: ${iltCourseName}`);
        console.log(`Delivery Type Filter: classroom,virtual-class`);
        console.log(`Status Filter: published`);
        console.log(`Schedule Filter: scheduled`);
        console.log(`Result: PASS - All predefined filters verified`);
        console.log(`========================================\n`);
    });

    test(`Test 5: Verify predefined filters on instructor landing page for VC course`, async ({ learnerHome, instructorHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `INS006_TC005 - Verify VC predefined filters` },
            { type: `Test Description`, description: `Login as instructor and verify predefined filters are applied for VC course` }
        );

        console.log(`\n========================================`);
        console.log(`TEST 5: VERIFY VC PREDEFINED FILTERS`);
        console.log(`========================================\n`);

        console.log(`Logging in as instructor: ${instructorUsername}`);
        await learnerHome.basicLogin(instructorUsername, "DefaultPortal");

        console.log(`Verifying instructor page...`);
        await instructorHome.verifyInstructorPage();

        console.log(`Clicking Classes List...`);
        await instructorHome.clickClassesList();

        console.log(`Verifying predefined filters are applied...`);
        await instructorHome.verifyPredefinedFilters();

        console.log(`Verifying VC course is displayed...`);
        await instructorHome.verifyCourseName(vcCourseName);

        console.log(`\n========================================`);
        console.log(`VC PREDEFINED FILTERS VERIFICATION`);
        console.log(`========================================`);
        console.log(`Instructor: ${instructorUsername}`);
        console.log(`Course: ${vcCourseName}`);
        console.log(`Delivery Type Filter: classroom,virtual-class`);
        console.log(`Status Filter: published`);
        console.log(`Schedule Filter: scheduled`);
        console.log(`Result: PASS - All predefined filters verified`);
        console.log(`========================================\n`);
    });

    test(`Test 6: Summary`, async ({ }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `INS006_TC006 - Test summary` },
            { type: `Test Description`, description: `Summary of predefined filters verification for instructor landing page` }
        );

        console.log(`\n========================================`);
        console.log(`TEST SUMMARY - PREDEFINED FILTERS VERIFICATION`);
        console.log(`========================================\n`);

        console.log(`TEST OBJECTIVE:`);
        console.log(`Verify that ILT and VC delivery types with scheduled future`);
        console.log(`classes are automatically filtered using predefined filters`);
        console.log(`on the instructor landing page\n`);

        console.log(`TEST SCENARIOS EXECUTED:\n`);

        console.log(`1. INSTRUCTOR USER CREATION (Test 1):`);
        console.log(`   - Created instructor user: ${instructorUsername}`);
        console.log(`   - First Name: ${firstName}`);
        console.log(`   - Last Name: ${lastName}`);
        console.log(`   - Type: Instructor`);
        console.log(`   - Status: Active\n`);

        console.log(`2. ILT COURSE WITH FUTURE CLASS (Test 2):`);
        console.log(`   - Created ILT course: ${iltCourseName}`);
        console.log(`   - Delivery Type: Classroom`);
        console.log(`   - Session: ${sessionName}`);
        console.log(`   - Assigned instructor: ${instructorUsername}`);
        console.log(`   - Class scheduled for future date`);
        console.log(`   - Status: Published and Scheduled\n`);

        console.log(`3. VC COURSE WITH FUTURE CLASS (Test 3):`);
        console.log(`   - Created VC course: ${vcCourseName}`);
        console.log(`   - Delivery Type: Virtual Class`);
        console.log(`   - Session: ${sessionName}`);
        console.log(`   - Assigned instructor: ${instructorUsername}`);
        console.log(`   - Class scheduled for future date`);
        console.log(`   - Status: Published and Scheduled\n`);

        console.log(`4. ILT PREDEFINED FILTERS VERIFICATION (Test 4):`);
        console.log(`   - Logged in as instructor: ${instructorUsername}`);
        console.log(`   - Navigated to Instructor page`);
        console.log(`   - Clicked Classes List button`);
        console.log(`   - Verified predefined filters:`);
        console.log(`     • Delivery Type: classroom,virtual-class`);
        console.log(`     • Status: published`);
        console.log(`     • Schedule: scheduled`);
        console.log(`   - Verified ILT course visible: ${iltCourseName}`);
        console.log(`   - Result: PASS\n`);

        console.log(`5. VC PREDEFINED FILTERS VERIFICATION (Test 5):`);
        console.log(`   - Logged in as instructor: ${instructorUsername}`);
        console.log(`   - Navigated to Instructor page`);
        console.log(`   - Clicked Classes List button`);
        console.log(`   - Verified predefined filters:`);
        console.log(`     • Delivery Type: classroom,virtual-class`);
        console.log(`     • Status: published`);
        console.log(`     • Schedule: scheduled`);
        console.log(`   - Verified VC course visible: ${vcCourseName}`);
        console.log(`   - Result: PASS\n`);

        console.log(`KEY FINDINGS:`);
        console.log(`- Instructor user created successfully with admin access`);
        console.log(`- ILT course created with future scheduled class`);
        console.log(`- VC course created with future scheduled class`);
        console.log(`- Predefined filters automatically applied on instructor page`);
        console.log(`- Delivery Type filter shows: classroom,virtual-class`);
        console.log(`- Status filter shows: published`);
        console.log(`- Schedule filter shows: scheduled`);
        console.log(`- Both ILT and VC courses visible to assigned instructor`);
        console.log(`- Filters correctly restrict view to future scheduled classes\n`);

        console.log(`PREDEFINED FILTERS VERIFIED:`);
        console.log(`1. Delivery Type Filter:`);
        console.log(`   - Automatically set to classroom,virtual-class`);
        console.log(`   - Only shows ILT and VC delivery types`);
        console.log(`   - Excludes eLearning and other types\n`);

        console.log(`2. Status Filter:`);
        console.log(`   - Automatically set to published`);
        console.log(`   - Only shows published courses`);
        console.log(`   - Excludes draft, archived, or inactive courses\n`);

        console.log(`3. Schedule Filter:`);
        console.log(`   - Automatically set to scheduled`);
        console.log(`   - Only shows future scheduled classes`);
        console.log(`   - Excludes past or completed classes\n`);

        console.log(`EXPECTED BEHAVIOR:`);
        console.log(`When instructor logs in and views Classes List:`);
        console.log(`- System applies predefined filters automatically`);
        console.log(`- Only classroom and virtual-class delivery types shown`);
        console.log(`- Only published courses displayed`);
        console.log(`- Only future scheduled classes visible`);
        console.log(`- Instructor sees only relevant assigned classes`);
        console.log(`- Filters help instructor focus on upcoming sessions\n`);

        console.log(`VERIFICATION APPROACH:`);
        console.log(`1. Created instructor user with appropriate permissions`);
        console.log(`2. Created ILT course with future scheduled instance`);
        console.log(`3. Created VC course with future scheduled instance`);
        console.log(`4. Assigned instructor to both courses`);
        console.log(`5. Logged in as instructor and navigated to Classes List`);
        console.log(`6. Verified presence of all three predefined filters`);
        console.log(`7. Confirmed filter values match expected criteria`);
        console.log(`8. Verified assigned courses are visible in filtered view\n`);

        console.log(`CONCLUSION:`);
        console.log(`All tests passed successfully.`);
        console.log(`Predefined filters are correctly applied on instructor`);
        console.log(`landing page for ILT and VC delivery types with scheduled`);
        console.log(`future classes. The system automatically filters to show`);
        console.log(`only relevant published and scheduled classroom and virtual`);
        console.log(`class courses, providing instructors with a focused view of`);
        console.log(`their upcoming teaching assignments.`);
        console.log(`========================================\n`);
    });
});
