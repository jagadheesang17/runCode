import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

let title = FakerData.getRandomTitle();

test(`TC044_Verify_able_to_create_survey_and_publish_it`, async ({ adminHome, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: 'Author', description: 'Ajay Michael' },
        { type: 'TestCase', description: 'Verify able to create survey and publish it' },
        { type: 'Test Description', description: "Creating questions and publishing surveys" }
    );
    await adminHome.loadAndLogin("LEARNERADMIN")
    await adminHome.isSignOut();
    await adminHome.menuButton();
    await adminHome.survey();
    await adminHome.clickOnsurveyLink();
    await SurveyAssessment.clickCreateSurvey();
    await SurveyAssessment.fillSurveyTitle(title);
    await SurveyAssessment.selectLanguage();
    await SurveyAssessment.fillDescription();
    await SurveyAssessment.clickSaveDraft();
    await SurveyAssessment.clickProceed();
    await SurveyAssessment.importQuestion();
    await SurveyAssessment.clickAddSelectedQuestion();
    await SurveyAssessment.clickImportQuestion();
    await SurveyAssessment.clickPublish();
    await SurveyAssessment.verifySuccessMessage();


});