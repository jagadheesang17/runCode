import { test } from "../../../customFixtures/expertusFixture"
import { readDataFromCSV } from "../../../utils/csvUtil";
import { FakerData } from '../../../utils/fakerUtils';


test(`Verify that Admin can create location and check its getting displayed in listing page`, async ({ adminHome, location }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Ajay Michael` },
        { type: `TestCase`, description: `Verify that Admin can create location and check its getting displayed in listing page` },
        { type: `Test Description`, description: `Creating Location and checking its getting displayed` }
    );
    const csvFilePath = './data/User.csv';
    const data = await readDataFromCSV(csvFilePath);

    for (const row of data) {
        const { country, state, timezone, currency, city, zipcode } = row;
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.locationLink();
        await location.verifyLocationLabel();
        await location.clickCreateLocation();
        await location.locationName(FakerData.getLocationName());
        await location.enterAddress(FakerData.getAddress());
        await location.enterCountry(country);
        await location.enterState(state);
        await location.enterTimezone(timezone);
        await location.enterCity(city);
        await location.enterZipcode(zipcode)
        await location.clickPublishButton();
        await location.clickProceed();
        await location.verify_successfullMessage()

    }
})


//To store the location data in json file
test(`Read Location Data`, async ({ adminHome, location }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Ajay Michael` },
        { type: `TestCase`, description: `Read Locaton data` },
        { type: `Test Description`, description: `Reading data and storing in json file` }
    );
    await adminHome.loadAndLogin("CUSTOMERADMIN")
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.locationLink();
    await location.verifyLocationLabel();
    await location.getLocation();
})