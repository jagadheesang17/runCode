import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { credentials } from "../../../constants/credentialData";

let courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
let createdCode: any;
test.describe(`Confirm that Admin enrollments functions correctly and as expected for Tincan content`, async () => {
  test.describe.configure({ mode: "serial" });
  test(`Create course for Single Instance`, async ({
    adminHome,
    createCourse,
    contentHome,
    enrollHome,
  }) => {
    test.info().annotations.push(
      { type: `Author`, description: `Tamilvanan` },
      {
        type: `TestCase`,
        description: `Creation of Single Instance Elearning with Tincan content`,
      },
      {
        type: `Test Description`,
        description: `Verify that course should be created for Tincan`,
      }
    );
    await adminHome.loadAndLogin("CUSTOMERADMIN");
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();
    await createCourse.clickCreateCourse();
    await createCourse.verifyCreateUserLabel("CREATE COURSE");
    await createCourse.enter("course-title", courseName);
    await createCourse.selectLanguage("English");
    await createCourse.typeDescription(
      "This is a new course by name :" + description
    );
    await createCourse.contentLibrary("tin_can");
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    await contentHome.gotoListing();
    await createCourse.catalogSearch(courseName);
    createdCode = await createCourse.retriveCode();
    console.log("Extracted Code is : " + createdCode);
    await adminHome.menuButton();
    await adminHome.clickEnrollmentMenu();
    await adminHome.clickEnroll();
    await enrollHome.selectBycourse(courseName);
    await enrollHome.clickSelectedLearner();
    await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
    await enrollHome.clickEnrollBtn();
    await enrollHome.verifytoastMessage();
  });

  test(`Verification from learner site`, async ({
    learnerHome,
    catalog,
    readContentHome,
    dashboard
  }) => {
    test.info().annotations.push(
      { type: `Author`, description: `Tamilvanan` },
      { type: `TestCase`, description: `Learner Side Verification` },
      {
        type: `Test Description`,
        description: `Verify that course should be created for Single instance`,
      }
    );
    await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
    await catalog.clickMyLearning();
    await catalog.searchMyLearning(courseName);
    // await catalog.verifyEnrolledCourseByCODE(createdCode);
    await catalog.clickCourseInMyLearning(courseName);
    await readContentHome.readTinCan();
    await catalog.saveLearningStatus();
    await catalog.clickMyLearning();
    await dashboard.selectDashboardItems("Learning History");
    await dashboard.learningHistoryCourseSearch(courseName);
    await dashboard.vaidatVisibleCourse_Program(courseName, "Completed");
  });
});
