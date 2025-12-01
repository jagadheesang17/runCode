import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { URLConstants } from "../../../constants/urlConstants";
import { credentials } from "../../../constants/credentialData";


const prerequisiteCourse1 = FakerData.getCourseName();
const mainCourseName = FakerData.getCourseName();
const description = FakerData.getDescription()
let tag: any
test.describe(`Verify_the_warning_message_when_the_admin_try_to_enroll_the_maincourse_before_did_not_complete_the_prerequisite_and_complete_maincourse_after_completing_the_course's_prerequisites_in_certification`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Creation of main course with pre requisite`, async ({ adminHome, editCourse, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Balasundar` },
            { type: `TestCase`, description: `Creation of Single Instance Elearning with Youtube content` },
            { type: `Test Description`, description: `Creation of Single Instance Elearning with Youtube content` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        //Creation of prerequisite course 1
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", prerequisiteCourse1);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name :" + description);
        await createCourse.contentLibrary();//Youtube content is attached here
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        //Creation of main course with single instance
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", mainCourseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name :" + description);
        await createCourse.contentLibrary();//Youtube content is attached here
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await createCourse.editcourse();
        await editCourse.clickClose();
        await editCourse.clickTagMenu();
        tag = await editCourse.selectTags();
        await editCourse.clickClose();
        await createCourse.clickCourseOption("Prerequisite")
        await createCourse.addSinglePrerequisiteCourse(prerequisiteCourse1);

    })
    let title = FakerData.getCourseName();




    test(`Attaching the main course which having pre requisite to certification and verify the popup message when the admin try to enroll the main course without completing the prerequisite after enrolling the certification`, async ({ adminHome, learningPath, createCourse, editCourse, enrollHome, catalog }) => {


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
        await learningPath.searchAndClickCourseCheckBox(mainCourseName);
        await learningPath.clickAddSelectCourse();
        await catalog.verifyThePopupMessageWhenCourseHavePrerequisite();

        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();

        await adminHome.clickAdminHome();

        await adminHome.menuButton()
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectByOption("Certification");
        await enrollHome.selectBycourse(title)
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username)
        await enrollHome.clickEnrollBtn();

        // await catalog.clickOKFromPopup();
        await adminHome.clickAdminHome();

        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectByOption("Course");
        await enrollHome.selectBycourse(mainCourseName)
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username)
        await enrollHome.clickEnrollBtn();
        await catalog.verifyPopupMessageWithoutCompletingPrerequisite();
        // await enrollHome.clickModifyEnrollBtn();



        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectByOption("Course");
        await enrollHome.selectBycourse(prerequisiteCourse1)
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username)
        await enrollHome.clickEnrollBtn();
        await enrollHome.clickModifyEnrollBtn();
        await enrollHome.selectEnrollOrCancel("Completed");
        await enrollHome.completionDateInAdminEnrollment();
        await adminHome.clickAdminHome();


        await adminHome.menuButton()
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectByOption("Certification");
        await enrollHome.selectBycourse(title)
        await enrollHome.clickViewLearner();
        await enrollHome.selectEnrollOrCancel("Completed");
        await enrollHome.completionDateInAdminEnrollment();



    })
})
