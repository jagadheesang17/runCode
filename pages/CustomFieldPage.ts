import { AdminHomePage } from "./AdminHomePage";
import { BrowserContext, expect, Page } from "@playwright/test";
import fs from 'fs'
import path from "path";
import { filePath } from "../data/MetadataLibraryData/filePathEnv";


export class CustomFieldPage extends AdminHomePage {

    public selectors = {
        ...this.selectors,
        customFieldLabel: `//h1[text()='Custom Field']`,
        createCustomField: `//button[text()='CREATE CUSTOM FIELD']`,
        newCustomField: (data: string) => `//span[text()='${data}']`,
        customFiledSearchOption: `//input[@id='exp-search-field']`,
        questionTypeRadioBtn: (data: string) => `(//span[text()='${data}']//preceding-sibling::i[contains(@class,'fa-circle')])[1]`,
        fieldName: `(//label[text()='Field Name']//following::input)[1]`,
        requireDropdown: `//button[@data-id='cfmandatory']`,
        displayOptionsDropdown: `//button[@data-id='cfdisplayoptions']`,
        helpText: `(//label[text()='Help Text']//following::input)[1]`,
        // --- Placeholder selectors for enterQuestionDataByType method ---
        // Replace these with actual selectors for your application
        // Example: checkBoxOption: (optionLabel: string) => `//label[contains(text(),'${optionLabel}')]//input[@type='checkbox']`,
        // Example: dropdownContainer: (fieldName: string) => `//label[text()='${fieldName}']//following-sibling::div//button`,
        // Example: dropdownOption: (optionText: string) => `//a/span[text()='${optionText}']`,
        // Example: radioButtonOption: (groupName: string, optionLabel: string) => `//label[contains(text(),'${groupName}')]//following::label[contains(text(),'${optionLabel}')]//input[@type='radio']`,
        // Example: textAreaInput: (fieldName: string) => `//label[text()='${fieldName}']//following-sibling::textarea`,
        // Example: textBoxInput: (fieldName: string) => `//label[text()='${fieldName}']//following-sibling::input[@type='text']`,
        // Example: datePickerInput: (fieldName: string) => `//label[text()='${fieldName}']//following-sibling::input[contains(@class,'date-picker')]`,

        // Generic selectors - adjust as needed
        customFieldTextBox: (fieldName: string) => `//label[normalize-space()="${fieldName}"]/following-sibling::input[@type='text']`,
        customFieldTextArea: (fieldName: string) => `//label[normalize-space()="${fieldName}"]/following-sibling::textarea`,
        customFieldDropdown: (fieldName: string) => `//label[normalize-space()="${fieldName}"]/following-sibling::div//button`, // Assumes a button triggers dropdown
        customFieldDropdownOption: (optionText: string) => `//div[contains(@class,'dropdown-menu')]//a[normalize-space()='${optionText}']`, // Generic dropdown option
        customFieldCheckBox: (fieldName: string, optionLabel: string) => `//label[normalize-space()="${fieldName}"]/following::label[normalize-space()="${optionLabel}"]//input[@type='checkbox']`,
        customFieldRadioButton: (fieldName: string, optionLabel: string) => `//label[normalize-space()="${fieldName}"]/following::label[normalize-space()="${optionLabel}"]//input[@type='radio']`,
        customFieldDatePicker: (fieldName: string) => `//label[normalize-space()="${fieldName}"]/following-sibling::input[contains(@class,'datepicker')]`, // Assuming a class for datepicker input
        
        // New selectors for UAID and UAC functionality
        autoGenerateCheckbox: `//label[@for='autogenerate']//following-sibling::i`,
        visibleEntitiesCheckbox: (text: string) => `//span[contains(text(),'${text}')]`,
        saveButton: `//button[text()='Enable']`,
        searchResultItem: (fieldName: string) => `//td[contains(text(),'${fieldName}')]`,
        customFieldExists: (fieldName: string) => `//span[text()='${fieldName}']`,
        noDataFound: `//td[contains(text(),'No data available')]`,
        requiredDropdownValue: (fieldName: string) => `//footer//following::span[text()='${fieldName}']`,
        fieldLengthInput: `#cfieldlength`,
        customFieldToggle: (fieldName: string) => `(//span[text()='${fieldName}']//following::label[contains(@for,'customfieldonoff')])[1]`,
        disabledTab: `//button[text()='Disabled']`,
        saveDraftsTab: `//button[text()='Saved Drafts']`,
        editButton: (fieldName: string) => `(//span[text()='${fieldName}']//following::span[contains(@aria-label,'Edit')])[1]`,
        deleteButton: (fieldName: string) => `(//span[text()='${fieldName}']//following::span[contains(@aria-label,'Delete')])[1]`,
        confirmDeleteButton: `//button[text()='Delete']`,
        gotoListing: `//a[text()='Go to Listing']`
    };


