import { test } from "../../../../customFixtures/expertusFixture";
import { FakerData } from "../../../../utils/fakerUtils";
import { URLConstants } from "../../../../constants/urlConstants";
import { credentials } from "../../../../constants/credentialData";



let courseName = FakerData.getCourseName();
const prerequisiteCourse = FakerData.getCourseName();
const prerequisiteCourse1 = FakerData.getCourseName();
const description = FakerData.getDescription();

test.describe.configure({ mode: "serial" });
test.describe(`Verify_the_warning_message_when_the_admin_try_to_enroll_the_certification_before_did_not_complete_the_prerequisite_and_enroll_certification_after_completing_the_prerequisites`, async () => {

test(`Creating main course and pre requisite courses`, async ({ adminHome, editCourse, createCourse }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Balasundar` },
        { type: `TestCase`, description: `Creation of Elearning Course` },
        { type: `Test Description`, description: `Creation of Elearning Course` }
    );
    await adminHome.loadAndLogin("CUSTOMERADMIN")
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();
    //Creation of prerequisite course 1
    await createCourse.clickCreateCourse();
    await createCourse.verifyCreateUserLabel("CREATE COURSE");
    await createCourse.enter("course-title", prerequisiteCourse);
    await createCourse.selectLanguage("English");
    await createCourse.typeDescription("This is a new course by name :" + description);
    await createCourse.contentLibrary();//Youtube content is attached here
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    //Creation of prerequisite course 2
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
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
    await createCourse.enter("course-title", courseName);
    await createCourse.selectLanguage("English");
    await createCourse.typeDescription("This is a new course,:" + description);
    await createCourse.contentLibrary(); //By default Youtube content will be attached to the course
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();

})
let title = FakerData.getCourseName();




test(`Verify the admin able to add 2 prerequisites and main course to the certification and verify the popup message when the admin try to enroll certification without completing the 2 pre requisites`, async ({ adminHome, learningPath, createCourse, enrollHome, catalog }) => {


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
    //adding single prerequisite course
    await learningPath.clickEditCertification()
    await createCourse.clickCourseOption("Prerequisite")
    await createCourse.addMultiPrerequisiteCourse(prerequisiteCourse, prerequisiteCourse1)
    await adminHome.clickAdminHome();

    await adminHome.menuButton()
    await adminHome.clickEnrollmentMenu();
    await adminHome.clickEnroll();
    await enrollHome.selectByOption("Certification");
    await enrollHome.selectBycourse(title)
    await enrollHome.clickSelectedLearner();
    await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username)
    await enrollHome.clickEnrollBtn();
    // await catalog.verifyPrerequisiteMandatoryMessageFromAdmin("Certification");

    await catalog.verifyPopupMessageWithoutCompletingPrerequisite();
    await adminHome.clickAdminHome();

    await adminHome.menuButton();
    await adminHome.clickEnrollmentMenu();
    await adminHome.clickEnroll();
    await enrollHome.selectByOption("Course");
    await enrollHome.selectBycourse(prerequisiteCourse)
    await enrollHome.clickSelectedLearner();
    await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username)
    await enrollHome.clickEnrollBtn();
    await enrollHome.clickModifyEnrollBtn();

    await enrollHome.selectEnrollOrCancel("Completed");
    await enrollHome.completionDateInAdminEnrollment();
    // await enrollHome.clickEnrollButtonAfterEnrollment();


    await adminHome.clickAdminHome();

    await adminHome.menuButton()
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

    await adminHome.clickEnroll();
    await enrollHome.selectByOption("Certification");
    await enrollHome.selectBycourse(title)
    await enrollHome.clickSelectedLearner();
    await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username)
    await enrollHome.clickEnrollBtn();
    await enrollHome.clickModifyEnrollBtn();

    await enrollHome.selectEnrollOrCancel("Completed");
    await enrollHome.completionDateInAdminEnrollment();


})

})
