import { test } from "../../../../customFixtures/expertusFixture";
import { FakerData } from "../../../../utils/fakerUtils";
import { updateCronDataJSON } from "../../../../utils/jsonDataHandler";
import { URLConstants } from "../../../../constants/urlConstants";
import { nonComplianceCertificationExpiry_CronJob } from "../../DB/DBJobs";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const portal = URLConstants.portal1;

test.describe(`TP067_Verify_certification_expiration_with_specific_date`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Create E-learning course for certification`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create E-learning course for certification` },
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
        await createCourse.selectDomainOption(portal);
        await createCourse.contentLibrary(); // Default YouTube content will be attached
        await createCourse.clickHere();
        await createCourse.selectImage();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Successfully created course: ${courseName}`);
    });

    const titleSpecificDate = ("CERT_SpecificDate_" + FakerData.getCourseName());
    test(`Create certification with Specific Date expiration`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create certification with Specific Date expiration` },
            { type: `Test Description`, description: `Create certification with expiry based on specific date` }
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

        // Add completion certificate
        await learningPath.clickEditCertification();
        await createCourse.clickCompletionCertificate();
        await createCourse.clickCertificateCheckBox();
        await createCourse.clickAdd();
        await learningPath.description(description);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

        console.log(`✅ Successfully created certification with Specific Date expiration: ${titleSpecificDate}`);
    });

    test(`Verify learner can enroll and complete certification with Specific Date expiry`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify learner enrollment and completion for Specific Date certification` },
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
        await catalog.clickViewCertificate();

        console.log(`✅ Learner completed certification with Specific Date: ${titleSpecificDate}`);
    });

    test(`Run cron job to verify certification expiry`, async ({ }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Run cron job to make certification expire` },
            { type: `Test Description`, description: `Execute certification expiry cron job to process expiration logic for specific date` }
        );

        await nonComplianceCertificationExpiry_CronJob();
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
        await dashboard.searchCertification(titleSpecificDate);
        await dashboard.verifyTheEnrolledCertification(titleSpecificDate);
        await dashboard.clickTitle(titleSpecificDate);
        await catalog.verifyStatus("Expired");
        console.log(`✅ Successfully verified certification expired status: ${titleSpecificDate}`);
        await catalog.clickRecertifyButton();
        await catalog.verifyStatus("Enrolled");
        await catalog.verifytpCourseStatus(titleSpecificDate, "Enrolled"); //TP particular course status
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.verifyStatus("Completed");
        console.log(`✅ Successfully completed recertification: ${titleSpecificDate}`);
    });
});
