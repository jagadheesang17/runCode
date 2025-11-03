import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

let courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const preAssessmentTitle = ("PreAssmt " + FakerData.AssessmentTitle());
const postAssessmentTitle = ("PostAssmt " + FakerData.AssessmentTitle());
const surveyTitle = ("Survey " + FakerData.AssessmentTitle());

test.describe(`Verify_Learning_Path__single_instance_with_survey_and_assessment_in_TPlevel`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Creatation of Pre-Assessment`, async ({ adminHome, SurveyAssessment }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Ajay Michael` },
            { type: `TestCase`, description: `Creatation of Pre-Assessment` },
            { type: `Test Description`, description: `Creatation of Pre-Assessment` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.isSignOut();
        await adminHome.menuButton();
        await adminHome.assessmentMenu();
        await adminHome.clickOnAssessmentLink();
        await SurveyAssessment.clickCreateAssessment();
        await SurveyAssessment.fillAssessmentTitle(preAssessmentTitle);
        await SurveyAssessment.selectLanguage();
        await SurveyAssessment.fillDescription();
        await SurveyAssessment.enterPasspercentage("50")
        await SurveyAssessment.selectRandomizeOption("No")
        await SurveyAssessment.enterNofAttempts("2")
        await SurveyAssessment.clickSaveDraft();
        await SurveyAssessment.clickProceed();
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
        await SurveyAssessment.clickOnPlusIcon();
        await createQuestion("Image - Radio Button");
        await SurveyAssessment.clickOnPlusIcon();
        await createQuestion("Image - Checkbox");
        await SurveyAssessment.clickPublish();
        await SurveyAssessment.verifySuccessMessage();
    })
    test(`Creation of Post-Assessment`, async ({ adminHome, SurveyAssessment }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Ajay Michael` },
            { type: `TestCase`, description: `Creation of Post-Assessment` },
            { type: `Test Description`, description: `Creation of Post-Assessment` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.isSignOut();
        await adminHome.menuButton();
        await adminHome.assessmentMenu();
        await adminHome.clickOnAssessmentLink();
        await SurveyAssessment.clickCreateAssessment();
        await SurveyAssessment.fillAssessmentTitle(postAssessmentTitle);
        await SurveyAssessment.selectLanguage();
        await SurveyAssessment.fillDescription();
        await SurveyAssessment.enterPasspercentage("50")
        await SurveyAssessment.selectRandomizeOption("No")
        await SurveyAssessment.enterNofAttempts("2")
        await SurveyAssessment.clickSaveDraft();
        await SurveyAssessment.clickProceed();
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
        await SurveyAssessment.clickOnPlusIcon();
        await createQuestion("Image - Radio Button");
        await SurveyAssessment.clickOnPlusIcon();
        await createQuestion("Image - Checkbox");
        await SurveyAssessment.clickPublish();
        await SurveyAssessment.verifySuccessMessage();


    })

    test(`Creation of Survey Questions`, async ({ adminHome, SurveyAssessment }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Ajay Michael' },
            { type: 'TestCase', description: 'Creation of Survey QUestions' },
            { type: 'Test Description', description: "Creating questions and publishing surveys" }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
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
        async function createSurveyQuestion(questionType: any) {
            await SurveyAssessment.enterQuestions();
            await SurveyAssessment.selectingType(questionType);
            await SurveyAssessment.displayOption();
            await SurveyAssessment.clickBlankActionBtn();
        }
        await SurveyAssessment.clickOnPlusIcon();
        await createSurveyQuestion('Radio Button');
        await SurveyAssessment.clickOnPlusIcon();
        await createSurveyQuestion('Checkbox');
        await SurveyAssessment.clickOnPlusIcon();
        await createSurveyQuestion('Dropdown');
        await SurveyAssessment.clickOnPlusIcon();
        await createSurveyQuestion('Paragraph');
        await SurveyAssessment.clickOnPlusIcon();
        await createSurveyQuestion('Like/Dislike');
        await SurveyAssessment.clickOnPlusIcon();
        await createSurveyQuestion('Overall rating');
        await SurveyAssessment.clickOnPlusIcon();
        await createSurveyQuestion('Grid/Matrix - Checkbox');
        await SurveyAssessment.clickOnPlusIcon();
        await createSurveyQuestion('Short answer');
        await SurveyAssessment.clickPublish();
        await SurveyAssessment.verifySuccessMessage();


    })

    test(`Creation of Elearning Course`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Ajay Michael` },
            { type: `TestCase`, description: `Creation of Elearning Course` },
            { type: `Test Description`, description: `Creation of Elearning Course` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course,:" + description);
        await createCourse.contentLibrary(); //By default Youtube content will be attached to the course
        await createCourse.clickCatalog(); 
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

    })
    let title = FakerData.getCourseName();

    test(`Verify_Learning_Path__single_instance_with_survey_and_assessment_in_TPlevel-Admin_Site`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Ajay Michael` },
            { type: `TestCase`, description: `Verify_Learning_Path__single_instance_with_survey_and_assessment_in_TPlevel-Admin_Site` },
            { type: `Test Description`, description: `Creating Learning Path single instance with survey and assessment in TPlevel` }
        )

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
        await learningPath.title(title);
        await learningPath.description(description);
        await learningPath.language();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        await learningPath.clickEditLearningPath()
        //   await createCourse.addsurvey_course();
        await createCourse.addSpecificSurveyCourse(surveyTitle);
        await createCourse.addSpecificAssesment(preAssessmentTitle);
        await createCourse.addSpecificAssesment(postAssessmentTitle);
        await createCourse.clickDetailButton();
        await createCourse.clickCatalog()
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    })

    test(`Verify learner able to launch TP level survey and assessment and complete it`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Verify learner able to launch TP level survey and assessment and complete it` },
            { type: `Test Description`, description: `Verify learner able to launch TP level survey and assessment and complete it` }

        );

      //  let title="Neural Protocol Synthesize";
        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(title);
        //await catalog.searchCatalog("Bluetooth Pixel Compress");
        await catalog.clickEnrollButton();
        await catalog.clickViewLearningPathDetails();
        await catalog.tpPreAssessmentLaunch();
        async function assessment() {
            await catalog.writeContent();
            await catalog.submitMyAnswer();
        }
        await assessment();
        //await catalog.clickTPCourseExpandIcon();
        await catalog.saveLearningStatus();
        await catalog.clickLaunchButton();
        await catalog.tpPostAssessmentLaunch();
        await assessment();
        await catalog.surveyPlayButton();
        await assessment();
    })
})