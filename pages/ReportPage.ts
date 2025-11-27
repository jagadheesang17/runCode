import { Page, BrowserContext, expect } from "@playwright/test";
import { AdminHomePage } from "./AdminHomePage";

export class ReportPage extends AdminHomePage {
    public selectors = {
        ...this.selectors,
        // Navigation selectors
        reportsMenu: `//span[text()='Reports']`,
        reportsDashboardMenu: `//a[text()='Report Dashboard']`,
        
        // Page verification selectors
        quickReportsHeading: `//h1[text()='Quick Reports']`,
        createReportTemplateHeading: `//h1[text()='Create Report Template']`,

        // Create report template selectors
        createReportTemplateButton: `//button[text()='Create Report Template']`,
        reportNameField: '[name="report_name"]',
        reportCategoryDropdown: '[data-id="report_categories"]',
        reportTypeDropdown: '[data-id="report_structure"]',
        reportVisibilityDropdown: '[data-id="report_role_input_field_list"]',
        descriptionField: `//div[@id='report_description']//p`,

        // Configuration section selectors
        configurationDiv: '.configuration',
        
        // Step 1 - Choose columns
        searchField: 'input[placeholder*="Search"]',
        searchResultsFirst: '.search-results li:first-child',
        
        // Step 2 - Launch values
        launchValuesDropdown: '[data-id="launch_fields"]',
        
        // Step 3 - Pre applied filters
        primaryEntityDropdown: '[data-id="select_report_entity_list"]',
        dateDropdown: '[data-id="select_report_entity_date_selected"]',
        dateRangeDropdown: '[data-id="dateRangeUnitSelect"]',
        
        // Where text filters
        whereTextFirstDropdown: '[data-id="report_add_input_field_list0"]',
        whereTextSecondDropdown: '[data-id="report_add_input_field_operator0"]',
        whereTextInput: '#input_field_value0',
        
        // Action buttons
        previewButton: `//button[text()='Preview']`,
        saveButton: `//button[text()='Save']`,
        // Report listing and launch
        reportCategoryButton: (category: string) => `//button[text()='${category}']`,
        launchButton:  (reportName: string) =>`(//div[text()='${reportName}']//following::i[@aria-label="Launch"])[1]`,
        reportSuccessMsg:`//section[contains(@class,'lms-success-msg-wrapper')]//h3`,
    };

    constructor(page: Page, context: BrowserContext) {
        super(page, context);
    }

    /**
     * Navigate to Reports Dashboard
     */
    async navigateToReportsDashboard(): Promise<void> {
        await this.page.locator(this.selectors.reportsMenu).click();
        await this.page.locator(this.selectors.reportsDashboardMenu).click();
    }

    /**
     * Verify Quick Reports heading is present
     */
    async verifyQuickReportsHeading(): Promise<void> {
        await expect(this.page.locator(this.selectors.quickReportsHeading)).toBeVisible();
        console.log("Quick Reports heading verified");
    }

    /**
     * Click Create Report Template button
     */
    async clickCreateReportTemplate(): Promise<void> {
        await  this.wait("minWait")
        await this.page.locator(this.selectors.createReportTemplateButton).click();
    }

    /**
     * Verify Create Report Template heading is present
     */
    async verifyCreateReportTemplateHeading(): Promise<void> {
        await  this.wait("minWait")
        await expect(this.page.locator(this.selectors.createReportTemplateHeading)).toBeVisible();
        console.log("Create Report Template heading verified");
    }

    /**
     * Enter report name
     */
    async enterReportName(reportName: string): Promise<void> {
        await this.page.locator(this.selectors.reportNameField).fill(reportName);
        console.log(`Report name entered: ${reportName}`);
    }

    /**
     * Get all options from report category dropdown and select one
     */
    async selectReportCategory(selectedCategory:string): Promise<string> {
        await this.page.locator(this.selectors.reportCategoryDropdown).click();
        const options = await this.page.locator('[name="report_categories"] option').allTextContents();
        console.log("Available report categories:", options);

        // Select "Catalog" as specified
        await this.page.locator(`//span[text()='${selectedCategory}']`).click();
       // await this.page.selectOption('[name="report_categories"]', selectedCategory);
        console.log(`Selected report category: ${selectedCategory}`);
        return selectedCategory;
    }

    /**
     * Get all options from report type dropdown and select one
     */
    async selectReportType(selectedType: string): Promise<string> {
        await this.page.locator(this.selectors.reportTypeDropdown).click();
        const options = await this.page.locator('[name="report_structure"] option').allTextContents();
        console.log("Available report types:", options);
        await this.page.locator(`//span[text()='${selectedType}']`).click();
        console.log(`Selected report type: ${selectedType}`);
        return selectedType;
    }

    /**
     * Get all options from report visibility dropdown and select one
     */
    async selectReportVisibility(selectedVisibility: string): Promise<string> {
        await this.page.locator(this.selectors.reportVisibilityDropdown).click();
        const options = await this.page.locator('[name="report_role_input_field_list"] option').allTextContents();
        console.log("Available report visibilities:", options);
        
        // Check if the option is already selected by looking for the check-mark
        const checkMarkLocator = this.page.locator(`(//span[text()='${selectedVisibility}']//preceding-sibling::span[@class=' bs-ok-default check-mark'])[1]`);
        const isAlreadySelected = await checkMarkLocator.count() > 0;
        
        if (!isAlreadySelected) {
            await this.page.locator(`//span[text()='${selectedVisibility}']`).click();
            console.log(`Selected report visibility: ${selectedVisibility}`);
        } else {
            console.log(`Report visibility '${selectedVisibility}' is already selected, skipping click`);
        }
        
        return selectedVisibility;
    }

