import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription()

test.describe(`Verify that the hidden in catalog course enrolled by admin is shown in the My learning section`, async () => {
    test.describe.configure({ mode: "serial" });
    
    test(`Create Single Instance Elearning Course and save as Hidden in catalog`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation Team` },
            { type: `TestCase`, description: `CRS1000_Create_hidden_in_catalog_course` },
            { type: `Test Description`, description: `Create Single Instance Elearning Course and save as Hidden in catalog` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a hidden in catalog course: " + description);
      //  await createCourse.selectDomainOption("QA");
        await createCourse.contentLibrary(); // Youtube content is attached here
        await createCourse.clickHideinCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
    });

    test(`Verify that admin can enroll learner in the hidden in catalog course`, async ({ adminHome, createCourse, enrollHome, contentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation Team` },
            { type: `TestCase`, description: `CRS1000_Admin_enrolls_learner_in_hidden_course` },
            { type: `Test Description`, description: `Verify that admin can enroll learner in the hidden in catalog course` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN")
       // await contentHome.gotoListing();
        await adminHome.menuButton()
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectByOption("Course");
        await enrollHome.selectBycourse(courseName)
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username)
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
    });

    test(`Verify that the hidden in catalog course enrolled by admin is shown in the My learning section`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation Team` },
            { type: `TestCase`, description: `CRS1000_Hidden_course_visible_in_My_learning` },
            { type: `Test Description`, description: `Verify that the hidden in catalog course enrolled by admin is shown in the My learning section` }
        );

        // Login as learner
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        
        // Navigate to My Learning section
        await learnerHome.clickMyLearning();
        
        // Search for the hidden course in My Learning
        await catalog.searchMyLearning(courseName);
        
        // Verify that the hidden course is visible and can be launched from My Learning
        await catalog.launchContentFromMylearning();
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        
        console.log("SUCCESS: Hidden in catalog course enrolled by admin is successfully shown in My Learning section");
    });

    test(`Verify that the hidden course is NOT visible in catalog section`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation Team` },
            { type: `TestCase`, description: `CRS1000_Hidden_course_not_in_catalog` },
            { type: `Test Description`, description: `Verify that the hidden course is NOT visible in catalog section but available in My Learning` }
        );

        // Login as learner
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        
        // Navigate to Catalog section
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        
        // Search for the hidden course in Catalog - should not be found
        await catalog.searchCatalog(courseName);
        await catalog.noResultFound();
        
        console.log("SUCCESS: Hidden course is correctly NOT visible in catalog section");
        
        // Now verify it's still available in My Learning
        await learnerHome.clickMyLearning();
        await catalog.searchMyLearning(courseName);
        
        console.log("SUCCESS: Hidden course is available in My Learning as expected");
    });
});