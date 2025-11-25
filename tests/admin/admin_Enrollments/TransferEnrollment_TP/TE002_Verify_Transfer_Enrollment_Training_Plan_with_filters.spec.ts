import { test } from "../../../../customFixtures/expertusFixture"
import { FakerData } from '../../../../utils/fakerUtils';

const lpName = "LP_TE_" + FakerData.getCourseName();
const lpNameVersion2 = lpName + " - Version 2";
const courseName = FakerData.getCourseName();
let selectedCategory = "";
let selectedProvider = "";
let selectedTags = "";
let description = FakerData.getDescription();

test.describe(`Verify Transfer Enrollment - Training Plan with filters`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Create E-Learning course, Learning Path with tags and apply filters in Transfer Enrollment`, async ({ adminHome, createCourse, learningPath, editCourse, enrollHome, organization }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Complete Transfer Enrollment - Training Plan with filters` },
            { type: `Test Description`, description: `Create course and LP with metadata, apply filters (Language, Category, Provider, Tags) in Transfer Enrollment and verify results` }
        );

        // Create E-Learning course
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("Transfer Enrollment Test Course"); 
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

        // Create Learning Path with course
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
         await learningPath.title(lpName);
        await learningPath.language();
        
        // Add category and provider
        selectedCategory = await createCourse.handleCategoryADropdown();
        console.log(`✅ Selected Category: ${selectedCategory}`);
        selectedProvider = await createCourse.providerDropdown();
        console.log(`✅ Selected Provider: ${selectedProvider}`);
        
        await learningPath.description("Transfer Enrollment Test Learning Path");
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        
        // Add tags to learning path
        console.log(`🔄 Adding tags to learning path`);
        await learningPath.clickEditLearningPath();
        await editCourse.clickTagMenu();
        selectedTags = await editCourse.selectTags();
        await editCourse.clickClose();
        await learningPath.description(description);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Tags added to learning path successfully`);

        // Navigate to Transfer Enrollment and apply filters
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.manageEnrollment("Transfer Enrollment - Training Plan");
        await learningPath.clickFilterIcon();
        
        // Apply Language filter
        await organization.selectFilterDropdown("Language");
        await organization.searchAndSelectFilterValue("Language", "English");
        console.log("✅ Applied Language filter: English");
        
        // Apply Category filter
        await organization.selectFilterDropdown("Category");
        await organization.searchAndSelectFilterValue("Category", selectedCategory);
        console.log(`✅ Applied Category filter: ${selectedCategory}`);
            // Apply Tags filter
        await organization.selectFilterDropdown("Tags");
        await organization.searchAndSelectFilterValue("Tags", selectedTags);
        console.log(`✅ Applied Tags filter: ${selectedTags}`);
        // Apply Provider filter
        await organization.selectFilterDropdown("Provider");
        await organization.searchAndSelectFilterValue("Provider", selectedProvider);
        console.log(`✅ Applied Provider filter: ${selectedProvider}`);
        
        await organization.clickApplyFilter();

        // Verify no matching result found message when LP is not versioned
        await learningPath.verifyNoMatchingResultFound();
        console.log(`✅ Verified 'No matching result found' message appears for non-versioned LP`);
    });

    test(`Add version to Learning Path and verify it appears in Transfer Enrollment with filters`, async ({ adminHome, createCourse, learningPath, enrollHome, organization }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Add version to LP and verify versioned LP appears in filtered results` },
            { type: `Test Description`, description: `When LP without version not showing in Transfer Enrollment, add version and verify it appears after applying filters` }
        );

        // Add Version 2 to Learning Path
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await createCourse.catalogSearch(lpName);
        await learningPath.clickEditIconFromTPListing(lpName);

        // Click Add Version button
        await learningPath.clickAddVersionBtn();

        // Click Create button to create version
        await learningPath.clickCreateVersionBtn();

        // Update title with version 2
        await learningPath.title(lpNameVersion2);

        // Click catalog and update
        await createCourse.clickCatalog();
        
        // Verify version changed to Version 2
        await learningPath.verifyVersionNumber("2");
        
        await createCourse.clickUpdate();

        // Verify confirmation popup messages
        await learningPath.verifyPublishConfirmationPopup();

        // Click Yes button
        await learningPath.clickYesBtn();

        // Verify success message
        await learningPath.verifySuccessMessage();

        console.log(`✅ Version 2 created successfully: ${lpNameVersion2}`);

        // Navigate to Transfer Enrollment and apply same filters again
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.manageEnrollment("Transfer Enrollment - Training Plan");
        await learningPath.clickFilterIcon();

        // Apply Language filter
        await organization.selectFilterDropdown("Language");
        await organization.searchAndSelectFilterValue("Language", "English");
        console.log("✅ Applied Language filter: English");

        // Apply Category filter
        await organization.selectFilterDropdown("Category");
        await organization.searchAndSelectFilterValue("Category", selectedCategory);
        console.log(`✅ Applied Category filter: ${selectedCategory}`);

        // Apply Tags filter
        await organization.selectFilterDropdown("Tags");
        await organization.searchAndSelectFilterValue("Tags", selectedTags);
        console.log(`✅ Applied Tags filter: ${selectedTags}`);

        // Apply Provider filter
        await organization.selectFilterDropdown("Provider");
        await organization.searchAndSelectFilterValue("Provider", selectedProvider);
        console.log(`✅ Applied Provider filter: ${selectedProvider}`);

        await organization.clickApplyFilter();

        // Verify versioned Learning Path is now present in filtered results
        await learningPath.verifyLPInFilteredResults(lpName);
        console.log(`✅ Verified versioned LP appears in Transfer Enrollment after adding version: ${lpNameVersion2}`);
    });
});
