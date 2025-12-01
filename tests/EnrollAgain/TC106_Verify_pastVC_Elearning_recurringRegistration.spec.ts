import { credentials } from "../../constants/credentialData";
import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";


const courseName = FakerData.getCourseName();
const elCourseName = FakerData.getCourseName() + "E-learning";
const description = FakerData.getDescription();
const instructorName = credentials.INSTRUCTORNAME.username
let tag: string;

test.describe(`TC106 Verify pastVC Elearning recurring Registration`, async () => {
    test.describe.configure({ mode: 'serial' })
    test(`TC105_Multiple Course Creation for Classroom`, async ({ createCourse, adminHome, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Vidya` },
            { type: `TestCase`, description: `Verify Multiple Course Creation for Classroom ` },
            { type: `Test Description`, description: `Multiple Course Creation for Classroom` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
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
        await createCourse.clickEditCourseTabs();
        await editCourse.clickTagMenu();
        tag = await editCourse.selectTags();
        console.log(tag);
        await editCourse.clickClose();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        await createCourse.clickEditCourseTabs();
        await createCourse.addInstances();
        async function addinstance(deliveryType: string) {
            await createCourse.selectInstanceDeliveryType(deliveryType);
            await createCourse.clickCreateInstance();
        }
        await addinstance("Virtual Class");
        await createCourse.selectMeetingTypeforPast(instructorName, courseName, 1);
        await createCourse.typeDescription("Added new istance for the course")
        await createCourse.setMaxSeat();
        await createCourse.clickHideinCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        await createCourse.editcourse();
        await createCourse.clickinstanceClass();
        await createCourse.addInstances();
        await addinstance("E-Learning");
        await createCourse.enter("course-title", elCourseName)
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        await createCourse.clickEditCourseTabs();
        await editCourse.clickBusinessRule();
        await editCourse.verifySingRegchkbox()
        await editCourse.clickUncheckSingReg()
        await createCourse.typeDescription("Added Business Rule " + courseName)
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

    })

    test(`Verification from learner site`, async ({ learnerHome, learnerCourse, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `vidya` },
            { type: `TestCase`, description: `Learner Side - Enroll Again Verification` },
            { type: `Test Description`, description: `Verify that learner can see Enroll Again button for past VC with recurring registration` }
        );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "Portal");
        // await learnerHome.clickCatalog();
        // await catalog.mostRecent();
        // await catalog.searchCatalog(courseName)
        // // await catalog.clickFilter();
        // // await catalog.enterSearchFilter(tag)
        // await catalog.selectresultantTags(tag);
        // await catalog.clickApply()
        // await catalog.clickMoreonCourse(courseName);
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(courseName);
        await catalog.clickMoreonCourse(courseName);
        await catalog.clickSelectcourse(elCourseName);
        await catalog.clickEnroll();
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await learnerCourse.clickReEnroll();
        await catalog.clickSelectcourse(courseName);
        await catalog.clickEnroll();
        // Should display "session is ended" message when past ILT class is clicked to enroll again
        await catalog.clickMyLearning();
        await catalog.clickCompletedButton()
        await catalog.verifyCompletedCourse(elCourseName)
    })



})