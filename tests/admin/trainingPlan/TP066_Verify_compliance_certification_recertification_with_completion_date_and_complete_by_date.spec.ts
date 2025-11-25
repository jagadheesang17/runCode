import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { updateCronDataJSON } from "../../../utils/jsonDataHandler";
import { URLConstants } from "../../../constants/urlConstants";
import { certificationExpiry_CronJob } from "../DB/DBJobs";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const portal = URLConstants.portal1;

test.describe(`TP089_Verify_compliance_certification_recertification_with_completion_date_and_complete_by_date`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Create E-learning course for compliance certification`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create E-learning course for compliance certification` },
            { type: `Test Description`, description: `Create single instance E-learning course to be attached to compliance certification` }
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
        console.log(`✅ Successfully created course: ${courseName}`);
    });

    const titleCompletionDate = ("COMPL_CERT_RECERT_CompDate_CompleteByDate_" + FakerData.getCourseName());
    test(`Create compliance certification with Completion Date and Recertification Complete By Date`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create compliance certification with Completion Date expiry and Recertification Complete By Date` },
            { type: `Test Description`, description: `Create compliance certification with Completion Date (1 Day) expiry and recertification complete by Date rule` }
        );

        const newData = {
            TP089: titleCompletionDate
        };
        updateCronDataJSON(newData);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(titleCompletionDate);
        await learningPath.description(description);
        await learningPath.language();
        await learningPath.clickAndSelectCompliance();
        await learningPath.hasRecertification();
        await learningPath.registractionEnds();

        console.log(`🔄 Setting expiration with Completion Date - 1 Day`);
        await learningPath.clickExpiresDropdown();
        await learningPath.clickExpiresButton();

        await learningPath.clickAndSelectCompleteByRule();
        await learningPath.clickSaveAsDraftBtn();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();

        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();

        await learningPath.clickDetailTab();
        console.log(`🔄 Setting recertification expiry with Completion Date - 1 Day`);
        await learningPath.clickReCertExpiresButton();
        console.log(`🔄 Setting recertification complete by rule: Date`);
        await learningPath.clickAndSelectRecertCompleteByRule("Date");
        await learningPath.addRecertificationCourse();
        await learningPath.chooseRecertificationMethod("Copy from certification path");
        await learningPath.saveRecertification(courseName);
        await learningPath.description(description);
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();

        await learningPath.clickEditCertification();
        await createCourse.clickCompletionCertificate();
        await createCourse.clickCertificateCheckBox();
        await createCourse.clickAdd();
        await learningPath.description(description);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

        console.log(`✅ Successfully created compliance certification with recertification: ${titleCompletionDate}`);
    });

    test(`Verify learner can enroll and complete compliance certification`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify learner enrollment and completion` },
            { type: `Test Description`, description: `Learner enrolls, completes compliance certification, and receives certificate` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "Default");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(titleCompletionDate);
        await catalog.clickEnrollButton();
        await catalog.clickViewCertificationDetails();
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.clickViewCertificate();

        console.log(`✅ Learner completed compliance certification: ${titleCompletionDate}`);
    });

    test(`Run cron job to verify compliance certification expiry`, async ({ }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Run cron job to make compliance certification expire` },
            { type: `Test Description`, description: `Execute certification expiry cron job` }
        );

        await certificationExpiry_CronJob();
        console.log(`✅ Certification expiry cron job executed successfully`);
    });

    test(`Verify compliance certification expired and complete recertification then verify recertification expiry`, async ({ learnerHome, dashboard, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify compliance certification expired and recertification expiry` },
            { type: `Test Description`, description: `Verify certification expired, complete recertification, run cron, verify recertification expired` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.searchCertification(titleCompletionDate);
        await dashboard.verifyTheEnrolledCertification(titleCompletionDate);
        await dashboard.clickTitle(titleCompletionDate);
        await catalog.verifyStatus("Expired");
        console.log(`✅ Successfully verified compliance certification expired status: ${titleCompletionDate}`);
        
        await catalog.clickRecertifyButton();
        await catalog.verifyStatus("Enrolled");
        await catalog.verifytpCourseStatus(titleCompletionDate, "Enrolled");
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.verifyStatus("Completed");
        console.log(`✅ Successfully completed recertification: ${titleCompletionDate}`);
        
        await certificationExpiry_CronJob();
        console.log(`✅ Recertification expiry cron job executed successfully`);
        
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.searchCertification(titleCompletionDate);
        await dashboard.clickTitle(titleCompletionDate);
        await catalog.verifyStatus("Expired");
        console.log(`✅ Successfully verified recertification expired status: ${titleCompletionDate}`);
    });
});
