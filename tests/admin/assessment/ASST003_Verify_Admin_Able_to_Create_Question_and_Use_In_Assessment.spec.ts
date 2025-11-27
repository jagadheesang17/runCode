import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

let assessmentTitle = FakerData.getRandomTitle();
const questionTitle = FakerData.generateQuestion();

test.describe('Assessment Question and Flow Verification', () => {

    test('Verify admin can create an assessment question', async ({ adminHome, SurveyAssessment, createCourse }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Tamilvanan' },
            { type: 'TestCase', description: 'Verify that an admin can successfully create a question for an assessment' },
            { type: 'Test Description', description: "Verify that an admin can successfully create a question for an assessment" }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.assessmentMenu();
        await adminHome.clickOnAssessmentQuestionLink();
        await SurveyAssessment.clickCreateQuestions();
        await SurveyAssessment.enterQuestionTitle(questionTitle);
        await SurveyAssessment.displayOption();
        await SurveyAssessment.selectLanguage();
        await SurveyAssessment.selectingType("Checkbox");
        await SurveyAssessment.clickSave();
        await createCourse.catalogSearch(questionTitle);
        await createCourse.verifyTitle(questionTitle);
    });

    test('Verify admin can create and publish an assessment with the new question', async ({ adminHome, SurveyAssessment }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Tamilvanan' },
            { type: 'TestCase', description: 'Verify admin can add a created question to an assessment and publish it' },
            { type: 'Test Description', description: "Verify admin can add a created question to an assessment and publish it" }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.assessmentMenu();
        await adminHome.clickOnAssessmentLink();
        await SurveyAssessment.clickCreateAssessment();
        await SurveyAssessment.fillAssessmentTitle(assessmentTitle);
        await SurveyAssessment.selectLanguage();
        await SurveyAssessment.fillDescription();
        await SurveyAssessment.enterPasspercentage("50");
        await SurveyAssessment.selectRandomizeOption("No");
        await SurveyAssessment.enterNofAttempts("2");
        await SurveyAssessment.clickSaveDraft();
        await SurveyAssessment.clickProceed();
        await SurveyAssessment.addCreatedQuestion(questionTitle);
        await SurveyAssessment.clickAddSelectedQuestion();
        await SurveyAssessment.clickImportQuestion();
        await SurveyAssessment.clickPublish();
        await SurveyAssessment.verifySuccessMessage();
    });
    test('Verify question in use cannot be deleted', async ({ adminHome, createCourse, SurveyAssessment }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Tamilvanan' },
            { type: 'TestCase', description: 'Verify question in use cannot be deleted' },
            { type: 'Test Description', description: "Verify that a question added to a published assessment cannot be deleted" }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.assessmentMenu();
        await adminHome.clickOnAssessmentQuestionLink();
        await createCourse.catalogSearch(questionTitle);
        await createCourse.verifyTitle(questionTitle);
        await SurveyAssessment.clickDeleteIcon(questionTitle);
        await SurveyAssessment.verifyDeleteNotPossibleMessage('assessments');
    });
});
