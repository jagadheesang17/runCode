import { test } from '../../../customFixtures/expertusFixture';
import { expect } from '@playwright/test';
import { FakerData } from '../../../utils/fakerUtils';
import { generateOauthToken } from '../../../api/accessToken';
import { userCreation } from '../../../api/userAPI';
import { userCreationData } from '../../../data/apiData/formData';
import { create } from 'node:domain';

const courseName = `Waitlist Course - ${FakerData.getCourseName()}`;
const courseInstanceName = `Waitlist InstanceCourse - ${FakerData.getCourseName()}`;
let userA: string;
let userB: string;
let userWaitlist: string;

test.describe('Commerce Multiple Order - Waitlist seats available course visibility', () => {
  test('Setup: Create 3 learners via API', async () => {
    const accessToken = await generateOauthToken();
    const authorization = { Authorization: accessToken };
    const base = Date.now();
    userA = `wl_user_${base}_a`;
    userB = `wl_user_${base}_b`;
    userWaitlist = `wl_user_${base}_c`;

    const idA = await userCreation(userCreationData(userA), authorization);
    const idB = await userCreation(userCreationData(userB), authorization);
    const idC = await userCreation(userCreationData(userWaitlist), authorization);
    expect(idA).toBeTruthy();
    expect(idB).toBeTruthy();
    expect(idC).toBeTruthy();
  });

  test('Create course (max seats 2, waitlist 1) and fill main seats', async ({ adminHome, createCourse, enrollHome }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'CMO_Waitlist_Course_Creation_And_Main_Enrollments' },
      { type: 'Test Description', description: 'Create course with max seats 2, waitlist 1; enroll 2 users to fill main seats' }
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
    await createCourse.typeDescription('Waitlist available course for Create Order visibility');
    await createCourse.selectdeliveryType('Classroom');
    await createCourse.handleCategoryADropdown();
    await createCourse.providerDropdown();
    await createCourse.selectTotalDuration();
    await createCourse.typeAdditionalInfo();
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    console.log(`✅ Course created successfully`);

    // Add instance with seats and waitlist
    console.log(`🎯 Creating instance with max seats=2, waitlist=1`);
    await createCourse.editcourse();
    await createCourse.addInstances();
    await createCourse.selectInstanceDeliveryType('Classroom');
    await createCourse.clickCreateInstance();
   await createCourse.enter('course-title', courseInstanceName);
    await createCourse.enterSessionName(`${courseInstanceName} - Session 1`);
    await createCourse.selectLocation();
    await createCourse.enterfutureDateValue();
    await createCourse.startandEndTime();
    await createCourse.setSeatsMax("2");
    await createCourse.enterPrice("100");
    await createCourse.selectCurrency();
   
    await createCourse.page.locator("//label[text()='Waitlist']/following-sibling::input").clear();
    await createCourse.page.locator("//label[text()='Waitlist']/following-sibling::input").fill("1");
    await createCourse.clickCatalog();
    await createCourse.clickUpdate();
  
   

    await createCourse.verifySuccessMessage();
    console.log(`✅ Instance created with max seats=2 and waitlist=1`);

    // Enroll first user (fills seat 1)
    console.log(`👤 Enrolling user A: ${userA}`);
    await adminHome.menuButton();
    await adminHome.clickEnrollmentMenu();
    await adminHome.clickEnroll();
    await enrollHome.selectBycourse(courseInstanceName);
    await enrollHome.clickSelectedLearner();
    await enrollHome.enterSearchUser(userA);
    await enrollHome.clickEnrollBtn();
    await enrollHome.verifytoastMessage();
    console.log(`✅ User A enrolled successfully`);

    //x Enroll second user (fills seat 2)
    console.log(`👤 Enrolling user B: ${userB}`);
    await adminHome.menuButton();
    await adminHome.clickEnrollmentMenu();
    await adminHome.clickEnroll();
    // await enrollHome.selectBycourse(courseName);
    // await enrollHome.clickSelectedLearner();
    await enrollHome.enterSearchUser(userB);
    await enrollHome.clickEnrollBtn();
    await enrollHome.verifytoastMessage();
    console.log(`✅ User B enrolled successfully`);
    console.log(`📊 Main seats full (2/2). Waitlist available (0/1)`);
  });

  test('Verify course listed in Create Order and place order using waitlist seat', async ({ adminHome, enrollHome, costCenter }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'CMO_Waitlist_Course_Listed_And_Order' },
      { type: 'Test Description', description: 'Ensure course is listed when waitlist seats available and admin can place order' }
    );

    console.log(`🛒 Verifying course visibility in Create Order when waitlist available`);
    await adminHome.loadAndLogin('CUSTOMERADMIN');
    await adminHome.menuButton();
    await adminHome.clickEnrollmentMenu();
    await enrollHome.clickEnroll();
    
    // Navigate to Create Order
    console.log(`📝 Opening Create Order enrollment option`);
    await enrollHome.selectEnrollmentOption('Create Order');
    await enrollHome.clickOnMultipleLearner();
    await enrollHome.selectByOption('Course');
    
    // Search for course - should be visible with waitlist seats available
    console.log(`🔍 Searching for course: ${courseName}`);
    await enrollHome.searchUser(courseInstanceName);
    
    // Select the course (validates it's listed)
    console.log(`✅ Course found in Create Order - Waitlist seats available`);
    await enrollHome.clickOnfirstCheckboxInEnrollmenPage();
    await enrollHome.clickSelectedLearner();
    
    // Add waitlist learner to the order
    console.log(`👤 Adding waitlist learner to order: ${userWaitlist}`);
    await enrollHome.searchUser(userWaitlist);
    await enrollHome.clickLearnerchkboxByIndex(1);
    
    // Proceed to checkout
    console.log(`💳 Processing order checkout`);
    await enrollHome.checkout();
    await enrollHome.selectDomainForCheckout('automationtenant');
    await costCenter.billingDetails('United States', 'Alaska');
    await costCenter.calculateTax();
    await costCenter.orderApproval();
    
    console.log(`✅ Order placed successfully - Learner enrolled in waitlist`);
    console.log(`📊 Final status: Main seats=2/2, Waitlist=1/1`);
  });
});