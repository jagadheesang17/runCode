import { time } from "console";
import { FakerData, getcardExpiryDate, getCreditCardNumber, getCVV, getPonumber, getRandomLocation } from "../utils/fakerUtils";
import { LearnerHomePage } from "./LearnerHomePage";
import { URLConstants } from "../constants/urlConstants";
import { expect } from "@playwright/test";


export class CostcenterPage extends LearnerHomePage {
    public selectors = {
        ...this.selectors,
        orderSummaryLabel: "//div[text()='order summary']",
        okButton: `//p[text()='Add to cart']/following::button[text()='Ok']`,
        supportOkButton:`//button[text()='Ok']`,
        firstName: `//label[text()='First Name']/following-sibling::input`,
        lastName: `//label[text()='Last Name']/following-sibling::input`,
        savedAddress:`(//label[text()='Saved Address']/following::button)[1]`,
        searchAddress:`//footer/following::input`,
        selectAddress:(addressName:string)=>`//li//span[text()='${addressName}']`,
        address: `//label[text()='Address1']/following-sibling::input`,
        countrySelect: `//label[text()='Country']/following::button[@data-id='country']`,
        ddOption: `//div[@class='dropdown-menu show']//input[@aria-label='Search']`,
        countryName: (countryName: string) => `//span[text()= '${countryName}']`,
        stateField: `//div[@id='wrapper-state']//button[@data-id='state']`,
        cityTown: `//label[text()='City/Town']/following-sibling::input`,
        zipcode: `//label[text()='Zip Code']/following-sibling::input`,
        paymentMode: `//div[@id='wrapper-payment_mode']`,
        paymentOption: (option: number) => `(//div[@id='wrapper-payment_mode']/following::ul//a)[${option}]`,
        paymentMethod: (option: string) => `//span[text()='${option}']`,
        cardNumber: `//label[text()='Card Number']/following-sibling::input`,
        expiryDate: `//label[text()='Expiration Date']/following-sibling::input`,
        cvvNumber: `(//span[text()='cvv']/following::input)[1]`,
        poNumber: `//label[text()='PO number:']/following-sibling::input`,
        termsAndCondition: `//label[text()=' I agree to the ']/i[2]`,
        checkOut: `//button[text()='check out']`,
        chkOutAddress: `//label[text()='Address Name']/following::div/input`,
        createButton: `//button[text()='create']`,
        successMsg: `//h3[contains(text(),' Thank you for your order')]`,
        costCenterInput: "//label[text()='Cost center:']//following-sibling::input",
        addressYouEnteredPopup:"//p[contains(text(),'The address you entered has not been created.')]",
        // :"//label[text()='City/Town']//parent::div//input"
        paymentMethodValue: "//label[text()='Payment Method']/parent::div//div[@class='filter-option-inner-inner']",
        paymentMethodInput:"//label[text()='PO number:']//following-sibling::input",
        
        // Order Summary - Course Details
        courseTitle: (courseName: string) => `//span[@class='field_title_1 ms-1' and text()='${courseName}']`,
        courseUserCount: (courseName: string) => `//span[@class='field_title_1 ms-1' and text()='${courseName}']/ancestor::div[@class='row p-2 mx-0 background_5' or @class='row p-2 mx-0 background_3']//span[@class='branding-color pointer']`,
        coursePrice: (courseName: string) => `//span[@class='field_title_1 ms-1' and text()='${courseName}']/ancestor::div[@class='row p-2 mx-0 background_5' or @class='row p-2 mx-0 background_3']//div[@class='col-1']//div[@class='rawtxt text-capitalize' and contains(text(),'$')]`,
        courseTotal: (courseName: string) => `//span[@class='field_title_1 ms-1' and text()='${courseName}']/ancestor::div[@class='row p-2 mx-0 background_5' or @class='row p-2 mx-0 background_3']//div[@class='col-2']//div[@class='text-end rawtxt text-capitalize' and contains(text(),'$')]`,
        subTotalValue: `//div[text()='Sub Total :']/following::div[@class='field_title_1 text-end'][1]`,
        discountValue: `//div[text()='Discount :']/following::div[@class='field_title_1 text-end'][1]`,
        grandTotalValue: `//div[contains(text(),'Grand Total :')]/following::div[@class='field_title_1 text-end'][1]`,
        termsAndContionLink:`//a[text()='Terms and Conditions']`,
        
        // Billing Details - Order Summary Page (Read-only fields)
        billingZipCode: `//div[text()='billing details']/following-sibling::div[contains(@class,'border')]//label[text()='Zip Code']/following-sibling::input`,
        billingAddress: `//div[text()='billing details']/following-sibling::div[contains(@class,'border')]//label[text()='Address']/following-sibling::textarea`,
        billingName: `//div[text()='billing details']/following-sibling::div[contains(@class,'border')]//label[text()='Name']/following-sibling::input`,
        billingContactNumber: `//label[normalize-space()='Contact Number']/following-sibling::input`,

        taxValue: "(//span[text()='Tax :']/following::span[@data-bs-toggle='tooltip'])[1]",
        adminTaxValue: "(//div[text()='Tax :']/following::div[@class='field_title_1 text-end'])[1]",
    };

