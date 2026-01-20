import { test } from "../../../customFixtures/expertusFixture"
import { FakerData, getRandomSeat } from '../../../utils/fakerUtils';
import { readDataFromCSV } from "../../../utils/csvUtil";
import { credentials } from "../../../constants/credentialData";


const courseName = FakerData.getCourseName();
const sessionName = FakerData.getSession();
const instructorName = credentials.INSTRUCTORNAME.username;
const managerName = credentials.MANAGERNAME.username;
const maxSeat = getRandomSeat();

test.describe(`Verify manager approved Virtual Class course without price`, async () => {
    test.describe.configure({ mode: 'serial' })
    
    test(`Create Virtual Class course with Manager Approval Enabled`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create Virtual Class course with Manager Approval Enabled` },
            { type: `Test Description`, description: `Create Virtual Class course with Manager Approval Enabled` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new VC course by name: " + courseName);
        await createCourse.selectdeliveryType("Virtual Class");
        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown();
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.editcourse();
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Virtual Class");
        await createCourse.clickCreateInstance();
        await createCourse.selectMeetingType(instructorName, sessionName + "_Meeting1", 1);
        await createCourse.setMaxSeat();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        await createCourse.clickEditCourseTabs();
        await editCourse.clickManagerApproval();
        await editCourse.verifyapprovaluserType("Internal Users")
        await editCourse.verifyinternalManager("Direct Manager")
        await editCourse.verifyapprovaluserType("External Users")
        await editCourse.verifyinternalManager("Direct Manager")
        await editCourse.saveApproval()
        await createCourse.typeDescription("  Added Manager Approval")
        await createCourse.clickUpdate()
    })

    test(`Ensure that a learner is able to register for VC course that requires manager approval`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Ensure that a learner is able to register for VC course that requires manager approval` },
            { type: `Test Description`, description: `Ensure that a learner is able to register for VC course that requires manager approval` }
        );
        await learnerHome.learnerLogin("TEAMUSER1", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(courseName);
        await catalog.clickMoreonCourse(courseName);
        await catalog.clickSelectcourse(courseName);
        await catalog.clickRequestapproval();
        await catalog.selectManagerOnRequestApprovalPopup(managerName);
        await catalog.submitRequestAndVerify();
    })

    test(`Ensure that the manager is able to successfully approve the VC request`, async ({ learnerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Ensure that the manager is able to successfully approve the VC request` },
            { type: `Test Description`, description: `Ensure that the manager is able to successfully approve the VC request` }
        );
        await learnerHome.learnerLogin("MANAGERNAME", "DefaultPortal");
        await learnerHome.selectCollaborationHub();
        await learnerHome.clickApprove(courseName);
        await learnerHome.verifyApprovedSuccessfully();
    });

    test(`Verify manager approved VC course is available on the learner side`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify manager approved VC course is available on the learner side` },
            { type: `Test Description`, description: `Verify manager approved VC course is available on the learner side` }
        );
        await learnerHome.learnerLogin("TEAMUSER1", "DefaultPortal");
        await learnerHome.clickMyLearning();
        await catalog.searchMyLearning(courseName);
        await catalog.verifyCompletedCourse(courseName);
         await catalog.clickCourseInMyLearning(courseName);
        await catalog.verifyStatus("Enrolled");

    });
})
