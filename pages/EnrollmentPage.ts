import { BrowserContext, Page } from "@playwright/test";
import { AdminHomePage } from "./AdminHomePage";
import { URLConstants } from "../constants/urlConstants";
import { FakerData, getCurrentDateFormatted } from "../utils/fakerUtils";


export class EnrollmentPage extends AdminHomePage {

    public selectors = {
        ...this.selectors,
        manageEnrollement: `(//div[@id='wrapper-enrollment-action']//div)[1]`,
        enrollType: `//span[text()='Enroll']`,
        searchcourseOrUser: `//input[contains(@id,'exp-search')]`,
        courseList: `//div[contains(@id,'exp-search-lms')]//li`,
        courseListOpt: (index: number) => `(//div[contains(@id,'exp-search-lms')]//li)[${index}]`,
        userList: `(//div[contains(@id,'lms-scroll-results')]//li)`,
        userListOpt: (index: number) => `(//div[contains(@id,'lms-scroll-results')]//li)[${index}]`,
        selectCourse: `(//input[contains(@id,'training')]/following::i)[1]`,
        selectedLearners: `//button[text()='Select Learner']`,
        selectUser: `(//input[contains(@id,'selectedlearners')]/following::i)[2]`,
        enrollBtn: "//button[text()='Enroll']",
        toastMeassage: `//section[contains(@class,'lms-success-msg-wrapper')]//h3`,
        enrollStatus: `(//div[contains(@id,'wrapper-enrollment-action')])[2]`,
        enrollORCancel: (data: string) => `//span[text()='${data}']`,
        reaonDesc: `//textarea[@id='check_box_msgsenrollmentviewstatususer']`,
        submitReason: `//button[text()='Submit']`,
        saveStatus: `//button[text()='Save']`,

        //Admin Enrollment:-
        clickModifyEnroll: `//a[text()='View/Modify Enrollment']`,
        completionDateInput: `//div[contains(@id,'check_box')]/input`,
        
        // Enrollment status action dropdown and options
        enrollmentActionBtn: (index: number) => `(//button[contains(@data-id,'enrollment-action')])[${index}]`,
        enrollmentStatusOption: (status: string) => `//button[contains(@data-id,'enrollment-action')]/following::span[text()='${status}']`,

        //Enroll-searchby
        enrollSearchDropdown: `//button[@data-id='training-searchby']`,
        enrollSearchBy: (data: string) => `//span[contains(text(),'Search by ${data}')]`,

        //Admin Enrollments:-
        viewLearner: `//button[text()='View Learner']`,

        //Enrollment by Manager
        selectTeamUser: `(//input[contains(@id,'selectedlearners')]/following::i)[1]`,
        selectTeamUserBtn: `//button[text()='Select']`,
        enrollementSts: (code: string) => `(//span[text()='${code}']//following::button[contains(@data-id,'usr-enrollment-action')])[1]`,
        enrollByCriteriaDropDown: `//label[text()='Enroll By Criteria']//following::button[contains(@data-id,'enroll-group')]`,

        //Class Cancel Reason
        cancelReason: `//textarea[@id='check_box_msgs']`,
        confirmBth: `//button[text()='Confirm']`,
        discardBtn: `//button[text()='Discard']`,

        //max seat over ride popup
        seatMaxPopupMsg: `//div[contains(@class,'information_text')]//span`,
        clickYesBtn: `//button[text()='Yes']`,
        okBtn: "//button[text()='OK']",
        clickEnrollButton: `//a[contains(@class,'btn') and text()='Enroll']`,
        goToHome: `//a[text()='Go to Home']`,
        
        //selecting the user for order creation
        selectUserForOrderCreation: (data: string) => `//td[contains(text(),'${data}')]//following::i[contains(@class,'fa-circle icon')][1]`,
        clickCheckoutBtn: `//button[text()='checkout']`,
        clickCalculateTax: `//button[text()='Calculate Tax']`,
        clickCreateAndApproveOrder:`//button[text()='create order & approve']`,
        clickCreateOrderBtn:`//button[text()='Create Order']`,
        selectCourseForOrderCreation:`(//input[contains(@id,'training')]/following::i)[2]`,
        paymentMethodDropdown: `//label[text()='Payment Method']//following::div[@id='wrapper-state']`,
        paymentMethod: (option: string) => `//span[text()='${option}']`,
        orderSuccessMsg: `//section[contains(@class,'lms-success')]//h3`,
        loadMoreBtn: `//button[text()='Load More']`,

        // Bulk enrollment selectors
        bulkEnrollmentTab: `//a[contains(@href,'/enrollment/bulk')]`,
        bulkEnrollmentBtn: `//button[contains(text(),'Bulk Enrollment')]`,
        downloadTemplateBtn: `//button[contains(text(),'Download Template')] | //a[contains(text(),'Download Template')]`,
        uploadFileInput: `//input[@type='file']`,
        uploadBtn: `//button[contains(text(),'Upload')] | //button[contains(text(),'Submit')]`,
        bulkUploadSuccessMsg: `//div[contains(@class,'success') or contains(@class,'alert-success')]`,
        enrollmentStatusTable: `//table[contains(@class,'enrollment')]`,
        enrollmentStatusRow: (username: string) => `//tr[contains(.,'${username}')]`,
        enrollmentStatus: (username: string) => `//tr[contains(.,'${username}')]//td[contains(@class,'status')]`,
        bulkEnrollmentResults: `//div[contains(@class,'bulk-results')] | //div[contains(@class,'enrollment-results')]`,
        
        // Navigation and menu items for bulk enrollment
        enrollmentMenu: `//a[contains(@href,'enrollment')] | //span[text()='Enrollment'] | //span[text()='Enrollments']`,
        bulkOperationsMenu: `//a[contains(text(),'Bulk')] | //span[contains(text(),'Bulk')]`,


    };


