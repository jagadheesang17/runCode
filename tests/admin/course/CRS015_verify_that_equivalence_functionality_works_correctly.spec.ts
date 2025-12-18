import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from '../../../utils/fakerUtils';


const equivalenceCoursename = FakerData.getCourseName();
const mainCourseName = FakerData.getCourseName();
const description = FakerData.getDescription()
let tag: any
test.describe.configure({ mode: "serial" });
test(`Verify equivalence functionality works correctly for enrolled courses`, async ({ adminHome, editCourse, createCourse }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
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
})

test(`Verifying learner side that able to complete equivalence course`, async ({ learnerHome, catalog, dashboard }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Verifying learner side that able to complete equivalence course` },
        { type: `Test Description`, description: `Verifying learner side that able to complete equivalence course` }
    );
    await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
    await learnerHome.clickCatalog();
    await catalog.mostRecent();
    await catalog.searchCatalog(equivalenceCoursename);
    await catalog.clickMoreonCourse(equivalenceCoursename);
    await catalog.clickSelectcourse(equivalenceCoursename);
    await catalog.clickEnroll();
    await catalog.clickLaunchButton();
    await catalog.saveLearningStatus();
    await catalog.clickMyLearning();
    await dashboard.selectDashboardItems("Learning History");
    await dashboard.learningHistoryCourseSearch(equivalenceCoursename);
    await dashboard.vaidatVisibleCourse_Program(equivalenceCoursename, "Completed");
})

test(`Creation of Single Instance Elearning with Youtube content and add equivalence course`, async ({ adminHome, editCourse, createCourse }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Creation of Single Instance Elearning with Youtube content and add equivalence course` },
        { type: `Test Description`, description: `Creation of Single Instance Elearning with Youtube content for and add equivalence course` }
    );

    await adminHome.loadAndLogin("CUSTOMERADMIN")
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
    await editCourse.clickTagMenu();
    tag = await editCourse.selectTags();
    await editCourse.clickClose();
    await createCourse.clickCourseOption("Equivalence")
    await createCourse.addEquivalenceCourse(equivalenceCoursename);

})


test(`Verifying learner side that equivalence functionality works correctly`, async ({ learnerHome, catalog ,dashboard}) => {
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
    await catalog.clickSelectcourse(mainCourseName);
    await catalog.clickEnroll();
    await catalog.clickEqlConfirmationPopup("No")
    await catalog.verifyEquivalenceGrantedMessage();
    await catalog.clickMyLearning();
    await dashboard.selectDashboardItems("Learning History");
    await dashboard.learningHistoryCourseSearch(mainCourseName);
    await dashboard.vaidatVisibleCourse_Program(mainCourseName, "Completed");
})

