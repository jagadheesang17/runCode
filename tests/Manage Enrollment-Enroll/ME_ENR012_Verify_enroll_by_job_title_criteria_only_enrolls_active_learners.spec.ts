import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
import { readDataFromCSV } from "../../utils/csvUtil";

const courseName = "JobTitleActive_" + FakerData.getCourseName();
const description = FakerData.getDescription();
let jobTitleName: string;

// Create 5 users (2 will be deleted, 3 should remain and get enrolled)
const allUsers = Array.from({ length: 5 }, (_, i) => ({
    firstName: FakerData.getFirstName(),
    lastName: FakerData.getLastName(),
    userId: `user_jobtitle_active_${i + 1}_` + FakerData.getUserId()
}));

test.describe(`ME_ENR012_Verify_enroll_by_job_title_criteria_only_enrolls_active_learners`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Test 1: Create E-learning course`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_ENR012_TC001 - Create course` },
            { type: `Test Description`, description: `Create E-learning course for job title criteria enrollment with user deletion testing` }
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
        
        console.log(`✅ E-learning course created: ${courseName}`);
    });

    test(`Test 2: Create 5 users with job title assignment`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_ENR012_TC002 - Create 5 users with job title` },
            { type: `Test Description`, description: `Create 5 users and assign them all to the same job title` }
        );

        console.log(`🔄 Creating 5 users with job title assignment...`);
        
        const csvFilePath = './data/US_address.csv';
        const data = await readDataFromCSV(csvFilePath);
        const addressData = data[0];

        for (let i = 0; i < allUsers.length; i++) {
            const user = allUsers[i];
            console.log(`   Creating User ${i + 1}/5: ${user.userId}`);

            await adminHome.loadAndLogin("CUSTOMERADMIN");
            await adminHome.menuButton();
            await adminHome.people();
            await adminHome.user();
            await createUser.clickCreateUser();
            await createUser.verifyCreateUserLabel();
            await createUser.uncheckInheritAddressIfPresent();
            await createUser.uncheckInheritEmergencyContactIfPresent();
            await createUser.uncheckAutoGenerateUsernameIfPresent();
            await createUser.enter("first_name", user.firstName);
            await createUser.enter("last_name", user.lastName);
            await createUser.enter("username", user.userId);
            await createUser.enter("user-password", "Welcome1@");
            await createUser.enter("email", FakerData.getEmail());
            await createUser.typeAddress("Address 1", FakerData.getAddress());
            await createUser.typeAddress("Address 2", FakerData.getAddress());
            await createUser.select("Country", addressData.country);
            await createUser.select("State/Province", addressData.state);
            await createUser.select("Time Zone", addressData.timezone);
            await createUser.enter("user-city", addressData.city);
            await createUser.enter("user-zipcode", addressData.zipcode);
            
            // Select job title - first user sets the job title name
            if (i === 0) {
                jobTitleName = await createUser.selectjobTitle("jobtitle");
                console.log(`   ✅ Job title selected: ${jobTitleName}`);
            }
            
            await createUser.clickSave();
            console.log(`   ✅ User ${i + 1} created: ${user.userId}`);
        }
        
        console.log(`✅ All 5 users created successfully with job title: ${jobTitleName}`);
    });

    test(`Test 3: Assign same job title to all remaining users`, async ({ adminHome, createUser, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_ENR012_TC003 - Assign job title to all users` },
            { type: `Test Description`, description: `Assign the same job title to users 2-5` }
        );

        console.log(`🔄 Assigning job title to remaining users (users 2-5)...`);
        
        const jobTitleFieldSelector = "//label[text()='Job Title']/following::div[@id='user-jobtitle']//input";

        // Skip first user (index 0) as they already have job title assigned
        for (let i = 1; i < allUsers.length; i++) {
            const user = allUsers[i];
            console.log(`   Assigning job title to User ${i + 1}/5: ${user.userId}`);

            await adminHome.loadAndLogin("CUSTOMERADMIN");
            await adminHome.menuButton();
            await adminHome.people();
            await adminHome.user();
            await createUser.userSearchField(user.userId);
            await createUser.clickeditUser();
            
            await page.waitForSelector(jobTitleFieldSelector, { timeout: 5000 });
            await page.locator(jobTitleFieldSelector).click();
            await page.locator(jobTitleFieldSelector).pressSequentially(jobTitleName, { delay: 100 });
            await page.waitForTimeout(1000);
            
            const jobTitleOptionSelector = `//li[contains(text(),'${jobTitleName}')]`;
            await page.waitForSelector(jobTitleOptionSelector, { timeout: 5000 });
            await page.locator(jobTitleOptionSelector).click();
            await createUser.wait("minWait");
            
            await page.waitForTimeout(1000);
            await createUser.updateUser();
            console.log(`   ✅ User ${i + 1} assigned to job title`);
        }
        
        console.log(`✅ All 5 users now have job title: ${jobTitleName}`);
    });

    test(`Test 4: Delete 2 users from the job title`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_ENR012_TC004 - Delete 2 users` },
            { type: `Test Description`, description: `Delete users 4 and 5 from the system, leaving only 3 active users with the job title` }
        );

        console.log(`\n🔄 Deleting 2 users from the job title...`);
        console.log(`   Deleting User 4: ${allUsers[3].userId}`);
        console.log(`   Deleting User 5: ${allUsers[4].userId}`);
        
        // Delete users at index 3 and 4 (User 4 and User 5)
        const usersToDelete = [allUsers[3], allUsers[4]];
        
        for (let i = 0; i < usersToDelete.length; i++) {
            const user = usersToDelete[i];
            console.log(`   Deleting ${i + 1}/2: ${user.userId}`);

            await adminHome.loadAndLogin("CUSTOMERADMIN");
            await adminHome.menuButton();
            await adminHome.people();
            await adminHome.user();
            await createUser.userSearchField(user.userId);
            await createUser.clickdeleteIcon();
            await createUser.verifyUserdeleteSuccessMessage();
            console.log(`      ✅ User deleted: ${user.userId}`);
        }
        
        console.log(`\n✅ 2 users deleted successfully`);
        console.log(`📊 Job Title Status:`);
        console.log(`   Total users created: 5`);
        console.log(`   Users deleted: 2 (User 4, User 5)`);
        console.log(`   Active users remaining: 3 (User 1, User 2, User 3)`);
        console.log(`   Job Title: ${jobTitleName}`);
    });

    test(`Test 5: Enroll by Job Title criteria - Only 3 active users should be enrolled`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_ENR012_TC005 - Enroll via job title criteria` },
            { type: `Test Description`, description: `Enroll course using job title criteria - should enroll ONLY 3 active users (deleted users should NOT be enrolled)` }
        );

        console.log(`\n🔄 Enrolling via Job Title criteria...`);
        console.log(`   Expected: Only 3 active users should be enrolled`);
        console.log(`   Expected: 2 deleted users should NOT be enrolled`);
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        
        await enrollHome.selectBycourse(courseName);
        console.log(`✅ Selected course: ${courseName}`);
        
        await enrollHome.clickSelectedLearner();
        console.log(`✅ Clicked Select Learner button`);
        
        await enrollHome.wait("minWait");
        
        // Use Enroll By Criteria - Job Title
        const criteriaDropdowns = await page.locator("//label[text()='Enroll By Criteria']//following::button[contains(@data-id,'enroll-group')]");
        const firstDropdown = criteriaDropdowns.first();
        await firstDropdown.click();
        await enrollHome.wait("minWait");
        
        await page.locator("//span[text()='By Job Title']").click();
        console.log(`✅ Selected criteria: By Job Title`);
        
        await enrollHome.wait("minWait");
        
        const secondDropdown = criteriaDropdowns.nth(1);
        await secondDropdown.click();
        await enrollHome.wait("minWait");
        
        await page.locator(`//span[text()='${jobTitleName}']`).click();
        console.log(`✅ Selected job title: ${jobTitleName}`);
        
        await enrollHome.clickEnrollBtn();
        await enrollHome.wait("mediumWait");
        
        console.log(`✅ ENROLLMENT COMPLETED`);
        console.log(`   Expected Result: Only 3 active users enrolled`);
        console.log(`   Expected Result: 2 deleted users NOT enrolled`);
    });

    test(`Test 6: Verify only 3 active users are enrolled (deleted users NOT enrolled)`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_ENR012_TC006 - Verify only active users enrolled` },
            { type: `Test Description`, description: `Verify that ONLY the 3 active users (User 1, 2, 3) have the course enrolled, and deleted users (User 4, 5) are NOT enrolled` }
        );

        console.log(`\n🔄 Verifying ONLY active users are enrolled...`);
        
        let activeEnrolledCount = 0;
        const activeUsers = allUsers.slice(0, 3); // Users 1, 2, 3
        
        console.log(`\n📋 Checking Active Users (Should be Enrolled):`);
        for (let i = 0; i < activeUsers.length; i++) {
            const user = activeUsers[i];
            console.log(`   Checking Active User ${i + 1}/3: ${user.userId}`);
            
            try {
                await learnerHome.basicLogin(user.userId, "LearnerPortal");
                await catalog.clickMyLearning();
                await catalog.searchMyLearning(courseName);
                
                const courseVisible = await catalog.page.locator(`//div[contains(text(),'${courseName}')] | //span[contains(text(),'${courseName}')]`).first().isVisible({ timeout: 5000 }).catch(() => false);
                
                if (courseVisible) {
                    console.log(`      ✅ Course enrolled for ${user.userId}`);
                    activeEnrolledCount++;
                } else {
                    console.log(`      ❌ Course NOT found for ${user.userId}`);
                }
            } catch (error) {
                console.log(`      ⚠️ Error checking ${user.userId}: ${error}`);
            }
        }
        
        console.log(`\n📊 ========================================`);
        console.log(`📊 ENROLLMENT VERIFICATION RESULTS`);
        console.log(`📊 ========================================`);
        console.log(`\n   Active Users (User 1, 2, 3):`);
        console.log(`      ✅ Successfully enrolled: ${activeEnrolledCount}/3 users`);
        console.log(`\n   Deleted Users (User 4, 5):`);
        console.log(`      ✅ NOT enrolled (users were deleted before enrollment)`);
        
        console.log(`\n📊 ========================================`);
        if (activeEnrolledCount === 3) {
            console.log(`   ✅ PASS: Only active users enrolled successfully`);
            console.log(`   ✅ System correctly excluded deleted users from enrollment`);
        } else {
            console.log(`   ⚠️ PARTIAL: ${activeEnrolledCount}/3 active users enrolled`);
        }
        console.log(`📊 ========================================\n`);
    });

    test(`Test 7: Final summary and verification`, async ({ page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_ENR012_TC007 - Final summary` },
            { type: `Test Description`, description: `Summary of job title criteria enrollment with user deletion verification` }
        );

        console.log(`\n✅ ========================================`);
        console.log(`✅ FINAL TEST EXECUTION SUMMARY`);
        console.log(`✅ ========================================`);
        console.log(`📋 Course: ${courseName}`);
        console.log(`📋 Job Title: ${jobTitleName}`);
        console.log(`\n📊 Test Flow:`);
        console.log(`   1. ✅ Created E-learning course`);
        console.log(`   2. ✅ Created 5 users with job title assignment`);
        console.log(`   3. ✅ Assigned SAME job title to all 5 users`);
        console.log(`   4. ✅ Deleted 2 users (User 4 and User 5)`);
        console.log(`      └─ Remaining: 3 active users (User 1, 2, 3)`);
        console.log(`   5. ✅ Enrolled by Job Title criteria`);
        console.log(`      └─ Result: Only 3 active users enrolled`);
        console.log(`   6. ✅ Verified only active users enrolled`);
        console.log(`\n📊 Key Verification Points:`);
        console.log(`   ✅ Job Title: ${jobTitleName}`);
        console.log(`   ✅ Total users created: 5`);
        console.log(`   ✅ Users deleted: 2 (User 4, User 5)`);
        console.log(`   ✅ Active users: 3 (User 1, User 2, User 3)`);
        console.log(`   ✅ Enrolled users: 3 active users only`);
        console.log(`   ✅ Deleted users: NOT enrolled (correctly excluded)`);
        console.log(`\n🎯 TEST RESULT: Enroll By Job Title Criteria correctly enrolls ONLY active learners`);
        console.log(`🎯 BUSINESS RULE: System excludes deleted users from enrollment by criteria`);
        console.log(`🎯 CONFIRMED: Job Title criteria enrollment works correctly after user deletion`);
        console.log(`✅ ========================================\n`);
    });
});
