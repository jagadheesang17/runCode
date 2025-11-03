import { URLConstants } from '../../constants/urlConstants';
import { test } from '../../customFixtures/expertusFixture';
import { readDataFromCSV } from '../../utils/csvUtil';
import { FakerData } from '../../utils/fakerUtils';

const groupName = FakerData.getFirstName() + "_TestGroup";
const groupToSuspend = FakerData.getFirstName() + "_SuspendGroup";
const groupToDelete = FakerData.getFirstName() + "_DeleteGroup";

test.describe(`Learner Group Management Tests`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Verify learner group creation functionality`, async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `LG001 - Verify learner group creation functionality` },
            { type: `Test Description`, description: `Create a new learner group with title and activate it` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();

        await learnerGroup.createCompleteGroup(groupName, true);
        
        console.log(`Successfully created learner group: ${groupName}`);
    });

    test(`Verify learner group suspension functionality`, async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `LG002 - Verify learner group suspension functionality` },
            { type: `Test Description`, description: `Create and suspend a learner group` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();

        await learnerGroup.createCompleteGroup(groupToSuspend, true);
        
        await learnerGroup.suspendGroup(groupToSuspend, 1);
        
        console.log(`Successfully suspended learner group: ${groupToSuspend}`);
    });

    test(`Verify learner group deletion functionality`, async ({ adminHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `LG003 - Verify learner group deletion functionality` },
            { type: `Test Description`, description: `Create and delete a learner group` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickLearnerGroupLink();

        await learnerGroup.createCompleteGroup(groupToDelete, true);
         await learnerGroup.suspendGroup(groupToDelete, 1);
        
        await learnerGroup.deleteGroup(groupToDelete, 1);
        
        console.log(`Successfully deleted learner group: ${groupToDelete}`);
    });
});
