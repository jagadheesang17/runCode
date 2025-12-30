import { test } from '../../customFixtures/expertusFixture'
import { FakerData } from '../../utils/fakerUtils';
import { credentials } from '../../constants/credentialData';


const email = FakerData.getUserId();
const learnerUsername = credentials.LEARNERUSERNAME.username;

test.describe(`Add External Training Certificate and Email Verification`, () => {
    test.describe.configure({ mode: "serial" });

    test(`TC12 A_Add_External_Training_Certificate_User`, async ({ profile, learnerHome }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Vidya` },
            { type: `TestCase`, description: `Adding External Training` },
            { type: `Test Description`, description: `Certificate Verification as Others` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "Portal");
        await profile.clickProfile();
        await profile.detailsTab();
        console.log("Generated Email ID: " + email);
        console.log("Learner Username: " + learnerUsername);
        await profile.certificateVerificationbyOther(email);
        await profile.clickSave();
        await profile.verifySavedChanges();
    })

    test(`TC12 B_To verify whether the email is getting triggered to the mail id after submitting the external training `, async ({ adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `Adding External Training and Verification` },
            { type: `Test Description`, description: `Certificate Verification as Others` }
        );
        console.log("Executing query to verify email trigger");
        const query = `SELECT * FROM mail_dispatcher WHERE LOWER(email_to) = '${email.toLowerCase()}' ORDER BY id DESC LIMIT 50;`;
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickMaintenanceMenu();
        await adminHome.clickQueryExecution();
        await adminHome.executeQuery("LMS", query);
        await adminHome.verifyAndPrintEmailSubject();

    })
})