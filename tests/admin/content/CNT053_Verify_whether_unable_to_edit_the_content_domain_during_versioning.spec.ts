import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { AdminRoleManager } from "../../../utils/adminRoleManager";
import { UserPage } from "../../../pages/UserPage";
import { } from "../../../pages/AdminHomePage";
import { AdminGroupPage } from "../../../pages/AdminGroupPage";


const title=FakerData.getRandomTitle();
const title1=FakerData.getRandomTitle();
test.describe(`Verify whether unable to edit the content domain during versioning `, async () => {
    test.describe.configure({ mode: 'serial' })
    test(`Verify whether unable to edit the content domain during versioning `, async ({ adminHome, contentHome, bannerHome, createCourse, adminGroup, siteAdmin }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `Verify whether unable to edit the content domain during versioning ` },
            { type: `Test Description`, description: `Verify whether unable to edit the content domain during versioning ` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await adminHome.siteAdmin_Adminconfig();
        await siteAdmin.autoCodeConventionTurnON();
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickContentmenu();
        await contentHome.clickCreateContent();
        await contentHome.enterTitle(title);
        await contentHome.enterDescription("Sample video content for " + title);
        await contentHome.uploadContent("Original_recording5.mp4");
        await bannerHome.clickPublish();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await contentHome.clickEditContent();
        await contentHome.clickAddVersionBtn();
        await contentHome.verifyFieldIsDisabled("//button[@data-id='content-portals']");
        
    })


});