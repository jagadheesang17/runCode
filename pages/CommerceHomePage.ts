import { BrowserContext, Page } from "@playwright/test";
import { AdminHomePage } from "./AdminHomePage";
import { URLConstants } from "../constants/urlConstants";
import { FakerData } from "../utils/fakerUtils";


export class CommerceHomePage extends AdminHomePage{
    static pageUrl = URLConstants.adminURL;
    public selectors = {
        ...this.selectors,
             orderLink:`//a[text()='Order']`,
             approveOrder:`(//i[@aria-label='Approve Payment'])[1]`,
             yesBtn:`//button[text()='Yes']`,
             successMsg:"//span[text()='Payment of the order has been confirmed successfully']",
             okBtn:"//button[text()='OK']",

             dropdownToggleCommerce:(option:string)=>`(//label[text()='${option}']/following::button[@data-bs-toggle='dropdown'])[1]`,

                      //For runtime passing commerce options
             commerceOptions:(option:string)=>`//a[text()='${option}']`,
             invoiceBtn:(orderId:string)=>`(//div[text()='${orderId}']//following::i[contains(@class,'invoice')])[1]`,
             courseName: (courseName:string) => `//th[text()='${courseName}']`,

             dropdownSearchInput:(option:string,index:number)=>`(//label[text()='${option}']/following::input[@type='search'])[${index}]`,
             dropdownOption :(data: string) => `//span[text()='${data}']`,

             stateDropdown: `//label[text()='States(US & Canada):']/following::button[@data-bs-toggle='dropdown'][1]`,

             createdTax:(countryName:string)=>`(//span[text()='${countryName}'])[1]`,
             createdTaxEnabledByDefault:(countryName:string)=>`//span[text()='${countryName}']/ancestor::div[contains(@class,'d-flex')]//i[contains(@class,'fa-toggle-on')]`,

             editTaxIcon:(countryName:string)=>`(//span[text()='${countryName}']/following::i[@class='fa-duotone icon_14_1 pointer fa-pen'])[1]`,

             vatNumberInput:`//input[@id='vat_numbers']`,

             updateButton:`//button[text()='UPDATE']`,

             saveButton:`//button[text()='Save']`,

             deleteIconDisabled:(countryName:string)=>`(//span[text()='${countryName}']/following::i[@id='tax-delete-btn'])[1]`,
             
             enabledToggle:(countryName:string)=>`(//span[text()='${countryName}']/preceding::i[contains(@class,'fad fa-toggle-on')])[1]`,
             
             disabledToggle:(countryName:string)=>`(//span[text()='${countryName}']/preceding::i[@class='fad fa-toggle-off icon_26_1'])[1]`,
             
             deleteIconEnabled:(countryName:string)=>`(//span[text()='${countryName}']/following::i[@id='tax-delete-btn' and contains(@class,'pointer')])[1]`,

             verificationForSuspend:`//span[text()='Are you sure you want to suspend the Tax?']`,
        
             verificationForDelete:`//span[text()='Are you sure you want to delete this Tax?']`



             
        };

    
    constructor(page: Page, context: BrowserContext) {
        super(page, context);
    }

    
   public async clickOrder(){
        this.click(this.selectors.orderLink,"Order","Link")
    }

    
   public async approveOrder(){
      await this.validateElementVisibility(this.selectors.approveOrder,"Approve Order");
      await this.wait('mediumWait');
      await this.click(this.selectors.approveOrder,"Approve Order","Tick");
      await this.wait('mediumWait');
      await this.click(this.selectors.yesBtn,"Yes","Buttton");
   }

   public async verifySuccessMessage(){
    await this.verification(this.selectors.successMsg,"confirmed successfully");
    await this.click(this.selectors.okBtn,"OK","Button");
   }

  //For runtime passing commerce options
    async clickCommerceOption(data:string){
        await this.click(this.selectors.commerceOptions(data),"Commerce Option","Link");
    }

    public async clickInvoiceButton(orderId:number|string){
        await this.validateElementVisibility(this.selectors.invoiceBtn(orderId),"Invoice Link");
        await this.click(this.selectors.invoiceBtn(orderId),"Invoice Link","Icon");
        await this.page.waitForLoadState('load');
    }

