import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";

const completedCourseName = FakerData.getCourseName();
const activeCourseForEnrollment = FakerData.getCourseName();
const instanceName1 = FakerData.getCourseName()+"Completed_ILT";
const instanceName2 = FakerData.getCourseName()+"Completed_ILT2";
const activeInstanceName = FakerData.getCourseName()+"Active_ILT";
const description = FakerData.getDescription();
const instructorName = credentials.INSTRUCTORNAME.username;
let completedInstanceName: string;
let completedInstanceName2: string;
let activeInstanceSession: string;

test.describe.serial(`TECRS09 - Verify that courses with Completed status should not get listed in Transfer Enrollment`, async () => {

    test(`Create course and mark instance as Completed`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS09 - Step 1: Create Course and Mark as Completed` },
            { type: `Test Description`, description: `Create course with instance and mark it as Completed` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", completedCourseName);
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

        
        // Add instance to completed course
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", instanceName1);
        completedInstanceName = FakerData.getSession();
        await createCourse.enterSessionName(completedInstanceName);
        await createCourse.setMaxSeat();
        await createCourse.enterpastDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.clickHideinCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        
        // Mark the instance as Completed
        await createCourse.clickEditCourseTabs();
        await createCourse.clicLickToSwitchCrsPage();
        
        // Add second instance
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", instanceName2);
        completedInstanceName2 = FakerData.getSession();
        await createCourse.enterSessionName(completedInstanceName2);
        await createCourse.setMaxSeat();
        await createCourse.enterpastDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.clickHideinCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        
        // Mark the second instance as Completed
        await createCourse.clickEditCourseTabs();
        await createCourse.clickClassComplete();
        
    });


    test(`Verify Completed course is NOT listed in Transfer Enrollment search`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS09 - Step 4: Verify Completed Course Not Listed` },
            { type: `Test Description`, description: `Verify that Completed course does not appear in Transfer Enrollment search` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");
        
        // Click Transfer Enrollment - Course option
        await enrollHome.selectEnrollmentOption("Transfer Enrollment - Course");
        
       await enrollHome.searchCourseForTransfer(completedCourseName);
    });


});