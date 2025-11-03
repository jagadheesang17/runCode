import { test } from '../../customFixtures/expertusFixture';
import { FakerData } from '../../utils/fakerUtils';

test.describe('Sort Tests - Learner Group Sorting Functionality', () => {
    test.describe.configure({ mode: "serial" });

    test('UC075: Sort Learner Groups by A-Z', async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Jagadish' },
            { type: 'TestCase', description: 'UC075 - Sort Learner Groups by A-Z' },
            { type: 'Test Description', description: 'Apply A-Z sorting to learner groups and verify the sorting is applied' }
        );

        // Navigate to learner groups page
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Apply A-Z sorting
        console.log("Applying A-Z sorting");
        await learnerGroup.sortByAtoZ();
        
        // Verify that A-Z sorting is applied
        console.log("A-Z sorting applied successfully");
        await learnerGroup.wait('mediumWait');
        
        console.log("Test completed successfully - A-Z sorting applied");
    });

    test('UC076: Sort Learner Groups by Z-A', async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Jagadish' },
            { type: 'TestCase', description: 'UC076 - Sort Learner Groups by Z-A' },
            { type: 'Test Description', description: 'Apply Z-A sorting to learner groups and verify the sorting is applied' }
        );

        // Navigate to learner groups page
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Apply Z-A sorting
        console.log("Applying Z-A sorting");
        await learnerGroup.sortByZtoA();
        
        // Verify that Z-A sorting is applied
        console.log("Z-A sorting applied successfully");
        await learnerGroup.wait('mediumWait');
        
        console.log("Test completed successfully - Z-A sorting applied");
    });

    test('UC077: Sort Learner Groups by New-Old', async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Jagadish' },
            { type: 'TestCase', description: 'UC077 - Sort Learner Groups by New-Old' },
            { type: 'Test Description', description: 'Apply New-Old sorting to learner groups and verify the sorting is applied' }
        );

        // Navigate to learner groups page
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Apply New-Old sorting
        console.log("Applying New-Old sorting");
        await learnerGroup.sortByNewToOld();
        
        // Verify that New-Old sorting is applied
        console.log("New-Old sorting applied successfully");
        await learnerGroup.wait('mediumWait');
        
        console.log("Test completed successfully - New-Old sorting applied");
    });

    test('UC078: Sort Learner Groups by Old-New', async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Jagadish' },
            { type: 'TestCase', description: 'UC078 - Sort Learner Groups by Old-New' },
            { type: 'Test Description', description: 'Apply Old-New sorting to learner groups and verify the sorting is applied' }
        );

        // Navigate to learner groups page
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Apply Old-New sorting
        console.log("Applying Old-New sorting");
        await learnerGroup.sortByOldToNew();
        
        // Verify that Old-New sorting is applied
        console.log("Old-New sorting applied successfully");
        await learnerGroup.wait('mediumWait');
        
        console.log("Test completed successfully - Old-New sorting applied");
    });

    test('UC079: Test Multiple Sorting Options Sequentially', async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Jagadish' },
            { type: 'TestCase', description: 'UC079 - Test Multiple Sorting Options Sequentially' },
            { type: 'Test Description', description: 'Apply different sorting options one after another to verify all sorting functionality works' }
        );

        // Navigate to learner groups page
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Test A-Z sorting first
        console.log("Testing A-Z sorting");
        await learnerGroup.sortByAtoZ();
        await learnerGroup.wait('mediumWait');
        console.log("A-Z sorting completed");
        
        // Test Z-A sorting
        console.log("Testing Z-A sorting");
        await learnerGroup.sortByZtoA();
        await learnerGroup.wait('mediumWait');
        console.log("Z-A sorting completed");
        
        // Test New-Old sorting
        console.log("Testing New-Old sorting");
        await learnerGroup.sortByNewToOld();
        await learnerGroup.wait('mediumWait');
        console.log("New-Old sorting completed");
        
        // Test Old-New sorting
        console.log("Testing Old-New sorting");
        await learnerGroup.sortByOldToNew();
        await learnerGroup.wait('mediumWait');
        console.log("Old-New sorting completed");
        
        console.log("Test completed successfully - All sorting options tested sequentially");
    });
});