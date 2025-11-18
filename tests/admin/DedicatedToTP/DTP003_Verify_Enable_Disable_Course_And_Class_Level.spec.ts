import { test } from '../../../customFixtures/expertusFixture';
import { expect } from "allure-playwright";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from '../../../constants/credentialData';
import { createILTMultiInstance } from '../../../api/apiTestIntegration/courseCreation/createCourseAPI';

test.describe('DTP004 - Verify Enable disable Course And Class Level', () => {

    const courseName = FakerData.getCourseName();
    const instructorName = credentials.INSTRUCTORNAME.username;
    
    test("DTP004a - Verify that dedicated to tp rule when it is applied at the course & Test level", async ({ adminHome, createCourse, editCourse, learningPath, enrollHome }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DTP004a_TP_Enrollment_Entry' },
            { type: 'Test Description', description: 'Verify that dedicated to tp rule when it is applied at the course & Test level' }
        );
        console.log("Course Name: " + courseName);
        await createILTMultiInstance(courseName, 'published', 2);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.catalogSearch(courseName);
        await createCourse.editCourseFromListingPage();
        await editCourse.clickBusinessRule();
        await editCourse.enableDedicatedToTP();
        await editCourse.clickBusinessRule();

           
    });

    // test("DTP003b - Verify able to disable dedicated to TP for course associated to TP", async ({ adminHome, createCourse, editCourse, learningPath }) => {
        
    //     test.info().annotations.push(
    //         { type: 'Author', description: 'Kathir A' },
    //         { type: 'TestCase', description: 'DTP003b_Disable_With_TP_Association' },
    //         { type: 'Test Description', description: 'Verify able to disable dedicated to TP rule for course which is associated to TP' }
    //     );

    
    // });
});