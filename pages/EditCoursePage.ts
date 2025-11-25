import { th } from "@faker-js/faker";
import { filePath } from "../data/MetadataLibraryData/filePathEnv";
import { FakerData, getCurrentDateFormatted } from "../utils/fakerUtils";
import { getRandomItemFromFile } from "../utils/jsonDataHandler";
import { AdminHomePage } from "./AdminHomePage";
import { BrowserContext, expect, Locator, Page } from "@playwright/test";

export class EditCoursePage extends AdminHomePage {


    public selectors = {
        ...this.selectors,
        closeBtn: "(//button[text()='Close'])[1]",
        courseMenu: (menuName: string) => `//span//span[text()='${menuName}']`,
        tagMenu: "//span//span[text()='Tags']",
        completionCertificateMenu: "//button[.//span[normalize-space(text())='Completion Certificate']]",
        tagsSearchField: "//input[@id='tags-search-field']",
        tagListItem: (tagName: string) => `//li[text()='${tagName}']`,
        okBtnTag: "(//button[text()='OK'])",
        okBtnCertificate: "(//button[text()='OK'])",
        certificateSearchField: "#exp-search-certificate-field",
        certificateRadioBtn: (certificateName: string) => `(//div[text()='${certificateName}']/following::i)[1]`,
        addBtn: "//button[text()='Add']",
        tagsSuccesfully: "//div[@id='staticBackdrop' and contains(@class,'show')]//following::span[contains(text(),'successfully.')]",
        accessTab: `//span//span[text()='Access']`,
        learnerGroup: `(//div[@id='wrapper-course-group-access-learner-group-list']//button)[1]`,
        adminGroup: `(//div[@id='wrapper-course-group-access-admin-group-list']//button)[1]`,
        learnerGroupOption: `//footer/following::a[1]`,
        accessSetting: `//span[@id='crs-accset-attr']//span[text()='Access Setting']`,
        optionalGroup: `#wrapper-admin_leanr_head button:first-child`,
        setMandatory: `//footer/following::span[text()='Mandatory']`,
        registrationEnd: `//input[@id='registration-ends-input']`,
        learnerGropSearch: `//div[@class='dropdown-menu show']//input`,
        timeZone: `//label[text()='Time Zone']/following-sibling::div//input`,
        timeZoneOption: `(//label[text()='Time Zone']/following::div//input[@placeholder='Search'])[1]`,
        indianTimezone: `//li[contains(text(),'Indian Standard Time/Kolkata')]`,
        startDateInstance: `//label[text()='Start Date']/following-sibling::div/input`,
        host: `//label[text()='Host']/following-sibling::div`,
        //    searchHost -->dd is not working in UI -->bug      
        otherMeeting: `//label[text()='Session Type']/following::div//span[text()='other Meetings']`,
        attendeeUrl: `//label[text()='Attendee URL']/following-sibling::input`,
        presenterUrl: `//label[text()='Presenter URL']/following-sibling::input`,
        addDeleteIcon: `//label[text()='session add/delete']/following::i[contains(@class,'fad fa-plus')]`,
        saveAccessBtn: `//button[text()='Save Access']`,
        businessRule: `//span[text()='Business Rule']`,
        uncheckSingleReg: `(//span[contains(text(),'Allow')]/preceding-sibling::i)[1]`,
        saveButton: `(//button[text()='Save'])[1]`,
        verifyChanges: `//span[contains(text(),'Changes')]`,
        manageApproval: `//span[text()='Manager Approval']`,
        approvalRegistration: `(//span[contains(@class,'h4')]/preceding-sibling::i)[2]`,
        inheritMessage: `//div[contains(@class,'justify-content-center')]//span[contains(text(),'rule')]`,
        managerType: (type: string) => `//span[text()='${type}']`,
        internalManagertype: (type: string) => `//input[@id='direct-manager']/following::span[text()='${type}'][1]`,
        externalManagertype: (type: string) => `//input[@id='direct-manager1']/following::span[text()='${type}']`,

        //`(//label[text()='session add/delete']/following::div//i)[2]`

        //Allow single registration
        checkAllowRecReg: `(//span[contains(text(),'Allow')]/preceding-sibling::i)[2]`,

        // Dedicated to TP selectors
        dedicatedToTPCheckbox: `//span[text()='Dedicated to Training Plan']/preceding-sibling::i[1]`,
        dedicatedToTPLabel: `//span[text()='Dedicated to Training Plan']`,
        dedicatedToTPClickable: `//span[text()='Dedicated to Training Plan']`,
        warningMessage: `(//button[normalize-space()='OK']/ancestor::div[contains(@class,'modal-content')]//span)[1]`,
        blockingAlertMessage: `//div[contains(@class,'alert') and contains(@class,'mandatory')]//span[contains(text(),'cannot be performed')]`,
        blockingAlertCloseBtn: `//div[@class='msg-close-btn']`,
        saveBtn: `//button[text()='Save']`,
        enrollments:`//span[contains(@id,'crs-enrol-attr')]`,
        enrollmentEntry:`(//table[contains(@class,'viewupdate-status')]//tr)[2]`,
        selectInstance:`//div[text()='Single Instance/Class']`,
        multiInstance :`//span[text()='Multi Instance/Class']`,
    };

