import { test } from "../../../../customFixtures/expertusFixture";
import { FakerData } from "../../../../utils/fakerUtils";

let courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const preAssessmentTitle = ("PreAssmt " + FakerData.AssessmentTitle());
const postAssessmentTitle = ("PostAssmt " + FakerData.AssessmentTitle());
const surveyTitle = ("Survey " + FakerData.AssessmentTitle());

test.describe(`Learning_Path_reenroll_flow_with_survey_and_assessment_in_TPlevel`, async () => {
    test.describe.configure({ mode: "serial", timeout: 700000 });
    test(`Creation of Pre-Assessment`, async ({ adminHome, SurveyAssessment }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Ajay Michael` },
            { type: `TestCase`, description: `Creation of Pre-Assessment` },
            { type: `Test Description`, description: `Creation of Pre-Assessment` }
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
            { type: `TestCase`, description: `Creation of Pre-Assessment` },
            { type: `Test Description`, description: `Creation of Pre-Assessment` }
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
            { type: 'TestCase', description: 'Creation of Survey Questions' },
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

    test(`Creation of Elearning`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Ajay Michael` },
            { type: `TestCase`, description: `Creation of Elearning` },
            { type: `Test Description`, description: `Verify that course should be created successfully` }
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
        await createCourse.contentLibrary();  //Defalut Youtube content will be added to the course
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

    })
    let title = FakerData.getCourseName();

    test(`Learning_Path__single_instance_with_survey_and_assessment_in_TPlevel-Admin_Site`, async ({ adminHome, learningPath, createCourse }) => {
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
        //await learningPath.searchAndClickCourseCheckBox("Redundant System Program");
        
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        await learningPath.clickEditLearningPath()
        await createCourse.addSpecificSurveyCourse(surveyTitle);
        await createCourse.addSpecificAssesment(preAssessmentTitle);
        await createCourse.addSpecificAssesment(postAssessmentTitle);
        // await createCourse.addSpecificAssesment("PostAssmt gown pink shiny");
        // await createCourse.addSpecificAssesment("PreAssmt instrument untie under");
        await createCourse.setAssessmentAttempt();
        await createCourse.clickDetailButton();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    })

    test(`Verify LP reenroll flow in the learner side`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Verify LP reenroll flow in the learner side` },
            { type: `Test Description`, description: `Verify LP reenroll flow in the learner side` }

        );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
       await catalog.searchCatalog("LPT-00291");
       // await catalog.searchCatalog(title);
        await catalog.clickEnrollButton();
        await catalog.clickViewLearningPathDetails();
        await catalog.tpPreAssessmentLaunch(); //To click the play icon
        async function assessment() {
            await catalog.writeContent();
            await catalog.submitMyAnswer();
        }
        await assessment();//To launch the pre-assessment
         await catalog.clickLaunchButton();
          await catalog.saveLearningStatus();
        await catalog.tpPostAssessmentLaunch();
        async function negativeAssessment() {
            await catalog.negativeWriteContent();
            await catalog.submitMyAnswer();
        }
        await negativeAssessment(); //To launch the negative post-assessment
        await catalog.surveySumbitBtn(); //To launch the survey button
        await catalog.clickReenroll();
        await catalog.tpPreAssessmentLaunch();
        await assessment();
        //await catalog.clickTPCourseExpandIcon();
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.tpPostAssessmentLaunch();
        await assessment();
        await catalog.surveyPlayButton();
        //await assessment();
        await catalog.writeContent();
        await catalog.clickSubmitSurvey();




    })
})