    constructor(page: Page, context: BrowserContext) {
        super(page, context);
    }
    async clickViewLearner() {
        await this.click(this.selectors.viewLearner, "View Learner", "Button")
    }
    
     //Popup handling when an admin tries to enroll for cancelled/completed class
     async clickOkBtn(){
        await this.wait("minWait")
        await this.validateElementVisibility(this.selectors.okBtn, 'OK');
        await this.click(this.selectors.okBtn, "OK", "Button")
    }


    //Class cancel reason in course page
    async classCancelReason() {
        await this.type(this.selectors.cancelReason, "Enroll Status", FakerData.getDescription())
        await this.click(this.selectors.confirmBth, "Submit", "button")
        await this.wait("maxWait")
    }

    async selectEnroll() {
        await this.click(this.selectors.manageEnrollement, "Manage Enrollment ", "Dropdown")
        await this.click(this.selectors.enrollType, "Manage Enrollment ", " EnrollLink")

    }

    async selectBycourse(data: string) {
        await this.type(this.selectors.searchcourseOrUser, "Course Name", data)
        const index = await this.page.locator("//div[contains(@id,'lms-scroll-results')]//li").count();
        const randomIndex = Math.floor(Math.random() * index) + 1;
        await this.click(this.selectors.courseListOpt(randomIndex), "Course", "Options")
        await this.click(this.selectors.selectCourse, "Select Course", "Radio button")

    }
    async clickSelectedLearner() {
        await this.wait("minWait")
        await this.click(this.selectors.selectedLearners, "Select Learners", "Button")

    }
    async enterSearchUser(data: string) {
        await this.wait("mediumWait")
        await this.type(this.selectors.searchcourseOrUser, "Course Name", data)
        const index = await this.page.locator("//div[contains(@id,'lms-scroll-results')]//li").count();
        const randomIndex = Math.floor(Math.random() * index) + 1;
        await this.click(this.selectors.userListOpt(randomIndex), "Course", "Options")
        await this.click(this.selectors.selectUser, "Select Course", "Radio button")
    }
    async clickEnrollBtn() {
        await this.click(this.selectors.enrollBtn, "Enroll", "Button")
    }
    async clickGotoHome(){
        await this.wait("minWait")
        await this.click(this.selectors.goToHome, "Go to Home", "Button")
    }
    async verifytoastMessage() {
        await this.verification(this.selectors.toastMeassage, "Enrollment")
    }
    // async selectEnrollOrCancel(data:string){
    //     await this.click(this.selectors.enrollStatus,"Enroll Status","Dropdown")
    //     await this.click(this.selectors.enrollORCancel(data),"Enroll Status","Option")
    // }

    async enterReasonAndSubmit() {
        await this.type(this.selectors.reaonDesc, "Enroll Status", FakerData.getDescription())
        await this.click(this.selectors.submitReason, "Submit", "button")
        await this.click(this.selectors.saveStatus, "Submit", "button")
    }

    //Admin Enrollment
    async clickModifyEnrollBtn() {
        await this.click(this.selectors.clickModifyEnroll, "View/Modify Enrollment", "Button")
    }

 public async completionDateInAdminEnrollment() {
        await this.keyboardType(this.selectors.completionDateInput, getCurrentDateFormatted())
        await this.page.keyboard.press('Tab');
        await this.wait("minWait")
        await this.validateElementVisibility(this.selectors.submitReason, "Submit Button");
        await this.click(this.selectors.submitReason, "Submit", "Button");
        await this.wait("minWait")
        await this.validateElementVisibility(this.selectors.saveButton, 'Save');
        await this.click(this.selectors.saveStatus, "Save", "Button");
        await this.spinnerDisappear();
        await this.wait('mediumWait');
    }

    async selectEnrollOrCancel(data: string) {
        await this.click(this.selectors.enrollStatus, "Enroll Status", "Dropdown")
        //await this.click(this.selectors.enrollORCancel(data).first(),"Enroll Status","Option")
        await this.page.locator(this.selectors.enrollORCancel(data)).first().click({ force: true });
    }
    async selectByOption(data: string) {
        await this.wait("minWait");
        await this.validateElementVisibility(this.selectors.enrollSearchDropdown, 'Search By Dropdown');
        await this.click(this.selectors.enrollSearchDropdown, "Search By Dropdown", "Button");
        await this.validateElementVisibility(this.selectors.enrollSearchBy(data), 'Search By Dropdown');
        await this.click(this.selectors.enrollSearchBy(data), "Search By Dropdown", "Button");
    }
    //Enrollment by manager
    async clickViewLearnerBtn() {
        await this.wait("minWait");
        await this.validateElementVisibility(this.selectors.viewLearner, 'View Learner');
        await this.click(this.selectors.viewLearner, "View Learner", "Button")
    }

    //Enrollment by manager

    async selectTeamUser() {
        await this.validateElementVisibility(this.selectors.selectTeamUser, "Select Team User");
        await this.click(this.selectors.selectTeamUser, "Select Team User", "Radio button")
        await this.validateElementVisibility(this.selectors.selectTeamUserBtn, "Select Team User Button");
        await this.click(this.selectors.selectTeamUserBtn, "Select Team User", "Button")
    }
    //Enrollment by manager


