import { test } from "../../../customFixtures/expertusFixture";
import { AdminGroupManager } from "../../../utils/adminGroupManager";
import { AdminRoleManager } from "../../../utils/adminRoleManager";

test.describe(`AG011 - System Default Admin Group Restrictions & Policy Validation`, async () => {
    test.describe.configure({ mode: 'serial' })

    let systemDefaultGroup: any;

    test.beforeAll(async () => {
        systemDefaultGroup = await AdminGroupManager.getGroupDataByType("system_default");
    });

    test(`Verify whether it does not allow to suspend a default admin Group`, async ({ adminHome, adminGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `Verify Default Admin Group Suspend Restriction` },
            { type: `Test Description`, description: `Verify that default admin groups cannot be suspended - suspend button should be disabled` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.adminGroup();

        // Use system_default group name from JSON data
        await adminGroup.searchAdmin(systemDefaultGroup.groupTitle);
        await adminGroup.clickGroup(systemDefaultGroup.groupTitle);
        await adminGroup.verifySuspendButtonDisabled();
        console.log(`Default admin group suspension restriction validated for: ${systemDefaultGroup.groupTitle}`);
    });

    test(`Verify whether we cannot delete the Default Admin Groups`, async ({ adminHome, adminGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `Verify Default Admin Group Delete Restriction` },
            { type: `Test Description`, description: `Verify that default admin groups cannot be deleted - delete button should be disabled` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.adminGroup();

        // Use system_default group name from JSON data
        await adminGroup.searchAdmin(systemDefaultGroup.groupTitle);
        await adminGroup.clickGroup(systemDefaultGroup.groupTitle);
        await adminGroup.verifyDeleteButtonDisabled();

        console.log(`Default admin group delete restriction validated for: ${systemDefaultGroup.groupTitle}`);
    });


});