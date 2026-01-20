import { credentials } from "../../constants/credentialData";
import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";


let createdCode: any
const courseName = "EL"+" "+FakerData.getCourseName();
const description = FakerData.getDescription()
const price = FakerData.getPrice();
test.describe(`Confirm that Admin Order creation functions correctly and as expected for YouTube content`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Creation of Single Instance Elearning with Youtube content and Admin creates an order`, async ({ adminHome, costCenter,createCourse,enrollHome,contentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Creation of Single Instance Elearning with Youtube content` },
            { type: `Test Description`, description: `Creation of Single Instance Elearning with Youtube content` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.enterPrice(price)
        await createCourse.selectCurrency();
        await createCourse.contentLibrary()
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await contentHome.gotoListing();
        await adminHome.menuButton()
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.manageEnrollment("Create Order")
        await enrollHome.selectMulticourseForSingleOrder(courseName)
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUserForSingleOrder(credentials.LEARNERUSERNAME.username)
        await enrollHome.clickCheckoutButton();
        await costCenter.billingDetails("United States", "Alaska")
        await enrollHome.clickCalculateTaxButton()
        await enrollHome.paymentMethod("Cost center");
        await costCenter.fillCostCenterInput();
        await costCenter.clickTermsandCondition();
        await enrollHome.clickApproveOrder()
        await enrollHome.orderSuccessMsg();
    })

    test(`Ensure that the manager can successfully recommend a course to a user.`, async ({ learnerHome, managerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `vidya` },
            { type: `TestCase`, description: `Ensure that the manager can successfully recommend a course to a user` },
            { type: `Test Description`, description: `Ensure that the manager can successfully recommend a course to a user` }
        );
        await learnerHome.learnerLogin("MANAGERNAME", "DefaultPortal");
       await learnerHome.selectCollaborationHub();
        await managerHome.enterSearchCourse(courseName);
        await managerHome.clickrecommendIcon(courseName)
        await managerHome.verifydirectandIndirect("Direct Report")
        await managerHome.verifydirectandIndirect("Virtual Report")
        await managerHome.enterAdditionalInfo()
        await managerHome.clickSendMeCopy()
        await managerHome.clickRecommendLearning()
        await managerHome.verifytoastmsg()
    })


    test(`Ensure_that_a_course_recommended_by_the_manager_is_available_in_the_learner_catalog`, async ({ learnerHome, catalog, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Vidya` },
            { type: `TestCase`, description: `Ensure_that_a_course_recommended_by_the_manager_is_available_in_the_learner_catalog` },
            { type: `Test Description`, description: `Ensure_that_a_course_recommended_by_the_manager_is_available_in_the_learner_catalog` }
        );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog()
        await catalog.clickRecommendation()
        await catalog.verifyCourserecommemnded(courseName);


    })

})