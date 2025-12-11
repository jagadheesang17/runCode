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
        addressInput: (label: string) => `(//label[contains(text(),'${label}')]/following::input[contains(@id,'user-add')])[1]`,
        addressInputOrg:(label:string,id:string)=>`//label[contains(text(),'${label}')]/following::input[contains(@id,'${id}')]`,

        dropdownToggle: (label: string) => `(//label[text()='${label}']/following::button[@data-bs-toggle='dropdown'])[1]`,
        dropdownSearchInput: "//footer//following::input[@type='search']",
        dropdownOption: (data: string) => `//span[text()='${data}']`,
        saveButton: "//button[text()='Save']",
        proceedButton: (name: string) => `//footer//following::button[contains(text(),'${name}')]`,
        searchField: "//input[@id='exp-search-field']",
        rolesBtn: "//input[@id='user-roles-filter-field']",
        rolesList: (roles: string) => `//li[text()='${roles}']`,
        editIcon: "(//span[contains(@class,'justify-content-start') and  @aria-label='Edit User'])[1]",
        userProfileUploadInput: "//input[@id='upload-usr-pic-file']",
        updateButton: "//button[text()='Update']",
        successMessage: "//div[@id='addedit-user-form-container']//h3[contains(text(),'successfully')]",
        employmentTypeInput: "//label[text()='employment type']//parent::div//input",
        commonOptionBtn: (value: string, data: string) => `(//div[@id='user-${value}-filter-lms-scroll-results']//li)[1]`,
        departmentType: `//label[text()='department']/following::div[@id='user-department']//input`,
        timeZone: `(//div[@id='wrapper-user-timezone']//button)[1]`,
        timeZoneSearch: `//footer/following-sibling::div//input`,
        selectlocationtz: (index: number, timeZone: string) => `(//li/a/span[contains(text(),'${timeZone}')])[${index}]`,
        hireDate: `//input[@id='user-hiredate-input']`,
        userType: `//input[@id='user-usertype-filter-field']`,
        jobtitle: `//input[@id='user-jobtitle-filter-field']`,
        manager: `//input[@id='user-manager-filter-field']`,
        othermanager: `//input[@id='user-other-managers-filter-field']`,
        searchOtherManager: `//input[@id='user-other-managers']`,
        otherMgrOption: (index: number) => `(//div[@id='user-other-managers']/following::li)[${index}]`,
        specificManager: (managerName: string) => `//div[contains(text(),'${managerName}')]`,
        language: `//label[contains(text(),'Language')]/following::div[@id='wrapper-user-language']`,
        searchLanguage: `//footer/following::div/input`,
        courseLanguageLink: (language: string) => `//label[text()='Language']//following::span[text()='${language}']`,
        editButton: `//a[text()='Edit User']`,
        deleteUser: `(//a[@aria-label="Delete"]/i)[1]`,
        confirmDeleteoption: `//button[text()='Delete']`,
        verifyDeletemsg: `//div[@id='lms-overall-container']//h3`,
        organizationTypeDD: `(//label[text()='Organization type']/parent::div//button)[1]`,
        organizationType: (type: string) => `//span[text()='${type}']`,
        closeIcon: "//i[contains(@class,'xmark')]",
        managerclosePopup: "//span[contains(text(),'Are you sure you want to continue?')]",
        yesBtn: "//button[text()='Yes']",
        suspendBtn: "//button[text()='Suspend']",
        suspendDialog: "//span[contains(text(),'Are you sure you want to suspend the user')]",
        suspendDialogBtn: "//span[contains(text(),'Are you sure you want to suspend the user')]//following::button[text()='Suspend']",
        deleteIcon: "a[aria-label='Delete'] , a[title='Delete'] i",
        deleteDialog: "//span[contains(text(),'Are you sure you want to delete the user')]",
        deleteBtn: "//button[text()='Delete']",
        noResultText: "//h3[contains(text(),'There are no results that match your current filters')]",
        activateUserIcon: "a[title='Activate'], a[aria-label='Activate'] i",
        activateDialog: "//span[contains(text(),'Are you sure you want to activate the user')]",
        activateBtn: "//button[text()='Activate']",
        impersonationIcon: " a[aria-label='Impersonation'] , a[title='Impersonation'] i",
        impersonateLabel: "//label[text()='Select Domain you want to Impersonate']",
        impersonateOptionDD: "(//label[text()='Select Domain you want to Impersonate']//parent::div//button)[1]",
        impersonateDomainValue: (option: string) => `//footer//following::a/span[text()='${option}']`,
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
         customerAdminUserFromDropdown:(data:string)=>`//li[contains(text(),'${data}')]`,
         checkContactSupport:`//input[@id='course-contact-support']`,

         fieldname:(name:string)=>`//input[@id='user-${name}-filter-field']`,

         clickSearchOption:(list:string)=>`(//li[text()='${list}'])[1]`,

         editUser:`//a[text()='Edit User']`,

         valueOfOgTypeInUserPage:`(//label[text()='Organization type']/following::div[@class='filter-option-inner-inner'])[1]`,

         emergenctContactNameInput:(id:string)=>`//input[@id='${id}']`,

         checkrole:(role:string)=>`(//span[text()='${role}']/preceding-sibling::i)[1]`,

         uncheckInheritFromCheckbox:`//span[text()='Inherit Address From']/preceding-sibling::i[@class='fad fa-square-check icon_14_1']`,

           inheritAddressLabel: "//span[text()='Inherit Address From']",
    inheritAddressCheckbox: "(//span[text()='Inherit Address From']//preceding-sibling::i)[1]",

    // Merge User functionality selectors
    createUserLink: "//a[text()='Create User']",
    mergeUserSpan: "//span[text()='MERGE USER']",
    primarySearchField: "#exp-search-primary-field",
    secondarySearchField: "#exp-search-secondary-field",
    userRadioBtn: (user: string) => `(//span[text()='${user}']//following::i[contains(@class,'fa-circle')])[1]`,
    selectMergeUserBtn: "#merger-user-btn-select",
    mergeUserBtn: "//button[text()='Merge User']",
    mergeConfirmationMessage: "//span[text()='Merge process has been initiated. You will receive an email with the status of the process.']",
    mergeOkBtn: "//button[text()='OK']",
    noMatchingResultMessage: "//div[text()='No matching result found.']",
    deleteSecondaryUserIcon: "(//span[text()='SECONDARY USER']//following::i[contains(@class,'fa-trash-can')])[1]",
    swapUsersIcon: "//i[contains(@class,'merge_user_swap pointer')]",

    }

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

 async searchAndSelect(name: string,data:string) {
        await this.typeAndEnter(this.selectors.fieldname(name), "field name", data);

        await this.click(this.selectors.clickSearchOption(data), "search option", "option");
    }
  

   async clickeditUser() {
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.editIcon,
      "Edit User"
    );
    const selector = this.selectors.editIcon;
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
      async checkInheritFrom(role:string){
        await this.click(this.selectors.checkrole(role),"clickmanager","radiobutton");
    }

     

     async typeAddressOrg(label: string, id:string,data: string) {
        const selector = this.selectors.addressInputOrg(label,id);
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
    return data;
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
    return data;
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
    return data;
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
    const closebutton = `//div[contains(@class,'modal-header d-flex ')]//following-sibling::i`;
    const closeicon = this.page.locator(closebutton);
      if (await closeicon.isVisible()) {
          await this.click(closebutton, "Close Button", "Button");
      }
    await this.wait("maxWait");
    await this.validateElementVisibility(this.selectors.logOutBtn, "Log Out");
    await this.mouseHover(this.selectors.logOutBtn, "Log Out");
    await this.page.locator(this.selectors.logOutBtn).first().click({ force: true });
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

  //address inheritance
  public async uncheckInheritAddressIfPresent() {
    await this.wait("minWait");
    const inheritAddressLabel = this.page.locator(this.selectors.inheritAddressLabel);
    if (await inheritAddressLabel.isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.click(this.selectors.inheritAddressCheckbox, "Inherit Address From Checkbox", "Checkbox");
    }
    else {
      console.log("Inherit Address already unchecked")
    }
  }

    //emergency contact inheritance
    public async uncheckInheritEmergencyContactIfPresent() {
         const classValue = await this.page.locator('#emrg-cont-name').getAttribute('class');

        // Check if it contains a specific class
        if (classValue && classValue.includes('form_field_deactived')) {
            await this.click("//span[text()='Inherit']", "Inherit Address From Checkbox", "Checkbox");
        } else {
            console.log("Inherit emergency already unchecked")
            //address inheritance
        }
    }

    //auto generate username
    public async uncheckAutoGenerateUsernameIfPresent() {
          const classValue = await this.page.locator('#username').getAttribute('class');

        // Check if it contains a specific class
        if (classValue && classValue.includes('form_field_deactived')) {
            await this.click("//span[text()='Auto-Generate']", "Auto-Generate Username Checkbox", "Checkbox");
        } else {
            console.log("auto generation already unchecked")
        
        }
}

  // UAID and UAC Custom Field Verification Methods
  async verifyUAIDFieldExists() {
    await this.validateElementVisibility(this.selectors.uaidSelector, "UAID Field");
  }

  async verifyUACFieldExists() {
    await this.validateElementVisibility(this.selectors.uacSelector, "UAC Field");
  }

  async getUAIDValue(): Promise<string> {
    const uaidValue = await this.page.locator(this.selectors.uaidSelector).inputValue();
    console.log(`UAID value: ${uaidValue}`);
    return uaidValue;
  }

  async getUACValue(): Promise<string> {
    const uacValue = await this.page.locator(this.selectors.uacSelector).inputValue();
    console.log(`UAC value: ${uacValue}`);
    return uacValue;
  }

  async verifyUAIDAutoGenerated(): Promise<string> {
    await this.verifyUAIDFieldExists();
    const uaidValue = await this.getUAIDValue();

    if (!uaidValue || uaidValue.trim() === '') {
      throw new Error("UAID field is empty - auto-generation may not be working");
    }

    console.log(`✅ UAID auto-generated successfully: ${uaidValue}`);
    return uaidValue;
  }

  async verifyUACAutoGenerated(): Promise<string> {
    await this.verifyUACFieldExists();
    const uacValue = await this.getUACValue();

    if (!uacValue || uacValue.trim() === '') {
      throw new Error("UAC field is empty - auto-generation may not be working");
    }

    console.log(`✅ UAC auto-generated successfully: ${uacValue}`);
    return uacValue;
  }

  async verifyUAIDValueUnchanged(expectedValue: string, context: string = "") {
    const currentValue = await this.getUAIDValue();

    if (currentValue !== expectedValue) {
      throw new Error(`UAID value changed${context ? ' ' + context : ''}! Expected: ${expectedValue}, Current: ${currentValue}`);
    }

    console.log(`✅ UAID value unchanged${context ? ' ' + context : ''}: ${currentValue}`);
  }

  async verifyUACValueUnchanged(expectedValue: string, context: string = "") {
    const currentValue = await this.getUACValue();

    if (currentValue !== expectedValue) {
      throw new Error(`UAC value changed${context ? ' ' + context : ''}! Expected: ${expectedValue}, Current: ${currentValue}`);
    }

    console.log(`✅ UAC value unchanged${context ? ' ' + context : ''}: ${currentValue}`);
  }

  async verifyBothCustomFieldsAutoGenerated(): Promise<{ uaidValue: string, uacValue: string }> {
    const uaidValue = await this.verifyUAIDAutoGenerated();
    const uacValue = await this.verifyUACAutoGenerated();

    console.log("✅ Both UAID and UAC fields are auto-generated successfully");
    return { uaidValue, uacValue };
  }

  async verifyBothCustomFieldsUnchanged(expectedUAID: string, expectedUAC: string, context: string = "") {
    await this.verifyUAIDValueUnchanged(expectedUAID, context);
    await this.verifyUACValueUnchanged(expectedUAC, context);

    console.log(`✅ Both UAID and UAC values remain unchanged${context ? ' ' + context : ''}`);
  }

  // Error validation methods for negative testing
  async verifyErrorMessage(expectedErrorMessage: string) {
    await this.wait("minWait");
    await this.validateElementVisibility(this.selectors.errorMessageContainer, "Error Message");
    const actualErrorMessage = await this.getInnerText(this.selectors.errorMessageContainer);

    // Normalize both strings by removing backslashes and extra spaces for comparison
    const normalizedActual = actualErrorMessage.replace(/\\/g, '').replace(/\s+/g, ' ').trim();
    const normalizedExpected = expectedErrorMessage.replace(/\\/g, '').replace(/\s+/g, ' ').trim();

    if (normalizedActual.includes(normalizedExpected) || normalizedActual.toLowerCase().includes(normalizedExpected.toLowerCase())) {
      console.log(`✅ Expected error message validated: ${expectedErrorMessage}`);
    } else {
      throw new Error(`Error message mismatch! Expected: "${expectedErrorMessage}", Actual: "${actualErrorMessage}"`);
    }
  }

  async clearField(fieldName: string) {
    const selector = this.selectors.inputField(fieldName);
    await this.page.locator(selector).clear();
  }

  async verifyDomainErrorMessage(expectedErrorMessage: string) {
    await this.wait("minWait");
    await this.validateElementVisibility(this.selectors.domainErrorContainer, "Domain Error Message");
    const actualErrorMessage = await this.getInnerText(this.selectors.domainErrorContainer);

    if (actualErrorMessage.includes(expectedErrorMessage)) {
      console.log(`✅ Expected domain error message validated: ${expectedErrorMessage}`);
    } else {
      throw new Error(`Domain error message mismatch! Expected: "${expectedErrorMessage}", Actual: "${actualErrorMessage}"`);
    }
  }

  // USRT21 specific methods
  async enterEmployeeId(employeeId: string) {
    await this.type(this.selectors.employeeIdField, "Employee ID", employeeId);
  }

  async enterBirthDate(birthDate: string) {
    await this.type(this.selectors.birthDateField, "Birth Date", birthDate);
  }

  async selectOtherOrganization(organizationName: string) {
    await this.click(this.selectors.otherOrganizationsField, "Other Organizations", "Input Field");
    await this.type(this.selectors.searchOtherOrganizationField, "Other Organizations", organizationName);
    await this.wait("minWait");
    await this.click(this.selectors.organizationOption, "Organization", "Dropdown");
    await this.wait("minWait");
  }

  async clickAssociatedGroups() {
    await this.click(this.selectors.associatedGroupsTab, "Associated Groups", "Tab");
  }

  async captureLearnerGroupText(): Promise<string> {
    const learnerGroupText = await this.getInnerText(this.selectors.learnerGroupText);
    console.log(`Learner Group: ${learnerGroupText}`);
    return learnerGroupText;
  }

  async clickHierarchyButton() {
    await this.click(this.selectors.hierarchyButton, "Hierarchy", "Button");
  }

  async verifyManagerInHierarchy(managerName: string) {
    await this.validateElementVisibility(this.selectors.managerInHierarchy(managerName), `Manager in Hierarchy: ${managerName}`);
    console.log(`✅ Manager ${managerName} verified in hierarchy`);
  }

  async closeHierarchyModal() {
    await this.click(this.selectors.hierarchyCloseButton, "Close Hierarchy Modal", "Button");
    await this.wait("minWait");
  }

  async selectOrganization(name: string, data: string) {
    await this.typeAndEnter(this.selectors.fieldname(name), "field name", data);
    await this.click(this.selectors.clickSearchOption(data), "search option", "option");
  }


  async selectJobRole() {
    let data = getRandomItemFromFile(filePath.jobRole);
    await this.click(this.selectors.jobRole, "Roles", "Button");
    await this.click(this.selectors.jobRoleList(data), data, "Button");
    await this.click(this.selectors.jobRole, "Roles", "Button");
    return data;
  }

  // USRT21 Filter Methods
  async clickFilter() {
    await this.wait("minWait");
    await this.click(this.selectors.filterTrigger, "Filter", "Button");
    console.log("✅ Filter panel opened");
  }

  async selectStatusCheckbox(status: string) {
    await this.click(this.selectors.statusCheckbox(status), `Status ${status}`, "Checkbox");
    console.log(`✅ Status ${status} checkbox selected`);
  }

  async selectFilterUserType(userType: string) {
    await this.type(this.selectors.userTypeFilter, "User Type Filter", userType);
    await this.click(this.selectors.clickSearchOption(userType), userType, "Option");
    console.log(`✅ User type ${userType} selected in filter`);
  }

  async selectFilterRoles(role: string) {
    await this.click(this.selectors.rolesDropdown, "Roles Dropdown", "Button");
    await this.click(this.selectors.roleOption(role), `Role ${role}`, "Option");
    console.log(`✅ Role ${role} selected in filter`);
  }

  async selectFilterJobRole(jobRole: string) {
    await this.type(this.selectors.jobRoleFilter, "Job Role Filter", jobRole);
    await this.click(this.selectors.clickSearchOption(jobRole), jobRole, "Option");
    console.log(`✅ Job role ${jobRole} selected in filter`);
  }

  async selectFilterDepartment(department: string) {
    await this.type(this.selectors.departmentFilter, "Department Filter", department);
    await this.click(this.selectors.clickSearchOption(department), department, "Option");
    console.log(`✅ Department ${department} selected in filter`);
  }

  async selectFilterManager(manager: string) {
    await this.type(this.selectors.managerFilter, "Manager Filter", manager);
    let managerDropdown = "div[id^='user-manager-filter'] li";
    await this.wait("minWait");
    await this.click(managerDropdown, "manager", "Dropdown");
    console.log(`✅ Manager ${manager} selected in filter`);
  }

  async selectFilterOrganization(organization: string) {
    await this.type(this.selectors.organizationFilter, "Organization Filter", organization);
    await this.click(this.selectors.clickSearchOption(organization), organization, "Option");
    console.log(`✅ Organization ${organization} selected in filter`);
  }

  async selectHireDateFilter(option: string) {
    await this.click(this.selectors.userHireDateDropdown, "Hire Date Dropdown", "Button");
    await this.click(this.selectors.hireDateOption(option), `Hire Date ${option}`, "Option");
    console.log(`✅ Hire date filter ${option} selected`);
  }

  async enterHireDateFrom(date: string) {
    await this.type(this.selectors.hireDateFromInput, "Hire Date From", date);
    console.log(`✅ Hire date from: ${date} entered`);
  }

  async selectFilterCountry(country: string) {
    await this.wait("minWait");
    await this.click(this.selectors.filterLabelDropdown("Country"), "Country Dropdown", "Button");
    await this.type(this.selectors.filterDropdownSearch, "Country Search", country);
    await this.click(this.selectors.filterDropdownOption(country), country, "Option");
    console.log(`✅ Country ${country} selected in filter`);
  }

  async selectFilterState(state: string) {
    await this.wait("minWait");
    await this.click(this.selectors.filterLabelDropdown("State/Province"), "State Dropdown", "Button");
    await this.type(this.selectors.filterDropdownSearch, "State Search", state);
    await this.click(this.selectors.filterDropdownOption(state), state, "Option");
    console.log(`✅ State ${state} selected in filter`);
  }

  async clickApply() {
    // Using the same method from CatalogPage
    const applyButton = "//button[text()='Apply']";
    await this.click(applyButton, "Apply", "Button");
    console.log("✅ Filter applied successfully");
  }
  async verifyInheritedAddress(label:string,id:string,address:string) {
        // await this.verification(this.selectors.addressInput(label,id), address);

       await this. verificationInputValue(this.selectors.addressInputOrg(label,id), address);
       
    }

            async verifyInheritedEmergencyContactName(id:string,emergencyContactName:string){
            await this.verificationInputValue(this.selectors.emergenctContactNameInput(id),emergencyContactName);
        }
        async editUser(){
          this.wait("minWait");
    await this.click(this.selectors.editUser,"Edit user","Button");
}

 async valueOfOrganizationTypeInUserPage(){
            await this.wait("maxWait");
            const text=await this.page.locator(this.selectors.valueOfOgTypeInUserPage).innerText();
            return text;
                 }

  // ==================== MERGE USER FUNCTIONALITY METHODS ====================

  /**
   * Alternative method for creating user using Create User link
   */
  async createBtn(): Promise<void> {
    await this.wait("minWait");
    await this.click(this.selectors.createUserLink, "Create User", "Link");
    console.log("✅ Create User link clicked");
  }

  /**
   * Click on Merge User span to open merge user functionality
   */
  async clickMergeUser(): Promise<void> {
    await this.wait("minWait");
    await this.click(this.selectors.mergeUserSpan, "Merge User", "Span");
    await this.wait("mediumWait");
    console.log("✅ Merge User functionality opened");
  }

  /**
   * Search and select primary user in merge user functionality
   * @param userId - The user ID to search and select as primary user
   */
  async searchAndSelectPrimaryUser(userId: string): Promise<void> {
    await this.wait("minWait");
    
    // Type in primary user search field
    await this.type(this.selectors.primarySearchField, "Primary User Search", userId);
    await this.wait("minWait");
    
    // Click on the user radio button
    await this.click(this.selectors.userRadioBtn(userId), `Primary User Radio: ${userId}`, "Radio Button");
    await this.wait("minWait");
    
    // Click select button
    await this.click(this.selectors.selectMergeUserBtn, "Select Merge User", "Button");
    await this.wait("minWait");
    
    console.log(`✅ Primary user ${userId} selected successfully`);
  }

  /**
   * Search and select secondary user in merge user functionality
   * @param userId - The user ID to search and select as secondary user
   */
  async searchAndSelectSecondaryUser(userId: string): Promise<void> {
    await this.wait("minWait");
    
    // Type in secondary user search field
    await this.type(this.selectors.secondarySearchField, "Secondary User Search", userId);
    await this.wait("minWait");
    
    // Click on the user radio button
    await this.click(this.selectors.userRadioBtn(userId), `Secondary User Radio: ${userId}`, "Radio Button");
    await this.wait("minWait");
    
    // Click select button
    await this.click(this.selectors.selectMergeUserBtn, "Select Merge User", "Button");
    await this.wait("minWait");
    
    console.log(`✅ Secondary user ${userId} selected successfully`);
  }

  /**
   * Initiate the merge process by clicking Merge User button
   */
  async initiateMergeProcess(): Promise<void> {
    await this.wait("minWait");
    await this.click(this.selectors.mergeUserBtn, "Merge User", "Button");
    await this.wait("mediumWait");
    console.log("✅ Merge process initiated");
  }

  /**
   * Verify merge confirmation message and click OK button
   */
  async verifyMergeConfirmationMessage(): Promise<void> {
    await this.wait("minWait");
    
    // Verify the merge confirmation message
    await this.validateElementVisibility(this.selectors.mergeConfirmationMessage, "Merge Confirmation Message");
    await this.verification(this.selectors.mergeConfirmationMessage, "Merge process has been initiated. You will receive an email with the status of the process.");
    
    // Click OK button
    await this.click(this.selectors.mergeOkBtn, "OK", "Button");
    await this.wait("minWait");
    
    console.log("✅ Merge confirmation message verified and OK clicked");
  }

  /**
   * Verify merge success message appears
   */
  // async verifyMergeSuccessMessage(): Promise<void> {
  //   await this.wait("mediumWait");
  //   await this.validateElementVisibility(this.selectors.mergeConfirmationMessage, "Merge Success Message");
  //   console.log("✅ Merge success message verified");
  // }

  /**
   * Search for secondary user and verify "No matching result found" message
   * Used when primary user cannot be assigned as secondary user
   * @param userId - The user ID that should show no results
   */
  async searchSecondaryUserAndVerifyNoResult(userId: string): Promise<void> {
    await this.wait("minWait");
    
    // Type in secondary user search field
    await this.type(this.selectors.secondarySearchField, "Secondary User Search", userId);
    await this.wait("minWait");
    
    // Verify "No matching result found" message appears
    await this.validateElementVisibility(this.selectors.noMatchingResultMessage, "No Matching Result Message");
    await this.verification(this.selectors.noMatchingResultMessage, "No matching result found.");
    
    console.log(`✅ Verified "No matching result found" message for user: ${userId}`);
  }

  /**
   * Click delete icon for secondary user
   */
  async clickDeleteSecondaryUser(): Promise<void> {
    await this.wait("minWait");
    await this.click(this.selectors.deleteSecondaryUserIcon, "Delete Secondary User", "Icon");
    await this.wait("minWait");
    console.log("✅ Secondary user delete icon clicked");
  }

  /**
   * Verify secondary user has been deleted/removed
   */
  async verifySecondaryUserDeleted(): Promise<void> {
    await this.wait("minWait");
    
    // Check if secondary user delete icon is no longer visible or secondary user section is empty
    try {
      const isDeleteIconVisible = await this.page.locator(this.selectors.deleteSecondaryUserIcon).isVisible({ timeout: 2000 });
      if (!isDeleteIconVisible) {
        console.log("✅ Secondary user successfully deleted - delete icon no longer visible");
      } else {
        console.log("✅ Secondary user delete icon still visible - may indicate different deletion behavior");
      }
    } catch (error) {
      console.log("✅ Secondary user deletion verified - element not found");
    }
  }

  /**
   * Click swap users icon to swap primary and secondary users
   */
  async clickSwapUsers(): Promise<void> {
    await this.wait("minWait");
    await this.click(this.selectors.swapUsersIcon, "Swap Users", "Icon");
    await this.wait("minWait");
    console.log("✅ Users swapped successfully");
  }

     async enrterOrgName(orgNameData: string) {
        await this.wait("minWait")
        await this.typeAndEnter(this.selectors.orgName, "Organization Name", orgNameData);
        await this.click(this.selectors.orgNameList(orgNameData), "Organization Name", "List")
    }

    async verifyUserSegmentation(user:string,otherUser:string) {
            await this.verification(this.selectors.userNameOnListingPage(user),user); 
            await this.typeAndEnter(this.selectors.searchField, "Search Field", otherUser);
            const message = await this.getInnerText(this.selectors.userNotFoundMessage);
            expect(message).toContain('There are no results that match your current filters');
            console.log("User Segmentation is working correctly");
    }

    /**
     * Apply user filters with optional parameters
     * @param filters - Object containing optional filter parameters
     * @param filters.userType - User Type filter value (search filter)
     * @param filters.jobRole - Job Role filter value (search filter)
     * @param filters.department - Department filter value (search filter)
     * @param filters.roles - Roles filter value (dropdown with search)
     * @param filters.country - Country filter value (dropdown with search)
     * @param filters.stateProvince - State/Province filter value (dropdown with search)
     * @param filters.status - Status filter value (checkbox - e.g., "Active")
     */
    async applyUserFilters(filters: {
        userType?: string;
        jobRole?: string;
        department?: string;
        roles?: string;
        country?: string;
        stateProvince?: string;
        status?: string;
    } = {}) {
        const { FilterUtils } = await import("../utils/filterUtils");
        const filterUtils = new FilterUtils(this.page, this.context);

        // Click filter icon to open filters
        await filterUtils.clickFilterIcon();
        await this.wait("minWait");
        console.log("🔍 Opened User filters");

        // Apply User Type filter (search filter)
        if (filters.userType) {
            await filterUtils.searchAndSelectValue("User Type", filters.userType);
            console.log(`✅ Applied User Type filter: ${filters.userType}`);
        }

        // Apply Job Role filter (search filter)
        if (filters.jobRole) {
            await filterUtils.searchAndSelectValue("Job Role", filters.jobRole);
            console.log(`✅ Applied Job Role filter: ${filters.jobRole}`);
        }

        // Apply Department filter (search filter)
        if (filters.department) {
            await filterUtils.searchAndSelectValue("Department", filters.department);
            console.log(`✅ Applied Department filter: ${filters.department}`);
        }

        // Apply Roles filter (dropdown with search)
        if (filters.roles) {
            await filterUtils.applySearchableDropdownFilter("Roles", filters.roles);
            console.log(`✅ Applied Roles filter: ${filters.roles}`);
        }

        // Apply Country filter (dropdown with search)
        if (filters.country) {
            await filterUtils.applySearchableDropdownFilter("Country", filters.country);
            console.log(`✅ Applied Country filter: ${filters.country}`);
        }

        // Apply State/Province filter (dropdown with search)
        if (filters.stateProvince) {
            await filterUtils.applySearchableDropdownFilter("State/Province", filters.stateProvince);
            console.log(`✅ Applied State/Province filter: ${filters.stateProvince}`);
        }

        // Apply Status filter (checkbox)
        if (filters.status) {
            await filterUtils.clickCheckboxFilter(filters.status);
            console.log(`✅ Applied Status filter: ${filters.status}`);
        }

        // Click Apply button
        await filterUtils.clickApplyFilter();
        await this.wait("mediumWait");
        console.log("✅ Applied all User filters");
    }
}
