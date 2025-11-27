import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

let title = FakerData.getRandomTitle();

test(`Verify Admin Able to Create Survey and Display Under Draft, Published, Unpublished Tabs`, async ({ adminHome, contentHome, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: 'Author', description: 'Tamilvanan' },
        { type: 'TestCase', description: 'Verify able to create survey and display under Draft, Published, Unpublished tabs' },
        { type: 'Test Description', description: "Verify admin can create survey and manage its state across tabs" }
    );
    await adminHome.loadAndLogin("CUSTOMERADMIN")
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
    await adminHome.menuButton();
    await adminHome.survey();
    await adminHome.clickOnsurveyLink();
    await SurveyAssessment.assessmentTab("Draft");
    await SurveyAssessment.clickPublishFromDraft(title);
    await SurveyAssessment.verifyNoquestionMessage("survey");
    await SurveyAssessment.clickEditFromDraft(title);
    async function createQuestion(questionType: any) {
        await SurveyAssessment.enterQuestions();
        await SurveyAssessment.displayOption();
        await SurveyAssessment.selectingType(questionType);
        await SurveyAssessment.clickBlankActionBtn();
    }
    await SurveyAssessment.clickOnPlusIcon();
    await createQuestion("Grid/Matrix - Checkbox");
    await SurveyAssessment.clickOnPlusIcon();
    await createQuestion("Checkbox");
    await SurveyAssessment.clickOnPlusIcon();
    await createQuestion("Dropdown");
    await SurveyAssessment.clickOnPlusIcon();
    await createQuestion("Paragraph");
    await SurveyAssessment.clickOnPlusIcon();
    await createQuestion("Like/Dislike");
    await SurveyAssessment.clickOnPlusIcon();
    await createQuestion("Overall rating");
    await SurveyAssessment.clickOnPlusIcon();
    await createQuestion("Short answer");
    await SurveyAssessment.clickOnPlusIcon();
    await SurveyAssessment.importQuestion();
    await SurveyAssessment.clickAddSelectedQuestion();
    await SurveyAssessment.clickImportQuestion();
    await SurveyAssessment.clickPublish();
    await SurveyAssessment.verifySuccessMessage();
    await SurveyAssessment.clickEditSurvey();
    await SurveyAssessment.click_Unpublish();
    await contentHome.gotoListing();
    await SurveyAssessment.assessmentTab("Unpublished");
    await SurveyAssessment.clickDelete(title);
    await SurveyAssessment.searchAssessment(title);
});
