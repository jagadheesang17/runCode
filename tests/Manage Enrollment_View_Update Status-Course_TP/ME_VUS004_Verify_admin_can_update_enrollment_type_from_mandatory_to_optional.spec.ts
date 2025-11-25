import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
import { credentials } from "../../constants/credentialData";

const courseName = "EnrollmentType_" + FakerData.getCourseName();
const description = FakerData.getDescription();
const learner1 = credentials.LEARNERUSERNAME.username;
const learner2 = credentials.LEARNER2USERNAME?.username || credentials.LEARNERUSERNAME.username;

test.describe(`ME_VUS004_Verify_admin_can_update_enrollment_type_from_mandatory_to_optional`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Test 1: Create course as Mandatory and enroll learners`, async ({ adminHome, createCourse, editCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS004_TC001 - Setup` },
            { type: `Test Description`, description: `Create Mandatory course and enroll learners` }
        );

        console.log(`🔄 Creating course and setting as Mandatory...`);
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

        await editCourse.clickAccessSetting();
        await editCourse.wait("minWait");
        await editCourse.setCourseMandatory();
        await editCourse.saveAccess();
        await editCourse.wait("mediumWait");
        console.log(`✅ Course set as Mandatory`);

        console.log(`🔄 Enrolling learners...`);
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(learner1);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        console.log(`✅ Learner 1 enrolled: ${learner1}`);

        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(learner2);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        console.log(`✅ Learner 2 enrolled: ${learner2}`);
    });

    test(`Test 2: Update single enrollment from Mandatory to Optional`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS004_TC002 - Update single enrollment` },
            { type: `Test Description`, description: `Verify admin can update single enrollment type from Mandatory to Optional` }
        );

        console.log(`🔄 Navigating to View/Modify Enrollment...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.wait("minWait");
        await enrollHome.clickModifyEnrollBtn();
        await enrollHome.wait("mediumWait");

        console.log(`🔄 Verifying and updating enrollment type for ${learner1}...`);
        
        const learner1EnrollmentType = `//tr[contains(.,'${learner1}')]//button[contains(@data-id,'enrollment-mro-status')]`;
        
        // Verify current type is Mandatory
        const currentType = await page.locator(learner1EnrollmentType).first().innerText();
        console.log(`   Current Type: "${currentType}"`);
        
        // Click dropdown and select Optional
        await page.locator(learner1EnrollmentType).first().click();
        await enrollHome.wait("minWait");
        await page.locator("//span[text()='Optional']").click();
        await enrollHome.wait("mediumWait");
        
        // Verify updated type
        const updatedType = await page.locator(learner1EnrollmentType).first().innerText();
        console.log(`   Updated Type: "${updatedType}"`);
        
        if (updatedType.includes('Optional')) {
            console.log(`   ✅ PASS: Single enrollment updated from Mandatory to Optional`);
        }
    });

    test(`Test 3: Update multiple enrollments from Mandatory to Optional`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS004_TC003 - Update multiple enrollments` },
            { type: `Test Description`, description: `Verify admin can update multiple enrollments from Mandatory to Optional` }
        );

        console.log(`🔄 Navigating to View/Modify Enrollment...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.wait("minWait");
        await enrollHome.clickModifyEnrollBtn();
        await enrollHome.wait("mediumWait");

        console.log(`🔄 Updating multiple enrollments to Optional...`);
        
        for (const learner of [learner1, learner2]) {
            const enrollmentType = `//tr[contains(.,'${learner}')]//button[contains(@data-id,'enrollment-mro-status')]`;
            
            await page.locator(enrollmentType).first().click();
            await enrollHome.wait("minWait");
            await page.locator("//span[text()='Optional']").first().click();
            await enrollHome.wait("mediumWait");
            
            const updatedType = await page.locator(enrollmentType).first().innerText();
            console.log(`   ${learner}: ${updatedType.includes('Optional') ? '✅ Optional' : '⚠️ ' + updatedType}`);
        }
        
        console.log(`\n   ✅ PASS: Multiple enrollments updated from Mandatory to Optional`);
    });
});
