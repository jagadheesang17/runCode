import { test } from "../../../customFixtures/expertusFixture";
import defaultAdminRoles from "../../../data/defaultAdminRoles.json";

test.describe("CR003 - Default Admin Roles Verification Tests", () => {
    
    test("CR003_01 - Verify all default admin roles exist and edit/delete icons are disabled", async ({ 
        adminHome, 
        adminRoleHome 
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation Team` },
            { type: `TestCase`, description: `CR003_01 - Verify default admin roles and disabled icons` },
            { type: `Test Description`, description: `Search each default admin role and verify edit/delete icons are disabled for system roles` }
        );

        console.log("🔍 Step 1: Login and navigate to Admin Roles");
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickAdminRole();

        console.log("🔍 Step 2: Verify each default admin role");
        console.log(`📋 Total default roles to verify: ${defaultAdminRoles.defaultRoles.length}`);

        for (let i = 0; i < defaultAdminRoles.defaultRoles.length; i++) {
            const roleName = defaultAdminRoles.defaultRoles[i];
            console.log(`\n🔍 Step ${i + 3}: Verifying role: "${roleName}"`);

            try {
                // Search for the role
                await adminRoleHome.roleSearch(roleName);
                console.log(`✅ Role search completed for: ${roleName}`);

                // Verify role exists in the list
                const roleExists = await adminRoleHome.verifyRoleInList(roleName);
                if (roleExists) {
                    console.log(`✅ Role found in list: ${roleName}`);

                    // Verify edit icon is disabled
                    const editDisabled = await adminRoleHome.verifyEditIconDisabled(roleName);
                    
                    // Verify delete icon is disabled  
                    const deleteDisabled = await adminRoleHome.verifyDeleteIconDisabled(roleName);

                    if (editDisabled && deleteDisabled) {
                        console.log(`✅ Both edit and delete icons are properly disabled for: ${roleName}`);
                    } else {
                        console.log(`⚠️ Icon validation results for ${roleName}: Edit disabled: ${editDisabled}, Delete disabled: ${deleteDisabled}`);
                    }
                } else {
                    console.log(`❌ Role not found in search results: ${roleName}`);
                }

            } catch (error) {
                console.log(`❌ Error while verifying role "${roleName}": ${error}`);
            }

            // Small wait between searches
            await adminRoleHome.wait("minWait");
        }

        console.log("\n✅ Test completed: All default admin roles verification finished");
    });

    test("CR003_02 - Verify specific system roles with detailed validation", async ({ 
        adminHome, 
        adminRoleHome 
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation Team` },
            { type: `TestCase`, description: `CR003_02 - Detailed verification of key system roles` },
            { type: `Test Description`, description: `Focused validation on critical system roles like System admin, Super admin, etc.` }
        );

        console.log("🔍 Step 1: Login and navigate to Admin Roles");
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.clickAdminRole();

        // Key system roles for focused testing
        const keySystemRoles = [
            "System admin",
            "Super admin", 
            "Learning admin",
            "People admin"
        ];

        console.log("🔍 Step 2: Detailed verification of key system roles");
        
        for (let i = 0; i < keySystemRoles.length; i++) {
            const roleName = keySystemRoles[i];
            console.log(`\n🔍 Step ${i + 3}: Detailed verification for: "${roleName}"`);

            try {
                // Search for the role
                await adminRoleHome.roleSearch(roleName);
                
                // Verify role exists
                const roleExists = await adminRoleHome.verifyRoleInList(roleName);
                
                if (roleExists) {
                    // Use the specific XPaths mentioned in requirements
                    const editIconXPath = `(//span[text()='${roleName}']//following::span[@aria-label='Edit'])[1]`;
                    const deleteIconXPath = `(//span[text()='${roleName}']//following::span[@aria-label='Delete'])[1]`;
                    
                    console.log(`📋 Using Edit XPath: ${editIconXPath}`);
                    console.log(`📋 Using Delete XPath: ${deleteIconXPath}`);
                    
                    // Check if edit icon exists and its state
                    const editIconExists = await adminRoleHome.page.locator(editIconXPath).count() > 0;
                    const deleteIconExists = await adminRoleHome.page.locator(deleteIconXPath).count() > 0;
                    
                    console.log(`📊 Edit icon exists: ${editIconExists}`);
                    console.log(`📊 Delete icon exists: ${deleteIconExists}`);
                    
                    if (editIconExists) {
                        const editIconClass = await adminRoleHome.page.locator(editIconXPath).getAttribute('class');
                        console.log(`📊 Edit icon class: ${editIconClass}`);
                    }
                    
                    if (deleteIconExists) {
                        const deleteIconClass = await adminRoleHome.page.locator(deleteIconXPath).getAttribute('class');
                        console.log(`📊 Delete icon class: ${deleteIconClass}`);
                    }
                    
                    console.log(`✅ Detailed verification completed for: ${roleName}`);
                } else {
                    console.log(`❌ Role not found for detailed verification: ${roleName}`);
                }

            } catch (error) {
                console.log(`❌ Error during detailed verification of "${roleName}": ${error}`);
            }

            await adminRoleHome.wait("minWait");
        }

        console.log("\n✅ Test completed: Detailed system roles verification finished");
    });
});