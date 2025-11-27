import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

test(`TC045_Verify_able_to_create_assessment_questions`, async ({ adminHome, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: 'Author', description: 'Ajay Michael' },
        { type: 'TestCase', description: 'Verify_able_to_create_Assessment_questions' },
        { type: 'Test Description', description: "Creating a question for Assessment" }
    );
    await adminHome.loadAndLogin("LEARNERADMIN")
    await adminHome.isSignOut();
    await adminHome.menuButton();
    await adminHome.assessmentMenu();
    await adminHome.clickOnAssessmentQuestionLink();
    await SurveyAssessment.clickCreateQuestions();
    await SurveyAssessment.enterQuestions();
    await SurveyAssessment.displayOption();
    await SurveyAssessment.selectLanguage();
    //selectingType --> "Radio button","Dropdown","Checkbox","Image - Radio Button","Image - Checkbox"
    await SurveyAssessment.selectingType();
    await SurveyAssessment.clickSave();
})