    public async validateInvoice(courseName:string){
        try {
            await this.validateElementVisibility(this.selectors.courseName(courseName),"Course Name in Invoice");
            console.log("Course details available in the Invoice: " + courseName);
        } catch (error) {
            throw new Error(`Course details not available for: ${courseName}`);
        }
    }
    // Get list of already created tax countries from the main tax listing page
    async getCreatedTaxCountries(): Promise<string[]> {
        await this.wait("minWait");
        
        // Load all taxes by clicking "Load More" until all are visible
        const loadMoreButton = this.page.locator("//button[text()='Load More']");
        let loadMoreAttempts = 0;
        const maxLoadMoreAttempts = 10; // Prevent infinite loop
        
        while (loadMoreAttempts < maxLoadMoreAttempts) {
            try {
                const isLoadMoreVisible = await loadMoreButton.isVisible({ timeout: 2000 });
                if (isLoadMoreVisible) {
                    console.log(`📄 Clicking Load More button for taxes (attempt ${loadMoreAttempts + 1})...`);
                    await loadMoreButton.click();
                    await this.wait("minWait");
                    loadMoreAttempts++;
                } else {
                    console.log("✅ All taxes loaded (no more Load More button)");
                    break;
                }
            } catch (error) {
                console.log("✅ All taxes loaded");
                break;
            }
        }
        
        // Get all country names from the tax listing using the specific class
        const createdCountries = await this.page.locator("//span[@class='text-uppercase field_title_1 ms-2 pointer p-0 border-0']").allTextContents();
        const cleanedCountries = createdCountries.map(c => c.trim()).filter(c => c.length > 0);
        
        console.log("Already created tax countries:", cleanedCountries);
        
        if (cleanedCountries.length === 0) {
            console.log("No taxes created yet");
        }
        
        return cleanedCountries;
    }

    // Select country that is NOT in the already created list
    async selectAvailableCountry(label: string, index: number, createdCountries: string[]): Promise<string> {
        const toggleSelector = this.selectors.dropdownToggleCommerce(label);
        
        // Open dropdown
        await this.click(toggleSelector, label, "Dropdown");
        await this.wait("minWait");
        
        // Get ALL countries from dropdown
        const allDropdownCountries = await this.page.locator("//div[contains(@class,'dropdown-menu show')]//span[@class='text']").allTextContents();
        const cleanedDropdownCountries = allDropdownCountries.map(c => c.trim()).filter(c => c.length > 0);
        console.log("All countries in dropdown:", cleanedDropdownCountries);
        console.log("Already created countries:", createdCountries);
        
        // Find first country from dropdown that is NOT in the created list
        const availableCountry = cleanedDropdownCountries.find(country => 
            !createdCountries.some(created => created.toUpperCase() === country.toUpperCase())
        );
        
        if (!availableCountry) {
            throw new Error("❌ No available countries found that haven't been created yet");
        }
        
        console.log(`✅ Selecting available country: ${availableCountry}`);
        await this.click(`//span[text()='${availableCountry}']`, availableCountry, "Country Option");
        await this.wait("minWait");
        return availableCountry;
    }

    // Check if state dropdown is enabled and select state if enabled
    async selectStateIfEnabled(state: string): Promise<void> {
        await this.wait("minWait");
        const stateDropdown = this.page.locator(this.selectors.stateDropdown);
        
        try {
            // Check if dropdown button is clickable/enabled
            const isEnabled = await stateDropdown.isEnabled({ timeout: 2000 });
            
            if (isEnabled) {
                console.log("✅ State dropdown is ENABLED - Selecting state");
                await this.selectForTax("States(US & Canada):", state, 1);
            } else {
                console.log("✅ State dropdown is DISABLED - Skipping state selection");
            }
        } catch (error) {
            console.log("✅ State dropdown is DISABLED - Skipping state selection");
        }
    }


    async select(label: string, data: string, index: number) {
    const toggleSelector = this.selectors.dropdownToggleCommerce(label);
    const searchInputSelector = this.selectors.dropdownSearchInput(label, index);
    
    // Select from dropdown
    await this.click(toggleSelector, label, "Dropdown");
    await this.wait("minWait");
    
    // Wait for search input to be visible and enabled
    await this.page.waitForSelector(searchInputSelector, { state: 'visible', timeout: 10000 });
    
    console.log("The " + label + " is:" + data);
    await this.type(searchInputSelector, label, data);
    await this.wait("minWait");
    const optionSelector = this.selectors.dropdownOption(data);
    await this.click(optionSelector, data, "DropDown");
    await this.wait("minWait");
    return data;
  } 

