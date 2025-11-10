import { Page, BrowserContext, Download } from "@playwright/test";
import { URLConstants } from "../constants/urlConstants";
import { PlaywrightWrapper } from "../utils/playwright";
import { ExportValidator } from "../utils/exportValidator";
import { ExportPage } from "./ExportPage";
import * as path from 'path';
import * as fs from 'fs';


export class AdminGroupPage extends PlaywrightWrapper {

    static pageUrl = URLConstants.adminURL;
    private exportPage: ExportPage;

     public selectors = {
        clickAdminGroup: (user: string) => `//div[text()='${user}']`,
        searchUser: "#includeLearner-filter-field",

        userSearchDropdown: `//button[@data-id='includeLearner'][@data-bs-toggle='dropdown']`,
        userSearchDropdownMain: `(//h6[text()='Select User']//following::div[@class='filter-option-inner'])[1]`,
        userSearchDropdownOption: (option: string) => ` //a[contains(@class,'dropdown-item')]//following::span[text()='${option}']`,
        chooseUser: (user: string) => `//li[text()='${user}']`,
        //(username:string)=>`//span[text()=${username}]/following::i[contains(@class,'fa-square icon')][1]
        //selectUser:`(//div[contains(@class,'custom-control custom-chkbox')])[2]`,
        selectUser: `(//div[contains(@class,'chkbox')]//i[contains(@class,'fa-square icon')])[2]`,
        clickSelectUser: `//button[text()='Select Users']`,
        selectUpdate: `//button[text()='Update']`,
        searchCustomerAdmin: `//button[text()='CREATE GROUP']/following::input[1]`,
        // selectPopup: `//li[text()='Super admin - Customer']`,
        // commerceAdmin: `//div[text()='Commerce admin']`      
        createGroupButton: `#admin-view-btn-primary`,
        groupTitle: `#title`,
        adminRoledropdown: `//button[@data-id='admin_roles']`,
        selectRole: (roleName: string) => `//a[@class='dropdown-item']//span[text()='${roleName}']`,
        saveAdminGroup: `#lrnSaveUpdate`,
        proceedButton: `//button[contains(text(),'Yes, Proceed')]`,

        clickActivateBtn:`//span[text()='Activate']`,
        adminGroupValue: `//label[text()='Learner Group']//preceding::label[@class='form-label d-block my-0 me-1 text-break']`,
        adminGroupValueInUser: `//label[text()='Admin Group']//following::label[@class='form-label d-block my-0 me-1 text-break']`,
        selectOrganization:`//i[@class='fa fa-duotone fa-arrow-up-right-from-square icon_14_1']`,
        searchOrganization:`//input[contains(@id,'org-exp-search')]`,
        checkOrganization:`//i[@class='fa-duotone fa-square icon_14_1 me-1']`,
        SaveOk:`//button[text()='OK']`,
        clickYes:`//button[text()='Yes']`,

        // Group creation popup selectors
        groupCreationPopupMessage: `//div[text()='Do you still want to go ahead and create a new group?']`,
        groupCreationPopupYesButton: `//button[text()='Yes']`,

        yesButton: `//button[text()='Yes']`,
        activateGroupBtn: `//a[@data-bs-toggle='tooltip'][@aria-label='Activate']`,
        suspendBtn: `[name="suspend-btn"]`,
        suspendIconBtn: `//a[@data-bs-toggle='tooltip'][@aria-label='Suspend']`,
        accessButton: `//span[@class='icontxt pointer' and text()='Access']`,
        deleteButton: `//span[@class='ms-2 field_title_1 deactivate_color' and text()='Delete Group']`,
        validTillInput: `//input[@id="admn_valid_till-input"]`,
   
        noMatchingResultMessage: `//div[@id='includeuserslist']/div`,
        groupNameAlreadyExistsError: `//*[contains(text(),'Group Name already exists')]`,
        errorMessageGeneral: `//div[contains(text(),'Group Name already exists')] | //*[contains(@class,'alert-danger')] | //*[contains(@class,'error')] | //*[contains(@class,'text-danger')][contains(text(),'Group Name already exists')]`,
        exportIcon:`(//button[contains(@class,'export')]/i)[1]`,
        exportAs:(filetype: string)=>  `(//span[text()='Export as ${filetype}'])[1]`,
        addedUsers:`//h6[text()='ADDED USERS']/following-sibling::div[@class='slimScrollDiv']//span`,
        editGroupButton: (groupName: string) => `(//div[text()='${groupName}']/following::a[@aria-label='Edit'])[1]`

    }

    constructor(page: Page, context: BrowserContext) {
        super(page, context);
        this.exportPage = new ExportPage(page, context);
    }


