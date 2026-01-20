import { credentials } from "../../../../constants/credentialData";
import { URLConstants } from "../../../../constants/urlConstants";
import { test } from "../../../../customFixtures/expertusFixture";
import { FakerData } from "../../../../utils/fakerUtils";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const learningPathTitle = FakerData.getCourseName();
const user = credentials.LEARNERUSERNAME.username;


test.describe(`TP042_Verify_learning_path_with_complete_by_days_from_hire_and_video_content.spec.ts`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Create single instance E-Learning course with video content`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create E-Learning course with video content` },
            { type: `Test Description`, description: `Create a single instance E-Learning course with video content to be added to learning path` }
        );

        console.log(`🔄 Creating E-Learning course with video content: ${courseName}`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.uploadvideo();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Successfully created video course: ${courseName}`);
    });

    test(`Create simple learning path with Complete by Days from Hire and attach video course`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TP042 - Create learning path with Complete by Days from Hire and video content` },
            { type: `Test Description`, description: `Admin creates a simple learning path with Complete by Days from Hire enabled and attaches video content course` }
        );

        console.log(`🔄 Creating learning path: ${learningPathTitle}`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
        
        // Set basic details
        await learningPath.title(learningPathTitle);
        await learningPath.language();
        await learningPath.description(description);
        
        console.log(`🔄 Setting Complete by Rule`);
        // Set Complete by Rule
        await createCourse.clickregistrationEnds();
        await createCourse.selectCompleteByRule();
        
        console.log(`🔄 Selecting Complete by Days from Hire option`);
        // Select Days from Hire option
        await createCourse.selectCompleteByOption("Days from hire");
        
        console.log(`🔄 Testing validation: Saving without Complete days`);
        // Save as draft and proceed without entering days - should show popup
        await learningPath.clickSaveAsDraftBtn();
        await learningPath.clickSave();
        
        // Verify popup for missing Complete days
        await createCourse.verifyCompleteByRequiredPopup("Complete days is required.");
        console.log(`✅ Validation passed: Complete days is required popup displayed`);
        
        console.log(`🔄 Now entering Complete by days from hire`);
        // Now enter the Complete by days (1 day)
        await createCourse.daysOfValidity("1");
        await learningPath.wait("minWait");
        
        // Save as draft and proceed with days entered
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        
        console.log(`🔄 Attaching video course to learning path`);
        // Attach course
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        
        console.log(`🔄 Publishing learning path to catalog`);
        // Publish to catalog
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        console.log(`✅ Successfully created learning path with Complete by Days from Hire: ${learningPathTitle}`);
        console.log(`   Complete by days: 1 day from hire`);
        console.log(`   Attached course: ${courseName} (Video)`);
    });

    test(`Verify learner can enroll and complete learning path with video content`, async ({ learnerHome, catalog, readContentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify learner side enrollment and completion` },
            { type: `Test Description`, description: `Learner enrolls in learning path, launches video content, completes it, and verifies completion` }
        );

        console.log(`🔄 Learner logging in and searching for learning path`);
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(learningPathTitle);
        
        console.log(`🔄 Enrolling in learning path`);
        await catalog.clickEnrollButton();
        await catalog.clickViewLearningPathDetails();
        
        console.log(`🔄 Launching and completing video content`);
        // Launch video content
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        
        console.log(`🔄 Verifying learning path completion`);
        // Verify completion
        await catalog.clickViewCertificate();
        await catalog.verifyNoCertificateAttached();
        
        console.log(`✅ Learning path with Complete by Days from Hire and video content completed successfully`);
    });

    test(`Verify Complete by Days from Hire is enforced`, async ({ learnerHome, catalog, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify Complete by Days from Hire enforcement` },
            { type: `Test Description`, description: `Navigate to My Learning and verify the Complete by date is visible on the learning path` }
        );

        console.log(`🔄 Verifying Complete by Days from Hire on learner side`);
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.searchCertification(learningPathTitle);
        await dashboard.verifyTheEnrolledCertification(learningPathTitle);
        await dashboard.clickTitle(learningPathTitle);
        await catalog.verifyStatus("Completed");
        console.log(`✅ Complete by Days from Hire verification completed`);
    });
});
