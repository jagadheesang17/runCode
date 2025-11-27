import { credentials } from "../../../constants/credentialData";
import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { mailDispatcherCron, notificationCron } from "../DB/DBJobs";

let learningPathName = "LP" + " " + FakerData.getCourseName();
let description = FakerData.getDescription();
let createdCode: any;
const courseName = FakerData.getCourseName();
test.describe(`Verify that enrollment and completed notification working as expected on Admin Enrollment for Learning Path`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Creation of Single Instance Elearning with Youtube content`, async ({ adminHome, createCourse, enrollHome, contentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Creation of Single Instance Elearning with Youtube content` },
            { type: `Test Description`, description: `Creation of Single Instance Elearning with Youtube content` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name :" + description);
        await createCourse.contentLibrary();//Youtube content is attached here
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
    })
    test(`Creation of Learning Path instance`, async ({ adminHome, contentHome, learningPath, createCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create the Learning Path as Single instance` },
            { type: `Test Description`, description: `Create the Learning Path as Single instance` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
        await learningPath.title(learningPathName);
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
        await contentHome.gotoListing();
        await createCourse.catalogSearch(learningPathName)
        createdCode = await createCourse.retriveCode()
        console.log("Extracted Code is : " + createdCode);
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectByOption("Learning Path");
        await enrollHome.selectBycourse(learningPathName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
    });

    test(`Test to execute CRON JOB for Learning Path Registered`, async ({ adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Test to execute CRON JOB for Learning Path Registered` },
            { type: `Test Description`, description: `Verify the CRON Job for Learning Path Registered` }
        );
        await notificationCron();
        const [mailBody, mailSubject] = await mailDispatcherCron();
        await adminHome.verifyTPEnrollmentMailBody(mailBody, learningPathName);
        await adminHome.verifyMailSubject(mailSubject, "Registered");
    });

    test(`Admin marks Learning Path as Completed`, async ({ adminHome, createUser, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Admin marks Learning Path as Completed` },
            { type: `Test Description`, description: `Admin marks Learning Path as Completed` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.userSearchField(credentials.LEARNERUSERNAME.username);
        await createUser.clickEnrollmentIcon();
        await createUser.verifyEnrollmentLabel();
        await enrollHome.changeEnrollmentStatus(createdCode, "Completed");
        await enrollHome.completionDateInAdminEnrollment();
        await enrollHome.verifytoastMessage();
    });

    test(`Test to execute CRON JOB for Learning Path Completed`, async ({ adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Test to execute CRON JOB for Learning Path Completed` },
            { type: `Test Description`, description: `Verify the CRON Job for Learning Path Completed` }
        );
        await notificationCron();
        const [mailBody, mailSubject] = await mailDispatcherCron("TP");
        await adminHome.verifyMailBody(mailBody, learningPathName);
        await adminHome.verifyMailSubject(mailSubject, "Completed");
    });

    test(`Verify that learner can see completed Learning Path in My Learning`, async ({ learnerHome, catalog, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify learner can see completed Learning Path in My Learning` },
            { type: `Test Description`, description: `Verify learner can see completed Learning Path in My Learning` }
        );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickMoreonTP(learningPathName);
        await catalog.verifyStatus("Completed");
    });
});