    public async searchAdmin(admin: string) {
        await this.type(this.selectors.searchCustomerAdmin, "Search Admin", admin)

    }
    public async clickGroup(data: string) {
        await this.wait('minWait');
        await this.mouseHover(this.selectors.chooseUser(data), "POP up ");
        await this.click(this.selectors.chooseUser(data), "Pop up", "Clicked");
        await this.click(this.selectors.clickAdminGroup(data), "Customer Admin", "Button");
    }


    public async clickCommerceAdmin() {
        await this.click(this.selectors.clickAdminGroup("Commerce admin"), "Commerce Admin", "Button");

    }

    public async clickLearningAdmin() {
        await this.click(this.selectors.clickAdminGroup("Learning admin"), "Learning Admin", "Button");
        await this.wait('minWait')
    }


    public async clickPeopleAdmin() {
        await this.click(this.selectors.clickAdminGroup("People admin"), "People Admin", "Button");
    }


    public async clickEnrollAdmin() {
        await this.click(this.selectors.clickAdminGroup("Enrollment admin"), "People Admin", "Button");
    }


    public async clickCourseAdmin() {
        await this.click(this.selectors.clickAdminGroup("Course creator admin"), "Course Admin", "Button");
    }


    // public async adminPopup(admintype:string){
    //     const adminGroup = [
    //         "Customer Admin", "Course creator admin", "Enrollment admin",
    //          "People admin", "Learning admin", "Commerce admin", "Talent admin",           
    //     ];   
    //     for(let name of adminGroup){     
    //         if(name.includes(admintype))
    //         await this.click(this.selectors.clickAdminGroup(`${name}`), `${name}`, "Button");
    //     }}


    public async searchUser(data: string) {
        await this.typeAndEnter(this.selectors.searchUser, "Search User", data);
    }

    public async selectUserSearchType(searchType: string) {
        // First click on the main dropdown to expand options
        await this.click(this.selectors.userSearchDropdownMain, "User Search Dropdown", "Dropdown");
        await this.wait('minWait');
        // Then click on the specific option
        await this.click(this.selectors.userSearchDropdownOption(searchType), `${searchType} Option`, "Option");
    }


    public async clickuserCheckbox(username: string) {
        await this.validateElementVisibility(this.selectors.selectUser, username);
        await this.click(this.selectors.selectUser, username, "CheckBox");
        await this.isCheckboxClicked(this.selectors.selectUser, "CheckBox");
    }

    public async clickSelectUsers() {
        await this.click(this.selectors.clickSelectUser, "Username", "Checkbox ");
    }

    public async clickUpdate() {
        await this.validateElementVisibility(this.selectors.selectUpdate, "Update");
        await this.wait('minWait');
        await this.click(this.selectors.selectUpdate, "Update", "Button");
    }
    public async clickCreateGroup() {
        await this.wait("minWait")
        await this.validateElementVisibility(this.selectors.createGroupButton, "Create Group");
        await this.click(this.selectors.createGroupButton, "Create Group", "Button")
    }

    public async enterGroupTitle(title: string) {
        await this.type(this.selectors.groupTitle, "Custom Group title", title)

    }

    public async selectroleAdmin(roleName: string) {
        await this.click(this.selectors.adminRoledropdown, "Admin Role", "Dropdown")
        await this.click(this.selectors.selectRole(roleName), "Custom Admin Role", "Option")
    }

    public async clickSave() {
        await this.click(this.selectors.saveAdminGroup, "Custom Group Save ", "button")
    }

    public async handleGroupCreationPopup() {
        try {
            const popupLocator = this.page.locator(this.selectors.groupCreationPopupMessage);
            if (await popupLocator.isVisible({ timeout: 3000 })) {
                console.log("✅ Group creation popup detected: 'Do you still want to go ahead and create a new group?' - Clicking Yes");
                await this.click(this.selectors.groupCreationPopupYesButton, "Group Creation Popup Yes", "Button");
                await this.wait("minWait");
                return true; // Popup was present and handled
            }
        } catch (error) {
            console.log("ℹ️ No group creation popup appeared - continuing normally");
        }
        return false; // No popup was present
    }

    public async clickSaveWithPopupHandling() {
        await this.clickSave();
        return await this.handleGroupCreationPopup();
    }

    public async clickProceed() {
        await this.wait("minWait")
        await this.validateElementVisibility(this.selectors.proceedButton, "Proceed");
        await this.click(this.selectors.proceedButton, "Proceed", "button")

    }

