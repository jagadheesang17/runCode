import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';

test.describe(`Verify_Direct_content_launch_is_available_in_site_settings`, async () => {
    test.describe.configure({ mode: "serial" });
test(`Verify Direct content launch is available in site settings`, async ({ siteAdmin,adminHome}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Nithya` },
        { type: `TestCase`, description: `Verify Direct content launch is available in site settings` },
        { type: `Test Description`, description: `Verify Direct content launch is available in site settings` }
    ); 
    await adminHome.loadAndLogin("SUPERADMIN");
    await adminHome.menuButton();
    await adminHome.siteAdmin();
    await adminHome.siteAdmin_Adminconfig();

})

test.only(`Verify Direct content launch link in learning menu`, async ({ adminHome,directContent}) => {
    test.info().annotations.push(
        { type: `Author`, description: `Nithya` },
        { type: `TestCase`, description: `Verify Direct content launch link in learning menu` },
        { type: `Test Description`, description: `Verify Direct content launch link in learning menu` }
    ); 
    
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
        await directContent.verifyDirectContentLaunchPage();

    await adminHome.clickDirectContentLaunchLink();
})
})
