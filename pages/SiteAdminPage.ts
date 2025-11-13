import { AdminHomePage } from "./AdminHomePage";
import { BrowserContext, Page } from "@playwright/test";
import fs from 'fs'
import path from "path";
import { URLConstants } from "../constants/urlConstants";
import { getRandomItemFromFile } from "../utils/jsonDataHandler";


export class SiteAdminPage extends AdminHomePage {
emailUsed:string="";
    public selectors = {
        ...this.selectors,
        siteSettingsLabel: "//div[text()='Site Settings']",
        ////SSO////
        learnerConfigLocator: "//div[text()='Learner Configuration']",
        adminConfigLocator: "//div[text()='Admin Configuration']",
        learnerSignInLabel: "//span[text()='Sign In & Sign Up']",
        portalList: (data: string) => `//nav[@id='portaltab']//following::button[contains(@class,'h2') and text()='${data}']`,
        nativeLoginEditIcon: `//*[@class="col Native Login"]/div/span/i`,
        companyLoginOption: (companyLogin: string) => `//footer/following-sibling::div//span[text()='${companyLogin}']`,
        companyLoginDropdown: `//div[@id='wrapper-company_login']`,
        multiModeAuthenticationOption: (option: string) => `//span[text()='${option}']`,
        multiModeAuthenticationDropdown: `//div[@id='wrapper-login_mode']`,
        saveButton: `//button[@type='submit']`,
        //For address validation
        uspsClientID: `//label[text()='USPS Client Id']//following-sibling::input`,
        uspsClientSecret: `//label[text()='USPS Client Secret']//following-sibling::input`,
        uspsAPIURL: `//label[text()='USPS API URL']//following-sibling::input`,
        easyPostAPIKey: `//label[text()='EasyPost API Key']//following-sibling::input`,
        addressVerificationToggle: `(//*[@class="col Address Verification"]/div/label/i)[1]`,
        saveBtn:`//button[text()='save']`,
       // saveBtn: `//button[text()='save' or text()='SAVE']`,
        //addressKey:(data: string)=>`//label[text()='${data}']//following-sibling::input`,

        //Password Policy:-
        passwordPolicyEditIcon: `//span[text()='Password Policy']/following::i[1]`,
        maxWrongAttempts: `//input[@id='max_wrong_attempts']`,

        //Max seat override
        businessRulesEditIcon: `//*[@class="col Business Rules"]/div/span/i`,
        maxSeatOverRideCheckbox: `(//label[contains(@for,'submod_admn_max_seat_override_input')]//i)[1]`,
        maxSeatOverRideCheckboxToCheck:`//label[contains(@for,'submod_admn_max_seat_override_input')]//i[contains(@class,'fa-square icon')]`,
        businessRulesSaveBtn:`//div[@id='BusinessRules-content']//button[text()='SAVE']`,

        //For contact support
        editButtonInContactSupport:`//i[@data-bs-target='#ContactSupport-content']`,
        specificMail: `//label[@for='specific_mail_radio']/child::i[@class='fa-duotone fa-circle icon_16_1']`,
        adminMail:`//label[@for='admin_mail_radio']/child::i[@class='fa-duotone fa-circle icon_16_1']`,
        save:`(//button[text()='SAVE'])[1]`,
        contactSupport:`//span[text()='Contact Support']`,
        mailId:`//textarea[@id='specific_mail']`,

        adminConfigLink:`//a[text()='Admin Configuration']`,
        autoCodeConventionOff:`//span[text()='Code Convention']/preceding-sibling::i[@class='fa-duotone fa-toggle-on icon_26_1']`,
        autoCodeConventionOn:`//span[text()='Code Convention']/preceding-sibling::i[@class='fa-duotone fa-toggle-off icon_26_1']`,

        
    };

