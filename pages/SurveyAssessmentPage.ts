import { Page, BrowserContext } from "@playwright/test";
import { AdminHomePage } from "./AdminHomePage";
import { FakerData, score } from "../utils/fakerUtils";

export class SurveyAssessmentPage extends AdminHomePage {

  public selectors = {
    ...this.selectors,
    createQuestionBtn: "//button[text()='Create Question']",
    createSurveyBtn: "//button[text()='CREATE SURVEY']",
    questionsInput: "//label[text()='Questions']/following-sibling::input",
    languageBtn: "(//label[text()='Language']/parent::div//button)[1]",
    language: (language: string) => `//div[@class='dropdown-menu show']//span[text()='${language}']`,
    typeBtn: "(//label[text()='Type']/parent::div//button)[1]",
    typeItem: "//label[text()='Type']/following-sibling::div//a[contains(@class,'dropdown-item')]",
    //typeItem:(dropdownItem:string)=>`(//label[text()='Type']/following-sibling::div//a[contains(@class,'dropdown-item')])${dropdownItem}`,
    typeValue: "//label[text()='Type']/parent::div//button//div[@class='filter-option-inner-inner']",
    displayOptionBtn: "(//label[text()='Display Options']/parent::div//button)[1]",
    displayOptionList: "//label[text()='Display Options']/parent::div//a[@class='dropdown-item']",
    option1Input: "//label[text()='Option 1']/parent::div/following-sibling::input",
    option2Input: "//label[text()='Option 2']/parent::div/following-sibling::input",
    row1Input: "//label[text()='Row 1']/parent::div/following-sibling::input",
    row2Input: "//label[text()='Row 2']/parent::div/following-sibling::input",
    saveBtn: "//button[text()='Save' and @id='question-btn-save']",
    scoreInput: "(//label[text()='Score']/following-sibling::input)[1]",
    radioBtn: "//label[contains(text(),'Option')]/parent::div//i[contains(@class,'fa-circle icon')]",
    checkBoxBtn: "(//label[contains(text(),'Option')]/parent::div//i[contains(@class,'fa-square icon')])[1]",
    imageInput: `(//input[@id='question_upload_file_opt'])[1]`,
    survelTitle: "//label[text()='Survey Title']//following-sibling::input",
    descriptionInput: "//div[@id='assessment-description']//p",
    saveDraftBtn: "//button[text()='Save Draft']",
    proceedBtn: "//button[text()='Yes, Proceed']",
    importQuestionIcon: "//i[contains(@id,'import')]",
    questionType: "//div[text()='Question Type']",
    questionLibCheckbox: "//div[contains(@id,'queslib-list')]//i[contains(@class,'fa-square icon')]",
    addSelectedQuestionBtn: "//button[text()='Add Selected Questions']",
    importQuestionBtn: "//button[text()='Import Questions']",
    publishBtn: "//button[text()='Publish']",
    unpublishBtn: "//button[text()='Unpublish']",
    unpublishedTab: "//button[text()='Unpublished']",
    searchFieldUnpublished: "//input[@id='exp-search-field']",
    deleteIcon: "(//a[@aria-label='Delete'])[1]",
    removeBtn: "//button[text()='Remove']",
    cloneIcon: "//a[@aria-label='Clone']",
    cloneIconForSurvey: (surveyTitle: string) => `//div[contains(text(),'${surveyTitle}')]//following::a[@aria-label='Clone'][1]`,
    associationWarningMsg: "//span[contains(text(),'Please remove the associations before')]",
    okBtn: "//button[text()='OK']",
    successfullMessage: "//div[@id='lms-overall-container']//h3",
    createAssessment: `//button[text()='CREATE ASSESSMENT']`,
    assessmentTitle: `//label[text()='Assessment Title']//following-sibling::input`,
    passPercentage: `//input[@id='pass_percentage']`,
    randomizedropdown: `(//label[text()='Randomize']/following::button)[1]`,
    randomizeOption: (option: string) => `(//a/span[text()='${option}'])`,
    noOfAttempts: `//input[@id='attempts']`,
    randomizeDD: `(//label[text()='Randomize']//following::button)[1]`,
    noBtn: `//span[text()='No']`,
    plusIcon: "#actiondiv_create_que",
    addQuestionBlankBtn: "(//div[@id='actiondiv']//parent::div)[1]",

    // Assessment video upload:-
    assessment_video_upload: "#question_upload_file"









  }
  constructor(page: Page, context: BrowserContext) {
    super(page, context);
  }
  async clickCreateSurvey() {
    await this.wait('minWait');
    await this.validateElementVisibility(this.selectors.createSurveyBtn, "Survey");
    await this.click(this.selectors.createSurveyBtn, "Survey", "Button");
  }

