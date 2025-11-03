import { BrowserContext, expect, Page } from "@playwright/test";
import { AdminHomePage } from "./AdminHomePage";
import * as fs from "fs";
import * as path from "path";

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
    // URL and validation selectors based on screenshot
    urlInput: `//input[@placeholder='https://']`,
    addUrlButton: `//button[text()='Add URL']`,
    alertErrorMessage: `//div[contains(@class,'alert')]//ul//span`,
    fileUploadArea: `//div[contains(text(),'DRAG AND DROP YOUR FILES OR') and contains(text(),'CLICK HERE TO UPLOAD')]`,
    validationMessage: `//div[contains(text(),'Please upload') or contains(text(),'required') or contains(text(),'invalid')]`,
    publishButton: `//button[text()='Publish']`,
  };

  constructor(page: Page, context: BrowserContext) {
    super(page, context);
    // this.fileName = "AICC File containing a PPT - Storyline 11.zip"
    // this.path = `../data/${this.fileName}`
  }

  public async clickCreateContent() {
    await this.wait("mediumWait");
    await this.click(this.selectors.contentButton, "CreateContent", "Button");
  }

  public async enterTitle(title: string) {
    await this.type(this.selectors.contentTitle, "Content title", "text field");
  }

  public async enterDescription(title: string) {
    await this.type(
      this.selectors.contentDesc,
      "Content Description",
      "text field"
    );
  }

  public async uploadContent(fileName: string) {
    this.path = `../data/${fileName}`;
    await this.wait("mediumWait");
    await this.uploadFile(this.selectors.addContent, this.path);
    await this.wait("mediumWait");
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
    await this.type(this.selectors.contentSearch, "File Name", fileName);
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
  public async gotoListing() {
    await this.wait("mediumWait");
    await this.validateElementVisibility(
      this.selectors.contentListing,
      "Goto Listing"
    );
    await this.click(this.selectors.contentListing, "Goto Listing", "Button");
    await this.wait("maxWait");
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

  // URL input methods
  public async enterInvalidUrl(url: string) {
    await this.wait("minWait");
    await this.type(this.selectors.urlInput, "URL Input", url);
  }

  public async clickAddUrl() {
    await this.wait("minWait");
    await this.click(this.selectors.addUrlButton, "Add URL", "Button");
  }

  public async verifyAlertErrorMessage(expectedText: string) {
    await this.wait("minWait");
    await this.validateElementVisibility(this.selectors.alertErrorMessage, "Alert Error Message");
    const actualText = await this.getInnerText(this.selectors.alertErrorMessage);
    console.log(`Actual error message: ${actualText}`);
    expect(actualText).toContain(expectedText);
  }

  public async clickPublish() {
    await this.click(this.selectors.publishButton, "Publish", "Button");
  }

  public async uploadUnsupportedFile(fileName: string) {
    this.path = `../data/${fileName}`;
    await this.wait("mediumWait");
    try {
      await this.uploadFile(this.selectors.addContent, this.path);
      await this.wait("mediumWait");
    } catch (error) {
      console.log(`File upload failed as expected for unsupported file: ${fileName}`);
    }
  }
}