    /**
     * Enter description
     */
    async enterDescription(description: string): Promise<void> {
        //await this.page.locator(this.selectors.descriptionField).fill(description);
        await this.type(this.selectors.descriptionField,"Description: " , description);
        console.log(`Description entered: ${description}`);
    }

    /**
     * Step 1 - Choose columns: Search and select first result, then click first four li elements after Catalogs div
     */
    async configureStep1ChooseColumns(searchValue: string): Promise<void> {
        //search functionality
        // await this.page.locator(this.selectors.searchField).first().fill(searchValue);
        // await this.page.waitForTimeout(1000); // Wait for search results
        // await this.page.locator(this.selectors.searchResultsFirst).click();
         await this.page.locator(`//span[text()='step 1 - choose columns']//following::div[contains(text(),'${searchValue}')]`).click();

        // Additional step - click the first four li elements following the Catalogs div
        const liElements = this.page.locator(`//span[text()='step 1 - choose columns']//following::div[contains(text(),'${searchValue}')]//following::li`);
        const count = await liElements.count();
        const clickCount = Math.min(4, count); // Click maximum 4 or available count
        for (let i = 0; i < clickCount; i++) {
            await liElements.nth(i).click();
            await this.page.waitForTimeout(500);
            console.log(`Clicked li element ${i + 1}`);
        }
        
        console.log(`Step 1 completed: Searched for "${searchValue}", selected first result, and clicked first ${clickCount} li elements after Catalogs div`);
    }

    /**
     * Step 2 - Enter value at launch: Select from dropdown
     */
    async configureStep2LaunchValues(): Promise<void> {
        await this.page.locator(this.selectors.launchValuesDropdown).click();
        // Select first available option
        await this.page.locator('[name="launch_fields"] option').first().click();
        console.log("Step 2 completed: Selected launch value");
    }

    /**
     * Step 3 - Pre applied filters: Configure primary entity, date, and date range
     */
    async configureStep3PreAppliedFilters(primaryEntityValue: string): Promise<void> {
        // Primary Entity
        await this.page.locator(this.selectors.primaryEntityDropdown).click();
        await this.page.locator(`//label[text()='Primary Entity']//following::span[contains(text(),'${primaryEntityValue}')]`).click();
        console.log(`Primary entity selected: ${primaryEntityValue}`);
        
        // Date dropdown - select "Updated On"
        await this.page.locator(this.selectors.dateDropdown).click();
        await this.page.locator(`//label[text()='Date']//following::span[text()='Updated On']`).click();
        console.log("Date selected: Updated On");
        
        // Date Range dropdown - select "Today"
        await this.page.locator(this.selectors.dateRangeDropdown).click();
        await this.page.locator(`//label[text()='Date Range']//following::span[text()='Today']`).click();
        console.log("Date range selected: Today");
    }

    /**
     * Configure where text filters
     */
    async configureWhereTextFilters(): Promise<void> {
        // First dropdown - select "code"
        await this.page.locator(this.selectors.whereTextFirstDropdown).click();
        await this.page.locator(`//div[text()='where']//following::span[text()='Code']`).click();
        console.log("Where text first dropdown: code selected");
        
        // Second dropdown - select "contains"
        await this.page.locator(this.selectors.whereTextSecondDropdown).click();
        await this.page.locator(`//div[text()='where']//following::span[text()='Contains']`).click();
        console.log("Where text second dropdown: contains selected");
        
        // Text field - enter "CRS"
        await this.page.locator(this.selectors.whereTextInput).fill('CRS');
        console.log("Where text input: CRS entered");
    }

    /**
     * Click preview button
     */
    async clickPreview(): Promise<void> {
        await this.page.locator(this.selectors.previewButton).click();
        console.log("Preview button clicked");
        await this.wait("mediumWait"); // Medium wait as specified
    }

    /**
     * Click save button
     */
    async clickSave(): Promise<void> {
        await this.page.locator(this.selectors.saveButton).click();
        console.log("Save button clicked");
    }


    /**
     * Click report category button in listing
     */
    async clickReportCategoryButton(category: string): Promise<void> {
        await this.page.locator(this.selectors.reportCategoryButton(category)).click();
        console.log(`Report category button clicked: ${category}`);
    }

    /**
     * Click launch button
     */
    async clickLaunch(reportName: string): Promise<void> {
        await this.page.locator(this.selectors.launchButton(reportName)).click();
        console.log("Launch button clicked");
        await this.page.waitForTimeout(3000); // Medium wait as specified
    }

    /**
     * Verify course code is present on the report page
     */
    async verifyCourseCodePresent(courseCode: string): Promise<void> {
        const courseCodeLocator = this.page.locator(`text=${courseCode}`);
        await expect(courseCodeLocator).toBeVisible();
        console.log(`Course code verified on report page: ${courseCode}`);
    }
      async verifySuccessMessage() {
        await this.wait("minWait")
        await this.verification(this.selectors.reportSuccessMsg, "successfully");
    }
}
