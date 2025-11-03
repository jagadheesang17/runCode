import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";

const title = FakerData.getRandomTitle();

test.describe('CNT006 - Verify alert message for invalid URL and unsupported file upload', () => {

    test(`Verify_alert_message_for_invalid_url_upload`, async ({ adminHome, contentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Automation Team` },
            { type: `TestCase`, description: `Verify_alert_message_for_invalid_url_upload` },
            { type: `Test Description`, description: `Verify whether alert message is displayed when invalid url is uploaded` }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickContentmenu();
        await contentHome.clickCreateContent();
        await contentHome.enter("content-title", title);
        await contentHome.enterDescription("Testing invalid URL upload for " + title);
        await contentHome.enterInvalidUrl("invalid-url-format");
        await contentHome.clickAddUrl();
        await contentHome.verifyAlertErrorMessage("must contain a valid URL");
    });

    test(`Verify_alert_message_for_unsupported_file_upload`, async ({ adminHome, contentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Automation Team` },
            { type: `TestCase`, description: `Verify_alert_message_for_unsupported_file_upload` },
            { type: `Test Description`, description: `Verify whether alert message is displayed when unsupported file is uploaded` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickContentmenu();
        await contentHome.clickCreateContent();
        await contentHome.enter("content-title", title + "_unsupported");
        await contentHome.enterDescription("Testing unsupported file upload for " + title);
        await contentHome.uploadUnsupportedFile("peopleCEUTags_bkp.json");
        await contentHome.verifyAlertErrorMessage("Invalid file format");
    });
});