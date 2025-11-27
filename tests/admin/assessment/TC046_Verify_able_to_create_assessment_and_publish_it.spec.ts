import {test} from"../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";
let title=FakerData.getRandomTitle()
test(`TC046_Verify_able_to_create_survey_and_publish_it`,async({ adminHome,contentHome,SurveyAssessment})=>{
    test.info().annotations.push(
        { type: 'Author', description: 'Ajay Michael' },
        { type: 'TestCase', description: 'Verify able to create asessment and publish it' },
        { type:'Test Description', description:"Creating questions and publishing Assessment"}
    );
    await adminHome.loadAndLogin("LEARNERADMIN")
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
    await SurveyAssessment.enterQuestions();
    await SurveyAssessment.displayOption();    
    await SurveyAssessment.selectingType();
    await SurveyAssessment.importQuestion();
    await SurveyAssessment.clickAddSelectedQuestion();
    await SurveyAssessment.clickImportQuestion();
    await SurveyAssessment.clickPublish();
    await SurveyAssessment.verifySuccessMessage();
    await contentHome.gotoListing();
         
})