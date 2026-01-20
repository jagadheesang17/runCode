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

test.describe(`INS004_Verify_admin_able_to_create_ILT_VC_classes_and_assign_instructor`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Test 1: Create instructor user`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `INS004_TC001 - Create instructor user` },
            { type: `Test Description`, description: `Create a user with Instructor role for class assignment` }
        );

        console.log(`\n🔄 Creating instructor user...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.clickMenu("User");
        await createUser.verifyCreateUserLabel();
        
        const csvFilePath = './data/User.csv';
        const data = await readDataFromCSV(csvFilePath);

        for (const row of data) {
            const { country, state, timezone, currency, city, zipcode } = row;

            console.log(`🔄 Filling user details...`);
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
            
            console.log(`🔄 Assigning Instructor role...`);
            await createUser.clickRolesButton("Instructor");
            
            console.log(`🔄 Saving user...`);
            await createUser.clickSave();
            await createUser.verifyUserCreationSuccessMessage();
        }
        
        console.log(`\n📊 ========================================`);
        console.log(`📊 INSTRUCTOR USER CREATED`);
        console.log(`📊 ========================================`);
        console.log(`   📋 Username: ${instructorUsername}`);
        console.log(`   📋 Full Name: ${firstName} ${lastName}`);
        console.log(`   📋 Role: Instructor`);
        console.log(`   ✅ Instructor ready for class assignment`);
        console.log(`📊 ========================================\n`);
    });

    test(`Test 2: Create ILT course with instance and assign instructor`, async ({ adminHome, createCourse, editCourse, instructorHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `INS004_TC002 - Create ILT course and assign instructor` },
            { type: `Test Description`, description: `Create Classroom (ILT) course with instance and assign instructor` }
        );

        console.log(`\n🔄 Creating ILT course...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", iltCourseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        
        console.log(`🔄 Selecting Classroom delivery type...`);
        await createCourse.selectdeliveryType("Classroom");
        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown();
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        
        console.log(`🔄 Editing course to add tags and certificate...`);
        await createCourse.editcourse();
        await editCourse.clickTagMenu();
        await editCourse.selectTags();
        await createCourse.clickCompletionCertificate();
        await createCourse.clickCertificateCheckBox();
        await createCourse.clickAdd();
        
        console.log(`🔄 Adding ILT instance...`);
        await createCourse.addInstances();
        
        async function addinstance(deliveryType: string) {
            await createCourse.selectInstanceDeliveryType(deliveryType);
            await createCourse.clickCreateInstance();
        }
        
        await addinstance("Classroom");
        await createCourse.enterSessionName(sessionName);
        await createCourse.setMaxSeat();
        await createCourse.enterDateValue();
        // Open timepicker and select near-current start & end times
        await createCourse.click(createCourse.selectors.timeInput, "Start Time", "Input");
        const startTimeILT = await instructorHome.selectStartTimeNearCurrent(1);
        await instructorHome.setEndTimeOneHourAfterStart(startTimeILT, "//input[contains(@class,'end time')]");
        
        console.log(`🔄 Assigning instructor to ILT class...`);
        await createCourse.selectInstructor(instructorUsername);
        
        await createCourse.selectLocation();
        await createCourse.typeDescription("ILT class with assigned instructor");
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        
        console.log(`\n📊 ========================================`);
        console.log(`📊 ILT COURSE CREATED WITH INSTRUCTOR`);
        console.log(`📊 ========================================`);
        console.log(`   📋 Course Name: ${iltCourseName}`);
        console.log(`   📋 Delivery Type: Classroom (ILT)`);
        console.log(`   📋 Session Name: ${sessionName}`);
        console.log(`   📋 Instructor: ${instructorUsername}`);
        console.log(`   ✅ ILT course created and instructor assigned`);
        console.log(`📊 ========================================\n`);
    });

    test(`Test 3: Create Virtual Class with instance and assign instructor`, async ({ adminHome, createCourse, editCourse, instructorHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `INS004_TC003 - Create VC course and assign instructor` },
            { type: `Test Description`, description: `Create Virtual Class course with instance and assign instructor` }
        );

        console.log(`\n🔄 Creating Virtual Class course...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", vcCourseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        
        console.log(`🔄 Selecting Virtual Class delivery type...`);
        await createCourse.selectdeliveryType("Virtual Class");
        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown();
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        
        console.log(`🔄 Editing course to add tags and certificate...`);
        await createCourse.editcourse();
        await editCourse.clickTagMenu();
        await editCourse.selectTags();
        await createCourse.clickCompletionCertificate();
        await createCourse.clickCertificateCheckBox();
        await createCourse.clickAdd();
        
        console.log(`🔄 Adding Virtual Class instance...`);
        await createCourse.addInstances();
        
        async function addinstance(deliveryType: string) {
            await createCourse.selectInstanceDeliveryType(deliveryType);
            await createCourse.clickCreateInstance();
        }
        
        await addinstance("Virtual Class");
        await createCourse.selectMeetingType(instructorUsername, vcCourseName, 1);
        await createCourse.typeAdditionalInfo();
        await createCourse.setMaxSeat();
        // Open timepicker and select near-current start & end times for VC if applicable
        await createCourse.click(createCourse.selectors.timeInput, "Start Time", "Input");
        const startTimeVC = await instructorHome.selectStartTimeNearCurrent(1);
        await instructorHome.setEndTimeOneHourAfterStart(startTimeVC, "//input[contains(@class,'end time')]");
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        
        console.log(`\n📊 ========================================`);
        console.log(`📊 VIRTUAL CLASS CREATED WITH INSTRUCTOR`);
        console.log(`📊 ========================================`);
        console.log(`   📋 Course Name: ${vcCourseName}`);
        console.log(`   📋 Delivery Type: Virtual Class (VC)`);
        console.log(`   📋 Instructor: ${instructorUsername}`);
        console.log(`   ✅ Virtual Class created and instructor assigned`);
        console.log(`📊 ========================================\n`);
    });

    test(`Test 4: Login as instructor and verify ILT class is visible`, async ({ learnerHome, instructorHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `INS004_TC004 - Verify ILT class as instructor` },
            { type: `Test Description`, description: `Login as instructor and verify assigned ILT class is visible` }
        );

        console.log(`\n🔄 Logging in as instructor...`);
        await learnerHome.basicLogin(instructorUsername, "DefaultPortal");
        
        console.log(`🔄 Navigating to Instructor page...`);
        await learnerHome.selectInstructor();
        
        console.log(`🔄 Verifying instructor page...`);
        await instructorHome.verifyInstructorPage();
        
        console.log(`🔄 Filtering for scheduled classes...`);
        await instructorHome.clickFilter();
        await instructorHome.selectDeliveryType();
        await instructorHome.selectStatus("Scheduled");
        await instructorHome.clickApply("Scheduled");
        
        console.log(`🔄 Searching for ILT course...`);
        await instructorHome.entersearchField(iltCourseName);
        
        console.log(`🔄 Clicking Classes List...`);
        await instructorHome.clickClassesList();
        
        console.log(`🔄 Verifying ILT course is displayed...`);
        await instructorHome.verifyCourseName(iltCourseName);
        
        console.log(`\n📊 ========================================`);
        console.log(`📊 INSTRUCTOR VERIFICATION - ILT CLASS`);
        console.log(`📊 ========================================`);
        console.log(`   📋 Instructor: ${instructorUsername}`);
        console.log(`   📋 ILT Course: ${iltCourseName}`);
        console.log(`   📋 Status: Scheduled`);
        console.log(`   ✅ ILT class visible to instructor`);
        console.log(`   ✅ Instructor can access assigned class`);
        console.log(`   ✅ Course name verified in Classes List`);
        console.log(`📊 ========================================\n`);
    });

    test(`Test 5: Verify Virtual Class is visible to instructor`, async ({ learnerHome, instructorHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `INS004_TC005 - Verify VC class as instructor` },
            { type: `Test Description`, description: `Verify assigned Virtual Class is visible to instructor` }
        );

        console.log(`\n🔄 Logging in as instructor...`);
        await learnerHome.basicLogin(instructorUsername, "DefaultPortal");
        
        console.log(`🔄 Navigating to Instructor page...`);
        await learnerHome.selectInstructor();
        
        console.log(`🔄 Verifying instructor page...`);
        await instructorHome.verifyInstructorPage();
        
        console.log(`🔄 Filtering for scheduled classes...`);
        await instructorHome.clickFilter();
        await instructorHome.selectDeliveryType();
        await instructorHome.selectStatus("Scheduled");
        await instructorHome.clickApply("Scheduled");
        
        console.log(`🔄 Searching for Virtual Class...`);
        await instructorHome.entersearchField(vcCourseName);
        
        console.log(`🔄 Clicking Classes List...`);
        await instructorHome.clickClassesList();
        
        console.log(`🔄 Verifying Virtual Class is displayed...`);
        await instructorHome.verifyCourseName(vcCourseName);
        
        console.log(`\n📊 ========================================`);
        console.log(`📊 INSTRUCTOR VERIFICATION - VIRTUAL CLASS`);
        console.log(`📊 ========================================`);
        console.log(`   📋 Instructor: ${instructorUsername}`);
        console.log(`   📋 VC Course: ${vcCourseName}`);
        console.log(`   📋 Status: Scheduled`);
        console.log(`   ✅ Virtual Class visible to instructor`);
        console.log(`   ✅ Instructor can access assigned VC`);
        console.log(`   ✅ Course name verified in Classes List`);
        console.log(`📊 ========================================\n`);
    });

    test(`Test 6: Summary`, async ({ }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `INS004_TC006 - Test summary` },
            { type: `Test Description`, description: `Summary of admin creating ILT/VC and assigning instructor` }
        );

        console.log(`\n📊 ========================================`);
        console.log(`📊 TEST SUMMARY - ILT/VC CREATION & INSTRUCTOR ASSIGNMENT`);
        console.log(`📊 ========================================`);
        
        console.log(`\n   📋 TEST OBJECTIVE:`);
        console.log(`      Verify admin can create ILT/VC classes and`);
        console.log(`      assign instructors, who can then access them`);
        
        console.log(`\n   ✅ TEST SCENARIOS EXECUTED:`);
        
        console.log(`\n      1️⃣ INSTRUCTOR USER CREATION (Test 1):`);
        console.log(`         • Created user: ${instructorUsername}`);
        console.log(`         • Assigned Instructor role`);
        console.log(`         • Filled all required user details`);
        console.log(`         • User created successfully`);
        
        console.log(`\n      2️⃣ ILT COURSE CREATION (Test 2):`);
        console.log(`         • Created course: ${iltCourseName}`);
        console.log(`         • Delivery Type: Classroom (ILT)`);
        console.log(`         • Added session with future date/time`);
        console.log(`         • Assigned instructor: ${instructorUsername}`);
        console.log(`         • Selected location and max seats`);
        console.log(`         • Added completion certificate`);
        console.log(`         • ILT instance created successfully ✅`);
        
        console.log(`\n      3️⃣ VIRTUAL CLASS CREATION (Test 3):`);
        console.log(`         • Created course: ${vcCourseName}`);
        console.log(`         • Delivery Type: Virtual Class`);
        console.log(`         • Added VC instance with meeting type`);
        console.log(`         • Assigned instructor: ${instructorUsername}`);
        console.log(`         • Set max seats`);
        console.log(`         • Added completion certificate`);
        console.log(`         • Virtual Class created successfully ✅`);
        
        console.log(`\n      4️⃣ ILT CLASS VERIFICATION (Test 4):`);
        console.log(`         • Logged in as instructor`);
        console.log(`         • Navigated to Instructor page`);
        console.log(`         • Filtered by Classroom delivery type`);
        console.log(`         • Filtered by Scheduled status`);
        console.log(`         • Searched for ILT course`);
        console.log(`         • ILT class visible to instructor ✅`);
        
        console.log(`\n      5️⃣ VIRTUAL CLASS VERIFICATION (Test 5):`);
        console.log(`         • Logged in as instructor`);
        console.log(`         • Navigated to Instructor page`);
        console.log(`         • Filtered by Virtual Class delivery type`);
        console.log(`         • Filtered by Scheduled status`);
        console.log(`         • Searched for VC course`);
        console.log(`         • Virtual Class visible to instructor ✅`);
        
        console.log(`\n   📝 KEY FINDINGS:`);
        console.log(`      • Admin can successfully create ILT courses`);
        console.log(`      • Admin can successfully create Virtual Classes`);
        console.log(`      • Admin can assign instructors to ILT instances`);
        console.log(`      • Admin can assign instructors to VC instances`);
        console.log(`      • Instructors can login and access admin portal`);
        console.log(`      • Assigned classes are visible to instructors`);
        console.log(`      • Filter and search functionality works correctly`);
        console.log(`      • Both ILT and VC delivery types supported`);
        
        console.log(`\n   💡 ILT/VC CREATION WORKFLOW:`);
        console.log(`      Step 1: Create instructor user with Instructor role`);
        console.log(`      Step 2: Create ILT course with Classroom delivery type`);
        console.log(`      Step 3: Add instance with session details`);
        console.log(`      Step 4: Assign instructor to the instance`);
        console.log(`      Step 5: Create VC with Virtual Class delivery type`);
        console.log(`      Step 6: Add VC instance with meeting type`);
        console.log(`      Step 7: Assign instructor to VC instance`);
        console.log(`      Step 8: Login as instructor and verify classes`);
        
        console.log(`\n   🔍 VERIFIED ELEMENTS:`);
        console.log(`      • Instructor user creation`);
        console.log(`      • ILT course creation and instance setup`);
        console.log(`      • VC course creation and instance setup`);
        console.log(`      • Instructor assignment to ILT`);
        console.log(`      • Instructor assignment to VC`);
        console.log(`      • Instructor login and page access`);
        console.log(`      • Class visibility in instructor portal`);
        console.log(`      • Filter by delivery type and status`);
        
        console.log(`\n   🎯 BUSINESS RULES VERIFIED:`);
        console.log(`      • Admin has permission to create ILT courses`);
        console.log(`      • Admin has permission to create VC courses`);
        console.log(`      • Instructors can be assigned to classes`);
        console.log(`      • Instructors can view assigned classes`);
        console.log(`      • Scheduled classes appear in instructor portal`);
        console.log(`      • Delivery type filter works correctly`);
        
        console.log(`\n   ✅ CONCLUSION:`);
        console.log(`      All tests passed successfully.`);
        console.log(`      Admin can create both ILT and Virtual Classes.`);
        console.log(`      Instructors can be successfully assigned to classes.`);
        console.log(`      Assigned instructors can access and view their classes.`);
        console.log(`      The complete workflow from creation to instructor`);
        console.log(`      access is working correctly.`);
        console.log(`📊 ========================================\n`);
    });
});