    public async orderSummaryLabelVerify() {
        await this.spinnerDisappear();
        await this.validateElementVisibility(this.selectors.orderSummaryLabel, "Order Summary");
    }

    public async clickOktoorder() {
        await this.click(this.selectors.okButton, "OK ", "Button")
    }

    public async billingDetails(countryName: string,cityName:string) {
        await this.type(this.selectors.address, "Address", FakerData.getAddress())
        await this.click(this.selectors.countrySelect, "Country", "Dropdown")
        await this.type(this.selectors.ddOption, "Country", countryName)
        await this.mouseHover(this.selectors.countryName(countryName), "Country")
        await this.click(this.selectors.countryName(countryName), "Country", "Option")
        await this.click(this.selectors.stateField, "state", "Dropdown")
        await this.type(this.selectors.ddOption, "state", cityName);
        await this.mouseHover(this.selectors.countryName(cityName), "City/Town");
        await this.click(this.selectors.countryName(cityName), "city/Town", "Option");
        await this.type(this.selectors.cityTown, "CityTown", FakerData.randomCityName());
        await this.type(this.selectors.zipcode, "Zipcode", getPonumber())
    }

   

    public async paymentMethod(payMode: string) {
        await this.validateElementVisibility(this.selectors.paymentMode, "Payment mode")
        await this.click(this.selectors.paymentMode, "Payment Mode", "Field")
        await this.click(this.selectors.paymentMethod(payMode), "Payment Mode", "Option")
    }

    public async fillCostCenterInput(){
        await this.type(this.selectors.costCenterInput,"Input","67675545546");
    }

    // Verify tax value changes from 0.00 to calculated amount after billing details and calculate tax
    // Accepts an optional selector to support both learner and admin pages (default uses learner-side `taxValue`).
    public async verifyTaxValueAfterBillingDetails(selector?: string): Promise<void> {
        const sel = selector || this.selectors.taxValue;
        await this.wait('minWait');

        // Scroll to tax element before reading initial value
        await this.page.locator(sel).scrollIntoViewIfNeeded();
        await this.wait('minWait');

        // Get initial tax value (should be 0.00)
        const initialTaxValue = await this.page.locator(sel).textContent();
        const cleanedInitialValue = initialTaxValue?.trim() || "";
        console.log(`📊 Initial Tax value (${sel}): ${cleanedInitialValue}`);

        if (cleanedInitialValue === "0.00" || cleanedInitialValue === "$0.00") {
            console.log("✅ Verified: Initial tax value is 0.00 before billing details");
        }

        await this.wait('mediumWait');

        // Scroll to tax element before reading updated value
        await this.page.locator(sel).scrollIntoViewIfNeeded();
        await this.wait('minWait');

        // Get updated tax value after calculate tax button
        const updatedTaxValue = await this.page.locator(sel).textContent();
        const cleanedUpdatedValue = updatedTaxValue?.trim() || "";
        console.log(`📊 Updated Tax value after billing details (${sel}): ${cleanedUpdatedValue}`);

        // Verify tax value has changed from 0.00 - MUST CHANGE OR TEST FAILS
        if (cleanedUpdatedValue !== "0.00" && cleanedUpdatedValue !== "$0.00" && cleanedUpdatedValue !== cleanedInitialValue) {
            console.log(`✅ Tax value successfully changed from ${cleanedInitialValue} to ${cleanedUpdatedValue}`);
        } else {
            throw new Error(`❌ TEST FAILED: Tax value did not change from 0.00 after selecting US + California. Current value: ${cleanedUpdatedValue}`);
        }
    }