    constructor(page: Page, context: BrowserContext) {
        super(page, context);
    }

    async clickClose() {
        let closeBtn = this.page.locator(this.selectors.closeBtn);
        await this.wait('mediumWait');
        if (await closeBtn.isVisible()) {
            await this.click(this.selectors.closeBtn, "Close", "Button");
        }
    }

    async clickTagMenu() {
        const selector = this.selectors.tagMenu;
        await this.validateElementVisibility(selector, "Tag tab")
        await this.wait('mediumWait')
        await this.click(selector, "Tags", "Link");
    }

    async clickCompletionCertificate() {
        await this.wait("maxWait");
        await this.mouseHover(this.selectors.completionCertificateMenu, "completion Certificate");
        await this.click(this.selectors.completionCertificateMenu, "completion Certificate", "Link");
    }

    async selectTags() {
        //const tags = ["Empower", "Facilitate", "card", "matrix", "Testing", "Evolve schemas"];
        //const randomIndex = Math.floor(Math.random() * tags.length); // Corrected random index generation
        //const randomTag = tags[randomIndex];
        const tags = getRandomItemFromFile(filePath.tags);
        const randomTag = tags;
        await this.keyboardType(this.selectors.tagsSearchField, randomTag);
        const tagName = this.getInnerText(`//li[text()='${randomTag}']`);
        await this.click(`//li[text()='${randomTag}']`, randomTag, "Button")
        await this.validateElementVisibility(this.selectors.tagsSuccesfully, "Tags")
        await this.verification(this.selectors.tagsSuccesfully, "Tag has been added successfully.")
        await this.validateElementVisibility(this.selectors.okBtnTag, "OK");
        await this.mouseHover(this.selectors.okBtnTag, "OK");
        await this.click(this.selectors.okBtnTag, "OK", "Button");
        return tagName;
    }

    async selectCourseCompletionCertificate(certificateName: string) {
        await this.typeAndEnter(this.selectors.certificateSearchField, "Search", certificateName);
        const certSelector = this.selectors.certificateRadioBtn(certificateName);
        await this.click(certSelector, "Certificate", "Radio button");
        await this.click(this.selectors.addBtn, "Add", "Button");
        await this.wait("maxWait");
        await this.mouseHover(this.selectors.okBtnCertificate, "OK");
        await this.click(this.selectors.okBtnCertificate, "OK", "Button");
    }

    async clickAccesstab() {
        await this.wait("minWait")
        await this.click(this.selectors.accessTab, "Access", "Button")
    }
    async addLearnerGroup(data: string) {
        await this.click(this.selectors.learnerGroup, "LearnerGroup", "Dropdown")
        await this.type(this.selectors.learnerGropSearch, "LG", data)
        await this.click(this.selectors.learnerGroupOption, "LG", "Option")
        await this.click(this.selectors.closeBtn, "Close", "Button")
    }

    async addAdminGroup(data: string) {
        await this.click(this.selectors.adminGroup, "AdminGroup", "Dropdown")
        await this.wait('minWait');
        await this.type(this.selectors.learnerGropSearch, "LG", data)
        await this.click(this.selectors.learnerGroupOption, "LG", "Option")
    }

