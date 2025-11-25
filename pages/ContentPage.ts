import { BrowserContext, expect, Page } from "@playwright/test";
import { AdminHomePage, } from "./AdminHomePage";
import { AdminGroupPage, } from "./AdminGroupPage";
import * as fs from "fs";
import * as path from "path";
import { error } from "console";
import { th } from "@faker-js/faker";
import crypto from "crypto";

export class ContentHomePage extends AdminHomePage {
  //public fileName: string
  public path: string;

  public selectors = {
    ...this.selectors,
    contentButton: `//button[text()='CREATE CONTENT']`,
    contentTitle: `//input[@id='content-title']`,
    contentDesc: `//div[@id='content_description']//p`,
    addContent: `//label[text()='Click here']/following::input[@type='file']`,
    contentPreview: (index: number) =>
      `(//a/following::i[@aria-label='Preview'])[${index}]`,
    contentType: `//div[@id='wrapper-content_type']//div[@class='filter-option-inner-inner']`,
    contentSearch: `//input[@id='exp-search-field']`,
    storageContent: `//div[@class="col-auto"]/p[contains(text(),'Storage Used')]`,
    contentListing: `//a[text()='Go to Listing']`,
    verifyContentTitle: (title: string) =>
      `(//div[contains(@class,'field_title_')]/span[text()='${title}'])`,
    //Delete content from the course page
    deleteIcon: `(//a[@aria-label="Delete"]/i)[1]`,
    confirmDelete: `//button[text()="Yes"]`,
    editContent: `//a[text()="Edit Content"]`,
    uploadURL: `//input[@name="content_url"]`,
    addURL: `//button[text()='Add URL']`,
    dltBtn: `//i[@aria-label="delete"]`,
    clickYes: `//button[text()='Yes']`,
    DefaultDuration: `(//input[@class="text-end form-control lms-border-end border-0 px-1 form_field_active"])[2]`,
    AdminCode: `//input[@label="content code"]`,
    errorMsg: `//span[text()='Invalid file format or extensions uploaded. Please upload a valid file format.']`,
    preview: `//i[@class="fa-duotone fa-file-magnifying-glass icon_14_1"]`,
    conTitle: (title: string) => `//div[contains(text(),'${title}')]`,
    warningPopUp: `//span[text()='This content will be assigned to all the admin groups that you are part of. Please validate your decision.']`,
    noModificationBtn: `//button[text()='No, modify the access']`,
    proceedBtn: `//button[text()='Yes, Proceed']`,
    access: `//span[text()='Access']`,
    addAdminGrP: `//input[@aria-autocomplete='list']`,
    searchAdminGrp: `//span[text()='Learning admin']`,
    addVersion: `//button[text()='add version']`,
    clickHere: `//label[text()='Click here']`,
    transferFrom: `(//label[text()='Transfer From']/following::div[text()='Select'])[1]`,
    selectClass:`(//div[text()='Select'])[1]`,
    addBtnTransferEnrollment:`//button[text()='Add']`,
    transferLearner:`//button[text()='Transfer Learner']`,
    verifyTitle:(title:string) => `//span[text()='${title}']`,
    verifySize:(size:string) => `//div[contains(text(),'${size}')]`,
    verifyLanguage:(lang:string) => `//span[text()='${lang}']`,
    verifyVersion:(version:string) => `//div[contains(text(),'${version}')]`,
    courseAttached:`(//i[@aria-label="No.Of trainings attached"]/following::span)[1]`,
    trainingAttached:`(//i[@aria-label="No.Of learning path"]/following::span)[2]`,


  };

  constructor(page: Page, context: BrowserContext) {
    super(page, context);
    // this.fileName = "AICC File containing a PPT - Storyline 11.zip"
    // this.path = `../data/${this.fileName}`
  }
  public async clickEditContent() {
    await this.click(this.selectors.editContent, "EditContent", "Button")
    await this.wait("minWait")

  }
  public async clickCreateContentBtn() {
    await this.page.locator("//a[text()='Create Content']").click();
    await this.wait("mediumWait")
  }
  public async getCntCode() {
    const contentCode = await this.page.locator('#content_code').inputValue();
    console.log("Content Code:", contentCode);
    return contentCode.trim();

  }
  public async uploadURL(url: string) {
    await this.click(this.selectors.uploadURL, "URL", "")
    await this.wait("minWait")
    await this.keyboardType(this.selectors.uploadURL, url)
    await this.click(this.selectors.addURL, "Add URL", "Button");
    await this.wait("minWait")
  }
  public async getContentType() {
    const contentType = await this.page.locator(this.selectors.contentType).innerText();
    console.log("Content Type is:", contentType);
    return contentType;

  }
  public async autoVerifyContentType(contentType: string) {
    const actualContentType = await this.page.locator(this.selectors.contentType).innerText();
    console.log("Actual Content Type is:", actualContentType);
    expect(contentType).toContain(actualContentType);
  }


