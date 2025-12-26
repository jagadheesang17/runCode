import { test } from '../../customFixtures/expertusFixture';
import { FakerData } from '../../utils/fakerUtils';
import { expect } from '@playwright/test';
import { credentials } from '../../constants/credentialData';
import { createCourseAPI } from '../../api/apiTestIntegration/courseCreation/createCourseAPI';
import { Certificate } from 'crypto';

const courseName = FakerData.getCourseName();
const content = 'content testing-001';
const certificationTitle = "CERT " + FakerData.getCourseName();
let description = FakerData.getDescription();

test.describe(`DB005 - Verify completed certification appears in My Certificates section`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Test 1 - Create course, certification and enroll`, async ({ learningPath, adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `DB005_Test1 - Create certification and enroll learner` },
            { type: `Test Description`, description: `Create course via API, create certification, attach course and enroll learner` }
        );

        console.log(`🔄 Creating E-Learning course via API: ${courseName}`);
        const result = await createCourseAPI(content, courseName, 'published', 'single', 'e-learning');
        expect(result).toBe(courseName);
        console.log(`✅ Course created successfully via API: ${courseName}`);
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(certificationTitle);
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


    });

    test(`Test 2 - Complete certification and verify in My Certificates`, async ({ learnerHome, catalog, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `DB005_Test2 - Complete certification and verify in My Certificates` },
            { type: `Test Description`, description: `Complete the certification course and verify it appears in My Certificates section` }
        );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(certificationTitle);
        await catalog.clickMoreonCourse(certificationTitle);
        await catalog.clickSelectcourse(certificationTitle);
        await catalog.clickEnroll();
        console.log(`✅ Learner enrolled in course: ${certificationTitle}`);
        await learnerHome.clickDashboardLink();
        await dashboard.selectDashboardItems("My Certificates");
        await dashboard.clickLearningpathAndCertificationLink();
        await dashboard.verifyMyCertificatesSection(certificationTitle);
    });
});
