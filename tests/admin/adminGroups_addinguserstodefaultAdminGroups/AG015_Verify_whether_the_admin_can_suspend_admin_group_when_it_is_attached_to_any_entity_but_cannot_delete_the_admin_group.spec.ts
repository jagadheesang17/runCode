import { create } from "domain";
import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { Page } from '@playwright/test';

let adminGroupTitle: string;
let adminRoleName: string;
let courseName: string;
const description = FakerData.getDescription()

test.describe(`AG015 - Admin Group Course Assignment: Suspend vs Delete Restrictions`, async () => {
    test.describe.configure({ mode: 'serial' });

    test.beforeAll(async () => {
        // Generate unique test data without using stored data
        const uniqueId = Math.floor(Math.random() * 100000);
        adminGroupTitle = `AdminGroup_QA_Automation_${uniqueId}`;
        adminRoleName = `AdminRole_QA_Automation_${uniqueId}`;
        courseName = `Course_QA_TestSuite_${uniqueId}`;

        console.log(`Test will use group: ${adminGroupTitle}`);
        console.log(`Test will use role: ${adminRoleName}`);
        console.log(`Test will use course: ${courseName}`);
    });

    test(`Step 1: Create admin role with full privileges`, async ({ adminHome, adminRoleHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `AG015_Step1_Create_Admin_Role` },
            { type: `Test Description`, description: `Create a custom admin role with all privileges for the test admin group` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickAdminRole();
        await adminRoleHome.clickAddAdminRole();
        await adminRoleHome.enterName(adminRoleName);
        await adminRoleHome.clickAllPriveileges();
        await adminRoleHome.clickSave();
        
        console.log(`Admin role '${adminRoleName}' created successfully`);
        
    });

    test(`Step 2: Create admin group with the created role`, async ({ adminHome, adminGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `AG015_Step2_Create_Admin_Group` },
            { type: `Test Description`, description: `Create a custom admin group using the created admin role` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");

        // Create the admin group
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.adminGroup();
        await adminGroup.clickCreateGroup();
        await adminGroup.enterGroupTitle(adminGroupTitle);
        await adminGroup.selectroleAdmin(adminRoleName);
        await adminGroup.clickActivate();
        await adminGroup.clickSave();
        await adminGroup.clickProceed();
        console.log("Proceed dialog not present, continuing...");
    });

    test(`Step 3: Create course and assign admin group to it`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `AG015_Step3_Create_Course_And_Assign_Admin_Group` },
            { type: `Test Description`, description: `Create a course and assign the created admin group to it to establish entity dependency` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name :" + description);
        await createCourse.contentLibrary('Passed-Failed-SCORM2004');
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

        await createCourse.editcourse()
        await editCourse.clickAccesstab();
        console.log(`Assigning admin group '${adminGroupTitle}' to course '${courseName}'`);
        await editCourse.addAdminGroup(adminGroupTitle);
        await editCourse.saveAccess();
        await createCourse.clickCatalog();
        await createCourse.typeDescription("This is a new course by name :" + description);
        await editCourse.clickUpdate();
        console.log(`Course '${courseName}' created and admin group '${adminGroupTitle}' assigned successfully`);
    });

    test(`Step 4: Suspend admin group that is assigned to course`, async ({ adminHome, adminGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `AG015_Step4_Suspend_Admin_Group_Assigned_To_Course` },
            { type: `Test Description`, description: `Suspend the admin group that is assigned to a course - this should be allowed even with course assignment` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.adminGroup();
        await adminGroup.searchAdmin(adminGroupTitle);
        await adminGroup.clickGroup(adminGroupTitle);
        await adminGroup.clickSuspend();
        await adminGroup.clickYes();

        console.log(`PASS: Admin group '${adminGroupTitle}' successfully suspended while assigned to course '${courseName}'`);
    });

    test(`Step 5: Verify delete button is disabled for suspended group assigned to course`, async ({ adminHome, adminGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `AG015_Step5_Verify_Delete_Button_Disabled_For_Course_Assigned_Group` },
            { type: `Test Description`, description: `Verify that delete button is disabled for admin group assigned to course, even when group is suspended` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();   
        await adminHome.people();
        await adminHome.adminGroup();
        await adminGroup.searchAdmin(adminGroupTitle);
        await adminGroup.clickGroup(adminGroupTitle);
        await adminGroup.editAdminGroup(adminGroupTitle);
        // Verify delete button is disabled due to course assignment
        await adminGroup.verifyDeleteButtonDisabled();


    });
});