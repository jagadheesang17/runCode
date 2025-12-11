import { credentials } from "../../../../constants/credentialData";
import { test } from "../../../../customFixtures/expertusFixture";
import { FakerData } from "../../../../utils/fakerUtils";
import { FilterUtils } from "../../../../utils/filterUtils";

let courseName = FakerData.getCourseName();
let learningPathTitle = FakerData.getCourseName();
let description = FakerData.getDescription();
let learningPathCode: string;

test.describe.configure({ mode: "serial" });

test(`Create Learning Path and verify export and sort functionality`, async ({ adminHome, learningPath, createCourse, editCourse, contentHome, exportPage, page, context }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Verify Learning Path export and sort functionality` },
        { type: `Test Description`, description: `Create learning path and verify export as Excel and all sort options` }
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
    await createCourse.contentLibrary(); // By default Youtube content will be attached
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    console.log(`✅ Course created: ${courseName}`);
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickLearningPath();
    await learningPath.clickCreateLearningPath();
    await learningPath.title(learningPathTitle);
    await learningPath.description(description);
    await learningPath.language();
    await createCourse.selectTotalDuration();
    await createCourse.typeAdditionalInfo();

    await learningPath.clickSave();
    await learningPath.clickProceedBtn();

    // Add Course
    await learningPath.clickAddCourse();
    await learningPath.searchAndClickCourseCheckBox(courseName);
    await learningPath.clickAddSelectCourse();

    // Publish to catalog
    await learningPath.clickDetailTab();
    await learningPath.clickCatalogBtn();
    await learningPath.clickUpdateBtn();
    await learningPath.verifySuccessMessage();
    await contentHome.gotoListing();
    // Test Export functionality
    console.log(`📤 Testing Export as Excel functionality`);
    await exportPage.clickExportAs("Excel");
    console.log(`✅ Export as Excel completed successfully`);

    // Test Sort functionality
    console.log(`🔄 Testing all sort options`);
    const filterUtils = new FilterUtils(page, context);
    await filterUtils.verifyAllSortOptions();
    console.log(`✅ All sort options verified successfully`);
});  
