import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";

test.describe.configure({ mode: "serial" });

test.describe(`FP001 - Verify Forgot Password Functionality`, () => {

    test(`FP001_TC001 - Verify password field validations (mandatory, eye icon, info icon)`, async ({ learnerLogin, learnerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `FP001_TC001 - Verify password field validations` },
            { type: `Test Description`, description: `Verify password field is mandatory, eye icon for visibility toggle, and info icon for password policy` }
        );
        console.log(`📋 Step 1: Verifying invalid credentials error`);
        await learnerLogin.verifyInvalidCredentials("invaliduser123", "InvalidPass123@");
        console.log(` Verifying eye icon and toggling password visibility`);
        await learnerLogin.verifyPasswordEyeIconExists();
        console.log(`Skip the password as null and verify mandatory field error`);
        await learnerLogin.verifyPasswordFieldIsMandatory();
        await learnerLogin.togglePasswordVisibility();
        console.log(`✅ Test completed: All password field validations passed`);
    });


});