    // Note: admin-specific verification removed — use `verifyTaxValueAfterBillingDetails(this.selectors.adminTaxValue)` instead.
    // public async fillCreditDetails() {
    //     await this.type(this.selectors.cardNumber, "Card Number", getCreditCardNumber())
    //     await this.type(this.selectors.expiryDate, "Expiry Date", getcardExpiryDate())
    //     await this.type(this.selectors.cvvNumber, "CVV number", getCVV())
    // }

    public async enterPOnumber() {
        await this.type(this.selectors.poNumber, "PO Number", getPonumber())
    }

    public async clickTermsandCondition() {
        await this.click(this.selectors.termsAndCondition, "TermsandCondition", "Checkbox");
    }

    public async selectSavedAddressDropdown(address:string){
        await this.click(this.selectors.savedAddress,"Address","Dropdown")
        await this.type(this.selectors.searchAddress,"Address",address)
        await this.click(this.selectors.selectAddress(address),"Saved Address","Dropdown")
    }


    public async clickCheckout(address:string) {
        await this.validateElementVisibility(this.selectors.checkOut, "checkout",);
        await this.click(this.selectors.checkOut, "checkout", "button");
        await this.wait('mediumWait');
        const popup = this.page.locator(this.selectors.addressYouEnteredPopup);
        if(await popup.isVisible()){
            await this.type(this.selectors.chkOutAddress,"Address Name",FakerData.addressName());
            await this.click(this.selectors.createButton,"Create","Button");
            await this.click(this.selectors.createButton, "Create", "button");
        }else{
            await this.click(this.selectors.supportOkButton,"ContactSupport"," OK Button")
        }
      //  await this.page.pause();
    }


    public async verifySuccessMsg() {
        await this.validateElementVisibility(this.selectors.successMsg, "toastMessage")
        await this.verification(this.selectors.successMsg, "thank you")
    }

    public async fillPaymentMethodInput(){
        await this.type(this.selectors.paymentMethodInput,"Input","67675545546");
    }
	
    
	  public async fillCreditDetails() {
	  
	  //Existing step
        // await this.type(this.selectors.cardNumber, "Card Number", getCreditCardNumber())
        // await this.type(this.selectors.expiryDate, "Expiry Date", getcardExpiryDate())
        // await this.type(this.selectors.cvvNumber, "CVV number", getCVV())
     
	  //New step, retriving default credit card details from URLConstants page
        await this.type(this.selectors.cardNumber, "Card Number", URLConstants.creditCardNumber)
        await this.type(this.selectors.expiryDate, "Expiry Date", URLConstants.cardExpiryDate)
        await this.type(this.selectors.cvvNumber, "CVV number", URLConstants.cVV)
    }

      async verifyDiscountValue() {
        await this.wait("minWait");
        const discountText = await this.page.locator(this.selectors.discountValue).textContent();
        if (!discountText) {
            throw new Error("Discount value element not found or empty.");
        }
        const value = discountText.trim();
        expect(value).not.toContain('0.00');
        if (value.includes('0.00')) {
            throw new Error(`Discount value is 0.00, which is not expected. Actual value: ${value}`);
        } else {
            console.log(`Discount value is valid: ${value}`);
        }
    }
    async enterUserContactDetails(){
        await this.type(this.selectors.firstName,"First Name", FakerData.getFirstName());
        await this.type(this.selectors.lastName,"Last Name",FakerData.getLastName());
    }

