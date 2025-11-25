import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { credentials } from "../../../constants/credentialData";

const contentTitle = FakerData.getRandomTitle();
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();

test.describe(`CNT072 - Verify Transfer Learner and Discard buttons are visible when transferring learners to new content version`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create and Publish Content`, async ({
        adminHome,
        contentHome,
        createCourse,
        SurveyAssessment,
        enrollHome
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT072 - Create and Publish Content` },
            { type: `Test Description`, description: `Create content and publish it for course attachment` }
        );

        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.clickMenu("Content");
        await adminHome.clickCreate("Content");

        console.log(`\n📄 Creating content: "${contentTitle}"`);
        await contentHome.enter("content-title", contentTitle);
        await contentHome.enterDescription(`Content for version transfer testing - ${contentTitle}`);
        await contentHome.uploadContent("SamplePPTX.pptx");
        await contentHome.wait("mediumWait");

        await SurveyAssessment.clickPublish();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();


    });

    test(`Step 2: Create Course and Attach Content`, async ({
        adminHome,
        createCourse, enrollHome
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT072 - Create Course and Attach Content` },
            { type: `Test Description`, description: `Create course and attach the published content` }
        );


        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");

        console.log(`\n📖 Creating course: "${courseName}"`);
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);

        console.log(`\n📎 Attaching content: "${contentTitle}"`);
        await createCourse.contentLibrary(contentTitle);

        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();

    });

    test(`Step 3: Edit Content and Add New Version`, async ({
        adminHome,
        contentHome,
        createCourse,
        SurveyAssessment
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT072 - Add New Version` },
            { type: `Test Description`, description: `Edit content and create a new version` }
        );



        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickContentmenu();

        console.log(`\n🔎 Searching for content: "${contentTitle}"`);
        await contentHome.contentVisiblity(contentTitle);
        await contentHome.clickEditContentOnListing();
        await contentHome.wait("mediumWait");

        console.log(`\n➕ Adding new version...`);
        await contentHome.clickAddVersionBtn();

        // Upload new version file
        await contentHome.uploadContent("SamplePPTX.pptx");
        await contentHome.wait("mediumWait");

        await SurveyAssessment.clickPublish();

        await createCourse.verifySuccessMessage();

        console.log(`✅ New version created and published`);

    });

    test(`Step 4: Edit Content and Click Transfer Learner Button`, async ({
        adminHome,
        contentHome
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT072 - Transfer Learner to New Version` },
            { type: `Test Description`, description: `Click Transfer Learner button and verify buttons visibility` }
        );

        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickContentmenu();

        console.log(`\n🔎 Searching for content: "${contentTitle}"`);
        await contentHome.contentVisiblity(contentTitle);
        await contentHome.clickEditContentOnListing();
        await contentHome.wait("mediumWait");

        console.log(`\n🔄 Clicking Transfer Learner to New Version button...`);
        await contentHome.clickTransferLearnerBtn();
        await contentHome.wait("mediumWait");
        await contentHome.verifyTransferLearner();
        await contentHome.clickTransferFrom();
        await contentHome.selectContentVersion("2");
        await contentHome.verifyDiscardBtnEnabled();

    });
});