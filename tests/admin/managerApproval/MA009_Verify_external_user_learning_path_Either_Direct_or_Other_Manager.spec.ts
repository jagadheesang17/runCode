import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from '../../../utils/fakerUtils';
import { userCreation } from "../../../api/userAPI";
import { generateOauthToken } from "../../../api/accessToken";
import { userCreationDataWithOptional } from "../../../data/apiData/formData";

const learningPathName = "LP_" + FakerData.getCourseName();
const courseName = FakerData.getCourseName();
const manager1Username = "MGR1_" + FakerData.getUserId();
const manager2Username = "MGR2_" + FakerData.getUserId();
const externalUserUsername = "EXT_USR_" + FakerData.getUserId();
const description = FakerData.getDescription();
let access_token: any;
let manager1UserId: any;
let manager2UserId: any;
let externalUserId: any;

test.beforeAll('Generate Access Token', async () => {
    access_token = await generateOauthToken();
    console.log('Access Token:', access_token);
});

test.describe(`Verify External user Learning Path with Either Direct or Other Manager approval`, async () => {
    test.describe.configure({ mode: 'serial' })
    
    test(`Create Manager 1 user with Manager role via API`, async () => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create Manager 1 user with Manager role via API` },
            { type: `Test Description`, description: `Create Manager 1 user with Manager role via API` }
        );
        
        manager1UserId = await userCreation(userCreationDataWithOptional(manager1Username, "manager"), { Authorization: access_token });
        console.log("Created Manager 1 with User ID:", manager1UserId);
    })

    test(`Create Manager 2 user with Manager role via API`, async () => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create Manager 2 user with Manager role via API` },
            { type: `Test Description`, description: `Create Manager 2 user with Manager role via API` }
        );
        
        manager2UserId = await userCreation(userCreationDataWithOptional(manager2Username, "manager"), { Authorization: access_token });
        console.log("Created Manager 2 with User ID:", manager2UserId);
    })

    test(`Create External user and assign Manager 1 as direct manager via API`, async () => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create External user and assign Manager 1 as direct manager via API` },
            { type: `Test Description`, description: `Create External user with organization type External and assign managers` }
        );
        
        externalUserId = await userCreation(userCreationDataWithOptional(externalUserUsername, undefined, undefined, undefined, undefined, undefined, undefined, manager1Username, manager2Username, "External"), { Authorization: access_token });
        console.log("Created External User with organization type External, Manager 1 as direct manager and Manager 2 as other manager, User ID:", externalUserId);
    })

    test(`Create Elearning course for Learning Path`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create Elearning course for Learning Path` },
            { type: `Test Description`, description: `Create Elearning course for Learning Path` }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name: " + courseName);
        await createCourse.contentLibrary("AICC File containing a PPT - Storyline 11");
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
    })

    test(`Create Learning Path with Either Direct or Other Manager Approval for Internal and External Users`, async ({ adminHome, learningPath, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create Learning Path with Either Direct or Other Manager Approval` },
            { type: `Test Description`, description: `Create Learning Path with Either Direct or Other Manager Approval for both Internal and External Users` }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
        await learningPath.title(learningPathName);
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
        await learningPath.clickEditLearningPath();
        await editCourse.clickManagerApproval();
        await editCourse.verifyapprovaluserType("Internal Users");
        await editCourse.clickinternalManager("Either Direct or Other Manager");
        await editCourse.verifyapprovaluserType("External Users");
        await editCourse.clickexternalManager("Either Direct or Other Manager");
        await editCourse.saveApproval();
        await learningPath.description(description + " - Added Either Direct or Other Manager Approval");
        await createCourse.clickUpdate();
    })

    test(`External user requests approval for Learning Path - selects Manager 1`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `External user requests approval for Learning Path - selects Manager 1` },
            { type: `Test Description`, description: `External user requests approval for Learning Path and selects Manager 1 as approver` }
        );
        
        await learnerHome.basicLogin(externalUserUsername, "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(learningPathName);
        await catalog.clickMoreonCourse(learningPathName);
        await catalog.clickSelectcourse(learningPathName);
        await catalog.clickRequestapproval();
        await catalog.selectManagerOnRequestApprovalPopup(manager1Username);
        await catalog.submitRequestAndVerify();
    })

    test(`Manager 1 approves the Learning Path request`, async ({ learnerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Manager 1 approves the Learning Path request` },
            { type: `Test Description`, description: `Manager 1 approves the Learning Path request` }
        );
        
        await learnerHome.basicLogin(manager1Username, "DefaultPortal");
        await learnerHome.selectCollaborationHub();
        await learnerHome.clickApprove(learningPathName);
        await learnerHome.verifyApprovedSuccessfully();
    });

    test(`Verify Learning Path is available and complete it`, async ({ dashboard, learnerHome, catalog, readContentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify Learning Path is available and complete it` },
            { type: `Test Description`, description: `External user completes the Learning Path after manager approval` }
        );
        
        await learnerHome.basicLogin(externalUserUsername, "DefaultPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.searchCertification(learningPathName);
        await catalog.clickMoreonCourse(learningPathName);
        await readContentHome.AICCFilecontainingaPPT_Storyline();
        await readContentHome.saveLearningAICC();
        await catalog.verifyStatus("Completed");
    });
})
