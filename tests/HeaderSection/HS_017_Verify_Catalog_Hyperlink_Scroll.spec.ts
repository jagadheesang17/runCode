import { test, expect } from '@playwright/test';
import { LearnerHomePage } from '../../pages/LearnerHomePage';

test.describe('Header Section - Catalog Hyperlink Scroll Verification', () => {
    
    let learnerHome: LearnerHomePage;

    test("HS_017: Verify that page scrolls to catalog section when CATALOG hyperlink is clicked from empty cart", async ({ page, context }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'QA Automation Team' },
            { type: 'TestCase', description: 'HS_017_Catalog_Hyperlink_Scroll' },
            { type: 'Test Description', description: 'Click on cart, then click CATALOG hyperlink and verify page scrolls to catalog section' }
        );

        console.log("=== Test HS_017: Verify Catalog Hyperlink Scroll from Empty Cart ===");
        
        learnerHome = new LearnerHomePage(page, context);
        await learnerHome.loadLearner('LEARNERUSERNAME', LearnerHomePage.pageUrl);
        
        // Step 1: Click on empty cart to open cart popup
        console.log("📝 Step 1: Open empty cart");
        await learnerHome.emptyCartVerification();
        
        // Step 2: Click on CATALOG hyperlink and verify scroll
        console.log("📝 Step 2: Click CATALOG hyperlink and verify scroll");
        await learnerHome.catalogHyperlink();
        
        console.log("✅ Test HS_017 completed successfully");
    });

});
