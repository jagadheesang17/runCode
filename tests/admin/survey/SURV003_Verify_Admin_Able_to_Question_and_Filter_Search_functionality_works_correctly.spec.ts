import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
// import { FakerData } from "../../../utils/fakerUtils";
let surveyTitle =FakerData.getRandomTitle()
const questionTitle = FakerData.generateQuestion()


test(`Verify that admin able to create survey questions`, async ({ adminHome,createCourse, SurveyAssessment }) => {
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
    await createCourse.catalogSearch(questionTitle)
    await createCourse.verifyTitle(questionTitle)      
})


test(`Verify_able_to_create_survey_and_publish_it`, async ({ adminHome, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: 'Author', description: 'Tamilvanan' },
        { type: 'TestCase', description: 'Verify able to create survey and publish it' },
        { type: 'Test Description', description: "Adding created question and publishing surveys" }
    );
    await adminHome.loadAndLogin("LEARNERADMIN")
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
});

test(`Verify that admin not able to delete question when question is added to survey`, async ({ adminHome,createCourse, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: 'Author', description: 'Tamilvanan' },
        { type: 'TestCase', description: 'Verify that admin not able to delete question when question is added to survey' },
        { type: 'Test Description', description: "Verify that admin not able to delete question when question is added to survey" }
    );
    await adminHome.loadAndLogin("CUSTOMERADMIN")
    await adminHome.isSignOut();
    await adminHome.menuButton();
    await adminHome.survey();
    await adminHome.clickOnSurveyQuestionLink();
    await createCourse.catalogSearch(questionTitle)
    await createCourse.verifyTitle(questionTitle)
    await SurveyAssessment.clickDeleteIcon(questionTitle);
    await SurveyAssessment.verifyDeleteNotPossibleMessage("survey");
});