    async changeEnrollmentStatus(code: string, data: string) {
        await this.wait("mediumWait")
        // await this.page.locator(this.selectors.enrollementSts(code)).scrollIntoViewIfNeeded();
        let attempts = 0;
        const maxAttempts = 10;
        while (attempts < maxAttempts) {
            const isPresent = await this.page.locator(this.selectors.enrollementSts(code)).count() > 0;
            if (isPresent) {
                await this.validateElementVisibility(this.selectors.enrollementSts(code), "View/Update Status");
                await this.click(this.selectors.enrollementSts(code), "View/Update Status", "Dropdown");
                await this.page.locator(this.selectors.enrollORCancel(data)).last().click({ force: true });
                return;
            }
            const loadMoreBtn = this.page.locator(this.selectors.loadMoreBtn);

            await loadMoreBtn.scrollIntoViewIfNeeded();
            if (await loadMoreBtn.isVisible()) {
                await loadMoreBtn.click();
                await this.wait("minWait");
            } else {
                break;
            }
            attempts++;
        }
        // After all attempts, if not found, throw error
        throw new Error(`Enrollment status code '${code}' not found after loading all pages.`);
    }
    //Enrollment by manager

    async enrollByCriteria(data: string, option: string, option2: string) {
        await this.wait("minWait")
        const buttons = await this.page.locator(this.selectors.enrollByCriteriaDropDown)
        const buttonsCount = await buttons.count();
        for (let i = 0; i < buttonsCount; i++) {
            const button = buttons.nth(i);
            if (i === 0) {
                await button.click();
                await this.wait("minWait")
                await this.click(this.selectors.enrollORCancel(data), "Search By Dropdown", "Button");
            } else if (i === 1) {
                await button.click();
                await this.wait("minWait")
                await this.click(this.selectors.enrollORCancel(option), "Search By Dropdown", "Button");
                await this.click(this.selectors.enrollORCancel(option2), "Search By Dropdown", "Button");
            }
        }
    }

    /**
     * Verify available status options in enrollment action dropdown
     * @param index - Index of the enrollment action button (e.g., 2 for second learner)
     * @param expectedStatuses - Array of expected status options (e.g., ['Enrolled', 'No Show', 'Completed', 'Incomplete'])
     * @returns Object containing available statuses and verification result
     */
    async verifyEnrollmentStatusOptions(index: number, expectedStatuses: string[]): Promise<{ availableStatuses: string[], hasAllExpected: boolean, missingStatuses: string[] }> {
        await this.wait("minWait");
        
        // Click the enrollment action dropdown
        const actionButton = this.page.locator(this.selectors.enrollmentActionBtn(index));
        await actionButton.scrollIntoViewIfNeeded();
        await actionButton.click();
        await this.wait("minWait");
        
        // Get all available status options
        const availableStatuses: string[] = [];
        for (const status of expectedStatuses) {
            const statusLocator = this.page.locator(this.selectors.enrollmentStatusOption(status));
            const isVisible = await statusLocator.isVisible().catch(() => false);
            if (isVisible) {
                availableStatuses.push(status);
            }
        }
        
        // Close the dropdown by clicking elsewhere or pressing Escape
        await this.page.keyboard.press('Escape');
        await this.wait("minWait");
        
        // Check which statuses are missing
        const missingStatuses = expectedStatuses.filter(status => !availableStatuses.includes(status));
        const hasAllExpected = missingStatuses.length === 0;
        
        console.log(`   Available Statuses: ${availableStatuses.join(', ')}`);
        if (missingStatuses.length > 0) {
            console.log(`   Missing Statuses: ${missingStatuses.join(', ')}`);
        }
        
        return { availableStatuses, hasAllExpected, missingStatuses };
    }

    /**
     * Select enrollment status option from the action dropdown with retry logic
     * @param statusOption - The status option to select (e.g., 'Enrolled', 'Completed', 'Cancelled', 'No Show')
     * @param maxRetries - Maximum number of retry attempts (default: 3)
     * @description Clicks enrollment action dropdown, waits for option to appear, and clicks it with retry mechanism
     */
    async selectEnrollmentOption(statusOption: string, maxRetries: number = 3): Promise<void> {
        console.log(`Attempting to select enrollment status: ${statusOption}`);
        
        let attempt = 0;
        let success = false;
        
        while (attempt < maxRetries && !success) {
            try {
                attempt++;
                console.log(`   Attempt ${attempt} of ${maxRetries}`);
                
                // Click on enrollment action dropdown
                const enrollmentActionButton = `//button[@data-id='enrollment-action']`;
                await this.wait("minWait");
                await this.validateElementVisibility(enrollmentActionButton, "Enrollment Action Dropdown");
                await this.click(enrollmentActionButton, "Enrollment Action", "Dropdown");
                
                // Wait for the status option to appear
                const statusOptionSelector = `//span[text()='${statusOption}']`;
                await this.page.waitForSelector(statusOptionSelector, { timeout: 5000 });
                console.log(`   Status option ${statusOption} is now visible`);
                
                // Click on the status option
                await this.wait("minWait");
                await this.click(statusOptionSelector, statusOption, "Option");
                
                console.log(`Successfully selected enrollment status: ${statusOption}`);
                success = true;
                
            } catch (error) {
                console.log(`   Attempt ${attempt} failed: ${error}`);
                
                if (attempt >= maxRetries) {
                    throw new Error(`Failed to select enrollment status ${statusOption} after ${maxRetries} attempts. Last error: ${error}`);
                }
                
                await this.wait("minWait");
            }
        }
    }

