import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";

const courseName = FakerData.getCourseName() + "_Compliance";
const description = FakerData.getDescription();

test.describe(`TC108 Verify Compliance Course Requires Enroll Again Enabled`, async () => {
    test.describe.configure({ mode: 'serial' });
    
    test(`Verify_Allow_Learners_To_Enroll_Again_Default_Unchecked_In_SiteAdmin`, async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify Allow learners to enroll again (default) is unchecked in Site Admin` },
            { type: `Test Description`, description: `Uncheck 'Allow learners to enroll again (default)' in Site Admin to test compliance course validation` }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await adminHome.siteAdmin_Adminconfig();
        await siteAdmin.clickBusinessRulesEditIcon();
        await siteAdmin.uncheckAllowLearnersEnrollAgainDefault();
        await siteAdmin.verifyAllowLearnersEnrollAgainDefault(true);
    });

    test(`TC108_Create_Compliance_Course_Without_EnrollAgain_And_Enable_It`, async ({ adminHome,learningPath, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create Compliance Course and verify enroll again is required` },
            { type: `Test Description`, description: `When creating a compliance course without enroll again enabled, system should show popup requiring it to be enabled` }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.clickregistrationEnds();
        await createCourse.selectCompliance();
        console.log("✅ Compliance setting enabled for course");
        await learningPath.clickExpiresButton();
        console.log("✅ Course expiration setting configured");
        await createCourse.selectCompleteBy();
        await createCourse.selectCompleteByDate();
        console.log("✅ Complete by date rule configured");
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.verifyComplianceEnrollAgainPopup();
        
        // Click OK button on the popup
        await createCourse.clickOKButton();
        
         await createCourse.clickSave();
    
        // Click proceed on the save proceed popup
        await createCourse.clickProceed();
        
        // Edit course to enable enroll again
        await createCourse.clickEditCourseTabs()
        await editCourse.clickBusinessRule();
        await editCourse.checkAllowLearnersEnrollAgain();
        
        // Update with description
        await createCourse.typeDescription("Enabled Enroll Again for Compliance - " + courseName);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    });

    test(`Verification from learner site`, async ({ learnerHome, learnerCourse, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Learner Side - Compliance Course Enroll Again Verification` },
            { type: `Test Description`, description: `Verify that learner can enroll again in compliance course with recurring registration enabled` }
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
        await learnerCourse.clickReEnroll();
        await catalog.clickEnroll();
        await learnerCourse.reEnrollPopup();
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.clickMyLearning();
        await catalog.clickCompletedButton();
        await catalog.searchMyLearning(courseName);
        await catalog.verifyCompletedCourse(courseName);
    });
});
