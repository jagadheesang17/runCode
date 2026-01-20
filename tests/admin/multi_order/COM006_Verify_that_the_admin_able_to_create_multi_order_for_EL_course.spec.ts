import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { credentials } from "../../../constants/credentialData";
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const price = FakerData.getPrice();

test.describe.configure({ mode: "serial" });
test(`Creating paid EL course`, async ({ createCourse, adminHome, editCourse }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Creating paid EL course` },
        { type: `Test Description`, description: `Creating paid EL course` }
    );

    await adminHome.loadAndLogin("SUPERADMIN")
    await adminHome.clickMenu("Course");
    await createCourse.verifyCreateUserLabel("CREATE COURSE");
    await createCourse.enter("course-title", courseName);
    await createCourse.selectLanguage("English");
    await createCourse.typeDescription(description);
    await createCourse.handleCategoryADropdown();
    await createCourse.enterPrice(price)
    await createCourse.selectCurrency();
    await createCourse.contentLibrary()
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
})

test(`Admin create the multiple order`, async ({ adminHome, costCenter, enrollHome }) => {

    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Admin create the multiple order` },
        { type: `Test Description`, description: `Admin create the multiple order` }

    );
    await adminHome.loadAndLogin("SUPERADMIN")
    await adminHome.menuButton()
    await adminHome.clickEnrollmentMenu();
    await adminHome.clickEnroll();
    await enrollHome.manageEnrollment("Create Order")
    await enrollHome.clickMultipleOrderRadioBtn();
    await enrollHome.selectCourse_TPForMultiOrder(courseName)
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

    test(`Verifying that approved order course is present in the learner side `, async ({ learnerHome, catalog, readContentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verifying that approved order course is present in the learner side` },
            { type: `Test Description`, description: `Verifying that approved order course is present in the learner side` }
        );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await catalog.clickMyLearning();
        await catalog.searchMyLearning(courseName);
        await catalog.clickCourseInMyLearning(courseName);
        await catalog.verifyStatus("Enrolled");
    })