    async clickAccessSetting() {
        await this.click(this.selectors.accessSetting, "Access Setting", "Button")
    }
    async setCourseMandatory() {

        await this.click(this.selectors.optionalGroup, "Group Access", "dropdown");
        await this.page.locator(this.selectors.setMandatory).click({ force: true });
        //await this.click(this.selectors.setMandatory, "Mandatory", "Option")

    }
    async saveAccess() {
        await this.wait('minWait');
        await this.click(this.selectors.saveAccessBtn, "Save", "Button");
    }
    async selectTimeZone(country: string) {
        await this.click(this.selectors.timeZone, "TimeZone", "Text Field")
        await this.type(this.selectors.timeZoneOption, "Time Zone", country)
        await this.mouseHover(this.selectors.indianTimezone, "Indian Time zone")
        await this.click(this.selectors.indianTimezone, "Indian Timezone", "Selected")
    }
    async clickBusinessRule() {
        await this.wait('mediumWait')
        await this.click(this.selectors.businessRule, "Business Rule", "sub-Menu")
    }
    async clickUncheckSingReg() {
        await this.validateElementVisibility(this.selectors.uncheckSingleReg, "Single registration")
        await this.click(this.selectors.uncheckSingleReg, "Single registration", "Radio Button")
        await this.click(this.selectors.saveButton, "Single registration", "Save Button")
        await this.verification(this.selectors.verifyChanges, "successfully")
    }
    async verifySingRegchkbox() {
        const booleanChk = await this.page.locator(this.selectors.uncheckSingleReg).isChecked();
        console.log(booleanChk)
        expect(booleanChk).toBeFalsy();
    }
    async clickManagerApproval() {
        await this.wait('mediumWait')
        await this.validateElementVisibility(this.selectors.manageApproval, "ManagerApproval")
        await this.mouseHover(this.selectors.manageApproval, "ManagerApproval")
        await this.click(this.selectors.manageApproval, "ManagerApproval", "sub-Menu")
        await this.wait('minWait')
        await this.click(this.selectors.approvalRegistration, "Approval Registraion", "checkbox")
    }

    async verifyInheritanceMessage() {
        await this.wait('minWait')
        await this.verification(this.selectors.inheritMessage, "inherited")
        await this.mouseHover(this.selectors.okBtnTag, "Ok ")
        await this.click(this.selectors.okBtnTag, "Ok ", "Button")
        await this.wait('minWait')
    }

    async verifyapprovaluserType(managerType: string) {
        const booleanChk = await this.page.locator(this.selectors.managerType(managerType)).isChecked();
        expect(booleanChk).toBeTruthy();
    }

    async clickapprovaluserType(managerType: string) {
        const booleanChk = await this.page.locator(this.selectors.managerType(managerType)).isChecked();
        if (booleanChk) {
            await this.click(this.selectors.managerType(managerType), `uncheck the ${managerType}`, "Checkbox")
        }
    }


    async verifyinternalManager(managerType: string,) {
        const booleanChk = await this.page.locator(this.selectors.internalManagertype(managerType)).isChecked();
        expect(booleanChk).toBeTruthy();

    }

    async clickinternalManager(managerType: string,) {
        const booleanChk = await this.page.locator(this.selectors.internalManagertype(managerType)).isChecked();
        if (!booleanChk) {
            await this.click(this.selectors.internalManagertype(managerType), `${managerType}`, "Checkbox")
        }
    }

    async verifyexternalManager(managerType: string,) {
        const booleanChk = await this.page.locator(this.selectors.externalManagertype(managerType)).isChecked();
        console.log(booleanChk)
        expect(booleanChk).toBeTruthy();
    }

    async clickexternalManager(managerType: string,) {
        const booleanChk = await this.page.locator(this.selectors.externalManagertype(managerType)).isChecked();
        if (!booleanChk) {
            await this.click(this.selectors.externalManagertype(managerType), `${managerType}`, "Checkbox")
        }
    }

    async saveApproval() {
        await this.click(this.selectors.saveButton, "Save", "Button")
        await this.verification(this.selectors.verifyChanges, "successfully")

    }

    //Allow single registration
    async clickcheckAllowRecReg() {
        await this.validateElementVisibility(this.selectors.checkAllowRecReg, "Recurring registration")
        await this.click(this.selectors.checkAllowRecReg, "Recurring registration", "Check Box")
        await this.click(this.selectors.saveButton, "Recurring registration", "Save Button")
        await this.verification(this.selectors.verifyChanges, "successfully")
    }
    async verifycheckAllowRecReg() {
        const booleanChk = await this.page.locator(this.selectors.checkAllowRecReg).isChecked();
        console.log(booleanChk)
        expect(booleanChk).toBeFalsy();
    }

