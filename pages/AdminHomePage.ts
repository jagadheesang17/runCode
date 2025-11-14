import { Page, BrowserContext, expect } from "@playwright/test";
import { PlaywrightWrapper } from "../utils/playwright";
import { URLConstants } from "../constants/urlConstants";
import { AdminLogin } from "./AdminLogin";

export class AdminHomePage extends AdminLogin {
    static pageUrl = URLConstants.adminURL;

    public selectors = {
        signOutLink: "//div[@class='logout']/a",
        dragableMenu: (menu: string) => `//div[text()='${menu}']/following::div[text()="Create"][1]`,
        menu: "//div[text()='Menu']",
        peopleMenu: "//span[text()='People']",
        learningMenu: "//span[text()='Learning']",
        surveyMenu: "//span[text()='Survey']",
        surveyLink: "//a[text()='Survey']",
        courseLink: "//a[text()='Course']",
        instructorLink: "//span[text()='Instructor']",
        createCourseBtn: "//button[text()='CREATE COURSE']",
        userMenu: "//a[text()='User']",
        metadataLibraryMenu: "//span[text()='metadata library']",
        metaPeopleLink: "//a[text()='People']",
        metaLearningLink: "//a[text()='Learning']",
        metaECommerceLink: "//a[text()='E-Commerce']",
        metaGeneralLink: "//a[text()='General']",
        adminGroupLink: "//a[text()='Admin Group']",
        learnerGrouplink: `//a[text()='Learner Group']`,
        locationLink: "//a[text()='Location']",
        commerceMenu: `//span[text()='Commerce']`,
        learningPathLink: "//a[text()='Learning Path']",
        //learningPathLink:"//a[text()='Learning Path']",
        certificationLink: "//a[text()='Certification']",
        completionCertificationLink: "//a[text()='Completion Certificate']",
        //learningPathLink:"//a[text()='Learning Path']",       
        communicationLink: "//span[text()='Communication']",
        bannerMenu: `//a[text()='Banner']`,
        createBannerbutton: `//button[text()='CREATE BANNER']`,
        announcementMenu: `//a[text()='Announcement']`,
        createAnnouncementbutton: `//button[text()='CREATE ANNOUNCEMENT']`,
        contentMenu: `//a[text()='Content']`,
        surveyQuestionsLink: "//span[text()='Survey']//parent::div/following-sibling::ul//a[text()='Questions']",
        //surveyLink:"//span[text()='Survey']//parent::div/following-sibling::ul//a[text()='Survey']",
        assessmentMenu: `//span[text()='Assessment']`,
        assessmentQuestionLink: `//span[text()='Assessment']//parent::div/following-sibling::ul//a[text()='Questions']`,
        assessmentLink: "//a[text()='Assessment']",
        enrollMenu: `//span[text()='Enrollments']`,
        enrollLink: `//a[text()='Enroll']`,

        quickAccessIcon: `#dd-icon-wrapper i`,
        quickAccessDD: `button div:text-is('Select Quick Access Buttons To Add Below')`,
        quickAccessValue: `//div[@class='dropdown-menu show'] //a`,
        tickIcon: `i[aria-label="Click here to save"]`,
        deleteIcon: `//div[contains(@class,'mandatory pointer')]//i`,
        yesBtn: `//button[text()='Yes']`,
        quickAccessModules: `//div[contains(@class,'mandatory')]/following-sibling::div`,
        adminRolemenu: `//a[text()='Admin Role']`,
        siteAdminMenu: `//span[text()='Site Admin']`,
        learnerConfigLink: `//a[text()='Learner Configuration']`,
        siteSettingsLink: `//a[text()='Site Settings']`,
        adminConfigLink: `//a[text()='Admin Configuration']`,
        // To navigate from Enroll option to view/update status course tp:-
        viewUpdateStatusCourseTpLink: `//a[text()='View/update Status - Course/TP']`,
        clickBack: `//i[@id='dismissSidebar']`,
        quickAccessCreate: (menu: string) => `//div[text()='${menu}']//ancestor::div[@class='item-draggable']//div[text()='Create']`,

        //for Direct Content Launch
        directContent: `//a[text()='Direct Content Launch']`,

        hoverOrgFromQuickAccess: (module: string) => `//div[text()='${module}']`,
       

        adminhome: `//span[text()='Admin Home']`,
        clickEditOrganization: (createmodule: string) => `(//div[text()='${createmodule}']/following::div[text()='Edit'])[1]`,
        clickEditIconOfCreatedOrganization: (orgName: string) => `(//div[text()='${orgName}']/following::a[@aria-label='Edit'])[1]`,

        clickCreateOrganization: (createmodule: string) => `(//div[text()='${createmodule}']/following::div[text()='Create'])[1]`,

        
        //meta data library option
        metaLibOption: (data: string) => `//a[text()='${data}']`,
        dynamicShareableLinks: `//a[text()='Dynamic Shareable Links']`,
    
    }
    public async clickLearnerGroupLink() {
        try {
            await this.validateElementVisibility(this.selectors.learnerGrouplink, "Learner Group");
            await this.click(this.selectors.learnerGrouplink, "Learner Group", "Link");
        } catch (error) {
            console.error("Error clicking Learner Group link:", error);
            throw error;
        }
    }
    async editModuleFromQuickAccess(module: string, createmodule: string) {
        await this.mouseHover(this.selectors.hoverOrgFromQuickAccess(module), "module");
        await this.wait("minWait");
        await this.click(this.selectors.clickEditOrganization(createmodule), "Create module", "Button");
 
    }

