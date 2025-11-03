// Example usage of ExportPage in other modules

import { test } from "../customFixtures/expertusFixture";

test.describe('Example of ExportPage usage in other modules', () => {
    
    test('Example 1: Using ExportPage directly for any export functionality', async ({ exportPage }) => {
        // Direct usage of ExportPage for any module that needs export functionality
        
        // Step 1: Export file (works with any page that has export functionality)
        await exportPage.clickExportAs("CSV");
        
        // Step 2: Validate exported file with JSON comparison (for complex validation)
        await exportPage.validateExported("CSV");
        
        console.log("✅ Export and validation completed successfully!");
    });

    test('Example 2: Using ExportPage for simple username validation', async ({ exportPage }) => {
        // Step 1: Export file
        await exportPage.clickExportAs("Excel");
        
        // Step 2: Check if specific usernames exist in exported file
        const usernamesToCheck = ["user1", "user2", "testuser"];
        await exportPage.validateUsernamesInExport("Excel", usernamesToCheck);
        
        console.log("✅ Username validation completed successfully!");
    });

    test('Example 3: Using via AdminGroupPage (backward compatibility)', async ({ adminGroup }) => {
        // AdminGroupPage still works the same way - delegates to ExportPage internally
        
        await adminGroup.clickExportAs("CSV");
        await adminGroup.validateExported("CSV");
        
        console.log("✅ AdminGroupPage export still works (uses ExportPage internally)!");
    });
});