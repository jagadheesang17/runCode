import { test } from "../../../../customFixtures/expertusFixture";
import { FakerData } from "../../../../utils/fakerUtils";
import { credentials } from "../../../../constants/credentialData";



const prerequisiteCourse1 = FakerData.getCourseName();
const mainCourseName = FakerData.getCourseName();
const description = FakerData.getDescription()
let tag: any
test.describe(`Verify_if_the_learner_already_completed_the_course_attached_as_lp_prerequisite_and_completed_status_reflected_when_the_learner_enrolls_lp_without_warning_popup`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Creation of Single Instance Elearning with Youtube content`, async ({ adminHome, editCourse, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Balasundar` },
            { type: `TestCase`, description: `Creation of Single Instance Elearning with Youtube content` },
            { type: `Test Description`, description: `Creation of Single Instance Elearning with Youtube content` }
        );
 await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        //Creation of prerequisite course for TP
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
        //Creation of main course for tp
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", mainCourseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course,:" + description);
        await createCourse.contentLibrary(); //By default Youtube content will be attached to the course
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
    })
    let title = FakerData.getCourseName();

 test(`learner who complete the prerequisite course before attaching it to lp`, async ({ learnerHome, catalog }) => {


        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickCatalog();
        await catalog.searchCatalog(prerequisiteCourse1);
        await catalog.clickMoreonCourse(prerequisiteCourse1);
        await catalog.enrollCourseByClickRadioAndEnrollButton(prerequisiteCourse1);
       await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
    })
    

    test(`Attaching the main course and pre-requisite to the lp`, async ({ adminHome, learningPath, createCourse, editCourse, enrollHome, catalog }) => {


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

        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();

        //  adding single prerequisite course
        await learningPath.clickEditLearningPath()
        await createCourse.clickCourseOption("Prerequisite")
        await createCourse.addSinglePrerequisiteCourse(prerequisiteCourse1);
        await adminHome.clickAdminHome();

    })

     test(`Verify the reflection of prereq's completed status when learner enrolls in learning path without warning popup`, async ({ learnerHome, catalog }) => {
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
            await catalog.verifyPopupMessageWithoutCompletingPrerequisiteFromLearnerSide();


        })
})