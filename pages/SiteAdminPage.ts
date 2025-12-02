import { AdminHomePage } from "./AdminHomePage";
import { BrowserContext, Page, expect } from "@playwright/test";
import fs from 'fs'
import path from "path";
import { URLConstants } from "../constants/urlConstants";
import { getRandomItemFromFile } from "../utils/jsonDataHandler";


export class SiteAdminPage extends AdminHomePage {
    emailUsed: string = "";
    public selectors = {
        ...this.selectors,
        siteSettingsLabel: "//div[text()='Site Settings']",
        ////SSO////
        learnerConfigLocator: "//div[text()='Learner Configuration']",
        adminConfigLocator: "(//*[text()='Admin Configuration'])[1]",
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
        saveBtn: `(//button[text()='SAVE'])[1]`,
        // saveBtn: `//button[text()='save' or text()='SAVE']`,
        //addressKey:(data: string)=>`//label[text()='${data}']//following-sibling::input`,

        //Password Policy:-
        passwordPolicyEditIcon: `//span[text()='Password Policy']/following::i[1]`,
        maxWrongAttempts: `//input[@id='max_wrong_attempts']`,

        //Max seat override
        businessRulesEditIcon: `//*[@class="col Business Rules"]/div/span/i`,
        maxSeatOverRideCheckbox: `(//label[contains(@for,'submod_admn_max_seat_override_input')]//i)[1]`,
        maxSeatOverRideCheckboxToCheck: `//label[contains(@for,'submod_admn_max_seat_override_input')]//i[contains(@class,'fa-square icon')]`,
        businessRulesSaveBtn: `//div[@id='BusinessRules-content']//button[text()='SAVE']`,

        //Price override - checkbox approach with check class detection
        priceOverrideChecked: `(//label[@for='submod_admn_price_override_input']/i[contains(@class,'check me-1 icon')])[1]`,
        priceOverrideLabel: `//label[@for='submod_admn_price_override_input']`,
        priceOverrideSpanFallback: `//span[text()='Price Override']`,

        //For contact support
        editButtonInContactSupport: `//i[@data-bs-target='#ContactSupport-content']`,
        specificMail: `//label[@for='specific_mail_radio']/child::i[@class='fa-duotone fa-circle icon_16_1']`,
        adminMail: `//label[@for='admin_mail_radio']/child::i[@class='fa-duotone fa-circle icon_16_1']`,
        save: `(//button[text()='SAVE'])[1]`,
        contactSupport: `//span[text()='Contact Support']`,
        mailId: `//textarea[@id='specific_mail']`,

        adminConfigLink: `//a[text()='Admin Configuration']`,
        autoCodeConventionOff: `//span[text()='Code Convention']/preceding-sibling::i[@class='fa-duotone fa-toggle-on icon_26_1']`,
        autoCodeConventionOn: `//span[text()='Code Convention']/preceding-sibling::i[@class='fa-duotone fa-toggle-off icon_26_1']`,
        dynamicShareableLinks: `//span[text()='Course & Training Plan']//following::div[contains(@class,'Dynamic Sharable Link')]`,
        dynamicShareableLinksToggle: `//div[contains(@class,'Dynamic Sharable Link')]//i`,
        dynamicShareableLinksToggleOff: `//div[contains(@class,'Dynamic Sharable Link')]//i[@class='fa-duotone fa-toggle-off icon_26_1']`,
        dynamicShareableLinksToggleOn: `//div[contains(@class,'Dynamic Sharable Link')]//i[@class='fa-duotone fa-toggle-on icon_26_1']`,
        okbutton: `//button[text()='OK']`,
            //For merge user
        mergeUserToggle: `(//*[@class="col Merge users"]/div/label/i)[1]`,
        okButton: `//button[text()='OK']`,

        //Transfer Enrollment - Training Plan
        clickEditEnrollments: `//i[@data-bs-target='#Enrollments-content']`,
        transferEnrollmentTPEnabled: `//span[text()='Transfer Enrollment - Training Plan']//preceding-sibling::i[contains(@class,'fa-square-check')]`,
        transferEnrollmentTPUnchecked: `//span[text()='Transfer Enrollment - Training Plan']//preceding-sibling::i[contains(@class,'fa-square icon')]`,        okBtn:`//button[text()='OK']`,
        
        //Transfer Enrollment
        transferEnrollmentCheckbox: `(//label[contains(@for,'submod_admn_tfr_enroll_input')]//i)[1]`,
        transferEnrollmentCheckboxToCheck: `//label[contains(@for,'submod_admn_tfr_enroll_input')]//i[contains(@class,'fa-square icon')]`,

        //Allow learners to enroll again (default)
        allowLearnersEnrollAgainDefaultUnchecked: `//span[text()='Allow learners to enroll again (default)']//preceding-sibling::i[contains(@class,'fa-square icon')]`,
        allowLearnersEnrollAgainDefaultChecked: `//span[text()='Allow learners to enroll again (default)']//preceding-sibling::i[contains(@class,'fa-square-check')]`,
              //Observation Checklist (QuestionPro)
        adminSiteConfigurationTab: `//div[text()='Admin site configuration']`,
        observationChecklistSpan: `//span[contains(@class,'text-capitalize') and contains(text(),'Observation Checklist')]`,
        observationChecklistToggle: `//input[@id='mod_admn_quespro_input']`,
        observationChecklistLabel: `//label[@for='mod_admn_quespro_input']`,
        observationChecklistToggleOn: `//label[@for='mod_admn_quespro_input']//i[contains(@class,'fa-toggle-on')]`,
        observationChecklistToggleOff: `//label[@for='mod_admn_quespro_input']//i[contains(@class,'fa-toggle-off')]`,
 disabledAddressInheritance:`//span[text()='Address Inheritance And Emergency Contact']/preceding-sibling::i[@class='fa-duotone fa-toggle-off icon_26_1']`,
        enabledAddressInheritance:`//span[text()='Address Inheritance And Emergency Contact']/preceding-sibling::i[@class='fa-duotone fa-toggle-on icon_26_1']`,

        checkInheritAddress:`(//span[text()='Inherit Address']/preceding-sibling::i)[2]`,
        checkEmergencyContact:`(//span[text()='Emergency Contact']/preceding-sibling::i)[2]`,

        // Direct Content Launch toggles
        disabledDirectContentLaunch:`//span[text()='Direct Content Launch']/preceding-sibling::i[@class='fa-duotone fa-toggle-off icon_26_1']`,
        enabledDirectContentLaunch:`//span[text()='Direct Content Launch']/preceding-sibling::i[@class='fa-duotone fa-toggle-on icon_26_1']`,
        
        // Success message for settings save
        settingsSuccessMessage:`//span[text()='Changes have been saved successfully. Please refresh the page to see the effects.']`,
        SAVE:`//button[text()='OK']`,

        clickEditAddressInheritance:`//i[@data-bs-target='#AddressInheritanceAndEmergencyContact-content']`,

        disabledBusinessRules:`//span[text()='Business Rules']/preceding-sibling::i[@class='fa-duotone fa-toggle-off icon_26_1']`,

        clickEditBusinessRules:`//i[@data-bs-target='#BusinessRules-content']`,

        checkCertificationRevalidation:`(//span[text()='Certification re-validation']/preceding-sibling::i)[2]`,

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
        await this. validateElementVisibility(this.selectors.adminConfigLocator, "Admin Configuration")
        await this.click(this.selectors.adminConfigLocator, "Admin Configuration", "Button");
        await this.wait("mediumWait");
        await this.spinnerDisappear();
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

    //Price Override - checkbox approach with check class detection
    async priceOverrideInBusinessRules(data?: string) {
        await this.wait("mediumWait");
        
        try {
            // Check if checkbox is already checked by looking for the "check" class in the icon
            const checkedSelector = `(//label[@for='submod_admn_price_override_input']/i[contains(@class,'check me-1 icon')])[1]`;
            const checkboxLabelSelector = `//label[@for='submod_admn_price_override_input']`;
            
            const isChecked = await this.page.locator(checkedSelector).isVisible();
            
            if (!isChecked && data !== 'Uncheck') {
                // Price Override is OFF (not checked), need to enable it
                await this.page.locator(checkboxLabelSelector).click();
                await this.click(this.selectors.businessRulesSaveBtn, "Save", "Button");
                await this.wait("mediumWait");
                console.log("Price Override has been enabled");
            } else if (data === 'Uncheck') {
                if (!isChecked) {
                    console.log("Price Override option already disabled");
                } else {
                    // Price Override is ON (checked), need to disable it
                    await this.page.locator(checkboxLabelSelector).click();
                    await this.click(this.selectors.businessRulesSaveBtn, "Save", "Button");
                    await this.wait("mediumWait");
                    console.log("Price Override has been disabled");
                }
            } else {
                // Price Override is already ON (checked), no action needed
                console.log("Price Override option already enabled - no action needed");
            }
        } catch (error) {
            console.log("Price Override functionality may not be available in this environment:", error);
            // Try fallback approach with span text selector
            try {
                const spanSelector = `//span[text()='Price Override']`;
                const spanElement = this.page.locator(spanSelector);
                
                if (await spanElement.isVisible()) {
                    await spanElement.click();
                    await this.click(this.selectors.businessRulesSaveBtn, "Save", "Button");
                    await this.wait("mediumWait");
                    console.log("Price Override clicked using fallback span selector");
                } else {
                    console.log("Price Override span not found - feature may not be available");
                }
            } catch (fallbackError) {
                console.log("Price Override functionality not available - continuing test");
            }
        }
    }

    //Address Inheritance - similar to Address Verification toggle pattern
    async enableAddressInheritance() {
        await this.wait("mediumWait");
        
        try {
            const addressInheritanceToggleSelector = `(//*[@class="col Address Inheritance"]/div/label/i)[1]`;
            
            const button = this.page.locator(addressInheritanceToggleSelector);
            const isDisabled = await button.isDisabled();
            
            if (isDisabled) {
                // Address Inheritance is OFF (disabled), need to enable it
                await this.page.locator(addressInheritanceToggleSelector).click();
                await this.click(this.selectors.saveBtn, "Save", "Button");
                await this.wait("mediumWait");
                console.log("Address Inheritance has been enabled");
            } else {
                console.log("Address Inheritance already enabled");
            }
        } catch (error) {
            console.log("Address Inheritance functionality may not be available in this environment:", error);
        }
    }

    //Verify Price Override status in Admin Configuration Business Rules
    async verifyPriceOverrideInAdminBusinessRules() {
        await this.wait("mediumWait");
        
        try {
            // Check if Price Override checkbox is present and its status
            const checkedSelector = `(//label[@for='submod_admn_price_override_input']/i[contains(@class,'check me-1 icon')])[1]`;
            const labelSelector = `//label[@for='submod_admn_price_override_input']`;
            
            // Check if the Price Override option exists
            const labelExists = await this.page.locator(labelSelector).isVisible();
            
            if (!labelExists) {
                console.log("❌ Price Override option is NOT available in Admin Business Rules");
                return { available: false, enabled: false };
            }
            
            // Check if it's enabled (has check class)
            const isEnabled = await this.page.locator(checkedSelector).isVisible();
            
            if (isEnabled) {
                console.log("✅ Price Override is AVAILABLE and ENABLED in Admin Business Rules");
                return { available: true, enabled: true };
            } else {
                console.log("⚠️ Price Override is AVAILABLE but DISABLED in Admin Business Rules");
                return { available: true, enabled: false };
            }
            
        } catch (error) {
            console.log("❌ Error checking Price Override in Admin Business Rules:", error);
            return { available: false, enabled: false };
        }
    }

    //For contact support

    async clickEditContactSupport() {
        await this.validateElementVisibility(this.selectors.editButtonInContactSupport, "Edit Contact")
        await this.click(this.selectors.editButtonInContactSupport, "edit", "button")
    }

    async checkSpecificMailRadioButton() {
        const isSpecificRadioBtn = await this.page.locator(this.selectors.specificMail).isChecked();
        let usedmail = "";
        if (isSpecificRadioBtn == true) {
            usedmail = await this.getEmailsFromJson()
        }
        else {
            await this.validateElementVisibility(this.selectors.specificMail, "Edit Contact")
            await this.click(this.selectors.specificMail, "edit", "button")
            await this.validateElementVisibility(this.selectors.mailId, "mail")
            usedmail = await this.getEmailsFromJson();
        }
        this.emailUsed = usedmail;
    }

    //getting the emails from contactAdminEmails json file for entering the emails randomly to the text box of specific mail radio button
    async getEmailsFromJson() {
        const emails = getRandomItemFromFile("../data/contactAdminEmails.json");
        // const randomEmails = emails;
        await this.wait("minWait")
        await this.keyboardType(this.selectors.mailId, emails);
        await this.validateElementVisibility(this.selectors.save, "save button")
        await this.click(this.selectors.save, "save", "button")
        return emails;
    }

    async checkAdminMailRadioButton() {
        const isAdminRadioBtn = await this.page.locator(this.selectors.adminMail).isChecked();
        if (isAdminRadioBtn == true) {
            await this.validateElementVisibility(this.selectors.contactSupport, "discard");
            await this.click(this.selectors.contactSupport, "button", "discard");
        }
        else {
            await this.wait("minWait")
            await this.validateElementVisibility(this.selectors.adminMail, "Edit Contact")
            await this.click(this.selectors.adminMail, "button", "radio")
            await this.validateElementVisibility(this.selectors.save, "save button")
            await this.click(this.selectors.save, "save", "button")
        }
    }
    
    //Click on Admin site configuration tab
    async clickAdminSiteConfiguration() {
        await this.wait("mediumWait");
        await this.page.waitForLoadState('networkidle');
        await this.page.locator(this.selectors.adminSiteConfigurationTab).scrollIntoViewIfNeeded();
        await this.wait("minWait");
        await this.validateElementVisibility(this.selectors.adminSiteConfigurationTab, "Admin site configuration");
        await this.click(this.selectors.adminSiteConfigurationTab, "Admin site configuration", "Tab");
        await this.wait("mediumWait");
        await this.page.waitForLoadState('domcontentloaded');
        await this.spinnerDisappear();
        console.log("✅ Clicked on Admin site configuration tab");
    }

    //Check if Observation Checklist is enabled
//Check if Observation Checklist is enabled
    async isObservationChecklistEnabled(): Promise<boolean> {
        await this.wait("mediumWait");
        try {
            const toggleOnVisible = await this.page.locator(this.selectors.observationChecklistToggleOn).isVisible();
            await this.page.locator(this.selectors.observationChecklistLabel).scrollIntoViewIfNeeded();
            await this.wait("minWait");
            if (toggleOnVisible) {
                console.log(":white_check_mark: Observation Checklist (QuestionPro) is already ENABLED");
                return true;
            } else {
                console.log(":warning: Observation Checklist (QuestionPro) is currently DISABLED");
                return false;
            }
        } catch (error) {
            console.log(":x: Error checking Observation Checklist status:", error);
            return false;
        }
    }

    //Enable Observation Checklist toggle if not enabled
    async enableObservationChecklist() {
        await this.wait("mediumWait");
        
        const isEnabled = await this.isObservationChecklistEnabled();
        
        if (!isEnabled) {
            console.log("🔄 Enabling Observation Checklist (QuestionPro)...");
            
            // Scroll to the observation checklist element
            await this.page.locator(this.selectors.observationChecklistLabel).scrollIntoViewIfNeeded();
            await this.wait("minWait");
            
            // Click on the label to toggle
            await this.click(this.selectors.observationChecklistLabel, "Observation Checklist Toggle", "Toggle");
            await this.wait("mediumWait");
            
            console.log("✅ Observation Checklist (QuestionPro) has been enabled");
        } else {
            console.log("✅ Observation Checklist already enabled - no action needed");
        }
    }

    //Disable Observation Checklist toggle if enabled
    async disableObservationChecklist() {
        await this.wait("mediumWait");
        
        const isEnabled = await this.isObservationChecklistEnabled();
        
        if (isEnabled) {
            console.log("🔄 Disabling Observation Checklist (QuestionPro)...");
            
            // Scroll to the observation checklist element
            await this.page.locator(this.selectors.observationChecklistLabel).scrollIntoViewIfNeeded();
            await this.wait("minWait");
            await this.page.reload();
        }
        else{
            console.log("Inherit Address and Emergency Contact are already checked");
        }
    }

      public async enableBusinessRulesAndCheckCertificationRevalidation(){
        const button = this.page.locator(this.selectors.disabledBusinessRules)
        const isToggleEnabled = await button.isChecked();

        if(!isToggleEnabled){
            await this.wait("minWait");
            await this.click(this.selectors.disabledBusinessRules,"enable","toggle");
            await this.click(this.selectors.SAVE,"save","button");
        }
        else{
            console.log("Business Rule is already enabled");
        }
        
        // Always check the certification revalidation checkbox state
        await this.click(this.selectors.clickEditBusinessRules,"edit","button");
        const certRevalidationCheckbox = this.page.locator(this.selectors.checkCertificationRevalidation);
        const isCertRevalidationChecked = await certRevalidationCheckbox.isChecked();
        
        if(!isCertRevalidationChecked){
            await this.click(this.selectors.checkCertificationRevalidation,"check","checkbox");
            await this.click(this.selectors.save,"save","button");
            await this.wait("minWait");
            await this.page.reload();
        }
        else{
            console.log("Certification Revalidation is already checked");
    }}

    //Allow learners to enroll again (default) - In Site Admin Business Rules
    async verifyAllowLearnersEnrollAgainDefault(shouldBeUnchecked: boolean = true) {
        await this.wait("mediumWait");
        
        try {
            const uncheckedSelector = this.selectors.allowLearnersEnrollAgainDefaultUnchecked;
            const checkedSelector = this.selectors.allowLearnersEnrollAgainDefaultChecked;
            
            const isUnchecked = await this.page.locator(uncheckedSelector).isVisible();
            const isChecked = await this.page.locator(checkedSelector).isVisible();
            
            if (shouldBeUnchecked) {
                if (isUnchecked) {
                    console.log("✅ Verified - 'Allow learners to enroll again (default)' is UNCHECKED in Site Admin Business Rules");
                    return true;
                } else {
                    console.log("❌ Expected 'Allow learners to enroll again (default)' to be UNCHECKED but it is CHECKED");
                    return false;
                }
            } else {
                if (isChecked) {
                    console.log("✅ Verified - 'Allow learners to enroll again (default)' is CHECKED in Site Admin Business Rules");
                    return true;
                } else {
                    console.log("❌ Expected 'Allow learners to enroll again (default)' to be CHECKED but it is UNCHECKED");
                    return false;
                }
            }
        } catch (error) {
            console.log("❌ Error verifying 'Allow learners to enroll again (default)' checkbox:", error);
            return false;
        }
    }

    async uncheckAllowLearnersEnrollAgainDefault() {
        await this.wait("mediumWait");
        
        try {
            const checkedSelector = this.selectors.allowLearnersEnrollAgainDefaultChecked;
            const uncheckedSelector = this.selectors.allowLearnersEnrollAgainDefaultUnchecked;
            
            const isChecked = await this.page.locator(checkedSelector).isVisible();
            
            if (isChecked) {
                console.log("🔄 Unchecking 'Allow learners to enroll again (default)' checkbox...");
                await this.click(checkedSelector, "Allow learners to enroll again (default)", "Checkbox");
                await this.click(this.selectors.businessRulesSaveBtn, "Save", "Button");
                await this.wait("mediumWait");
                console.log("✅ 'Allow learners to enroll again (default)' has been unchecked");
            } else {
                console.log("✅ 'Allow learners to enroll again (default)' is already unchecked");
            }
        } catch (error) {
            console.log("❌ Error unchecking 'Allow learners to enroll again (default)':", error);
        }
    }

    async checkAllowLearnersEnrollAgainDefault() {
        await this.wait("mediumWait");
        
        try {
            const checkedSelector = this.selectors.allowLearnersEnrollAgainDefaultChecked;
            const uncheckedSelector = this.selectors.allowLearnersEnrollAgainDefaultUnchecked;
            
            const isChecked = await this.page.locator(checkedSelector).isVisible();
            
            if (isChecked) {
                console.log("✅ 'Allow learners to enroll again (default)' is already checked - skipping");
            } else {
                console.log("🔄 Checking 'Allow learners to enroll again (default)' checkbox...");
                await this.click(uncheckedSelector, "Allow learners to enroll again (default)", "Checkbox");
                await this.click(this.selectors.businessRulesSaveBtn, "Save", "Button");
                await this.wait("mediumWait");
                console.log("✅ 'Allow learners to enroll again (default)' has been checked");
            }
        } catch (error) {
            console.log("❌ Error checking 'Allow learners to enroll again (default)':", error);
        }
    }

        //Transfer Enrollment - Training Plan
    async clickEditEnrollments() {
        await this.wait("mediumWait");
        await this.validateElementVisibility(this.selectors.clickEditEnrollments, "Edit Enrollments");
        await this.click(this.selectors.clickEditEnrollments, "Edit Enrollments", "Button");
    }

    async enableTransferEnrollmentTP() {
        await this.wait("mediumWait");
        const uncheckedElement = this.page.locator(this.selectors.transferEnrollmentTPUnchecked);
        const isUnchecked = await uncheckedElement.isVisible();
        
        if (isUnchecked) {
            await this.click(this.selectors.transferEnrollmentTPUnchecked, "Enable Transfer Enrollment - Training Plan", "Checkbox");
            await this.click(this.selectors.save, "Save", "Button");
            await this.wait("mediumWait");
            console.log("✅ Enabled: Transfer Enrollment - Training Plan checkbox is now checked");
        } else {
            console.log("ℹ️ Transfer Enrollment - Training Plan is already enabled");
        }
    }

    async disableTransferEnrollmentTP() {
        await this.wait("mediumWait");
        const checkedElement = this.page.locator(this.selectors.transferEnrollmentTPEnabled);
        const isChecked = await checkedElement.isVisible();
        
        if (isChecked) {
            await this.click(this.selectors.transferEnrollmentTPEnabled, "Disable Transfer Enrollment - Training Plan", "Checkbox");
            await this.click(this.selectors.save, "Save", "Button");
            await this.wait("mediumWait");
            console.log("✅ Disabled: Transfer Enrollment - Training Plan checkbox is now unchecked");
        } else {
            console.log("ℹ️ Transfer Enrollment - Training Plan is already disabled");
        }
    }

    async verifyTransferEnrollmentTPEnabled() {
        await this.wait("mediumWait");
        const checkedElement = this.page.locator(this.selectors.transferEnrollmentTPEnabled);
        const isChecked = await checkedElement.isVisible();
        expect(isChecked).toBeTruthy();
        console.log("✅ Verified: Transfer Enrollment - Training Plan is enabled");
    }

    async verifyTransferEnrollmentTPDisabled() {
        await this.wait("mediumWait");
        const uncheckedElement = this.page.locator(this.selectors.transferEnrollmentTPUnchecked);
        const isUnchecked = await uncheckedElement.isVisible();
        expect(isUnchecked).toBeTruthy();
        console.log("✅ Verified: Transfer Enrollment - Training Plan is disabled");
    }
 
}

