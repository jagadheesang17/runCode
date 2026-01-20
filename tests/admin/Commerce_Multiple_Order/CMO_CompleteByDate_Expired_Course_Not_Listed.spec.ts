import { test } from '../../../customFixtures/expertusFixture';
import { expect } from '@playwright/test';
import { FakerData, getPastDate } from '../../../utils/fakerUtils';
import { generateOauthToken } from '../../../api/accessToken';
import { userCreation } from '../../../api/userAPI';
import { userCreationData } from '../../../data/apiData/formData';

const courseName = `CompleteBy Expired - ${FakerData.getCourseName()}`;
let testUser: string;

test.describe('Commerce Multiple Order - Complete By Date expired course not listed', () => {
  test('Setup: Create test learner via API', async () => {
    const accessToken = await generateOauthToken();
    const authorization = { Authorization: accessToken };
    const base = Date.now();
    testUser = `completeby_user_${base}`;

    const userId = await userCreation(userCreationData(testUser), authorization);
    expect(userId).toBeTruthy();
    console.log(`✅ Test user created: ${testUser}`);
  });

  test('Create priced E-learning course with past Complete By date', async ({ adminHome, createCourse }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'CMO_CompleteBy_Expired_Course_Creation' },
      { type: 'Test Description', description: 'Create priced E-learning course with past Complete By date' }
    );

    const pastDate = getPastDate();
    console.log(`📚 Creating course: ${courseName}`);
    console.log(`📅 Complete By Date (PAST): ${pastDate}`);
    
    await adminHome.loadAndLogin('CUSTOMERADMIN');
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();
    
    // Create E-learning course
    await createCourse.clickCreateCourse();
    await createCourse.verifyCreateUserLabel('CREATE COURSE');
    await createCourse.enter('course-title', courseName);
    await createCourse.selectLanguage('English');
    await createCourse.typeDescription('E-learning course with expired Complete By date for Create Order testing');
    
    // Configure Complete By settings
    console.log(`⚠️ Configuring Complete By Date to past: ${pastDate}`);
   // await createCourse.clickregistrationEnds();
    await createCourse.selectCompleteByRule();
    console.log(`✅ Complete By Rule set to Yes`);
    
    // Set Complete By Date to PAST date
    await createCourse.wait("minWait");
    await createCourse.page.locator("#complete_by_date-input").waitFor({ state: 'visible', timeout: 10000 });
    await createCourse.page.locator("#complete_by_date-input").clear();
    await createCourse.page.locator("#complete_by_date-input").fill(pastDate);
    console.log(`✅ Complete By Date set to: ${pastDate}`);
    
    // Set Post Complete By Status to Overdue
    await createCourse.selectPostCompletebyOverDue();
    console.log(`✅ Post Complete By Status set to Overdue`);
    
    // Set price
    await createCourse.enterPrice("200");
    await createCourse.selectCurrency();
    console.log(`✅ Price set to $200`);
    
    // // Complete course creation
    // await createCourse.handleCategoryADropdown();
    // await createCourse.providerDropdown();
    // await createCourse.selectTotalDuration();
    // await createCourse.typeAdditionalInfo();
    
    // Add content
    await createCourse.contentLibrary();
    
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    
    console.log(`✅ E-learning course created successfully`);
    console.log(`📊 Course Details:`);
    console.log(`   - Name: ${courseName}`);
    console.log(`   - Complete By Date: ${pastDate} (EXPIRED)`);
    console.log(`   - Price: $200`);
    console.log(`   - Type: E-learning`);
  });

  test('Verify expired Complete By course NOT listed in Create Order', async ({ adminHome, enrollHome }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'CMO_CompleteBy_Expired_Not_In_Create_Order' },
      { type: 'Test Description', description: 'Verify course with expired Complete By date does not appear in Create Order' }
    );

    console.log(`🔍 Verifying expired Complete By course is NOT visible in Create Order`);
    await adminHome.loadAndLogin('CUSTOMERADMIN');
    await adminHome.menuButton();
    await adminHome.clickEnrollmentMenu();
    await enrollHome.clickEnroll();
    
    // Navigate to Create Order
    console.log(`📝 Opening Create Order enrollment option`);
    await enrollHome.selectEnrollmentOption('Create Order');
    await enrollHome.clickOnMultipleLearner();
    await enrollHome.selectByOption('Course');
    
    // Search for expired Complete By course - should NOT be visible
    console.log(`🔍 Searching for expired course: ${courseName}`);
    await enrollHome.searchUser(courseName);
    
    // Verify course is not listed
    await enrollHome.wait("mediumWait");
    const checkboxCount = await enrollHome.page.locator(`//input[@type='checkbox']`).count();
    
    if (checkboxCount === 0) {
      console.log(`✅ PASS: Course with expired Complete By date "${courseName}" is NOT listed in Create Order (no courses found)`);
    } else {
      // Verify the course name is not in the results
      const courseVisible = await enrollHome.page.locator(`//div[contains(text(),'${courseName}')]`).isVisible().catch(() => false);
      
      if (!courseVisible) {
        console.log(`✅ PASS: Course with expired Complete By date "${courseName}" is NOT listed in Create Order`);
      } else {
        throw new Error(`❌ FAIL: Course with expired Complete By date "${courseName}" should NOT be visible in Create Order but was found`);
      }
    }
    
    console.log(`📊 Verification complete: Courses with expired Complete By dates are properly excluded from Create Order`);
    console.log(`📅 Complete By Date: ${getPastDate()} (EXPIRED)`);
  });

 
});
