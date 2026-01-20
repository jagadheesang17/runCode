import path from "path";
import { PlaywrightWrapper } from "../utils/playwright";
import { AdminHomePage } from "./AdminHomePage";
import fs from "fs"
import { filePath } from "../data/MetadataLibraryData/filePathEnv";
import { FakerData } from "../utils/fakerUtils";

export class LocationPage extends AdminHomePage {

    public selectors = {
        ...this.selectors,
        locationLabel: "//h1[text()='Location']",
        createLocationBtn: "//button[text()='CREATE LOCATION']",
        locationName: "//label[text()='Location Name']/following-sibling::input",
        address1Input: "//label[text()='Address 1']/following-sibling::input",
        countryBtn: "//label[text()='Country']/following::button[1]",
        stateBtn: "//label[text()='State/Province']/following::button[1]",
        timezoneBtn: "//label[text()='Time Zone']/following::button[1]",
        cityInput: "//label[text()='City/Town']/following::input[1]",
        zipcodeInput: "//label[text()='Zip Code']/following::input[1]",
        publishBtn: "//button[text()='Publish']",
        commonInputField: "//footer/following::input[1]",
        yesProceedBtn: "//footer/following::button[text()='Yes, Proceed']",
        successMessage: "//h3[contains(text(),'successfully')]",
        locationsValue: "//div[contains(@class,'flex-column justify-content')]//h5",

        //Verifying created location through api
        searchLocation:`//input[contains(@id,'exp-search')]`,
        
        // Location card selectors for verification
        locationCountry: "(//p[@class='card-text text-nowrap text-truncate mb-0'])[3]",
        locationState: "(//p[@class='card-text text-nowrap text-truncate mb-0'])[2]/span[3]",
        
        // Filter selectors
        filterIcon: "//div[text()='Filters']",
        countryFilterDropdown: "(//span[text()='Country']//following::div)[1]",
        stateFilterDropdown: "(//span[text()='State/Province']//following::div)[1]",
        countryFilterSearchInput: "(//span[text()='Country']/following::input[@type='search'])[3]",
        stateFilterSearchInput: "(//span[text()='State/Province']/following::input[@type='search'])[2]",
        filterOption: (value: string) => `//span[text()='${value}']`,
        applyFilterBtn: "//div[text()='Filters']/following::button[text()='Apply']",
        clearFilterBtn: "//div[text()='Filters']/following::button[text()='Clear']",

    }

    async verifyLocationLabel() {
        await this.validateElementVisibility(this.selectors.locationLabel, "Location");
        await this.verification(this.selectors.locationLabel, "Location");
    }

    async clickCreateLocation() {
        await this.wait("mediumWait");
        await this.click(this.selectors.createLocationBtn, "Create Location", "Button");
    }

    async locationName(data: string) {
        await this.wait('mediumWait');
        await this.type(this.selectors.locationName, "Create Location", data);
    }

    async enterAddress(data: string) {
        await this.type(this.selectors.address1Input, "Address1", data);
    }

    async enterCountry(data: string) {
        await this.click(this.selectors.countryBtn, "Country", "Button");
        await this.type(this.selectors.commonInputField, "Input", data);
        await this.click("//span[text()='" + data + "']", "Country", "Dropdown");
    }

    async enterState(data: string) {
        await this.click(this.selectors.stateBtn, "Country", "Button");
        await this.type(this.selectors.commonInputField, "Input", data);
        await this.click("//span[text()='" + data + "']", "Country", "Dropdown");
    }

    async enterTimezone(data: string) {
        await this.click(this.selectors.timezoneBtn, "Country", "Button");
        await this.type(this.selectors.commonInputField, "Input", data);
        await this.click("//span[text()='" + data + "']", "Country", "Dropdown");
    }

    async enterCity(data: string) {
        await this.type(this.selectors.cityInput, "Input", data);
    }

    async enterZipcode(data: string) {
        await this.type(this.selectors.zipcodeInput, "Input", data);
    }

    async clickPublishButton() {
        await this.validateElementVisibility(this.selectors.publishBtn, "Publish");
        await this.click(this.selectors.publishBtn, "Publish", "Button");
    }

    async clickProceed() {
        await this.validateElementVisibility(this.selectors.yesProceedBtn, "Yes,Proceed");
        await this.click(this.selectors.yesProceedBtn, "Yes,Proceed", "Button");
    }

    async verify_successfullMessage() {
        await this.validateElementVisibility(this.selectors.successMessage, "SuccessFull Message");
        await this.verification(this.selectors.successMessage, "successfully");
    }

