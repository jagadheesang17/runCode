import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from '../../../utils/fakerUtils';
import { bulkMailDispatcherCron, expiryRemainder_cronjob } from "../DB/DBJobs";



const courseName = FakerData.getCourseName();
const description = FakerData.getDescription()
let email: any

test.describe(`Verify that enrollment and completed notification working as expected for single instance Elearning`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Creation of Single Instance Elearning with Youtube content`, async ({ adminHome, contentHome, learningPath, createCourse }) => {
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
        await createCourse.clickregistrationEndsByTodayDate();
        await createCourse.selectCompliance();
        await learningPath.clickExpiresButton();
        await createCourse.selectCompleteBy();
        await createCourse.selectCompleteByTodayDate();
        await createCourse.contentLibrary();//Youtube content is attached here
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
    })
    test(`Verify that expiry remainder  notification working as expected for single instance`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Confirm that YouTube content functions correctly and as expected` },
            { type: `Test Description`, description: `Confirm that YouTube content functions correctly and as expected` }
        );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        //await learnerHome.termsAndConditionScroll();
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(courseName);
        await catalog.clickMoreonCourse(courseName);
        await catalog.clickSelectcourse(courseName);
        await catalog.clickEnroll();
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.clickMyLearning();
        await catalog.clickCompletedButton();
        await catalog.searchMyLearning(courseName);
    })
    test(`Test to execute CRON JOB`, async ({ adminHome }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Test to execute CRON JOB` },
            { type: `Test Description`, description: `Verify the CRON Job` }
        );

        await expiryRemainder_cronjob('course');
        const [mailBody, mailSubject] = await bulkMailDispatcherCron();
        await adminHome.verifyMailBody(mailBody, courseName)
        await adminHome.verifyMailSubject(mailSubject, "Remainder")
    })

})
