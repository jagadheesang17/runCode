import { test } from "../../../customFixtures/expertusFixture";
import { readDataFromCSV } from "../../../utils/csvUtil";
import { FakerData } from "../../../utils/fakerUtils";

const vatNumber = FakerData.getPinCode();



test.describe(`COM006 - Commerce Tax Creation and Edit Operations`, async () => {
    test.describe.configure({ mode: "serial" });
test(`Enable commerce in site settings, verify in menu bar and admin config, then create tax`, async ({ commercehome, adminHome, adminGroup, siteAdmin }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Balasundar` },
        { type: `TestCase`, description: `COM006-TC01` },
        { type: `Test Description`, description: `Enable commerce module from site settings, verify commerce appears in menu bar and admin site configuration, navigate to Manage Tax via menu, create tax with duplicate country check and state selection for US/Canada only, verify tax is created and enabled by default` }
    );


    await adminHome.loadAndLogin("CUSTOMERADMIN")

    await adminHome.menuButton();
    await adminHome.siteAdmin();
    await adminHome.siteSettings();
    await siteAdmin.verifyAndEnableCommerceIfDisabled();
    await siteAdmin.clickAdminSiteConfiguration();
    await siteAdmin.verifyCommerceInAdminSiteConfiguration();
    await adminHome.clickAdminHome();

    await adminHome.menuButton();
    await adminHome.verifyCommerceMenuInMenuBar();

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
        await commercehome.verifyTheCreatedTaxandEnabledByDefault(selectedCountry);
    }
})

test(`Create tax via menu, edit and verify country/state dropdowns disabled for US/Canada and enabled for others`, async ({ commercehome, adminHome, adminGroup, siteAdmin }) => {
    await adminHome.loadAndLogin("CUSTOMERADMIN")

    await adminHome.menuButton();

      
    const csvFilePath = './data/US_address.csv';
    const data = await readDataFromCSV(csvFilePath);

    for (const row of data) {
        const { state } = row;

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
        await commercehome.editTaxFromListing(selectedCountry);
        await commercehome.updateCreatedTaxAndVerifyDropdownState(selectedCountry);

    }
})

})