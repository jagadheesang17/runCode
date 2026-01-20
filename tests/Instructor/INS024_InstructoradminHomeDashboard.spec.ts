import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
import { readDataFromCSV } from "../../utils/csvUtil";
import { credentialConstants } from "../../constants/credentialConstants";

const instructorUsername = credentialConstants.INSTRUCTORNAME;
const firstName = FakerData.getFirstName();
const lastName = FakerData.getLastName();

// Instructor Admin Home Dashboard Verification
// - Ensures instructor user exists (creates if missing) and verifies dashboard visibility

test.describe("Instructor Admin Home Dashboard Verification", () => {
  test.describe.configure({ mode: "serial" });

  test("Test 1: Ensure instructor user exists (create if missing)", async ({ adminHome, createUser }) => {
    test.info().annotations.push(
      { type: `Author`, description: `QA Automation Team` },
      { type: `TestCase`, description: `INS-DASH-001` },
      { type: `Test Description`, description: `Create instructor user JagadishLearner if not present` }
    );

    await adminHome.loadAndLogin("CUSTOMERADMIN");
    await adminHome.clickMenu("User");
    await createUser.verifyCreateUserLabel();
 const csvFilePath = './data/User.csv';
    const data = await readDataFromCSV(csvFilePath);

    for (const row of data) {
      const { country, state, timezone, currency, city, zipcode } = row;

      await createUser.uncheckInheritAddressIfPresent();
      await createUser.uncheckInheritEmergencyContactIfPresent();
      await createUser.uncheckAutoGenerateUsernameIfPresent();

      await createUser.enter("first_name", firstName);
      await createUser.enter("last_name", lastName);
      await createUser.enter("username", instructorUsername);
      await createUser.enter("user-password", "Welcome1@");
      await createUser.enter("email", instructorUsername);
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

      await createUser.clickRolesButton("Instructor");
      await createUser.clickSave();
      await createUser.verifyUserCreationSuccessMessage();
      break; // create one user only
      
    }
  });

     
  

  test("Test 2: Verify Instructor Admin Home Dashboard is visible", async ({ adminHome }) => {
    test.info().annotations.push(
      { type: `Author`, description: `QA Automation Team` },
      { type: `TestCase`, description: `INS-DASH-002` },
      { type: `Test Description`, description: `Verify Admin Home and Dashboard header for instructor` }
    );

    // Login as the specific instructor user and verify dashboard
    await adminHome.singleUserLogin(instructorUsername);
    await adminHome.instructorDashboardVerification();
  });
});
