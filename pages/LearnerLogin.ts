import { BrowserContext, Page, expect } from "@playwright/test";
import { URLConstants } from "../constants/urlConstants";
import { PlaywrightWrapper } from "../utils/playwright";
import { credentials } from "../constants/credentialData";
import { setTimeout } from "timers";

const signInLocator = "//span[text()='Sign In']";
const usernameSelector = "#username";
const passwordSelector = "#password";
const signInButtonLocator = "//button[text()='Sign In']";
const logoutButtonLocator = "//div[@class='logout']/a";
const signUpLink = "//a[text()='Sign Up']";
const firstName = "#first_name";
const last_name = "#last_name";
const user_name = "#user_name";
const password = "#password";
const confpass = "//input[@id='confirmpassword']";
const zipcode = "#zip_code";
const createAccount = "//button[text()='Create Account']";
const email = "#email";

///SSO Xpath////////////
const sso_signInUsingCompanyLogin = "//button[contains(text(),'Sign in using')]";
const sso_signInButton = "//input[@value='Sign In']";
const sso_username = "//div[contains(@class,'nav-profile-content text')]//h2";
const sso_negativemsg = "//body[text()='User is not in active state']";

////for address validation need to add more fields///////
const address1 = "#lnr_address1";
const address2 = "#lnr_address2";
const city = "#lnr_city";
const dropdownToggle = (label: string) => `(//label[text()='${label}']/following::button[@data-bs-toggle='dropdown'])[1]`;
const dropdownSearchInput = (label: string) => `(//label[text()='${label}']/following::input[@type='search'])[1]`;
const dropdownOption = (data: string) => `//span[text()='${data}']`;

//Password policy:-
const passwordAttemptErrMsg =
    `//span[text()='Your account has been temporarily locked after 3 unsuccessful login attempts. Please try again later.']`

 //Landing page verification
 const pageName = (data: string) => `(//h1[text()='${data}'])[1]`;

export class LearnerLogin extends PlaywrightWrapper {


    // static pageUrl = URLConstants.leanerURL;
    constructor(page: Page, context: BrowserContext) {
        super(page, context);

    }


    public async learnerLogin(role: string, url: string) {
        const { username, password } = credentials[role];

        const signIn = async () => {
            try {
                await this.waitSelector(signInLocator);
                await this.wait('mediumWait');
                await this.click(signInLocator, "Sign In button", "Button");
            } catch (error) {
                console.error(`Error during sign-in process: ${error}`);
                throw error;
            }
        };

        try {
            switch (url) {
                case "Portal1": {
                    await this.loadApp(URLConstants.learnerportal);
                    break;
                }
                case "Portal2": {
                    await this.loadApp(URLConstants.learnerportal2);
                    break;
                }
                default:
                    await this.loadApp(URLConstants.leanerURL);
                    break;

            }
            await signIn();
            await this.type(usernameSelector, "Username", username);
            await this.type(passwordSelector, "Password", password);
            await this.wait('minWait');
            await this.click(signInButtonLocator, "Sign In button", "Button");
            await this.page.waitForLoadState('domcontentloaded');
            await this.waitSelector(logoutButtonLocator);
            const logoutButton = this.page.locator(logoutButtonLocator);
            await expect(logoutButton).toBeVisible({ timeout: 20000 });
            console.log(`Login successful`);
            await this.wait('minWait')
            console.log(await this.page.title());
            await this.page.reload({ waitUntil: 'commit' });
            await this.wait('mediumWait');
        } catch (error) {
            console.error(`Login attempt failed: ${error}`);
            throw error;
        }
    }


