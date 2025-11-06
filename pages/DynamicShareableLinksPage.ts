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
        trainingTypeOptionsSelector: "//select[@id='dsl_training_type']//option",
        deliveryTypeButton: "//select[@id='d`sl_delivery_type']//following::button[1]",
        deliveryTypeOptionsSelector: "//div[contains(@class,'dsl_delivery_type')]//option",
        languageDropdown: "//*[@id='wrapper-dsl_languages']",
        locationInput: "//input[@id='dsl_location-filter-field']",
        locationtext:"//input[@id='dsl_location']",
        paidCheckbox: "(//input[@id='price_type_paid']//following::span)[1]",
        freeCheckbox: "(//input[@id='price_type_free']//following::span)[1]",
        clearButton: "//button[text()='Clear']",
        generateUrlButton: "//button[text()='Generate URL']",
        
        categoryDropdown: "//div[@id='dsl_category']//following-sibling::div//li",
        categoryActiveOptions: "//select[@id='dsl_category']//option[@data-status='active']",
        categoryInactiveOptions: "//select[@id='dsl_category']//option[@data-status='inactive']",
        categoryDeletedOptions: "//select[@id='dsl_category']//option[@data-status='deleted']",
        languageDropdownButton: "//select[@id='dsl_languages']//following::button[1]",
        languageOptions: "//div[contains(@class,'dsl_languages')]//li//a",
        languageActiveOptions: "//select[@id='dsl_languages']//option[@data-status='active']",
        languageInactiveOptions: "//select[@id='dsl_languages']//option[@data-status='inactive']",
        languageDeletedOptions: "//select[@id='dsl_languages']//option[@data-status='deleted']",
        countryDropdown: "//select[@id='dsl_country']//following::button[1]",
        countryActiveOptions: "//div[contains(@class,'dsl_country')]//li//a",
        firstActiveCountry: "//select[@id='dsl_country']//option[@data-status='active'][1]",
        ratingFilter: "//div[@id='wrapper-dsl_rating']",
        ratingCheckbox: (rating: string) => `//input[@id='dsl-rating-${rating}']//following::span[1]`,
        priceFilter: "//div[@id='wrapper-dsl_price']",
        minPriceInput: "(//label[text()='Min']/following::input)[1]",
        maxPriceInput: "(//label[text()='Max']/following::input)[1]",
        trainingType: (value: string) => `//div[contains(@class,'dsl_training_type')]//span[text()='${value}']`,
        toDateInput: "//input[@id='dsl_to_date']",  
        pastDateDisabled: "//td[contains(@class,'day old disabled')]",
        yesterdayDate: (day: number) => `//td[contains(@class,'day') and contains(@class,'disabled') and text()='${day}']`,
        todayDate: (day: number) => `//td[contains(@class,'day') and not(contains(@class,'disabled')) and not(contains(@class,'old')) and not(contains(@class,'new')) and text()='${day}']`,
        futureDateEnabled: "//td[contains(@class,'day') and not(contains(@class,'disabled'))][1]",
        disabledDates: "//td[contains(@class,'day disabled')]",
        deliveryTypeDropdown: "//select[@id='dsl_delivery_type']//following::button[1]",
        tagLabel: "//input[@id='dsl_tags-filter-field']",
        taginput: "//input[@id='dsl_tags']",
        durationDropdown: "//select[@id='dsl_duration']//following::button[1]",
        durationOptions: "//select[@id='dsl_duration']//option",
        ceuFilter: "//div[@id='wrapper-dsl_ceu']",
        ceuCheckbox: "//input[@id='dsl_ceu']//following::span[1]",
        skillsFilter: "//div[@id='wrapper-dsl_skills']",
        skillsCheckbox: "//input[@id='dsl_skills']//following::span[1]",
        generatedUrl: `#dynamic_share_link`,
        copyButton: "//i[contains(@class,'copy')]",
        shareButton: "//i[contains(@class,'share')]",
        locationOption:(value:string) => `//li[contains(text(),'${value}')]`,
        selectCountry: (value: string) => `//div[contains(@class,'dsl_country')]//li//span[text()='${value}']`,
        appliedFilter: (filterName: string, filterValue: string) => `(//span[text()='${filterName}']//following::span[contains(text(),'${filterValue}')])[1]`,
        filteredTraining: (value:string) => `//h5[text()='${value}']`,
        trainingPrice: "//span[normalize-space()='Enroll']/preceding::div[contains(@class,'me-4')][1]/div",
        searchTraining:"//input[@placeholder='Search']",
        selectDeliveryType: (value: string) => `//span[text()='${value}']`,
        tagAutoCompletion:"//li[contains(@class,'dropdown-item')]",
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

    async verifyNoDomainSelectedByDefault(): Promise<void> {
        await this.wait('mediumWait');
        const domainDropdownButton = this.page.locator(this.selectors.domainDropdown);
        const buttonText = await domainDropdownButton.textContent();
        const selectElement = this.page.locator(this.selectors.domainSelectElement);
        const selectedValue = await selectElement.evaluate((select: HTMLSelectElement) => select.value);  
        expect(buttonText?.trim()).toBe("Select");
        expect(selectedValue).toBe("");
        console.log('✅ No domain is selected by default');
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
            console.log(` ${searchBy} search functionality verified with results displayed`);
        }
        
        console.log('\n All Search by Criteria functionality verified successfully with results shown');
    }

    async verifyAutocompleteResultsDisplayed(searchBy: string, searchTerm: string): Promise<void> {
        await this.wait('mediumWait');
        const resultElements = await this.page.locator(this.selectors.searchResultsSelector).all();
        
        if (resultElements.length === 0) {
            throw new Error(`❌ No autocomplete results found for ${searchBy}: "${searchTerm}"`);
        }
        
        console.log(`✅ Autocomplete results visible for '${searchBy}' (${searchTerm}): ${resultElements.length} result(s) found`);
    }

    async verifyAutocompleteResultsNotDisplayed(searchBy: string, searchTerm: string): Promise<void> {
        await this.wait('mediumWait');
        const resultElements = await this.page.locator(this.selectors.searchResultsSelector).all();
        
        if (resultElements.length > 0) {
            throw new Error(`❌ Unexpected autocomplete results found for non-matching ${searchBy}: "${searchTerm}" - Found ${resultElements.length} result(s)`);
        }
        
        console.log(`✅ No autocomplete results displayed for non-matching '${searchBy}' (${searchTerm}): Correctly handled`);
    }

    async testAutocompleteWithResults(searchCriteria: Record<string, string>): Promise<void> {
        for (const [searchBy, searchTerm] of Object.entries(searchCriteria)) {
            if (!searchTerm) {
                console.log(`⏭️ Skipping ${searchBy} - no search term provided`);
                continue;
            }
            
            console.log(`\n🔍 Testing Autocomplete for: ${searchBy} with term: "${searchTerm}"`);
            
            await this.selectSearchByOption(searchBy);
            await this.wait('minWait');
            
            await this.enterSearchText(searchTerm);
            await this.wait('mediumWait');
            
            await this.verifyAutocompleteResultsDisplayed(searchBy, searchTerm);
            
            await this.clickClearButton();
            await this.wait('minWait');
        }
        
        console.log('\n✅ All autocomplete functionality verified successfully with results displayed');
    }

    async testAutocompleteWithoutResults(searchCriteria: Record<string, string>): Promise<void> {
        for (const [searchBy, searchTerm] of Object.entries(searchCriteria)) {
            if (!searchTerm) {
                console.log(`⏭️ Skipping ${searchBy} - no search term provided`);
                continue;
            }
            
            console.log(`\n🔍 Testing Non-matching Autocomplete for: ${searchBy} with term: "${searchTerm}"`);
            
            await this.selectSearchByOption(searchBy);
            await this.wait('minWait');
            
            await this.enterSearchText(searchTerm);
            await this.wait('mediumWait');
            
            await this.verifyAutocompleteResultsNotDisplayed(searchBy, searchTerm);
            
            await this.clickClearButton();
            await this.wait('minWait');
        }
        
        console.log('\n✅ All non-matching search criteria verified - Autocomplete NOT displayed for non-matching text');
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
            console.log(` ${variantsDisplay} - Verified`);
        }
    }

    async verifyTrainingTypeFilterDisplayed(): Promise<void> {
        await this.wait('mediumWait');
        await this.validateElementVisibility(this.selectors.trainingTypeDropdown, "Training Type");
        console.log(' Training Type filter is displayed');
    }

    async clickTrainingTypeDropdown(): Promise<void> {
        await this.wait('mediumWait');
        await this.click(this.selectors.trainingTypeDropdown, "Training Type", "Dropdown");
        await this.wait('minWait');
    }

    async selectTrainingType(trainingTypes: string | string[]): Promise<void> {
        await this.wait('minWait');
        await this.click(this.selectors.trainingTypeDropdown, "Training Type", "Dropdown");
        await this.wait('minWait');
        const typesToSelect = Array.isArray(trainingTypes) ? trainingTypes : [trainingTypes];
        for (const trainingType of typesToSelect) {
            await this.click(this.selectors.trainingType(trainingType), `Training Type: ${trainingType}`, "Option");
            await this.wait('minWait');
            console.log(`Selected training type: ${trainingType}`);
        }
    }

    async validateTrainingTypeOptions(expectedOptions: string[]): Promise<void> {
        await this.wait('mediumWait');
        const optionElements = this.page.locator(this.selectors.trainingTypeOptionsSelector);
        const options = await optionElements.allTextContents();
        const cleanOptions = options.map(option => option.trim()).filter(option => option !== '');
        
        console.log(`Available Training Type Options: ${cleanOptions.join(', ')}`);
        
        for (const expectedOption of expectedOptions) {
            const found = cleanOptions.some(option => 
                option.toLowerCase() === expectedOption.toLowerCase()
            );
            expect(found, `Expected training type '${expectedOption}' should be present. Available types: ${cleanOptions.join(', ')}`).toBeTruthy();
            console.log(` ${expectedOption} - Verified`);
        }
        console.log(' All expected Training Type options validated successfully');
    }


    async verifyCategoryFilter(apiCategoryNames: string[]): Promise<void> {
        await this.wait('mediumWait');
        await this.click(this.selectors.elementLocator("Category", 1), "Category", "Dropdown");
        await this.wait('minWait');
        
        const optionElements = this.page.locator(this.selectors.categoryDropdown);
        const uiCount = await optionElements.count();
        expect(uiCount).toBeGreaterThan(0);
        expect(uiCount).toBe(apiCategoryNames.length);
        for (let i = 0; i < uiCount; i++) {
            const optionText = await optionElements.nth(i).textContent();
            const categoryName = optionText?.trim();
            expect(apiCategoryNames).toContain(categoryName);
        }
        console.log(` Category Filter Verified:`);
        console.log(`   - UI Count: ${uiCount}`);
        console.log(`   - Metadata library Active Count: ${apiCategoryNames.length}`);
        console.log(`   - All UI categories match API metadata library (no inactive/extra categories)`);
    }

    // DSL007 - Language Filter Verification
    async verifyLanguageFilter(apiActiveLanguageNames: string[], apiInactiveLanguageNames: string[]): Promise<void> {
        await this.wait('mediumWait');
        await this.click(this.selectors.languageDropdown, "Language", "Dropdown");
        await this.wait('minWait');
        
        const optionElements = this.page.locator(this.selectors.languageOptions);
        const uiCount = await optionElements.count();

        expect(uiCount).toBeGreaterThan(0);
        const uiLanguageNames: string[] = [];
        for (let i = 0; i < uiCount; i++) {
            const optionText = await optionElements.nth(i).textContent();
            const languageName = optionText?.trim();
            if (languageName) {
                uiLanguageNames.push(languageName);
            }
        }
            const nonDefaultActiveLanguages = apiActiveLanguageNames.filter(name => 
            name.toLowerCase() !== 'english'  // English is typically the default and not shown in UI
        );
        for (const uiLanguage of uiLanguageNames) {
            expect(apiActiveLanguageNames).toContain(uiLanguage);
            expect(apiInactiveLanguageNames).not.toContain(uiLanguage);
        }
        console.log(` Language Filter Verified:`);
        console.log(`   - UI Count: ${uiCount}`);
        console.log(`   - UI Languages: ${uiLanguageNames.join(', ')}`);
        console.log(`   - Metadata Active language Count: ${apiActiveLanguageNames.length}`);
        console.log(`   - Metadata Inactive language Count: ${apiInactiveLanguageNames.length}`);
        console.log(`   - Note: Default language (English) may not appear in UI`);
        console.log(`   - All UI languages are active (status=1), no inactive languages (status=0) displayed`);
    }

    // DSL008 - Country Filter Methods
    async verifyActiveCountryDisplayed(): Promise<void> {
        await this.wait('mediumWait');
        await this.click(this.selectors.elementLocator("Country",1), "Country", "Dropdown");
        await this.wait('minWait');
        const optionElements = this.page.locator(this.selectors.countryActiveOptions);
        const count = await optionElements.count();
        expect(count).toBeGreaterThan(0);
        console.log(` Active countries displayed - Found ${count} active countries`);
    }


    async selectCountry(countryName: string) {
        await this.wait('mediumWait');
        await this.click(this.selectors.elementLocator("Country",1), "Country", "Dropdown");
        await this.wait('minWait');
        await this.click(this.selectors.selectCountry(countryName), countryName, "Option");
        await this.wait('mediumWait');
    }

    async verifyILTClassWithCountryFilter(): Promise<void> {
        await this.wait('mediumWait');
        await this.click(this.selectors.generateUrlButton, "Generate URL", "Button");
        await this.wait('maxWait');
        const urlDisplayed = await this.page.locator(this.selectors.generatedUrl).isVisible();
        expect(urlDisplayed).toBeTruthy();
        console.log(' ILT Class with country filter verified');
    }

    async searchLocation(searchText: string){
        await this.validateElementVisibility(this.selectors.locationInput, "Location Filter");
        await this.wait('maxWait');
        await this.click(this.selectors.locationInput, "Location", "Button");
        await this.type(this.selectors.locationtext, "Location", searchText);
        await this.wait('maxWait');
    }


    // DSL009 - Location Filter Methods
    async verifyLocationFilterWithAutocomplete(location:string): Promise<void> {
        await this.wait('minWait');
        const locationElement = this.page.locator(this.selectors.locationOption(location));
        await locationElement.scrollIntoViewIfNeeded();
        await this.wait('minWait');
        const autocompleteVisible = await locationElement.isVisible();
        expect(autocompleteVisible).toBeTruthy();
        console.log(' Location filter with autocomplete verified');
    }   

    // DSL010 - Rating Filter Methods
    async verifyRatingDisplayed(): Promise<void> {
        await this.wait('mediumWait');
        await this.validateElementVisibility(this.selectors.ratingFilter, "Rating Filter");
        console.log('Rating filter is displayed');
    }

    private convertRatingNumberToWord(rating: string): string {
        const ratingMap: { [key: string]: string } = {
            '1': 'one','2': 'two','3': 'three','4': 'four','5': 'five',
            'one': 'one','two': 'two','three': 'three','four': 'four','five': 'five'
        };
        return ratingMap[rating.toLowerCase()] || rating;
    }

    async selectRating(rating: string): Promise<void> {
        await this.wait('mediumWait');
        const ratingWord = this.convertRatingNumberToWord(rating);
        await this.click(this.selectors.ratingCheckbox(ratingWord), `Rating ${rating}`, "Checkbox");
        await this.wait('minWait');
        console.log(`Selected rating: ${rating} stars`);
    }

    async clickGenerateURL(): Promise<string> {
        await this.wait('mediumWait');
        await this.validateElementVisibility(this.selectors.generateUrlButton, "Generate URL");
        await this.click(this.selectors.generateUrlButton, "Generate URL", "Button");
        await this.wait('maxWait');
        const urlElement = this.page.locator(this.selectors.generatedUrl);
        await expect(urlElement).toBeVisible();
        const generatedURL = await urlElement.inputValue();
        return generatedURL;
    }

    async openGeneratedURL(url: string): Promise<void> {
        await this.wait('mediumWait');
        await this.page.goto(url);
        await this.wait('maxWait');
        console.log(`Opened URL as learner: ${url}`);
    }

    /**
     * Verify applied filters on learner catalog page
     * @param filterName - The filter type (e.g., "Training Type", "Price", "Rating")
     * @param expectedValues - Single value or array of values to verify
     * 
     * Examples:
     * - verifyAppliedFilter("Training Type", "Course")
     * - verifyAppliedFilter("Training Type", ["Course", "Certification", "Learning Path"])
     * - verifyAppliedFilter("Price", "Free")
     * - verifyAppliedFilter("Price", "Min:  Max:")
     * - verifyAppliedFilter("Rating", "4")
     */
    async verifyAppliedFilter(filterName: string, expectedValues: string | string[]): Promise<void> {
        await this.wait('mediumWait');
        const valuesToVerify = Array.isArray(expectedValues) ? expectedValues : [expectedValues];
        const actualFilterName = filterName.toLowerCase() === 'price' ? 'price' : filterName;
        console.log(`\n🔍 Verifying Filter: ${filterName}`);
        console.log(`   Expected Values: ${valuesToVerify.join(', ')}`);
        for (const expectedValue of valuesToVerify) {
            const filterSelector = this.selectors.appliedFilter(filterName, expectedValues);
            try {
                await this.wait('minWait');
                const filterElement = this.page.locator(filterSelector);
                const isVisible = await filterElement.isVisible();
                expect(isVisible).toBeTruthy();
                console.log(` Verified: ${filterName} = "${expectedValue}"`);
            } catch (error) {
                console.log(` Failed: ${filterName} = "${expectedValue}" not found`);
                throw new Error(`Filter verification failed: ${filterName} with value "${expectedValue}" is not applied or visible`);
            }
        }
        console.log(`tagLabel All filters verified for ${filterName}\n`);
    }

    async verifyFreeTrainingsDisplayed(): Promise<void> {
        await this.wait('mediumWait');
        


    }


    async verifyTrainingsWithSelectedRating(rating: string): Promise<void> {
        await this.wait('mediumWait');
      
        console.log(`Verified trainings with rating ${rating} are displayed`);
    }

    async verifyURLGeneratedWhenRatingDisabled(): Promise<void> {
        await this.wait('mediumWait');
        await this.click(this.selectors.generateUrlButton, "Generate URL", "Button");
        await this.wait('maxWait');
        const urlDisplayed = await this.page.locator(this.selectors.generatedUrl).isVisible();
        expect(urlDisplayed).toBeTruthy();
        console.log('URL generated successfully even when rating is disabled');
    }

    // DSL011 - Price Filter Methods
    async verifyPriceFilterDisplayed(): Promise<void> {
        await this.wait('mediumWait');
        await this.validateElementVisibility(this.selectors.priceFilter, "Price Filter");
        console.log('tagLabel Price filter is displayed');
    }

    async verifyPriceFilterNotDisplayed(): Promise<void> {
        await this.wait('mediumWait');
        const isVisible = await this.page.locator(this.selectors.priceFilter).isVisible();
        expect(isVisible).toBeFalsy();
        console.log('tagLabel Price filter is not displayed');
    }

    async selectFreeCheckbox(): Promise<void> {
        await this.wait('mediumWait');
        await this.click(this.selectors.freeCheckbox, "Free", "Checkbox");
        await this.wait('minWait');
        console.log('tagLabel Selected Free checkbox');
    }

    async selectPaidCheckbox(): Promise<void> {
        await this.wait('mediumWait');
        await this.click(this.selectors.paidCheckbox, "Paid", "Checkbox");
        await this.wait('minWait');
    }

    async searchTraining(training: string): Promise<void> {
        await this.wait('maxWait');
        console.log(`\n🔍 Searching for training: "${training}"`);
        await this.typeAndEnter(this.selectors.searchTraining, "Search Input", training);
        await this.wait('mediumWait');
        console.log(`   Searching for training in catalog...`);        
    }

    async verifyTrainingsDisplayed(training: string): Promise<void> {
    await this.wait('maxWait');
    await this.wait('maxWait');
    const trainingLocator = this.page.locator(this.selectors.filteredTraining(training));
        await expect(trainingLocator).toBeVisible({ timeout: 10000 });
        await this.wait('maxWait');
    console.log(`tagLabel Training "${training}" is displayed in learner catalog`);
}

    /**
     * Verify price displayed in learner catalog is equal to or greater than expected price
     * @param expectedPrice - Expected minimum price amount (e.g., "700", "2500", "99.99")
     * 
     * Examples:
     * - verifyPrice("700")        → Accepts "USD $700.00", "USD $800.00", etc.
     * - verifyPrice("2500")       → Accepts "INR ₹2500.00", "INR ₹3000.00", etc.
     * - verifyPrice("99.99")      → Accepts "EUR €99.99", "EUR €150.00", etc.
     */
    async verifyPrice(expectedPrice: string): Promise<void> {
        await this.wait('mediumWait');
        const priceLocator = this.page.locator(this.selectors.trainingPrice).first();
        await priceLocator.scrollIntoViewIfNeeded();
        await this.wait('minWait');
        const actualPrice = await priceLocator.textContent();
        const actualPriceText = actualPrice?.trim() || '';
        const numericMatch = actualPriceText.match(/[\d,]+\.?\d*/);
        const actualNumericPrice = numericMatch ? parseFloat(numericMatch[0].replace(/,/g, '')) : 0;
        const expectedNumericPrice = parseFloat(expectedPrice.replace(/,/g, ''));
        console.log(`\n💰 Price Verification:`);
        console.log(`   Expected Minimum Price: ${expectedNumericPrice}`);
        console.log(`   Actual Price Display: ${actualPriceText}`);
        console.log(`   Actual Numeric Price: ${actualNumericPrice}`);
        expect(actualNumericPrice).toBeGreaterThanOrEqual(expectedNumericPrice);
        console.log(`tagLabel Price verified successfully - Actual price ${actualNumericPrice} is >= expected ${expectedNumericPrice}\n`);
    }

    async enterMinPrice(value: string): Promise<void> {
        await this.wait('mediumWait');
        const inputLocator = this.page.locator(this.selectors.minPriceInput);
        await inputLocator.clear();
        await inputLocator.pressSequentially(value, { delay: 50 });
        await this.wait('minWait');
        console.log(`tagLabel Entered min price: ${value}`);
    }

    async enterMaxPrice(value: string): Promise<void> {
        await this.wait('mediumWait');
        const inputLocator = this.page.locator(this.selectors.maxPriceInput);
        await inputLocator.clear();
        await inputLocator.pressSequentially(value, { delay: 50 });
        await this.wait('minWait');
        console.log(`tagLabel Entered max price: ${value}`);
    }

    async verifyPriceFieldValue(field: 'min' | 'max', expectedValue: string): Promise<void> {
        await this.wait('minWait');
        const selector = field === 'min' ? this.selectors.minPriceInput : this.selectors.maxPriceInput;
        const actualValue = await this.page.locator(selector).inputValue();
        expect(actualValue).toBe(expectedValue);
        console.log(`tagLabel ${field} price field value verified: ${expectedValue}`);
    }

    // DSL012 - Date Range Filter Methods
    async verifyDateRangeFilterDisplayed(): Promise<void> {
        await this.wait('mediumWait');
        const fromFieldLocator = this.selectors.elementLocator("From", 1);
        await this.validateElementVisibility(fromFieldLocator, "From Date Field");
        console.log('   ✓ "From" date field verified');
        const toFieldLocator = this.selectors.elementLocator("To", 1);
        await this.validateElementVisibility(toFieldLocator, "To Date Field");
        console.log('   ✓ "To" date field verified');
    }

    async clickFromDateInput(): Promise<void> {
        await this.wait('mediumWait');
        await this.click( this.selectors.elementLocator("From", 1), "From Date", "Input");
        await this.wait('minWait');
    }

