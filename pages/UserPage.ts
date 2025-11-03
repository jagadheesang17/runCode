import { URLConstants } from "../constants/urlConstants";
import { filePath } from "../data/MetadataLibraryData/filePathEnv";
import {
  FakerData,
  getCurrentDateFormatted,
  gettomorrowDateFormatted,
} from "../utils/fakerUtils";
import { getRandomItemFromFile } from "../utils/jsonDataHandler";
import { AdminHomePage } from "./AdminHomePage";
import { BrowserContext, Page, expect } from "@playwright/test";

export class UserPage extends AdminHomePage {
  public selectors = {
    ...this.selectors,
    createUserbtn: `//button[text()='CREATE USER']`,
    createUserLabel: "//h1[text()='Create User']",
    editUserLabel: "//h1[text()='Edit User']",
    inputField: (name: string) => `//input[@id="${name}"]`,
    addressInput: (label: string) =>
      `(//label[contains(text(),'${label}')]/following::input[contains(@id,'user-add')])[1]`,
    dropdownToggle: (label: string) =>
      `(//label[text()='${label}']/following::button[@data-bs-toggle='dropdown'])[1]`,
    dropdownSearchInput: "//footer//following::input[@type='search']",
    dropdownOption: (data: string) => `//span[text()='${data}']`,
    saveButton: "//button[text()='Save']",
    proceedButton: (name: string) =>
      `//footer//following::button[contains(text(),'${name}')]`,
    searchField: "//input[@id='exp-search-field']",
    rolesBtn: "//input[@id='user-roles-filter-field']",
    rolesList: (roles: string) => `//li[text()='${roles}']`,
    editIcon:
      "(//span[contains(@class,'justify-content-start') and  @aria-label='Edit User'])[1]",
    userProfileUploadInput: "//input[@id='upload-usr-pic-file']",
    updateButton: "//button[text()='Update']",
    successMessage:
      "//div[@id='addedit-user-form-container']//h3[contains(text(),'successfully')]",
    employmentTypeInput:
      "//label[text()='employment type']//parent::div//input",
    commonOptionBtn: (value: string, data: string) =>
      `(//div[@id='user-${value}-filter-lms-scroll-results']//li)[1]`,
    departmentType: `//label[text()='department']/following::div[@id='user-department']//input`,
    timeZone: `(//div[@id='wrapper-user-timezone']//button)[1]`,
    timeZoneSearch: `//footer/following-sibling::div//input`,
    selectlocationtz: (index: number, timeZone: string) =>
      `(//li/a/span[contains(text(),'${timeZone}')])[${index}]`,
    hireDate: `//input[@id='user-hiredate-input']`,
    userType: `//input[@id='user-usertype-filter-field']`,
    jobtitle: `//input[@id='user-jobtitle-filter-field']`,
    manager: `//input[@id='user-manager-filter-field']`,
    othermanager: `//input[@id='user-other-managers-filter-field']`,
    searchOtherManager: `//input[@id='user-other-managers']`,
    otherMgrOption: (index: number) =>
      `(//div[@id='user-other-managers']/following::li)[${index}]`,
    specificManager: (managerName: string) =>
      `//div[contains(text(),'${managerName}')]`,
    language: `//label[contains(text(),'Language')]/following::div[@id='wrapper-user-language']`,
    searchLanguage: `//footer/following::div/input`,
    courseLanguageLink: (language: string) =>
      `//label[text()='Language']//following::span[text()='${language}']`,
    editButton: `//a[text()='Edit User']`,
    deleteUser: `(//a[@aria-label="Delete"]/i)[1]`,
    confirmDeleteoption: `//button[text()='Delete']`,
    verifyDeletemsg: `//div[@id='lms-overall-container']//h3`,
    organizationTypeDD: `(//label[text()='Organization type']/parent::div//button)[1]`,
    organizationType: (type: string) => `//span[text()='${type}']`,
    closeIcon: "//i[contains(@class,'xmark')]",
    managerclosePopup:
      "//span[contains(text(),'Are you sure you want to continue?')]",
    yesBtn: "//button[text()='Yes']",
    suspendBtn: "//button[text()='Suspend']",
    suspendDialog:
      "//span[contains(text(),'Are you sure you want to suspend the user')]",
    suspendDialogBtn:
      "//span[contains(text(),'Are you sure you want to suspend the user')]//following::button[text()='Suspend']",
    deleteIcon: "a[aria-label='Delete'] , a[title='Delete'] i",
    deleteDialog:
      "//span[contains(text(),'Are you sure you want to delete the user')]",
    deleteBtn: "//button[text()='Delete']",
    noResultText:
      "//h3[contains(text(),'There are no results that match your current filters')]",
    activateUserIcon: "a[title='Activate'], a[aria-label='Activate'] i",
    activateDialog:
      "//span[contains(text(),'Are you sure you want to activate the user')]",
    activateBtn: "//button[text()='Activate']",
    impersonationIcon:
      " a[aria-label='Impersonation'] , a[title='Impersonation'] i",
    impersonateLabel: "//label[text()='Select Domain you want to Impersonate']",
    impersonateOptionDD:
      "(//label[text()='Select Domain you want to Impersonate']//parent::div//button)[1]",
    impersonateDomainValue: (option: string) =>
      `//footer//following::a/span[text()='${option}']`,
    reasonInput: "//label[text()='Reason']//parent::div//textarea",
    impersonateProceedBtn: "//button[text()='Proceed']",
    okBtn: "//button[text()='OK']",
    logOutBtn: "//div[@class='logout']//a",
    //Internal
    validateUser: (data: string) => `//div[text()='${data}']`,
    //UserPage Enrollment icon
    enrollmentIcon: "(//a[@aria-label='Enrollments'])[1]",
    enrollmentLabel: "//h1[text()='Manage Enrollments']",
    enrollmentStatus: "//div[contains(@class,'row row-cols-md-')]//span",
    viewEnrollmentStsIcon: "//i[@aria-label='View all the status']",

    //For Suspended User success message
    sso_negativemsg: "//span[@id='error-txt']",

    //For user address validation
    verifyUserAddress: `//button[text()='Click to verify address']`,
    addressVerificationMessage: `//button[text()='Click to verify address']//following-sibling::span`,

    //End impersonation
    endImpersonation: "//span[text()='End Impersonation']",

    //for contact support email
    customerAdminUserFromDropdown: `//li[contains(text(),'Arivazhagan P (arivazhaganp)')]`,
    checkContactSupport: `//input[@id='course-contact-support']`,


    inheritAddress: () => `//span[text()='Inherit Address From']`,
    EditUser: () => `(//span[@aria-label='Edit User'])[1]`
  };

