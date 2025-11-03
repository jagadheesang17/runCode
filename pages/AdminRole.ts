import { Page, BrowserContext } from "@playwright/test";
import { URLConstants } from "../constants/urlConstants";
import { AdminHomePage } from "./AdminHomePage";
import { PlaywrightWrapper } from "../utils/playwright";
import { th } from "@faker-js/faker";



export class AdminRolePage extends AdminHomePage {
    static pageUrl = URLConstants.adminURL;

    public selectors = {
        ...this.selectors,
        addAdminrole: `//button[text()='ADD ADMIN ROLE']`,
        adminroleName: `#role_name`,
        moduleName: (index: number) => `(//span[@class='pointer text-truncate'])[${index}]`,
        additonalModuleName: (index: number) => `(//span[@class='text-truncate'])[${index}]`,
        deleteIcon: (module: string) => `(//label[@for='${module}-delete']//i)[2]`,
        saveButton: `#role-meta-data-save`,
        createdRole: `//div[contains(@id,'role_name')]/span`,
        //   searchField: `//input[contains(@id,'exp-search')]`,
        searchField: `//input[contains(@id,'exp-search')]`,
        selectRole: `//div[contains(@id,'exp-search-lms-scroll-results')]//li`,
        selectEnrollmentRole:`//label[@for='Enrollments-create']`,
        alertMessage: `//div[contains(@class,'alert alert-dismissible')]//span`,
        editIcon: (roleName: string) => `(//span[text()='${roleName}']//following::span[@aria-label='Edit'])[1]`,
        deleteRoleIcon: (roleName: string) => `(//span[text()='${roleName}']//following::span[@aria-label='Delete'])[1]`,
        cancelButton: `//button[text()='Cancel']`,
        mandatoryFieldError: `//div[contains(@class,'error') or contains(@class,'invalid-feedback')]`,
        viewIcon: (module: string) => `(//label[@for='${module}-view']//i)[2]`,
        editPrivilegeCheckbox: (module: string) => `(//label[@for='${module}-edit']//i)[2]`, 
        createIcon: (module: string) => `(//label[@for='${module}-create']//i)[2]`,

    };
    constructor(page: Page, context: BrowserContext) {
        super(page, context);
    }

    public async clickAddAdminRole() {
        await this.wait("minWait");
        await this.click(this.selectors.addAdminrole, "Add AdminRole", "Button")
    }

    public async enterName(roleName: string) {
        await this.type(this.selectors.adminroleName, "Admin Role Name", roleName)
    }

    public async clickAllPriveileges() {
        await this.wait('mediumWait')
        const count = await this.page.locator(`//span[contains(@class,'pointer text-truncate')]`).count()
        for (let index = 1; index <= count; index++) {
            const text = await this.page.locator(this.selectors.moduleName(index)).innerHTML();
            await this.click(this.selectors.deleteIcon(text), `${text}`, "Delete Checkbox")
        }
        const countMod = await this.page.locator(`//span[@class='text-truncate']`).count()
        console.log(countMod)
        for (let index = 1; index <= countMod; index++) {
            const text = await this.page.locator(this.selectors.additonalModuleName(index)).innerHTML();
            await this.click(this.selectors.deleteIcon(text), `${text}`, "Delete Checkbox")
        }
        await this.click(this.selectors.selectEnrollmentRole, "Enrollment Role", "Checkbox") // Click on Enrollments-create checkbox

    }

    public async clickSave() {
        await this.click(this.selectors.saveButton, "Save", "Button")
        await this.page.reload();
    }

    public async roleSearch(roleName: string) {
        await this.type(this.selectors.searchField, "Search Field", roleName)
        await this.mouseHover(this.selectors.selectRole, "Search Field")
        await this.click(this.selectors.selectRole, "Search Field", "Option")
    }

    public async verifyRole(roleName: string) {
        await this.verification(this.selectors.createdRole, roleName)
    }

    public async verifyAlertMessage(expectedMessage: string) {
        await this.wait("mediumWait");
        const actualMessage = await this.page.locator(this.selectors.alertMessage).textContent();
        if (actualMessage?.trim() === expectedMessage) {
            console.log(`✅ Alert message verified: ${expectedMessage}`);
        } else {
            throw new Error(`Alert message mismatch. Expected: ${expectedMessage}, Actual: ${actualMessage}`);
        }
    }

    public async clearRoleName() {
        await this.page.locator(this.selectors.adminroleName).clear();
    }

    public async clickCancel() {
        await this.click(this.selectors.cancelButton, "Cancel", "Button");
    }

    public async verifyEditIconDisabled(roleName: string) {
        const editIcon = this.page.locator(this.selectors.editIcon(roleName));
        const isDisabled = await editIcon.getAttribute('class');
        if (isDisabled?.includes('disabled') || isDisabled?.includes('readonly')) {
            console.log(`✅ Edit icon is disabled for role: ${roleName}`);
            return true;
        } else {
            console.log(`❌ Edit icon is NOT disabled for role: ${roleName}`);
            return false;
        }
    }

    public async verifyDeleteIconDisabled(roleName: string) {
        const deleteIcon = this.page.locator(this.selectors.deleteRoleIcon(roleName));
        const isDisabled = await deleteIcon.getAttribute('class');
        if (isDisabled?.includes('disabled') || isDisabled?.includes('readonly')) {
            console.log(`✅ Delete icon is disabled for role: ${roleName}`);
            return true;
        } else {
            console.log(`❌ Delete icon is NOT disabled for role: ${roleName}`);
            return false;
        }
    }

    public async verifyRoleInList(roleName: string) {
        const roleElement = this.page.locator(`//span[text()='${roleName}']`);
        const isVisible = await roleElement.isVisible();
        if (isVisible) {
            console.log(`✅ Role found in list: ${roleName}`);
            return true;
        } else {
            console.log(`❌ Role NOT found in list: ${roleName}`);
            return false;
        }
    }

    public async attemptSaveWithoutName() {
        await this.click(this.selectors.saveButton, "Save", "Button");
        await this.wait("minWait");
    }

    public async verifyMandatoryFieldError() {
        const errorElement = this.page.locator(this.selectors.mandatoryFieldError);
        const isVisible = await errorElement.isVisible();
        if (isVisible) {
            const errorText = await errorElement.textContent();
            console.log(`✅ Mandatory field error displayed: ${errorText}`);
            return true;
        } else {
            console.log(`❌ Mandatory field error NOT displayed`);
            return false;
        }
    }
}




