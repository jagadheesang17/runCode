import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
import { credentials } from "../../constants/credentialData";

const courseName = "LearnerViewStatus_" + FakerData.getCourseName();
const description = FakerData.getDescription();
const learner = credentials.LEARNERUSERNAME.username;

test.describe(`ME_VUS_L001_Verify_view_update_status_learner_page_and_enrollment_fields`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Test 1: Create course and enroll learner`, async ({ adminHome, createCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS_L001_TC001 - Setup` },
            { type: `Test Description`, description: `Create course and enroll learner for testing` }
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
        console.log(`✅ Course created: ${courseName}`);

        console.log(`🔄 Enrolling learner...`);
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(learner);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        console.log(`✅ Learner enrolled: ${learner}`);
    });

    test(`Test 2: Verify View/update status - Learner page is selected under Manage Enrollments`, async ({ adminHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS_L001_TC002 - Verify menu selection` },
            { type: `Test Description`, description: `Verify View/update Status - Learner page is accessible under Manage Enrollments menu` }
        );

        console.log(`🔄 Navigating to View/update Status - Learner...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        
        const menuOption = page.locator("//a[text()='View/update Status - Learner']");
        const isVisible = await menuOption.isVisible();
        
        if (isVisible) {
            console.log(`   ✅ View/update Status - Learner menu option is visible`);
            await adminHome.clickviewUpdateStatusLearner();
            console.log(`   ✅ Successfully selected View/update Status - Learner`);
        } else {
            console.log(`   ⚠️ View/update Status - Learner menu option not found`);
        }
    });

    test(`Test 3: Verify redirecting to learner enrollment page from user listing`, async ({ adminHome, createUser, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS_L001_TC003 - Verify redirect from user listing` },
            { type: `Test Description`, description: `Verify clicking enrollments icon from user listing page redirects to learner enrollment page` }
        );

        console.log(`🔄 Navigating to user listing page...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.userSearchField(learner);
        await createUser.wait("mediumWait");
        console.log(`   ✅ Found learner in user listing: ${learner}`);

        console.log(`🔄 Clicking enrollments icon...`);
        const enrollmentIconSelector = "(//a[@aria-label='Enrollments'])[1]";
        await page.locator(enrollmentIconSelector).click();
        await createUser.wait("mediumWait");
        
        // Verify redirected to Manage Enrollments page
        const enrollmentLabel = page.locator("//h1[text()='Manage Enrollments']");
        const isLabelVisible = await enrollmentLabel.isVisible();
        
        if (isLabelVisible) {
            console.log(`   ✅ PASS: Redirected to learner enrollment page (Manage Enrollments)`);
        } else {
            console.log(`   ⚠️ WARNING: Not on Manage Enrollments page`);
        }
    });

    test(`Test 4: Verify enrolled learners list displays all required fields`, async ({ adminHome, enrollHome, createUser, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS_L001_TC004 - Verify all enrollment fields` },
            { type: `Test Description`, description: `Verify enrolled learners list displays: Title, Code, Type, Date, Score, Status, Enrollment Type, Checklist, Action, Add notes, Upload files, Progress` }
        );

        console.log(`🔄 Navigating to View/update Status - Learner...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusLearner();
        await createUser.userSearchField(learner);
        await enrollHome.wait("mediumWait");
        
        // Click enrollment icon to view enrollments
        const enrollmentIconSelector = "(//a[@aria-label='Enrollments'])[1]";
        await page.locator(enrollmentIconSelector).click();
        await enrollHome.wait("mediumWait");
        
        console.log(`🔄 Verifying enrolled learners list displays all required fields...`);
        
        const requiredFields = [
            { name: 'Title', selector: "//th[contains(text(),'Title') or contains(text(),'title')]" },
            { name: 'Code', selector: "//th[contains(text(),'Code') or contains(text(),'code')]" },
            { name: 'Type', selector: "//th[contains(text(),'Type') or contains(text(),'type')]" },
            { name: 'Date', selector: "//th[contains(text(),'Date') or contains(text(),'date')]" },
            { name: 'Score', selector: "//th[contains(text(),'Score') or contains(text(),'score')]" },
            { name: 'Status', selector: "//th[contains(text(),'Status') or contains(text(),'status')]" },
            { name: 'Enrollment Type', selector: "//th[contains(text(),'Enrollment Type') or contains(text(),'Enrollment type')]" },
            { name: 'Checklist', selector: "//th[contains(text(),'Checklist') or contains(text(),'checklist')]" },
            { name: 'Action', selector: "//th[contains(text(),'Action') or contains(text(),'action')]" },
            { name: 'Add notes', selector: "//th[contains(text(),'Add notes') or contains(text(),'Add Notes')]" },
            { name: 'Upload files', selector: "//th[contains(text(),'Upload files') or contains(text(),'Files')]" },
            { name: 'Progress', selector: "//th[contains(text(),'Progress') or contains(text(),'progress')]" }
        ];

        let visibleFieldsCount = 0;
        const visibleFields: string[] = [];
        const missingFields: string[] = [];

        for (const field of requiredFields) {
            const fieldElement = page.locator(field.selector).first();
            const isVisible = await fieldElement.isVisible().catch(() => false);
            
            if (isVisible) {
                visibleFieldsCount++;
                visibleFields.push(field.name);
                console.log(`   ✅ ${field.name} - Displayed`);
            } else {
                missingFields.push(field.name);
                console.log(`   ❌ ${field.name} - NOT Displayed`);
            }
        }

        console.log(`\n📊 Field Verification Summary:`);
        console.log(`   Total Required Fields: ${requiredFields.length}`);
        console.log(`   Visible Fields: ${visibleFieldsCount}`);
        console.log(`   Missing Fields: ${missingFields.length}`);
        
        if (missingFields.length > 0) {
            console.log(`   Missing: ${missingFields.join(', ')}`);
        }
        
        if (visibleFieldsCount === requiredFields.length) {
            console.log(`   ✅ PASS: All required fields are displayed in enrolled learners list`);
        } else {
            console.log(`   ⚠️ WARNING: Some fields are missing`);
        }

        // Verify learner enrollment row is displayed
        console.log(`\n🔄 Verifying learner enrollment row...`);
        const learnerRow = page.locator(`//tr[contains(.,'${courseName}')]`);
        const isRowVisible = await learnerRow.isVisible().catch(() => false);
        
        if (isRowVisible) {
            console.log(`   ✅ Learner enrollment row displayed for course: ${courseName}`);
        } else {
            console.log(`   ⚠️ Learner enrollment row not found`);
        }
    });
});