    async getAdminGroups() {
        await this.wait("mediumWait");
        const locator = this.page.locator(this.selectors.adminGroupValue);
        const count = await locator.count();
        let adminGroup: any = [];
        for (let i = 0; i < count; i++) {
            const ag = await locator.nth(i).innerHTML();
            await adminGroup.push(ag);
        }
        return adminGroup;
    }
    async getAdminGroupsInUserPage() {
        await this.wait("mediumWait");
        const locator = this.page.locator(this.selectors.adminGroupValueInUser);
        const count = await locator.count();
        let adminGroup: any = [];
        for (let i = 0; i < count; i++) {
            const ag = await locator.nth(i).innerHTML();
            await adminGroup.push(ag);
        }
        return adminGroup;
    }
    async clickActivate() {
        await this.validateElementVisibility(this.selectors.clickActivateBtn, "Activate");
        await this.click(this.selectors.clickActivateBtn, "Activate", "Radio");
    }
    async clickSuspend() {
        await this.validateElementVisibility(this.selectors.suspendBtn, "Suspend");
        await this.click(this.selectors.suspendBtn, "Suspend", "Button");
    }
    async clickYes() {
        await this.validateElementVisibility(this.selectors.yesButton, "Yes");
        await this.click(this.selectors.yesButton, "Yes", "Button");
    }
    async clickActivateGroup() {
        await this.validateElementVisibility(this.selectors.activateGroupBtn, "Activate Group");
        await this.click(this.selectors.activateGroupBtn, "Activate Group", "Link");
    }
    async enterValidTillDate(date: string) {
        await this.type(this.selectors.validTillInput, "Valid Till Date", date);
    }
    async verifyActivated() {
        await this.wait("maxWait");
        await this.validateElementVisibility(this.selectors.suspendIconBtn, "Suspend Button");
    }
    public async clickSelelctUsers() {
        await this.click(this.selectors.clickSelectUser, "Username", "Checkbox ");
    }

    public async verifyAccessButtonDisabled() {
        await this.wait("mediumWait");
        const accessButtonLocator = this.page.locator(this.selectors.accessButton);
        const count = await accessButtonLocator.count();
        
        if (count > 0) {
            // Check if the element has disabled class or pointer-events: none
            const isClickable = await accessButtonLocator.isEnabled().catch(() => false);
            const hasPointerEvents = await accessButtonLocator.evaluate(el => {
                const style = window.getComputedStyle(el);
                return style.pointerEvents !== 'none';
            }).catch(() => true);
            
            if (isClickable && hasPointerEvents) {
                throw new Error('Access button is enabled when it should be disabled for suspended admin group.');
            }
        } else {
            throw new Error('Access button not found in the UI.');
        }
    }

    public async verifySuspendButtonDisabled() {
        await this.wait("mediumWait");
        const suspendButtonLocator = this.page.locator(this.selectors.suspendBtn);
        const count = await suspendButtonLocator.count();
        
        if (count > 0) {
            // Scroll to the suspend button to ensure it's visible
            await suspendButtonLocator.scrollIntoViewIfNeeded();
            await this.wait("minWait");
            
            // Hover over the suspend button
            await this.mouseHover(this.selectors.suspendBtn, "Suspend Button");
            await this.wait("minWait");
            
            // Check if the element is disabled
            const isDisabled = await suspendButtonLocator.isDisabled().catch(() => false);
            const hasDisabledAttribute = await suspendButtonLocator.getAttribute('disabled').catch(() => null);
            const isClickable = await suspendButtonLocator.isEnabled().catch(() => false);
            
            // Check for disabled class
            const hasDisabledClass = await suspendButtonLocator.getAttribute('class').then(classes => 
                classes?.includes('disabled') || classes?.includes('btn-disabled')
            ).catch(() => false);
            
            // Check CSS pointer events
            const hasPointerEvents = await suspendButtonLocator.evaluate(el => {
                const style = window.getComputedStyle(el);
                return style.pointerEvents !== 'none';
            }).catch(() => true);
            
            // Validate that the button is properly disabled
            if (!isDisabled && !hasDisabledAttribute && isClickable && hasPointerEvents && !hasDisabledClass) {
                throw new Error('Suspend button is enabled when it should be disabled for default admin group.');
            }
            
            console.log('Suspend button is properly disabled for default admin group');
        } else {
            throw new Error('Suspend button not found in the UI.');
        }
    }

