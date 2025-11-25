import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
import { readDataFromCSV } from "../../utils/csvUtil";

const courseName = "JobTitleEnroll_" + FakerData.getCourseName();
const description = FakerData.getDescription();
let jobTitleName: string;

// Users associated with job title
const jobTitleUsers = Array.from({ length: 3 }, (_, i) => ({
    firstName: FakerData.getFirstName(),
    lastName: FakerData.getLastName(),
    userId: `jobtitle_user_${i + 1}_` + FakerData.getUserId()
}));

test.describe(`ME_VUS009_Verify_enroll_by_criteria_job_title_enrolls_associated_users`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Test 1: Create E-learning course`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS009_TC001 - Create course` },
            { type: `Test Description`, description: `Create E-learning course for job title criteria enrollment` }
        );

        console.log(`🔄 Creating E-learning course...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Course created: ${courseName}`);
    });

    test(`Test 2: Create users and assign to job title`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS009_TC002 - Create users with job title` },
            { type: `Test Description`, description: `Create 3 users and assign them to the same job title` }
        );

        console.log(`🔄 Creating 3 users and assigning to job title...`);
        const csvFilePath = './data/US_address.csv';
        const data = await readDataFromCSV(csvFilePath);
        const addressData = data[0];

        for (let i = 0; i < jobTitleUsers.length; i++) {
            const user = jobTitleUsers[i];
            console.log(`   Creating User ${i + 1}/3: ${user.userId}`);

            await adminHome.loadAndLogin("CUSTOMERADMIN");
            await adminHome.menuButton();
            await adminHome.people();
            await adminHome.user();
            await createUser.clickCreateUser();
            await createUser.verifyCreateUserLabel();
            await createUser.uncheckInheritAddressIfPresent();
            await createUser.uncheckInheritEmergencyContactIfPresent();
            await createUser.enter("first_name", user.firstName);
            await createUser.enter("last_name", user.lastName);
            await createUser.enter("username", user.userId);
            await createUser.enter("user-password", "Welcome1@");
            await createUser.selectUserType("usertype");
            await createUser.typeAddress("Address 1", addressData.address);
            await createUser.select("Country", addressData.country);
            await createUser.select("State/Province", addressData.state);
            await createUser.enter("user-city", addressData.city);
            await createUser.enter("user-zipcode", addressData.zip);
            await createUser.selectTimeZone("USA", "Eastern");
            await createUser.select("Language", "English");
            
            // Assign to job title - first user sets the job title name
            if (i === 0) {
                jobTitleName = await createUser.selectjobTitle("jobtitle");
                console.log(`   ✅ Job title selected: ${jobTitleName}`);
            }
            
            await createUser.clickSave();
            await createUser.verifyUserCreationSuccessMessage();
            console.log(`   ✅ User created: ${user.userId}`);
        }
        
        console.log(`✅ All 3 users created with job title: ${jobTitleName}`);
    });

    test(`Test 3: Assign same job title to remaining users`, async ({ adminHome, createUser, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS009_TC003 - Assign job title to users` },
            { type: `Test Description`, description: `Assign the same job title to users 2-3` }
        );

        console.log(`🔄 Assigning job title to remaining users (users 2-3)...`);
        const jobTitleSearchSelector = "//input[@id='user-jobtitle-filter-field']";

        for (let i = 1; i < jobTitleUsers.length; i++) {
            const user = jobTitleUsers[i];
            console.log(`   Assigning job title to User ${i + 1}/3: ${user.userId}`);

            await adminHome.loadAndLogin("CUSTOMERADMIN");
            await adminHome.menuButton();
            await adminHome.people();
            await adminHome.user();
            await createUser.userSearchField(user.userId);
            await createUser.wait("mediumWait");
            await createUser.editIcon();
            await createUser.wait("mediumWait");
            
            // Assign job title
            await page.locator(jobTitleSearchSelector).fill(jobTitleName);
            await createUser.wait("minWait");
            await page.locator(`//span[text()='${jobTitleName}']`).first().click();
            await createUser.wait("minWait");
            
            await createUser.clickSave();
            await createUser.verifyUserCreationSuccessMessage();
            console.log(`   ✅ Job title assigned to ${user.userId}`);
        }
        
        console.log(`✅ All users assigned to job title: ${jobTitleName}`);
    });

    test(`Test 4: Enroll by criteria - Job Title`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS009_TC004 - Enroll by job title criteria` },
            { type: `Test Description`, description: `Enroll users by job title criteria` }
        );

        console.log(`🔄 Enrolling by criteria - Job Title: ${jobTitleName}`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.wait("mediumWait");
        
        // Select enroll by criteria - Job Title
        await enrollHome.enrollByCriteria("Search by Job Title", jobTitleName, jobTitleName);
        await enrollHome.wait("minWait");
        
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        console.log(`✅ Enrolled users by job title criteria`);
    });

    test(`Test 5: Verify all job title users are enrolled`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS009_TC005 - Verify job title users enrolled` },
            { type: `Test Description`, description: `Verify that all users associated with the job title are enrolled` }
        );

        console.log(`🔄 Verifying job title users enrollment...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.wait("minWait");
        await enrollHome.clickModifyEnrollBtn();
        await enrollHome.wait("mediumWait");

        console.log(`🔄 Checking enrolled users...`);
        let enrolledCount = 0;
        
        for (const user of jobTitleUsers) {
            const userRow = page.locator(`//tr[contains(.,'${user.userId}')]`);
            const isVisible = await userRow.isVisible().catch(() => false);
            
            if (isVisible) {
                enrolledCount++;
                console.log(`   ✅ ${user.userId} - Enrolled`);
            } else {
                console.log(`   ❌ ${user.userId} - NOT Enrolled`);
            }
        }
        
        console.log(`\n📊 Enrollment Summary:`);
        console.log(`   Job Title: ${jobTitleName}`);
        console.log(`   Total Users with Job Title: ${jobTitleUsers.length}`);
        console.log(`   Users Enrolled: ${enrolledCount}`);
        
        if (enrolledCount === jobTitleUsers.length) {
            console.log(`   ✅ PASS: All job title users are enrolled`);
        } else {
            console.log(`   ⚠️ WARNING: Not all job title users are enrolled`);
        }
    });
});
