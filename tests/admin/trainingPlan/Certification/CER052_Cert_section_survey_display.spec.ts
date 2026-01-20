import { test } from "../../../../customFixtures/expertusFixture"
import { FakerData } from "../../../../utils/fakerUtils";

const suveyTitle = FakerData.getRandomTitle();
let courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const title = FakerData.getCourseName();
const question1 = FakerData.generateQuestion();
const question2 = FakerData.generateQuestion();


test.describe(`Verify_that_the_created_survey_questions_within_the_section_are_displayed_on_the_course_details_page_for_the_learner_after_completing_the_content`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Creating the survey with questions under the section level`, async ({ adminHome, SurveyAssessment }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Balasundar' },
            { type: 'TestCase', description: 'Verify_that_a_user_can_successfully_create_a_survey_add_questions_and_publish_it_for_participants.spec.ts' },
            { type: 'Test Description', description: `Verify_that_a_user_can_successfully_create_a_survey_add_questions_and_publish_it_for_participants.spec.ts` }
        );
        await adminHome.loadAndLogin("LEARNERADMIN")
        await adminHome.isSignOut();
        await adminHome.menuButton();
        await adminHome.survey();
        await adminHome.clickOnsurveyLink();
        await SurveyAssessment.clickCreateSurvey();
        await SurveyAssessment.fillSurveyTitle(suveyTitle);
        await SurveyAssessment.selectLanguage();
        await SurveyAssessment.fillDescription();
        await SurveyAssessment.clickSaveDraft();
        await SurveyAssessment.clickProceed();

        async function createQuestion(questionType: any) {
            await SurveyAssessment.page.waitForTimeout(2000);

            // await SurveyAssessment.enterQuestions();
            await SurveyAssessment.page.waitForTimeout(2000);

            await SurveyAssessment.selectLanguage();
            await SurveyAssessment.selectingType(questionType);
            await SurveyAssessment.displayOption();
            await SurveyAssessment.page.waitForTimeout(2000);


            // await SurveyAssessment.clickBlankActionBtn();
        }
        await SurveyAssessment.checkRequired("1");

        await SurveyAssessment.enterQuestionsDirectly(question1);

        await createQuestion("Dropdown");
        await SurveyAssessment.clickBlankActionBtn();
        await SurveyAssessment.page.waitForTimeout(3000);

        await SurveyAssessment.clickOnMinusIcon();
        
        await SurveyAssessment.checkRequiredAtSectionLevel("2", "1");
        await SurveyAssessment.enterQuestionsDirectly(question2);
        await createQuestion("Dropdown");
        await SurveyAssessment.clickBlankActionBtn();
        await SurveyAssessment.page.waitForTimeout(3000);

        // await SurveyAssessment.clickOnPlusIcon();

        // await createQuestion("Dropdown");
        // await SurveyAssessment.clickBlankActionBtn();
        // await SurveyAssessment.page.waitForTimeout(3000);



        await SurveyAssessment.clickPublish();
        await SurveyAssessment.verifySuccessMessage();
    });


    test(`Creation of Elearning Course`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Creation of Elearning Course` },
            { type: `Test Description`, description: `Creation of Elearning Course` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN1")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course,:" + description);
        await createCourse.contentLibrary(); //By default Youtube content will be attached to the course
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

    })


    test(`Attaching the created survey to the certification`, async ({ adminHome, learningPath, createCourse, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Certification Creation with pre and post assessment attached` },
            { type: `Test Description`, description: `Certification Creation with pre and post assessment attached` }
        )

        await adminHome.loadAndLogin("CUSTOMERADMIN1")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(title);
        await learningPath.description(description);
        await learningPath.language();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        await learningPath.clickEditCertification();
        await createCourse.addSpecificSurveyCourse(suveyTitle)
        await createCourse.checkConsiderForCompletionCheckbox();
        await createUser.clickSave();
        await createCourse.clickDetailButton();
        await createCourse.clickCatalog()
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    })


    test(`Verify that the created survey questions within the section are displayed on the course details page for the learner after completing the content`, async ({ learnerHome, catalog, dashboard }) => {


        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickCatalog();
        await catalog.searchCatalog(title);
        await catalog.clickEnrollButton();
        await catalog.clickViewCertificationDetails();
        await catalog.saveLearningStatus();


        await catalog.clickSurveyLaunchButton();
        await catalog.clickAssessmentSurvey();

        await catalog.verifySurveyQuestions([question1]);

        async function surveyAtSection1() {
            await catalog.writeContent();
        }
        await surveyAtSection1();
        await catalog.clickSurveyLaunchButton();

        await catalog.clickSection2();
        await catalog.verifySurveyQuestions([question2]);

        async function surveyAtSection2() {
            await catalog.writeContent();
            await catalog.clickSubmitSurvey();
        }

        await surveyAtSection2();
        await catalog.clickDoneButton();


    })
})
