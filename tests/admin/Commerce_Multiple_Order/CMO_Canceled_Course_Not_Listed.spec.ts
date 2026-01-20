import { test } from '../../../customFixtures/expertusFixture';
import { expect } from '@playwright/test';
import { FakerData } from '../../../utils/fakerUtils';
import { generateOauthToken } from '../../../api/accessToken';
import { userCreation } from '../../../api/userAPI';
import { userCreationData } from '../../../data/apiData/formData';

const courseName = `Canceled Course - ${FakerData.getCourseName()}`;
const courseInstanceName = `Canceled Course - ${FakerData.getCourseName()}`;

let testUser: string;

test.describe('Commerce Multiple Order - Canceled course should not be listed', () => {
  test('Setup: Create test learner via API', async () => {
    const accessToken = await generateOauthToken();
    const authorization = { Authorization: accessToken };
    const base = Date.now();
    testUser = `cancel_user_${base}`;

    const userId = await userCreation(userCreationData(testUser), authorization);
    expect(userId).toBeTruthy();
    console.log(`✅ Test user created: ${testUser}`);
  });

  test('Create priced course with instance', async ({ adminHome, createCourse }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'CMO_Canceled_Course_Creation' },
      { type: 'Test Description', description: 'Create priced classroom course with future instance' }
    );

    console.log(`📚 Creating course: ${courseName}`);
    await adminHome.loadAndLogin('CUSTOMERADMIN');
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();
    
    // Create course
    await createCourse.clickCreateCourse();
    await createCourse.verifyCreateUserLabel('CREATE COURSE');
    await createCourse.enter('course-title', courseName);
    await createCourse.selectLanguage('English');
    await createCourse.typeDescription('Priced course for cancellation testing in Create Order');
    await createCourse.selectdeliveryType('Classroom');
    await createCourse.handleCategoryADropdown();
    await createCourse.providerDropdown();
    await createCourse.selectTotalDuration();
    await createCourse.typeAdditionalInfo();
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    console.log(`✅ Course created successfully`);

    // Add instance with price
    console.log(`🎯 Creating instance with price`);
    await createCourse.editcourse();
    await createCourse.addInstances();
    await createCourse.selectInstanceDeliveryType('Classroom');
    await createCourse.clickCreateInstance();
    await createCourse.enter('course-title', courseInstanceName);
    await createCourse.enterSessionName(`${courseInstanceName} - Session 1`);
    await createCourse.selectLocation();
    await createCourse.enterfutureDateValue();
    await createCourse.startandEndTime();
    await createCourse.setSeatsMax("10");
    await createCourse.enterPrice("150");
    await createCourse.selectCurrency();
    await createCourse.clickCatalog();
    await createCourse.clickUpdate();
    await createCourse.verifySuccessMessage();
    console.log(`✅ Priced instance created successfully`);
  });

  test('Cancel the course instance', async ({ adminHome, createCourse }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'CMO_Cancel_Course_Instance' },
      { type: 'Test Description', description: 'Cancel the course instance and verify cancellation' }
    );

    console.log(`🚫 Canceling course instance: ${courseName}`);
    await adminHome.loadAndLogin('CUSTOMERADMIN');
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();
    
    // Search and edit course
    await createCourse.catalogSearch(courseName);
    await createCourse.clickEditIcon();
    
    // Navigate to instances and cancel
    // await createCourse.clickEditCourseTabs();
    await createCourse.wait("mediumWait");
    await createCourse.clickEditInstance()
    // Cancel the course
    await createCourse.cancelCourse("Course no longer available - testing cancellation in Create Order");
    console.log(`✅ Course instance canceled successfully`);
  });

  test('Verify canceled course NOT listed in Create Order', async ({ adminHome, enrollHome }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'CMO_Canceled_Course_Not_In_Create_Order' },
      { type: 'Test Description', description: 'Verify that canceled course does not appear in Create Order' }
    );

    console.log(`🔍 Verifying canceled course is NOT visible in Create Order`);
    await adminHome.loadAndLogin('CUSTOMERADMIN');
    await adminHome.menuButton();
    await adminHome.clickEnrollmentMenu();
    await enrollHome.clickEnroll();
    
    // Navigate to Create Order
    console.log(`📝 Opening Create Order enrollment option`);
    await enrollHome.selectEnrollmentOption('Create Order');
    await enrollHome.clickOnMultipleLearner();
    await enrollHome.selectByOption('Course');
    
    // Search for canceled course - should NOT be visible
    console.log(`🔍 Searching for canceled course: ${courseInstanceName}`);
    await enrollHome.searchUser(courseInstanceName);
    
    // Verify course is not listed
    await enrollHome.wait("mediumWait");
    const courseCheckbox = enrollHome.page.locator(`//input[@type='checkbox']`).first();
    const checkboxCount = await enrollHome.page.locator(`//input[@type='checkbox']`).count();
    
    if (checkboxCount === 0) {
      console.log(`✅ PASS: Canceled course "${courseName}" is NOT listed in Create Order (no courses found)`);
    } else {
      // Verify the course name is not in the results
      const courseVisible = await enrollHome.page.locator(`//div[contains(text(),'${courseName}')]`).isVisible().catch(() => false);
      
      if (!courseVisible) {
        console.log(`✅ PASS: Canceled course "${courseName}" is NOT listed in Create Order`);
      } else {
        throw new Error(`❌ FAIL: Canceled course "${courseName}" should NOT be visible in Create Order but was found`);
      }
    }
    
    console.log(`📊 Verification complete: Canceled courses are properly excluded from Create Order`);
  });

 
});
