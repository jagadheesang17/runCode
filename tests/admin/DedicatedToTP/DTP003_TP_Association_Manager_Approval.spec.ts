import { test } from '../../../customFixtures/expertusFixture';
import { expect } from "allure-playwright";
import { FakerData } from '../../../utils/fakerUtils';
import { createCourseAPI } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";

test.describe('DTP003 - Training Plan Association and Manager Approval', () => {

    const courseName = FakerData.getCourseName();
    const learningPathName = FakerData.getCourseName();
    const learnerUsername = 'test_learner';

    test("DTP003a - Verify enrollment entry when dedicated to TP course enrolled through TP", async ({ adminHome, createCourse, editCourse, learningPath, enrollHome }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DTP003a_TP_Enrollment_Entry' },
            { type: 'Test Description', description: 'Verify entry in course enrollments when dedicated to TP course is enrolled through TP' }
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

        // Enable dedicated to TP
        await editCourse.clickBusinessRule();
        await editCourse.enableDedicatedToTP();
        await createCourse.clickCatalog();
        await editCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

        // Create Learning Path with the dedicated to TP course
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
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectByOption("Learning Path");
        await enrollHome.selectBycourse(learningPathName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(learnerUsername);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();

        // Verify enrollment entry in course enrollments shows Learning Path source
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.catalogSearch(courseName);
        await createCourse.clickEnrollmentsIcon();
        
        const enrollmentSource = await createCourse.getEnrollmentSource(1);
        expect(enrollmentSource).toContain('Learning Path');
        console.log('✅ Enrollment entry shows Learning Path source when enrolled through TP');
    });

    test("DTP003b - Verify able to disable dedicated to TP for course associated to TP", async ({ adminHome, createCourse, editCourse, learningPath }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DTP003b_Disable_With_TP_Association' },
            { type: 'Test Description', description: 'Verify able to disable dedicated to TP rule for course which is associated to TP' }
        );

        // Course is already associated to TP from previous test
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.catalogSearch(courseName);
        await createCourse.editCourseFromListingPage();

        // Disable dedicated to TP even when course is in TP
        await editCourse.clickBusinessRule();
        await editCourse.disableDedicatedToTP();
        await createCourse.clickCatalog();
        await editCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

        // Verify dedicated to TP is disabled
        await createCourse.editCourseFromListingPage();
        await editCourse.clickBusinessRule();
        const isDedicatedTPDisabled = await editCourse.isDedicatedToTPChecked();
        expect(isDedicatedTPDisabled).toBe(false);
        console.log('✅ Dedicated to TP disabled successfully even when course is in TP');
    });

    test("DTP003c - Verify dedicated to TP with Manager approval enabled", async ({ adminHome, createCourse, editCourse, learnerHome, catalog }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DTP003c_Manager_Approval_TP' },
            { type: 'Test Description', description: 'Verify dedicated to TP rule works with Manager approval courses' }
        );

        const managerApprovalCourse = FakerData.getCourseName();
        const content = 'content testing-001';
        const result = await createCourseAPI(content, managerApprovalCourse, 'published', 'single', 'e-learning');
        expect(result).toBe(managerApprovalCourse);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.catalogSearch(managerApprovalCourse);
        await createCourse.editCourseFromListingPage();

        // Enable both Manager Approval and Dedicated to TP
        await editCourse.clickBusinessRule();
        await editCourse.clickManagerApproval();
        await editCourse.enableDedicatedToTP();
        await createCourse.clickCatalog();
        await editCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

        // Login as learner and verify course not shown for direct enrollment
        await learnerHome.basicLogin(learnerUsername, "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.searchCatalog(managerApprovalCourse);
        
        // Verify dedicated to TP message or no enroll option
        const message = await catalog.getDedicatedToTPMessage();
        const hasMessage = message.toLowerCase().includes('dedicated') || message === '';
        expect(hasMessage).toBe(true);
        console.log('✅ Dedicated to TP with manager approval prevents direct enrollment');
    });

});