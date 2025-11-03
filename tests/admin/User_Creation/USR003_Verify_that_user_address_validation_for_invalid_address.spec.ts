import { URLConstants } from '../../../constants/urlConstants';
import { test } from '../../../customFixtures/expertusFixture';
import { filePath } from '../../../data/MetadataLibraryData/filePathEnv';
import { readDataFromCSV } from '../../../utils/csvUtil';
import { FakerData } from '../../../utils/fakerUtils';
import { getRandomItemFromFile } from '../../../utils/jsonDataHandler';

let data = getRandomItemFromFile(filePath.department);
test(`Verifying that user address validation functionality working as expected for Invalid address on User creation page`, async ({ siteAdmin,adminHome,learnerHome}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Confirm that address verification has enabled from site settings` },
        { type: `Test Description`, description: `Confirm that address verification has enabled from site settings` }

    );
    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.isSignOut();
    await adminHome.menuButton();
    await adminHome.siteAdmin();
    await adminHome.siteAdmin_Adminconfig();
    await siteAdmin.addressVerification();
});

test(`Verify that user address validation functionality working as expected for Invalid address on User creation page`, async ({ adminHome, createUser ,createCourse}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Verify that user address validation functionality working as expected` },
        { type: `Test Description`, description: `Creating the user and verifying user address validation functionality working as expected` }
    );   
    const csvFilePath = './data/US_address.csv';
    const data = await readDataFromCSV(csvFilePath);

    for (const row of data) {
        const { country,state,timezone,address1,address2,city,zipcode } = row;

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.clickCreateUser();    
        await createUser.verifyCreateUserLabel();    
        await createUser.enter("first_name", FakerData.getFirstName());
        await createUser.enter("last_name", FakerData.getLastName());
        await createUser.enter("username", FakerData.getUserId());
        await createUser.enter("user-password", "Welcome1@");
        await createUser.typeAddress("Address 1", FakerData.getAddress());
        await createUser.typeAddress("Address 2", FakerData.getAddress());
        await createUser.select("Country", country);
        await createUser.select("State/Province", state);
        await createUser.select("Time Zone", timezone);
        await createUser.enter("user-city", city);
        await createUser.enter("user-zipcode", zipcode);
        await createUser.clickVerifyAddressBtn();
        await createUser.verifyUserAddress();
        await createUser.clickSave();               
    //  await createUser.clickProceed("Proceed");
    //  await createUser.verifyUserCreationSuccessMessage();
    }
    }
)




