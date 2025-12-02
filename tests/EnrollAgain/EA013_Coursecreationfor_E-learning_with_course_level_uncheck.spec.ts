import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";



const courseName = FakerData.getCourseName();
const description = FakerData.getDescription()
test.describe(`TC107 Course creation for E-learning with course level uncheck`, async () => {
    test.describe.configure({ mode: 'serial' })
    
    test(`Verify_Allow_Learners_To_Enroll_Again_Default_Checked_In_SiteAdmin`, async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify Allow learners to enroll again (default) is checked in Site Admin` },
            { type: `Test Description`, description: `Verify that 'Allow learners to enroll again (default)' checkbox is checked in Site Admin Business Rules` }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await adminHome.siteAdmin_Adminconfig();
        await siteAdmin.clickBusinessRulesEditIcon();
        await siteAdmin.checkAllowLearnersEnrollAgainDefault();
        await siteAdmin.verifyAllowLearnersEnrollAgainDefault(false);
    });

    test(`TC107_CreateCourseForElearning_With_Course_Level_Uncheck`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create course and uncheck Allow learners to enroll again at course level` },
            { type: `Test Description`, description: `Verify that course business rule can override site admin setting by unchecking enroll again` }
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
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await createCourse.clickEditCourseTabs();
        await editCourse.clickBusinessRule();
        await editCourse.verifyAllowLearnersEnrollAgain(false);
        await editCourse.uncheckAllowLearnersEnrollAgain();
        await createCourse.typeDescription("Added Business Rule - Unchecked enroll again at course level " + courseName)
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();


    })


    test(`Verification from learner site`, async ({ learnerHome, learnerCourse, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Learner Side - Enroll Again Verification` },
            { type: `Test Description`, description: `Verify that learner cannot enroll again when course level checkbox is unchecked - Request Class should be visible` }
        );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "Portal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(courseName);
        await catalog.clickMoreonCourse(courseName);
        await catalog.clickSelectcourse(courseName);
        await catalog.clickEnroll();
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await learnerCourse.verifyEnrollAgainNotVisible();
    })
})


