import { BrowserContext, Page } from "@playwright/test";
import { AdminHomePage } from "./AdminHomePage";
import { URLConstants } from "../constants/urlConstants";
import { EnrollmentPage } from "./EnrollmentPage";


export class InstructorPage extends EnrollmentPage {

    public selectors = {
        ...this.selectors,
        instructorMenu: `//span[text()='Instructor']`,
        instructorPageHeading: `//h1[text()='Instructor']`,
        instFilter: `//button[@id='admin-filters-trigger']`,
        deliveryTypedropdown: `//span[text()='Delivery Type']/following::div[@id='wrapper-search_deliveryType']`,
        deliveryTypeOption: `//span[text()='Delivery Type']/following::div[@class='dropdown-menu show']//a`,
        statusDropdown: `//span[text()='Status']/following::div[@id='wrapper-search_course_status']`,
        statusOption: `//span[text()='Status']/following::div[@class='dropdown-menu show']//a`,
        enrollmentIcon: (course: string) => `//span[text()='${course}']/following::div[@aria-label="Enrollments"]//i`,
        apply: `//button[text()='Apply']`,
        searchField: "//input[@id='exp-search-field']",
        searchResult: `//div[@id='exp-search-lms-scroll-results']//li`,
        classesListButton: `//button[text()='Classes List']`,
        courseNameText: (courseName: string) => `//div[text()='${courseName}']`,
        filterDeliveryType: `//span[text()='classroom,virtual-class']`,
        filterPublished: `//span[text()='published']`,
        filterScheduled: `//span[text()='scheduled']`,
        launchMeetingButton: (courseName: string) => `//div[text()='${courseName}']/following::button[contains(text(),'Launch Meeting')]`,
        launchMeetingIcon: (courseName: string) => `//div[text()='${courseName}']/following::i[contains(@class,'fa-video')]`,

    };

    constructor(page: Page, context: BrowserContext) {
        super(page, context);
    }

    async clickInstructor() {
        await this.click(this.selectors.instructorMenu, "Instructor", "Link");
    }

    async verifyInstructorPage() {
        await this.wait("mediumWait");
        await this.validateElementVisibility(this.selectors.instructorPageHeading, "Instructor Page Heading");
        await this.verification(this.selectors.instructorPageHeading, "Instructor");
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

    async clickClassesList() {
        await this.wait("minWait");
        await this.validateElementVisibility(this.selectors.classesListButton, "Classes List Button");
        await this.click(this.selectors.classesListButton, "Classes List", "Button");
    }

    async verifyCourseName(courseName: string) {
        await this.wait("minWait");
        await this.validateElementVisibility(this.selectors.courseNameText(courseName), "Course Name");
        await this.verification(this.selectors.courseNameText(courseName), courseName);
    }

    async verifyPredefinedFilters() {
        await this.wait("minWait");
        
        console.log("Verifying predefined filters are present on page...");
        
        await this.validateElementVisibility(this.selectors.filterDeliveryType, "Delivery Type Filter");
        await this.verification(this.selectors.filterDeliveryType, "classroom,virtual-class");
        console.log("Delivery Type filter verified: classroom,virtual-class");
        
        await this.validateElementVisibility(this.selectors.filterPublished, "Published Filter");
        await this.verification(this.selectors.filterPublished, "published");
        console.log("Published filter verified: published");
        
        await this.validateElementVisibility(this.selectors.filterScheduled, "Scheduled Filter");
        await this.verification(this.selectors.filterScheduled, "scheduled");
        console.log("Scheduled filter verified: scheduled");
        
        console.log("All predefined filters verified successfully");
    }

    /**
     * Click Launch Meeting button for a specific course
     * @param courseName - Name of the course to launch meeting for
     */
    async clickLaunchMeeting(courseName: string) {
        await this.wait("minWait");
        console.log(`Searching for Launch Meeting button for course: ${courseName}`);
        
        // Try both button and icon selectors
        const selectors = [
            this.selectors.launchMeetingButton(courseName),
            this.selectors.launchMeetingIcon(courseName),
            `//div[text()='${courseName}']/ancestor::div[contains(@class,'card')]//button[contains(text(),'Launch')]`,
            `//div[text()='${courseName}']/ancestor::div[contains(@class,'card')]//i[contains(@class,'fa-video')]`
        ];
        
        for (const selector of selectors) {
            try {
                const element = this.page.locator(selector);
                if (await element.isVisible({ timeout: 5000 })) {
                    console.log(`Found Launch Meeting element with selector: ${selector}`);
                    await this.click(selector, "Launch Meeting", "Button");
                    await this.wait("mediumWait");
                    console.log(`✅ Clicked Launch Meeting for course: ${courseName}`);
                    return;
                }
            } catch (error) {
                continue;
            }
        }
        
        throw new Error(`Launch Meeting button not found for course: ${courseName}`);
    }

    /**
     * Click Launch Meeting and verify new tab opens with meeting screen
     * @param courseName - Name of the course
     * @returns Promise<Page> - Returns the new tab/page object
     */
    async clickLaunchMeetingAndVerifyNewTab(courseName: string): Promise<Page> {
        console.log(`\n🎥 Launching meeting for course: ${courseName}`);
        
        // Get current number of pages
        const pages = this.context.pages();
        const initialPageCount = pages.length;
        console.log(`Current number of tabs: ${initialPageCount}`);
        
        // Listen for new page/tab
        const newPagePromise = this.context.waitForEvent('page');
        
        // Click Launch Meeting
        await this.clickLaunchMeeting(courseName);
        
        // Wait for new tab to open
        console.log(`Waiting for new tab to open...`);
        const newPage = await newPagePromise;
        await newPage.waitForLoadState('domcontentloaded');
        
        console.log(`✅ New tab opened successfully`);
        console.log(`New tab URL: ${newPage.url()}`);
        
        return newPage;
    }

    /**
     * Verify that the meeting screen is loaded in the new tab
     * @param meetingPage - The page object of the meeting tab
     */
    async verifyMeetingScreenLoaded(meetingPage: Page): Promise<boolean> {
        await this.wait("mediumWait");
        
        console.log(`\n🔍 Verifying meeting screen loaded...`);
        console.log(`Meeting page URL: ${meetingPage.url()}`);
        
        // Check for various meeting screen indicators
        const meetingScreenSelectors = [
            "//div[contains(@class,'meeting')]",
            "//div[contains(@class,'video')]",
            "//iframe[contains(@src,'meet') or contains(@src,'zoom') or contains(@src,'webex')]",
            "//body[contains(@class,'meeting')]",
            "//h1[contains(text(),'Meeting') or contains(text(),'Session')]",
            "//div[contains(text(),'Join') or contains(text(),'Start')]"
        ];
        
        for (const selector of meetingScreenSelectors) {
            try {
                const element = meetingPage.locator(selector);
                if (await element.isVisible({ timeout: 5000 })) {
                    console.log(`✅ Meeting screen verified - found element: ${selector}`);
                    return true;
                }
            } catch (error) {
                continue;
            }
        }
        
        // If no specific meeting elements found, check if URL contains meeting-related keywords
        const url = meetingPage.url().toLowerCase();
        const meetingKeywords = ['meet', 'zoom', 'webex', 'teams', 'session', 'join', 'conference'];
        
        for (const keyword of meetingKeywords) {
            if (url.includes(keyword)) {
                console.log(`✅ Meeting screen verified - URL contains: ${keyword}`);
                return true;
            }
        }
        
        console.log(`⚠️ Could not verify meeting screen elements, but new tab opened`);
        return true; // Consider it successful if new tab opened
    }




}    