    public async basicLogin(username: string, url: string) {
        const signIn = async () => {
            try {
                await this.waitSelector(signInLocator);
                await this.wait('mediumWait');
                await this.click(signInLocator, "Sign In button", "Button");
            } catch (error) {
                console.error(`Error during sign-in process: ${error}`);
                throw error;
            }
        };

        try {
            switch (url) {
                case "Portal1": {
                    await this.loadApp(URLConstants.learnerportal);
                    break;
                }
                case "Portal2": {
                    await this.loadApp(URLConstants.learnerportal2);
                    break;
                }
                default:
                    await this.loadApp(URLConstants.leanerURL);
                    break;
            }
            await signIn();
            await this.type(usernameSelector, "Username", username);
            await this.type(passwordSelector, "Password", "Welcome1@");
            await this.click(signInButtonLocator, "Sign In button", "Button");
            await this.page.waitForLoadState('domcontentloaded');
            await this.waitSelector(logoutButtonLocator);
            const logoutButton = this.page.locator(logoutButtonLocator);
            await expect(logoutButton).toBeVisible({ timeout: 20000 });
            console.log(`Login successful`);
            console.log(await this.getTitle())
            await this.wait('maxWait');
        } catch (error) {
            console.error(`Login attempt failed: ${error}`);
            throw error;
        }
    }
    //To verify the password policy,if the password is entered more than the configured value then it will throw an error message
    public async passwordPolicyLogin(username: string,password:string,url: string) {
        const signIn = async () => {
            try {
                await this.waitSelector(signInLocator);
                await this.wait('mediumWait');
                await this.click(signInLocator, "Sign In button", "Button");
            } catch (error) {
                console.error(`Error during sign-in process: ${error}`);
                throw error;
            }
        };

        try {
            switch (url) {
                case "Portal1": {
                    await this.loadApp(URLConstants.learnerportal);
                    break;
                }
                case "Portal2": {
                    await this.loadApp(URLConstants.learnerportal2);
                    break;
                }
                default:
                    await this.loadApp(URLConstants.leanerURL);
                    break;
            }
            await signIn();
            await this.type(usernameSelector, "Username", username);
            await this.type(passwordSelector, "Password", password);
            await this.click(signInButtonLocator, "Sign In button", "Button");
            await this.wait("mediumWait")
            console.log(`Login unsuccessful`);
        } catch (error) {
            console.error(`Login attempt failed: ${error}`);
            throw error;
        }
    }

    //Error message for password policy
    public async passwordPolicyErrorMessage() {
        await this.wait("minWait");
        await this.verification(passwordAttemptErrMsg, "Your account has been temporarily locked after 3 unsuccessful login attempts. Please try again later.");
        console.log(`Your account has been temporarily locked after 3 unsuccessful login attempts. Please try again later.`);
    }

