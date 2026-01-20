import { credentials } from "../../constants/credentialData";
import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
const courseName = ("ILT for" + " " + FakerData.getCourseName());
const sessionName = FakerData.getSession();
const elCourseName = ("Elearning" + " " + FakerData.getCourseName());
const description = FakerData.getDescription();
let createdCode: any
const instructorName = credentials.INSTRUCTORNAME.username
test.describe(`Confirm that Manager enrollment functions correctly and as expected for ILT course`, () => {
    test.describe.configure({ mode: "serial" });
    test(`Creation of ILT Course`, async ({ adminHome, createCourse, editCourse,enrollHome,contentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create the course as multiple instance` },
            { type: `Test Description`, description: `Verify that course should be created as multiple instance when ILT or VC delivery type is chosen` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.clickMenu("Course");
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.selectdeliveryType("Classroom")
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
        await addinstance("Classroom");
        await createCourse.enterSessionName(sessionName);
        await createCourse.setMaxSeat();
        await createCourse.enterDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
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
        // await catalog.searchMyLearning(courseN   ame);
        // await catalog.verifyCompletedCourse(courseName);


    })

})