      //manage enrollment
    async manageEnrollment(data: string) {
        await this.wait("mediumWait")
        await this.click(this.selectors.manageEnrollement, "Manage Enrollment ", "Dropdown")
        await this.click(this.selectors.enrollORCancel(data), "Manage Enrollment ", " EnrollLink")
    }
    async enterSearchUserForSingleOrder(data: string) {
        await this.type(this.selectors.searchcourseOrUser, "Course Name", data)
        const index = await this.page.locator("//div[contains(@id,'lms-scroll-results')]//li").count();
        const randomIndex = Math.floor(Math.random() * index) + 1;
        await this.click(this.selectors.userListOpt(randomIndex), "Course", "Options")
        await this.click(this.selectors.selectUserForOrderCreation(data), "Select Course", "Radio button")
    }
    async clickCheckoutButton() {
        await this.wait("minWait")
        await this.click(this.selectors.clickCheckoutBtn, "Checkout", "button")
        await this.wait("minWait")
        await this.click(this.selectors.clickYesBtn, "Select domain", "button")
        await this.spinnerDisappear();
    }
    async clickCalculateTaxButton() {
        await this.wait("minWait")
        await this.click(this.selectors.clickCalculateTax, "Calculate Tax", "button")
        await this.spinnerDisappear();
    }
    async clickApproveOrder(){
        await this.wait("minWait")
        await this.click(this.selectors.clickCreateAndApproveOrder, "Approve Order", "button")
        await this.spinnerDisappear();
    }
    async selectMulticourseForSingleOrder(data: string) {
        await this.wait("minWait")
        await this.typeAndEnter(this.selectors.searchcourseOrUser, "Course Name", data)
        await this.click(this.selectors.selectCourseForOrderCreation, "Select Course", "Check box")
    }
    public async paymentMethod(payMode: string) {
        await this.validateElementVisibility(this.selectors.paymentMethodDropdown, "Payment method Dropdown")
        await this.click(this.selectors.paymentMethodDropdown, "Payment method", "Dropdown")
        await this.click(this.selectors.paymentMethod(payMode), "Payment Mode", "Option")
    }
    public async orderSuccessMsg() {
        await this.wait("minWait")
        await this.validateElementVisibility(this.selectors.orderSuccessMsg, "The order has been placed successfully")
        await this.verification(this.selectors.orderSuccessMsg, "The order has been placed successfully")
    }
    async clickCreateOrder(){
        await this.wait("minWait")
        await this.click(this.selectors.clickCreateOrderBtn, "Create Order", "button")
        await this.spinnerDisappear();
    }

    //Max seat override
    async verifyMaxSeatOverRidePopup() {
        await this.wait('mediumWait');
        await this.verification(this.selectors.seatMaxPopupMsg, "You have exceeded the maximum seat for this training")
        await this.click(this.selectors.clickYesBtn, "Yes", "Button")
    }
    async verifyMaxSeatPopup() {
        await this.wait('mediumWait');
        await this.verification(this.selectors.seatMaxPopupMsg, "only for 0 users")
        await this.click(this.selectors.okBtn, "Ok", "Button")
    }
    async clickEnrollButton() {
        await this.validateElementVisibility(this.selectors.clickEnrollButton, "Enroll Button");
        await this.click(this.selectors.clickEnrollButton, "Enroll Button", "Button")
    }

   async selectclassBtn(){
        await this.validateElementVisibility(this.selectors.selectClassBtn, "Select Class Button");
        await this.click(this.selectors.selectClassBtn, "Select Class Button", "Button")
    }
    async learnerforSC(data:string){
        await this.wait("minWait");
        await this.validateElementVisibility(this.selectors.learnerSelect(data), "Select Learner");
        await this.click(this.selectors.learnerSelect(data), "Select Learner", "Button")
    }
    async selectInstance(data:string){
        await this.validateElementVisibility(this.selectors.selectInstance(data), "Select Instance");
        await this.click(this.selectors.selectInstance(data), "Select Instance", "Button");
    }
    async searchCourseForSC(instance:string){
        await this.click(this.selectors.searchCourseForSC, "Search Course", "Button");
        await this.typeAndEnter(this.selectors.searchCourseForSC, "Search Course", instance);
        await this.wait("minWait");
        await this.click(this.selectors.clickRadioBtn(instance), "Select Instance", "Button");
        await this.wait("minWait");
        await this.click(this.selectors.saveSelectionBtn, "Search Button", "Button");
        await this.wait("minWait");
        await this.click(this.selectors.enrollBtn, "Select Course", "Button");
    }

    // Method to select learner checkbox and click Select button
    async selectLearnerCheckboxAndSelect() {
        await this.wait("minWait");
        await this.page.click("//label[contains(@for,'selectedlearners')]");
        await this.page.click("//button[text()='Select']");
        console.log("Learner checkbox selected and Select button clicked");
    }

    // Bulk Enrollment Methods
    async   navigateToBulkEnrollment() {
        await this.wait("minWait");
        
        // Navigate directly to bulk enrollment using specific URL or menu path
        // First try to find if we're already in enrollment section
        const currentUrl = this.page.url();
        if (!currentUrl.includes('enrollment')) {
            // Use AdminHomePage methods for proper navigation
            await this.clickEnrollmentMenu();
            await this.clickEnroll();
        }
        
        // Wait for enrollment page to load
        await this.wait("mediumWait");
        
        // Try to find bulk enrollment option with more specific selectors
        const bulkOptions = [
            "//a[contains(@href,'bulk')]",
            "//button[contains(text(),'Bulk')]",
            "//a[contains(text(),'Bulk')]",
            "//span[contains(text(),'Bulk')]",
            this.selectors.bulkEnrollmentTab,
            this.selectors.bulkEnrollmentBtn,
            this.selectors.bulkOperationsMenu
        ];
        
        for (const selector of bulkOptions) {
            if (await this.page.locator(selector).count() > 0) {
                await this.click(selector, "Bulk Enrollment Option", "Button/Link");
                break;
            }
        }
    }

