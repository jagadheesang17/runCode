import { credentials } from "../../../constants/credentialData";
import { URLConstants } from "../../../constants/urlConstants";
import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const lpTitle = ("LP_Clone_" + FakerData.getCourseName());
const learnerUser = credentials.LEARNERUSERNAME.username;
let actualClonedTitle: string;

test.describe(`TP0112: Clone Learning Path and Verify`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create Single Instance Elearning Course`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create Single Instance Elearning Course` },
            { type: `Test Description`, description: `Create a course to attach to learning path` }
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
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
    });

    test(`Step 2: Create Learning Path and Attach Course`, async ({createCourse,contentHome, learningPath, adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create Learning Path with EL Course` },
            { type: `Test Description`, description: `Create LP and attach the created course` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
        await learningPath.title(lpTitle);
        await learningPath.language();
        await learningPath.description(description);
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await learningPath.verifySuccessMessage();
        await contentHome.gotoListing();
        await learningPath.clickCloneIcon(lpTitle);
        // Get available clone options~
        const cloneLabels = await learningPath.getCloneFormLabels();
        console.log("Available clone options:", cloneLabels);
        // Unselect all options first
      //  await learningPath.unselectAllCloneOptions();
             // Click Create Copy button
        await learningPath.clickCreateCopy();
        actualClonedTitle = await learningPath.verifyClonedTitle(lpTitle);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await learningPath.verifySuccessMessage();

    });

    test(`Step 7: Learner Enrollment and Completion of Cloned LP`, async ({ adminHome, learningPath, createCourse, learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Copilot` },
            { type: `TestCase`, description: `Enroll and Complete Cloned LP` },
            { type: `Test Description`, description: `Configure access, learner enrolls and completes the cloned learning path` }
        );
       await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(actualClonedTitle);
        await catalog.clickEnrollButton();
        await catalog.clickViewLearningPathDetails();
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.saveLearningStatus();
        console.log(`✅ Successfully enrolled and completed the cloned Learning Path: ${actualClonedTitle}`);   

    });
});
