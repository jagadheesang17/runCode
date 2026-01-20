import { test } from "../../../customFixtures/expertusFixture";

test.describe.serial(`COM007 - Verify Discount Module visibility based on site admin configuration`, async () => {

    test(`Step 1: Disable Discount Module from site settings`, async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `COM007 - Step 1: Disable Discount Module` },
            { type: `Test Description`, description: `Disable Discount Module in site admin configuration` }
        );

        await adminHome.loadAndLogin("PEOPLEADMIN");
        await adminHome.isSignOut();
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await adminHome.siteAdmin_Adminconfig();
        await adminHome.siteAdmin_Commerce();
        await siteAdmin.disableDiscountModule();
        console.log("✅ Step 1 Completed: Discount Module disabled");
    });

    test(`Step 2: Verify Discount Module is NOT visible when disabled in site configuration`, async ({ 
        adminHome, 
        discount 
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `COM007 - Step 2: Verify Discount Module Hidden` },
            { type: `Test Description`, description: `Verify Discount Module is not visible in Commerce menu when it is disabled in site configuration` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickCommerceMenu();
        await discount.wait("mediumWait");

        // Verify Discount Module is NOT visible
        await discount.verifyDiscountModuleNotVisible();
        console.log("✅ Step 2 Completed: Verified Discount Module is NOT visible");
    });

    test(`Step 3: Enable Discount Module from site settings`, async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `COM007 - Step 3: Enable Discount Module` },
            { type: `Test Description`, description: `Enable Discount Module in site admin configuration` }
        );

        await adminHome.loadAndLogin("PEOPLEADMIN");
        await adminHome.isSignOut();
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await adminHome.siteAdmin_Adminconfig();
        await adminHome.siteAdmin_Commerce();
        await siteAdmin.enableDiscountModule();
        console.log("✅ Step 3 Completed: Discount Module enabled");
    });

    test(`Step 4: Verify Discount Module IS visible when enabled in site configuration`, async ({ 
        adminHome, 
        discount 
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `COM007 - Step 4: Verify Discount Module Visible` },
            { type: `Test Description`, description: `Verify Discount Module is visible in Commerce menu when it is enabled in site configuration` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickCommerceMenu();
        await discount.wait("mediumWait");

        // Verify Discount Module IS visible
        await discount.verifyDiscountModuleVisible();
        console.log("✅ Step 4 Completed: Verified Discount Module IS visible");
    });
});