    /**
     * Validate course title(s) is/are displayed in order summary
     * @param courseName - Single course name or array of course names to validate
     */
    async validateCourseTitle(courseName: string | string[]): Promise<void> {
        const courseNames = Array.isArray(courseName) ? courseName : [courseName];
        
        console.log(`Validating ${courseNames.length} course title(s)...`);
        
        for (const course of courseNames) {
            console.log(`  Validating course title: ${course}`);
            const courseLocator = this.page.locator(this.selectors.courseTitle(course));
            await this.validateElementVisibility(this.selectors.courseTitle(course), `Course: ${course}`);
            const isVisible = await courseLocator.isVisible();
            expect(isVisible).toBe(true);
            console.log(`   Course "${course}" is displayed in order summary`);
        }
        
        console.log(` All ${courseNames.length} course(s) validated successfully`);
    }

    /**
     * Get and validate user count for a specific course
     * @param courseName - Name of the course
     * @param expectedCount - Expected number of users (optional)
     * @returns Actual user count as number
     */
    async validateCourseUserCount(courseName: string, expectedCount?: number): Promise<number> {
        console.log(`Validating user count for course: ${courseName}`);
        const userCountLocator = this.page.locator(this.selectors.courseUserCount(courseName));
        await this.wait("minWait");
        
        const userCountText = await userCountLocator.textContent();
        const actualCount = parseInt(userCountText?.trim() || "0", 10);
        
        console.log(`User count for "${courseName}": ${actualCount}`);
        
        if (expectedCount !== undefined) {
            expect(actualCount).toBe(expectedCount);
            console.log(` User count matches expected: ${expectedCount}`);
        }
        
        return actualCount;
    }

    /**
     * Get and validate price for a specific course
     * @param courseName - Name of the course
     * @param expectedPrice - Expected price as number (e.g., 315.00 or "315")
     * @returns Actual price as number
     */
    async validateCoursePrice(courseName: string, expectedPrice?: number | string): Promise<number> {
        console.log(`Validating price for course: ${courseName}`);
        const priceLocator = this.page.locator(this.selectors.coursePrice(courseName));
        await this.wait("minWait");
        
        const priceText = await priceLocator.textContent();
        const numericValue = priceText?.replace(/[^0-9.]/g, '') || '0';
        const actualPrice = parseFloat(numericValue);
        
        console.log(`Price for "${courseName}": ${actualPrice} (from: "${priceText}")`);
        
        if (expectedPrice !== undefined) {
            const expected = typeof expectedPrice === 'string' ? parseFloat(expectedPrice) : expectedPrice;
            expect(actualPrice).toBe(expected);
            console.log(` Price for "${courseName}" expected: ${expected}`);
        }
        
        return actualPrice;
    }

    /**
     * Get and validate total for a specific course
     * @param courseName - Name of the course
     * @param expectedTotal - Expected total as number (e.g., 315.00 or "315")
     * @returns Actual total as number
     */
    async validateCourseTotal(courseName: string, expectedTotal?: number | string): Promise<number> {
        console.log(`Validating total for course: ${courseName}`);
        const totalLocator = this.page.locator(this.selectors.courseTotal(courseName));
        await this.wait("minWait");
        
        const totalText = await totalLocator.textContent();
        const numericValue = totalText?.replace(/[^0-9.]/g, '') || '0';
        const actualTotal = parseFloat(numericValue);
        
        console.log(`Total for "${courseName}": ${actualTotal} (from: "${totalText}")`);
        
        if (expectedTotal !== undefined) {
            const expected = typeof expectedTotal === 'string' ? parseFloat(expectedTotal) : expectedTotal;
            expect(actualTotal).toBe(expected);
            console.log(` Total for "${courseName}" matches expected: ${expected}`);
        }
        
        return actualTotal;
    }

