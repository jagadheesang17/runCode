import { credentials } from "../../constants/credentialData";
import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription()
let createdCode: any

test.describe(`Ensure_that_a_course_enrolled_by_the_manager_is_available_in_the_learner_catalog.`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Single Instance Elearning Creation`, async ({ adminHome,contentHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Single Instance Elearning Creation` },
            { type: `Test Description`, description: `Single Instance Elearning Creation` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name :" + description);
        await createCourse.contentLibrary() //By default youtube content will be added
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await contentHome.gotoListing();
        await createCourse.catalogSearch(courseName)
        createdCode = await createCourse.retriveCode()
        console.log("Extracted Code is : " + createdCode);
        
    })


    test(`Ensure that the manager can successfully enrolled a course to a user.`, async ({ enrollHome,learnerHome, managerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Ensure that the manager can successfully enrolled a course to a user` },
            { type: `Test Description`, description: `Ensure that the manager can successfully enrolled a course to a user` }
        );
        await learnerHome.learnerLogin("MANAGERNAME", "DefaultPortal");
        await learnerHome.selectCollaborationHub();
        await managerHome.enterSearchCourse(createdCode);
        await managerHome.clickGuideTeamIcon(courseName);
        await enrollHome.selectEnroll();
        await enrollHome.clickSelectedLearner();
         await enrollHome.enterSearchUser(credentials.TEAMUSER1.username)
         await enrollHome.clickEnrollBtn();
         await enrollHome.verifytoastMessage()
    })


    test(`Ensure_that_a_course_recommended_by_the_manager_is_available_in_the_learner_My_Learning`, async ({ learnerHome, catalog, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Ensure_that_a_course_recommended_by_the_manager_is_available_in_the_learner_My_Learning` },
            { type: `Test Description`, description: `Ensure_that_a_course_recommended_by_the_manager_is_available_in_the_learner_My_Learning` }
        );
        await learnerHome.learnerLogin("TEAMUSER1", "DefaultPortal");
        await catalog.clickMyLearning();
        await catalog.searchMyLearning(courseName);
        await catalog.verifyEnrolledCourseByCODE(createdCode);
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.clickMyLearning();
        await catalog.clickCompletedButton();
        await catalog.searchMyLearning(courseName);
        await catalog.verifyCompletedCourse(courseName);


    })

})