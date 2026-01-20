import { credentials } from "../../../constants/credentialData";
import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from '../../../utils/fakerUtils';
import { completeEnrolledCourse, enrollCourse, listEnrolledCourse } from "../../courseAPI";

const courseName = "API " + FakerData.getCourseName();
const description = FakerData.getDescription();
let createdCode: any
let user = credentials.LEARNERUSERNAME.username

test.describe(`Creating a course in the UI, enrolling through the API, and finally verifying on the learner's side in the UI`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`CreateCourseFor Single Instance through UI`, async ({ adminHome, createCourse, contentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Ajay Michael` },
            { type: `TestCase`, description: `Create the course as Single instance` },
            { type: `Test Description`, description: `Verify that course should be created for Single instance` }
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
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await contentHome.gotoListing();
        await createCourse.catalogSearch(courseName)
        createdCode = await createCourse.retriveCode()
        console.log("Extracted Code is : " + createdCode);

    })

    test(`Create Enrollment through API`, async () => {
        await enrollCourse(createdCode, user)
    })

    test(`Verify to Complete Course in Learner side`, async ({ learnerHome, catalog }) => {
        await learnerHome.learnerLogin("LEARNERUSERNAME", "Defaultportal");
        await catalog.clickMyLearning();
        await catalog.searchMyLearning(createdCode);
       // await catalog.verifyEnrolledCourseByCODE(createdCode);

    })

    test(`Complete Enrolled Course through API`, async () => {
        await completeEnrolledCourse(createdCode, user)
    })

    test(`Verify Completed Course in Learner side`, async ({ learnerHome, dashboard }) => {
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await dashboard.selectDashboardItems("Learning History");
        await dashboard.learningHistoryCourseSearch(courseName);
        await dashboard.vaidatVisibleCourse_Program(courseName, "Completed");
      //  await catalog.verifyEnrolledCourseByCODE(createdCode);

    })

    test(`List the completed enrolled course`, async () => {
        await listEnrolledCourse(createdCode, user)
    })

})