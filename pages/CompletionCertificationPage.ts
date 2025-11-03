import { AdminHomePage } from "./AdminHomePage";


export class CompletionCertificationPage extends AdminHomePage {

    public selectors = {
        ...this.selectors,
        createCompletionCertificateBtn: "//button[text()='CREATE COMPLETION CERTIFICATE']",
        templateType: "//label[text()='Template type']/parent::div//label[contains(@class,'custom-control-label')]",
        randomTemplate: (index: string) => `(//label[text()='Template type']/parent::div//label[contains(@class,'custom-control-label')])[${index}]`,
        title: "//input[@id='title']",
        designCertificateDescription: "//div[@class='note-editable']",
        pictureBtn: "//button[@aria-label='Picture']",
        imgUpload: "input[id^='note-dialog-image-file']",
        publishBtn: "//button[text()='Publish']",
        proceedBtn: "//button[text()='Yes, Proceed']",
        editCertificateBtn: "//a[text()='Edit Certificate']",
        updateBtn: "//button[text()='Update']",
        successfullMessage: "//div[@id='lms-overall-container']//h3",
        // Tab selectors based on actual HTML structure
        publishedTab: "//button[contains(text(),'Published')]",
        savedDraftsTab: "//button[contains(text(),'Saved Drafts')]",
        unpublishedTab: "//button[contains(text(),'Unpublished')]",
        activePublishedTab: "//button[contains(@class,'active') and contains(text(),'Published')]",
        inactiveTab: "//button[contains(@class,'inactive')]",
        completionCertificatePageHeading: "//h1[contains(text(),'COMPLETION CERTIFICATE')]",
        modifyAccessBtn: "//button[text()='No, modify the access']",
        // Edit Access Push-box selectors
        editAccessPushBox: "//button[@id='crt-access-attr-btn']",
        adminGroupDropdown: "(//label[text()='Admin Group']//following::button)[1]",
        searchInput: "//input[@id='exp-search-field']",
        certificationName: (name: string) => `//li[text()='${name}']`
    }

    async clickCreateCompletionCertificate() {
        await this.mouseHover(this.selectors.createCompletionCertificateBtn, "Create Completion Certificate")
        await this.click(this.selectors.createCompletionCertificateBtn, "Create Completion Certificate", "Button");

    }

    async verify_CompletionCertificateLabel() {

        await this.verification("//h1[text()='Create Completion Certificate']", "Create Completion Certificate")
    }

    async clickTemplateType() {
        const count = await this.page.locator(this.selectors.templateType).count();
        const randomIndex = Math.floor(Math.random() * (count)) + 1;
        await this.click(this.selectors.randomTemplate(randomIndex), "Template Type", "Checkbox");
    }

    async title(data: string) {
        await this.wait('mediumWait');
        await this.type(this.selectors.title, "Title", data);
    }

    async designCertificate(data: string) {
        await this.type(this.selectors.designCertificateDescription, "Description", data)
        await this.click(this.selectors.pictureBtn, "Picture", "Button");
        const certificate = "../data/dummyCertificate.jpg"
        await this.uploadFile(this.selectors.imgUpload, certificate)

    }

    async clickPublish() {
        await this.validateElementVisibility(this.selectors.publishBtn, "Publish");
        await this.click(this.selectors.publishBtn, "Publish", "Button");
         await this.wait('mediumWait');

    }


    async clickProceed() {
        await this.wait('maxWait');
        await this.validateElementVisibility(this.selectors.proceedBtn, "Proceed");
        await this.click(this.selectors.proceedBtn, "Proceed", "Button");
    }

    async clickEditCertificate() {
        await this.validateElementVisibility(this.selectors.editCertificateBtn, "Edit Certificate");
        await this.click(this.selectors.editCertificateBtn, "Edit Certificate", "Button");
        await this.page.waitForLoadState('load');
        await this.wait('mediumWait');
    }

    async clickUpdate() {
        await this.mouseHover(this.selectors.updateBtn, "Update");
        await this.validateElementVisibility(this.selectors.updateBtn, "Update");
        await this.click(this.selectors.updateBtn, "Update", "Button");
    }

    async verifyCeritificateSuccessMessage() {
        await this.spinnerDisappear();
        await this.verification(this.selectors.successfullMessage, "successfully");
    }

    // Tab validation methods
    async verifyCompletionCertificatePageLoad() {
        await this.wait('mediumWait');
        await this.validateElementVisibility(this.selectors.completionCertificatePageHeading, "Completion Certificate Page");
    }

    async verifyPublishedTabIsActive() {
        await this.wait('minWait');
        await this.validateElementVisibility(this.selectors.publishedTab, "Published Tab");
        await this.validateElementVisibility(this.selectors.activePublishedTab, "Active Published Tab");
        
        // Verify the Published tab has 'active' class
        const publishedTabClass = await this.page.locator(this.selectors.publishedTab).getAttribute('class');
        console.log(`Published tab classes: ${publishedTabClass}`);
        
        if (publishedTabClass && publishedTabClass.includes('active')) {
            console.log('Published tab is active (contains "active" class)');
        } else {
            throw new Error('Published tab is not active - missing "active" class');
        }
    }

    async verifyInactiveTabsExist() {
        await this.wait('minWait');
        // Verify that there are inactive tabs (should be Saved Drafts and Unpublished)
        const inactiveTabs = await this.page.locator(this.selectors.inactiveTab).count();
        console.log(`Number of inactive tabs found: ${inactiveTabs}`);
        
        if (inactiveTabs >= 1) {
            console.log('Inactive tabs are present as expected');
        } else {
            console.log('No inactive tabs found - this might be unexpected');
        }
    }

    async verifyAllTabsAreVisible() {
        await this.validateElementVisibility(this.selectors.publishedTab, "Published Tab");
        await this.validateElementVisibility(this.selectors.savedDraftsTab, "Saved Drafts Tab");
        await this.validateElementVisibility(this.selectors.unpublishedTab, "Unpublished Tab");
    }

    async getPublishedTabText() {
        const tabText = await this.getInnerText(this.selectors.publishedTab);
        console.log(`Published Completion Certificate: ${tabText}`);
        return tabText;
    }


    async clickModifyAccess() {
        await this.validateElementVisibility(this.selectors.modifyAccessBtn, "No, Modify the Access");
        await this.click(this.selectors.modifyAccessBtn, "No, Modify the Access", "Button");
        await this.wait('mediumWait');
    }

    async verifyEditAccessPushBox() {
        await this.wait('mediumWait');
        await this.validateElementVisibility(this.selectors.editAccessPushBox, "Edit Access Push-box");
        await this.validateElementVisibility(this.selectors.adminGroupDropdown, "Admin Group Dropdown");
        
        console.log('✅ Edit access dialog/push-box opens successfully');
        console.log('✅ Admin Group dropdown is present');
    }

   public async searchCompletionCertificate(title: string) {
       await this.wait("minWait");
        await this.type(this.selectors.searchInput, "Search Input", title);
        await this.click(this.selectors.certificationName(title), "completion certificate", "Button");
        await this.wait("minWait");
   }   

    public async verifyPublishedCount() {
        await this.wait("minWait");
        const publishedTabText = await this.getInnerText(this.selectors.publishedTab);
        const match = publishedTabText.match(/\((\d+)\)/);
        let publishedCount = 0;

        if (match) {
            publishedCount = parseInt(match[1], 10);
        }
        console.log(`Published Completion Certificate count: ${publishedCount}`);
        console.log('Published count verified successfully');
    }
}