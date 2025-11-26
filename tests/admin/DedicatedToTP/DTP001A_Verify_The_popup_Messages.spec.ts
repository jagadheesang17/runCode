import { test } from '../../../customFixtures/expertusFixture';
import { expect } from "allure-playwright";
import { FakerData } from '../../../utils/fakerUtils';
import { createCourseAPI } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { LearnerLogin } from '../../../pages/LearnerLogin';
import { credentials } from '../../../constants/credentialData';

test.describe.serial('DTP001 A - Enrollment Restrictions for Dedicated to TP Courses', () => {

    const courseName = FakerData.getCourseName();
    const learnerUsername = 'test_learner';
    const learningPathName = FakerData.getCourseName();


 test("DTP001a - Verify cannot enroll through Manage enrollments", async ({ adminHome, createCourse, enrollHome,editCourse }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DTP001a_Cannot_Enroll_Manage_Enrollments' },
            { type: 'Test Description', description: 'Verify that cannot enroll dedicated to TP course through Manage enrollments' }
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


     test("DTP001b - Verify Admin can view the Course in View/update Status - Course/TP Menu", async ({ adminHome, learningPath, enrollHome }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DTP001a_Can View_Manage_Enrollments' },
            { type: 'Test Description', description: 'Verify that view dedicated to TP course through Manage enrollments View/update Status - Course/TP' }
        );

         
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
        await learningPath.title(learningPathName);
        await learningPath.description(FakerData.getDescription());
        await learningPath.language();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        
        // Enroll learner to Learning Path
        await adminHome.page.reload();
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectByOption("Learning Path");
        await enrollHome.selectBycourse(learningPathName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();

        await adminHome.page.reload();
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(courseName);       
        await enrollHome.clickViewLearner();
    });

});