    constructor(page: Page, context: BrowserContext) {
        super(page, context);
    }



    async verifyCustomFieldLabel() {
        await this.spinnerDisappear();
        await this.validateElementVisibility(this.selectors.customFieldLabel, "Custom Field");
    }

    async clickCreateCustomField() {
        await this.spinnerDisappear();
        await this.validateElementVisibility(this.selectors.createCustomField, "Create Custom Field");
        await this.mouseHover(this.selectors.createCustomField, "Create Custom Field");
        await this.click(this.selectors.createCustomField, "Create Custom Field", "Button");
    }

    async CustomFieldSearch(data: string) {
        await this.retrieveData(this.selectors.newCustomField(data), "../data/customField.json")
        await this.type(this.selectors.customFiledSearchOption, "Search Field", data);
        await this.keyboardAction(this.selectors.customFiledSearchOption, "Enter", "Search Field", data);
        await this.spinnerDisappear();
    }

    async questionTypeRadioBtn(data: string) {
        await this.wait('minWait');
        await this.click(this.selectors.questionTypeRadioBtn(data), "Question Type", "Radio Button");
    }

    async enterFieldName(data: string) {
        await this.type(this.selectors.fieldName,"Field Name",data);
    }

    async requiredDropdown(data: string) {
        await this.click(this.selectors.requireDropdown, "Required", "Dropdown");
        await this.click(this.selectors.requiredDropdownValue(data), "Required", "Dropdown");
    }
    async displayOptionsDropdown(data: string) {
        await this.click(this.selectors.requireDropdown, "Display Options", "Dropdown");
        await this.click(this.selectors.newCustomField(data), "Display Options", "Dropdown");
    }

    async enterHelpText(data: string) {
        await this.type(this.selectors.helpText,"Field Name",data);
    }

    async enterFieldLength(length: string) {
        await this.type(this.selectors.fieldLengthInput, "Field Length", length);
    }

    async disableCustomField(fieldName: string) {
        await this.click(this.selectors.customFieldToggle(fieldName), `Disable ${fieldName} Custom Field`, "Toggle");
        await this.spinnerDisappear();
    }

    async clickDisabledTab() {
        await this.click(this.selectors.disabledTab, "Disabled Tab", "Button");
        await this.spinnerDisappear();
    }

    async clickSaveDraftsTab() {
        await this.click(this.selectors.saveDraftsTab, "Save Drafts Tab", "Button");
        await this.spinnerDisappear();
    }

    async editCustomField(fieldName: string) {
        await this.click(this.selectors.editButton(fieldName), `Edit ${fieldName} Custom Field`, "Button");
        await this.spinnerDisappear();
    }

    async enableCustomField(fieldName: string) {
        await this.click(this.selectors.customFieldToggle(fieldName), `Enable ${fieldName} Custom Field`, "Toggle");
        await this.spinnerDisappear();
    }

