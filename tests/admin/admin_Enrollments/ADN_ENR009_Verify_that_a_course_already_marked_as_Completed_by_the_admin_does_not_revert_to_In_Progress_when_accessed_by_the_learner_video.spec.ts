import { credentials } from "../../../constants/credentialData";
import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from '../../../utils/fakerUtils';

let createdCode: any
//let createdCode = "CRS-EL-04952";
const courseName = FakerData.getCourseName();
//const courseName = "Cross-Platform Panel Generate";

const description = FakerData.getDescription();
let contentName: any;

test.describe(`Verify_that_the_course_status_does_not_change_to_In_Progress_when_an_admin_completes_the_course_and_the_learner_later_launches_it_from_the_learner_side.spec.ts`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`The admin enrolls the learner and marks the single-instance eLearning course as completed.`, async ({ adminHome, createCourse, enrollHome, contentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `The admin enrolls the learner and marks the single-instance eLearning course as completed.` },
            { type: `Test Description`, description: `The admin enrolls the learner and marks the single-instance eLearning course as completed.` }
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
        await createCourse.contentLibrary();//Youtube content is attached here
        contentName = await createCourse.getAttachedContentName()
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
        await enrollHome.selectBycourse(courseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        await enrollHome.clickModifyEnrollBtn();
        await enrollHome.selectEnrollOrCancel("Completed");
        await enrollHome.completionDateInAdminEnrollment();
        await enrollHome.verifytoastMessage();
    })

    test(`Verify that a course already marked as 'Completed' by the admin does not revert to 'In Progress' when accessed by the learner.spec.ts`, async ({ learnerHome, catalog ,dashboard}) => {
        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Verify that a course already marked as 'Completed' by the admin does not revert to 'In Progress' when accessed by the learner.spec.ts` },
            { type: `Test Description`, description: `Verify that a course already marked as 'Completed' by the admin does not revert to 'In Progress' when accessed by the learner.spec.ts` }
        );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await catalog.clickMyLearning();
        await dashboard.selectDashboardItems("Learning History");
        await dashboard.learningHistoryCourseSearch(courseName);
        await dashboard.vaidatVisibleCourse_Program(courseName, "Completed");  //Course status before launching the content
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatusBookmark();
        await catalog.verifyStatus("Completed");  //Course status after launching the content
        // await catalog.verifyContentProgressValue(contentName); //Content progress value verification   (100%)  

    })

})
