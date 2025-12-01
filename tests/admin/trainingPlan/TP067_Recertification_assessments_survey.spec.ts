import { log } from "console";
import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { updateCronDataJSON } from "../../../utils/jsonDataHandler";
import { URLConstants } from "../../../constants/urlConstants";
import { certificationExpiry_CronJob } from "../DB/DBJobs";

const preAssessmentTitle = ("PreAssmt " + FakerData.AssessmentTitle());
const postAssessmentTitle = ("PostAssmt " + FakerData.AssessmentTitle());

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
let CEUVALUE: string;
let CEUPROVIDER: string;
let returnedValue: string; const question1 = FakerData.generateQuestion();
const question2 = FakerData.generateQuestion();
const question3 = FakerData.generateQuestion();
const question4 = FakerData.generateQuestion();
const question5 = FakerData.generateQuestion();

const suveyTitle = FakerData.getRandomTitle();


test.describe(`Verify_certification_expiration_flow`, async () => {

    test(`Creation of Pre-Assessment`, async ({ adminHome, SurveyAssessment }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Balasundar` },
            { type: `TestCase`, description: `Creatation of Pre-Assessment` },
            { type: `Test Description`, description: `Creatation of Pre-Assessment` }
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
        await SurveyAssessment.checkRequired("1");
        await SurveyAssessment.enterQuestionsDirectly(question1);

        await createQuestion("Image - Radio Button");
        await SurveyAssessment.clickBlankActionBtn();

        await SurveyAssessment.clickOnPlusIcon();

        await SurveyAssessment.checkRequired("2");
        await SurveyAssessment.enterQuestionsDirectly(question2);

        await createQuestion("Image - Radio Button");
        await SurveyAssessment.clickBlankActionBtn();

        await SurveyAssessment.clickPublish();
        await SurveyAssessment.verifySuccessMessage();
    })


    test(`Creation of Post-Assessment`, async ({ adminHome, SurveyAssessment }) => {

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
        await SurveyAssessment.checkRequired("1");
        await SurveyAssessment.enterQuestionsDirectly(question3);

        await createQuestion("Image - Radio Button");
        await SurveyAssessment.clickBlankActionBtn();

        await SurveyAssessment.clickOnPlusIcon();

        await SurveyAssessment.checkRequired("2");
        await SurveyAssessment.enterQuestionsDirectly(question4);

        await createQuestion("Image - Radio Button");
        await SurveyAssessment.clickBlankActionBtn();

        await SurveyAssessment.clickPublish();
        await SurveyAssessment.verifySuccessMessage();

    })


    test(`Creating the survey with questions.spec.ts`, async ({ adminHome, SurveyAssessment }) => {

        await adminHome.loadAndLogin("LEARNERADMIN")
        await adminHome.isSignOut();
        await adminHome.menuButton();
        await adminHome.survey();
        await adminHome.clickOnsurveyLink();
        await SurveyAssessment.clickCreateSurvey();
        await SurveyAssessment.fillSurveyTitle(suveyTitle);
        await SurveyAssessment.selectLanguage();
        await SurveyAssessment.fillDescription();
        await SurveyAssessment.clickSaveDraft();
        await SurveyAssessment.clickProceed();

        async function createQuestion(questionType: any) {
            await SurveyAssessment.page.waitForTimeout(2000);

            // await SurveyAssessment.enterQuestions();
            await SurveyAssessment.page.waitForTimeout(2000);

            await SurveyAssessment.selectLanguage();
            await SurveyAssessment.selectingType(questionType);
            await SurveyAssessment.displayOption();
            await SurveyAssessment.page.waitForTimeout(2000);


            // await SurveyAssessment.clickBlankActionBtn();
        }
        await SurveyAssessment.enterQuestionsDirectly(question5);

        await createQuestion("Dropdown");
        await SurveyAssessment.clickBlankActionBtn();
        await SurveyAssessment.page.waitForTimeout(3000);

        // await SurveyAssessment.clickOnPlusIcon();

        // await createQuestion("Dropdown");
        // await SurveyAssessment.clickBlankActionBtn();
        // await SurveyAssessment.page.waitForTimeout(3000);



        await SurveyAssessment.clickPublish();
        await SurveyAssessment.verifySuccessMessage();
    });

    test.describe.configure({ mode: "serial" });
    test(`Creation of EL with CEU`, async ({ adminHome, createCourse }) => {

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name :" + description);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.modifyTheAccess();
        await createCourse.clickCEULink();
        CEUPROVIDER = await createCourse.fillCEUProviderType();
        console.log(CEUPROVIDER);
        CEUVALUE = await createCourse.fillCEUType();
        console.log(CEUVALUE);
        await createCourse.fillUnit();
        await createCourse.clickAddCEUButton();
        await createCourse.clickDetailButton();
        await createCourse.typeDescription("This is a new course by name :" + description);

        // await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    })


    const title = ("CRON " + FakerData.getCourseName());
    test(`Certification created with course, pre, post assessments and CEU `, async ({ adminHome, learningPath, createCourse, createUser }) => {

        const newData = {
            TP020: title
        }
        updateCronDataJSON(newData)

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(title);
        await learningPath.description(description);
        await learningPath.language();
        await learningPath.hasRecertification();
        await learningPath.clickExpiresButton()
        await learningPath.clickSaveAsDraftBtn();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await learningPath.addRecertificationCourse();
        await learningPath.chooseRecertificationMethod("Copy from certification path");

        //need to uncommand after the issue fix:
        // ================================
        // await createCourse.addSpecificSurveyCourseToRecertification(suveyTitle)
        // await createUser.clickSave();
        // await createCourse.addSpecificAssesment(preAssessmentTitle);
        // await createCourse.addSpecificAssesment(postAssessmentTitle);
        // await createCourse.clickCEULinkInRecertification();
        // await learningPath.checkCEU();
        // await learningPath.verifyInheritedCEUFromCourse(CEUPROVIDER)
        //  returnedValue=await learningPath.updateCEUUnit();
        //  console.log(returnedValue);

        await learningPath.saveRecertification(courseName);

        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();

    })



    test(`Verify that the learner can successfully register for and complete the certification program`, async ({ learnerHome, catalog }) => {


        await learnerHome.learnerLogin("LEARNERUSERNAME", "LearnerPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(title);
        await catalog.clickEnrollButton();
        await catalog.clickViewCertificationDetails();

        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();


    })

    test(`Cron job to make certification expiry`, async ({ }) => {

        await certificationExpiry_CronJob();
    })



    test(`Confirm_whether_a_rollback_does_not_occur_when_a_learner_enrolls_in_an_already_completed_course_as_part_of_the_certification`, async ({ learnerHome, catalog, adminHome, dashboard }) => {

    

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.searchCatalog(title);

        await catalog.verifyStatus("Expired");  //TP status   
        // await catalog.verifyTPOverallProgressPercentage(); //TP overall percentage verification
        // await catalog.verifytpCourseStatus(title, "Completed"); //TP particular course status
        // await catalog.verifyContentProgressValue(contentName); //Content progress value verification    
        //  await dashboard.clickRecertifyIcon(title);
        await catalog.clickRecertifyButton();
        await catalog.verifyUpdatedCEUUnitFromDetailsPage(returnedValue);


        await catalog.tpPreAssessmentLaunch();

        // Verify Pre-Assessment questions (question1, question2, question3)
        await catalog.verifyAssessmentQuestions([question1, question2], "Pre-Assessment");

        async function assessment() {
            await catalog.writeContent();
            await catalog.submitMyAnswer();
        }

        await assessment();

        await catalog.saveLearningStatus();
        await catalog.tpPostAssessmentLaunch();
        // await catalog.playAssessmentVideo();

        // Verify Post-Assessment questions (question4, question5, question6)
        await catalog.verifyAssessmentQuestions([question3, question4], "Post-Assessment");

        await assessment();



        await catalog.saveLearningStatus();




        await catalog.clickSurveyLaunchButton();
        await catalog.clickAssessmentSurvey();

        await catalog.verifySurveyQuestions([question5]);

        async function survey() {
            await catalog.writeContent();
            await catalog.clickSubmitSurvey();
        }
        await survey();
        await catalog.clickDoneButton();

    })





})