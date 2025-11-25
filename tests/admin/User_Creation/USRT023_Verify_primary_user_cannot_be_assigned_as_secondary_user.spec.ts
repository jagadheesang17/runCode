import { URLConstants } from '../../../constants/urlConstants';
import { test } from '../../../customFixtures/expertusFixture';
import { readDataFromCSV } from '../../../utils/csvUtil';
import { FakerData } from '../../../utils/fakerUtils';

const primaryUserId: any = FakerData.getUserId();

test(`Verifying that merge user functionality setup - enable merge user configuration`, async ({ siteAdmin, adminHome, learnerHome }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `USRT023 - Verify primary user cannot be assigned as secondary user` },
        { type: `Test Description`, description: `Setup and verify merge user configuration is enabled in site settings` }

    );
    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.isSignOut();
    await adminHome.menuButton();
    await adminHome.siteAdmin();
    await adminHome.siteAdmin_Adminconfig();
    await siteAdmin.mergeUserVerification();
});

test(`Verify that once primary user ID is selected, same user ID cannot be assigned as secondary user`, async ({ contentHome, adminHome, createUser, createCourse }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `USRT023 - Verify primary user cannot be assigned as secondary user` },
        { type: `Test Description`, description: `Create a user, select as primary, then verify same user cannot be selected as secondary with 'No matching result found' message` }
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

    await contentHome.gotoListing();

    // Test Merge User Functionality - Primary user cannot be secondary user
    await createUser.clickMergeUser();
    
    // Select the created user as primary user
    await createUser.searchAndSelectPrimaryUser(primaryUserId);
    
    // Try to select the same user as secondary user - should show "No matching result found"
    await createUser.searchSecondaryUserAndVerifyNoResult(primaryUserId);

}
)