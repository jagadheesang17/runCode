import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";

import { readDataFromCSV } from "../../utils/csvUtil";
import { updateFieldsInJSON } from "../../utils/jsonDataHandler";
const Jimp = require("jimp");
const QrCode = require("qrcode-reader");
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const courseAdmin: any = FakerData.getUserId()
test.describe(`QR code reading user profile.`, async () => {
test.describe.configure({ mode: "serial" });
//let adminGroupsInAccess: string[] = [];
//let adminGroups: string[] = [];
const courseAdmin: any = FakerData.getUserId()

  test.skip(`Verify that User Profile QR Code works correctly`, async ({ learnerHome, page,createUser,adminHome}) => {
    test.info().annotations.push(
      { type: `Author`, description: `MANIKANDAN_V` },
      { type: `TestCase`, description: `Verify that UserProfile QR_Code` },
      { type: `Test Description`, description: `Verify UserProfile QR_Code functionality and user informations` }
    );

  
    const csvFilePath = './data/User.csv';
    const data = await readDataFromCSV(csvFilePath);
    //admin create user part
    for (const row of data) {
    const { country, state, timezone, currency, city, zipcode } =row
    await adminHome.loadAndLogin("SUPERADMIN")
    await adminHome.menuButton();
    await adminHome.people();
    await adminHome.user();
    await createUser.clickCreateUser();
    await createUser.verifyCreateUserLabel();
    await createUser.enter("first_name", FakerData.getFirstName());
    await createUser.enter("last_name", FakerData.getLastName());
    await createUser.enter("username", courseAdmin);
    const learner_username = FakerData.getUserId();
    const learner_password = "Welcome1@";       
    await createUser.enter("user-password", "Welcome1@");
    const actual_learneremail = FakerData.getEmail();
    await createUser.enter("email", actual_learneremail);
    const actual_learnerphone =  FakerData.getMobileNumber();
    await createUser.enter("user-phone",actual_learnerphone);
    // await createUser.typeAddress("Address 1", FakerData.getAddress());
    // await createUser.typeAddress("Address 2", FakerData.getAddress());
    // await createUser.select("Country", country);
    // await createUser.select("State/Province", state);
    // await createUser.select("Time Zone", timezone);
    // await createUser.select("Currency", currency);
    // await createUser.enter("user-city", city);
    // await createUser.enter("user-zipcode", zipcode);
    await createUser.clickSave();
    await learnerHome.basicLogin(courseAdmin, "default");
   //await learnerHome.termsAndConditionScroll();
    await learnerHome.clickmyprofile();
    const qrLink = await learnerHome.captureAndReadQRCode();
    console.log("QR Code Value:", qrLink);
    await page.goto(qrLink);
    await page.waitForLoadState('domcontentloaded');
    console.log("Navigated to QR code URL successfully.");
    await learnerHome.verifyUserInformations(actual_learneremail, actual_learnerphone);
    console.log("User profile QR code decoding functionality completed.")
    }
  });
});
