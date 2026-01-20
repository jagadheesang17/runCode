import { test } from "../../../../customFixtures/expertusFixture";
import { FakerData } from "../../../../utils/fakerUtils";

let courseName1 = FakerData.getCourseName()+" " + Date.now();
let courseName2 = FakerData.getCourseName()+" " + Date.now();
let description = FakerData.getDescription();
const module1Name = "Module 1 - " + FakerData.getFirstName();
const module2Name = "Module 2 - " + FakerData.getFirstName();


test.describe(`TP057_Verify_admin_able_to_create_certification_with_multiple_modules_separately.spec.ts`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Create first E-Learning single instance course`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create first E-Learning course for certification modules` },
            { type: `Test Description`, description: `Create a single instance E-Learning course to be added as module in certification` }
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
        await createCourse.contentLibrary('Passed-Failed-SCORM2004');
        await createCourse.clickHere();
        await createCourse.selectImage();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Successfully created first course: ${courseName1}`);
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

    const certificationTitle = "CERT " + FakerData.getCourseName();

    test(`Verify admin able to create certification with multiple modules separately`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TP057 - Verify admin able to create certification with multiple modules separately` },
            { type: `Test Description`, description: `Admin creates a certification, adds multiple modules separately, edits module names, and attaches courses to each module` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        
        console.log(`🔄 Creating certification: ${certificationTitle}`);
        await learningPath.title(certificationTitle);
        await learningPath.description(description);
        await learningPath.language();
        await learningPath.clickSaveAsDraftBtn();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        
        console.log(`🔄 Adding first module to certification`);
        // Enable Training Plan with Modules
        await learningPath.tpWithModulesToAttachCreatedCourse();
        await learningPath.wait("minWait");
        
        console.log(`🔄 Editing first module name`);
        // Edit first module name
        await learningPath.editModuleName(0, module1Name);
        await learningPath.wait("minWait");
        
        console.log(`🔄 Adding course to first module`);
        // Expand first module and add course
        await learningPath.addCourseToModule(courseName1, 0);
        await learningPath.wait("minWait");
        
        console.log(`🔄 Adding second module`);
        // Add another module
        await learningPath.clickAddNewModule();
        await learningPath.wait("minWait");
        
        console.log(`🔄 Editing second module name`);
        // Edit second module name
        await learningPath.editModuleName(1, module2Name);
        await learningPath.wait("minWait");
        
        console.log(`🔄 Adding course to second module`);
        // Expand second module and add course
        await learningPath.clickModuleExpandIcon(1);
        await learningPath.addCourseToModule(courseName2, 1);
        await learningPath.wait("minWait");
        
        console.log(`🔄 Setting certification to catalog`);
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        
        console.log(`✅ Successfully created certification with multiple modules: ${certificationTitle}`);
        console.log(`   ${module1Name}: ${courseName1}`);
        console.log(`   ${module2Name}: ${courseName2}`);
    });

    test(`Verify certification with multiple modules is visible in catalog`, async ({ learnerHome, catalog, readContentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify created certification appears in catalog` },
            { type: `Test Description`, description: `Navigate to catalog and verify the certification with multiple modules is available and functional` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(certificationTitle);
        await catalog.clickEnrollButton();
        await catalog.clickViewCertificationDetails();
        
        console.log(`🔄 Launching and completing first module course`);
        await readContentHome.readPassed_FailedScrom2004();
        await catalog.saveLearningStatus();
        
        console.log(`🔄 Launching and completing second module course`);
        await catalog.clickOnNextCourse(module2Name);
        await catalog.clickOnNextCourse(courseName2);
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.saveLearningStatus();
        await catalog.verifyStatus("Completed");
        console.log(`🔄 Verifying completion certificate`);
        await catalog.clickViewCertificate();
        await catalog.verifyNoCertificateAttached();
        
        console.log(`✅ Certification with multiple modules completed successfully`);
    });
});
