import { test } from "../../../customFixtures/expertusFixture";
import { readDataFromCSV } from "../../../utils/csvUtil";
import { FakerData } from "../../../utils/fakerUtils";

const vatNumber = FakerData.getPinCode();



test.describe(`COM008 - Tax Deletion After Disabling`, async () => {
    test.describe.configure({ mode: "serial" });
test(`Navigate to Manage Tax via menu, create tax, verify delete icon disabled, disable tax toggle, then delete`, async ({ commercehome, adminHome, adminGroup, siteAdmin }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Balasundar` },
        { type: `TestCase`, description: `COM008-TC01` },
        { type: `Test Description`, description: `Open menu, navigate to Manage Tax, create tax with duplicate country check and state selection, verify delete icon is disabled when tax is enabled, click toggle to disable tax, then click delete icon and confirm deletion` }
    );


    await adminHome.loadAndLogin("CUSTOMERADMIN")
await adminHome.menuButton();
   
    const csvFilePath = './data/US_address.csv';
    const data = await readDataFromCSV(csvFilePath);

    for (const row of data) {
        const { country, state, timezone, address1, address2, city, zipcode } = row;

        await adminHome.clickCommerceMenu();
        await adminHome.clickManageTax();

        // Get list of already created countries from the tax listing page
        const createdCountries = await commercehome.getCreatedTaxCountries();

        // Click SETUP TAX to open the modal
        await adminHome.clickSetupTaxButton();

        // Select a country that is NOT in the already created list
        const selectedCountry = await commercehome.selectAvailableCountry("Country:", 2, createdCountries);

        // Select state only if dropdown is enabled (US/Canada)
        await commercehome.selectStateIfEnabled(state);

        await commercehome.enter("vat_numbers", vatNumber);


        await adminGroup.clickSaveBtn();
        
        // Verify delete icon is disabled when tax is enabled
        await commercehome.verifyDeleteIconDisabledWhenTaxEnabled(selectedCountry);
        
        // Disable the tax
        await commercehome.disableTax(selectedCountry);
        
        // Delete the tax
        await commercehome.deleteTax(selectedCountry);
    }
})})