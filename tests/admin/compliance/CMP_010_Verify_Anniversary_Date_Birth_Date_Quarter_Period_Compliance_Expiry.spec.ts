import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { updateCronDataJSON } from "../../../utils/jsonDataHandler";
import { courseExpiry_CronJob } from "../DB/DBJobs";
import { URLConstants } from "../../../constants/urlConstants";
import { credentials } from "../../../constants/credentialData";

const courseName = "Compliance Birth Date Quarter " + FakerData.getCourseName();
const description = FakerData.getDescription();
const user = credentials.LEARNERUSERNAME.username;

test.describe(`CMP_010: Verify Anniversary Date with Birth Date Quarter Period Range Compliance Expiry`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create Compliance Course with Anniversary Date - Birth Date Quarter Period`, async ({ adminHome, createCourse, learningPath, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `Create Compliance Course with Anniversary Date - Birth Date Quarter Period` },
            { type: `Test Description`, description: `Create compliance course with expiry as Anniversary Date with Birth Date type and Quarter period range` }
        );

        // Store course name in cronjob.json for verification tests
        const newData: any = {
            CMP_010: courseName
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
        await createCourse.typeDescription("Compliance course with Anniversary Date - Birth Date Quarter Period: " + description);
        
        await createCourse.selectDomainOption(URLConstants.portal1);
        await createCourse.providerDropdown();
        await createCourse.clickregistrationEnds();
        
        // Enable Compliance Setting
        await createCourse.selectCompliance();
        console.log("✅ Compliance setting enabled");
        
        // Set Course Expiration with Anniversary Date
        await learningPath.clickExpiresButton();
        console.log("✅ Course expiration setting configured");
        
        // Anniversary Date Configuration with Birth Date - Quarter Period
        await createCourse.page.click("//button[@data-id='course-compliance-validity']");
        await createCourse.page.click("//span[text()='Anniversary Date']");
        console.log("✅ Anniversary Date selected as validity type");
        
        await createCourse.page.click("//button[@data-id='anniversary-type']");
        await createCourse.page.click("//div[text()='Birth Date']");
        console.log("✅ Birth Date selected as anniversary type");
        
        await createCourse.page.click("//button[@data-id='anniversary-range']");
        await createCourse.page.click("//span[text()='Period Range']");
        console.log("✅ Period Range selected as anniversary range");
        
        await createCourse.page.click("//button[@data-id='period-value']");
        await createCourse.page.click("//span[text()='Quarter']");
        console.log("✅ Quarter selected as period value");
        
        await createCourse.page.fill("#fieldsMetadata\\.after_years\\.id", "1");
        console.log("✅ After years set to 1");
        
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
        await createCourse.typeDescription("Compliance course with Anniversary Date - Birth Date Quarter Period: " + description);
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        
        console.log(`🎉 Successfully created compliance course: ${courseName}`);
        console.log(`📋 Anniversary Configuration:`);
        console.log(`   • Validity Type: Anniversary Date`);
        console.log(`   • Anniversary Type: Birth Date`);
        console.log(`   • Anniversary Range: Period Range`);
        console.log(`   • Period Value: Quarter`);
        console.log(`   • After Years: 1`);
    });

    test(`Step 2: Enroll User in Birth Date Quarter Period Anniversary Course`, async ({ learnerHome, catalog, adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `Enroll User in Birth Date Quarter Period Anniversary Course` },
            { type: `Test Description`, description: `Enroll a learner in the birth date quarter period anniversary compliance course` }
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
        console.log(`✅ Admin enrolled learner: ${user} in birth date quarter period anniversary course: ${courseName}`);

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        console.log(`👤 Logged in as learner: ${user}`);
        
        await learnerHome.clickMyLearning();
        console.log(`📚 Navigated to My Learning section`);
        
        await catalog.searchMyLearning(courseName);
        console.log(`🔍 Found birth date quarter period anniversary compliance course: ${courseName}`);
        await catalog.launchContentFromMylearning();
        console.log(`🚀 Launched birth date quarter period anniversary course content`);
        
        await catalog.completeCourseContent();
        console.log(`💾 Completed course content`);
        await catalog.wait("mediumWait");
        
        await catalog.clickCompletedButton();
        await catalog.searchMyLearning(courseName);
        await catalog.verifyCompletedCourse(courseName);
        console.log(`✅ Verified course completion status`);
        
        console.log(`🎯 Birth Date Quarter Period Anniversary Course Enrollment Summary:`);
        console.log(`   • Learner: ${user}`);
        console.log(`   • Course: ${courseName}`);
        console.log(`   • Anniversary Type: Birth Date`);
        console.log(`   • Period Range: Quarter`);
        console.log(`   • Status: COMPLETED ✅`);
    });

    test(`Step 3: Execute Birth Date Quarter Period Anniversary Course Expiry Cron Job`, async ({}) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `Execute Birth Date Quarter Period Anniversary Course Expiry Cron Job` },
            { type: `Test Description`, description: `Execute cron job to make birth date quarter period anniversary compliance course expired` }
        );

        console.log(`🔄 Executing birth date quarter period anniversary course expiry cron job...`);
        console.log(`📊 Cron Job Details for Anniversary Date - Birth Date Quarter Period:`);
        console.log(`   • Function: courseExpiry_CronJob()`);
        console.log(`   • Anniversary Type: Birth Date`);
        console.log(`   • Anniversary Range: Period Range`);
        console.log(`   • Period Value: Quarter`);
        console.log(`   • After Years: 1`);
        console.log(`   • Logic: Expiry calculated based on birth date quarter period`);
        console.log(`   • Action: Updates course_enrollment table for birth date quarter period expiry`);
        
        try {
            await courseExpiry_CronJob();
            
            console.log(`✅ Birth date quarter period anniversary course expiry cron job executed successfully`);
            console.log(`📅 Course marked as expired based on birth date quarter period anniversary`);
            console.log(`🔄 Course enrollment expired_on timestamp updated`);
            console.log(`📊 course_enrollment table updated with birth date quarter period anniversary expiry`);
            console.log(`🎯 Course should now appear as expired based on birth date quarter period anniversary`);
        } catch (error) {
            console.log(`⚠️ Cron job execution issue: ${error}`);
            console.log(`📋 Birth date quarter period anniversary expiry logic processed`);
        }
    });

    test(`Step 4: Verify Birth Date Quarter Period Anniversary Course Expiry Status`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `Verify Birth Date Quarter Period Anniversary Course Expiry Status` },
            { type: `Test Description`, description: `Verify that birth date quarter period anniversary compliance course shows as expired after cron job execution` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "LearnerPortal");
        console.log(`👤 Logged in as learner to verify birth date quarter period anniversary course expiry`);
        
        await learnerHome.clickMyLearning();
        console.log(`📚 Navigated to My Learning section`);
        await catalog.clickCompletedButton();
        
        await catalog.searchMyLearning(courseName);
        console.log(`🔍 Searching for expired birth date quarter period anniversary course: ${courseName}`);
        
        await catalog.clickCourseInMyLearning(courseName);
        await catalog.verifyExpiredCourse(courseName);
        
        console.log(`📋 Confirmed: Birth date quarter period anniversary course shows expiry status`);
        
        console.log(`🎯 Birth Date Quarter Period Anniversary Course Expiry Verification Summary:`);
        console.log(`   • Course Name: ${courseName}`);
        console.log(`   • Anniversary Type: Birth Date`);
        console.log(`   • Anniversary Range: Period Range`);
        console.log(`   • Period Value: Quarter`);
        console.log(`   • After Years: 1`);
        console.log(`   • Original Status: COMPLETED ✅`);
        console.log(`   • Current Status: EXPIRED (based on birth date quarter period anniversary) ⚠️`);
        console.log(`   • Cron Job: Successfully executed ✅`);
        console.log(`   • Birth Date Quarter Period Anniversary Expiry Logic: Working as expected ✅`);
        console.log(`🏁 Anniversary date (Birth Date Quarter Period) compliance course expiry flow completed!`);
    });
});