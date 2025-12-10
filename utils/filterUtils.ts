import { Page } from "@playwright/test";
import { AdminHomePage } from "../pages/AdminHomePage";

export class FilterUtils extends AdminHomePage {
    public filterSelectors = {
        // Filter icon
        filterIcon: "(//div[text()='Filters'])[1]",
        
        // Text field dropdown (with search)
        filterDropdown: (field: string) => `(//span[text()='${field}']//following::div)[1]`,
        filterSearchInput: (field: string) => `((//span[text()='${field}']//following::input[@placeholder='Search'])[1] | (//footer//following::input)[1])[1]`,
        filterOption: (value: string) => `(//li[text()='${value}'] | //span[text()='${value}'])[1]`,
        
        // Default dropdown (without search)
        defaultFilterDropdown: (field: string) => `(//span[text()='${field}']//following::div)[1]`,
        defaultFilterOption: (text: string) => `(//span[text()='${text}'])[1]`,
        
        // Text field input
        textFieldInput: (input: string) => `(//span[text()='${input}']//following::input[@type='text'])[1]`,
        
        // Search text field
        searchFieldInput: (input: string) => `(//span[text()='${input}']//following::input[contains(@id,'search')])[1]`,
        searchFieldOption: (value: string) => `(//li[text()='${value}'])[1]`,
        
        // Date format
        dateField: (label: string) => `(//label[text()='${label}']//following::input)[1]`,
        
        // Checkbox
        checkbox: (text: string) => `//span[text()='${text}']//preceding-sibling::i[contains(@class,'fa-square icon')]`,
        
        // Radio button
        radioButton: (labelName: string, value: string) => `(//span[text()='${labelName}']//following::span[text()='${value}']//preceding-sibling::i[contains(@class,'fa-circle icon')])[1]`,
        
        // Calendar without label
        calendarInput: (index: number) => `(//input[contains(@id,'admin-date-filter')])[${index}]`,
        
        // Apply button
        apply: "(//button[text()='Apply'])[1]"
    };

    /**
     * Click the filter icon to open filters
     */
    public async clickFilterIcon() {
        await this.wait("minWait");
        await this.click(this.filterSelectors.filterIcon, "Filter Icon", "Icon");
    }

    /**
     * Select dropdown with search functionality (text field dropdown)
     * @param field - The label/field name of the dropdown
     */
    public async selectFilterDropdown(field: string) {
        await this.wait("minWait");
        await this.click(this.filterSelectors.filterDropdown(field), `${field} Filter`, "Dropdown");
    }

    /**
     * Search and select a value from dropdown with search
     * @param field - The label/field name of the dropdown
     * @param value - The value to search and select
     */
    public async searchAndSelectFilterValue(field: string, value: string) {
        await this.wait("minWait");
        await this.type(this.filterSelectors.filterSearchInput(field), `${field} Search`, value);
        await this.wait("minWait");
        await this.click(this.filterSelectors.filterOption(value), `${value}`, "Option");
    }

    /**
     * Select dropdown without search functionality (default dropdown)
     * @param field - The label/field name of the dropdown
     */
    public async selectDefaultFilterDropdown(field: string) {
        await this.wait("minWait");
        await this.click(this.filterSelectors.defaultFilterDropdown(field), `${field} Filter`, "Dropdown");
    }

    /**
     * Click option in default dropdown
     * @param text - The text of the option to select
     */
    public async selectDefaultFilterOption(text: string) {
        await this.wait("minWait");
        await this.click(this.filterSelectors.defaultFilterOption(text), `${text}`, "Option");
    }

    /**
     * Enter text in a text field filter
     * @param fieldLabel - The label of the text field
     * @param value - The value to enter
     */
    public async enterTextFieldFilter(fieldLabel: string, value: string) {
        await this.wait("minWait");
        await this.type(this.filterSelectors.textFieldInput(fieldLabel), `${fieldLabel} Input`, value);
    }