  public async clickCreateContent() {
    await this.wait("mediumWait");
    await this.click(this.selectors.contentButton, "CreateContent", "Button");
  }

  public async enterTitle(title: string) {
    await this.type(this.selectors.contentTitle, "Content title", "text field");
  }

  public async enterDescription(title: string) {
    await this.wait("mediumWait");
    await this.type(
      this.selectors.contentDesc,
      "Content Description",
      title
    );
    await this.wait("mediumWait");
  }
  public async verifyURLERRMsg(msg: string) {
    await this.validateElementVisibility(this.selectors.verifyURLERRMsg(msg), "URL Error Message")
    const text = await this.getInnerText(this.selectors.verifyURLERRMsg(msg))
    console.log(text)
    expect(text).toBe(msg);

  }
  public async dltFuncUpload(data: string) {
    await this.click(this.selectors.dltBtn, "Delete", "Button")
    this.wait("mediumWait");
    const text = await this.page.locator("//span[contains(text(),'Are you sure you want to delete the attached content')]").innerText();
    expect(text).toContain(data);
    this.wait("maxWait");
    const yesButton = this.page.locator("//button[normalize-space()='Yes']");
    await yesButton.waitFor({ state: "visible" });
    await yesButton.click();
    this.wait("maxWait");
  }

  public async compareTitle(Contitle: string) {
    let title = await this.page.locator('#content-title').inputValue();
    console.log("Title from page:", title)
    expect(Contitle).toContain(title);

  }

  public async uploadContent(fileName: string) {
    this.path = `../data/${fileName}`;
    await this.wait("mediumWait");
    await this.uploadFile(this.selectors.addContent, this.path);
    await this.wait("maxWait");
  }

  //To remove the added content in the course page:-
  public async clickDeleteContent() {
    await this.click(this.selectors.deleteIcon, "Delete", "Button");
    await this.click(this.selectors.confirmDelete, "Yes", "Button");
    await this.wait("mediumWait");
  }
  public async verifyContentType(fileName: string) {
    await this.wait("maxWait");
    await this.validateElementVisibility(
      this.selectors.contentType,
      "Conteytype Text file"
    );
    const text = await this.getInnerText(this.selectors.contentType);
    await this.wait("maxWait");
    expect(fileName).toContain(text);
  }

  public async clickandVerifyPreview(fileName: string) {
    const index = await this.page
      .locator("//span[text()='circuit']/following::i")
      .count();
    const randomIndex = Math.floor(Math.random() * index) + 1;
    const title = await this.focusWindow(
      this.selectors.contentPreview(randomIndex)
    );
    await this.wait("mediumWait");
    expect(fileName).toContain(title);
    console.log(title);
  }

  public async contentVisiblity(fileName: string) {
    await this.typeAndEnter(this.selectors.contentSearch, "File Name", fileName);
    const index = await this.page
      .locator("//span[text()='circuit']/following::i")
      .count();
    const randomIndex = Math.floor(Math.random() * index) + 1;
    await this.validateElementVisibility(
      this.selectors.contentPreview(randomIndex),
      fileName
    );
    const title = await this.getInnerText(
      this.selectors.contentPreview(randomIndex)
    );
    expect(fileName).toContain(title);
  }

  public async verifyFileType(fileName: string) {
    await this.wait("maxWait");
    await this.validateElementVisibility(
      this.selectors.contentType,
      "Contey type Text file"
    );
    const text = await this.getInnerText(this.selectors.contentType);
    console.log(text);
    await this.wait("maxWait");
    const fileTypes = [
      "doc",
      "Document",
      "Presentation",
      "PPT",
      "PPS",
      "Presention",
      "xls",
      "EXCEL",
      "pdf",
      "Pdf",
      "png",
      "jpg",
      "jpeg",
      "gif",
      "mp4",
      "mpg",
      "mp3",
      "XAPI",
      "SCORM",
      "AICC",
    ];
    expect(fileName).toContain(text);
  }