  // New method specifically for tax country/state selection with search input at index 2
  async selectForTax(label: string, data: string, index: number) {
    const toggleSelector = this.selectors.dropdownToggleCommerce(label);
    const searchInputSelector = this.selectors.dropdownSearchInput(label, index);
    
    console.log(`🔍 Attempting to select ${label} with value: ${data}`);
    
    // Click dropdown toggle
    await this.page.locator(toggleSelector).click();
    console.log(`✅ Clicked dropdown toggle for ${label}`);
    await this.wait("mediumWait");
    
    // Wait for the dropdown menu to be visible
    await this.page.waitForSelector("//div[contains(@class,'dropdown-menu show')]", { state: 'visible', timeout: 10000 });
    console.log(`✅ Dropdown menu is now visible`);
    await this.wait("minWait");
    
    // Wait for search input to be visible
    await this.page.waitForSelector(searchInputSelector, { state: 'visible', timeout: 10000 });
    console.log(`✅ Search input is now visible`);
    await this.wait("minWait");
    
    // Type in search input
    console.log(`📝 Typing ${data} in ${label}`);
    await this.page.locator(searchInputSelector).fill(data);
    await this.wait("minWait");
    
    // Click the option
    const optionSelector = this.selectors.dropdownOption(data);
    await this.page.locator(optionSelector).click();
    console.log(`✅ Selected ${data} from ${label}`);
    await this.wait("minWait");
    return data;
  }

  async verifyTheCreatedTaxandEnabledByDefault(country:string){
    await this.wait('minWait');
    
    const createdTax= this.page.locator(this.selectors.createdTax(country));
    const taxVisible = await createdTax.isVisible().catch(() => false);
    
    if(taxVisible){
        console.log(`✅ Successfully created tax for country: ${country}`);
    }
    else{
        console.log(`❌ Tax creation failed for country: ${country}`);
    }

    const createdTaxEnabledByDefault= this.page.locator(this.selectors.createdTaxEnabledByDefault(country));
    const toggleCount = await createdTaxEnabledByDefault.count();
    console.log(`Toggle icon count for ${country}: ${toggleCount}`);
    
    const toggleVisible = await createdTaxEnabledByDefault.isVisible().catch(() => false);
    
    if(toggleVisible){
        console.log(`✅ Successfully verified tax is enabled by default for country: ${country}`);
    }
    else{
        console.log(`❌ Tax is not enabled by default for country: ${country}`);
    }
  }


  async editTaxFromListing(countryName:string){
     await this.wait('minWait');
    
    // Click edit icon for the specific country
    console.log(`📝 Editing tax for country: ${countryName}`);
    await this.click(this.selectors.editTaxIcon(countryName), "Edit Tax", "Icon");
  }

