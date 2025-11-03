import { test } from '../../customFixtures/expertusFixture';

test.describe(`Status Filter Tests for Learner Groups`, () => {

    test(`UC040 - Filter learner groups by Active status`, async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC040 - Filter by Active Status` },
            { type: `Test Description`, description: `Filter learner groups by Active status and verify the filter is applied correctly` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Filter by Active status
        await learnerGroup.filterByActiveStatus();
        
        console.log("✅ Successfully filtered learner groups by Active status");
    });

    test(`UC041 - Filter learner groups by Suspended status`, async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC041 - Filter by Suspended Status` },
            { type: `Test Description`, description: `Filter learner groups by Suspended status and verify the filter is applied correctly` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Filter by Suspended status
        await learnerGroup.filterBySuspendedStatus();
        
        console.log("✅ Successfully filtered learner groups by Suspended status");
    });

    test(`UC042 - Filter learner groups by Draft status`, async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC042 - Filter by Draft Status` },
            { type: `Test Description`, description: `Filter learner groups by Draft status and verify the filter is applied correctly` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Filter by Draft status
        await learnerGroup.filterByDraftStatus();
        
        console.log("✅ Successfully filtered learner groups by Draft status");
    });

    test(`UC043 - Test all status filters sequentially`, async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `UC043 - Sequential Status Filter Testing` },
            { type: `Test Description`, description: `Test all status filters one by one to ensure X mark clearing works correctly` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();
        
        // Test Active filter
        console.log("Testing Active filter...");
        await learnerGroup.filterByActiveStatus();
        
        // Test Suspended filter (should clear Active first)
        console.log("Testing Suspended filter...");
        await learnerGroup.filterBySuspendedStatus();
        
        // Test Draft filter (should clear Suspended first)
        console.log("Testing Draft filter...");
        await learnerGroup.filterByDraftStatus();
        
        // Test Active again (should clear Draft first)
        console.log("Testing Active filter again...");
        await learnerGroup.filterByActiveStatus();
        
        console.log("✅ Successfully tested all status filters with automatic X mark clearing");
    });

});