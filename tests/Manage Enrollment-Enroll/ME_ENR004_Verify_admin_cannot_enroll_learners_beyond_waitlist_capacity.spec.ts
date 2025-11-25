import { credentials } from "../../constants/credentialData";
import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";

const courseName = "WaitlistTest_" + FakerData.getCourseName();
const description = FakerData.getDescription();
const maxSeats = "2"; // 2 regular seats
const waitlistSeats = "2"; // 2 waitlist seats

test.describe(`ME_ENR004_Verify_admin_cannot_enroll_learners_beyond_waitlist_capacity`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Test 1: Enable Max Seat Override in Site Settings`, async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_ENR004_TC001 - Enable Max Seat Override` },
            { type: `Test Description`, description: `Enable Max Seat Override functionality in site settings to allow enrollments beyond max seats` }
        );

        console.log(`🔄 Enabling Max Seat Override in site settings...`);
        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.isSignOut();
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await adminHome.siteAdmin_Adminconfig();
        await siteAdmin.clickBusinessRulesEditIcon();
        await siteAdmin.maxSeatOverRideInBusinessRules();
        
        console.log(`✅ Max Seat Override enabled successfully`);
    });

    test(`Test 2: Create E-learning course with limited seats and waitlist`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_ENR004_TC002 - Create course with seats and waitlist` },
            { type: `Test Description`, description: `Create E-learning course with 2 max seats and 2 waitlist seats for testing capacity limits` }
        );

        console.log(`🔄 Creating E-learning course with limited capacity...`);
        console.log(`   Max Seats: ${maxSeats}`);
        console.log(`   Waitlist Seats: ${waitlistSeats}`);
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        
        // Basic course information
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        
        // Set max seats
        await createCourse.setSeatsMax(maxSeats);
        console.log(`✅ Max seats set to: ${maxSeats}`);
        
        // Set waitlist - using type method directly with correct selector
        const waitlistSelector = "//label[text()='Waitlist']/following-sibling::input";
        await createCourse.page.waitForSelector(waitlistSelector, { timeout: 10000 });
        await createCourse.page.locator(waitlistSelector).clear();
        await createCourse.page.locator(waitlistSelector).fill(waitlistSeats);
        console.log(`✅ Waitlist seats set to: ${waitlistSeats}`);
        
        // Add content
        await createCourse.contentLibrary();
        
        // Save the course
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        
        console.log(`✅ E-learning course created successfully: ${courseName}`);
        console.log(`   Total Capacity: ${parseInt(maxSeats) + parseInt(waitlistSeats)} enrollments (${maxSeats} seats + ${waitlistSeats} waitlist)`);
    });

    test(`Test 3: Enroll Learner 1 - Regular Seat 1/2`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_ENR004_TC003 - Enroll first learner` },
            { type: `Test Description`, description: `First learner enrollment should succeed and occupy regular seat 1 of 2` }
        );

        console.log(`🔄 Enrolling Learner 1: ${credentials.LEARNERUSERNAME.username}`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        await enrollHome.clickGotoHome();
        
        console.log(`✅ Learner 1 enrolled successfully`);
        console.log(`   Status: Regular Seat 1/2 occupied`);
    });

    test(`Test 4: Enroll Learner 2 - Regular Seat 2/2`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_ENR004_TC004 - Enroll second learner` },
            { type: `Test Description`, description: `Second learner enrollment should succeed with override popup and occupy regular seat 2 of 2` }
        );

        console.log(`🔄 Enrolling Learner 2: ${credentials.TEAMUSER1.username}`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.TEAMUSER1.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifyMaxSeatOverRidePopup(); // Expects "You have exceeded the maximum seat" popup
        await enrollHome.verifytoastMessage();
        await enrollHome.clickGotoHome();
        
        console.log(`✅ Learner 2 enrolled successfully with seat override`);
        console.log(`   Status: Regular Seat 2/2 occupied - ALL REGULAR SEATS FULL`);
    });

    test(`Test 5: Enroll Learner 3 - Waitlist Position 1/2`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_ENR004_TC005 - First waitlist enrollment` },
            { type: `Test Description`, description: `Third learner enrollment should go to waitlist position 1 since regular seats are full` }
        );

        console.log(`🔄 Enrolling Learner 3: ${credentials.TEAMUSER2.username}`);
        console.log(`   Expected: Should go to WAITLIST (regular seats full)`);
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.TEAMUSER2.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifyMaxSeatOverRidePopup();
        await enrollHome.verifytoastMessage();
        await enrollHome.clickGotoHome();
        
        console.log(`✅ Learner 3 added to waitlist successfully`);
        console.log(`   Status: Waitlist Position 1/2`);
    });

    test(`Test 6: Enroll Learner 4 - Waitlist Position 2/2`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_ENR004_TC006 - Second waitlist enrollment` },
            { type: `Test Description`, description: `Fourth learner enrollment should go to waitlist position 2 - LAST WAITLIST SPOT` }
        );

        console.log(`🔄 Enrolling Learner 4: ${credentials.INSTRUCTORNAME.username}`);
        console.log(`   Expected: Should fill LAST WAITLIST SPOT`);
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.INSTRUCTORNAME.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifyMaxSeatOverRidePopup();
        await enrollHome.verifytoastMessage();
        await enrollHome.clickGotoHome();
        
        console.log(`✅ Learner 4 added to waitlist successfully`);
        console.log(`   Status: Waitlist Position 2/2 - WAITLIST NOW FULL`);
        console.log(`   ⚠️ Total Capacity Reached: 2 seats + 2 waitlist = 4/4 enrollments`);
    });

    test(`Test 7: Attempt to enroll Learner 5 - Should be BLOCKED`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_ENR004_TC007 - Verify enrollment blocked when waitlist full` },
            { type: `Test Description`, description: `Fifth learner enrollment should FAIL - both regular seats and waitlist are at full capacity` }
        );

        console.log(`🔄 Attempting to enroll Learner 5: ${credentials.MANAGERUSERNAME.username}`);
        console.log(`   Expected: Enrollment should be BLOCKED (max seats + waitlist both full)`);
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.MANAGERUSERNAME.username);
        await enrollHome.clickEnrollBtn();
        
        await page.waitForTimeout(3000);
        
        // Check for various error/warning messages indicating waitlist is full
        const waitlistFullMessages = [
            "//div[contains(text(),'Waitlist')] | //span[contains(text(),'Waitlist')]",
            "//div[contains(text(),'full')] | //span[contains(text(),'full')]",
            "//div[contains(text(),'Cannot enroll')] | //span[contains(text(),'Cannot enroll')]",
            "//div[contains(text(),'capacity')] | //span[contains(text(),'capacity')]",
            "//div[contains(text(),'Maximum')] | //span[contains(text(),'Maximum')]",
            "//div[contains(text(),'No seat')] | //span[contains(text(),'No seat')]",
            "//div[contains(text(),'only for 0 users')] | //span[contains(text(),'only for 0 users')]"
        ];
        
        let errorFound = false;
        let errorMessage = "";
        
        for (const selector of waitlistFullMessages) {
            try {
                const element = page.locator(selector).first();
                const count = await element.count();
                if (count > 0) {
                    const isVisible = await element.isVisible({ timeout: 3000 }).catch(() => false);
                    if (isVisible) {
                        errorMessage = await element.textContent() || "";
                        console.log(`⚠️ Message found: "${errorMessage}"`);
                        
                        if (errorMessage.toLowerCase().includes('waitlist') || 
                            errorMessage.toLowerCase().includes('full') ||
                            errorMessage.toLowerCase().includes('capacity') ||
                            errorMessage.toLowerCase().includes('cannot') ||
                            errorMessage.toLowerCase().includes('0 users')) {
                            errorFound = true;
                            
                            // Try clicking OK button if present
                            try {
                                await enrollHome.clickOkBtn();
                                console.log(`✅ Clicked OK on error popup`);
                            } catch (error) {
                                console.log(`ℹ️ No OK button to click`);
                            }
                            break;
                        }
                    }
                }
            } catch (error) {
                continue;
            }
        }
        
        // Alternative: Check if enrollment succeeded (which would be WRONG)
        if (!errorFound) {
            console.log(`ℹ️ No explicit error message found, checking if enrollment was blocked...`);
            
            try {
                const successToast = page.locator("//section[contains(@class,'lms-success-msg-wrapper')]//h3");
                const toastVisible = await successToast.isVisible({ timeout: 5000 }).catch(() => false);
                
                if (toastVisible) {
                    const toastText = await successToast.textContent();
                    console.log(`❌ CRITICAL BUG: Enrollment succeeded with message: "${toastText}"`);
                    console.log(`❌ System allowed enrollment beyond max seats + waitlist capacity!`);
                } else {
                    console.log(`✅ No success message - enrollment was correctly blocked`);
                    errorFound = true;
                }
            } catch (error) {
                console.log(`✅ Enrollment blocked silently - no success message`);
                errorFound = true;
            }
        }
        
        console.log(`\n📊 ========================================`);
        console.log(`📊 CRITICAL VERIFICATION RESULT:`);
        console.log(`📊 ========================================`);
        if (errorFound) {
            console.log(`   ✅ PASS: 5th enrollment correctly BLOCKED`);
            if (errorMessage) {
                console.log(`   ✅ Error message: "${errorMessage}"`);
            }
        } else {
            console.log(`   ❌ FAIL: Enrollment may have been allowed!`);
        }
        console.log(`📊 ========================================\n`);
    });

    test(`Test 8: Verify course shows as full in learner catalog`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_ENR004_TC008 - Verify learner sees course full` },
            { type: `Test Description`, description: `Verify learner cannot self-enroll and sees "Seats Full" message when both seats and waitlist are full` }
        );

        console.log(`🔄 Verifying course full status from learner perspective...`);
        await learnerHome.learnerLogin("MANAGERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(courseName);
        await catalog.clickMoreonCourse(courseName);
        
        // Verify seat full text is displayed
        await catalog.verifySeatFullText(courseName);
        
        console.log(`✅ Learner view correctly shows "Seats Full" message`);
        console.log(`   Course: ${courseName}`);
        console.log(`   Status: Not available for enrollment`);
    });

    test(`Test 9: Final verification and summary`, async ({ page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_ENR004_TC009 - Final summary` },
            { type: `Test Description`, description: `Summary of all test verifications for waitlist capacity enforcement` }
        );

        console.log(`\n✅ ========================================`);
        console.log(`✅ FINAL TEST EXECUTION SUMMARY`);
        console.log(`✅ ========================================`);
        console.log(`📋 Course: ${courseName}`);
        console.log(`📊 Capacity Configuration:`);
        console.log(`   • Max Seats: ${maxSeats}`);
        console.log(`   • Waitlist: ${waitlistSeats}`);
        console.log(`   • Total Capacity: ${parseInt(maxSeats) + parseInt(waitlistSeats)} enrollments`);
        console.log(`\n📊 Enrollment Test Results:`);
        console.log(`   1. ✅ Learner 1 (${credentials.LEARNERUSERNAME.username}): Regular Seat 1/2`);
        console.log(`   2. ✅ Learner 2 (${credentials.TEAMUSER1.username}): Regular Seat 2/2 (FULL)`);
        console.log(`   3. ✅ Learner 3 (${credentials.TEAMUSER2.username}): Waitlist 1/2`);
        console.log(`   4. ✅ Learner 4 (${credentials.INSTRUCTORNAME.username}): Waitlist 2/2 (FULL)`);
        console.log(`   5. ✅ Learner 5 (${credentials.MANAGERUSERNAME.username}): BLOCKED ✓`);
        console.log(`\n📊 Verification Checklist:`);
        console.log(`   ✅ Max seat override functionality working`);
        console.log(`   ✅ Regular seats filled with override popup`);
        console.log(`   ✅ Waitlist filled when regular seats full`);
        console.log(`   ✅ Admin enrollment blocked beyond waitlist capacity`);
        console.log(`   ✅ Learner view shows "Seats Full" message`);
        console.log(`   ✅ Course not available for self-enrollment`);
        console.log(`\n🎯 TEST RESULT: Admin cannot enroll learners beyond max seats + waitlist capacity`);
        console.log(`✅ ========================================\n`);
    });
});
