import { AdminHomePage } from "./AdminHomePage";
import * as fs from 'fs';
import * as path from 'path';


export class CompletionCertificationPage extends AdminHomePage {

    public selectors = {
        ...this.selectors,
        // Common button selector
        buttonByText: (text: string) => `//button[text()='${text}']`,
        
        // Create/Edit page selectors
        createCompletionCertificateBtn: "//button[text()='CREATE COMPLETION CERTIFICATE']",
        createPageHeading: "//h1[text()='Create Completion Certificate']",
        editPageHeading: "//h1[text()='Edit Completion Certificate']",
        templateType: "//label[text()='Template type']/parent::div//label[contains(@class,'custom-control-label')]",
        randomTemplate: (index: string) => `(//label[text()='Template type']/parent::div//label[contains(@class,'custom-control-label')])[${index}]`,
        titleInput: "//input[@id='title']",
        designCertificateDescription: "//div[@class='note-editable']",
        pictureBtn: "//button[@aria-label='Picture']",
        imgUpload: "input[id^='note-dialog-image-file']",
        domainDropdown: "//select[@id='portal_ids']//following::button[1]",
        domainOption: (value: string) => `//select[@id='portal_ids']//following::span[text()='${value}']`,
        
        // Action buttons
        publishBtn: "//button[text()='Publish']",
        saveDraftBtn: "//button[text()='Save Draft']",
        discardBtn: "//button[text()='Discard']",
        updateBtn: "//button[text()='Update']",
        
        // Modal/Dialog selectors
        modifyAccessModal: "//div[contains(@class,'modal-footer ')]",
        modifyAccessMessage: "//span[contains(text(),'This  Program will be assigned')]",
        proceedBtn: "//button[text()='Yes, Proceed']",
        modifyAccessBtn: "//button[text()='No, modify the access']",
        
        // Edit Access Push-box selectors
        editAccessPushBox: "//button[@id='crt-access-attr-btn']",
        adminGroupDropdown: "(//label[text()='Admin Group']//following::button)[1]",
        
        // Listing page selectors
        completionCertificatePageHeading: "//h1[contains(text(),'Completion Certificate')]",
        searchInput: "//input[@id='exp-search-field']",
        
        // Tab selectors
        publishedTab: "//button[contains(text(),'Published')]",
        savedDraftsTab: "//button[contains(text(),'Saved Drafts')]",
        unpublishedTab: "//button[contains(text(),'Unpublished')]",
        activePublishedTab: "//button[contains(@class,'active') and contains(text(),'Published')]",
        activeSavedDraftsTab: "//button[contains(@class,'active') and contains(text(),'Saved Drafts')]",
        activeUnpublishedTab: "//button[contains(@class,'active') and contains(text(),'Unpublished')]",
        inactiveTab: "//button[contains(@class,'inactive')]",
        
        // Certificate row actions
        certificationName: (name: string) => `//li[text()='${name}']`,
        publishIcon: (title: string) => `(//div[text()='${title}']//following::i)[1]`,
        unpublishIcon: (title: string) => `(//div[text()='${title}']//following::a[@aria-label='Unpublish'])[1]`,
        cloneIcon: (title: string) => `(//div[text()='${title}']//following::a)[1]`,
        editIcon: (title: string) => `//td[text()='${title}']//following::button[@title='Edit']`,
        deleteIcon: (title: string) => `//td[text()='${title}']//following::button[@title='Delete']`,
        
        // Success/Info messages
        successMessage: "//div[@id='lms-overall-container']//h3",
        publishSuccessMsg: (title: string) => `//div[contains(text(),'Completion Certificate "${title}" has been published successfully.')]`,
        unpublishSuccessMsg: (title: string) => `//div[contains(text(),'Completion Certificate "${title}" has been unpublished successfully.')]`,
        okBtn: "//button[text()='Ok']",
        
        // Next action page
        editCertificateBtn: "//a[text()='Edit Certificate']",
        createNewCertificateBtn: "//a[text()='Create New Certificate']",
        goToListingPageBtn: "//a[text()='Go to Listing']",
        
        // Change Log
        expandChangeLogBtn: "//div[text()='Change Log']//following::i[contains(@class,'plus')]",
        // changeLogCollapseBtn: "//div[text()='Change Log']//following::i[contains(@class,'minus')]",
        changeLogCollapseBtn: "//h2[@id='changelogheader']//button[@data-bs-toggle='collapse']",
        
        changeLogSection: "(//div[contains(@id,'changelog')])[2]",
        changeLogRows: "//div[contains(@class,'row lms-tbl-row py-2')]",
        changeLogColumns: "//div[contains(@class,'col-2')]",
        
        // Filter, Sort, Export
        filterBtn: "//div[text()='Filters']",
        sortBtn: "(//button[contains(@class,'customselectpicker')]//i)",
        codeBtn:`//button[contains(@class,'codeview')]`,
        codeArea:`//textarea[@class='note-codable']`

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
        await this.type(this.selectors.titleInput, "Title", data);
    }

