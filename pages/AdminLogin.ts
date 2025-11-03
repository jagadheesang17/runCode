import { BrowserContext, Page, expect } from "@playwright/test";
import { URLConstants } from "../constants/urlConstants";
import { PlaywrightWrapper } from "../utils/playwright";
//import { credentialConstants } from "../constants/credentialConstants (Do not use)";
import { credentials } from "../constants/credentialData";

export class AdminLogin extends PlaywrightWrapper {

    static pageUrl = URLConstants.adminURL;

    constructor(page: Page, context: BrowserContext) {
        super(page, context);
    }
    public async adminLogin(role: string) {
        const { username, password } = credentials[role];
        console.log("Starting admin login process...");
        //await this.page.goto(AdminLogin.pageUrl); ----
        await this.clearAndType("#username", "Username", username);
        // Clear existing value and type password
        await this.clearAndType("#password", "Password", password);
        console.log("Clicking Sign In button...");
        // Wait for sign in button to be stable and clickable
        const signInButton = this.page.locator("//button[contains(text(),'SIGN')]");
        await signInButton.waitFor({ state: 'visible' });
        await signInButton.waitFor({ state: 'attached' });
        await this.page.waitForLoadState('networkidle');
        
        // Click sign in button with retry mechanism
        try {
            await signInButton.click({ timeout: 10000 });
        } catch (error) {
            console.log("First click failed, trying alternative selector...");
            await this.page.locator("button[type='submit']").click({ timeout: 10000 });
        }
        
        await this.wait('minWait');
        /*    const logoutButton = this.page.locator("//div[@class='logout']");
   
           //console.log("Storing state...");
           //await this.storeState("./logins/expertusAdminLog.json"); */
    }

    public async singleLogin(username: string, password?: string) {

        console.log("Starting admin login process...");
        await this.clearAndType("#username", "Username", username);
        await this.clearAndType("#password", "Password", "Welcome1@");
        console.log("Clicking Sign In button...");
        await Promise.all([
            this.page.locator("//button[contains(text(),'SIGN')]").click(),
            this.wait('minWait')
        ]);
    }


    private async clearAndType(selector: string, fieldName: string, value: string) {
        console.log(`Clearing and typing into ${fieldName}...`);
        const element = this.page.locator(selector);

        // Clear any existing value
        await element.evaluate((node: HTMLInputElement) => { node.value = ''; });

        await element.type(value);
        console.log(`${fieldName} set to ${value}`);
    }
}
