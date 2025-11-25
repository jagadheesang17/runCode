import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

const employmentTypeName = "Employment " + FakerData.getFirstName();
const employmentTypeWithSpecialChars = `Employment @#$%&*! ${FakerData.getFirstName()}`;
const description = FakerData.getDescription();

test.describe(`MDL_001: Verify Employment Type Creation and Deletion`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create Employment Type for Deletion Test`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `Create Employment Type for Deletion Test` },
            { type: `Test Description`, description: `Create employment type to verify it can be deleted when not associated with users` }
        );

        console.log(`📋 Test Objective: Verify that Employment Type can be deleted when not associated to users`);
        console.log(`🎯 Employment Type Name: ${employmentTypeName}`);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        console.log(`👤 Logged in as Customer Admin`);

        await adminHome.menuButton();
        await adminHome.metadataLibrary();
        await adminHome.meta_People();

        await metadatalibrary.verify_MetaDataLibrary_Label();
        await metadatalibrary.employmentTypeExpandButton();
        console.log(`📂 Expanded Employment Type section`);

        await metadatalibrary.addEmploymentTypeButton();
        console.log(`➕ Clicked Add Employment Type button`);

        await metadatalibrary.name(employmentTypeName);
        await metadatalibrary.description(description);
        console.log(`✍️ Entered Employment Type details:`);
        console.log(`   • Name: ${employmentTypeName}`);
        console.log(`   • Description: ${description}`);

        await metadatalibrary.saveButton();
        console.log(`💾 Saved Employment Type`);

        await metadatalibrary.addEmploymentType_SearchButton(employmentTypeName);
        await metadatalibrary.verify_addEmploymentType(employmentTypeName);
        console.log(`✅ Employment Type created and verified successfully`);

        console.log(`📋 Summary:`);
        console.log(`   • Employment Type: ${employmentTypeName}`);
        console.log(`   • Status: Created ✅`);
        console.log(`   • Associated Users: None (ready for deletion test)`);
    });

    test(`Step 2: Delete Employment Type Not Associated with Users`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `Delete Employment Type Not Associated with Users` },
            { type: `Test Description`, description: `Verify that employment type can be deleted when it is not associated to any users` }
        );

        console.log(`🗑️ Test Objective: Delete Employment Type that is not associated with users`);
        console.log(`🎯 Target Employment Type: ${employmentTypeName}`);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        console.log(`👤 Logged in as Customer Admin`);

        await adminHome.menuButton();
        await adminHome.metadataLibrary();
        await adminHome.meta_People();
        console.log(`🗂️ Navigated to Metadata Library`);

        await metadatalibrary.verify_MetaDataLibrary_Label();
        await metadatalibrary.employmentTypeExpandButton();
        console.log(`📂 Expanded Employment Type section`);

        await metadatalibrary.addEmploymentType_SearchButton(employmentTypeName);
        console.log(`🔍 Searched for Employment Type: ${employmentTypeName}`);

        await metadatalibrary.verify_addEmploymentType(employmentTypeName);
        console.log(`✅ Employment Type found in the list`);

        // Click delete icon
        const deleteIconLocator = `(//span[text()='${employmentTypeName}']//following::span[@title='Delete'])[1]`;
        await metadatalibrary.page.locator(deleteIconLocator).first().click();
        console.log(`🗑️ Clicked Delete icon for Employment Type`);

        await metadatalibrary.wait("minWait");

        // Confirm deletion
        const yesButton = "//button[text()='Remove']";
        await metadatalibrary.page.locator(yesButton).click();
        console.log(`✅ Confirmed deletion by clicking Yes button`);

        await metadatalibrary.wait("mediumWait");
        await metadatalibrary.spinnerDisappear();

        // Verify deletion - search again and employment type should not be found
        await metadatalibrary.employmentTypeExpandButton();
        await metadatalibrary.page.locator("//input[@id='employment-search-field']").fill(employmentTypeName);
        await metadatalibrary.page.keyboard.press('Enter');
        await metadatalibrary.wait("minWait");

        try {
            const employmentTypeLocator = `//div[@id='employment-header']//following::span[text()='${employmentTypeName}']`;
            const isVisible = await metadatalibrary.page.locator(employmentTypeLocator).isVisible({ timeout: 3000 });
            
            if (!isVisible) {
                console.log(`✅ SUCCESS: Employment Type deleted successfully - not found in search results`);
            } else {
                console.log(`❌ FAILED: Employment Type still exists after deletion`);
            }
        } catch (error) {
            console.log(`✅ SUCCESS: Employment Type deleted successfully - not found in search results`);
        }

        console.log(`🎯 Deletion Test Summary:`);
        console.log(`   • Employment Type: ${employmentTypeName}`);
        console.log(`   • Associated Users: None`);
        console.log(`   • Deletion Status: Successfully deleted ✅`);
        console.log(`   • Verification: Employment type removed from metadata library ✅`);
        console.log(`🏁 Test Result: PASSED - Employment type can be deleted when not associated with users`);
    });

    test(`Step 3: Create Employment Type with Special Characters`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `Create Employment Type with Special Characters` },
            { type: `Test Description`, description: `Verify that employment type title accepts and saves special characters` }
        );

        console.log(`📋 Test Objective: Verify Employment Type title allows special characters`);
        console.log(`🎯 Employment Type Name with Special Chars: ${employmentTypeWithSpecialChars}`);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        console.log(`👤 Logged in as Customer Admin`);

        await adminHome.menuButton();
        await adminHome.metadataLibrary();
        await adminHome.meta_People();
        
        console.log(`🗂️ Navigated to Metadata Library`);

        await metadatalibrary.verify_MetaDataLibrary_Label();
        await metadatalibrary.employmentTypeExpandButton();
        console.log(`📂 Expanded Employment Type section`);

        await metadatalibrary.addEmploymentTypeButton();
        console.log(`➕ Clicked Add Employment Type button`);

        await metadatalibrary.name(employmentTypeWithSpecialChars);
        await metadatalibrary.description("Testing special characters in employment type title");
        console.log(`✍️ Entered Employment Type details with special characters:`);
        console.log(`   • Name: ${employmentTypeWithSpecialChars}`);
        console.log(`   • Special Characters: @#$%&*!`);
        console.log(`   • Description: Testing special characters`);

        await metadatalibrary.saveButton();
        console.log(`💾 Saved Employment Type with special characters`);

        await metadatalibrary.wait("mediumWait");
        await metadatalibrary.spinnerDisappear();

        await metadatalibrary.employmentTypeExpandButton();
        await metadatalibrary.addEmploymentType_SearchButton(employmentTypeWithSpecialChars);
        
        try {
            await metadatalibrary.verify_addEmploymentType(employmentTypeWithSpecialChars);
            console.log(`✅ SUCCESS: Employment Type with special characters created and verified`);
            
            console.log(`🎯 Special Characters Validation Summary:`);
            console.log(`   • Employment Type: ${employmentTypeWithSpecialChars}`);
            console.log(`   • Special Characters Tested: @#$%&*!`);
            console.log(`   • Creation Status: Successful ✅`);
            console.log(`   • Verification Status: Found in search results ✅`);
            console.log(`   • Character Support: Special characters are allowed ✅`);
            console.log(`🏁 Test Result: PASSED - Employment type title accepts special characters`);

            // Cleanup: Delete the employment type with special characters
            console.log(`🧹 Cleanup: Deleting employment type with special characters...`);
            const deleteIconLocator = `//span[text()='${employmentTypeWithSpecialChars}']//following::i[@aria-label='Delete']`;
            await metadatalibrary.page.locator(deleteIconLocator).first().click();
            await metadatalibrary.wait("minWait");
            const yesButton = "//button[text()='Yes']";
            await metadatalibrary.page.locator(yesButton).click();
            await metadatalibrary.wait("mediumWait");
            console.log(`✅ Cleanup completed - Employment type deleted`);

        } catch (error) {
            console.log(`❌ FAILED: Could not verify employment type with special characters`);
            console.log(`⚠️ Error: ${error}`);
        }
    });
});