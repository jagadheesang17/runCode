import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
import { updateCronDataJSON } from "../../utils/jsonDataHandler";
import { URLConstants } from "../../constants/urlConstants";
import { certificationExpiry_CronJob, nonComplianceCertificationExpiry_CronJob } from "../admin/DB/DBJobs";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const portal = URLConstants.portal1;

test.describe(`EA018_Certification_Recertification_Expires_On_Enroll_Again`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Check_Site_Admin_Enroll_Again_Setting`, async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Check Site Admin Enroll Again Setting` },
            { type: `Test Description`, description: `Ensure site admin level enroll again setting is enabled` }
        );

 
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await adminHome.siteAdmin_Adminconfig();
        await siteAdmin.clickBusinessRulesEditIcon();
        await siteAdmin.checkAllowLearnersEnrollAgainDefault();
        await siteAdmin.verifyAllowLearnersEnrollAgainDefault(false);
        console.log(`✅ Site Admin enroll again setting is checked`);
    });

    test(`Create_E-learning_Course_For_Certification`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create E-learning Course For Certification` },
            { type: `Test Description`, description: `Create single instance E-learning course to be attached to certification` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.contentLibrary(); // Default YouTube content will be attached
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Successfully created course: ${courseName}`);
    });

    const titleSpecificDate = ("CERT_EnrollAgain_SpecificDate_" + FakerData.getCourseName());
    test(`Create_Certification_With_Specific_Date_Expiration`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create Certification With Specific Date Expiration` },
            { type: `Test Description`, description: `Create certification with expiry based on specific date and recertification with expires on` }
        );

        const newData = {
            TP067: titleSpecificDate
        };
        updateCronDataJSON(newData);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(titleSpecificDate);
        await learningPath.description(description);
        await learningPath.language();
        await learningPath.hasRecertification();

        // Set expiration with Specific Date
        console.log(`🔄 Setting expiration with Specific Date`);
        await learningPath.clickExpiresDropdown();
        await learningPath.clickExpiresButtonWithType("Specific Date");

        await learningPath.clickSaveAsDraftBtn();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();

        // Add course to certification
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();

        // Add recertification course
        await learningPath.clickDetailTab();
        // Set recertification expiry with Specific Date
        console.log(`🔄 Setting recertification expiry with Specific Date`);
        await learningPath.clickReCertExpiresDropdown();
        await learningPath.clickReCertExpiresButtonWithType("Specific Date");
        await learningPath.addRecertificationCourse();
        await learningPath.chooseRecertificationMethod("Copy from certification path");
        await learningPath.saveRecertification(courseName);
        await learningPath.description(description);
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        console.log(`✅ Successfully created certification with Specific Date expiration: ${titleSpecificDate}`);
    });

    test(`Learner_Enroll_And_Complete_Certification`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Learner Enroll And Complete Certification` },
            { type: `Test Description`, description: `Learner enrolls, completes certification, and receives certificate` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "Default");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(titleSpecificDate);
        await catalog.clickEnrollButton();
        await catalog.clickViewCertificationDetails();
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        console.log(`✅ Learner completed certification with Specific Date: ${titleSpecificDate}`);
    });

    test(`Run_Cron_Job_To_Expire_Certification`, async ({ }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Run Cron Job To Expire Certification` },
            { type: `Test Description`, description: `Execute certification expiry cron job to process expiration logic for specific date` }
        );

        await certificationExpiry_CronJob();
        console.log(`✅ Certification expiry cron job executed successfully for Specific Date`);
    });

    test(`Verify_Certification_Expired_And_Click_Recertify`, async ({ learnerHome, dashboard, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify Certification Expired And Click Recertify` },
            { type: `Test Description`, description: `Verify that certification shows expired status, click recertify, complete recertification, and verify recertify button appears again` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.searchCertification(titleSpecificDate);
        await dashboard.verifyTheEnrolledCertification(titleSpecificDate);
        await dashboard.clickTitle(titleSpecificDate);
        await catalog.verifyStatus("Expired");
        console.log(`✅ Successfully verified certification expired status: ${titleSpecificDate}`);
        
        // Click Recertify button
        await catalog.clickRecertifyButton();
        await catalog.verifyStatus("Enrolled");
        await catalog.verifytpCourseStatus(titleSpecificDate, "Enrolled");
        
        // Complete recertification
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.verifyStatus("Completed");
        console.log(`✅ Successfully completed recertification: ${titleSpecificDate}`);
    });

    test(`Run_Cron_Job_Again_To_Expire_Recertification`, async ({ }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Run Cron Job Again To Expire Recertification` },
            { type: `Test Description`, description: `Execute certification expiry cron job again to expire recertification` }
        );

        await certificationExpiry_CronJob();
        console.log(`✅ Certification expiry cron job executed successfully again`);
    });

    test(`Verify_Recertify_Button_Visible_Again_After_Second_Expiry`, async ({ learnerHome, dashboard, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify Recertify Button Visible Again After Second Expiry` },
            { type: `Test Description`, description: `Verify that after second expiry, recertify button is visible again since recertification has expires on date` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.searchCertification(titleSpecificDate);
        await dashboard.verifyTheEnrolledCertification(titleSpecificDate);
        await dashboard.clickTitle(titleSpecificDate);
        await catalog.verifyStatus("Expired");
        console.log(`✅ Successfully verified certification expired status again: ${titleSpecificDate}`);
        
        // Verify Recertify button is visible again
        await catalog.clickRecertifyButton();
        console.log(`✅ Successfully verified recertify button is visible again after second expiry`);
    });
});