    constructor(page: Page, context: BrowserContext) {
        super(page, context);
    }
    //By default, the password policy is set to 3 attempts. If the user enters the wrong password 3 times, the account will be locked for 15 minutes.
    async passwordPolicy(attempts: string) {
        await this.wait("mediumWait")
        await this.validateElementVisibility(this.selectors.passwordPolicyEditIcon, "Password Policy Edit")
        await this.click(this.selectors.passwordPolicyEditIcon, "Password Policy Edit", "Button")
        await this.fillAndEnter(this.selectors.maxWrongAttempts, "Input Field", attempts);
        await this.click(this.selectors.saveButton, "Password Policy Save Button ", "Button")

    }

    async verify_SiteSettings_Label() {
        await this.spinnerDisappear();
        await this.validateElementVisibility(this.selectors.siteSettingsLabel, "Site Settings");
    }

    async selectCompanyLogin(companyLogin: string) {
        await this.wait("minWait")
        await this.click(this.selectors.companyLoginDropdown, "Company Login", "dropdown");
        await this.mouseHover(this.selectors.companyLoginOption(companyLogin), "Company Login");
        await this.click(this.selectors.companyLoginOption(companyLogin), "Company Login", "Selected");
    }
    async selectModeOfAuthentication(mode: string) {
        await this.click(this.selectors.multiModeAuthenticationDropdown, "Multi Mode Authentication", "dropdown");
        await this.mouseHover(this.selectors.multiModeAuthenticationOption(mode), "Multi Mode Authentication");
        await this.click(this.selectors.multiModeAuthenticationOption(mode), "Multi Mode Authentication", "Selected");
    }
    async selectPortal(portal: string) {
        await this.wait("mediumWait")
        await this.validateElementVisibility(this.selectors.portalList(portal), "Portal List")
        await this.click(this.selectors.portalList(portal), "Portal List", "Button")
    }
    async clickNativeLoginEditIcon() {
        await this.wait("mediumWait")
        await this.validateElementVisibility(this.selectors.nativeLoginEditIcon, "Native Login Edit")
        await this.click(this.selectors.nativeLoginEditIcon, "Native Login Edit", "Button")
    }
    async clickSave() {
        await this.click(this.selectors.saveButton, "Native Login Save ", "button")
        await this.wait("mediumWait")
    }
    async learnerConfiguration() {
        await this.validateElementVisibility(this.selectors.learnerConfigLocator, "Learner Configuration")
        await this.click(this.selectors.learnerConfigLocator, "Learner Configuration", "Button");
    }
    async adminConfiguration() {
        await this.validateElementVisibility(this.selectors.adminConfigLocator, "Admin Configuration")
        await this.click(this.selectors.adminConfigLocator, "Admin Configuration", "Button");
    }

    //For Address verification Enable
    async addressVerification() {
        await this.wait("mediumWait")
        const button = this.page.locator(this.selectors.addressVerificationToggle);
        const isDisabled = await button.isDisabled();
        if (isDisabled) {
            await this.page.locator(this.selectors.addressVerificationToggle).click();
            await this.type(this.selectors.uspsClientID, "Input Field", URLConstants.USPS_Client_Id);
            await this.type(this.selectors.uspsClientSecret, "Input Field", URLConstants.USPS_Client_Secret);
            await this.type(this.selectors.uspsAPIURL, "Input Field", URLConstants.USPS_API_URL);
            await this.type(this.selectors.easyPostAPIKey, "Input Field", URLConstants.EasyPost_API_Key);
            await this.wait("minWait")
            await this.click(this.selectors.saveBtn, "Save", "Button")
        }
        else {
            console.log("Address verification already enabled");
        }
    }


