import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from '../../../utils/fakerUtils';


//course creation fuctions 
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription()
test.describe(`Generating direct content launch link`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Generating direct content launch link and clear the fields`, async ({ adminHome, createCourse, directContent }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Nithya` },
            { type: `TestCase`, description: `Generating direct content launch link and clear the fields` },
            { type: `Test Description`, description: `Generating direct content launch link` }
        );
        // let courseName="Open-source Hard drive Generate";
            await adminHome.loadAndLogin("CUSTOMERADMIN1")
            await adminHome.menuButton();
            await adminHome.clickLearningMenu();
            await adminHome.clickCourseLink();
            await createCourse.clickCreateCourse();
            await createCourse.verifyCreateUserLabel("CREATE COURSE");
            await createCourse.enter("course-title", courseName);
            await createCourse.selectLanguage("English");
            await createCourse.typeDescription("This is a new course by name :" + description);
            await createCourse.contentLibrary("Passed-Failed-SCORM2004");// scorm 2004 content
            await createCourse.clickCatalog();
            await createCourse.clickSave();
            await createCourse.clickProceed();
            await createCourse.verifySuccessMessage();
            await adminHome.menuButton();
            await adminHome.clickLearningMenu();
            await adminHome.clickDirectContentLaunchLink();
            await directContent.clickdomaindropdown("newprod");
            await directContent.searchfield(courseName);
            await directContent.generateURL();
            await directContent.copyURL();
            await directContent.verifySuccessMessage();
            await directContent.clearFields();
    })
})