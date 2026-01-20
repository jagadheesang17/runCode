import { test } from '../../../customFixtures/expertusFixture';
import { FakerData } from '../../../utils/fakerUtils';

const nonPricedCourseName = `Non-Priced Course - ${FakerData.getCourseName()}`;

test.describe('Commerce Multiple Order - Non-priced Course visibility', () => {
  test('Create a non-priced course (no price set)', async ({ adminHome, createCourse, contentHome }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'CMO_NonPriced_Course_Creation' },
      { type: 'Test Description', description: 'Create an E-Learning course without price for listing check' }
    );

    await adminHome.loadAndLogin('CUSTOMERADMIN');
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();
    await createCourse.clickCreateCourse();
    await createCourse.verifyCreateUserLabel('CREATE COURSE');
    await createCourse.enter('course-title', nonPricedCourseName);
    await createCourse.selectLanguage('English');
    await createCourse.typeDescription('Non-priced course for commerce listing negative test');
    await createCourse.contentLibrary();
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    await contentHome.gotoListing();
  });

  test('Verify non-priced course is not listed in Create Order search', async ({ adminHome, enrollHome }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'CMO_NonPriced_Course_Not_Listed' },
      { type: 'Test Description', description: 'Ensure non-priced course does not appear in Create Order search' }
    );

    await adminHome.loadAndLogin('CUSTOMERADMIN');
    await adminHome.menuButton();
    await adminHome.clickEnrollmentMenu();
    await enrollHome.clickEnroll();
    await enrollHome.selectEnrollmentOption('Create Order');
    await enrollHome.clickOnMultipleLearner();
    await enrollHome.selectByOption('Course');
    // Search the non-priced course and verify no results are listed
    await enrollHome.searchUser(nonPricedCourseName);
    await enrollHome.verifyDedicatedTPCourseNotFound(nonPricedCourseName);
  });
});