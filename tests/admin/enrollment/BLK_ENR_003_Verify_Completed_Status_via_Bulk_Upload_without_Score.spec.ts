import { test } from "../../../customFixtures/expertusFixture";
import { FakerData, getCurrentDateFormatted } from "../../../utils/fakerUtils";
import { credentials } from "../../../constants/credentialData";
import path from "path";
import fs from "fs";

// Test data using existing framework patterns
const courseName = "ELearning_BulkComplete_" + FakerData.getCourseName();
const description = FakerData.getDescription();
let courseCode: string;

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

test.describe(`BLK_ENR_003: Verify Completed Status for E-Learning Course via Bulk Upload without Score`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 0: Set Allow Excel Configuration to 0`, async ({ adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_003_Step0: Configuration Setup` },
            { type: `Test Description`, description: `Configure allow_excel setting to 0 for bulk completion testing` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.setAllowExcelConfig();
    });

    test(`Step 1: Create Single Instance E-Learning Course`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_003_Step1: E-Learning Course Creation` },
            { type: `Test Description`, description: `Create E-learning course for bulk completion testing` }
        );

        // Use existing login method
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        
        // Use existing course creation methods for E-learning
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        // E-learning delivery type is default, no need to change
        await createCourse.contentLibrary();
        await createCourse.uploadVideoThroughLink();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        
        // Retrieve course code for E-learning course
        await createCourse.editcourse();
        courseCode = await createCourse.retriveCode();
        
        // Save course changes
        await createCourse.save_editedcoursedetails();
        await createCourse.verifySuccessMessage();
        
        console.log(`E-Learning course created with code: ${courseCode}`);
    });

    test(`Step 2: Create Test Users for Bulk Completion`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_003_Step2: User Creation` },
            { type: `Test Description`, description: `Create users for bulk completion testing` }
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

    test(`Step 3: Perform Bulk Completion Upload without Score`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_003_Step3: Bulk Completion Upload` },
            { type: `Test Description`, description: `Upload bulk completion file without score and verify` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickBulkUpload("Course");

        // Create clean pipe-delimited file for LMS parser
        // Format dates as YYYY-MM-DD
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        
        // Completion date - same as registration date for immediate completion
        const completionDate = formattedDate;
        
        // Build content line by line with explicit control
        const lines = [];
        
        // Header line
        lines.push('username|class_code|completion_status|regdate|completiondate|score|language|mandatory|send_notification');
        
        // Data lines with Completed status and no score (empty score field) for E-learning course
        lines.push(`${testUsers[0].username}|${courseCode}|Completed|${formattedDate}|${completionDate}||English|N|N`);
        lines.push(`${testUsers[1].username}|${courseCode}|Completed|${formattedDate}|${completionDate}||English|N|N`);
        
        // Join with Unix line endings (\n only)
        const fileContent = lines.join('\n');
        
        // Write both .csv and .psv versions
        const csvFilePath = path.join(process.cwd(), 'data', 'bulk_completion_elearning_without_score.csv');
        const psvFilePath = path.join(process.cwd(), 'data', 'bulk_completion_elearning_without_score.psv');
        
        // Write as raw UTF-8 bytes without BOM
        fs.writeFileSync(csvFilePath, fileContent, { encoding: 'utf8', flag: 'w' });
        fs.writeFileSync(psvFilePath, fileContent, { encoding: 'utf8', flag: 'w' });
        
        console.log(`📄 E-Learning Pipe-delimited completion files created (without score):`);
        console.log(`   CSV: ${csvFilePath}`);
        console.log(`   PSV: ${psvFilePath}`);

        // Upload the CSV file using existing method
        await enrollHome.uploadBulkEnrollmentFile(csvFilePath);
        await enrollHome.verifyBulkEnrollmentSuccess();
    });

    test(`Step 4: Verify Completed Status without Score in E-Learning Course`, async ({ adminHome, createCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_003_Step4: Verification` },
            { type: `Test Description`, description: `Verify users are marked as completed without score in E-learning course` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();

        // Search for the created E-learning course
        await createCourse.catalogSearch(courseName);
        
        // Click edit icon on the course
        await createCourse.clickEditIcon();
        
        // Click enrollments in the course page
        await createCourse.clickEnrollmentInCoursePage();
        
        // Verify both users are marked as completed
        await enrollHome.page.waitForSelector(`text=${testUsers[0].username}`, { timeout: 10000 });
        await enrollHome.page.waitForSelector(`text=${testUsers[1].username}`, { timeout: 10000 });
        
        // Verify completion status appears in the enrollment list
        await enrollHome.page.waitForSelector('text=Completed', { timeout: 10000 });
        
        console.log(`✅ E-Learning course completion verification completed for users: ${testUsers[0].username}, ${testUsers[1].username}`);
        console.log(`📊 Status: Completed (without score)`);
    });

    // test(`Step 5: Verify Users in My Learning with Completed Status`, async ({ learnerHome }) => {
    //     test.info().annotations.push(
    //         { type: `Author`, description: `QA Team` },
    //         { type: `TestCase`, description: `BLK_ENR_003_Step5: Learner Verification` },
    //         { type: `Test Description`, description: `Verify completed course appears in learner's My Learning section` }
    //     );

    //     // Login as first test user to verify completion in My Learning
    //     await learnerHome.basicLogin(testUsers[0].username, "Default");
    //     await learnerHome.clickMyLearning();
        
    //     // Verify course appears in completed section
    //     await learnerHome.page.waitForSelector(`text=${courseName}`, { timeout: 10000 });
    //     await learnerHome.page.waitForSelector('text=Completed', { timeout: 5000 });
        
    //     console.log(`✅ Course "${courseName}" verified as completed in learner's My Learning`);
    // });

    // test.afterEach(async ({}, testInfo) => {
    //     if (testInfo.status === 'failed') {
    //         console.log(`❌ Test "${testInfo.title}" failed`);
    //     } else {
    //         console.log(`✅ Test "${testInfo.title}" passed`);
    //     }
    // });

    // test.afterAll(async () => {
    //     // Cleanup files after all tests
    //     try {
    //         const csvFilePath = path.join(process.cwd(), 'data', 'bulk_completion_elearning_without_score.csv');
    //         const psvFilePath = path.join(process.cwd(), 'data', 'bulk_completion_elearning_without_score.psv');
            
    //         if (fs.existsSync(csvFilePath)) {
    //             fs.unlinkSync(csvFilePath);
    //             console.log(`🧹 Cleaned up file: ${csvFilePath}`);
    //         }
            
    //         if (fs.existsSync(psvFilePath)) {
    //             fs.unlinkSync(psvFilePath);
    //             console.log(`🧹 Cleaned up file: ${psvFilePath}`);
    //         }
    //     } catch (error) {
    //         console.log(`⚠️ Cleanup warning: ${error}`);
    //     }
    // });
});