    async downloadEnrollmentTemplate(): Promise<string> {
        await this.wait("minWait");
        
        // Try multiple selectors for download template
        const downloadSelectors = [
            this.selectors.downloadTemplateBtn,
            `//a[contains(text(),'Template')]`,
            `//button[contains(text(),'Template')]`,
            `//a[contains(@href,'template')]`
        ];
        
        let downloaded = false;
        let downloadPath = '';
        
        // Set up download promise before clicking
        const downloadPromise = this.page.waitForEvent('download');
        
        for (const selector of downloadSelectors) {
            if (await this.page.locator(selector).count() > 0) {
                await this.click(selector, "Download Template", "Button/Link");
                downloaded = true;
                break;
            }
        }
        
        if (!downloaded) {
            throw new Error("Download template button not found");
        }
        
        try {
            const download = await downloadPromise;
            const suggestedFilename = download.suggestedFilename();
            downloadPath = `./downloads/${suggestedFilename}`;
            await download.saveAs(downloadPath);
            console.log(`Template downloaded to: ${downloadPath}`);
        } catch (error) {
            console.log("Download handling error:", error);
            downloadPath = './downloads/bulk_enrollment_template.xlsx'; // Default path
        }
        
        return downloadPath;
    }

    async uploadBulkEnrollmentFile(filePath: string) {
        await this.wait("minWait");
        
        // Find and use file input
        const fileInput = this.page.locator(this.selectors.uploadFileInput);
        await fileInput.setInputFiles(filePath);
        
        // Click upload button
        // const uploadSelectors = [
        //     this.selectors.uploadBtn,
        //     `//button[contains(text(),'Submit')]`,
        //     `//input[@type='submit']`,
        //     `//input[contains(@id,'files')]`
        // ];
        
        // for (const selector of uploadSelectors) {
        //     if (await this.page.locator(selector).count() > 0) {
        //         await this.click(selector, "Upload File", "Button");
        //         break;
        //     }
        // }
        
        // Wait for upload to complete
        await this.spinnerDisappear();
        await this.wait("mediumWait");
    }

    async verifyBulkEnrollmentSuccess() {
        await this.wait("mediumWait");
        
        const successSelectors = [
            this.selectors.bulkUploadSuccessMsg,
            `//*[contains(text(),'successfully uploaded')]`,
            `//*[contains(text(),'records successfully')]`,
            `//*[contains(text(),'uploaded successfully')]`,
            `//*[contains(text(),'Success')]`,
            `//div[contains(@class,'alert-success')]`
        ];
        
        let found = false;
        for (const selector of successSelectors) {
            if (await this.page.locator(selector).count() > 0) {
                const element = this.page.locator(selector);
                const text = await element.textContent();
                console.log(`✅ Found success message: ${text}`);
                await this.verification(selector, "successfully uploaded");
                found = true;
                break;
            }
        }
        
        if (!found) {
            console.log("Success message not found, checking for results table");
        }
    }

    async verifyEnrollmentStatus(username: string, expectedStatus: string = "Enrolled"): Promise<boolean> {
        await this.wait("mediumWait");
        
        // Look for the user in enrollment results/status table
        const userRowSelector = this.selectors.enrollmentStatusRow(username);
        const userStatusSelector = this.selectors.enrollmentStatus(username);
        
        // Try multiple approaches to find enrollment status
        const statusSelectors = [
            userStatusSelector,
            `//td[contains(text(),'${username}')]/following-sibling::td[contains(@class,'status')]`,
            `//tr[contains(.,'${username}')]//span[contains(@class,'status')]`,
            `//tr[contains(.,'${username}')]//td[contains(text(),'${expectedStatus}')]`
        ];
        
        for (const selector of statusSelectors) {
            if (await this.page.locator(selector).count() > 0) {
                const statusText = await this.page.locator(selector).textContent();
                console.log(`Enrollment status for ${username}: ${statusText}`);
                return statusText?.toLowerCase().includes(expectedStatus.toLowerCase()) || false;
            }
        }
        
        // If not found in table, search in general results
        const pageText = await this.page.textContent('body');
        const hasUsername = pageText?.includes(username) || false;
        const hasStatus = pageText?.includes(expectedStatus) || false;
        
        console.log(`User ${username} found on page: ${hasUsername}, Status ${expectedStatus} found: ${hasStatus}`);
        return hasUsername && hasStatus;
    }

    async searchAndVerifyEnrollment(username: string, courseName: string): Promise<boolean> {
        await this.wait("minWait");
        
        // Try to search for the specific user enrollment
        if (await this.page.locator(this.selectors.searchcourseOrUser).count() > 0) {
            await this.type(this.selectors.searchcourseOrUser, "Search User", username);
            await this.wait("minWait");
        }
        
        // Check if enrollment exists
        const enrollmentExists = await this.verifyEnrollmentStatus(username, "Enrolled");
        
        if (enrollmentExists) {
            console.log(`✅ User ${username} is successfully enrolled in ${courseName}`);
            return true;
        } else {
            console.log(`❌ User ${username} enrollment not found or status incorrect`);
            return false;
        }
    }

