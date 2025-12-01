import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { credentials } from "../../../constants/credentialData";

const prerequisiteCourse = FakerData.getCourseName();
const prerequisiteCourse1 = FakerData.getCourseName();
const mainCourseName = FakerData.getCourseName();
const description = FakerData.getDescription()
let tag: any
test.describe(`Verify_the_admin_created_certification_with_Pre-Requisite_at_certification_level_and_course_level`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Creation of Single Instance with prerequisite and prerequisite for certification`, async ({ adminHome, editCourse, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Balasundar` },
            { type: `TestCase`, description: `Creation of Single Instance Elearning with Youtube content` },
            { type: `Test Description`, description: `Creation of Single Instance Elearning with Youtube content` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();

        //Creation of Prerequisite course for main course:

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

        //Creation of main course with that prerequisite course:

        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
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
        await createCourse.addSinglePrerequisiteCourse(prerequisiteCourse);

        //Creation of prerequisite course  for certification:

        await adminHome.menuButton();
        await adminHome.clickLearningMenu();


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

    })
    let title = FakerData.getCourseName();




    test(`Verify that the popup msg when admin try to complete the main course which is having prerequisite courses after completing the prerequisite courses which is attached to the certification`, async ({ adminHome, learningPath, createCourse, editCourse, enrollHome, catalog }) => {


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

        await learningPath.clickEditCertification()
        await createCourse.clickCourseOption("Prerequisite")
        await createCourse.addSinglePrerequisiteCourse(prerequisiteCourse1)
        await adminHome.clickAdminHome();


        await adminHome.menuButton()
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectByOption("Certification");
        await enrollHome.selectBycourse(title)
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username)
        await enrollHome.clickEnrollBtn();

        await catalog.verifyPopupMessageWithoutCompletingPrerequisite();
        await adminHome.clickAdminHome();

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
        await adminHome.clickEnroll();
        await enrollHome.selectByOption("Certification");
        await enrollHome.selectBycourse(title)
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username)
        await enrollHome.clickEnrollBtn();


        await adminHome.clickAdminHome();
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(mainCourseName);
        await enrollHome.clickViewLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username)
        await enrollHome.selectEnrollOrCancel("Completed"); //trying to complete this main course w/o completing the prerequisite course
        await enrollHome.completionDateInAdminEnrollment(); //need to remove this line after the pre req. issue is fixed 

        // await catalog.clickOKFromPopup(); need to uncomment this after fixing the popup issue


        await adminHome.clickAdminHome();
        await adminHome.menuButton()
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(prerequisiteCourse);
        await enrollHome.clickViewLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username)
        // await enrollHome.clickEnrollBtn();
        // await enrollHome.clickModifyEnrollBtn();
        await enrollHome.selectEnrollOrCancel("Completed");
        await enrollHome.completionDateInAdminEnrollment();

        await adminHome.clickAdminHome();
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(mainCourseName);
        await enrollHome.clickViewLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username)
        await enrollHome.selectEnrollOrCancel("Completed"); //trying to complete this main course w/o completing the prerequisite course
        await enrollHome.completionDateInAdminEnrollment();

        await adminHome.clickAdminHome();
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectByOption("Certification");
        await enrollHome.selectBycourse(title);
        await enrollHome.clickViewLearner();

        await enrollHome.verifyTpCompletionStatus("Completed");



    })
})
