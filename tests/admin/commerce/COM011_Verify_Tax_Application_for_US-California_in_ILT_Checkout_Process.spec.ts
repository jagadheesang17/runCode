import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { credentials } from "../../../constants/credentialData";
import cybersourceConfig from "../../../data/cybersourceConfig.json";
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const price = FakerData.getPrice();
const vatNumber = FakerData.getPinCode();

test.describe(`COM011 - Verify Tax Application for US-California in ILT Checkout Process`, () => {

    test.describe.configure({ mode: "serial" });

test(`Verify US-California tax exists or create/enable it for ILT billing verification`, async ({ adminHome, commercehome, adminGroup }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Balasundar` },
        { type: `TestCase`, description: `COM011-TC01` },
        { type: `Test Description`, description: `Check if US-California tax exists in listing. If exists with different state, update to California. If disabled, enable it. If doesn't exist, create new tax for ILT verification.` }
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



test(`Verify US-California location exists or create it for ILT session`, async ({ adminHome, location }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Balasundar` },
        { type: `TestCase`, description: `COM011-TC03` },
        { type: `Test Description`, description: `Check if location with United States-California exists. If not found, create new location for ILT session booking.` }
    );
    
    await adminHome.loadAndLogin("CUSTOMERADMIN");
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.locationLink();
    await location.verifyLocationLabel();
    
    // Check and create location if needed
    const newLocationCreated = await location.createLocationIfNotExists("United States", "California");
    
    if (!newLocationCreated) {
        console.log("✅ Location already exists for United States - California");
    }
});

test(`Create paid ILT course for order creation`, async ({ createCourse, adminHome, editCourse }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Balasundar` },
        { type: `TestCase`, description: `COM011-TC04` },
        { type: `Test Description`, description: `Create a paid ILT (Instructor Led Training) course with Classroom delivery type, instance, price and catalog enabled for order creation` }
    );

    const sessionName = FakerData.getSession();
    const instructorName = credentials.INSTRUCTORNAME.username;
    
    await adminHome.loadAndLogin("SUPERADMIN")
    await adminHome.clickMenu("Course");
    await createCourse.verifyCreateUserLabel("CREATE COURSE");
    await createCourse.enter("course-title", courseName);
    await createCourse.selectLanguage("English");
    await createCourse.typeDescription(description);
    
    // Select Classroom delivery type for ILT
    await createCourse.selectdeliveryType("Classroom");
    await createCourse.handleCategoryADropdown();
    await createCourse.providerDropdown();
    await createCourse.selectTotalDuration();
    await createCourse.typeAdditionalInfo();
    
    // Set price and enable catalog
    await createCourse.enterPrice(price);
    await createCourse.selectCurrency();
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    
    // Add Classroom instance
    await createCourse.clickEditCourseTabs();
    await createCourse.addInstances();
    await createCourse.selectInstanceDeliveryType("Classroom");
    await createCourse.clickCreateInstance();
    await createCourse.enter("course-title", courseName + " - Session");
    await createCourse.enterSessionName(sessionName);
    await createCourse.setMaxSeat();
    await createCourse.enterDateValue();
    await createCourse.startandEndTime();
    await createCourse.selectInstructor(instructorName);
    await createCourse.selectLocation();
    await createCourse.clickCatalog();
    await createCourse.clickUpdate();
    await createCourse.verifySuccessMessage();
    
    console.log("ILT course with Classroom instance created: " + courseName);
    
})

test(`Create order with US-California billing for ILT and verify tax is applied correctly`, async ({ adminHome, costCenter, enrollHome }) => {

    test.info().annotations.push(
        { type: `Author`, description: `Balasundar` },
        { type: `TestCase`, description: `COM011-TC05` },
        { type: `Test Description`, description: `Create order for paid ILT course, select US-California as billing address, calculate tax and verify tax value updates from 0.00. Test fails if tax doesn't apply.` }

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