    // public async learnerSignUP(url: any, fName: any, lName: any, uName: any, zcode: any, eMail: any) {
    //     try {
    //         switch (url) {
    //             case "Portal1": {
    //                 await this.loadApp(URLContants.learnerportal);
    //                 break;
    //             }
    //             case "Portal2": {
    //                 await this.loadApp(URLConstants.learnerportal2);
    //                 break;
    //             }
    //             default:
    //                 await this.loadApp(URLConstants.leanerURL);
    //                 break;
    //         }
    //         await this.click(signUpLink, "signUpLink", "link");
    //         await this.type(firstName, "FirstName", fName);
    //         await this.type(last_name, "LastName", lName);
    //         await this.type(user_name, "UserName", uName);
    //         await this.type(password, "Password", "Welcome1@");
    //         await this.type(confpass, "Confirm Password ", "Welcome1@");
    //         await this.type(zipcode, "Zipcode", zcode);
    //         await this.type(email, "Email", eMail);
    //         await this.click(createAccount, "CreateAccount", "button");
    //     }
    //     catch (error) {
    //         console.error(`Login attempt failed: ${error}`);
    //         throw error;
    //     }
    // }
    public async learnerSignUP(url: any, fName?: any, lName?: any, uName?: any, eMail?: any, country?: any, state?: any, timezone?: any, addr1?: any, addr2?: any, cityName?: any, zcode?: any,) {
        const select = async (label: string, data: string) => {
            const toggleSelector = dropdownToggle(label);
            await this.click(toggleSelector, label, 'Dropdown');
            await this.wait("minWait")
            console.log("The country is:" + data)
            await this.type(dropdownSearchInput(label), label, data);
            const optionSelector = dropdownOption(data);
            await this.click(optionSelector, data, 'DropDown');
            await this.verification(toggleSelector, data);
        }
        try {
            switch (url) {
                case "Portal1": {
                    await this.loadApp(URLConstants.learnerportal);
                    break;
                }
                case "Portal2": {
                    await this.loadApp(URLConstants.learnerportal2);
                    break;
                }
                default:
                    await this.loadApp(URLConstants.leanerURL);
                    break;
            }
            await this.click(signUpLink, "signUpLink", "link");
            await this.type(firstName, "FirstName", fName);
            await this.type(last_name, "LastName", lName);
            await this.type(user_name, "UserName", uName);
            await this.type(password, "Password", "Welcome1@");
            await this.type(confpass, "Confirm Password ", "Welcome1@");
            await this.type(zipcode, "Zipcode", zcode);
            await select("Country", country);
            await select("State/Province", state);
            await select("TimeZone", timezone);
            await this.type(email, "Email", eMail)
            await this.type(address1, "Address 1", addr1);
            await this.type(address2, "Address 2", addr2);
            await this.type(city, "City", cityName);
        }
        catch (error) {
            console.error(`Login attempt failed: ${error}`);
            throw error;
        }
    }
    ///SSO LOGIN////
    public async ssoLogin(username: string, password: string, url: string, userType: string) {
        const signIn = async () => {
            try {
                await this.waitSelector(signInLocator);
                await this.wait('mediumWait');
                await this.click(signInLocator, "Sign In button", "Button");
            } catch (error) {
                console.error(`Error during sign-in process: ${error}`);
                throw error;
            }
        };
        try {
            switch (url) {
                case "Portal1": {
                    await this.loadApp(URLConstants.learnerportal);
                    break;
                }
                case "Portal2": {
                    await this.loadApp(URLConstants.learnerportal2);
                    break;
                }
                default:
                    await this.loadApp(URLConstants.leanerURL);
                    break;
            }
            await signIn();
            await this.click(sso_signInUsingCompanyLogin, "Sign In Using Company Login button", "Button");
            await this.wait('maxWait');
            await this.type(usernameSelector, "Username", username);
            await this.type(passwordSelector, "Password", password);
            await this.wait('minWait');
            await this.click(sso_signInButton, "Sign In button", "Button");
            await this.page.waitForLoadState('domcontentloaded');
            // Code for active user
            if (userType === "Active") {
                await this.waitSelector(logoutButtonLocator);
                const logoutButton = this.page.locator(logoutButtonLocator);
                await expect(logoutButton).toBeVisible({ timeout: 20000 });
                console.log(`Login successful`);
                await this.wait('minWait')
                console.log(await this.page.title());
                await this.page.reload({ waitUntil: 'commit' });
                await this.wait('mediumWait');
                const displayUsername = await this.getInnerText(sso_username);
                const expected = displayUsername.split(' ')[0].toLowerCase();
                console.log(expected)
                expect(username).toContain(expected)
            } else if (userType === "Suspended") {
                await this.verification(sso_negativemsg, "User is not in active state");
            }
            else {
                console.error(`Unknown userType: ${userType}`);
                throw new Error(`Unknown userType: ${userType}`);
            }
        } catch (error) {
            console.error(`Login attempt failed: ${error}`);
            throw error;
        }
    }
    ///SSO DIRECT LOGIN///
    public async ssoDirectLogin(role: string, url: string) {
        const { username, password } = credentials[role];

        try {
            switch (url) {
                case "Portal1": {
                    await this.loadApp(URLConstants.learnerportal);
                    break;
                }
                case "Portal2": {
                    await this.loadApp(URLConstants.learnerportal2);
                    break;
                }
                default:
                    await this.loadApp(URLConstants.leanerURL);
                    break;
            }
            await this.waitSelector(usernameSelector);
            await this.wait('mediumWait');
            await this.type(usernameSelector, "Username", username);
            await this.type(passwordSelector, "Password", password);
            await this.wait('minWait');
            await this.click(sso_signInButton, "Sign In button", "Button");
            await this.page.waitForLoadState('domcontentloaded');
            await this.waitSelector(logoutButtonLocator);
            const logoutButton = this.page.locator(logoutButtonLocator);
            await expect(logoutButton).toBeVisible({ timeout: 20000 });
            console.log(`Login successful`);
            await this.wait('minWait')
            console.log(await this.page.title());
            await this.page.reload({ waitUntil: 'commit' });
            await this.wait('mediumWait');
            const displayUsername = await this.getInnerText(sso_username);
            const expected = displayUsername.split(' ')[0].toLowerCase();
            console.log(expected)
            expect(username).toContain(expected)
        } catch (error) {
            console.error(`Login attempt failed: ${error}`);
            throw error;
        }
    }

    async clickCreatedAccount() {
        await this.wait("minWait")
        await this.validateElementVisibility(createAccount, "CreateAccount");
        await this.click(createAccount, "CreateAccount", "button");
        await this.wait("maxWait")
    }

    public async DirectContentLogin(role: string) {
    const { username, password } = credentials[role];
        await this.type(usernameSelector, "Username", username);
        await this.type(passwordSelector, "Password", password);
        await this.wait('minWait');
        await this.click(signInButtonLocator, "Sign In button", "Button");
        await this.page.waitForLoadState('domcontentloaded');
        await this.waitSelector(logoutButtonLocator);
        const logoutButton = this.page.locator(logoutButtonLocator);
        await expect(logoutButton).toBeVisible({ timeout: 20000 });
        console.log(`Login successful`);
        await this.wait('minWait')
        console.log(await this.page.title());
        await this.page.reload({ waitUntil: 'commit' });
        await this.wait('mediumWait');
    } catch (error) {
        console.error(`Login attempt failed: ${error}`);
        throw error;
    }

async verifyLandingPage(page:string) {
    await this.wait("minWait");
    await this.verification(pageName(page), page);
}



}
