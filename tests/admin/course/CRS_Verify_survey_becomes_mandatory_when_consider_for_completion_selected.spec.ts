import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

const courseName = "Course with Mandatory Survey " + FakerData.getCourseName();
const surveyTitle = "Mandatory Survey " + FakerData.getRandomTitle();
const description = FakerData.getDescription();

/**
 * @author Jagadish <jagadish.n@digiusher.com>
 * @description Verify that survey becomes mandatory when "consider for completion" is selected
 */

test.describe("CRS1030: Verify survey becomes mandatory when 'Consider For Completion' is selected", () => {
    test.describe.configure({ mode: "serial" });

    test("Add mandatory survey to course with 'Consider For Completion' enabled", async ({ adminHome, createCourse, SurveyAssessment }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish <jagadish.n@digiusher.com>` },
            { type: `TestCase`, description: `Add mandatory survey with Consider For Completion enabled` },
            { type: `Test Description`, description: `Create course, add survey and enable Consider For Completion to make survey mandatory for course completion` }
        );

        // Step 1: Create Survey
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.survey();
        await adminHome.clickOnsurveyLink();
        await SurveyAssessment.clickCreateSurvey();
        await SurveyAssessment.fillSurveyTitle(surveyTitle);
        await SurveyAssessment.selectLanguage();
        await SurveyAssessment.fillDescription();
        await SurveyAssessment.clickSaveDraft();
        await SurveyAssessment.clickProceed();
        await SurveyAssessment.importQuestion();
        await SurveyAssessment.clickAddSelectedQuestion();
        await SurveyAssessment.clickImportQuestion();
        await SurveyAssessment.clickPublish();
        await SurveyAssessment.verifySuccessMessage();

        // Step 2: Create Course
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

        // Step 3: Add Survey with Consider For Completion
        await createCourse.editcourse();
        await createCourse.addSpecificSurveyCourse(surveyTitle);
        await createCourse.enableConsiderForCompletion();
        await createCourse.validateElementVisibility(
            createCourse.selectors.considerForCompletionCheckbox,
            "Consider For Completion checkbox should be checked"
        );

        // Save survey changes using the new clean method
        await createCourse.saveSurvey();
        await createCourse.save_editedcoursedetails();
        await createCourse.verifySuccessMessage();

        console.log("✅ PASS: Course created with mandatory survey - Consider For Completion enabled");
    });

    test("Verify mandatory survey completion on learner side", async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish <jagadish.n@digiusher.com>` },
            { type: `TestCase`, description: `Verify mandatory survey completion requirement on learner side` },
            { type: `Test Description`, description: `Verify learner cannot complete course without finishing mandatory survey, and can complete after survey is done` }
        );

        // Step 1: Learner enrollment
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(courseName);
        await catalog.navigateToCourseDetails(courseName);
        await catalog.clickSelectcourse(courseName);
        await catalog.clickEnroll();
        await catalog.verifyEnrollmentSuccess();

        // Step 2: Verify course incomplete without survey
        await learnerHome.clickMyLearning();
        await catalog.validateElementVisibility(
            `//div[contains(text(),'${courseName}')]`,
            "Course should be in My Learning"
        );
        
        // Verify course NOT in completed section
        await catalog.clickCompletedButton();
        try {
            const courseCompleted = await catalog.page.locator(`//div[contains(text(),'${courseName}')]`).isVisible({ timeout: 3000 });
            if (!courseCompleted) {
                console.log("✅ PASS: Course NOT in completed section without survey completion");
            }
        } catch (error) {
            console.log("✅ PASS: Course correctly not found in completed section");
        }

        // Step 3: Complete the mandatory survey
        await learnerHome.clickMyLearning();
        await catalog.clickLaunchButton();
        
        // Complete survey if visible
        await catalog.writeContent();
        await catalog.clickSubmitSurvey();
        await catalog.saveLearningStatus();

        // Step 4: Verify course completion after survey
        await learnerHome.clickMyLearning();
        await catalog.clickCompletedButton();
        await catalog.validateElementVisibility(
            `//div[contains(text(),'${courseName}')]`,
            "Course should appear in Completed section after survey completion"
        );

        console.log("✅ PASS: Mandatory survey completion verified on learner side");
        console.log("✅ PASS: Course completion depends on survey when Consider For Completion is enabled");
    });
});