import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from '../../../utils/fakerUtils';
import { updateCronDataJSON } from "../../../utils/jsonDataHandler";
import { courseEnrollmentOverdueCron } from "../DB/DBJobs";


const courseName = ("Cron" + FakerData.getCourseName());
test.describe(`Verify_that_for_the_compliance_course_when _the_complete_by_rule_is_set_as_overdue`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`E-learning course with Complete by rule as Overdue`, async ({ adminHome, createCourse ,learningPath }) => {
        const newData = {
            CRS007: courseName
        }
        updateCronDataJSON(newData)
        test.info().annotations.push(
            { type: `Author`, description: `Ajay Michael` },
            { type: `TestCase`, description: `E-learning course with Complete by rule as Overdue` },
            { type: `Test Description`, description: `Verify that E-learning course with Complete as Overdue` }

        );

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name :" + courseName);
       // await createCourse.clickregistrationEnds();
        await learningPath.registractionEnds();
        await createCourse.selectCompleteByRule();
        // await createCourse.selectDate();
        await createCourse.selectPostCompletebyOverDue();
        await createCourse.selectCompleteByDate();
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
    })


    test(`Ensure that the learner's status changes to Overdue if they have not met the specified completion date`, async ({ learnerHome, catalog }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Vidya` },
            { type: `TestCase`, description: `Ensure that the learner's status changes to Overdue if they have not met the specified completion date` },
            { type: `Test Description`, description: `Ensure that the learner's status changes to Overdue if they have not met the specified completion date` }
        );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "Default Portal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(courseName);
        await catalog.clickEnrollButton();
        await catalog.viewCoursedetails();


    })


    test(`Test to execute CRON JOB`, async ({ }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Ajay Michael` },
            { type: `TestCase`, description: `Test to execute CRON JOB` },
            { type: `Test Description`, description: `Verify the CRON Job` }
        );

         await courseEnrollmentOverdueCron();

    })

})