  //Max Seat Override
    async clickBusinessRulesEditIcon() {
        await this.wait("mediumWait")
    try {
        await this.validateElementVisibility(this.selectors.businessRulesEditIcon, "Business Rules Edit", { timeout: 5000 });
        await this.click(this.selectors.businessRulesEditIcon, "Business Rules Edit", "Button");
    } catch (error) {
           await this.page.locator("//div[text()='Admin site configuration']").click();
           await this.click(this.selectors.businessRulesEditIcon, "Business Rules Edit", "Button");
            
       }
      // await this.validateElementVisibility(this.selectors.businessRulesEditIcon, "Business Rules Edit");
            
    }
    async maxSeatOverRideInBusinessRules(data?: string) {
        await this.wait("mediumWait");
        const button = this.page.locator(this.selectors.maxSeatOverRideCheckbox);
        const isChecked = await button.isChecked();
        if (!isChecked && data !== 'Uncheck') {
            await this.click(this.selectors.maxSeatOverRideCheckboxToCheck, "Enable Max seat override", "Check box");
            await this.click(this.selectors.businessRulesSaveBtn, "Save ", "button");
            await this.wait("mediumWait");
        } else if (data === 'Uncheck') {
            if (!isChecked) {
                console.log("Max seat override option already Unchecked");
            } else {
                await this.click(this.selectors.maxSeatOverRideCheckbox, "Disable Max seat override", "Check box");
                await this.click(this.selectors.businessRulesSaveBtn, "Save ", "button");
                await this.wait("mediumWait");
            }
        } else {
            console.log("Max seat override option already checked");
        }
    }

    //For contact support

    async clickEditContactSupport(){
        await this.validateElementVisibility(this.selectors.editButtonInContactSupport, "Edit Contact")
        await this.click(this.selectors.editButtonInContactSupport,"edit","button")
    }

    async checkSpecificMailRadioButton() {
        const isSpecificRadioBtn=await this.page.locator(this.selectors.specificMail).isChecked();
        let usedmail = "";
        if(isSpecificRadioBtn==true){
            usedmail= await this.getEmailsFromJson()
        }
        else {
           await this.validateElementVisibility(this.selectors.specificMail, "Edit Contact")
            await this.click(this.selectors.specificMail,"edit","button")
            await this.validateElementVisibility(this.selectors.mailId, "mail")
            usedmail=await this.getEmailsFromJson();
        }
        this.emailUsed=usedmail;
    }

    //getting the emails from contactAdminEmails json file for entering the emails randomly to the text box of specific mail radio button
        async getEmailsFromJson() {
            const emails = getRandomItemFromFile("../data/contactAdminEmails.json");
           // const randomEmails = emails;
            await this.wait("minWait")
            await this.keyboardType(this.selectors.mailId, emails);
            await this.validateElementVisibility(this.selectors.save, "save button")
            await this.click(this.selectors.save,"save","button")
            return emails;
        }

        async checkAdminMailRadioButton() {
        const isAdminRadioBtn=await this.page.locator(this.selectors.adminMail).isChecked();
        if(isAdminRadioBtn==true){
        await this.validateElementVisibility(this.selectors.contactSupport,"discard");
        await this.click(this.selectors.contactSupport,"button","discard");
        }
        else {
            await this.wait("minWait")
            await this.validateElementVisibility(this.selectors.adminMail, "Edit Contact")
            await this.click(this.selectors.adminMail,"button","radio")
            await this.validateElementVisibility(this.selectors.save, "save button")
            await this.click(this.selectors.save,"save","button")
        }
    }

     public async autoCodeConventionTurnON()
     {

        const button = this.page.locator(this.selectors.autoCodeConvention).isChecked();
        await this.wait("mediumWait")
        //const isToggleEnabled=await button.isChecked();
        if(!button){
            await this.click(this.selectors.autoCodeConvention,"enable","toggle");
            this.clickOkBtn();
            this.page.reload();
            }
        else {
            console.log("Auto code convention is already enabled");
            this.page.reload();
            await this.wait("mediumWait")
        }
        }
        public async autoCodeConventionTurnOFF(){

        const button = this.page.locator(this.selectors.autoCodeConventionOff).isChecked();    
        await this.wait("mediumWait")
        //const isToggleEnabled=await button.isChecked();
        if(button){
            await this.click(this.selectors.autoCodeConventionOff,"disable","toggle");
            this.clickOkBtn();
            this.page.reload();
            }
        else {
            console.log("Auto code convention is already disabled");
            this.page.reload();
            await this.wait("mediumWait")
        }
        }
        async clickOkBtn(){
            await this.wait("minWait")
            await this.click(this.selectors.okBtn,"ok button","button");
            await this.wait("minWait")
            //await this.page.reload();
        }
 
}