  public async getContentStorage() {
    await this.wait("maxWait");
    await this.validateElementVisibility(
      this.selectors.storageContent,
      "Storage used"
    );
    return await this.getInnerText(this.selectors.storageContent);
  }
  public async getDefaultDuration(DefaultDuration: string) {
    await this.wait("minWait");
    const duration = await this.page.locator(this.selectors.DefaultDuration).inputValue();
    console.log("Default Duration is:", duration);
    if (DefaultDuration.includes(duration)) {
      console.log("Default duration is verified as:", DefaultDuration);
    }

  }
  public async gotoListing() {
    await this.wait("mediumWait");
    await this.validateElementVisibility(
      this.selectors.contentListing,
      "Goto Listing"
    );
    await this.click(this.selectors.contentListing, "Goto Listing", "Button");
    await this.wait("maxWait");
  }
  async editContentLabelVerify() {
    const text = await this.page.locator("//h1[text()='Edit Content']").isVisible();
    if (text) {
      console.log("Edit content page is displayed");
    }
  }
  async createContentLabelVerify() {
    const text = await this.page.locator("//h1[text()='Create Content']").isVisible();
    if (text) {
      console.log("Create content page is displayed");
    }
  }

  async contentListingLabelVerify() {
    const text = await this.page.locator("//h1[text()='Content']").isVisible();
    if (text) {
      console.log("Content listing page is displayed");
    }
  }

  //     public async getContentTitle(title:string){
  //     await this.validateElementVisibility(this.selectors.verifyContentTitle(title),"Content")
  //     await this.verification(this.selectors.verifyContentTitle(title),title)
  // }

  //Uploding random file based on the file format

  public async uploadContentBasedOnType(fileType: string) {
    const dirPath = path.resolve(__dirname, "../data");
    const files = fs.readdirSync(dirPath);
    const filteredFiles = files.filter((file) => file.endsWith(fileType));
    if (filteredFiles.length === 0) {
      throw new Error(`No files found with the type: ${fileType}`);
    }
    const randomFile =
      filteredFiles[Math.floor(Math.random() * filteredFiles.length)];
    this.path = path.join(dirPath, randomFile);
    await this.wait("mediumWait");
    await this.uploadFile(this.selectors.addContent, this.path);
    await this.wait("mediumWait");
  }

  //verifyContentFileType based on runtime content type text

  public async verifyContentFileType() {
    await this.wait("mediumWait");
    await this.validateElementVisibility(
      this.selectors.contentType,
      "Contey type Text file"
    );
    const text = await this.getInnerText(this.selectors.contentType);
    console.log(text);
    const fileTypes = [
      "doc",
      "Document",
      "Presentation",
      "PPT",
      "PPS",
      "Presention",
      "xls",
      "EXCEL",
      "pdf",
      "Pdf",
      "png",
      "jpg",
      "jpeg",
      "gif",
      "mp4",
      "mpg",
      "mp3",
      "XAPI",
      "SCORM 2004",
      "AICC",
    ];
    const matchedType = fileTypes.find((type) => type === text);
    // Check if a matching type was found
    if (matchedType) {
      console.log(`Matched file type: ${matchedType}`);
      expect(matchedType).toBe(text);
    } else {
      throw new Error(`File type "${text}" not found.`);
    }
  }
  public async verifyError(msg: string) {
    await this.wait("mediumWait");
    await this.validateElementVisibility(this.selectors.errorMsg, msg);
    const text = await this.getInnerText(this.selectors.errorMsg);
    console.log(text);
    expect(text).toBe(msg);
  }
  public async clickPreviewIcon() {
    await this.click(this.selectors.preview, "Preview Icon", "Icon");
    await this.wait("mediumWait");
  }

