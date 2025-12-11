import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

const discountName = FakerData.getTagNames() + " " + "DateValidation";

test.describe(`COM015 - Verify and check By default, the previous dates will be disabled in the valid from calendar and the present date will be selected and highlighted`, () => {

test(`COM015 - Verify past dates disabled and present date highlighted in Valid From calendar`, async ({ adminHome, commercehome, discount, dynamicShareableLinks }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM015 - Verify Valid From calendar date validation` },
        { type: `Test Description`, description: `Verify that by default, the previous dates will be disabled in the Valid From calendar and the present date will be selected and highlighted` }
    );
    
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.clickCreateDiscount();
    await discount.clickValidFrom();
    await dynamicShareableLinks.verifyPastDatesDisabled();
    await discount.clickValidTo();
    await dynamicShareableLinks.verifyPastDatesDisabled();
    await discount.verifyTodayDateHighlighted();
    
    console.log(`✅ Test Passed: Valid From calendar correctly disables past dates and highlights present date`);
});

});
