import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from '../../../utils/fakerUtils';

let courseName = FakerData.getCourseName();
const description = FakerData.getDescription()
test.describe(`Confirm that Scorm1.2 content functions correctly and as expected`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Creation of Single Instance Elearning with Scorm1.2 content`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Vidya` },
            { type: `TestCase`, description: `Creation of Single Instance Elearning with Scorm1.2 content` },
            { type: `Test Description`, description: `Creation of Single Instance Elearning with Scorm1.2 content` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name :" + description);
        await createCourse.contentLibrary("Completed-Incomplete-SCORM-1.2")
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
    })


    test(`Confirm that Scorm1.2 content functions correctly and as expected`, async ({ learnerHome, catalog, readContentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Vidya` },
            { type: `TestCase`, description: `Confirm that Scorm1.2 content functions correctly and as expected` },
            { type: `Test Description`, description: `Confirm that Scorm1.2 content functions correctly and as expected` }
        );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(courseName);
        await catalog.clickEnrollButton();
        await catalog.viewCoursedetails();
        await readContentHome.Completed_Incomplete_SCORM12();
        await catalog.saveLearningStatus();
        await catalog.clickMyLearning();
        await catalog.statusVerification("Course", courseName, "Completed");

    })

})
