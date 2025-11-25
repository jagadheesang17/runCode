import { test } from '../../../customFixtures/expertusFixture';
import { expect } from "allure-playwright";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from '../../../constants/credentialData';
import { createILTMultiInstance } from '../../../api/apiTestIntegration/courseCreation/createCourseAPI';

test.describe.serial('DTP003 - Verify Enable disable Course And Class Level', () => {

    const courseName = "Haptic Driver Back up";//FakerData.getCourseName();
    console.log("Course Name: " + courseName);
    
    test("DTP003a - Verify that dedicated to tp rule is greyed out and remain in checked state in the class level when it is applied at the course level", async ({ adminHome, createCourse, editCourse, learningPath, enrollHome }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DTP003a_dedicated to tp applied at the course level' },
            { type: 'Test Description', description: 'Verify that dedicated to tp rule when it is applied at the course & Test level' }
        );

        // await createILTMultiInstance(courseName, 'published', 2);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.catalogSearch(courseName);
        await createCourse.editCourseFromListingPage();
        await editCourse.clickBusinessRule();
        await editCourse.checkDedicatedToTP();
        await editCourse.clickBusinessRule();

        await createCourse.clickEditInstance();
        await editCourse.clickBusinessRule();
        //checkbox should be disabled and checked
        console.log("Verifying Dedicated to TP checkbox state in Instance Level");
        await editCourse.verifyDedicatedToCheckBox("Disabled", "Checked");
        await editCourse.clickBusinessRule();
        console.log("DTP004a - Verified that dedicated to tp rule is greyed out and remain in checked state in the class level when it is applied at the course level");
   
    });

    test("DTP003b - Verify that dedicated to tp rule is greyed out and remain in unchecked state in the course level when it is applied at the class level", async ({ adminHome, createCourse, editCourse, learningPath }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DTP003b_dedicated to tp applied at the class level' },
            { type: 'Test Description', description: 'Verify that dedicated to tp rule is greyed out and remain in unchecked state in the course level when it is applied at the class level' }
        );
    

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.catalogSearch(courseName);
        await createCourse.editCourseFromListingPage();
        await editCourse.clickBusinessRule();
        await editCourse.unCheckDedicatedToTP();
        await editCourse.clickBusinessRule();

        await createCourse.clickEditInstance();
        await editCourse.clickBusinessRule();
        await editCourse.checkDedicatedToTP("Instance");
        await editCourse.clickBusinessRule();

        await createCourse.clickCourseFromInstance();
        await editCourse.clickBusinessRule();
        //checkbox should be disabled and unchecked
        console.log("Verifying Dedicated to TP checkbox state in Course Level");
        await editCourse.verifyDedicatedToCheckBox("Disabled", "Unchecked");

    });
});