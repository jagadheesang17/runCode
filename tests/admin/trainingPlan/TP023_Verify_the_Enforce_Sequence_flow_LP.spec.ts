import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { CoursePage } from "../../../pages/CoursePage";
import { URLConstants } from "../../../constants/urlConstants";
import { credentials } from "../../../constants/credentialData";


let courseName1 = FakerData.getCourseName();
const description = FakerData.getDescription();
let courseName2 = FakerData.getCourseName();
let courseName3 = FakerData.getCourseName();

test.describe(`Verify_the_Enforce_Sequence_flow`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Single Instance Elearning Course`, async ({ adminHome, createCourse, learningPath }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Single Instance Elearning Course` },
            { type: `Test Description`, description: `Single Instance Elearning Course` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName1);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name :" + description);
        //  await learningPath.selectSpecificPortal(URLConstants.portal1);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

    })


    //test.use({ storageState: "logins/expertusAdminLog.json" })
    test(`Single Instance Elearning Course_2`, async ({ adminHome, createCourse, learningPath }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Single Instance Elearning Course` },
            { type: `Test Description`, description: `Single Instance Elearning Course` }
        );


        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName2);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name :" + description);
        //  await learningPath.selectSpecificPortal(URLConstants.portal1);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

    })


    test(`Single Instance Elearning Course_3`, async ({ adminHome, createCourse, learningPath }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Single Instance Elearning Course` },
            { type: `Test Description`, description: `Single Instance Elearning Course` }
        );


        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName3);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name :" + description);
        //  await learningPath.selectSpecificPortal(URLConstants.portal1);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

    })

    let title = FakerData.getCourseName();

    test(`Learning Path with Three Single-Instance E-Learning Courses Attached`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Learning Path with Three Single-Instance E-Learning Courses Attached` },
            { type: `Test Description`, description: `Enforce Sequence option is enabled ` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
        await learningPath.title(title);
        await learningPath.language();
        await learningPath.description(description);
        await learningPath.clickSaveAsDraftBtn();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        await learningPath.clickEnforceCheckbox();
        async function addingCourse(courseName: any) {
            await learningPath.clickAddCourse();
            await learningPath.searchAndClickCourseCheckBox(courseName);
            await learningPath.clickAddSelectCourse();
        }
        await addingCourse(courseName1);
        await addingCourse(courseName2);
        await addingCourse(courseName3);
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        await learningPath.clickEditLearningPath();
        await createCourse.clickCompletionCertificate();
        await createCourse.clickCertificateCheckBox();
        await createCourse.clickAdd();
        await learningPath.description(description);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

    })

    test(`Verify Enforce Sequence Flow Functionality for Learner`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Verify Enforce Sequence Flow Functionality for Learner` },
            { type: `Test Description`, description: `Verify Enforce Sequence Flow Functionality for Learner` }

        );
        //   title="Neural Microchip Generate";
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(title);
        await catalog.clickEnrollButton();
        await catalog.clickViewLearningPathDetails();
        await catalog.clickLaunchButton(); //First course is launched
        await catalog.saveLearningStatus();
        await catalog.clickSecondaryCourse(courseName3, "Verification"); //Trying to launch the third course without launching the second one.

    })

})