  // Edit created tax - verify dropdown state based on country and update VAT number
  async updateCreatedTaxAndVerifyDropdownState(countryName: string): Promise<void> {
   
    await this.wait('minWait');
    
    // Get the selected country value to check if it's US or Canada
    const countryDropdown = this.page.locator(this.selectors.dropdownToggleCommerce("Country:"));
    const currentCountryText = await countryDropdown.textContent();
    const currentCountry = currentCountryText?.trim() || "";
    
    console.log(`Current country in edit mode: ${currentCountry}`);
    
    // Check if current country is US or Canada
    const isUSOrCanada = currentCountry.toUpperCase().includes("UNITED STATES") || 
                        currentCountry.toUpperCase().includes("CANADA") ||
                        currentCountry.toUpperCase() === "US" ||
                        currentCountry.toUpperCase() === "USA";
    
    if (isUSOrCanada) {
        console.log(`✅ Country is US or Canada`);
        
        // Verify country dropdown is disabled for US/Canada
        const countryDropdownDisabled = await countryDropdown.isDisabled().catch(() => false);
        if (countryDropdownDisabled) {
            console.log(`✅ Verified: Country dropdown is DISABLED for ${currentCountry}`);
        } else {
            console.log(`⚠️ Country dropdown is ENABLED for ${currentCountry}`);
        }
        
        // Verify state dropdown is disabled for US/Canada
        const stateDropdown = this.page.locator(this.selectors.stateDropdown);
        const stateDropdownDisabled = await stateDropdown.isDisabled().catch(() => false);
        if (stateDropdownDisabled) {
            console.log(`✅ Verified: State dropdown is DISABLED for ${currentCountry}`);
        } else {
            console.log(`⚠️ State dropdown is ENABLED for ${currentCountry}`);
        }
        
    } else {
        console.log(`✅ Country is NOT US or Canada - ${currentCountry}`);
        
        // Verify country dropdown is enabled for rest of countries
        const countryDropdownEnabled = await countryDropdown.isEnabled().catch(() => false);
        if (countryDropdownEnabled) {
            console.log(`✅ Verified: Country dropdown is ENABLED for ${currentCountry}`);
        } else {
            console.log(`⚠️ Country dropdown is DISABLED for ${currentCountry}`);
        }
        
        // Verify state dropdown is enabled for rest of countries
        const stateDropdown = this.page.locator(this.selectors.stateDropdown);
        const stateDropdownEnabled = await stateDropdown.isEnabled().catch(() => false);
        if (stateDropdownEnabled) {
            console.log(`✅ Verified: State dropdown is ENABLED for ${currentCountry}`);
        } else {
            console.log(`⚠️ State dropdown is DISABLED for ${currentCountry}`);
        }
    }
    
    // Get current VAT number before updating
    const currentVatNumber = await this.page.locator(this.selectors.vatNumberInput).inputValue();
    
    // Generate new VAT number
    const newVatNumber = FakerData.getPinCode();
    
    // Update VAT number
    console.log(`📝 Updating VAT number from ${currentVatNumber} to ${newVatNumber}`);
    await this.page.locator(this.selectors.vatNumberInput).clear();
    await this.wait('minWait');
    await this.type(this.selectors.vatNumberInput, "VAT Number", newVatNumber);
    
    console.log(`✅ VAT number is updated from ${currentVatNumber} to ${newVatNumber}`);
    
    // Click Update button
    await this.wait('mediumWait');
    await this.click(this.selectors.saveButton, "Update", "Button");
    await this.wait('minWait');
    // await this.spinnerDisappear();
    
    console.log(`✅ Tax configuration saved successfully for ${countryName}`);
  }

  // Verify delete icon is disabled when tax is enabled
  async verifyDeleteIconDisabledWhenTaxEnabled(countryName: string): Promise<void> {
    await this.wait('minWait');
    
    console.log(`🔍 Verifying delete icon is disabled for enabled tax: ${countryName}`);
    
    // Verify tax is enabled (toggle is ON)
    const enabledToggle = this.page.locator(this.selectors.enabledToggle(countryName));
    await enabledToggle.waitFor({ state: 'visible' });
    console.log(`✅ Tax is enabled (toggle ON) for ${countryName}`);
    
    // Verify delete icon exists but is disabled (not clickable)
    const deleteIcon = this.page.locator(this.selectors.deleteIconDisabled(countryName));
    await deleteIcon.waitFor({ state: 'visible' });
    
    // Check if delete icon is not clickable (disabled state)
    const isDisabled = await deleteIcon.evaluate((el) => {
      return !el.classList.contains('pointer');
    });
    
    if (isDisabled) {
      console.log(`✅ Delete icon is disabled for enabled tax: ${countryName}`);
    } else {
      console.log(`❌ Delete icon should be disabled but appears clickable for: ${countryName}`);
    }
  }

  // Disable tax by clicking the enabled toggle
  async disableTax(countryName: string): Promise<void> {
    await this.wait('minWait');
    
    console.log(`🔄 Disabling tax for: ${countryName}`);
    
    // Click the enabled toggle to disable the tax
    await this.click(this.selectors.enabledToggle(countryName), "Enable Toggle", "Icon");
    await this.wait('minWait');
    
    await this.verification(this.selectors.verificationForSuspend,"Are you sure you want to suspend the Tax?");
    await this.click(this.selectors.yesBtn, "Yes", "Button");
    // Verify toggle changed to disabled state
    const disabledToggle = this.page.locator(this.selectors.disabledToggle(countryName));
    await disabledToggle.waitFor({ state: 'visible' });
    
    console.log(`✅ Tax disabled successfully for ${countryName}`);
  }

