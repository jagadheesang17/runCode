import { URLConstants } from '../../../constants/urlConstants';
import { test } from '../../../customFixtures/expertusFixture';
import { readDataFromCSV } from '../../../utils/csvUtil';
import { FakerData } from '../../../utils/fakerUtils';

const primaryUserId: any = FakerData.getUserId();
const secondaryUserId: any = FakerData.getUserId();

test(`Verifying that merge user functionality setup - enable merge user configuration`, async ({ siteAdmin, adminHome, learnerHome }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `USRT024 - Verify delete and swap functionality in merge user` },
        { type: `Test Description`, description: `Setup and verify merge user configuration is enabled in site settings` }

    );
    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.isSignOut();
    await adminHome.menuButton();
    await adminHome.siteAdmin();
    await adminHome.siteAdmin_Adminconfig();
    await siteAdmin.mergeUserVerification();
});

test(`Verify delete icon works for secondary user, re-add same user as secondary, then swap primary to secondary and merge`, async ({ contentHome, adminHome, createUser, createCourse }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `USRT024 - Verify delete and swap functionality in merge user` },
        { type: `Test Description`, description: `Create two users, test delete secondary user, re-add same user, swap primary/secondary, and complete merge process` }
    );
    const csvFilePath = './data/US_address.csv';
    const data = await readDataFromCSV(csvFilePath);

    for (const row of data) {
        const { country, state, timezone, address1, address2, city, zipcode } = row;

        // Create Primary User
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
        break; // Only need one set of address data for this test
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

    // Start Merge User Functionality Test
    await createUser.clickMergeUser();
    
    // Step 1: Select primary user
    await createUser.searchAndSelectPrimaryUser(primaryUserId);
    
    // Step 2: Select secondary user
    await createUser.searchAndSelectSecondaryUser(secondaryUserId);
    
    // Step 3: Test delete secondary user functionality
    await createUser.clickDeleteSecondaryUser();
    await createUser.verifySecondaryUserDeleted();
    
    // Step 4: Re-add the same user as secondary user
    await createUser.searchAndSelectSecondaryUser(secondaryUserId);
    
    // Step 5: Swap primary and secondary users
    await createUser.clickSwapUsers();
    
    // Step 6: Complete the merge process
    await createUser.initiateMergeProcess();
    await createUser.verifyMergeConfirmationMessage();
    await createUser.verifyMergeSuccessMessage();

}
)