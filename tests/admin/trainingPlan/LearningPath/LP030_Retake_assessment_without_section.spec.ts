import { create } from "domain";
import { test } from "../../../../customFixtures/expertusFixture";
import { FakerData } from "../../../../utils/fakerUtils";


let courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const preAssessmentTitle = ("PreAssmt " + FakerData.AssessmentTitle());
const postAssessmentTitle = ("PostAssmt " + FakerData.AssessmentTitle());
let preAssessmentScore: any;
let postAssessmentScore: any;
const question1 = FakerData.generateQuestion();
const question2 = FakerData.generateQuestion();
const question3 = FakerData.generateQuestion();
const question4 = FakerData.generateQuestion();
const rightanswerFeedback = "Right Answer";
const wrongAnswerFeedback = "Wrong Answer";




test.describe(`Verify_that_the_learner_can_retake_the_assessment_after_failing_it_in_the_first_attempt_for_a_without_section_level_assessment`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Creation of Pre-Assessment`, async ({ adminHome, SurveyAssessment }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Balasundar` },
            { type: `TestCase`, description: `Creatation of Pre-Assessment` },
            { type: `Test Description`, description: `Creatation of Pre-Assessment` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN1")
        await adminHome.isSignOut();
        await adminHome.menuButton();
        await adminHome.assessmentMenu();
        await adminHome.clickOnAssessmentLink();
        await SurveyAssessment.clickCreateAssessment();
        await SurveyAssessment.fillAssessmentTitle(preAssessmentTitle);
        await SurveyAssessment.selectLanguage();
        await SurveyAssessment.fillDescription();
        await SurveyAssessment.enterPasspercentage("50")
        await SurveyAssessment.selectRandomizeOption("No");
        await SurveyAssessment.enterNofAttempts("2")
        await SurveyAssessment.clickSaveDraft();
        await SurveyAssessment.clickProceed();

        async function createQuestion(questionType: any) {
            // Small wait to ensure the question form is fully loaded
            await SurveyAssessment.page.waitForTimeout(2000);
            await SurveyAssessment.displayOption();
            await SurveyAssessment.selectingType(questionType);
             await SurveyAssessment.enterRightAnswerFeedback(rightanswerFeedback);
            await SurveyAssessment.enterWrongAnswerFeedback(wrongAnswerFeedback);
            // await SurveyAssessment.clickBlankActionBtn();
        }
        await SurveyAssessment.checkRequired("1");
        await SurveyAssessment.enterQuestionsDirectly(question1);

        await createQuestion("Image - Radio Button");
        await SurveyAssessment.clickBlankActionBtn();

        await SurveyAssessment.clickOnPlusIcon();

        await SurveyAssessment.checkRequired("2");
        await SurveyAssessment.enterQuestionsDirectly(question2);

        await createQuestion("Image - Radio Button");
        await SurveyAssessment.clickBlankActionBtn();
        await SurveyAssessment.page.waitForTimeout(3000);


        await SurveyAssessment.clickPublish();
        await SurveyAssessment.verifySuccessMessage();
    })


    test(`Creation of Post-Assessment`, async ({ adminHome, SurveyAssessment }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Creation of Post-Assessment` },
            { type: `Test Description`, description: `Creation of Post-Assessment` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN1")
        await adminHome.isSignOut();
        await adminHome.menuButton();
        await adminHome.assessmentMenu();
        await adminHome.clickOnAssessmentLink();
        await SurveyAssessment.clickCreateAssessment();
        await SurveyAssessment.fillAssessmentTitle(postAssessmentTitle);
        await SurveyAssessment.selectLanguage();
        await SurveyAssessment.fillDescription();
        await SurveyAssessment.enterPasspercentage("50")
        await SurveyAssessment.selectRandomizeOption("No");
        await SurveyAssessment.enterNofAttempts("2")
        await SurveyAssessment.clickSaveDraft();
        await SurveyAssessment.clickProceed();

        async function createQuestion(questionType: any) {
            // Small wait to ensure the question form is fully loaded
            await SurveyAssessment.page.waitForTimeout(2000);
            await SurveyAssessment.displayOption();
            await SurveyAssessment.selectingType(questionType);
             await SurveyAssessment.enterRightAnswerFeedback(rightanswerFeedback);
            await SurveyAssessment.enterWrongAnswerFeedback(wrongAnswerFeedback);
            // await SurveyAssessment.clickBlankActionBtn();
        }
        await SurveyAssessment.checkRequired("1");
        await SurveyAssessment.enterQuestionsDirectly(question3);

        await createQuestion("Image - Radio Button");
        await SurveyAssessment.clickBlankActionBtn();

        await SurveyAssessment.clickOnPlusIcon();

        await SurveyAssessment.checkRequired("2");
        await SurveyAssessment.enterQuestionsDirectly(question4);

        await createQuestion("Image - Radio Button");
        await SurveyAssessment.clickBlankActionBtn();
        await SurveyAssessment.page.waitForTimeout(3000);



        await SurveyAssessment.clickPublish();
        await SurveyAssessment.verifySuccessMessage();


    })

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
    let title = FakerData.getCourseName();
    //let title="Primary Microchip Bypass";

    test(`LP Creation with pre and post assessment attached`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `LP Creation with pre and post assessment attached` },
            { type: `Test Description`, description: `LP Creation with pre and post assessment attached` }
        )

        await adminHome.loadAndLogin("CUSTOMERADMIN1")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
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
        await learningPath.clickEditLearningPath();
        await createCourse.surveyassesment()
        await createCourse.addSpecificAssesment(postAssessmentTitle);
        await createCourse.setAssessmentAttempt();
        await createCourse.checkReview("Post - Assessment");
        await createCourse.addSpecificAssesment(preAssessmentTitle);
        await createCourse.setAssessmentAttempt();

        await createCourse.checkReview("Pre - Assessment");


        await createCourse.clickDetailButton();
        await createCourse.clickCatalog()
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    })



    test(`Verify that the learner can retake the assessment after failing it in the first attempt for a without section level assessment and also with feedback`, async ({ learnerHome, catalog }) => {


        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(title);
        await catalog.clickEnrollButton();
        await catalog.clickViewLearningPathDetails();
        await catalog.tpPreAssessmentLaunch();


        async function assessmentNegativeAnswer() {
            await catalog.negativeWriteContent();
            await catalog.submitMyAnswer();
        }
        await assessmentNegativeAnswer();
        await catalog.retakeAssessment();
        await catalog.tpPreAssessmentLaunch();
          async function assessment() {
            await catalog.writeContent();
            await catalog.submitMyAnswer();
        }
        await assessment();
        await catalog.reviewAssessment();
        await catalog.verifyAnswerFeedback(rightanswerFeedback);


        await catalog.saveLearningStatus();
        await catalog.tpPostAssessmentLaunch();
        await catalog.playAssessmentVideo();


        await assessmentNegativeAnswer();
        await catalog.retakeAssessment();
        await catalog.tpPostAssessmentLaunch();


        await assessment();
        await catalog.reviewAssessment();
        await catalog.verifyAnswerFeedback(rightanswerFeedback);



        await catalog.saveLearningStatus();

    })



})
