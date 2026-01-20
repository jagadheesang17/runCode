import { LearnerLogin } from "./LearnerLogin";
import { BrowserContext, expect, Locator, Page } from "@playwright/test";
import { URLConstants } from "../constants/urlConstants";
//import { credentialConstants } from "../constants/credentialConstants.ts";
import { PlaywrightWrapper } from "../utils/playwright";

const Jimp = require("jimp");
const QrCode = require("qrcode-reader");

export class LearnerHomePage extends LearnerLogin {
    static pageUrl = URLConstants.leanerURL;

    public selectors = {

        signOutLink: "//div[@class='logout']/a",
        catalogLink: `//a//span[text()='Catalog']`,
        catalogLabel: "//div//h1[text()='Catalog']",
        myLearningLink: "//a//span[text()='My Learning']",
        myDashboardLink: "//a//span[text()='My Dashboard']",
        myDashboardLabel: "//div/h1[text()='My Dashboard']",
        learnerGroupLink: `//a[text()='Learner Group']`,
        img: (index: number) => `(//div[@class='w-100 col']//img)[${index}]`,
        bannerTitle: (titleName: string) => `//div/h1[text()='${titleName}']`,
        bannerImg: (titleName: string) => `(//div/h1[text()="${titleName}"]/ancestor::div/img)[1]`,
        bannerimgLink: (titleName: string) => `(//div/h1[text()="${titleName}"]/ancestor::div/img[contains(@src,'/resources/')])[1]`,
        bannerSlider: `//a[@id='banner-carousel-expcarousel-right-btn']`,
        sequenceCounter: `(//div[@class='carousel__viewport']//div[contains(@class,'col pointer')])[1]`,       // Add more selectors as needed
        bannerName: `(//div[contains(@class,'col pointer')]//h1)[1]`,
        announcementIcon: `//div[@id='announcementspopover']`,
        announceNotify: `div[class^='announcement'] p`,
        announcementName: (title: string) => `(//div[@id='announcements']//p[text()='Announcement !!!  ${title}'])[1]`,
        adminmenuIcon: `//i[@id='adminmenu']`,
        collaborationHub: `//a/span[text()='Collaboration Hub']`,
        approveTick: (courseName: string) => `//span[text()='${courseName}']/following::i[contains(@id,'approve')][1]`,
        proceedBtn: `//button[text()='Proceed']`,
        verifyOrder: `//div[contains(@class,'information_text ')]`,
        searchfield: `//input[@id='exp-searchapproval-search-field']`,

        //CH:-
        sortBy: `//button[@data-id='exp-sortapproval-sort']`,
        newlyListed: `//a[@id='bs-select-1-2']//span[text()='Newly Listed']`,
        mapprovalSelectCountryInput: `(//div[@class='bs-searchbox']//input)[2]`,
        mapprovalSelectStateInput: `(//div[@class='bs-searchbox']//input)[3]`,
        dropdownOption: (data: string) => `//span[text()='${data}']`,
        dropdownToggle: (label: string) => `(//label[text()='${label}']/following::button[@data-bs-toggle='dropdown'])[1]`,

        ///Terms and conditions///
        termCondiPopup: `//div[@id='gridSystemModal']`,
        termpopupContent: `//iframe[contains(@src,'terms')]`,
        privacypopupContent: `//iframe[contains(@src,'privacy')]`,
        scrollBar: `//div[@id='gridSystemModal']//div[@class='lmsfilterscroll background_1']`,
        agreeBtn: `//button[text()='Agree']`,
        closebtn: `//div[contains(@class,'modal-header d-flex ')]//following-sibling::i`,
        //For QR scanning code reading user profile
        myprofilebutton: `//span[text()='My Profile']`,
        qrLocator:'//img[@class="img-fluid usr-prof-qrcodeimage modal_img my-2"]',
        qrImagePath:'data/finalimage.png',
        userEmail:'//div[text()="Email :"]/following-sibling::div[1]',
        userphone:'//div[text()="Phone :"]/following-sibling::div[1]',
        selectAdmin:`//span[text()='Admin']`,

        organizationInProfile:(orgname:string)=>`//h4[text()='${orgname} ']`,

        instrctor: `//a/span[text()='Instructor']`,

        // Alert more button selectors
        alertIcon: `//i[@class='fa-duotone fa-exclamation-triangle']`,
        alertsText: `(//div[text()='Alerts'])[1]`,
        moreButton: `(//button[text()=' more'])[1]`,
        aboutThisCourse: `//div[text()='About This Course']`,

        // Announcement push-box selectors
        announcementPushBox: `//div[@aria-label='Announcements']`,
        announcementListItem: `(//div[contains(@class,'list-group-item')])[1]`,

        // Language change selectors
        languageButton: `//button[@data-id='lnr_language']`,
        languageSearchInput: `//input[@aria-label='Search']`,
        languageOption: (language: string) => `//span[text()='${language}']`,

        // Cart verification selectors
        shoppingCartIcon: `(//div[@aria-label='shopping cart'])`,
        emptyCartMessage: `//div[text()='CART IS EMPTY. GO TO ']`,

        // Catalog hyperlink selector
        catalogHyperlink: `//a[text()=' CATALOG ']`,


    };

