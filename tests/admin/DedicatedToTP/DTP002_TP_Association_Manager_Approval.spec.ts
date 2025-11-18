import { test } from '../../../customFixtures/expertusFixture';
import { expect } from "allure-playwright";
import { FakerData } from '../../../utils/fakerUtils';
import { createCourseAPI } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { credentials } from '../../../constants/credentialData';

test.describe('DTP003 - Training Plan Association and Manager Approval', () => {

    const courseName = FakerData.getCourseName();
    const learningPathName = FakerData.getCourseName();

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


        // Create Learning Path with the dedicated to TP course
        await adminHome.page.reload();
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

        // Verify enrollment entry in course enrollments shows Learning Path source
        await adminHome.page.reload();
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();

        await adminHome.clickCourseLink();
        await createCourse.catalogSearch(courseName);
        await createCourse.editCourseFromListingPage();
        await editCourse.clickEnrollments();
        await editCourse.verifyNewEnrollmentEntry();

        
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
        
        // Disable dedicated to TP - should be allowed
        await editCourse.clickBusinessRule();
        const disableResult = await editCourse.disableDedicatedToTP();
        expect(disableResult).toBe(true);
        console.log('✅ Verified: Successfully disabled Dedicated to TP even when course is associated with Learning Path');
        
        // Verify dedicated to TP is now disabled
        const isDedicatedTPDisabled = await editCourse.isDedicatedToTPChecked();
        expect(isDedicatedTPDisabled).toBe(false);
        console.log('✅ Verified: Dedicated to TP is now unchecked');
    });
});