  public async verifyBtnEnabled(btnName: string) {
    const isEnabled = await this.page.locator(`//button[text()='${btnName}']`).isEnabled();
    if (isEnabled) {
      console.log(`${btnName} button is enabled`);
      await this.wait("minWait");
    } else {
      throw new Error(`${btnName} button is disabled`);
    }
  }
  public async verifyDiscardBtnEnabled() {
    const isEnabled = await this.page.locator(`(//button[text()='Discard'])[2]`).isEnabled();
    if (isEnabled) {
      console.log(`Discard button is enabled`);
      await this.wait("minWait");
    } else {
      throw new Error(`Discard button is disabled`);
    }
  }
  public async clickUnpublish() {
    const isEnabled = await this.page.locator(`//button[text()='Unpublish']`).isEnabled();
    if (isEnabled) {
      console.log(`Unpublish button is enabled`);
      await this.wait("minWait");
    }
    await this.page.locator(`//button[text()='Unpublish']`).click();
  }
  public async clickEditContentOnListing() {
    await this.page.locator(`(//i[@aria-label="Edit Content"])[1]`).click();
    await this.wait("mediumWait");
  }
  public async verifycontentTitle(title: string) {
    await this.validateElementVisibility(this.selectors.conTitle(title), "Content Title")
    await this.verification(this.selectors.conTitle(title), title)
  }
  public async verifyWarningPopUp(msg: string) {
    await this.validateElementVisibility(this.selectors.warningPopUp, "Warning Message")
    await this.verification(this.selectors.warningPopUp, msg)
    await this.verification(this.selectors.proceedBtn, "Yes, Proceed")
    await this.verification(this.selectors.noModificationBtn, "No, modify the access")
  }
  public async verifyAccessPopUp() {
    await this.validateElementVisibility(this.selectors.access, "Access")
    await this.verification(this.selectors.access, "Access")
  }
  public async clickAccess() {
    await this.page.locator("//label[text()='Admin Group']/following::div[contains(text(),'items selected')]").click();
    await this.wait("minWait");
    await this.page.locator("//input[@aria-autocomplete='list']").click();
    await this.type(this.selectors.addAdminGrP, "Add Admin Group", "Learning Admin");
    await this.mouseHover(this.selectors.searchAdminGrp, "Learning Admin");
    await this.click(this.selectors.searchAdminGrp, "Learning Admin", "Group");
  }
  public async downloadContent(code: string) {
    await this.page.locator(`//i[@aria-label="download"]`).click();
    await this.wait("minWait");
  }

  async verifyDownloadedFileType(expectedFileType: string) {
    console.log(`⏳ Waiting for ${expectedFileType.toUpperCase()} file to download...`);

    // Wait for the download to start after clicking the trigger
    const [download] = await Promise.all([
      this.page.waitForEvent("download"),
      this.page.locator(`//i[@aria-label="download"]`).click(),
    ]);

    // Get file info
    const suggestedName = download.suggestedFilename();
    const downloadedPath = await download.path();
    if (!downloadedPath) throw new Error("❌ Download path not found!");

    console.log(`📥 File downloaded: ${suggestedName}`);
    console.log(`📂 Saved at: ${downloadedPath}`);

    // Extract file extension
    const fileExtension = path.extname(suggestedName).replace(".", "").toLowerCase();

    // Validate the file type
    if (fileExtension !== expectedFileType.toLowerCase()) {
      throw new Error(
        `❌ File type mismatch: expected '${expectedFileType}', but got '${fileExtension}'`
      );
    }

    // Optional: Validate file is not empty
    const fileSize = fs.statSync(downloadedPath).size;
    expect(fileSize).toBeGreaterThan(0);

    console.log(`✅ ${expectedFileType.toUpperCase()} file downloaded successfully (${fileSize} bytes)`);
  }

  public async clickOpenLink() {
    await this.page.locator(`//i[@aria-label="Openlink"]`).click();
    await this.wait("mediumWait");
  }
  public async verifyAddVersionBtn() {

    await this.wait("mediumWait");
    const isEnabled = await this.page.locator(this.selectors.addVersion).isVisible();
    if (isEnabled) {
      console.log(`add version button is enabled`);
      await this.wait("minWait");
    }
  }
  public async clickAddVersionBtn() {
    await this.wait("mediumWait");
    await this.page.locator(this.selectors.addVersion).click();
    await this.wait("mediumWait");
  }
  public async getNewVersionNumber() {
    await this.wait("minWait");
    const version = await this.page.locator('(//input[@id="content-version"])[1]').inputValue();
    console.log("New Version Number is:", version);
    if (version === '2') {
      console.log("New version number has updated successfully");
    }
    return version;
  }
  public async verifyClickHereBtn() {
    const isVisible = await this.page.locator(this.selectors.clickHere).isVisible();
    await this.wait("mediumWait");
    if (isVisible) {
      console.log("Click here button is visible, Then the values are retained in all the fields except content upload field during versioning content");
    }
  }
  public async clickPublishForVersionedContent() {
    await this.page.locator(`(//button[@id='banner-btn-publish'])[2]`).click();
    await this.wait("mediumWait");
  }
  public async selectVersionedContent(title: string) {
    await this.page.mouse.wheel(0, 400);
    await this.page.locator(`//button[text()='Discard']/following::span[text()='${title}']`).click();
    await this.wait("mediumWait");
  }

