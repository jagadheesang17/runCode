import { test } from '../../customFixtures/expertusFixture';
import { FakerData } from '../../utils/fakerUtils';

test.describe('Export Tests - Learner Group Export Functionality', () => {
    test.describe.configure({ mode: "serial" });

    test('UC080: Export Learner Group to Excel', async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Jagadish' },
            { type: 'TestCase', description: 'UC080 - Export Learner Group to Excel' },
            { type: 'Test Description', description: 'Search for specific group and export to Excel format, then verify the export' }
        );

        const groupName = "Alexandrea_TestGroup";

        // Navigate to learner groups page
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Export the specific group to Excel
        console.log(`Exporting group "${groupName}" to Excel format`);
        await learnerGroup.exportGroupToExcel(groupName);
        
        console.log("Excel export completed successfully");
        await learnerGroup.wait('mediumWait');
        
        console.log("Test completed successfully - Group exported to Excel and verified");
    });

    test('UC081: Export Learner Group to CSV', async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Jagadish' },
            { type: 'TestCase', description: 'UC081 - Export Learner Group to CSV' },
            { type: 'Test Description', description: 'Search for specific group and export to CSV format, then verify the export' }
        );

        const groupName = "Alexandrea_TestGroup";

        // Navigate to learner groups page
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Export the specific group to CSV
        console.log(`Exporting group "${groupName}" to CSV format`);
        await learnerGroup.exportGroupToCSV(groupName);
        
        console.log("CSV export completed successfully");
        await learnerGroup.wait('mediumWait');
        
        console.log("Test completed successfully - Group exported to CSV and verified");
    });

    test('UC082: Export Learner Group to Both Excel and CSV', async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Jagadish' },
            { type: 'TestCase', description: 'UC082 - Export Learner Group to Both Excel and CSV' },
            { type: 'Test Description', description: 'Search for specific group and export to both Excel and CSV formats sequentially' }
        );

        const groupName = "Alexandrea_TestGroup";

        // Navigate to learner groups page
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Export to Excel first
        console.log(`Exporting group "${groupName}" to Excel format`);
        await learnerGroup.exportGroupToExcel(groupName);
        console.log("Excel export completed");
        await learnerGroup.wait('mediumWait');
        
        // Export to CSV second
        console.log(`Exporting group "${groupName}" to CSV format`);
        await learnerGroup.exportGroupToCSV(groupName);
        console.log("CSV export completed");
        await learnerGroup.wait('mediumWait');
        
        console.log("Test completed successfully - Group exported to both Excel and CSV formats");
    });
});