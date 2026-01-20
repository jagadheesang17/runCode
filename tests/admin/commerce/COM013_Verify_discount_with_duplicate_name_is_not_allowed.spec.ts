import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { generateCode } from "../../../data/apiData/formData";

const discountName = FakerData.getTagNames() + " " + "UniqueDiscount";
const description = FakerData.getDescription();
const code1 = "DIS-" + generateCode();
const code2 = "DIS-" + generateCode();
let discountValue: any;

test.describe(`COM013 - Verify discount with duplicate name is not allowed`, () => {
test.describe.configure({ mode: "serial" });

test(`COM013 - Step 1: Create first discount with unique name`, async ({ adminHome, commercehome, createCourse, discount, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM013 - Create first discount` },
        { type: `Test Description`, description: `Create a linear discount with a unique name to test duplicate validation` }
    );
    
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.clickCreateDiscount();
    await createCourse.enter("name", discountName);
    await discount.enterDiscountDescription(description);
    await createCourse.enter("code", code1);
    await discount.enterValidity();
    discountValue = await discount.setDiscountRules("Percentage Off", "US Dollar","30");
    console.log(`Created discount with value: ${discountValue}%`);
    await discount.discountCriteria("Domain");
    await SurveyAssessment.clickPublish();
    await createCourse.clickProceed();
    console.log(`✅ First discount '${discountName}' created successfully`);
});

test(`COM013 - Step 2: Verify error when creating discount with duplicate name`, async ({ adminHome, commercehome, createCourse, discount }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM013 - Verify duplicate name validation` },
        { type: `Test Description`, description: `Verify that system does not allow creating discount with the same name and displays "Name already Exists" error` }
    );

    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.clickCreateDiscount();
    
    // Try to create discount with the same name
    await createCourse.enter("name", discountName);
    await discount.enterDiscountDescription(description);
    await createCourse.enter("code", code2);
    await discount.enterValidity();
    await discount.setDiscountRules("Fixed Amount Off", "US Dollar", "10");
    await discount.discountCriteria("Domain");
    
    // Verify warning message is displayed for duplicate name
    await discount.verifyWarningForSameName();
    console.log(`✅ Verified: System displays "The Title field already exists." error message for duplicate discount name`);
    console.log(`✅ Test Passed: System does not allow creating discount with duplicate name '${discountName}'`);
});

test(`COM013 - Step 3: Delete the discount after verification`, async ({ adminHome, commercehome, discount }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM013 - Delete discount` },
        { type: `Test Description`, description: `Delete the discount after verifying duplicate name validation` }
    );

    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.searchDiscount(discountName);
    await discount.deleteDiscount(discountName);
    console.log(`✅ Discount '${discountName}' deleted successfully`);
});

});
