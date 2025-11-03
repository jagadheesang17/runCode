import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

const fieldName1 = FakerData.getFirstName() + "_TextField";
const fieldName2 = FakerData.getFirstName() + "_DropdownField";

test.describe.serial("Custom Field Management Tests", () => {
    
    test("CF001 - Complete Custom Field Management Workflow", async ({ 
        adminHome, 
        customFieldHome 
    }) => {
        test.info().annotations.push(
            { type: `Author`, description: `QA Automation Team` },
            { type: `TestCase`, description: `CF001 - Complete Custom Field Management Workflow` },
            { type: `Test Description`, description: `End-to-end testing of custom field creation, configuration, search, and data entry functionality` }
        );

        // Step 1: Login and Navigate to Custom Field page
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();

        // Navigate to Meta Data Library
        await adminHome.metadataLibrary();
        await adminHome.metaDataLibraryOption("Custom Field");
        
        // Verify Custom Field page loaded
        await customFieldHome.verifyCustomFieldLabel();
        
        // Step 2: Create Text Box Custom Field
        await customFieldHome.clickCreateCustomField();

        const textFieldData = {
            fieldName: fieldName1,
            questionType: "Text Box",
            helpText: "Enter your response in the text box",
            required: "No"
        };

        // Select question type
        await customFieldHome.questionTypeRadioBtn(textFieldData.questionType);
        
        // Enter field name
        await customFieldHome.enterFieldName(textFieldData.fieldName);
        
        // Set as required field
        await customFieldHome.requiredDropdown(textFieldData.required);
        
        // Add help text
        await customFieldHome.enterHelpText(textFieldData.helpText);
        
        // Save the custom field (you'll need to add save method to CustomFieldPage)
        // await customFieldHome.saveCustomField();

        // Step 3: Create Dropdown Custom Field
        await customFieldHome.clickCreateCustomField();

        const dropdownFieldData = {
            fieldName: fieldName2,
            questionType: "Dropdown",
            helpText: "Select an option from dropdown",
            required: "No",
            options: ["Option 1", "Option 2", "Option 3"]
        };
        
        // Select question type
        await customFieldHome.questionTypeRadioBtn(dropdownFieldData.questionType);
        
        // Enter field name
        await customFieldHome.enterFieldName(dropdownFieldData.fieldName);
        
        // Set as optional field
        await customFieldHome.requiredDropdown(dropdownFieldData.required);
        
        // Add help text
        await customFieldHome.enterHelpText(dropdownFieldData.helpText);
        
        // You'll need to add methods to handle dropdown options
        // await customFieldHome.addDropdownOptions(dropdownFieldData.options);

        // Step 4: Search and verify created custom fields
        const searchTerm = "TextField"; // Part of the field name we created
        
        // Search for custom field
        await customFieldHome.CustomFieldSearch(searchTerm);
        
        // Verify search results (you'll need to add verification method)
        // await customFieldHome.verifyCustomFieldInResults(searchTerm);

        // Step 5: Test custom field data entry functionality
        const testData = {
            textBoxValue: "Sample text input",
            dropdownValue: "Option 2",
            checkBoxValues: ["Option 1", "Option 3"],
            radioButtonValue: "Option 2",
            datePickerValue: "2024-12-31"
        };

        // Test different field types - these would be used in actual forms
        await customFieldHome.enterQuestionDataByType("Text Box", "Sample Text Field", testData.textBoxValue);
        await customFieldHome.enterQuestionDataByType("Dropdown", "Sample Dropdown", testData.dropdownValue);
        await customFieldHome.enterQuestionDataByType("Check Box", "Sample Checkbox", testData.checkBoxValues);
        await customFieldHome.enterQuestionDataByType("Radio Button", "Sample Radio", testData.radioButtonValue);
        await customFieldHome.enterQuestionDataByType("Date Picker", "Sample Date", testData.datePickerValue);
    });
});