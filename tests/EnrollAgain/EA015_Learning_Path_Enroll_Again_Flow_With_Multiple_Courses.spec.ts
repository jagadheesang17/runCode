import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";

const courseNameUnchecked = FakerData.getCourseName() + "_Unchecked";
const courseNameChecked = FakerData.getCourseName() + "_Checked";
const lpName = FakerData.getCourseName() + "_LP";
const description = FakerData.getDescription();

test.describe(`EA015_Learning_Path_Enroll_Again_Flow_With_Multiple_Courses`, async () => {
    test.describe.configure({ mode: 'serial' });

    test(`Verify_Site_Admin_Enroll_Again_Checked`, async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify_Site_Admin_Enroll_Again_Checked` },
            { type: `Test Description`, description: `Verify site admin enroll again is checked` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await adminHome.siteAdmin_Adminconfig();
        await siteAdmin.clickBusinessRulesEditIcon();
        await siteAdmin.checkAllowLearnersEnrollAgainDefault();
        await siteAdmin.verifyAllowLearnersEnrollAgainDefault(false);
    });

    test(`Create_Two_Courses_With_Different_Enroll_Again_Settings`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create_Two_Courses_With_Different_Enroll_Again_Settings` },
            { type: `Test Description`, description: `Create first course with enroll again unchecked and second course with enroll again checked` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        
        // Create first course - Enroll again unchecked
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseNameUnchecked);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("Course with enroll again unchecked: " + description);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await createCourse.clickEditCourseTabs();
        await editCourse.clickBusinessRule();
        await editCourse.verifyAllowLearnersEnrollAgain(false); // Verify checked (inherited from site admin)
        await editCourse.uncheckAllowLearnersEnrollAgain(); // Uncheck at course level
        await editCourse.verifyAllowLearnersEnrollAgain(true); // Verify unchecked
        await createCourse.typeDescription("Business Rule - Enroll again unchecked for " + courseNameUnchecked);
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

        // Create second course - Enroll again checked
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseNameChecked);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("Course with enroll again checked: " + description);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await createCourse.clickEditCourseTabs();
        await editCourse.clickBusinessRule();
        await editCourse.verifyAllowLearnersEnrollAgain(false); // Verify checked (inherited from site admin)
        await createCourse.typeDescription("Business Rule - Enroll again enabled for " + courseNameChecked);
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    });

    test(`Create_Learning_Path_And_Verify_Enroll_Again_Popup`, async ({ editCourse,adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create_Learning_Path_And_Verify_Enroll_Again_Popup` },
            { type: `Test Description`, description: `Create Learning Path and verify popup when adding course without enroll again` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
        await learningPath.title(lpName);
        await learningPath.language();
        await learningPath.description(description);
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
         await editCourse.clickBusinessRule();
        await editCourse.verifyAllowLearnersEnrollAgain(false);
        // Try to add first course (with unchecked enroll again)
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseNameUnchecked);
        await learningPath.clickAddSelectCourse();
        
        // Verify popup message
        await learningPath.verifyEnrollAgainPopupMessage();
        await learningPath.verifyEnrollAgainPopupCourseName(courseNameUnchecked);
        await learningPath.clickEnrollAgainPopupOK();
       
        // Add second course (with checked enroll again)
        await learningPath.searchAndClickCourseCheckBox(courseNameChecked);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();

        // Publish Learning Path
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await learningPath.verifySuccessMessage();
    });

    test(`Verification_From_Learner_Site_Complete_And_Reenroll`, async ({ learnerHome, catalog, learnerCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verification_From_Learner_Site_Complete_And_Reenroll` },
            { type: `Test Description`, description: `Verify learner can complete LP and enroll again` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "Portal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(lpName);
        await catalog.clickEnrollButton();
        await catalog.clickViewLearningPathDetails();
        
        // Complete the course in LP
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        
        // Click enroll again
        await learnerCourse.clickReEnrollLP(); 
        // Complete again
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
    });
});
