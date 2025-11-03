import { test } from '../../customFixtures/expertusFixture';
import { FakerData } from '../../utils/fakerUtils';

test.describe('Edit Learner Group Tests - Complete Workflow with Date Validation', () => {
    test.describe.configure({ mode: "serial" });

    test('UC083: Create Group, Search, Edit and Update with Valid Till Date', async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Jagadish' },
            { type: 'TestCase', description: 'UC083 - Create Group, Search, Edit and Update with Valid Till Date' },
            { type: 'Test Description', description: 'Complete workflow: Create learner group, search for it, edit with valid till date (10 days from today), and update' }
        );

        // Generate unique group name
        const groupTitle = `TestGroup_${FakerData.getFirstName()}_${Date.now()}`;

        // Navigate to learner groups page
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Step 1: Create a new learner group
        console.log(`Creating new learner group: ${groupTitle}`);
        await learnerGroup.createCompleteGroup(groupTitle, true);
        console.log("Learner group created successfully");
        await learnerGroup.wait('mediumWait');
        
        // Step 2: Search for the created group
        console.log(`Searching for group: ${groupTitle}`);
        await learnerGroup.searchGroup(groupTitle);
        console.log("Group found in search results");
        await learnerGroup.wait('mediumWait');
        
        // Step 3: Click Edit link for the group
        console.log("Clicking Edit link for the group");
        await learnerGroup.clickEditLearner();
        console.log("Edit page opened successfully");
        await learnerGroup.wait('mediumWait');
        
        // Step 4: Set valid till date (10 days from today)
        console.log("Setting valid till date (10 days from today)");
        await learnerGroup.setValidTillDate();
        console.log("Valid till date set successfully");
        await learnerGroup.wait('minWait');
        
        // Step 5: Click Update button to save changes
        console.log("Clicking Update button to save changes");
        await learnerGroup.clickUpdateButton();
        console.log("Group updated successfully");
        await learnerGroup.wait('mediumWait');
        
        console.log("Test completed successfully - Group created, searched, edited with date, and updated");
    });

   
});