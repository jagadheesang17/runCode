import { BrowserContext, expect, Page } from "@playwright/test";
import { AdminHomePage, } from "./AdminHomePage";
import { AdminGroupPage , } from "./AdminGroupPage";
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
    editContent:`//a[text()="Edit Content"]`,
    uploadURL:`//input[@name="content_url"]`,
    addURL:`//button[text()='Add URL']`,
    dltBtn:`//i[@aria-label="delete"]`,
    clickYes:`//button[text()='Yes']`,
    DefaultDuration:`(//input[@class="text-end form-control lms-border-end border-0 px-1 form_field_active"])[2]`,
    AdminCode:`//input[@label="content code"]`,
  
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
public async getCntCode(){
    const cntCode = await this.page.locator(this.selectors.AdminCode).inputValue();
    console.log("Content Code is:", cntCode);
    return cntCode;
}
public async uploadURL(url: string) 
{
    await this.click(this.selectors.uploadURL, "URL","")
    await this.wait("minWait")
    await this.keyboardType(this.selectors.uploadURL, url)
    await this.click(this.selectors.addURL, "Add URL", "Button");
    await this.wait("minWait")
}
public async getContentType(){
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
    await this.type(
      this.selectors.contentDesc,
      "Content Description",
      "text field"
    );
  }
  public async verifyURLERRMsg(msg:string){
    await this.validateElementVisibility(this.selectors.verifyURLERRMsg(msg),"URL Error Message")
    const text= await this.getInnerText(this.selectors.verifyURLERRMsg(msg))
    console.log(text)
    expect(text).toBe(msg);
        
}
public async dltFuncUpload(data:string){
    await this.click(this.selectors.dltBtn,"Delete","Button")
    this.wait("minWait");
    await expect(this.page.locator("//span[contains(text(),'Are you sure you want to delete the attached content')]")).toContainText(data)
    this.wait("minWait");
    await this.click(this.selectors.clickYes,"Yes","Button")
}

public async compareTitle(Contitle:string){
    let title=await this.page.locator('#content-title').inputValue();
    console.log("Title from page:", title)
    expect(Contitle).toContain(title);
    
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
  public async getDefaultDuration(DefaultDuration:string){ 
    await this.wait("minWait"); 
    const duration = await this.page.locator(this.selectors.DefaultDuration).inputValue();
    console.log("Default Duration is:", duration);
    if(DefaultDuration.includes(duration)){
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
}
