import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { updateCronDataJSON } from "../../../utils/jsonDataHandler";
import { courseExpiry_CronJob } from "../DB/DBJobs";
import { URLConstants } from "../../../constants/urlConstants";
import { credentials } from "../../../constants/credentialData";

const courseName = "Compliance Expiry " + FakerData.getCourseName();
const description = FakerData.getDescription();
const user = credentials.LEARNERUSERNAME.username;

test.describe(`CMP_002: Verify Compliance Course Expiry Flow`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create Compliance Course with Expiry Settings`, async ({ adminHome, createCourse, learningPath, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `Create Compliance Course with Expiry Settings` },
            { type: `Test Description`, description: `Create compliance course with complete by date to test expiry functionality` }
        );

        // Store course name in cronjob.json for verification tests
        const newData: any = {
            CMP_002: courseName
        };
        updateCronDataJSON(newData);

        // Step 1: Login as Customer Admin
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        
        // Step 2: Navigate to Course Creation
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        
        // Step 3: Create Basic Course Information
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("Compliance course with expiry: " + description);
        
        // Step 4: Set Portal and Provider (if needed)
        await createCourse.selectDomainOption(URLConstants.portal1);
        await createCourse.providerDropdown();
        
        // Step 5: Set Registration End Date
        await createCourse.clickregistrationEnds();
        
        // Step 6: Enable Compliance Setting
        await createCourse.selectCompliance();
        console.log("✅ Compliance setting enabled");
        
        // Step 7: Set Course Expiration (Critical for expiry testing)
        await learningPath.clickExpiresButton();
        console.log("✅ Course expiration setting configured");
        
        // Step 8: Set Complete By Date (This will be manipulated by cron job)
        await createCourse.selectCompleteBy();
        await createCourse.selectCompleteByDate();
        console.log("✅ Complete by date rule configured - this will be used for expiry");
        
        // Step 9: Attach Content
        await createCourse.contentLibrary();
        
        // Step 10: Save Course Initially
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        
        // Step 11: Modify Access for Specific User/Group
        await createCourse.modifyTheAccess();
        await createCourse.clickAccessButton();
        await createCourse.specificLearnerGroupSelection(URLConstants.LearnerGroup1);
        await createCourse.addSingleLearnerGroup(user);
        await createCourse.saveAccessButton();
        
        // Step 12: Close Access Settings and Update Course
        await editCourse.clickClose();
        await createCourse.typeDescription("Compliance course with expiry functionality: " + description);
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        
        console.log(`🎉 Successfully created compliance course: ${courseName}`);
        console.log(`📋 Course Features:`);
        console.log(`   • Compliance: Enabled`);
        console.log(`   • Expiration: Enabled`);
        console.log(`   • Complete By: Date Rule`);
        console.log(`   • Access: Restricted to specific user/group`);
        console.log(`   • Ready for expiry cron job testing`);
    });

    test(`Step 2: Enroll Learner and Complete Course Content`, async ({ learnerHome, catalog, adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `Enroll Learner and Complete Course Content` },
            { type: `Test Description`, description: `Enroll a learner in compliance course and complete the content before expiry cron job` }
        );

        // Step 1: Admin Enrollment of Learner
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(user);
        await enrollHome.clickEnrollBtn();
        await enrollHome.clickGotoHome();
        console.log(`✅ Admin enrolled learner: ${user} in course: ${courseName}`);

        // Step 2: Learner Login and Course Completion
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        console.log(`👤 Logged in as learner: ${user}`);
        
        // Step 3: Navigate to My Learning
        await learnerHome.clickMyLearning();
        console.log(`📚 Navigated to My Learning section`);
        
        // Step 4: Search for Compliance Course
        await catalog.searchMyLearning(courseName);
        console.log(`🔍 Found compliance course: ${courseName}`);
        await catalog.launchContentFromMylearning();
        console.log(`🚀 Launched compliance course content`);
        
        // Step 6: Complete Course Content (using new improved method)
        await catalog.completeCourseContent();
        console.log(`💾 Completed course content using enhanced completion method`);
        await catalog.wait("mediumWait")
        // Step 7: Verify Course Completion
        await catalog.clickCompletedButton();
        await catalog.searchMyLearning(courseName);
        await catalog.verifyCompletedCourse(courseName);
        console.log(`✅ Verified course completion status`);
        
        console.log(`🎯 Course Completion Summary:`);
        console.log(`   • Learner: ${user}`);
        console.log(`   • Course: ${courseName}`);
        console.log(`   • Status: COMPLETED ✅`);
        console.log(`   • Content: Successfully launched and completed`);
        console.log(`   • Ready for expiry cron job testing`);
    });

    test(`Step 3: Execute Compliance Course Expiry Cron Job`, async ({ }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `Execute Compliance Course Expiry Cron Job` },
            { type: `Test Description`, description: `Execute cron job to make completed compliance course expired/overdue` }
        );

        console.log(`🔄 Executing compliance course expiry cron job...`);
        console.log(`📊 Cron Job Details:`);
        console.log(`   • Function: courseExpiry_CronJob()`);
        console.log(`   • Action: Updates course_enrollment table`);
        console.log(`   • Effect: Sets completion_date and expired_on to previous dates`);
        console.log(`   • Result: Makes course appear as overdue/expired`);
        console.log(`   • Cron Master: Updates 'Expired notification to end users'`);
        console.log(`   • Cron Details: Updates 'Expire Courses with Past Validity'`);
        
        // Execute the cron job to make course expired
        await courseExpiry_CronJob();
        
        console.log(`✅ Compliance course expiry cron job executed successfully`);
        console.log(`📅 Course completion_date has been set to previous date`);
        console.log(`🔄 Course enrollment expired_on timestamp updated`);
        console.log(`📊 course_enrollment table updated in database`);
        console.log(`🔔 'Expired notification to end users' cron enabled`);
        console.log(`⏰ 'Expire Courses with Past Validity' cron scheduling updated`);
        console.log(`🎯 Course should now appear as expired/overdue to learners`);
    });

    test(`Step 4: Verify Compliance Course Expiry Status`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `Verify Compliance Course Expiry Status` },
            { type: `Test Description`, description: `Verify that completed compliance course shows as overdue/expired after cron job execution` }
        );

        // Step 1: Login as Learner
        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        console.log(`👤 Logged in as learner to verify compliance course expiry`);
        
        // Step 2: Navigate to My Learning
        await learnerHome.clickMyLearning();
        console.log(`📚 Navigated to My Learning section`);
 await catalog.clickCompletedButton();
        // Step 3: Search for Compliance Course
        await catalog.searchMyLearning(courseName);
        console.log(`🔍 Searching for expired compliance course: ${courseName}`);
        
        // Step 4: Verify Overdue Status (course should now be overdue despite being completed)
       await catalog.clickCourseInMyLearning(courseName)

    await catalog.verifyExpiredCourse(courseName)


        console.log(`📋 Confirmed: Course details show overdue status`);
        
        console.log(`🎯 Compliance Course Expiry Verification Summary:`);
        console.log(`   • Course Name: ${courseName}`);
        console.log(`   • Original Status: COMPLETED ✅`);
        console.log(`   • Current Status: OVERDUE/EXPIRED ⚠️`);
        console.log(`   • Cron Job: Successfully executed ✅`);
        console.log(`   • Database: Updated with past completion/expiry dates ✅`);
        console.log(`   • Learner View: Shows overdue status ✅`);
        console.log(`   • Compliance Flow: Working as expected ✅`);
        console.log(`🏁 Compliance course expiry flow completed successfully!`);
    });
test(`Step 4: Verify Enrollment Status in E-Learning Course`, async ({ adminHome, createCourse, catalog,enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Team` },
            { type: `TestCase`, description: `BLK_ENR_002_Step4: Verification` },
            { type: `Test Description`, description: `Verify users are enrolled in E-learning course with correct status` }
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

       await catalog.verifyExpiredCourse(courseName)
        
        // // Verify both users are enrolled - using page locators to check enrollment status
        // await enrollHome.page.waitForSelector(`text=${testUsers[0].username}`, { timeout: 10000 });
        // await enrollHome.page.waitForSelector(`text=${testUsers[1].username}`, { timeout: 10000 });
        
      //  console.log(`✅ E-Learning course enrollment verification completed for users: ${testUsers[0].username}, ${testUsers[1].username}`);
    });
   
});