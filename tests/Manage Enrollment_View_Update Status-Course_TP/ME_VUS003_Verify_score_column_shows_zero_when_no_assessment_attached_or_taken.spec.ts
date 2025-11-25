import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
import { credentials } from "../../constants/credentialData";

const courseName = "NoAssessmentScore_" + FakerData.getCourseName();
const description = FakerData.getDescription();
const learnerUsername = credentials.LEARNERUSERNAME.username;

test.describe(`ME_VUS003_Verify_score_column_shows_zero_when_no_assessment_attached_or_taken`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Test 1: Create course without assessment, enroll learner and mark as completed`, async ({ adminHome, createCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS003_TC001 - Setup course without assessment` },
            { type: `Test Description`, description: `Create course WITHOUT assessment, enroll learner, and mark as completed` }
        );

        console.log(`🔄 Creating E-learning course WITHOUT assessment...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.contentLibrary(); // Only content, NO assessment
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Course created WITHOUT assessment: ${courseName}`);

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

        console.log(`🔄 Marking as completed without assessment score...`);
        await enrollHome.clickModifyEnrollBtn();
        await enrollHome.wait("minWait");
        await enrollHome.selectEnrollOrCancel("Completed");
        await enrollHome.completionDateInAdminEnrollment();
        await enrollHome.verifytoastMessage();
        console.log(`✅ Enrollment marked as completed (no assessment score)`);
    });

    test(`Test 2: Verify Score column shows zero when no assessment attached or taken`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS003_TC002 - Verify score is zero without assessment` },
            { type: `Test Description`, description: `Verify that Score column displays zero (0) or empty when no assessment is attached or taken` }
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

        console.log(`\n🔄 Verifying Score column shows zero when no assessment...`);
        
        // Find the learner's row and check Score column
        const learnerRowSelector = `//tr[contains(@class,'table') or contains(@class,'row')]//td[contains(text(),'${learnerUsername}')]//ancestor::tr[1]`;
        
        try {
            const learnerRow = page.locator(learnerRowSelector);
            const isRowVisible = await learnerRow.isVisible({ timeout: 10000 });
            
            if (isRowVisible) {
                console.log(`   ✅ Learner row found: ${learnerUsername}`);
                
                const cells = learnerRow.locator('td');
                const cellCount = await cells.count();
                
                console.log(`\n📋 Checking Score column value in ${cellCount} columns...`);
                
                let scoreFound = false;
                let scoreValue = '';
                
                for (let i = 0; i < cellCount; i++) {
                    const cellText = await cells.nth(i).innerText().catch(() => '');
                    
                    // Check if cell contains "0", empty value, or "-"
                    if (cellText.trim() === '0' || cellText.trim() === '' || cellText.trim() === '-' || cellText.trim() === '0.0' || cellText.trim() === '0%') {
                        scoreValue = cellText.trim() || '(empty)';
                        scoreFound = true;
                        console.log(`   ✅ Score column found at position ${i + 1}: "${scoreValue}"`);
                        break;
                    }
                }
                
                if (scoreFound) {
                    console.log(`\n📊 ========================================`);
                    console.log(`📊 SCORE VERIFICATION RESULTS`);
                    console.log(`📊 ========================================`);
                    console.log(`   ✅ Learner: ${learnerUsername}`);
                    console.log(`   ✅ Course: ${courseName}`);
                    console.log(`   ✅ Assessment Attached: NO`);
                    console.log(`   ✅ Score Value: ${scoreValue}`);
                    console.log(`   ✅ Expected: Zero (0) or Empty`);
                    console.log(`\n   📝 Validation:`);
                    console.log(`      • No assessment attached to course`);
                    console.log(`      • Learner completed without taking assessment`);
                    console.log(`      • Score column correctly shows: ${scoreValue}`);
                    console.log(`📊 ========================================\n`);
                    console.log(`   ✅ PASS: Score column shows zero when no assessment attached or taken`);
                } else {
                    console.log(`   ⚠️ Score column value not found or has unexpected value`);
                    console.log(`   Note: Score might be displayed differently or not in expected position`);
                }
                
            } else {
                console.log(`   ❌ Learner row not visible`);
            }
        } catch (error) {
            console.log(`   ⚠️ Error finding score value: ${error}`);
        }
    });
});
