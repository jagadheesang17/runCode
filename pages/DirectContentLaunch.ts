import { BrowserContext, expect, Page } from "@playwright/test";
import { AdminHomePage } from "./AdminHomePage";

export class DirectContentLaunch extends AdminHomePage {

public selectors = {
        ...this.selectors,
        domaindropdown:`//button[@role='combobox']`,
        domainnameselect:(Options: string) => `//a[@class='dropdown-item']//span[text()='${Options}']`,
        searchfield:`//input[@id='exp-search-field']`, 
        generatebtn:`//button[text()='Generate URL']`, 
        innerurl:`//input[@id='direct_content_URL']`,
        clearbtn:`//button[text()='Clear']`,
        copy:`//i[@aria-label='Copy']`,
        successverify:`//div[contains(@class, 'show alert alert-success')]//following::span`,
        directcontentSearchResult: (clsTitle:string) =>`//li[contains(text(),'${clsTitle}')]`,
        copyurl:`//i[@aria-label='Copy']`,
        clearfields:`//button[text()='Clear']`,
        urlText:`//input[@name='direct_content_URL']`,
        // directContent: `//a[text()='Direct Content Launch']`,
        directContent:`//a[@href='/admin/learning/directcontentlaunch']`,
        shareurl:`//i[@aria-label='share']`,
        shareModal:`//form[@class='addedit-share-form']`,
        shareModalTitle:`//div[text()='Share']`,
        emailField:`//input[@id='shareTo']`,
        //sharemessage:`//textarea[@id='shareMessage']`,
        shareButton:`//button[@id='share-btn-submit']`,
        shareSuccessMessage:`//span[text()='Shared Successfully']`,
        //closeModal:`//button[@class='btn-close']`,
        cancelShare:`//button[@id='share-btn-cancel']`,

        // Learner side signup popup selectors
        signupPopup: `//form[@id='login-form']`,
        signupModalTitle: `//h2[text()='Sign In']`,
        


    };

    constructor(page: Page, context: BrowserContext) {
        super(page, context)
        
    }
    public async clickdomaindropdown(data: string) {
        await this.wait("minWait")
        await this.click(this.selectors.domaindropdown, "domaindropdown", "Button")
        await this.click(this.selectors.domainnameselect(data), "domainnameselect","Link")
    }

    
    // public async searchfield(data: string) {
    //     await this.type(this.selectors.searchfield, "searchfield", data)
    //     await this.wait ("minWait")
    // }
    public async searchfield(clsTitle: string) {
        await this.type(this.selectors.searchfield, "searchfield", clsTitle)
        await this.wait ("minWait")
        
        // Check if the search result element is present before clicking
        try {
            await this.page.waitForSelector(this.selectors.directcontentSearchResult(clsTitle), { timeout: 5000 });
            await this.mouseHoverandClick(this.selectors.directcontentSearchResult(clsTitle),this.selectors.directcontentSearchResult(clsTitle),"directcontentsearch", "dropdown")
            console.log(`Search result for '${clsTitle}' found and clicked`);
        } catch (error) {
            console.log(`Search result for '${clsTitle}' not found, skipping click`);
        }
    }
    public async generateURL() {
        // Check if the Generate URL button is disabled
        const buttonElement = await this.page.locator(this.selectors.generatebtn);
        const isDisabled = await buttonElement.getAttribute('disabled');
        
        if (isDisabled !== null) {
            console.log("You cannot generate URL for save draft course - Generate URL button is disabled");
            return false;
        } else {
            await this.click(this.selectors.generatebtn, "generatebtn", "Button")
            await this.wait ("mediumWait")
            console.log("Generate URL button clicked successfully");
            return true;
        }
    }

    async verifySuccessMessage() {
        
        await this.verification(this.selectors.successverify, "successfully");
        await this.wait("minWait")
    }
    public async copyURL() {
        await this.click(this.selectors.copyurl, "copyurl", "Button")
        await this.wait ("minWait")
        const copyURL=await this.page.locator(this.selectors.urlText).inputValue()
        return copyURL;
    }
    public async clearFields() {
        await this.click(this.selectors.clearfields, "clearfields", "Button")
        await this.wait ("minWait")
    }

  async verifyDirectContentLaunchPage(){
    await this.verification(this.selectors.directContent, "Direct Content Launch");
  }

  // Method to verify Direct Content Launch is accessible (for testing the site setting toggle)
  async verifyDirectContentLaunchAccessible() {
    try {
      await this.validateElementVisibility(this.selectors.directContent, "Direct Content Launch Link");
      console.log("Direct Content Launch is accessible - site setting is enabled");
      return true;
    } catch (error) {
      console.log("Direct Content Launch is not accessible - site setting might be disabled");
      return false;
    }
  }

  // Share URL functionality methods
  public async clickShareURL() {
    await this.click(this.selectors.shareurl, "shareurl", "Button");
    await this.wait("minWait");
    console.log("Share URL button clicked");
  }

  public async verifyShareModal() {
    await this.verification(this.selectors.shareModal, "subject");
    await this.verification(this.selectors.shareModalTitle, "Share");
    console.log("Share URL modal opened successfully");
  }

  public async enterEmailForShare(email: string) {
    await this.type(this.selectors.emailField, "email field", email);
    await this.wait("minWait");
    console.log(`Email entered for sharing: ${email}`);
  }
  public async enterMessageForShare(message: string) {
    await this.type(this.selectors.sharemessage, "message field", message);
    await this.wait("minWait");
    console.log(`Message entered for sharing: ${message}`);
  }

  public async clickShareButton() {
        await this.wait("minWait");
    await this.click(this.selectors.shareButton, "share", "Button");
    await this.wait("mediumWait");
    console.log("Share button clicked");
  }

  public async verifyShareSuccessMessage() {
    await this.verification(this.selectors.shareSuccessMessage, "shared successfully");
    await this.wait("minWait");
    console.log("Share success message verified");
  }

  public async closeShareModal() {
    await this.click(this.selectors.closeModal, "close modal", "Button");
    await this.wait("minWait");
    console.log("Share modal closed");
  }

  public async cancelShare() {
    await this.click(this.selectors.cancelShare, "cancel", "Button");
    await this.wait("minWait");
    console.log("Share operation cancelled");
  }

  public async shareURLWithEmail(email: string) {
    await this.clickShareURL();
  await this.verifyShareModal();
    await this.enterEmailForShare(email);
    await this.clickShareButton();
    await this.verifyShareSuccessMessage();
    // await this.closeShareModal();
  }

  public async shareURLWithMultipleEmails(emails: string[]) {
    const commaSeparatedEmails = emails.join(', ');
    await this.clickShareURL();
    await this.verifyShareModal();
    await this.enterEmailForShare(commaSeparatedEmails);
    await this.clickShareButton();
    await this.verifyShareSuccessMessage();
    console.log(`URL shared with multiple emails: ${commaSeparatedEmails}`);
  }
  // Learner side signup popup methods
  public async navigateToDirectContentURL(directURL: string) {
    await this.loadApp(directURL);
    await this.wait("mediumWait");
    console.log(`Navigated to Direct Content URL: ${directURL}`);
  }

  public async verifySignupPopup() {
    await this.validateElementVisibility(this.selectors.signupPopup, "Signup Popup");
    await this.verification(this.selectors.signupModalTitle, "Sign In");
    console.log("Signup popup verified successfully");
  }

  

}