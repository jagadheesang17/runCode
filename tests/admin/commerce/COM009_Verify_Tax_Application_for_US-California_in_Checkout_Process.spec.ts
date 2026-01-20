import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { credentials } from "../../../constants/credentialData";
import cybersourceConfig from "../../../data/cybersourceConfig.json";
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const price = FakerData.getPrice();
const vatNumber = FakerData.getPinCode();

test.describe(`COM009 - Verify Tax Application for US-California in Checkout Process`, () => {

    test.describe.configure({ mode: "serial" });

    test(`Verify and configure Cybersource payment gateway`, async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Balasundar` },
            { type: `TestCase`, description: `COM009-TC02` },
            { type: `Test Description`, description: `Verify if Cybersource is enabled in Commerce Settings. If disabled, enable it. Configure Cybersource fields with test credentials.` }
        );

        await adminHome.loadAndLogin("COMMERCEADMIN");
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await adminHome.siteAdmin_learnerconfig();
        await siteAdmin.clickTenant("automationtenant");
        await siteAdmin.verifyCybersourceConfiguration(cybersourceConfig);
    });
    test(`Verify US-California tax exists or create/enable it for billing verification`, async ({ adminHome, commercehome, adminGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Balasundar` },
            { type: `TestCase`, description: `COM009-TC01` },
            { type: `Test Description`, description: `Check if US-California tax exists in listing. If exists with different state, update to California. If disabled, enable it. If doesn't exist, create new tax.` }
        );

        await adminHome.loadAndLogin("COMMERCEADMIN");
        await adminHome.menuButton();
        await adminHome.clickCommerceMenu();
        await adminHome.clickManageTax();

        // Check and create/update tax: returns true if new tax was created, false if already exists/updated
        const newTaxCreated = await commercehome.createTaxIfNotExists("United States", "California", vatNumber);

        // If new tax was created, save it
        if (newTaxCreated) {
            console.log("💾 Saving newly created tax...");
            await adminGroup.clickSaveBtn();
            await commercehome.verifyTheCreatedTaxandEnabledByDefault("United States");
        } else {
            console.log("✅ Tax already exists with California state and is enabled");
        }
    });


    test(`Create paid e-learning course for order creation`, async ({ createCourse, adminHome, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Balasundar` },
            { type: `TestCase`, description: `COM009-TC03` },
            { type: `Test Description`, description: `Create a paid e-learning course that will be used to verify tax application during checkout` }
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

    test(`Create order with US-California billing and verify tax is applied correctly`, async ({ adminHome, createUser, costCenter, enrollHome }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Balasundar` },
            { type: `TestCase`, description: `COM009-TC04` },
            { type: `Test Description`, description: `Create order for paid course, select US-California as billing address, calculate tax and verify tax value updates from 0.00. Test fails if tax doesn't apply.` }

        );
        await adminHome.loadAndLogin("SUPERADMIN")
        await adminHome.menuButton()
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.manageEnrollment("Create Order")
        await enrollHome.selectMulticourseForSingleOrder(courseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUserForSingleOrder(credentials.LEARNERUSERNAME.username)
        await enrollHome.clickCheckoutButton();
        await costCenter.billingDetails("United States", "California")
        await enrollHome.clickCalculateTaxButton()
        await costCenter.verifyTaxValueAfterBillingDetails()
        await costCenter.clickTermsandCondition();
        await enrollHome.clickApproveOrder()
        await enrollHome.orderSuccessMsg();

    })

});