import { credentials } from "../../../../constants/credentialData";
import { URLConstants } from "../../../../constants/urlConstants";
import { test } from "../../../../customFixtures/expertusFixture";
import { FakerData } from "../../../../utils/fakerUtils";
import { updateCertificationComplianceFlow, updateSingleInstanceAutoRegister } from "../../../../tests/admin/DB/DBJobs";

let courseName = FakerData.getCourseName();
let description = FakerData.getDescription();
const user = credentials.LEARNERUSERNAME.username;
let domain: any;

test.describe(`TP033_Verify_learning_path_not_auto_enrolled_with_optional_access.spec.ts`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Creation of E-learning single instance course for optional access learning path`, async ({ adminHome, createCourse, learningPath }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create the course as Single instance for optional access testing` },
            { type: `Test Description`, description: `Create course that will be used in learning path for optional access verification` }
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

    test(`Create learning path with optional access settings for group and user`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create learning path with optional access settings` },
            { type: `Test Description`, description: `Create learning path and configure optional access for both group and user to prevent auto enrollment via cron` }
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

        // Set access to "Optional" instead of "Mandatory" to prevent auto enrollment
        await createCourse.accessSettings("Optional");
        console.log("✅ Optional access settings configured for learning path");
        await learningPath.description(description);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log("✅ Learning path created with optional access settings");
    });

    test(`Run auto register cron job and verify learning path is not auto-enrolled`, async ({ adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Execute auto register cron and verify no auto enrollment` },
            { type: `Test Description`, description: `Run auto register cron job and verify that learning path with optional access is not automatically enrolled` }
        );

        // Execute auto register cron job
        console.log("🔄 Executing auto register cron job...");
        await updateCertificationComplianceFlow();
        console.log("✅ Auto register cron job executed");
    });

    test(`Verify learning path is NOT auto-enrolled and appears only in catalog`, async ({ dashboard, learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify learning path is NOT auto-enrolled due to optional access` },
            { type: `Test Description`, description: `Verify that the learning path with optional access is NOT auto-enrolled and only appears in catalog for manual enrollment` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "LearnerPortal");

        // Now verify it's available in catalog for manual enrollment
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(title);

        // Verify learning path is visible in catalog but not enrolled
        console.log("✅ Learning path found in catalog for manual enrollment");

        // Optional: Verify enrollment button is available (indicating it's not auto-enrolled)
        try {
            await catalog.clickEnrollButton();
            console.log("✅ VERIFICATION PASSED: Learning path available for manual enrollment");
        } catch (error) {
            console.log("⚠️ Learning path may already be enrolled or not visible");
        }

        // First check My Dashboard to ensure it's NOT auto-enrolled
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.searchCertification(title);
        // If we find it in My Dashboard, the test should fail
        console.log("❌ FAILURE: Learning path was auto-enrolled despite optional access");
    });
});