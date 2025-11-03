import { BrowserContext, Page, expect } from "@playwright/test";
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
        domainSelectElement: "//select[@id='dynamic_share_link_portal']",
        allDomainOptions: "//select[@id='dynamic_share_link_portal']//option",
        domainDropdownButton: "//div[@class='dropdown-menu show']//ul[@class='dropdown-menu inner show']",
        allPortalOptions: "//div[@class='dropdown-menu show']//ul[@class='dropdown-menu inner show']//li//a//span",

        searchByDropdown: "//button[@data-id='dynamic_share_link_searchby']",
        searchByOption: (value: string) => `//select[@id='dynamic_share_link_searchby']//following::span[text()='${value}']`,
        searchByOptionsSelector: "//div[contains(@class,'dynamic_share_link_searchby')]//following-sibling::span",
        searchInput: "//input[@id='dsl_search-field']",
        searchResultsSelector: "//div[@id='dsl_search-lms-scroll-results']//li",
        trainingTypeDropdown: "(//Select[@id='dsl_training_type']//following::button)[1]",
        deliveryTypeButton: "//select[@id='dsl_delivery_type']//following::button[1]",
        deliveryTypeOptionsSelector: "//div[contains(@class,'dsl_delivery_type')]//option",
        languageDropdown: "//*[@id='wrapper-dsl_languages']",
        locationInput: "//input[@id='dsl_location-filter-field']",
        paidCheckbox: "(//input[@id='price_type_paid']//following::span)[1]",
        freeCheckbox: "(//input[@id='price_type_free']//following::span)[1]",
        clearButton: "//button[text()='Clear']",
        generateUrlButton: "//button[text()='Generate URL']",
        
        // Autocomplete selectors
        autocompleteDropdownSelector: "//div[@class='autocomplete-dropdown']"
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
    async selectDomainOption(domainValue: string = "newprod") {
        console.log(`Selecting domain option: ${domainValue}`);
        await this.wait('mediumWait');
        await this.click(this.selectors.domainDropdown, "Domain Dropdown", "Dropdown");
        await this.wait('minWait');
        await this.click(this.selectors.domainOption(domainValue), `Domain Option: ${domainValue}`, "Option");
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
                await this.click(locator, text, "Element");
                await this.wait('maxWait');
                await this.click(locator, text, "Element");
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
    
    
async validatePortals(): Promise<void> {
    await this.wait('mediumWait');
    const selectElement = this.page.locator(this.selectors.domainSelectElement);
    const options = selectElement.locator('option');
    const optionsCount = await options.count();
    expect(optionsCount).toBeGreaterThan(1);
    console.log(` Available portals verified - Found ${optionsCount} options`);
}
async verifyNoPortalSelectedByDefault(): Promise<void> {
    await this.wait('mediumWait');
    
    const selectButton = this.page.locator('button[data-id="dynamic_share_link_portal"]');
    const displayedText = await selectButton.locator('.filter-option-inner-inner').textContent();
    
    expect(displayedText?.trim()).toBe('Select');
    console.log(' Default selection verified - No portal selected by default');
}
    
    async verifyPortalDropdownIsSingleSelect(): Promise<void> {
    await this.wait('mediumWait');
    const selectElement = this.page.locator(this.selectors.domainSelectElement);
    const isMultiple = await selectElement.getAttribute('multiple');
    expect(isMultiple).toBeNull();
    console.log('Single select behavior verified - Portal dropdown is single select');
}

async getSearchByOptions(): Promise<string[]> {
    await this.wait('mediumWait');
    await this.click(this.selectors.searchByDropdown, "Search By Dropdown", "Dropdown");
    await this.wait('minWait');
    
    const optionElements = this.page.locator(this.selectors.searchByOptionsSelector);
    const options = await optionElements.allTextContents();
    const validOptions = options
        .map(option => option.trim())
        .filter(option => option !== '');
    
    console.log('Search By Options:', validOptions);
    return validOptions;
}


    async validateSearchByOptions(actualOptions: string[], expectedOptions: string[]): Promise<void> {
    expectedOptions.forEach(expectedOption => {
        expect(actualOptions).toContain(expectedOption.toLowerCase());
        console.log(` Verified option: ${expectedOption}`);
    });
    expect(actualOptions.length).toBe(expectedOptions.length);
    console.log(` All ${expectedOptions.length} expected options validated successfully`);
}

    async selectSearchByOption(option: string): Promise<void> {
        console.log(`Selecting search by option: ${option}`);
        await this.wait('mediumWait');
        await this.click(this.selectors.searchByDropdown, "Search By Dropdown", "Dropdown");
        await this.wait('minWait');
        await this.click(this.selectors.searchByOption(option), `Search By Option: ${option}`, "Option");
        await this.wait('minWait');
    }

    async getSearchResults(): Promise<string[]> {
        await this.wait('mediumWait');
        const resultsLocator = this.page.locator(this.selectors.searchResultsSelector);
        const results = await resultsLocator.allTextContents();
        return results.filter(result => result.trim() !== '');
    }

    async verifyAutoComplete(): Promise<boolean> {
        await this.wait('mediumWait');
        const autocompleteVisible = await this.selectors.autocompleteDropdownSelector.isVisible();
        return autocompleteVisible;
    }

    async enterSearchText(searchText: string): Promise<void> {
        await this.wait('minWait');
        await this.type(this.selectors.searchInput, "Search Input", searchText);
        await this.wait('minWait');
    }

    async clickClearButton(): Promise<void> {
        await this.wait('minWait');
        await this.click(this.selectors.clearButton, "Clear", "Button");
        await this.wait('mediumWait');
    }

    async performSearchByCriteria(searchCriteria: Record<string, string>): Promise<void> {
        for (const [searchBy, searchTerm] of Object.entries(searchCriteria)) {
            console.log(`\n🔍 Testing Search by: ${searchBy} with term: "${searchTerm}"`);
            
            await this.selectSearchByOption(searchBy);
            await this.enterSearchText(searchTerm);
            await this.wait('maxWait');
            
            const searchResults = await this.getSearchResults();
            console.log(`Search results for "${searchTerm}" in ${searchBy}:`, searchResults);
            
            expect(searchResults.length, `Expected search results for ${searchBy}: "${searchTerm}"`).toBeGreaterThan(0);
            
            await this.clickClearButton();
            await this.wait('minWait');
            console.log(`✅ ${searchBy} search functionality verified with results displayed`);
        }
        
        console.log('\n✅ All Search by Criteria functionality verified successfully with results shown');
    }

    async getDeliveryType(): Promise<string[]> {
        await this.wait('mediumWait');
        await this.click(this.selectors.deliveryTypeButton, "Delivery Type", "Dropdown");
        await this.wait('mediumWait');
        const deliveryTypesLocator = this.page.locator(this.selectors.deliveryTypeOptionsSelector);
        const deliveryTypes = await deliveryTypesLocator.allTextContents();
        console.log('Delivery Types:', deliveryTypes);
        return deliveryTypes;
    }
    
    async validateDeliveryTypes(expectedDeliveryTypes: string[][]): Promise<void> {
        const deliveryTypes = await this.getDeliveryType();
        const cleanDeliveryTypes = deliveryTypes.map(option => option.trim()).filter(option => option !== '');
        
        console.log(`Available Delivery Types: ${cleanDeliveryTypes.join(', ')}`);
        
        for (const expectedTypeVariants of expectedDeliveryTypes) {
            const found = cleanDeliveryTypes.some(option =>
                expectedTypeVariants.some(variant => 
                    option.toLowerCase() === variant.toLowerCase()
                )
            );
            
            const variantsDisplay = expectedTypeVariants.join(' OR ');
            expect(found, `Expected delivery type '${variantsDisplay}' should be present. Available types: ${cleanDeliveryTypes.join(', ')}`).toBeTruthy();
            console.log(`✅ ${variantsDisplay} - Verified`);
        }
    }

}

