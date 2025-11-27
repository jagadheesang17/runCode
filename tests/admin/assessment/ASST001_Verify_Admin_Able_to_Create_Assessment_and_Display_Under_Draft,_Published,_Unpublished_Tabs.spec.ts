import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";
let title = FakerData.getRandomTitle()
test(`Verify Admin Able to Create Assessment and Display Under Draft, Published, Unpublished Tabs`, async ({ adminHome,bannerHome, contentHome, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: 'Author', description: 'Tamilvanan' },
        { type: 'TestCase', description: 'Verify able to create asessment and adding all the types of questions' },
        { type: 'Test Description', description: "Verify able to create asessment and adding all the types of questions" }
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
    await adminHome.menuButton();
    await adminHome.assessmentMenu();
    await adminHome.clickOnAssessmentLink();
    await SurveyAssessment.assessmentTab("Draft");
    await SurveyAssessment.clickPublishFromDraft(title);
    await SurveyAssessment.verifyNoquestionMessage("assessment");
    await SurveyAssessment.clickEditFromDraft(title);
    async function createQuestion(questionType: any) {
        await SurveyAssessment.enterQuestions();
        await SurveyAssessment.displayOption();
        await SurveyAssessment.selectingType(questionType);
        await SurveyAssessment.clickBlankActionBtn();
    }
    await SurveyAssessment.clickOnPlusIcon();
    await createQuestion("Checkbox");
    await SurveyAssessment.clickOnPlusIcon();
    await createQuestion("Radio button");
    await SurveyAssessment.clickOnPlusIcon();
    await createQuestion("Dropdown");
    // await SurveyAssessment.clickOnPlusIcon();
    // await createQuestion("Image - Radio Button");
    // await SurveyAssessment.clickOnPlusIcon();
    // await createQuestion("Image - Checkbox");
    await SurveyAssessment.clickOnPlusIcon();
    await SurveyAssessment.importQuestion();
    await SurveyAssessment.clickAddSelectedQuestion();
    await SurveyAssessment.clickImportQuestion();
    await SurveyAssessment.clickPublish();
    await SurveyAssessment.verifySuccessMessage();
    await SurveyAssessment.clickEditAssessment();
    await SurveyAssessment.click_Unpublish();
    await contentHome.gotoListing();
    await SurveyAssessment.assessmentTab("Unpublished");
    await SurveyAssessment.clickDelete(title);
    await SurveyAssessment.searchAssessment(title);
})