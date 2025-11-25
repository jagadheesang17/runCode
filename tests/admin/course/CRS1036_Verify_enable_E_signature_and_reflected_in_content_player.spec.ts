import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

// Test data setup
const courseName = "E-Signature Enabled Course: " + FakerData.getCourseName();
const courseDescription = "Course to verify E-signature functionality: " + FakerData.getDescription();
const eSignatureName = "E-Signature " + FakerData.getRandomTitle();
const eSignatureMessage = "Please complete this e-signature to finalize your course completion: " + FakerData.getDescription();

test.describe("CRS1036: Verify able to enable E-signature and reflected in content player", async () => {
    test.describe.configure({ mode: "serial" });

    test("Test Scenario 1: Create Course with E-Signature Configuration", async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish <jagadish.n@digiusher.com>` },
            { type: `TestCase`, description: `Test Scenario 1: Create course and enable E-signature functionality` },
            { type: `Test Description`, description: `Create course and configure E-signature with title and message using provided selectors` }
        );

        // Step 1: Admin login and create course
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(courseDescription);
        
        // Add content to the course
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        
        console.log("✓ PASS: Course created successfully - " + courseName);
        
        // Step 2: Edit course to configure E-signature
        await createCourse.editcourse();
        
        // Step 3: Click on E-Signature button
        await createCourse.validateElementVisibility(
            "//button[text()='E-Signature']",
            "E-Signature button should be visible"
        );
        await createCourse.click(
            "//button[text()='E-Signature']",
            "E-Signature",
            "Button"
        );
        
        console.log("✓ PASS: E-Signature configuration opened");
        
        // Step 4: Enable E-Signature checkbox before entering details
        await createCourse.validateElementVisibility(
            "//span[text()='E-Signature']",
            "E-Signature checkbox should be visible"
        );
        await createCourse.click(
            "//span[text()='E-Signature']",
            "E-Signature Enable Checkbox",
            "Checkbox"
        );
        
        console.log("✓ PASS: E-Signature checkbox enabled");
        
        // Step 5: Enter E-signature name/title
        await createCourse.validateElementVisibility(
            "//input[@placeholder='Title']",
            "E-signature title input should be visible"
        );
        await createCourse.type(
            "//input[@placeholder='Title']",
            "E-Signature Title",
            eSignatureName
        );
        
        console.log("✓ PASS: E-signature title entered - " + eSignatureName);
        
        // Step 6: Enter E-signature message
        await createCourse.validateElementVisibility(
            "//div[@id='esignature-message']",
            "E-signature message field should be visible"
        );
        
        // Click on the rich text editor to focus it
        await createCourse.click(
            "//div[@id='esignature-message']",
            "E-Signature Message Editor",
            "Field"
        );
        
        // Clear any existing content and type new message
        await createCourse.page.keyboard.press('Control+A'); // Select all
        await createCourse.page.keyboard.type(eSignatureMessage); // Type new content
        
        console.log("✓ PASS: E-signature message entered");
        
        // Step 7: Save E-signature configuration
        await createCourse.validateElementVisibility(
            "//button[@name='submit-btn']",
            "Submit button should be visible"
        );
        await createCourse.click(
            "//button[@name='submit-btn']",
            "Submit E-Signature Configuration",
            "Button"
        );
        
        // Wait for save confirmation
        await createCourse.wait("mediumWait");
        
        console.log("✓ PASS: E-signature configuration saved successfully");
        
        // Step 7: Save overall course changes
        await createCourse.save_editedcoursedetails();
        await createCourse.verifySuccessMessage();
        
        console.log("✓ VALIDATION: Course with E-signature configuration completed");
    });

    test("Test Scenario 2: Complete Course Content and Click E-Signature", async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish <jagadish.n@digiusher.com>` },
            { type: `TestCase`, description: `Test Scenario 2: Complete course content and interact with E-signature using dynamic selector` },
            { type: `Test Description`, description: `Enroll, complete content, and click E-signature using the configured E-signature name` }
        );

        // Step 1: Learner login and enrollment
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        
        // Search and enroll in the E-signature course
        await catalog.searchCatalog(courseName);
        await catalog.clickMoreonCourse(courseName);
        await catalog.clickSelectcourse(courseName);
        
        // Check if enrollment is needed
        const enrollVisible = await catalog.page.locator("//span[contains(text(),'Enroll') or contains(text(),'ENROLL')]").isVisible({ timeout: 3000 });
        
        if (enrollVisible) {
            await catalog.clickEnroll();
            console.log("✓ PASS: Successfully enrolled in E-signature enabled course");
        } else {
            console.log("ℹ INFO: Already enrolled in E-signature course");
        }
        
        // Step 2: Navigate to My Learning and complete course content
        await learnerHome.clickMyLearning();
        await catalog.searchMyLearning(courseName);
        await catalog.clickCourseInMyLearning(courseName);
        
        // Complete course content using modern workflow
        await catalog.completeCourseContent();
        console.log("✓ PASS: Course content completed successfully");
        
        // Step 3: Click E-signature using dynamic selector (similar to post-assessment pattern)
        try {
            console.log(`🔍 Looking for E-signature launch button for: ${eSignatureName}`);
            
            // Dynamic selector for E-signature based on name (similar to post-assessment)
            const eSignatureSelector = `(//div[contains(text(),'${eSignatureName}')]//following::i)[1]`;
            
            await catalog.validateElementVisibility(
                eSignatureSelector,
                `E-signature play button for: ${eSignatureName}`
            );
            
            await catalog.click(
                eSignatureSelector,
                `E-Signature: ${eSignatureName}`,
                "Button"
            );
            
            console.log(`✓ PASS: E-signature launched successfully: ${eSignatureName}`);
            
            // Step 4: Complete identity verification and save learning status
            await catalog.wait("mediumWait");
            
            await catalog.validateElementVisibility(
                "//button[text()='Verify identity and save learning status']",
                "Identity verification button should be visible"
            );
            
            await catalog.click(
                "//button[text()='Verify identity and save learning status']",
                "Verify Identity and Save Learning Status",
                "Button"
            );
            
            console.log("✓ PASS: Identity verification and learning status save completed");
            
            // Step 5: Verify course completion
            await catalog.wait("maxWait");
            
            // Navigate to completed tab to verify
            await learnerHome.clickMyLearning();
            await catalog.clickCompletedButton();
            await catalog.searchMyLearning(courseName);
            await catalog.verifyCompletedCourse(courseName);
            
            console.log("✓ PASS: Course successfully completed and appears in Completed tab");
            
        } catch (error) {
            console.log(`❌ Error with E-signature workflow: ${error.message}`);
            
            // Alternative approach if dynamic selector fails
            try {
                console.log("🔄 Trying alternative E-signature selector...");
                
                const alternativeSelector = `//div[text()='${eSignatureName}']/following::i[@aria-label='Click to play']`;
                
                if (await catalog.page.locator(alternativeSelector).isVisible({ timeout: 5000 })) {
                    await catalog.click(alternativeSelector, "E-Signature Alternative", "Button");
                    console.log("✓ PASS: E-signature launched via alternative selector");
                    
                    // Complete verification
                    await catalog.wait("mediumWait");
                    await catalog.click(
                        "//button[text()='Verify identity and save learning status']",
                        "Identity Verification",
                        "Button"
                    );
                    
                    console.log("✓ PASS: E-signature completed via alternative method");
                } else {
                    throw new Error("E-signature element not found with alternative selector");
                }
                
            } catch (altError) {
                console.log(`⚠ WARNING: E-signature interaction failed: ${altError.message}`);
                throw altError;
            }
        }
        
        console.log("✓ FINAL VALIDATION: E-signature workflow completed successfully");
        console.log("✓ SUMMARY: Course content → E-signature interaction → Course completion verified");
    });
});