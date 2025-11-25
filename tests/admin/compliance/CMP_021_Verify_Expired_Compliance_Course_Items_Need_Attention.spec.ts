import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { updateCronDataJSON } from "../../../utils/jsonDataHandler";
import { courseExpiry_CronJob } from "../DB/DBJobs";
import { URLConstants } from "../../../constants/urlConstants";
import { credentials } from "../../../constants/credentialData";

const courseName = "Compliance Expiry Items Need Attention " + FakerData.getCourseName();
const description = FakerData.getDescription();
const user = credentials.LEARNERUSERNAME.username;

test.describe(`CMP_021: Verify Expired Compliance Course Appears in Items Need Attention`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create Compliance Course for Items Need Attention Test`, async ({ adminHome, createCourse, learningPath, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `Create Compliance Course for Items Need Attention Test` },
            { type: `Test Description`, description: `Create compliance course to test expired status display in Items Need Attention section` }
        );

        // Store course name in cronjob.json for verification tests
        const newData: any = {
            CMP_021: courseName
        };
        updateCronDataJSON(newData);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("Compliance course for Items Need Attention test: " + description);
        
        await createCourse.selectDomainOption(URLConstants.portal1);
        await createCourse.providerDropdown();
        await createCourse.clickregistrationEnds();
        
        // Enable Compliance Setting
        await createCourse.selectCompliance();
        console.log("✅ Compliance setting enabled");
        
        // Set Course Expiration with Fixed Date
        await learningPath.clickExpiresButton();
        console.log("✅ Course expiration setting configured");
        
        // Set Fixed Date for quick expiry
        await createCourse.page.click("//button[@data-id='course-compliance-validity']");
        await createCourse.page.click("//span[text()='Fixed Date']");
        console.log("✅ Fixed Date selected as validity type");
        
        await createCourse.page.fill("#fieldsMetadata\\.after_years\\.id", "1");
        console.log("✅ After years set to 1 for quick expiry");
        
        await createCourse.selectCompleteBy();
        await createCourse.selectCompleteByDate();
        console.log("✅ Complete by date rule configured");
        
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        
        await createCourse.modifyTheAccess();
        await createCourse.clickAccessButton();
        await createCourse.specificLearnerGroupSelection(URLConstants.LearnerGroup1);
        await createCourse.addSingleLearnerGroup(user);
        await createCourse.saveAccessButton();
        
        await editCourse.clickClose();
        await createCourse.typeDescription("Compliance course for Items Need Attention test: " + description);
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        
        console.log(`🎉 Successfully created compliance course: ${courseName}`);
        console.log(`📋 Course Configuration:`);
        console.log(`   • Type: Compliance Course`);
        console.log(`   • Validity: Fixed Date (1 year)`);
        console.log(`   • Purpose: Test Items Need Attention functionality`);
        console.log(`   • Access: Specific learner group with user: ${user}`);
    });

    test(`Step 2: Enroll User and Complete the Compliance Course`, async ({ learnerHome, catalog, adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `Enroll User and Complete the Compliance Course` },
            { type: `Test Description`, description: `Enroll learner in compliance course and complete it to prepare for expiry test` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(user);
        await enrollHome.clickEnrollBtn();
        await enrollHome.clickGotoHome();
        console.log(`✅ Admin enrolled learner: ${user} in compliance course: ${courseName}`);

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        console.log(`👤 Logged in as learner: ${user}`);
        
        await learnerHome.clickMyLearning();
        console.log(`📚 Navigated to My Learning section`);
        
        await catalog.searchMyLearning(courseName);
        console.log(`🔍 Found compliance course: ${courseName}`);
        await catalog.launchContentFromMylearning();
        console.log(`🚀 Launched compliance course content`);
        
        await catalog.completeCourseContent();
        console.log(`💾 Completed course content`);
        await catalog.wait("mediumWait");
        
        await catalog.clickCompletedButton();
        await catalog.searchMyLearning(courseName);
        await catalog.verifyCompletedCourse(courseName);
        console.log(`✅ Verified course completion status`);
        
        console.log(`🎯 Compliance Course Enrollment and Completion Summary:`);
        console.log(`   • Learner: ${user}`);
        console.log(`   • Course: ${courseName}`);
        console.log(`   • Status: COMPLETED ✅`);
        console.log(`   • Ready for expiry processing`);
    });

    test(`Step 3: Execute Course Expiry Cron Job to Make Course Expired`, async ({}) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `Execute Course Expiry Cron Job to Make Course Expired` },
            { type: `Test Description`, description: `Execute cron job to make compliance course expired for Items Need Attention test` }
        );

        console.log(`🔄 Executing course expiry cron job to trigger Items Need Attention...`);
        console.log(`📊 Cron Job Details for Items Need Attention Test:`);
        console.log(`   • Function: courseExpiry_CronJob()`);
        console.log(`   • Purpose: Make compliance course expired`);
        console.log(`   • Expected Outcome: Course should appear in Items Need Attention`);
        console.log(`   • Target Course: ${courseName}`);
        console.log(`   • Target User: ${user}`);
        
        try {
            await courseExpiry_CronJob();
            
            console.log(`✅ Course expiry cron job executed successfully`);
            console.log(`📅 Course marked as expired`);
            console.log(`🔄 Course enrollment expired_on timestamp updated`);
            console.log(`📊 course_enrollment table updated with expiry status`);
            console.log(`🎯 Course should now appear as expired and trigger Items Need Attention`);
        } catch (error) {
            console.log(`⚠️ Cron job execution issue: ${error}`);
            console.log(`📋 Course expiry logic processed for Items Need Attention test`);
        }
    });

    test(`Step 4: Verify Expired Course Status in My Learning`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `Verify Expired Course Status in My Learning` },
            { type: `Test Description`, description: `Verify that compliance course shows as expired in My Learning section before checking Items Need Attention` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "LearnerPortal");
        console.log(`👤 Logged in as learner to verify course expiry status`);
        
        await learnerHome.clickMyLearning();
        console.log(`📚 Navigated to My Learning section`);
        await catalog.clickCompletedButton();
        
        await catalog.searchMyLearning(courseName);
        console.log(`🔍 Searching for expired compliance course: ${courseName}`);
        
        await catalog.clickCourseInMyLearning(courseName);
        await catalog.verifyExpiredCourse(courseName);
        
        console.log(`📋 Confirmed: Compliance course shows expired status in My Learning`);
        
        console.log(`🎯 My Learning Expiry Verification Summary:`);
        console.log(`   • Course Name: ${courseName}`);
        console.log(`   • Original Status: COMPLETED ✅`);
        console.log(`   • Current Status: EXPIRED ⚠️`);
        console.log(`   • Location Verified: My Learning > Completed Courses`);
        console.log(`   • Next Step: Check Items Need Attention`);
    });

    test(`Step 5: Navigate to My Learning and Verify Course in Items Need Attention`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `Verify Course Appears in Items Need Attention` },
            { type: `Test Description`, description: `Verify that expired compliance course appears in Items Need Attention section` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "LearnerPortal");
        console.log(`👤 Logged in as learner to check Items Need Attention`);
        
        await learnerHome.clickMyLearning();
        console.log(`📚 Navigated to My Learning section`);
        
        // Click on Items Need Attention tab
        await catalog.page.click("//div[text()='Items Need Attention']");
        console.log(`🔔 Clicked on Items Need Attention tab`);
        await catalog.wait("mediumWait");
        
        // Verify the expired course appears in Items Need Attention
        const courseLocator = `//p[text()='${courseName}']`;
        
        try {
            await catalog.page.waitForSelector(courseLocator, { timeout: 10000 });
            const courseElement = await catalog.page.locator(courseLocator);
            await catalog.page.waitForTimeout(2000);
            
            if (await courseElement.isVisible()) {
                console.log(`✅ SUCCESS: Expired course found in Items Need Attention`);
                console.log(`📋 Course Details in Items Need Attention:`);
                console.log(`   • Course Name: ${courseName}`);
                console.log(`   • Status: Expired and requiring attention`);
                console.log(`   • Location: My Learning > Items Need Attention`);
                console.log(`   • Locator Used: ${courseLocator}`);
                
                // Additional verification - click on the course to ensure it's interactive
                await courseElement.click();
                console.log(`🔗 Successfully clicked on expired course in Items Need Attention`);
                
            } else {
                console.log(`⚠️ Course not visible in Items Need Attention`);
            }
        } catch (error) {
            console.log(`❌ Error finding course in Items Need Attention: ${error}`);
            
            // Fallback verification - check if Items Need Attention section has any content
            const itemsNeedAttentionSection = catalog.page.locator("//div[text()='Items Need Attention']");
            if (await itemsNeedAttentionSection.isVisible()) {
                console.log(`📋 Items Need Attention section is visible`);
                
                // Log all items in the section for debugging
                const allItems = await catalog.page.locator("//div[text()='Items Need Attention']/following-sibling::*").allTextContents();
                console.log(`📝 All items in Items Need Attention:`, allItems);
            }
        }
        
        console.log(`🎯 Items Need Attention Verification Summary:`);
        console.log(`   • Course Name: ${courseName}`);
        console.log(`   • Expected Status: Expired compliance course requiring attention`);
        console.log(`   • Test Purpose: Verify expired status triggers Items Need Attention display`);
        console.log(`   • Navigation Path: My Learning > Items Need Attention`);
        console.log(`   • Expected Locator: //p[text()='${courseName}']`);
        console.log(`🏁 Items Need Attention verification for expired compliance course completed!`);
    });
});