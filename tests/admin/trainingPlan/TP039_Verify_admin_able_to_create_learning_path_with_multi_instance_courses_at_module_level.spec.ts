import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { readDataFromCSV } from "../../../utils/csvUtil";
import { credentials } from "../../../constants/credentialData";

let courseName1 = FakerData.getCourseName(); // ILT Course
let courseName2 = FakerData.getCourseName(); // VC Course
let description = FakerData.getDescription();
const module1Name = "Module 1 - ILT - " + FakerData.getFirstName();
const module2Name = "Module 2 - VC - " + FakerData.getFirstName();
const instanceName1 = "ILT_Instance_" + FakerData.getFirstName();
const sessionName1 = "Session_" + FakerData.getFirstName();
const instanceName2 = "VC_Instance_" + FakerData.getFirstName();
const instructorName =credentials.INSTRUCTORNAME.username;
const price = FakerData.getPrice();
test.describe(`TP039_Verify_admin_able_to_create_learning_path_with_multi_instance_courses_at_module_level.spec.ts`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Create multi-instance Classroom (ILT) course`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create multi-instance Classroom course for learning path module` },
            { type: `Test Description`, description: `Create a multi-instance Classroom (ILT) course to be added as module in learning path` }
        );

        console.log("🔄 Creating multi-instance Classroom (ILT) course...");
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.clickMenu("Course");
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName1);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.selectdeliveryType("Classroom");
        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown();
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.editcourse();
        await createCourse.addInstances();

        // Add Classroom instance
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", instanceName1);
        await createCourse.enterSessionName(sessionName1);
        await createCourse.setMaxSeat();
        await createCourse.enterDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Successfully created multi-instance Classroom course: ${courseName1}`);
    });

    test(`Create multi-instance Virtual Class (VC) course`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create multi-instance Virtual Class course for learning path module` },
            { type: `Test Description`, description: `Create a multi-instance Virtual Class course to be added as module in learning path` }
        );

        console.log("🔄 Creating multi-instance Virtual Class (VC) course...");
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName2);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.selectdeliveryType("Virtual Class");
        await createCourse.enterPrice(price);
        await createCourse.selectCurrency();
        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown();
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await createCourse.clickEditCourseTabs();
        await createCourse.addInstances();

        // Add Virtual Class instance
        await createCourse.selectInstanceDeliveryType("Virtual Class");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", instanceName2);
        await createCourse.selectMeetingType(instructorName, courseName2 + "_Meeting1", 1);
        await createCourse.setMaxSeat();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Successfully created multi-instance Virtual Class course: ${courseName2}`);
    });

    const learningPathTitle = FakerData.getCourseName();

    test(`Verify admin able to create learning path with multi-instance courses at module level`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TP039 - Verify admin able to create learning path with multi-instance courses at module level` },
            { type: `Test Description`, description: `Admin creates a learning path, adds multiple modules separately, edits module names, and attaches multi-instance ILT and VC courses to each module` }
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
        
        console.log(`🔄 Adding first module to learning path`);
        // Enable Training Plan with Modules
        await learningPath.tpWithModulesToAttachCreatedCourse();
        await learningPath.wait("minWait");
        
        console.log(`🔄 Editing first module name`);
        // Edit first module name
        await learningPath.editModuleName(0, module1Name);
        await learningPath.wait("minWait");
        
        console.log(`🔄 Adding multi-instance ILT course to first module`);
        // Expand first module and add ILT course
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
        
        console.log(`🔄 Adding multi-instance VC course to second module`);
        // Expand second module and add VC course
        await learningPath.clickModuleExpandIcon(1);
        await learningPath.addCourseToModule(courseName2, 1);
        await learningPath.wait("minWait");
        
        console.log(`🔄 Setting learning path to catalog`);
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        
        console.log(`✅ Successfully created learning path with multi-instance courses at module level: ${learningPathTitle}`);
        console.log(`   ${module1Name}: ${courseName1} (ILT)`);
        console.log(`   ${module2Name}: ${courseName2} (VC)`);
    });

    test(`Verify learning path with multi-instance courses is visible in catalog`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify created learning path with multi-instance courses appears in catalog` },
            { type: `Test Description`, description: `Navigate to catalog, enroll in learning path, and verify multi-instance course selection and enrollment` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(learningPathTitle);
        await catalog.clickEnrollButton();
        await catalog.clickViewLearningPathDetails();
        console.log(`✅ Learning path with multi-instance courses (ILT & VC) at module level enrolled successfully`);
    });
});