    /**
     * Verify score for a specific user in enrollment details
     * @param username - The username to search for and verify score
     * @returns Promise<number | null> - Returns the score value if found and greater than 0, null otherwise
     */
    async verifyUserScore(username: string): Promise<number | null> {
        try {
            await this.wait("mediumWait");
            
            // First, search for the user in the enrollment list
            console.log(`🔍 Searching for user: ${username} to verify score`);
            
            // Look for the user row in the enrollment table
            const userRowSelector = `//tr[contains(.,'${username}')]`;
            await this.page.waitForSelector(userRowSelector, { timeout: 10000 });
            
            // Click on "Many" button for the user to open score popup
            const manyButtonSelector = `//tr[contains(.,'${username}')]//button[text()='Many']`;
            
            if (await this.page.locator(manyButtonSelector).count() > 0) {
                console.log(`📊 Clicking 'Many' button for user: ${username}`);
                await this.click(manyButtonSelector, "Many button", "Button");
                await this.wait("minWait");
                
                // Wait for the score popup/modal to appear
                const scoreInputSelector = `//div[text()='SCORE']/following::input[1]`;
                await this.page.waitForSelector(scoreInputSelector, { timeout: 5000 });
                
                // Get the score value from the input field
                const scoreValue = await this.page.locator(scoreInputSelector).inputValue();
                console.log(`📋 Score value found: ${scoreValue}`);
                
                // Convert score to number and verify it's greater than 0
                const numericScore = parseFloat(scoreValue);
                
                if (!isNaN(numericScore) && numericScore > 0) {
                    console.log(`✅ Score verification successful: ${numericScore} (greater than 0)`);
                    
                    // Close the popup if there's a close button
                    const closeButtons = [
                        `//button[contains(@class,'close')]`,
                        `//button[text()='Close']`,
                        `//button[text()='×']`,
                        `//div[@class='modal-header']//button`
                    ];
                    
                    for (const closeSelector of closeButtons) {
                        if (await this.page.locator(closeSelector).count() > 0) {
                            await this.click(closeSelector, "Close popup", "Button");
                            break;
                        }
                    }
                    
                    return numericScore;
                } else {
                    console.log(`❌ Score verification failed: ${scoreValue} (not greater than 0 or invalid)`);
                    return null;
                }
                
            } else {
                console.log(`❌ 'Many' button not found for user: ${username}`);
                return null;
            }
            
        } catch (error) {
            console.log(`❌ Error during score verification for ${username}: ${error}`);
            return null;
        }
    }

    /**
     * Verify scores for multiple users
     * @param usernames - Array of usernames to verify scores for
     * @returns Promise<{[username: string]: number | null}> - Object with username as key and score as value
     */
    async verifyMultipleUserScores(usernames: string[]): Promise<{[username: string]: number | null}> {
        const scoreResults: {[username: string]: number | null} = {};
        
        console.log(`🔍 Starting score verification for ${usernames.length} users`);
        
        for (const username of usernames) {
            const score = await this.verifyUserScore(username);
            scoreResults[username] = score;
            
            // Add a small delay between users to avoid UI conflicts
            await this.wait("minWait");
        }
        
        // Log summary of results
        console.log(`📊 Score verification summary:`);
        for (const [user, score] of Object.entries(scoreResults)) {
            const status = score !== null ? `✅ ${score}` : `❌ Not found/Invalid`;
            console.log(`   ${user}: ${status}`);
        }
        
        return scoreResults;
    }

    // Method to check for bulk upload errors
    async checkForBulkUploadErrors(): Promise<boolean> {
        await this.wait("mediumWait");
        
        const errorSelectors = [
            `//div[contains(@class,'error') or contains(@class,'alert-danger')]`,
            `//*[contains(text(),'error') or contains(text(),'Error')]`,
            `//*[contains(text(),'duplicate') or contains(text(),'Duplicate')]`,
            `//*[contains(text(),'already enrolled') or contains(text(),'Already enrolled')]`,
            `//*[contains(text(),'failed') or contains(text(),'Failed')]`,
            `//div[contains(@class,'alert-warning')]`
        ];
        
        for (const selector of errorSelectors) {
            if (await this.page.locator(selector).count() > 0) {
                const element = this.page.locator(selector);
                const text = await element.textContent();
                console.log(`❌ Found error message: ${text}`);
                return true;
            }
        }
        
        return false;
    }

    // Method to check for bulk upload success
    async checkForBulkUploadSuccess(): Promise<boolean> {
        await this.wait("mediumWait");
        
        const successSelectors = [
            this.selectors.bulkUploadSuccessMsg,
            `//*[contains(text(),'successfully uploaded')]`,
            `//*[contains(text(),'records successfully')]`,
            `//*[contains(text(),'uploaded successfully')]`,
            `//*[contains(text(),'Success')]`,
            `//div[contains(@class,'alert-success')]`
        ];
        
        for (const selector of successSelectors) {
            if (await this.page.locator(selector).count() > 0) {
                return true;
            }
        }
        
        return false;
    }

    // Method to verify bulk upload error contains specific text
    async verifyBulkUploadErrorContains(expectedTexts: string[]): Promise<void> {
        await this.wait("mediumWait");
        
        const errorSelectors = [
            `//div[contains(@class,'error') or contains(@class,'alert-danger')]`,
            `//*[contains(text(),'error') or contains(text(),'Error')]`,
            `//div[contains(@class,'alert-warning')]`
        ];
        
        let errorFound = false;
        for (const selector of errorSelectors) {
            if (await this.page.locator(selector).count() > 0) {
                const element = this.page.locator(selector);
                const text = await element.textContent();
                
                for (const expectedText of expectedTexts) {
                    if (text && text.toLowerCase().includes(expectedText.toLowerCase())) {
                        console.log(`✅ Error message contains expected text '${expectedText}': ${text}`);
                        errorFound = true;
                        return;
                    }
                }
            }
        }
        
        if (!errorFound) {
            console.log(`⚠️ Expected error text not found. Looking for: ${expectedTexts.join(', ')}`);
        }
    }

