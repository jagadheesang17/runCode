import { BrowserContext, Page } from "@playwright/test";
import { AdminHomePage } from "./AdminHomePage";

export class DynamicShareableLinksPage extends AdminHomePage {

    public selectors = {
        ...this.selectors,
        
        /**
         * Generic Element Locator - Finds elements by visible text
         * 
         * Usage: 
         *   elementLocator('Search By')        → First element with text 'Search By'
         *   elementLocator('Select', 2)        → Second element with text 'Select'
         * 
         * Works for: Dropdowns, Labels, Buttons
         * Don't use for: Input fields, Checkboxes (use individual selectors below)
         */
        elementLocator: (text: string, index: number = 1) => `(//*[text()='${text}']//following::div)[${index}]`,
        
        // Domain selectors
        domainDropdown: "(//select[@id='dynamic_share_link_portal']//following::div[text()='Select'])[1]",
        domainOption: (value: string) => `//select[@id='dynamic_share_link_portal']//following::span[text()='${value}']`,
        searchByDropdown: "//button[@data-id='dynamic_share_link_searchby']",
        searchInput: "//input[@id='dsl_search-field']",
        trainingTypeDropdown: "(//Select[@id='dsl_training_type']//following::button)[1]",
        languageDropdown: "//*[@id='wrapper-dsl_languages']",
        locationInput: "//input[@id='dsl_location-filter-field']",
        paidCheckbox: "(//input[@id='price_type_paid']/following::i)[1]",
        freeCheckbox: "(//input[@id='price_type_free']/following::i)[1]",
        clearButton: "//button[text()='Clear']",
        generateUrlButton: "//button[text()='Generate URL']"
    };

    // Mapping for verification (references the above selectors)
    private get specificElements() {
        return {
            'Search By': this.selectors.searchByDropdown,
            'Search': this.selectors.searchInput,
            'Training Type': this.selectors.trainingTypeDropdown,
            'Language': this.selectors.languageDropdown,
            'Location': this.selectors.locationInput,
            'Paid': this.selectors.paidCheckbox,
            'Free': this.selectors.freeCheckbox,
            'Clear': this.selectors.clearButton,
            'Generate URL': this.selectors.generateUrlButton
        };
    }

    // Add back to selectors for compatibility
    public get selectorsWithMapping() {
        return {
            ...this.selectors,
            specificElements: this.specificElements
        };
    }
    constructor(page: Page, context: BrowserContext) {
        super(page, context);
    }
    async selectDomainOption(domainValue: string = "qaautomation") {
        console.log(`Selecting domain option: ${domainValue}`);
        await this.wait('minWait');
        await this.click(this.selectors.domainOption(domainValue), `Domain Option: ${domainValue}`, "option");
        await this.wait('mediumWait');
    }

    async verifyElements(elements: any[]) {
        await this.wait('mediumWait');
        console.log('Verifying Dynamic Shareable Links page elements...');
        const missingElements: string[] = [];
        
        for (const element of elements) {
            let text: string;
            let index: number = 1;
            if (Array.isArray(element)) {
                text = element[0] as string;
                index = element[1] as number;
            } else {
                text = element as string;
            }
            let locator: string;
            if (this.specificElements && this.specificElements[text]) {
                locator = this.specificElements[text];
            } else {
                locator = this.selectors.elementLocator(text, index);
            }
            
            try {
                await this.validateElementVisibility(locator, text);
                await this.click(locator, text, "element");
                await this.wait('minWait');
                console.log(`[PASS] ${text} verified`);
            } catch (error) {
                console.log(`[FAIL] ${text} not found`);
                missingElements.push(text);
            }
        }
        
        if (missingElements.length > 0) {
            const errorMessage = `The following elements were not found: ${missingElements.join(', ')}`;
            console.log(`ERROR: ${errorMessage}`);
            throw new Error(errorMessage);
        }
        
        console.log('All Dynamic Shareable Links page elements verified successfully');
    }

    // ==================== REUSABLE ACTION METHODS ====================
    
    async clickSearchBy() {
        console.log('Clicking Search By dropdown');
        await this.click(this.selectors.searchByDropdown, "Search By Dropdown", "dropdown");
        await this.wait('minWait');
    }

    async enterSearchText(searchText: string) {
        console.log(`Entering search text: ${searchText}`);
        await this.type(this.selectors.searchInput, searchText, "Search Input");
        await this.wait('minWait');
    }

    async clickTrainingType() {
        console.log('Clicking Training Type dropdown');
        await this.click(this.selectors.trainingTypeDropdown, "Training Type Dropdown", "dropdown");
        await this.wait('minWait');
    }

    async clickLanguage() {
        console.log('Clicking Language dropdown');
        await this.click(this.selectors.languageDropdown, "Language Dropdown", "dropdown");
        await this.wait('minWait');
    }

    async enterLocation(location: string) {
        console.log(`Entering location: ${location}`);
        await this.type(this.selectors.locationInput, location, "Location Input");
        await this.wait('minWait');
    }

    async clickPaidCheckbox() {
        console.log('Clicking Paid checkbox');
        await this.click(this.selectors.paidCheckbox, "Paid Checkbox", "checkbox");
        await this.wait('minWait');
    }

    async clickFreeCheckbox() {
        console.log('Clicking Free checkbox');
        await this.click(this.selectors.freeCheckbox, "Free Checkbox", "checkbox");
        await this.wait('minWait');
    }

    async clickClearButton() {
        console.log('Clicking Clear button');
        await this.click(this.selectors.clearButton, "Clear Button", "button");
        await this.wait('mediumWait');
    }

    async clickGenerateUrl() {
        console.log('Clicking Generate URL button');
        await this.click(this.selectors.generateUrlButton, "Generate URL Button", "button");
        await this.wait('mediumWait');
    }
}