    constructor(page: Page, context: BrowserContext) {
        super(page, context);
        //this.common(page, context).catch(err => console.error("Error in common setup:", err));
        // this.setupPageListeners();
    }
    //To navigate from Enroll option to view/update status course tp:-
    public async clickviewUpdateStatusCourseTp() {
        await this.click(this.selectors.viewUpdateStatusCourseTpLink, "Update Enrollment", "Link")
    }

    public async createModuleFromQuickAccess(module: string, createmodule: string) {
        await this.mouseHover(this.selectors.hoverOrgFromQuickAccess(module), "module");
        await this.wait("minWait");
        await this.click(this.selectors.clickCreateOrganization(createmodule), "Create module", "Button");

    }
    public async loadAndLogin(role: string) {
        console.log("Loading admin home page...")
        await this.page.goto(AdminLogin.pageUrl);
        await this.adminLogin(role);
        await this.wait("minWait");
        let pageTitle = await this.getTitle();
        console.log("Page Title:", pageTitle);
        if (pageTitle.toLowerCase().includes("signin")) {
            console.log("Sign-in page detected. Performing login...");
            await this.adminLogin(role);
            await this.wait('mediumWait');
            pageTitle = await this.getTitle();
            console.log("Page Title after login:", pageTitle);
        }
    } catch(Error: any) {
        console.error("Error during common setup:", Error);
        throw Error;

    }

    public async singleUserLogin(username: string) {
        console.log("Loading admin home page...");
        await this.context.clearCookies();
        await this.page.goto(AdminLogin.pageUrl);
        await this.singleLogin(username);
        let pageTitle = await this.getTitle();
        console.log("Page Title:", pageTitle);
        if (pageTitle.toLowerCase().includes("signin")) {
            console.log("Sign-in page detected. Performing login...");
            await this.singleLogin(username);
            await this.wait('mediumWait');
            pageTitle = await this.getTitle();
            console.log("Page Title after login:", pageTitle);
        }
    }

    async clickAdminHome() {
        await this.click(this.selectors.adminhome, "Admin Home", "Link");
    }
    public async isSignOut() {
        await this.validateElementVisibility(this.selectors.signOutLink, "Sign Out");
        await this.page.waitForLoadState('load');
    }

    public async clickMenu(menu: string) {
        await this.wait("minWait");
        await this.page.waitForLoadState('load');
        await this.spinnerDisappear();
        await this.mouseHover(`//div[text()='${menu}']//ancestor::div[@class='item-draggable']`, "Menu");
        await this.click(this.selectors.dragableMenu(menu), "Create", "Button");
    }

    public async clickLearningPath() {
        await this.wait("minWait");
        await this.mouseHover(this.selectors.learningPathLink, "Learning Path");
        await this.click(this.selectors.learningPathLink, "Learning Path", "Button");
    }

