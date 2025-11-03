import { URLConstants } from '../../../constants/urlConstants';
import { test } from '../../../customFixtures/expertusFixture';
import { readDataFromCSV } from '../../../utils/csvUtil';
import { FakerData } from '../../../utils/fakerUtils';
import { updateFieldsInJSON } from '../../../utils/jsonDataHandler';


const mobile =  FakerData.getMobileNumber()
const courseAdmin: any = FakerData.getUserId()
//const courseAdmin: any = "tuser17"

test(`Verifying that user address validation functionality working as expected for Invalid address on Profile page`, async ({ siteAdmin,adminHome,learnerHome}) => {
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

test(`Verify that user address validation functionality working as expected for Invalid address on Profile page`, async ({ adminHome, createUser,contentHome }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Creating user without address` },
        { type: `Test Description`, description: `Creating user without address` }

    );

        await adminHome.loadAndLogin("SUPERADMIN")
        await adminHome.menuButton()
        await adminHome.people();
        await adminHome.user();
        await createUser.clickCreateUser();
        await createUser.verifyCreateUserLabel()
             await createUser.uncheckInheritAddressIfPresent();
            await createUser.uncheckInheritEmergencyContactIfPresent();
            await createUser.uncheckAutoGenerateUsernameIfPresent();
        await createUser.enter("first_name", FakerData.getFirstName());
        await createUser.enter("last_name", FakerData.getLastName());
        await createUser.enter("username", courseAdmin);
        await createUser.enter("user-password", "Welcome1@");
        await createUser.clickSave();
      //  await createUser.clickProceed("Proceed");
     //   await createUser.verifyUserCreationSuccessMessage();
        await contentHome.gotoListing();
})

test(`Verify that user address validation functionality working as expected for Invalid address on the profile page`, async ({ learnerHome,createUser,profile}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Verify that user address validation functionality working as expected` },
        { type: `Test Description`, description: `Verifying user address validation functionality working as expected` }
    );   
    const csvFilePath = './data/User.csv';
    const data = await readDataFromCSV(csvFilePath);

    for (const row of data) {
        const { country,state,timezone,city,zipcode } = row;
        await learnerHome.basicLogin(courseAdmin, "default");
       // await learnerHome.termsAndConditionScroll();
        await profile.clickProfile();
        await profile.preferenceTab();
        await profile.typeAddress("Address 1",FakerData.getAddress() );
        await profile.typeAddress("Address 2", FakerData.getAddress());
        await profile.select(country,state,timezone);
        await profile.enter("City", city);
        await profile.enter("zipcode", zipcode);
        await createUser.clickVerifyAddressBtn();
        await createUser.verifyUserAddress();
        await profile.clickSave()
        await profile.verifySavedChanges()      
    }
    }
)