    /**
     * Get and validate Sub Total amount
     * @param expectedSubTotal - Expected sub total as number (e.g., 1314.00 or "1314")
     * @returns Actual sub total as number
     */
    async validateSubTotal(expectedSubTotal: number | string): Promise<number> {
        console.log(`Validating Sub Total...`);
        await this.wait("minWait");
        
        const subTotalLocator = this.page.locator(this.selectors.subTotalValue);
        const subTotalText = await subTotalLocator.textContent();
        const numericValue = subTotalText?.replace(/[^0-9.]/g, '') || '0';
        const actualSubTotal = parseFloat(numericValue);
        
        console.log(`Sub Total: ${actualSubTotal} (from: "${subTotalText}")`);
        
        const expected = typeof expectedSubTotal === 'string' ? parseFloat(expectedSubTotal) : expectedSubTotal;
        expect(actualSubTotal).toBe(expected);
        console.log(` Sub Total matches expected: ${expected}`);
        
        return actualSubTotal;
    }

    /**
     * Get Sub Total as numeric value
     * @returns Sub Total as number
     */
    async getSubTotal(): Promise<number> {
        await this.wait("minWait");
        const subTotalLocator = this.page.locator(this.selectors.subTotalValue);
        const subTotalText = await subTotalLocator.textContent();
        
        // Extract numeric value from "$ 1314.00 USD"
        const numericValue = subTotalText?.replace(/[^0-9.]/g, '') || '0';
        const subTotal = parseFloat(numericValue);
        
        console.log(`Sub Total amount: ${subTotal} (from: "${subTotalText}")`);
        return subTotal;
    }

    /**
     * Get and validate Grand Total amount
     * @param expectedGrandTotal - Expected grand total as number (optional, e.g., 1314.00 or "1314")
     * @returns Actual grand total as number
     */
    async validateGrandTotal(expectedGrandTotal?: number | string): Promise<number> {
        console.log(`Validating Grand Total...`);
        await this.wait("minWait");
        
        const grandTotalLocator = this.page.locator(this.selectors.grandTotalValue);
        const grandTotalText = await grandTotalLocator.textContent();
        const numericValue = grandTotalText?.replace(/[^0-9.]/g, '') || '0';
        const actualGrandTotal = parseFloat(numericValue);
        
        console.log(`Grand Total: ${actualGrandTotal} (from: "${grandTotalText}")`);
        
        if (expectedGrandTotal !== undefined) {
            const expected = typeof expectedGrandTotal === 'string' ? parseFloat(expectedGrandTotal) : expectedGrandTotal;
            expect(actualGrandTotal).toBe(expected);
            console.log(` Grand Total matches expected: ${expected}`);
        }
        
        return actualGrandTotal;
    }

    /**
     * Validate complete course details in order summary
     * @param courseName - Name of the course
     * @param expectedUserCount - Expected number of users
     * @param expectedPrice - Expected price as number
     * @param expectedTotal - Expected total as number
     */
    async validateCourseDetails(
        courseName: string,
        expectedUserCount: number,
        expectedPrice: number | string,
        expectedTotal: number | string
    ): Promise<void> {
        console.log(`\n📋 Validating complete details for course: ${courseName}`);
        
        await this.validateCourseTitle(courseName);
        await this.validateCourseUserCount(courseName, expectedUserCount);
        await this.validateCoursePrice(courseName, expectedPrice);
        await this.validateCourseTotal(courseName, expectedTotal);
        
        console.log(` All validations passed for course: ${courseName}\n`);
    }

