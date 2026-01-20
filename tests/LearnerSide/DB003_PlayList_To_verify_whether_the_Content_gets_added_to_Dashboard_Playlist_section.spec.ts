import { test } from '../../customFixtures/expertusFixture';
import { FakerData } from '../../utils/fakerUtils';
import { expect } from '@playwright/test';
import { credentials } from '../../constants/credentialData';
import { createCourseAPI } from '../../api/apiTestIntegration/courseCreation/createCourseAPI';


const courseName = FakerData.getCourseName();
const content = 'content testing-001';

test.describe(`DB003 - Verify Content gets added to Dashboard Playlist section`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Test 1 - Create Course and Add to playlist`, async ({ learnerHome, catalog, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `DB003_Test1 - Create and publish content` },
            { type: `Test Description`, description: `Create video content and publish it` }
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
        await catalog.addtoplayLilst(content, "Dashboard_Playlist");
        console.log(`✅ Course added to new playlist 'Dashboard_Playlist' successfully`);
        await catalog.clickMyLearning();
        await dashboard.selectDashboardItems("Learning Playlists");
        await dashboard.clickEditPlaylist("Dashboard_Playlist");
        await dashboard.verifyContentInPlaylist(content);
        await dashboard.verifyAddedOnDate();
        console.log(`✅ Content and Added on date verified in playlist successfully`);
        



    });


});
