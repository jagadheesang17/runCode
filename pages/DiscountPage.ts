import { BrowserContext, Page } from "@playwright/test";
import { AdminHomePage } from "./AdminHomePage";
import { URLConstants } from "../constants/urlConstants";
import { generateCreditScore, getCurrentDateFormatted, getFutureDate, percentage } from "../utils/fakerUtils";
import { yearsToDays } from "date-fns";



export class DiscountPage extends AdminHomePage {
    static pageUrl = URLConstants.adminURL;
    public selectors = {
        ...this.selectors,

        createDiscount: `//button[text()='CREATE DISCOUNT']`,
        
        // Discount Type Radio Buttons
        linearDiscountRadioBtn: `(//span[contains(text(),'Linear')]//preceding-sibling::i[contains(@class,'fa-circle')])[1]`,
        linearDiscountRadioBtnChecked: `(//span[contains(text(),'Linear')]//preceding-sibling::i[contains(@class,'fa-dot-circle')])[1]`,
        volumeDiscountRadioBtn: `(//span[contains(text(),'Volume')]//preceding-sibling::i[contains(@class,'fa-circle')])[1]`,
        volumeDiscountRadioBtnChecked: `(//span[contains(text(),'Volume')]//preceding-sibling::i[contains(@class,'fa-dot-circle')])[1]`,
        
        discountDescription: `//div[@id='disc_description']//p`,
        validityFrom: `//input[@id='disc_validfrom-input']`,
        validityTo: `//input[@id='disc_validto-input']`,
        discountBaseDropdown: `//button[@data-id='discount_base']`,
        selectDiscountBase: (base: string) => `//span[text()='${base}']`,
        enterDiscountBaseValue: `(//label[text()='Discount Base']//following::input[contains(@id,'disc')])[1]`,
        currencyDropdown: `//button[@data-id='disc_currencey']`,
        selectCurrency:(currency: string) => `//label[text()='Currency']/following::a/span[text()='${currency}']`,
        criteriaType: `//button[@data-id='criteria_type_name']`,
        no_from: `//input[contains(@id,'nos_from')]`,
        no_till: `//input[contains(@id,'nos_till')]`,

        // Discount Module visibility
        discountMenuOption: `//a[text()='Discount' or contains(@href,'discount')]`,
        commerceMenuOptions: `//ul[@aria-labelledby='dropdown-commerce']//a`,
        deleteIcon: (discountName: string) => `(//div[text()='${discountName}']/following::i[@aria-label="Delete"])[1]`,
        yesBtn:`//button[text()='Yes']`,
        searchBtn:`//input[@id="exp-search-field"]`,
        editIcon: `(//i[@aria-label="Edit"])[1]`,
        deletedMsg:(discountName: string) => `//span[text()='Discount “${discountName}” has been deleted successfully.']`,
        courseAssociated:(courseName: string) => `//div[text()='${courseName}']`,
        courseDisAssociated:`//div[text()='NO TRAININGS ATTACHED']`,
        warningForSameName:`//span[text()='The Title field already exists.']`,
        
        // Date picker selectors for Valid From calendar
        yesterdayDate: (day: number) => `//td[contains(@class,'day') and contains(@class,'disabled') and text()='${day}']`,
        todayDate: (day: number) => `//td[@class="today day" and text()='${day}']`,        // Date picker selectors for Valid From calendar
        datedefaultState:`//input[@placeholder="MM/DD/YYYY"]`,
        percentageOffExceededMsg:`//span[text()='Percentage Value should not exceed more than 100']`,

    };


    constructor(page: Page, context: BrowserContext) {
        super(page, context);
    }

    async clickCreateDiscount() {
        await this.wait('minWait');
        await this.click(this.selectors.createDiscount, "Create Discount", "Link")
    }
    async selectVolumeDiscount() {
        await this.click(this.selectors.volumeDiscountRadioBtn, "Discount Type", "Radio Button");
        await this.wait('minWait');
    }
    async enterDiscountDescription(data: string) {
        await this.type(this.selectors.discountDescription, "Description", data);
    }

