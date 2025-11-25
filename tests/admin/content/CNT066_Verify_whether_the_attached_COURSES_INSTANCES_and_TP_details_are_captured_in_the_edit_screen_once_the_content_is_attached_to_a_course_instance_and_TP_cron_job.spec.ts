import { credentialConstants } from "../../../constants/credentialConstants";
import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from '../../../utils/fakerUtils';
import { updateCronDataJSON } from "../../../utils/jsonDataHandler";
import { contentVersionStatistics } from "../DB/DBJobs";
import { credentials } from "../../../constants/credentialData";
import { ca } from "date-fns/locale";
import { CatalogPage } from "../../../pages/CatalogPage";



let courseName: any = "";
let title: any = "";
let TPName: any = "";
let code: any = "";
const description = FakerData.getDescription();
test.describe(`Verify whether the attached COURSES/INSTANCES and TP details are captured in the edit screen once the content is attached to a course/instance and TP(cron job)`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`E-learning course with Complete by rule as Overdue`, async ({ adminHome, createCourse, contentHome, bannerHome, enrollHome }) => {

        test.info().annotations.push(
            { type: `Author`, description: `DIVYA   ` },
            { type: `TestCase`, description: `E-learning course with Complete by rule` },
            { type: `Test Description`, description: `Verify that E-learning course with Complete by rule` }

        );

        courseName = FakerData.getCourseName();
        title = FakerData.getRandomTitle();
        await adminHome.loadAndLogin("LEARNERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickContentmenu();
        await contentHome.clickCreateContent();
        await contentHome.enter("content-title", title);
        await contentHome.enterDescription("Sample video content for " + title);
        await contentHome.uploadContent("samplevideo.mp4");
        await bannerHome.clickPublish();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name :" + courseName);
        await createCourse.contentLibrary(title);
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();

    })
    test(`Learning_Path_single_instance`, async ({ adminHome, learningPath, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `Learning_Path_single_instance` },
            { type: `Test Description`, description: `Learning_Path_single_instance` }
        )

        await adminHome.loadAndLogin("LEARNERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
        TPName = FakerData.getCourseName();
        await learningPath.title(TPName);
        await learningPath.description(description);
        code = await learningPath.getCodeValue();
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
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectByOption("Learning Path");
        await enrollHome.selectBycourse(TPName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();

    })


    test(`Test to execute CRON JOB to update content version statistics`, async ({ }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `Test to execute CRON JOB` },
            { type: `Test Description`, description: `Verify the CRON Job` }
        );
        await contentVersionStatistics();

    })

    test(`Verify whether the attached COURSES/INSTANCES and TP details are captured in the edit screen once the content is attached to a course/instance and TP`, async ({ adminHome, contentHome, bannerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `Test to execute CRON JOB` },
            { type: `Test Description`, description: `Verify the CRON Job` }
        );
        await adminHome.loadAndLogin("LEARNERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickContentmenu();
        await contentHome.contentVisiblity(title);
        await contentHome.clickEditContentOnListing();
        // courseName=courseName.toUpperCase();
        // console.log("Course Name is "+courseName);
        await contentHome.verifyAttachedCourses(courseName);
        await contentHome.verifyAttachedTrainingPlan("LPT-00345");




    })

})