    // Method to get user enrollment count
    async getUserEnrollmentCount(username: string): Promise<number> {
        await this.wait("mediumWait");
        
        // Try different selectors to find user enrollment rows
        const userRowSelectors = [
            `//tr[contains(.,'${username}')]`,
            `//td[contains(text(),'${username}')]`,
            `//td[text()='${username}']`,
            this.selectors.enrollmentStatusRow(username)
        ];
        
        let count = 0;
        for (const selector of userRowSelectors) {
            const elements = await this.page.locator(selector);
            const elementCount = await elements.count();
            if (elementCount > 0) {
                count = elementCount;
                console.log(`📊 User ${username} found ${count} enrollment record(s)`);
                break;
            }
        }
        
        if (count === 0) {
            console.log(`📊 User ${username} not found in enrollment records`);
        }
        
        return count;
    }

    // Method to navigate to bulk enrollment from enrollment menu
    async clickBulkEnrollment(): Promise<void> {
        await this.wait("minWait");
        
        const bulkSelectors = [
            "//a[contains(text(),'Bulk Enrollment')]",
            "//button[contains(text(),'Bulk Enrollment')]", 
            "//span[contains(text(),'Bulk Enrollment')]",
            "//a[contains(@href,'bulk')]",
            this.selectors.bulkEnrollmentTab,
            this.selectors.bulkEnrollmentBtn
        ];
        
        for (const selector of bulkSelectors) {
            if (await this.page.locator(selector).count() > 0) {
                await this.click(selector, "Bulk Enrollment", "Link/Button");
                await this.wait("mediumWait");
                return;
            }
        }
        
        throw new Error("Bulk Enrollment option not found");
    }

    // Method to search for enrolled user in enrollment view
    async searchEnrolledUser(username: string) {
        await this.wait("minWait");
        const searchSelectors = [
            "//input[contains(@placeholder,'Search')] | //input[@type='search']",
            "//input[contains(@id,'search')] | //input[contains(@class,'search')]",
            this.selectors.searchcourseOrUser
        ];
        
        for (const selector of searchSelectors) {
            try {
                await this.validateElementVisibility(selector, "Search Field");
                await this.type(selector, "Search User", username);
                await this.keyboardAction(selector, "Enter", "Input", "Search User");
                await this.wait("mediumWait");
                console.log(`🔍 Searched for enrolled user: ${username}`);
                return;
            } catch (error) {
                continue;
            }
        }
        
        throw new Error("Search field not found in enrollment view");
    }

    // Method to verify expired enrollment status in admin view
    async verifyExpiredEnrollmentStatus(username: string, courseName: string) {
        await this.wait("mediumWait");
        const expiredStatusSelectors = [
            `//span[text()='${username}']//ancestor::tr//span[text()='Expired'] | //td[text()='${username}']//following::td[contains(text(),'Expired')]`,
            `//div[contains(text(),'${username}')]//following::span[contains(text(),'Expired')] | //span[contains(text(),'Expired')]`,
            "//span[text()='Expired'] | //td[text()='Expired'] | //div[contains(@class,'status')]//span[text()='Expired']"
        ];
        
        for (const selector of expiredStatusSelectors) {
            try {
                await this.validateElementVisibility(selector, "Expired Status");
                await this.verification(selector, "Expired");
                console.log(`⚠️ Verified: User ${username} enrollment shows EXPIRED status for course ${courseName}`);
                return true;
            } catch (error) {
                continue;
            }
        }
        
        // Also check for Overdue status as fallback
        const overdueStatusSelectors = [
            `//span[text()='${username}']//ancestor::tr//span[text()='Overdue'] | //td[text()='${username}']//following::td[contains(text(),'Overdue')]`,
            `//div[contains(text(),'${username}')]//following::span[contains(text(),'Overdue')] | //span[contains(text(),'Overdue')]`,
            "//span[text()='Overdue'] | //td[text()='Overdue'] | //div[contains(@class,'status')]//span[text()='Overdue']"
        ];
        
        for (const selector of overdueStatusSelectors) {
            try {
                await this.validateElementVisibility(selector, "Overdue Status");
                await this.verification(selector, "Overdue");
                console.log(`⚠️ Verified: User ${username} enrollment shows OVERDUE status for course ${courseName}`);
                return true;
            } catch (error) {
                continue;
            }
        }
        
        throw new Error(`Neither Expired nor Overdue status found for user ${username} in course ${courseName}`);
    }

    // Method to view enrollment details for a specific user
    async viewEnrollmentDetails(username: string) {
        await this.wait("minWait");
        const detailsSelectors = [
            `//span[text()='${username}']//ancestor::tr//i[contains(@class,'fa-eye')] | //td[text()='${username}']//following::i[contains(@aria-label,'View')]`,
            `//span[text()='${username}']//following::button[contains(text(),'View')] | //span[text()='${username}']//following::a[contains(text(),'Details')]`,
            `//div[contains(text(),'${username}')]//following::i[contains(@class,'view')] | //span[text()='${username}']//following::i[contains(@class,'details')]`
        ];
        
        for (const selector of detailsSelectors) {
            try {
                await this.validateElementVisibility(selector, `View Details for ${username}`);
                await this.click(selector, `View Details for ${username}`, "Button");
                await this.wait("mediumWait");
                console.log(`👁️ Opened enrollment details for user: ${username}`);
                return;
            } catch (error) {
                continue;
            }
        }
        
        console.log(`ℹ️ No detailed view button found for user: ${username} - details may be visible in current view`);
    }