    public async clickInstructorLink() {
        await this.mouseHover(this.selectors.instructorLink, "Learning Path");
        await this.click(this.selectors.instructorLink, "Learning Path", "Button");
    }

    public async menuButton() {
        await this.wait("minWait");
        await this.page.keyboard.press('PageUp');
        await this.page.waitForLoadState('load');
        await this.spinnerDisappear();
        await this.mouseHover(this.selectors.menu, "Menu");
        await this.click(this.selectors.menu, "Menu", "Button");
    }

    public async people() {
        await this.validateElementVisibility(this.selectors.peopleMenu, "People");
        await this.click(this.selectors.peopleMenu, "People", "Button");
    }

    public async survey() {
        await this.wait("minWait");
        await this.validateElementVisibility(this.selectors.surveyMenu, "Survey");
        await this.click(this.selectors.surveyMenu, "Survey", "Button");
    }

    public async clickOnsurveyLink() {
        await this.validateElementVisibility(this.selectors.surveyLink, "Survey");
        await this.click(this.selectors.surveyLink, "Survey", "Button");
    }



    public async clickOnAssessmentLink() {
        await this.validateElementVisibility(this.selectors.assessmentLink, "Assessment");
        await this.click(this.selectors.assessmentLink, "Assessment", "Link");
        await this.spinnerDisappear();
    }

    public async clickQuickAccess() {
        await this.validateElementVisibility(this.selectors.quickAccessIcon, "QuickAccess Icon");
        await this.click(this.selectors.quickAccessIcon, "QuickAccess Icon", "Icon");
        await this.click(this.selectors.quickAccessDD, "QuickAccess DropDown", "Drop Down");
        await this.wait('minWait');
    }

    public async selectingQuickAccessValue() {
        let count = await this.page.locator(this.selectors.quickAccessValue).count() / 2;
        console.log(count);
        for (let i = 0; i < count; i++) {
            await this.click(`(${this.selectors.quickAccessValue})[1]`, "Access Module", "DropDown");
            await this.page.waitForTimeout(500);
        }
        await this.click(this.selectors.tickIcon, "Tick Icon", "Icon");
        await this.spinnerDisappear();
    }

    public async removeQuickAccessModule() {
        await this.validateElementVisibility(this.selectors.quickAccessIcon, "QuickAccess Icon");
        await this.click(this.selectors.quickAccessIcon, "QuickAccess Icon", "Icon");
        await this.wait('mediumWait');
        for (let index = 0; index < 5; index++) {
            let count = await this.page.locator(this.selectors.deleteIcon).count();
            let randomNumber = Math.floor(Math.random() * (count / 3)) + 1;
            await this.click(`(${this.selectors.deleteIcon})[${randomNumber}]`, "Delete Icon", "Icon");
            await this.wait('minWait');
            await this.click(this.selectors.yesBtn, "Yes", "Button");
        }
        await this.click(this.selectors.tickIcon, "Tick Icon", "Icon");
        await this.spinnerDisappear();

    }

    public async dragTheModule() {
        await this.validateElementVisibility(this.selectors.quickAccessIcon, "QuickAccess Icon");
        await this.click(this.selectors.quickAccessIcon, "QuickAccess Icon", "Icon");
        await this.wait('mediumWait');
        let count = await this.page.locator(this.selectors.quickAccessModules).count();
        console.log(count);
        for (let index = 0; index < 4; index++) {
            let randomNumber = Math.floor(Math.random() * count / 2) + 1
            await this.draganddrop(`(${this.selectors.quickAccessModules})[${randomNumber}]`, `(${this.selectors.quickAccessModules})[${count}]`)
            await this.wait('minWait');
        }
        await this.click(this.selectors.tickIcon, "Tick Icon", "Icon");
        await this.spinnerDisappear();

    }

    public async clickOnSurveyQuestionLink() {
        await this.mouseHover(this.selectors.surveyQuestionsLink, "Questions");
        await this.click(this.selectors.surveyQuestionsLink, "Questions", "Link");
    }

    public async assessmentMenu() {
        await this.validateElementVisibility(this.selectors.assessmentMenu, "Assessment");
        await this.click(this.selectors.assessmentMenu, "Assessment", "Button");
        // await this.page.locator("").innerHTML()
    }



