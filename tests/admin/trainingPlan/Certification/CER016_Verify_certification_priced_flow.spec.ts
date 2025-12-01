import {credentials} from '../../../../constants/credentialData'
import { test } from "../../../../customFixtures/expertusFixture";
import { FakerData } from "../../../../utils/fakerUtils";

const courseName = FakerData.getCourseName();
const sessionName = FakerData.getSession();
const description = FakerData.getDescription();
const instructorName = credentials.INSTRUCTORNAME.username;

test.describe(`Verify_certification_priced_flow`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Single Instance Virtual Course`, async ({ createCourse, adminHome, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Ajay Michael S` },
            { type: `TestCase`, description: `Single Instance Virtual Course` },
            { type: `Test Description`, description: `Single Instance Virtual Course` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.clickMenu("Course");
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.selectdeliveryType("Virtual Class")
        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown()
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.modifyTheAccess();
        await editCourse.clickClose();
        await editCourse.clickTagMenu();
        await editCourse.selectTags();
        await editCourse.clickClose();
        await createCourse.clickCompletionCertificate();
        await createCourse.clickCertificateCheckBox();
        await createCourse.clickAdd();
        /* Need to Update the script due to Automation Site issuse (20-6-2024) 15:26 */
        // await editCourse.clickCompletionCertificate();
        //await editCourse.selectCourseCompletionCertificate("Playwright Automation");
        //   await createCourse.typeDescription(description);
        // await createCourse.clickCatalog();
        // await createCourse.clickUpdate();
        // await createCourse.verifySuccessMessage();
        // await createCourse.clickEditCourseTabs();
        await createCourse.addInstances();
        async function addinstance(deliveryType: string) {
            await createCourse.selectInstanceDeliveryType(deliveryType);
            await createCourse.clickCreateInstance();
        }
        const country = "kolkata"
        await addinstance("Virtual Class");
        await createCourse.enterSessionName(sessionName);
        await createCourse.sessionType();
        await createCourse.setMaxSeat();
        await createCourse.entertimezone(country);
        await createCourse.enterStartDate();
        await createCourse.startandEndTime();
        await createCourse.attendeeUrl();
        await createCourse.presenterUrl();
        await createCourse.selectInstructor(instructorName);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

    })

    const title = FakerData.getCourseName();
    test(`Certification with Single Instance Virtual Course is attached`, async ({ learningPath, adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Ajay Michael S` },
            { type: `TestCase`, description: `Certification with Single Instance Virtual Course is attached` },
            { type: `Test Description`, description: `Certification with Single Instance Virtual Course is attached` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(title);
        await learningPath.language();
        await learningPath.description(description);
        await learningPath.enterPrice();
        await learningPath.clickCurrency();
        await learningPath.clickSaveAsDraftBtn();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        await learningPath.clickEditCertification();
        await createCourse.clickCompletionCertificate();
        await createCourse.clickCertificateCheckBox();
        await createCourse.clickAdd();
        await learningPath.description(description);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    })

    test(`Verify that the learner can successfully purchase a priced certification using the Cost Center.`, async ({ learnerHome, catalog, costCenter, dashboard }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Ajay Michael` },
            { type: `TestCase`, description: `Verify that the learner can successfully purchase a priced certification using the Cost Center.` },
            { type: `Test Description`, description: `Verify that the learner can successfully purchase a priced certification using the Cost Center.` }

        );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(title);
        await catalog.clickMoreonCourse(title)
        await catalog.addToCart();
        await catalog.verifyAddedToCart();
        await catalog.clickShoppingCartIcon();
        await catalog.clickProceedToCheckout();
        await costCenter.orderSummaryLabelVerify();
        await costCenter.billingDetails("United States", "Alaska");
        await costCenter.paymentMethod("Cost center"); //Cost Center payment method is used here
        await costCenter.fillCostCenterInput();
        await costCenter.clickTermsandCondition();
        await costCenter.clickCheckout("Home");
        await costCenter.verifySuccessMsg();
        await learnerHome.clickMyLearning();
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.pendingTab(title);

    })
    test(`Confirm that the admin can successfully approve the order.`, async ({ adminHome, costCenter, createCourse, commercehome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Ajay Michael` },
            { type: `TestCase`, description: `Confirm that the admin can successfully approve the order ` },
            { type: `Test Description`, description: `Confirm that the admin can successfully approve the order` }
        );
        await adminHome.loadAndLogin("COMMERCEADMIN")
        await adminHome.menuButton();
        await adminHome.clickCommerceMenu();
        await commercehome.clickOrder();
        await commercehome.approveOrder();
        await commercehome.verifySuccessMessage();
    })

})