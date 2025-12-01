import { test } from "../../../../customFixtures/expertusFixture"
import { FakerData } from '../../../../utils/fakerUtils';

let courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const title = FakerData.getCourseName();
const equivalenceCoursename = FakerData.getCourseName();
const mainCourseName = FakerData.getCourseName();
let tag: any

test.describe(`Verify_that_the_created_survey_questions_within_the_section_are_displayed_on_the_course_details_page_for_the_learner_after_completing_the_content`, async () => {
test.describe.configure({ mode: "serial" });
test(`Creating main and equivalence course and attaching the equivalence to main course`, async ({ adminHome, editCourse, createCourse }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Balasundar` },
        { type: `TestCase`, description: `Creation of Single Instance Elearning with Youtube content for equivalence` },
        { type: `Test Description`, description: `Creation of Single Instance Elearning with Youtube content for equivalence` }
    );

    await adminHome.loadAndLogin("CUSTOMERADMIN")
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    //Creation of Equivalence course 
    await adminHome.clickCourseLink();
    await createCourse.clickCreateCourse();
    await createCourse.verifyCreateUserLabel("CREATE COURSE");
    await createCourse.enter("course-title", equivalenceCoursename);
    await createCourse.selectLanguage("English");
    await createCourse.typeDescription("This is a new course by name :" + description);
    await createCourse.contentLibrary();//Youtube content is attached here
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    //Creation of main course with single instance
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
    //Adding equivalence course
    await createCourse.clickCourseOption("Equivalence")
    await createCourse.addEquivalenceCourse(equivalenceCoursename);

})
test(`Completing the equivalence course as by standalaone`, async ({ learnerHome, catalog }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Verifying learner side that equivalence functionality works correctly` },
        { type: `Test Description`, description: `Verifying learner side that equivalence functionality works correctly` }
    );
    await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
    await learnerHome.clickCatalog();
    await catalog.mostRecent();
    await catalog.searchCatalog(mainCourseName);
    await catalog.clickMoreonCourse(mainCourseName);
    await catalog.clickCourseOnDetailsPage(equivalenceCoursename);
    await catalog.clickSelectcourse(equivalenceCoursename);
    await catalog.clickEnroll();
    await catalog.clickLaunchButton();
    await catalog.saveLearningStatus();
})

 test(`Attaching the main course with equivalence to the learning path`, async ({ adminHome, learningPath, createCourse, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `LP Creation with pre and post assessment attached` },
            { type: `Test Description`, description: `LP Creation with pre and post assessment attached` }
        )

        await adminHome.loadAndLogin("CUSTOMERADMIN1")
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
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    })


test(`Verify the TP status when the learner already completed the equivalence by standalone which is attached to the tp`, async ({ learnerHome, catalog }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Verifying learner side that equivalence functionality works correctly` },
        { type: `Test Description`, description: `Verifying learner side that equivalence functionality works correctly` }
    );
    await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
    await learnerHome.clickCatalog();
    await catalog.mostRecent();
    await catalog.searchCatalog(title);
 
    await catalog.clickEnrollButton();

    await catalog.clickViewLearningPathDetails();

    await catalog.verifyEquivalenceGrantedMessage();

    await catalog.verifyStatus("Completed");

})

})
