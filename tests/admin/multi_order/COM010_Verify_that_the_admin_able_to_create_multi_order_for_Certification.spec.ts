import { credentials } from "../../../constants/credentialData";
import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

let courseName = FakerData.getCourseName();
let description = FakerData.getDescription();
let domain: any
const price = FakerData.getPrice();
test.describe(`Verify Admin Multi Order Creation Functionality For Certification`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Creation of E-learning single instance `, async ({ adminHome, createCourse }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create the course as Single instance` },
            { type: `Test Description`, description: `Verify portal1 course is not availble to portal2 users` }

        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.getCourse();
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        domain = await createCourse.selectPortal();
        console.log(`${domain}`);
        await createCourse.contentLibrary(); //By default Youtube content will be attached
        await createCourse.clickHere();
        await createCourse.selectImage();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

    })
    const title = FakerData.getCourseName();

    test(`Certification enroll and completion with single instance`, async ({ adminHome,costCenter, learningPath, createCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Certification enroll and completion with single instance` },
            { type: `Test Description`, description: `Verify Certification enroll and completion with single instance` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
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
         await enrollHome.selectByOption("Certification");
         await enrollHome.selectCourse_TPForMultiOrder(title)
         await enrollHome.clickSelectedLearner();
         await enrollHome.enterSearchUserForMultiOrder(credentials.LEARNERUSERNAME.username)
         await enrollHome.enterSearchUserForMultiOrder(credentials.TEAMUSER1.username)
         await enrollHome.enterSearchUserForMultiOrder(credentials.TEAMUSER2.username)
         await enrollHome.clickCheckoutButton();
         await costCenter.enterUserContactDetails()  
         await costCenter.billingDetails("United States", "Alaska")
         await enrollHome.clickCalculateTaxButton()
         await costCenter.paymentMethod("Purchase Order");
         await costCenter.fillPaymentMethodInput();
         await costCenter.clickTermsandCondition();
         await enrollHome.clickApproveOrder()
         await enrollHome.orderSuccessMsg();

    })

    test(`Confirm that a learner is successfully registered for and complete a certification through a single-instance course.`, async ({ learnerHome, catalog, dashboard }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Confirm that a learner is successfully registered for the certification with a single-instance course.` },
            { type: `Test Description`, description: `Confirm that a learner is successfully registered for the certification with a single-instance course.` }
        );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.searchCertification(title);
        await dashboard.verifyTheEnrolledCertification(title);
        await dashboard.clickMoreonTP(title);
        await catalog.verifyStatus("Enrolled");
    })

})