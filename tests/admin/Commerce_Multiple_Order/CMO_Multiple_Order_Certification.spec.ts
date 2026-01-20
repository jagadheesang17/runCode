import { test } from '../../../customFixtures/expertusFixture';
import { expect } from '@playwright/test';
import { generateOauthToken } from '../../../api/accessToken';
import { userCreation } from '../../../api/userAPI';
import { userCreationData } from '../../../data/apiData/formData';
import { FakerData } from '../../../utils/fakerUtils';

const certTitle = `Commerce Order Certification - ${FakerData.getCourseName()}`;
const structureCourseName = `Commerce Cert Course - ${FakerData.getCourseName()}`;
const user1Username = `api_cert_user_1_${Date.now()}`;
const user2Username = `api_cert_user_2_${Date.now()}`;
const user3Username = `api_cert_user_3_${Date.now()}`;

test.describe('Commerce Multiple Order - Certification Setup', () => {
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

  test('Create a Certification for ordering (priced, with course in structure)', async ({ adminHome, learningPath, createCourse }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'CMO_Certification_Creation' },
      { type: 'Test Description', description: 'Create a certification to use in multiple order flow' }
    );

    await adminHome.loadAndLogin('CUSTOMERADMIN');
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();

    // First, create a simple E-Learning course to attach into certification structure
    await adminHome.clickCourseLink();
    await createCourse.clickCreateCourse();
    await createCourse.verifyCreateUserLabel('CREATE COURSE');
    await createCourse.enter('course-title', structureCourseName);
    await createCourse.selectLanguage('English');
    await createCourse.typeDescription('Course for certification structure attachment');
    await createCourse.contentLibrary();
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    await createCourse.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCertification();
    await learningPath.clickCreateCertification();
    await learningPath.title(certTitle);
    await learningPath.description(" certification structure attachment");
    await learningPath.language();
    // Price and currency for paid certification
    await learningPath.enterPrice();
    await learningPath.clickCurrency();
    await learningPath.clickSave();
    await learningPath.clickProceedBtn();
    await learningPath.clickAddCourse();
    await learningPath.searchAndClickCourseCheckBox(structureCourseName);
    await learningPath.clickAddSelectCourse();
    await learningPath.clickDetailTab();
    await learningPath.clickCatalogBtn();
    await learningPath.clickUpdateBtn();
    await learningPath.verifySuccessMessage();
   


})

  test('Multiple order by Certification', async ({ adminHome, enrollHome, costCenter }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'CMO_Multiple_Order_Certification' },
      { type: 'Test Description', description: 'Setup multiple order with 3 users by certification' }
    );

    await adminHome.loadAndLogin('CUSTOMERADMIN');
    await adminHome.menuButton();
    await adminHome.clickEnrollmentMenu();
    await enrollHome.clickEnroll();
    await enrollHome.selectEnrollmentOption('Create Order');
    await enrollHome.clickOnMultipleLearner();
    await enrollHome.selectByOption('Certification');
    await enrollHome.searchUser(certTitle);
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
    console.log('Completed multiple order setup for 3 users by certification.');
  });
});