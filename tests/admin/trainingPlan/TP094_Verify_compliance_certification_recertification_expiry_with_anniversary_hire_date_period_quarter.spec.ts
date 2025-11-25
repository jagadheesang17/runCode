import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { updateCronDataJSON } from "../../../utils/jsonDataHandler";
import { URLConstants } from "../../../constants/urlConstants";
import { certificationExpiry_CronJob } from "../DB/DBJobs";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const portal = URLConstants.portal1;

test.describe(`TPC094_Verify_compliance_certification_recertification_expiry_with_anniversary_hire_date_period_quarter`, async () => {
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

    const titleAnniversaryDate = ("COMPL_CERT_RECERT_HireDate_Quarter_" + FakerData.getCourseName());
    test(`Create compliance certification with Anniversary Date Hire Date Quarter and Recertification expiry`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create compliance certification with Anniversary Date Hire Date Quarter and Recertification expiry` },
            { type: `Test Description`, description: `Create compliance certification with expiry based on Hire Date, Period Range Quarter and recertification expiry` }
        );

        const newData = {
            TPC094: titleAnniversaryDate
        };
        updateCronDataJSON(newData);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(titleAnniversaryDate);
        await learningPath.description(description);
        await learningPath.language();
        await learningPath.clickAndSelectCompliance();
        await learningPath.hasRecertification();
        await learningPath.registractionEnds();

        console.log(`🔄 Setting expiration with Anniversary Date - Hire Date, Period Range, Quarter`);
        await learningPath.clickExpiresDropdown();
        await learningPath.clickExpiresButtonWithType("Anniversary Date", {
            anniversaryType: "hire date",
            anniversaryRange: "Period Range",
            period: "Quarter",
            periodYears: "1"
        });

        await learningPath.clickAndSelectCompleteByRule();
        await learningPath.clickSaveAsDraftBtn();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();

        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();

        await learningPath.clickDetailTab();
        console.log(`🔄 Setting recertification expiry with Anniversary Date - Hire Date, Period Range, Quarter`);
        await learningPath.clickReCertExpiresDropdown();
        await learningPath.clickReCertExpiresButtonWithType("Anniversary Date", {
            anniversaryType: "Hire date",
            anniversaryRange: "Period Range",
            period: "Quarter",
            periodYears: "1"
        });
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

        console.log(`✅ Successfully created compliance certification with recertification: ${titleAnniversaryDate}`);
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
        await catalog.searchCatalog(titleAnniversaryDate);
        await catalog.clickEnrollButton();
        await catalog.clickViewCertificationDetails();
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.clickViewCertificate();

        console.log(`✅ Learner completed compliance certification: ${titleAnniversaryDate}`);
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
        await dashboard.searchCertification(titleAnniversaryDate);
        await dashboard.verifyTheEnrolledCertification(titleAnniversaryDate);
        await dashboard.clickTitle(titleAnniversaryDate);
        await catalog.verifyStatus("Expired");
        console.log(`✅ Successfully verified compliance certification expired status: ${titleAnniversaryDate}`);
        
        await catalog.clickRecertifyButton();
        await catalog.verifyStatus("Enrolled");
        await catalog.verifytpCourseStatus(titleAnniversaryDate, "Enrolled");
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.verifyStatus("Completed");
        console.log(`✅ Successfully completed recertification: ${titleAnniversaryDate}`);
        
        await certificationExpiry_CronJob();
        console.log(`✅ Recertification expiry cron job executed successfully`);
        
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.searchCertification(titleAnniversaryDate);
        await dashboard.clickTitle(titleAnniversaryDate);
        await catalog.verifyStatus("Expired");
        console.log(`✅ Successfully verified recertification expired status: ${titleAnniversaryDate}`);
    });
});
