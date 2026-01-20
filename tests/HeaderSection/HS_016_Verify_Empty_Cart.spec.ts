import { test, expect } from '@playwright/test';
import { LearnerHomePage } from '../../pages/LearnerHomePage';

test.describe('Header Section - Empty Cart Verification', () => {
    
    let learnerHome: LearnerHomePage;

    test("HS_016: Verify that empty cart message is displayed when shopping cart is empty", async ({ page, context }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'QA Automation Team' },
            { type: 'TestCase', description: 'HS_016_Empty_Cart_Verification' },
            { type: 'Test Description', description: 'Verify empty cart message displays when cart icon is clicked and cart is empty' }
        );

        console.log("=== Test HS_016: Verify Empty Cart Message ===");
        
        learnerHome = new LearnerHomePage(page, context);
        await learnerHome.loadLearner('LEARNERUSERNAME', LearnerHomePage.pageUrl);
        
        // Perform empty cart verification
        await learnerHome.emptyCartVerification();
        
        console.log("✅ Test HS_016 completed successfully");
    });

});