    /**
     * Enter text in search field and select option
     * @param fieldLabel - The label of the search field
     * @param value - The value to search and select
     */
    public async searchAndSelectValue(fieldLabel: string, value: string) {
        await this.wait("minWait");
        await this.type(this.filterSelectors.searchFieldInput(fieldLabel), `${fieldLabel} Search`, value);
        await this.wait("minWait");
        await this.click(this.filterSelectors.searchFieldOption(value), `${value}`, "Option");
    }

    /**
     * Enter date in date field
     * @param label - The label of the date field (e.g., 'From' or 'To')
     * @param date - The date value to enter
     */
    public async enterDateFilter(label: string, date: string) {
        await this.wait("minWait");
        await this.type(this.filterSelectors.dateField(label), `${label} Date`, date);
    }

    /**
     * Click checkbox filter
     * @param text - The text/label of the checkbox
     */
    public async clickCheckboxFilter(text: string) {
        await this.wait("minWait");
        await this.click(this.filterSelectors.checkbox(text), `${text} Checkbox`, "Checkbox");
    }

    /**
     * Click radio button filter
     * @param labelName - The label of the radio button group
     * @param value - The value/option to select
     */
    public async clickRadioButtonFilter(labelName: string, value: string) {
        await this.wait("minWait");
        await this.click(this.filterSelectors.radioButton(labelName, value), `${labelName} - ${value} Radio`, "Radio Button");
    }

    /**
     * Enter date in calendar without label
     * @param index - The index of the calendar input (1-based)
     * @param date - The date value to enter
     */
    public async enterCalendarWithoutLabel(index: number, date: string) {
        await this.wait("minWait");
        await this.type(this.filterSelectors.calendarInput(index), `Calendar ${index}`, date);
    }

    /**
     * Click apply button to apply filters
     */
    public async clickApplyFilter() {
        await this.wait("minWait");
        await this.click(this.filterSelectors.apply, "Apply Filter", "Button");
        await this.wait("mediumWait");
    }

    /**
     * Complete workflow: Select dropdown with search
     * @param field - The field label
     * @param value - The value to select
     */
    public async applySearchableDropdownFilter(field: string, value: string) {
        await this.selectFilterDropdown(field);
        await this.searchAndSelectFilterValue(field, value);
        await this.selectFilterDropdown(field);
    }

    /**
     * Complete workflow: Select default dropdown
     * @param field - The field label
     * @param value - The value to select
     */
    public async applyDefaultDropdownFilter(field: string, value: string) {
        await this.selectDefaultFilterDropdown(field);
        await this.selectDefaultFilterOption(value);
        await this.selectDefaultFilterDropdown(field);
    }

    /**
     * Complete workflow: Enter text
     * @param field - The field label
     * @param value - The text value to enter
     */
    public async applyTextFieldFilter(field: string, value: string) {
        await this.enterTextFieldFilter(field, value);
    }

    /**
     * Complete workflow: Select checkbox
     * @param checkboxText - The checkbox label
     */
    public async applyCheckboxFilter(checkboxText: string) {
        await this.clickCheckboxFilter(checkboxText);
    }

    /**
     * Complete workflow: Select multiple checkboxes
     * @param checkboxTexts - Array of checkbox labels to select
     */
    public async applyMultipleCheckboxFilters(checkboxTexts: string[]) {
        for (const text of checkboxTexts) {
            await this.clickCheckboxFilter(text);
        }
    }

    /**
     * Complete workflow: Select radio button
     * @param labelName - The radio button group label
     * @param value - The radio button value to select
     */
    public async applyRadioButtonFilter(labelName: string, value: string) {
        await this.clickRadioButtonFilter(labelName, value);
    }

    /**
     * Complete workflow: Set date range
     * @param fromDate - The from date value
     * @param toDate - The to date value
     */
    public async applyDateRangeFilter(fromDate: string, toDate: string) {
        await this.enterDateFilter("From", fromDate);
        await this.enterDateFilter("To", toDate);
    }
}