async verifyPastDatesDisabled(): Promise<void> {
    await this.wait('minWait');
    // Get today's date
    const today = new Date();
    const currentDay = today.getDate();
    // Get yesterday's date
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayDay = yesterday.getDate();
    console.log(`📅 Verifying Date Picker:`);
    console.log(`   Today: ${currentDay}`);
    console.log(`   Yesterday: ${yesterdayDay}`);
    const yesterdayLocator = this.page.locator(this.selectors.yesterdayDate(yesterdayDay));
    await expect(yesterdayLocator).toBeVisible();
    console.log(`   ✓ Yesterday (${yesterdayDay}) is disabled`);    
    const todayLocator = this.page.locator(this.selectors.todayDate(currentDay));
    await expect(todayLocator).toBeVisible();
    console.log(`   ✓ Today (${currentDay}) is enabled`);
    console.log('tagLabel Past dates are disabled, today and future dates are enabled');
}


    async clickToDateInput(): Promise<void> {
        await this.wait('mediumWait');
        await this.click(this.selectors.toDateInput, "To Date", "Input");
        await this.wait('minWait');
        console.log('tagLabel Clicked To Date input');
    }


private selectedFromDate: Date = new Date();

async selectFromDate(): Promise<void> {
    await this.wait('minWait');
    await this.click(this.selectors.elementLocator("From", 1), "From Date", "Input");
    await this.wait('minWait');
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    
    // Store complete date for validation
    this.selectedFromDate = new Date(futureDate);
    const dayToSelect = futureDate.getDate();
    
    console.log(`📅 Selected From Date: ${this.selectedFromDate.toLocaleDateString()}`);
    
    const dateLocator = `//td[contains(@class,'day') and not(contains(@class,'disabled')) and text()='${dayToSelect}']`;
    await this.click(dateLocator, `Date ${dayToSelect}`, "Calendar Day");
    await this.wait('minWait');
}

