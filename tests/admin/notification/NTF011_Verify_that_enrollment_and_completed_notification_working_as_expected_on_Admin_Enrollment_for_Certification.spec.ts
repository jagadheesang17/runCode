import { credentials } from "../../../constants/credentialData";
import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { mailDispatcherCron, notificationCron } from "../DB/DBJobs";

let courseName = FakerData.getCourseName();
let description = FakerData.getDescription();
let createdCode: any
test.describe(`Verify that enrollment notification working as expected on Admin Enrollment for VC course`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Creation of E-learning single instance `, async ({ adminHome, createCourse }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create the course as Single instance` },
            { type: `Test Description`, description: `Create the course as Single instance` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.getCourse();
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.contentLibrary("Passed-Failed-SCORM2004"); //By default Youtube content will be attached
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
    })
    const title = "CER"+" "+FakerData.getCourseName();
    test(`Certification enroll and completion with single instance`, async ({ adminHome, learningPath, createCourse, enrollHome, contentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Certification enroll and completion with single instance` },
            { type: `Test Description`, description: `Verify Certification enroll and completion with single instance` }
        );

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
        // await learningPath.getCodeValue();
        await createCourse.clickCompletionCertificate();
        await createCourse.clickCertificateCheckBox();
        await createCourse.clickAdd();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        await contentHome.gotoListing();
        await createCourse.catalogSearch(title)
        createdCode = await createCourse.retriveCode()
        console.log("Extracted Code is : " + createdCode);
        await adminHome.menuButton()
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectByOption("Certification");
        await enrollHome.selectBycourse(title)
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username)
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage()
     

    })
    test(`Test to execute CRON JOB`, async ({ adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Test to execute CRON JOB` },
            { type: `Test Description`, description: `Verify the CRON Job` }
        );

        await notificationCron();
        const [mailBody, mailSubject] = await mailDispatcherCron();
        await adminHome.verifyTPEnrollmentMailBody(mailBody, title)
        await adminHome.verifyMailSubject(mailSubject, "Registered")
    })

    test(`Verify that admin can able to change the enrollment status`, async ({ adminHome, createUser, enrollHome }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify that admin can able to change the enrollment status` },
            { type: `Test Description`, description: `Verify that admin can able to change the enrollment status` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.userSearchField(credentials.LEARNERUSERNAME.username);
        await createUser.clickEnrollmentIcon();
        await createUser.verifyEnrollmentLabel();
        await enrollHome.changeEnrollmentStatus(createdCode, "Completed")
        await enrollHome.completionDateInAdminEnrollment();
        await enrollHome.verifytoastMessage()
    })


    test(`Test to execute CRON JOB for completed`, async ({ adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Test to execute CRON JOB` },
            { type: `Test Description`, description: `Verify the CRON Job` }
        );
        await notificationCron();
        const [mailBody, mailSubject] = await mailDispatcherCron("TP");
        await adminHome.verifyMailBody(mailBody, title)
        await adminHome.verifyMailSubject(mailSubject, "Completed")
    })

    test(`Verify that learner can able to see completed certification present in the my learning which is completed by admin`, async ({ learnerHome, catalog,dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify that learner can able to see certification present in the my learning` },
            { type: `Test Description`, description: `Verify that learner can able to see certification present in the my learning` }
        );
         await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.clickMoreonTP(title);
        await catalog.verifyStatus("Completed");
        await catalog.clickViewCertificate();

    })
})