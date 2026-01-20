import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";

const courseName = FakerData.getCourseName();
const lpName = FakerData.getCourseName() + "_LP";
const description = FakerData.getDescription();

test.describe(`EA016_Learning_Path_Course_Enroll_Again_Uncheck_Restriction`, async () => {
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

    test(`Create_Course_And_Add_To_Learning_Path`, async ({ adminHome, createCourse, editCourse, learningPath }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create_Course_And_Add_To_Learning_Path` },
            { type: `Test Description`, description: `Create E-learning course and add to learning path` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        
        // Create course
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("Course for LP: " + description);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await createCourse.clickEditCourseTabs();
        await editCourse.clickBusinessRule();
        await editCourse.verifyAllowLearnersEnrollAgain(false); // Verify checked (inherited from site admin)
        await createCourse.typeDescription("Business Rule verified for " + courseName);
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

        // Create Learning Path and add course
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
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await learningPath.verifySuccessMessage();
    });

    test(`Verify_Cannot_Uncheck_Enroll_Again_For_Course_In_LP`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify_Cannot_Uncheck_Enroll_Again_For_Course_In_LP` },
            { type: `Test Description`, description: `Verify popup appears when trying to uncheck enroll again for course that is part of LP` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.searchCourse(courseName);
        await createCourse.clickEditIcon();
        await editCourse.clickBusinessRule();
        await editCourse.verifyAllowLearnersEnrollAgain(false); // Verify checked
        await editCourse.uncheckAllowLearnersEnrollAgain(); // Try to uncheck
        // Verify popup message
        await createCourse.verifyLPRestrictionPopup();
        await createCourse.clickLPRestrictionOK();
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
        await catalog.saveLearningStatus();
        
        // Click enroll again
        await learnerCourse.clickReEnrollLP();
        // Complete again
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
    });
});
