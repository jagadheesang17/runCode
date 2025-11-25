import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { contentVersionStatistics } from "../DB/DBJobs";
import { credentials } from "../../../constants/credentialData";

let courseName: string = "";
let title: string = "";
let TPName: string = "";
let contentSize: string = "";
let contentVersion: string = "";
let contentLanguage: string = "";

test.describe(`CNT074 - Verify content details displayed in listing page`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Create content and capture details`, async ({ 
        adminHome, 
        contentHome,
        bannerHome,
        createCourse
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT074 - Step 1: Create Content` },
            { type: `Test Description`, description: `Create content and capture title, size, version, language` }
        );

        // Create content
        title = FakerData.getRandomTitle();
        await adminHome.loadAndLogin("LEARNERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickContentmenu();
        await contentHome.clickCreateContent();
        await contentHome.enter("content-title", title);
        await contentHome.enterDescription("Sample content for " + title);
        await contentHome.uploadContent("samplevideo.mp4");
        await bannerHome.clickPublish();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await contentHome.clickEditContent();

        // Capture content details before publishing
        contentVersion = await contentHome.getContentVersion();
        contentLanguage = await contentHome.getContentLanguage();
        
        // Get content size after creation
        contentSize = await contentHome.getContentSizeFromListing(title);
    });

    test(`Create course and enroll learner`, async ({ 
        adminHome, 
        createCourse,
        contentHome,
        enrollHome
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT074 - Step 2: Create Course` },
            { type: `Test Description`, description: `Create course, attach content, and enroll learner` }
        );

        courseName = FakerData.getCourseName();
        await adminHome.loadAndLogin("LEARNERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course: " + courseName);
        await createCourse.contentLibrary(title);
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        
        // Enroll learner
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
    });

    test(`Create learning path and enroll learner`, async ({ 
        adminHome, 
        learningPath,
        enrollHome
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT074 - Step 3: Create Learning Path` },
            { type: `Test Description`, description: `Create learning path, attach course, and enroll learner` }
        );

        TPName = FakerData.getCourseName();
        const description = FakerData.getDescription();
        
        await adminHome.loadAndLogin("LEARNERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
        await learningPath.title(TPName);
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
        
        // Enroll learner in learning path
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectByOption("Learning Path");
        await enrollHome.selectBycourse(TPName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
    });

    test(`Execute content version statistics cron job`, async ({ }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT074 - Step 4: Run Cron` },
            { type: `Test Description`, description: `Execute content version statistics cron job` }
        );

        await contentVersionStatistics();
    });

    test(`Verify all content details in listing page`, async ({ 
        adminHome, 
        contentHome
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT074 - Step 5: Verify Details` },
            { type: `Test Description`, description: `Verify title, size, version, language, training count (1), course count (1), and certification in listing page` }
        );

        // Navigate to content listing
        await adminHome.loadAndLogin("LEARNERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickContentmenu();
        await contentHome.wait("mediumWait");

        // Search for the created content
        await contentHome.contentVisiblity(title);
        await contentHome.wait("minWait");

        // Verify title matches what we created
        await contentHome.verifyContentTitleInListing(title);

        // Verify size matches captured value
        await contentHome.verifyContentSizeInListing(contentSize);

        // Verify version matches captured value
        await contentHome.verifyContentVersionInListing(contentVersion);

        // Verify language matches captured value
        await contentHome.verifyContentLanguageInListing(contentLanguage);

        // Verify number of trainings attached (should be 1 - the learning path)
        await contentHome.verifyTrainingCountInListing(1);

        // Verify number of courses attached (should be 1)
        await contentHome.verifyCourseCountInListing(1);

    });
});
