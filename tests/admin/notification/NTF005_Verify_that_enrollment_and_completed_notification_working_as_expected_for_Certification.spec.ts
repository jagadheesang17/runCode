import { credentials } from "../../../constants/credentialData";
import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { mailDispatcherCron, notificationCron } from "../DB/DBJobs";
const courseName = ("EL for" + " " + FakerData.getCourseName());
const description = FakerData.getDescription();

test.describe(`Verify that enrollment and completed notification working as expected for Certification`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Creation of Single Instance ELearning course`, async ({ adminHome, createCourse, createUser, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Creation of Single Instance ELearning course` },
            { type: `Test Description`, description: `Creation of Single Instance ELearning course` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course,:" + description);
        await createCourse.contentLibrary(); //By default Youtube content will be attached to the course
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
    })
    let title = ("LP for" + " " + FakerData.getCourseName());
    test(`Creation of Certification`, async ({ adminHome, contentHome, learningPath, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify_Certification__single_instance` },
            { type: `Test Description`, description: `Creating Certification single instance` }
        )

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(title);
        await learningPath.description(description);
        await learningPath.language();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        await learningPath.clickEditCertification();
        await createCourse.clickCompletionCertificate();
        await createCourse.clickCertificateCheckBox();
        await createCourse.clickAdd();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

    })
    test(`Confirm that a learner can successfully register for created Certification`, async ({ learnerHome, catalog }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Confirm that a learner can successfully register for created Certification` },
            { type: `Test Description`, description: `Confirm that a learner can successfully register for created Certification` }

        );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.searchCatalog(title);
        await catalog.clickMoreonCourse(title)
        await catalog.clickEnroll();

    })
    test(`Test to execute CRON JOB`, async ({ adminHome }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Test to execute CRON JOB` },
            { type: `Test Description`, description: `Verify the CRON Job` }
        );

        await notificationCron();
        const [mailBody, mailSubject] = await mailDispatcherCron("TP");
        await adminHome.verifyMailBody(mailBody, title)
        await adminHome.verifyMailSubject(mailSubject, "Registered")
    })


    test(`Confirm that a learner can successfully register the Certification`, async ({ learnerHome, catalog, dashboard }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Confirm that a learner can successfully register the Certification` },
            { type: `Test Description`, description: `Certification should be available in the enrolled tab` }

        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.clickMoreonTP(title);
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
    })

    test(`Test to execute CRON JOB for completed`, async ({ adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Test to execute CRON JOB` },
            { type: `Test Description`, description: `Verify the CRON Job` }
        );
        await notificationCron();
        const [mailBody, mailSubject] = await mailDispatcherCron();
        await adminHome.verifyMailBody(mailBody, title)
        await adminHome.verifyMailSubject(mailSubject, "Completed")
    })

})