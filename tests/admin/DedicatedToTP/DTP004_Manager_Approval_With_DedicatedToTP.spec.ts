import { test } from '../../../customFixtures/expertusFixture';
import { expect } from "allure-playwright";
import { FakerData } from '../../../utils/fakerUtils';
import { createCourseAPI } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { create } from 'domain';
import { Console } from 'console';

test.describe.serial('DTP004 - Manager Approval with Dedicated to TP', () => {

    const courseName = FakerData.getCourseName();
    console.log("Course Name: " + courseName);

    test("DTP004a - Single Elearning instance with Manager Approval Enabled to Check Dedicated to TP", async ({ adminHome, createCourse, editCourse }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DTP004a_Set_Manager_Approval_Course' },
            { type: 'Test Description', description: 'Verify that able to set Manager approval courses' }
        );

        // Create course via API
        const content = 'content testing-001';
        const result = await createCourseAPI(content, courseName, 'published', 'single', 'e-learning');
        expect(result).toBe(courseName);
        console.log(`✅ Course created: "${courseName}"`);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.catalogSearch(courseName);
        await createCourse.editCourseFromListingPage();

        await editCourse.clickManagerApproval();
        await editCourse.verifyapprovaluserType("Internal Users");
        await editCourse.verifyinternalManager("Direct Manager");
        await editCourse.verifyapprovaluserType("External Users");
        await editCourse.verifyinternalManager("Direct Manager");
        await editCourse.saveApproval();
        await createCourse.typeDescription("  Added Manager Approval");
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    });

    test("DTP004b - Verify course visible on Learner side when Dedicated to TP is unchecked", async ({ learnerHome, catalog,universalSearch }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DTP004b_Course_Not_Shown_In_Learner_Catalog' },
            { type: 'Test Description', description: 'Verify that Manager approval course with Dedicated to TP is not shown in learner catalog for request approval' }
        );

        await learnerHome.learnerLogin("TEAMUSER1", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(courseName);
        await catalog.clickMoreonCourse(courseName);
        
        await catalog.clickSelectcourse(courseName);
        await catalog.clickRequestapproval();
        await catalog.submitRequest();

        console.log(`✅ Verified: Manager Approval course "${courseName}" is visible to learner and can request approval when Dedicated to TP is unchecked`);
    });
    
    test("DTP004c - Verify able to set Dedicated to TP for Manager Approval course", async ({ adminHome, createCourse, editCourse }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DTP004c_Set_DedicatedToTP_For_Manager_Approval_Course' },
            { type: 'Test Description', description: 'Verify that able to set dedicated to TP rule to Manager approval courses' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.catalogSearch(courseName);
        await createCourse.editCourseFromListingPage();
      
        await editCourse.clickBusinessRule();
        await editCourse.checkDedicatedToTP();
        await editCourse.clickBusinessRule();

        await editCourse.clickBusinessRule();
        await editCourse.verifyDedicatedToCheckBox("Enabled", "Checked");
        console.log('✅ Verified: Successfully set Dedicated to TP for Manager Approval course');
    });

    test("DTP004d - Verify course not shown in learner catalog", async ({ learnerHome, catalog,universalSearch }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DTP004d_Course_Not_Shown_In_Learner_Catalog' },
            { type: 'Test Description', description: 'Verify course not shown in learner catalog for request approval' }
        );

        await learnerHome.learnerLogin("TEAMUSER1", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(courseName);
        await universalSearch.verifyDedicatedTPCourseNotDisplayed();
        console.log(`✅ Verified: Learner is not able to see the Manager Approval course "${courseName}" marked as Dedicated to TP for approval request`);
    });

    test("DTP004e - Ensure that the manager is Not able to approve the given request After applied Dedicated to TP rule", async ({ learnerHome, catalog, universalSearch }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DTP004e_Cannot_Request_Approval' },
            { type: 'Test Description', description: 'Verify that learner cannot request approval for course marked as Dedicated to TP' }
        );
        await learnerHome.learnerLogin("MANAGERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(courseName);
        await universalSearch.verifyDedicatedTPCourseNotDisplayed();
        console.log(`✅ Verified: Manager is not able to see the Manager Approval course "${courseName}" marked as Dedicated to TP for approval request`);
    });


});
