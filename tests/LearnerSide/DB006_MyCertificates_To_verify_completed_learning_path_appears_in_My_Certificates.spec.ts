import { test } from '../../customFixtures/expertusFixture';
import { FakerData } from '../../utils/fakerUtils';
import { expect } from '@playwright/test';
import { credentials } from '../../constants/credentialData';
import { createCourseAPI } from '../../api/apiTestIntegration/courseCreation/createCourseAPI';

const courseName = FakerData.getCourseName();
const content = 'content testing-001';
const learningPathTitle = "LP " + FakerData.getCourseName();
let description = FakerData.getDescription();

test.describe(`DB006 - Verify completed learning path appears in My Certificates section`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Test 1 - Create course, learning path and publish to catalog`, async ({ learningPath, adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `DB006_Test1 - Create learning path and publish to catalog` },
            { type: `Test Description`, description: `Create course via API, create learning path, attach course and publish to catalog` }
        );

        console.log(`🔄 Creating E-Learning course via API: ${courseName}`);
        const result = await createCourseAPI(content, courseName, 'published', 'single', 'e-learning');
        expect(result).toBe(courseName);
        console.log(`✅ Course created successfully via API: ${courseName}`);
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
        await learningPath.title(learningPathTitle);
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
        console.log(`✅ Learning Path created and published to catalog: ${learningPathTitle}`);
    });

    test(`Test 2 - Enroll in learning path and verify in My Certificates`, async ({ learnerHome, catalog, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `DB006_Test2 - Enroll in learning path and verify in My Certificates` },
            { type: `Test Description`, description: `Enroll in learning path from catalog and verify it appears in My Certificates section` }
        );
        
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(learningPathTitle);
        await catalog.clickMoreonCourse(learningPathTitle);
        await catalog.clickSelectcourse(learningPathTitle);
        await catalog.clickEnroll();
        console.log(`✅ Learner enrolled in learning path: ${learningPathTitle}`);
        
        await learnerHome.clickDashboardLink();
        await dashboard.selectDashboardItems("My Certificates");
        await dashboard.clickLearningpathAndCertificationLink();
        await dashboard.verifyMyCertificatesSection(learningPathTitle);
        console.log(`✅ Learning Path verified in My Certificates: ${learningPathTitle}`);
    });
});