    public async clickOnAssessmentQuestionLink() {
        await this.mouseHover(this.selectors.assessmentQuestionLink, "Questions");
        await this.click(this.selectors.assessmentQuestionLink, "Questions", "Link");
    }


    public async clickLearningMenu() {
        await this.validateElementVisibility(this.selectors.learningMenu, "Learning");
        await this.click(this.selectors.learningMenu, "Learning", "Button");
    }
    public async clickCourseLink() {
        await this.validateElementVisibility(this.selectors.courseLink, "Course");
        await this.click(this.selectors.courseLink, "Course", "Button");
    }
    public async clickCreateCourse() {
        await this.validateElementVisibility(this.selectors.createCourseBtn, "Course");
        await this.wait('minWait')
        await this.click(this.selectors.createCourseBtn, "Course", "Button");
    }

    public async user() {
        await this.validateElementVisibility(this.selectors.userMenu, "User");
        await this.click(this.selectors.userMenu, "USER", "Button");
    }

    public async metadataLibrary() {
        await this.validateElementVisibility(this.selectors.metadataLibraryMenu, "Metadata Library");
        await this.click(this.selectors.metadataLibraryMenu, "Metadata Library", "Button");
    }

    public async meta_People() {
        await this.validateElementVisibility(this.selectors.metaPeopleLink, "People");
        await this.mouseHover(this.selectors.metaPeopleLink, "People");
        await this.click(this.selectors.metaPeopleLink, "People", "Button");
    }

    public async meta_ECommerce() {
        await this.validateElementVisibility(this.selectors.metaECommerceLink, "People");
        await this.mouseHover(this.selectors.metaECommerceLink, "People");
        await this.click(this.selectors.metaECommerceLink, "People", "Button");
    }

    public async meta_learning() {
        await this.validateElementVisibility(this.selectors.metaLearningLink, "Learning");
        await this.mouseHover(this.selectors.metaLearningLink, "Learning");
        await this.click(this.selectors.metaLearningLink, "Learning", "Button");
        // await this.spinnerDisappear();
    }

    public async metaGeneralLink() {
        await this.validateElementVisibility(this.selectors.metaGeneralLink, "Learning");
        await this.mouseHover(this.selectors.metaGeneralLink, "Learning");
        await this.click(this.selectors.metaGeneralLink, "Learning", "Button");
        // await this.spinnerDisappear();
    }
    async enter(name: string, data: string) {
        await this.wait("mediumWait")
        await this.type(`//input[@id="${name}"]`, name, data);
    }

    public async adminGroup() {
        await this.click(this.selectors.adminGroupLink, "AdminGroup", "Link");
    }

    public async learnerGroup() {
        await this.click(this.selectors.learnerGrouplink, "AdminGroup", "Link");
    }

    public async locationLink() {
        await this.click(this.selectors.locationLink, "Location", "Link");
    }

    async clickCommerceMenu() {
        this.click(this.selectors.commerceMenu, "Commerce Menu", "Button")
    }

    public async clickCompletionCertification() {
        await this.mouseHover(this.selectors.completionCertificationLink, "Completion Certification");
        await this.click(this.selectors.completionCertificationLink, "CompletiionCertification", "Link");
    }

    public async clickCertification() {
        await this.mouseHover(this.selectors.certificationLink, "Certification");
        await this.click(this.selectors.certificationLink, "Certification", "Link");
    }

    public async clickCommunicationLink() {
        await this.mouseHover(this.selectors.communicationLink, "Communication")

        await this.click(this.selectors.communicationLink, "Communication", "Link")

    }
    public async clickBanner() {
        await this.wait("minWait");
        await this.mouseHover(this.selectors.bannerMenu, "Banner")
        await this.click(this.selectors.bannerMenu, "Banner", "Link")
    }

    public async clickCreateBanner() {
        await this.wait("minWait");
        await this.validateElementVisibility(this.selectors.createBannerbutton, "Create Banner")
        await this.click(this.selectors.createBannerbutton, "Create Banner", "Button")
    }

    public async clickAnnouncement() {
        await this.wait("minWait");
        await this.click(this.selectors.announcementMenu, "Announcement", "Link")
    }

    public async clickCreateAnnouncement() {
        await this.wait("minWait");
        await this.click(this.selectors.createAnnouncementbutton, "Create Banner", "Button")
    }