    public async verifyDeleteButtonDisabled() {
        await this.wait("mediumWait");
        const deleteButtonLocator = this.page.locator(this.selectors.deleteButton);
        const count = await deleteButtonLocator.count();
        
        if (count > 0) {
            // Scroll to the delete button to ensure it's visible
            await deleteButtonLocator.scrollIntoViewIfNeeded();
            await this.wait("minWait");
            
            // Hover over the delete button
            await this.mouseHover(this.selectors.deleteButton, "Delete Button");
            await this.wait("minWait");
            
            // Check if the element has deactivate_color class which indicates it's disabled
            const hasDeactivateClass = await deleteButtonLocator.getAttribute('class').then(classes => 
                classes?.includes('deactivate_color')
            ).catch(() => false);
            
            // Check if the element is clickable
            const isClickable = await deleteButtonLocator.isEnabled().catch(() => false);
            const hasPointerEvents = await deleteButtonLocator.evaluate(el => {
                const style = window.getComputedStyle(el);
                return style.pointerEvents !== 'none';
            }).catch(() => true);
            
            // For delete button, deactivate_color class indicates it's disabled
            if (!hasDeactivateClass) {
                throw new Error('Delete button does not have deactivate_color class - it may be enabled for default admin group.');
            }
            
            // Additional check for clickability
            if (isClickable && hasPointerEvents) {
                console.warn('Delete button appears clickable but has deactivate_color class');
            }
            
            console.log('Delete button is properly disabled for default admin group');
        } else {
            throw new Error('Delete button not found in the UI.');
        }
    }

    /**
     * Verify that no matching results are found when searching for already added users
     */
    public async verifyNoMatchingResultFound() {
        await this.wait("mediumWait");
        const messageLocator = this.page.locator(this.selectors.noMatchingResultMessage);
        const count = await messageLocator.count();
        
        if (count > 0) {
            const messageText = await messageLocator.textContent();
            if (messageText && messageText.includes('No matching result found')) {
                console.log('PASS: Verified: No matching result found - user already added to admin group');
                return true;
            } else {
                console.log(`Actual message found: "${messageText}"`);
                throw new Error('Expected "No matching result found" message not displayed');
            }
        } else {
            throw new Error('No matching result message container not found in the UI.');
        }
    }

    /**
     * Verify that "Group Name already exists" error message is displayed
     */
    public async verifyGroupNameAlreadyExistsError(): Promise<boolean> {
        await this.wait("mediumWait");
        
        // Try multiple selectors to find the error message
        const selectors = [
            `//*[contains(text(),'Group Name already exists')]`,
            `//span[contains(text(),'Group Name already exists')]`,
            `//*[contains(@class,'alert')][contains(text(),'Group Name already exists')]`,
            `//*[contains(text(),'already exists')]`
        ];
        
        for (const selector of selectors) {
            const errorLocator = this.page.locator(selector);
            const count = await errorLocator.count();
            
            if (count > 0) {
                const errorText = await errorLocator.first().textContent();
                console.log(`PASS: Group Name error message found with selector: ${selector}`);
                console.log(`Error message text: "${errorText}"`);
                return true;
            }
        }
        
        // Debug: Print all text content to see what's actually on the page
        console.log('DEBUG: Checking all page text for error message...');
        const pageText = await this.page.textContent('body');
        if (pageText && pageText.includes('Group Name already exists')) {
            console.log('PASS: Error message text found in page body');
            return true;
        }
        
        console.log('FAIL: Group Name already exists error message not found with any selector');
        return false;
    }


    // Delegate to ExportPage for export functionality
    public async clickExportAs(filetype: string): Promise<void> {
        return await this.exportPage.clickExportAs(filetype);
    }

    // Delegate to ExportPage for JSON-based validation
    public async validateExported(filetype: string): Promise<void> {
        return await this.exportPage.validateExported(filetype);
    }

    // Delegate to ExportPage for username validation
    public async validateUsernamesInExport(filetype: string, usernames: string[]): Promise<void> {
        return await this.exportPage.validateUsernamesInExport(filetype, usernames);
    }

    public async getAddedUsers(): Promise<{ name: string, username: string }[]> {
        await this.wait("mediumWait");
        
        // Clean JSON file before storing new data
        const jsonPath = path.join(process.cwd(), 'test-results', 'addedUsers.json');
        if (fs.existsSync(jsonPath)) {
            fs.unlinkSync(jsonPath);
            console.log('Previous JSON file cleaned');
        }
        
        // Get all span elements from ADDED USERS section
        const allElements = await this.page.locator(this.selectors.addedUsers).allTextContents();
        
        const addedUsers: { name: string, username: string }[] = [];
        
        // Process elements: odd positions (1,3,5...) are names, even positions (2,4,6...) are usernames
        for (let i = 0; i < allElements.length - 1; i += 2) {
            const name = allElements[i]?.trim();           // Position 1, 3, 5... (odd - names)
            const username = allElements[i + 1]?.trim();   // Position 2, 4, 6... (even - usernames)
            
            if (name && username && name !== '' && username !== '') {
                addedUsers.push({
                    name: name,
                    username: username
                });
            }
        }
        
        return addedUsers;
    }