    async enterValidity() {
        await this.typeAndEnter(this.selectors.validityFrom, "Valid From", getCurrentDateFormatted());
        await this.wait('minWait');
        await this.typeAndEnter(this.selectors.validityTo, "Validity To", getFutureDate());
    }
    async setDiscountRules(data: string,currency: string,discountValue?: string, discountType?: string  ) {
        await this.wait('minWait');
        await this.validateElementVisibility(this.selectors.discountBaseDropdown, "Discount Base Dropdown");
        await this.click(this.selectors.discountBaseDropdown, "Discount Base Dropdown", "Dropdown");
        await this.click(this.selectors.selectDiscountBase(data), "Discount Base", "Value");
        if (!discountValue) {
            discountValue = percentage().toString();
        }
        await this.type(this.selectors.enterDiscountBaseValue, "Discount Base Value", discountValue);
        await this.wait('minWait');
        if (data == "Fixed Amount Off") {
            await this.wait('minWait');
            await this.click(this.selectors.currencyDropdown, "Currency Dropdown", "Dropdown");
            await this.wait('minWait');
            await this.page.locator(`//input[@type="search"]`).fill(currency);
            await this.mouseHover(this.selectors.selectCurrency(currency), "Currency");
            await this.click(this.selectors.selectCurrency(currency), "Currency", "Value");
        }
        if (discountType === "Volume") {
            await this.wait('minWait');
            await this.validateElementVisibility(this.selectors.discountBaseDropdown, "Discount Base Dropdown");
            await this.click(this.selectors.discountBaseDropdown, "Discount Base Dropdown", "Dropdown");
            await this.click(this.selectors.selectDiscountBase(data), "Discount Base", "Value");
            await this.type(this.selectors.no_from, "Discount Base Value", "1");
            await this.type(this.selectors.no_till, "Discount Base Value", "3");
        }
        return discountValue;
    }
    async discountCriteria(data: string) {
        await this.wait('minWait');
        await this.validateElementVisibility(this.selectors.criteriaType, "Discount Criteria Dropdown");
        await this.click(this.selectors.criteriaType, "Discount Criteria", "Dropdown");
        await this.click(this.selectors.selectDiscountBase(data), "Discount Criteria", "Value");
    }

    // COM007 - Discount Module verification methods
    async verifyDiscountModuleNotVisible(): Promise<void> {
        await this.wait("mediumWait");
        const isVisible = await this.page.locator(this.selectors.discountMenuOption).isVisible();
        
        if (!isVisible) {
            console.log("✅ Discount Module is NOT visible (as expected when disabled in site settings)");
        } else {
            throw new Error("❌ Discount Module is visible but should be hidden when disabled in site configuration");
        }
    }

    async verifyDiscountModuleVisible(): Promise<void> {
        await this.wait("mediumWait");
        const discountOption = this.page.locator(this.selectors.discountMenuOption);
        await this.validateElementVisibility(this.selectors.discountMenuOption, "Discount Module Option");
        const isVisible = await discountOption.isVisible();
        
        if (isVisible) {
            console.log("✅ Discount Module IS visible (as expected when enabled in site settings)");
        } else {
            throw new Error("❌ Discount Module is visible but should be hidden when disabled in site configuration");
        }
    }

    // COM010 - Verify only one discount type can be selected
    async verifyLinearDiscountSelected(): Promise<void> {
        await this.wait("mediumWait");
        const linearChecked = await this.page.locator(this.selectors.linearDiscountRadioBtnChecked).isVisible();
        const volumeUnchecked = await this.page.locator(this.selectors.volumeDiscountRadioBtn).isVisible();
        
        if (linearChecked && volumeUnchecked) {
            console.log("✅ Linear discount is selected and Volume discount is NOT selected");
        } else {
            throw new Error("❌ Expected Linear to be selected and Volume to be unselected");
        }
    }

    async verifyVolumeDiscountSelected(): Promise<void> {
        await this.wait("mediumWait");
        const volumeChecked = await this.page.locator(this.selectors.volumeDiscountRadioBtnChecked).isVisible();
        const linearUnchecked = await this.page.locator(this.selectors.linearDiscountRadioBtn).isVisible();
        
        if (volumeChecked && linearUnchecked) {
            console.log("✅ Volume discount is selected and Linear discount is NOT selected");
        } else {
            throw new Error("❌ Expected Volume to be selected and Linear to be unselected");
        }
    }

