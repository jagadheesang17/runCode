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
let certificationName = "CERT " + FakerData.getCourseName();
let description = FakerData.getDescription();
const user = credentials.LEARNERUSERNAME.username;

test.describe(`TP064_Verify_certification_with_reorder_delete_optional_and_enforce_sequence.spec.ts`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Create 5 courses through API for certification`, async () => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TP064 - Create 5 courses via API` },
            { type: `Test Description`, description: `Create 5 courses with content testing-001 through API` }
        );

        console.log(`🔄 Creating 5 courses through API...`);

        const result1 = await createCourseAPI(content, courseName1, 'published', 'single', 'e-learning');
        console.log(`✅ Successfully created course 1: "${courseName1}"`);
        expect(result1).toBe(courseName1);

        const result2 = await createCourseAPI(content, courseName2, 'published', 'single', 'e-learning');
        console.log(`✅ Successfully created course 2: "${courseName2}"`);
        expect(result2).toBe(courseName2);

        const result3 = await createCourseAPI(content, courseName3, 'published', 'single', 'e-learning');
        console.log(`✅ Successfully created course 3: "${courseName3}"`);
        expect(result3).toBe(courseName3);

        const result4 = await createCourseAPI(content, courseName4, 'published', 'single', 'e-learning');
        console.log(`✅ Successfully created course 4: "${courseName4}"`);
        expect(result4).toBe(courseName4);

        const result5 = await createCourseAPI(content, courseName5, 'published', 'single', 'e-learning');
        console.log(`✅ Successfully created course 5: "${courseName5}"`);
        expect(result5).toBe(courseName5);

        console.log(`✅ All 5 courses created successfully with content testing-001!`);
    });

    test(`Create certification and manage courses - reorder, delete, optional, and enforce sequence`, async ({ createCourse, adminHome, learningPath }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `TP064 - Create certification with reorder, delete, optional, and enforce sequence` },
            { type: `Test Description`, description: `Create certification, add 5 courses, reorder, delete one, set optional courses, set completion required, enforce sequence` }
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

        console.log(`🔄 Adding all 5 courses to certification`);
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName1);
        await learningPath.clickAddSelectCourse();
        console.log(`✅ Added course 1: ${courseName1}`);

        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName2);
        await learningPath.clickAddSelectCourse();
        console.log(`✅ Added course 2: ${courseName2}`);

        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName3);
        await learningPath.clickAddSelectCourse();
        console.log(`✅ Added course 3: ${courseName3}`);

        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName4);
        await learningPath.clickAddSelectCourse();
        console.log(`✅ Added course 4: ${courseName4}`);

        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName5);
        await learningPath.clickAddSelectCourse();
        console.log(`✅ Added course 5: ${courseName5}`);

        console.log(`🔄 Testing reorder functionality - dragging first course down`);
        await learningPath.reorderCourse(courseName1, courseName2);
        await learningPath.wait("minWait");

        console.log(`🔄 Setting optional courses - making last 3 courses optional`);
        const courseNamesArray = [courseName1, courseName2, courseName3, courseName4, courseName5];
        await learningPath.makeLastCoursesOptional(3, courseNamesArray);

        console.log(`🔄 Setting completion required to 2`);
        await learningPath.setCompletionRequired("2");

        console.log(`🔄 Enabling Enforce Sequence`);
        await learningPath.clickEnforceCheckbox();

        console.log(`🔄 Deleting one course`);
        await learningPath.deleteCourse(courseName5);

        console.log(`🔄 Publishing certification to catalog`);
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();

        console.log(`✅ Certification created with reorder, delete, optional, and enforce sequence: ${certificationName}`);
    });

    test(`Verify learner enrollment and completion of certification`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify learner enrollment in certification` },
            { type: `Test Description`, description: `Verify learner can enroll and complete certification with enforce sequence` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(certificationName);
        await catalog.clickEnrollButton();
        await catalog.clickViewCertificationDetails();

        console.log(`🔄 Completing required courses in sequence`);
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.clickOnNextCourse(courseName2);
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.verifyStatus("Completed");
        console.log(`✅ Certification completed successfully`);
    });
});
