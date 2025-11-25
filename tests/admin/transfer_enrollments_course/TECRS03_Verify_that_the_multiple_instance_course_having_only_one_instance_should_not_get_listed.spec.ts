import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";
import { create } from "domain";

const course1Name = FakerData.getCourseName();
const course2Name = FakerData.getCourseName();
const instanceName1 = FakerData.getCourseName()+"ILT";
const instanceName2 = FakerData.getCourseName()+"VC";
const description = FakerData.getDescription();
const instructorName = credentials.INSTRUCTORNAME.username;
let course1InstanceName: string;
let course2InstanceName: string;

test.describe.serial(`TECRS03 - Verify that the multiple instance course having only one instance should not get listed`, async () => {

    test(`Create first multi-instance course with ILT instance`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS03 - Step 1: Create First Course` },
            { type: `Test Description`, description: `Create first course with ILT instance` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", course1Name);
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
        
        // Add ILT instance to first course
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", instanceName1);
        course1InstanceName = FakerData.getSession();
        await createCourse.enterSessionName(course1InstanceName);
        await createCourse.setMaxSeat();
        await createCourse.enterDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    });

    test(`Create second multi-instance course with VC instance`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS03 - Step 2: Create Second Course` },
            { type: `Test Description`, description: `Create second course with VC instance` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", course2Name);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.selectdeliveryType("Virtual Class");
        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown();
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.clickEditCourseTabs();
        
        // Add VC instance to second course
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Virtual Class");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", instanceName2);
        await createCourse.sessionType();
        await createCourse.presenterUrl();
        await createCourse.attendeeUrl();
        course2InstanceName = FakerData.getSession();
        await createCourse.enterSessionName(course2InstanceName);
        await createCourse.vcSessionTimeZone("kolkata");
        await createCourse.setMaxSeat();
        await createCourse.enterDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    });

    test(`Enroll learner in first course instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS03 - Step 3: Enroll Learner` },
            { type: `Test Description`, description: `Enroll learner in the first course instance` }
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

    test(`Verify cannot transfer learner to instance of different course`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS03 - Step 4: Verify Transfer Restriction` },
            { type: `Test Description`, description: `Verify that system prevents transferring learner to instance of another course` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await enrollHome.wait("mediumWait");
        
        // Click Transfer Enrollment option
        await enrollHome.clickTransferEnrollmentOption();
        
        // Search for the first course
        await enrollHome.searchCourseForTransfer(course1Name);
        
    
    });

});
