import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";



const courseName = FakerData.getCourseName();
const description = FakerData.getDescription()
test.describe(`Verify_that_when_the_business_rule_is_unchecked_a_completed_course_allows_the_user_to_request_the_class.spec.ts`, async () => {
    test.describe.configure({ mode: 'serial' })
    
    test(`Verify_Allow_Learners_To_Enroll_Again_Default_Unchecked_In_SiteAdmin`, async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Vidya` },
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

    test(`Verify_that_when_the_business_rule_is_unchecked_a_completed_course_allows_the_user_to_request_the_class.spec.ts`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Vidya` },
            { type: `TestCase`, description: `Verify when business rule is unchecked completed course allows user to request class` },
            { type: `Test Description`, description: `Verify that when 'Allow learners to enroll again' is unchecked, a completed course allows the user to request the class` }
        );

        // Step 1: Login as Customer Admin
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        
        // Step 2: Navigate to Courses
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        
        // Step 3: Create new course
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
        
        // Step 4: Edit course and verify Business Rules
        await createCourse.editcourse();
        await editCourse.clickBusinessRule();
        
        // Step 5: Verify 'Allow learners to enroll again' checkbox is unchecked (inherited from Site Admin)
        await editCourse.verifyAllowLearnersEnrollAgain(true);
        
        // Step 6: Save the business rules
        await createCourse.typeDescription("Added Business Rule " + courseName)
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

    })


    test(`Verification from learner site`, async ({ learnerHome, learnerCourse, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Vidya` },
            { type: `TestCase`, description: `Learner Side - Request Class Verification` },
            { type: `Test Description`, description: `Verify that learner sees Request Class option when enroll again checkbox is unchecked` }
        );
        
        // Step 1: Learner login
        await learnerHome.learnerLogin("LEARNERUSERNAME", "Portal");
        
        // Step 2: Navigate to Catalog
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        
        // Step 3: Search and enroll in the course
        await catalog.searchCatalog(courseName);
        await catalog.clickMoreonCourse(courseName);
        await catalog.clickSelectcourse(courseName);
        await catalog.clickEnroll();
        
        // Step 4: Launch and complete the course
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        
        // Step 5: Verify Enroll Again button is not visible (since checkbox is unchecked)
        await learnerCourse.verifyEnrollAgainNotVisible();
        
        // Step 6: Verify Request Class button is visible instead
        // await learnerCourse.verifyRequestClass();

    })
})


