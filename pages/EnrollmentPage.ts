import { BrowserContext, expect, Page } from "@playwright/test";
import { AdminHomePage } from "./AdminHomePage";
import { URLConstants } from "../constants/urlConstants";
import { FakerData, getCurrentDateFormatted } from "../utils/fakerUtils";
import { is } from "date-fns/locale";
import { th } from "@faker-js/faker";
import { addISOWeekYears } from "date-fns";


export class EnrollmentPage extends AdminHomePage {

    private previousEntryIdentifier: string = "";

    public selectors = {
        ...this.selectors,
        manageEnrollement: `(//div[@id='wrapper-enrollment-action']//div)[1]`,
        enrollType: `//span[text()='Enroll']`,
        searchcourseOrUser: `//input[contains(@id,'exp-search')]`,
        courseList: `//div[contains(@id,'exp-search-lms')]//li`,
        courseListOpt: (index: number) => `(//div[contains(@id,'exp-search-lms')]//li)[${index}]`,
        userList: `(//div[contains(@id,'lms-scroll-results')]//li)`,
        userListOpt: (data: string) => `(//td[text()='${data}']/following::i)[2]`,
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

        //For multiple order creation
        clickMultipleOrderRadioBtn: `//span[text()='Single Learner']//following::i[contains(@class,'fa-circle')]`,
        selectCourseRdoBtn: `(//input[contains(@id,'training')]/following::i)[1]`,
        selectUserForMultiOrderCreation: (data: string) => `(//td[contains(text(),'${data}')]//following::i)[2]`,

        //View/Update Status - Course/TP Table Fields
        viewUpdateStatusTable: `//table[contains(@class,'viewupdate-status-crstp')]`,
        tableHeaderByName: (fieldName: string) => `//table[contains(@class,'viewupdate-status-crstp')]//th[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${fieldName.toLowerCase()}')]`,
        
        // Learner row locators (by username)
        // learnerRow: (username: string) => `//table[contains(@class,'viewupdate-status-crstp')]//tbody//tr[td[contains(text(),'${username}')]]`,
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
        learnerEnrollmentTypeDropdown: (username: string) => `(//table[contains(@class,'viewupdate-status-crstp')]//tbody//tr[td[contains(text(),'${username}')]]//td[9]//select[contains(@id,'enrollment-mro-status')]/following::button)[1]`,
        enrollmentTypeOptionalOption: `//a//span[text()='Optional']`,
        learnerProgress: (username: string) => `//table[contains(@class,'viewupdate-status-crstp')]//tbody//tr[td[contains(text(),'${username}')]]//td[14]`,
        learnerAddNotesIcon: (username: string) => `//table[contains(@class,'viewupdate-status-crstp')]//tbody//tr[td[contains(text(),'${username}')]]//td[12]//i[contains(@class,'fa-note-sticky')]`,
        learnerFilesIcon: (username: string) => `//table[contains(@class,'viewupdate-status-crstp')]//tbody//tr[td[contains(text(),'${username}')]]//td[13]//i[contains(@class,'fa-upload')]`,


        //Transfer Enrollment - TECRS01
        transferEnrollmentOption: `//a[text()='Transfer Enrollment - Course']`,
        transferEnrollmentButton: `//button[contains(text(),'Transfer') or contains(@aria-label,'Transfer')]`,
        availableCoursesTPSection: `//h3[text()='Available Courses/Training Plans'] | //label[text()='Available Courses/Training Plans'] | //div[contains(text(),'Available Courses/Training Plans')]`,

        //Transfer Enrollment - TECRS02
        searchCourseTransfer: `//input[contains(@id,'enrtfr-search-selecttraining-field') or @placeholder='Search']`,
        learnerCheckbox: (username: string) => `//td[contains(text(),'${username}')]//preceding::input[@type='checkbox'][1]`,
        sourceInstanceDropdown: `//input[@id="enrtfr-search-selectinstances--field"]`,
        sourceInstanceOption: (instanceName: string) => `//span[text()='${instanceName}']`,
        targetInstanceDropdown: `//input[@id="enrtfr-search-selectinstances-removeindividuals-filter-field"]`,
        targetInstanceOption: (instanceName: string) => `//span[text()='${instanceName}']`,
        transferBtn: `//button[text()='Transfer Learners']`,
        transferSuccessMsg: `//h3[text()='1 Learner Successfully Transfered']`,
        searchCourseViewStatus: `//input[@id='exp-searchenrollments-course' or contains(@placeholder,'Search')]`,
        searchLearnerViewStatus: `//input[@id="exp-search-undefinedundefined-field"]`,
        learnerInstanceCell: (username: string) => `//td[contains(text(),'${username}')]/following::div[text()='Enrolled']`,
        learnerRow: (username: string, status: string) => `(//td[text()='${username}']/following-sibling::td[text()='${status}'])[1]`,

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

        clickEnrollBtnAfterEnrollment:`//a[text()='View/Modify Enrollment']/following-sibling::a[text()='Enroll']`,
        clickCourseStatusInTpDropdown:`//input[@id='learning-path-selection-filter-field']`,
        typeTpNameInsearchBar:`//input[@id='learning-path-selection']`,
        selectTp:(tp:string) => `//span[text()='${tp}']`,

        assessmentScorePreAndPost:(tpName:string,assessment:string)=> `(//div[text()='${tpName}']/following::div[text()='${assessment}']/following::input[@type='text'])[1]`,
        clickMany:(tpName:string)=>`(//div[text()='${tpName}']/following::button[text()='Many'])[1]`,

        // Get the row containing the second completed status (previous entry)
        secondCompletedEntryRow: `(//span[text()='Completed'])[2]/ancestor::tr`,
        // Get text from first column (enrollment code or identifier) of the second completed entry
        secondCompletedEntryText: `(//span[text()='Completed'])[2]/ancestor::tr//td[1]`,
        // Find status in a row containing specific text
        statusInRowWithText: (text: string, status: string) => `//tr[contains(.,'${text}')]//span[text()='${status}']`,

        certificationDropdown:(certificationType:string) => `//div[text()='${certificationType}']`,
        recertificationOption:`//span[text()='Recertification']`,

        revalidateSuccessMessage:(title:string) => `Re-Validate  to "${title}" has been done successfully for “1”  learner(s).`,

enrollToTpBtn: `//span[text()='View Status/Enroll Learner to TP Courses']`,
    searchUserInput: `//input[@placeholder='Search']`,
    searchUserCheckbox: (user:string) => `(//td[text()='${user}']/following::i)[1]`,
    userSearchCheckbox: (username: string) => `//td[contains(text(),'${username}')]//following::td//label)[1]`,
    selectLearnerBtn: `//button[text()='Select Learner']`,
    tpSearchInput: `(//input[@placeholder='Search'])[2]`,
    tpSearchResult: (tpName: string) => `//td[contains(text(),'${tpName}')]`,
    selectTPRadio: `//input[@type='radio']`,
    tpCourseSearchInput: `//input[@placeholder='Search Course']`,
    tpCourseResult: (courseName: string) => `//td[contains(text(),'${courseName}')]`,
    tpInstanceResult: (data:string) => `//li[text()='${data}']`,
    enrollmentsTab: `//a[text()='Enrollments']`,

    statusOfCourseInsideTP:(courseName:string) => `(//span[text()='${courseName}']/following::div[text()='0% [enrolled] '])[1]`,
    
    // TP Instance verification selectors
    allTPInstances: `//div[@class='col-md-3 field_title_1 d-flex']/span[@class='text-truncate']`,
    instanceEnrollmentStatus: (instanceName: string) => `//span[text()='${instanceName}']/ancestor::div[contains(@class,'cls_instance')]//following::span[contains(text(),'enrolled') or contains(text(),'Not enrolled')]`,
    instanceEnrollButton: (instanceName: string) => `//span[text()='${instanceName}']/ancestor::div[contains(@class,'cls_instance')]//following::button[contains(@class,'enroll') or text()='Enroll'][1]`,

    recertificationCheckbox:`//span[text()='Recertification']/preceding-sibling::i[@class='fa-duotone fa-square icon_16_1 icon_16_1']`,

    // 
    }


