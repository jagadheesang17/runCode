import { credentialConstants } from "../../../constants/credentialConstants";
import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from '../../../utils/fakerUtils';
import { mailDispatcherCron, notificationCron } from "../DB/DBJobs";


const courseName = FakerData.getCourseName();
const sessionName = FakerData.getSession();
const elCourseName = ("Elearning" + " " + FakerData.getCourseName());
const description = FakerData.getDescription();
const instructorName = credentialConstants.INSTRUCTORNAME

test.describe(`Verify that enrollment notification working as expected for ILT course`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Creation of Multi instance ILT course`, async ({ adminHome, contentHome, createUser, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Creation of Multi instance ILT course` },
            { type: `Test Description`, description: `Creation of Multi instance ILT course` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.clickMenu("Course");
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.selectdeliveryType("Classroom")
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await createCourse.clickEditCourseTabs();
        await createCourse.addInstances();

        async function addinstance(deliveryType: string) {
            await createCourse.selectInstanceDeliveryType(deliveryType);
            await createCourse.clickCreateInstance();
        }
        await addinstance("Classroom");
        await createCourse.enterSessionName(sessionName);
        await createCourse.setMaxSeat();
        await createCourse.enterDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    })
    test(`Verify that enrollment notification working as expected for multi instance`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify that enrollment notification working as expected for multi instance` },
            { type: `Test Description`, description: `Verify that enrollment notification working as expected for multi instance` }
        );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(courseName);
        await catalog.clickMoreonCourse(courseName);
        await catalog.clickSelectcourse(courseName);
        await catalog.clickEnroll();
    })

    test(`Test to execute CRON JOB`, async ({ adminHome }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Test to execute CRON JOB` },
            { type: `Test Description`, description: `Verify the CRON Job` }
        );
        await notificationCron();
        const [mailBody, mailSubject] = await mailDispatcherCron();
        await adminHome.verifyMailBody(mailBody, courseName)
        await adminHome.verifyMailSubject(mailSubject, "Enrolled")
    })


    test(`Verify that canceled notification working as expected for multi instance`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify that canceled notification working as expected for multi instance` },
            { type: `Test Description`, description: `Verify that canceled notification working as expected for multi instance` }
        );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickMyLearning();
        await catalog.searchMyLearning(courseName);
        await catalog.mylearningViewClassDetails(courseName);
        await catalog.mylearningClassCancel();
    })
    test(`Test to execute CRON JOB for canceled`, async ({ adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Test to execute CRON JOB` },
            { type: `Test Description`, description: `Verify the CRON Job` }
        );

        await notificationCron();
        const [mailBody, mailSubject] = await mailDispatcherCron();
        await adminHome.verifyMailBody(mailBody, courseName)
        await adminHome.verifyMailSubject(mailSubject, "Canceled")
    })

})
