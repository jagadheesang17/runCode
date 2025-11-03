import { test } from '../../customFixtures/expertusFixture';
import { FakerData } from '../../utils/fakerUtils';

const accessCourseName = FakerData.getCourseName() + "_AccessControlCourse";
const accessGroupTitle = FakerData.getFirstName() + "_AccessGroup";
const testUsername = "jagadish1712"; // Specific user mentioned in requirements
const description = FakerData.getDescription();

test.describe(`Verify that the Learner able to view the course in catalog page based on domain with learner group access`, () => {
    test.describe.configure({ mode: "serial" });

    test(`LG28_001 - Create course for access control testing`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `LG28_001 - Course Creation for Access Control` },
            { type: `Test Description`, description: `Create a course that will be used for testing learner group access control functionality` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", accessCourseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("Access control test course: " + description);
        
        // Add content to the course
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        
        console.log(`Course created successfully for access control: ${accessCourseName}`);
    });

    test(`LG28_002 - Create learner group for access control`, async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `LG28_002 - Learner Group Creation for Access Control` },
            { type: `Test Description`, description: `Create a learner group and add the specific test user for access control testing` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        await learnerGroup.clickCreateGroup();
        await learnerGroup.enterGroupTitle(accessGroupTitle);
        
        // Add the specific user to the group
        console.log(`Adding test user ${testUsername} to the learner group`);
        await learnerGroup.selectLearners(testUsername);
        
        // Activate and save the group
        await learnerGroup.clickActivateToggle();
        await learnerGroup.clickSaveButton();
        await learnerGroup.confirmGroupCreation();
        await learnerGroup.clickProceedButton();
        await learnerGroup.clickGoToListing();
        await learnerGroup.verifySuccessMessage("Learner Group created successfully");
        await learnerGroup.searchGroup(accessGroupTitle);
        
        console.log(`Learner group created for access control: ${accessGroupTitle}`);
    });

    test(`LG28_003 - Edit course to set access for learner group`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `LG28_003 - Course Access Settings Configuration` },
            { type: `Test Description`, description: `Edit the created course to set access permissions for the newly created learner group` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        
        // Search for the created course
        await adminHome.enter("main-search", accessCourseName);
        await createCourse.wait('minWait');
        
        // Edit the course
        await createCourse.editcourse();
        await editCourse.wait('minWait');
        
        // Access the course access settings
        await createCourse.clickAccessButton();
        await createCourse.wait('minWait');
        
        // Add the learner group to course access
        console.log(`Setting access for learner group: ${accessGroupTitle}`);
        await editCourse.addLearnerGroup(accessGroupTitle);
        
        // Save the access settings
        await createCourse.saveAccessButton();
        await createCourse.wait('minWait');
        
        // Close the edit dialog
        await editCourse.clickClose();
        
        console.log(`Course access settings configured for learner group: ${accessGroupTitle}`);
    });

    test(`LG28_004 - Verify course access from learner side catalog`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `LG28_004 - Learner Side Course Access Verification in Catalog` },
            { type: `Test Description`, description: `Login as the test user and verify that the course is accessible in the catalog page based on domain with learner group access` }
        );

        // Login as the specific test user
        await learnerHome.basicLogin(testUsername, "default");
        await learnerHome.clickCatalog();
        
        // Search for the course in catalog
        console.log(`Searching for course: ${accessCourseName} in learner catalog`);
        await catalog.searchCatalog(accessCourseName);
        
        // Verify course is visible and accessible
        await catalog.clickMoreonCourse(accessCourseName);
        await catalog.clickSelectcourse(accessCourseName);
        
        
                console.log(`Course access control verification in catalog completed successfully!`);
    });
});