    async deleteCustomField(fieldName: string) {
        await this.click(this.selectors.deleteButton(fieldName), `Delete ${fieldName} Custom Field`, "Button");
        await this.click(this.selectors.confirmDeleteButton, "Confirm Delete", "Button");
        await this.spinnerDisappear();
        await this.wait('mediumWait');
    }

    async checkCustomFieldInTab(fieldName: string, tabName: string): Promise<boolean> {
        try {
            await this.spinnerDisappear();
            if (tabName === "Disabled") {
                await this.clickDisabledTab();
            } else if (tabName === "Save Drafts") {
                await this.clickSaveDraftsTab();
            }
            // If tabName is "Enabled" or empty, we're already on the main tab
            
            const element = await this.page.locator(this.selectors.customFieldExists(fieldName));
            const count = await element.count();
            return count > 0;
        } catch (error) {
            return false;
        }
    }

    async handleCustomFieldIfNotInEnabled(fieldName: string): Promise<boolean> {
        // First check if field exists in enabled state
        const existsInEnabled = await this.verifyCustomFieldExists(fieldName);
        
        if (existsInEnabled) {
            console.log(`Custom field '${fieldName}' found in enabled state.`);
            return true;
        }

        // Check in Disabled tab
        const existsInDisabled = await this.checkCustomFieldInTab(fieldName, "Disabled");
        if (existsInDisabled) {
            console.log(`Custom field '${fieldName}' found in disabled state. Enabling it...`);
            await this.enableCustomField(fieldName);
            return true;
        }

        // Check in Save Drafts tab
        const existsInSaveDrafts = await this.checkCustomFieldInTab(fieldName, "Save Drafts");
        if (existsInSaveDrafts) {
            console.log(`Custom field '${fieldName}' found in save drafts. Editing to enable...`);
            await this.editCustomField(fieldName);
            // After editing, save the field to enable it
            await this.saveCustomField();
            return true;
        }

        console.log(`Custom field '${fieldName}' not found in any tab.`);
        return false;
    }

    async enterQuestionDataByType(questionType: string, fieldName: string, value?: any) {
        await this.spinnerDisappear(); // Assuming spinner might appear

        switch (questionType) {
            case "Text Box":
                await this.validateElementVisibility(this.selectors.customFieldTextBox(fieldName), `Text Box: ${fieldName}`);
                break;

            case "Text Area":
                await this.validateElementVisibility(this.selectors.customFieldTextArea(fieldName), `Text Area: ${fieldName}`);
                break;

            case "Dropdown":
                if (!value) {
                    console.warn(`No value provided for Dropdown: ${fieldName}`);
                    break;
                }
                const dropdownOptions = Array.isArray(value) ? value : [value];
                for (const option of dropdownOptions) {
                    if (typeof option !== 'string') {
                        console.warn(`Invalid option type for Dropdown for field ${fieldName}. Expected string, got ${typeof option}. Skipping this option.`);
                        continue;
                    }
                    await this.click(this.selectors.customFieldDropdown(fieldName), `Dropdown: ${fieldName}`, "Button");
                    await this.click(this.selectors.customFieldDropdownOption(option), `Dropdown Option: ${option}`, "Option");
                }
                break;

            case "Check Box":
                if (!value) {
                    console.warn(`No value provided for Check Box: ${fieldName}`);
                    break;
                }
                const checkboxOptions = Array.isArray(value) ? value : [value];
                for (const option of checkboxOptions) {
                    if (typeof option !== 'string') {
                        console.warn(`Invalid option type in Check Box values for field ${fieldName}. Expected string, got ${typeof option}. Skipping this option.`);
                        continue;
                    }
                    await this.click(this.selectors.customFieldCheckBox(fieldName, option), `Check Box: ${fieldName} - ${option}`, "Checkbox");
                }
                break;

            case "Radio Button":
                if (!value) {
                    console.warn(`No value provided for Radio Button: ${fieldName}`);
                    break;
                }
                const radioOptions = Array.isArray(value) ? value : [value];
                for (const option of radioOptions) {
                    if (typeof option !== 'string') {
                        console.warn(`Invalid option type for Radio Button for field ${fieldName}. Expected string, got ${typeof option}. Skipping this option.`);
                        continue;
                    }
                    await this.click(this.selectors.customFieldRadioButton(fieldName, option), `Radio Button: ${fieldName} - ${option}`, "Radio");
                }
                break;

            case "Date Picker":
                if (typeof value === 'string' && value.length > 0) {
                    await this.type(this.selectors.customFieldDatePicker(fieldName), `Date Picker: ${fieldName}`, value);
                } else {
                    console.warn(`Value for Date Picker '${fieldName}' is not a valid string. Validating visibility only.`);
                    await this.validateElementVisibility(this.selectors.customFieldDatePicker(fieldName), `Date Picker: ${fieldName}`);
                }
                break;

            default:
                console.warn(`Question type "${questionType}" for field "${fieldName}" is not supported or not recognized by enterQuestionDataByType.`);
                break;
        }
        await this.spinnerDisappear(); // Assuming spinner might appear after action
    }

