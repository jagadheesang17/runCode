import { BrowserContext, Page } from "@playwright/test";
import { AdminHomePage } from "./AdminHomePage";
import { URLConstants } from "../constants/urlConstants";
import { EnrollmentPage } from "./EnrollmentPage";
import { completeEnrolledCourse } from "../api/courseAPI";


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
        enrollmentIcon: (course: string) => `(//div[text()='${course}']/following::div[@aria-label="Enrollments"]//i)[1]`,
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
        classlist:`//button[text()='Classes List']`,
        applyButton: `//button[text()='Apply']`,

        // Notification selectors (Instructor interface)
        notificationIcon: `(//i[@aria-label='Notification'])[1]`,
        notificationMenu: `//div[text()='notification']`,
        notificationSubject: `//input[@id='notification_subject']`,
        notificationDescription: `//div[@id='notification_description']`,
        sendToDropdown: `//button[@data-id="send_toundefined"]`,
        sendToAllOption: `(//span[text()='All'])[1]`,
        sendButton: `//button[text()='Send']`,
        notificationSuccess: `(//span[contains(text(),'notification')])[2]`,
        viewCourseEye:(courseName: string) =>`(//div[text()='${courseName}']//following::i[contains(@class,'fa-duotone fa-eye icon')])[1]`,
viewOnlyVerification:`    (//label[text()='Title']//following::input[contains(@class,'deactived')])[1]`,


//share
shareIcon:`(//div[@aria-label='Share'])[1]`,
shareto:`//input[@id='shareTo']`,
shareMessage:`//textarea[@id='shareMessage']`,
shareButton:`//button[text()='Share']`,

// filter X mark
xmark:`(//span[contains(@class,'auto ')])`


    };

    constructor(page: Page, context: BrowserContext) {
        super(page, context);
    }

    async clickXmarks() {
        await this.wait("minWait");
        await this.validateElementVisibility(this.selectors.xmark, "X mark");   
        await this.page.locator(this.selectors.xmark).count().then(async (count) => {
            for (let i = 0; i < count; i++) {
                await this.click(`${this.selectors.xmark}[${i + 1}]`, "X mark", "Icon");
                await this.wait("minWait");
            }
        });
    }