    // Dedicated to Training Plan Methods
    /**
     * Check Dedicated to Training Plan checkbox
     * @param level - "Course" for course level (shows warning message) or "Instance" for instance/class level (no warning)
     */
    async checkDedicatedToTP(level: "Course" | "Instance" = "Course") {
        await this.wait('minWait');
        const containerSelector = `//span[text()='Dedicated to Training Plan']/preceding-sibling::i`;
        const icons = this.page.locator(containerSelector);
        
        // Check if checkbox is checked by looking at which icon is visible
        // When checked: first icon (fa-square-check) is visible
        // When unchecked: second icon (fa-square) is visible
        const firstIconVisible = await icons.first().isVisible();
        const secondIconVisible = await icons.nth(1).isVisible();
        
        const isChecked = firstIconVisible && !secondIconVisible;
        
        console.log(`📝 Enable (${level} Level) - First icon visible: ${firstIconVisible}, Second icon visible: ${secondIconVisible}, Checked: ${isChecked}`);
        
        if (!isChecked) {
            await this.validateElementVisibility(this.selectors.dedicatedToTPLabel, "Dedicated to TP Checkbox");
            await this.click(this.selectors.dedicatedToTPLabel, "Dedicated to Training Plan", "Checkbox");
            
            if (level === "Course") {
                // Course level: Handle warning message
                await this.wait('maxWait');
                const expectedMessage = "By selecting the rule, this course and all its classes will be hidden from the catalog. Learner can enroll to this course only via Learning Path/ Certification to which the course is associated.";
                await this.verification(this.selectors.warningMessage, expectedMessage);
                console.log("✅ Validated Dedicated to TP warning message: Course will be hidden from catalog");
                await this.click(this.selectors.okBtnTag, "OK", "Button");
            }
            
            // Click Save button
            await this.wait('minWait');
            await this.click(this.selectors.saveBtn, "Save", "Button");
            console.log(`✅ Enabled Dedicated to Training Plan at ${level} level`);
        } else {
            console.log(`ℹ️ Dedicated to Training Plan already enabled at ${level} level`);
        }
    }

    /**
     * Uncheck Dedicated to Training Plan checkbox
     * @param level - "Course" for course level (shows warning message) or "Instance" for instance/class level (no warning)
     */
    async unCheckDedicatedToTP(level: "Course" | "Instance" = "Course") {
        await this.wait('minWait');
        const containerSelector = `//span[text()='Dedicated to Training Plan']/preceding-sibling::i`;
        const icons = this.page.locator(containerSelector);
        
        // Check if checkbox is checked by looking at which icon is visible
        const firstIconVisible = await icons.first().isVisible();
        const secondIconVisible = await icons.nth(1).isVisible();
        
        const isChecked = firstIconVisible && !secondIconVisible;
        
        console.log(`📝 Disable (${level} Level) - Initial state - First icon visible: ${firstIconVisible}, Second icon visible: ${secondIconVisible}, Checked: ${isChecked}`);
        
        if (isChecked) {
            // Uncheck the checkbox
            await this.click(this.selectors.dedicatedToTPLabel, "Dedicated to Training Plan", "Checkbox");
            
            if (level === "Course") {
                // Course level: Handle warning message
                await this.wait('minWait');
                const expectedMessage = "unchecking this checkbox means the course will be visible in the catalog";
                await this.verification(this.selectors.warningMessage, expectedMessage);
                await this.click(this.selectors.okBtnTag, "OK", "Button");
            }
            
            // Click Save button
            await this.wait('minWait');
            await this.click(this.selectors.saveBtn, "Save", "Button");
            await this.wait('minWait');
            
            console.log(`✅ Disabled Dedicated to Training Plan at ${level} level`);
            return true;
        } else {
            console.log(`ℹ️ Dedicated to Training Plan already disabled at ${level} level`);
            return false;
        }
    }

    async isDedicatedToTPChecked(): Promise<boolean> {
        await this.wait('minWait');
        const containerSelector = `//span[text()='Dedicated to Training Plan']/preceding-sibling::i`;
        const icons = this.page.locator(containerSelector);
        
        // Check which icon is visible to determine checked state
        const firstIconVisible = await icons.first().isVisible();
        const secondIconVisible = await icons.nth(1).isVisible();
        const isChecked = firstIconVisible && !secondIconVisible;
        
        console.log(`ℹ️ Dedicated to TP checked state: ${isChecked}`);
        return isChecked;
    }

