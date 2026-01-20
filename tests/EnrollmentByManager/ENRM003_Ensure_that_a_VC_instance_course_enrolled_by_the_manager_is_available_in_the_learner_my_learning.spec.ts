import { credentials } from "../../constants/credentialData";
import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
const courseName =  ("VC for" + " " + FakerData.getCourseName());
const instructorName = credentials.INSTRUCTORNAME.username
let createdCode: any
test.describe(`Confirm that Admin enrollments functions correctly and as expected for Virtual class course`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Creation of Virtual class course`, async ({ adminHome, createCourse, contentHome,enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Creation of Virtual class course` },
            { type: `Test Description`, description: `Creation of Virtual class course` }

        );
        //Faker data:
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name :" + courseName);
        await createCourse.selectdeliveryType("Virtual Class");
        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown()
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await createCourse.clickEditCourseTabs();
        await createCourse.addInstances();

        async function addinstance(deliveryType: string) {
            await createCourse.selectInstanceDeliveryType(deliveryType);
            await createCourse.clickCreateInstance();
        }
        await addinstance("Virtual Class");
        await createCourse.selectMeetingType(instructorName, courseName, 1);
        await createCourse.typeAdditionalInfo()
        await createCourse.setMaxSeat();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
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
        // await catalog.clickLaunchButton();
        // await catalog.saveLearningStatus();
        // await catalog.clickMyLearning();
        // await catalog.clickCompletedButton();
        // await catalog.searchMyLearning(courseName);
        // await catalog.verifyCompletedCourse(courseName);


    })

})