import { credentials } from "../../constants/credentialData";
import { test } from "../../customFixtures/expertusFixture";
import { FakerData, getRandomSeat } from "../../utils/fakerUtils";


const courseName = FakerData.getCourseName();
const elCourseName = FakerData.getCourseName() + " E-learning";
const iltCourseName = FakerData.getCourseName() + " Classroom";
const sessionName = FakerData.getSession();
const description = FakerData.getDescription();
const instructorName = credentials.INSTRUCTORNAME.username
let tag: string;

test.describe(`TC104 Verify past Class recurring Registration`, async () => {
    test.describe.configure({ mode: 'serial' })

    test(`Verify_Allow_Learners_To_Enroll_Again_Default_Unchecked_In_SiteAdmin`, async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Vidya` },
            { type: `TestCase`, description: `Verify Allow learners to enroll again (default) is unchecked in Site Admin` },
            { type: `Test Description`, description: `Verify that 'Allow learners to enroll again (default)' checkbox is unchecked in Site Admin Business Rules` }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await adminHome.siteAdmin_Adminconfig();
        await siteAdmin.clickBusinessRulesEditIcon();
        await siteAdmin.verifyAllowLearnersEnrollAgainDefault(true);
        await siteAdmin.uncheckAllowLearnersEnrollAgainDefault();
    });

    test(`TC104_Recurring Registration for past date`, async ({ createCourse, adminHome, editCourse }) => {
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
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.clickEditCourseTabs()
        await editCourse.clickTagMenu();
        tag = await editCourse.selectTags();
        console.log(tag);
        await editCourse.clickClose();
        await createCourse.typeDescription(description);
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        await createCourse.clickEditCourseTabs();
        await editCourse.clickBusinessRule();
        await editCourse.verifyAllowLearnersEnrollAgain(true);
        await editCourse.checkAllowLearnersEnrollAgain();
        await editCourse.verifyAllowLearnersEnrollAgain(false);
        await createCourse.addInstances();
        async function addinstance(deliveryType: string) {
            await createCourse.selectInstanceDeliveryType(deliveryType);
            await createCourse.clickCreateInstance();
        }
        await addinstance("Classroom");
        await createCourse.enter("course-title", iltCourseName + " Classroom");
        await createCourse.enterSessionName(sessionName);
        await createCourse.setMaxSeat();
        await createCourse.enterpastDateValue();
        await createCourse.selectLocation();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.typeDescription("Added Elearning and Classroom instance")
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
    })

    test(`Verification from learner site`, async ({ learnerHome, learnerCourse, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `vidya` },
            { type: `TestCase`, description: `Learner Side - Enroll Again Verification` },
            { type: `Test Description`, description: `Verify that learner can see Enroll Again button for past class with recurring registration` }
        );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "Portal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(courseName);
        await catalog.clickMoreonCourse(courseName);
        await catalog.clickSelectcourse(elCourseName);
        await catalog.clickEnroll();
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await learnerCourse.clickReEnroll();
        await catalog.verifyCourseNotVisibleInCatalog(sessionName);
   
    })
})
