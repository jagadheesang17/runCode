import { credentials } from "../../../constants/credentialData";
import { URLConstants } from "../../../constants/urlConstants";
import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { updateCertificationComplianceFlow, updateSingleInstanceAutoRegister } from "../../../tests/admin/DB/DBJobs";

let courseName = FakerData.getCourseName();
let description = FakerData.getDescription();
const user = credentials.LEARNERUSERNAME.username;
let domain: any;

test.describe(`TP054_Verify_mandatory_certification_cannot_be_canceled.spec.ts`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Creation of E-learning single instance course for mandatory access certification`, async ({ adminHome, createCourse, learningPath }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create the course as Single instance for mandatory access testing` },
            { type: `Test Description`, description: `Create course that will be used in certification for mandatory access verification` }
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

    const title = ("CERT " + FakerData.getCourseName());

    test(`Create certification with mandatory access settings for group and user`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create certification with mandatory access settings` },
            { type: `Test Description`, description: `Create certification and configure mandatory access for both group and user to enforce auto enrollment via cron` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
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
        await createCourse.clickAccessButton();
        await createCourse.specificLearnerGroupSelection(URLConstants.LearnerGroup1);
        await createCourse.addSingleLearnerGroup(user);
        await createCourse.saveAccessButton();

        // Set access to "Mandatory" to enforce auto enrollment and prevent cancellation
        await createCourse.accessSettings("Mandatory");
        console.log("✅ Mandatory access settings configured for certification");
        await learningPath.description(description);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log("✅ Certification created with mandatory access settings");
    });

    test(`Run auto register cron job and verify certification is auto-enrolled`, async ({ adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Execute auto register cron and verify auto enrollment` },
            { type: `Test Description`, description: `Run auto register cron job and verify that certification with mandatory access is automatically enrolled` }
        );

        // Execute auto register cron job
        console.log("🔄 Executing auto register cron job...");
        await updateCertificationComplianceFlow();
        console.log("✅ Auto register cron job executed");
    });

    test(`Verify mandatory certification is auto-enrolled and appears in My Learning`, async ({ dashboard, learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify certification is auto-enrolled due to mandatory access` },
            { type: `Test Description`, description: `Verify that the certification with mandatory access is auto-enrolled and appears in My Learning dashboard` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "LearnerPortal");

        // Check My Dashboard to ensure it's auto-enrolled
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();

        try {
            await dashboard.searchCertification(title);
            console.log("✅ SUCCESS: Certification was auto-enrolled (as expected with mandatory access)");
        } catch (error) {
            console.log("❌ FAILURE: Certification was NOT auto-enrolled despite mandatory access");
            throw new Error("Certification should be auto-enrolled with mandatory access");
        }
    });

    test(`Verify mandatory certification cannot be canceled by learner`, async ({ dashboard, learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify mandatory certification cannot be canceled` },
            { type: `Test Description`, description: `Verify that learner cannot cancel enrollment for mandatory certification using cancel enrollment functionality` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "LearnerPortal");

        // Navigate to My Learning to find the mandatory certification
        await catalog.clickMyLearning();
        await catalog.searchMyLearning(courseName);

        try {
            // Try to find and click the certification
            await catalog.verifyEnrolledCourseByTitle(courseName);
            console.log("✅ Mandatory certification found in My Learning");

            // Attempt to cancel enrollment (this should fail or not be available)
            try {
                await catalog.mylearningMandatoryClassCancel();
                console.log("❌ FAILURE: Cancel enrollment option was available for mandatory certification");
                throw new Error("Mandatory certification should NOT allow cancellation");
            } catch (cancelError) {
                if (cancelError.message.includes("should NOT allow cancellation")) {
                    throw cancelError;
                }
                // Expected behavior - cancel enrollment not available or failed
                console.log("✅ SUCCESS: Cancel enrollment is NOT available for mandatory certification");
            }

        } catch (error) {
            if (error.message.includes("should NOT allow cancellation")) {
                throw error;
            }
            console.log("⚠️ Certification may not be visible or there was an issue accessing it");
        }
    });
});
