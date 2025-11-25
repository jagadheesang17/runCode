import { test } from "../../../../customFixtures/expertusFixture"

test.describe(`Verify Transfer Enrollment - Training Plan functionality in Site Settings`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Admin enables Transfer Enrollment - Training Plan and verifies it appears in menus`, async ({ adminHome, siteAdmin, transferEnrollment }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Enable Transfer Enrollment - Training Plan and verify visibility` },
            { type: `Test Description`, description: `Admin logs in, enables Transfer Enrollment - Training Plan, and verifies it appears in Enrollment menu and Manage Enrollment dropdown` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await adminHome.siteAdmin_Adminconfig();
        console.log("✅ Navigated to Admin Configuration");
        await siteAdmin.clickEditEnrollments();
        await siteAdmin.enableTransferEnrollmentTP();
        await siteAdmin.verifyTransferEnrollmentTPEnabled();

        await adminHome.clickAdminHome();
        const menuOptions = await transferEnrollment.verifyTransferEnrollmentTPInEnrollmentMenu();
        console.log("📋 Enrollment Menu Options:", menuOptions);

        const dropdownOptions = await transferEnrollment.verifyTransferEnrollmentTPInManageEnrollmentDropdown();
        console.log("📋 Manage Enrollment Dropdown Options:", dropdownOptions);
    });

    test(`Admin disables Transfer Enrollment - Training Plan and verifies it is hidden from menus`, async ({ adminHome, siteAdmin, transferEnrollment }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Disable Transfer Enrollment - Training Plan and verify it is hidden` },
            { type: `Test Description`, description: `Admin disables Transfer Enrollment - Training Plan and verifies it does NOT appear in Enrollment menu and Manage Enrollment dropdown` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await adminHome.siteAdmin_Adminconfig();
        await siteAdmin.clickEditEnrollments();
        await siteAdmin.disableTransferEnrollmentTP();
        await siteAdmin.verifyTransferEnrollmentTPDisabled();

        await adminHome.clickAdminHome();
        await adminHome.page.reload();
        await adminHome.wait("mediumWait");

        const menuOptions = await transferEnrollment.verifyTransferEnrollmentTPNotInEnrollmentMenu();
        console.log("📋 Enrollment Menu Options (should NOT include Transfer Enrollment):", menuOptions);

        const dropdownOptions = await transferEnrollment.verifyTransferEnrollmentTPNotInManageEnrollmentDropdown();
        console.log("📋 Manage Enrollment Dropdown Options (should NOT include Transfer Enrollment):", dropdownOptions);
    });

    test(`Re-enable Transfer Enrollment - Training Plan for future tests`, async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Re-enable Transfer Enrollment - Training Plan` },
            { type: `Test Description`, description: `Admin re-enables Transfer Enrollment - Training Plan to restore original state` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await adminHome.siteAdmin_Adminconfig();
        await siteAdmin.clickEditEnrollments();
        await siteAdmin.enableTransferEnrollmentTP();
        console.log("✅ Transfer Enrollment - Training Plan has been re-enabled");
    });
});
