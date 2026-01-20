import { test } from '../../../customFixtures/expertusFixture';
import { expect } from '@playwright/test';
import { generateOauthToken } from '../../../api/accessToken';
import { userCreation } from '../../../api/userAPI';
import { userCreationData } from '../../../data/apiData/formData';
import { FakerData } from '../../../utils/fakerUtils';

const lpTitle = `Commerce Order Learning Path - ${FakerData.getCourseName()}`;
const structureCourseName = `LP Structure Course - ${FakerData.getCourseName()}`;
const user1Username = `api_lp_user_1_${Date.now()}`;
const user2Username = `api_lp_user_2_${Date.now()}`;
const user3Username = `api_lp_user_3_${Date.now()}`;

test.describe('Commerce Multiple Order - Learning Path Setup', () => {
  test('Create 3 users via API and store usernames', async () => {
    const accessToken = await generateOauthToken();
    const authorization = { Authorization: accessToken };

    const userId1 = await userCreation(userCreationData(user1Username), authorization);
    expect(userId1).toBeTruthy();
    console.log('Created User 1:', { id: userId1, username: user1Username });

    const userId2 = await userCreation(userCreationData(user2Username), authorization);
    expect(userId2).toBeTruthy();
    console.log('Created User 2:', { id: userId2, username: user2Username });

    const userId3 = await userCreation(userCreationData(user3Username), authorization);
    expect(userId3).toBeTruthy();
    console.log('Created User 3:', { id: userId3, username: user3Username });
  });

  test('Create a Learning Path for ordering (priced, with course in structure)', async ({ adminHome, learningPath, createCourse }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'CMO_LearningPath_Creation' },
      { type: 'Test Description', description: 'Create a learning path to use in multiple order flow' }
    );

    await adminHome.loadAndLogin('CUSTOMERADMIN');
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();

    // First, create a simple E-Learning course to attach into learning path structure
    await adminHome.clickCourseLink();
    await createCourse.clickCreateCourse();
    await createCourse.verifyCreateUserLabel('CREATE COURSE');
    await createCourse.enter('course-title', structureCourseName);
    await createCourse.selectLanguage('English');
    await createCourse.typeDescription('Course for learning path structure attachment');
    await createCourse.contentLibrary();
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    await createCourse.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickLearningPath();

    // Create Learning Path (Training Plan), attach course, set price and currency
    await learningPath.clickCreateLearningPath();
    await learningPath.title(lpTitle);
    await learningPath.language();
    await learningPath.description('Automated learning path for commerce order flow');
    await learningPath.enterPrice();
    await learningPath.clickCurrency();
    await learningPath.clickSave();
    await learningPath.clickProceedBtn();
    await learningPath.clickAddCourse();
    await learningPath.searchAndClickCourseCheckBox(structureCourseName);
    await learningPath.clickAddSelectCourse();
    await learningPath.clickDetailTab();
    await learningPath.clickCatalogBtn();
    await learningPath.clickSave();
    //await learningPath.clickProceedBtn();
    await learningPath.verifySuccessMessage();

    console.log('Created learning path for multi-order:', lpTitle);
    console.log('Attached course to learning path structure:', structureCourseName);
  });

  test('Multiple order by Learning Path', async ({ adminHome, enrollHome, costCenter }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'CMO_Multiple_Order_LearningPath' },
      { type: 'Test Description', description: 'Setup multiple order with 3 users by learning path' }
    );

    await adminHome.loadAndLogin('CUSTOMERADMIN');
    await adminHome.menuButton();
    await adminHome.clickEnrollmentMenu();
    await enrollHome.clickEnroll();
    await enrollHome.selectEnrollmentOption('Create Order');
    await enrollHome.clickOnMultipleLearner();
    // Use Search by option appropriate for training plans/learning paths
    await enrollHome.selectByOption('Learning Path');
    await enrollHome.searchUser(lpTitle);
    await enrollHome.clickOnfirstCheckboxInEnrollmenPage();
    await enrollHome.clickSelectedLearner();

    let i = 1;
    for (const username of [user1Username, user2Username, user3Username]) {
      await enrollHome.searchUser(username);
      await enrollHome.clickLearnerchkboxByIndex(i);
      console.log(`Selected user: ${username}`);
      i++;
    }

    await enrollHome.checkout();
    await enrollHome.selectDomainForCheckout('automationtenant');
    await costCenter.billingDetails('United States', 'Alaska');
    await costCenter.calculateTax();
    await costCenter.orderApproval();
    console.log('Completed multiple order setup for 3 users by learning path.');
  });
});