    async getLocation() {
        await this.wait("mediumWait");
        const file=filePath.location
        const locator = this.page.locator(this.selectors.locationsValue);
        const count = await locator.count();
        let locations: any = [];
       // for (let i = 0; i < count; i++) {
            const location = await locator.nth(0).innerHTML();
            await locations.push(location);
     //   }
        console.log(locations);

        try {
            const filePath = file;
            const fileName = path.join(__dirname, filePath)
            fs.writeFileSync(fileName, JSON.stringify(locations));
            console.log(`Locations saved to ${filePath}`);
        } catch (err) {
            console.error('Error writing file:', err);
        }

    }
    //Verifying created location through api
    async verifyCreatedLocation(data:string) {
        await this.wait("minWait")
        await this.typeAndEnter(this.selectors.searchLocation,"Location Name",data)
        await this.validateElementVisibility(this.selectors.locationsValue, "Location Name");
        await this.verification(this.selectors.locationsValue, data);
    }

    /**
     * Check if location exists for specific country and state, create if not exists
     * @param country - Country name (e.g., "United States")
     * @param state - State name (e.g., "California")
     * @returns true if new location was created, false if already exists
     */
    async createLocationIfNotExists(country: string, state: string): Promise<boolean> {
        await this.wait("mediumWait");
        
        console.log(`\n🔍 Filtering locations by Country: ${country} and State: ${state}`);
        
        // Click filter icon to open filters
        await this.click(this.selectors.filterIcon, "Filter Icon", "Icon");
        await this.wait("minWait");
        
        // Filter by Country
        await this.click(this.selectors.countryFilterDropdown, "Country Filter", "Dropdown");
        await this.wait("minWait");
        
        const countryFilterSearchInput = this.page.locator(this.selectors.countryFilterSearchInput);
        await countryFilterSearchInput.fill(country);
        await this.wait("minWait");
        
        const countryOption = this.page.locator(this.selectors.filterOption(country));
        const isCountryOptionVisible = await countryOption.isVisible().catch(() => false);
        
        if (!isCountryOptionVisible) {
            console.log(`❌ Country "${country}" not found in filter options`);
            await this.click(this.selectors.clearFilterBtn, "Clear Filter", "Button");
            await this.wait("minWait");
            throw new Error(`Country "${country}" not found in location filters`);
        }
        
        await countryOption.click();
        await this.wait("minWait");
        
        // Filter by State/Province
        console.log(`🔍 Adding State filter: ${state}`);
        await this.click(this.selectors.stateFilterDropdown, "State Filter", "Dropdown");
        await this.wait("minWait");
        
        const stateFilterSearchInput = this.page.locator(this.selectors.stateFilterSearchInput);
        await stateFilterSearchInput.fill(state);
        await this.wait("minWait");
        
        const stateOption = this.page.locator(this.selectors.filterOption(state));
        const isStateOptionVisible = await stateOption.isVisible().catch(() => false);
        
        if (isStateOptionVisible) {
            await stateOption.click();
            await this.wait("minWait");
        } else {
            console.log(`⚠️ State "${state}" not found in filter dropdown, will proceed without state filter`);
        }
        
        // Apply the filters - ALWAYS apply regardless of whether location exists
        console.log(`🔄 Applying filters for ${country} - ${state}...`);
        const applyButton = this.page.locator(this.selectors.applyFilterBtn);
        await applyButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.click(this.selectors.applyFilterBtn, "Apply Filter", "Button");
        await this.wait("mediumWait");
        
        // Check if "no results" message appears
        const noResultsMessage = this.page.locator("//h3[text()='There are no results that match your current filters. Try removing some of them to get better results.']");
        const hasNoResults = await noResultsMessage.isVisible().catch(() => false);
        
        if (hasNoResults) {
            // No location exists - need to create new one
            console.log(`📍 No location found for ${country} - ${state}. Creating new location...`);
            
            // Clear filter before creating
            await this.click(this.selectors.filterIcon, "Filter Icon", "Icon");
            await this.wait("minWait");
            await this.click(this.selectors.clearFilterBtn, "Clear Filter", "Button");
            await this.wait("mediumWait");
            
            // Create new location
            await this.clickCreateLocation();
            await this.locationName(`${country} - ${state} Location`);
            await this.enterAddress(FakerData.getAddress());
            await this.enterCountry(country);
            await this.enterState(state);
            
            // Select timezone based on state
            let timezone = "(GMT-08:00/-07:00) Pacific Standard Time (USA)/los_Angeles"; // Default for California
            if (state === "California") {
                timezone = "(GMT-08:00/-07:00) Pacific Standard Time (USA)/los_Angeles";
            } else if (state === "New York") {
                timezone = "(GMT-05:00/-04:00) Eastern Standard Time (USA)/New_York";
            }
            await this.enterTimezone(timezone);
            
            await this.enterCity(FakerData.getLocationName());
            await this.enterZipcode(FakerData.getPinCode());
            await this.clickPublishButton();
            await this.clickProceed();
            await this.verify_successfullMessage();
            
            console.log(`✅ New location created successfully: ${country} - ${state}`);
            return true; // New location was created
        }
        
        // If no "no results" message, location exists
        console.log(`✅ Location already exists with ${country} - ${state}`);
        return false; // Location exists, no need to create
    }



}
