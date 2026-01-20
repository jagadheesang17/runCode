import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

const discountName = FakerData.getTagNames() + " " + "DateFormatValidation";

test.describe(`COM016 - Verify selected dates are highlighted and date format is MM/DD/YYYY`, () => {

test(`COM016 - Verify selected date is highlighted and displayed in MM/DD/YYYY format`, async ({ adminHome, commercehome, discount }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `COM016 - Verify selected date highlighted and format` },
        { type: `Test Description`, description: `Verify that selected dates are highlighted in the calendar and displayed in MM/DD/YYYY format in the Valid From input field` }
    );
    
    await adminHome.loadAndLogin("COMMERCEADMIN");
    await adminHome.menuButton();
    await adminHome.clickCommerceMenu();
    await commercehome.clickCommerceOption("Discount");
    await discount.clickCreateDiscount();
    await discount.dateDefaultState();
    
    console.log(`✅ Test Passed: Selected date is highlighted in calendar and displayed in MM/DD/YYYY format`);
});

});
