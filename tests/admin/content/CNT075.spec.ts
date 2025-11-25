import { test } from "../../../customFixtures/expertusFixture";

test.describe(`CNT075 - Verify Search, Filter, Sort and Export options in listing page`, async () => {
    
    test(`Verify Search functionality in content listing page`, async ({ 
        adminHome, 
        contentHome
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT075 - Search` },
            { type: `Test Description`, description: `Verify whether Search option in listing page is functioning` }
        );

        // Login and navigate to content listing
        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickContentmenu();
        await contentHome.wait("mediumWait");

        // Verify search functionality
        await contentHome.verifySearchFunctionality();
    });

    test(`Verify Filter functionality in content listing page`, async ({ 
        adminHome, 
        contentHome
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT075 - Filter` },
            { type: `Test Description`, description: `Verify whether Filter option in listing page is functioning` }
        );

        // Login and navigate to content listing
        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickContentmenu();
        await contentHome.wait("mediumWait");

        // Verify filter functionality
        await contentHome.verifyFilterFunctionality();
    });

    test(`Verify Sort functionality in content listing page`, async ({ 
        adminHome, 
        contentHome
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT075 - Sort` },
            { type: `Test Description`, description: `Verify whether Sort option in listing page is functioning` }
        );

        // Login and navigate to content listing
        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickContentmenu();
        await contentHome.wait("mediumWait");

        // Verify sort functionality
        await contentHome.verifySortFunctionality();
    });

    test(`Verify Export functionality in content listing page`, async ({ 
        adminHome, 
        contentHome, exportPage
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT075 - Export` },
            { type: `Test Description`, description: `Verify whether Export option in listing page is functioning` }
        );

        // Login and navigate to content listing
        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickContentmenu();
        await contentHome.wait("mediumWait");

        // Verify export functionality
        await exportPage.clickExportAs("CSV");
    });
});
