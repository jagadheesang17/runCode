import { BrowserContext, Page } from "@playwright/test";
import { AdminHomePage } from "./AdminHomePage";
import { URLConstants } from "../constants/urlConstants";
import { generateCreditScore, getCurrentDateFormatted, getFutureDate, percentage } from "../utils/fakerUtils";



export class DiscountPage extends AdminHomePage {
    static pageUrl = URLConstants.adminURL;
    public selectors = {
        ...this.selectors,

        createDiscount: `//button[text()='CREATE DISCOUNT']`,
        volumeDiscountRadioBtn: `(//span[contains(text(),'Volume')]//preceding-sibling::i[contains(@class,'fa-circle')])[1]`,
        discountDescription: `//div[@id='disc_description']//p`,
        validityFrom: `//input[@id='disc_validfrom-input']`,
        validityTo: `//input[@id='disc_validto-input']`,
        discountBaseDropdown: `//button[@data-id='discount_base']`,
        selectDiscountBase: (base: string) => `//span[text()='${base}']`,
        enterDiscountBaseValue: `(//label[text()='Discount Base']//following::input[contains(@id,'disc')])[1]`,
        currencyDropdown: `//button[@data-id='disc_currencey']`,
        selectCurrency: `//label[text()='Currency']/following::a/span[text()='US Dollar']`,
        criteriaType: `//button[@data-id='criteria_type_name']`,
        no_from: `//input[contains(@id,'nos_from')]`,
        no_till: `//input[contains(@id,'nos_till')]`,
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
    async setDiscountRules(data: string, discountType?: string) {
        await this.wait('minWait');
        await this.validateElementVisibility(this.selectors.discountBaseDropdown, "Discount Base Dropdown");
        await this.click(this.selectors.discountBaseDropdown, "Discount Base Dropdown", "Dropdown");
        await this.click(this.selectors.selectDiscountBase(data), "Discount Base", "Value");
        let discountValue = percentage().toString()
        await this.type(this.selectors.enterDiscountBaseValue, "Discount Base Value", discountValue);
        if (data === "Fixed Amount Off") {
            await this.click(this.selectors.currencyDropdown, "Currency Dropdown", "Dropdown");
            await this.click(this.selectors.selectCurrency, "Currency", "Value");
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
}

