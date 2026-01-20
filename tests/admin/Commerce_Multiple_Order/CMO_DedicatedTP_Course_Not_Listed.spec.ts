import { test } from '../../../customFixtures/expertusFixture';
import { expect } from 'allure-playwright';
import { FakerData } from '../../../utils/fakerUtils';
import { createCourseAPI } from '../../../api/apiTestIntegration/courseCreation/createCourseAPI';

const dedicatedTPCourseName = `DedicatedTP Course - ${FakerData.getCourseName()}`;

test.describe('Commerce Multiple Order - Dedicated to TP Course visibility', () => {
  test('Create course and mark as Dedicated to TP', async ({ adminHome, page,createCourse, editCourse }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'CMO_DedicatedTP_Course_Creation' },
      { type: 'Test Description', description: 'Create an E-Learning course and enable Dedicated to TP flag' }
    );

    await adminHome.loadAndLogin('CUSTOMERADMIN');
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();
    await createCourse.clickCreateCourse();
    await createCourse.verifyCreateUserLabel('CREATE COURSE');
    await createCourse.enter('course-title', dedicatedTPCourseName);
    await createCourse.selectLanguage('English');
    await createCourse.typeDescription('Dedicated to TP visibility negative test');
    await createCourse.contentLibrary();
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    await createCourse.navigateToListingAndSearchCourse(dedicatedTPCourseName);

    await editCourse.clickBusinessRule();
    await editCourse.checkDedicatedToTP();

  });

  test('Verify Dedicated to TP course not listed in Create Order search', async ({ adminHome, enrollHome }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'CMO_DedicatedTP_Course_Not_Listed' },
      { type: 'Test Description', description: 'Ensure Dedicated to TP course does not appear in Create Order search' }
    );

    await adminHome.loadAndLogin('CUSTOMERADMIN');
    await adminHome.menuButton();
    await adminHome.clickEnrollmentMenu();
    await enrollHome.clickEnroll();
    await enrollHome.selectEnrollmentOption('Create Order');
    await enrollHome.clickOnMultipleLearner();
    await enrollHome.selectByOption('Course');
    await enrollHome.searchUser(dedicatedTPCourseName);
    await enrollHome.verifyDedicatedTPCourseNotFound(dedicatedTPCourseName);
    await enrollHome.verifyNoResult();
  });
}); 