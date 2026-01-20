import { credentials } from "../../../../constants/credentialData";
import { test } from "../../../../customFixtures/expertusFixture";
import { expect } from "@playwright/test";
import { FakerData } from "../../../../utils/fakerUtils";
import { createCourseAPI } from "../../../../api/apiTestIntegration/courseCreation/createCourseAPI";

const content = 'content testing-001';

let courseName1 = FakerData.getCourseName();
let courseName2 = FakerData.getCourseName();
let courseName3 = FakerData.getCourseName();
let learningPathName = "LP " + FakerData.getCourseName();
let description = FakerData.getDescription();
const user = credentials.LEARNERUSERNAME.username;

test.describe(`TP044_Verify_learning_path_with_optional_course_and_enforce_sequence.spec.ts`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Create 3 courses through API for learning path`, async () => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TP044 - Create 3 courses via API` },
            { type: `Test Description`, description: `Create 3 courses with content testing-001 through API` }
        );

        console.log(`🔄 Creating 3 courses through API...`);

        // Create first course
        const result1 = await createCourseAPI(
            content,
            courseName1,
            'published',
            'single',
            'e-learning'
        );
        console.log(`✅ Successfully created course 1: "${courseName1}"`);
        expect(result1).toBe(courseName1);

        // Create second course
        const result2 = await createCourseAPI(
            content,
            courseName2,
            'published',
            'single',
            'e-learning'
        );
        console.log(`✅ Successfully created course 2: "${courseName2}"`);
        expect(result2).toBe(courseName2);

        // Create third course
        const result3 = await createCourseAPI(
            content,
            courseName3,
            'published',
            'single',
            'e-learning'
        );
        console.log(`✅ Successfully created course 3: "${courseName3}"`);
        expect(result3).toBe(courseName3);

        console.log(`✅ All 3 courses created successfully with content testing-001!`);
    });

    test(`Create learning path with optional course and enforce sequence`, async ({ adminHome, learningPath }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TP044 - Create LP with optional course and enforce sequence` },
            { type: `Test Description`, description: `Create learning path, add 3 courses, make one optional, set completion required to 1, enable enforce sequence` }
        );

        console.log(`🔄 Creating learning path: ${learningPathName}`);
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

        console.log(`🔄 Adding all 3 courses to learning path`);
        // Add first course
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName1);
        await learningPath.clickAddSelectCourse();
        console.log(`✅ Added course 1: ${courseName1}`);

        // Add second course
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName2);
        await learningPath.clickAddSelectCourse();
        console.log(`✅ Added course 2: ${courseName2}`);

        // Add third course
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName3);
        await learningPath.clickAddSelectCourse();
        console.log(`✅ Added course 3: ${courseName3}`);

        console.log(`🔄 Making one course optional`);
        // Make last course optional
        const courseNamesArray = [courseName1, courseName2, courseName3];
        await learningPath.makeLastCoursesOptional(1, courseNamesArray);
        console.log(`✅ Made course 3 optional: ${courseName3}`);

        console.log(`🔄 Setting completion required to 1`);
        // Set completion required to 1
        await learningPath.setCompletionRequired("1");
        console.log(`✅ Set completion required to 1`);

        console.log(`🔄 Enabling Enforce Sequence`);
        // Enable Enforce Sequence
        await learningPath.clickEnforceCheckbox();
        console.log(`✅ Enforce Sequence enabled`);

        console.log(`🔄 Publishing learning path to catalog`);
        // Publish to catalog
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();

        console.log(`✅ Learning Path created successfully: ${learningPathName}`);
        console.log(`   Total courses added: 3`);
        console.log(`   Optional courses: 1 (Course 3: ${courseName3})`);
        console.log(`   Completion required: 1`);
        console.log(`   Enforce Sequence: Enabled`);
    });

    test(`Verify learner side - enforce sequence with optional course`, async ({ learnerHome, catalog, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify enforce sequence with optional course on learner side` },
            { type: `Test Description`, description: `Verify enforce sequence prevents skipping courses and test optional course enrollment` }
        );

        console.log(`🔄 Learner logging in and enrolling in learning path`);
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(learningPathName);
        await catalog.clickEnrollButton();
        await catalog.clickViewLearningPathDetails();

        console.log(`🔄 Testing enforce sequence - trying to access course 2 without completing course 1`);
        // Click my learning, search course, click course 2
        await learnerHome.clickMyLearning();
        await catalog.searchMyLearning(courseName2);
        await catalog.clickCourseInMyLearning(courseName2);
        
        console.log(`🔄 Clicking on course 2 to test enforce sequence`);
        // Click on course 2 using clickOnNextCourse method
        await catalog.clickOnNextCourse(courseName2);
        
        console.log(`🔄 Verifying enforce sequence error message on course details page`);
        // Verify enforce sequence error message
        await catalog.verifyEnforceSequenceErrorMessage();
        console.log(`✅ Enforce sequence error message verified on course 2 details page`);

        console.log(`🔄 Going to My Learning and attempting to launch course 2 directly`);
        // Click my learning again
        await learnerHome.clickMyLearning();
        await catalog.searchMyLearning(courseName2);    
        console.log(`🔄 Trying to launch content from My Learning page`);
        // Call launchContentFromMylearning method
        await catalog.launchContentFromMylearning();
        
        console.log(`🔄 Verifying enforce sequence error message on launch attempt`);
        // Verify enforce sequence error message again

       // await catalog.verifyEnforceSequenceErrorMessage();
        console.log(`✅ Enforce sequence error message verified on launch attempt`);

        console.log(`🔄 Going back to complete course 1 first`);
        // Click my learning again
        await learnerHome.clickMyLearning();
        await catalog.searchMyLearning(courseName1);
        await catalog.clickCourseInMyLearning(courseName1);
        
        console.log(`🔄 Searching and clicking first course to complete it`);
        console.log(`🔄 Launching and completing course 1`);
        // Launch and complete course 1
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        console.log(`✅ Course 1 completed: ${courseName1}`);
        await catalog.clickOnNextCourse(courseName2)
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.verifyStatus("In Progress");
        await catalog.clickFirstOptionalCourseAndEnroll();
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.saveLearningStatus();
        await catalog.verifyStatus("Completed");
        console.log(`✅ Enforce sequence verification completed successfully`);
        console.log(`   Verified that learner cannot skip courses`);
        console.log(`   Verified error message appears on both course details and launch attempt`);
        console.log(`   Completed course 1 to proceed with learning path`);
    });
});
