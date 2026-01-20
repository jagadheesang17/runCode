import { credentials } from "../../constants/credentialData";
import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
const courseName = ("EL for" + " " + FakerData.getCourseName());
const description = FakerData.getDescription()
let createdCode: any

test.describe(`Ensure that a manage enrollments functionality works correctly if created course already enrolled any team member`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Single Instance Elearning Creation`, async ({ adminHome, enrollHome, contentHome, createCourse }) => {
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
        await adminHome.menuButton()
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(courseName)
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.TEAMUSER1.username)
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage()

    })


    test(`Verify that a manage enrollments functionality works correctly if created course already enrolled any team member`, async ({ enrollHome, learnerHome, managerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Ensure that the manager can successfully enrolled a course to a user` },
            { type: `Test Description`, description: `Ensure that the manager can successfully enrolled a course to a user` }
        );
        await learnerHome.learnerLogin("MANAGERNAME", "DefaultPortal");
        await learnerHome.selectCollaborationHub();
        await managerHome.enterSearchCourse(createdCode);
        await managerHome.clickGuideTeamIcon(courseName);
        await enrollHome.selectBycourse(courseName)
        await enrollHome.clickViewLearnerBtn();
        await enrollHome.selectEnrollOrCancel("Completed")
        await enrollHome.completionDateInAdminEnrollment();
        await enrollHome.verifytoastMessage()
    })


    test(`Verifying team member side after enrollment status has changed by manager`, async ({ learnerHome, catalog, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verifying team member side after enrollment status has changed by manager` },
            { type: `Test Description`, description: `Verifying team member side after enrollment status has changed by manager` }
        );
        await learnerHome.learnerLogin("TEAMUSER1", "DefaultPortal");
        await catalog.clickMyLearning();
        await catalog.clickCompletedButton();
        await catalog.searchMyLearning(courseName);
        await catalog.verifyCompletedCourse(courseName);
    })

})