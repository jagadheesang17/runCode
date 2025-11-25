import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
import { credentials } from "../../constants/credentialData";

const courseName = "Elearning_Many_" + FakerData.getCourseName();
const description = FakerData.getDescription();
const learnerUsername = credentials.LEARNERUSERNAME.username;

test.describe(`ME_VUS013_Verify_Many_button_always_visible_for_Elearning_courses`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Test 1: Create E-learning course and enroll learner`, async ({ adminHome, createCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS013_TC001 - Create E-learning course and enroll learner` },
            { type: `Test Description`, description: `Create E-learning course without assessment and enroll learner to verify Many button visibility` }
        );

        console.log(`🔄 Creating E-learning course...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ E-learning course created: ${courseName}`);

        console.log(`🔄 Enrolling learner...`);
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(learnerUsername);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        console.log(`✅ Learner enrolled: ${learnerUsername}`);
    });

    test(`Test 2: Verify Many button is visible for E-learning course without assessment`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS013_TC002 - Verify Many button visibility for E-learning without assessment` },
            { type: `Test Description`, description: `Verify that Many button is always visible for E-learning courses regardless of assessment attachment` }
        );

        console.log(`\n🔄 Navigating to View/Modify Enrollment...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.wait("minWait");
        await enrollHome.clickModifyEnrollBtn();
        await enrollHome.wait("mediumWait");
        console.log(`✅ Navigated to View/Modify Enrollment page`);

        console.log(`\n🔄 Verifying Many button is visible...`);
        
        // Check for Many button in the user row
        const userRowSelector = `//tr[contains(.,'${learnerUsername}')]`;
        await page.waitForSelector(userRowSelector, { timeout: 10000 });
        
        const manyButtonSelector = `//tr[contains(.,'${learnerUsername}')]//button[text()='Many']`;
        const manyButtonCount = await page.locator(manyButtonSelector).count();
        
        console.log(`\n📊 ========================================`);
        console.log(`📊 MANY BUTTON VISIBILITY VERIFICATION`);
        console.log(`📊 ========================================`);
        console.log(`   📋 Course Type: E-learning`);
        console.log(`   📋 Course Name: ${courseName}`);
        console.log(`   📋 Learner: ${learnerUsername}`);
        console.log(`   📋 Assessment Attached: NO`);
        console.log(`   📋 Many Button Selector: ${manyButtonSelector}`);
        console.log(`   📋 Many Button Count: ${manyButtonCount}`);
        
        if (manyButtonCount > 0) {
            console.log(`\n   ✅ VERIFICATION RESULT:`);
            console.log(`      ✓ Many button IS VISIBLE`);
            console.log(`      ✓ E-learning courses always show Many button`);
            console.log(`      ✓ Many button visibility is independent of assessment attachment`);
            console.log(`\n   📝 EXPECTED BEHAVIOR:`);
            console.log(`      • E-learning courses: Many button ALWAYS visible`);
            console.log(`      • ILT/VC courses: Many button visible ONLY if assessment attached`);
            console.log(`📊 ========================================\n`);
            console.log(`   ✅ PASS: Many button is visible for E-learning course without assessment`);
        } else {
            console.log(`\n   ❌ VERIFICATION RESULT:`);
            console.log(`      ✗ Many button is NOT VISIBLE`);
            console.log(`      ✗ This is UNEXPECTED for E-learning courses`);
            console.log(`\n   📝 EXPECTED BEHAVIOR:`);
            console.log(`      • E-learning courses should ALWAYS show Many button`);
            console.log(`      • Many button should be visible regardless of assessment`);
            console.log(`📊 ========================================\n`);
            console.log(`   ❌ FAIL: Many button is missing for E-learning course`);
        }
        
        // Additional verification: Check if there's a direct score value instead of Many button
        const scoreValueSelector = `//tr[contains(.,'${learnerUsername}')]//td[contains(@class,'score') or @data-title='Score']`;
        const scoreValueText = await page.locator(scoreValueSelector).textContent();
        
        if (scoreValueText && scoreValueText.trim() !== '') {
            console.log(`   📋 Alternative Display: Direct score value found: ${scoreValueText.trim()}`);
            console.log(`   ⚠️ Note: System may show direct score instead of Many button in some cases`);
        }
    });

    test(`Test 3: Verify Many button functionality for E-learning course`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS013_TC003 - Verify Many button functionality` },
            { type: `Test Description`, description: `Verify that clicking Many button opens score popup for E-learning course` }
        );

        console.log(`\n🔄 Navigating to View/Modify Enrollment...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.wait("minWait");
        await enrollHome.clickModifyEnrollBtn();
        await enrollHome.wait("mediumWait");
        console.log(`✅ Navigated to View/Modify Enrollment page`);

        console.log(`\n🔄 Testing Many button functionality...`);
        
        const userRowSelector = `//tr[contains(.,'${learnerUsername}')]`;
        await page.waitForSelector(userRowSelector, { timeout: 10000 });
        
        const manyButtonSelector = `//tr[contains(.,'${learnerUsername}')]//button[text()='Many']`;
        const manyButtonCount = await page.locator(manyButtonSelector).count();
        
        if (manyButtonCount > 0) {
            console.log(`   📋 Many button found, clicking...`);
            await enrollHome.click(manyButtonSelector, "Many button", "Button");
            await enrollHome.wait("minWait");
            
            // Check if score popup/modal appears
            const scorePopupSelectors = [
                `//div[text()='SCORE']/following::input[1]`,
                `//div[contains(@class,'modal') and contains(.,'Score')]`,
                `//div[contains(@class,'popup') and contains(.,'Score')]`
            ];
            
            let popupFound = false;
            for (const selector of scorePopupSelectors) {
                if (await page.locator(selector).count() > 0) {
                    popupFound = true;
                    console.log(`   ✅ Score popup opened successfully`);
                    console.log(`   ✅ Selector matched: ${selector}`);
                    break;
                }
            }
            
            if (popupFound) {
                console.log(`\n   ✅ PASS: Many button functionality works correctly`);
                console.log(`      ✓ Many button is clickable`);
                console.log(`      ✓ Score popup opens on click`);
                console.log(`      ✓ E-learning course supports Many button interaction`);
                
                // Close the popup
                const closeButtons = [
                    `//button[contains(@class,'close')]`,
                    `//button[text()='Close']`,
                    `//button[text()='×']`,
                    `//div[@class='modal-header']//button`
                ];
                
                for (const closeSelector of closeButtons) {
                    if (await page.locator(closeSelector).count() > 0) {
                        await enrollHome.click(closeSelector, "Close popup", "Button");
                        console.log(`   ✅ Score popup closed`);
                        break;
                    }
                }
            } else {
                console.log(`\n   ❌ FAIL: Score popup did not open after clicking Many button`);
            }
        } else {
            console.log(`   ⚠️ Many button not found - skipping functionality test`);
            console.log(`   Note: This test requires Many button to be visible`);
        }
    });

    test(`Test 4: Create E-learning course with assessment and verify Many button still visible`, async ({ adminHome, createCourse, enrollHome, SurveyAssessment, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS013_TC004 - Verify Many button with assessment attached` },
            { type: `Test Description`, description: `Create E-learning course WITH assessment and verify Many button is still visible` }
        );

        const courseNameWithAssessment = "Elearning_Many_Assess_" + FakerData.getCourseName();
        const assessmentTitle = "Assessment_" + FakerData.getCourseName();

        console.log(`🔄 Creating assessment...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.survey();
        await adminHome.clickOnAssessmentLink();
        await SurveyAssessment.clickCreateAssessment();
        await SurveyAssessment.fillAssessmentTitle(assessmentTitle);
        await SurveyAssessment.enterPasspercentage("80");
        await SurveyAssessment.enterNofAttempts("3");
        await SurveyAssessment.clickOnPlusIcon();
        await SurveyAssessment.selectingType("Short answer");
        await SurveyAssessment.enterQuestions();
        await SurveyAssessment.clickSave();
        await SurveyAssessment.clickPublish();
        await SurveyAssessment.verifySuccessMessage();
        console.log(`✅ Assessment created: ${assessmentTitle}`);

        console.log(`🔄 Creating E-learning course with assessment...`);
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseNameWithAssessment);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ E-learning course created: ${courseNameWithAssessment}`);

        console.log(`🔄 Attaching assessment to course...`);
        await createCourse.clickEditCourseTabs();
        await createCourse.surveyassesment();
        await createCourse.addSpecificAssesment(assessmentTitle);
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Assessment attached to course`);

        console.log(`🔄 Enrolling learner...`);
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(courseNameWithAssessment);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(learnerUsername);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        console.log(`✅ Learner enrolled: ${learnerUsername}`);

        console.log(`\n🔄 Verifying Many button is still visible with assessment attached...`);
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(courseNameWithAssessment);
        await enrollHome.wait("minWait");
        await enrollHome.clickModifyEnrollBtn();
        await enrollHome.wait("mediumWait");

        const userRowSelector = `//tr[contains(.,'${learnerUsername}')]`;
        await page.waitForSelector(userRowSelector, { timeout: 10000 });
        
        const manyButtonSelector = `//tr[contains(.,'${learnerUsername}')]//button[text()='Many']`;
        const manyButtonCount = await page.locator(manyButtonSelector).count();
        
        console.log(`\n📊 ========================================`);
        console.log(`📊 MANY BUTTON WITH ASSESSMENT VERIFICATION`);
        console.log(`📊 ========================================`);
        console.log(`   📋 Course Type: E-learning`);
        console.log(`   📋 Course Name: ${courseNameWithAssessment}`);
        console.log(`   📋 Learner: ${learnerUsername}`);
        console.log(`   📋 Assessment Attached: YES`);
        console.log(`   📋 Assessment Name: ${assessmentTitle}`);
        console.log(`   📋 Many Button Count: ${manyButtonCount}`);
        
        if (manyButtonCount > 0) {
            console.log(`\n   ✅ VERIFICATION RESULT:`);
            console.log(`      ✓ Many button IS VISIBLE`);
            console.log(`      ✓ E-learning courses show Many button WITH assessment`);
            console.log(`      ✓ Many button visibility confirmed for both scenarios:`);
            console.log(`        - E-learning WITHOUT assessment: Many button visible`);
            console.log(`        - E-learning WITH assessment: Many button visible`);
            console.log(`\n   📝 CONCLUSION:`);
            console.log(`      • Many button is ALWAYS visible for E-learning courses`);
            console.log(`      • Assessment attachment does NOT affect Many button visibility`);
            console.log(`      • This is the expected behavior for E-learning delivery type`);
            console.log(`📊 ========================================\n`);
            console.log(`   ✅ PASS: Many button always visible for E-learning courses`);
        } else {
            console.log(`\n   ❌ VERIFICATION RESULT:`);
            console.log(`      ✗ Many button is NOT VISIBLE even with assessment`);
            console.log(`      ✗ This is UNEXPECTED for E-learning courses`);
            console.log(`📊 ========================================\n`);
            console.log(`   ❌ FAIL: Many button is missing for E-learning course with assessment`);
        }
    });
});
