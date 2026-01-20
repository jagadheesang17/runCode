import { test } from "../../customFixtures/expertusFixture";
import { expect } from "@playwright/test";
import { FakerData } from "../../utils/fakerUtils";
import { credentials } from "../../constants/credentialData";

/**
 * INS023_Verify_completion_with_observation_checklist_and_assessment
 *
 * Goal: Verify completion logic configuration when Observation Checklist + Assessment are attached to the class.
 * Flow:
 *  Test 1 (Admin): Create ILT course, add Observation Checklist, set evaluator = instructor, attach Assessment, save.
 *  Test 2 (Admin): Verify checklist and assessment presence via available helpers/selectors.
 *
 * Notes:
 *  - Observation Checklist helpers from CoursePage:
 *    addObservationChecklistToCourse(), configureChecklistRulesDefault(),
 *    clickChecklistEditIcon(), clickEvaluatorDropdown(), searchAndSelectEvaluator(), clickChecklistUpdateButton(),
 *    verifyAllChecklistElements(index)
 *  - Assessment attach uses CoursePage survey/assessment area:
 *    surveyAndAssessmentLink, assessmentCheckbox, addAssessmentBtn, surveySaveBtn
 */

const courseTitle = "ILT_OBS_ASSESS_" + FakerData.getCourseName();
const instructorUsername = credentials.INSTRUCTORNAME.username;

// Minimal selectors to verify assessment presence on course page (aligned with CoursePage)
const selectors = {
  surveyAssessmentTab: "//button[text()='Survey/Assessment']",
  assessmentCheckbox: "//div[contains(@id,'scroll-assessment-list')]//i[contains(@class,'fa-duotone fa-square icon')]",
  addAssessmentBtn: "//button[text()='Add As Assessment']",
  assessmentSaveBtn: "//button[text()='Save']",
  addedAssessmentRow: "//div[contains(@id,'sur_ass-lms-scroll-assessment-added-list') or contains(@id,'assessment-added-list')]//div[contains(@class,'row') or contains(@class,'item')]",
};

test.describe("INS023_Verify_completion_with_observation_checklist_and_assessment", () => {
  test.describe.configure({ mode: "serial" });
 test("Test 1: Create E-learning course, attach content, add Observation Checklist with evaluator", async ({ adminHome, createCourse }) => {
    test.info().annotations.push(
      { type: "Author", description: "Automation" },
      { type: "TestCase", description: "INS021_TC001 - Admin course setup with content + observation checklist" },
      { type: "Test Description", description: "Create E-learning course, add content and observation checklist, set evaluator to instructor" }
    );

    await adminHome.loadAndLogin("CUSTOMERADMIN");
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();

    // Create course (E-learning)
    await createCourse.clickCreateCourse();
    await createCourse.verifyCreateUserLabel("CREATE COURSE");
    await createCourse.enter("course-title", courseTitle);
    await createCourse.selectLanguage("English");
    await createCourse.typeDescription("E-learning with content + observation checklist");
    await createCourse.selectdeliveryType("E-Learning");
    await createCourse.handleCategoryADropdown();
    await createCourse.providerDropdown();
    await createCourse.selectTotalDuration();
    await createCourse.typeAdditionalInfo();

    // Attach course content (uses data/example.ppsx)
    await createCourse.contentLibrary();

    // Save course
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();

    // Edit to add Observation Checklist and evaluator
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

    // Attach Assessment using existing workspace selectors/methods
    await createCourse.surveyassesment();
    await createCourse.click(
      createCourse.selectors.assessmentCheckbox,
      "Assessment",
      "Checkbox"
    );
    await createCourse.click(
      createCourse.selectors.addAssessmentBtn,
      "Add As Assessment",
      "Button"
    );
    await createCourse.click(
      createCourse.selectors.surveySaveBtn,
      "Save",
      "Button"
    );

    // Save
  });

//   test("Test 2: Verify Observation Checklist and Assessment presence", async ({ adminHome, createCourse }) => {
//     test.info().annotations.push(
//       { type: "Author", description: "Automation" },
//       { type: "TestCase", description: "INS023_TC002 - Verify checklist + assessment elements" },
//       { type: "Test Description", description: "Verify checklist elements and assessment attached rows present" }
//     );

//     await adminHome.loadAndLogin("CUSTOMERADMIN");
//     await adminHome.menuButton();
//     await adminHome.clickLearningMenu();
//     await adminHome.clickCourseLink();

//     // Open edit page to verify elements
//     await createCourse.editcourse();

//     // Verify checklist elements
//     const ok = await createCourse.verifyAllChecklistElements(1);
//     expect(ok).toBeTruthy();

//     // Verify an assessment appears under added list (best-effort check)
//     await createCourse.surveyassesment();
//     const assessmentPresent = await createCourse.page.locator(selectors.addedAssessmentRow).first().isVisible({ timeout: 10000 }).catch(() => false);
//     expect(assessmentPresent).toBeTruthy();
//   });
});
