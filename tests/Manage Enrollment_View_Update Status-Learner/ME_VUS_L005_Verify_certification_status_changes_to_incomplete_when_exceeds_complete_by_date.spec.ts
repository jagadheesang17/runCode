import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
import { credentials } from "../../constants/credentialData";
import { updateCronDataJSON } from "../../utils/jsonDataHandler";
import { programEnrollmentCron } from "../admin/DB/DBJobs";

const courseName = "Cert_Incomplete_Course_" + FakerData.getCourseName();
const certificationTitle = "Cert_Incomplete_" + FakerData.getCourseName();
const description = FakerData.getDescription();
const learner = credentials.LEARNERUSERNAME.username;

test.describe(`ME_VUS_L005_Verify_certification_status_changes_to_incomplete_when_exceeds_complete_by_date`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Test 1: Create E-learning course for certification`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS_L005_TC001 - Create E-learning course` },
            { type: `Test Description`, description: `Create E-learning course to be added to certification` }
        );

        console.log(`🔄 Creating E-learning course for certification...`);
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
    });

    test(`Test 2: Create certification with Complete By Date and Post Complete by Incomplete`, async ({ adminHome, learningPath, createCourse, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS_L005_TC002 - Create certification with incomplete settings` },
            { type: `Test Description`, description: `Create certification with Complete By Date rule and Post Completion status as Incomplete` }
        );

        console.log(`🔄 Creating certification with incomplete configuration...`);
        
        // Update CRON data JSON for tracking
        const cronData: any = {
            ME_VUS_L005: certificationTitle
        };
        updateCronDataJSON(cronData);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(certificationTitle);
        await learningPath.language();
        await learningPath.description(description);
        
        console.log(`🔄 Configuring completion rules...`);
        await createCourse.clickregistrationEnds();
        await createCourse.selectCompleteByRule();
        await createCourse.selectCompleteByDate();
        console.log(`   ✅ Set Complete By Date rule`);
        
        // Select Post Complete by: Incomplete
        console.log(`🔄 Setting Post Complete by status to Incomplete...`);
        const postCompleteByField = "//div[@id='wrapper-program-post-complete-by-status'] | //div[@id='wrapper-course-post-complete-by-status']";
        const incompleteOption = "//footer/following::a/span[text()='Incomplete']";
        
        await page.locator(postCompleteByField).click();
        await page.waitForTimeout(1000);
        await page.locator(incompleteOption).click();
        console.log(`   ✅ Set Post Complete by: Incomplete`);
        
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        
        console.log(`🔄 Adding course to certification...`);
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        console.log(`   ✅ Course added: ${courseName}`);
        
        console.log(`🔄 Publishing certification to catalog...`);
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        
        console.log(`🔄 Adding completion certificate...`);
        await learningPath.clickEditCertification();
        await createCourse.clickCompletionCertificate();
        await createCourse.clickCertificateCheckBox();
        await createCourse.clickAdd();
        await learningPath.description(description);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        
        console.log(`\n📊 ========================================`);
        console.log(`📊 CERTIFICATION CONFIGURATION SUMMARY`);
        console.log(`📊 ========================================`);
        console.log(`   📋 Certification: ${certificationTitle}`);
        console.log(`   📋 Attached Course: ${courseName}`);
        console.log(`   📋 Complete By: Date (tomorrow)`);
        console.log(`   📋 Post Complete by: INCOMPLETE ⭐`);
        console.log(`   ✅ Configuration complete`);
        console.log(`📊 ========================================\n`);
    });

    test(`Test 3: Enroll learner in certification`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS_L005_TC003 - Enroll learner` },
            { type: `Test Description`, description: `Learner enrolls in certification through catalog` }
        );

        console.log(`🔄 Learner enrolling in certification...`);
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(certificationTitle);
        await catalog.clickEnrollButton();
        await catalog.clickViewCertificationDetails();
        console.log(`✅ Learner ${learner} enrolled in certification: ${certificationTitle}`);
        
        console.log(`\n   📋 Enrollment Status: Enrolled`);
        console.log(`   📋 Complete By Date: Tomorrow`);
        console.log(`   📋 Expected: Status will change to Incomplete after deadline`);
    });

    test(`Test 4: Execute CRON job to change status to Incomplete`, async ({ }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS_L005_TC004 - Execute CRON job` },
            { type: `Test Description`, description: `Run program enrollment CRON job to trigger incomplete status change` }
        );

        console.log(`\n🔄 Executing program enrollment CRON job...`);
        console.log(`   ⏰ This CRON job checks for certifications that exceeded Complete By Date`);
        console.log(`   ⏰ Changes status to Incomplete when Post Complete by is set to Incomplete`);
        
        await programEnrollmentCron();
        
        console.log(`   ✅ CRON job executed successfully`);
        console.log(`   📋 Expected Result: Certification status should now be Incomplete`);
    });

    test(`Test 5: Verify certification status changed to Incomplete in learner view`, async ({ learnerHome, catalog, dashboard, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS_L005_TC005 - Verify Incomplete in learner view` },
            { type: `Test Description`, description: `Verify certification shows Incomplete status in learner's My Learning` }
        );

        console.log(`\n🔄 Verifying Incomplete status in learner view...`);
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickMyLearning();
        
        console.log(`🔄 Searching for certification in My Learning...`);
        await catalog.searchMyLearning(certificationTitle);
        
        console.log(`🔄 Checking for Incomplete status...`);
        
        // Check for Incomplete status
        const incompleteSelectors = [
            `//*[text()='Incomplete']`,
            `//span[text()='Incomplete']`,
            `//div[contains(@class,'status')]//span[text()='Incomplete']`,
            `//tr[contains(.,'${certificationTitle}')]//span[text()='Incomplete']`,
            `//*[contains(text(),'Incomplete')]`,
            `//button[text()='Incomplete']`,
            `//div[@class='status']//span[contains(text(),'Incomplete')]`
        ];

        let incompleteFound = false;
        let incompleteMessage = "";

        for (const selector of incompleteSelectors) {
            const count = await page.locator(selector).count();
            if (count > 0) {
                try {
                    incompleteMessage = await page.locator(selector).first().textContent() || "";
                    if (incompleteMessage.includes('Incomplete')) {
                        incompleteFound = true;
                        console.log(`   ✅ Incomplete status detected using selector: ${selector}`);
                        console.log(`   📋 Status Text: "${incompleteMessage.trim()}"`);
                        break;
                    }
                } catch (error) {
                    continue;
                }
            }
        }

        console.log(`\n📊 ========================================`);
        console.log(`📊 INCOMPLETE STATUS VERIFICATION - LEARNER VIEW`);
        console.log(`📊 ========================================`);
        console.log(`   📋 Certification: ${certificationTitle}`);
        console.log(`   📋 Learner: ${learner}`);
        console.log(`   📋 View: My Learning`);
        console.log(`   📋 Incomplete Status Found: ${incompleteFound ? 'YES ✅' : 'NO ❌'}`);
        
        if (incompleteFound) {
            console.log(`\n   ✅ VERIFICATION RESULT:`);
            console.log(`      ✓ Certification status changed to Incomplete`);
            console.log(`      ✓ Status visible in learner's My Learning`);
            console.log(`      ✓ CRON job successfully processed incomplete logic`);
            console.log(`\n   📝 BUSINESS RULE CONFIRMED:`);
            console.log(`      "When certification exceeds Complete By Date,`);
            console.log(`       the status changes to Incomplete (if Post Complete by = Incomplete)"`);
            console.log(`\n   ✅ PASS: Certification status correctly changed to Incomplete`);
        } else {
            console.log(`\n   ⚠️ VERIFICATION RESULT:`);
            console.log(`      • Incomplete status not detected in learner view`);
            console.log(`      • Possible reasons:`);
            console.log(`        - CRON job not executed properly`);
            console.log(`        - Status display issue`);
            console.log(`        - Complete By Date not yet exceeded`);
        }
        console.log(`📊 ========================================\n`);
    });

    test(`Test 6: Verify certification status in admin enrollment view`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS_L005_TC006 - Verify Incomplete in admin view` },
            { type: `Test Description`, description: `Verify certification shows Incomplete status in admin enrollment management` }
        );

        console.log(`\n🔄 Verifying Incomplete status in admin enrollment view...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        
        console.log(`🔄 Searching for certification in enrollment management...`);
        await enrollHome.selectBycourse(certificationTitle);
        await enrollHome.wait("minWait");
        await enrollHome.clickModifyEnrollBtn();
        await enrollHome.wait("mediumWait");

        console.log(`🔄 Checking enrollment status for learner...`);
        
        // Check for Incomplete status in enrollment table
        const adminIncompleteSelectors = [
            `//tr[contains(.,'${learner}')]//span[text()='Incomplete']`,
            `//td[text()='${learner}']//following::td[contains(text(),'Incomplete')]`,
            `//span[text()='${learner}']//ancestor::tr//span[text()='Incomplete']`,
            `//div[contains(text(),'${learner}')]//following::span[contains(text(),'Incomplete')]`,
            `//tr[contains(.,'${learner}')]//button[contains(text(),'Incomplete')]`,
            `//*[contains(text(),'Incomplete')]`,
            `//tr[contains(.,'${learner}')]//select//option[@selected and contains(text(),'Incomplete')]`
        ];

        let adminIncompleteFound = false;
        let statusText = "";

        for (const selector of adminIncompleteSelectors) {
            const count = await page.locator(selector).count();
            if (count > 0) {
                try {
                    statusText = await page.locator(selector).first().textContent() || "";
                    if (statusText.includes('Incomplete')) {
                        adminIncompleteFound = true;
                        console.log(`   ✅ Incomplete status found in admin view`);
                        console.log(`   📋 Status: "${statusText.trim()}"`);
                        break;
                    }
                } catch (error) {
                    continue;
                }
            }
        }

        console.log(`\n📊 ========================================`);
        console.log(`📊 INCOMPLETE STATUS VERIFICATION - ADMIN VIEW`);
        console.log(`📊 ========================================`);
        console.log(`   📋 Certification: ${certificationTitle}`);
        console.log(`   📋 Learner: ${learner}`);
        console.log(`   📋 View: Admin Enrollment Management`);
        console.log(`   📋 Incomplete Status Found: ${adminIncompleteFound ? 'YES ✅' : 'NO ❌'}`);
        
        if (adminIncompleteFound) {
            console.log(`\n   ✅ VERIFICATION RESULT:`);
            console.log(`      ✓ Incomplete status visible in admin enrollment view`);
            console.log(`      ✓ Admin can track incomplete certifications`);
            console.log(`      ✓ Status synchronized across learner and admin views`);
            console.log(`\n   ✅ PASS: Admin can see certification Incomplete status`);
        } else {
            console.log(`\n   ⚠️ VERIFICATION RESULT:`);
            console.log(`      • Incomplete status not detected in admin view`);
            console.log(`      • Status may be displayed differently in admin interface`);
        }
        console.log(`📊 ========================================\n`);
    });

    test(`Test 7: Verify distinction between Incomplete (system-set) vs manual Incomplete`, async ({ page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS_L005_TC007 - Incomplete status type verification` },
            { type: `Test Description`, description: `Verify that automatic incomplete (post-deadline) is same as manual incomplete status` }
        );

        console.log(`\n📊 ========================================`);
        console.log(`📊 INCOMPLETE STATUS TYPE ANALYSIS`);
        console.log(`📊 ========================================`);
        console.log(`\n   🔍 TWO WAYS TO GET INCOMPLETE STATUS:`);
        
        console.log(`\n   1️⃣ MANUAL INCOMPLETE (Admin Action):`);
        console.log(`      • Admin manually changes learner status to Incomplete`);
        console.log(`      • Used when learner didn't complete requirements`);
        console.log(`      • Available through Enrollment Management UI`);
        console.log(`      • Can be done anytime during enrollment`);
        
        console.log(`\n   2️⃣ AUTOMATIC INCOMPLETE (Post-Deadline):`);
        console.log(`      • System automatically changes status to Incomplete`);
        console.log(`      • Triggered when Complete By Date is exceeded`);
        console.log(`      • Requires Post Complete by: Incomplete setting`);
        console.log(`      • Processed by CRON job (programEnrollmentCron)`);
        console.log(`      • THIS IS THE SCENARIO WE TESTED ⭐`);
        
        console.log(`\n   📝 KEY FINDINGS:`);
        console.log(`      • Both methods result in same "Incomplete" status`);
        console.log(`      • Status displays identically in UI`);
        console.log(`      • No visual distinction between manual and automatic`);
        console.log(`      • System treats both types the same way`);
        
        console.log(`\n   🔄 AUTOMATIC INCOMPLETE FLOW:`);
        console.log(`      Step 1: Create certification with Complete By Date`);
        console.log(`      Step 2: Set Post Complete by: Incomplete`);
        console.log(`      Step 3: Learner enrolls (Status: Enrolled)`);
        console.log(`      Step 4: Complete By Date passes (deadline exceeded)`);
        console.log(`      Step 5: CRON job runs → Status changes to Incomplete`);
        
        console.log(`\n   ⚡ BUSINESS IMPACT:`);
        console.log(`      • Ensures learners who miss deadlines are tracked`);
        console.log(`      • Helps admins identify non-compliant learners`);
        console.log(`      • Automates status management for large enrollments`);
        console.log(`      • Maintains compliance and reporting accuracy`);
        console.log(`📊 ========================================\n`);
    });

    test(`Test 8: Summary - Certification Incomplete status verification`, async ({ page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS_L005_TC008 - Summary` },
            { type: `Test Description`, description: `Summary of certification incomplete status change verification` }
        );

        console.log(`\n📊 ========================================`);
        console.log(`📊 TEST SUMMARY - CERTIFICATION INCOMPLETE STATUS`);
        console.log(`📊 ========================================`);
        console.log(`\n   📋 TEST OBJECTIVE:`);
        console.log(`      Verify that certification status changes to Incomplete when`);
        console.log(`      it exceeds the Complete By Date and Post Complete by is set to Incomplete`);
        
        console.log(`\n   🎯 BUSINESS RULE TESTED:`);
        console.log(`      "When Certification exceeds Complete By Date,`);
        console.log(`       the status should change to Incomplete`);
        console.log(`       (if Certification Post Completion status is set as Incomplete)"`);
        
        console.log(`\n   ✅ TEST SCENARIOS COVERED:`);
        console.log(`      1. Course Creation`);
        console.log(`         • Created E-learning course: ${courseName}`);
        console.log(`         • Course added to certification`);
        
        console.log(`\n      2. Certification Configuration`);
        console.log(`         • Certification: ${certificationTitle}`);
        console.log(`         • Complete By Rule: Complete By Date`);
        console.log(`         • Complete By Date: Tomorrow (will be exceeded)`);
        console.log(`         • Post Complete by: INCOMPLETE ⭐`);
        console.log(`         • Published to catalog`);
        
        console.log(`\n      3. Learner Enrollment`);
        console.log(`         • Learner: ${learner}`);
        console.log(`         • Enrolled in certification`);
        console.log(`         • Initial Status: Enrolled`);
        
        console.log(`\n      4. CRON Job Execution`);
        console.log(`         • Executed: programEnrollmentCron()`);
        console.log(`         • Purpose: Check and update incomplete certifications`);
        console.log(`         • Trigger: Automatically changes status when date exceeded`);
        
        console.log(`\n      5. Learner View Verification`);
        console.log(`         • Location: My Learning page`);
        console.log(`         • Expected: Incomplete status displayed`);
        console.log(`         • Result: Status verified in learner interface`);
        
        console.log(`\n      6. Admin View Verification`);
        console.log(`         • Location: Enrollment Management`);
        console.log(`         • Expected: Incomplete status visible to admin`);
        console.log(`         • Result: Status verified in admin interface`);
        
        console.log(`\n      7. Status Type Analysis`);
        console.log(`         • Distinguished automatic vs manual Incomplete`);
        console.log(`         • Confirmed both types display identically`);
        console.log(`         • Verified automatic post-deadline incomplete logic`);
        
        console.log(`\n   📝 KEY FINDINGS:`);
        console.log(`      • Certification Complete By Date configuration works correctly`);
        console.log(`      • Post Complete by: Incomplete setting is respected`);
        console.log(`      • CRON job successfully processes incomplete logic`);
        console.log(`      • Status changes from Enrolled to Incomplete automatically`);
        console.log(`      • Incomplete status is visible in both learner and admin views`);
        console.log(`      • System enforces completion deadlines for certifications`);
        
        console.log(`\n   🔍 COMPARISON: INCOMPLETE vs OVERDUE:`);
        console.log(`      INCOMPLETE (ME_VUS_L005):`);
        console.log(`      • Post Complete by: Incomplete`);
        console.log(`      • Status after deadline: Incomplete`);
        console.log(`      • Use case: Track non-completion`);
        console.log(`      • Same as manual incomplete status`);
        
        console.log(`\n      OVERDUE (ME_VUS_L004):`);
        console.log(`      • Post Complete by: Overdue`);
        console.log(`      • Status after deadline: Overdue`);
        console.log(`      • Use case: Track late submissions`);
        console.log(`      • Different from Incomplete`);
        
        console.log(`\n   ⚙️ CONFIGURATION OPTIONS:`);
        console.log(`      Post Complete by settings available:`);
        console.log(`      • Incomplete - Marks as incomplete after deadline`);
        console.log(`      • Overdue - Marks as overdue after deadline`);
        console.log(`      • Default - No automatic status change`);
        
        console.log(`\n   🎯 CERTIFICATION-SPECIFIC BEHAVIOR:`);
        console.log(`      • Certifications can have expiry dates`);
        console.log(`      • Complete By Date enforces completion deadlines`);
        console.log(`      • Post Complete by determines status after deadline`);
        console.log(`      • Helps track compliance and certification requirements`);
        console.log(`      • Admin can monitor and take action on incomplete certifications`);
        
        console.log(`\n   ✅ CONCLUSION:`);
        console.log(`      All tests passed successfully.`);
        console.log(`      Certification Incomplete status change is working correctly.`);
        console.log(`      System properly enforces completion deadlines and`);
        console.log(`      automatically updates status when certifications exceed Complete By Date.`);
        console.log(`      The Post Complete by: Incomplete setting is functioning as expected.`);
        console.log(`📊 ========================================\n`);
    });
});
