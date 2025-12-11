import { test } from "../../customFixtures/expertusFixture";
import { readDataFromCSV } from "../../utils/csvUtil";
import { FakerData } from '../../utils/fakerUtils';
import { updateFieldsInJSON } from "../../utils/jsonDataHandler";

const courseAdmin: any = FakerData.getUserId()

test.describe.configure({ mode: "serial" });

test.describe(`TC001 - Verify Terms and Conditions popup for newly created user, second login behavior, and hyperlink functionality`, () => {

    test(`Creating a new user from admin side`, async ({ adminHome, editCourse, createUser, learnerHome, adminRoleHome, adminGroup, createCourse, contentHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Creating new user for Verifying Terms and Conditions popup present on the learner page` },
            { type: `Test Description`, description: `Creating user forVerifying Terms and Conditions popup present on the learner page for newly created user` }

        );
        const newData = {
            courseAdmin: courseAdmin
        }
        updateFieldsInJSON(newData)
        const csvFilePath = './data/User.csv';


        const data = await readDataFromCSV(csvFilePath);

        //creating a new user
        for (const row of data) {
            const { country, state, timezone, currency, city, zipcode } = row;
            await adminHome.loadAndLogin("SUPERADMIN")
            await adminHome.menuButton()
            await adminHome.people();
            await adminHome.user();
            await createUser.clickCreateUser();
            await createUser.verifyCreateUserLabel();
            await createUser.enter("first_name", FakerData.getFirstName());
            await createUser.enter("last_name", FakerData.getLastName());
            await createUser.enter("username", courseAdmin);
            await createUser.enter("user-password", "Welcome1@");
            await createUser.enter("email", FakerData.getEmail());
            await createUser.enter("user-phone", FakerData.getMobileNumber());
            await createUser.typeAddress("Address 1", FakerData.getAddress());
            await createUser.typeAddress("Address 2", FakerData.getAddress());
            await createUser.select("Country", country);
            await createUser.select("State/Province", state);
            await createUser.select("Time Zone", timezone);
            await createUser.select("Currency", currency);
            await createUser.enter("user-city", city);
            await createUser.enter("user-zipcode", zipcode);
            await createUser.enter("user-mobile", FakerData.getMobileNumber());
            await createUser.clickSave();
            await createUser.verifyUserCreationSuccessMessage();
            await contentHome.gotoListing();
        }
    })

    test(`Verifying Terms and Conditions popup present on the learner page`, async ({ createUser, learnerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verifying Terms and Conditions popup present on the learner page` },
            { type: `Test Description`, description: `Verifying Terms and Conditions popup present on the learner page for newly created user` }

        );
        await learnerHome.basicLogin(courseAdmin, "defaultportal");
        await learnerHome.termsAndConditionScroll();
    });

    test(`Verifying T&C For the Second time the redirection doesnot happens & Verifying  new tab opens when clicking on T&C and Privacy Policy hyperlink`, async ({ createUser, learnerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `Verifying T&C For the Second time the redirection doesnot happens & Verifying  new tab opens when clicking on T&C and Privacy Policy hyperlink` },
            { type: `Test Description`, description: `Verifying T&C For the Second time the redirection doesnot happens & Verifying  new tab opens when clicking on T&C and Privacy Policy hyperlink` }

        );

        await learnerHome.basicLogin(courseAdmin, "defaultportal");
        console.log(` Terms and Conditions popup should not appear for the user again as the data is already saved `);
        await learnerHome.verifyT_C_NotVisible();
        await learnerHome.clickUserProfile();
        await learnerHome.clickPreferenceTab();
        await learnerHome.clickTermsAndConditionsLinkAndVerifyNewTab();
        await learnerHome.clickPrivacyPolicyLinkAndVerifyNewTab();
    });

});