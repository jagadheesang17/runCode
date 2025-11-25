import { test } from "../../../customFixtures/expertusFixture";
import { credentials } from "../../../constants/credentialData";
import { FakerData } from "../../../utils/fakerUtils";

const iltCourseName = "ILT Course " + FakerData.getCourseName();
const sessionName = FakerData.getSession();
const description = FakerData.getDescription();
const instructorName = credentials.INSTRUCTORNAME.username;

test.describe(`Verify that prerequisite and equivalence tabs do not appear for instance-based courses`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Create ILT course with classroom instance`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `AI Assistant` },
            { type: `TestCase`, description: `Create ILT course with classroom instance for prerequisite/equivalence validation` },
            { type: `Test Description`, description: `Create an ILT course with classroom delivery type and add instance to test prerequisite/equivalence tab visibility` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        
        // Create ILT course
        await createCourse.enter("course-title", iltCourseName);
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
        
        // Add classroom instance
        await createCourse.clickEditCourseTabs();
        await createCourse.addInstances();
        
        async function addinstance(deliveryType: string) {
            await createCourse.selectInstanceDeliveryType(deliveryType);
            await createCourse.clickCreateInstance();
        }
        
        await addinstance("Classroom");
        await createCourse.enterSessionName(sessionName);
        await createCourse.enterfutureDateValue(); // Future date for active instance
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.setMaxSeat();
        await createCourse.typeDescription("ILT classroom instance for prerequisite/equivalence validation");
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        
        console.log(`✓ ILT course with classroom instance created successfully: ${iltCourseName}`);
    });

    test(`Verify prerequisite and equivalence tabs do not appear for instance-based course`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `AI Assistant` },
            { type: `TestCase`, description: `Verify prerequisite/equivalence tabs not available for instances` },
            { type: `Test Description`, description: `Verify that prerequisite and equivalence tabs/options do not appear when editing an instance-based (ILT/classroom) course` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        
        // Search and edit the created ILT course
        await createCourse.catalogSearch(iltCourseName);
        await createCourse.clickEditIcon();
        
        // Check if Prerequisite tab/button is visible
        const prerequisiteTabExists = await createCourse.page.locator(
            createCourse.selectors.courseOption("Prerequisite")
        ).isVisible({ timeout: 5000 });
        
        if (prerequisiteTabExists) {
            console.log("❌ BUG DETECTED: Prerequisite tab appears for instance-based course - This should NOT be available!");
            throw new Error("CRITICAL BUG: Prerequisite tab is visible for instance-based (ILT/Classroom) course. Instance-based courses should not have prerequisite functionality.");
        } else {
            console.log("✓ PASS: Prerequisite tab correctly hidden for instance-based course (Expected behavior)");
        }
        
        // Check if Equivalence tab/button is visible
        const equivalenceTabExists = await createCourse.page.locator(
            createCourse.selectors.courseOption("Equivalence")
        ).isVisible({ timeout: 5000 });
        
        if (equivalenceTabExists) {
            console.log("❌ BUG DETECTED: Equivalence tab appears for instance-based course - This should NOT be available!");
            throw new Error("CRITICAL BUG: Equivalence tab is visible for instance-based (ILT/Classroom) course. Instance-based courses should not have equivalence functionality.");
        } else {
            console.log("✓ PASS: Equivalence tab correctly hidden for instance-based course (Expected behavior)");
        }
        
        // Verify that other standard tabs/options are still available
        const detailTabExists = await createCourse.page.locator(
            "//button[text()='Detail' or text()='Details']"
        ).isVisible({ timeout: 5000 });
        
        const instanceTabExists = await createCourse.page.locator(
            "//div[text()='Instance  / Class' or contains(text(), 'Instance')]"
        ).isVisible({ timeout: 5000 });
        
        if (detailTabExists || instanceTabExists) {
            console.log("✓ PASS: Standard course editing options are available (Detail/Instance tabs visible)");
        } else {
            console.log("⚠ WARNING: Could not locate standard course editing tabs - may need to verify UI structure");
        }
        
        // Additional verification: Check if any prerequisite/equivalence related elements exist
        const anyPrerequisiteElements = await createCourse.page.locator(
            "//button[contains(text(), 'Prerequisite') or contains(text(), 'prerequisite')]"
        ).count();
        
        const anyEquivalenceElements = await createCourse.page.locator(
            "//button[contains(text(), 'Equivalence') or contains(text(), 'equivalence')]"
        ).count();
        
        if (anyPrerequisiteElements > 0) {
            console.log(`❌ BUG: Found ${anyPrerequisiteElements} prerequisite-related elements in instance-based course`);
            throw new Error(`Found ${anyPrerequisiteElements} prerequisite-related elements that should not be present in instance-based courses`);
        }
        
        if (anyEquivalenceElements > 0) {
            console.log(`❌ BUG: Found ${anyEquivalenceElements} equivalence-related elements in instance-based course`);
            throw new Error(`Found ${anyEquivalenceElements} equivalence-related elements that should not be present in instance-based courses`);
        }
        
        console.log("✓ COMPREHENSIVE PASS: No prerequisite or equivalence functionality detected for instance-based course");
        console.log(`✓ Test completed successfully: ${iltCourseName} correctly configured without prerequisite/equivalence options`);
    });
});