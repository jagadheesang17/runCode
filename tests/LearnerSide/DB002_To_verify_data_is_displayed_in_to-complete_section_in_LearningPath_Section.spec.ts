import { test } from '../../customFixtures/expertusFixture';
import { FakerData } from '../../utils/fakerUtils';
import { createCourseAPI } from '../../api/apiTestIntegration/courseCreation/createCourseAPI';
import { expect } from '@playwright/test';
import { credentials } from '../../constants/credentialData';

const courseName = FakerData.getCourseName();
const learningPathTitle = FakerData.getCourseName();
const description = FakerData.getDescription();
const content = 'content testing-001';
let user = credentials.LEARNERUSERNAME.username;

test.describe(`DB002 - Verify data is displayed in to-complete section in Learning Path Section`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Test 1 - Create course via API and create learning path with attached course`, async ({ adminHome, learningPath, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `DB002_Test1 - Create course and learning path` },
            { type: `Test Description`, description: `Create E-Learning course via API and create learning path with the course attached` }
        );

        console.log(`🔄 Creating E-Learning course via API: ${courseName}`);
        const result = await createCourseAPI(content, courseName, 'published', 'single', 'e-learning');
        expect(result).toBe(courseName);
        console.log(`✅ Course created successfully via API: ${courseName}`);

        // Create learning path and attach the course
        console.log(`🔄 Creating learning path: ${learningPathTitle}`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
        await learningPath.title(learningPathTitle);
        await learningPath.language();
        await learningPath.description(description);
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        
        // Attach course to learning path
        console.log(`🔄 Attaching course to learning path...`);
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        console.log(`✅ Learning path created and course attached successfully`);

        // Enroll learner to learning path
        console.log(`🔄 Enrolling learner to learning path...`);
        await learningPath.clickEditLearningPath();
        await learningPath.clickEnrollmentsButton();
        await enrollHome.selectEnroll();
        await enrollHome.enterSearchUser(user);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        console.log(`✅ Learner enrolled to learning path successfully`);
    });

    test(`Test 2 - Login as learner and verify learning path in Learning Path and Certification section`, async ({ learnerHome, dashboard, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `DB002_Test2 - Verify learning path in dashboard` },
            { type: `Test Description`, description: `Login as learner, navigate to Learning Path and Certification, search and verify the learning path` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickMyLearning();        
        await catalog.clickMyLearning_LPAndCertification();
        await catalog.searchMyLearning(learningPathTitle);
        await dashboard.verifyLearningTypeAndStatus(learningPathTitle,"Yet to start");
        console.log(`✅ Learning path verified successfully in Learning Path and Certification section`);
    });
    
});
