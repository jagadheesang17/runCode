import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";
import { credentials } from "../../../constants/credentialData";
import { expect } from "allure-playwright";

const courseName1 = FakerData.getCourseName() + " Course1";
const courseName2 = FakerData.getCourseName() + " Course2";
const courseName3 = FakerData.getCourseName() + " Course3";
const discountName = FakerData.getTagNames() + " " + "MultiTrainingDiscount";
const description = FakerData.getDescription();
const price = FakerData.getPrice();
const code = "DIS-" + generateCode();
let discountValue: any;

test.describe.serial(`COM021 - Verify discount applied for multiple trainings purchase`, () => {

    test(`Step 1: Create discount`, async ({ adminHome, commercehome, createCourse, discount, SurveyAssessment }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `COM021 - Verify discount for multiple trainings` },
            { type: `Test Description`, description: `Verify discount is applied when purchasing multiple trainings in single order` }
        );

        await adminHome.loadAndLogin("COMMERCEADMIN");
        await adminHome.menuButton();
        await adminHome.clickCommerceMenu();
        await commercehome.clickCommerceOption("Discount");
        await discount.clickCreateDiscount();
        await discount.selectVolumeDiscount();
        await createCourse.enter("name", discountName);
        await discount.enterDiscountDescription(description);
        await createCourse.enter("code", code);
        await discount.enterValidity();
        discountValue = await discount.setDiscountRules("Percentage Off", "US Dollar", "10","Volume");
        console.log(`Created volume discount with value: ${discountValue}%`);
        await SurveyAssessment.clickPublish();
        await createCourse.clickProceed();
        console.log(`✅ Volume discount '${discountName}' created successfully`);
    });

    test(`Step 2: Create first paid course and attach discount`, async ({ createCourse, adminHome, editCourse }) => {
        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName1);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.handleCategoryADropdown();
        await createCourse.enterPrice(price);
        await createCourse.selectCurrency();
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Paid course '${courseName1}' created`);

        // Attach discount to first training
        await createCourse.editcourse();
        await createCourse.clickCourseOption("Discount");
        await editCourse.selectDiscountOption(discountName, "Minimum");
        await createCourse.clickDetailButton();
        await createCourse.typeDescription(description);
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Step 2 Passed: Discount '${discountName}' attached to '${courseName1}'`);
    });

    test(`Step 3: Create second paid course and attach discount`, async ({ createCourse, adminHome, editCourse }) => {
        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName2);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.handleCategoryADropdown();
        await createCourse.enterPrice(price);
        await createCourse.selectCurrency();
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Paid course '${courseName2}' created`);

        // Attach discount to second training
        await createCourse.editcourse();
        await createCourse.clickCourseOption("Discount");
        await editCourse.selectDiscountOption(discountName, "Minimum");
        await createCourse.clickDetailButton();
        await createCourse.typeDescription(description);
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Step 3 Passed: Discount '${discountName}' attached to '${courseName2}'`);
    });

    test(`Step 4: Create third paid course and attach discount`, async ({ createCourse, adminHome, editCourse }) => {
        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName3);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.handleCategoryADropdown();
        await createCourse.enterPrice(price);
        await createCourse.selectCurrency();
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Paid course '${courseName3}' created`);

        // Attach discount to third training
        await createCourse.editcourse();
        await createCourse.clickCourseOption("Discount");
        await editCourse.selectDiscountOption(discountName, "Minimum");
        await createCourse.clickDetailButton();
        await createCourse.typeDescription(description);
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Step 4 Passed: Discount '${discountName}' attached to '${courseName3}'`);
    });

    test(`Step 5: Verify discount applied when purchasing multiple trainings in single order`, async ({ adminHome, editCourse, enrollHome, costCenter }) => {
        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.menuButton();
        await editCourse.clickEnrollmentMenu();
        await enrollHome.clickEnroll();

        // Create order with multiple courses
        await enrollHome.selectEnrollmentOption("Create Order");
        await enrollHome.selectByOption("Course");

        // Select first course
        await enrollHome.selectBycourse(courseName1, "paid");
        console.log(`✅ Selected first course: ${courseName1}`);

        // Select second course
        await enrollHome.selectBycourse(courseName2, "paid");
        console.log(`✅ Selected second course: ${courseName2}`);

        // Select third course
        await enrollHome.selectBycourse(courseName3, "paid");
        console.log(`✅ Selected third course: ${courseName3}`);

        // Select learner
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUserForSingleOrder(credentials.LEARNERUSERNAME.username);
        console.log(`✅ Selected learner for order`);

        await enrollHome.clickCheckoutButton();
        const timerStatus = await enrollHome.validateTimerIsRunning();
        expect(timerStatus.isPresent).toBe(true);
        console.log(`✅ Checkout timer is running`);

        // Verify discount is applied for multiple trainings
        await costCenter.verifyDiscountValue();
        console.log(`✅ Discount applied for multiple trainings purchase`);

        await costCenter.billingDetails("United States", "Alaska");
        await enrollHome.clickCalculateTaxButton();
        await costCenter.wait("mediumWait");
        await costCenter.paymentMethod("Purchase Order");
        await costCenter.fillPaymentMethodInput();
        await costCenter.clickTermsandCondition();
        const orderSummaryId = await enrollHome.clickApproveOrderAndCaptureId();
        console.log(`✅ Step 5 Passed: Order ${orderSummaryId} created with discount for multiple trainings`);
    });

    test(`Step 6: Delete discount`, async ({ adminHome, commercehome, discount }) => {
        await adminHome.loadAndLogin("COMMERCEADMIN");
        await adminHome.menuButton();
        await adminHome.clickCommerceMenu();
        await commercehome.clickCommerceOption("Discount");
        await discount.searchDiscount(discountName);
        await discount.deleteDiscount(discountName);
        console.log(`✅ Step 6 Passed: Discount '${discountName}' deleted`);
    });

});
