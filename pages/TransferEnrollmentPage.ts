import { BrowserContext, Page, expect } from "@playwright/test";
import { AdminHomePage } from "./AdminHomePage";

export class TransferEnrollmentPage extends AdminHomePage {

    public selectors = {
        ...this.selectors,
        enrollmentMenuOptions: `//ul[@aria-labelledby='dropdown-enrollments']//div[@class='dropdown dropend lmsinner-menu-wrapper']//a`,
        manageEnrollmentDropdown: `//button[@data-id='enrollment-action']`,
        manageEnrollmentOptions: `//button[@data-id='enrollment-action']//following::div[@class='dropdown-menu show']//a[contains(@class,'dropdown-item')]//span`,
    };

    constructor(page: Page, context: BrowserContext) {
        super(page, context);
    }

    async verifyTransferEnrollmentTPNotInEnrollmentMenu() {
        await this.wait("mediumWait");
        await this.menuButton();
        await this.clickEnrollmentMenu();
        await this.wait("minWait");
        
        const menuOptions = await this.page.locator(this.selectors.enrollmentMenuOptions).allTextContents();
        const hasTransferEnrollment = menuOptions.some(option => option.includes("Transfer Enrollment - Training Plan"));
        
        if (hasTransferEnrollment) {
            throw new Error("❌ FAILURE: Transfer Enrollment - Training Plan should NOT be present in Enrollment menu when disabled");
        } else {
            console.log("✅ Verified: Transfer Enrollment - Training Plan is NOT present in Enrollment menu");
        }
        
        return menuOptions;
    }

    async verifyTransferEnrollmentTPInEnrollmentMenu() {
        await this.wait("mediumWait");
        await this.menuButton();
        await this.clickEnrollmentMenu();
        await this.wait("minWait");
        
        const menuOptions = await this.page.locator(this.selectors.enrollmentMenuOptions).allTextContents();
        const hasTransferEnrollment = menuOptions.some(option => option.includes("Transfer Enrollment - Training Plan"));
        
        if (!hasTransferEnrollment) {
            throw new Error("❌ FAILURE: Transfer Enrollment - Training Plan should be present in Enrollment menu when enabled");
        } else {
            console.log("✅ Verified: Transfer Enrollment - Training Plan IS present in Enrollment menu");
        }
        
        return menuOptions;
    }

    async verifyTransferEnrollmentTPNotInManageEnrollmentDropdown() {
        await this.wait("mediumWait");
        await this.menuButton();
        await this.clickEnrollmentMenu();
        await this.clickEnroll();
        await this.wait("minWait");
        
        // Click manage enrollment dropdown
        await this.validateElementVisibility(this.selectors.manageEnrollmentDropdown, "Manage Enrollment Dropdown");
        await this.click(this.selectors.manageEnrollmentDropdown, "Manage Enrollment", "Dropdown");
        await this.wait("minWait");
        
        // Get all dropdown options
        const dropdownOptions = await this.page.locator(this.selectors.manageEnrollmentOptions).allTextContents();
        const hasTransferEnrollment = dropdownOptions.some(option => option.includes("Transfer Enrollment - Training Plan"));
        
        if (hasTransferEnrollment) {
            throw new Error("❌ FAILURE: Transfer Enrollment - Training Plan should NOT be present in Manage Enrollment dropdown when disabled");
        } else {
            console.log("✅ Verified: Transfer Enrollment - Training Plan is NOT present in Manage Enrollment dropdown");
        }
        
        return dropdownOptions;
    }

    async verifyTransferEnrollmentTPInManageEnrollmentDropdown() {
        await this.wait("mediumWait");
        await this.menuButton();
        await this.clickEnrollmentMenu();
        await this.clickEnroll();
        await this.wait("minWait");
        
        // Click manage enrollment dropdown
        await this.validateElementVisibility(this.selectors.manageEnrollmentDropdown, "Manage Enrollment Dropdown");
        await this.click(this.selectors.manageEnrollmentDropdown, "Manage Enrollment", "Dropdown");
        await this.wait("minWait");
        
        // Get all dropdown options
        const dropdownOptions = await this.page.locator(this.selectors.manageEnrollmentOptions).allTextContents();
        const hasTransferEnrollment = dropdownOptions.some(option => option.includes("Transfer Enrollment - Training Plan"));
        
        if (!hasTransferEnrollment) {
            throw new Error("❌ FAILURE: Transfer Enrollment - Training Plan should be present in Manage Enrollment dropdown when enabled");
        } else {
            console.log("✅ Verified: Transfer Enrollment - Training Plan IS present in Manage Enrollment dropdown");
        }
        
        return dropdownOptions;
    }
}