  async clickCreateAssessment() {
    await this.validateElementVisibility(this.selectors.createAssessment, "Survey");
    await this.click(this.selectors.createAssessment, "Survey", "Button");
  }
  async clickCreateQuestions() {
    await this.wait('maxWait');
    await this.validateElementVisibility(this.selectors.createQuestionBtn, "Questions");
    await this.click(this.selectors.createQuestionBtn, "Questions", "Button");
  }

  async enterQuestions() {
    
    // await this.page.keyboard.press('PageUp')
    await this.wait('minWait');
    await this.validateElementVisibility(this.selectors.questionsInput, "Input");
    await this.page.waitForTimeout(1000)
    await this.type(this.selectors.questionsInput, "Input", FakerData.generateQuestion());
  }


  async selectRandomize() {
    await this.click(this.selectors.randomizeDD, "Randomize", "Dropdown");
    await this.click(this.selectors.noBtn, "No", "List");
  }

  async selectLanguage() {
    let pickedLanguage = "English"
    await this.click(this.selectors.languageBtn, "Language", "Button");
    await this.click(this.selectors.language(pickedLanguage), "Language", "DropDown");
  }

    async selectingType(value?: "Image - Checkbox" | "Image - Radio Button"
    | "Checkbox" | "Dropdown"
    | "Radio button" | "Grid/Matrix - Checkbox" | "Paragraph"
    | "Short answer" | "Like/Dislike" | "Overall rating", attachvideo?: true | false) {
      await this.wait('minWait');
      await this.wait('maxWait')
      await this.page.locator(this.selectors.typeBtn).scrollIntoViewIfNeeded();
    
    // Retry mechanism for type selection
    let typeSelectionSuccess = false;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (!typeSelectionSuccess && retryCount < maxRetries) {
      try {
        console.log(`Attempting to select type, attempt ${retryCount + 1}`);
        
        // Click type dropdown button
        await this.click(this.selectors.typeBtn, "Type", "Button");
        await this.wait('minWait');
        
        if (value !== undefined) {
          // Wait for dropdown to be visible and click specific value
          await this.page.waitForSelector(`//span[text()='${value}']`, { timeout: 5000 });
          await this.page.click(`//span[text()='${value}']`);
        } else {
          // Select random type
          const itemXpath = this.selectors.typeItem;
          await this.page.waitForSelector(itemXpath, { timeout: 5000 });
          const count = await this.page.locator(itemXpath).count();
          const randomIndex = Math.floor(Math.random() * count) + 1;
          await this.click(`(${itemXpath})[${randomIndex}]`, "List", "List");
        }
        
        // Verify selection was successful by checking if dropdown closed
        await this.wait('minWait');
        const dropdownStillOpen = await this.page.locator("//div[@class='dropdown-menu show']").isVisible({ timeout: 2000 });
        
        if (!dropdownStillOpen) {
          typeSelectionSuccess = true;
          console.log(`✓ Type selection successful on attempt ${retryCount + 1}`);
        } else {
          throw new Error("Dropdown still open - selection may have failed");
        }
        
      } catch (error) {
        console.log(`⚠ Type selection attempt ${retryCount + 1} failed: ${error.message}`);
        retryCount++;
        
        if (retryCount < maxRetries) {
          console.log("Retrying type selection...");
          await this.wait('minWait');
          
          // Try to close any open dropdowns before retry
          await this.page.keyboard.press('Escape');
          await this.wait('minWait');
        } else {
          console.log("❌ All type selection attempts failed");
          throw new Error(`Failed to select type after ${maxRetries} attempts: ${error.message}`);
        }
      }
    }
    
    let typeValue: any;
    if (value !== undefined) {
      typeValue = value;
    } else {
      typeValue = await this.getInnerText(this.selectors.typeValue);
      console.log("Select type is " + typeValue);
    }
    const scoreInput = this.page.locator(this.selectors.scoreInput);

    switch (typeValue) {

      case "Radio button":

        await this.type(this.selectors.option1Input, "Input", FakerData.getRandomTitle());
        await this.type(this.selectors.option2Input, "Input", FakerData.getRandomTitle());
        if (await scoreInput.isVisible()) {
          await this.type(this.selectors.scoreInput, "Score", score())
          const radioBtn = this.page.locator(`(${this.selectors.radioBtn})[${1}]`);
          await radioBtn.click();
        }
        break;

      case "Radio Button":

        await this.type(this.selectors.option1Input, "Input", FakerData.getRandomTitle());
        await this.type(this.selectors.option2Input, "Input", FakerData.getRandomTitle());
        if (await scoreInput.isVisible()) {
          await this.type(this.selectors.scoreInput, "Score", score())
          const radioBtn = this.page.locator(`(${this.selectors.radioBtn})[${1}]`);
          await radioBtn.click();
        }
        break;

      case "Checkbox":

        await this.type(this.selectors.option1Input, "Input", FakerData.getRandomTitle());
        await this.type(this.selectors.option2Input, "Input", FakerData.getRandomTitle());

        if (await scoreInput.isVisible()) {
          await this.type(this.selectors.scoreInput, "Score", score());
          const checkBoxCount = await this.page.locator(this.selectors.checkBoxBtn).count();
          const checkBoxBtn = this.page.locator(`(${this.selectors.checkBoxBtn})[${1}]`);
          await checkBoxBtn.click();
        }
        break;

      case "Dropdown":

        await this.type(this.selectors.option1Input, "Input", FakerData.getRandomTitle());
        await this.type(this.selectors.option2Input, "Input", FakerData.getRandomTitle());

        if (await scoreInput.isVisible()) {
          await this.type(this.selectors.scoreInput, "Score", score());
          const radioCount = await this.page.locator(this.selectors.radioBtn).count();
          const radioBtn = this.page.locator(`(${this.selectors.radioBtn})[${1}]`);
          await radioBtn.click();
        }
        break;

      case "Grid/Matrix - Checkbox":

        await this.type(this.selectors.row1Input, "Input", FakerData.getRandomTitle());
        await this.type(this.selectors.row2Input, "Input", FakerData.getRandomTitle());
        await this.type(this.selectors.option1Input, "Input", FakerData.getRandomTitle());
        await this.type(this.selectors.option2Input, "Input", FakerData.getRandomTitle());
        break;

      case "Short answer":
        // Add implementation here
        break;

      case "Paragraph":
        // Add implementation here
        break;

      case "Like/Dislike":
        // Add implementation here
        break;

      case "Overall rating":
        // Add implementation here
        break;

      case "Image - Radio Button":

        if (await scoreInput.isVisible()) {
          await this.type(this.selectors.scoreInput, "Score", score());
          //const radioCount = await this.page.locator(this.selectors.radioBtn).count();
          const radioBtn = this.page.locator(`(${this.selectors.radioBtn})[${1}]`);
          await this.page.locator(this.selectors.imageInput).scrollIntoViewIfNeeded();
          const count = await this.page.locator(this.selectors.imageInput).count();
          for (let index = 0; index <= count; index++) {
            const qa = "../data/Q1.jpg"
            await this.uploadFile(this.selectors.imageInput, qa);
            await this.wait('minWait');
          }
          await radioBtn.click();

        }
        break;

      case "Image - Checkbox":

        if (await scoreInput.isVisible()) {
          await this.type(this.selectors.scoreInput, "Score", await score());
          // const checkBoxCount = await this.page.locator(this.selectors.checkBoxBtn).count();
          const checkBoxBtn = this.page.locator(`(${this.selectors.checkBoxBtn})[${1}]`);
          await checkBoxBtn.click();
          const count = await this.page.locator(this.selectors.imageInput).count();
          for (let index = 0; index <= count; index++) {
            const qa = "../data/Q1.jpg"
            await this.uploadFile(this.selectors.imageInput, qa);
            await this.wait('minWait');
          }
        }
        break;

      default:
        console.error("Unknown button type:", typeValue);
    }
    if (attachvideo) {
      await this.waitSelector(this.selectors.assessment_video_upload);
      const uploadAssessmentVideo = "../data/samplevideo2.mp4"
      await this.uploadFile(this.selectors.assessment_video_upload, uploadAssessmentVideo);
    }

  }

  
  async clickOnPlusIcon() {
    await this.page.waitForTimeout(2000);
    await this.mouseHover(this.selectors.plusIcon, "Plus Icon");
    await this.wait('minWait');
    await this.click(this.selectors.plusIcon, "Plus Icon", "Icon");
    await this.wait('minWait');
    await this.page.keyboard.press('PageDown')
  }
  // async triggerAxisClick() {
  //   await this.page.keyboard.press('PageDown');
  //   await this.page.waitForTimeout(2000);
  //   const elementHandle = await this.page.locator(this.selectors.addQuestionBlankBtn).elementHandle();
  //   const boundingBox = await elementHandle.boundingBox();
  //   let X: number;
  //   let Y: number;

