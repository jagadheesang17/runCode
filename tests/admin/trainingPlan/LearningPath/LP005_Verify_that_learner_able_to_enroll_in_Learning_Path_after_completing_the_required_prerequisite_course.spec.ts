import { test } from "../../../../customFixtures/expertusFixture";
import { FakerData } from "../../../../utils/fakerUtils";
import { URLConstants } from "../../../../constants/urlConstants";



let courseName = FakerData.getCourseName();
const prerequisiteCourse = FakerData.getCourseName();
const prerequisiteCourse1 = FakerData.getCourseName();
const description = FakerData.getDescription();

test.describe.configure({ mode: "serial" });
test(`Verify that the learner able to enroll in a Learning path after completing single prerequisite course`, async ({ adminHome, editCourse, createCourse }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
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




test(`Verify that the learner able to enroll in a course after completing all the required prerequisite courses`, async ({ adminHome, learningPath, createCourse, editCourse }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Verify_Learning_Path__single_instance_with_survey_and_assessment_in_TPlevel-Admin_Site` },
        { type: `Test Description`, description: `Creating Learning Path single instance with survey and assessment in TPlevel` }
    )

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
    await learningPath.searchAndClickCourseCheckBox(courseName);
    await learningPath.clickAddSelectCourse();
    await learningPath.clickDetailTab();
    await learningPath.clickCatalogBtn();
    await learningPath.clickUpdateBtn();
    await learningPath.verifySuccessMessage();
    //adding single prerequisite course
    await learningPath.clickEditLearningPath()
    await createCourse.clickCourseOption("Prerequisite")
    await createCourse.addMultiPrerequisiteCourse(prerequisiteCourse,prerequisiteCourse1)

})

test(`Verify learner able to launch TP level Prerequisite course and complete it`, async ({ learnerHome, catalog }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Verify learner able to launch TP level Prerequisite course and  complete it` },
        { type: `Test Description`, description: `Verify learner able to launch TP level Prerequisite course and  complete it` }

    );
    await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
    await learnerHome.clickCatalog();
    await catalog.searchCatalog(title);
    await catalog.clickMoreonCourse(title)
    await catalog.clickEnroll();
    await catalog.verifyPrerequisiteMandatoryMessage("Training Plan")
    await catalog.clickCourseOnDetailsPage(prerequisiteCourse);
    await catalog.clickSelectcourse(prerequisiteCourse);
    await catalog.clickEnroll();
    await catalog.clickLaunchButton();
    await catalog.saveLearningStatus();
    await learnerHome.clickCatalog();
    await catalog.searchCatalog(title);
    await catalog.clickMoreonCourse(title)
    await catalog.clickEnroll();
    await catalog.verifyPrerequisiteMandatoryMessage("Training Plan")
    await catalog.clickCourseOnDetailsPage(prerequisiteCourse1);
    await catalog.clickSelectcourse(prerequisiteCourse1);
    await catalog.clickEnroll();
    await catalog.clickLaunchButton();
    await catalog.saveLearningStatus();
    await learnerHome.clickCatalog();
    await catalog.searchCatalog(title);
    await catalog.clickMoreonCourse(title)
    await catalog.clickEnroll();
    await catalog.clickLaunchButton();
    await catalog.saveLearningStatus();
    await catalog.clickMyLearning();
    await catalog.clickCompletedButton();
    await catalog.searchMyLearning(title);

})