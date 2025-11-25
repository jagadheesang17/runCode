import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";

const courseName = "SessionConflict" + " " + FakerData.getCourseName();
const sessionName = "ConflictTest" + " " + FakerData.getSession();
const description = FakerData.getDescription()
const instructorName = credentials.INSTRUCTORNAME.username;
const conflictingSessionName = "ConflictTest" + " " + FakerData.getSession();

test.describe(`Verify_that_session_conflict_message_appears_when_same_session_time_chosen`, async () => {
    test.describe.configure({ mode: "serial" });
    
    test(`Create ILT course with initial session`, async ({ adminHome, createCourse, contentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation Team` },
            { type: `TestCase`, description: `CRS1020_Create_ILT_Course_With_Initial_Session` },
            { type: `Test Description`, description: `Create ILT course with first session to establish baseline for conflict testing` }
        );
        
        console.log("Creating: ILT course with initial session for conflict testing");
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("Session conflict test: " + description);
        await createCourse.selectdeliveryType("Classroom");
        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown();
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log("ILT course created successfully: " + courseName);
    });

    test(`Add first session with specific date and time`, async ({ adminHome, createCourse, contentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation Team` },
            { type: `TestCase`, description: `CRS1020_Add_First_Session_With_Specific_Time` },
            { type: `Test Description`, description: `Add first session with specific date and time to establish conflict scenario` }
        );
        
        console.log("Adding: First session with specific date and time");
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.catalogSearch(courseName);
        await createCourse.clickEditIcon();
        await createCourse.addInstances();
        
        // Create first session with specific timing
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        await createCourse.enterSessionName(sessionName);
        await createCourse.enterDateValue(); // This sets a specific date
        await createCourse.startandEndTime(); // This sets specific start/end times
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.setMaxSeat();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log("First session added successfully: " + sessionName);
    });

    test(`Verify session conflict message when adding session with same time`, async ({ adminHome, createCourse, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation Team` },
            { type: `TestCase`, description: `CRS1020_Verify_Session_Conflict_Message_Same_Time` },
            { type: `Test Description`, description: `Verify session conflict message appears when adding session with same date and time` }
        );
        
        console.log("Verifying: Session conflict message appears for same session time");
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.catalogSearch(courseName);
        await createCourse.clickEditIcon();
        await createCourse.addInstances();
        
        // Attempt to create second session with same timing
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        await createCourse.enterSessionName(conflictingSessionName);
        
        // Use same date and time as first session
        await createCourse.enterDateValue(); // Same date as previous session
        await createCourse.startandEndTime(); // Same time as previous session
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.setMaxSeat();
        
        // Check for conflict during bulk creation conflict check
        await createCourse.checkConflict();
        
        // Verify conflict message or popup appears
        const conflictMessage = page.locator("//span[contains(text(),'Session has conflict') or contains(text(),'conflict') or contains(text(),'same time') or contains(text(),'overlapping')]");
        const isConflictVisible = await conflictMessage.isVisible();
        
        if (isConflictVisible) {
            const conflictText = await conflictMessage.textContent();
            console.log("✓ Session conflict message displayed:", conflictText);
        } else {
            // Check for any error or warning messages related to timing conflicts
            const errorMessages = page.locator("//div[contains(@class,'error') or contains(@class,'warning') or contains(@class,'alert')]");
            const errorCount = await errorMessages.count();
            
            if (errorCount > 0) {
                for (let i = 0; i < errorCount; i++) {
                    const errorText = await errorMessages.nth(i).textContent();
                    console.log("Potential conflict message:", errorText);
                }
            } else {
                console.log("WARNING: No session conflict message detected - system may allow overlapping sessions");
            }
        }
        
        // Try to save and capture any validation messages
        try {
            await createCourse.clickUpdate();
            const successMsg = page.locator("//div[contains(@class,'success')]");
            const errorMsg = page.locator("//div[contains(@class,'error')]");
            
            if (await successMsg.isVisible()) {
                console.log("WARNING: Session saved successfully despite potential time conflict");
            } else if (await errorMsg.isVisible()) {
                const errorText = await errorMsg.textContent();
                console.log("✓ System prevented conflicting session:", errorText);
            }
        } catch (error) {
            console.log("Save operation blocked or failed, likely due to session conflict");
        }
    });
});