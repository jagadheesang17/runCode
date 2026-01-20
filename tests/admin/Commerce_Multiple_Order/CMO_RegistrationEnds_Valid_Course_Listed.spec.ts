import { test } from '../../../customFixtures/expertusFixture';
import { expect } from '@playwright/test';
import { FakerData } from '../../../utils/fakerUtils';
import { generateOauthToken } from '../../../api/accessToken';
import { userCreation } from '../../../api/userAPI';
import { userCreationData } from '../../../data/apiData/formData';

const courseName = `RegEnds Valid - ${FakerData.getCourseName()}`;
let testUser: string;

test.describe('Commerce Multiple Order - Registration Ends valid course listed', () => {
  test('Setup: Create test learner via API', async () => {
    const accessToken = await generateOauthToken();
    const authorization = { Authorization: accessToken };
    const base = Date.now();
    testUser = `regends_user_${base}`;

    const userId = await userCreation(userCreationData(testUser), authorization);
    expect(userId).toBeTruthy();
    console.log(`✅ Test user created: ${testUser}`);
  });

  test('Create priced E-learning course with future Registration End date', async ({ adminHome, createCourse }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'CMO_RegEnds_Valid_Course_Creation' },
      { type: 'Test Description', description: 'Create priced E-learning course with valid (future) Registration End date' }
    );

    console.log(`📚 Creating course: ${courseName}`);
    console.log(`📅 Registration End Date: Tomorrow (VALID)`);
    
    await adminHome.loadAndLogin('CUSTOMERADMIN');
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();
    
    // Create E-learning course
    await createCourse.clickCreateCourse();
    await createCourse.verifyCreateUserLabel('CREATE COURSE');
    await createCourse.enter('course-title', courseName);
    await createCourse.selectLanguage('English');
    await createCourse.typeDescription('E-learning course with valid Registration End date for Create Order testing');
    
    // Set Registration End Date to TOMORROW (future date - valid for enrollment)
    console.log(`✅ Setting Registration End Date to tomorrow (VALID)`);
    await createCourse.clickregistrationEnds();
    console.log(`✅ Registration End Date set to tomorrow - enrollments allowed`);
    
    // Set price
    await createCourse.enterPrice("150");
    await createCourse.selectCurrency();
    console.log(`✅ Price set to $150`);
    
    // Complete course creation
    await createCourse.handleCategoryADropdown();
    await createCourse.providerDropdown();
    await createCourse.selectTotalDuration();
    await createCourse.typeAdditionalInfo();
    
    // Add content
    await createCourse.contentLibrary();
    
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    
    console.log(`✅ E-learning course created successfully`);
    console.log(`📊 Course Details:`);
    console.log(`   - Name: ${courseName}`);
    console.log(`   - Registration End Date: Tomorrow (VALID)`);
    console.log(`   - Price: $150`);
    console.log(`   - Type: E-learning`);
    console.log(`   - Status: Available for enrollment`);
  });

  test('Verify course with valid Registration End date IS listed in Create Order and enroll learner', async ({ adminHome, enrollHome, costCenter }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'CMO_RegEnds_Valid_Listed_In_Create_Order' },
      { type: 'Test Description', description: 'Verify course with valid Registration End date appears in Create Order and complete enrollment' }
    );

    console.log(`🔍 Verifying course with valid Registration End date IS visible in Create Order`);
    await adminHome.loadAndLogin('CUSTOMERADMIN');
    await adminHome.menuButton();
    await adminHome.clickEnrollmentMenu();
    await enrollHome.clickEnroll();
    
    // Navigate to Create Order
    console.log(`📝 Opening Create Order enrollment option`);
    await enrollHome.selectEnrollmentOption('Create Order');
    await enrollHome.clickOnMultipleLearner();
    await enrollHome.selectByOption('Course');
    
    // Search for course with valid registration end date - should BE visible
    console.log(`🔍 Searching for course: ${courseName}`);
    await enrollHome.searchUser(courseName);
    
    // Verify course IS listed
    await enrollHome.wait("mediumWait");
    const courseCheckbox = enrollHome.page.locator(`//div[contains(text(),'${courseName}')]`);
    const checkboxVisible = await courseCheckbox.isVisible({ timeout: 10000 }).catch(() => false);
    
    if (checkboxVisible) {
      console.log(`✅ PASS: Course with valid Registration End date "${courseName}" IS listed in Create Order`);
      
      // Select the course
      await enrollHome.clickOnfirstCheckboxInEnrollmenPage();
      console.log(`✅ Course selected successfully`);
      
      await enrollHome.clickSelectedLearner();
      
      // Select test learner
      console.log(`👤 Selecting learner: ${testUser}`);
      await enrollHome.enterSearchUser(testUser);
      await enrollHome.wait("minWait");
      
      // Select the learner checkbox
      await enrollHome.clickLearnerchkboxByIndex(1);
      console.log(`✅ Learner selected: ${testUser}`);
      
      // Proceed to checkout
      await enrollHome.checkout();
      console.log("💳 Proceeding to checkout...");
      
      // Select domain and complete billing
      await enrollHome.selectDomainForCheckout("automationtenant");
      await costCenter.billingDetails("United States", "Alaska");
      console.log("✅ Billing details completed");
      
      // Calculate tax and approve order
      await costCenter.calculateTax();
      console.log("✅ Tax calculated");
      
      await costCenter.orderApproval();
      console.log("✅ Order approved successfully");
      
      console.log(`✅ VERIFICATION COMPLETE: Admin can successfully add course to Create Order`);
      console.log(`📊 Summary:`);
      console.log(`   - Course: ${courseName}`);
      console.log(`   - Registration End: Tomorrow (VALID)`);
      console.log(`   - Listed in Create Order: YES ✅`);
      console.log(`   - Admin can enroll: YES ✅`);
      console.log(`   - Learner enrolled: ${testUser}`);
      console.log(`   - Price: $150`);
      console.log(`   - Order Status: Completed ✅`);
    } else {
      throw new Error(`❌ FAIL: Course with valid Registration End date "${courseName}" should be visible in Create Order but was NOT found`);
    }
  });
});
