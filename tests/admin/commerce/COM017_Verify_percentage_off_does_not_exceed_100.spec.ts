import { test } from "../../../customFixtures/expertusFixture";
import { generateCode } from "../../../data/apiData/formData";
import { FakerData } from "../../../utils/fakerUtils";

const discountName = FakerData.getTagNames() + " " + "PercentageValidation";
const code = "DIS-" + generateCode();

test.describe.serial(`COM017 - Verify percentage off discount does not allow values exceeding 100`, () => {

test(`Step 1: Navigate to Create Discount page`, async ({ adminHome, commercehome, discount, createCourse }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM017 - Verify percentage off validation` },
        { type: `Test Description`, description: `Verify that if the discount base is Percentage Off, it should not allow to exceed 100` }
    );
    
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.clickCreateDiscount();
    await createCourse.enter("name", discountName);
    console.log(`✅ Step 1 Passed: Navigated to Create Discount page`);

    await createCourse.enter("code", code);
    // Enter discount description
    await discount.enterDiscountDescription(discountName);
    
    // Set validity dates
    await discount.enterValidity();
    
    // Verify warning message is displayed
    await discount.verifyPercentageOffExceededWarning("Percentage Off");

});

});
