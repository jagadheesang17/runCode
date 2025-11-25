import { test } from "../../../customFixtures/expertusFixture";

test.describe.serial(`TECRS01 - Verify Transfer Enrollment option visibility based on site configuration`, async () => {

    test(`Disable Transfer Enrollment from site settings`, async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS01 - Step 1: Disable Transfer Enrollment` },
            { type: `Test Description`, description: `Disable Transfer Enrollment option in site configuration` }
        );

        await adminHome.loadAndLogin("PEOPLEADMIN");
        await adminHome.isSignOut();
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await adminHome.siteAdmin_Adminconfig();
        await adminHome.siteAdmin_Enrollments();
        await siteAdmin.disableTransferEnrollment();
    });

    test(`Verify Transfer Enrollment option is NOT visible when disabled in site configuration`, async ({ 
        adminHome, 
        enrollHome 
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS01 - Step 2: Verify Transfer Option Hidden` },
            { type: `Test Description`, description: `Verify Transfer Enrollment option is not visible when it is disabled in site configuration` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await enrollHome.wait("mediumWait");

        // Verify Transfer Enrollment option is NOT visible
        await enrollHome.verifyTransferEnrollmentOptionNotVisible();
    });

    test(`Enable Transfer Enrollment from site settings`, async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS01 - Step 3: Enable Transfer Enrollment` },
            { type: `Test Description`, description: `Enable Transfer Enrollment option in site configuration` }
        );

        await adminHome.loadAndLogin("PEOPLEADMIN");
        await adminHome.isSignOut();
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await adminHome.siteAdmin_Adminconfig();
        await adminHome.siteAdmin_Enrollments();
        await siteAdmin.enableTransferEnrollment();
    });

    test(`Verify Transfer Enrollment option IS visible when enabled in site configuration`, async ({ 
        adminHome, 
        enrollHome 
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS01 - Step 4: Verify Transfer Option Visible` },
            { type: `Test Description`, description: `Verify Transfer Enrollment option is visible when it is enabled in site configuration` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await enrollHome.wait("mediumWait");

        // Verify Transfer Enrollment option IS visible
        await enrollHome.verifyTransferEnrollmentOptionVisible();
    });
});
