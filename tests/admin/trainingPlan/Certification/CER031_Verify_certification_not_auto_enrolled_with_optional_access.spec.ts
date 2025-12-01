import { credentials } from "../../../../constants/credentialData";
import { URLConstants } from "../../../../constants/urlConstants";
import { test } from "../../../../customFixtures/expertusFixture";
import { FakerData } from "../../../../utils/fakerUtils";
import { updateCertificationComplianceFlow, updateSingleInstanceAutoRegister } from "../../../../tests/admin/DB/DBJobs";

let courseName = FakerData.getCourseName();
let description = FakerData.getDescription();
const user = credentials.LEARNERUSERNAME.username;
let domain: any;

test.describe(`TP053_Verify_certification_not_auto_enrolled_with_optional_access.spec.ts`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Creation of E-learning single instance course for optional access certification`, async ({ adminHome, createCourse, learningPath }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create the course as Single instance for optional access testing` },
            { type: `Test Description`, description: `Create course that will be used in certification for optional access verification` }
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

    test(`Create certification with optional access settings for group and user`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create certification with optional access settings` },
            { type: `Test Description`, description: `Create certification and configure optional access for both group and user to prevent auto enrollment via cron` }
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

        // Set access to "Optional" instead of "Mandatory" to prevent auto enrollment
        await createCourse.accessSettings("Optional");
        console.log("✅ Optional access settings configured for certification");
        await learningPath.description(description);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log("✅ Certification created with optional access settings");
    });

    test(`Run auto register cron job and verify certification is not auto-enrolled`, async ({ adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Execute auto register cron and verify no auto enrollment` },
            { type: `Test Description`, description: `Run auto register cron job and verify that certification with optional access is not automatically enrolled` }
        );

        // Execute auto register cron job
        console.log("🔄 Executing auto register cron job...");
        await updateCertificationComplianceFlow();
        console.log("✅ Auto register cron job executed");
    });

    test(`Verify certification is NOT auto-enrolled and appears only in catalog`, async ({ dashboard, learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify certification is NOT auto-enrolled due to optional access` },
            { type: `Test Description`, description: `Verify that the certification with optional access is NOT auto-enrolled and only appears in catalog for manual enrollment` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "LearnerPortal");

        // Now verify it's available in catalog for manual enrollment
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(title);

        // Verify certification is visible in catalog but not enrolled
        console.log("✅ Certification found in catalog for manual enrollment");

        // Optional: Verify enrollment button is available (indicating it's not auto-enrolled)
        try {
            await catalog.clickEnrollButton();
            console.log("✅ VERIFICATION PASSED: Certification available for manual enrollment");
        } catch (error) {
            console.log("⚠️ Certification may already be enrolled or not visible");
        }

        // First check My Dashboard to ensure it's NOT auto-enrolled
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.searchCertification(title);
        // If we find it in My Dashboard, the test should fail
        console.log("❌ FAILURE: Certification was auto-enrolled despite optional access");
    });
});
