
import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { URLConstants } from "../../../constants/urlConstants";
//const courseName = FakerData.getCourseName();
const courseName = "Open-source Driver Override";
const discountName = FakerData.getTagNames()+" "+"Discount";
const description = FakerData.getDescription();
const price = FakerData.getPrice();
const code = "DIS-"+ generateCode();
let dicountValue:any

test.describe.configure({ mode: "serial" });
test(`Verify that the admin able to create linear discount with fixed amount off`, async ({ adminHome, commercehome, createCourse, discount, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `verify that the admin able to create discount` },
        { type: `Test Description`, description: `verify that the admin able to create discount` }
    );
    await adminHome.loadAndLogin("COMMERCEADMIN")
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.clickCreateDiscount();
   // await discount.selectVolumeDiscount();
    await createCourse.enter("name", discountName);
    await discount.enterDiscountDescription(description);
    await createCourse.enter("code", code);
    await discount.enterValidity();
    dicountValue = await discount.setDiscountRules("Fixed Amount Off");
    console.log(dicountValue);
    await discount.discountCriteria("Domain");
    await SurveyAssessment.clickPublish();
    await createCourse.clickProceed();
})
test(`Creating paid EL course and adding discount`, async ({ createCourse, adminHome, editCourse }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Creating paid EL course and adding discount` },
        { type: `Test Description`, description: `Creating paid EL course and adding discount` }
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
    await createCourse.editcourse();
    await createCourse.clickCourseOption("Discount")
    await editCourse.verifyDiscountApplied(discountName,URLConstants.portal1)
    await editCourse.selectDiscountOption();
    await createCourse.clickDetailButton();
    await createCourse.clickCatalog();
    await createCourse.clickUpdate();
    await createCourse.verifySuccessMessage();   
})

test(`Login as a learner and verify payment method(Cost center)`, async ({ learnerHome, catalog, costCenter, dashboard }) => {

    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Login as a learner` },
        { type: `Test Description`, description: `Verify from learner side` }

    );
    await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
    await learnerHome.clickCatalog();
    await catalog.mostRecent();
    await catalog.searchCatalog(courseName);
    await catalog.clickMoreonCourse(courseName)
    await catalog.clickSelectcourse(courseName)
    await catalog.addToCart();
    await catalog.clickOkButton()
    await catalog.verifyAddedToCart();
    //await catalog.clickShoppingCartIcon();
    //await catalog.clickProceedToCheckout();
    await costCenter.orderSummaryLabelVerify();
    await costCenter.verifyDiscountValue()
    await costCenter.billingDetails("United States", "Alaska");
    await costCenter.paymentMethod("Cost center");
    await costCenter.fillCostCenterInput();
    await costCenter.clickTermsandCondition();
    await costCenter.clickCheckout("Home");
    await costCenter.verifySuccessMsg();
    await learnerHome.clickMyLearning();
})

test(`Commerce side Verification`, async ({ adminHome, costCenter, createCourse, commercehome }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Commerce side order verification ` },
        { type: `Test Description`, description: `Verify that order has confirmed by admin` }
    );
    await adminHome.loadAndLogin("COMMERCEADMIN")
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickOrder();
    await commercehome.approveOrder();
    await commercehome.verifySuccessMessage();
})

//})