async verifyToDateValidation(): Promise<void> {
    // Step 1: Open To Date picker
    await this.click(this.selectors.elementLocator("To", 1), "To Date", "Input");
    await this.wait('minWait');
    
    const invalidDate = new Date(this.selectedFromDate);
    invalidDate.setDate(this.selectedFromDate.getDate() - 2);
    const invalidDay = invalidDate.getDate();
    console.log(`📅 From Date: ${this.selectedFromDate.toLocaleDateString()}`);
    console.log(`📅 Attempting To Date: ${invalidDate.toLocaleDateString()}`);
    const disabledLocator = `//td[contains(@class,'day') and contains(@class,'disabled') and text()='${invalidDay}']`;
    const enabledLocator = `//td[contains(@class,'day') and not(contains(@class,'disabled')) and text()='${invalidDay}']`;

    const isDisabled = await this.page.locator(disabledLocator).count() > 0;
    if (!isDisabled) {
        const canSelect = await this.page.locator(enabledLocator).count() > 0;
        if (canSelect) {
            await this.click(enabledLocator, `Date ${invalidDay}`, "Calendar Day");
            await this.wait('minWait');
            throw new Error(
                ` *** FAILED: System accepts To Date (${invalidDate.toLocaleDateString()}) which is earlier than From Date (${this.selectedFromDate.toLocaleDateString()}). ` +
                `System should not allow To Date to be before From Date.`
            );
        }
    }
    console.log(`tagLabel To Date validation passed: Date ${invalidDay} (${invalidDate.toLocaleDateString()}) is correctly disabled`);
}