  //   if (boundingBox) {
  //     X = boundingBox.x;
  //     Y = boundingBox.y;
  //     // console.log(`X: ${X}, Y: ${Y}`);
  //   } else {
  //     console.log('Element not found');
  //   }
  //   if (boundingBox) {
  //     let modifiedX = Math.floor(X) + 30;
  //     let modifiedY = Math.floor(Y) + 30;
  //     await this.page.hover(this.selectors.addQuestionBlankBtn, { position: { x: 0, y: 0 } })
  //     await this.handleAxisCoordinateClick(modifiedX, modifiedY);
  //   }
  //   await this.page.waitForTimeout(2000);
  //   await this.page.keyboard.press('PageDown');

  // }

  async clickBlankActionBtn() {
    await this.page.waitForTimeout(2000);
    await this.page.locator("//div[@id='actiondiv']/parent::div").hover({ force: true ,timeout:3000});
    await this.page.locator("//div[@id='actiondiv']/parent::div").click({ force: true ,delay:400});
    await this.page.waitForTimeout(2000);
  }

  async displayOption() {
    if (await this.page.isVisible(this.selectors.displayOptionBtn)) {

      await this.wait('minWait');
      await this.page.keyboard.press('PageUp')
      await this.page.locator(this.selectors.displayOptionBtn).scrollIntoViewIfNeeded();
      await this.click(this.selectors.displayOptionBtn, "Display Option", "Button");
      const dropdownList = this.selectors.displayOptionList
      const count = await this.page.locator(dropdownList).count();
      const randomIndex = Math.floor(Math.random() * count) + 1;
      await this.click(`(${dropdownList})[${randomIndex}]`, "List", "List");

    }
    else {
      console.log("Element not found")
    }
  }
  async fillSurveyTitle(data: string) {
    await this.type(this.selectors.survelTitle, "Title", data);
  }


