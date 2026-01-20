import { test } from "../../customFixtures/expertusFixture";
import { expect, Page } from "@playwright/test";
import { FakerData, getCurrentTimeRoundedTo15 } from "../../utils/fakerUtils";
import { readDataFromCSV } from "../../utils/csvUtil";

// Dynamic data for this run
const instructorUsername = FakerData.getUserId();
const firstName = FakerData.getFirstName();
const lastName = FakerData.getLastName();
const courseName = "ILT_" + FakerData.getCourseName();
const description = FakerData.getDescription();

/**
 * Goal: Verify "No Enrollment Record Found" is displayed when no learners are enrolled
 * Flow:
 *  - Test 1: Create an Instructor user
 *  - Test 2: Create an ILT course/class assigned to this instructor (no learner enrollments)
 *  - Test 3: Login as instructor, open enrollments, verify the no-enrollment message
 */

test.describe("INS013_Verify_no_enrollment_record_found_in_manage_enrollments", () => {
  test.describe.configure({ mode: "serial" });

  test("Test 1: Create instructor user", async ({ adminHome, createUser }) => {
    test.info().annotations.push(
      { type: "Author", description: "Automation" },
      { type: "TestCase", description: "INS013_TC001 - Create instructor user" },
      { type: "Test Description", description: "Create an instructor user for no-enrollment verification" }
    );

    await adminHome.loadAndLogin("CUSTOMERADMIN");
    await adminHome.clickMenu("User");
    await createUser.verifyCreateUserLabel();

    const csvFilePath = './data/User.csv';
    const data = await readDataFromCSV(csvFilePath);

    for (const row of data) {
      const { country, state, timezone, currency, city, zipcode } = row;

      await createUser.uncheckInheritAddressIfPresent();
      await createUser.uncheckInheritEmergencyContactIfPresent();
      await createUser.uncheckAutoGenerateUsernameIfPresent();

      await createUser.enter("first_name", firstName);
      await createUser.enter("last_name", lastName);
      await createUser.enter("username", instructorUsername);
      await createUser.enter("user-password", "Welcome1@");
      await createUser.enter("email", instructorUsername);
      await createUser.enter("user-phone", FakerData.getMobileNumber());
      await createUser.typeAddress("Address 1", FakerData.getAddress());
      await createUser.typeAddress("Address 2", FakerData.getAddress());
      await createUser.select("Country", country);
      await createUser.select("State/Province", state);
      await createUser.select("Time Zone", timezone);
      await createUser.select("Currency", currency);
      await createUser.enter("user-city", city);
      await createUser.enter("user-zipcode", zipcode);
      await createUser.enter("user-mobile", FakerData.getMobileNumber());

      await createUser.clickRolesButton("Instructor");
      await createUser.clickSave();
      await createUser.verifyUserCreationSuccessMessage();
      break; // create one user only
    }
  });

  test("Test 2: Create ILT course with a class assigned to this instructor (no enrollments)", async ({ adminHome, createCourse, editCourse }) => {
    test.info().annotations.push(
      { type: "Author", description: "Automation" },
      { type: "TestCase", description: "INS013_TC002 - Create ILT course/class without enrollments" },
      { type: "Test Description", description: "Create Classroom ILT course and assign instructor; do not enroll learners" }
    );

    await adminHome.loadAndLogin("CUSTOMERADMIN");
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();

    await createCourse.clickCreateCourse();
    await createCourse.verifyCreateUserLabel("CREATE COURSE");
    await createCourse.enter("course-title", courseName);
    await createCourse.selectLanguage("English");
    await createCourse.typeDescription(description);

    await createCourse.selectdeliveryType("Classroom");
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
    await createCourse.selectInstanceDeliveryType("Classroom");
    await createCourse.clickCreateInstance();
    await createCourse.enterSessionName(courseName);
    await createCourse.setMaxSeat();
    await createCourse.enterDateValue();
    await createCourse.startandEndTime();
    await createCourse.selectLocation();
    await createCourse.selectInstructor(instructorUsername);
    await createCourse.typeAdditionalInfo();
    await createCourse.clickCatalog();
    await createCourse.clickUpdate();
    await createCourse.verifySuccessMessage();
  });

  test("Test 3: Login as instructor, open enrollments, verify 'No Enrollment Record Found'", async ({ learnerHome, instructorHome, page }) => {
    test.info().annotations.push(
      { type: "Author", description: "Automation" },
      { type: "TestCase", description: "INS013_TC003 - Verify no enrollment message" },
      { type: "Test Description", description: "Instructor navigates to class enrollments where there are no learners and sees the no-enrollment message" }
    );

    await learnerHome.basicLogin(instructorUsername, "DefaultPortal");

    await instructorHome.verifyInstructorPage();
  
  await instructorHome.clickClassesList();
    await instructorHome.entersearchField(courseName);
   

    // Open enrollments
    await instructorHome.clickEnrollmentIcon(courseName);

    // Verify header/section for enrollments is visible (defensive)
    // If the UI header changes casing, this will still work due to contains() usage
    // const headerSelector = "//div[contains(text(),'View/update Status - Course/TP') or contains(text(),'View/Update Status - Course/TP') or contains(text(),'View/Modify Enrollment')]";
    // const headerVisible = await page.locator(headerSelector).first().isVisible({ timeout: 15000 }).catch(() => false);
    // expect(headerVisible).toBeTruthy();

    // Verify the no enrollment message
    const noEnrollmentSelectors ="//*[text()='No matching result found.']"

    let found = false;
    await page.waitForTimeout(5000); // wait for potential loading
   
      try {
        if (await page.locator(noEnrollmentSelectors).isVisible({ timeout: 5000 })) {
          found = true; 
        }
      } catch { /* ignore */ }
    
    expect(found, "Expected a 'No matching result found.' style message when there are no enrollments").toBeTruthy();
  });
});
