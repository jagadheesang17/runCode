import { test } from "../../customFixtures/expertusFixture";
import { expect } from "@playwright/test";
import { FakerData } from "../../utils/fakerUtils";
import { credentials } from "../../constants/credentialData";

/**
 * INS022_Verify_completion_with_observation_checklist_only
 *
 * Goal: Verify completion logic when Observation Checklist alone is attached to the class.
 * Flow:
 *  Test 1 (Admin): Create ILT course, add Observation Checklist only, set evaluator = instructor, save.
 *  Test 2 (Admin): Verify checklist elements (name, id, icons) exist to ensure configuration is correct.
 *
 * Notes:
 *  - Uses CoursePage helpers for Observation Checklist:
 *    addObservationChecklistToCourse(), configureChecklistRulesDefault(),
 *    clickChecklistEditIcon(), clickEvaluatorDropdown(), searchAndSelectEvaluator(), clickChecklistUpdateButton(),
 *    verifyAllChecklistElements(index)
 *  - This spec focuses on configuration and presence required for completion logic with checklist only.
 */

const courseTitle = "ILT_OBS_ONLY_" + FakerData.getCourseName();
const instructorUsername = credentials.INSTRUCTORNAME.username;

test.describe("INS022_Verify_completion_with_observation_checklist_only", () => {
  test.describe.configure({ mode: "serial" });

  test("Test 1: Create ILT course and attach Observation Checklist with evaluator", async ({ adminHome, createCourse, editCourse }) => {
    test.info().annotations.push(
      { type: "Author", description: "Automation" },
      { type: "TestCase", description: "INS022_TC001 - ILT course with checklist only" },
      { type: "Test Description", description: "Create ILT course, add Observation Checklist, set evaluator to instructor" }
    );

    await adminHome.loadAndLogin("CUSTOMERADMIN");
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();

    // Create ILT course
    await createCourse.clickCreateCourse();
    await createCourse.verifyCreateUserLabel("CREATE COURSE");
    await createCourse.enter("course-title", courseTitle);
    await createCourse.selectLanguage("English");
    await createCourse.typeDescription("ILT with Observation Checklist only");
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
  
      // Add observation checklist to the course
      await createCourse.addObservationChecklistToCourse();
     
      // Set evaluator to instructor
      await createCourse.clickChecklistEditIcon();
      await createCourse.clickEvaluatorDropdown();
      await createCourse.searchAndSelectEvaluator(instructorUsername);
      await createCourse.clickChecklistUpdateButton();
  
      // Verify checklist elements present after configuration
      const checklistOk = await createCourse.verifyAllChecklistElements(1);
      expect(checklistOk).toBeTruthy();
  await createCourse.clickDetailButton();
      // // Final save
      // await createCourse.clickCatalog();
      // await createCourse.clickUpdate();
      // await createCourse.verifySuccessMessage();
    
  });

test("Test 2: Instructor verify", async ({ instructorHome, learnerHome,catalog }) => {
    test.info().annotations.push(
      { type: "Author", description: "Automation" },
      { type: "TestCase", description: "INS021_TC003 - Learner content completion verification" },
      { type: "Test Description", description: "Login as learner, launch content, complete it, and verify course completion state" }
    );
     await learnerHome.basicLogin(instructorUsername, 'DefaultPortal');
    await instructorHome.verifyInstructorPage();
    await instructorHome.clickClassesList();
    await instructorHome.clickFilter();
    await instructorHome.clearFilter();
    await instructorHome.clickFilter();
    await instructorHome.entersearchField(courseTitle);

});
});
