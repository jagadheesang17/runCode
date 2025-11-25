import { test } from "../../../customFixtures/expertusFixture";
import { FakerData, getCurrentDateFormatted } from "../../../utils/fakerUtils";
import { credentials } from "../../../constants/credentialData";
import path from "path";
import fs from "fs";

// Test data using existing framework patterns
const courseName = "BulkEnroll_" + FakerData.getCourseName();
const description = FakerData.getDescription();
const sessionName = "Session_" + FakerData.getSession();
let contentName: string;
let instanceCode: string;

// User data following framework patterns
const testUser = {
    username: FakerData.getFirstName() + Math.floor(Math.random() * 1000),
    firstName: FakerData.getFirstName(),
    lastName: FakerData.getLastName(),
    email: FakerData.getEmail()
};

test.describe(`BLK_ENR_001: Verify Enrolled Status via Bulk Upload End to End Flow`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 0: Set Allow Excel Configuration to 0`, async ({ adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_001_Step0: Configuration Setup` },
            { type: `Test Description`, description: `Configure allow_excel setting to 0 for bulk upload testing` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.setAllowExcelConfig();
    });

    test(`Step 1: Create Single Instance Classroom Course`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_001_Step1: Course Creation` },
            { type: `Test Description`, description: `Create classroom course for bulk enrollment testing` }
        );

        // Use existing login method
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        
        // Use existing course creation methods
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
        
        // Use existing content upload methods
        await createCourse.editcourse();
        await createCourse.addInstances();
        
        // Use existing instance creation methods
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        await createCourse.enterSessionName(sessionName);
        await createCourse.selectInstructor(credentials.INSTRUCTORNAME.username);
        await createCourse.selectLocation();
        await createCourse.enterfutureDateValue();
        await createCourse.startandEndTime();
        await createCourse.setMaxSeat();
        await createCourse.waitList();
        await createCourse.clickCatalog();
        instanceCode = await createCourse.retriveCode();
        await createCourse.clickUpdate();
        await createCourse.spinnerDisappear();
        
        // Capture instance code using existing method
       
        console.log(`Course created with instance code: ${instanceCode}`);
    });

    test(`Step 2: Create Test User for Bulk Enrollment`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_001_Step2: User Creation` },
            { type: `Test Description`, description: `Create user for bulk enrollment` }
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

    test(`Step 3: Perform Bulk Enrollment Upload`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_001_Step3: Bulk Upload` },
            { type: `Test Description`, description: `Upload bulk enrollment file and verify` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickBulkUpload("Course");


    
        // Create clean pipe-delimited file for LMS parser
        // Format date as YYYY-MM-DD
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        
        // Build content line by line with explicit control
        const lines = [];
        
        // Header line
        lines.push('username|class_code|completion_status|regdate|completiondate|score|language|mandatory|send_notification');
        
        // Data line for single user
        lines.push(`${testUser.username}|${instanceCode}|Enrolled|${formattedDate}|||English|N|N`);
        
        // Join with Unix line endings (\n only)
        const fileContent = lines.join('\n');
        
        // Write both .csv and .psv versions
        const csvFilePath = path.join(process.cwd(), 'data', 'bulk_enrollment_test.csv');
        const psvFilePath = path.join(process.cwd(), 'data', 'bulk_enrollment_test.psv');
        
        // Write as raw UTF-8 bytes without BOM
        fs.writeFileSync(csvFilePath, fileContent, { encoding: 'utf8', flag: 'w' });
        fs.writeFileSync(psvFilePath, fileContent, { encoding: 'utf8', flag: 'w' });
        
        console.log(`📄 Pipe-delimited files created:`);
        console.log(`   CSV: ${csvFilePath}`);
        console.log(`   PSV: ${psvFilePath}`);

        // Upload the CSV file using existing method
        await enrollHome.uploadBulkEnrollmentFile(csvFilePath);
        await enrollHome.verifyBulkEnrollmentSuccess();
    });

    test(`Step 4: Verify Enrollment Status`, async ({ adminHome, createCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_001_Step4: Verification` },
            { type: `Test Description`, description: `Verify users are enrolled with correct status via course page` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();

        // Search for the created course
        await createCourse.catalogSearch(courseName);
        
        // Click edit icon on the course
        await createCourse.clickEditIcon();
        
        // Click enrollments in the course page using course title to avoid strict mode violation
        await createCourse.clickInstanceCourseEnrollment(courseName);

        // Verify user enrollment using existing methods
        await enrollHome.enterSearchUser(testUser.username);
        await enrollHome.verifyEnrollmentStatus(testUser.username, "Enrolled");

        console.log(`✅ Bulk enrollment verification completed successfully`);
        console.log(`   📚 Course: ${courseName}`);
        console.log(`   👤 User enrolled: ${testUser.username}`);
        console.log(`   📊 Status: User enrolled via bulk upload`);
    });

  
});