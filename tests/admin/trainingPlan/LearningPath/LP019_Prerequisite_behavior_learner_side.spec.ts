import { test } from "../../../../customFixtures/expertusFixture";
import { FakerData } from "../../../../utils/fakerUtils";
import { credentials } from "../../../../constants/credentialData";

const prerequisiteCourse = FakerData.getCourseName();
const prerequisiteCourse1 = FakerData.getCourseName();
const mainCourseName = FakerData.getCourseName();
const description = FakerData.getDescription()
let tag: any
test.describe(`Verify_the_Pre_Requisite_behaviour_in_Learner_side_if_Pre_requsites_are_attached_at_course_and_tp_level`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Creation of Single Instance with prerequisite and prerequisite for lp`, async ({ adminHome, editCourse, createCourse }) => {
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
        await createCourse.addSinglePrerequisiteCourse(prerequisiteCourse);

        await adminHome.menuButton();
        await adminHome.clickLearningMenu();

        //Creation of prerequisite course  for TP:
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

    })
    let title = FakerData.getCourseName();




    test(`Attaching the main course which is having pre requisite and separate pre requisite to learning path`, async ({ learnerHome, adminHome, learningPath, createCourse, catalog, enrollHome }) => {

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
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

        await learningPath.clickEditLearningPath()
        await createCourse.clickCourseOption("Prerequisite")
        await createCourse.addSinglePrerequisiteCourse(prerequisiteCourse1)
        await adminHome.clickAdminHome();


    })


    test(`Verify that the popup msg when learner try to complete the main course which is having prerequisite courses after completing the prerequisite courses which is attached to the TP `, async ({ learnerHome, catalog }) => {


        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickCatalog();
        await catalog.searchCatalog(title);
        await catalog.clickMoreonCourse(title)
        await catalog.clickEnroll();
        await catalog.verifyPrerequisiteMandatoryMessage("Training Plan")
        await catalog.clickCourseOnDetailsPage(prerequisiteCourse1);
        await catalog.clickSelectcourse(prerequisiteCourse1);
        await catalog.clickEnroll();
        // await catalog.clickLaunchButton();
        // await catalog.saveLearningStatus();


        await learnerHome.clickCatalog();
        await catalog.searchCatalog(title);
        await catalog.clickMoreonCourse(title)
        await catalog.clickEnroll();

        await catalog.clickCourseOnDetailsPage(prerequisiteCourse);
        await catalog.clickSelectcourse(prerequisiteCourse);
        await catalog.clickEnroll();
        // await catalog.clickLaunchButton();
        // await catalog.saveLearningStatus();


        await catalog.verifyPrerequisiteWarningForCourseInTP(prerequisiteCourse1);

        await catalog.clickMainCourse(mainCourseName);
        await catalog.clickMyLearning();
        await catalog.clickCompletedButton();
        await catalog.searchMyLearning(title)
        await catalog.verifyTheCompletedTpFromMyLearning(mainCourseName);
    })
})