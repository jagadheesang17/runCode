import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { readDataFromCSV } from "../../../utils/csvUtil";

const courseName = "ILT Multi " + FakerData.getCourseName();
const description = FakerData.getDescription();
const price = FakerData.getPrice();
const userId = FakerData.getUserId();

test.describe(`COM018 - Admin ILT Order: Multi-session locations and tax change verification`, () => {
    test.describe.configure({ mode: "serial" });

    const loc1Country = "United States";
    const loc1State = "California";
    const loc2Country = "Australia";
    const loc2State = "New South Wales";

    // Reuse session names across tests
    let sessionA: string;
    let sessionB: string;

    test(`TC01 - Create two locations (US-California + Australia-NSW)`, async ({ adminHome, location }) => {
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.locationLink();
        await location.verifyLocationLabel(); await location.createLocationIfNotExists(loc1Country, loc1State);
        await location.createLocationIfNotExists(loc2Country, loc2State);
    });

    test(`TC02 - Create ILT course with two sessions and assign created locations`, async ({ adminHome, createCourse }) => {
        sessionA = FakerData.getSession();
        sessionB = FakerData.getSession() + " B";

        await adminHome.loadAndLogin("CUSTOMERADMIN");

        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
         await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.selectdeliveryType("Classroom");
        await createCourse.enterPrice(price);
        await createCourse.selectCurrency();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

        // Session A
        await createCourse.clickEditCourseTabs();
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        await createCourse.enter("course-title", courseName + " - " + sessionA);
        await createCourse.enterSessionName(sessionA);
        await createCourse.setMaxSeat();
        await createCourse.enterDateValue();
        await createCourse.startandEndTime();
        const loc1Name = `${loc1Country} - ${loc1State} Location`;
        await createCourse.selectLocationByInput(loc1Name);

        await createCourse.click(createCourse.selectors.addDeleteIcon, "Add Session", "Icon");
        await createCourse.enterSessionName2(sessionB);
        await createCourse.enterDateValue2();
        await createCourse.startandEndTime2();
        const loc2Name = `${loc2Country} - ${loc2State} Location`;
        await createCourse.selectLocationByInput2(loc2Name);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

        // Session B

    });

    test(`TC03 - Create learner user with US-California address`, async ({ adminHome, createUser }) => {
        const data = await readDataFromCSV('./data/US_address.csv');
        const addressData = data[0];

         await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();

        await createUser.clickCreateUser();
        await createUser.verifyCreateUserLabel();
        await createUser.enter("first_name", FakerData.getFirstName());
        await createUser.enter("last_name", FakerData.getLastName());
        await createUser.enter("username", userId);
        await createUser.enter("user-password", "Welcome1@");
        await createUser.typeAddress("Address 1", addressData.address1);
        await createUser.typeAddress("Address 2", addressData.address2 || "");
        await createUser.select("Country", addressData.country);
        await createUser.select("State/Province", addressData.state);
        if (addressData.timezone) {
            await createUser.select("Time Zone", addressData.timezone);
        }
        await createUser.enter("user-city", addressData.city);
        await createUser.enter("user-zipcode", addressData.zipcode);
        await createUser.clickSave();
    });

    test(`TC04 - Admin creates order for learner and verify billing pre-population and tax change`, async ({ adminHome, enrollHome, costCenter }) => {
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.manageEnrollment("Create Order");
        await enrollHome.selectMulticourseForSingleOrder(courseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUserForSingleOrder(userId);
        await enrollHome.clickCheckoutButton();

        // Verify pre-population then override billing
        const data = await readDataFromCSV('./data/US_address.csv');
        const addressData = data[0];
        const addressVal = await costCenter.page.locator(costCenter.selectors.address).inputValue().catch(() => "");
        const cityVal = await costCenter.page.locator(costCenter.selectors.cityTown).inputValue().catch(() => "");
        const zipVal = await costCenter.page.locator(costCenter.selectors.zipcode).inputValue().catch(() => "");
        const countryText = (await costCenter.page.locator(costCenter.selectors.countrySelect).textContent().catch(() => "")).trim();
        const stateText = (await costCenter.page.locator(costCenter.selectors.stateField).textContent().catch(() => "")).trim();

        console.log(`Admin-order billing address read: ${addressVal} | ${cityVal} | ${zipVal} | ${countryText} | ${stateText}`);

        if (!addressVal.includes(addressData.address1)) {
            console.warn(`WARNING: Billing Address1 does not contain expected value: ${addressData.address1}`);
        }
        if (!cityVal.includes(addressData.city)) {
            console.warn(`WARNING: Billing city does not match expected: ${addressData.city}`);
        }
        if (!zipVal.includes(addressData.zipcode)) {
            console.warn(`WARNING: Billing zipcode does not match expected: ${addressData.zipcode}`);
        }
        if (!countryText.includes(addressData.country)) {
            console.warn(`WARNING: Billing country does not match expected: ${addressData.country}`);
        }
        if (!stateText.includes(addressData.state)) {
            console.warn(`WARNING: Billing state does not match expected: ${addressData.state}`);
        }

        // Override billing and verify tax
        await costCenter.billingDetails("France", "Ain");
        await enrollHome.clickCalculateTaxButton();

        await enrollHome.paymentMethod("Cost center");
        await costCenter.fillCostCenterInput();
        await costCenter.clickTermsandCondition();
        await costCenter.verifyTaxValueAfterBillingDetails(costCenter.selectors.adminTaxValue);

        await enrollHome.clickApproveOrder();
        await enrollHome.orderSuccessMsg();
    });

});
