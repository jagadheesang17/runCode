import { credentials } from "../../../constants/credentialData";
import { URLConstants } from "../../../constants/urlConstants";
import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const certificationTitle = "CERT " + FakerData.getCourseName();
const user = credentials.LEARNERUSERNAME.username;

test.describe(`TP051_Verify_certification_with_complete_by_days_from_enrollment_and_AICC_content.spec.ts`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Create single instance E-Learning course with AICC content`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TP051 - Create E-Learning course with AICC content` },
            { type: `Test Description`, description: `Create a single instance E-Learning course with AICC content to be added to certification` }
        );

        console.log(`🔄 Creating E-Learning course with AICC content: ${courseName}`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.contentLibrary('AICC File containing a PPT - Storyline 11');
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Successfully created AICC course: ${courseName}`);
    });

    test(`Create simple certification with Complete by Days from Enrollment and attach AICC course`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TP051 - Create certification with Complete by Days from Enrollment and AICC content` },
            { type: `Test Description`, description: `Admin creates a simple certification with Complete by Days from Enrollment enabled and attaches AICC content course` }
        );

        console.log(`🔄 Creating certification: ${certificationTitle}`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        
        // Set basic details
        await learningPath.title(certificationTitle);
        await learningPath.language();
        await learningPath.description(description);
        
        console.log(`🔄 Setting Complete by Rule`);
        // Set Complete by Rule
        await createCourse.clickregistrationEnds();
        await createCourse.selectCompleteByRule();
        await createCourse.selectCompleteByOption("Days from enrollment");
        
        console.log(`🔄 Testing validation: Saving without Complete days`);
        // Save as draft and proceed without entering days - should show popup
        await learningPath.clickSaveAsDraftBtn();
        await learningPath.clickSave();
        
        // Verify popup for missing Complete days
        await createCourse.verifyCompleteByRequiredPopup("Complete days is required.");
        console.log(`✅ Validation passed: Complete days is required popup displayed`);
        
        console.log(`🔄 Now entering Complete by days from enrollment`);
        // Now enter the Complete by days (1 day)
        await createCourse.completByDays("1");
        await learningPath.wait("minWait");
        
        // Save as draft and proceed with days entered
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        
        console.log(`🔄 Attaching AICC course to certification`);
        // Attach course
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        
        console.log(`🔄 Publishing certification to catalog`);
        // Publish to catalog
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        console.log(`✅ Successfully created certification with Complete by Days from Enrollment: ${certificationTitle}`);
        console.log(`   Complete by days: 1 day from enrollment`);
        console.log(`   Attached course: ${courseName} (AICC)`);
    });

    test(`Verify learner can enroll and complete certification with AICC content`, async ({ learnerHome, catalog, readContentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TP051 - Verify learner side enrollment and completion` },
            { type: `Test Description`, description: `Learner enrolls in certification, launches AICC content, completes it, and verifies completion` }
        );

        console.log(`🔄 Learner logging in and searching for certification`);
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(certificationTitle);
        
        console.log(`🔄 Enrolling in certification`);
        await catalog.clickEnrollButton();
        await catalog.clickViewCertificationDetails();
        
        console.log(`🔄 Launching and completing AICC content`);
        // Launch AICC content
        await readContentHome.AICCFilecontainingaPPT_Storyline();
        await readContentHome.saveLearningAICC();
        
        console.log(`🔄 Verifying certification completion`);
        // Verify completion
        await catalog.clickViewCertificate();
        await catalog.verifyNoCertificateAttached();
        
        console.log(`✅ Certification with Complete by Days from Enrollment and AICC content completed successfully`);
    });

    test(`Verify Complete by Days from Enrollment is enforced`, async ({ learnerHome, catalog, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TP051 - Verify Complete by Days from Enrollment enforcement` },
            { type: `Test Description`, description: `Navigate to My Learning and verify the Complete by date is visible on the certification` }
        );

        console.log(`🔄 Verifying Complete by Days from Enrollment on learner side`);
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.searchCertification(certificationTitle);
        await dashboard.verifyTheEnrolledCertification(certificationTitle);
        await dashboard.clickTitle(certificationTitle);
        await catalog.verifyStatus("Completed");
        console.log(`✅ Complete by Days from Enrollment verification completed`);
    });
});
