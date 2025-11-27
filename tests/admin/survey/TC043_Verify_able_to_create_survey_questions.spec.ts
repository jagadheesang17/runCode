import {test} from"../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

test(`TC043_Verify_able_to_create_survey_questions`,async({ adminHome,SurveyAssessment})=>{
    test.info().annotations.push(
        { type: 'Author', description: 'Ajay Michael' },
        { type: 'TestCase', description: 'Verify_able_to_create_survey_questions' },
        { type:'Test Description', description:"Creating a question for survey"}
    );
    await adminHome.loadAndLogin("LEARNERADMIN")
    await adminHome.isSignOut();
    await adminHome.menuButton();
    await adminHome.survey();
    await adminHome.clickOnSurveyQuestionLink();
    await SurveyAssessment.clickCreateQuestions();
    await SurveyAssessment.enterQuestions();
    await SurveyAssessment.selectLanguage();
    await SurveyAssessment.selectingType();
    await SurveyAssessment. clickSave();    
   
})