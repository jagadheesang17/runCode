import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";
let title = FakerData.getRandomTitle()
const questionTitle = FakerData.generateQuestion()

test(`Verify that admin able to create assessment questions`, async ({ adminHome, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: 'Author', description: 'Tamilvanan' },
        { type: 'TestCase', description: 'Verify_able_to_create_Assessment_questions' },
        { type: 'Test Description', description: "Creating a question for Assessment" }
    );
    await adminHome.loadAndLogin("CUSTOMERADMIN")
    await adminHome.isSignOut();
    await adminHome.menuButton();
    await adminHome.assessmentMenu();
    await adminHome.clickOnAssessmentQuestionLink();
    await SurveyAssessment.clickCreateQuestions();
    await SurveyAssessment.enterQuestionTitle(questionTitle);
    await SurveyAssessment.displayOption();
    await SurveyAssessment.selectLanguage();
    //selectingType --> "Radio button","Dropdown","Checkbox","Image - Radio Button","Image - Checkbox"
    await SurveyAssessment.selectingType("Checkbox");
    await SurveyAssessment.clickSave();
})
test(`Verify Admin Able to Clone Assessment`, async ({ adminHome, contentHome, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: 'Author', description: 'Tamilvanan' },
        { type: 'TestCase', description: 'Verify able to Cloning the assessment' },
        { type: 'Test Description', description: "Verify able to Cloning the assessment" }
    );
    await adminHome.loadAndLogin("CUSTOMERADMIN")
    await adminHome.isSignOut();
    await adminHome.menuButton();
    await adminHome.assessmentMenu();
    await adminHome.clickOnAssessmentLink();
    await SurveyAssessment.clickCreateAssessment();
    await SurveyAssessment.fillAssessmentTitle(title);
    await SurveyAssessment.selectLanguage();
    await SurveyAssessment.fillDescription();
    await SurveyAssessment.enterPasspercentage("50")
    await SurveyAssessment.selectRandomizeOption("No")
    await SurveyAssessment.enterNofAttempts("2")
    await SurveyAssessment.clickSaveDraft();
    await SurveyAssessment.clickProceed();
    await SurveyAssessment.addCreatedQuestion(questionTitle);
    await SurveyAssessment.clickAddSelectedQuestion();
    await SurveyAssessment.clickImportQuestion();
    await SurveyAssessment.clickPublish();
    await SurveyAssessment.verifySuccessMessage();
    await contentHome.gotoListing();
    await SurveyAssessment.searchAssessment(title);
    await SurveyAssessment.clickClone(title);
    await SurveyAssessment.clickSaveDraft();
    await SurveyAssessment.clickProceed();
    await SurveyAssessment.clickPublish();
    await SurveyAssessment.verifySuccessMessage();
})