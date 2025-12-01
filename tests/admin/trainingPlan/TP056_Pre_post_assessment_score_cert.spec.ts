import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";


let courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const preAssessmentTitle = ("PreAssmt " + FakerData.AssessmentTitle());
const postAssessmentTitle = ("PostAssmt " + FakerData.AssessmentTitle());
let preAssessmentScore :any;
let postAssessmentScore :any;

test.describe(`Verify_the_pre_and_post_assessment_score_in_manage_enrollment_side_after_the_admin_complete_the_course_in_certification.spec`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Creation of Pre-Assessment`, async ({ adminHome, SurveyAssessment }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Balasundar` },
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
        await SurveyAssessment.selectRandomizeOption("No");
        await SurveyAssessment.enterNofAttempts("2")
        await SurveyAssessment.clickSaveDraft();
        await SurveyAssessment.clickProceed();
         async function createQuestion(questionType: any) {
            await SurveyAssessment.enterQuestions();
            // Small wait to ensure the question form is fully loaded
            await SurveyAssessment.page.waitForTimeout(2000);
            await SurveyAssessment.displayOption();
            await SurveyAssessment.selectingType(questionType);
            // await SurveyAssessment.clickBlankActionBtn();
        }
        await createQuestion("Image - Radio Button");
         await SurveyAssessment.clickBlankActionBtn();

        await SurveyAssessment.clickOnPlusIcon();

        await createQuestion("Image - Radio Button");
        await SurveyAssessment.clickBlankActionBtn();
        await SurveyAssessment.page.waitForTimeout(3000);
        await SurveyAssessment.clickOnPlusIcon();
        await createQuestion("Image - Checkbox");
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
            // Small wait to ensure the question form is fully loaded
            await SurveyAssessment.page.waitForTimeout(2000);
            await SurveyAssessment.displayOption();
            await SurveyAssessment.selectingType(questionType);
            // await SurveyAssessment.clickBlankActionBtn();
        }
        await createQuestion("Image - Radio Button");
         await SurveyAssessment.clickBlankActionBtn();

        await SurveyAssessment.clickOnPlusIcon();

        await createQuestion("Image - Radio Button");
        await SurveyAssessment.clickBlankActionBtn();
        await SurveyAssessment.page.waitForTimeout(3000);
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

    test(`Certification Creation with pre and post assessment attached`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Balasundar` },
            { type: `TestCase`, description: `Certification Creation with pre and post assessment attached` },
            { type: `Test Description`, description: `Certification Creation with pre and post assessment attached` }
        )

      await adminHome.loadAndLogin("CUSTOMERADMIN1")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
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
        await learningPath.clickEditCertification();
        await createCourse.surveyassesment()
        await createCourse.addSpecificAssesment(preAssessmentTitle);
        await createCourse.addSpecificAssesment(postAssessmentTitle);
        await createCourse.clickDetailButton();
        await createCourse.clickCatalog()
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    })

    test(`Getting the score from the assessments`, async ({ learnerHome, catalog, dashboard }) => {
       

 await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(title);
        await catalog.clickEnrollButton();
        await catalog.clickViewCertificationDetails();
        await catalog.tpPreAssessmentLaunch();
        async function assessment() {
            await catalog.writeContent();
            await catalog.submitMyAnswer();
        }
        await assessment();
        preAssessmentScore=await catalog.getScore();

        await catalog.saveLearningStatus();
        await catalog.tpPostAssessmentLaunch();
        await catalog.playAssessmentVideo();
        await assessment();

        postAssessmentScore=await catalog.getScore();


        await catalog.saveLearningStatus();

    })



    test(`Verify that the pre and post assessment scores are correctly displayed in the manage enrollment side after the admin completes the course in certification`, async ({ learnerHome, catalog,adminHome ,enrollHome}) => {
       

     await adminHome.loadAndLogin("CUSTOMERADMIN1")
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectByOption("Certification");
        await enrollHome.selectBycourse(title)
        await enrollHome.clickViewLearner();
        await enrollHome.clickManyButton(title);

        const preAssessmentScoreInAdminSide = await enrollHome.getDisplayedScoreInManageEnrollmentSide(title,"Pre Assessment");
        const postAssessmentScoreInAdminSide = await enrollHome.getDisplayedScoreInManageEnrollmentSide(title,"Post Assessment");

            if(preAssessmentScoreInAdminSide === preAssessmentScore && postAssessmentScoreInAdminSide === postAssessmentScore){
        console.log("Pre-Assessment Score is matched in Admin side: " + preAssessmentScoreInAdminSide);
        console.log("Post-Assessment Score is matched in Admin side: " + postAssessmentScoreInAdminSide);

        }
        else{
      throw new Error(` Score mismatch — Expected ${preAssessmentScore}, got ${preAssessmentScoreInAdminSide}`&& ` Score mismatch — Expected ${postAssessmentScore}, got ${postAssessmentScoreInAdminSide}`);

        }

        
        

})})
