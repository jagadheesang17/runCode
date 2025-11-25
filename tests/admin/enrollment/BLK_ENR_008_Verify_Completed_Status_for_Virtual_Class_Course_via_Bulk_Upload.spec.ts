import { test } from "../../../customFixtures/expertusFixture";
import { FakerData, getCurrentDateFormatted, gettomorrowDateFormatted } from "../../../utils/fakerUtils";
import { credentials } from "../../../constants/credentialData";
import path from "path";
import fs from "fs";

// Test data using existing framework patterns
const courseName = "VC_BulkComplete_" + FakerData.getCourseName();
const description = FakerData.getDescription();
const instructorName = credentials.INSTRUCTORNAME.username;
let instanceCode: string;

// User data following framework patterns
const testUsers = [
    {
        username: FakerData.getFirstName() + Math.floor(Math.random() * 1000),
        firstName: FakerData.getFirstName(),
        lastName: FakerData.getLastName(),
        email: FakerData.getEmail()
    },
    {
        username: FakerData.getFirstName() + Math.floor(Math.random() * 1000),
        firstName: FakerData.getFirstName(),
        lastName: FakerData.getLastName(),
        email: FakerData.getEmail()
    }
];

test.describe(`BLK_ENR_008: Verify Completed Status for Virtual Class Course via Bulk Upload`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 0: Set Allow Excel Configuration to 0`, async ({ adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_008_Step0: Configuration Setup` },
            { type: `Test Description`, description: `Configure allow_excel setting to 0 for Virtual Class bulk completion testing` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.setAllowExcelConfig();
    });

    test(`Step 1: Create Future Virtual Class Course with Instance`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_008_Step1: Virtual Class Course Creation` },
            { type: `Test Description`, description: `Create Virtual Class course with future instance for bulk completion testing` }
        );

        // Use existing login method
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        
        // Create Virtual Class course using existing patterns
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.selectdeliveryType("Virtual Class");
        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown();
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        
        // Add VC instance
        await createCourse.editcourse();
        await createCourse.addInstances();
        
        // Create Virtual Class instance with meeting setup
        await createCourse.selectInstanceDeliveryType("Virtual Class");
        await createCourse.clickCreateInstance();
        await createCourse.selectMeetingType(instructorName, courseName, 1);
        await createCourse.typeAdditionalInfo();
        await createCourse.setMaxSeat();
        await createCourse.clickCatalog();
        instanceCode = await createCourse.retriveCode();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        
        console.log(`Virtual Class course created with instance code: ${instanceCode}`);
    });

    test(`Step 2: Create Test Users for Bulk Completion`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_008_Step2: User Creation` },
            { type: `Test Description`, description: `Create users for bulk completion in Virtual Class course` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        
        // Create first user using existing methods
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.clickCreateUser();
        await createUser.verifyCreateUserLabel();
        await createUser.enter("first_name", testUsers[0].firstName);
        await createUser.enter("last_name", testUsers[0].lastName);
        await createUser.uncheckAutoGenerateUsernameIfPresent();
        await createUser.enter("username", testUsers[0].username);
        await createUser.enter("user-password", "Welcome1@");
        await createUser.enter("email", testUsers[0].email);
        await createUser.clickSave();
        await createUser.verifyUserCreationSuccessMessage();

        // Create second user
        await createUser.page.locator("//a[text()='Create User']").click();
        await createUser.enter("first_name", testUsers[1].firstName);
        await createUser.enter("last_name", testUsers[1].lastName);
        await createUser.uncheckAutoGenerateUsernameIfPresent();
        await createUser.enter("username", testUsers[1].username);
        await createUser.enter("user-password", "Welcome1@");
        await createUser.enter("email", testUsers[1].email);
        await createUser.clickSave();
        await createUser.verifyUserCreationSuccessMessage();
    });

    test(`Step 3: Perform Bulk Completion Upload for Virtual Class Course`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_008_Step3: Bulk Completion Upload` },
            { type: `Test Description`, description: `Upload bulk completion file for Virtual Class course and verify` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickBulkUpload("Course");

        // Create clean pipe-delimited file for LMS parser
        // Format dates as YYYY-MM-DD
        
        // Convert future date from MM/DD/YYYY to YYYY-MM-DD format for bulk upload
        const futureDateString = gettomorrowDateFormatted(); // This returns MM/DD/YYYY format
        const [month, day, year] = futureDateString.split('/');
        const futureDateFormatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; // Convert to YYYY-MM-DD
        
        // Registration date should be current date (enrollment date), not future instance date
        // Convert current date from MM/DD/YYYY to YYYY-MM-DD format for bulk upload
        const currentDateString = getCurrentDateFormatted(); // This returns MM/DD/YYYY format
        const [currentMonth, currentDay, currentYear] = currentDateString.split('/');
        const regDate = `${currentYear}-${currentMonth.padStart(2, '0')}-${currentDay.padStart(2, '0')}`; // Convert to YYYY-MM-DD
        
        // Completion date - after the VC session date (use current date for completion)
        const currentDate = new Date();
        const completionDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        
        // Build content line by line with explicit control
        const lines = [];
        
        // Header line
        lines.push('username|class_code|completion_status|regdate|completiondate|score|language|mandatory|send_notification');
        
        // Data lines for Virtual Class course - regdate uses current date (enrollment date), completion date is current
        lines.push(`${testUsers[0].username}|${instanceCode}|Completed|${regDate}|${completionDate}||English|N|N`);
        lines.push(`${testUsers[1].username}|${instanceCode}|Completed|${regDate}|${completionDate}||English|N|N`);
        
        // Join with Unix line endings (\n only)
        const fileContent = lines.join('\n');
        
        // Write both .csv and .psv versions
        const csvFilePath = path.join(process.cwd(), 'data', 'bulk_completion_virtual_class.csv');
        const psvFilePath = path.join(process.cwd(), 'data', 'bulk_completion_virtual_class.psv');
        
        // Write as raw UTF-8 bytes without BOM
        fs.writeFileSync(csvFilePath, fileContent, { encoding: 'utf8', flag: 'w' });
        fs.writeFileSync(psvFilePath, fileContent, { encoding: 'utf8', flag: 'w' });
        
        console.log(`📄 Virtual Class Pipe-delimited completion files created:`);
        console.log(`   CSV: ${csvFilePath}`);
        console.log(`   PSV: ${psvFilePath}`);
        console.log(`🎯 Instance Code: ${instanceCode}`);
        console.log(`📅 Registration Date (Current Date): ${regDate}`);
        console.log(`📅 Completion Date (Current): ${completionDate}`);

        // Upload the CSV file using existing method
        await enrollHome.uploadBulkEnrollmentFile(csvFilePath);
        await enrollHome.verifyBulkEnrollmentSuccess();
    });

    test(`Step 4: Verify Completed Status in Virtual Class Course`, async ({ adminHome, createCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_008_Step4: Verification` },
            { type: `Test Description`, description: `Verify users are completed in Virtual Class course with correct status` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();

        // Search for the created Virtual Class course
        await createCourse.catalogSearch(courseName);
        
        // Click edit icon on the course
        await createCourse.clickEditIcon();
        
        // Click enrollments for instance course (Virtual Class)
        await createCourse.clickInstanceCourseEnrollment(courseName);
        
        // Verify both users are completed
        await enrollHome.page.waitForSelector(`text=${testUsers[0].username}`, { timeout: 10000 });
        await enrollHome.page.waitForSelector(`text=${testUsers[1].username}`, { timeout: 10000 });
        
        // Verify completed status appears in the enrollment list
        await enrollHome.page.waitForSelector('text=Completed', { timeout: 10000 });
        
        console.log(`✅ Virtual Class course completion verification completed for users: ${testUsers[0].username}, ${testUsers[1].username}`);
        console.log(`📊 Status: Completed (Virtual Class attendance)`);
        console.log(`🎯 Instance Code: ${instanceCode}`);
    });

    test(`Step 5: Verify Users in My Learning with Completed Virtual Class Course`, async ({ learnerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_008_Step5: Learner Verification` },
            { type: `Test Description`, description: `Verify completed Virtual Class course appears in learner's My Learning section` }
        );

        // Login as first test user to verify completion in My Learning
        await learnerHome.basicLogin(testUsers[0].username, "Default");
        await learnerHome.clickMyLearning();
        
        // Verify course appears with completed status
        await learnerHome.page.waitForSelector(`text=${courseName}`, { timeout: 10000 });
        await learnerHome.page.waitForSelector('text=Completed', { timeout: 5000 });
        
        console.log(`✅ Virtual Class course "${courseName}" verified as completed in learner's My Learning`);
        console.log(`🎯 VC attendance marked as completed`);
    });

    test.afterEach(async ({}, testInfo) => {
        if (testInfo.status === 'failed') {
            console.log(`❌ Test "${testInfo.title}" failed`);
        } else {
            console.log(`✅ Test "${testInfo.title}" passed`);
        }
    });

    test.afterAll(async () => {
        // Cleanup files after all tests
        try {
            const csvFilePath = path.join(process.cwd(), 'data', 'bulk_completion_virtual_class.csv');
            const psvFilePath = path.join(process.cwd(), 'data', 'bulk_completion_virtual_class.psv');
            
            if (fs.existsSync(csvFilePath)) {
                fs.unlinkSync(csvFilePath);
                console.log(`🧹 Cleaned up file: ${csvFilePath}`);
            }
            
            if (fs.existsSync(psvFilePath)) {
                fs.unlinkSync(psvFilePath);
                console.log(`🧹 Cleaned up file: ${psvFilePath}`);
            }
        } catch (error) {
            console.log(`⚠️ Cleanup warning: ${error}`);
        }
    });
});