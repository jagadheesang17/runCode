import { test } from '../../customFixtures/expertusFixture';
import { FakerData } from '../../utils/fakerUtils';
import { expect } from '@playwright/test';
import { credentials } from '../../constants/credentialData';
import { createCourseAPI } from '../../api/apiTestIntegration/courseCreation/createCourseAPI';

const courseName = FakerData.getCourseName();
const content = 'content testing-001';

test.describe(`DB004 - Verify completed course appears in My Certificates section`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Test 1 - Create and enroll in course`, async ({ learnerHome, catalog, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `DB004_Test1 - Create and enroll in course` },
            { type: `Test Description`, description: `Create E-Learning course via API and enroll learner` }
        );

        console.log(`🔄 Creating E-Learning course via API: ${courseName}`);
        const result = await createCourseAPI(content, courseName, 'published', 'single', 'e-learning');
        expect(result).toBe(courseName);
        console.log(`✅ Course created successfully via API: ${courseName}`);

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(courseName);
        await catalog.clickMoreonCourse(courseName);
        await catalog.clickSelectcourse(courseName);
        await catalog.clickEnroll();
        console.log(`✅ Learner enrolled in course: ${courseName}`);
        await learnerHome.clickDashboardLink();
        await dashboard.selectDashboardItems("My Certificates");
        await dashboard.verifyMyCertificatesSection(courseName);
    });

});