    async checkAutoGenerateCheckbox() {
        await this.click(this.selectors.autoGenerateCheckbox, "Auto Generate", "Checkbox");
    }

    async checkVisibleEntitiesCheckbox(entityText: string) {
        await this.click(this.selectors.visibleEntitiesCheckbox(entityText), `Visible Entities - ${entityText}`, "Checkbox");
    }

    async saveCustomField() {
        await this.click(this.selectors.saveButton, "Save Custom Field", "Button");
        await this.spinnerDisappear();
    }

    async verifyCustomFieldExists(fieldName: string): Promise<boolean> {
        try {
            await this.spinnerDisappear();
            const element = await this.page.locator(this.selectors.customFieldExists(fieldName));
            const count = await element.count();
            return count > 0;
        } catch (error) {
            return false;
        }
    }

    async createCustomFieldIfNotExists(fieldName: string, fieldType: string = "Text Box", required: string = "No", autoGenerate: boolean = false, visibleEntity: string = "", fieldLength?: string) {
        // Check if field exists in enabled, disabled, or save drafts
        const fieldHandled = await this.handleCustomFieldIfNotInEnabled(fieldName);
        
        if (fieldHandled) {
            console.log(`Custom field '${fieldName}' already exists and is now enabled. Skipping creation.`);
            return false; // Field already exists and is handled
        }

        console.log(`Creating custom field '${fieldName}'...`);
        
        // Click Create Custom Field
        await this.clickCreateCustomField();
        
        // Select question type
        await this.questionTypeRadioBtn(fieldType);
        
        // Enter field name
        await this.enterFieldName(fieldName);
        
        // Enter field length if provided
        if (fieldLength) {
            await this.enterFieldLength(fieldLength);
        }
        
        // Set required field
        await this.requiredDropdown(required);
        
        // Check auto generate if required
        if (autoGenerate) {
            await this.checkAutoGenerateCheckbox();
        }
        
        // Check visible entities if required
        if (visibleEntity) {
            await this.checkVisibleEntitiesCheckbox(visibleEntity);
        }
        
        // Save the custom field
        await this.saveCustomField();
        await this.click(this.selectors.gotoListing, "Go to Listing", "Link");   
        return true; // Field was created
    }
    
        async retrieveData(locator: string, filepath: string) {
            const length = await this.page.locator(locator).count();
            const data: string[] = [];
            for (let i = 0; i < length; i++) {
                const personData = await this.page.locator(locator).nth(i).innerHTML();
                if (personData) {
                    data.push(personData.trim());
                }
            }
            fs.writeFileSync(path.join(__dirname, filepath), JSON.stringify(data, null, 2));
        }


}
