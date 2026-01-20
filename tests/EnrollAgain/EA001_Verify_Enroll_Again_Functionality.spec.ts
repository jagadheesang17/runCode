import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();

test.describe(`EA001 Verify Enroll Again Functionality`, async () => {
    test.describe.configure({ mode: 'serial' });
    
    test(`EA001_Verify_Allow_Learners_To_Enroll_Again_Default_Unchecked_In_SiteAdmin`, async ({ adminHome, siteAdmin, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify Allow learners to enroll again (default) is unchecked in Site Admin` },
            { type: `Test Description`, description: `Verify that 'Allow learners to enroll again (default)' checkbox is unchecked in Site Admin Business Rules` }
        );
        
        // Step 1: Login as Customer Admin
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        
        // Step 2: Navigate to Site Admin -> Admin Configuration -> Business Rules
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await adminHome.siteAdmin_Adminconfig();
        await siteAdmin.clickBusinessRulesEditIcon();
        
        // Step 3: Verify 'Allow learners to enroll again (default)' checkbox is unchecked
        await siteAdmin.verifyAllowLearnersEnrollAgainDefault(true);
        
        // Step 4: If checked, uncheck it
        await siteAdmin.uncheckAllowLearnersEnrollAgainDefault();
    });

    test(`EA001_Create_Course_And_Verify_Allow_Learners_To_Enroll_Again_Checkbox`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create Course and Verify Allow learners to enroll again checkbox` },
            { type: `Test Description`, description: `Verify that when 'Allow learners to enroll again (default)' is unchecked in Site Admin, the course-level checkbox is also unchecked` }
        );
        
        // Step 1: Login as Customer Admin (if not already logged in)
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        
        // Step 2: Navigate to Learning -> Course
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        
        // Step 3: Create a new course
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name: " + description);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        
        // Step 4: Navigate to Business Rule tab
        await createCourse.clickEditCourseTabs();
        await editCourse.clickBusinessRule();
        
        // Step 5: Verify 'Allow learners to enroll again' checkbox is unchecked
        await editCourse.verifyAllowLearnersEnrollAgain(true);

        // Step 4: Check 'Allow learners to enroll again' checkbox
        await editCourse.checkAllowLearnersEnrollAgain();
        
        // Step 5: Verify the checkbox is now checked
        await editCourse.verifyAllowLearnersEnrollAgain(false);
    });


    test(`EA001_Learner_Side_Verification_Enroll_Again`, async ({ learnerHome, learnerCourse, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Learner Side - Enroll Again Verification` },
            { type: `Test Description`, description: `Verify that learner can enroll again in the same course after completion when 'Allow learners to enroll again' is enabled` }
        );
        
        // Step 1: Login as Learner
        await learnerHome.learnerLogin("LEARNERUSERNAME", "Portal");
        
        // Step 2: Navigate to Catalog and search for the course
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(courseName);
        await catalog.clickMoreonCourse(courseName);
        
        // Step 3: Enroll in the course
        await catalog.clickSelectcourse(courseName);
        await catalog.clickEnroll();
        
        // Step 4: Launch and complete the course
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        
        // Step 5: Enroll again in the course
        await learnerCourse.clickReEnroll();
        //await catalog.clickSelectcourse(courseName);
        await catalog.clickEnroll();
        
        // Step 6: Verify and confirm enroll again popup
        await learnerCourse.reEnrollPopup();
        
        // Step 7: Launch and complete the course again
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        
        // Step 8: Verify the course appears in Completed section
        await catalog.clickMyLearning();
        await catalog.clickCompletedButton();
        await catalog.verifyCompletedCourse(courseName);
    });
});
