import { credentials } from "../../../constants/credentialData";
import { test } from "../../../customFixtures/expertusFixture";
import { expect } from "@playwright/test";
import { FakerData } from "../../../utils/fakerUtils";
import { createCourseAPI } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { generateOauthToken } from "../../../api/accessToken";
import { title } from "process";

const content = 'content testing-001';
let courseName1 = "API " + FakerData.getCourseName();
let courseName2 = "API " + FakerData.getCourseName();
let courseName3 = "API " + FakerData.getCourseName();
let learningPathName = "LP " + FakerData.getCourseName();
let description = FakerData.getDescription();
const user = credentials.LEARNERUSERNAME.username;

test.describe(`TP032_Verify_enrolled_learning_path_courses_in_my_learning_to_complete.spec.ts`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Create first course through API for learning path`, async () => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create first course via API for learning path` },
            { type: `Test Description`, description: `Create first course through API that will be added to learning path` }
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

    test(`Create second course through API for learning path`, async () => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create second course via API for learning path` },
            { type: `Test Description`, description: `Create second course through API that will be added to learning path` }
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

    test(`Create third course through API for learning path`, async () => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create third course via API for learning path` },
            { type: `Test Description`, description: `Create third course through API that will be added to learning path` }
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

    test(`Create learning path through UI and add the three API-created courses`, async ({ createCourse, adminHome, learningPath, contentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create learning path through UI and add three courses` },
            { type: `Test Description`, description: `Create learning path through UI and attach the three API-created courses` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
        await learningPath.title(learningPathName);
        await learningPath.language();
        await learningPath.description(description);
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();

        // Add first course
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName1);
        await learningPath.clickAddSelectCourse();
        console.log(`✅ Added first course: ${courseName1}`);

        // Add second course
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName2);
        await learningPath.clickAddSelectCourse();
        console.log(`✅ Added second course: ${courseName2}`);

        // Add third course
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName3);
        await learningPath.clickAddSelectCourse();
        console.log(`✅ Added third course: ${courseName3}`);
        await learningPath.clickDetailTab();
        await learningPath.description(description);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

        console.log("✅ Learning Path created successfully: " + learningPathName);
    });



    test(`Verify enrolled learning path courses are displayed in My Learning To_Complete tab`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify 3 enrolled courses in My Learning To_Complete tab` },
            { type: `Test Description`, description: `Verify that the enrolled learning path courses (3 courses) are displayed in My Learning To_Complete tab` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(learningPathName);
        await catalog.clickEnrollButton();
        await catalog.clickViewCertificationDetails();
        await catalog.clickMyLearning();
        // Verify all three courses from learning path are visible in To Complete tab
        await catalog.searchMyLearning(courseName1);
        await catalog.verifyEnrolledCourseByTitle(courseName1);
        console.log("✅ First course found in To Complete tab: " + courseName1);
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();


        // Clear search and search for second course
        await catalog.clickMyLearning();
        await catalog.searchMyLearning(courseName2);
        await catalog.verifyEnrolledCourseByTitle(courseName2);
        console.log("✅ Second course found in To Complete tab: " + courseName2);
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();

        // Clear search and search for third course
        await catalog.clickMyLearning();
        await catalog.searchMyLearning(courseName3);
        await catalog.verifyEnrolledCourseByTitle(courseName3);
        console.log("✅ Third course found in To Complete tab: " + courseName3);
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
    });
});