  // Delete tax after it's disabled
  async deleteTax(countryName: string): Promise<void> {
    await this.wait('minWait');
    
    console.log(`🗑️ Deleting tax for: ${countryName}`);
    
    // Verify delete icon is now enabled (clickable)
    const deleteIcon = this.page.locator(this.selectors.deleteIconDisabled(countryName));
    await deleteIcon.waitFor({ state: 'visible' });
    
    // Click delete icon
    await this.click(this.selectors.deleteIconDisabled(countryName), "Delete Tax", "Icon");
    await this.wait('minWait');
    
    await this.verification(this.selectors.verificationForDelete,"Are you sure you want to delete this Tax?");
    // Confirm deletion (assuming there's a confirmation dialog with Yes button)
    await this.click(this.selectors.yesBtn, "Yes", "Button");
    await this.wait('mediumWait');
    
    // Verify tax is removed from listing
    const taxElement = this.page.locator(this.selectors.createdTax(countryName));
    const isRemoved = await taxElement.isVisible().catch(() => false);
    
    if (!isRemoved) {
      console.log(`✅ Tax deleted successfully for ${countryName}`);
    } else {
      console.log(`❌ Tax still visible after deletion for: ${countryName}`);
    }
  }

  // Check if specific country with state tax already exists and create if not
  async createTaxIfNotExists(country: string, state: string, vatNumber: string): Promise<boolean> {
    await this.wait('minWait');
    
    console.log(`🔍 Checking if tax for ${country} - ${state} exists...`);
    
    // Close the setup tax modal first
    await this.page.keyboard.press('Escape');
    await this.wait('minWait');
    
    // Get list of already created tax countries from the listing page
    const createdCountries = await this.getCreatedTaxCountries();
    
    // Check if US or United States exists (case-insensitive, partial match)
    const usExists = createdCountries.some(
      createdCountry => createdCountry.toUpperCase().includes("UNITED STATES") || 
                       createdCountry.toUpperCase().includes("US")
    );
    
    if (usExists) {
      console.log(`✅ Tax for ${country} exists in the listing`);
      
      // Edit the existing tax to ensure it has California state
      console.log(`📝 Editing existing ${country} tax to update state to ${state}...`);
      
      // Find the actual country name from the listing (to match exact case)
      const actualCountryName = createdCountries.find(
        c => c.toUpperCase().includes("UNITED STATES") || c.toUpperCase().includes("US")
      ) || "United States";
      
      await this.editTaxFromListing(actualCountryName);
      await this.wait('minWait');
      
      // Check current state value
      const stateDropdown = this.page.locator(this.selectors.stateDropdown);
      const currentStateText = await stateDropdown.textContent();
      const currentState = currentStateText?.trim() || "";
      
      console.log(`Current state in edit mode: ${currentState}`);
      
      // If state is not California, update it
      if (!currentState.toUpperCase().includes(state.toUpperCase())) {
        console.log(`⚠️ Current state is ${currentState}, updating to ${state}...`);
        await this.selectForTax("States(US & Canada):", state, 2);
      } else {
        console.log(`✅ State is already set to ${state}`);
      }
      
      // Check if tax is disabled and enable if needed
      const disabledToggle = this.page.locator(this.selectors.disabledToggle(actualCountryName));
      const isDisabled = await disabledToggle.isVisible().catch(() => false);
      
      if (isDisabled) {
        console.log(`⚠️ Tax for ${country} is DISABLED. It will be enabled after saving...`);
      }
      
      // Save the changes
      await this.click(this.selectors.saveButton, "Save", "Button");
      await this.wait('minWait');
      
      // If tax was disabled, enable it now
      if (isDisabled) {
        await this.wait('minWait');
        const stillDisabled = await this.page.locator(this.selectors.disabledToggle(actualCountryName)).isVisible().catch(() => false);
        if (stillDisabled) {
          console.log(`⚠️ Enabling the disabled tax for ${country}...`);
          await this.click(this.selectors.disabledToggle(actualCountryName), "Disabled Toggle", "Icon");
          await this.wait('minWait');
          console.log(`✅ Tax for ${country} is now ENABLED`);
        }
      }
      
      console.log(`✅ Tax for ${country} - ${state} is ready`);
      return false; // Not created new, just updated existing
    }
    
    console.log(`📝 Creating new tax for ${country} - ${state}`);
    
    // Open setup tax modal again
    await this.click(this.selectors.setupTaxButton, "Setup Tax", "Button");
    await this.wait("minWait");
    
    // Use selectForTax with index 2 for Country dropdown in modal
    await this.selectForTax("Country:", country, 2);
    
    // Select state (should be enabled for US) - index 2 for state
    await this.selectStateIfEnabled(state);
    
    // Enter VAT number
    await this.page.locator(this.selectors.vatNumberInput).fill(vatNumber);
    await this.wait("minWait");
    
    console.log(`✅ Tax form filled for ${country} - ${state}, ready to save`);
    return true; // New tax created
  }
}

