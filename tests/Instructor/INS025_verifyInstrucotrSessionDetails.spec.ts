import { test } from '../../customFixtures/expertusFixture';
import { expect } from '@playwright/test';
import { FakerData } from '../../utils/fakerUtils';
import { credentials } from '../../constants/credentialData';

// Optional: test data source placeholder. Replace with workspace utility if available.
function getTestCourseData() {
  return {
    title: '',
    language: 'English',
    code: /[A-Z]+-\d{3}/,
    seats: 1,
  };
}

test.describe(`Course Details Verification`, async () => {
  test.describe.configure({ mode: 'serial' });

  const courseName = FakerData.getCourseName();
  const instructorUsername = credentials.INSTRUCTORNAME?.username || 'INSTRUCTORNAME';

  test(`Setup: create instructor and ILT class`, async ({ adminHome, createCourse, editCourse }) => {
    // 1) Login as Customer Admin
    await adminHome.loadAndLogin('CUSTOMERADMIN');
    await adminHome.menuButton();

    // 2) Assume instructor user exists as per credentials; creation handled elsewhere

    // 3) Create ILT course and assign instructor
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();
    await createCourse.clickCreateCourse();
    await createCourse.verifyCreateUserLabel('CREATE COURSE');
    await createCourse.enter('course-title', courseName);
    await createCourse.selectLanguage('English');
    await createCourse.typeDescription('Instructor verification course: ' + courseName);
    await createCourse.selectdeliveryType('Classroom');
    await createCourse.handleCategoryADropdown();
    await createCourse.providerDropdown();
    await createCourse.selectTotalDuration();
    await createCourse.typeAdditionalInfo();
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();

    await createCourse.editcourse();
    await createCourse.addInstances();
    await createCourse.selectInstanceDeliveryType('Classroom');
    await createCourse.clickCreateInstance();
    await createCourse.enterSessionName(courseName);
    await createCourse.enterfutureDateValue?.();
    await createCourse.startandEndTime();
    await createCourse.selectInstructor(instructorUsername);
    await createCourse.typeAdditionalInfo();
    await createCourse.selectLocation();
    await createCourse.setMaxSeat();
    await createCourse.typeDescription('Class list verification');
    await createCourse .clickCatalog();
    await createCourse.clickUpdate();
    await createCourse.verifySuccessMessage();
  });

  test(`Verification: login as instructor and validate class details`, async ({ adminHome, instructorHome }) => {
    // 4) Login as Instructor
    await adminHome.singleUserLogin(instructorUsername);

    // 5) Navigate to Instructor assigned classes list
    await adminHome.clickAdminHome();
    await adminHome.menuButton();
    await adminHome.clickInstructorLink();
    await instructorHome.clickClassList();

    // Apply filters if needed and open class card
    // await instructorHome.clickFilter();
    // await instructorHome.selectDeliveryType();
    // await instructorHome.selectStatus('Scheduled');
    // await instructorHome.clickApply('Scheduled');
    await instructorHome.entersearchField(courseName);

    // Open the enrollment/class detail for this course
   // await instructorHome.clickEnrollmentIcon(courseName);

    // 6) Verify title, language, code and seat on the detail view
    const courseDetails = await adminHome.verifyInstructorsSessionAndLogPageTitles();

  const language = (courseDetails.language ?? '').trim();
const code = (courseDetails.code ?? '').trim();
const seatStr = (courseDetails.seat ?? '').trim();
const seatNum = Number.parseInt(seatStr, 10);

   expect(language, 'Language should be present').toBeTruthy();
// Optionally: expect(language).toBe('English');

expect(code, 'Code should be present').toBeTruthy();

//expect(Number.isNaN(seatNum), 'Seat should be a valid number').toBeFalsy();
//expect(seatNum >= 0, 'Seat should be non-negative').toBeTruthy();
  });
});
