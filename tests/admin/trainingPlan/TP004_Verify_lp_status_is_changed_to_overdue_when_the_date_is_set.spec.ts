import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { updateCronDataJSON } from "../../../utils/jsonDataHandler";
import { programEnrollmentCron } from "../DB/DBJobs";

let courseName = FakerData.getCourseName();
const description = FakerData.getDescription();

test.describe(`Verify_certification_status_is_changed_to_overdue_when_the_date_is_set.spec.ts`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Creation of Elearning`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Creation of Elearning` },
            { type: `Test Description`, description: `Verify that course should be created successfully` }
        );

        const newData = {
            TP004a: courseName
        }
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course,:" + description);
        await createCourse.contentLibrary();  //Defalut Youtube content will be added to the course
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

    })
    let title = ("LP_overdue" + " " + FakerData.getCourseName());

    test(`Learning_Path__single_instance`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Learning_Path__single_instance` },
            { type: `Test Description`, description: `Learning_Path__single_instance` }
        )

        const newData = {
            TP004: title
        }
        updateCronDataJSON(newData)
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
        await learningPath.title(title);
        await learningPath.description(description);
        await learningPath.language();
        await createCourse.clickregistrationEnds();
        await createCourse.selectCompleteByRule();
        // await createCourse.selectDate();
        await createCourse.selectCompleteByDate();
        await createCourse.selectPostCompletebyOverDue();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
    })

    test(`Verify LP enroll flow in the learner side`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Verify LP enroll flow in the learner side` },
            { type: `Test Description`, description: `Verify LP enroll flow in the learner side` }

        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        //await catalog.searchCatalog("LPT-00083");
        await catalog.searchCatalog(title);
        await catalog.clickEnrollButton();
        await catalog.clickViewLearningPathDetails();

    })

    test(`Test to execute CRON JOB`, async ({ }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Test to execute CRON JOB` },
            { type: `Test Description`, description: `Verify the CRON Job` }
        );

        await programEnrollmentCron();

    })
})