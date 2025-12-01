import { test } from "../../../../customFixtures/expertusFixture";
import { FakerData } from "../../../../utils/fakerUtils";


let courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const preAssessmentTitle = ("PreAssmt " + FakerData.AssessmentTitle());
const postAssessmentTitle = ("PostAssmt " + FakerData.AssessmentTitle());

test.describe(`Verify that the learner is able to launch TP-level pre- and post-video type assessment questions`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Creation of Pre-Assessment`, async ({ adminHome, SurveyAssessment }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Creatation of Pre-Assessment`},
            { type: `Test Description`, description: `Creatation of Pre-Assessment`}
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN1")
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
        async function createQuestion(questionType: any, attachvideo?: boolean) {
            await SurveyAssessment.enterQuestions();
            await SurveyAssessment.displayOption();
            await SurveyAssessment.selectingType(questionType, attachvideo);
            await SurveyAssessment.clickBlankActionBtn();
        }
        await SurveyAssessment.clickOnPlusIcon();
        await createQuestion("Image - Radio Button", true);

        await SurveyAssessment.clickOnPlusIcon();
        await createQuestion("Image - Checkbox", true);
        await SurveyAssessment.clickPublish();
        await SurveyAssessment.verifySuccessMessage();
    })
    test(`Creation of Post-Assessment`, async ({ adminHome, SurveyAssessment }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Creation of Post-Assessment` },
            { type: `Test Description`, description: `Creation of Post-Assessment` }
        );

      await adminHome.loadAndLogin("CUSTOMERADMIN1")
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
        await createQuestion("Image - Radio Button");
        await SurveyAssessment.clickOnPlusIcon();
        await createQuestion("Image - Checkbox");
        await SurveyAssessment.clickPublish();
        await SurveyAssessment.verifySuccessMessage();


    })

    test(`Creation of Elearning Course`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Creation of Elearning Course` },
            { type: `Test Description`, description: `Creation of Elearning Course` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN1")
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
 //let title="Primary Microchip Bypass";

    test(`LP Creation with pre and post assessment attached`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `LP Creation with pre and post assessment attached` },
            { type: `Test Description`, description: `LP Creation with pre and post assessment attached` }
        )

      await adminHome.loadAndLogin("CUSTOMERADMIN1")
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
        await learningPath.clickEditLearningPath();
        await createCourse.surveyassesment()
        await createCourse.addSpecificAssesment(preAssessmentTitle);
        await createCourse.addSpecificAssesment(postAssessmentTitle);
        await createCourse.clickDetailButton();
        await createCourse.clickCatalog()
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    })

    test(`Verify that the learner is able to launch TP-level pre- and post-video type assessment questions`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Verify that the learner is able to launch TP-level pre- and post-video type assessment questions` },
            { type: `Test Description`, description: `Verify that the learner is able to launch TP-level pre- and post-video type assessment questions` }

        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(title);
        await catalog.clickEnrollButton();
        await catalog.clickViewLearningPathDetails();
        await catalog.tpPreAssessmentLaunch();
        async function assessment() {
            await catalog.writeContent();
            await catalog.submitMyAnswer();
        }
        await assessment();
        await catalog.saveLearningStatus();
        await catalog.tpPostAssessmentLaunch();
        await catalog.playAssessmentVideo();
        await assessment();
        await catalog.saveLearningStatus();
    })
})