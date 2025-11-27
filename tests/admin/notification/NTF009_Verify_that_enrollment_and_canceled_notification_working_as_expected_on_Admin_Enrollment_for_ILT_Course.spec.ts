import { credentialConstants } from "../../../constants/credentialConstants";
import { credentials } from "../../../constants/credentialData";
import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from '../../../utils/fakerUtils';
import { mailDispatcherCron, notificationCron } from "../DB/DBJobs";


const courseName =("ILT" + " " + FakerData.getCourseName());
const sessionName = FakerData.getSession();
const elCourseName = ("Elearning" + " " + FakerData.getCourseName());
const description = FakerData.getDescription();
const instructorName = credentialConstants.INSTRUCTORNAME
const instanceName = "ILT"+" "+FakerData.getCourseName();
let createdCode: any

test.describe(`Verify that enrollment notification working as expected on Admin Enrollment for ILT course`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Creation of Multi instance ILT course`, async ({ adminHome, contentHome, catalog,enrollHome, createCourse }) => {
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
        await createCourse.enter("course-title", instanceName);
        await createCourse.enterSessionName(sessionName);
        await createCourse.setMaxSeat();
        await createCourse.enterDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
      await contentHome.gotoListing();
        await createCourse.filterByInstance("By Instance/Class")
        await catalog.clickApply()
        await createCourse.catalogSearch(instanceName)
        createdCode = await createCourse.retriveCode()
        console.log("Extracted Code is : " + createdCode);
        await adminHome.menuButton()
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(instanceName)
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
        await adminHome.verifyAdminEnrollmentMailBody(mailBody, instanceName)
        await adminHome.verifyMailSubject(mailSubject, "Registered")
    })
    test(`Verify that admin can able to change the enrollment status`, async ({ adminHome, createUser, enrollHome }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Tamilvanan' },
            { type: 'TestCase', description: "Verify that admin can able to change the enrollment status" },
            { type: 'Test Description', description: "Verify that admin can able to change the enrollment status" }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.userSearchField(credentials.LEARNERUSERNAME.username);
        await createUser.clickEnrollmentIcon();
        await createUser.verifyEnrollmentLabel();
        await enrollHome.changeEnrollmentStatus(createdCode, "Canceled")
        await enrollHome.enterReasonAndSubmit();
        await enrollHome.verifytoastMessage()

    })
        test(`Test to execute CRON JOB for Canceled`, async ({ adminHome }) => {
            test.info().annotations.push(
                { type: `Author`, description: `Tamilvanan` },
                { type: `TestCase`, description: `Test to execute CRON JOB` },
                { type: `Test Description`, description: `Verify the CRON Job` }
            );
            await notificationCron();
            const [mailBody, mailSubject] = await mailDispatcherCron();
            await adminHome.verifyMailBody(mailBody, instanceName)
            await adminHome.verifyMailSubject(mailSubject, "cancelled")
        })


})