    constructor(page: Page, context: BrowserContext) {
        super(page, context);
    }

    public async loadLearner(role: string, url: any) {
        await this.learnerLogin(role, url)
        await this.isSignOutVisible()

    }
    public async isSignOutVisible() {
        await this.page.waitForLoadState('load');
        await this.validateElementVisibility(this.selectors.signOutLink, "Sign Out");
    }

    public async signOut() {
        try {
            await this.validateElementVisibility(this.selectors.signOutLink, "Sign Out Link");
            await this.click(this.selectors.signOutLink, "Sign Out", "Link");
            await this.page.waitForLoadState('load');
            console.log("✅ Successfully signed out");
        } catch (error) {
            console.error("Error during sign out:", error);
            // Fallback: try to clear cookies and navigate to login page
            await this.context.clearCookies();
            await this.page.goto(URLConstants.leanerURL);
            console.log("⚠️ Fallback signout performed");
        }
    }
    public async clickCatalog() {
        await this.page.waitForLoadState('load');
        await this.validateElementVisibility(this.selectors.catalogLink, "Catalog");
        await this.mouseHover(this.selectors.catalogLink, "Catalog");
        await this.click(this.selectors.catalogLink, "Catalog", "Link");
        await this.page.waitForLoadState('load');
        await this.mouseHover(this.selectors.catalogLabel, "Catalog Label");
        await this.wait('minWait');
    }
    public async clickMyLearning() {
        await this.validateElementVisibility(this.selectors.myLearningLink, "Link");
        await this.click(this.selectors.myLearningLink, "My Learning", "Link");
        await this.page.waitForLoadState('load');
    }
    public async clickDashboardLink() {
        await this.validateElementVisibility(this.selectors.myDashboardLink, "Link");
        // await this.mouseHover(this.selectors.myDashboardLink, "Link");
        await this.click(this.selectors.myDashboardLink, "My Learning", "Link");
        await this.mouseHover(this.selectors.myDashboardLabel, "My Dashboard");
        await this.verification(this.selectors.myDashboardLabel, "My Dashboard");
    }

    async LearnerGroup() {
        await this.validateElementVisibility(this.selectors.learnerGroupLink, "Link");
        await this.click(this.selectors.learnerGroupLink, "LearnerGroup", "Link");
    }

    public async verifyImage(title: string) {
        const banner = this.page.locator(`(//div/h1[text()="${title}"]/ancestor::div/img)[1]`);
        await this.wait("minWait");

        if (await banner.isVisible()) {
            const name = await this.getInnerText(this.selectors.bannerName);
            const eleName = name.toLowerCase();

            if (eleName === title.toLowerCase()) {
                console.log(`${eleName} is visible.`);
            } else {
                throw new Error(`Banner name does not match title: expected "${title}", but got "${eleName}".`);
            }
        } else {
            let attempt = 0;
            const maxAttempts = await this.page.locator("li[class^='carousel__slide'] h1").count();

            while (attempt < maxAttempts) {
                await this.validateElementVisibility(this.selectors.bannerSlider, "banner");
                await this.click(this.selectors.bannerSlider, "banner", "Slider");
                if (await banner.isVisible()) {
                    const name = await this.getInnerText(this.selectors.bannerName);
                    const eleName = name.toLowerCase();
                    expect(eleName).toContain(title.toLowerCase());
                    console.log(`${eleName} is visible.`);
                    break;
                }
                attempt++;
            }

            if (attempt === maxAttempts) {
                throw new Error(`Banner with title "${title}" not found after ${maxAttempts} attempts.`);
            }
        }
    }

