import { credentials } from "../../../constants/credentialData";
import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

let courseName = FakerData.getCourseName();
let description = FakerData.getDescription();
const price = FakerData.getPrice();
test.describe(`Verify Admin Multi Order Creation Functionality For Learning Path`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Creation of E-learning single instance `, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create the course as Single instance` },
            { type: `Test Description`, description: `Create the course as Single instance` }

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
        await createCourse.contentLibrary()
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

    })
    const title = "LP"+" "+FakerData.getCourseName();

    test(`Creation of Learning Path and Admin creates a Multi Order for it`, async ({ adminHome, costCenter,learningPath, createCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Creation of Learning Path and Admin creates a Multi Order for it` },
            { type: `Test Description`, description: `Creation of Learning Path and Admin creates a Multi Order for it` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
        await learningPath.title(title);
        await learningPath.description(description);
        await learningPath.language();
        await createCourse.enterPrice(price)
        await createCourse.selectCurrency();
        await learningPath.clickSave();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
       await adminHome.menuButton();    
       await adminHome.clickEnrollmentMenu();
       await adminHome.clickEnroll();
       await enrollHome.manageEnrollment("Create Order")
       await enrollHome.clickMultipleOrderRadioBtn();
       await enrollHome.selectByOption("Learning Path");
       await enrollHome.selectCourse_TPForMultiOrder(title)
       await enrollHome.clickSelectedLearner();
       await enrollHome.enterSearchUserForMultiOrder(credentials.LEARNERUSERNAME.username)
       await enrollHome.enterSearchUserForMultiOrder(credentials.TEAMUSER1.username)
       await enrollHome.enterSearchUserForMultiOrder(credentials.TEAMUSER2.username)
       await enrollHome.clickCheckoutButton();
       await costCenter.enterUserContactDetails()  
       await costCenter.billingDetails("United States", "Alaska")
       await enrollHome.clickCalculateTaxButton()
       await enrollHome.paymentMethod("Cost center");
       await costCenter.fillCostCenterInput();
       await costCenter.clickTermsandCondition();
       await enrollHome.clickApproveOrder()
       await enrollHome.orderSuccessMsg();
    })

    test(`Confirm that a learner is successfully registered for and complete a Learning Path through a single-instance course`, async ({ learnerHome, catalog, dashboard }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Confirm that a learner is successfully registered for and complete a Learning Path through a single-instance course` },
            { type: `Test Description`, description: `Confirm that a learner is successfully registered for and complete a Learning Path through a single-instance course` }
     );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.searchCertification(title);
        await dashboard.verifyTheEnrolledCertification(title);
        await dashboard.clickMoreonTP(title);
        await catalog.verifyStatus("Enrolled");
    })

})