    public async clickContentmenu() {
        await this.wait("minWait");
        await this.click(this.selectors.contentMenu, "Content", "Link")

    }

    public async clickEnrollmentMenu() {
        await this.wait("minWait");
        await this.click(this.selectors.enrollMenu, "Enrollment", "Link")
    }

    public async clickEnroll() {
        await this.wait("minWait");
        await this.click(this.selectors.enrollLink, "Enrollment", "Link")
        await this.wait("minWait");
    }

    public async clickAdminRole() {
        await this.click(this.selectors.adminRolemenu, "AdminRole", "Link")

    }

    ///Site Admin////
    public async siteAdmin() {
        await this.validateElementVisibility(this.selectors.siteAdminMenu, "Site Admin");
        await this.click(this.selectors.siteAdminMenu, "Site Admin", "Button");
    }
    public async siteAdmin_learnerconfig() {
        await this.validateElementVisibility(this.selectors.learnerConfigLink, "Learner Configuration");
        await this.mouseHover(this.selectors.learnerConfigLink, "Learner Configuration");
        await this.click(this.selectors.learnerConfigLink, "Learner Configuration", "Button");
        await this.spinnerDisappear();
    }
    public async siteSettings() {
        await this.validateElementVisibility(this.selectors.siteSettingsLink, "Site Settings");
        await this.mouseHover(this.selectors.siteSettingsLink, "Site Settings");
        await this.click(this.selectors.siteSettingsLink, "Site Settings", "Button");
        await this.spinnerDisappear();
    }
    public async siteAdmin_Adminconfig() {
        await this.wait("minWait");
        await this.validateElementVisibility(this.selectors.adminConfigLink, "Admin Configuration");
        await this.mouseHover(this.selectors.adminConfigLink, "Admin Configuration");
        await this.click(this.selectors.adminConfigLink, "Admin Configuration", "Button");
        await this.spinnerDisappear();
    }

    async clearBrowserCache(url: string) {
        const baseUrl = await this.getBaseUrl(url)
        await this.page.context().clearCookies();
        await this.page.context().clearPermissions();
        await this.page.goto(`${baseUrl}clearcache`);
        await this.wait('minWait');
        await this.page.goto(`${baseUrl}clearallcache`);
    }

    //For Direct Content Launch
    public async clickDirectContentLaunchLink() {
        await this.validateElementVisibility(this.selectors.directContent, "DirectContentLaunch");
        await this.click(this.selectors.directContent, "DirectContentLaunch", "Button");
        await this.page.waitForLoadState('load');
    }

    //Navigate learner side from admin page
    public async navigateToLearner() {
        await this.wait("minWait");
        await this.page.locator(`#exp_logo`).click();
        await this.page.waitForLoadState('load');
        await this.spinnerDisappear();
    }

    public async metaDataLibraryOption(data: string) {
        await this.wait("minWait")
        await this.validateElementVisibility(this.selectors.metaLibOption(data), "Meta Data Library");
        await this.mouseHover(this.selectors.metaLibOption(data), "meta data library");
        await this.click(this.selectors.metaLibOption(data), "meta data library", "Button");
        await this.spinnerDisappear();
    }
    
    public async dynamicShareableLinks() {
        await this.wait("minWait");
        await this.validateElementVisibility(this.selectors.dynamicShareableLinks, "Dynamic Shareable Links");
        await this.mouseHover(this.selectors.dynamicShareableLinks, "Dynamic Shareable Links");
        await this.click(this.selectors.dynamicShareableLinks, "Dynamic Shareable Links", "Button");
        await this.spinnerDisappear();
    }

    public async verifyDynamicShareableLinks(expectedState: "Enabled" | "Disabled") {
        await this.wait("mediumWait");
        const isVisible = await this.page.locator(this.selectors.dynamicShareableLinks).isVisible();
        if (expectedState === "Enabled") {
            expect(isVisible).toBeTruthy();
            console.log("✅ Verified: Dynamic Shareable Links is displayed in the menu (Enabled)");
        } else if (expectedState === "Disabled") {
            expect(isVisible).toBeFalsy();
            console.log("✅ Verified: Dynamic Shareable Links is NOT displayed in the menu (Disabled)");
        }
    }

}