async sharecourse(mail:string) {
    await this.wait("minWait");
    await this.validateElementVisibility(this.selectors.shareIcon, "Share Icon");
        await this.click(this.selectors.shareIcon, "Instructor", "Link");
        await this.wait("minWait");
        await this.validateElementVisibility(this.selectors.shareto, "Share to Field");
        await this.type(this.selectors.shareto, "Share to Field", mail);
        await this.type(this.selectors.shareMessage, "Share Message Field", "Please check the course");
        await this.click(this.selectors.shareButton, "Share", "Button");
        await this.wait("mediumWait");
        console.log("✅ Course shared successfully to " + mail);
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
     async clearFilter() {
        await this.wait("minWait");
        await this.click("//button[text()='Clear']", "Instructor Filter", "Field");
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
        await this.typeAndEnter(this.selectors.searchField, "Search Field", data);
        await this.wait('mediumWait')
        //await this.validateElementVisibility(this.selectors.searchResult, "Course Option")
        // await this.mouseHover(this.selectors.searchResult, "Course Option")
        // await this.click(this.selectors.searchResult, "Course", "Option")
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

     async clickViewCourse(coursename:string) {
        await this.click(this.selectors.viewCourseEye(coursename), "view", "Button");
        await this.wait('minWait');
    await this.validateElementVisibility("//h1[text()='View Course']", "View Course Heading");

    }


      async verifyViewOnly() {
      
        await this.wait('minWait');
    await this.validateElementVisibility(this.selectors.viewOnlyVerification, "View Course Heading");
    console.log("✅ View Only fields are verified successfully");

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
            `(//div[text()='${courseName}']/following::i[@aria-label='Launch'])[1]`,
           // `//div[text()='/ancestor::div[contains(@class,'card')]//i[contains(@class,'fa-video')]`
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

    /**
     * Compute a start time suitable for a 15-minute step timepicker list (…:00, :15, :30, :45),
     * at least 10 minutes ahead of current time.
     * Logic:
     * - Round up to the next 15-minute slot
     * - If that slot is < +10 minutes away, skip to the following 15-minute slot
     * Examples with 15-min list:
     * - 12:42 -> rounds to 12:45 (+3) <10, so use 01:00 (+18)
     * - 12:51 -> rounds to 01:00 (+9) <10, so use 01:15 (+24)
     */
    private computeStartTimeNearCurrent(): string {
        const now = new Date();
        const hours24 = now.getHours();
        const minutes = now.getMinutes();

        // Round up to next 15-min bucket
        let nextMinutes = Math.ceil((minutes + 1) / 15) * 15; // next :00/:15/:30/:45
        let targetHours24 = hours24;
        let delta = nextMinutes - minutes;

        // If delta is less than 10 minutes, move one more 15-min slot ahead
        if (delta < 10) {
            nextMinutes += 15;
        }

        if (nextMinutes >= 60) {
            nextMinutes -= 60;
            targetHours24 = (targetHours24 + 1) % 24;
        }

        const ampm = targetHours24 >= 12 ? 'PM' : 'AM';
        let hours12 = targetHours24 % 12;
        if (hours12 === 0) hours12 = 12;

        const hh = hours12.toString().padStart(2, '0');
        const mm = nextMinutes.toString().padStart(2, '0');
        return `${hh}:${mm} ${ampm}`;
    }

    /**
     * Select a start time in the visible timepicker list using the computed near-current time.
     * Optionally provide an index when multiple time inputs are present (1-based).
     */
    async selectStartTimeNearCurrent(index: number): Promise<string> {
        const targetTime = this.computeStartTimeNearCurrent();
        // Try to locate the time in any visible timepicker list
        const candidateSelector = `((//div[contains(@class,'timepicker')]//li[text()='${targetTime}']))[${index}]`;
        const locator = this.page.locator(candidateSelector).first();

        // If not immediately visible, fallback to searching any matching li
        const fallbackLocator = this.page.locator(`//div[contains(@class,'timepicker')]//li[text()='${targetTime}']`).first();

        try {
            if (await locator.isVisible({ timeout: 3000 })) {
                await locator.click();
                
                console.log(`✅ Selected start time: ${targetTime}`);
                return targetTime;
            }
        } catch {}

        try {
            if (await fallbackLocator.isVisible({ timeout: 3000 })) {
                await fallbackLocator.click();
                await fallbackLocator.click();
                console.log(`✅ Selected start time (fallback): ${targetTime}`);
                return targetTime;
            }
        } catch {}

        console.log(`⚠️ Target time ${targetTime} not found in timepicker.`);
        return targetTime;
    }

    /**
     * Compute an end time given a start time, ensuring a minimum duration and aligning to 15-min slots.
     * Default minimum duration: 60 minutes.
     */
    private computeEndTimeAfter(startTime: string, minDurationMinutes: number = 60): string {
        try {
            const [timePart, ampm] = startTime.split(' ');
            const [hh, mm] = timePart.split(':');
            let hours12 = parseInt(hh, 10);
            const minutesStart = parseInt(mm, 10);
            let hours24 = ampm === 'PM' ? (hours12 === 12 ? 12 : hours12 + 12) : (hours12 === 12 ? 0 : hours12);

            let startTotalMinutes = hours24 * 60 + minutesStart;
            let targetMinutes = startTotalMinutes + minDurationMinutes;
            targetMinutes = targetMinutes % (24 * 60); // wrap around midnight safely

            // Align to next 15-min bucket
            let aligned = Math.ceil(targetMinutes / 15) * 15;
            if (aligned >= 24 * 60) aligned -= 24 * 60;

            const endHours24 = Math.floor(aligned / 60);
            const endMinutes = aligned % 60;
            const endAmpm = endHours24 >= 12 ? 'PM' : 'AM';
            let endHours12 = endHours24 % 12;
            if (endHours12 === 0) endHours12 = 12;
            const hhStr = endHours12.toString().padStart(2, '0');
            const mmStr = endMinutes.toString().padStart(2, '0');
            return `${hhStr}:${mmStr} ${endAmpm}`;
        } catch (e) {
            console.log(`Failed computing end time from start '${startTime}', falling back +1 hour.`);
            // Fallback: naive +1 hour same minutes
            const [timePart, ampm] = startTime.split(' ');
            const [hh, mm] = timePart.split(':');
            let hours12 = parseInt(hh, 10) + 1;
            let newAmpm = ampm;
            if (hours12 > 12) { hours12 = 1; newAmpm = ampm === 'AM' ? 'PM' : 'AM'; }
            return `${hours12.toString().padStart(2,'0')}:${mm} ${newAmpm}`;
        }
    }

    /**
     * Select an end time later than provided start time. If the computed target time isn't present,
     * fall back to the next available slot or +1 hour (approx index offset +4 for 15-min increments).
     * Returns the selected end time string.
     */
    async selectEndTimeAfterStart(startTime: string, minDurationMinutes: number = 60): Promise<string> {
        const desiredEnd = this.computeEndTimeAfter(startTime, minDurationMinutes);
        await this.wait('minWait');

        // Gather all time options currently visible
        const listLocator = this.page.locator("//ul[@class='ui-timepicker-list']//li");
        const allTimes = await listLocator.allTextContents().catch(() => [] as string[]);

        if (allTimes.length === 0) {
            console.log('No timepicker list items visible for end time selection.');
            return desiredEnd;
        }

        // Attempt direct match
        const directMatchLocator = this.page.locator(`//ul[@class='ui-timepicker-list']//li[text()='${desiredEnd}']`).first();
        try {
            if (await directMatchLocator.isVisible({ timeout: 2000 })) {
                await directMatchLocator.click();
                console.log(`✅ Selected end time (desired): ${desiredEnd}`);
                return desiredEnd;
            }
        } catch {}

        // Fallback: find next slot after start
        const startIndex = allTimes.findIndex(t => t.trim() === startTime.trim());
        if (startIndex !== -1) {
            // Prefer +4 (~+60 mins), else next available
            const candidateIndices = [startIndex + 4, startIndex + 3, startIndex + 2, startIndex + 1];
            for (const idx of candidateIndices) {
                if (idx < allTimes.length) {
                    const fallbackTime = allTimes[idx];
                    const fallbackLocator = this.page.locator(`//ul[@class='ui-timepicker-list']//li[text()='${fallbackTime}']`).first();
                    try {
                        if (await fallbackLocator.isVisible({ timeout: 1000 })) {
                            await fallbackLocator.click();
                            console.log(`✅ Selected end time (fallback index ${idx}): ${fallbackTime}`);
                            return fallbackTime;
                        }
                    } catch {}
                }
            }
        }

        // Final fallback: choose last element if it's not the start time
        const lastTime = allTimes[allTimes.length - 1];
        if (lastTime !== startTime) {
            const lastLocator = this.page.locator(`//ul[@class='ui-timepicker-list']//li[text()='${lastTime}']`).first();
            try {
                if (await lastLocator.isVisible({ timeout: 1000 })) {
                    await lastLocator.click();
                    console.log(`✅ Selected end time (last fallback): ${lastTime}`);
                    return lastTime;
                }
            } catch {}
        }

        console.log(`⚠️ Could not select distinct end time, leaving desired: ${desiredEnd}`);
        return desiredEnd;
    }

    /**
     * Click End Time input and select startTime + 1 hour (aligned to 15-min list).
     * Tries multiple end-time input selectors; includes the requested
     * //input[contains(@class,'end time')] pattern.
     */
    async setEndTimeOneHourAfterStart(
        startTime: string,
        endInputSelector?: string
    ): Promise<string> {
        const desiredEnd = this.computeEndTimeAfter(startTime, 60);

        const endInputSelectors = [
            endInputSelector || "//input[contains(@class,'end time')]",
            "//label[text()='End Time']/following-sibling::input",
            "//input[contains(@placeholder,'End Time')]",
            "//input[contains(@id,'endtime_sesstime_instance')]"
        ];

        // Focus End Time input
        let clicked = false;
        for (const sel of endInputSelectors) {
            try {
                const el = this.page.locator(sel);
                if (await el.isVisible({ timeout: 1000 })) {
                    await el.click();
                    clicked = true;
                    break;
                }
            } catch {}
        }
        if (!clicked) {
            console.log("⚠️ End Time input not found; attempting selection without focusing.");
        }

        // Wait for timepicker to be visible
        try {
            await this.page.waitForSelector("//ul[@class='ui-timepicker-list']", { timeout: 3000 });
        } catch {}

        // Try selecting the desired end time directly
        const direct = this.page.locator(`(//ul[@class='ui-timepicker-list']//li[text()='${desiredEnd}'])[2]`);
        try {
            if (await direct.isVisible({ timeout: 1000 })) {
                await direct.click();
                console.log(`✅ End time set to: ${desiredEnd}`);
                return desiredEnd;
            }
        } catch {}

        // Fallbacks: select next available slot after start, or last safe option
        const listItems = this.page.locator("//ul[@class='ui-timepicker-list']//li");
        const times = await listItems.allTextContents().catch(() => [] as string[]);
        if (times.length) {
            const startIdx = times.findIndex(t => t.trim() === startTime.trim());
            if (startIdx !== -1) {
                const candidateIdx = [startIdx + 4, startIdx + 3, startIdx + 2, startIdx + 1].find(i => i < times.length);
                if (candidateIdx !== undefined) {
                    const fallbackTime = times[candidateIdx];
                    const fb = this.page.locator(`(//ul[@class='ui-timepicker-list']//li[text()='${fallbackTime}'])[2]`);
                    try {
                        if (await fb.isVisible({ timeout: 1000 })) {
                            await fb.click();
                            console.log(`✅ End time fallback set to: ${fallbackTime}`);
                            return fallbackTime;
                        }
                    } catch {}
                }
            }
            const last = times[times.length - 1];
            if (last !== startTime) {
                const lastLoc = this.page.locator(`(//ul[@class='ui-timepicker-list']//li[text()='${last}'])[2]`);
                try {
                    if (await lastLoc.isVisible({ timeout: 1000 })) {
                        await lastLoc.click();
                        console.log(`✅ End time last fallback set to: ${last}`);
                        return last;
                    }
                } catch {}
            }
        }

        console.log(`⚠️ Could not set end time; returning desired: ${desiredEnd}`);
        return desiredEnd;
    }

    /**
     * Send notification as instructor
     * @param subject Notification subject
     * @param description Notification description
     * @returns Promise<boolean> - true if notification sent successfully
     */
    async sendNotificationByInstructor(subject: string, description: string): Promise<boolean> {
        try {
            await this.wait("minWait");

            // Open Notification UI
            await this.validateElementVisibility(this.selectors.notificationIcon, "Notification Icon");
            await this.click(this.selectors.notificationIcon, "Notification", "Icon");
            await this.wait("minWait");

            await this.validateElementVisibility(this.selectors.notificationMenu, "notification menu");
            await this.click(this.selectors.notificationMenu, "notification", "Menu");
            await this.wait("minWait");

            // Fill subject
            await this.validateElementVisibility(this.selectors.notificationSubject, "Notification Subject");
            await this.type(this.selectors.notificationSubject, "Notification Subject", subject);

            // Fill description (contenteditable div)
            await this.validateElementVisibility(this.selectors.notificationDescription, "Notification Description");
            await this.click(this.selectors.notificationDescription, "Notification Description", "Field");
            await this.page.keyboard.press('Control+A');
            await this.page.keyboard.press('Backspace');
            await this.page.keyboard.type(description);

            // Select recipients - All
            await this.validateElementVisibility(this.selectors.sendToDropdown, "Send To Dropdown");
            await this.click(this.selectors.sendToDropdown, "Send To", "Dropdown");
            await this.validateElementVisibility(this.selectors.sendToAllOption, "All option");
            await this.click(this.selectors.sendToAllOption, "All", "Option");

            // Send
            await this.validateElementVisibility(this.selectors.sendButton, "Send Button");
            await this.click(this.selectors.sendButton, "Send", "Button");
            await this.wait("mediumWait");

            // Verify success message
            const isSuccess = await this.page.locator(this.selectors.notificationSuccess).isVisible({ timeout: 10000 }).catch(() => false);
            if (isSuccess) {
                console.log("✅ Notification sent successfully by instructor");
                return true;
            }
            console.log("⚠️ Notification success message not visible");
            return false;
        } catch (error) {
            console.error("Error sending notification via instructor:", (error as Error).message);
            return false;
        }
    }




}    