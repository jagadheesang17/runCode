import { credentialConstants } from "../../../constants/credentialConstants";
import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from '../../../utils/fakerUtils';
import { updateCronDataJSON } from "../../../utils/jsonDataHandler";
import { courseEnrollmentIncompleteCron, updateSingleInstanceAutoRegister } from "../DB/DBJobs";



const courseName = ("Cron " + FakerData.getCourseName());
const user = credentialConstants.LEARNERUSERNAME
test.describe(`Verify that able to create a E-learning course with Complete by rule as incomplete`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`E-learning course with Complete by rule as incomplete`, async ({ adminHome, createCourse, editCourse, createUser }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Vidya` },
            { type: `TestCase`, description: `E-learning course with Complete by rule` },
            { type: `Test Description`, description: `Verify that E-learning course with Complete by rule` }

        );

        const newData = {
            CRS006: courseName
        }
        updateCronDataJSON(newData);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name :" + courseName);
        await createCourse.clickregistrationEnds();
        await createCourse.selectCompleteByRule();
        await createCourse.selectCompleteByDate();
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        // await createCourse.editcourse();
        // await editCourse.clickAccesstab();
        // await createCourse.addSingleLearnerGroup(user);
        // await createCourse.saveAccessButton();
        // await editCourse.clickClose();
        // await editCourse.clickAccessSetting();
        // await editCourse.setCourseMandatory();
        // await createCourse.clickSave();
        // await createCourse.clickCatalog();
        // await createCourse.clickUpdate();
        // await createCourse.verifySuccessMessage()
    })


    
    test(`Ensure that the learner's status changes to Incomplete if they have not met the specified completion date.`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Ajay Michael` },
            { type: `TestCase`, description: `Ensure that the learner's status changes to Incomplete if they have not met the specified completion date` },
            { type: `Test Description`, description: `Ensure that the learner's status changes to Incomplete if they have not met the specified completion date` }
        );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(courseName);
        await catalog.clickMoreonCourse(courseName);
        await catalog.clickSelectcourse(courseName);
        await catalog.clickEnroll();
    
    })


    test(`Test to execute CRON JOB`, async ({ }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Ajay Michael` },
            { type: `TestCase`, description: `Test to execute CRON JOB` },
            { type: `Test Description`, description: `Verify the CRON Job` }
        );
        await courseEnrollmentIncompleteCron();

    })


})