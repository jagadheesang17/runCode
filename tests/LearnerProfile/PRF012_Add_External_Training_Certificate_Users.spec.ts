import { test } from '../../customFixtures/expertusFixture'
import { FakerData } from '../../utils/fakerUtils';
import { credentials } from '../../constants/credentialData';
import * as path from 'path';

const learnerUsername = credentials.LEARNERUSERNAME.username;
const htmlFile = 'email_content.html';

// Define test scenarios
const scenarios = [
    { action: 'Approve', email: FakerData.getUserId(), expectedStatus: 'Approved', certificate: 'ouch cockpit' },
    { action: 'Reject', email: FakerData.getUserId(), expectedStatus: 'Rejected', certificate: 'ouch cockpit' }
];

test.describe(`Add External Training Certificate and Email Verification`, () => {
    test.describe.configure({ mode: "serial" });

    for (const scenario of scenarios) {
        test(`TC12_Add_External_Training_Certificate_For_${scenario.action}`, async ({ profile, learnerHome }) => {

            test.info().annotations.push(
                { type: `Author`, description: `Vidya` },
                { type: `TestCase`, description: `Adding External Training for ${scenario.action}` },
                { type: `Test Description`, description: `Certificate Verification as Others - ${scenario.action} Flow` }
            );

            await learnerHome.learnerLogin("LEARNERUSERNAME", "Portal");
            await profile.clickProfile();
            await profile.detailsTab();
            console.log(`Generated Email ID for ${scenario.action}: ${scenario.email}`);
            console.log("Learner Username: " + learnerUsername);
            await profile.certificateVerificationbyOther(scenario.email);
            await profile.clickSave();
            await profile.verifySavedChanges();
        })

        test(`TC12_Admin_${scenario.action}s_External_Training`, async ({ adminHome }) => {
            test.info().annotations.push(
                { type: `Author`, description: `Kathir A` },
                { type: `TestCase`, description: `Admin ${scenario.action}s External Training` },
                { type: `Test Description`, description: `Verify email and ${scenario.action.toLowerCase()} the external training request` }
            );
            
            console.log(`Executing query to verify email trigger for ${scenario.action.toLowerCase()}`);
            const query = `SELECT * FROM mail_dispatcher WHERE LOWER(email_to) = '${scenario.email.toLowerCase()}' ORDER BY id DESC LIMIT 50;`;
            await adminHome.loadAndLogin("CUSTOMERADMIN");
            await adminHome.menuButton();
            await adminHome.clickMaintenanceMenu();
            await adminHome.clickQueryExecution();
            await adminHome.executeQuery("LMS", query);
            await adminHome.verifyAndPrintEmailSubject();
            const { approveUrl, rejectUrl } = await adminHome.saveEmailContentToHTML(htmlFile);
            await adminHome.clickEmailVerificationAction(scenario.action as 'Approve' | 'Reject', approveUrl, rejectUrl);
        })

        test(`TC12_Verify_Certificate_Status_${scenario.expectedStatus}`, async ({ profile, learnerHome }) => {

            test.info().annotations.push(
                { type: `Author`, description: `Kathir A` },
                { type: `TestCase`, description: `Verify Certificate Status - ${scenario.expectedStatus}` },
                { type: `Test Description`, description: `Learner verifies external certificate status is ${scenario.expectedStatus}` }
            );

            await learnerHome.learnerLogin("LEARNERUSERNAME", "Portal");
            await profile.clickProfile();
            await profile.detailsTab();
            await profile.verifyExternalCertificateStatus(scenario.certificate, scenario.expectedStatus);
        })
    }
})