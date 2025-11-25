import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

const contentTitle = FakerData.getRandomTitle();
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();

test.describe(`CNT069 - Verify whether content is not deleted when it is attached to an active course`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create and Publish Content`, async ({ 
        adminHome, 
        contentHome, 
        createCourse,
        SurveyAssessment
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT069 - Create and Publish Content` },
            { type: `Test Description`, description: `Create content and publish it for attaching to course` }
        );


        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.clickMenu("Content");
        await adminHome.clickCreate("Content");

        console.log(`\n📄 Creating content: "${contentTitle}"`);
        await contentHome.enter("content-title", contentTitle);
        await contentHome.enterDescription(`Content for deletion restriction testing - ${contentTitle}`);
        await contentHome.uploadContent("SamplePPTX.pptx");
        await contentHome.wait("mediumWait");

        await SurveyAssessment.clickPublish();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

        console.log(`✅ Content Created and Published: "${contentTitle}"`);
    });

    test(`Step 2: Create Course and Attach Content`, async ({ 
        adminHome, 
        createCourse
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT069 - Create Course and Attach Content` },
            { type: `Test Description`, description: `Create an active course and attach the published content` }
        );

        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");

        console.log(`\n📖 Creating active course: "${courseName}"`);
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);

        console.log(`\n📎 Attaching content: "${contentTitle}"`);
        await createCourse.contentLibrary(contentTitle);
        
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
    });

    test(`Step 3: Verify Content Cannot be Deleted When Attached to Active Course`, async ({ 
        adminHome, 
        contentHome
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT069 - Verify Content Deletion Restriction` },
            { type: `Test Description`, description: `Verify that content attached to an active course cannot be deleted` }
        );

     

        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickContentmenu();

        console.log(`\n🔎 Searching for content: "${contentTitle}"`);
        await contentHome.contentVisiblity(contentTitle);
        console.log(`✅ Content found in listing`);

        console.log(`\n📝 Opening content edit page...`);
        await contentHome.clickEditContentOnListing();
        await contentHome.wait("mediumWait");
        await contentHome.clickUnpublish();
        await contentHome.warningMsgForUnpublishContent();
 

        
    });
});