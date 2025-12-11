import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";
import { createILTMultiInstance } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { EnrollmentPage } from "../../../pages/EnrollmentPage";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const surveyTitle = "Survey_" + FakerData.getRandomTitle();
const question1 = FakerData.generateQuestion();
let instanceNames: string[] = [];

test.describe.serial(`TECRS32 - Verify that learners in the In-Progress status for the instance are listed`, async () => {

    test(`Create survey with consider for completion`, async ({ adminHome, SurveyAssessment }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS32 - Step 1: Create Survey with Consider for Completion` },
            { type: `Test Description`, description: `Create survey that will be used to move learner to In-Progress status` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.survey();
        await adminHome.clickOnsurveyLink();
        await SurveyAssessment.clickCreateSurvey();
        await SurveyAssessment.fillSurveyTitle(surveyTitle);
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
        await SurveyAssessment.enterQuestionsDirectly(question1);

        await createQuestion("Dropdown");
        await SurveyAssessment.clickBlankActionBtn();
        await SurveyAssessment.page.waitForTimeout(3000);

        // await SurveyAssessment.clickOnPlusIcon();

        // await createQuestion("Dropdown");
        // await SurveyAssessment.clickBlankActionBtn();
        // await SurveyAssessment.page.waitForTimeout(3000);



        await SurveyAssessment.clickPublish();
        await SurveyAssessment.verifySuccessMessage();

        console.log(`✅ Survey created: ${surveyTitle}`);
    });

    test(`Create multi-instance ILT course with survey`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS32 - Step 2: Create Multi-Instance ILT Course` },
            { type: `Test Description`, description: `Create ILT course with 2 instances and attach survey with consider for completion` }
        );

        // Create course with 2 instances using API
        instanceNames = await createILTMultiInstance(courseName, "published", 2, "future");

        console.log(`✅ Multi-instance ILT course created: ${courseName}`);
        console.log(`✅ Instances: ${instanceNames.join(', ')}`);

        // Add survey with consider for completion
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.searchCourse(courseName);
        await createCourse.editCourseFromListingPage();
        await createCourse.wait("minWait");
        await createCourse.addSpecificSurveyCourse(surveyTitle);
        await createCourse.checkConsiderForCompletionCheckbox();
        await createCourse.saveSurvey();
        await createCourse.clickConfirmYes();
        await createCourse.save_editedcoursedetails();
        await createCourse.verifySuccessMessage();

        console.log(`✅ Survey attached with consider for completion enabled`);
    });

    test(`Enroll learner in first instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS32 - Step 3: Enroll Learner` },
            { type: `Test Description`, description: `Enroll learner in first ILT instance` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");

        await enrollHome.selectBycourse(instanceNames[0]);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();

        console.log(`✅ Learner "${credentials.LEARNERUSERNAME.username}" enrolled in instance: ${instanceNames[0]}`);
    });

    test(`Learner completes survey to move status to In-Progress`, async ({ learnerHome, catalog, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS32 - Step 4: Complete Survey for In-Progress Status` },
            { type: `Test Description`, description: `Learner completes survey to change status from Enrolled to In-Progress` }
        );

        // Learner login and access course

        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickMyLearning();
        await catalog.searchMyLearning(courseName);
        await catalog.clickCourseInMyLearning(courseName);
        // Complete survey if visible
        await catalog.writeContent();
        await catalog.clickSubmitSurvey();
        //await catalog.saveLearningStatus();
        await dashboard.wait("mediumWait");


        console.log(`✅ Survey completed - Status should be In-Progress`);
        console.log(`✅ Consider for completion enabled, so course remains In-Progress until all requirements met`);
    });

    test(`Transfer In-Progress learner to second instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS32 - Step 6: Transfer In-Progress Learner` },
            { type: `Test Description`, description: `Transfer learner with In-Progress status to second instance` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");

        // Navigate to transfer enrollment
        await enrollHome.selectEnrollmentOption("Transfer Enrollment - Course");
        await enrollHome.searchCourseForTransfer(courseName);
        await enrollHome.clearFilterCrossMarks();

        // Select source and target instances
        await enrollHome.selectSourceInstance(instanceNames[0]);
        await enrollHome.wait("mediumWait");
        await enrollHome.selectLearnerForTransfer(credentials.LEARNERUSERNAME.username);
        await enrollHome.selectTargetInstance(instanceNames[1]);
        await enrollHome.wait("mediumWait");
        await enrollHome.selectlearner();
        await enrollHome.verifyLearnerStatusInTransferEnrollmentPage(credentials.LEARNERUSERNAME.username, "In Progress");
        await enrollHome.selectLearnerForTransfer(credentials.LEARNERUSERNAME.username);

        // Perform transfer
        await enrollHome.clickTransferButton();
        await enrollHome.verifyTransferSuccessMessage();
    });

    test(`Verify enrollment transfer in View/Update Status`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS31 - Step 5: Verify Transfer in Admin Side` },
            { type: `Test Description`, description: `Verify the enrollment is transferred to second instance in View/Update Status - Course/TP` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.wait("mediumWait");

        // Verify learner is enrolled in second instance
        await enrollHome.selectBycourse(instanceNames[1]);
        await enrollHome.clickViewLearner();
        await enrollHome.searchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.verifyLearnerEnrolledInInstance(credentials.LEARNERUSERNAME.username);

        console.log(`✅ Verified in admin side: Learner transferred to instance ${instanceNames[1]}`);
    });

});
