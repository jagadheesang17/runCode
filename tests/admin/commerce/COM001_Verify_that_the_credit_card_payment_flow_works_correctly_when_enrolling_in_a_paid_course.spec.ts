import { credentialConstants } from "../../../constants/credentialConstants";
import { credentials } from "../../../constants/credentialData";
import { test } from "../../../customFixtures/expertusFixture";
import { readDataFromCSV } from "../../../utils/csvUtil";
import { FakerData } from "../../../utils/fakerUtils";
import { updateFieldsInJSON } from "../../../utils/jsonDataHandler";

const courseName = FakerData.getCourseName();
const sessionName = FakerData.getSession();
const description = FakerData.getDescription();
    const instructorName = credentials.INSTRUCTORNAME.username
const price = FakerData.getPrice();
const courseAdmin: any = FakerData.getUserId()


test(`Verify that learner can able to cancel credit card orders`, async ({ createCourse, adminHome, createUser }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Creating_paid_course` },
        { type: `Test Description`, description: `Creating_paid_course` }
    );

    const newData = {
        courseAdmin: courseAdmin
    }
    updateFieldsInJSON(newData)
    const csvFilePath = './data/User.csv';
    const data = await readDataFromCSV(csvFilePath);


    await adminHome.loadAndLogin("SUPERADMIN")
    await adminHome.clickMenu("Course");
    await createCourse.verifyCreateUserLabel("CREATE COURSE");
    await createCourse.enter("course-title", courseName);
    await createCourse.selectLanguage("English");
    await createCourse.typeDescription(description);
    await createCourse.handleCategoryADropdown();
    await createCourse.enterPrice(price)
    await createCourse.selectCurrency();
    await createCourse.selectTotalDuration();
    await createCourse.contentLibrary()
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
  
    //Creating new user for credit card payment method

    for (const row of data) {
        const { country, state, timezone, currency, city, zipcode } = row;
        await adminHome.menuButton()
        await adminHome.people();
        await adminHome.user();
        await createUser.clickCreateUser();
        await createUser.verifyCreateUserLabel();
        await createUser.enter("first_name", FakerData.getFirstName());
        await createUser.enter("last_name", FakerData.getLastName());
        await createUser.enter("username", courseAdmin);
        await createUser.enter("user-password", "Welcome1@");
        await createUser.enter("email", FakerData.getEmail());
        await createUser.enter("user-phone", FakerData.getMobileNumber());
        await createUser.clickSave();
        await createUser.clickProceed("Proceed");
        await createUser.verifyUserCreationSuccessMessage();
    }

})

test(`Login as a learner and verify able to cancel the order`, async ({ learnerHome, catalog, costCenter, dashboard }) => {

    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Verify learner able to cancel the order` },
        { type: `Test Description`, description: `Verify learner able to cancel the order` }

    );
    await learnerHome.basicLogin(courseAdmin, "portal1");
    await learnerHome.termsAndConditionScroll();
    await learnerHome.clickCatalog();
    await catalog.mostRecent();
    await catalog.searchCatalog(courseName);
    await catalog.clickMoreonCourse(courseName)
    await catalog.clickSelectcourse(courseName)
    await catalog.addToCart();
    await costCenter.clickOktoorder();
    await catalog.verifyAddedToCart();
    //await costCenter.selectSavedAddressDropdown("Home")
    await costCenter.billingDetails("United States", "Alaska")
    await costCenter.paymentMethod("Credit Card");
    await costCenter.fillCreditDetails();
    await costCenter.clickTermsandCondition();
    await costCenter.clickCheckout("Home");
    await costCenter.verifySuccessMsg();
    await learnerHome.clickMyLearning();
    await catalog.searchMyLearning(courseName);
    await catalog.mylearningViewClassDetails(courseName);
    await catalog.mylearningClassCancel();
    
})





