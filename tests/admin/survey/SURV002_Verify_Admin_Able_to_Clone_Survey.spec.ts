import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
// import { FakerData } from "../../../utils/fakerUtils";
let surveyTitle =FakerData.getRandomTitle()
const questionTitle = FakerData.generateQuestion()

test(`Verify that admin able to create survey questions`, async ({ adminHome, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: 'Author', description: 'Tamilvanan' },
        { type: 'TestCase', description: 'Verify_able_to_create_survey_questions' },
        { type: 'Test Description', description: "Creating a question for survey" }
    );
    await adminHome.loadAndLogin("CUSTOMERADMIN")
    await adminHome.isSignOut();
    await adminHome.menuButton();
    await adminHome.survey();
    await adminHome.clickOnSurveyQuestionLink();
    await SurveyAssessment.clickCreateQuestions();
    await SurveyAssessment.enterQuestionTitle(questionTitle);
    await SurveyAssessment.displayOption();
    await SurveyAssessment.selectLanguage();
    //selectingType --> "Radio button","Dropdown","Checkbox","Image - Radio Button","Image - Checkbox"
    await SurveyAssessment.selectingType("Checkbox");
    await SurveyAssessment.clickSave();
})

test(`Verify Admin Able to Clone Survey`, async ({ adminHome, SurveyAssessment, contentHome }) => {
    test.info().annotations.push(
        { type: 'Author', description: 'Tamilvanan' },
        { type: 'TestCase', description: 'Verify able to Clone the survey' },
        { type: 'Test Description', description: "Verify admin can clone a survey after creation and publishing" }
    );
    // Create Survey
    await adminHome.loadAndLogin("CUSTOMERADMIN");
    await adminHome.isSignOut();
    await adminHome.menuButton();
    await adminHome.survey();
    await adminHome.clickOnsurveyLink();
    await SurveyAssessment.clickCreateSurvey();
    await SurveyAssessment.fillSurveyTitle(surveyTitle);
    await SurveyAssessment.selectLanguage();
    await SurveyAssessment.fillDescription();
    await SurveyAssessment.clickSaveDraft();
    await SurveyAssessment.clickProceed();
    await SurveyAssessment.addCreatedQuestion(questionTitle);
    await SurveyAssessment.clickAddSelectedQuestion();
    await SurveyAssessment.clickImportQuestion();
    await SurveyAssessment.clickPublish();
    await SurveyAssessment.verifySuccessMessage();
    await contentHome.gotoListing();
    await SurveyAssessment.searchAssessment(surveyTitle);
    await SurveyAssessment.clickClone(surveyTitle);
    await SurveyAssessment.clickSaveDraft();
    await SurveyAssessment.clickProceed();
    await SurveyAssessment.clickPublish();
    await SurveyAssessment.verifySuccessMessage();
});
