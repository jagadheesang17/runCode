import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from '../../../utils/fakerUtils';
import { userCreation, userUpdation } from "../../../api/userAPI";
import { userCreationDataWithOptional } from "../../../data/apiData/formData";

const courseName = FakerData.getCourseName();
const manager1Username = "MGR1_" + FakerData.getUserId();
const manager2Username = "MGR2_" + FakerData.getUserId();
const externalUserUsername = "EXT_USR_" + FakerData.getUserId();
const description = FakerData.getDescription();
let manager1UserId: any;
let manager2UserId: any;
let externalUserId: any;

test.describe(`Verify External user manager approval with Other Manager and re-enrollment`, async () => {
    test.describe.configure({ mode: 'serial' })
    
    test(`Create Manager 1 user with Manager role via API`, async () => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create Manager 1 user with Manager role via API` },
            { type: `Test Description`, description: `Create Manager 1 user with Manager role via API` }
        );
        
        manager1UserId = await userCreation(userCreationDataWithOptional(manager1Username, "manager"));
        console.log("Created Manager 1 with User ID:", manager1UserId);
    })

    test(`Create Manager 2 user with Manager role via API`, async () => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create Manager 2 user with Manager role via API` },
            { type: `Test Description`, description: `Create Manager 2 user with Manager role via API` }
        );
        
        manager2UserId = await userCreation(userCreationDataWithOptional(manager2Username, "manager"));
        console.log("Created Manager 2 with User ID:", manager2UserId);
    })

    test(`Create External user and assign Manager 1 as direct manager via API`, async () => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create External user and assign Manager 1 as direct manager via API` },
            { type: `Test Description`, description: `Create External user with organization type External and assign managers` }
        );
        
        externalUserId = await userCreation(userCreationDataWithOptional(externalUserUsername, undefined, undefined, undefined, undefined, undefined, undefined, manager1Username, manager2Username, "External"));
        console.log("Created External User with organization type External, Manager 1 as direct manager and Manager 2 as other manager, User ID:", externalUserId);
    })


    test(`Create Elearning course with SCORM content and Other Manager approval for both Internal and External users`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create Elearning course with SCORM content and Other Manager approval` },
            { type: `Test Description`, description: `Create Elearning course with Other Manager approval for Internal and External users` }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course with Other Manager approval for External user: " + courseName);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await createCourse.clickEditCourseTabs();
        await editCourse.clickManagerApproval();
        await editCourse.clickexternalManager("Other Manager");
        await editCourse.clickapprovaluserType("Internal Users");
        await editCourse.saveApproval();
        await editCourse.clickBusinessRule();
        // Step 4: Check 'Allow learners to enroll again' checkbox
        await editCourse.checkAllowLearnersEnrollAgain();
        await createCourse.typeDescription("  Added Other Manager Approval for Internal and External Users");
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

    })


    test(`External user requests approval for the course - First enrollment`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `External user requests approval for the course - First enrollment` },
            { type: `Test Description`, description: `External user requests approval for the course` }
        );
        
        await learnerHome.basicLogin(externalUserUsername, "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(courseName);
        await catalog.clickMoreonCourse(courseName);
        await catalog.clickSelectcourse(courseName);
        await catalog.clickRequestapproval();
        await catalog.selectManagerOnRequestApprovalPopup(manager2Username);
        await catalog.submitRequestAndVerify();
    })

    test(`Manager 2 approves the first enrollment request`, async ({ learnerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Manager 2 approves the first enrollment request` },
            { type: `Test Description`, description: `Manager 2 approves the first enrollment request` }
        );
        
        await learnerHome.basicLogin(manager2Username, "DefaultPortal");
        await learnerHome.selectCollaborationHub();
        await learnerHome.clickApprove(courseName);
        await learnerHome.verifyApprovedSuccessfully();
    });

    test(`Complete the course - First enrollment`, async ({ learnerHome, learnerCourse, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Complete the course - First enrollment` },
            { type: `Test Description`, description: `External user completes the course for first time` }
        );
        
        await learnerHome.basicLogin(externalUserUsername, "DefaultPortal");
        await learnerHome.clickMyLearning();
        await catalog.searchMyLearning(courseName);
        await catalog.verifyCompletedCourse(courseName);
        await catalog.clickCourseInMyLearning(courseName);
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();    
        await learnerCourse.clickReEnroll();
        await catalog.clickSelectcourse(courseName);
        await catalog.clickRequestapproval();
        await catalog.selectManagerOnRequestApprovalPopup(manager2Username);
        await catalog.submitRequestAndVerify();
    });


    test(`Manager 2 approves the re-enrollment request`, async ({ learnerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Manager 2 approves the re-enrollment request` },
            { type: `Test Description`, description: `Manager 2 approves the re-enrollment request` }
        );
        
        await learnerHome.basicLogin(manager2Username, "DefaultPortal");
        await learnerHome.selectCollaborationHub();
        await learnerHome.clickApprove(courseName);
        await learnerHome.verifyApprovedSuccessfully();
    });

    test(`Complete the course - Second enrollment`, async ({ learnerHome, readContentHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Complete the course - Second enrollment` },
            { type: `Test Description`, description: `External user completes the course for second time` }
        );
        
        await learnerHome.basicLogin(externalUserUsername, "DefaultPortal");
        await learnerHome.clickMyLearning();
        await catalog.searchMyLearning(courseName);
        await catalog.verifyCompletedCourse(courseName);
        await catalog.clickCourseInMyLearning(courseName);
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();   
        await catalog.clickMyLearning();
        await catalog.clickCompletedButton();
        await catalog.searchMyLearning(courseName);
        await catalog.verifyCompletedCourse(courseName);
    });
})
