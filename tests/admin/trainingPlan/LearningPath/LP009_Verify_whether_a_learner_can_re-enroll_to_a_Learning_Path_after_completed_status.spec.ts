// import { test } from "../../../../customFixtures/expertusFixture";
//       import { LearningPathPage } from "../../../pages/LearningPathPage";
//       import { FakerData } from "../../../../utils/fakerUtils";
      
//       let courseName = FakerData.getCourseName();
//       const description = FakerData.getDescription();

//       test(`TP003a Creation of Elearning`, async ({ adminHome, createCourse }) => {
//         test.info().annotations.push(
//             { type: `Author`, description: `Selvakumar` },
//             { type: `TestCase`, description: `Creation of Elearning` },
//             { type: `Test Description`, description: `Verify that course should be created successfully` }
//         );
//         await adminHome.loadAndLogin("CUSTOMERADMIN")
//         await adminHome.menuButton();
//         await adminHome.clickLearningMenu();
//         await adminHome.clickCourseLink();
//         await createCourse.clickCreateCourse();
//         await createCourse.verifyCreateUserLabel("CREATE COURSE");
//         await createCourse.enter("course-title", courseName);
//         await createCourse.selectLanguage("English");
//         await createCourse.typeDescription("This is a new course,:" + description);
//         await createCourse.contentLibrary(); 
//         await createCourse.clickCatalog();
//         await createCourse.clickSave();
//         await createCourse.clickProceed();
//         await createCourse.verifySuccessMessage();

//     })
//     let title = FakerData.getCourseName();

//     test(`TP003b Verify creating a Learning Path with Recurring Registration Business Rule`, async ({ adminHome, learningPath, createCourse }) => {
//         test.info().annotations.push(
//             { type: `Author`, description: `Selvakumar` },
//             { type: `TestCase`, description: `Verify creating a Learning Path with Recurring Registration Business Rule` },
//             { type: `Test Description`, description: `Verify creating a Learning Path with Recurring Registration Business Rule` }
//         )

//         await adminHome.loadAndLogin("CUSTOMERADMIN")
//         await adminHome.menuButton();
//         await adminHome.clickLearningMenu();
//         await adminHome.clickLearningPath();
//         await learningPath.clickCreateLearningPath();
//         await learningPath.title(title);
//         await learningPath.description(description);
//         await learningPath.language();
//         await learningPath.clickSave();
//         await learningPath.clickProceedBtn();
//         await learningPath.clickAddCourse();
//         await learningPath.searchAndClickCourseCheckBox(courseName);
//         //await learningPath.searchAndClickCourseCheckBox("Redundant System Program");

//         await learningPath.clickAddSelectCourse();
//         await learningPath.clickDetailTab();
//         await learningPath.BusinessRule();
//         await learningPath.RecurringRegistration();
//         await learningPath.clickCatalogBtn();
//         await learningPath.clickUpdateBtn();
//         await learningPath.verifySuccessMessage();
//     })

//     test(`TP003c Verify LP reenroll flow in the learner side`, async ({ learnerHome, catalog }) => {
//         test.info().annotations.push(
//             { type: `Author`, description: `Selvakumar` },
//             { type: `TestCase`, description: `Verify LP reenroll flow in the learner side` },
//             { type: `Test Description`, description: `Verify LP reenroll flow in the learner side` }

//         );

//         await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
//         await learnerHome.clickCatalog();
//         await catalog.mostRecent();
//         await catalog.searchCatalog(title);
//         await catalog.clickEnrollButton();
//         await catalog.clickViewLearningPathDetails();
//          await catalog.clickLaunchButton();
//           await catalog.saveLearningStatus();
//          await catalog.clickReenrollCompleted();

//     })