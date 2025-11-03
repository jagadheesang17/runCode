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
        completionCertificateMenu: "//span//span[text()='Completion Certificate']",
        tagsSearchField: "//input[@id='tags-search-field']",
        tagListItem: (tagName: string) => `//li[text()='${tagName}']`,
        okBtnTag: "(//button[text()='OK'])",
        okBtnCertificate: "(//button[text()='OK'])[2]",
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
        const selector = this.selectors.completionCertificateMenu;
        await this.click(selector, "completion Certificate", "Link");
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
        await this.validateElementVisibility(this.selectors.businessRule, "Business Rule")
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

    async clickUpdate() {
        await this.wait('mediumWait')
        await this.click(this.selectors.updateBtn, "Update", "Button")
        await this.wait('mediumWait')
    }

}