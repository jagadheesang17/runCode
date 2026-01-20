import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
import { URLConstants } from "../../constants/urlConstants";
import { certificationExpiry_CronJob, nonComplianceCertificationExpiry_CronJob } from "../admin/DB/DBJobs";

const courseName = FakerData.getCourseName();
const certificationName = FakerData.getCourseName() + "_CERT";
const description = FakerData.getDescription();
const portal = URLConstants.portal1;

test.describe(`EA017_Certification_Recertification_Enroll_Again_Restriction`, async () => {
    test.describe.configure({ mode: 'serial' });

    test(`Verify_Site_Admin_Enroll_Again_Unchecked`, async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify_Site_Admin_Enroll_Again_Unchecked` },
            { type: `Test Description`, description: `Uncheck site admin enroll again setting` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await adminHome.siteAdmin_Adminconfig();
        await siteAdmin.clickBusinessRulesEditIcon();
        await siteAdmin.uncheckAllowLearnersEnrollAgainDefault();
        await siteAdmin.verifyAllowLearnersEnrollAgainDefault(true);
    });

    test(`Create_Course_With_Enroll_Again_Unchecked`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create_Course_With_Enroll_Again_Unchecked` },
            { type: `Test Description`, description: `Create E-learning course with enroll again unchecked` }
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
        await createCourse.selectDomainOption(portal);
        await createCourse.contentLibrary();
        await createCourse.clickHere();
        await createCourse.selectImage();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await createCourse.clickEditCourseTabs();
        await editCourse.clickBusinessRule();
        await editCourse.verifyAllowLearnersEnrollAgain(true); // Verify unchecked
        await createCourse.typeDescription("Business Rule verified for " + courseName);
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    });

    test(`Create_Certification_Verify_Recert_Popup_Then_Enable_Enroll_Again`, async ({ adminHome, learningPath, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create_Certification_Verify_Recert_Popup_Then_Enable_Enroll_Again` },
            { type: `Test Description`, description: `Create certification, verify recertification popup, enable enroll again, then add recertification` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(certificationName);
        await learningPath.description(description);
        await learningPath.language();
        await learningPath.hasRecertification();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();

        // Add course to certification
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        // Try to add recertification course
        await learningPath.addRecertificationCourse();
        await learningPath.chooseRecertificationMethod("Copy from certification path");
        
        // Verify recertification popup message
        await learningPath.verifyRecertEnrollAgainPopupMessage();
        await learningPath.verifyRecertEnrollAgainPopupCourseName(courseName);
        await learningPath.clickRecertEnrollAgainPopupOK();

        // Go back to course and enable enroll again
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.searchCourse(courseName);
        await createCourse.clickEditIcon();
        await editCourse.clickBusinessRule();
        await editCourse.verifyAllowLearnersEnrollAgain(true); // Verify unchecked
        await editCourse.checkAllowLearnersEnrollAgain(); // Check enroll again
        await editCourse.verifyAllowLearnersEnrollAgain(false); // Verify checked
        await createCourse.typeDescription("Enabled enroll again for " + courseName);
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

        // Go back to certification and add recertification
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await createCourse.searchCourse(certificationName);
        await learningPath.clickEditIconFromTPListing(certificationName);
        // Now add recertification course successfully
        await learningPath.addRecertificationCourse();
        await learningPath.chooseRecertificationMethod("Copy from certification path");
        await learningPath.saveRecertification(courseName);
        await learningPath.description(description);
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();

        // Add completion certificate
        await learningPath.clickEditCertification();
        await createCourse.clickCompletionCertificate();
        await createCourse.clickCertificateCheckBox();
        await createCourse.clickAdd();
        await learningPath.description(description);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    });


    test(`Verification_From_Learner_Site`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verification_From_Learner_Site` },
            { type: `Test Description`, description: `Verify learner can enroll and complete certification` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "Default");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(certificationName);
        await catalog.clickEnrollButton();
        await catalog.clickViewCertificationDetails();
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.clickViewCertificate();
        console.log(`✅ Learner completed certification: ${certificationName}`);
    });

    
    test(`Run cron job to verify certification expiry`, async ({ }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Run cron job to make certification expire` },
            { type: `Test Description`, description: `Execute certification expiry cron job to process expiration logic for specific date` }
        );

        await certificationExpiry_CronJob();
        console.log(`✅ Certification expiry cron job executed successfully for Specific Date`);
    });

        test(`Verify certification has expired status after cron execution`, async ({ learnerHome, dashboard, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify certification expired status` },
            { type: `Test Description`, description: `Verify that certification shows expired status in learner dashboard after cron job execution` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.searchCertification(certificationName);
        await dashboard.verifyTheEnrolledCertification(certificationName);
        await dashboard.clickTitle(certificationName);
        await catalog.verifyStatus("Expired");
        console.log(`✅ Successfully verified certification expired status: ${certificationName}`);
        await catalog.clickRecertifyButton();
        await catalog.verifyStatus("Enrolled");
        await catalog.verifytpCourseStatus(certificationName, "Enrolled"); //TP particular course status
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.verifyStatus("Completed");
        await catalog.verifyRecertifyButtonNotVisible();
        console.log(`✅ Successfully completed recertification: ${certificationName}`);
    });
});
