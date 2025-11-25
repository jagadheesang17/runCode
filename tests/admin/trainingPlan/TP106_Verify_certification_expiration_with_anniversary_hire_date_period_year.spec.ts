import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { updateCronDataJSON } from "../../../utils/jsonDataHandler";
import { URLConstants } from "../../../constants/urlConstants";
import { certificationExpiry_CronJob } from "../DB/DBJobs";

const courseName = FakerData.getCourseName();
const recertificationCourseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const portal = URLConstants.portal1;

test.describe(`TP074_Verify_certification_expiration_with_anniversary_hire_date_period_year`, async () => {
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
        await createCourse.contentLibrary();
        await createCourse.clickHere();
        await createCourse.selectImage();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Successfully created course: ${courseName}`);
    });

    test(`Create E-learning course for recertification`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create E-learning course for recertification` },
            { type: `Test Description`, description: `Create single instance E-learning course to be attached to recertification manually` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", recertificationCourseName);
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
        console.log(`✅ Successfully created recertification course: ${recertificationCourseName}`);
    });

    const titleAnniversaryDate = ("CERT_HireDate_Year_" + FakerData.getCourseName());
    test(`Create certification with Anniversary Date - Hire Date, Period Range Year`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create certification with Anniversary Date - Hire Date, Period Range Year` },
            { type: `Test Description`, description: `Create certification with expiry based on Hire Date, Period Range, Year, 1 year` }
        );

        const newData = {
            TP074: titleAnniversaryDate
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
        await learningPath.hasRecertification();
        
        console.log(`🔄 Setting expiration with Anniversary Date - Hire Date, Period Range, Year`);
        await learningPath.clickExpiresDropdown();
        await learningPath.clickExpiresButtonWithType("Anniversary Date", {
            anniversaryType: "hire date",
            anniversaryRange: "Period Range",
            period: "Year",
            periodYears: "1"
        });
        
        await learningPath.clickSaveAsDraftBtn();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        
        await learningPath.clickDetailTab();
        await learningPath.addRecertificationCourse();
        await learningPath.chooseRecertificationMethod("Add Courses Manually");
        await learningPath.searchAndClickCourseCheckBox(recertificationCourseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.saveRecertification(recertificationCourseName);
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
        
        console.log(`✅ Successfully created certification: ${titleAnniversaryDate}`);
    });

    test(`Verify learner can enroll and complete certification`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify learner enrollment and completion` },
            { type: `Test Description`, description: `Learner enrolls, completes certification, and receives certificate` }
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
        
        console.log(`✅ Learner completed certification: ${titleAnniversaryDate}`);
    });

    test(`Run cron job to verify certification expiry`, async ({ }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Run cron job to make certification expire` },
            { type: `Test Description`, description: `Execute certification expiry cron job` }
        );

        await certificationExpiry_CronJob();
        console.log(`✅ Certification expiry cron job executed successfully`);
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
        await dashboard.searchCertification(titleAnniversaryDate);
        await dashboard.verifyTheEnrolledCertification(titleAnniversaryDate);
        await dashboard.clickTitle(titleAnniversaryDate);
        await catalog.verifyStatus("Expired");
        console.log(`✅ Successfully verified certification expired status: ${titleAnniversaryDate}`);
    });
});
