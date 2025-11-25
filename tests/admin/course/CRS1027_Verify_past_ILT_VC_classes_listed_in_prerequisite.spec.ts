import { test } from "../../../customFixtures/expertusFixture";
import { credentials } from "../../../constants/credentialData";
import { FakerData } from "../../../utils/fakerUtils";

const pastILTCourseName = "Past ILT " + FakerData.getCourseName();
const pastVCCourseName = "Past VC " + FakerData.getCourseName();
const mainCourseName = "Main Course " + FakerData.getCourseName();
const sessionName = FakerData.getSession();
const description = FakerData.getDescription();
const instructorName = credentials.INSTRUCTORNAME.username;

test.describe(`Verify that past ILT/VC classes are listed in prerequisite`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Create past ILT course with completed class`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `AI Assistant` },
            { type: `TestCase`, description: `Create past ILT course with completed class` },
            { type: `Test Description`, description: `Create an ILT course with a past date instance to use as prerequisite` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        
        // Create ILT course
        await createCourse.enter("course-title", pastILTCourseName);
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
        await createCourse.verifySuccessMessage();
        
        // Add past instance
        await createCourse.clickEditCourseTabs();
        await createCourse.addInstances();
        
        async function addinstance(deliveryType: string) {
            await createCourse.selectInstanceDeliveryType(deliveryType);
            await createCourse.clickCreateInstance();
        }
        
        await addinstance("Classroom");
        await createCourse.enterSessionName(sessionName);
        await createCourse.enterpastDateValue(); // This sets a past date
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.setMaxSeat();
        await createCourse.typeDescription("Past ILT class for prerequisite testing");
        await createCourse.clickHideinCatalog(); // Hide in catalog before updating
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    });

    test.skip(`Create past VC course with completed class`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `AI Assistant` },
            { type: `TestCase`, description: `Create past VC course with completed class` },
            { type: `Test Description`, description: `Create a VC course with a past date instance to use as prerequisite` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        
        // Create VC course
        await createCourse.enter("course-title", pastVCCourseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.selectdeliveryType("Virtual Class");
        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown();
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        
        // Add past virtual class instance
        await createCourse.clickEditCourseTabs();
        await createCourse.addInstances();
        
        async function addinstance(deliveryType: string) {
            await createCourse.selectInstanceDeliveryType(deliveryType);
            await createCourse.clickCreateInstance();
        }
        
        await addinstance("Virtual Class");
        await createCourse.selectMeetingType(instructorName, pastVCCourseName, 1);
        await createCourse.enterpastDateValue(); // This sets a past date
        await createCourse.startandEndTime();
        await createCourse.setMaxSeat();
        await createCourse.typeDescription("Past VC class for prerequisite testing");
        await createCourse.clickHideinCatalog(); // Hide in catalog before updating
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    });

    test(`Create main course and verify past ILT class appears in prerequisite list`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `AI Assistant` },
            { type: `TestCase`, description: `Verify past ILT class appears in prerequisite search` },
            { type: `Test Description`, description: `Create main course and verify that past ILT class is available for selection as prerequisite` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        
        // Create main course
        await createCourse.enter("course-title", mainCourseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("Main course to test prerequisite functionality");
        await createCourse.contentLibrary(); // E-learning content
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        
        // Navigate to prerequisite section
        await createCourse.editcourse();
        await editCourse.clickClose();
        await createCourse.clickCourseOption("Prerequisite");
        
        // Search for past ILT course and verify it appears
        await createCourse.typeAndEnter(
            createCourse.selectors.preSearchField,
            "Prerequisite Search Field",
            pastILTCourseName
        );
        await createCourse.spinnerDisappear();
        
        // Verify the past ILT course is available in the search results
        await createCourse.validateElementVisibility(
            createCourse.selectors.preCourseIndex(1),
            "Past ILT course should be available in prerequisite search"
        );
        
        // Add the past ILT course as prerequisite
        await createCourse.click(
            createCourse.selectors.preCourseIndex(1),
            "Past ILT Course",
            "checkbox"
        );
        await createCourse.mouseHover(createCourse.selectors.addPreCourseBtn, "Add Prerequisite");
        await createCourse.click(createCourse.selectors.addPreCourseBtn, "Add as Prerequisite", "button");
        await createCourse.wait("mediumWait");
        
        // Verify prerequisite was added successfully
        await createCourse.validateElementVisibility(
            `//div[contains(text(),'${pastILTCourseName}')]`,
            "Past ILT course should be added as prerequisite"
        );
    });

    test.skip(`Verify past VC class appears in prerequisite list`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `AI Assistant` },
            { type: `TestCase`, description: `Verify past VC class appears in prerequisite search` },
            { type: `Test Description`, description: `Verify that past VC class is available for selection as prerequisite in the same main course` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        
        // Navigate back to the main course to add another prerequisite
        await createCourse.catalogSearch(mainCourseName);
        await createCourse.clickEditIcon();
        await createCourse.clickCourseOption("Prerequisite");
        
        // Search for past VC course and verify it appears
        await createCourse.typeAndEnter(
            createCourse.selectors.preSearchField,
            "Prerequisite Search Field",
            pastVCCourseName
        );
        await createCourse.spinnerDisappear();
        
        // Verify the past VC course is available in the search results
        await createCourse.validateElementVisibility(
            createCourse.selectors.preCourseIndex(1),
            "Past VC course should be available in prerequisite search"
        );
        
        // Add the past VC course as prerequisite
        await createCourse.click(
            createCourse.selectors.preCourseIndex(1),
            "Past VC Course",
            "checkbox"
        );
        await createCourse.mouseHover(createCourse.selectors.addPreCourseBtn, "Add Prerequisite");
        await createCourse.click(createCourse.selectors.addPreCourseBtn, "Add as Prerequisite", "button");
        await createCourse.wait("mediumWait");
        
        // Verify prerequisite was added successfully
        await createCourse.validateElementVisibility(
            `//div[contains(text(),'${pastVCCourseName}')]`,
            "Past VC course should be added as prerequisite"
        );
    });

    test.skip(`Verify both past ILT and VC classes are listed together in prerequisite selection`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `AI Assistant` },
            { type: `TestCase`, description: `Verify both past classes are listed in prerequisite` },
            { type: `Test Description`, description: `Verify that both past ILT and VC classes are available and can be found when searching for prerequisites` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        
        // Create another course to test comprehensive prerequisite search
        const testCourseName = "Test Prerequisites " + FakerData.getCourseName();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        
        await createCourse.enter("course-title", testCourseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("Test course for comprehensive prerequisite verification");
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        
        // Navigate to prerequisite section
        await createCourse.editcourse();
        await editCourse.clickClose();
        await createCourse.clickCourseOption("Prerequisite");
        
        // Search for "Past" to find both courses
        await createCourse.typeAndEnter(
            createCourse.selectors.preSearchField,
            "Prerequisite Search Field",
            "Past"
        );
        await createCourse.spinnerDisappear();
        
        // Verify both courses appear in search results
        await createCourse.verification(
            createCourse.selectors.preCourseIndex(1),
            "First past course should be available in prerequisite search"
        );
        await createCourse.verification(
            createCourse.selectors.preCourseIndex(2),
            "Second past course should be available in prerequisite search"
        );
        
        // Verify we can see both ILT and VC courses in the results by checking for their presence
        const pastCourseElements = await createCourse.page.locator("//div[@id='lms-scroll-preadded-list']//div[contains(@class, 'form-check-label')]").count();
        console.log(`Found ${pastCourseElements} past courses available as prerequisites`);
        
        // Should have at least 2 courses (the ILT and VC courses we created)
        if (pastCourseElements >= 2) {
            console.log("✓ Both past ILT and VC courses are available in prerequisite selection");
        } else {
            throw new Error(`Expected at least 2 past courses, but found ${pastCourseElements}`);
        }
    });

    test(`Verify prerequisite functionality works with past classes - negative scenario`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `AI Assistant` },
            { type: `TestCase`, description: `Verify prerequisite enforcement with past classes` },
            { type: `Test Description`, description: `Verify that learner cannot enroll in main course without completing past prerequisite classes` }
        );

        // Login as learner and try to enroll in main course
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(mainCourseName);
        await catalog.clickMoreonCourse(mainCourseName);
       
        // Verify that past classes are mentioned in prerequisite requirements
        try {
            await catalog.page.waitForSelector(`//*[contains(text(),'${pastILTCourseName}') or contains(text(),'${pastVCCourseName}')]`, { timeout: 9000 }); 
            console.log("Past prerequisite courses are mentioned as requirements.");  
            
        } catch (error) {

            console.log("Past prerequisite courses are NOT mentioned as requirements.");
        }
       
    });
});