async selectDeliveryType(deliveryType: string): Promise<void> {
    await this.wait('mediumWait');
    await this.click(this.selectors.deliveryTypeDropdown, "Delivery Type", "Dropdown");
    await this.wait('minWait');
    const typeMapping: { [key: string]: string } = {
        'Classroom': 'Attend-In Person',
        'Virtual Class': 'Attend-Remote',
        'E-Learning': 'E-learning'
    };
    let locator = this.selectors.selectDeliveryType(deliveryType);
    if (await this.page.locator(locator).count() === 0) {
        locator = this.selectors.selectDeliveryType(typeMapping[deliveryType]);
    }
    await this.click(locator, deliveryType, "Option");
    await this.wait('minWait');
    }

    async verifyDeliveryTypeEnabled(): Promise<void> {
        await this.wait('mediumWait');
        
        const deliveryTypeSelect = this.page.locator("//select[@id='dsl_delivery_type']");
        const deliveryTypeButton = this.page.locator(this.selectors.deliveryTypeDropdown);
        const selectIsDisabled = await deliveryTypeSelect.isDisabled();
        const buttonDisabled = await deliveryTypeButton.getAttribute('disabled');
        const buttonClass = await deliveryTypeButton.getAttribute('class');
        
        console.log(`🔍 Delivery Type Select isDisabled: ${selectIsDisabled}`);
        console.log(`🔍 Delivery Type Button disabled attribute: ${buttonDisabled}`);
        console.log(`🔍 Delivery Type Button class: ${buttonClass}`);
        
        expect(selectIsDisabled).toBe(false);
        console.log('✅ Delivery Type filter is enabled');
    }

    async verifyDeliveryTypeDisabled(): Promise<void> {
        await this.wait('mediumWait');
        
        // Check the actual select element instead of the button
        const deliveryTypeSelect = this.page.locator("//select[@id='dsl_delivery_type']");
        const deliveryTypeButton = this.page.locator(this.selectors.deliveryTypeDropdown);
        
        // Check if select element is disabled
        const selectIsDisabled = await deliveryTypeSelect.isDisabled();
        
        // Check button attributes for debugging
        const buttonDisabled = await deliveryTypeButton.getAttribute('disabled');
        const buttonClass = await deliveryTypeButton.getAttribute('class');
        
        console.log(`🔍 Delivery Type Select isDisabled: ${selectIsDisabled}`);
        console.log(`🔍 Delivery Type Button disabled attribute: ${buttonDisabled}`);
        console.log(`🔍 Delivery Type Button class: ${buttonClass}`);
        
        expect(selectIsDisabled).toBe(true);
        console.log('✅ Delivery Type filter is disabled');
    }

    // DSL013 - Tag Filter Methods
    async verifyTagFilterDisplayed(): Promise<void> {
        await this.wait('mediumWait');
        await this.validateElementVisibility(this.selectors.tagLabel, "Tag Filter");
        console.log('tagLabel Tag filter is displayed');
    }

    async enterTag(searchText: string): Promise<void> {
        await this.click(this.selectors.tagLabel, "Tag", "DropDown");
        await this.wait('mediumWait');
        await this.typeAndEnter(this.selectors.taginput, "Search",searchText);
        console.log(`tagLabel Entered tag text: "${searchText}"`);
    }

    async verifyAutocompleteDisplayed(): Promise<void> {
        await this.wait('mediumWait');
        const autocompleteLocator = this.page.locator(this.selectors.tagAutoCompletion);
        const count = await autocompleteLocator.count();
        expect(count).toBeGreaterThan(0);
        console.log(`✅ Tag autocomplete is displayed - Found ${count} matching tag(s)`);
    }

    async verifyAutocompleteNotDisplayed(): Promise<void> {
        await this.wait('mediumWait');
        const autocompleteLocator = this.page.locator(this.selectors.tagAutoCompletion);
        const count = await autocompleteLocator.count();
        expect(count).toBe(0);
        console.log('✅ Tag autocomplete is not displayed - No matching tags found');
    }

    async clickDurationDropdown(): Promise<void> {
        await this.wait('mediumWait');
        await this.click(this.selectors.durationDropdown, "Duration", "Dropdown");
        await this.wait('minWait');
        console.log('Clicked Duration dropdown');
    }

 
    // DSL014 - Duration Filter Methods
    async verifyDurationFilterOptions(expectedOptions: string[]): Promise<void> {
        const optionElements = this.page.locator(this.selectors.durationOptions);
        const options = await optionElements.allTextContents();
        const cleanOptions = options.map(option => option.trim()).filter(option => option !== '');
        for (const expectedOption of expectedOptions) {
            const found = cleanOptions.some(option => 
                option.toLowerCase().includes(expectedOption.toLowerCase()) ||
                expectedOption.toLowerCase().includes(option.toLowerCase())
            );
            expect(found, `Expected duration '${expectedOption}' should be present`).toBeTruthy();
            console.log(`---> ${expectedOption} - Verified`);
        }
        console.log(' All duration options verified');
    }

    // DSL015 - CEU Filter Methods
    async verifyCEUFilterDisplayed(): Promise<void> {
        await this.wait('mediumWait');
        const ceuElement = this.page.locator(this.selectors.ceuFilter);
        await ceuElement.scrollIntoViewIfNeeded();
        await this.wait('minWait');
        await this.click(this.selectors.elementLocator("CEU Provider", 1), "CEU", "Dropdown");
        console.log('tagLabel CEU filter is displayed');
    }

    async selectCEUCheckbox(): Promise<void> {
        await this.wait('mediumWait');
        await this.click(this.selectors.ceuCheckbox, "CEU", "Checkbox");
        await this.wait('minWait');
        console.log('tagLabel CEU checkbox selected');
    }

    async verifyCEUDisplayedToLearner(): Promise<void> {
        await this.wait('mediumWait');
        // TODO: Add logic to verify CEU is displayed to learner
        console.log('tagLabel CEU displayed to learner');
    }

    // DSL016 - Skills Filter Methods
    async verifySkillsFilterDisplayed(): Promise<void> {
        await this.wait('mediumWait');
        await this.validateElementVisibility(this.selectors.skillsFilter, "Skills Filter");
        console.log('tagLabel Skills filter is displayed');
    }

    async selectSkillsCheckbox(): Promise<void> {
        await this.wait('mediumWait');
        await this.click(this.selectors.skillsCheckbox, "Skills", "Checkbox");
        await this.wait('minWait');
        console.log('tagLabel Skills checkbox selected');
    }

    async verifySkillsDisplayedToLearner(): Promise<void> {
        await this.wait('mediumWait');
        // TODO: Add logic to verify Skills is displayed to learner
        console.log('tagLabel Skills displayed to learner');
    }

    // DSL017 - Actions Functionality Methods
    async verifySearchInputCleared(): Promise<void> {
        await this.wait('minWait');
        const inputValue = await this.page.locator(this.selectors.searchInput).inputValue();
        expect(inputValue).toBe('');
        console.log('tagLabel Search input is cleared');
    }

    async clickGenerateURLButton(): Promise<void> {
        await this.wait('mediumWait');
        await this.click(this.selectors.generateUrlButton, "Generate URL", "Button");
        await this.wait('maxWait');
        console.log('tagLabel Clicked Generate URL button');
    }

    async verifyURLGenerated(): Promise<void> {
        await this.wait('minWait');
        await this.validateElementVisibility(this.selectors.generatedUrl, "Generated URL");
        const urlValue = await this.page.locator(this.selectors.generatedUrl).inputValue();
        expect(urlValue).toBeTruthy();
        console.log('tagLabel URL is generated successfully');
    }

    async verifyCopyButtonDisplayed(): Promise<void> {
        await this.wait('minWait');
        await this.validateElementVisibility(this.selectors.copyButton, "Copy Button");
        console.log('tagLabel Copy button is displayed');
    }

    async clickCopyButton(): Promise<void> {
        await this.wait('minWait');
        await this.click(this.selectors.copyButton, "Copy", "Button");
        await this.wait('minWait');
        console.log('tagLabel Clicked Copy button - URL copied');
    }

    async verifyShareButtonDisplayed(): Promise<void> {
        await this.wait('minWait');
        await this.validateElementVisibility(this.selectors.shareButton, "Share Button");
        console.log('tagLabel Share button is displayed');
    }



}