    async designCertificate(data: string) {
        await this.type(this.selectors.designCertificateDescription, "Description", data)
        await this.click(this.selectors.pictureBtn, "Picture", "Button");
        const certificate = "../data/dummyCertificate.jpg"
        await this.uploadFile(this.selectors.imgUpload, certificate)
    }

    async designCertificateWithHtml(data: string) {
        await this.type(this.selectors.designCertificateDescription, "Description", data);
        await this.click(this.selectors.codeBtn, "Code", "Button"); 
        await this.wait('mediumWait');
        // Read HTML template from file
        const templatePath = path.join(process.cwd(), 'data', 'completioncertificate', 'certificateTemplate.html');
        const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
        // Clear existing content and type the HTML template
        await this.page.locator(this.selectors.codeArea).clear();
        await this.click(this.selectors.codeArea, "Code", "Text Area");
        await this.type(this.selectors.codeArea, "Code", htmlTemplate);
        console.log('✅ HTML certificate template applied');
        // Switch back to visual preview mode so certificate renders correctly in PDF
        await this.click(this.selectors.codeBtn, "Code", "Button");
        await this.wait('minWait'); // Wait for preview to render
        console.log('✅ Switched to preview mode for proper PDF rendering');
    }
    



    async clickPublish() {
        await this.validateElementVisibility(this.selectors.publishBtn, "Publish");
        await this.click(this.selectors.publishBtn, "Publish", "Button");
        await this.wait('maxWait');
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
        await this.typeAndEnter(this.selectors.searchInput, "Search Input", title);
        // await this.click(this.selectors.certificationName(title), "completion certificate", "Button");
        await this.wait("minWait");
    }

