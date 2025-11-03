import { URLConstants } from '../../../constants/urlConstants';
import { test } from '../../../customFixtures/expertusFixture';
import { readDataFromCSV } from '../../../utils/csvUtil';
import { FakerData } from '../../../utils/fakerUtils';

const primaryUserId: any = FakerData.getUserId();
const secondaryUserId: any = FakerData.getUserId();

test(`Verifying that merge user functionality works correctly - setup configuration`, async ({ siteAdmin, adminHome, learnerHome }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `USRT022 - Verify that merge user functionality works correctly` },
        { type: `Test Description`, description: `Setup and verify merge user configuration is enabled in site settings` }

    );
    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.isSignOut();
    await adminHome.menuButton();
    await adminHome.siteAdmin();
    await adminHome.siteAdmin_Adminconfig();
    await siteAdmin.mergeUserVerification();
});

test(`Creating a primary and secondary user and verifying merge user functionality`, async ({ contentHome,adminHome, createUser, createCourse }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `create a primary and secondary user and verify merge user functionality` },
        { type: `Test Description`, description: `Create a primary and secondary user and verify merge user functionality` }
    );
    const csvFilePath = './data/US_address.csv';
    const data = await readDataFromCSV(csvFilePath);

    for (const row of data) {
        const { country, state, timezone, address1, address2, city, zipcode } = row;

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.clickCreateUser();
        await createUser.verifyCreateUserLabel();
        await createUser.uncheckInheritAddressIfPresent();
        await createUser.uncheckInheritEmergencyContactIfPresent();
        await createUser.uncheckAutoGenerateUsernameIfPresent();
        await createUser.enter("first_name", FakerData.getFirstName());
        await createUser.enter("last_name", FakerData.getLastName());
        await createUser.enter("username", primaryUserId);
        await createUser.enter("user-password", "Welcome1@");
        await createUser.typeAddress("Address 1", address1);
        await createUser.typeAddress("Address 2", address2);
        await createUser.select("Country", country);
        await createUser.select("State/Province", state);
        await createUser.select("Time Zone", timezone);
        await createUser.enter("user-city", city);
        await createUser.enter("user-zipcode", zipcode);
        await createUser.clickSave();
        await createUser.verifyUserCreationSuccessMessage();
    }

    // Create Secondary User

    await createUser.createBtn();
    await createUser.verifyCreateUserLabel();
    await createUser.uncheckInheritAddressIfPresent();
    await createUser.uncheckInheritEmergencyContactIfPresent();
    await createUser.uncheckAutoGenerateUsernameIfPresent();
    await createUser.enter("first_name", FakerData.getFirstName());
    await createUser.enter("last_name", FakerData.getLastName());
    await createUser.enter("username", secondaryUserId);
    await createUser.enter("user-password", "Welcome1@");
    await createUser.clickSave();
    await createUser.verifyUserCreationSuccessMessage();
    await contentHome.gotoListing();

    // Merge User Functionality Test
    await createUser.clickMergeUser();
    await createUser.searchAndSelectPrimaryUser(primaryUserId);
    await createUser.searchAndSelectSecondaryUser(secondaryUserId);
    await createUser.initiateMergeProcess();
    await createUser.verifyMergeConfirmationMessage();
    await createUser.verifyMergeSuccessMessage();

}
)




