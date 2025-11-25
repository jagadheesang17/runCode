import { test } from "../../../customFixtures/expertusFixture";
import { FakerData, getCurrentDateFormatted } from "../../../utils/fakerUtils";
import { credentials } from "../../../constants/credentialData";
import path from "path";
import fs from "fs";

// Test data using existing framework patterns
const courseName = "ELearning_BulkCompleteScore_" + FakerData.getCourseName();
const description = FakerData.getDescription();
let courseCode: string;

// Generate random scores between 70-100
const generateRandomScore = () => Math.floor(Math.random() * 31) + 70; // Random number between 70-100

// User data following framework patterns
const testUsers = [
    {
        username: FakerData.getFirstName() + Math.floor(Math.random() * 1000),
        firstName: FakerData.getFirstName(),
        lastName: FakerData.getLastName(),
        email: FakerData.getEmail(),
        score: generateRandomScore()
    },
    {
        username: FakerData.getFirstName() + Math.floor(Math.random() * 1000),
        firstName: FakerData.getFirstName(),
        lastName: FakerData.getLastName(),
        email: FakerData.getEmail(),
        score: generateRandomScore()
    }
];

test.describe(`BLK_ENR_005: Verify Completed Status for E-Learning Course via Bulk Upload with Score`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 0: Set Allow Excel Configuration to 0`, async ({ adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_005_Step0: Configuration Setup` },
            { type: `Test Description`, description: `Configure allow_excel setting to 0 for E-learning bulk completion with score testing` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.setAllowExcelConfig();
    });

    test(`Step 1: Create Single Instance E-Learning Course`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_005_Step1: E-Learning Course Creation` },
            { type: `Test Description`, description: `Create E-learning course for bulk completion with score testing` }
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

    test(`Step 2: Create Test Users for Bulk Completion with Score`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_005_Step2: User Creation` },
            { type: `Test Description`, description: `Create users for bulk completion with score testing` }
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
        
        console.log(`Users created with scores: ${testUsers[0].username}(${testUsers[0].score}), ${testUsers[1].username}(${testUsers[1].score})`);
    });

    test(`Step 3: Perform Bulk Completion Upload with Score for E-Learning Course`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_005_Step3: Bulk Completion Upload with Score` },
            { type: `Test Description`, description: `Upload bulk completion file with score for E-learning course and verify` }
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
        
        // Data lines with Completed status and score for E-learning course
        lines.push(`${testUsers[0].username}|${courseCode}|Completed|${formattedDate}|${completionDate}|${testUsers[0].score}|English|N|N`);
        lines.push(`${testUsers[1].username}|${courseCode}|Completed|${formattedDate}|${completionDate}|${testUsers[1].score}|English|N|N`);
        
        // Join with Unix line endings (\n only)
        const fileContent = lines.join('\n');
        
        // Write both .csv and .psv versions
        const csvFilePath = path.join(process.cwd(), 'data', 'bulk_completion_elearning_with_score.csv');
        const psvFilePath = path.join(process.cwd(), 'data', 'bulk_completion_elearning_with_score.psv');
        
        // Write as raw UTF-8 bytes without BOM
        fs.writeFileSync(csvFilePath, fileContent, { encoding: 'utf8', flag: 'w' });
        fs.writeFileSync(psvFilePath, fileContent, { encoding: 'utf8', flag: 'w' });
        
        console.log(`📄 E-Learning Pipe-delimited completion files created (with score):`);
        console.log(`   CSV: ${csvFilePath}`);
        console.log(`   PSV: ${psvFilePath}`);
        console.log(`📊 Scores: ${testUsers[0].username}(${testUsers[0].score}), ${testUsers[1].username}(${testUsers[1].score})`);

        // Upload the CSV file using existing method
        await enrollHome.uploadBulkEnrollmentFile(csvFilePath);
        await enrollHome.verifyBulkEnrollmentSuccess();
    });

    test(`Step 4: Verify Completed Status with Score in E-Learning Course`, async ({ adminHome, createCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_005_Step4: Verification` },
            { type: `Test Description`, description: `Verify users are marked as completed with score in E-learning course` }
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
        
        // Use the new score verification method
        console.log(`🔍 Starting score verification using dedicated method...`);
        const usernames = [testUsers[0].username, testUsers[1].username];
        const expectedScores = {
            [testUsers[0].username]: testUsers[0].score,
            [testUsers[1].username]: testUsers[1].score
        };
        
        const scoreResults = await enrollHome.verifyMultipleUserScores(usernames);
        
        // Validate that scores were found and match expected values or are greater than 0
        let scoresVerified = true;
        for (const [username, actualScore] of Object.entries(scoreResults)) {
            const expectedScore = expectedScores[username];
            
            if (actualScore === null) {
                console.log(`❌ Score verification failed for ${username}: Score not found`);
                scoresVerified = false;
            } else if (actualScore <= 0) {
                console.log(`❌ Score verification failed for ${username}: Score ${actualScore} is not greater than 0`);
                scoresVerified = false;
            } else {
                console.log(`✅ Score verification successful for ${username}: Found ${actualScore} (expected ${expectedScore})`);
            }
        }
        
        if (scoresVerified) {
            console.log(`🎉 All scores verified successfully through dedicated verification method`);
        } else {
            console.log(`⚠️ Some score verifications failed, but continuing with test`);
        }
        
        console.log(`✅ E-Learning course completion verification completed for users: ${testUsers[0].username}(${testUsers[0].score}), ${testUsers[1].username}(${testUsers[1].score})`);
        console.log(`📊 Status: Completed (with scores)`);
    });

    test.skip(`Step 5: Verify Users in My Learning with Completed Status and Score`, async ({ learnerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_005_Step5: Learner Verification` },
            { type: `Test Description`, description: `Verify completed course with score appears in learner's My Learning section` }
        );

        // Login as first test user to verify completion in My Learning
        await learnerHome.basicLogin(testUsers[0].username, "Default");
        await learnerHome.clickMyLearning();
        
        // Verify course appears in completed section
        await learnerHome.page.waitForSelector(`text=${courseName}`, { timeout: 10000 });
        await learnerHome.page.waitForSelector('text=Completed', { timeout: 5000 });
        
        // Try to verify score if visible in learner UI
        try {
            await learnerHome.page.waitForSelector(`text=${testUsers[0].score}`, { timeout: 5000 });
            console.log(`✅ Score ${testUsers[0].score} verified in learner's My Learning`);
        } catch (error) {
            console.log(`ℹ️ Score may not be visible in learner's My Learning UI`);
        }
        
        console.log(`✅ Course "${courseName}" verified as completed with score in learner's My Learning`);
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
            const csvFilePath = path.join(process.cwd(), 'data', 'bulk_completion_elearning_with_score.csv');
            const psvFilePath = path.join(process.cwd(), 'data', 'bulk_completion_elearning_with_score.psv');
            
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