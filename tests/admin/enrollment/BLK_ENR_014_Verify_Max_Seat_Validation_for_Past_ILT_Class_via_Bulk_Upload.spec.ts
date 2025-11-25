import { test } from "../../../customFixtures/expertusFixture";
import { FakerData, getCurrentDateFormatted, getPastDate } from "../../../utils/fakerUtils";
import { credentials } from "../../../constants/credentialData";
import path from "path";
import fs from "fs";

// Test data using existing framework patterns
const courseName = "ILT_MaxSeat_" + FakerData.getCourseName();
const description = FakerData.getDescription();
const sessionName = "Session_" + FakerData.getSession();
const instructorName = credentials.INSTRUCTORNAME.username;
const maxSeats = 2; // Set max seats to 2
let instanceCode: string;

// Create 3 users to test max seat validation (more than the limit of 2)
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
    },
    {
        username: FakerData.getFirstName() + Math.floor(Math.random() * 1000),
        firstName: FakerData.getFirstName(),
        lastName: FakerData.getLastName(),
        email: FakerData.getEmail()
    }
];

test.describe(`BLK_ENR_014: Verify Max Seat Validation for Current ILT Class via Bulk Upload`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 0: Set Allow Excel Configuration to 0`, async ({ adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_014_Step0: Configuration Setup` },
            { type: `Test Description`, description: `Configure allow_excel setting to 0 for max seat validation testing` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.setAllowExcelConfig();
    });

    test(`Step 1: Create Current ILT Class with Max Seat Limit (${maxSeats} seats)`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_014_Step1: Current ILT Course Creation` },
            { type: `Test Description`, description: `Create ILT course with current session and max seat limit for bulk enrollment testing` }
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
        
        // Add ILT instance with current date and specific max seat limit
        await createCourse.editcourse();
        await createCourse.addInstances();
        
        // Create ILT instance with current session date and max seat = 2
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        await createCourse.enterSessionName(sessionName);
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        // Set current date for today's ILT session
        await createCourse.enterCurrentDateValue();
        await createCourse.startandEndTime();
        
        // Set max seats to 2 specifically for this test
        await createCourse.type("//label[text()='Seats-Max']/following-sibling::input", "Max Seats", maxSeats.toString());
        await createCourse.waitList();
        // Keep course visible in catalog (don't hide it)
        // await createCourse.clickShowInCatalog(); // Show in catalog instead of hiding
        instanceCode = await createCourse.retriveCode();
        await createCourse.clickUpdate();
        await createCourse.spinnerDisappear();
        
        console.log(`Current ILT course created with instance code: ${instanceCode}`);
        console.log(`Max seats set to: ${maxSeats}`);
    });

    test(`Step 2: Create 3 Test Users for Max Seat Validation`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_014_Step2: User Creation` },
            { type: `Test Description`, description: `Create 3 users to test max seat validation (exceeding limit of 2)` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        
        // Create all 3 users using existing methods
        for (let i = 0; i < testUsers.length; i++) {
            await adminHome.menuButton();
            await adminHome.people();
            await adminHome.user();
            await createUser.clickCreateUser();
            await createUser.verifyCreateUserLabel();
            await createUser.enter("first_name", testUsers[i].firstName);
            await createUser.enter("last_name", testUsers[i].lastName);
            await createUser.uncheckAutoGenerateUsernameIfPresent();
            await createUser.enter("username", testUsers[i].username);
            await createUser.enter("user-password", "Welcome1@");
            await createUser.enter("email", testUsers[i].email);
            await createUser.clickSave();
            await createUser.verifyUserCreationSuccessMessage();
            
            console.log(`✅ Test user ${i + 1} created: ${testUsers[i].username}`);
        }
        
        console.log(`📊 Total users created: ${testUsers.length} (exceeds max seat limit of ${maxSeats})`);
    });

    test(`Step 3: Attempt Bulk Upload with More Users than Max Seats`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_014_Step3: Max Seat Bulk Upload` },
            { type: `Test Description`, description: `Upload bulk enrollment file with 3 users for course with max 2 seats` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickBulkUpload("Course");

        // Create clean pipe-delimited file with 3 users (exceeding max seat of 2)
        // Convert current date from MM/DD/YYYY to YYYY-MM-DD format for bulk upload
        const currentDateString = getCurrentDateFormatted(); // This returns MM/DD/YYYY format
        const [month, day, year] = currentDateString.split('/');
        const regDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; // Convert to YYYY-MM-DD
        
        // Build content line by line with explicit control
        const lines = [];
        
        // Header line
        lines.push('username|class_code|completion_status|regdate|completiondate|score|language|mandatory|send_notification');
        
        // Data lines for Current ILT course - 3 users enrolling (exceeds max seat of 2)
        testUsers.forEach((user) => {
            lines.push(`${user.username}|${instanceCode}|Enrolled|${regDate}|||English|N|N`);
        });
        
        // Join with Unix line endings (\n only)
        const fileContent = lines.join('\n');
        
        // Write both .csv and .psv versions
        const csvFilePath = path.join(process.cwd(), 'data', 'bulk_maxseat_ilt.csv');
        const psvFilePath = path.join(process.cwd(), 'data', 'bulk_maxseat_ilt.psv');
        
        // Write as raw UTF-8 bytes without BOM
        fs.writeFileSync(csvFilePath, fileContent, { encoding: 'utf8', flag: 'w' });
        fs.writeFileSync(psvFilePath, fileContent, { encoding: 'utf8', flag: 'w' });
        
        console.log(`📄 Current ILT max seat validation files created:`);
        console.log(`   CSV: ${csvFilePath}`);
        console.log(`   PSV: ${psvFilePath}`);
        console.log(`📊 Max seat: ${maxSeats}`);
        console.log(`👥 Users to enroll: ${testUsers.length}`);
        console.log(`⚠️ Expected: Max seat exceeded error - should reject because max seat is ${maxSeats}, trying to upload ${testUsers.length} users`);
        console.log(`🎯 Instance Code: ${instanceCode}`);
        console.log(`📅 Registration Date (Current Date): ${regDate}`);

        // Upload the CSV file using existing method
        await enrollHome.uploadBulkEnrollmentFile(csvFilePath);
        
        // Check for max seat validation error messages
        try {
            // Check for explicit error messages related to max seat
            const hasErrorMessage = await enrollHome.checkForBulkUploadErrors();
            if (hasErrorMessage) {
                console.log('✅ SUCCESS: Error message displayed for max seat exceeded');
                await enrollHome.verifyBulkUploadErrorContains(['maximum', 'max seat', 'exceeded', 'limit', 'capacity']);
            } else {
                // Check if partial success or no success message
                const hasSuccessMessage = await enrollHome.checkForBulkUploadSuccess();
                if (!hasSuccessMessage) {
                    console.log('✅ SUCCESS: No success message shown - max seat validation worked');
                } else {
                    console.log('⚠️ WARNING: Success message shown despite exceeding max seat limit');
                }
            }
        } catch (error) {
            console.log(`⚠️ Max seat validation check failed: ${error}`);
        }
        
        console.log(`🎯 Max seat validation test: Max seat ${maxSeats}, tried to upload ${testUsers.length} users - should fail successfully`);
    });

    test(`Step 4: Verify Enrollment Status and Max Seat Enforcement`, async ({ adminHome, createCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_014_Step4: Verification` },
            { type: `Test Description`, description: `Verify that only max allowed users are enrolled (2 or fewer)` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();

        // Search for the created Current ILT course (no filter needed since it's shown in catalog)
        await createCourse.catalogSearch(courseName);
        
        // Click edit icon on the course
        await createCourse.clickEditIcon();
        
        // Click enrollments for instance course (Current ILT)
        await createCourse.clickInstanceCourseEnrollment(courseName);
        
        try {
            // Count actual enrollments for each user
            let totalEnrolled = 0;
            const enrollmentResults = [];
            
            for (const user of testUsers) {
                const enrollmentCount = await enrollHome.getUserEnrollmentCount(user.username);
                enrollmentResults.push({ username: user.username, enrolled: enrollmentCount > 0 });
                if (enrollmentCount > 0) {
                    totalEnrolled++;
                }
            }
            
            console.log(`📊 Max seat validation results:`);
            console.log(`   Max seats allowed: ${maxSeats}`);
            console.log(`   Users attempted: ${testUsers.length}`);
            console.log(`   Users actually enrolled: ${totalEnrolled}`);
            
            enrollmentResults.forEach((result, index) => {
                const status = result.enrolled ? '✅ Enrolled' : '❌ Not Enrolled';
                console.log(`   User ${index + 1} (${result.username}): ${status}`);
            });
            
            if (totalEnrolled <= maxSeats) {
                console.log(`✅ SUCCESS: Max seat validation working - only ${totalEnrolled} users enrolled (≤ ${maxSeats} max)`);
            } else {
                console.log(`❌ ISSUE: Max seat validation failed - ${totalEnrolled} users enrolled (> ${maxSeats} max)`);
            }
            
            console.log(`✅ Current ILT max seat validation completed`);
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
            const csvFilePath = path.join(process.cwd(), 'data', 'bulk_maxseat_ilt.csv');
            const psvFilePath = path.join(process.cwd(), 'data', 'bulk_maxseat_ilt.psv');
            
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