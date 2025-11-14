import { test } from '../../../customFixtures/expertusFixture';
import { expect } from "allure-playwright";
import { FakerData } from '../../../utils/fakerUtils';
import { createCourseAPI } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";

test.describe('DTP001 - Enable/Disable Dedicated to TP', () => {

    const courseName = FakerData.getCourseName();
    const className = FakerData.getCourseName();

    test("DTP001a - Enable and disable dedicated to TP at course level", async ({ adminHome, createCourse, editCourse }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DTP001a_Course_Level_Dedicated_TP' },
            { type: 'Test Description', description: 'Verify able to enable and disable dedicated to TP at course level' }
        );

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

        // Enable dedicated to TP at course level
        await editCourse.clickBusinessRule();
        await editCourse.enableDedicatedToTP();
        await createCourse.clickCatalog();
        await editCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        
        // Verify dedicated to TP is enabled
        await createCourse.editCourseFromListingPage();
        await editCourse.clickBusinessRule();
        const isDedicatedTPEnabled = await editCourse.isDedicatedToTPChecked();
        expect(isDedicatedTPEnabled).toBe(true);
        console.log('✅ Dedicated to TP enabled at course level');

        // Disable dedicated to TP
        await editCourse.disableDedicatedToTP();
        await createCourse.clickCatalog();
        await editCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        
        // Verify dedicated to TP is disabled
        await createCourse.editCourseFromListingPage();
        await editCourse.clickBusinessRule();
        const isDedicatedTPDisabled = await editCourse.isDedicatedToTPChecked();
        expect(isDedicatedTPDisabled).toBe(false);
        console.log('✅ Dedicated to TP disabled at course level');
    });

    test("DTP001b - Enable and disable dedicated to TP at class level", async ({ adminHome, createCourse, editCourse }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DTP001b_Class_Level_Dedicated_TP' },
            { type: 'Test Description', description: 'Verify able to enable and disable dedicated to TP at class level' }
        );

        // TODO: Added by Me - Create ILT/VILT course with class
        // const content = 'content testing-001';
        // const result = await createCourseAPI(content, className, 'published', 'single', 'instructor-led');
        // expect(result).toBe(className);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        
        // Navigate to class and enable dedicated to TP
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.catalogSearch(className);
        await createCourse.clickInstancesIcon();
        await createCourse.clickEditInstance();

        // Enable dedicated to TP at class level
        await editCourse.clickBusinessRule();
        await editCourse.enableDedicatedToTP();
        await editCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        
        // Verify dedicated to TP is enabled at class level
        await createCourse.clickEditInstance();
        await editCourse.clickBusinessRule();
        const isDedicatedTPEnabled = await editCourse.isDedicatedToTPChecked();
        expect(isDedicatedTPEnabled).toBe(true);
        console.log('✅ Dedicated to TP enabled at class level');

        // Disable dedicated to TP at class level
        await editCourse.disableDedicatedToTP();
        await editCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        
        // Verify dedicated to TP is disabled at class level
        await createCourse.clickEditInstance();
        await editCourse.clickBusinessRule();
        const isDedicatedTPDisabled = await editCourse.isDedicatedToTPChecked();
        expect(isDedicatedTPDisabled).toBe(false);
        console.log('✅ Dedicated to TP disabled at class level');
    });

});
