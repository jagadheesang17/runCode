import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { expect } from "allure-playwright";
import { createCourseAPI } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";

test.describe('CC012 - Course Certificate Validation', () => {

    const certificateTitle = FakerData.getcertificationTitle();
    const courseName = FakerData.getCourseName();
    const certUser = require('../../../data/completionCertificate/certificateTestUser.json');


    test("CC012 - Admin: Verify published certificate listed under Course", async ({ adminHome, CompletionCertification,createCourse,editCourse,enrollHome }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'CC012_Admin_Course_Certificate' },
            { type: 'Test Description', description: 'Verify published completion certificates are listed under Course' }
        );
        const content='content testing-001';
        const result = await createCourseAPI(content,courseName,'published','single','e-learning');
        expect(result).toBe(courseName);
        console.log(` Successfully created course: "${courseName}"`);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCompletionCertification();
        await CompletionCertification.clickCreateCompletionCertificate();
        await CompletionCertification.clickTemplateType();
        await CompletionCertification.title(certificateTitle);
        // await CompletionCertification.designCertificate(FakerData.getDescription());
        await CompletionCertification.designCertificateWithHtml(FakerData.getDescription());
        await CompletionCertification.clickPublish();
        await CompletionCertification.clickProceed();
        await createCourse.verifySuccessMessage

        await adminHome.page.reload();
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.catalogSearch(courseName);
        await createCourse.editCourseFromListingPage();
        await editCourse.clickCompletionCertificate();
        await editCourse.selectCourseCompletionCertificate(certificateTitle);
        
        await editCourse.page.reload();
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(certUser.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        console.log(`✅ Enrolled certificate test user: ${certUser.username}`);

    });

    test("CC012 - Learner: Verify certificate view, print, download and dashboard,View Completed certificates  & LEARNING HISTORY", async ({ learnerHome, catalog, dashboard }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'CC012_Learner_Course_Certificate' },
            { type: 'Test Description', description: 'Verify learner can view, print, download certificate and verify dashboard' }
        );

        await learnerHome.basicLogin(certUser.username, "DefaultPortal");
        await catalog.searchMyLearning(courseName);
        await catalog.clickCourseInMyLearning(courseName);
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.clickMyLearning();
        await catalog.clickCompletedButton();
        await catalog.searchMyLearning(courseName);
        await catalog.verifyCompletedCourse(courseName);
        await catalog.clickViewCertificate();
        await catalog.verifyCertificateModalDisplayed();
        // Verify certificate content in UI modal
        await catalog.verifyCertificateContent(`${certUser.firstname} ${certUser.lastname}`, courseName);
        const pdfPath = await catalog.downloadCertificateAsPDF();
        await catalog.verifyPDFFile(pdfPath);
        await learnerHome.clickDashboardLink();
        await dashboard.selectCertificateType("Course");
        await dashboard.filterByTodaysDate();
        await dashboard.verifyCompletedCertificate(courseName);


    });

});
