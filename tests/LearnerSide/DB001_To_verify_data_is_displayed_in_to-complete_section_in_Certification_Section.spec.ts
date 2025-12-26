import { test } from '../../customFixtures/expertusFixture';
import { FakerData } from '../../utils/fakerUtils';
import { createCourseAPI } from '../../api/apiTestIntegration/courseCreation/createCourseAPI';
import { expect } from '@playwright/test';
import { credentials } from '../../constants/credentialData';

const courseName = FakerData.getCourseName();
const certificationTitle = FakerData.getCourseName();
const description = FakerData.getDescription();
const content = 'content testing-001';
let user = credentials.LEARNERUSERNAME.username
test.describe(`DB001 - Verify data is displayed in to-complete section in Certification Section`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Test 1 - Create course via API and create certification with attached course`, async ({ adminHome, learningPath, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `DB001_Test1 - Create course and certification` },
            { type: `Test Description`, description: `Create E-Learning course via API and create certification with the course attached` }
        );

        console.log(`🔄 Creating E-Learning course via API: ${courseName}`);
        const result = await createCourseAPI(content, courseName, 'published', 'single', 'e-learning');
        expect(result).toBe(courseName);
        console.log(`✅ Course created successfully via API: ${courseName}`);

        // Create certification and attach the course
        console.log(`🔄 Creating certification: ${certificationTitle}`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(certificationTitle);
        await learningPath.language();
        await learningPath.description(description);
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        
        // Attach course to certification
        console.log(`🔄 Attaching course to certification...`);
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        console.log(`✅ Certification created and course attached successfully`);

        // Enroll learner to certification
        console.log(`🔄 Enrolling learner to certification...`);
        await learningPath.clickEditCertification();
        await learningPath.clickEnrollmentsButton();
        await enrollHome.selectEnroll();
        await enrollHome.enterSearchUser(user);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        console.log(`✅ Learner enrolled to certification successfully`);
    });

    test(`Test 2 - Login as learner and verify certification in Learning Path and Certification section`, async ({ learnerHome, dashboard ,catalog}) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `DB001_Test2 - Verify certification in dashboard` },
            { type: `Test Description`, description: `Login as learner, navigate to Learning Path and Certification, search and verify the certification` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickMyLearning();        
        await catalog.clickMyLearning_LPAndCertification();
        await catalog.searchMyLearning(certificationTitle);
        await dashboard.verifyLearningTypeAndStatus(certificationTitle,"Yet to start");
        console.log(`✅ Certification verified successfully in Learning Path and Certification section`);
    });
});