  async fillAssessmentTitle(data: string) {
    await this.type(this.selectors.assessmentTitle, "Title", data);
  }

  async fillDescription() {
    await this.type(this.selectors.descriptionInput, "Description", FakerData.getDescription());
  }

  async importQuestion() {
    await this.wait('minWait');
    await this.page.locator(this.selectors.importQuestionIcon).scrollIntoViewIfNeeded({ timeout: 5000 });
    await this.click(this.selectors.importQuestionIcon, "Import", "Idiomatic Text");
    await this.wait('minWait');
    let questionType = this.page.locator(this.selectors.questionType)
    if (!await questionType.isVisible()) {
      await this.click(this.selectors.importQuestionIcon, "Import", "Idiomatic Text");
    }

    await this.mouseHover(this.selectors.questionType, "Question Type");
    let checkBox = this.selectors.questionLibCheckbox;
    let count = await this.page.locator(checkBox).count();
    let generatedNumbers: number[] = [];
    for (let i = 0; i < 4; i++) {
      let randomIndex: number;
      do {
        randomIndex = Math.floor(Math.random() * count) + 1;
      } while (generatedNumbers.includes(randomIndex));
      generatedNumbers.push(randomIndex);
      await this.click(`(${checkBox})[${randomIndex}]`, "Questions", "Checkbox");
    }
    await this.wait("minWait");
  }

  async clickAddSelectedQuestion() {
    await this.mouseHover(this.selectors.addSelectedQuestionBtn, "Add Selected Question");
    await this.click(this.selectors.addSelectedQuestionBtn, "Add Selected Question", "Button");
  }

  async clickImportQuestion() {
    await this.mouseHover(this.selectors.importQuestionBtn, "Import Question");
    await this.click(this.selectors.importQuestionBtn, "Import Question", "Button");
    await this.wait('mediumWait');
    await this.page.keyboard.press('PageDown');
    await this.spinnerDisappear();
  }