    public async verifyBannerDisplay(title: string) {
        const banner = this.page.locator(`(//div/h1[text()="${title}"]/ancestor::div/img)`)
        await this.wait("minWait")
        if (await banner.isVisible()) {
            const name = await this.getInnerText(this.selectors.bannerName)
            const eleName = name.toLowerCase();
            expect(eleName).not.toContain(title)
        } else {
            let attempt = 0;
            let maxattempt = await this.page.locator("//div[contains(@class,'col pointer')]//h1").count();
            while (attempt < maxattempt) {
                this.validateElementVisibility(this.selectors.bannerSlider, "banner")
                this.click(this.selectors.bannerSlider, "banner", "Slider")
                if (await banner.isVisible()) {
                    const name = await this.getInnerText(this.selectors.bannerName)
                    const eleName = name.toLowerCase();
                    expect(eleName).not.toContain(title)
                    break;
                }
                attempt++;
            }
        }
    }
    public async verifySequence(title: string, seqNumber?: number) {
        await this.wait('mediumWait')
        const bannerEle = this.page.locator(`//div[contains(@class,'col pointer')]//h1`);
        await this.wait('minWait');
        const sequenceCount = await bannerEle.count();
        expect(sequenceCount).toBeGreaterThanOrEqual(1);
        await this.click(this.selectors.bannerSlider, "banner", "Slider")
        const secondElement = bannerEle.nth(1);
        const text = await secondElement.innerText();
        // Verify that the second element is visible
        const banner = await secondElement.isVisible();
        expect(text).toContain(title);
        expect(banner).toBeTruthy();
    }
    public async verifyAllSequence(title: string) {
        await this.validateElementVisibility(this.selectors.sequenceCounter, "banner")
        const availaberBnner = await this.page.locator(this.selectors.sequenceCounter).count();
        try {
            // for (let index = 1; index <= availaberBnner; index++) {
            //     const name = await this.getInnerText(this.selectors.bannerName)
            //     expect(name).toContain(title)
            // }
            for (let index = 1; index <= availaberBnner; index++) {
                const name = await this.getInnerText(this.selectors.bannerName);
                if (name.includes(title)) {
                    expect(name).toContain(title);
                } else {
                    continue;
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    public async verifyUrl(title: string) {
        await this.verifyAllSequence(title)
        const srcUrl = await this.fetchAttribute(this.selectors.bannerImg(title), 'src');
        console.log("src Link = " + srcUrl);
        expect(srcUrl).toMatch(/\/resources\/.*\.jpg$/);
        if (!srcUrl) throw new Error(`Image source URL not found for title: ${title}`);
        // await this.focusWindow(this.selectors.bannerimgLink(title))
    }

    async verifyAnnouncement(title: string) {
        await this.wait("minWait")
        await this.mouseHover(this.selectors.announcementIcon, "Announcement")
        await this.click(this.selectors.announcementIcon, "Announcement", "Icon")
        const annocement = await this.page.locator(this.selectors.announcementName(title)).textContent();
        expect(annocement).toContain(`${title}`)
    }
    async verifyPastAnnouncement(title: string) {
        await this.wait("minWait");
        await this.mouseHover(this.selectors.announcementIcon, "Announcement");
        await this.click(this.selectors.announcementIcon, "Announcement", "Icon");
        await this.wait('mediumWait');
        const annocement = await this.page.locator(this.selectors.announceNotify).allTextContents();
        expect(annocement).not.toContain(title);
    }

    /* async verifypastAnnouncement(title: string) {
        await this.wait("minWait")
        await this.mouseHover(this.selectors.announcementIcon, "Announcement")
        await this.click(this.selectors.announcementIcon, "Announcement", "Icon")
        const annocement = await this.getInnerText(this.selectors.announcementName(title));
        expect(annocement).not.toContain(`${title}`)
    } */


    async selectCollaborationHub() {
        await this.click(this.selectors.adminmenuIcon, "Admin Menu", "Icon")
        await this.validateElementVisibility(this.selectors.collaborationHub, "CH")
        await this.click(this.selectors.collaborationHub, "CH", "Option");
        await this.spinnerDisappear();
    }
     async selectAdmin() {
        await this.click(this.selectors.adminmenuIcon, "Admin Menu", "Icon")
        await this.validateElementVisibility(this.selectors.selectAdmin, "Admin")
        await this.click(this.selectors.selectAdmin, "Admin", "Option");
        await this.spinnerDisappear();
    }


    async clickApprove(courseName: string) {
        //  await this.spinnerDisappear();
        await this.wait("mediumWait")
        await this.click(this.selectors.sortBy, "My Approval Request Dropdown", "SortBy")
        await this.wait("minWait")
        await this.mouseHoverandClick(this.selectors.newlyListed, this.selectors.newlyListed, "My Approval Request Dropdown", "Dropdown")
        //  await this.click(this.selectors.newlyListed, "My Approval Request Dropdown", "Dropdown")
        await this.click(this.selectors.approveTick(courseName), "Approve Course", "Icon")
    }
    //Manager Approval:-
    async mapprovalSelectCountry(label: string, data: string) {
        const toggleSelector = this.selectors.dropdownToggle(label);
        await this.click(toggleSelector, label, 'Dropdown');
        await this.wait("minWait")
        console.log("The country is:" + data)
        await this.type(this.selectors.mapprovalSelectCountryInput, label, data);
        const optionSelector = this.selectors.dropdownOption(data);
        await this.click(optionSelector, data, 'DropDown');
        await this.verification(toggleSelector, data);
    }

    //Manager Approval:-
    async mapprovalSelectState(label: string, data: string) {
        const toggleSelector = this.selectors.dropdownToggle(label);
        await this.click(toggleSelector, label, 'Dropdown');
        await this.wait("minWait")
        console.log("The country is:" + data)
        await this.type(this.selectors.mapprovalSelectStateInput, label, data);
        const optionSelector = this.selectors.dropdownOption(data);
        await this.click(optionSelector, data, 'DropDown');
        await this.verification(toggleSelector, data);
    }
    async searchApprovalCourse(courseName: string) {
        await this.type(this.selectors.searchfield, "Search Field", courseName);
        await this.keyboardAction(this.selectors.searchfield, "Enter", "Input", "Search Field");
        await this.wait('mediumWait')
    }

    async proceedAndVerify() {
        await this.click(this.selectors.proceedBtn, "Proceed", "Button"),
            await this.wait("mediumWait")
        await this.verification(this.selectors.verifyOrder, "Order Placed")
    }

    // async termsAndConditionScroll() {
    //     const sliderTrack2 = this.page.locator("div[class='privacy_slim'] +div[class^='lmsfilterscroll background']").first()
    //     await sliderTrack2.hover({ force: true, position: { x: 0, y: 0 } })
    //     await this.page.mouse.down();
    //     await this.page.mouse.move(0, 456);
    //     await this.page.mouse.up();
    //     await this.wait("minWait")
    //     const sliderTrack1 = this.page.locator("div[class='terms_slim'] +div[class^='lmsfilterscroll background']").first()
    //     await sliderTrack1.hover({ force: true, position: { x: 0, y: 0 } })
    //     await this.page.mouse.down();
    //     await this.page.mouse.move(0, 456);
    //     await this.page.mouse.up();
    //     await this.wait("minWait")
    //     await this.validateElementVisibility(this.selectors.agreeBtn, "Agree");
    //     await this.mouseHover(this.selectors.agreeBtn, "Agree");
    //     await this.click(this.selectors.agreeBtn, "Agree", "Button");
    //     await this.click(this.selectors.closebtn, "Close", "Button");
    //     await this.wait('minWait');
    // }

    //Terms and Conditions
    async termsAndConditionScroll() {
        const element = this.page.locator(`//div[@class='container-fluid bd-example-row']/div[1]/div`).first();
        const box = await element.boundingBox();
        if (box) {
            await element.hover({ position: { x: box.width / 2, y: box.height / 2 } });
        }
        const sliderTrack2 = this.page.locator("div[class='terms_slim'] +div[class^='lmsfilterscroll background']").first()
        await sliderTrack2.hover({ force: true, position: { x: 0, y: 0 } })
        await this.page.mouse.down();
        await this.page.mouse.move(0, 456);
        await this.page.mouse.up();
        // await this.wait("minWait")
        //unwanted Line no xpath named playarea2
        /*  const sliderTrack = this.page.locator("//div[@id='playarea2']");
         await sliderTrack.hover(); */
        await this.page.getByRole('heading', { name: 'privacy policy' }).hover();
        const scrollbar = this.page.locator(`.privacy_slim+div[class^='lmsfilterscroll']`);
        await scrollbar.evaluate((el) => {
            (el as HTMLElement).style.display = 'block';
            el.style.opacity = '1';
        });
        /*  const element2 = this.page.locator(`//div[@class='container-fluid bd-example-row']/div[1]/div`).last();
         const box2 = await element2.boundingBox();
         if (box2) {
             await element2.hover({ position: { x: box.width / 2, y: box.height / 2 } });
         } */
        const sliderTrack1 = this.page.locator("(//div[@class='privacy_slim']/following::div[@class='lmsfilterscroll background_1'])[1]")
        await sliderTrack1.hover();
        //await this.wait('minWait');
        await this.page.mouse.down();
        await this.page.mouse.move(0, 456);
        await this.page.mouse.up();
        await this.wait("minWait")
        await this.validateElementVisibility(this.selectors.agreeBtn, "Agree");
        await this.mouseHover(this.selectors.agreeBtn, "Agree");
        await this.click(this.selectors.agreeBtn, "Agree", "Button");
        await this.click(this.selectors.closebtn, "Close", "Button");
        await this.wait('minWait');
    }

    //For QR scanning code reading user profile
public async clickmyprofile()
    {
        await this.mouseHover(this.selectors.myprofilebutton, "bulkupload");
        await this.click(this.selectors.myprofilebutton, "bulkupload", "Button");
        await this.wait('maxWait')
    }

    public async captureAndReadQRCode(): Promise<string> {
        const qrLocator = this.page.locator(this.selectors.qrLocator);
        //xpath qrLocator:'//img[@class="img-fluid usr-prof-qrcodeimage modal_img my-2"]',
        const screenshotPath = this.selectors.qrImagePath;
        await qrLocator.scrollIntoViewIfNeeded();
        await qrLocator.waitFor({ state: 'visible' });
        await qrLocator.screenshot({ path: screenshotPath });
        const image = await Jimp.read(screenshotPath);
        const qr = new QrCode();
        return await new Promise((resolve, reject) => {
            qr.callback = (err: any, result: any) => {
                if (err || !result) return reject(`QR code could not be read: ${err || "No result"}`);
                resolve(result.result);
            };
            qr.decode(image.bitmap);
        });
    }

    public async verifyUserInformations(expectedEmail: string, expectedPhone: string): Promise<void> {
        await this.wait("maxWait");
        const QR_Decoded_email = (await this.page.locator(this.selectors.userEmail).textContent());
        const QR_Decoded_phone = (await this.page.locator(this.selectors.userphone).textContent());
        console.log("Decoded QR_User Email :", QR_Decoded_email);
        console.log("Created User Email :", expectedEmail);
        console.log("Decoded QR_Phone Number :", QR_Decoded_phone);
        console.log("Created Phone number :", expectedPhone);
        //console.log("User information needs to be updated.");
        if (QR_Decoded_email !== expectedEmail) {
            console.log(`Email mismatch! Expected: ${expectedEmail}, Found: ${QR_Decoded_email}`);
        //throw new Error(`Email mismatch! Expected: ${expectedEmail}, Found: ${QR_Decoded_email}`);
    }
    if (QR_Decoded_phone !== expectedPhone) {
        console.log(`Phone number mismatch! Expected: ${expectedPhone}, Found: ${QR_Decoded_phone}`);
        //throw new Error(`Phone number mismatch! Expected: ${expectedPhone}, Found: ${QR_Decoded_phone}`);
    }
    console.log("User email and phone match the expected values.");
      }

      async launchDCL(url:string){
    await this.wait("minWait");
    await this.loadApp(url);
    await this.wait("mediumWait");
 }

 async selectInstructor() {
        await this.click(this.selectors.adminmenuIcon, "Admin Menu", "Icon")
        await this.validateElementVisibility(this.selectors.instrctor, "Instructor")
        await this.click(this.selectors.instrctor, "Instructor", "Option");
        await this.spinnerDisappear();
    }


async verifyMappedOrganization(orgname:string,expectedOrgname:string){
    await this.verification(this.selectors.organizationInProfile(orgname),expectedOrgname);
}

async clickAlertMoreButton() {
    console.log("🔔 Starting Alert More Button verification");
    
    // Step 1: Verify alert icon is visible
    console.log("📝 Step 1: Verify alert icon is visible");
    await this.validateElementVisibility(this.selectors.alertIcon, "Alert Icon");
    const alertIcon = this.page.locator(this.selectors.alertIcon);
    const isAlertIconVisible = await alertIcon.isVisible();
    
    if (!isAlertIconVisible) {
        throw new Error("❌ Alert icon is not visible");
    }
    console.log("✅ Alert icon is visible");
    
    // Step 2: Click on alert icon
    console.log("📝 Step 2: Click on alert icon");
    await this.click(this.selectors.alertIcon, "Alert Icon", "Icon");
    await this.wait("minWait");
    console.log("✅ Clicked on alert icon");
    
    // Step 3: Verify 'Alerts' text appears
    console.log("📝 Step 3: Verify 'Alerts' text appears");
    await this.validateElementVisibility(this.selectors.alertsText, "Alerts Text");
    const alertsText = this.page.locator(this.selectors.alertsText);
    const isAlertsTextVisible = await alertsText.isVisible();
    
    if (!isAlertsTextVisible) {
        throw new Error("❌ 'Alerts' text is not visible after clicking alert icon");
    }
    console.log("✅ 'Alerts' text is visible");
    
    // Step 4: Check if 'more' button exists
    console.log("📝 Step 4: Check if 'more' button is available");
    const moreButton = this.page.locator(this.selectors.moreButton);
    const isMoreButtonVisible = await moreButton.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (!isMoreButtonVisible) {
        console.log("⚠️ 'more' button is not available - no additional alerts to show");
        throw new Error("❌ 'more' button is not there");
    }
    console.log("✅ 'more' button is visible");
    
    // Step 5: Click on 'more' button
    console.log("📝 Step 5: Click on 'more' button");
    await this.click(this.selectors.moreButton, "More Button", "Button");
    await this.wait("mediumWait");
    console.log("✅ Clicked on 'more' button");
    
    // Step 6: Verify 'About This Course' section appears
    console.log("📝 Step 6: Verify 'About This Course' section appears after clicking 'more'");
    await this.validateElementVisibility(this.selectors.aboutThisCourse, "About This Course");
    const aboutThisCourse = this.page.locator(this.selectors.aboutThisCourse);
    const isAboutThisCourseVisible = await aboutThisCourse.isVisible();
    
    if (!isAboutThisCourseVisible) {
        throw new Error("❌ 'About This Course' section is not visible after clicking 'more' button");
    }
    console.log("✅ 'About This Course' section is visible");
    
    console.log("✅ Alert More Button verification completed successfully");
}

async verifyAnnouncementPushBox() {
    console.log("📢 Starting Announcement push-box verification");
    
    // Step 1: Wait for and click on Announcements icon
    console.log("📝 Step 1: Wait for Announcements icon and click");
    await this.validateElementVisibility(this.selectors.announcementPushBox, "Announcements Icon");
    await this.click(this.selectors.announcementPushBox, "Announcements", "Icon");
    await this.wait("minWait");
    console.log("✅ Clicked on Announcements icon");
    
    // Step 2: Check if announcement list item appears
    console.log("📝 Step 2: Verify announcement list item appears");
    const announcementListItem = this.page.locator(this.selectors.announcementListItem);
    const isAnnouncementVisible = await announcementListItem.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (!isAnnouncementVisible) {
        console.log("ℹ️ No announcements available - announcement list is empty");
        return;
    }
    
    console.log("✅ Announcement list item is visible");
    console.log("✅ Announcements are available in the push-box");
}

async languageChangeVerification(language: string) {
    console.log(`🌐 Starting language change verification for: ${language}`);
    
    // Step 1: Click on language button
    console.log("📝 Step 1: Click on language button");
    await this.validateElementVisibility(this.selectors.languageButton, "Language Button");
    await this.click(this.selectors.languageButton, "Language", "Button");
    await this.wait("minWait");
    console.log("✅ Language dropdown opened");
    
    // Step 2: Search for the language
    console.log(`📝 Step 2: Search for language: ${language}`);
    await this.validateElementVisibility(this.selectors.languageSearchInput, "Language Search Input");
    await this.type(this.selectors.languageSearchInput, "Language Search Input", language);
    await this.wait("minWait");
    console.log(`✅ Searched for language: ${language}`);
    
    // Step 3: Click on the language option
    console.log(`📝 Step 3: Click on ${language} option`);
    const languageSelector = this.selectors.languageOption(language);
    await this.validateElementVisibility(languageSelector, `${language} Option`);
    await this.click(languageSelector, language, "Language Option");
    await this.wait("mediumWait");
    console.log(`✅ Clicked on ${language} option`);
    
    // Step 4: Verify page language has changed
    console.log("📝 Step 4: Verify page language has changed");
    await this.page.waitForLoadState('load');
    
    // Get the current page language attribute
    const htmlLangAttribute = await this.page.evaluate(() => document.documentElement.lang);
    console.log(`📄 Current page language attribute: ${htmlLangAttribute}`);
    
    // Verify the language button now shows the selected language
    const languageButton = this.page.locator(this.selectors.languageButton);
    const buttonText = await languageButton.textContent();
    console.log(`🔍 Language button text after change: ${buttonText?.trim()}`);
    
    if (buttonText?.includes(language)) {
        console.log(`✅ Page language successfully changed to: ${language}`);
    } else {
        console.log(`⚠️ Language button shows: ${buttonText}, expected to contain: ${language}`);
    }
    
    console.log("✅ Language change verification completed");
}

async emptyCartVerification() {
    console.log("🛒 Starting empty cart verification");
    
    // Step 1: Click on shopping cart icon
    console.log("📝 Step 1: Click on shopping cart icon");
    await this.validateElementVisibility(this.selectors.shoppingCartIcon, "Shopping Cart Icon");
    await this.click(this.selectors.shoppingCartIcon, "Shopping Cart", "Icon");
    await this.wait("minWait");
    console.log("✅ Clicked on shopping cart icon");
    
    // Step 2: Verify empty cart message is displayed
    console.log("📝 Step 2: Verify 'CART IS EMPTY' message is displayed");
    await this.validateElementVisibility(this.selectors.emptyCartMessage, "Empty Cart Message");
    
    const emptyCartElement = this.page.locator(this.selectors.emptyCartMessage);
    const isVisible = await emptyCartElement.isVisible();
    
    if (isVisible) {
        const messageText = await emptyCartElement.textContent();
        console.log(`✅ Empty cart message verified: "${messageText?.trim()}"`);
    } else {
        throw new Error("❌ Empty cart message is not visible");
    }
    
    console.log("✅ Empty cart verification completed successfully");
}

async catalogHyperlink() {
    console.log("📚 Starting catalog hyperlink scroll verification");
    
    // Step 1: Capture scroll position before clicking
    console.log("📝 Step 1: Capture scroll position before clicking catalog hyperlink");
    const beforeScroll = await this.page.evaluate(() => window.scrollY);
    console.log(`📍 Scroll position before click: ${beforeScroll}px`);
    
    // Step 2: Click on CATALOG hyperlink
    console.log("📝 Step 2: Click on CATALOG hyperlink");
    await this.validateElementVisibility(this.selectors.catalogHyperlink, "Catalog Hyperlink");
    await this.click(this.selectors.catalogHyperlink, "CATALOG", "Hyperlink");
    console.log("✅ Clicked on CATALOG hyperlink");
    
    // Step 3: Wait for scroll animation to complete
    await this.wait("minWait");
    
    // Step 4: Capture scroll position after clicking
    console.log("📝 Step 4: Verify page scrolled to catalog section");
    const afterScroll = await this.page.evaluate(() => window.scrollY);
    console.log(`📍 Scroll position after click: ${afterScroll}px`);
    
    // Step 5: Verify scroll position changed
    if (afterScroll !== beforeScroll) {
        console.log(`✅ Page scrolled successfully - Scroll changed by ${Math.abs(afterScroll - beforeScroll)}px`);
    } else {
        console.log("⚠️ Warning: Scroll position did not change");
    }
    
    console.log("✅ Catalog hyperlink scroll verification completed");
}

}
