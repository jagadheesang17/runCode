import { test } from "../../customFixtures/expertusFixture";
import { expect } from "@playwright/test";
import { FakerData } from "../../utils/fakerUtils";
import { credentials } from "../../constants/credentialData";

// Data shared across tests in this file
const iltCourseName = "ILT_" + FakerData.getCourseName();
const instructorUsername = credentials.INSTRUCTORNAME.username;

// Run tests serially to preserve state (course name reuse)
test.describe("INS012_Verify_instructor_can_open_enrollments_and_view_update_status", () => {
  test.describe.configure({ mode: "serial" });

  test("Test 1: Create ILT course with instructor", async ({ adminHome, createCourse, editCourse }) => {
    test.info().annotations.push(
      { type: "Author", description: "Automation" },
      { type: "TestCase", description: "INS012_TC001 - Create ILT course and assign instructor" },
      { type: "Test Description", description: "Creates a Classroom (ILT) course, adds a class, and assigns an instructor" }
    );

    await adminHome.loadAndLogin("CUSTOMERADMIN");
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();

    await createCourse.clickCreateCourse();
    await createCourse.verifyCreateUserLabel("CREATE COURSE");
    await createCourse.enter("course-title", iltCourseName);
    await createCourse.selectLanguage("English");
    await createCourse.typeDescription("ILT course for enrollment view test");

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
    await createCourse.enterSessionName(iltCourseName);
    await createCourse.setMaxSeat();
    await createCourse.enterDateValue();
    await createCourse.startandEndTime();
    await createCourse.selectInstructor(instructorUsername);
    await createCourse.selectLocation();
    await createCourse.typeAdditionalInfo();
    await createCourse.clickCatalog();
    await createCourse.clickUpdate();
    await createCourse.verifySuccessMessage();
  });

  test("Test 2: Login as instructor, open enrollments and verify label", async ({ adminHome, instructorHome }) => {
    test.info().annotations.push(
      { type: "Author", description: "Automation" },
      { type: "TestCase", description: "INS012_TC002 - Verify View/update Status - Course/TP label from instructor enrollments" },
      { type: "Test Description", description: "Instructor opens class enrollments and verifies 'View/update Status - Course/TP' visibility" }
    );

    await adminHome.loadAndLogin("INSTRUCTORNAME");

    // Navigate to instructor classes list and filter to ensure visibility
    await instructorHome.clickClassList();
    //await instructorHome.clickFilter();
    // await instructorHome.selectDeliveryType();
    // await instructorHome.selectStatus("Scheduled");
    // await instructorHome.clickApply("Scheduled");

    // Search the created ILT course
    await instructorHome.entersearchField(iltCourseName);
    await instructorHome.clickClassesList();

    // Open enrollments for that course
    await instructorHome.clickEnrollmentIcon(iltCourseName);

    // Verify the View/update Status - Course/TP section is visible
    await instructorHome.validateElementVisibility("//div[text()='View/update Status - Course/TP']", "View/update Status - Course/TP");
  });
});
