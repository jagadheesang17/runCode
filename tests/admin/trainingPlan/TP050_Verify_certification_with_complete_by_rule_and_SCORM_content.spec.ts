import { credentials } from "../../../constants/credentialData";
import { URLConstants } from "../../../constants/urlConstants";
import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const certificationTitle = "CERT " + FakerData.getCourseName();
const user = credentials.LEARNERUSERNAME.username;

test.describe(`TP050_Verify_certification_with_complete_by_rule_and_SCORM_content.spec.ts`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Create single instance E-Learning course with SCORM 2004 content`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TP050 - Create E-Learning course with SCORM 2004 content` },
            { type: `Test Description`, description: `Create a single instance E-Learning course with SCORM 2004 Passed-Failed content to be added to certification` }
        );

        console.log(`🔄 Creating E-Learning course with SCORM 2004 content: ${courseName}`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.contentLibrary('Passed-Failed-SCORM2004');
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Successfully created SCORM course: ${courseName}`);
    });

    test(`Create simple certification with Complete by Rule and attach SCORM course`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TP050 - Create certification with Complete by Rule and SCORM content` },
            { type: `Test Description`, description: `Admin creates a simple certification with Complete by Rule enabled and attaches SCORM content course` }
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
        
        console.log(`🔄 Testing validation: Saving without Complete by date`);
        // Save as draft and proceed without selecting date - should show popup
        await learningPath.clickSaveAsDraftBtn();
        await learningPath.clickSave();
        
        // Verify popup for missing Complete by date
        await createCourse.verifyCompleteByRequiredPopup("Complete by date is required.");
        console.log(`✅ Validation passed: Complete by date is required popup displayed`);
        
        console.log(`🔄 Now selecting Complete by date`);
        // Now select the Complete by date
        await createCourse.selectCompleteByDate();
        await createCourse.selectPostCompletebyOverDue();
        await learningPath.wait("minWait");
        
        // Save as draft and proceed with date selected
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        
        console.log(`🔄 Attaching SCORM course to certification`);
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
        console.log(`✅ Successfully created certification with Complete by Rule: ${certificationTitle}`);
        console.log(`   Attached course: ${courseName} (SCORM 2004)`);
    });

    test(`Verify learner can enroll and complete certification with SCORM content`, async ({ learnerHome, catalog, readContentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TP050 - Verify learner side enrollment and completion` },
            { type: `Test Description`, description: `Learner enrolls in certification, launches SCORM content, completes it, and verifies completion` }
        );

        console.log(`🔄 Learner logging in and searching for certification`);
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(certificationTitle);
        
        console.log(`🔄 Enrolling in certification`);
        await catalog.clickEnrollButton();
        await catalog.clickViewCertificationDetails();
        
        console.log(`🔄 Launching and completing SCORM 2004 content`);
        // Launch SCORM content
        await readContentHome.readPassed_FailedScrom2004();
        await catalog.saveLearningStatus();
        
        console.log(`🔄 Verifying certification completion`);
        // Verify completion
        await catalog.clickViewCertificate();
        await catalog.verifyNoCertificateAttached();
        
        console.log(`✅ Certification with Complete by Rule and SCORM content completed successfully`);
    });

    test(`Verify Complete by Rule date is enforced`, async ({ learnerHome, catalog, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TP050 - Verify Complete by Rule enforcement` },
            { type: `Test Description`, description: `Navigate to My Learning and verify the Complete by date is visible on the certification` }
        );

        console.log(`🔄 Verifying Complete by Rule on learner side`);
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.searchCertification(certificationTitle);
        await dashboard.verifyTheEnrolledCertification(certificationTitle);
        await dashboard.clickTitle(certificationTitle);
        await catalog.verifyStatus("Completed");
        console.log(`✅ Complete by Rule verification completed`);
    });
});