  async enterPasspercentage(data: string) {
    await this.type(this.selectors.passPercentage, "Pass Percentage", data)
  }


  async selectRandomizeOption(option: string) {
    await this.click(this.selectors.randomizedropdown, "Randomize", "Dropdown")
    await this.click(this.selectors.randomizeOption(option), "Randomize ", "option")
  }

  async enterNofAttempts(data: string) {
    await this.type(this.selectors.noOfAttempts, "No. Of Attempts", data)
  }

  async clickPublish() {
    //await this.validateElementVisibility(this.selectors.publishBtn, "Publish")
    // await this.wait("maxWait")
    await this.page.locator(this.selectors.publishBtn).scrollIntoViewIfNeeded({ timeout: 5000 });
    //await this.mouseHover(this.selectors.publishBtn, "Publish");
    await this.page.getByRole('button', { name: 'Publish' }).waitFor({ state: 'visible', timeout: 5000 });
    await this.page.getByRole('button', { name: 'Publish' }).click();
    


    
    //await this.click(this.selectors.publishBtn, "Publish", "Button");
  }

  async clickUnpublish() {
    await this.page.locator(this.selectors.unpublishBtn).waitFor({ state: 'visible', timeout: 5000 });
    await this.page.locator(this.selectors.unpublishBtn).scrollIntoViewIfNeeded({ timeout: 5000 });
    await this.click(this.selectors.unpublishBtn, "Unpublish", "Button");
  }

  async verifySurveyAssociationWarning() {
    await this.validateElementVisibility(this.selectors.associationWarningMsg, "Association Warning Message");
    await this.verification(this.selectors.associationWarningMsg, "Please remove the associations before");
    await this.click(this.selectors.okBtn, "OK", "Button");
  }

  async clickCloneSurvey(surveyTitle: string) {
    await this.wait("minWait");
    await this.validateElementVisibility(this.selectors.cloneIconForSurvey(surveyTitle), `Clone icon for survey: ${surveyTitle}`);
    await this.click(this.selectors.cloneIconForSurvey(surveyTitle), `Clone ${surveyTitle}`, "Icon");
    await this.wait("mediumWait");
    await this.spinnerDisappear();
  }

  async clickUnpublishedTab() {
    await this.wait("minWait");
    await this.validateElementVisibility(this.selectors.unpublishedTab, "Unpublished Tab");
    await this.click(this.selectors.unpublishedTab, "Unpublished", "Tab");
    await this.wait("mediumWait");
    await this.spinnerDisappear();
  }

  async searchUnpublishedSurvey(surveyTitle: string) {
    await this.wait("minWait");
    await this.validateElementVisibility(this.selectors.searchFieldUnpublished, "Search Field");
    await this.type(this.selectors.searchFieldUnpublished, "Search", surveyTitle);
    await this.page.keyboard.press('Enter');
    await this.wait("mediumWait");
    await this.spinnerDisappear();
  }

  async clickDeleteSurvey() {
    await this.wait("minWait");
    await this.validateElementVisibility(this.selectors.deleteIcon, "Delete Icon");
    await this.click(this.selectors.deleteIcon, "Delete", "Icon");
    await this.wait("minWait");
  }

  async clickRemove() {
    await this.wait("minWait");
    await this.validateElementVisibility(this.selectors.removeBtn, "Remove Button");
    await this.click(this.selectors.removeBtn, "Remove", "Button");
    await this.wait("mediumWait");
    await this.spinnerDisappear();
  }

  async clickSaveDraft() {
    await this.mouseHover(this.selectors.saveDraftBtn, "Save")
    await this.click(this.selectors.saveDraftBtn, "Save", "Button");
    await this.spinnerDisappear();
  }

  async clickProceed() {
    await this.wait('mediumWait');
    await this.click(this.selectors.proceedBtn, "Save", "Button");
    //await this.spinnerDisappear();
  }

  async clickSave() {
    //await this.page.pause()
    await this.click(this.selectors.saveBtn, "Save", "Button");
    await this.spinnerDisappear();
  }

  async verifySuccessMessage() {
    await this.spinnerDisappear();
    await this.verification(this.selectors.successfullMessage, "successfully");
  }

}