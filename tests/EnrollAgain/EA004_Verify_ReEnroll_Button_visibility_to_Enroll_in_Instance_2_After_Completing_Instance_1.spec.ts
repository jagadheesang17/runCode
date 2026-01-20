import { credentials } from "../../constants/credentialData";
import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";



const courseName = FakerData.getCourseName();
const description = FakerData.getDescription()
const elCourseName = ("Elearning" + " " + FakerData.getCourseName());
const elCourseName2 = ("Elearning" + " " + FakerData.getCourseName());

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
test(`Verify that Re-Enroll button is visible for Instance 2 after Completing Instance 1`, async ({ adminHome, createCourse, editCourse }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `The Re-Enroll button should be visible for Instance 2, allowing users to register for the next available instance of the course` },
        { type: `Test Description`, description: `The Re-Enroll button should be visible for Instance 2, allowing users to register for the next available instance of the course` }
    );

    await adminHome.loadAndLogin("CUSTOMERADMIN")
    await adminHome.clickMenu("Course");
    await createCourse.verifyCreateUserLabel("CREATE COURSE");
    await createCourse.enter("course-title", courseName);
    await createCourse.selectLanguage("English");
    await createCourse.typeDescription(description);
    await createCourse.selectInstance();
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
    await addinstance("E-Learning");
    await createCourse.enter("course-title", elCourseName);
    await createCourse.contentLibrary();
    await createCourse.clickCatalog();
    await createCourse.clickUpdate();
    await createCourse.verifySuccessMessage();
    await createCourse.editcourse();
    await createCourse.clickinstanceClass();
    await createCourse.addInstances();
    await addinstance("E-Learning");
    await createCourse.enter("course-title", elCourseName2);
    await createCourse.contentLibrary();
    await createCourse.clickCatalog();
    await createCourse.clickUpdate();
    await createCourse.verifySuccessMessage();
    console.log(courseName);
    console.log(elCourseName);
    console.log(elCourseName2);
})


test(`Verification from learner site`, async ({ learnerHome, learnerCourse, catalog }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Verify that learner can see the Enroll Again button after completing instance 1` },
        { type: `Test Description`, description: `Verify that learner can see the Enroll Again button after completing instance 1 when checkbox is unchecked` }
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
    await catalog.clickSelectcourse(elCourseName2);
    await catalog.clickEnroll();
    // Step 6: Verify and confirm enroll again popup
    await learnerCourse.reEnrollPopup();
    // Step 7: Launch and complete the course again
    await catalog.clickLaunchButton();
    await catalog.saveLearningStatus();

})


