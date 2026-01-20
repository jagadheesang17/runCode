import { test } from "../../../../customFixtures/expertusFixture"
import { FakerData } from '../../../../utils/fakerUtils';

let courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const title = FakerData.getCourseName();
const equivalenceCoursename = FakerData.getCourseName();
const mainCourseName = FakerData.getCourseName();
let tag: any



test.describe(`TP048_Verify_that_the_completion_rollback_occurs_at_the_TP_level_when_the_main_course_already_completed_by_the_same_learner_is_attached_to_the_Training_Plan.spec`, async () => {
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
test(`Completing the main and equivalence course as a learner`, async ({ learnerHome, catalog }) => {
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
     await learnerHome.clickCatalog();
    await catalog.searchCatalog(mainCourseName);
    await catalog.clickMoreonCourse(mainCourseName);
    await catalog.clickSelectcourse(mainCourseName);
    await catalog.clickEnroll();
    await catalog.clickEqlConfirmationPopup("Yes")
  
    await catalog.clickLaunchButton();
    await catalog.saveLearningStatus();
    await catalog.clickMyLearning();
    await catalog.clickCompletedButton();
    await catalog.searchMyLearning(mainCourseName);
    await catalog.verifyCompletedCourse(mainCourseName);

})

 test(`Creating certification with main course attached`, async ({ adminHome, learningPath, createCourse, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Certification Creation with pre and post assessment attached` },
            { type: `Test Description`, description: `Certification Creation with pre and post assessment attached` }
        )

        await adminHome.loadAndLogin("CUSTOMERADMIN1")
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
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    })


test(`Verify the TP status when the learner already completed the main course by standalone which is attached to the certification`, async ({ learnerHome, catalog, dashboard }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Verifying learner side that equivalence functionality works correctly` },
        { type: `Test Description`, description: `Verifying learner side that equivalence functionality works correctly` }
    );
    await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
    await learnerHome.clickCatalog();
    await catalog.searchCatalog(title);
    await catalog.clickEnrollButton();

    await catalog.clickViewCertificationDetails();

    await catalog.verifyStatus("Completed")

    

})})