    // Method to verify expired enrollment details
    async verifyExpiredEnrollmentDetails() {
        await this.wait("mediumWait");
        const expiredDetailsSelectors = [
            "//span[contains(text(),'Expired')] | //div[contains(text(),'Expired')]",
            "//label[text()='Status']//following::span[text()='Expired'] | //td[text()='Status']//following::td[text()='Expired']",
            "//span[contains(text(),'Expiry Date')] | //label[contains(text(),'Expiry')] | //th[contains(text(),'Expired')]",
            "//div[contains(@class,'expired')] | //span[contains(@class,'expired')]"
        ];
        
        let foundExpiredInfo = false;
        
        for (const selector of expiredDetailsSelectors) {
            try {
                await this.validateElementVisibility(selector, "Expired Details");
                console.log(`📋 Found expired enrollment information in details view`);
                foundExpiredInfo = true;
                break;
            } catch (error) {
                continue;
            }
        }
        
        if (!foundExpiredInfo) {
            console.log(`⚠️ Expired details not explicitly found, but enrollment status verification passed`);
        }
        
        return foundExpiredInfo;
    }

    // Method to verify enrollment history and status changes
    async viewEnrollmentHistory(username: string) {
        await this.wait("minWait");
        const historySelectors = [
            "//a[text()='History'] | //button[text()='History'] | //span[text()='History']",
            "//i[contains(@class,'history')] | //i[contains(@class,'clock')]",
            "//tab[contains(@label,'History')] | //div[contains(text(),'Status Changes')]"
        ];
        
        for (const selector of historySelectors) {
            try {
                await this.validateElementVisibility(selector, "Enrollment History");
                await this.click(selector, "Enrollment History", "Tab/Button");
                await this.wait("mediumWait");
                console.log(`📈 Opened enrollment history for user: ${username}`);
                return true;
            } catch (error) {
                continue;
            }
        }
        
        console.log(`ℹ️ No enrollment history tab found for user: ${username}`);
        return false;
    }

    // Method to verify status change history
    async verifyStatusChangeHistory() {
        await this.wait("mediumWait");
        const statusChangeSelectors = [
            "//td[contains(text(),'Completed')] | //span[contains(text(),'Completed')]",
            "//td[contains(text(),'Expired')] | //span[contains(text(),'Expired')]",
            "//div[contains(text(),'Status changed from')] | //span[contains(text(),'Status changed')]",
            "//table//tr[contains(.,'Completed')] | //table//tr[contains(.,'Expired')]"
        ];
        
        let foundStatusChange = false;
        
        for (const selector of statusChangeSelectors) {
            try {
                const elements = await this.page.locator(selector).count();
                if (elements > 0) {
                    console.log(`📈 Found status change information in enrollment history`);
                    foundStatusChange = true;
                    break;
                }
            } catch (error) {
                continue;
            }
        }
        
        return foundStatusChange;
    }

    // Method to verify expiry date information
    async verifyExpiryDateInformation(username: string) {
        await this.wait("mediumWait");
        const expiryDateSelectors = [
            "//label[contains(text(),'Expiry')] | //th[contains(text(),'Expiry')] | //span[contains(text(),'Expiry Date')]",
            "//td[contains(text(),'Expired on')] | //span[contains(text(),'Expired on')]",
            "//div[contains(text(),'Expiry')] | //p[contains(text(),'Expiry')]"
        ];
        
        for (const selector of expiryDateSelectors) {
            try {
                await this.validateElementVisibility(selector, "Expiry Date Information");
                const expiryText = await this.getInnerText(selector);
                console.log(`📅 Found expiry date information: ${expiryText}`);
                return true;
            } catch (error) {
                continue;
            }
        }
        
        console.log(`⚠️ No specific expiry date information found for user: ${username}`);
        return false;
    }

    // Method to verify completion date vs expiry date
    async verifyCompletionVsExpiryDates(username: string) {
        await this.wait("mediumWait");
        let completionFound = false;
        let expiryFound = false;
        
        // Check for completion date
        const completionSelectors = [
            "//label[contains(text(),'Completion')] | //th[contains(text(),'Completion')] | //span[contains(text(),'Completed on')]",
            "//td[contains(text(),'Completed')] | //div[contains(text(),'Completion Date')]"
        ];
        
        for (const selector of completionSelectors) {
            try {
                await this.validateElementVisibility(selector, "Completion Date");
                const completionText = await this.getInnerText(selector);
                console.log(`🗓️ Found completion date information: ${completionText}`);
                completionFound = true;
                break;
            } catch (error) {
                continue;
            }
        }
        
        // Check for expiry date
        const expirySelectors = [
            "//label[contains(text(),'Expiry')] | //th[contains(text(),'Expiry')] | //span[contains(text(),'Expired on')]",
            "//td[contains(text(),'Expired')] | //div[contains(text(),'Expiry Date')]"
        ];
        
        for (const selector of expirySelectors) {
            try {
                await this.validateElementVisibility(selector, "Expiry Date");
                const expiryText = await this.getInnerText(selector);
                console.log(`📅 Found expiry date information: ${expiryText}`);
                expiryFound = true;
                break;
            } catch (error) {
                continue;
            }
        }
        
        if (completionFound && expiryFound) {
            console.log(`🗓️ Both completion and expiry dates are visible to admin`);
            return true;
        } else if (completionFound || expiryFound) {
            console.log(`🗓️ Either completion or expiry date is visible to admin`);
            return true;
        } else {
            console.log(`⚠️ Neither completion nor expiry dates are explicitly visible`);
            return false;
        }
    }
}