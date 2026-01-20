import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from '../../../utils/fakerUtils';
import { userCreation, userUpdation } from "../../../api/userAPI";
import { userCreationDataWithOptional } from "../../../data/apiData/formData";

const courseName = FakerData.getCourseName();
const manager1Username = "MGR1_" + FakerData.getUserId();
const manager2Username = "MGR2_" + FakerData.getUserId();
const user1Username = "USR1_" + FakerData.getUserId();
const description = FakerData.getDescription();
let manager1UserId: any;
let manager2UserId: any;
let user1UserId: any;

test.describe(`Verify manager approved Elearning course with Other Manager approval`, async () => {
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

    test(`Create regular user and assign Manager 1 as direct manager via API`, async () => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create regular user and assign Manager 1 as direct manager via API` },
            { type: `Test Description`, description: `Create regular user and assign Manager 1 as direct manager via API` }
        );
        
        user1UserId = await userCreation(userCreationDataWithOptional(user1Username, undefined, undefined, undefined, undefined, undefined, undefined, manager1Username, manager2Username));
        console.log("Created User 1 with Manager 1 as direct manager and Manager 2 as other manager, User ID:", user1UserId);
    })



    test(`Create Elearning course with SCORM content and Other Manager approval`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create Elearning course with SCORM content and Other Manager approval` },
            { type: `Test Description`, description: `Create Elearning course with SCORM content and Other Manager approval` }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course with Other Manager approval: " + courseName);
        await createCourse.contentLibrary('Passed-Failed-SCORM2004')
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await createCourse.clickEditCourseTabs();
        await editCourse.clickManagerApproval();
        await editCourse.verifyapprovaluserType("Internal Users");
        await editCourse.clickinternalManager("Other Manager");
        await editCourse.verifyapprovaluserType("External Users");
        await editCourse.clickexternalManager("Other Manager");
        await editCourse.saveApproval();
        await createCourse.typeDescription("  Added Other Manager Approval");
        await createCourse.clickUpdate();
    })

    test(`Learner requests approval for the course`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Learner requests approval for the course` },
            { type: `Test Description`, description: `Learner requests approval for the course` }
        );
        
        await learnerHome.basicLogin(user1Username, "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(courseName);
        await catalog.clickMoreonCourse(courseName);
        await catalog.clickSelectcourse(courseName);
        await catalog.clickRequestapproval();
        await catalog.selectManagerOnRequestApprovalPopup(manager2Username);
        await catalog.submitRequestAndVerify();
    })

    test(`Manager 2 approves the request`, async ({ learnerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Manager 2 approves the request` },
            { type: `Test Description`, description: `Manager 2 approves the request` }
        );
        
        await learnerHome.basicLogin(manager2Username, "DefaultPortal");
        await learnerHome.selectCollaborationHub();
        await learnerHome.clickApprove(courseName);
        await learnerHome.verifyApprovedSuccessfully();
    });

    test(`Verify course is available and complete it`, async ({ learnerHome, readContentHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify course is available and complete it` },
            { type: `Test Description`, description: `Verify course is available and complete it` }
        );
        
        await learnerHome.basicLogin(user1Username, "DefaultPortal");
        await learnerHome.clickMyLearning();
        await catalog.searchMyLearning(courseName);
        await catalog.verifyCompletedCourse(courseName);
        await catalog.clickCourseInMyLearning(courseName);
        await readContentHome.readPassed_FailedScrom2004();
        await catalog.saveLearningStatus();
        await catalog.clickMyLearning();
        await catalog.clickCompletedButton();
        await catalog.searchMyLearning(courseName);
        await catalog.verifyCompletedCourse(courseName);
    });
})
