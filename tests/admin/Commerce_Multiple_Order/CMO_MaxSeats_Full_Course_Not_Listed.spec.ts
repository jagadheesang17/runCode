import { test } from '../../../customFixtures/expertusFixture';
import { expect } from '@playwright/test';
import { FakerData } from '../../../utils/fakerUtils';
import { generateOauthToken } from '../../../api/accessToken';
import { userCreation } from '../../../api/userAPI';
import { userCreationData } from '../../../data/apiData/formData';

const courseName = `MaxSeats Course - ${FakerData.getCourseName()}`;
let userA: string;
let userB: string;

test.describe('Commerce Multiple Order - Max seats full course visibility', () => {
  test('Setup: Create 2 learners via API', async () => {
    const accessToken = await generateOauthToken();
    const authorization = { Authorization: accessToken };
    const uniqueSuffix = Date.now();
    userA = `ms_user_${uniqueSuffix}_a`;
    userB = `ms_user_${uniqueSuffix}_b`;

    const userIdA = await userCreation(userCreationData(userA), authorization);
    expect(userIdA).toBeTruthy();
    const userIdB = await userCreation(userCreationData(userB), authorization);
    expect(userIdB).toBeTruthy();
  });

  test('Create course with max seats 2 and enroll 2 learners', async ({ adminHome, createCourse, enrollHome }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'CMO_MaxSeats_Course_Creation_And_Enrollment' },
      { type: 'Test Description', description: 'Create course with max seats 2, enroll 2 users to fill seats' }
    );

    await adminHome.loadAndLogin('CUSTOMERADMIN');
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();
    await createCourse.clickCreateCourse();
    await createCourse.verifyCreateUserLabel('CREATE COURSE');
    await createCourse.enter('course-title', courseName);
    await createCourse.selectLanguage('English');
    await createCourse.typeDescription('Max seats course for non-listing when full');
    // Switch to ILT (Classroom) and create a class session
    await createCourse.selectdeliveryType('Classroom');
    await createCourse.addInstances();
    await createCourse.selectInstanceDeliveryType('Classroom');
    await createCourse.enterSessionName(`${courseName} - Session 1`);
    await createCourse.selectLocation();
    // Set max seats to 2 at instance level (copy variant)
    await createCourse.setMaxSeat_Copy();
    // Attach content and save
    await createCourse.contentLibrary();
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    console.log('Created max seats course:', courseName);
    await adminHome.menuButton();
    // Enroll first user
    await adminHome.clickEnrollmentMenu();
    await adminHome.clickEnroll();
    await enrollHome.selectBycourse(courseName);
    await enrollHome.clickSelectedLearner();
    await enrollHome.enterSearchUser(userA);
    await enrollHome.clickEnrollBtn();
await enrollHome.clickGotoHome()
   await adminHome.menuButton();
    // Enroll first user
    await adminHome.clickEnrollmentMenu();
    await adminHome.clickEnroll();
//  await enrollHome.selectBycourse(courseName);
//   await enrollHome.clickSelectedLearner();
    await enrollHome.enterSearchUser(userB);
    await enrollHome.clickEnrollBtn();
  });

  test('Verify full course not listed in Create Order search', async ({ adminHome, enrollHome }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'CMO_MaxSeats_Course_Not_Listed' },
      { type: 'Test Description', description: 'Ensure full course (max seats reached) does not appear in Create Order search' }
    );

    await adminHome.loadAndLogin('CUSTOMERADMIN');
    await adminHome.menuButton();
    await adminHome.clickEnrollmentMenu();
    await enrollHome.clickEnroll();
    await enrollHome.selectEnrollmentOption('Create Order');
    await enrollHome.clickOnMultipleLearner();
    await enrollHome.selectByOption('Course');
    await enrollHome.searchUser(courseName);
    await enrollHome.verifyDedicatedTPCourseNotFound(courseName);
  });
});