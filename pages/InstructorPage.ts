import { BrowserContext, Page } from "@playwright/test";
import { AdminHomePage } from "./AdminHomePage";
import { URLConstants } from "../constants/urlConstants";
import { EnrollmentPage } from "./EnrollmentPage";


export class InstructorPage extends EnrollmentPage {

    public selectors = {
        ...this.selectors,
        instructorMenu: `//span[text()='Instructor']`,
        instFilter: `//button[@id='admin-filters-trigger']`,
        deliveryTypedropdown: `//span[text()='Delivery Type']/following::div[@id='wrapper-search_deliveryType']`,
        deliveryTypeOption: `//span[text()='Delivery Type']/following::div[@class='dropdown-menu show']//a`,
        statusDropdown: `//span[text()='Status']/following::div[@id='wrapper-search_course_status']`,
        statusOption: `//span[text()='Status']/following::div[@class='dropdown-menu show']//a`,
        enrollmentIcon: (course: string) => `(//div[text()='${course}']/following::div[@aria-label="Enrollments"]//i)[1]`,
        apply: `//button[text()='Apply']`,
        searchField: "//input[@id='exp-search-field']",
        searchResult: `//div[@id='exp-search-lms-scroll-results']//li`,
        classlist:`//button[text()='Classes List']`,
        applyButton: `//button[text()='Apply']`,

    };

    constructor(page: Page, context: BrowserContext) {
        super(page, context);
    }

    async clickInstructor() {
        await this.click(this.selectors.instructorMenu, "Instructor", "Link");
    }

    async clickFilter() {
        await this.wait("minWait");
        await this.click(this.selectors.instFilter, "Instructor Filter", "Field");
    }


    async selectDeliveryType() {
        const deliveryType = ["Classroom", "Virtual Class"]
        await this.click(this.selectors.deliveryTypedropdown, "DeliveryType", "dropdown");
        for (const type of deliveryType) {
            const status = await this.page.locator(`//span[@class='text' and text()='${type}']`).getAttribute("aria-selected")
            if (!status) {
                console.log(`${type} Element Selected`)
            } else {
                await this.click(`//span[@class='text' and text()='${type}']`, "DeliveryType", "Option")
            }
        } await this.click(this.selectors.deliveryTypedropdown, "DeliveryType", "dropdown");

    }

    async selectStatus(statusType: string) {

        await this.click(this.selectors.statusDropdown, "status", "dropdown");
        const status = await this.page.locator(`//span[@class='text' and text()='${statusType}']//parent::a`).getAttribute("aria-selected")
        if (!status) {
            console.log(`${statusType} Selected`)
        } else {
            await this.click(`//span[@class='text' and text()='${statusType}']`, "status", "Option");
            await this.wait('minWait');
        }
        await this.click(this.selectors.statusDropdown, "status", "dropdown");
    }

    /* async clickApply(statusType?: string) {
        await this.page.locator(this.selectors.apply).scrollIntoViewIfNeeded();
        await this.page.waitForSelector(this.selectors.apply, { state: 'attached' });
        await this.wait('maxWait');
        const isVisible = await this.page.getByRole('button', { name: 'Apply', exact: true }).isVisible();
        console.log('Button visibility:', isVisible);
        if (isVisible) {
            await this.wait('minWait');
            await this.page.getByRole('button', { name: 'Apply' }).click({ timeout: 5000 });
            await this.wait('mediumWait');
        } else {
            console.log('The button is not visible or is covered by another element.');
        }
        let textverify = await this.page.locator("//b[text()='Status']/following-sibling::span").allTextContents();
        if (textverify.includes("Completed")) {
            console.log(textverify);
        } else {
            this.clickFilter();
            this.selectDeliveryType();
            this.selectStatus(statusType);
            this.clickApply()

        }


    } */
    async clickApply(statusType?: string) {
        await this.page.locator(this.selectors.apply).scrollIntoViewIfNeeded();
        await this.page.waitForSelector(this.selectors.apply, { state: 'attached' });
        await this.wait('maxWait');
        const isVisible = await this.page.getByRole('button', { name: 'Apply', exact: true }).isVisible();
        console.log('Button visibility:', isVisible);
        if (isVisible) {
            await this.wait('minWait');
            await this.page.getByRole('button', { name: 'Apply' }).click({ timeout: 5000 });
            await this.wait('mediumWait');
        } else {
            console.log('The button is not visible or is covered by another element.');
            return;
        }
        let textverify = await this.page.locator("//b[text()='Status']/following-sibling::span").allTextContents();
        console.log('Status texts:', textverify);
        const isComplete = textverify.some(status =>
            status.split(',').map(s => s.trim()).includes("Completed")
        );
        if (isComplete) {
            console.log('Status is Completed:', textverify);
        } else {
            console.log('Status not completed, reapplying filters...');

            await this.clickFilter();
            await this.selectDeliveryType();
            await this.selectStatus(statusType);
            await this.clickApply(statusType);
        }
    }


    async entersearchField(data: string) {
        await this.type(this.selectors.searchField, "Search Field", data);
        await this.wait('mediumWait')
        await this.validateElementVisibility(this.selectors.searchResult, "Course Option")
        await this.mouseHover(this.selectors.searchResult, "Course Option")
        await this.click(this.selectors.searchResult, "Course", "Option")
    }

    async clickEnrollmentIcon(data: string) {
        await this.click(this.selectors.enrollmentIcon(data), "Enrollments", "Icon")
    }
      async clickClassList() {
        await this.wait("minWait");
        await this.click(this.selectors.classlist, "Instructor Filter", "Field");
    }
    async clickApplyButton() {
        await this.click(this.selectors.applyButton, "Apply", "Button");
        await this.wait('minWait');
    }




}    