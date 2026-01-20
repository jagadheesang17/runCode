import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
import { credentials } from "../../constants/credentialData";



const courseName = FakerData.getCourseName();

test.describe(`Ensure_that_the_instructor_can_successfully_cancel_the_enrollment_for_a_Virtual_Class_in_the_Scheduled_tab`, async () => {
    test.describe.configure({ mode: 'serial' })
    test(`Future Virtual Course Creation`, async ({ adminHome, createCourse, editCourse }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Vidya` },
            { type: `TestCase`, description: `Future Virtual Course Creation` },
            { type: `Test Description`, description: `Future Virtual Course Creation` }


        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName)
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name :" + courseName);
        await createCourse.selectdeliveryType("Virtual Class")
        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown()
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed()
        await createCourse.verifySuccessMessage();
        await createCourse.editcourse();
        await editCourse.clickTagMenu();
        await editCourse.selectTags();
        await createCourse.clickCompletionCertificate();
        await createCourse.clickCertificateCheckBox();
        await createCourse.clickAdd();
        await createCourse.addInstances();
        async function addinstance(deliveryType: string) {
            await createCourse.selectInstanceDeliveryType(deliveryType);
            await createCourse.clickCreateInstance();
        }
        await addinstance("Virtual Class");
        await createCourse.sessionmeetingType("other Meetings");
        await createCourse.enterSessionName(courseName);
        await createCourse.enterfutureDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(credentials.INSTRUCTORNAME.username)
        await createCourse.typeAdditionalInfo()
        await createCourse.vcSessionTimeZone("kolkata");
        await createCourse.attendeeUrl();
        await createCourse.presenterUrl();
        await createCourse.setMaxSeat();
        await createCourse.typeDescription("Check the instance class for the availed course")
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    })

    test(`Enrollment for Future VC`, async ({ adminHome, enrollHome }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Vidya` },
            { type: `TestCase`, description: `Enrollment for Future VC` },
            { type: `Test Description`, description: `Enrollment for Future VC` }

        );
        await adminHome.loadAndLogin("ENROLLADMIN");
        await adminHome.menuButton()
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectEnroll();
        await enrollHome.selectBycourse(courseName)
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser("User")
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage()
    })

    test(`Ensure_that_the_instructor_can_successfully_cancel_the_enrollment_for_a_Virtual_Class_in_the_Scheduled_tab`, async ({ adminHome, enrollHome, instructorHome }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Vidya` },
            { type: `TestCase`, description: `Ensure_that_the_instructor_can_successfully_cancel_the_enrollment_for_a_Virtual_Class_in_the_Scheduled_tab` },
            { type: `Test Description`, description: `Ensure_that_the_instructor_can_successfully_cancel_the_enrollment_for_a_Virtual_Class_in_the_Scheduled_tab` }
        );
        await adminHome.loadAndLogin("INSTRUCTORNAME");
        await instructorHome.clickFilter();
        await instructorHome.selectDeliveryType()
        await instructorHome.selectStatus("Scheduled")
        await instructorHome.clickApply("Scheduled");
        await instructorHome.entersearchField(courseName)
        await instructorHome.clickEnrollmentIcon(courseName);
        await enrollHome.selectEnrollOrCancel(courseName,"Canceled")
        await enrollHome.enterReasonAndSubmit();
        await enrollHome.verifytoastMessage()
    })


})