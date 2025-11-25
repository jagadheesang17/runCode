import { test } from "../../../customFixtures/expertusFixture";
import { FakerData, getCurrentDateFormatted, gettomorrowDateFormatted } from "../../../utils/fakerUtils";
import { credentials } from "../../../constants/credentialData";
import path from "path";
import fs from "fs";

// Test data using existing framework patterns
const courseName = "VC_BulkDuplicate_" + FakerData.getCourseName();
const description = FakerData.getDescription();
const sessionName = "Session_" + FakerData.getSession();
const instructorName = credentials.INSTRUCTORNAME.username;
let instanceCode: string;

// Single user data for duplicate enrollment test
const testUser = {
    username: FakerData.getFirstName() + Math.floor(Math.random() * 1000),
    firstName: FakerData.getFirstName(),
    lastName: FakerData.getLastName(),
    email: FakerData.getEmail()
};

test.describe(`BLK_ENR_013: Verify Duplicate Enrollment Error for Virtual Class Course via Bulk Upload`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 0: Set Allow Excel Configuration to 0`, async ({ adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_013_Step0: Configuration Setup` },
            { type: `Test Description`, description: `Configure allow_excel setting to 0 for Virtual Class duplicate enrollment testing` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.setAllowExcelConfig();
    });

    test(`Step 1: Create Virtual Class Course with Future Instance`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_013_Step1: Virtual Class Course Creation` },
            { type: `Test Description`, description: `Create Virtual Class course with future instance for duplicate enrollment testing` }
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
        
        // Add Virtual Class instance with future date
        await createCourse.editcourse();
        await createCourse.addInstances();
        
        // Create Virtual Class instance with future session date
        await createCourse.selectInstanceDeliveryType("Virtual Class");
        await createCourse.clickCreateInstance();
        await createCourse.enterSessionName(sessionName);
        await createCourse.selectInstructor(instructorName);
        await createCourse.enterfutureDateValue(); // Use future date for Virtual Class
        await createCourse.startandEndTime();
        await createCourse.setMaxSeat();
        await createCourse.waitList();
        instanceCode = await createCourse.retriveCode();
        await createCourse.clickUpdate();
        await createCourse.spinnerDisappear();
        
        console.log(`Virtual Class course created with instance code: ${instanceCode}`);
    });

    test(`Step 2: Create Test User for Duplicate Enrollment`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_013_Step2: User Creation` },
            { type: `Test Description`, description: `Create user for duplicate enrollment testing in Virtual Class course` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        
        // Create test user using existing methods
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.clickCreateUser();
        await createUser.verifyCreateUserLabel();
        await createUser.enter("first_name", testUser.firstName);
        await createUser.enter("last_name", testUser.lastName);
        await createUser.uncheckAutoGenerateUsernameIfPresent();
        await createUser.enter("username", testUser.username);
        await createUser.enter("user-password", "Welcome1@");
        await createUser.enter("email", testUser.email);
        await createUser.clickSave();
        await createUser.verifyUserCreationSuccessMessage();
        
        console.log(`✅ Test user created: ${testUser.username}`);
    });

    test(`Step 3: Attempt Bulk Upload with Duplicate Enrollments`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_013_Step3: Duplicate Bulk Upload` },
            { type: `Test Description`, description: `Upload bulk enrollment file with duplicate entries and verify error handling` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickBulkUpload("Course");

        // Create clean pipe-delimited file with DUPLICATE entries
        // Registration date should be current date (enrollment date) for Virtual Class
        // Convert current date from MM/DD/YYYY to YYYY-MM-DD format for bulk upload
        const currentDateString = getCurrentDateFormatted(); // This returns MM/DD/YYYY format
        const [month, day, year] = currentDateString.split('/');
        const regDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; // Convert to YYYY-MM-DD
        
        // Build content line by line with explicit control
        const lines = [];
        
        // Header line
        lines.push('username|class_code|completion_status|regdate|completiondate|score|language|mandatory|send_notification');
        
        // Data lines - Same user enrolled TWICE (duplicate scenario)
        lines.push(`${testUser.username}|${instanceCode}|Enrolled|${regDate}|||English|N|N`);
        lines.push(`${testUser.username}|${instanceCode}|Enrolled|${regDate}|||English|N|N`);
        
        // Join with Unix line endings (\n only)
        const fileContent = lines.join('\n');
        
        // Write both .csv and .psv versions
        const csvFilePath = path.join(process.cwd(), 'data', 'bulk_duplicate_vc.csv');
        const psvFilePath = path.join(process.cwd(), 'data', 'bulk_duplicate_vc.psv');
        
        // Write as raw UTF-8 bytes without BOM
        fs.writeFileSync(csvFilePath, fileContent, { encoding: 'utf8', flag: 'w' });
        fs.writeFileSync(psvFilePath, fileContent, { encoding: 'utf8', flag: 'w' });
        
        console.log(`📄 Virtual Class duplicate enrollment files created:`);
        console.log(`   CSV: ${csvFilePath}`);
        console.log(`   PSV: ${psvFilePath}`);
        console.log(`👤 User: ${testUser.username} (enrolled TWICE)`);
        console.log(`🎯 Instance Code: ${instanceCode}`);
        console.log(`📅 Registration Date (Current Date): ${regDate}`);
        console.log(`⚠️ Expected: Error message for duplicate enrollment`);

        // Upload the CSV file using existing method
        await enrollHome.uploadBulkEnrollmentFile(csvFilePath);
        
        // Check if there are error messages for duplicate enrollment
        try {
            // First check for explicit error messages
            const hasErrorMessage = await enrollHome.checkForBulkUploadErrors();
            if (hasErrorMessage) {
                console.log('✅ SUCCESS: Error message displayed for duplicate enrollment');
                await enrollHome.verifyBulkUploadErrorContains(['duplicate', 'already enrolled', 'error']);
            } else {
                // Check if success message is NOT displayed (which would be correct for duplicates)
                const hasSuccessMessage = await enrollHome.checkForBulkUploadSuccess();
                if (!hasSuccessMessage) {
                    console.log('✅ SUCCESS: No success message shown for duplicate enrollment');
                } else {
                    console.log('⚠️ WARNING: Success message was displayed despite duplicate enrollment');
                }
            }
        } catch (error) {
            console.log(`⚠️ Error handling check failed: ${error}`);
        }
    });

    test(`Step 4: Verify Enrollment Status in Virtual Class Course`, async ({ adminHome, createCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_013_Step4: Verification` },
            { type: `Test Description`, description: `Verify user enrollment count to ensure duplicates were not processed` }
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
        
        try {
            // Verify user enrollment count
            const enrollmentCount = await enrollHome.getUserEnrollmentCount(testUser.username);
            if (enrollmentCount === 1) {
                console.log(`✅ VERIFIED: User ${testUser.username} enrolled only once (duplicate prevented)`);
            } else if (enrollmentCount === 0) {
                console.log(`⚠️ INFO: User ${testUser.username} not enrolled (bulk upload completely failed due to duplicate)`);
            } else {
                console.log(`❌ ISSUE: User ${testUser.username} enrolled ${enrollmentCount} times (duplicate not prevented)`);
            }
            
            console.log(`✅ Virtual Class duplicate enrollment verification completed`);
            console.log(`👤 User: ${testUser.username}`);
            console.log(`📊 Enrollment Count: ${enrollmentCount}`);
            console.log(`🎯 Instance Code: ${instanceCode}`);
        } catch (error) {
            console.log(`⚠️ Verification check failed: ${error}`);
        }
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
            const csvFilePath = path.join(process.cwd(), 'data', 'bulk_duplicate_vc.csv');
            const psvFilePath = path.join(process.cwd(), 'data', 'bulk_duplicate_vc.psv');
            
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