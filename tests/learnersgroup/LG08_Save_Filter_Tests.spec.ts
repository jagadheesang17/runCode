import { test } from '../../customFixtures/expertusFixture';
import { FakerData } from '../../utils/fakerUtils';

test.describe('Save Filter Tests - Status Filter with Save Functionality', () => {
    test.describe.configure({ mode: "serial" });

    test('UC070: Filter by Active Status and Save Filter', async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Jagadish' },
            { type: 'TestCase', description: 'UC070 - Filter by Active Status and Save Filter' },
            { type: 'Test Description', description: 'Apply Active status filter and save it with a custom name' }
        );

        // Navigate to learner groups page
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Apply Active status filter
        console.log("Applying Active status filter");
        await learnerGroup.filterByActiveStatus();
        
        // Verify that Active filter is applied
        console.log("Active status filter applied successfully");
        await learnerGroup.wait('mediumWait');
        
        // Save the filter with a custom name
        const filterName = `Active_Filter_${FakerData.getFirstName()}_${Date.now()}`;
        console.log(`Saving filter with name: ${filterName}`);
        await learnerGroup.saveFilterWithName(filterName);
        
        console.log("Test completed successfully - Active filter applied and saved");
    });

    test('UC071: Filter by Suspended Status and Save Filter', async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Jagadish' },
            { type: 'TestCase', description: 'UC071 - Filter by Suspended Status and Save Filter' },
            { type: 'Test Description', description: 'Apply Suspended status filter and save it with a custom name' }
        );

        // Navigate to learner groups page
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Apply Suspended status filter
        console.log("Applying Suspended status filter");
        await learnerGroup.filterBySuspendedStatus();
        
        // Verify that Suspended filter is applied
        console.log("Suspended status filter applied successfully");
        await learnerGroup.wait('mediumWait');
        
        // Save the filter with a custom name
        const filterName = `Suspended_Filter_${FakerData.getFirstName()}_${Date.now()}`;
        console.log(`Saving filter with name: ${filterName}`);
        await learnerGroup.saveFilterWithName(filterName);
        
        console.log("Test completed successfully - Suspended filter applied and saved");
    });

    test('UC072: Filter by Draft Status and Save Filter', async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Jagadish' },
            { type: 'TestCase', description: 'UC072 - Filter by Draft Status and Save Filter' },
            { type: 'Test Description', description: 'Apply Draft status filter and save it with a custom name' }
        );

        // Navigate to learner groups page
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Apply Draft status filter
        console.log("Applying Draft status filter");
        await learnerGroup.filterByDraftStatus();
        
        // Verify that Draft filter is applied
        console.log("Draft status filter applied successfully");
        await learnerGroup.wait('mediumWait');
        
        // Save the filter with a custom name
        const filterName = `Draft_Filter_${FakerData.getFirstName()}_${Date.now()}`;
        console.log(`Saving filter with name: ${filterName}`);
        await learnerGroup.saveFilterWithName(filterName);
        
        console.log("Test completed successfully - Draft filter applied and saved");
    });


    test('UC074: Apply Multiple Filters and Save Combined Filter', async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Jagadish' },
            { type: 'TestCase', description: 'UC074 - Apply Multiple Filters and Save Combined Filter' },
            { type: 'Test Description', description: 'Apply both Active status and Department filters, then save as combined filter' }
        );

        // Navigate to learner groups page
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Apply Active status filter first
        console.log("Applying Active status filter");
        await learnerGroup.filterByActiveStatus();
        await learnerGroup.wait('mediumWait');
        
        // Then apply Department filter (this will combine with Active status)
        const departmentValue = "Benchmark ROI";
        console.log(`Adding Department filter: ${departmentValue}`);
        await learnerGroup.filterByDepartment(departmentValue);
        await learnerGroup.wait('mediumWait');
        
        // Verify both filters are applied
        console.log("Multiple filters applied successfully");
        
        // Save the combined filter with a custom name
        const filterName = `Combined_ActiveDept_Filter_${FakerData.getFirstName()}_${Date.now()}`;
        console.log(`Saving combined filter with name: ${filterName}`);
        await learnerGroup.saveFilterWithName(filterName);
        
        console.log("Test completed successfully - Combined filters applied and saved");
    });
});