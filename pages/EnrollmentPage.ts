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
        dateInput: `//input[contains(@id,'input')]`,
        
        //Admin Enrollment:-
        clickModifyEnroll: `//a[text()='View/Modify Enrollment']`,
        completionDateInput: `//div[contains(@id,'check_box')]/input`,

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
        
        //Dedicated to Training Plan message
        dedicatedToTPMsg: `//div[contains(@class,'justify-content-center text')]//span`,
        
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
        
        //Mandatory checkbox
        mandatoryCheckbox: `(//input[@id='ismandatory']//following::label)[1]`,

        //View/Update Status - Course/TP Table Fields
        viewUpdateStatusTable: `//table[contains(@class,'viewupdate-status-crstp')]`,
        tableHeaderByName: (fieldName: string) => `//table[contains(@class,'viewupdate-status-crstp')]//th[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${fieldName.toLowerCase()}')]`,
        
        // Learner row locators (by username)
        learnerRow: (username: string) => `//table[contains(@class,'viewupdate-status-crstp')]//tbody//tr[td[contains(text(),'${username}')]]`,
        learnerFieldValue: (username: string, fieldName: string) => {
            const fieldIndex: { [key: string]: number } = {
                'name': 1,
                'username': 2,
                'manager': 3,
                'organization': 4,
                'reg from': 5,
                'date': 6,
                'score': 7,
                'status': 8,
                'enrollment type': 9,
                'checklist': 10,
                'action': 11,
                'add notes': 12,
                'files': 13,
                'progress': 14
            };
            const index = fieldIndex[fieldName.toLowerCase()] || 1;
            return `//table[contains(@class,'viewupdate-status-crstp')]//tbody//tr[td[contains(text(),'${username}')]]//td[${index}]`;
        },
        
        // Specific field locators
        learnerName: (username: string) => `//table[contains(@class,'viewupdate-status-crstp')]//tbody//tr[td[contains(text(),'${username}')]]//td[1]`,
        learnerUsername: (username: string) => `//table[contains(@class,'viewupdate-status-crstp')]//tbody//tr[td[contains(text(),'${username}')]]//td[2]`,
        learnerManager: (username: string) => `//table[contains(@class,'viewupdate-status-crstp')]//tbody//tr[td[contains(text(),'${username}')]]//td[3]`,
        learnerOrganization: (username: string) => `//table[contains(@class,'viewupdate-status-crstp')]//tbody//tr[td[contains(text(),'${username}')]]//td[4]`,
        learnerRegFrom: (username: string) => `//table[contains(@class,'viewupdate-status-crstp')]//tbody//tr[td[contains(text(),'${username}')]]//td[5]`,
        learnerDate: (username: string) => `//table[contains(@class,'viewupdate-status-crstp')]//tbody//tr[td[contains(text(),'${username}')]]//td[6]`,
        learnerScore: (username: string) => `//table[contains(@class,'viewupdate-status-crstp')]//tbody//tr[td[contains(text(),'${username}')]]//td[7]`,
        learnerScoreManyButton: (username: string) => `//table[contains(@class,'viewupdate-status-crstp')]//tbody//tr[td[contains(text(),'${username}')]]//td[7]//button[contains(text(),'Many')]`,
        learnerStatus: (username: string) => `//table[contains(@class,'viewupdate-status-crstp')]//tbody//tr[td[contains(text(),'${username}')]]//td[8]//select`,
        learnerStatusDropdown: (username: string) => `(//table[contains(@class,'viewupdate-status-crstp')]//tbody//tr[td[contains(text(),'${username}')]]//td[8]//button)[1]`,
        learnerStatusOption: (username: string, status: string) => `//table[contains(@class,'viewupdate-status-crstp')]//tbody//tr[td[contains(text(),'${username}')]]//td[8]//select//option[@value='${status.toLowerCase()}']`,
        learnerEnrollmentType: (username: string) => `//table[contains(@class,'viewupdate-status-crstp')]//tbody//tr[td[contains(text(),'${username}')]]//td[9]`,
        learnerProgress: (username: string) => `//table[contains(@class,'viewupdate-status-crstp')]//tbody//tr[td[contains(text(),'${username}')]]//td[14]`,
        learnerAddNotesIcon: (username: string) => `//table[contains(@class,'viewupdate-status-crstp')]//tbody//tr[td[contains(text(),'${username}')]]//td[12]//i[contains(@class,'fa-note-sticky')]`,
        learnerFilesIcon: (username: string) => `//table[contains(@class,'viewupdate-status-crstp')]//tbody//tr[td[contains(text(),'${username}')]]//td[13]//i[contains(@class,'fa-upload')]`,


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
        await this.wait("minWait")
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

    async verifyDedicatedToTPWarningMessage() {
        await this.wait('minWait');
        await this.validateElementVisibility(this.selectors.dedicatedToTPMsg, "Dedicated to Training Plan Message");
        const messageText = await this.page.locator(this.selectors.dedicatedToTPMsg).textContent();
        const expectedText = "The selected course or class is marked as Dedicated to a Training Plan";
        
        if (messageText && messageText.includes(expectedText)) {
            console.log(`✅ Verified - Message: "${messageText}"`);
            return true;
        } else {
            throw new Error(`Expected message to contain "${expectedText}" but got "${messageText}"`);
        }
    }

    async verifyDedicatedTPCourseNotFound(courseName: string) {
        await this.type(this.selectors.searchcourseOrUser, "Course Name", courseName);
        await this.wait("minWait");
        const courseCount = await this.page.locator(this.selectors.courseList).count();        
        if (courseCount === 0) {
            console.log(`✅ Verified - The selected course or class is marked as Dedicated to TP (Course not found in search results)`);
            return true;
        } else {
            throw new Error(`Expected course count to be 0 (not found) but got ${courseCount} courses`);
        }
    }

    // View/Update Status - Table Field Verification Methods

    /**
     * Verify table header field is visible
     * @param fieldName - The header field name (e.g., "Name", "Username", "Status")
     */
    async verifyTableHeader(fieldName: string) {
        await this.wait("minWait");
        await this.validateElementVisibility(
            this.selectors.tableHeaderByName(fieldName),
            `Table Header: ${fieldName}`
        );
        console.log(`✅ Verified - Table header "${fieldName}" is visible`);
    }

    /**
     * Verify all table headers are visible
     */
    async verifyAllTableHeaders() {
        await this.wait("minWait");
        const headers = [
            "Name", "Username", "Manager", "Organization", "Reg From", 
            "Date", "Score", "Status", "Enrollment Type", "Checklist",
            "Action", "Add Notes", "Files", "Progress"
        ];
        
        for (const header of headers) {
            await this.verifyTableHeader(header);
        }
        console.log(`✅ Verified - All table headers are visible`);
    }

    /**
     * Generic method to verify field value for a specific learner
     * @param fieldName - The field name to verify (Name, Username, Status, etc.)
     * @param expectedValue - The expected value
     * @param username - The username to identify the learner row
     */
    async verifyField(fieldName: string, expectedValue: string, username: string) {
        await this.wait("minWait");
        const selector = this.selectors.learnerFieldValue(username, fieldName);
        
        // Special handling for status field
        if (fieldName.toLowerCase() === "status") {
            // Try to find dropdown first (for Enrolled, In Progress, Canceled)
            const statusDropdownSelector = this.selectors.learnerStatus(username);
            const dropdownCount = await this.page.locator(statusDropdownSelector).count();
            
            if (dropdownCount > 0) {
                // Status is displayed as dropdown
                await this.validateElementVisibility(statusDropdownSelector, `Status dropdown for ${username}`);
                const statusValue = await this.page.locator(statusDropdownSelector).getAttribute('title');
                
                if (statusValue && statusValue.toLowerCase().includes(expectedValue.toLowerCase())) {
                    console.log(`✅ Verified - ${fieldName}: "${statusValue}" contains "${expectedValue}" (dropdown)`);
                    return true;
                } else {
                    throw new Error(`Expected ${fieldName} to contain "${expectedValue}" but got "${statusValue}" (dropdown)`);
                }
            } else {
                // Status is displayed as plain text (for Completed)
                const statusTextSelector = `//table[contains(@class,'viewupdate-status-crstp')]//tbody//tr[td[contains(text(),'${username}')]]//td[8]//span`;
                await this.validateElementVisibility(statusTextSelector, `Status text for ${username}`);
                const statusValue = await this.page.locator(statusTextSelector).textContent();
                const cleanStatusValue = statusValue?.trim() || '';
                
                if (cleanStatusValue.toLowerCase().includes(expectedValue.toLowerCase())) {
                    console.log(`✅ Verified - ${fieldName}: "${cleanStatusValue}" contains "${expectedValue}" (text)`);
                    return true;
                } else {
                    throw new Error(`Expected ${fieldName} to contain "${expectedValue}" but got "${cleanStatusValue}" (text)`);
                }
            }
        }
        
        // For other fields
        await this.validateElementVisibility(selector, `${fieldName} field for ${username}`);
        const actualValue = await this.page.locator(selector).textContent();
        const cleanActualValue = actualValue?.trim() || '';
        
        if (cleanActualValue.toLowerCase().includes(expectedValue.toLowerCase())) {
            console.log(`✅ Verified - ${fieldName}: "${cleanActualValue}" contains "${expectedValue}"`);
            return true;
        } else {
            throw new Error(`Expected ${fieldName} to contain "${expectedValue}" but got "${cleanActualValue}"`);
        }
    }

    /**
     * Verify learner name
     * @param expectedName - Expected name value
     * @param username - Username to identify the learner row
     */
    async verifyLearnerName(expectedName: string, username: string) {
        await this.verifyField("Name", expectedName, username);
    }

    /**
     * Verify learner username
     * @param expectedUsername - Expected username value
     * @param username - Username to identify the learner row
     */
    async verifyLearnerUsername(expectedUsername: string, username: string) {
        await this.verifyField("Username", expectedUsername, username);
    }

    /**
     * Verify learner status
     * @param expectedStatus - Expected status (Enrolled, In Progress, Completed, Canceled)
     * @param username - Username to identify the learner row
     */
    async verifyLearnerStatus(expectedStatus: string, username: string) {
        await this.verifyField("Status", expectedStatus, username);
    }

    /**
     * Verify learner progress percentage
     * @param expectedProgress - Expected progress value (e.g., "25", "50", "100")
     * @param username - Username to identify the learner row
     */
    async verifyLearnerProgress(expectedProgress: string, username: string) {
        await this.wait("minWait");
        const selector = this.selectors.learnerProgress(username);
        await this.validateElementVisibility(selector, `Progress field for ${username}`);
        
        const actualProgress = await this.page.locator(selector).textContent();
        const cleanProgress = actualProgress?.trim().replace(/\s+/g, ' ') || '';
        
        // Check if progress contains the expected percentage
        if (cleanProgress.includes(expectedProgress)) {
            console.log(`✅ Verified - Progress: "${cleanProgress}" contains "${expectedProgress}%"`);
            return true;
        } else {
            throw new Error(`Expected progress to contain "${expectedProgress}%" but got "${cleanProgress}"`);
        }
    }

    /**
     * Verify learner enrollment type
     * @param expectedType - Expected enrollment type (Optional, Mandatory, etc.)
     * @param username - Username to identify the learner row
     */
    async verifyLearnerEnrollmentType(expectedType: string, username: string) {
        await this.verifyField("Enrollment Type", expectedType, username);
    }

    /**
     * Verify Add Notes icon is visible for a learner
     * @param username - The username to identify the learner row
     */
    async verifyAddNotesIconVisible(username: string) {
        await this.wait("minWait");
        await this.validateElementVisibility(
            this.selectors.learnerAddNotesIcon(username),
            `Add Notes icon for ${username}`
        );
        console.log(`✅ Verified - Add Notes icon is visible for ${username}`);
    }

    /**
     * Click Add Notes icon for a learner
     * @param username - The username to identify the learner row
     */
    async clickAddNotesIcon(username: string) {
        await this.wait("minWait");
        await this.click(
            this.selectors.learnerAddNotesIcon(username),
            `Add Notes for ${username}`,
            "Icon"
        );
    }

    /**
     * Verify Files (Upload) icon is visible for a learner
     * @param username - The username to identify the learner row
     */
    async verifyFilesIconVisible(username: string) {
        await this.wait("minWait");
        await this.validateElementVisibility(
            this.selectors.learnerFilesIcon(username),
            `Files icon for ${username}`
        );
        console.log(`✅ Verified - Files icon is visible for ${username}`);
    }

    /**
     * Click Files icon for a learner
     * @param username - The username to identify the learner row
     */
    async clickFilesIcon(username: string) {
        await this.wait("minWait");
        await this.click(
            this.selectors.learnerFilesIcon(username),
            `Upload Files for ${username}`,
            "Icon"
        );
    }

    /**
     * Change learner status in View/Update Status page
     * @param username - The username to identify the learner row
     * @param status - Status to change to: "Completed", "Canceled", "Enrolled", or "In Progress"
     */
    async changeLearnerStatus(username: string, status: string) {
        await this.wait("minWait");
        
        const dropdownSelector = this.selectors.learnerStatusDropdown(username);
        await this.validateElementVisibility(dropdownSelector, `Status dropdown for ${username}`);
        
        // Click the dropdown button to open options
        await this.click(dropdownSelector, `Status dropdown for ${username}`, "Button");
        await this.wait("minWait");
        
        // Click the status option (more specific - from the dropdown menu that just opened)
        const statusOptionSelector = `//div[contains(@class,'dropdown-menu') and contains(@class,'show')]//span[text()='${status}']`;
        await this.validateElementVisibility(statusOptionSelector, `${status} option`);
        await this.page.locator(statusOptionSelector).first().click({ force: true });
        console.log(`✅ Changed status to "${status}" for ${username}`);
        
        await this.wait("minWait");
        
        // Handle different status types
        if (status.toLowerCase() === "completed") {
            // For Completed: Enter date
            await this.type(this.selectors.dateInput, "Date", getCurrentDateFormatted());
        } else if (status.toLowerCase() === "canceled") {
            // For Canceled: Enter reason
            await this.type(this.selectors.reaonDesc, "Cancel Reason", FakerData.getDescription());
        }
        
        // Click Submit and Save
        await this.click(this.selectors.submitReason, "Submit button", "Button");
        await this.wait("minWait");
        await this.click(this.selectors.saveStatus, "Save Status", "Button");
        await this.wait("minWait");
        console.log(`✅ Status change saved for ${username}`);
    }

    /**
     * Verify learner enrollment date
     * @param username - The username to identify the learner row
     * @param expectedDate - Expected date (e.g., "2025-11-20")
     */
    async verifyLearnerDate(username: string, expectedDate: string) {
        await this.verifyField(username, "Date", expectedDate);
    }

    /**
     * Verify learner is present in the table
     * @param username - The username to verify
     */
    async verifyLearnerInTable(username: string) {
        await this.wait("minWait");
        await this.validateElementVisibility(
            this.selectors.learnerRow(username),
            `Learner row for ${username}`
        );
        console.log(`✅ Verified - Learner "${username}" is present in the table`);
    }

    /**
     * Click Mandatory checkbox
     */
    async clickMandatory() {
        await this.wait("minWait");
        await this.validateElementVisibility(
            this.selectors.mandatoryCheckbox,
            "Mandatory Checkbox"
        );
        await this.click(
            this.selectors.mandatoryCheckbox,
            "Mandatory",
            "Checkbox"
        );
    }

    /**
     * Verify learner score field
     * @param expectedScore - Expected score value or "Many" for completed courses with multiple assessments
     * @param username - Username to identify the learner row
     */
    async verifyLearnerScore(expectedScore: string, username: string) {
        await this.wait("minWait");
        const scoreSelector = this.selectors.learnerScore(username);
        
        await this.validateElementVisibility(scoreSelector, `Score field for ${username}`);
        
        // Check if it's the "Many" button (for completed courses with multiple scores)
        if (expectedScore.toLowerCase() === "many") {
            const manyButtonSelector = this.selectors.learnerScoreManyButton(username);
            const isManyButtonVisible = await this.page.locator(manyButtonSelector).isVisible();
            
            if (isManyButtonVisible) {
                console.log(`✅ Verified - Score field shows "Many" button for ${username}`);
                return true;
            } else {
                throw new Error(`Expected "Many" button in score field but it was not found for ${username}`);
            }
        }
        
        // Otherwise, verify the actual score value
        const actualScore = await this.page.locator(scoreSelector).textContent();
        const cleanScore = actualScore?.trim() || '';
        
        if (cleanScore.includes(expectedScore)) {
            console.log(`✅ Verified - Score for ${username}: "${cleanScore}" contains "${expectedScore}"`);
            return true;
        } else {
            throw new Error(`Expected score to contain "${expectedScore}" but got "${cleanScore}"`);
        }
    }


}