    async isDedicatedToTPDisabled(): Promise<boolean> {
        await this.wait('minWait');
        const checkbox = this.page.locator(this.selectors.dedicatedToTPCheckbox);
        const isDisabled = await checkbox.evaluate((el: HTMLElement) => {
            // Check if element or its parent has disabled class/attribute
            return el.classList.contains('disabled') || el.hasAttribute('disabled') || 
                   (el.parentElement?.classList.contains('disabled') ?? false);
        });
        console.log(`ℹ️ Dedicated to TP disabled state: ${isDisabled}`);
        return isDisabled;
    }

    async isDedicatedToTPEditable(): Promise<boolean> {
        const isDisabled = await this.isDedicatedToTPDisabled();
        const isEditable = !isDisabled;
        console.log(`ℹ️ Dedicated to TP editable state: ${isEditable}`);
        return isEditable;
    }

    /**
     * Verify Dedicated to Training Plan checkbox state dynamically
     * @param enableState - Expected enable state: "Enabled" or "Disabled"
     * @param checkedState - Expected checked state: "Checked" or "Unchecked"
     * @example await editCourse.verifyDedicatedToCheckBox("Disabled", "Checked")
     * @example await editCourse.verifyDedicatedToCheckBox("Enabled", "Unchecked")
     */
    async verifyDedicatedToCheckBox(enableState: "Enabled" | "Disabled", checkedState: "Checked" | "Unchecked"): Promise<void> {
        await this.wait('minWait');
        
        const checkboxInput = this.page.locator(`//input[@id='dedicated-to-tp']`);
        const checkedIcon = this.page.locator(`//label[@for='dedicated-to-tp']//i[contains(@class,'fa-square-check')]`);
        const uncheckedIcon = this.page.locator(`//label[@for='dedicated-to-tp']//i[contains(@class,'fa-square') and not(contains(@class,'fa-square-check'))]`);
        
        // Verify Enabled/Disabled state
        const isDisabled = await checkboxInput.isDisabled();
        const actualEnableState = isDisabled ? "Disabled" : "Enabled";
        
        if (actualEnableState !== enableState) {
            throw new Error(`❌ Dedicated to TP checkbox enable state mismatch! Expected: ${enableState}, Actual: ${actualEnableState}`);
        }
        console.log(`✅ Verified - Dedicated to TP checkbox is ${enableState}`);
        
        // Verify Checked/Unchecked state
        const isCheckedIconVisible = await checkedIcon.isVisible();
        const isUncheckedIconVisible = await uncheckedIcon.isVisible();
        
        let actualCheckedState: "Checked" | "Unchecked";
        
        if (isCheckedIconVisible && !isUncheckedIconVisible) {
            actualCheckedState = "Checked";
        } else if (!isCheckedIconVisible && isUncheckedIconVisible) {
            actualCheckedState = "Unchecked";
        } else {
            throw new Error(`❌ Checkbox state is ambiguous! Checked icon visible: ${isCheckedIconVisible}, Unchecked icon visible: ${isUncheckedIconVisible}`);
        }
        
        if (actualCheckedState !== checkedState) {
            throw new Error(`❌ Dedicated to TP checkbox checked state mismatch! Expected: ${checkedState}, Actual: ${actualCheckedState}`);
        }
        console.log(`✅ Verified - Dedicated to TP checkbox is ${checkedState}`);
        
        console.log(`🎯 Final Verification: Checkbox is ${actualEnableState} and ${actualCheckedState}`);
    }

    public async clickEnrollments() {
        await this.wait("minWait");
        await this.click(this.selectors.enrollments, "Enrollment", "Link")
    }

    async verifyNewEnrollmentEntry() {
        await this.wait("maxWait");
        const enrollmentRowSelector = this.selectors.enrollmentEntry;
        await this.validateElementVisibility(enrollmentRowSelector, "New enrollment entry");
        const isVisible = await this.page.locator(enrollmentRowSelector).isVisible();
        
        if (isVisible) {
            console.log("✅ Verified - New enrollment entry has been added in the enrollments table");
            return true;
        } else {
            throw new Error("Expected enrollment entry not found in the table");
        }
    }


    async selectMultiInstance() {
        await this.click(this.selectors.selectInstance, "instance", "Button")
        await this.click(this.selectors.multiInstance, "Multi instance", "Button")
    }
}