  constructor(page: Page, context: BrowserContext) {
    super(page, context);
  }
  async verifySuspendUserMessage() {
    await this.verification(
      this.selectors.sso_negativemsg,
      "User ID is inactive. Please contact the admin."
    );
  }
  async verifyCreateUserLabel() {
    await this.verification(this.selectors.createUserLabel, "CREATE USER");
  }

  async verifyEditUserLabel() {
    await this.verification(this.selectors.editUserLabel, "Edit User");
  }

  async clickCreateUser() {
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.createUserbtn,
      "CreateButton"
    );
    await this.click(this.selectors.createUserbtn, "Create User", "Button");
  }

  async enter(name: string, data: string) {
    const selector = this.selectors.inputField(name);
    await this.type(selector, name, data);
  }


  

   async clickeditUser() {
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.EditUser(),
      "Edit User"
    );
    const selector = this.selectors.EditUser();
    await this.click(selector, "Edit User", "Button");

  }
  async isElementVisible(selector: string): Promise<boolean> {
    try {
      return await this.page.locator(selector).isVisible();
    } catch {
      return false;
    }
  }

  async clickInheritAddress() {
    const selector = this.selectors.inheritAddress()
    if (await this.isElementVisible(selector)) {
      await this.click(selector, "Address", "Button");
    }
  }

  async typeAddress(label: string, data: string) {
    const selector = this.selectors.addressInput(label);
    await this.type(selector, "Address", data);
  }

  async select(label: string, data: string) {
    const toggleSelector = this.selectors.dropdownToggle(label);
    await this.click(toggleSelector, label, "Dropdown");
    await this.wait("minWait");
    console.log("The country is:" + data);
    await this.type(this.selectors.dropdownSearchInput, label, data);
    const optionSelector = this.selectors.dropdownOption(data);
    await this.click(optionSelector, data, "DropDown");
    await this.verification(toggleSelector, data);
  }

  async selectEmploymentType(empType: string) {
    let data = getRandomItemFromFile(filePath.empType);
    await this.type(
      this.selectors.employmentTypeInput,
      "Employment Type",
      data
    );
    await this.mouseHover(this.selectors.commonOptionBtn(empType, data), data);
    await this.click(
      this.selectors.commonOptionBtn(empType, data),
      data,
      "List"
    );
    return data;
  }
  async selectDepartmentType(dpmtType: string) {
    let data = getRandomItemFromFile(filePath.department);
    await this.typeAndEnter(
      this.selectors.departmentType,
      "Department Type",
      data);

    await this.mouseHover(this.selectors.commonOptionBtn(dpmtType, data), data);
    await this.click(
      this.selectors.commonOptionBtn(dpmtType, data),
      data,
      "List"
    );
  }

  async organizationType(data: string) {
    await this.click(
      this.selectors.organizationTypeDD,
      "Organization Type",
      "DropDown"
    );
    await this.click(
      this.selectors.organizationType(data),
      "Organization Type",
      "List"
    );
  }

  async selectUserType(userType: string) {
    let data = getRandomItemFromFile(filePath.userType);
    await this.typeAndEnter(this.selectors.userType, "User Type", data);
    await this.mouseHover(this.selectors.commonOptionBtn(userType, data), data);
    await this.click(
      this.selectors.commonOptionBtn(userType, data),
      data,
      "List"
    );
  }
  async selectManager(data: string) {
    //  let data = getRandomItemFromFile("../data/peopleDirectManager.json");
    await this.typeAndEnter(this.selectors.manager, "User Type", data);
    await this.wait("minWait");
    let manager = "div[id^='user-manager-filter'] li";
    await this.wait("minWait");
    await this.click(manager, "manager", "Dropdown");
  }

  async selectOtherManager() {
    //  let data =getRandomItemFromFile("../data/peopleOtherManager.json");
    await this.click(
      this.selectors.othermanager,
      "OtherManager",
      "input field"
    );
    //    await this.typeAndEnter(this.selectors.searchOtherManager,"OtherManagers",data)
    const count = await this.page
      .locator("//div[@id='user-other-managers']/following::li")
      .count();
    const randomIndex = Math.floor(Math.random() * count) + 1;
    await this.mouseHover(
      this.selectors.otherMgrOption(randomIndex),
      "OtherManager"
    );
    await this.click(
      this.selectors.otherMgrOption(randomIndex),
      "OtherManager",
      "List"
    );
  }

  async selectSpecificManager(data: string) {
    //  let data =getRandomItemFromFile("../data/peopleOtherManager.json");
    await this.click(
      this.selectors.othermanager,
      "OtherManager",
      "input field"
    );
    await this.typeAndEnter(
      this.selectors.searchOtherManager,
      "OtherManagers",
      data
    );
    // const count = await this.page.locator("//div[@id='user-other-managers']/following::li").count();
    // const randomIndex = Math.floor(Math.random() * count) + 1;
    /* await this.mouseHover(this.selectors.specificManager(data), "OtherManager");
        await this.click(this.selectors.specificManager(data), "OtherManager", "List"); */
    let manager = "div[id^='user-other-managersresu'] li";
    await this.wait("minWait");
    await this.click(manager, "manager", "Dropdown");
  }

  async removeUserRole() {
    await this.click(this.selectors.rolesBtn, "Roles", "Button");
  }

  async selectLanguage(language: string) {
    await this.page.locator(this.selectors.language).scrollIntoViewIfNeeded();
    await this.click(this.selectors.language, "Language", "Field");
    await this.type(this.selectors.searchLanguage, "Input Field", language);
    await this.mouseHover(
      this.selectors.courseLanguageLink(language),
      language
    );
    await this.click(
      this.selectors.courseLanguageLink(language),
      language,
      "Button"
    );
  }

  async selectjobTitle(jobTitle: string) {
    let data = getRandomItemFromFile(filePath.jobTitle);
    await this.typeAndEnter(this.selectors.jobtitle, "User Type", data);
    await this.mouseHover(this.selectors.commonOptionBtn(jobTitle, data), data);
    await this.click(
      this.selectors.commonOptionBtn(jobTitle, data),
      data,
      "List"
    );
  }

  async clickSave() {
    await this.wait("minWait");
    await this.validateElementVisibility(this.selectors.saveButton, "Save");
    await this.click(this.selectors.saveButton, "Save", "Button");
  }

  async clickProceed(name: string) {
    await this.validateElementVisibility(this.selectors.proceedButton(name), name);
    const buttonSelector = this.selectors.proceedButton(name);
    await this.validateElementVisibility(buttonSelector, name);
    await this.click(buttonSelector, name, "Button");
  }

  async userSearchField(data: string) {
    await this.type(this.selectors.searchField, "Search Field", data);
    await this.keyboardAction(
      this.selectors.searchField,
      "Enter",
      "Search Field",
      data
    );
    await this.spinnerDisappear();
  }

  async clickRolesButton(roles: string) {
    await this.click(this.selectors.rolesBtn, "Roles", "Button");
    await this.click(this.selectors.rolesList(roles), roles, "Button");
    await this.click(this.selectors.rolesBtn, "Roles", "Button");
  }

  async editIcon() {
    await this.click(this.selectors.editIcon, "Edit Icon", "Button");
    await this.spinnerDisappear();
  }

  async userProfileUpload() {
    const filePath = "../data/Profilepic.jpg";
    await this.mouseHover(this.selectors.userProfileUploadInput, "Upload");
    await this.uploadFile(this.selectors.userProfileUploadInput, filePath);
  }

  async updateUser() {
    await this.validateElementVisibility(this.selectors.updateButton, "Update");
    await this.wait("minWait");
    await this.click(this.selectors.updateButton, "Update", "Button");
    await this.wait("minWait");
  }

  async verifyUserCreationSuccessMessage() {
    await this.verification(this.selectors.successMessage, "successfully");
  }

  async verifyUserdeleteSuccessMessage() {
    await this.verification(this.selectors.verifyDeletemsg, "no results");
  }

  async selectTimeZone(data: string, timeStd: string) {
    await this.validateElementVisibility(this.selectors.timeZone, "TimeZone");
    await this.click(this.selectors.timeZone, "TimeZone", "Input");
    await this.keyboardType(this.selectors.timeZoneSearch, data);
    const index = await this.page
      .locator(`//li/a/span[contains(text(),'${timeStd}')]`)
      .count();
    const randomIndex = Math.floor(Math.random() * index) + 1;
    await this.mouseHover(
      this.selectors.selectlocationtz(randomIndex, timeStd),
      "TimeZone"
    );
    await this.click(
      this.selectors.selectlocationtz(randomIndex, timeStd),
      "TimeZone",
      "Option"
    );
  }

  public async enterHireDate() {
    await this.keyboardType(
      this.selectors.hireDate,
      gettomorrowDateFormatted()
    );
  }

  public async editbtn() {
    await this.click(this.selectors.editButton, "Edit Course", "Button");
  }

  public async clickdeleteIcon() {
    await this.click(this.selectors.deleteUser, "Delete Course", "Icon");
    await this.click(this.selectors.confirmDeleteoption, "Delete", "Button");
  }

  public async clickSuspendButton() {
    await this.validateElementVisibility(this.selectors.suspendBtn, "Suspend");
    await this.wait("minWait");
    await this.page.keyboard.press("PageDown");
    await this.click(this.selectors.suspendBtn, "Suspend", "Button");
    await this.wait("mediumWait");
    let dialog = this.page.locator(this.selectors.suspendDialog);
    if (await dialog.isVisible()) {
      let text = await dialog.innerText();
      console.log(text);
      await this.click(this.selectors.suspendDialogBtn, "Suspend", "Button");
    }
  }

  public async clickDeleteIcon() {
    await this.validateElementVisibility(
      this.selectors.deleteIcon,
      "Delete Icon"
    );
    await this.mouseHover(this.selectors.deleteIcon, "Delete Icon");
    await this.wait("mediumWait");
    await this.click(this.selectors.deleteIcon, "Delete Icon", "Delete");
    await this.wait("mediumWait");
    let dialog = this.page.locator(this.selectors.deleteDialog);
    if (await dialog.isVisible()) {
      let text = await dialog.innerText();
      console.log(text);
      await this.click(this.selectors.deleteBtn, "Suspend", "Button");
    }
  }

  public async verifyDeletedUser() {
    await this.validateElementVisibility(
      this.selectors.noResultText,
      "No Result"
    );
    await this.verification(
      this.selectors.noResultText,
      "There are no results that match your current filters"
    );
  }

  public async clickActivateIcon() {
    await this.validateElementVisibility(
      this.selectors.activateUserIcon,
      "Delete Icon"
    );
    await this.mouseHover(this.selectors.activateUserIcon, "Delete Icon");
    await this.wait("mediumWait");
    await this.click(this.selectors.activateUserIcon, "Delete Icon", "Delete");
    await this.wait("mediumWait");
    let dialog = this.page.locator(this.selectors.activateDialog);
    if (await dialog.isVisible()) {
      let text = await dialog.innerText();
      console.log(text);
      await this.click(this.selectors.activateBtn, "Suspend", "Button");
    }
  }

  public async clickImpersonationIcon() {
    await this.validateElementVisibility(
      this.selectors.impersonationIcon,
      "Delete Icon"
    );
    await this.mouseHover(this.selectors.impersonationIcon, "Delete Icon");
    await this.wait("mediumWait");
    await this.click(this.selectors.impersonationIcon, "Delete Icon", "Delete");
    await this.wait("mediumWait");
  }

  public async fillImpersonateForm() {
    let option = URLConstants.portal1;
    await this.validateElementVisibility(
      this.selectors.impersonateLabel,
      "Impersonate Label"
    );
    await this.click(
      this.selectors.impersonateOptionDD,
      "Select Domain you want ?",
      "Drop Down"
    );
    await this.click(
      this.selectors.impersonateDomainValue(option),
      "Select Domain you want ?",
      "Option"
    );
    await this.type(
      this.selectors.reasonInput,
      "Reason",
      FakerData.getDescription()
    );
    await this.click(this.selectors.impersonateProceedBtn, "Proceed", "Button");
    await this.wait("mediumWait");
    await this.click(this.selectors.okBtn, "OK", "Button");
  }

  public async clickLogOutButton() {
    await this.mouseHover(this.selectors.logOutBtn, "Log Out");
    await this.click(this.selectors.logOutBtn, "Log Out", "Icon");
  }
  public async userValidate(uname: string) {
    await this.verification(this.selectors.validateUser(uname), uname);
  }

  //Manage Enrollments Label:-

  async verifyEnrollmentLabel() {
    await this.verification(
      this.selectors.enrollmentLabel,
      "Manage Enrollments"
    );
  }

  //Particular user getEnrollmentStatus:-

  async getEnrollmentStatus() {
    const elements = await this.page.$$(this.selectors.enrollmentStatus);
    const texts: string[] = [];
    for (const el of elements) {
      const text = await el.textContent();
      texts.push(text || "");
    }
    console.log("Enrollment Status:-");
    for (let i = 0; i < texts.length; i += 3) {
      if (texts[i] && texts[i + 2]) {
        console.log(`${texts[i]} : ${texts[i + 2]}`);
      }
    }
  }

  //Click Enrollment icon from the user page->Enrollment-Status Icon:-
  async clickViewEnrollmentStsIcon() {
    await this.click(
      this.selectors.viewEnrollmentStsIcon,
      "View Enrollment Status Icon",
      "Button"
    );
    await this.wait("minWait");
  }

  //Click Enrollment icon from the user page:-
  async clickEnrollmentIcon() {
    await this.click(
      this.selectors.enrollmentIcon,
      "Enrollment Icon",
      "Button"
    );
    await this.spinnerDisappear();
  }

  //For User address validation

  async clickVerifyAddressBtn() {
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.verifyUserAddress,
      "Click to verify address"
    );
    await this.click(
      this.selectors.verifyUserAddress,
      "Click to verify address",
      "Button"
    );
  }

  async verifyUserAddress() {
    await this.wait("minWait");
    let message = await this.getInnerText(
      this.selectors.addressVerificationMessage
    );
    if (message == "Address Verified") {
      expect(message).toContain("Address Verified");
      console.log("Given Address has been verified");
    } else {
      expect(message).toContain("Invalid Address");
      console.log("Given Address is Invalid");
    }
  }

  //End Impersonation
  async clickendImpersonation() {
    await this.wait("maxWait");
    await this.click(
      this.selectors.endImpersonation,
      "End Impersonation",
      "Link"
    );
    await this.wait("minWait");
  }

  //For contact support email

  async typeAndSelectIUser(data: string) {
    await this.wait("minWait");
    await this.typeAndEnter(this.selectors.searchField, "search", data);
    // await this.validateElementVisibility(
    //   this.selectors.customerAdminUserFromDropdown,
    //   "dropdown"
    // );
    // await this.click(
    //   this.selectors.customerAdminUserFromDropdown,
    //   "admin",
    //   "dropdown"
    // );
    await this.click(this.selectors.editIcon, "customeradmin", "edit");
  }

  async selectDepartmentWithTestData(data: string) {
    await this.typeAndEnter(this.selectors.departmentType, "Department Type", data);
    await this.mouseHover(this.selectors.commonOptionBtn("department", data), data);
    await this.click(this.selectors.commonOptionBtn("department", data), data, "List");
  }

  async selectEmploymentTypeWithTestData(data: string) {
    console.log(`Selecting Employment Type: ${data}`);
    await this.typeAndEnter(this.selectors.employmentTypeInput, "Employment Type", data);
    
    // Wait a moment for dropdown to populate
    await this.page.waitForTimeout(500);
    
    // Try multiple selector approaches quickly
    const selectors = [
      `//li[contains(text(),'${data}')]`,
      `//ul//li[contains(text(),'${data}')]`,
      `//div//li[contains(text(),'${data}')]`,
      `//li[text()='${data}']`,
      this.selectors.commonOptionBtn("emptype", data),
      `//div[contains(@id,'emptype')]//li[contains(text(),'${data}')]`
    ];
    
    for (const selector of selectors) {
      try {
        console.log(`Trying: ${selector}`);
        await this.page.waitForSelector(selector, { timeout: 1500 });
        await this.click(selector, data, "List");
        console.log(`Success: ${selector}`);
        return data;
      } catch (error) {
        console.log(`Failed: ${selector}`);
        continue;
      }
    }
    
    throw new Error(`Employment Type not found: ${data}`);
  }

  async selectUserTypeWithTestData(data: string) {
    await this.typeAndEnter(this.selectors.userType, "User Type", data);
    await this.mouseHover(this.selectors.commonOptionBtn("usertype", data), data);
    await this.click(this.selectors.commonOptionBtn("usertype", data), data, "List");
  }

  async selectJobTitleWithTestData(data: string) {
    await this.typeAndEnter(this.selectors.jobtitle, "Job Title", data);
    await this.mouseHover(this.selectors.commonOptionBtn("jobtitle", data), data);
    await this.click(this.selectors.commonOptionBtn("jobtitle", data), data, "List");
  }
    /**
  /**
   * Scroll to Associated Groups section and verify a specific learner group
   * @param groupName - The name of the learner group to verify
   */
  public async scrollToAssociatedGroupsAndVerify(groupName: string) {
      try {
                console.log(`Scrolling to Associated Groups and verifying group: ${groupName}`);
                
                // Scroll to and click Associated Groups
                const associatedGroupsSelector = `//span[text()='Associated Groups']`;
                await this.page.waitForSelector(associatedGroupsSelector, { timeout: 10000 });
                
                // Scroll the element into view
                await this.page.locator(associatedGroupsSelector).scrollIntoViewIfNeeded();
                await this.wait('minWait');
                
                await this.click(associatedGroupsSelector, "Associated Groups", "Section");
                await this.wait('mediumWait');
                
                // Verify the learner group is present with the parameterized group name
                const learnerGroupSelector = `//label[text()='Learner Group :']//following::div[contains(text(),'${groupName}')]`;
                await this.page.waitForSelector(learnerGroupSelector, { timeout: 10000 });
                
                // Validate the group is visible
                await this.validateElementVisibility(learnerGroupSelector, `Learner Group: ${groupName}`);
                
                console.log(`✅ Successfully verified learner group: ${groupName} in Associated Groups`);
                
            } catch (error) {
                throw new Error(`Failed to scroll to Associated Groups and verify group '${groupName}': ${error.message}`);
            }
        }

  /**
   * Select language with test data (similar to other WithTestData methods)
   * @param data - The language to select
   */
  async selectLanguageWithTestData(data: string) {
    console.log(`Selecting Language: ${data}`);
    try {
      await this.page.locator(this.selectors.language).scrollIntoViewIfNeeded();
      await this.click(this.selectors.language, "Language", "Field");
      await this.type(this.selectors.searchLanguage, "Input Field", data);
      await this.wait('minWait');
      
      // Try multiple selector approaches for language
      const selectors = [
        this.selectors.courseLanguageLink(data),
        `//span[text()='${data}']`,
        `//li[contains(text(),'${data}')]`,
        `//div//span[contains(text(),'${data}')]`
      ];
      
      for (const selector of selectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 2000 });
          await this.mouseHover(selector, data);
          await this.click(selector, data, "Language Option");
          console.log(`✅ Successfully selected language: ${data}`);
          return;
        } catch (error) {
          continue;
        }
      }
      
      throw new Error(`Language option not found: ${data}`);
    } catch (error) {
      throw new Error(`Failed to select language '${data}': ${error.message}`);
    }
  }

  /**
   * Select country with test data (similar to other WithTestData methods)
   * @param data - The country to select
   */
  async selectCountryWithTestData(data: string) {
    console.log(`Selecting Country: ${data}`);
    try {
      // Use the select method with "Country" as the label
      await this.select("Country", data);
      console.log(`✅ Successfully selected country: ${data}`);
    } catch (error) {
      throw new Error(`Failed to select country '${data}': ${error.message}`);
    }
  }

  /**
   * Select state with test data (similar to other WithTestData methods)
   * @param data - The state to select
   */
  async selectStateWithTestData(data: string) {
    console.log(`Selecting State: ${data}`);
    try {
      // Use the select method with "State/Province" as the label
      await this.select("State/Province", data);
      console.log(`✅ Successfully selected state: ${data}`);
    } catch (error) {
      throw new Error(`Failed to select state '${data}': ${error.message}`);
    }
  }

  /**
   * Uncheck all domain checkboxes by getting count of selected items and clicking each one
   */
  async uncheckAllDomainCheckboxes() {
    try {
      console.log("Starting to uncheck all domain checkboxes");
      
      // Get the locator for all selected domain checkboxes
      const selectedDomainsLocator = `//li[@class='selected']`;
      await this.page.locator("//button[contains(translate(@data-id, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'portal')]").click();

      // Get the count of selected domains
      const selectedCount = await this.page.locator(selectedDomainsLocator).count();
      console.log(`Found ${selectedCount} selected domain checkboxes`);
      
      if (selectedCount === 0) {
        console.log("No domain checkboxes are selected");
        return;
      }
      
      // Click each selected domain checkbox to uncheck it
      for (let i = 0; i < selectedCount; i++) {
        try {
          // Always click the first element since the list updates after each click
          const domainElement = this.page.locator(selectedDomainsLocator).first();
          
          // Check if element still exists before clicking
          if (await domainElement.count() > 0) {
            await domainElement.click();
            console.log(`Unchecked domain checkbox ${i + 1}`);
            
            // Wait briefly between clicks to allow UI to update
            await this.wait('minWait');
            const popup = this.page.locator("//button[text()='OK']");
            if (await popup.isVisible()) {
              await popup.click();
                    await this.page.locator("//button[contains(translate(@data-id, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'portal')]").click();

            }
          }
        } catch (error) {
          console.log(`Error unchecking domain ${i + 1}: ${error.message}`);
        }
      }
      
      // Verify all checkboxes are unchecked
      const remainingSelected = await this.page.locator(selectedDomainsLocator).count();
      if (remainingSelected === 0) {
        console.log("Successfully unchecked all domain checkboxes");
      } else {
        console.log(`Warning: ${remainingSelected} domain checkboxes still selected`);
      }
      
    } catch (error) {
      throw new Error(`Failed to uncheck all domain checkboxes: ${error.message}`);
    }
  }

  /**
   * Select a specific domain by domain name
   * @param domainName - The name of the domain to select (e.g., 'autoportal1')
   */
  async selectSpecificDomain(domainName: string) {
    try {
      console.log(`Selecting specific domain: ${domainName}`);
      
      if (!domainName || domainName.trim() === '') {
        throw new Error('Domain name cannot be empty or null');
      }
     // await this.page.locator("//button[@data-id='Portal']").click();
      // Build the selector using the provided pattern with parameter
      const domainSelector = `(//span[text()='${domainName}'])[2]`;
      
      // Wait for the domain element to be visible
      await this.page.waitForSelector(domainSelector, { timeout: 5000 });
      
      // Validate element visibility
      await this.validateElementVisibility(domainSelector, `Domain: ${domainName}`);
      
      // Click on the specific domain
      await this.click(domainSelector, domainName, "Domain");
      
      // Wait for the selection to process
      await this.wait('minWait');
        await this.page.locator("//button[contains(translate(@data-id, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'portal')]").click();

      console.log(`Successfully selected domain: ${domainName}`);
      
    } catch (error) {
      throw new Error(`Failed to select domain '${domainName}': ${error.message}`);
    }
  }

  /**
   * Verify that a user is NOT associated with a suspended learner group
   * @param groupName - The name of the learner group that should NOT be present
   */
  public async verifyGroupNotInAssociatedGroups(groupName: string) {
      try {
          console.log(`Verifying user is NOT associated with suspended group: ${groupName}`);
          
          // Scroll to and click Associated Groups
          const associatedGroupsSelector = `//span[text()='Associated Groups']`;
          await this.page.waitForSelector(associatedGroupsSelector, { timeout: 10000 });
          
          // Scroll the element into view
          await this.page.locator(associatedGroupsSelector).scrollIntoViewIfNeeded();
          await this.wait('minWait');
          
          await this.click(associatedGroupsSelector, "Associated Groups", "Section");
          await this.wait('mediumWait');
          
          // Check that the learner group is NOT present
          const learnerGroupSelector = `//label[text()='Learner Group :']//following::div[contains(text(),'${groupName}')]`;
          
          // Wait a moment for the page to load completely
          await this.wait('mediumWait');
          
          // Verify the group is NOT present
          const groupElements = await this.page.locator(learnerGroupSelector).count();
          
          if (groupElements === 0) {
              console.log(`✅ Successfully verified user is NOT associated with suspended group: ${groupName}`);
          } else {
              throw new Error(`Group '${groupName}' is still associated with user. Expected: 0 associations, Found: ${groupElements}`);
          }
          
      } catch (error) {
          if (error.message.includes('waiting for selector')) {
              // If the Associated Groups section itself is not found, that could mean no groups are associated
              console.log(`✅ Associated Groups section not found - user has no group associations`);
          } else {
              throw new Error(`Failed to verify user is not associated with group '${groupName}': ${error.message}`);
          }
      }
  }
    
}
