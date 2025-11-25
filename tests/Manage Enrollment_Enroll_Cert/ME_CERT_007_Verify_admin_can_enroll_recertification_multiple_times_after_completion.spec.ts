import { credentials } from "../../constants/credentialData";
import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";

const courseName = FakerData.getCourseName();
const recertCourseName = FakerData.getCourseName();
const certificationTitle = "RECERT_" + FakerData.getCourseName();
const description = FakerData.getDescription();
const learnerUser = credentials.LEARNERUSERNAME.username;

test.describe(`ME_CERT_007_Verify_admin_can_enroll_recertification_multiple_times_after_completion`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Test 1: Create E-learning course for certification path`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_CERT_007_TC001 - Create certification course` },
            { type: `Test Description`, description: `Create single instance E-learning course for certification path` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.contentLibrary();
        await createCourse.clickHere();
        await createCourse.selectImage();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Certification course created: ${courseName}`);
    });

    test(`Test 2: Create E-learning course for recertification path`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_CERT_007_TC002 - Create recertification course` },
            { type: `Test Description`, description: `Create single instance E-learning course for recertification path` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", recertCourseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.contentLibrary();
        await createCourse.clickHere();
        await createCourse.selectImage();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Recertification course created: ${recertCourseName}`);
    });

    test(`Test 3: Create certification with recertification path`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_CERT_007_TC003 - Create certification with recertification` },
            { type: `Test Description`, description: `Create certification with recertification path enabled` }
        );

        console.log(`🔄 Creating certification with recertification: ${certificationTitle}`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(certificationTitle);
        await learningPath.description(description);
        await learningPath.language();
        
        // Enable recertification
        await learningPath.hasRecertification();
        await learningPath.clickExpiresButton();
        
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();

        // Add certification course
        console.log(`🔄 Adding certification course: ${courseName}`);
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();

        // Add recertification course
        console.log(`🔄 Adding recertification course: ${recertCourseName}`);
        await learningPath.clickDetailTab();
        await learningPath.addRecertificationCourse();
        await learningPath.saveRecertification(recertCourseName);

        // Publish to catalog
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();

        // Add completion certificate
        await learningPath.clickEditCertification();
        await createCourse.clickCompletionCertificate();
        await createCourse.clickCertificateCheckBox();
        await createCourse.clickAdd();
        await learningPath.description(description);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        
        console.log(`✅ Certification with recertification created successfully`);
    });

    test(`Test 4: Admin enrolls learner in certification - First enrollment`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_CERT_007_TC004 - First admin enrollment` },
            { type: `Test Description`, description: `Admin enrolls learner in certification for the first time` }
        );

        console.log(`🔄 First enrollment - Admin enrolling learner: ${learnerUser}`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectByOption("Certification");
        await enrollHome.selectBycourse(certificationTitle);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(learnerUser);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        console.log(`✅ First enrollment successful`);
    });

    test(`Test 5: Learner completes certification - First completion`, async ({ learnerHome, catalog, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_CERT_007_TC005 - First completion` },
            { type: `Test Description`, description: `Learner completes the certification for the first time` }
        );

        console.log(`🔄 First completion - Learner completing certification`);
        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.searchCertification(certificationTitle);
        await dashboard.verifyTheEnrolledCertification(certificationTitle);
        await dashboard.clickTitle(certificationTitle);
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.verifyStatus("Completed");
        await catalog.clickViewCertificate();
        console.log(`✅ First completion successful - Certificate viewed`);
    });

    test(`Test 6: Admin enrolls learner in recertification - Second enrollment`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_CERT_007_TC006 - Second admin enrollment` },
            { type: `Test Description`, description: `Admin enrolls learner in recertification after first completion` }
        );

        console.log(`🔄 Second enrollment - Admin re-enrolling learner: ${learnerUser}`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectByOption("Certification");
        await enrollHome.selectBycourse(certificationTitle);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(learnerUser);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        console.log(`✅ Second enrollment (recertification) successful`);
    });

    test(`Test 7: Learner completes recertification - Second completion`, async ({ learnerHome, catalog, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_CERT_007_TC007 - Second completion` },
            { type: `Test Description`, description: `Learner completes the recertification for the second time` }
        );

        console.log(`🔄 Second completion - Learner completing recertification`);
        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.searchCertification(certificationTitle);
        await dashboard.clickTitle(certificationTitle);
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.verifyStatus("Completed");
        console.log(`✅ Second completion (recertification) successful`);
    });

    test(`Test 8: Admin enrolls learner in recertification - Third enrollment`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_CERT_007_TC008 - Third admin enrollment` },
            { type: `Test Description`, description: `Admin enrolls learner in recertification for third time` }
        );

        console.log(`🔄 Third enrollment - Admin re-enrolling learner: ${learnerUser}`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectByOption("Certification");
        await enrollHome.selectBycourse(certificationTitle);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(learnerUser);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        console.log(`✅ Third enrollment (recertification) successful`);
    });

    test(`Test 9: Verify learner has third recertification enrollment available`, async ({ learnerHome, catalog, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_CERT_007_TC009 - Verify third enrollment` },
            { type: `Test Description`, description: `Verify learner can view third recertification enrollment in dashboard` }
        );

        console.log(`🔄 Verifying third enrollment in learner dashboard`);
        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.searchCertification(certificationTitle);
        await dashboard.verifyTheEnrolledCertification(certificationTitle);
        await dashboard.clickTitle(certificationTitle);
        await catalog.verifyStatus("Enrolled");
        
        console.log(`✅ VERIFICATION COMPLETED:`);
        console.log(`   ✓ Certification created with recertification path: ${certificationTitle}`);
        console.log(`   ✓ First enrollment and completion: SUCCESS`);
        console.log(`   ✓ Second enrollment (recertification) and completion: SUCCESS`);
        console.log(`   ✓ Third enrollment (recertification): SUCCESS`);
        console.log(`   ✓ Admin can enroll learner multiple times in recertification: VERIFIED`);
        console.log(`🎯 TEST RESULT: Admin successfully enrolled learner 3 times after each completion`);
    });
});
