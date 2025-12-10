import { create } from "domain";
import { test } from "../../../customFixtures/expertusFixture"
import { CostcenterPage } from "../../../pages/CostcenterPage";
import { FakerData } from '../../../utils/fakerUtils';
import { readDataFromCSV } from "../../../utils/csvUtil";
import { ca } from "date-fns/locale";
import { credentials } from "../../../constants/credentialData";


const courseName = FakerData.getCourseName()+Date.now();;
const instructorName = credentials.INSTRUCTORNAME.username
const managerName = credentials.MANAGERNAME.username;

test.describe(`Verify manager approved Elearning course without price`, async () => {
    test.describe.configure({ mode: 'serial' })
    
    test(`Single Elearning instance with Manager Approval Enabled`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Single Elearning instance with Manager Approval Enabled` },
            { type: `Test Description`, description: `Single Elearning instance with Manager Approval Enabled` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name :" + courseName);
        await createCourse.contentLibrary("AICC File containing a PPT - Storyline 11");
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await createCourse.clickEditCourseTabs();
        await editCourse.clickManagerApproval();
        await editCourse.verifyapprovaluserType("Internal Users")
        await editCourse.verifyinternalManager("Direct Manager")
        await editCourse.verifyapprovaluserType("External Users")
        await editCourse.verifyinternalManager("Direct Manager")
        await editCourse.saveApproval()
        await createCourse.typeDescription("  Added Manager Approval")
        await createCourse.clickUpdate()
    })

    test(`Ensure that a learner is able to register for a course that requires manager approval`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Ensure that a learner is able to register for a course that requires manager approval` },
            { type: `Test Description`, description: `Ensure that a learner is able to register for a course that requires manager approval` }
        );
        await learnerHome.learnerLogin("TEAMUSER1", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(courseName);
        await catalog.clickMoreonCourse(courseName);
        await catalog.clickSelectcourse(courseName);
        await catalog.clickRequestapproval();
        await catalog.selectManagerOnRequestApprovalPopup(managerName);
        await catalog.submitRequestAndVerify();
        await catalog.clickDashboardLink();
        await learnerHome.clickINA();
        await learnerHome.clickINAOption("Pending Requests");
        await learnerHome.verifyCourseInINA(courseName);

    })

    test(`Ensure that the manager is able to successfully approve the given request`, async ({ catalog, learnerHome, profile, createUser, editCourse, location }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Ensure that the manager is able to successfully approve the given request` },
            { type: `Test Description`, description: `Ensure that the manager is able to successfully approve the given request` }
        );
        await learnerHome.learnerLogin("MANAGERNAME", "DefaultPortal");
        await learnerHome.selectCollaborationHub();
        await learnerHome.clickApprove(courseName);
        await learnerHome.verifyApprovedSuccessfully();
    });

    test(`Verify manager approved Elearning course is available on the learner side`, async ({ learnerHome, readContentHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify manager approved Elearning course is available on the learner side` },
            { type: `Test Description`, description: `Verify manager approved Elearning course is available on the learner side` }
        );
        await learnerHome.learnerLogin("TEAMUSER1", "DefaultPortal");
        await catalog.clickDashboardLink();
        await learnerHome.clickINA();
        await learnerHome.clickINAOption("Pending Requests");
        await learnerHome.clickCourseInINA(courseName);
        await readContentHome.AICCFilecontainingaPPT_Storyline();
        await readContentHome.saveLearningAICC();
        await catalog.clickMyLearning();
        await catalog.clickCompletedButton();
        await catalog.searchMyLearning(courseName);
        await catalog.verifyCompletedCourse(courseName);
    });
})
