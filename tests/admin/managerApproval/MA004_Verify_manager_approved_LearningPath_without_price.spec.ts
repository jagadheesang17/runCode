import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";

const courseName = FakerData.getCourseName();
const lpName = "LP_" + FakerData.getCourseName();
const description = FakerData.getDescription();
const managerName = credentials.MANAGERNAME.username;

test.describe(`Verify manager approved Learning Path without price`, async () => {
    test.describe.configure({ mode: 'serial' })

    test(`Create Elearning course for Learning Path`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create Elearning course for Learning Path` },
            { type: `Test Description`, description: `Create Elearning course for Learning Path` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name: " + courseName);
        await createCourse.contentLibrary("AICC File containing a PPT - Storyline 11");
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
    })

    test(`Create Learning Path with Manager Approval Enabled`, async ({ adminHome, learningPath, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create Learning Path with Manager Approval Enabled` },
            { type: `Test Description`, description: `Create Learning Path with Manager Approval Enabled` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath()
        await learningPath.title(lpName);
        await learningPath.description(description);
        await learningPath.language();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        await learningPath.clickEditLearningPath();
        await editCourse.clickManagerApproval();
        await editCourse.verifyapprovaluserType("Internal Users")
        await editCourse.verifyinternalManager("Direct Manager")
        await editCourse.verifyapprovaluserType("External Users")
        await editCourse.verifyinternalManager("Direct Manager")
        await editCourse.saveApproval()
        await learningPath.description(description);
        await createCourse.clickUpdate()
    })

    test(`Ensure that a learner is able to register for Learning Path that requires manager approval`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Ensure that a learner is able to register for Learning Path that requires manager approval` },
            { type: `Test Description`, description: `Ensure that a learner is able to register for Learning Path that requires manager approval` }
        );
        await learnerHome.learnerLogin("TEAMUSER1", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(lpName);
        await catalog.clickMoreonCourse(lpName);
        await catalog.clickSelectcourse(lpName);
        await catalog.clickRequestapproval();
        await catalog.selectManagerOnRequestApprovalPopup(managerName);
        await catalog.submitRequestAndVerify();
    })

    test(`Ensure that the manager is able to success~fully approve the Learning Path request`, async ({ learnerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Ensure that the manager is able to successfully approve the Learning Path request` },
            { type: `Test Description`, description: `Ensure that the manager is able to successfully approve the Learning Path request` }
        );
        await learnerHome.learnerLogin("MANAGERNAME", "DefaultPortal");
        await learnerHome.selectCollaborationHub();
        await learnerHome.clickApprove(lpName);
        await learnerHome.verifyApprovedSuccessfully();
    });

    test(`Verify manager approved Learning Path is available on the learner side`, async ({ learnerHome, catalog, readContentHome, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify manager approved Learning Path is available on the learner side` },
            { type: `Test Description`, description: `Verify manager approved Learning Path is available on the learner side` }
        );
        await learnerHome.learnerLogin("TEAMUSER1", "DefaultPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.searchCertification(lpName);
        await catalog.clickMoreonCourse(lpName);
        await readContentHome.AICCFilecontainingaPPT_Storyline();
        await readContentHome.saveLearningAICC();
        await catalog.verifyStatus("Completed");
    });
})
