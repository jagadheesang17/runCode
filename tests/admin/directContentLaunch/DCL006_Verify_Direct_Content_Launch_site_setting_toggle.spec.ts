import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';

test.describe(`DCL006 - Verify Direct Content Launch site setting toggle`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`DCL006 - Enable Direct Content Launch from site settings`, async ({ siteAdmin, adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Assistant` },
            { type: `TestCase`, description: `DCL006 - Verify Direct Content Launch site setting toggle` },
            { type: `Test Description`, description: `Verify that Direct Content Launch can be enabled from site settings when disabled` }
        );
        
        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await adminHome.siteAdmin_Adminconfig();
        await siteAdmin.enableDirectContentLaunch();
    });
});