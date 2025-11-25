import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { credentials } from "../../../constants/credentialData";

const courseName = "Course with Survey Link " + FakerData.getCourseName();
const surveyTitle = "Survey Link Test " + FakerData.getRandomTitle();
const description = FakerData.getDescription();

/**
 * @author Jagadish <jagadish.n@digiusher.com>
 * @description Verify that able to copy the survey link and launch the same from new tab when user already enrolled to the course
 */

test.describe("CRS_Verify_survey_link_copy_and_launch_functionality", () => {

    test("Test 1: Create course and add survey", async ({ adminHome, createCourse, SurveyAssessment }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish <jagadish.n@digiusher.com>` },
            { type: `TestCase`, description: `Test 1: Create course and add survey` },
            { type: `Test Description`, description: `Create survey, create course, and add survey to course` }
        );

        // Step 1: Create Survey
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
        await SurveyAssessment.importQuestion();
        await SurveyAssessment.clickAddSelectedQuestion();
        await SurveyAssessment.clickImportQuestion();
        await SurveyAssessment.clickPublish();
        await SurveyAssessment.verifySuccessMessage();

        // Step 2: Create Course
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

        // Step 3: Add Survey to Course
        await createCourse.editcourse();
        await createCourse.addSpecificSurveyCourse(surveyTitle);
        await createCourse.saveSurvey();
        await createCourse.save_editedcoursedetails();
        await createCourse.verifySuccessMessage();

        console.log("PASS: Test 1 - Course with survey created successfully");
    });

    test("Test 2: Login as learner and enroll in course", async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish <jagadish.n@digiusher.com>` },
            { type: `TestCase`, description: `Test 2: Login as learner and enroll in course` },
            { type: `Test Description`, description: `Login as learner, find course and enroll` }
        );

        // Step 1: Learner Login and Enrollment
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(courseName);
        await catalog.clickEnrollButton();
        // await catalog.clickSelectcourse(courseName);
        // await catalog.clickEnroll();
        // await catalog.verifyEnrollmentSuccess();

        console.log("PASS: Test 2 - Learner enrolled in course successfully");
    });

    test("Test 3: Open course, get survey link, copy, launch and verify", async ({ adminHome, createCourse, learnerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish <jagadish.n@digiusher.com>` },
            { type: `TestCase`, description: `Test 3: Open course, get survey link, copy, launch and verify` },
            { type: `Test Description`, description: `Open course from admin, get survey link, launch in new tab, login and verify access` }
        );

        // Step 1: Get Survey Link from Admin Side
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.catalogSearch(courseName);
        await createCourse.clickEditIcon();
        await createCourse.surveyassesment();
        const surveyURL = await createCourse.getSurveyLinkAndLaunch();

        console.log(`Survey link extracted: ${surveyURL}`);

        // Step 2: Launch Survey Link in New Tab and Login
        const newTab = await learnerHome.context.newPage();
        await newTab.goto(surveyURL);
        await newTab.waitForLoadState('load');

        console.log("Survey link launched - Login popup should appear automatically");
        
        const usernameField = newTab.locator("//input[@id='username' or @name='username' or @placeholder='Username']");
        const passwordField = newTab.locator("//input[@id='password' or @name='password' or @placeholder='Password']");
        const loginButton = newTab.locator("//button[contains(text(),'Login') or contains(text(),'Sign In') or @type='submit']");

        // Wait for login popup and fill credentials
        await usernameField.waitFor({ state: 'visible', timeout: 10000 });
        console.log("Login popup appeared - Entering kathir7695 credentials");
        
        await usernameField.fill(credentials.LEARNERUSERNAME.username);
        await passwordField.fill(credentials.LEARNERUSERNAME.password);
        await loginButton.click();
        await newTab.waitForLoadState('load');
        
        console.log("PASS: Learner logged in successfully");

        // Step 3: Verify Submit Survey Button Visibility
        const submitSurveyBtn = newTab.locator("//span[text()='submit survey']");
        await submitSurveyBtn.waitFor({ state: 'visible', timeout: 15000 });
        
        const isSubmitBtnVisible = await submitSurveyBtn.isVisible();
        
        if (isSubmitBtnVisible) {
            console.log("PASS: Submit survey button is visible on survey page");
        } else {
            console.log("FAIL: Submit survey button is not visible on survey page");
            throw new Error("Submit survey button not found on survey page");
        }

        console.log("PASS: Test 3 - Survey link copy, launch and verification completed successfully");
    });
});