import { credentials } from "../../../../constants/credentialData";
import { test } from "../../../../customFixtures/expertusFixture";
import { FakerData } from "../../../../utils/fakerUtils";

let courseName = FakerData.getCourseName();
let learningPathTitle = FakerData.getCourseName();
let description = FakerData.getDescription();
let learningPathCode: string;
let categoryName: string;
let providerName: string;
let tagName: string;

test.describe.configure({ mode: "serial" });

test(`Create Learning Path with category, provider, and tags`, async ({ adminHome, learningPath, createCourse, editCourse, contentHome }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Create Learning Path with filters` },
        { type: `Test Description`, description: `Create learning path with category, provider, tags and get the code` }
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

    // Add Category and capture the value
    categoryName = await createCourse.handleCategoryADropdown();
    console.log(`📌 Category selected: ${categoryName}`);

    // Add Provider and capture the value
    providerName = await createCourse.providerDropdown();
    console.log(`📌 Provider selected: ${providerName}`);
    await createCourse.selectTotalDuration();
    await createCourse.typeAdditionalInfo();

    await learningPath.clickSave();
    await learningPath.clickProceedBtn();

    // Add Course
    await learningPath.clickAddCourse();
    await learningPath.searchAndClickCourseCheckBox(courseName);
    await learningPath.clickAddSelectCourse();

    // Add Tags and capture the value
    await editCourse.clickTagMenu();
    tagName = await editCourse.selectTags();
    console.log(`📌 Tag selected: ${tagName}`);
    await editCourse.clickClose();

    // Publish to catalog
    await learningPath.clickDetailTab();
    await learningPath.clickCatalogBtn();
    await learningPath.clickUpdateBtn();
    await learningPath.verifySuccessMessage();
    await learningPath.clickEditLearningPath();
    learningPathCode = await createCourse.retriveCode();
    console.log(`✅ Learning Path created: ${learningPathTitle}`);
    await learningPath.description(description + " - Added Either Direct or Other Manager Approval");
    await createCourse.clickUpdate();
    await contentHome.gotoListing();

    // Apply filters using the new method

    await learningPath.applyLearningPathFilters({
        category: categoryName,
        provider: providerName,
        tags: tagName,
        status: "Show in Catalog",
        //course: courseName,
        code: learningPathCode
    });

    await createCourse.verifyTitle(learningPathTitle);
    console.log(`📋 Learning Path Code: ${learningPathCode}`);
});  