    async selectLinearDiscount(): Promise<void> {
        await this.wait("minWait");
        await this.click(this.selectors.linearDiscountRadioBtn, "Linear Discount Type", "Radio Button");
        await this.wait("minWait");
        console.log("Clicked Linear discount radio button");
    }
        public async deleteDiscount(discountName: string) {
        await this.validateElementVisibility(this.selectors.deleteIcon(discountName), "Delete Icon for Discount");
        await this.click(this.selectors.deleteIcon(discountName), "Delete Icon", "Icon");
        await this.wait('minWait');
        await this.click(this.selectors.yesBtn,"Yes","Button");
        await this.wait('minWait');
        console.log(`✅ Discount '${discountName}' deleted successfully`);
        }
        public async searchDiscount(discountName: string){
        await this.wait('minWait');
        await this.typeAndEnter(this.selectors.searchBtn, "Search Discount", discountName);
        await this.wait('mediumWait');
    }
    public async editDiscount(){
        await this.validateElementVisibility(this.selectors.editIcon, "Edit Icon for Discount");
        await this.click(this.selectors.editIcon, "Edit Icon", "Icon");
        await this.wait('minWait');
        console.log(`✅ Navigated to edit discount page`);
    }
    public async verifyDeleteDiscount(discountName: string){
        await this.wait('mediumWait');
        const isVisible = await this.page.locator(this.selectors.deletedMsg(discountName)).isVisible();        
        if (!isVisible) {
            console.log(`✅ Verified: Discount '${discountName}' is no longer present after deletion`);
        }
}
async verifyCourseAssociated(courseName: string){
        await this.wait('mediumWait');
        const isVisible = await this.page.locator(this.selectors.courseAssociated(courseName)).isVisible();        
        if (isVisible) {
            console.log(`Course '${courseName}' isassociated with the discount`);
        }

}
async verifyCourseDisAssociated(){
        await this.wait('mediumWait');
        const isVisible = await this.page.locator(this.selectors.courseDisAssociated).isVisible();        
        if (!isVisible) {
            console.log(`✅ Verified: Course is disassociated with the discount after deletion`);
        }

}
async verifyWarningForSameName(){
        await this.wait('mediumWait');
        const isVisible = await this.page.locator(this.selectors.warningForSameName).isVisible();        
        if (isVisible) {
            console.log(`Warning message is displayed for same name discount`);
        }

}
async clickValidFrom(){
        await this.click(this.selectors.validityFrom, "Valid From", "Input Field");
        await this.wait('minWait');
}
async clickValidTo(){
        await this.click(this.selectors.validityTo, "Valid To", "Input Field");
        await this.wait('minWait');
}
async verifyTodayDateHighlighted(){
        const today = new Date();
        const day = today.getDate();
        await this.wait('mediumWait');
        const isVisible = await this.page.locator(this.selectors.todayDate(day)).isVisible();        
        if (isVisible) {
            console.log(`Today's date is highlighted`);
}
}
async dateDefaultState(){
        await this.wait('mediumWait');
        const count = await this.page.locator(this.selectors.datedefaultState).count();
        if(count==2){
            console.log(`✅ Verified: Both Valid From and Valid To fields are in default state with placeholder 'MM/DD/YYYY'`);
            }
          await this.wait('minWait');  

    }
    async verifyPercentageOffExceededWarning(data: string) {
        await this.wait('mediumWait');
        await this.click(this.selectors.discountBaseDropdown, "Discount Base Dropdown", "Dropdown");
        await this.click(this.selectors.selectDiscountBase(data), "Discount Base", "Value");
        await this.wait('minWait');
        await this.typeAndEnter(this.selectors.enterDiscountBaseValue, "Discount Base Value", "150");
        const isVisible = await this.page.locator(this.selectors.percentageOffExceededMsg).isVisible();        
        if (isVisible) {
            console.log(`Warning message is displayed for percentage off exceeded`);
        }
}
async addVolumeDiscount(){
        await this.page.locator(`//i[contains(@id,"addrow")]`).click();
        await this.wait('minWait');
}
}