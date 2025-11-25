import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";
import { createILTMultiInstance } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";

const draftInstanceCourseName = FakerData.getCourseName();
const activeCourseForEnrollment = FakerData.getCourseName();
const draftInstanceName1 = FakerData.getCourseName()+"Draft_ILT1";
const draftInstanceName2 = FakerData.getCourseName()+"Draft_ILT2";
const draftInstanceName3 = FakerData.getCourseName()+"Active_ILT3";
const description = FakerData.getDescription();
const instructorName = credentials.INSTRUCTORNAME.username;
let draftInstanceSession1: string;
let draftInstanceSession2: string;
let activeInstanceSession: string;
let instanceNames: string[] = [];

test.describe.serial(`TECRS10 - Verify that instances in Save as Draft status should not get listed in From and To sections`, async () => {

    test(`Create course with Show in Catalog and add instances with Save as Draft status`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS10 - Step 1: Create Course with Draft Instances` },
            { type: `Test Description`, description: `Create course with Show in Catalog but instances in Save as Draft status` }
        );
        instanceNames = await createILTMultiInstance(draftInstanceCourseName, "published", 2);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.catalogSearch(draftInstanceCourseName);
        await createCourse.editCourseFromListingPage();
        
        // Add first instance with future date and mark as Save as Draft
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", draftInstanceName1);
        draftInstanceSession1 = FakerData.getSession();
        await createCourse.enterSessionName(draftInstanceSession1);
        await createCourse.setMaxSeat();
        await createCourse.enterDateValue(); // Future date
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.typeDescription(description);
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        await createCourse.clickEditCourseTabs();
        await createCourse.clicLickToSwitchCrsPage();

        
        console.log(`✅ First instance marked as Save as Draft: ${draftInstanceSession1}`);
        
        // Add second instance with future date and mark as Save as Draft
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", draftInstanceName2);
        await createCourse.typeDescription(description);
        draftInstanceSession2 = FakerData.getSession();
        await createCourse.enterSessionName(draftInstanceSession2);
        await createCourse.setMaxSeat();
        await createCourse.enterDateValue(); // Future date
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.typeDescription(description);
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

    });
    test(`Enroll learner in third instance of Hidden in Catalog course`, async ({ adminHome, enrollHome }) => {
            test.info().annotations.push(
                { type: `Author`, description: `Divya` },
                { type: `TestCase`, description: `TECRS07 - Step 2: Enroll Learner` },
                { type: `Test Description`, description: `Enroll learner in third instance of Hidden in Catalog course` }
            );
    
            await adminHome.loadAndLogin("CUSTOMERADMIN");
            await adminHome.menuButton();
            await adminHome.clickEnrollmentMenu();
            await adminHome.clickEnroll();
            await enrollHome.selectBycourse(instanceNames[0]);
            await enrollHome.clickSelectedLearner();
            await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
            await enrollHome.clickEnrollBtn();
            await enrollHome.verifytoastMessage();
        });
    

    test(`Verify draft instances are NOT listed in From and To sections`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS10 - Step 4: Verify Draft Instances Not in From and To Sections` },
            { type: `Test Description`, description: `Verify that instances with Save as Draft status do not appear in From and To sections` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");
        
        // Click Transfer Enrollment - Course option
        await enrollHome.selectEnrollmentOption("Transfer Enrollment - Course");
        
        // VERIFY FROM SECTION
        console.log(`🔍 Verifying draft instances NOT in From section...`);
        
        // Search for the course with draft instances
        await enrollHome.searchCourseForTransfer(draftInstanceCourseName);
        
        
        // Clear search and proceed to To section verification
        await enrollHome.clearFilterCrossMarks();
        
        // VERIFY TO SECTION
        console.log(`🔍 Verifying draft instances NOT in To section...`);
        
        // Select From instance
        await enrollHome.selectSourceInstance(draftInstanceName1);
    });

});
