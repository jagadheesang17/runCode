import { credentialConstants } from "../../../constants/credentialConstants";
import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from '../../../utils/fakerUtils';
import { updateCronDataJSON } from "../../../utils/jsonDataHandler";
import { courseEnrollmentOverdueCron, updateSingleInstanceAutoRegister } from "../DB/DBJobs";
import { credentials } from "../../../constants/credentialData";
import { ca } from "date-fns/locale";
import { CatalogPage } from "../../../pages/CatalogPage";



let courseName: any = "";
let title: any = "";
let newTitle: any = "";
let version: any = "";

test.describe(`Verify whether the learner with "Overdue" status is transfered to the new version and able to launch and complete the versioned content (cron job)`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`E-learning course with Complete by rule as Overdue`, async ({ adminHome, createCourse, contentHome, bannerHome, enrollHome }) => {

        test.info().annotations.push(
            { type: `Author`, description: `DIVYA   ` },
            { type: `TestCase`, description: `E-learning course with Complete by rule` },
            { type: `Test Description`, description: `Verify that E-learning course with Complete by rule` }

        );

        courseName = FakerData.getCourseName();
        newTitle = FakerData.getRandomTitle();
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
        await createCourse.clickregistrationEnds();
        await createCourse.selectCompleteByRule();
        await createCourse.selectCompleteByDate();
        await createCourse.selectPostCompletebyOverDue();
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
        await adminHome.page.reload();
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickContentmenu();
        await contentHome.contentVisiblity(title);
        await contentHome.clickEditContentOnListing();
        await contentHome.clickAddVersionBtn();
        await contentHome.enter("content-title", newTitle);
        await contentHome.uploadContent("Original_recording5.mp4");
        await bannerHome.clickPublish();
        await contentHome.clickEditContent();
        version = await contentHome.getNewVersionNumber();
        await contentHome.clickTransferLearnerBtn();
        await contentHome.verifyTransferLearnerPopUp();
        await contentHome.clickTransferFrom();
        await contentHome.selectContentVersion(version);
        await contentHome.selectclass(courseName);
        await contentHome.selectLearnerStatus('Overdue');
        await contentHome.clickAddBtnTransferEnrollment();
        await contentHome.clickTransferLearnerbtn();
    })


    test(`Test to execute CRON JOB to content transfer`, async ({ }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `Test to execute CRON JOB` },
            { type: `Test Description`, description: `Verify the CRON Job` }
        );
        await courseEnrollmentOverdueCron();

    })

    test(`Verify that the transferred content available in the course details page and verify able to launch and complete the course from the Overdue status `, async ({ learnerHome, catalog,dashboard ,}) => {
        await learnerHome.learnerLogin("LearnerGroup1user", "DefaultPortal");
           await catalog.clickMyLearning();
           await catalog.searchMyLearning(courseName);
           await catalog.clickCourseInMyLearning(courseName);
           await catalog.verifyCompletedCourse("Overdue");
           await catalog.verifyCContentTitle(newTitle);
           await catalog.verifyContentVersion(version);
           await catalog.verifyContentProgressValue(newTitle,"0%");
           await catalog.clickLaunchButton();
           await catalog.saveLearningStatus();
           await catalog.verifyCompletedCourse("Completed");


    })
})        