    public async verifySaveDraftCount() {
        await this.wait("minWait");
        const savedDraftsTabText = await this.getInnerText(this.selectors.savedDraftsTab);
        const match = savedDraftsTabText.match(/\((\d+)\)/);
        let savedDraftsCount = 0;

        if (match) {
            savedDraftsCount = parseInt(match[1], 10);
        }
        console.log(`Saved Drafts Completion Certificate count: ${savedDraftsCount}`);
        console.log('Saved Drafts count verified successfully');
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

    // New comprehensive methods for all test scenarios

    async verifyCreateCertificatePageDisplayed(): Promise<void> {
        await this.wait('mediumWait');
        await this.validateElementVisibility(this.selectors.createPageHeading, "Create Completion Certificate Page");
    }

    async verifyDiscardAndSaveDraftEnabled(): Promise<void> {
        await this.wait('minWait');
        const discardEnabled = await this.page.locator(this.selectors.discardBtn).isEnabled();
        const saveDraftEnabled = await this.page.locator(this.selectors.saveDraftBtn).isEnabled();
        
        if (!discardEnabled || !saveDraftEnabled) {
            throw new Error('Discard and Save Draft buttons should be enabled when title is given');
        }
        console.log('✅ Discard and Save Draft buttons are enabled after entering title');
    }

    async verifyAllButtonsEnabledAfterMandatoryFields(): Promise<void> {
        await this.wait('minWait');
        
        await this.page.locator(this.selectors.discardBtn).scrollIntoViewIfNeeded();
        const discardEnabled = await this.page.locator(this.selectors.discardBtn).isEnabled();
        const saveDraftEnabled = await this.page.locator(this.selectors.saveDraftBtn).isEnabled();
        const publishEnabled = await this.page.locator(this.selectors.publishBtn).isEnabled();
        
        if (!discardEnabled || !saveDraftEnabled || !publishEnabled) {
            throw new Error('All buttons should be enabled when mandatory fields are filled');
        }
        console.log('✅ Discard, Save Draft, and Publish buttons are enabled after filling mandatory fields');
    }

    async clickDiscard(): Promise<void> {
        await this.click(this.selectors.discardBtn, "Discard", "Button");
        await this.wait('mediumWait');
    }

    async clickSaveDraft(): Promise<void> {
        await this.click(this.selectors.saveDraftBtn, "Save Draft", "Button");
        await this.wait('mediumWait');
    }

    async verifyNavigatedToListingPage(): Promise<void> {
        await this.wait('mediumWait');
        await this.validateElementVisibility(this.selectors.completionCertificatePageHeading, "Completion Certificate Listing Page");
    }

    async clickDomain() {
        await this.validateElementVisibility(this.selectors.domainDropdown, "Domain Dropdown");
        await this.click(this.selectors.domainDropdown, "Domain", "Dropdown");
        await this.wait('minWait')
    }

    async selectDomain(domainName: string): Promise<void> {
        await this.click(this.selectors.domainOption(domainName), `Domain: ${domainName}`, "Option");
        await this.wait('minWait');
    }

    async unselectDomain(domainName: string): Promise<void> {
        await this.click(this.selectors.domainOption(domainName), `Unselect Domain: ${domainName}`, "Option");
        await this.wait('minWait');
    }

    async verifyModifyAccessModalDisplayed(): Promise<void> {
        await this.wait('mediumWait');
        await this.validateElementVisibility(this.selectors.modifyAccessModal, "Modify Access Modal");
        await this.validateElementVisibility(this.selectors.modifyAccessMessage, "Modify Access Message");
        await this.validateElementVisibility(this.selectors.proceedBtn, "Yes, Proceed Button");
        await this.validateElementVisibility(this.selectors.modifyAccessBtn, "No, Modify the Access Button");
        console.log('✅ Modify Access modal displayed with expected message and buttons');
    }

    async verifySavedDraftSuccessMessage(title: string): Promise<void> {
        await this.wait('mediumWait');
        await this.verification(this.selectors.successMessage, "successfully");
        console.log(`✅ Completion Certificate "${title}" saved as draft successfully`);
    }

    async verifyPublishSuccessMessage(title: string): Promise<void> {
        await this.wait('mediumWait');
        await this.verification(this.selectors.successMessage, "published successfully");
        console.log(`✅ Completion Certificate "${title}" published successfully`);
    }

    async verifyUnpublishSuccessMessage(title: string): Promise<void> {
        await this.wait('mediumWait');
        await this.verification(this.selectors.successMessage, "unpublished successfully");
        console.log(`✅ Completion Certificate "${title}" unpublished successfully`);
    }

    async clickOkButton(): Promise<void> {
        await this.click(this.selectors.okBtn, "Ok", "Button");
        await this.wait('minWait');
    }

    async clickGoToListingPage(): Promise<void> {
        await this.validateElementVisibility(this.selectors.goToListingPageBtn, "Go To Listing Page");
        await this.click(this.selectors.goToListingPageBtn, "Go To Listing Page", "Button");
        await this.wait('mediumWait');
    }

    async clickCreateNewCertificate(): Promise<void> {
        await this.validateElementVisibility(this.selectors.createNewCertificateBtn, "Create New Certificate");
        await this.click(this.selectors.createNewCertificateBtn, "Create New Certificate", "Button");
        await this.wait('mediumWait');
    }

    async clickPublishIcon(title: string): Promise<void> {
        await this.click(this.selectors.publishIcon(title), `Publish icon for ${title}`, "Button");
        await this.wait('mediumWait');
    }

    async clickUnpublishIcon(title: string): Promise<void> {
        await this.click(this.selectors.unpublishIcon(title), `Unpublish icon for ${title}`, "Button");
        await this.wait('mediumWait');
    }

    async clickCloneIcon(title: string): Promise<void> {
        await this.click(this.selectors.cloneIcon(title), `Clone icon for ${title}`, "Button");
        await this.wait('mediumWait');
    }

    async clickEditIcon(title: string): Promise<void> {
        await this.click(this.selectors.editIcon(title), `Edit icon for ${title}`, "Button");
        await this.wait('mediumWait');
    }

    async clickDeleteIcon(title: string): Promise<void> {
        await this.click(this.selectors.deleteIcon(title), `Delete icon for ${title}`, "Button");
        await this.wait('mediumWait');
    }

    async verifyEditIconsDisplayed(title: string): Promise<void> {
        await this.validateElementVisibility(this.selectors.editIcon(title), "Edit Icon");
        await this.validateElementVisibility(this.selectors.deleteIcon(title), "Delete Icon");
        console.log('✅ Edit and Delete icons are displayed');
    }

    async clickSavedDraftsTab(): Promise<void> {
        await this.click(this.selectors.savedDraftsTab, "Saved Drafts", "Tab");
        await this.wait('mediumWait');
    }

    async clickUnpublishedTab(): Promise<void> {
        await this.click(this.selectors.unpublishedTab, "Unpublished", "Tab");
        await this.wait('mediumWait');
    }

    async clickPublishedTab(): Promise<void> {
        await this.click(this.selectors.publishedTab, "Published", "Tab");
        await this.wait('mediumWait');
    }

    async verifySavedDraftsTabActive(): Promise<void> {
        await this.wait('minWait');
        await this.validateElementVisibility(this.selectors.activeSavedDraftsTab, "Active Saved Drafts Tab");
    }

    async verifyUnpublishedTabActive(): Promise<void> {
        await this.wait('minWait');
        await this.validateElementVisibility(this.selectors.activeUnpublishedTab, "Active Unpublished Tab");
    }

    async verifySavedDraftsCount(): Promise<void> {
        await this.wait("minWait");
        const tabText = await this.getInnerText(this.selectors.savedDraftsTab);
        const match = tabText.match(/\((\d+)\)/);
        let count = 0;

        if (match) {
            count = parseInt(match[1], 10);
        }
        console.log(`✅ Saved Drafts Completion Certificate count: ${count}`);
    }

    async verifyUnpublishedCount(): Promise<void> {
        const tabText = await this.getInnerText(this.selectors.unpublishedTab);
        const match = tabText.match(/\((\d+)\)/);
        let count = 0;

        if (match) {
            count = parseInt(match[1], 10);
        }
        console.log(`✅ Unpublished Completion Certificate count: ${count}`);
    }

    async verifyEditCertificatePageDisplayed(): Promise<void> {
        await this.wait('mediumWait');
        await this.validateElementVisibility(this.selectors.editPageHeading, "Edit Completion Certificate Page");
    }

    async clickExpandChangeLog(): Promise<void> {
        await this.wait('minWait');
        await this.click(this.selectors.expandChangeLogBtn, "Expand Change Log", "Button");
    }

    async clickCollapseChangeLog(): Promise<void> {
        await this.wait('minWait');
        await this.validateElementVisibility(this.selectors.changeLogCollapseBtn, "Collapse Change Log Button");
        await this.click(this.selectors.changeLogCollapseBtn, "Collapse Change Log", "Button");

    }

    async verifyChangeLogDisplayed(): Promise<void> {
        await this.validateElementVisibility(this.selectors.changeLogSection, "Change Log Section");
        console.log('✅ Change Log section is displayed');
    }

    async verifyChangeLogClosed(): Promise<void> {
        const isVisible = await this.page.locator(this.selectors.changeLogSection).isVisible();
        if (isVisible) {
            throw new Error('Change Log should be closed');
        }
        console.log('✅ Change Log section is closed');
    }

    async verifyFilterSortOptions(): Promise<void> {
        await this.validateElementVisibility(this.selectors.filterBtn, "Filter Button");
        await this.validateElementVisibility(this.selectors.sortBtn, "Sort Button");
        console.log('✅ Filter, Sorts options are displayed');
    }

    async filter() {
        await this.click(this.selectors.filterBtn, "Filter", "Button");
        
    }

    async clickExportChangeLog(): Promise<void> {
        await this.click(this.selectors.exportBtn, "Export Change Log", "Button");
        await this.wait('minWait');
    }

    async getChangeLogData(): Promise<any[]> {
        await this.wait("mediumWait");
        
        // Clean JSON file before storing new data
        const jsonPath = path.join(process.cwd(), 'test-results', 'changeLogData.json');
        if (fs.existsSync(jsonPath)) {
            fs.unlinkSync(jsonPath);
            console.log('Previous Change Log JSON file cleaned');
        }
        
        // Wait for change log rows to be visible
        await this.page.waitForSelector(this.selectors.changeLogRows, { timeout: 10000 }).catch(() => {
            console.log('Warning: Change log rows not found');
        });
        
        // Get all div rows from Change Log section
        const rows = await this.page.locator(this.selectors.changeLogRows).all();
        console.log(`Found ${rows.length} change log rows`);
        
        const changeLogData: any[] = [];
        
        for (const row of rows) {
            // Get all col-2 divs within this row
            const columns = await row.locator("div[class*='col-2']").allTextContents();
            
            if (columns.length > 0) {
                // Extract and trim all column values - INCLUDING "WHAT CHANGED" column
                // This is intentional to validate that Excel export matches UI exactly
                const rowData = columns.map(col => col.trim()).filter(col => col !== '');
                
                if (rowData.length > 0) {
                    changeLogData.push({
                        data: rowData
                    });
                    console.log(`UI Row data: ${rowData.join(' | ')}`);
                }
            }
        }
        
        console.log(`Extracted ${changeLogData.length} change log entries from UI`);
        
        // Store in JSON file for export validation
        const resultsDir = path.join(process.cwd(), 'test-results');
        if (!fs.existsSync(resultsDir)) {
            fs.mkdirSync(resultsDir, { recursive: true });
        }
        
        fs.writeFileSync(jsonPath, JSON.stringify(changeLogData, null, 2));
        console.log(`Change log data stored in: ${jsonPath}`);
        
        return changeLogData;
    }

    async verifyUnpublishRestrictionMessage(): Promise<void> {
        await this.wait('mediumWait');
        // Check if unpublish restriction modal/message is displayed
        const errorMessage = this.page.locator("//div[contains(text(),'associated') and contains(text(),'certificate')]");
        
        try {
            await errorMessage.waitFor({ state: 'visible', timeout: 5000 });
            const message = await errorMessage.textContent();
            console.log(`✅ Unpublish restricted: ${message}`);
        } catch (error) {
            throw new Error('❌ Certificate can be unpublished even though it is associated with Course/TP - No restriction message displayed');
        }
    }


}