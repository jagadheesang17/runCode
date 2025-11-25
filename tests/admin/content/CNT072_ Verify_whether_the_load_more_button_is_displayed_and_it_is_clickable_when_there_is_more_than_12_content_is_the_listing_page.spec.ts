import { test } from "../../../customFixtures/expertusFixture";

test.describe(`CNT072 - Verify Load More button displays and loads additional content when count > 12`, async () => {
    
    test(`Verify Load More button functionality in content listing`, async ({ 
        adminHome, 
        contentHome
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `CNT072` },
            { type: `Test Description`, description: `Verify Load More button displays and is clickable when content count > 12` }
        );

        // Login and navigate to content listing
        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickContentmenu();
        await contentHome.wait("mediumWait");

        // Get initial content count
        const initialCount = await contentHome.getContentCount();
        
        // Verify Load More button visibility based on content count
        if (initialCount >= 12) {
            // If 12 or more contents are visible, Load More button should be visible
            await contentHome.verifyLoadMoreButtonVisible();
            
            // Click Load More button
            await contentHome.clickLoadMoreButton();
            await contentHome.wait("mediumWait");

            // Get updated content count and verify it increased
            const updatedCount = await contentHome.getContentCount();
            await contentHome.verifyContentCountIncreased(initialCount, updatedCount);
        } else {
            // If less than 12 contents, Load More button should not be visible
            await contentHome.verifyLoadMoreButtonNotVisible();
        }
    });
});
