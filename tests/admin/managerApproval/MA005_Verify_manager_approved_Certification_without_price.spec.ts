import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";

const courseName = FakerData.getCourseName();
const certName =FakerData.getCourseName()+Date.now();
const description = FakerData.getDescription();
const managerName = credentials.MANAGERNAME.username;

test.describe(`Verify manager approved Certification without price`, async () => {
    test.describe.configure({ mode: 'serial' })

    test(`Create Elearning course for Certification`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create Elearning course for Certification` },
            { type: `Test Description`, description: `Create Elearning course for Certification` }
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

    test(`Create Certification with Manager Approval Enabled`, async ({ adminHome, learningPath, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create Certification with Manager Approval Enabled` },
            { type: `Test Description`, description: `Create Certification with Manager Approval Enabled` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(certName);
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
        await learningPath.clickEditCertification();
        await createCourse.clickCompletionCertificate();
        await createCourse.clickCertificateCheckBox();
        await createCourse.clickAdd();
        await learningPath.description(description);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        await learningPath.clickEditCertification();
        await editCourse.clickManagerApproval();
        await editCourse.verifyapprovaluserType("Internal Users")
        await editCourse.clickinternalManager("Other Manager");
        await editCourse.clickapprovaluserType("External Users")
        await editCourse.saveApproval()
        await learningPath.description(description);
        await createCourse.clickUpdate()
    })

    test(`Ensure that a learner is able to register for Certification that requires manager approval`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Ensure that a learner is able to register for Certification that requires manager approval` },
            { type: `Test Description`, description: `Ensure that a learner is able to register for Certification that requires manager approval` }
        );
        await learnerHome.learnerLogin("TEAMUSER2", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(certName);
        await catalog.clickMoreonCourse(certName);
        await catalog.clickSelectcourse(certName);
        await catalog.clickRequestapproval();
        await catalog.selectManagerOnRequestApprovalPopup(managerName);
        await catalog.submitRequestAndVerify();
             await catalog.clickDashboardLink();
        await learnerHome.clickINA();
        await learnerHome.clickINAOption("Pending Requests");
        await learnerHome.verifyCourseInINA(certName);
    })

    test(`Ensure that the manager is able to successfully approve the Certification request`, async ({ learnerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Ensure that the manager is able to successfully approve the Certification request` },
            { type: `Test Description`, description: `Ensure that the manager is able to successfully approve the Certification request` }
        );
        await learnerHome.learnerLogin("MANAGERNAME", "DefaultPortal");
        await learnerHome.selectCollaborationHub();
        await learnerHome.clickApprove(certName);
        await learnerHome.verifyApprovedSuccessfully();
    });

    test(`Verify manager approved Certification is available on the learner side`, async ({ dashboard, learnerHome, catalog, readContentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify manager approved Certification is available on the learner side` },
            { type: `Test Description`, description: `Verify manager approved Certification is available on the learner side` }
        );
        await learnerHome.learnerLogin("TEAMUSER2", "DefaultPortal");
         await catalog.clickDashboardLink();
        await learnerHome.clickINA();
        await learnerHome.clickINAOption("Pending Requests");
        await learnerHome.clickCourseInINA(certName);
        await readContentHome.AICCFilecontainingaPPT_Storyline();
        await readContentHome.saveLearningAICC();
        await catalog.verifyStatus("Completed");
    });
})
