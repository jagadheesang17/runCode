import { test, expect } from '@playwright/test';
import { test as appTest } from '../../customFixtures/expertusFixture';
import { FakerData } from '../../utils/fakerUtils';
import { credentials } from '../../constants/credentialData';

/*
INS020_Verify_waitlist_not_displayed_after_session_start

Objective:
  Verify that once a Virtual Class / ILT session has started, the Waitlist section is no longer displayed
  in the instructor's enrollment (View/update Status - Course/TP) screen.

Flow:
  Test 1: Create VC course with single seat + waitlist capacity 1 and session time already started
  Test 2: Login as Instructor, open class enrollments, assert Waitlist UI not present

Assumptions:
  - Setting a session Start Time in the past is accepted by the application (or near past).
  - Absence criteria: no element containing visible text 'Waitlist' nor the waitlist input from creation page.
  - Use page-object helpers (click/type wrappers) consistent with passed scenarios.
*/

const courseName = 'VC_WAITLIST_' + FakerData.getCourseName();
const instructorUser = credentials.INSTRUCTORNAME.username; // Reuse existing configured instructor

// Common selectors via page object (reused like in other scenarios)
const waitlistInput = "//label[text()='Waitlist']/following-sibling::input";

// Past time helper (1 hour ago rounded to full hour AM/PM)
function getPastHourTime(): string {
  const d = new Date();
  d.setHours(d.getHours() - 1); // one hour ago
  let h = d.getHours();
  const m = 0; // round down to hour
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')} ${ampm}`;
}

appTest.describe('INS020_Verify_waitlist_not_displayed_after_session_start', () => {
  appTest.describe.configure({ mode: 'serial' });

  appTest('Test 1: Create past VC class (1 seat + waitlist 1)', async ({ adminHome, createCourse, editCourse }) => {
      await adminHome.loadAndLogin("CUSTOMERADMIN");
      await adminHome.menuButton();
      await adminHome.clickLearningMenu();
      await adminHome.clickCourseLink();
  
      await createCourse.clickCreateCourse();
      await createCourse.verifyCreateUserLabel("CREATE COURSE");
      await createCourse.enter("course-title", courseName);
      await createCourse.selectLanguage("English");
      await createCourse.typeDescription("Instructor Zoom launch");
  
      await createCourse.selectdeliveryType("Virtual Class");
      await createCourse.handleCategoryADropdown();
      await createCourse.providerDropdown();
      await createCourse.selectTotalDuration();
      await createCourse.typeAdditionalInfo();
      await createCourse.clickCatalog();
      await createCourse.clickSave();
      await createCourse.clickProceed();
      await createCourse.verifySuccessMessage();
  
      await createCourse.editcourse();
      await editCourse.clickTagMenu();
      await editCourse.selectTags();
  
      await createCourse.addInstances();
      await createCourse.selectInstanceDeliveryType("Virtual Class");
      await createCourse.clickCreateInstance();

      // Use working helper to create a past VC instance (sets Session Type, timezone, past date & time, instructor, URLs)
      await createCourse.selectMeetingTypeforPast(instructorUser, courseName, 1);

      // Seat = 1 and enable Waitlist using helper
      await createCourse.setSeatsMax('1');
      await createCourse.waitList();

      await createCourse.clickHideinCatalog();
      await createCourse.clickUpdate();
      await createCourse.verifySuccessMessage();
    });
  

  appTest('Test 2: Instructor views enrollments - Waitlist should be absent for started session', async ({ learnerHome, instructorHome, page }) => {
    appTest.info().annotations.push(
      { type: 'Author', description: 'Automation' },
      { type: 'TestCase', description: 'INS020_TC002 - Waitlist hidden after session start' },
      { type: 'Test Description', description: 'Validate no Waitlist UI in enrollments when session already started' }
    );

    // Instructor login (consistent with passed scenarios)
    await learnerHome.basicLogin(instructorUser, 'DefaultPortal');
    await instructorHome.verifyInstructorPage();
    await instructorHome.clickClassesList();
    await instructorHome.clickFilter();
    await instructorHome.clearFilter();
    await instructorHome.clickFilter();
    await instructorHome.entersearchField(courseName);

    // Open enrollments
    await instructorHome.clickEnrollmentIcon(courseName);

    // Confirm we are on enrollment view
    const enrollmentHeader = page.locator("//div[contains(text(),'View/update Status') or contains(text(),'View/Update Status') or contains(text(),'View/Modify Enrollment')]");
    expect(await enrollmentHeader.isVisible({ timeout: 15000 })).toBeTruthy();

    // Assertions for absence of Waitlist indicators
    const waitlistIndicators = [
      "//div[contains(text(),'Waitlist')]",
      "//span[contains(text(),'Waitlist')]",
      "//label[contains(text(),'Waitlist')]",
      waitlistInput,
    ];

    let visibleFound: string[] = [];
    for (const sel of waitlistIndicators) {
      try {
        const loc = page.locator(sel).first();
        if (await loc.isVisible({ timeout: 2000 })) {
          visibleFound.push(sel);
        }
      } catch { /* ignore */ }
    }

    expect(visibleFound.length, `Unexpected Waitlist UI still visible selectors: ${visibleFound.join(', ')}`).toBe(0);
  });
});
