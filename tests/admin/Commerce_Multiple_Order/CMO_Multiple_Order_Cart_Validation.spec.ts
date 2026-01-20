import { test } from '../../../customFixtures/expertusFixture';
import { expect } from '@playwright/test';
import { generateOauthToken } from '../../../api/accessToken';
import { userCreation } from '../../../api/userAPI';
import { userCreationData } from '../../../data/apiData/formData';
import { FakerData } from '../../../utils/fakerUtils';

const courseName = `Commerce Cart Validation - ${FakerData.getCourseName()}`;

const user1Username = `cart_user_1_${Date.now()}`;
const user2Username = `cart_user_2_${Date.now()}`;

test.describe('Commerce Multiple Order - Cart Item Count Validation', () => {
  test('Create 2 users via API', async () => {
    const accessToken = await generateOauthToken();
    const authorization = { Authorization: accessToken };

    const userId1 = await userCreation(userCreationData(user1Username), authorization);
    expect(userId1).toBeTruthy();
    console.log("✅ Created User 1:", { id: userId1, username: user1Username });

    const userId2 = await userCreation(userCreationData(user2Username), authorization);
    expect(userId2).toBeTruthy();
    console.log("✅ Created User 2:", { id: userId2, username: user2Username });
  });

  test('Create priced E-Learning course for cart validation', async ({ adminHome, createCourse }) => {
    const description = FakerData.getDescription();

    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'CMO_Cart_Validation_Course_Creation' },
      { type: 'Test Description', description: 'Create E-Learning course for cart count validation' }
    );

    console.log(`📚 Creating course: ${courseName}`);
    await adminHome.loadAndLogin('CUSTOMERADMIN');
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();
    await createCourse.clickCreateCourse();

    await createCourse.verifyCreateUserLabel('CREATE COURSE');
    await createCourse.enter('course-title', courseName);
    await createCourse.selectLanguage('English');
    await createCourse.typeDescription('Commerce cart validation course: ' + description);

    // Set price and currency to make this a paid course
    await createCourse.enterPrice('100');
    await createCourse.selectCurrency();
    console.log("✅ Price set to $100");

    // Attach content and set catalog visibility
    await createCourse.contentLibrary();
    await createCourse.clickCatalog();

    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();

    console.log(`✅ Course created: ${courseName}`);
  });

  test('Create order and verify cart count displays 2', async ({ adminHome, enrollHome, costCenter, page }) => {
    test.info().annotations.push(
      { type: `Author`, description: `QA Automation Team` },
      { type: `TestCase`, description: `CMO_Cart_Count_Validation` },
      { type: `Test Description`, description: `Verify cart displays correct item count (2) before calculating tax` }
    );

    console.log(`🛒 Creating multiple order for course: ${courseName}`);
    await adminHome.loadAndLogin("CUSTOMERADMIN");
    await adminHome.menuButton();
    await adminHome.clickEnrollmentMenu();
    console.log("✅ Navigated to Enrollment Menu");
    
    await enrollHome.clickEnroll();
    await enrollHome.selectEnrollmentOption("Create Order");
    console.log("✅ Selected Create Order enrollment option");
    
    await enrollHome.clickOnMultipleLearner();
    await enrollHome.selectByOption('Course');
    console.log("✅ Selected enrollment by Course");
    
    // Search and select the course
    console.log(`🔍 Searching for course: ${courseName}`);
    await enrollHome.searchUser(courseName);
    await enrollHome.clickOnfirstCheckboxInEnrollmenPage();
    console.log(`✅ Course selected: ${courseName}`);
    
    // Proceed to learner selection
    await enrollHome.clickSelectedLearner();
    console.log("👥 Adding 2 learners to order...");
    
    // Add both learners
    let i = 1;
    for (const username of [user1Username, user2Username]) {
      await enrollHome.searchUser(username);
      await enrollHome.clickLearnerchkboxByIndex(i);
      console.log(`✅ Selected learner ${i}: ${username}`);
      i++;
    }
    
    console.log(`✅ All 2 learners added to order`);
    
    // Proceed to checkout
    await enrollHome.checkout();
    console.log("💳 Proceeding to checkout...");
    
    // Select domain and complete billing
    await enrollHome.selectDomainForCheckout("automationtenant");
    await costCenter.billingDetails("United States", "Alaska");
    console.log("✅ Billing details completed");
    
    // VERIFY CART COUNT SHOWS '2' BEFORE CALCULATING TAX
    console.log("🔍 Verifying cart item count displays '2'...");
    const cartCountLocator = page.locator("//span[text()='2']");
    
    // Wait for the element to be visible
    await cartCountLocator.waitFor({ state: 'visible', timeout: 10000 });
    const isVisible = await cartCountLocator.isVisible();
    
    if (isVisible) {
      console.log("✅ PASS: Cart count '2' is visible");
      const cartCountText = await cartCountLocator.textContent();
      console.log(`✅ Cart item count displayed: ${cartCountText}`);
      expect(cartCountText).toBe('2');
      console.log("✅ Cart count validation successful!");
      await costCenter.page.locator("//span[text()='2']").click();
      await costCenter.page.locator("(//button[text()='Close'])[1]").click();
    
    } else {
      throw new Error("❌ FAIL: Cart count '2' is NOT visible before tax calculation");
    }
    
    // Calculate tax and approve order
    await costCenter.calculateTax();
    console.log("✅ Tax calculated");
    
    await costCenter.orderApproval();
    console.log("✅ Order approved successfully");
    
    console.log(`\n📊 Order Summary:`);
    console.log(`   - Course: ${courseName}`);
    console.log(`   - Price per learner: $100`);
    console.log(`   - Total learners: 2`);
    console.log(`   - Cart item count: 2 ✅`);
    console.log(`   - Learner 1: ${user1Username}`);
    console.log(`   - Learner 2: ${user2Username}`);
    console.log(`✅ Cart validation and order completed successfully!`);
  });
});
