import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";

const courseName = FakerData.getCourseName();
const instanceName1 = FakerData.getCourseName()+"Hidden_ILT1";
const instanceName2 = FakerData.getCourseName()+"Hidden_ILT2";
const description = FakerData.getDescription();
const instructorName = credentials.INSTRUCTORNAME.username;
let instance1Name: string;
let instance2Name: string;

test.describe.serial(`TECRS07 - Verify that courses with Hidden in Catalog status get listed in Transfer Enrollment`, async () => {

    test(`Create course with Hidden in Catalog status and add two instances`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS07 - Step 1: Create Course with Hidden in Catalog Status` },
            { type: `Test Description`, description: `Create multi-instance course with Hidden in Catalog status` }
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
        
        // Set course as Hidden in Catalog
        await createCourse.clickHideinCatalog();
        
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.clickEditCourseTabs();
        
        // Add first instance
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", instanceName1);
        instance1Name = FakerData.getSession();
        await createCourse.enterSessionName(instance1Name);
        await createCourse.setMaxSeat();
        await createCourse.enterpastDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.clickHideinCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        await createCourse.clickEditCourseTabs();
        await createCourse.clicLickToSwitchCrsPage();
        await createCourse.wait("mediumWait");
        
        // Add second instance
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", instanceName2);
        instance2Name = FakerData.getSession();
        await createCourse.enterSessionName(instance2Name);
        await createCourse.setMaxSeat();
        await createCourse.enterpastDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.clickHideinCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    });

    test(`Enroll learner in first instance of Hidden in Catalog course`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS07 - Step 2: Enroll Learner` },
            { type: `Test Description`, description: `Enroll learner in first instance of Hidden in Catalog course` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(instanceName1);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
    });

    test(`Verify Hidden in Catalog course gets listed in Transfer Enrollment search`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS07 - Step 3: Verify Course Listed in Transfer Enrollment` },
            { type: `Test Description`, description: `Verify that Hidden in Catalog course appears in transfer enrollment search` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.wait("mediumWait");
        
        // Click Transfer Enrollment - Course option
        await enrollHome.selectEnrollmentOption("Transfer Enrollment - Course");
        
        // Search for the Hidden in Catalog course
        await enrollHome.searchCourseForTransfer(courseName);
        
        console.log(`✅ Verified: Hidden in Catalog course '${courseName}' is listed in Transfer Enrollment search`);
    });

    test(`Verify instances of Hidden in Catalog course are listed in From and To sections`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS07 - Step 4: Verify From and To Sections` },
            { type: `Test Description`, description: `Verify that instances of Hidden in Catalog course appear in From (enrolled) and To (non-enrolled) sections` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.wait("mediumWait");
        
        // Search for the Hidden in Catalog course
        await enrollHome.searchCourseInViewStatus(instanceName1);
        await enrollHome.selectBycourse(instanceName1);
        await enrollHome.clickViewLearner();
        // Click Transfer Enrollment - Course option
        await enrollHome.selectEnrollmentOption("Transfer Enrollment - Course");
        await enrollHome.wait("maxWait");
        
        // Clear any pre-selected filters
        await enrollHome.clearFilterCrossMarks();
        
        
        const enrolledInstanceInFrom = page.locator(`(//div[text()="${instanceName1}"])[1]`);
        const isEnrolledVisible = await enrolledInstanceInFrom.isVisible();
        
        if (isEnrolledVisible) {
            console.log(`✅ Verified: From section shows enrolled instance '${instanceName1}' of Hidden in Catalog course`);
        } else {
            throw new Error(`❌ Enrolled instance '${instanceName1}' of Hidden in Catalog course should be available in From (Source) section`);
        }
        
        // Select the enrolled instance as source
        await enrolledInstanceInFrom.click();
        await enrollHome.wait("minWait");
        
        const nonEnrolledInstanceInTo = page.locator(`//div[text()="${instanceName2}"]`);
        const isNonEnrolledVisible = await nonEnrolledInstanceInTo.isVisible();
        
        if (isNonEnrolledVisible) {
            console.log(`✅ Verified: To section shows non-enrolled instance '${instanceName2}' of Hidden in Catalog course`);
        } else {
            throw new Error(`❌ Non-enrolled instance '${instanceName2}' of Hidden in Catalog course should be available in To (Target) section`);
        }
        
    });

    test(`Transfer learner from first instance to second instance`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS07 - Step 5: Transfer Learner Between Hidden Catalog Instances` },
            { type: `Test Description`, description: `Transfer learner from first instance to second instance of Hidden in Catalog course` }
        );

         await adminHome.loadAndLogin("CUSTOMERADMIN");
                await adminHome.menuButton();
                await adminHome.clickEnrollmentMenu();
                await enrollHome.wait("mediumWait");
                
                // Click Transfer Enrollment option
                await enrollHome.clickTransferEnrollmentOption();
                
                // Search for the course
                await enrollHome.searchCourseForTransfer(courseName);
                await enrollHome.clearFilterCrossMarks();
                // Select source instance (first instance)
                await enrollHome.selectSourceInstance(instanceName1);
                
                // Select target instance (second instance)
                await enrollHome.selectTargetInstance(instanceName2);
                // Click Select Learners button
                await enrollHome.selectlearner();
                // Select the learner
                await enrollHome.selectLearnerForTransfer(credentials.LEARNERUSERNAME.username);
                
                // Click Transfer button
                await enrollHome.clickTransferButton();
                await enrollHome.wait("mediumWait");
                
                // Verify success message
                await enrollHome.verifyTransferSuccessMessage();
        console.log(`✅ Successfully transferred learner from '${instance1Name}' to '${instance2Name}' in Hidden in Catalog course`);
    });

    test(`Verify transferred enrollment in learner's My Learning`, async ({ learnerHome, catalog, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS07 - Step 6: Verify in Learner My Learning` },
            { type: `Test Description`, description: `Verify learner can see the Hidden in Catalog course in My Learning after transfer` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.wait("mediumWait");
        await learnerHome.clickMyLearning();
        await catalog.searchMyLearning(courseName);
        await catalog.verifyEnrolledCourseByTitle(courseName);
        await catalog.verifyLabel("Enrolled");
        
    });

});
