import { test } from "../../../customFixtures/expertusFixture";
import { readDataFromCSV } from "../../../utils/csvUtil";
import { FakerData } from "../../../utils/fakerUtils";

const vatNumber = FakerData.getPinCode();


test.describe(`COM007 - Tax Management Through Quick Access`, async () => {
    test.describe.configure({ mode: "serial" });

test(`Verify Manage Tax in Quick Access dropdown, add to list, then remove and verify back in dropdown`, async ({ commercehome, adminHome, adminGroup, siteAdmin }) => {
    


   await adminHome.loadAndLogin("CUSTOMERADMIN")
    await adminHome.clickQuickAccess();
    await adminHome.verifyAndClickManageTaxFromQuickAccess("Manage Tax");

    await adminHome.removeManageTaxFromQuickAccessAndVerify("Manage Tax");



})
    
   test(`Access Manage Tax from Quick Access and create tax with duplicate check and state validation`, async ({ commercehome, adminHome, adminGroup, siteAdmin }) => {
    


   await adminHome.loadAndLogin("CUSTOMERADMIN")
    await adminHome.clickQuickAccess();
    await adminHome.verifyAndClickManageTaxFromQuickAccess("Manage Tax");

 const csvFilePath = './data/US_address.csv';
    const data = await readDataFromCSV(csvFilePath);

    for (const row of data) {
        const { country, state, timezone, address1, address2, city, zipcode } = row;


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

test(`Add Manage Tax to Quick Access, create tax, navigate to Admin Home, edit tax and verify dropdown states`, async ({ commercehome, adminHome, adminGroup, siteAdmin }) => {
      await adminHome.loadAndLogin("CUSTOMERADMIN")
    await adminHome.clickQuickAccess();
    await adminHome.verifyAndClickManageTaxFromQuickAccess("Manage Tax");
    await adminHome.createModuleFromQuickAccess("Manage Tax","Manage Tax");


    const csvFilePath = './data/US_address.csv';
    const data = await readDataFromCSV(csvFilePath);

    for (const row of data) {
        const { country, state, timezone, address1, address2, city, zipcode } = row;

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
        await adminHome.clickAdminHome();
            await adminHome.editModuleFromQuickAccess("Manage Tax","Manage Tax");  //this will fail beacuse there is an issue after adding module from quick access it is not showing in the quick access list

        await commercehome.updateCreatedTaxAndVerifyDropdownState(selectedCountry);  

    }
})

})