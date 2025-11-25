import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";

const draftCourseName = FakerData.getCourseName();
const instanceName1 = FakerData.getCourseName()+"Draft_ILT1";
const instanceName2 = FakerData.getCourseName()+"Draft_ILT2";
const description = FakerData.getDescription();
const instructorName = credentials.INSTRUCTORNAME.username;
let draftInstance1Name: string;
let draftInstance2Name: string;

test.describe.serial(`TECRS08 - Verify that courses with Save as Draft status should not get listed in Transfer Enrollment`, async () => {

    test(`Create course with Save as Draft status and add two instances`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS08 - Step 1: Create Course with Save as Draft Status` },
            { type: `Test Description`, description: `Create multi-instance course with Save as Draft status` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", draftCourseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.selectdeliveryType("Classroom");
        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown();
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        
        // Set course as Save as Draft
        await createCourse.clickSaveasDraft();
        
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await createCourse.clickEditCourseTabs();
        
        // Add first instance to Draft course
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", instanceName1);
        draftInstance1Name = FakerData.getSession();
        await createCourse.enterSessionName(draftInstance1Name);
        await createCourse.setMaxSeat();
        await createCourse.enterDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        await createCourse.clickEditCourseTabs();
        await createCourse.clicLickToSwitchCrsPage();
        await createCourse.wait("mediumWait");
        
        // Add second instance to Draft course
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", instanceName2);
        draftInstance2Name = FakerData.getSession();
        await createCourse.enterSessionName(draftInstance2Name);
        await createCourse.setMaxSeat();
        await createCourse.enterDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    });


    test(`Verify Save as Draft course is NOT listed in Transfer Enrollment search`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS08 - Step 4: Verify Draft Course Not Listed` },
            { type: `Test Description`, description: `Verify that Save as Draft course does not appear in Transfer Enrollment search` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");
        
        // Click Transfer Enrollment - Course option
        await enrollHome.selectEnrollmentOption("Transfer Enrollment - Course");
        
       await enrollHome.searchCourseForTransfer(draftCourseName);
        

})
})