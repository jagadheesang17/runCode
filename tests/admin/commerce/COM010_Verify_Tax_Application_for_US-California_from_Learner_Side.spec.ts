import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { credentials } from "../../../constants/credentialData";
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const price = FakerData.getPrice();
const vatNumber = FakerData.getPinCode();

test.describe(`COM010 - Verify Tax Application for US-California from Learner Side`, () => {
    test.describe.configure({ mode: "serial" });
test(`Enable commerce in site settings, verify in menu bar and admin config, then create tax`, async ({ commercehome, adminHome, adminGroup, siteAdmin }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Balasundar` },
        { type: `TestCase`, description: `COM006-TC01` },
        { type: `Test Description`, description: `Enable commerce module from site settings, verify commerce appears in menu bar and admin site configuration, navigate to Manage Tax via menu, create tax with duplicate country check and state selection for US/Canada only, verify tax is created and enabled by default` }
    );


    await adminHome.loadAndLogin("CUSTOMERADMIN")

    await adminHome.menuButton();
    await adminHome.siteAdmin();
    await adminHome.siteSettings();
    await siteAdmin.verifyAndEnableCommerceIfDisabled();
    await siteAdmin.clickAdminSiteConfiguration();
    await siteAdmin.verifyCommerceInAdminSiteConfiguration();
    await siteAdmin.clickTenant("automationtenant");
    await siteAdmin.learnerConfiguration();
    await siteAdmin.verifyCommerceInLearnerSiteConfiguration();

})

test(`Verify US-California tax exists or create/enable it for learner checkout`, async ({ adminHome, commercehome, adminGroup }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Balasundar` },
        { type: `TestCase`, description: `COM010-TC01` },
        { type: `Test Description`, description: `Check if US-California tax exists in listing. If exists with different state, update to California. If disabled, enable it. If doesn't exist, create new tax for learner-side verification.` }
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


test(`Create paid e-learning course for learner purchase`, async ({ createCourse, adminHome, editCourse }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Balasundar` },
        { type: `TestCase`, description: `COM010-TC02` },
        { type: `Test Description`, description: `Create a paid e-learning course that will be purchased by learner to verify tax application during checkout` }
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

test(`Learner purchases course with US-California billing and verify tax is applied`, async ({ learnerHome, catalog, costCenter,enrollHome }) => {

    test.info().annotations.push(
        { type: `Author`, description: `Balasundar` },
        { type: `TestCase`, description: `COM010-TC03` },
        { type: `Test Description`, description: `Login as learner, search and add course to cart, select US-California as billing address, calculate tax and verify tax value updates from 0.00 during checkout. Test fails if tax doesn't apply.` }

    );
    
    await learnerHome.basicLogin(credentials.LEARNERUSERNAME.username, "default");
    await learnerHome.clickCatalog();
    await catalog.mostRecent();
    await catalog.searchCatalog(courseName);
    await catalog.clickMoreonCourse(courseName)
    await catalog.clickSelectcourse(courseName)
    await catalog.addToCart();
    await costCenter.clickOktoorder();
    await catalog.verifyAddedToCart();
    await costCenter.billingDetails("United States", "California")
    await enrollHome.clickCalculateTaxButton();
    await costCenter.verifyTaxValueAfterBillingDetails()
    await costCenter.paymentMethod("Credit Card");
    await costCenter.fillCreditDetails();
    await costCenter.clickTermsandCondition();
    await costCenter.clickCheckout("Home");
    await costCenter.verifySuccessMsg()

})

});
