import { test } from '../../../customFixtures/expertusFixture';
import { expect } from "allure-playwright";
import { FakerData } from '../../../utils/fakerUtils';
import { createCourseAPI } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { LearnerLogin } from '../../../pages/LearnerLogin';

test.describe.serial('DTP001 - Enrollment Restrictions for Dedicated to TP Courses', () => {

    const courseName = FakerData.getCourseName();
    const learnerUsername = 'test_learner';

    test("DTP001a - Verify cannot enroll through course edit page", async ({ adminHome, createCourse, editCourse, enrollHome, catalog }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DTP001a_Cannot_Enroll_List_Page' },
            { type: 'Test Description', description: 'Verify that cannot enroll dedicated to TP course through list page' }
        );

        const content = 'content testing-001';
        const result = await createCourseAPI(content, courseName, 'published', 'single', 'e-learning');
        expect(result).toBe(courseName);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.catalogSearch(courseName);
        await createCourse.editCourseFromListingPage();
        await editCourse.clickBusinessRule();
        await editCourse.checkDedicatedToTP();
        await editCourse.clickEnrollments();
        await enrollHome.selectEnroll();
        await enrollHome.verifyDedicatedToTPWarningMessage();
    });

    //admin - manage enrollments
    test("DTP001b - Verify cannot enroll through Manage enrollments", async ({ adminHome, createCourse, enrollHome }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DTP001b_Cannot_Enroll_Manage_Enrollments' },
            { type: 'Test Description', description: 'Verify that cannot enroll dedicated to TP course through Manage enrollments' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.verifyDedicatedTPCourseNotFound(courseName);
        
    });

    test("DTP001c -  Verify that could not able to enroll the course through list page", async ({ learnerHome, universalSearch, enrollHome }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DTP001c_Cannot_Enroll_List_Page' },
            { type: 'Test Description', description: 'Verify that cannot enroll dedicated to TP course through list page' }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");  
        await universalSearch.univSearch(courseName);
        await universalSearch.verifyDedicatedTPCourseNotDisplayed();


    });

});