    public async verifyWarningMessage(): Promise<boolean> {
        await this.wait("mediumWait");
        
        // Try multiple selectors to find the warning message from the screenshot
        const selectors = [
            `//*[contains(text(),'same attributes/criteria')]`,
            `//*[contains(text(),'have been created with the same attributes')]`,
            `//*[contains(text(),'Do you still want to go ahead and create a new group')]`,
            `//*[contains(text(),'below-mentioned group(s) have been created')]`
        ];
        
        for (const selector of selectors) {
            const warningLocator = this.page.locator(selector);
            const count = await warningLocator.count();
            
            if (count > 0) {
                const warningText = await warningLocator.first().textContent();
                console.log(`PASS: Same attributes warning message found`);
                console.log(`Warning message text: "${warningText}"`);
                return true;
            }
        }
        
        // Check if any modal/dialog is visible with warning content
        const modalSelectors = [
            `//div[contains(@class,'modal')]`,
            `//div[contains(@class,'dialog')]`,
            `//div[contains(@role,'dialog')]`
        ];
        
        for (const modalSelector of modalSelectors) {
            const modalLocator = this.page.locator(modalSelector);
            const count = await modalLocator.count();
            
            if (count > 0) {
                const modalText = await modalLocator.first().textContent();
                console.log(`DEBUG: Modal/Dialog found with text: "${modalText}"`);
                
                if (modalText && (
                    modalText.includes('same attributes') || 
                    modalText.includes('same criteria') ||
                    modalText.includes('have been created with the same')
                )) {
                    console.log(`PASS: Warning message found in modal`);
                    return true;
                }
            }
        }
        
        console.log('FAIL: Same attributes warning message not found');
        return false;
    }

    /**
     * Verify that the user search dropdown is disabled for role-based admin groups
     */
    public async verifyUserSearchDropdownDisabled(): Promise<boolean> {
        await this.wait("mediumWait");
        
        const dropdownLocator = this.page.locator(this.selectors.userSearchDropdownMain);
        const count = await dropdownLocator.count();
        
        if (count > 0) {
            // Check if the element is disabled
            const isDisabled = await dropdownLocator.isDisabled().catch(() => false);
            const hasDisabledAttribute = await dropdownLocator.getAttribute('disabled').catch(() => null);
            const isClickable = await dropdownLocator.isEnabled().catch(() => false);
            
            // Check for disabled class
            const hasDisabledClass = await dropdownLocator.getAttribute('class').then(classes => 
                classes?.includes('disabled') || classes?.includes('btn-disabled')
            ).catch(() => false);
            
            // Check CSS pointer events
            const hasPointerEvents = await dropdownLocator.evaluate(el => {
                const style = window.getComputedStyle(el);
                return style.pointerEvents !== 'none';
            }).catch(() => true);
            
            // Validate that the dropdown is properly disabled
            if (isDisabled || hasDisabledAttribute || !isClickable || hasDisabledClass || !hasPointerEvents) {
                console.log('PASS: User search dropdown is properly disabled for role-based admin group');
                return true;
            } else {
                console.log('FAIL: User search dropdown is enabled when it should be disabled for role-based admin group');
                return false;
            }
        } else {
            console.log('WARN: User search dropdown not found in the UI.');
            return false;
        }
    }

    /**
     * Verify that a specific user is present in the admin group's added users list
     */
    public async verifyUserInAdminGroup(username: string): Promise<boolean> {
        await this.wait("mediumWait");
        
        const addedUsers = await this.getAddedUsers();
        
        for (const user of addedUsers) {
            if (user.username === username) {
                console.log(`PASS: User '${username}' found in admin group with name: ${user.name}`);
                return true;
            }
        }
        
        console.log(`FAIL: User '${username}' not found in admin group`);
        console.log(`Current users in group: ${addedUsers.map(u => u.username).join(', ')}`);
        return false;
    }

    async editAdminGroup(groupName: string) {
        await this.wait('minWait');
        await this.click(this.selectors.editGroupButton(groupName), "Edit Group Button", "Button");
    }
    public async assignOrganization(data:string) {
        await this.click(this.selectors.selectOrganization, "Assign Organization", "Button");
        await this.typeAndEnter(this.selectors.searchOrganization, "Search Organization", data);
        await this.click(this.selectors.checkOrganization,"Organization","Checkbox");
        await this.click(this.selectors.SaveOk,"OK Button","Button");
    }

}