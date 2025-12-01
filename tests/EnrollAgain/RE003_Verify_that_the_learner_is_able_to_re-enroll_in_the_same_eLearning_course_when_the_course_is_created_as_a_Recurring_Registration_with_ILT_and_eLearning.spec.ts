import { expect } from "@playwright/test";
import { test } from "../../customFixtures/expertusFixture";
import { FakerData, getRandomSeat } from "../../utils/fakerUtils";
import { credentials } from "../../constants/credentialData";


const courseName = FakerData.getCourseName();
const vcCourseName = "Virtual Class " + FakerData.getCourseName();
const elCourseName = "E-Learning " + FakerData.getCourseName();
const description = FakerData.getDescription();
const instructorName = credentials.INSTRUCTORNAME.username;
let tag: any;
test.describe(`RE003 Verify learner can re-enroll in eLearning course with recurring registration (VC + eLearning)`, async () => {
    test.describe.configure({ mode: 'serial' })

    test(`Verify_Allow_Learners_To_Enroll_Again_Default_Checked_In_SiteAdmin`, async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify Allow learners to enroll again (default) is checked in Site Admin` },
            { type: `Test Description`, description: `Verify that 'Allow learners to enroll again (default)' checkbox is checked in Site Admin Business Rules` }
        );
        
        // Step 1: Login as Customer Admin
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        
        // Step 2: Navigate to Site Admin -> Admin Configuration -> Business Rules
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await adminHome.siteAdmin_Adminconfig();
        await siteAdmin.clickBusinessRulesEditIcon();
        
        // Step 3: Verify 'Allow learners to enroll again (default)' checkbox is checked
        await siteAdmin.verifyAllowLearnersEnrollAgainDefault(false);
        
        // Step 4: If unchecked, check it
        await siteAdmin.checkAllowLearnersEnrollAgainDefault();
    });

    test(`Create VC and E-Learning multi-instance course with recurring registration`, async ({ createCourse, adminHome, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `RE003_Create_VC_eLearning_multi_instance_course` },
            { type: `Test Description`, description: `Create VC and E-Learning multi-instance course with recurring registration enabled` }
        );
        // Step 1: Login as Customer Admin
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        
        // Step 2: Navigate to Courses and create new course
        await adminHome.clickMenu("Course");
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        
        // Step 3: Fill course basic information
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("VC/E-Learning recurring registration test: " + description);
        
        // Step 4: Select Virtual Class delivery type for multi-instance base
        await createCourse.selectdeliveryType("Virtual Class");
        // Step 5: Save course
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        
        // Step 7: Add Virtual Class (VC) instance
        await createCourse.clickEditCourseTabs();
        await createCourse.addInstances();
        
        async function addinstance(deliveryType: string) {
            await createCourse.selectInstanceDeliveryType(deliveryType);
            await createCourse.clickCreateInstance();
        }
        
        await addinstance("Virtual Class");
        await createCourse.enter("course-title", vcCourseName);
        await createCourse.selectMeetingType(instructorName, courseName, 1);
        await createCourse.typeAdditionalInfo();
        await createCourse.setMaxSeat();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        
        console.log("Virtual Class (VC) instance created successfully");
        
        // Step 8: Add E-Learning instance
        await createCourse.editcourse();
        await createCourse.clickinstanceClass();
        await createCourse.addInstances();
        await addinstance("E-Learning");
        await createCourse.enter("course-title", elCourseName);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        
        console.log("E-Learning instance created successfully");
        
        // Step 9: Enable recurring registration in Business Rules
        await createCourse.editcourse();
        await editCourse.clickBusinessRule();
        
        // Step 10: Verify 'Allow learners to enroll again' checkbox is checked (inherited from Site Admin)
        await editCourse.verifyAllowLearnersEnrollAgain(false);
        
        // Step 11: Ensure checkbox is enabled
        await editCourse.checkAllowLearnersEnrollAgain();
        await createCourse.typeDescription("VC/E-Learning recurring registration test: " + description);
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        
        console.log("VC/E-Learning multi-instance course created with recurring registration enabled: " + courseName);
    })

    test(`Verify learner can enroll again in eLearning instance with recurring registration`, async ({ learnerHome, learnerCourse, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `RE003_Learner_enroll_again_verification` },
            { type: `Test Description`, description: `Verify that learner can enroll again in eLearning course with recurring registration (VC + eLearning)` }
        );
        // Step 1: Learner login
        await learnerHome.learnerLogin("LEARNERUSERNAME", "Portal");
        
         // Step 2: Navigate to Catalog
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        
        // Step 3: Search and enroll in the course
        await catalog.searchCatalog(courseName);
        await catalog.clickMoreonCourse(courseName);
        await catalog.clickSelectcourse(elCourseName);
        await catalog.clickEnroll();
        
        // Step 4: Complete the E-Learning course (first time)
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        
        console.log("First enrollment completed successfully");
        
        // Step 5: Click Enroll Again button
        await learnerCourse.clickReEnroll();
         // Step 7: Verify and confirm enroll again popup
        await learnerCourse.reEnrollPopup();
        
        await catalog.verifyStatus("Enrolled");
        
        console.log("Successfully enrolled again and completed the course - recurring registration verified");

    })

})