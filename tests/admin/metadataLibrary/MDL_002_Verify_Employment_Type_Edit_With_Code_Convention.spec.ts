import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

const employmentTypeName = "Employment " + FakerData.getFirstName();
const updatedEmploymentTypeName = "Updated " + FakerData.getFirstName();
const description = FakerData.getDescription();
const updatedDescription = "Updated " + FakerData.getDescription();

test.describe(`MDL_002: Verify Employment Type Edit Privileges with Code Convention`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create Employment Type for Edit Test`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `Create Employment Type for Edit Test` },
            { type: `Test Description`, description: `Create employment type to verify admin can edit name and description` }
        );

        console.log(`📋 Test Objective: Create Employment Type for edit privilege testing`);
        console.log(`🎯 Employment Type Name: ${employmentTypeName}`);

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

        await metadatalibrary.name(employmentTypeName);
        await metadatalibrary.description(description);
        console.log(`✍️ Entered Employment Type details:`);
        console.log(`   • Name: ${employmentTypeName}`);
        console.log(`   • Description: ${description}`);

        await metadatalibrary.saveButton();
        console.log(`💾 Saved Employment Type`);

        await metadatalibrary.wait("mediumWait");
        await metadatalibrary.spinnerDisappear();

        await metadatalibrary.employmentTypeExpandButton();
        await metadatalibrary.addEmploymentType_SearchButton(employmentTypeName);
        await metadatalibrary.verify_addEmploymentType(employmentTypeName);
        console.log(`✅ Employment Type created and verified successfully`);

        console.log(`📋 Summary:`);
        console.log(`   • Employment Type: ${employmentTypeName}`);
        console.log(`   • Description: ${description}`);
        console.log(`   • Status: Created ✅`);
    });

    test(`Step 2: Verify Admin Has Privilege to Edit Employment Type`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `Verify Admin Edit Privileges for Employment Type` },
            { type: `Test Description`, description: `Verify admin can edit name and description but code field is disabled when code convention is enabled` }
        );

        console.log(`📋 Test Objective: Verify admin edit privileges for Employment Type with code convention validation`);
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

        // Click Edit button
        const editButtonLocator = "(//span[@title='Edit'])[1]";
        await metadatalibrary.page.locator(editButtonLocator).click();
        console.log(`✏️ Clicked Edit button for Employment Type`);

        await metadatalibrary.wait("mediumWait");
        await metadatalibrary.spinnerDisappear();

        // Verify code field is NOT editable (readonly) when code convention is enabled
        console.log(`\n🔍 Validating Code Convention Enforcement...`);
        const codeFieldLocator = "input#data_code[name='data_code']";
        
        // Check if code field exists
        const codeFieldExists = await metadatalibrary.page.locator(codeFieldLocator).count();
        
        if (codeFieldExists === 0) {
            console.log(`⚠️ Code field not found - cannot validate code convention`);
            throw new Error("Code field not found on the edit form");
        }

        // Check if code field is readonly
        const isReadonly = await metadatalibrary.page.locator(codeFieldLocator).getAttribute('readonly');
        const hasDisabledClass = await metadatalibrary.page.locator(codeFieldLocator).getAttribute('class');
        const isPeNone = hasDisabledClass?.includes('pe-none');
        const isFormFieldDeactivated = hasDisabledClass?.includes('form_field_deactived');

        console.log(`\n📊 Code Field Validation Results:`);
        console.log(`   • Readonly attribute: ${isReadonly !== null ? '✅ Yes' : '❌ No'}`);
        console.log(`   • Class 'pe-none': ${isPeNone ? '✅ Present' : '❌ Missing'}`);
        console.log(`   • Class 'form_field_deactived': ${isFormFieldDeactivated ? '✅ Present' : '❌ Missing'}`);

        // Verify code field is NOT editable
        if (isReadonly === null || !isPeNone || !isFormFieldDeactivated) {
            console.log(`\n❌ FAILED: Code field is editable when code convention is enabled!`);
            console.log(`⚠️ ERROR: Code field should be readonly when code convention is enabled`);
            console.log(`📋 Field Details:`);
            console.log(`   • Readonly: ${isReadonly}`);
            console.log(`   • Classes: ${hasDisabledClass}`);
            throw new Error("Code field is editable when it should be readonly due to code convention being enabled");
        } else {
            console.log(`\n✅ SUCCESS: Code field is properly readonly (code convention enforced)`);
        }

        // Verify Name field IS editable
        console.log(`\n🔍 Validating Name Field Editability...`);
        const nameFieldLocator = "input#data_name[name='data_name']";
        const nameFieldReadonly = await metadatalibrary.page.locator(nameFieldLocator).getAttribute('readonly');
        
        if (nameFieldReadonly !== null) {
            console.log(`❌ FAILED: Name field is readonly but should be editable`);
            throw new Error("Name field is readonly when it should be editable");
        } else {
            console.log(`✅ Name field is editable`);
        }

        // Edit the Name field
        await metadatalibrary.page.locator(nameFieldLocator).clear();
        await metadatalibrary.page.locator(nameFieldLocator).fill(updatedEmploymentTypeName);
        console.log(`✏️ Updated Name: ${employmentTypeName} → ${updatedEmploymentTypeName}`);

        // Verify Description field IS editable
        console.log(`\n🔍 Validating Description Field Editability...`);
        // Rich text editor - target the contenteditable element inside the wrapper
        const descriptionEditorLocator = "(//div[contains(@id,'data_description-employment')])[1]//p";
        const descriptionEditorExists = await metadatalibrary.page.locator(descriptionEditorLocator).count();
        
        if (descriptionEditorExists === 0) {
            console.log(`❌ FAILED: Description editor field not found`);
            throw new Error("Description editor field not found");
        } else {
            console.log(`✅ Description field is editable`);
        }

        // Edit the Description field (Rich text editor)
        await metadatalibrary.page.locator(descriptionEditorLocator).click();
        await metadatalibrary.page.locator(descriptionEditorLocator).clear();
        await metadatalibrary.page.locator(descriptionEditorLocator).fill(updatedDescription);
        console.log(`✏️ Updated Description: ${description.substring(0, 30)}... → ${updatedDescription.substring(0, 30)}...`);

        // Save the changes
        await metadatalibrary.saveButton();
        console.log(`💾 Saved Employment Type changes`);

        await metadatalibrary.wait("mediumWait");
        await metadatalibrary.spinnerDisappear();

        // Verify the updated name appears in the list
        await metadatalibrary.employmentTypeExpandButton();
        await metadatalibrary.addEmploymentType_SearchButton(updatedEmploymentTypeName);
        
        try {
            await metadatalibrary.verify_addEmploymentType(updatedEmploymentTypeName);
            console.log(`\n✅ Updated Employment Type found in search results`);
        } catch (error) {
            console.log(`\n❌ FAILED: Updated Employment Type not found in search results`);
            throw error;
        }

        console.log(`\n🎯 Edit Privilege Test Summary:`);
        console.log(`   ✅ Admin has privilege to edit Employment Type`);
        console.log(`   ✅ Name field: Editable (Changed successfully)`);
        console.log(`   ✅ Description field: Editable (Changed successfully)`);
        console.log(`   ✅ Code field: NOT Editable (Code convention enforced)`);
        console.log(`   • Original Name: ${employmentTypeName}`);
        console.log(`   • Updated Name: ${updatedEmploymentTypeName}`);
        console.log(`   • Code Convention Status: Enabled and enforced ✅`);
        console.log(`🏁 Test Result: PASSED - Admin can edit name/description but code is protected by code convention`);
    });

    test(`Step 3: Cleanup - Delete Updated Employment Type`, async ({ adminHome, metadatalibrary }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation` },
            { type: `TestCase`, description: `Cleanup Updated Employment Type` },
            { type: `Test Description`, description: `Delete the updated employment type created during testing` }
        );

        console.log(`🧹 Test Objective: Cleanup - Delete updated Employment Type`);
        console.log(`🎯 Target Employment Type: ${updatedEmploymentTypeName}`);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        console.log(`👤 Logged in as Customer Admin`);

        await adminHome.menuButton();
        await adminHome.metadataLibrary();
        await adminHome.meta_People();
        console.log(`🗂️ Navigated to Metadata Library`);

        await metadatalibrary.verify_MetaDataLibrary_Label();
        await metadatalibrary.employmentTypeExpandButton();
        console.log(`📂 Expanded Employment Type section`);

        await metadatalibrary.addEmploymentType_SearchButton(updatedEmploymentTypeName);
        console.log(`🔍 Searched for Employment Type: ${updatedEmploymentTypeName}`);

        await metadatalibrary.verify_addEmploymentType(updatedEmploymentTypeName);
        console.log(`✅ Employment Type found in the list`);

        // Click delete icon
        const deleteIconLocator = `//span[text()='${updatedEmploymentTypeName}']//following::i[@aria-label='Delete']`;
        await metadatalibrary.page.locator(deleteIconLocator).first().click();
        console.log(`🗑️ Clicked Delete icon for Employment Type`);

        await metadatalibrary.wait("minWait");

        // Confirm deletion
        const yesButton = "//button[text()='Yes']";
        await metadatalibrary.page.locator(yesButton).click();
        console.log(`✅ Confirmed deletion by clicking Yes button`);

        await metadatalibrary.wait("mediumWait");
        await metadatalibrary.spinnerDisappear();

        console.log(`✅ Employment Type deleted successfully`);
        console.log(`🏁 Cleanup completed`);
    });
});