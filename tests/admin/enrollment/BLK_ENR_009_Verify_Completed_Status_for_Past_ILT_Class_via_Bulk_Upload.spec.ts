import { test } from "../../../customFixtures/expertusFixture";
import { FakerData, getCurrentDateFormatted, getPastDate } from "../../../utils/fakerUtils";
import { credentials } from "../../../constants/credentialData";
import path from "path";
import fs from "fs";

// Test data using existing framework patterns
const courseName = "ILT_BulkComplete_" + FakerData.getCourseName();
const description = FakerData.getDescription();
const sessionName = "Session_" + FakerData.getSession();
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

test.describe(`BLK_ENR_009: Verify Completed Status for Past ILT Class via Bulk Upload`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 0: Set Allow Excel Configuration to 0`, async ({ adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_009_Step0: Configuration Setup` },
            { type: `Test Description`, description: `Configure allow_excel setting to 0 for Past ILT bulk completion testing` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.setAllowExcelConfig();
    });

    test(`Step 1: Create Past ILT Class with Instance`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_009_Step1: Past ILT Course Creation` },
            { type: `Test Description`, description: `Create ILT course with past session for bulk completion testing` }
        );

        // Use existing login method
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        
        // Create ILT course using existing patterns
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
        
        // Add ILT instance with past date
        await createCourse.editcourse();
        await createCourse.addInstances();
        
        // Create ILT instance with past session date
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        await createCourse.enterSessionName(sessionName);
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.enterpastDateValue(); // Key method for past ILT sessions
        await createCourse.startandEndTime();
        await createCourse.setMaxSeat();
        await createCourse.waitList();
        await createCourse.clickHideinCatalog();
        instanceCode = await createCourse.retriveCode();
        await createCourse.clickUpdate();
        await createCourse.spinnerDisappear();
        
        console.log(`Past ILT course created with instance code: ${instanceCode}`);
    });

    test(`Step 2: Create Test Users for Bulk Completion`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_009_Step2: User Creation` },
            { type: `Test Description`, description: `Create users for bulk completion in Past ILT course` }
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

    test(`Step 3: Perform Bulk Completion Upload for Past ILT Class`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_009_Step3: Bulk Completion Upload` },
            { type: `Test Description`, description: `Upload bulk completion file for Past ILT course and verify` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickBulkUpload("Course");

        // Create clean pipe-delimited file for LMS parser
        // Format dates as YYYY-MM-DD
        
        // Convert past date from MM/DD/YYYY to YYYY-MM-DD format for bulk upload
        const pastDateString = getPastDate(); // This returns MM/DD/YYYY format
        const [month, day, year] = pastDateString.split('/');
        const pastDateFormatted = `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
        
        // Registration date should be the actual past instance date
        const regDate = pastDateFormatted;
        
        // Completion date should be after the session date (use current date for completion)
        const currentDate = new Date();
        const completionDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        
        // Build content line by line with explicit control
        const lines = [];
        
        // Header line
        lines.push('username|class_code|completion_status|regdate|completiondate|score|language|mandatory|send_notification');
        
        // Data lines for Past ILT course - regdate uses past instance date, completion date uses current date
        lines.push(`${testUsers[0].username}|${instanceCode}|Completed|${regDate}|${completionDate}||English|N|N`);
        lines.push(`${testUsers[1].username}|${instanceCode}|Completed|${regDate}|${completionDate}||English|N|N`);
        
        // Join with Unix line endings (\n only)
        const fileContent = lines.join('\n');
        
        // Write both .csv and .psv versions
        const csvFilePath = path.join(process.cwd(), 'data', 'bulk_completion_past_ilt.csv');
        const psvFilePath = path.join(process.cwd(), 'data', 'bulk_completion_past_ilt.psv');
        
        // Write as raw UTF-8 bytes without BOM
        fs.writeFileSync(csvFilePath, fileContent, { encoding: 'utf8', flag: 'w' });
        fs.writeFileSync(psvFilePath, fileContent, { encoding: 'utf8', flag: 'w' });
        
        console.log(`📄 Past ILT Pipe-delimited completion files created:`);
        console.log(`   CSV: ${csvFilePath}`);
        console.log(`   PSV: ${psvFilePath}`);
        console.log(`🎯 Instance Code: ${instanceCode}`);
        console.log(`📅 Registration Date (Past Instance): ${regDate}`);
        console.log(`📅 Completion Date (Current): ${completionDate}`);

        // Upload the CSV file using existing method
        await enrollHome.uploadBulkEnrollmentFile(csvFilePath);
        await enrollHome.verifyBulkEnrollmentSuccess();
    });

    test(`Step 4: Verify Completed Status in Past ILT Course`, async ({ adminHome, createCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_009_Step4: Verification` },
            { type: `Test Description`, description: `Verify users are completed in Past ILT course with correct status` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();

        // Apply filter to show hidden/past courses since past ILT classes are hidden by default
    

        // Search for the created Past ILT course
        await createCourse.catalogSearch(courseName);
        
        // Click edit icon on the course
        await createCourse.clickEditIcon();
        
        // Click enrollments in the course page
       // await createCourse.clickEnrollmentInCoursePage();
         await createCourse.clickInstanceCourseEnrollment(courseName);
        
        // Verify both users are completed
        await enrollHome.page.waitForSelector(`text=${testUsers[0].username}`, { timeout: 10000 });
        await enrollHome.page.waitForSelector(`text=${testUsers[1].username}`, { timeout: 10000 });
        
        // Verify completed status appears in the enrollment list
        await enrollHome.page.waitForSelector('text=Completed', { timeout: 10000 });
        
        console.log(`✅ Past ILT course completion verification completed for users: ${testUsers[0].username}, ${testUsers[1].username}`);
        console.log(`📊 Status: Completed (Past ILT attendance)`);
        console.log(`🎯 Instance Code: ${instanceCode}`);
    });

    test(`Step 5: Verify Users in My Learning with Completed Past ILT Course`, async ({ learnerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_009_Step5: Learner Verification` },
            { type: `Test Description`, description: `Verify completed Past ILT course appears in learner's My Learning section` }
        );

        // Login as first test user to verify completion in My Learning
        await learnerHome.basicLogin(testUsers[0].username, "Default");
        await learnerHome.clickMyLearning();
        
        // Verify course appears with completed status
        await learnerHome.page.waitForSelector(`text=${courseName}`, { timeout: 10000 });
        await learnerHome.page.waitForSelector('text=Completed', { timeout: 5000 });
        
        console.log(`✅ Past ILT course "${courseName}" verified as completed in learner's My Learning`);
        console.log(`🎯 Past ILT attendance marked as completed`);
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
            const csvFilePath = path.join(process.cwd(), 'data', 'bulk_completion_past_ilt.csv');
            const psvFilePath = path.join(process.cwd(), 'data', 'bulk_completion_past_ilt.psv');
            
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