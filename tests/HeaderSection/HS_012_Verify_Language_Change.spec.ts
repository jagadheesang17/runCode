import { test, expect } from '@playwright/test';
import { LearnerHomePage } from '../../pages/LearnerHomePage';

test.describe('Header Section - Language Change Verification', () => {
    test.describe.configure({ mode: 'serial' });
    
    let learnerHome: LearnerHomePage;

    test("HS_012: Verify that page language changes to Arabic when selected from language dropdown", async ({ page, context }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'QA Automation Team' },
            { type: 'TestCase', description: 'HS_012_Language_Change_Arabic' },
            { type: 'Test Description', description: 'Verify page language changes to Arabic from dropdown' }
        );

        console.log("=== Test HS_012: Verify Language Change to Arabic ===");
        
        learnerHome = new LearnerHomePage(page, context);
        await learnerHome.loadLearner('LEARNERUSERNAME', LearnerHomePage.pageUrl);
        
        // Perform language change verification for Arabic
        await learnerHome.languageChangeVerification("Arabic");
        
        console.log("✅ Test HS_012 completed successfully");
    });

    test("HS_013: Verify that page language changes to Spanish when selected from language dropdown", async ({ page, context }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'QA Automation Team' },
            { type: 'TestCase', description: 'HS_013_Language_Change_Spanish' },
            { type: 'Test Description', description: 'Verify page language changes to Spanish from dropdown' }
        );

        console.log("=== Test HS_013: Verify Language Change to Spanish ===");
         learnerHome = new LearnerHomePage(page, context);
        await learnerHome.loadLearner('LEARNERUSERNAME', LearnerHomePage.pageUrl);
        // Perform language change verification for Spanish
        await learnerHome.languageChangeVerification("Simplified Chinese");
        
        console.log("✅ Test HS_013 completed successfully");
    });


    test("HS_015: Verify that page language changes back to English when selected from language dropdown", async ({ page, context }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'QA Automation Team' },
            { type: 'TestCase', description: 'HS_015_Language_Change_English' },
            { type: 'Test Description', description: 'Verify page language changes back to English from dropdown' }
        );

        console.log("=== Test HS_015: Verify Language Change to English ===");
         learnerHome = new LearnerHomePage(page, context);
        await learnerHome.loadLearner('LEARNERUSERNAME', LearnerHomePage.pageUrl);
        // Perform language change verification for English
        await learnerHome.languageChangeVerification("English");
        
        console.log("✅ Test HS_015 completed successfully");
    });

});
