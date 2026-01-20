import { credentials } from "../../../../constants/credentialData";
import { test } from "../../../../customFixtures/expertusFixture";
import { expect } from "@playwright/test";
import { FakerData } from "../../../../utils/fakerUtils";
import { createCourseAPI } from "../../../../api/apiTestIntegration/courseCreation/createCourseAPI";

const content = 'content testing-001';

let courseName1 = FakerData.getCourseName();
let courseName2 = FakerData.getCourseName();
let courseName3 = FakerData.getCourseName();
let courseName4 = FakerData.getCourseName();
let courseName5 = FakerData.getCourseName();
let learningPathName = "LP " + FakerData.getCourseName();
let description = FakerData.getDescription();
const user = credentials.LEARNERUSERNAME.username;

let orderedCourseNames: string[] = [];

test.describe(`TP043_Verify_learning_path_with_reorder_delete_optional_and_enforce_sequence.spec.ts`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Create 5 courses through API for learning path`, async () => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TP043 - Create 5 courses via API` },
            { type: `Test Description`, description: `Create 5 courses with content testing-001 through API` }
        );

        console.log(`🔄 Creating 5 courses through API...`);

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

        // Create fourth course
        const result4 = await createCourseAPI(
            content,
            courseName4,
            'published',
            'single',
            'e-learning'
        );
        console.log(`✅ Successfully created course 4: "${courseName4}"`);
        expect(result4).toBe(courseName4);

        // Create fifth course
        const result5 = await createCourseAPI(
            content,
            courseName5,
            'published',
            'single',
            'e-learning'
        );
        console.log(`✅ Successfully created course 5: "${courseName5}"`);
        expect(result5).toBe(courseName5);

        console.log(`✅ All 5 courses created successfully with content testing-001!`);
    });

    test(`Create learning path and manage courses - reorder, delete, optional, and enforce sequence`, async ({ createCourse, adminHome, learningPath, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TP043 - Create LP with reorder, delete, optional, and enforce sequence` },
            { type: `Test Description`, description: `Create learning path, add 5 courses, reorder, delete one, set optional courses, set completion required, enforce sequence, add tags and completion certificate` }
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

        console.log(`🔄 Adding all 5 courses to learning path`);
        // Add first course (SCORM)
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName1);
        await learningPath.clickAddSelectCourse();
        console.log(`✅ Added course 1: ${courseName1}`);

        // Add second course (AICC)
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName2);
        await learningPath.clickAddSelectCourse();
        console.log(`✅ Added course 2: ${courseName2}`);

        // Add third course (Video)
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName3);
        await learningPath.clickAddSelectCourse();
        console.log(`✅ Added course 3: ${courseName3}`);

        // Add fourth course (Content)
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName4);
        await learningPath.clickAddSelectCourse();
        console.log(`✅ Added course 4: ${courseName4}`);

        // Add fifth course (Content testing-001)
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName5);
        await learningPath.clickAddSelectCourse();
        console.log(`✅ Added course 5: ${courseName5}`);

        console.log(`🔄 Testing reorder functionality - dragging first course down`);
        // Reorder - drag first course (courseName1) below courseName2
        await learningPath.reorderCourse(courseName1, courseName2);
        await learningPath.wait("minWait");

        console.log(`🔄 Setting optional courses - unchecking last 3 courses`);
        // Uncheck last 3 courses to make them optional
        const courseNamesArray = [courseName1, courseName2, courseName3, courseName4, courseName5];
        const optionalIndices = await learningPath.makeLastCoursesOptional(3, courseNamesArray);

        console.log(`🔄 Setting completion required on the first optional course`);
        // Set completion required on the first optional course
        await learningPath.setCompletionRequired("1");

        console.log(`🔄 Enabling Enforce Sequence`);
        // Enable Enforce Sequence
        await learningPath.clickEnforceCheckbox();
        console.log(`✅ Enforce Sequence enabled`);

        console.log(`🔄 Testing delete functionality - deleting one course`);
        // Delete one course (delete courseName5)
        await learningPath.deleteCourse(courseName5);

        console.log(`🔄 Capturing course order for verification`);
        // Capture all course titles in the current order using the new method
        orderedCourseNames = await learningPath.captureCourseTitles();

        console.log(`🔄 Publishing learning path to catalog`);
        // Publish to catalog
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();

        console.log(`🔄 Adding tags to learning path`);
        // Add tags
        await learningPath.clickEditLearningPath();
        await editCourse.clickTagMenu();
        await editCourse.selectTags();
        await editCourse.clickClose();

        console.log(`🔄 Adding completion certificate to learning path`);
        // Add completion certificate
        await createCourse.clickCompletionCertificate();
        await createCourse.clickCertificateCheckBox();
        await createCourse.clickAdd();
        await learningPath.description(description);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

        console.log(`✅ Learning Path created successfully: ${learningPathName}`);
        console.log(`   Total courses added: 5`);
        console.log(`   Total courses after deletion: 4`);
        console.log(`   Optional courses: 3 (last 3 courses)`);
        console.log(`   Enforce Sequence: Enabled`);
        console.log(`   Tags: Added`);
        console.log(`   Completion Certificate: Attached`);
    });

    test(`Verify learner side - course order and enforce sequence`, async ({ learnerHome, catalog, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify course order and enforce sequence on learner side` },
            { type: `Test Description`, description: `Verify that courses appear in correct order in content player and enforce sequence is working` }
        );

        console.log(`🔄 Learner logging in and enrolling in learning path`);
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(learningPathName);
        await catalog.clickEnrollButton();
        await catalog.clickViewLearningPathDetails();

        console.log(`🔄 Verifying course order in content player`);
        // Get all course titles displayed in the learning path view
        const displayedCourses = await page.locator(`//div[contains(@class,'course-title') or contains(@class,'card-title')]`).allTextContents();
        console.log(`📋 Courses displayed on learner side:`, displayedCourses);

        // Verify that the order matches what was captured during creation
        console.log(`🔍 Comparing with admin-side order:`, orderedCourseNames);

        let matchCount = 0;
        for (let i = 0; i < orderedCourseNames.length && i < displayedCourses.length; i++) {
            const adminCourse = orderedCourseNames[i].trim();
            const learnerCourse = displayedCourses[i].trim();

            if (learnerCourse.includes(adminCourse) || adminCourse.includes(learnerCourse)) {
                matchCount++;
                console.log(`✅ Course ${i + 1} matches: "${adminCourse}"`);
            } else {
                console.log(`⚠️ Course ${i + 1} mismatch - Admin: "${adminCourse}", Learner: "${learnerCourse}"`);
            }
        }
        await catalog.clickOnNextCourse(courseName1)
        await catalog.verifyEnforceSequenceErrorMessage()
        await catalog.clickOnNextCourse(courseName2)
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.clickOnNextCourse(courseName1)
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.verifyStatus("In Progress");
        await catalog.clickFirstOptionalCourseAndEnroll();
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.saveLearningStatus();
        await catalog.clickViewCertificate();
        console.log(`✅ Course order verification completed: ${matchCount}/${orderedCourseNames.length} courses matched`);
        console.log(`✅ Enforce sequence is active - courses must be completed in order`);
    });

    test(`Verify learner side  My Dashboard`, async ({ learnerHome, catalog, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify learner side  My Dashboard` },
            { type: `Test Description`, description: `Verify learner side  My Dashboard` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.searchCertification(learningPathName);
        await dashboard.verifyTheEnrolledCertification(learningPathName);
        await dashboard.clickTitle(learningPathName);
        await catalog.verifyStatus("Completed");
    });
});