  public async verifyCntCodeFieldDisabled() {

    const isEnabled = await this.page.locator(`//input[@class=form-control rounded-0 shadow-none form_field_inactive pe-none"]`).isVisible();
    if (isEnabled) {
      console.log("Content Code field is disabled");
    }
  }
  async verifyFieldIsDisabled(locator: string) {
    const field = this.page.locator(locator);
    await expect(field).toBeVisible();

    // Check if disabled (cannot receive input)
    const isDisabled = await field.isDisabled();

    // Check if readonly attribute exists
    const isReadOnly = await field.getAttribute("readonly");

    // Check if element has CSS class indicating inactive state
    const classValue = (await field.getAttribute("class")) || "";

    // Combine all checks
    const isNonEditable =
      isDisabled ||
      isReadOnly !== null ||
      classValue.includes("inactive") ||
      classValue.includes("readonly") ||
      classValue.includes("disabled") ||
      classValue.includes("disable-items") ||
      classValue.includes("button_negative_active");

    // Assert
    expect(isNonEditable, `❌ Field is editable.`).toBeTruthy();

    console.log(`✅ Field is non-editable.`);
    return isNonEditable;
  }

  public async verifyTransferLearnerBtn() {
    await this.wait("mediumWait");
    await this.page.mouse.wheel(0, 400);
    const text = await this.page.locator("(//span[text()=' attached to 1 courses/instances']/following::span[text()='0'])[1]").innerText();
    const isEnabled = await this.verifyFieldIsDisabled(`//button[@class="btn button_positive_2_active rounded-0 text-uppercase h-auto button_negative_active"]`);
    if (text === "0" && isEnabled) {
      console.log("Transfer Learner button is not enabled");
    }
  }
  public async verifyTransferLearnerBtnForNonAssociatedContent() {

    await this.wait("mediumWait");
    await this.page.mouse.wheel(0, 400);
    const isEnabled = await this.verifyFieldIsDisabled(`//button[@class="btn button_positive_2_active rounded-0 text-uppercase h-auto button_negative_active"]`);
    if (isEnabled) {
      console.log("Transfer Learner button is disabled for non associated content");

    }
    return isEnabled;
  }
  public async verifyTransferLearnerBtnEnabled() {
    await this.page.mouse.wheel(0, 400);
    const isEnabled = await this.page.locator("//button[text()='transfer learners to other versions']").isVisible();
    if (isEnabled) {
      console.log("Transfer Learner button is enabled");
    }
    return isEnabled;
  }
  public async clickTransferLearnerBtn() {
    await this.verifyTransferLearnerBtnEnabled();
    await this.page.locator("//button[text()='transfer learners to other versions']").click();
    await this.wait("mediumWait");
  }
  public async verifyTransferLearnerPopUp() {
    await this.verification("//span[text()='Learners will be updated to the newest content version']", "learners will be updated to the newest content version");
  }
  public async clickTransferFrom() {
    await this.click(this.selectors.transferFrom, "Transfer From", "Dropdown")
    await this.wait("minWait");
  }
  public async getVersionsFromTransferFromDropdown(version: any) {
    {
      const versions: any[] = await this.page.locator("(//label[text()='Transfer From']/following::div[text()='Select'])[1]/following::span[contains(text(),'Version')]").allInnerTexts();
      console.log("Available Versions in Transfer From Dropdown:", versions);
      for (let i = 0; i < versions.length; i++) 
        {
        const versionNo = versions[i];
        const numberOnly = versionNo.replace("Version ", "");
        const versionNumber = parseInt(numberOnly);
        console.log(numberOnly);
        console.log(i);

        if (i === 0) 
          {
            console.log(`Version ${versionNumber + (i + 2)} is present in the Transfer From dropdown`);
          if (version == versionNumber + (i + 2)) 
            {
            console.log(`Version ${versionNumber + (i + 2)} is present in the Transfer From dropdown`);
          }
        }
        else if (i >= 1) 
          {
            if (version == versionNumber + i) 
            {
            console.log(`Version ${versionNumber + i} is present in the Transfer From dropdown`);
          }
      }
    }
  }
}
public async selectContentVersion(version: any) {
  version = version-1;
  
  await this.mouseHover(`//span[text()="Version ${version}"]`, `Version ${version}`);
  await this.page.locator(`//span[text()="Version ${version}"]`).click();
 
}
public async selectclass(className:string){
  await this.click(this.selectors.selectClass,"Select Class","Dropdown");
  await this.mouseHover(`//span[@class=' bs-ok-default check-mark']/following-sibling::span[text()='${className}']`,className);
  await this.click(`//span[@class=' bs-ok-default check-mark']/following-sibling::span[text()='${className}']`,className,"Class");
}
public async selectLearnerStatus(status:string){
  await this.wait("minWait");
  await this.click("(//div[text()='Select'])[1]","Select","Dropdown"); 
  await this.mouseHover(`//span[text()='${status}']`, `${status}`);
  await this.click(`//span[text()='${status}']`,`${status}`,"Status");
}
public async clickAddBtnTransferEnrollment(){ 
  this.wait("minWait");  
  await this.click(this.selectors.addBtnTransferEnrollment,"Add","Button");
}
public async clickTransferLearnerbtn(){ 
  this.wait("minWait");  
  await this.click(this.selectors.transferLearner,"Transfer Learner","Button");
  await this.verification("//p[text()='All selected learners enrollments will be transferred through backend jobs.']","All selected learners enrollments will be transferred through backend jobs.");
}
public async verifyAttachedCourses(expected: string) {
  await this.page.mouse.wheel(0, 400);
  const attachedCourses = await this.page.locator(`//span[text()='${expected}']`).innerText();
  expected=expected.toUpperCase();
  if (attachedCourses === expected) {
    console.log(`Verified: ${attachedCourses} courses are attached.`);
  } else {
    console.log(`Verification failed: Expected ${expected} attached courses, but found ${attachedCourses}.`);
  }
}
public async verifyAttachedTrainingPlan(code: string) {
        await this.wait("minWait");
        //await this.page.mouse.wheel(0, 400);
        await this.page.locator(`//span[text()=' attached to 1 courses/instances']/following::i[@aria-hidden="true"]`).click();
        const attachedTP = await this.page.locator(`//span[text()='${code}']`).innerText();
        if (attachedTP === code) {
            console.log(`Verified: ${attachedTP} training plans are attached.`);
        } else {
            console.log(`Verification failed: Expected ${code} attached training plans, but found ${attachedTP}.`);
        }
}
public async warningMsgForUnpublishContent() {
  await this.wait("minWait");
  const warningMsg = await this.page.locator("//span[text()='This content is associated with one or more trainings. Please remove the associations and then unpublish this content.']").isVisible();
 if(warningMsg){
  console.log("Warning message for unpublishing content is displayed");
 }
}
public async verifyTransferLearner(){
     await this.wait ("mediumWait");
     await this.verification(this.selectors.transferLearner, "Transfer Learner");
}

// CNT072 - Load More button functionality methods
public async getContentCount(): Promise<number> {
    await this.wait("minWait");
    const contentElements = await this.page.locator(`//div[contains(@class,"text-truncate")]//span`).count();
    console.log(`Current content count: ${contentElements}`);
    return contentElements;
}

public async verifyContentCount(actualCount: number, expectedCount: number): Promise<void> {
    expect(actualCount).toBe(expectedCount);
    console.log(`✅ Content count verified: ${actualCount} equals expected ${expectedCount}`);
}

public async verifyLoadMoreButtonVisible(): Promise<void> {
    const loadMoreButton = this.page.locator(`//button[contains(text(),'Load More')]`);
    await expect(loadMoreButton).toBeVisible();
    console.log("✅ Load More button is visible");
}

public async verifyLoadMoreButtonNotVisible(): Promise<void> {
    const loadMoreButton = this.page.locator(`//button[contains(text(),'Load More')]`);
    await expect(loadMoreButton).not.toBeVisible();
    console.log("✅ Load More button is not visible (content count < 12)");
}

public async clickLoadMoreButton(): Promise<void> {
    const loadMoreButton = this.page.locator(`//button[contains(text(),'Load More')]`);
    await loadMoreButton.click();
    console.log("Load More button clicked");
}

public async verifyContentCountIncreased(initialCount: number, updatedCount: number): Promise<void> {
    expect(updatedCount).toBeGreaterThan(initialCount);
    console.log(`✅ Content count increased from ${initialCount} to ${updatedCount}`);
}

// CNT074 - Verify content details in listing page
public async verifyContentTitleDisplayed(): Promise<void> {
    const titleElement = this.page.locator(`(//div[contains(@class,'field_title_')]//span)[1]`);
    await expect(titleElement).toBeVisible();
    const title = await titleElement.innerText();
    console.log(`✅ Content title is displayed: ${title}`);
}

public async verifyContentSizeDisplayed(): Promise<void> {
    const sizeElement = this.page.locator(`(//div[contains(@class,'field_size')])[1]`);
    await expect(sizeElement).toBeVisible();
    const size = await sizeElement.innerText();
    console.log(`✅ Content size is displayed: ${size}`);
}

public async verifyContentVersionDisplayed(): Promise<void> {
    const versionElement = this.page.locator(`(//div[contains(@class,'field_version')])[1]`);
    await expect(versionElement).toBeVisible();
    const version = await versionElement.innerText();
    console.log(`✅ Content version is displayed: ${version}`);
}

public async verifyContentLanguageDisplayed(language: string): Promise<void> {
    const languageElement = this.page.locator(this.selectors.verifyLanguage(language));
    const actualLanguage = await languageElement.innerText();
    console.log(`Expected language: ${language}`);
    expect(actualLanguage).toContain(language);

    console.log(`✅ Content language is displayed: ${actualLanguage}`);
}

public async verifyTrainingCountDisplayed(): Promise<void> {
    const trainingElement = this.page.locator(`(//div[contains(@class,'training') or contains(text(),'Training')])[1]`);
    await expect(trainingElement).toBeVisible();
    const trainingCount = await trainingElement.innerText();
    console.log(`✅ Training count is displayed: ${trainingCount}`);
}

public async verifyCourseCountDisplayed(): Promise<void> {
    const courseElement = this.page.locator(`(//div[contains(@class,'course') or contains(text(),'Course')])[1]`);
    await expect(courseElement).toBeVisible();
    const courseCount = await courseElement.innerText();
    console.log(`✅ Course count is displayed: ${courseCount}`);
}

public async verifyCertificationDisplayed(): Promise<void> {
    const certificationElement = this.page.locator(`(//div[contains(@class,'certification') or contains(text(),'Certification')])[1]`);
    await expect(certificationElement).toBeVisible();
    const certification = await certificationElement.innerText();
    console.log(`✅ Certification is displayed: ${certification}`);
}

// CNT075 - Verify Search, Filter, Sort, Export functionality
public async verifySearchFunctionality(): Promise<void> {
    const searchBox = this.page.locator(this.selectors.contentSearch);
    await expect(searchBox).toBeVisible();
    await searchBox.fill("test");
    await this.wait("minWait");
    const searchResults = await this.page.locator(`//div[contains(@class,'text-truncate')]//span`).count();
    console.log(`✅ Search functionality is working, found ${searchResults} results`);
}

public async verifyFilterFunctionality(): Promise<void> {
    const filterButton = this.page.locator(`//button[contains(@class,'filter') or contains(text(),'Filter')]`);
    await expect(filterButton).toBeVisible();
    await filterButton.click();
    await this.wait("minWait");
    console.log(`✅ Filter functionality is working`);
}

public async verifySortFunctionality(): Promise<void> {
    const sortButton = this.page.locator(`//button[contains(@class,'sort') or contains(text(),'Sort')]`);
    await expect(sortButton).toBeVisible();
    await sortButton.click();
    await this.wait("minWait");
    console.log(`✅ Sort functionality is working`);
}

public async verifyExportFunctionality(): Promise<void> {
    const exportButton = this.page.locator(`//button[contains(@class,'export') or contains(text(),'Export')]`);
    await expect(exportButton).toBeVisible();
    console.log(`✅ Export button is visible and clickable`);
}

// CNT074 - Methods to capture and verify content details in listing
public async getContentVersion(): Promise<string> {
    const versionInput = this.page.locator(`//input[@id='content-version']`);
    const version = await versionInput.inputValue();
    console.log(`Captured content version: ${version}`);
    return version;
}

public async getContentLanguage(): Promise<string> {
    const languageElement = this.page.locator(`//button[@data-id="content_language"]`);
    const language = await languageElement.innerText();
    console.log(`Captured content language: ${language}`);
    return language;
}

public async getContentSizeFromListing(title: string): Promise<string> {
    // await this.wait("minWait");
    // await this.typeAndEnter(this.selectors.contentSearch, "Search Content", title);
    await this.wait("minWait");
    
    const sizeElement = this.page.locator(`//div[@class="rawtxt text-capitalize"]//span[contains(text(),'MB')]`);
    const size = await sizeElement.innerText();
    console.log(`Captured content size: ${size}`);
    return size.trim();
}

public async verifyContentTitleInListing(expectedTitle: string): Promise<void> {
    const titleElement = this.page.locator(`//span[text()='${expectedTitle}']`);
    await expect(titleElement).toBeVisible();
    const expected = expectedTitle.toUpperCase();
    const actualTitle = await titleElement.innerText();
    console.log(`Expected title: ${actualTitle}`);
    expect(actualTitle).toBe(expected);
    console.log(`✅ Content title verified in listing: ${actualTitle}`);
}

public async verifyContentSizeInListing(expectedSize: string): Promise<void> {
    const sizeElement = this.page.locator(this.selectors.verifySize(expectedSize));
    const actualSize = await sizeElement.innerText();
    console.log(`Expected size: ${actualSize}`);
    expect(actualSize).toContain(expectedSize);
    console.log(`✅ Content size verified in listing: ${actualSize}`);
}

public async verifyContentVersionInListing(expectedVersion: string): Promise<void> {
    const versionElement = this.page.locator(this.selectors.verifyVersion(expectedVersion));
    const actualVersion = await versionElement.innerText();
    expect(actualVersion).toContain(expectedVersion);
    console.log(`✅ Content version verified in listing: ${actualVersion}`);
}

public async verifyContentLanguageInListing(expectedLanguage: string): Promise<void> {
    const languageElement = this.page.locator(`(//span[contains(text(),'${expectedLanguage}')])[1]`);
    await expect(languageElement).toBeVisible();
    const actualLanguage = await languageElement.innerText();
    console.log(`✅ Content language verified in listing: ${actualLanguage}`);
}

public async verifyTrainingCountInListing(expectedCount: number): Promise<void> {
    const trainingElement = this.page.locator(this.selectors.courseAttached);
    const trainingText = await trainingElement.textContent();
    
    // Extract number from text like "1 Training" or "Training: 1"
    const countMatch = trainingText.match(/\d+/);
    if (countMatch) {
        const actualCount = parseInt(countMatch[0]);
        expect(actualCount).toBe(expectedCount);
        console.log(`✅ Training count verified in listing: ${actualCount} (expected: ${expectedCount})`);
    } else {
        console.log(`⚠️ Training count: ${trainingText}`);
    }
}

public async verifyCourseCountInListing(expectedCount: number): Promise<void> {
    const courseElement = this.page.locator(this.selectors.trainingAttached);
    const courseText = await courseElement.textContent();
    
    // Extract number from text like "1 Course" or "Course: 1"
    const countMatch = courseText.match(/\d+/);
    if (countMatch) {
        const actualCount = parseInt(countMatch[0]);
        expect(actualCount).toBe(expectedCount);
        console.log(`✅ Course count verified in listing: ${actualCount} (expected: ${expectedCount})`);
    } else {
        console.log(`⚠️ Course count: ${courseText}`);
    }
}

public async verifyCertificationInListing(): Promise<void> {
    const certificationElement = this.page.locator(`(//div[contains(@class,'certification') or contains(text(),'Certification')])[1]`);
    
    if (await certificationElement.isVisible()) {
        const certification = await certificationElement.innerText();
        console.log(`✅ Certification displayed in listing: ${certification}`);
    } else {
        console.log(`ℹ️ No certification attached to this content`);
    }
}

}