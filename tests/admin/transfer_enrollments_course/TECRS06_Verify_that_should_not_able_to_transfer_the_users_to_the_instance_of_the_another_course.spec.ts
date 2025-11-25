import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";

const course1Name = FakerData.getCourseName();
const course2Name = FakerData.getCourseName();
const instanceName1 = FakerData.getCourseName()+"ILT1";
const instanceName2 = FakerData.getCourseName()+"ILT2";
const instanceName3 = FakerData.getCourseName()+"ILT3";
const description = FakerData.getDescription();
const instructorName = credentials.INSTRUCTORNAME.username;
let course1Instance1Name: string;
let course1Instance2Name: string;
let course2Instance1Name: string;

test.describe.serial(`TECRS06 - Verify cannot transfer users to instance of another course`, async () => {

    test(`Create first course with two instances`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS06 - Step 1: Create First Course with Two Instances` },
            { type: `Test Description`, description: `Create first course with two ILT instances` }
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
        
        // Add first instance to Course 1
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", instanceName1);
        course1Instance1Name = FakerData.getSession();
        await createCourse.enterSessionName(course1Instance1Name);
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
        
        // Add second instance to Course 1
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", instanceName2);
        course1Instance2Name = FakerData.getSession();
        await createCourse.enterSessionName(course1Instance2Name);
        await createCourse.setMaxSeat();
        await createCourse.enterDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.wait("mediumWait");
        
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    });

    test(`Create second course with one instance`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS06 - Step 2: Create Second Course with One Instance` },
            { type: `Test Description`, description: `Create second course with one ILT instance` }
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
        await createCourse.selectdeliveryType("Classroom");
        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown();
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.clickEditCourseTabs();
        
        // Add instance to Course 2
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", instanceName3);
        course2Instance1Name = FakerData.getSession();
        await createCourse.enterSessionName(course2Instance1Name);
        await createCourse.setMaxSeat();
        await createCourse.enterDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    });

    test(`Enroll learner in first instance of Course 1`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS06 - Step 3: Enroll Learner` },
            { type: `Test Description`, description: `Enroll learner in first instance of Course 1` }
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

    test(`Verify cannot transfer learner to instance of Course 2`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS06 - Step 4: Verify Transfer Restriction` },
            { type: `Test Description`, description: `Verify that learner cannot be transferred from Course 1 to instance of Course 2` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");
        
        await enrollHome.selectEnrollmentOption("Transfer Enrollment - Course");
        
        // Search for Course 1
        await enrollHome.searchCourseForTransfer(course1Name);
        await enrollHome.selectSourceInstance(instanceName1);        
        // Select the learner
        await enrollHome.selectTargetInstance(instanceName3);
        
        
        
    });

});