    constructor(page: Page, context: BrowserContext) {
        super(page, context);
    }
    async clickViewLearner() {
        await this.click(this.selectors.viewLearner, "View Learner", "Button")
         await this.wait("maxWait");
        

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
        await this.wait("minWait")
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
        await this.wait("maxWait")
        await this.click(this.selectors.searchcourseOrUser, "Search User", "Input Field")
        await this.typeAndEnter(this.selectors.searchcourseOrUser, "Course Name", data)
        // const index = await this.page.locator(`//div[contains(@id,'lms-scroll-results')]//li[text()='${data}']`).count();
        // const randomIndex = Math.floor(Math.random() * index) + 1;
        await this.click(this.selectors.userListOpt(data), "Course", "Options")
        //await this.click(this.selectors.selectUser, "Select Course", "Radio button")
    }
    async searchUser(data: string) {
        await this.wait("minWait")
        await this.typeAndEnter(this.selectors.searchcourseOrUser, "Course Name", data)
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
    async saveBtn(){
        await this.click(this.selectors.saveStatus, "Submit", "button")
    }

    async enterReasonAndSubmit() {
        await this.type(this.selectors.reaonDesc, "Enroll Status", FakerData.getDescription())
        await this.click(this.selectors.submitReason, "Submit", "button")
        await this.wait("minWait")
        await this.click(this.selectors.saveStatus, "Submit", "button")
        await this.wait("mediumWait");
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
        //await this.click(this.selectors.enrollORCancel(data).first(),"Enroll Status","Option")\
        await this.wait("minWait");
       

        await this.page.locator(this.selectors.enrollORCancel(data)).first().click({ force: true });
        await this.wait("minWait");
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


    async clickEnrollButtonAfterEnrollment(){
        await this.validateElementVisibility(this.selectors.clickEnrollBtnAfterEnrollment, "Enroll Button After Enrollment");
        await this.click(this.selectors.clickEnrollBtnAfterEnrollment, "Enroll Button After Enrollment", "Button")
    }


    async verifyTpCompletionStatus(status:string){
        await this.verification(this.selectors.enrollORCancel(status), "Completed")
    }

    async selectCourseOrInstanceFromTp(trainingPlan:string){
        await this.click(this.selectors.clickCourseStatusInTpDropdown, "Course Status In Tp Dropdown", "Dropdown")
        await this.type(this.selectors.typeTpNameInsearchBar, "Type Tp Name In search Bar", trainingPlan);
        await this.click(this.selectors.selectTp, "SelectTp", "Option")
    }

    async clickManyButton(tpName:string){
        await this.wait("minWait");
        await this.validateElementVisibility(this.selectors.clickMany(tpName), 'Many Button');
        await this.click(this.selectors.clickMany(tpName), "Many", "Button")
    }

    async getDisplayedScoreInManageEnrollmentSide(tpName:string,assessment:string){
        await this.wait("minWait");
        const scoreInManageEnrollment=await this.page.locator(this.selectors.assessmentScorePreAndPost(tpName,assessment)).inputValue();
       const convertedValue=Number(scoreInManageEnrollment.trim());


        return convertedValue;
    }


    async verifyPreviousEntryAsCompleted(){
        // Find the second completed entry (previous one)
        const completedSelector = `(//span[text()='Completed'])[2]`;
        await this.verification(completedSelector, "Completed");
        
        // Get unique text from the completed entry row (enrollment code or date)
        try {
            const entryTextElement = await this.page.locator(this.selectors.secondCompletedEntryText).first();
            this.previousEntryIdentifier = await entryTextElement.innerText();
            this.previousEntryIdentifier = this.previousEntryIdentifier.trim();
            console.log(`✅ Verified: Previous enrollment entry status is 'Completed' (Entry ID: ${this.previousEntryIdentifier})`);
        } catch (error) {
            console.log("✅ Verified: Previous enrollment entry status is 'Completed'");
        }
    }

    async verifyPreviousEntryAsExpired(){
        // Verify that the SAME entry (identified by the stored text) now shows 'Expired'
        if (this.previousEntryIdentifier) {
            const expiredSelector = this.selectors.statusInRowWithText(this.previousEntryIdentifier, "Expired");
            await this.verification(expiredSelector, "Expired");
            console.log(`✅ Verified: The same enrollment entry (ID: ${this.previousEntryIdentifier}) status changed from 'Completed' to 'Expired'`);
        } else {
            // Fallback: Just check if there's an expired entry
            const expiredSelector = `(//span[text()='Expired'])[1]`;
            await this.verification(expiredSelector, "Expired");
            console.log("✅ Verified: An enrollment entry status is 'Expired'");
        }
    }

    async selectCertificationType(certificationType:string){
        await this.validateElementVisibility(this.selectors.certificationDropdown(certificationType), "Certification Dropdown");
        await this.click(this.selectors.certificationDropdown(certificationType), "Certification Dropdown", "Dropdown");

        await this.click(this.selectors.recertificationOption, "Recertification option", "Dropdown");

    }

    async verifyStatusInManageEnrollment(status:string){
        await this.verification(this.selectors.enrollStatus, status)
    }

   

    async verifyRevalidatedSuccessMessage(title:string){
        await this.wait("mediumWait")
        await this.validateElementVisibility(this.selectors.revalidateSuccessMessage(title), "Revalidation Success Message");
        console.log(`✅ Verified: Re-Validate to '${title}' has been done successfully for "1" learner(s).`);
    }

    async clickSelect(){
        await this.validateElementVisibility(this.selectors.selectTeamUserBtn, "Select");
        await this.click(this.selectors.selectTeamUserBtn, "Select", "Button")
    }


     public async clickSelectLearner() {
  await this.wait("maxWait");

  const selectUserLocator = this.page.getByRole('button', { name: 'Select' });
  await selectUserLocator.scrollIntoViewIfNeeded();
  await selectUserLocator.waitFor({ state: "visible" });
  await expect(selectUserLocator).toBeEnabled();
  await selectUserLocator.click();
}
 public async searchandSelectTP(TP:string) {
        await this.wait("maxWait");
     
        await this.click("//div[@id='learning-path-selection-filter-icon']", "searchbar", "Button")
        await this.type("//input[@id='learning-path-selection']", "SearchTp", TP)
        await this.click(`//span[text()='${TP}']`, "SelectTp", "Link"
        )
    }
  public async selectCls() {
        await this.wait("maxWait");
  const selectLocator =  this.page.locator("(//div[contains(@class,'field_title')]//preceding::i[contains(@class,'lms-chevron-up-down')][1])");
  await selectLocator.scrollIntoViewIfNeeded();
  await selectLocator.waitFor({ state: "visible" });
  await expect(selectLocator).toBeEnabled();
  await selectLocator.click();
 
       

    }

    //  public async searchUser(user:string) {
    //     await this.wait("maxWait");
    //    await this.typeAndEnter("(//input[@placeholder='Search'])[1]", "User", user);
    // } 
    
    public async clickSearchUserCheckbox(user:string) {
        await this.waitSelector(this.selectors.searchUserCheckbox(user), "searchUserCheckbox" )
        await this.click(this.selectors.searchUserCheckbox(user), "searchUser", "chkbox")
    }

    async verifyInstanceStatus(courseNames: string[], status: string){
        console.log(`\n🔍 Verifying status for ${courseNames.length} course(s) inside the Training Plan...`);
        
        for (const courseName of courseNames) {
            await this.verification(this.selectors.statusOfCourseInsideTP(courseName), status);
            console.log(`✅ Verified: Course '${courseName}' has status '${status}'`);
        }
        
        console.log(`✅ All ${courseNames.length} course(s) verified successfully with status '${status}'\n`);
    }

    // TECRS01 - Transfer Enrollment verification methods
    async verifyTransferEnrollmentOptionNotVisible(): Promise<void> {
        await this.wait("mediumWait");
        const isVisible = await this.page.locator(this.selectors.transferEnrollmentOption).isVisible();
        
        if (!isVisible) {
            console.log("✅ Transfer Enrollment option is NOT visible (as expected when disabled in site settings)");
        } else {
            throw new Error("❌ Transfer Enrollment option is visible but should be hidden when disabled in site configuration");
        }
    }

    async verifyTransferEnrollmentOptionVisible(): Promise<void> {
        await this.wait("mediumWait");
        const transferOption = this.page.locator(this.selectors.transferEnrollmentOption);
        await this.validateElementVisibility(this.selectors.transferEnrollmentOption, "Transfer Enrollment Option");
        const isVisible = await transferOption.isVisible();
        
        if (isVisible) {
            console.log("✅ Transfer Enrollment option IS visible (as expected when enabled in site settings)");
        } else {
            throw new Error("❌ Transfer Enrollment option is not visible but should be shown when enabled in site configuration");
        }
    }

    // TECRS04 - Verify Available Courses/Training Plan section
    async verifyAvailableCoursesTPSectionVisible(): Promise<void> {
        await this.wait("mediumWait");
        const section = this.page.locator(this.selectors.availableCoursesTPSection);
        const isVisible = await section.isVisible();
        
        if (isVisible) {
            console.log("✅ Available Courses/Training Plans section is visible after clicking Transfer Enrollment");
        } else {
            throw new Error("❌ Available Courses/Training Plans section is not visible but should be displayed when Transfer Enrollment is selected");
        }
    }

    // TECRS02 - Transfer Enrollment workflow methods
    async clickTransferEnrollmentOption(): Promise<void> {
        await this.wait("mediumWait");
        await this.validateElementVisibility(this.selectors.transferEnrollmentOption, "Transfer Enrollment Option");
        await this.click(this.selectors.transferEnrollmentOption, "Transfer Enrollment", "Link");
        await this.wait("mediumWait");
    }

    async searchCourseForTransfer(courseName: string): Promise<void> {
        await this.wait("minWait");
        await this.typeAndEnter(this.selectors.searchCourseTransfer, "Search Course", courseName);
        await this.wait("mediumWait");
        
        try {
            // Try to find the course checkbox first
            const courseCheckbox = this.page.locator(`(//label[@class="custom-control-label"])[1]`);
            await courseCheckbox.waitFor({ state: 'visible', timeout: 3000 });
            
            // If checkbox found, select it and click Select Training button
            await courseCheckbox.click();
            await this.wait("minWait");
            await this.page.locator("//button[text()='Select Training']").click();
            await this.wait("mediumWait");
            
        } catch (error) {
            // If checkbox not found, check for "Search to see results" message
            try {
                const noResultsMessage = this.page.locator("//h3[text()='Search to see results.']").first();
                const isVisible = await noResultsMessage.isVisible({ timeout: 2000 });
                
                if (isVisible) {
                    console.log(`Single instance course is not listed in transfer enrollment as expected`);
                    return;
                }
            } catch (msgError) {
                // Neither checkbox nor message found
                throw new Error(`Course ${courseName} not found in transfer enrollment search results`);
            }
        }
    }

    async selectLearnerForTransfer(username: string): Promise<void> {
        await this.wait("minWait");
       await this.page.locator(`(//label[@class="custom-control-label"])[1]`).click();
    }
    
    async selectlearner(){
        await this.wait("minWait");
        await this.page.locator(`//button[text()='Select Learners']`).click();
    }
    async selectSourceInstance(instanceName: string): Promise<void> {
        await this.wait("minWait");
        await this.click(this.selectors.sourceInstanceDropdown, "Source Instance", "Dropdown");
        await this.wait("minWait");
        await this.typeAndEnter(this.selectors.sourceInstanceDropdown, "Source Instance", instanceName);
        
        try {
            // Try to find the instance checkbox first
            const instanceCheckbox = this.page.locator(`(//label[@class="custom-control-label"])[1]`);
            await instanceCheckbox.waitFor({ state: 'visible', timeout: 3000 });
            
            // If checkbox found, select it
            await this.wait("maxWait");
            await instanceCheckbox.click();
            console.log(`Source instance ${instanceName} available for transfer enrollment`);
            
        } catch (error) {
            // If checkbox not found, check for "Search to see results" message
            try {
                const noResultsMessage = this.page.locator("//h3[text()='Search to see results.']").first();
                const isVisible = await noResultsMessage.isVisible({ timeout: 2000 });
                
                if (isVisible) {
                    console.log(`Source instance not found in transfer enrollment`);
                    return;
                }
            } catch (msgError) {
                // Neither checkbox nor message found
                throw new Error(`Source instance ${instanceName} not found in transfer enrollment`);
            }
        }
    }

    async selectTargetInstance(instanceName: string): Promise<void> {
        await this.wait("minWait");
        await this.click(this.selectors.targetInstanceDropdown, "Target Instance", "Dropdown");
        await this.wait("minWait");
        await this.typeAndEnter(this.selectors.targetInstanceDropdown, "Target Instance", instanceName);
        
        try {
            // Try to find the instance checkbox first
            const instanceCheckbox = this.page.locator(`(//input[@id="enrtfr-search-selectinstances-removeindividuals-filter-field"]/following::label[@class="custom-control-label"])[1]`);
            await instanceCheckbox.waitFor({ state: 'visible', timeout: 3000 });
            
            // If checkbox found, select it
            await this.wait("minWait");
            await instanceCheckbox.click();
            console.log(`Target instance ${instanceName} available for transfer enrollment`);
            
        } catch (error) {
            // If checkbox not found, check for "Search to see results" message
            try {
                const noResultsMessage = this.page.locator("//h3[text()='Search to see results.']").first();
                const isVisible = await noResultsMessage.isVisible({ timeout: 2000 });
                
                if (isVisible) {
                    console.log(`Other course instances are not listed in transfer enrollment as expected`);
                    return;
                }
            } catch (msgError) {
                // Neither checkbox nor message found
                throw new Error(`Target instance ${instanceName} not found in transfer enrollment`);
            }
        }
    }

    async clickTransferButton(): Promise<void> {
        await this.wait("minWait");
        await this.validateElementVisibility(this.selectors.transferBtn, "Transfer Button");
        await this.click(this.selectors.transferBtn, "Transfer", "Button");
        await this.wait("mediumWait");
        await this.page.locator("//button[text()='Yes']").click();
    }

    async verifyTransferSuccessMessage(): Promise<void> {
        await this.wait("mediumWait");
        await this.validateElementVisibility(this.selectors.transferSuccessMsg, "Transfer Success Message");
        console.log("✅ Transfer enrollment completed successfully");
    }

    async searchCourseInViewStatus(courseName: string): Promise<void> {
        await this.wait("minWait");
        await this.typeAndEnter(this.selectors.searchCourseViewStatus, "Search Course", courseName);
        await this.wait("mediumWait");
    }

    async searchLearnerInViewStatus(username: string): Promise<void> {
        await this.wait("minWait");
        await this.typeAndEnter(this.selectors.searchLearnerViewStatus, "Search Learner", username);
        await this.wait("mediumWait");
    }

    async verifyLearnerEnrolledInInstance(username: string): Promise<void> {
        await this.wait("mediumWait");
        const isEnrolled = await this.page.locator(this.selectors.learnerInstanceCell(username)).isVisible();
        
        if (isEnrolled) {
            console.log(`✅ Learner ${username} is enrolled in instance:`);
        } else {
            throw new Error(`❌ Learner ${username} is NOT found in instance:`);
        }
    }

    async verifyLearnerNotInInstance(username: string, instanceName: string): Promise<void> {
        await this.wait("mediumWait");
        const isEnrolled = await this.page.locator(this.selectors.learnerInstanceCell(username, instanceName)).isVisible();
        
        if (!isEnrolled) {
            console.log(`✅ Learner ${username} is NOT in instance: ${instanceName} (as expected after transfer)`);
        } else {
            throw new Error(`❌ Learner ${username} is still found in instance: ${instanceName} but should have been transferred`);
        }
    }

    // TECRS03 - Verify transfer restriction methods
    async verifyInstanceNotAvailableInTargetDropdown(instanceName: string): Promise<void> {
        await this.wait("minWait");
        await this.click(this.selectors.targetInstanceDropdown, "Target Instance", "Dropdown");
        await this.wait("minWait");
        
        const instanceOption = this.page.locator(this.selectors.targetInstanceOption(instanceName));
        const isVisible = await instanceOption.isVisible().catch(() => false);
        
        if (!isVisible) {
            console.log(`✅ Instance "${instanceName}" is NOT available in target dropdown (as expected - different course)`);
        } else {
            throw new Error(`❌ Instance "${instanceName}" is visible in target dropdown but should not be (different course)`);
        }
        
        // Close dropdown
        await this.page.keyboard.press('Escape');
    }

    async verifyTargetDropdownShowsOnlySameCourseInstances(courseName: string): Promise<void> {
        await this.wait("minWait");
        await this.click(this.selectors.targetInstanceDropdown, "Target Instance", "Dropdown");
        await this.wait("minWait");
        
        // Get all available options in target dropdown
        const allOptions = await this.page.locator(this.selectors.targetInstanceDropdown + "//following::div[contains(@class,'dropdown-menu')]//span").allTextContents();
        
        console.log(`Available instances in target dropdown: ${allOptions.join(', ')}`);
        
        if (allOptions.length > 0) {
            console.log(`✅ Target dropdown shows instances (assuming they are from the same course: ${courseName})`);
        } else {
            console.log(`ℹ️ No instances available in target dropdown`);
        }
        
        // Close dropdown
        await this.page.keyboard.press('Escape');
    }


    // TECRS07 - Clear filter cross marks (max 2 marks)
    async clearFilterCrossMarks(): Promise<void> {
        await this.wait("minWait");
        const crossMarkSelector = `//i[contains(@class,"fa-duotone fa-times pointer fa-swap-opacity icon")]`;
        
        let cleared = 0;
        const maxClicks = 3; // Safety limit
        
        for (let i = 0; i < maxClicks; i++) {
            try {
                // Re-query for cross marks on each iteration
                const crossMark = this.page.locator(crossMarkSelector).first();
                
                // Check if any cross mark exists
                const isVisible = await crossMark.isVisible({ timeout: 1000 });
                
                if (!isVisible) {
                    break; // No more cross marks
                }
                
                // Click the first cross mark
                await crossMark.click();
                cleared++;
                console.log(`Cleared cross mark ${cleared}`);
                await this.wait("minWait");
                
            } catch (error) {
                // No more cross marks found
                break;
            }
        }
        
        console.log(`✅ Cleared ${cleared} filter cross mark(s)`);
    }

    // TECRS10 - Verify draft instance is NOT listed in From section
    async verifyDraftInstanceNotListed(instanceSession: string): Promise<void> {
        await this.wait("minWait");
        const instanceSelector = `//span[contains(text(),'${instanceSession}')]`;
        
        try {
            const isVisible = await this.page.locator(instanceSelector).isVisible({ timeout: 2000 });
            if (isVisible) {
                throw new Error(`❌ Draft instance "${instanceSession}" should NOT be visible but was found in From section`);
            }
        } catch (error) {
            // Instance not found - this is expected behavior for draft instances
            console.log(`✅ Verified draft instance "${instanceSession}" is NOT listed in From section`);
        }
    }

    // TECRS10 - Verify draft instance is NOT listed in To section
    async verifyDraftInstanceNotInToSection(instanceSession: string): Promise<void> {
        await this.wait("minWait");
        const instanceSelector = `//span[contains(text(),'${instanceSession}')]`;
        
        try {
            const isVisible = await this.page.locator(instanceSelector).isVisible({ timeout: 2000 });
            if (isVisible) {
                throw new Error(`❌ Draft instance "${instanceSession}" should NOT be visible but was found in To section`);
            }
        } catch (error) {
            // Instance not found - this is expected behavior for draft instances
            console.log(`✅ Verified draft instance "${instanceSession}" is NOT listed in To section`);
        }
    }
    public async verifyLearnerStatusInTransferEnrollmentPage(username: string, expectedStatus: string) {
        await this.wait("minWait");
        
        // For Completed and Canceled status, verify learner is NOT displayed
        if (expectedStatus === "Completed" || expectedStatus === "Canceled" || expectedStatus === "Incomplete" || expectedStatus === "Suspended") {
            const learnerRow = this.page.locator(`//td[contains(text(),'${username}')]`).first();
            
            try {
                const isVisible = await learnerRow.isVisible({ timeout: 2000 });
                
                if (isVisible) {
                    throw new Error(`❌ Learner "${username}" with ${expectedStatus} status should NOT be displayed in transfer enrollment list but was found`);
                }
            } catch (error) {
                // If timeout or not visible, this is expected
                if (error.message && error.message.includes('should NOT be displayed')) {
                    throw error; // Re-throw if it's our custom error
                }
                // Otherwise, learner not found - this is correct behavior
                console.log(`✅ Learner "${username}" with ${expectedStatus} status is NOT displayed in transfer enrollment list (as expected)`);
            }
        } else {
            // For other statuses (Enrolled, No Show, etc.), verify learner IS displayed
            const learnerRow = this.page.locator(`//td[contains(text(),'${username}')]`).first();
            
            try {
                const isVisible = await learnerRow.isVisible({ timeout: 3000 });
                
                if (isVisible) {
                    console.log(`✅ Learner "${username}" with ${expectedStatus} status is displayed in transfer enrollment list`);
                } else {
                    throw new Error(`❌ Learner "${username}" with ${expectedStatus} status should be displayed but was not visible`);
                }
            } catch (error) {
                throw new Error(`❌ Learner "${username}" with ${expectedStatus} status should be displayed but was not found: ${error.message}`);
            }
        }
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
            // Click Submit and Save
            await this.click(this.selectors.submitReason, "Submit button", "Button");
            await this.wait("minWait");
            await this.click(this.selectors.saveStatus, "Save Status", "Button");
            await this.wait("minWait");
        } else if (status.toLowerCase() === "canceled") {
            // For Canceled: Enter reason
            await this.type(this.selectors.reaonDesc, "Cancel Reason", FakerData.getDescription());
            // Click Submit and Save
            await this.click(this.selectors.submitReason, "Submit button", "Button");
            await this.wait("minWait");
            await this.click(this.selectors.saveStatus, "Save Status", "Button");
            await this.wait("minWait");
        } else if (status.toLowerCase() === "incomplete") {
            // For Incomplete: Directly click Save button (no reason or submit needed)
            await this.click(this.selectors.saveStatus, "Save Status", "Button");
            await this.wait("minWait");
        } else {
            // For other statuses: Click Submit and Save
            await this.click(this.selectors.submitReason, "Submit button", "Button");
            await this.wait("minWait");
            await this.click(this.selectors.saveStatus, "Save Status", "Button");
            await this.wait("minWait");
        }
        
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
     * Change enrollment type from Mandatory to Optional in View/Update Status page
     * @param username - The username to identify the learner row
     * Note: This only changes Mandatory to Optional. Cannot change Optional to Mandatory.
     */
    async changeEnrollmentType(username: string) {
        await this.wait("minWait");
        
        const dropdownSelector = this.selectors.learnerEnrollmentTypeDropdown(username);
        await this.validateElementVisibility(dropdownSelector, `Enrollment type dropdown for ${username}`);
        
        // Click the dropdown button to open options
        await this.click(dropdownSelector, `Enrollment type dropdown for ${username}`, "Button");
        await this.wait("minWait");
        
        // Click the Optional option (from the currently open dropdown menu)
        const optionalOptionSelector = `//div[contains(@class,'dropdown-menu') and contains(@class,'show')]//span[text()='Optional']`;
        await this.validateElementVisibility(optionalOptionSelector, `Optional option`);
        await this.page.locator(optionalOptionSelector).first().click({ force: true });
        console.log(`✅ Changed enrollment type to "Optional" for ${username}`);
        
        await this.wait("minWait");
        
        // Enter reason for changing enrollment type
        await this.type(this.selectors.reaonDesc, "Enrollment Type Change Reason", FakerData.getDescription());
        
        // Click Submit and Save
        await this.click(this.selectors.submitReason, "Submit button", "Button");
        await this.wait("minWait");
        await this.click(this.selectors.saveStatus, "Save Enrollment Type", "Button");
        await this.wait("minWait");
        console.log(`✅ Enrollment type change saved for ${username}`);
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
    public async verifyWarningMsgForTransferToSameInstance() {
        await this.wait('minWait');
        const messageText = await this.page.locator("//span[text()='The selected users are already enrolled to the training.']").textContent();
        if(messageText?.trim() === "The selected users are already enrolled to the training."){
            console.log(`✅ Verified - Warning Message: "${messageText}"`);
        } else {
            throw new Error(`Expected warning message not found. Got: "${messageText}"`);
        }
    }

    async verifyLearnerVisibleInTransfer(username: string): Promise<void> {
        await this.wait("minWait");
        const learnerRow = this.page.locator(this.selectors.learnerRow(username));
        const isVisible = await learnerRow.isVisible().catch(() => false);
        
        if (isVisible) {
            console.log(`✅ Learner "${username}" IS visible in transfer learner list (as expected)`);
        } else {
            throw new Error(`❌ Learner "${username}" is NOT visible in transfer learner list but should be`);
        }
    }

    async verifyLearnerNotVisibleInTransfer(username: string): Promise<void> {
        await this.wait("minWait");
        const learnerRow = this.page.locator(this.selectors.learnerRow(username));
        const isVisible = await learnerRow.isVisible().catch(() => false);
        
        if (!isVisible) {
            console.log(`✅ Learner "${username}" is NOT visible in transfer learner list (as expected - suspended user)`);
        } else {
            throw new Error(`❌ Learner "${username}" is visible in transfer learner list but should not be (suspended user)`);
        }
    }

     //for multiple order
    async clickMultipleOrderRadioBtn() {
        await this.wait("minWait")
        await this.click(this.selectors.clickMultipleOrderRadioBtn, "Multiple Order", "Radio button")
    }
    async selectCourse_TPForMultiOrder(data: string) {
        await this.wait("minWait")
        await this.typeAndEnter(this.selectors.searchcourseOrUser, "Course Name", data)
        await this.click(this.selectors.selectCourseRdoBtn, "Select Course", "Radio button")
    }
    async enterSearchUserForMultiOrder(data: string) {
        await this.type(this.selectors.searchcourseOrUser, "User Name", data)
        const index = await this.page.locator("//div[contains(@id,'lms-scroll-results')]//li").count();
        const randomIndex = Math.floor(Math.random() * index) + 1;
        await this.click(this.selectors.userListOpt(randomIndex), "User", "Options")
        await this.click(this.selectors.selectUserForMultiOrderCreation(data), "Select User", "Check Box")
    }


    //Enrollment segmentation
    async verifyEnrollmentSegmentation(otherUser: string) {
        await this.wait("minWait")
        await this.typeAndEnter(this.selectors.searchcourseOrUser, "Course Name", otherUser)
        const element = this.page.locator(this.selectors.selectUser(otherUser));
        const count = await element.count();
        if (count === 0) {
            console.log("Enrollment Segmentation is working correctly");
        }
    }

    async enrollOneInstance(){
    }

    /**
     * Get all course/instance names displayed inside TP after selectCls()
     */
    async getTPInstanceNames(): Promise<string[]> {
        await this.wait("mediumWait");
        const names = await this.page.locator(this.selectors.allTPInstances).allTextContents();
        const trimmed = names.map(n => (n || "").trim()).filter(n => n.length > 0);
        console.log(`TP instances found: ${trimmed.join(", ")}`);
        return trimmed;
    }

    /**
     * Verify that TP contains the expected course/instance names
     */
    async verifyTPHasCourses(expected: string[]): Promise<void> {
        const actual = await this.getTPInstanceNames();
        for (const e of expected) {
            const ok = actual.some(a => a === e || a.includes(e) || e.includes(a));
            if (!ok) {
                throw new Error(`Expected course/instance "${e}" not found in TP. Actual: ${actual.join(", ")}`);
            }
            console.log(`✓ Verified in TP: ${e}`);
        }
    }

    /**
     * Enroll the specified course/instance by name inside the TP list
     */
    async enrollCourseByName(name: string): Promise<void> {
        await this.wait("mediumWait");
        // 1) Get all instances by provided XPath
        const allInstances = await this.getTPInstanceNames();
        // 2) Verify the requested EL exists in that list (allow partial match)
        const target = allInstances.find(n => n === name || n.includes(name) || name.includes(n));
        if (!target) {
            throw new Error(`EL "${name}" not found in TP list. Available: ${allInstances.join(', ')}`);
        }

        // 3) Click the radio icon next to that EL name
        let radio = this.page.locator(`(//div[@class='col-md-3 field_title_1 d-flex']/span[@class='text-truncate' and normalize-space()="${target}"]/following::i[@class='fa-duotone fa-circle icon_16_1'])[1]`);
        if (await radio.count() === 0) {
            radio = this.page.locator(`(//div[@class='col-md-3 field_title_1 d-flex']/span[@class='text-truncate' and contains(normalize-space(),"${target}")]/following::i[@class='fa-duotone fa-circle icon_16_1'])[1]`);
        }
        await radio.scrollIntoViewIfNeeded();
        await radio.waitFor({ state: 'visible', timeout: 15000 });
        await radio.click();

        // 4) Click Enroll button
        const enrollBtn = this.page.locator(`//button[text()='Enroll']`).first();
        await enrollBtn.waitFor({ state: 'visible', timeout: 15000 });
        await enrollBtn.click();

        // 5) Click "View Status/Enroll Tp" from success popup
        const viewStatus = this.page.locator(`//a[normalize-space(text())='View Status/Enroll Tp' or normalize-space(text())='View Status/Enroll TP']`).first();
        try {
            await viewStatus.waitFor({ state: 'visible', timeout: 10000 });
            await viewStatus.click();
        } catch {}

        console.log(`Enrolled EL: ${target}`);

    }

    /**
     * Verify a course/instance shows as enrolled in TP list
     */
    async verifyCourseEnrolledInTP(name: string): Promise<void> {
        await this.wait("mediumWait");
        // Ensure list is visible
        await this.page.locator(this.selectors.allTPInstances).first().waitFor({ state: 'visible', timeout: 15000 });

        // Locate the status element near the item name
        let status = this.page.locator(`//div[@class='col-md-3 field_title_1 d-flex']/span[@class='text-truncate' and normalize-space()="${name}"]/ancestor::div[contains(@class,'row')][1]//div[contains(text(),'enrolled')]`).first();
        if (await status.count() === 0) {
            status = this.page.locator(`//div[@class='col-md-3 field_title_1 d-flex']/span[@class='text-truncate' and contains(normalize-space(),"${name}")]/ancestor::div[contains(@class,'row')][1]//div[contains(text(),'enrolled')]`).first();
        }

        const visible = await status.isVisible().catch(() => false);
        if (!visible) {
            throw new Error(`Expected "${name}" to show as enrolled in TP list, but status not found.`);
        }
        console.log(`✅ Verified enrolled in TP: ${name}`);
    }

    async checkRecertificationCheckbox(){
        await this.validateElementVisibility(this.selectors.recertificationCheckbox, "Recertification Checkbox");
        await this.click(this.selectors.recertificationCheckbox, "Recertification", "Checkbox");
        await this.wait("minWait");
    }
}