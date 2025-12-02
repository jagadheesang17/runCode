import { credentials } from "../../constants/credentialData";
import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";



const courseName = FakerData.getCourseName();
const description = FakerData.getDescription()
const sessionName = FakerData.getSession();
const elCourseName = ("Elearning" + " " + FakerData.getCourseName());
const iltCourseName = ("ILT" + " " + FakerData.getCourseName());
const instructorName = credentials.INSTRUCTORNAME.username;

    test.describe.configure({ mode: 'serial' })
    test(`Verify_Allow_Learners_To_Enroll_Again_Default_Checked_In_SiteAdmin`, async ({ adminHome, siteAdmin, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify Allow learners to enroll again (default) is checked in Site Admin` },
            { type: `Test Description`, description: `Verify that 'Allow learners to enroll again (default)' checkbox is checked in Site Admin Business Rules` }
        );
        
        // Step 1: Login as Customer Admin
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        
        // Step 2: Navigate to Site Admin -> Admin Configuration -> Business Rules
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await adminHome.siteAdmin_Adminconfig();
        await siteAdmin.clickBusinessRulesEditIcon();
        
        // Step 3: If unchecked, check it; if already checked, skip
        await siteAdmin.checkAllowLearnersEnrollAgainDefault();
        
        // Step 4: Verify 'Allow learners to enroll again (default)' checkbox is checked
        await siteAdmin.verifyAllowLearnersEnrollAgainDefault(false);
    });

    test(`Verify_that_the_learner_is_able_to_re-enroll_after_completing_Instance_1_of_a_multi-instance_eLearning_course`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify_that_the_learner_is_able_to_re-enroll_after_completing_Instance_1_of_a_multi-instance_eLearning_course` },
            { type: `Test Description`, description: `Verify_that_the_learner_is_able_to_re-enroll_after_completing_Instance_1_of_a_multi-instance_eLearning_course` }
        );          

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.clickMenu("Course");
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.selectdeliveryType("Classroom");
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.editcourse();
        await editCourse.clickBusinessRule();
        // Step 5: Verify 'Allow learners to enroll again' checkbox is checked (inherited from Site Admin)
        await editCourse.verifyAllowLearnersEnrollAgain(false);
        async function addinstance(deliveryType: string) {
            await createCourse.selectInstanceDeliveryType(deliveryType);
            await createCourse.clickCreateInstance();
        }
        await createCourse.addInstances();
        await addinstance("Classroom");
          await createCourse.enter("course-title", iltCourseName);
        await createCourse.enterSessionName(sessionName);
        await createCourse.setMaxSeat();
        await createCourse.enterDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        await createCourse.editcourse();
        await createCourse.clickinstanceClass();
        await createCourse.addInstances();
        await addinstance("E-Learning");
        await createCourse.enter("course-title", elCourseName);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log(courseName);
        console.log(iltCourseName);
        console.log(elCourseName);
    })


    test(`Verification from learner site`, async ({ learnerHome, learnerCourse, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify that learner can enroll again by clicking Enroll Again button after completing instance 1` },
            { type: `Test Description`, description: `Verify that learner can enroll again in instance 2 after completing instance 1 when enroll again is enabled` }
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
        await catalog.clickSelectcourse(iltCourseName);
        await catalog.clickEnroll();
        await learnerCourse.reEnrollPopup();
        await catalog.verifyStatus("Enrolled");
    })