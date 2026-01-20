import { test } from "../../../../customFixtures/expertusFixture";
import { FakerData } from "../../../../utils/fakerUtils";

let courseName1 = FakerData.getCourseName();
let courseName2 = FakerData.getCourseName();
let description = FakerData.getDescription();

test.describe(`TP037_Verify_admin_able_to_create_learning_path_with_modules.spec.ts`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Create first E-Learning single instance course`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create first E-Learning course for learning path modules` },
            { type: `Test Description`, description: `Create a single instance E-Learning course to be added as module in learning path` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName1);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.contentLibrary();
        await createCourse.clickHere();
        await createCourse.selectImage();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Successfully created first course: ${courseName1}`);
    });

    test(`Create second E-Learning single instance course`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create second E-Learning course for learning path modules` },
            { type: `Test Description`, description: `Create a second single instance E-Learning course to be added as module in learning path` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName2);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.contentLibrary();
        await createCourse.clickHere();
        await createCourse.selectImage();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Successfully created second course: ${courseName2}`);
    });

    const learningPathTitle = FakerData.getCourseName();

    test(`Verify admin able to create learning path with modules`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TP037 - Verify admin able to create learning path with modules` },
            { type: `Test Description`, description: `Admin creates a learning path and attaches multiple courses as modules` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
        
        console.log(`🔄 Creating learning path: ${learningPathTitle}`);
        await learningPath.title(learningPathTitle);
        await learningPath.description(description);
        await learningPath.language();
        await learningPath.clickSaveAsDraftBtn();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        
        console.log(`🔄 Adding modules to learning path`);
        // Add modules to learning path
        await learningPath.tpWithModulesToAttachCreatedCourse();
        
        console.log(`🔄 Adding courses to modules`);
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName1);
        await learningPath.clickAddSelectCourse();
         await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName2);
        await learningPath.clickAddSelectCourse();
        
        console.log(`🔄 Setting learning path to catalog`);
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        
        console.log(`✅ Successfully created learning path with modules: ${learningPathTitle}`);
        console.log(`   Module 1: ${courseName1}`);
        console.log(`   Module 2: ${courseName2}`);
    });

    test(`Verify learning path with modules is visible in catalog`, async ({ learnerHome, catalog, contentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify created learning path appears in catalog` },
            { type: `Test Description`, description: `Navigate to catalog and verify the learning path with modules is available` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(learningPathTitle);
        await catalog.clickEnrollButton();
        await catalog.clickViewLearningPathDetails();
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.clickOnNextCourse(courseName2)
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.saveLearningStatus();
        await catalog.clickViewCertificate();
        await catalog.verifyNoCertificateAttached();
    });
});
