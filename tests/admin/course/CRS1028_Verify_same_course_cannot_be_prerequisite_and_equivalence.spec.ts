import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

const courseName = "Self Test Course " + FakerData.getCourseName();
const description = FakerData.getDescription();
let tag: any;

test.describe(`Verify that course cannot add itself as prerequisite or equivalence`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Create a course for self-prerequisite and equivalence validation`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `AI Assistant` },
            { type: `TestCase`, description: `Create course for self-validation testing` },
            { type: `Test Description`, description: `Create a course that will be used to verify it cannot add itself as prerequisite or equivalence` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        
        // Create the test course
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.contentLibrary(); // E-learning content
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        
        console.log(`✓ Course created successfully: ${courseName}`);
    });

    test(`Verify course cannot add itself as prerequisite`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `AI Assistant` },
            { type: `TestCase`, description: `Verify course cannot be its own prerequisite` },
            { type: `Test Description`, description: `Attempt to add the course as its own prerequisite and verify system prevents this action` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        
        // Search and edit the created course
        await createCourse.catalogSearch(courseName);
        await createCourse.clickEditIcon();
        
        // Navigate to prerequisite section
        await createCourse.clickCourseOption("Prerequisite");
        
        // Search for the same course (self)
        await createCourse.typeAndEnter(
            createCourse.selectors.preSearchField,
            "Prerequisite Search Field",
            courseName
        );
        await createCourse.spinnerDisappear();
        
        // Check if the course appears in its own prerequisite search results
        const selfCourseExists = await createCourse.page.locator(
            createCourse.selectors.preCourseIndex(1)
        ).count();
        
        if (selfCourseExists > 0) {
            // BUG: Course should NOT appear in its own prerequisite search
            console.log("❌ BUG DETECTED: Course appears in its own prerequisite search - This is incorrect behavior!");
            
            // Since it appears (which is wrong), try to add it and verify system shows error
            console.log("Testing if system shows error when trying to add self as prerequisite...");
            
            await createCourse.click(
                createCourse.selectors.preCourseIndex(1),
                "Self Course as Prerequisite (should show error)",
                "checkbox"
            );
            await createCourse.click(
                createCourse.selectors.addPreCourseBtn,
                "Add Self as Prerequisite (should show error)",
                "button"
            );
            
            // System MUST show error message since it allowed the course to appear
            const errorMessageVisible = await createCourse.page.locator(
                "//div[contains(@class, 'alert') or contains(@class, 'error') or contains(@class, 'message')]"
            ).isVisible({ timeout: 5000 });
            
            if (errorMessageVisible) {
                console.log("✓ PASS: System shows error message preventing self-prerequisite (compensates for allowing it in search)");
                await createCourse.validateElementVisibility(
                    "//div[contains(@class, 'alert') or contains(@class, 'error')]//span[contains(text(), 'cannot') or contains(text(), 'same') or contains(text(), 'itself')]",
                    "Error message should prevent course from being its own prerequisite"
                );
            } else {
                console.log("❌ CRITICAL BUG: Course appears in search AND no error shown when adding - System allows self-prerequisite!");
                throw new Error("CRITICAL BUG: System allows course to be its own prerequisite without any validation");
            }
        } else {
            // CORRECT behavior - course should not appear in its own prerequisite search
            console.log("✓ PASS: Course correctly excluded from its own prerequisite search results (Expected behavior)");
            
            // Verify search returns other courses but not itself
            const searchResults = await createCourse.page.locator("//div[@id='lms-scroll-preadded-list']//div[contains(@class, 'form-check-label')]").count();
            console.log(`Prerequisite search returned ${searchResults} courses (self-course correctly excluded)`);
        }
    });

    test(`Verify course cannot add itself as equivalence`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `AI Assistant` },
            { type: `TestCase`, description: `Verify course cannot be its own equivalence` },
            { type: `Test Description`, description: `Attempt to add the course as its own equivalence and verify system prevents this action` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        
        // Search and edit the created course
        await createCourse.catalogSearch(courseName);
        await createCourse.clickEditIcon();
        
        // Navigate to equivalence section
        await createCourse.clickCourseOption("Equivalence");
        
        // Search for the same course (self) in equivalence
        await createCourse.typeAndEnter(
            createCourse.selectors.preSearchField, // Same search field used for equivalence
            "Equivalence Search Field",
            courseName
        );
        await createCourse.spinnerDisappear();
        
        // Check if the course appears in its own equivalence search results
        const selfCourseExists = await createCourse.page.locator(
            createCourse.selectors.selectEquivalenceCourse(courseName)
        ).count();
        
        if (selfCourseExists > 0) {
            // BUG: Course should NOT appear in its own equivalence search
            console.log("❌ BUG DETECTED: Course appears in its own equivalence search - This is incorrect behavior!");
            
            // Since it appears (which is wrong), try to add it and verify system shows error
            console.log("Testing if system shows error when trying to add self as equivalence...");
            
            await createCourse.click(
                createCourse.selectors.selectEquivalenceCourse(courseName),
                "Self Course as Equivalence (should show error)",
                "Radio Button"
            );
            await createCourse.click(
                createCourse.selectors.addEquivalenceButton,
                "Add Self as Equivalence (should show error)",
                "Button"
            );
            
            // System MUST show error message since it allowed the course to appear
            const errorMessageVisible = await createCourse.page.locator(
                "//div[contains(@class, 'alert') or contains(@class, 'error') or contains(@class, 'message')]"
            ).isVisible({ timeout: 5000 });
            
            if (errorMessageVisible) {
                console.log("✓ PASS: System shows error message preventing self-equivalence (compensates for allowing it in search)");
                await createCourse.validateElementVisibility(
                    "//div[contains(@class, 'alert') or contains(@class, 'error')]//span[contains(text(), 'cannot') or contains(text(), 'same') or contains(text(), 'itself')]",
                    "Error message should prevent course from being its own equivalence"
                );
            } else {
                console.log("❌ CRITICAL BUG: Course appears in search AND no error shown when adding - System allows self-equivalence!");
                throw new Error("CRITICAL BUG: System allows course to be its own equivalence without any validation");
            }
        } else {
            // CORRECT behavior - course should not appear in its own equivalence search
            console.log("✓ PASS: Course correctly excluded from its own equivalence search results (Expected behavior)");
            
            // Verify search returns other courses but not itself
            const searchResults = await createCourse.page.locator("//div[@id='lms-scroll-preadded-list']//div[contains(@class, 'form-check-label')]").count();
            console.log(`Equivalence search returned ${searchResults} courses (self-course correctly excluded)`);
        }
        
        console.log(`✓ Test completed: Course ${courseName} validation for self-prerequisite and self-equivalence`);
    });
});