    /**
     * Validate currency across all price fields in order summary
     * @param expectedCurrency - Expected currency code (e.g., "USD", "EUR", "GBP")
     */
    async validateCurrency(expectedCurrency: string): Promise<void> {
        console.log(`Validating currency: ${expectedCurrency.toUpperCase()}`);
        await this.wait("minWait");
        
        const currencyUpper = expectedCurrency.toUpperCase();
        
        // Get all price elements that contain currency
        const priceElements = [
            this.selectors.subTotalValue,
            this.selectors.discountValue,
            this.selectors.taxValue,
            this.selectors.grandTotalValue
        ];
        
        // Also check individual course prices
        const coursePrices = await this.page.locator(`//div[@class='rawtxt text-capitalize' and contains(text(),'$')]`).all();
        
        let allValid = true;
        const invalidElements: string[] = [];
        
        // Validate main price elements
        for (const selector of priceElements) {
            const element = this.page.locator(selector);
            const text = await element.textContent();
            
            if (text && !text.includes(currencyUpper)) {
                allValid = false;
                invalidElements.push(`${selector}: ${text}`);
                console.log(`❌ Currency mismatch in ${selector}: ${text}`);
            } else {
                console.log(` Currency validated in ${selector}: ${text}`);
            }
        }
        
        // Validate course price currencies
        for (const priceElement of coursePrices) {
            const text = await priceElement.textContent();
            if (text && !text.includes(currencyUpper)) {
                allValid = false;
                invalidElements.push(`Course price: ${text}`);
                console.log(`❌ Currency mismatch in course price: ${text}`);
            }
        }
        
        if (allValid) {
            console.log(` All prices display currency: ${currencyUpper}`);
        } else {
            throw new Error(`Currency validation failed. Expected: ${currencyUpper}. Invalid elements: ${invalidElements.join(', ')}`);
        }
    }

async clickTermsAndConditionLink() {

    // Wait for new tab opening
    const [newPage] = await Promise.all([
        this.page.context().waitForEvent("page"),
        this.click(this.selectors.termsAndContionLink, "Terms and Conditions", "Link")
    ]);

    await newPage.waitForLoadState("domcontentloaded");

    // Return the new tab to test level
    return newPage;
}

/**
 * Get Discount value as numeric value
 * @returns Discount value as number
 */
async getDiscountValue(): Promise<number> {
    await this.wait("minWait");
    const discountLocator = this.page.locator(this.selectors.discountValue);
    const discountText = await discountLocator.textContent();
    
    // Extract numeric value from "$ 0.00 USD" or similar format
    const numericValue = discountText?.replace(/[^0-9.-]/g, '') || '0';
    const discountValue = parseFloat(numericValue);
    
    console.log(`Discount value: ${discountValue} (from: "${discountText}")`);
    return discountValue;
}

/**
 * Validates that all billing details fields are disabled (readonly) in the order summary page
 * Checks: Name, Address, Contact Number, and Zip Code fields
 */
async validateBillingDetailsAreReadOnly() {
    console.log("\n🔍 Validating Billing Details fields are disabled...");
    console.log("─".repeat(60));
    
    const fieldsToValidate = [
        { locator: this.selectors.billingName, name: 'Name' },
        { locator: this.selectors.billingAddress, name: 'Address' },
        { locator: this.selectors.billingContactNumber, name: 'Contact Number' },
        { locator: this.selectors.billingZipCode, name: 'Zip Code' }
    ];
    
    let allFieldsDisabled = true;
    
    for (const field of fieldsToValidate) {
        try {
            // Wait for element to be visible
            await this.validateElementVisibility(field.locator, `Billing ${field.name}`);
            
            // Check if readonly attribute exists
            const isReadonly = await this.page.locator(field.locator).getAttribute('readonly');
            
            if (isReadonly !== null) {
                console.log(`✅ ${field.name}: Disabled (readonly attribute present)`);
            } else {
                console.log(`❌ ${field.name}: NOT disabled (readonly attribute missing)`);
                allFieldsDisabled = false;
            }
        } catch (error) {
            console.log(`❌ ${field.name}: Validation failed - ${error.message}`);
            allFieldsDisabled = false;
        }
    }
    
    console.log("─".repeat(60));
    
    if (allFieldsDisabled) {
        console.log("✅ All billing details fields are disabled");
    } else {
        throw new Error("❌ Some billing details fields are not disabled");
    }
    
    return allFieldsDisabled;
}



}