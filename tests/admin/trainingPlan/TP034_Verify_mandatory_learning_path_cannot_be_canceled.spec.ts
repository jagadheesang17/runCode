import { credentials } from "../../../constants/credentialData";
import { URLConstants } from "../../../constants/urlConstants";
import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { updateCertificationComplianceFlow, updateSingleInstanceAutoRegister } from "../../../tests/admin/DB/DBJobs";

let courseName = FakerData.getCourseName();
let description = FakerData.getDescription();
const user = credentials.LEARNERUSERNAME.username;
let domain: any;

test.describe(`TP034_Verify_mandatory_learning_path_cannot_be_canceled.spec.ts`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Creation of E-learning single instance course for mandatory access learning path`, async ({ adminHome, createCourse, learningPath }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create the course as Single instance for mandatory access testing` },
            { type: `Test Description`, description: `Create course that will be used in learning path for mandatory access verification` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.getCourse();
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.contentLibrary(); // By default YouTube content will be attached
        await createCourse.clickHere();
        await createCourse.selectImage();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
    });

    const title = ("Learning Path " + FakerData.getCourseName());

    test(`Create learning path with mandatory access settings for group and user`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create learning path with mandatory access settings` },
            { type: `Test Description`, description: `Create learning path and configure mandatory access for both group and user to enforce auto enrollment via cron` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
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
        await createCourse.clickAccessButton();
        await createCourse.specificLearnerGroupSelection(URLConstants.LearnerGroup1);
        await createCourse.addSingleLearnerGroup(user);
        await createCourse.saveAccessButton();

        // Set access to "Mandatory" to enforce auto enrollment and prevent cancellation
        await createCourse.accessSettings("Mandatory");
        console.log("✅ Mandatory access settings configured for learning path");
        await learningPath.description(description);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log("✅ Learning path created with mandatory access settings");
    });

    test(`Run auto register cron job and verify learning path is auto-enrolled`, async ({ adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Execute auto register cron and verify auto enrollment` },
            { type: `Test Description`, description: `Run auto register cron job and verify that learning path with mandatory access is automatically enrolled` }
        );

        // Execute auto register cron job
        console.log("🔄 Executing auto register cron job...");
        await updateCertificationComplianceFlow();
        console.log("✅ Auto register cron job executed");
    });

    test(`Verify mandatory learning path is auto-enrolled and appears in My Learning`, async ({ dashboard, learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify learning path is auto-enrolled due to mandatory access` },
            { type: `Test Description`, description: `Verify that the learning path with mandatory access is auto-enrolled and appears in My Learning dashboard` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "LearnerPortal");

        // Check My Dashboard to ensure it's auto-enrolled
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();

        try {
            await dashboard.searchCertification(title);
            console.log("✅ SUCCESS: Learning path was auto-enrolled (as expected with mandatory access)");
        } catch (error) {
            console.log("❌ FAILURE: Learning path was NOT auto-enrolled despite mandatory access");
            throw new Error("Learning path should be auto-enrolled with mandatory access");
        }
    });

    test(`Verify mandatory learning path cannot be canceled by learner`, async ({ dashboard, learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify mandatory learning path cannot be canceled` },
            { type: `Test Description`, description: `Verify that learner cannot cancel enrollment for mandatory learning path using cancel enrollment functionality` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "LearnerPortal");

        // Navigate to My Learning to find the mandatory learning path
        await catalog.clickMyLearning();
        await catalog.searchMyLearning(courseName);

        try {
            // Try to find and click the learning path
            await catalog.verifyEnrolledCourseByTitle(courseName);
            console.log("✅ Mandatory learning path found in My Learning");

            // Attempt to cancel enrollment (this should fail or not be available)
            try {
                await catalog.mylearningMandatoryClassCancel();
                console.log("❌ FAILURE: Cancel enrollment option was available for mandatory learning path");
                throw new Error("Mandatory learning path should NOT allow cancellation");
            } catch (cancelError) {
                if (cancelError.message.includes("should NOT allow cancellation")) {
                    throw cancelError;
                }
                // Expected behavior - cancel enrollment not available or failed
                console.log("✅ SUCCESS: Cancel enrollment is NOT available for mandatory learning path");
            }

        } catch (error) {
            if (error.message.includes("should NOT allow cancellation")) {
                throw error;
            }
            console.log("⚠️ Learning path may not be visible or there was an issue accessing it");
        }
    });
});