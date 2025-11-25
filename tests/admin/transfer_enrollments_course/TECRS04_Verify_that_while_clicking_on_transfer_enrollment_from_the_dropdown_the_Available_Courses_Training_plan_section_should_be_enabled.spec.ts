import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const instructorName = credentials.INSTRUCTORNAME.username;
let instance1Name: string;
let instance2Name: string;

test.describe.serial(`TECRS04 - Verify Available Courses/Training Plan section and From/To sections in Transfer Enrollment`, async () => {

    test(`Create course with 2 instances through bulk class creation`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS04 - Step 1: Create Course with Bulk Instances` },
            { type: `Test Description`, description: `Create course with 2 instances using bulk class creation` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
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
        await createCourse.clickEditCourseTabs();
        
        // Create 2 instances using bulk class creation
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.enterInstanceCount("2");
        await createCourse.clickCreateInstance();
        
        // Get the session names from bulk creation
        const sessionNames = await createCourse.bulkClassCreation(2, "manual", courseName);
        instance1Name = sessionNames[0];
        instance2Name = sessionNames[1];
        
    });

    test(`Enroll learner in first instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS04 - Step 2: Enroll Learner` },
            { type: `Test Description`, description: `Enroll learner in the first instance` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.selectclassBtn();
        await enrollHome.learnerforSC(credentials.LEARNERUSERNAME.username);
        await enrollHome.selectInstance(instance1Name);
        await enrollHome.verifytoastMessage();
    });

    test(`Verify available classes in From and To sections in Transfer Enrollment`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS04 - Step 4: Verify From and To Sections` },
            { type: `Test Description`, description: `Navigate to View/Update Status, go to Transfer Enrollment - Course, verify From section shows enrolled class and To section shows non-enrolled class` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.wait("mediumWait");
        
        // Search for the course
        await enrollHome.searchCourseInViewStatus(courseName);
        
        // Click Transfer Enrollment - Course option
        await page.locator(`//a[text()='Transfer Enrollment - Course']`).click();
        await enrollHome.wait("mediumWait");
        
        // Verify From section (Source Instance) shows enrolled class
        await page.locator(`//input[@id="enrtfr-search-selectinstances--field"]`).click();
        await enrollHome.wait("minWait");
        
        const enrolledInstanceInFrom = page.locator(`//span[text()='${instance1Name}']`);
        const isEnrolledVisible = await enrolledInstanceInFrom.isVisible();
        
        if (isEnrolledVisible) {
            console.log(`✅ Verified: From section shows enrolled class '${instance1Name}'`);
        } else {
            throw new Error(`❌ Enrolled instance '${instance1Name}' should be available in From (Source) section`);
        }
        
        // Select the enrolled instance as source
        await enrolledInstanceInFrom.click();
        await enrollHome.wait("minWait");
        
        // Verify To section (Target Instance) shows non-enrolled class
        await page.locator(`//input[@id="enrtfr-search-selectinstances-removeindividuals-filter-field"]`).click();
        await enrollHome.wait("minWait");
        
        const nonEnrolledInstanceInTo = page.locator(`//span[text()='${instance2Name}']`);
        const isNonEnrolledVisible = await nonEnrolledInstanceInTo.isVisible();
        
        if (isNonEnrolledVisible) {
            console.log(`✅ Verified: To section shows non-enrolled class '${instance2Name}'`);
        } else {
            throw new Error(`❌ Non-enrolled instance '${instance2Name}' should be available in To (Target) section`);
        }
        
        // Verify enrolled instance is NOT in To section
        const enrolledInstanceInTo = page.locator(`//span[text()='${instance1Name}']`).nth(1);
        const isEnrolledInTo = await enrolledInstanceInTo.isVisible().catch(() => false);
        
        if (!isEnrolledInTo) {
            console.log(`✅ Verified: Enrolled instance '${instance1Name}' is NOT shown in To section (cannot transfer to same instance)`);
        }
    });

});
