import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { expect } from "allure-playwright";
import { credentials } from "../../../constants/credentialData";
import { createCourseAPI } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";

test.describe('CC015 - Certificate Unpublish Restriction and Assessment Validation', () => {

    const certUser = require('../../../data/completionCertificate/certificateTestUser.json');

  
     test("CC015a - Verify cannot unpublish certificate when associated with Course", async ({ adminHome, CompletionCertification, createCourse, editCourse }) => {
    const certificateTitle = FakerData.getcertificationTitle();
    const courseName = FakerData.getCourseName();
    const description = FakerData.getDescription();
    const assessmentCertificateTitle = FakerData.getcertificationTitle();

        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'CC015a_Unpublish_Restriction_Course' },
            { type: 'Test Description', description: 'Verify that certificate cannot be unpublished when it is associated to a Course' }
        );

        const content = 'content testing-001';
        const result = await createCourseAPI(content, courseName, 'published', 'single', 'e-learning');
        expect(result).toBe(courseName);
        console.log(`✅ Course created via API: "${courseName}"`);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCompletionCertification();
        await CompletionCertification.clickCreateCompletionCertificate();
        await CompletionCertification.clickTemplateType();
        await CompletionCertification.title(certificateTitle);
        await CompletionCertification.designCertificate(description);
        await CompletionCertification.clickPublish();
        await CompletionCertification.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Certificate created and published: ${certificateTitle}`);

        await adminHome.page.reload();
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.catalogSearch(courseName);
        await createCourse.editCourseFromListingPage();
        await editCourse.clickCompletionCertificate();
        await editCourse.selectCourseCompletionCertificate(certificateTitle);
        console.log(`✅ Certificate attached to course: ${courseName}`);

        // Step 4: Try to unpublish the certificate (should fail or show warning)
        await adminHome.page.reload();
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCompletionCertification();
        await CompletionCertification.searchCompletionCertificate(certificateTitle);
        await CompletionCertification.clickUnpublishIcon(certificateTitle);
        await CompletionCertification.verifyUnpublishRestrictionMessage();
        console.log(`✅ Verified: Certificate cannot be unpublished when associated with Course`);
    });

    test("CC015b - Verify cannot unpublish certificate when associated with Training Plan", async ({ adminHome, editCourse,CompletionCertification, createCourse, learningPath }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'CC015b_Unpublish_Restriction_TP' },
            { type: 'Test Description', description: 'Verify that certificate cannot be unpublished when it is associated to a Training Plan' }
        );

        const completionCertificate = FakerData.getcertificationTitle();
        const certification = FakerData.getCourseName();
        const description = FakerData.getDescription();
        const courseName = FakerData.getCourseName();
        
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
        await CompletionCertification.title(completionCertificate);
        await CompletionCertification.designCertificate(description);
        await CompletionCertification.clickPublish();
        await CompletionCertification.clickProceed();
        await createCourse.verifySuccessMessage
        // await CompletionCertification.verifyCeritificateSuccessMessage();

        await adminHome.page.reload();
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(certification);
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
        console.log(`✅ Training Plan created: ${certification}`);

        // Step 4: Attach Completion Certificate to Training Plan
        await learningPath.clickEditCertification();
        await createCourse.clickCompletionCertificate();
        await editCourse.selectCourseCompletionCertificate(completionCertificate);
        await learningPath.description(description);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Certificate attached to Training Plan`);
        // Step 5: Try to unpublish the certificate (should fail or show warning)
        await adminHome.page.reload();
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCompletionCertification();

        await CompletionCertification.searchCompletionCertificate(completionCertificate);
        await CompletionCertification.clickUnpublishIcon(completionCertificate);
        await CompletionCertification.verifyUnpublishRestrictionMessage();
    });



});
