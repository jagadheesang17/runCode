import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { expect } from "allure-playwright";
import { credentials } from "../../../constants/credentialData";
import { createCourseAPI } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";

test.describe('CC013 - Training Plan Certificate Validation', () => {

    const certificateTitle = FakerData.getcertificationTitle()+' TP';
    const certificationTP = FakerData.getCourseName();
    const description = FakerData.getDescription();
    const courseName = FakerData.getCourseName();
    const certUser = require('../../../data/completionCertificate/certificateTestUser.json');

    test("CC013 - Admin: Verify published certificate listed under Training Plan", async ({ adminHome, CompletionCertification, editCourse, createCourse, learningPath, enrollHome, contentHome }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'CC013_Admin_TP_Certificate' },
            { type: 'Test Description', description: 'Verify published completion certificates are listed under Training Plan' }
        );

        // Step 1: Create a course first (required for TP) - Using API
        const content = 'content testing-001';
        const result = await createCourseAPI(content, courseName, 'published', 'single', 'e-learning');
        expect(result).toBe(courseName);
        console.log(`✅ Course created via API: "${courseName}"`);

        // Step 2: Create Completion Certificate
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCompletionCertification();
        await CompletionCertification.clickCreateCompletionCertificate();
        await CompletionCertification.clickTemplateType();
        await CompletionCertification.title(certificateTitle);
        await CompletionCertification.designCertificateWithHtml(description);
        await CompletionCertification.clickPublish();
        await CompletionCertification.clickProceed();
        await createCourse.verifySuccessMessage
        // await CompletionCertification.verifyCeritificateSuccessMessage();

        await adminHome.page.reload();
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(certificationTP);
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
        console.log(`✅ Training Plan created: ${certificationTP}`);

        // Step 4: Attach Completion Certificate to Training Plan
        await learningPath.clickEditCertification();
        await createCourse.clickCompletionCertificate();
        await editCourse.selectCourseCompletionCertificate(certificateTitle);
        await learningPath.description(description);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Certificate attached to Training Plan`);

        // Step 5: Enroll Learner to Training Plan
        await adminHome.page.reload();
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectByOption("Certification");
        await enrollHome.selectBycourse(certificationTP);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(certUser.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        console.log(`✅ Learner enrolled to Training Plan: ${certificationTP}`);
    });

    test("CC013 - Learner: Verify certificate view, print, download and dashboard & LEARNING HISTORY", async ({ learnerHome, catalog ,dashboard}) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'CC013_Learner_TP_Certificate' },
            { type: 'Test Description', description: 'Verify learner can view, print, download certificate and verify dashboard for Training Plan' }
        );

        // Step 1: Login as learner
        await learnerHome.basicLogin(certUser.username, "DefaultPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.searchCertification(certificationTP);
        await dashboard.clickCertificateTitle(certificationTP);
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();

        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.searchCertification(certificationTP);
        await dashboard.clickCertificateTitle(certificationTP);
        await catalog.clickViewCertificate();
        await catalog.verifyCertificateModalDisplayed();
        await catalog.verifyCertificateContent(`${certUser.firstname} ${certUser.lastname}`, certificationTP);
        const pdfPath = await catalog.downloadCertificateAsPDF();
        await catalog.verifyPDFFile(pdfPath);
        await learnerHome.clickDashboardLink();
        await dashboard.selectCertificateType("Certification");
        await dashboard.filterByTodaysDate();
        await dashboard.verifyCompletedCertificate(certificationTP);
    });

});
