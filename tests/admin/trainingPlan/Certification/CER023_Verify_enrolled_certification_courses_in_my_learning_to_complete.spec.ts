import { credentials } from "../../../../constants/credentialData";
import { test } from "../../../../customFixtures/expertusFixture";
import { expect } from "@playwright/test";
import { FakerData } from "../../../../utils/fakerUtils";
import { createCourseAPI } from "../../../../api/apiTestIntegration/courseCreation/createCourseAPI";

const content = 'content testing-001';
let courseName1 = "API " + FakerData.getCourseName();
let courseName2 = "API " + FakerData.getCourseName();
let courseName3 = "API " + FakerData.getCourseName();
let certificationName = "CERT " + FakerData.getCourseName();
let description = FakerData.getDescription();
const user = credentials.LEARNERUSERNAME.username;

test.describe(`TP049_Verify_enrolled_certification_courses_in_my_learning_to_complete.spec.ts`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Create first course through API for certification`, async () => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TP049 - Create first course via API for certification` },
            { type: `Test Description`, description: `Create first course through API that will be added to certification` }
        );

        const result1 = await createCourseAPI(
            content,
            courseName1,
            'published',   // status--Show in catalog
            'single',      // instances
            'e-learning'   // sub_type/delivery type
        );

        console.log(`✅ Successfully created first course: "${courseName1}"`);
        expect(result1).toBe(courseName1);
    });

    test(`Create second course through API for certification`, async () => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TP049 - Create second course via API for certification` },
            { type: `Test Description`, description: `Create second course through API that will be added to certification` }
        );

        const result2 = await createCourseAPI(
            content,
            courseName2,
            'published',   // status--Show in catalog
            'single',      // instances
            'e-learning'   // sub_type/delivery type
        );

        console.log(`✅ Successfully created second course: "${courseName2}"`);
        expect(result2).toBe(courseName2);
    });

    test(`Create third course through API for certification`, async () => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TP049 - Create third course via API for certification` },
            { type: `Test Description`, description: `Create third course through API that will be added to certification` }
        );

        const result3 = await createCourseAPI(
            content,
            courseName3,
            'published',   // status--Show in catalog
            'single',      // instances
            'e-learning'   // sub_type/delivery type
        );

        console.log(`✅ Successfully created third course: "${courseName3}"`);
        expect(result3).toBe(courseName3);
    });

    test(`Create certification through UI and add the three API-created courses`, async ({ createCourse, adminHome, learningPath }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TP049 - Create certification through UI and add three courses` },
            { type: `Test Description`, description: `Create certification through UI and attach the three API-created courses` }
        );

        console.log(`🔄 Creating certification: ${certificationName}`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(certificationName);
        await learningPath.language();
        await learningPath.description(description);
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();

        // Add first course
        console.log(`🔄 Adding first course to certification`);
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName1);
        await learningPath.clickAddSelectCourse();
        console.log(`✅ Added first course: ${courseName1}`);

        // Add second course
        console.log(`🔄 Adding second course to certification`);
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName2);
        await learningPath.clickAddSelectCourse();
        console.log(`✅ Added second course: ${courseName2}`);

        // Add third course
        console.log(`🔄 Adding third course to certification`);
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName3);
        await learningPath.clickAddSelectCourse();
        console.log(`✅ Added third course: ${courseName3}`);
        
        console.log(`🔄 Publishing certification to catalog`);
        await learningPath.clickDetailTab();
        await learningPath.description(description);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

        console.log("✅ Certification created successfully: " + certificationName);
    });

    test(`Verify enrolled certification courses are displayed in My Learning To_Complete tab`, async ({ learnerHome, catalog, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TP049 - Verify 3 enrolled courses in My Learning To_Complete tab` },
            { type: `Test Description`, description: `Verify that the enrolled certification courses (3 courses) are displayed in My Learning To_Complete tab` }
        );

        console.log(`🔄 Learner enrolling in certification`);
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(certificationName);
        await catalog.clickEnrollButton();
        await catalog.clickViewCertificationDetails();
        
        console.log(`🔄 Navigating to My Learning to verify courses`);
        await learnerHome.clickMyLearning();
        
        // Verify all three courses from certification are visible in To Complete tab
        console.log(`🔄 Searching for first course in My Learning`);
        await catalog.searchMyLearning(courseName1);
        await catalog.verifyEnrolledCourseByTitle(courseName1);
        console.log("✅ First course found in To Complete tab: " + courseName1);
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();

        // Clear search and search for second course
        console.log(`🔄 Searching for second course in My Learning`);
        await learnerHome.clickMyLearning();
        await catalog.searchMyLearning(courseName2);
        await catalog.verifyEnrolledCourseByTitle(courseName2);
        console.log("✅ Second course found in To Complete tab: " + courseName2);
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();

        // Clear search and search for third course
        console.log(`🔄 Searching for third course in My Learning`);
        await learnerHome.clickMyLearning();
        await catalog.searchMyLearning(courseName3);
        await catalog.verifyEnrolledCourseByTitle(courseName3);
        console.log("✅ Third course found in To Complete tab: " + courseName3);
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();

        console.log(`✅ All certification courses verified and completed in My Learning`);
    });
});
