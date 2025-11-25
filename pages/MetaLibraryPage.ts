import { AdminHomePage } from "./AdminHomePage";
import { BrowserContext, expect, Page } from "@playwright/test";
import fs from 'fs'
import path from "path";
import { filePath } from "../data/MetadataLibraryData/filePathEnv";


export class MetaLibraryPage extends AdminHomePage {

    public selectors = {
        ...this.selectors,
        metadataLibraryLabel: "//h1[text()='metadata library']",
        categorySearchField: "//input[@id='category-search-field']",
        addCategoryBtn: "//button[text()='Add Category']",
        addDepartmentBtn: "//button[text()='Add Department']",
        categoryNameInput: "//input[@id='data_name']",
        categoryDescriptionInput: "//div[contains(@id,'data_description')]//p",
        saveBtn: "//button[text()='Save']",
        categoryVerification: (data: string) => `//div[contains(@class,'lms-cate-data')]/span[text()='${data}']`,
        providerExpandBtn: "//div[@id='provider-header']",
        addProviderBtn: "//button[text()='Add Provider']",
        providerSearchField: "//input[@id='provider-search-field']",
        providerVerification: (data: string) => `//span[text()='${data}']`,
        ceuProviderExpandBtn: "//div[@id='ceu-provider-header']",
        addCEUProviderBtn: "//button[text()='Add CEU Provider']",
        ceuProviderSearchField: "//input[@id='ceuprovider-search-field']",
        ceuProviderVerification: (data: string) => `//div[@id='ceu-provider-header']//following::span[text()='${data}']`,
        ceuTypeExpandBtn: "//div[@id='ceu-type-header']",
        addCEUTypeBtn: "//button[text()='Add CEU Type']",
        ceuTypeSearchField: "//input[@id='ceutypeprovider-search-field']",
        ceuTypeVerification: (data: string) => `//div[@id='ceu-type-header']/following::span[text()='${data}']`,
        tagsExpandBtn: "//div[@id='tag-header']",
        addTagsBtn: "//button[text()='Add Tag']",
        tagsSearchField: "//input[@id='tag-search-field']",
        tagsVerification: (data: string) => `//div[@id='tag-header']//following::span[text()='${data}']`,
        departmentSearchField: "//input[@id='department-search-field']",
        departmentVerification: (data: string) => `//div[@id='department-header']//following::span[text()='${data}']`,
        employmentTypeExpandBtn: "//div[@id='employment-header']",
        addEmploymentTypeBtn: "//button[text()='Add Employment Type']",
        employmentTypeSearchField: "//input[@id='employment-search-field']",
        employmentTypeVerification: (data: string) => `//div[@id='employment-header']//following::span[text()='${data}']`,
        userTypesExpandBtn: "//div[@id='usertypes-header']",
        addUserTypeBtn: "//button[text()='Add User Type']",
        userTypeSearchField: "//input[@id='usertypes-search-field']",
        userTypeVerification: (data: string) => `//div[@id='usertypes-header']//following::span[text()='${data}']`,
        jobRolesExpandBtn: "//div[@id='jobroles-header']",
        addJobRoleBtn: "//button[text()='Add Job Role']",
        jobRoleSearchField: "//input[@id='jobroles-search-field']",
        jobRoleVerification: (data: string) => `//div[@id='jobroles-header']//following::span[text()='${data}']`,
        jobTitleExpandBtn: "//div[@id='jobtitle-header']",
        addJobTitleBtn: "//button[text()='Add Job Title']",
        jobTitleSearchField: "//input[@id='jobtitle-search-field']",
        jobTitleVerification: (data: string) => `//div[@id='jobtitle-header']//following::span[text()='${data}']`,
        typeBtn: "(//label[text()='Type']//parent::div//button)[1]",
        cancellationTypes: (option: string) => `//span[text()='${option}']`,
        addAnotherPolicyButton: "//button[text()='Add Another Policy']",
        languageExpanBtn: "//div[@id='language-header']",
        languageCheckBox: `//div[contains(@id,'language')]//following::i[contains(@class,'fa-duotone fa-circle icon')]`,
        equipmentExpandBtn: `//div[@id='equipment-header']`,
        addEquipmentBtn: "//button[text()='Add Equipment']",
        equipmentname: "#data_name",
        equipmentSearchInput: "input#equipment-search-field",
        listOfPeopleDepartment: "div[id='department'] div[class$='content-start'] span",
        listOfPeopleEmployment: "div[id='employment'] div[class$='content-start'] span",
        listOfPeopleUsertypes: "div[id='usertypes'] div[class$='content-start'] span",
        listOfPeopleManager: "div[id='manager'] div[class$='content-start'] span",
        listOfPeopleJobtitle: "div[id='jobtitle'] div[class^='lms-cate-data']  span",
        listOfPeopleJobroles: "div[id='jobroles'] div[class^='lms-cate-data']  span",
        listofCEUType: "div[id='ceu-type'] div[class$='content-start'] span",
        listOfTags: "div[id='tag'] div[class^='lms-cate-data'] span",
        listofCEUProvider: "div[id='ceu-provider'] div[class$='content-start'] span",
        //retriving single data-xpath
        newOfTag: (data: string) =>`//div[@id='tag']//div[contains(@class, 'lms-cate-data')]//span[text()='${data}']`,
        newofCEUType: (data: string) =>`//div[@id='ceu-type']//div[contains(@class,'content-start')]//span[text()='${data}']`,
        newofCEUProvider:(data: string) =>`//div[@id='ceu-provider']//div[contains(@class, 'content-start')]//span[text()='${data}']`,
        newOfPeopleDepartment:(data: string) =>`//div[@id='department']//div[contains(@class, 'content-start')]//span[text()='${data}']`,
        newOfPeopleEmployment:(data: string) => `//div[@id='employment']//div[contains(@class, 'content-start')]//span[text()='${data}']`,
        newOfPeopleUsertypes: (data: string) => `//div[@id='usertypes']//div[contains(@class, 'content-start')]//span[text()='${data}']`,
        newOfPeopleJobroles: (data: string) =>`//div[@id='jobroles']//div[starts-with(@class, 'lms-cate-data')]//span[text()='${data}']`,
        newOfPeopleJobtitle:(data: string) => `//div[@id='jobtitle']//div[starts-with(@class, 'lms-cate-data')]//span[text()='${data}']`,

        //category list
        newOfLearningCategory:(data: string) => `//div[@id='category']//div[starts-with(@class, 'lms-cate-data')]//span[text()='${data}']`,
        
        //language list
        languageList: `//div[contains(@id,'language')]//following::div[contains(@class,'text-truncate')]//span`,
        languageDotRadioBtn: `//div[contains(@id,'language')]//following::i[contains(@class,'fa-duotone fa-dot-circle icon')]`,
        //Cancellation policy
        daysToStart: `//input[@id='days']`,
        percentageToDeduct: `//input[@id='refund_percentage']`,
        deleteIcon: (option: string) => `//span[text()='${option}']//following::i[@aria-label='Delete']`,
        yesBtn: `//button[text()='Yes']`,
        //Currency
        currencyList: `//div[@id='currency-Body']//div[contains(@class,'text-truncate')]//span`,
        currencyHeader: `//div[@id='currency-header']`,
        loadMoreInCurrencyList: `//button[@id='currency-btn-submit']`,
        toggleSwitchInCurrency: (option: string) => `//span[text()='${option}']//following::i`, 
        //click edit icon
        editIcon: (data: string) => `(//span[text()='${data}']//following::span[@aria-label='Edit'])[1]`,


    };

    constructor(page: Page, context: BrowserContext) {
        super(page, context);
    }

    

    async verify_MetaDataLibrary_Label() {
        await this.spinnerDisappear();
        await this.validateElementVisibility(this.selectors.metadataLibraryLabel, "Metadata Library");
    }

    // async categorySearchfield(data: string) {
    //     await this.type(this.selectors.categorySearchField, "Search Field", data);
    //     await this.keyboardAction(this.selectors.categorySearchField, "Enter", "Search Field", data);
    // }

    async categorySearchfield(data: string) {
        await this.wait("minWait");
        await this.retrieveData(this.selectors.newOfLearningCategory(data), filePath.catagory    )
        await this.type(this.selectors.categorySearchField, "Search Field", data);
        await this.keyboardAction(this.selectors.categorySearchField, "Enter", "Search Field", data);
        // await this.spinnerDisappear();
    }

    public async clickDeleteRecentlyCreated(option: "Classroom" | "Virtual Class") {
        const locator = this.page.locator(this.selectors.deleteIcon(option)).first();
        locator.click();
        await this.wait("minWait");
        await this.click(this.selectors.yesBtn, "Yes", "Button");
        await this.wait("mediumWait");
    }

    async addCategory() {
        await this.validateElementVisibility(this.selectors.addCategoryBtn, "Add Category");
        await this.click(this.selectors.addCategoryBtn, "Add Category", "Button");
    }

    async addDepartment() {
        await this.spinnerDisappear();
        await this.validateElementVisibility(this.selectors.addDepartmentBtn, "Add Department");
        await this.mouseHover(this.selectors.addDepartmentBtn, "Add Department");
        await this.click(this.selectors.addDepartmentBtn, "Add Department", "Button");
    }

    async name(data: string) {
        await this.type(this.selectors.categoryNameInput, "Name", data);
        await this.wait('minWait');
    }

    async description(data: string) {
        await this.type(this.selectors.categoryDescriptionInput, "Description", data);
    }

    async saveButton() {
        await this.validateElementVisibility(this.selectors.saveBtn, "Save");
        await this.wait('minWait');
        await this.page.locator(this.selectors.saveBtn).scrollIntoViewIfNeeded();
        await this.click(this.selectors.saveBtn, "Save", "Button");
        // await this.spinnerDisappear();
    }

    async verifyCategory(data: string) {
        await this.wait("minWait");
        await this.verification(this.selectors.categoryVerification(data), data);
    }

    async providerExpandButton() {
        // await this.spinnerDisappear();
        await this.mouseHover(this.selectors.providerExpandBtn, "Provider");
        await this.click(this.selectors.providerExpandBtn, "Provider", "Expand Button");
    }

    async addProvider() {
        await this.validateElementVisibility(this.selectors.addProviderBtn, "Add Provider");
        await this.click(this.selectors.addProviderBtn, "Add Provider", "Button");
    }

    async providerSearchField(data: string) {
        await this.type(this.selectors.providerSearchField, "Search Field", data);
        await this.keyboardAction(this.selectors.providerSearchField, "Enter", "Search Field", data);
    }

    async verifyProvider(data: string) {
        await this.verification(this.selectors.providerVerification(data), data);
    }

    async CEU_ProviderExpandButton() {
        await this.spinnerDisappear();
        await this.mouseHover(this.selectors.ceuProviderExpandBtn, "CEU Provider");
        await this.click(this.selectors.ceuProviderExpandBtn, "CEU Provider", "Expand Button");
    }

    async add_CEU_Provider() {
        await this.validateElementVisibility(this.selectors.addCEUProviderBtn, "Add CEU Provider");
        await this.click(this.selectors.addCEUProviderBtn, "Add CEU Provider", "Button");
    }

    // async ceuProviderSearchField(data: string) {
    //     await this.retrieveData(this.selectors.listofCEUProvider, '../data/peopleCEUProviderData.json')
    //     await this.type(this.selectors.ceuProviderSearchField, "Search Field", data);
    //     await this.keyboardAction(this.selectors.ceuProviderSearchField, "Enter", "Search Field", data);
    // }

    async verifyceuProvider(data: string) {
        await this.verification(this.selectors.ceuProviderVerification(data), data);
    }

    async CEU_TypeExpandButton() {
        await this.spinnerDisappear();
        await this.mouseHover(this.selectors.ceuTypeExpandBtn, "CEU Type");
        await this.click(this.selectors.ceuTypeExpandBtn, "Provider", "Expand Button");
    }

    async addCEU_Type() {
        await this.validateElementVisibility(this.selectors.addCEUTypeBtn, "CEU Type");
        await this.click(this.selectors.addCEUTypeBtn, "CEU TYPE", "Button");
    }

    // async ceuTypeSearchField(data: string) {
    //     await this.retrieveData(this.selectors.listofCEUType, "../data/peopleCEUData.json")
    //     await this.type(this.selectors.ceuTypeSearchField, "Search Field", data);
    //     await this.keyboardAction(this.selectors.ceuTypeSearchField, "Enter", "Search Field", data);
    // }

    async verify_ceuType(data: string) {
        await this.verification(this.selectors.ceuTypeVerification(data), data);
    }

    async tagsExpandButton() {
        await this.spinnerDisappear();
        await this.mouseHover(this.selectors.tagsExpandBtn, "Tags");
        await this.click(this.selectors.tagsExpandBtn, "Tags", "Expand Button");
    }

    async addTags() {
        await this.validateElementVisibility(this.selectors.addTagsBtn, "Add Tags");
        await this.click(this.selectors.addTagsBtn, "Add Tags", "Button");
    }

    // async tagsSearchField(data: string) {
    //     await this.retrieveData(this.selectors.listOfTags, "../data/peopleCEUTags.json")
    //     await this.type(this.selectors.tagsSearchField, "Search Field", data);
    //     await this.keyboardAction(this.selectors.tagsSearchField, "Enter", "Search Field", data);
    //     await this.spinnerDisappear();
    // }

    async verify_Tags(data: string) {
        await this.verification(this.selectors.tagsVerification(data), data);
    }


    // async department_SearchField(data: string) {
    //     await this.retrieveData(this.selectors.listOfPeopleDepartment, "../data/peopleDepartmentData.json")
    //     await this.type(this.selectors.departmentSearchField, "Search Field", data);
    //     await this.keyboardAction(this.selectors.departmentSearchField, "Enter", "Search Field", data);
    //     await this.spinnerDisappear();
    // }

    async verify_Department(data: string) {
        await this.spinnerDisappear();
        await this.verification(this.selectors.departmentVerification(data), data);
    }

    async employmentTypeExpandButton() {
        await this.wait("maxWait");
        await this.mouseHover(this.selectors.employmentTypeExpandBtn, "Employment Type");
        await this.click(this.selectors.employmentTypeExpandBtn, "Employment Type", "Button");
    }

    async addEmploymentTypeButton() {
        await this.validateElementVisibility(this.selectors.addEmploymentTypeBtn, "Add Employment Type");
        await this.click(this.selectors.addEmploymentTypeBtn, "Add Employment Type", "Button");
    }

    // async addEmploymentType_SearchButton(data: string) {
    //     await this.retrieveData(this.selectors.listOfPeopleEmployment, '../data/peopleEmploymentData.json')
    //     await this.type(this.selectors.employmentTypeSearchField, "Search Field", data);
    //     await this.keyboardAction(this.selectors.employmentTypeSearchField, "Enter", "Search Field", data);
    //     await this.spinnerDisappear();
    // }

    async verify_addEmploymentType(data: string) {
        await this.verification(this.selectors.employmentTypeVerification(data), data);
    }

    async userTypesExpandButton() {
        await this.mouseHover(this.selectors.userTypesExpandBtn, "Employment Type");
        await this.click(this.selectors.userTypesExpandBtn, "Employment Type", "Button");
    }

    async addUserTypeButton() {
        await this.validateElementVisibility(this.selectors.addUserTypeBtn, "Add Employment Type");
        await this.click(this.selectors.addUserTypeBtn, "Add Employment Type", "Button");
    }

    // async userType_SearchButton(data: string) {
    //     await this.retrieveData(this.selectors.listOfPeopleUsertypes, "../data/peopleUserTypeData.json");
    //     await this.type(this.selectors.userTypeSearchField, "Search Field", data);
    //     await this.keyboardAction(this.selectors.userTypeSearchField, "Enter", "Search Field", data);
    //     await this.spinnerDisappear();
    // }

    async verify_UserType(data: string) {
        await this.spinnerDisappear();
        await this.validateElementVisibility(this.selectors.userTypeVerification(data), data);
    }

    async jobRolesExpandButton() {
        await this.spinnerDisappear();
        await this.mouseHover(this.selectors.jobRolesExpandBtn, "Job Roles");
        await this.click(this.selectors.jobRolesExpandBtn, "Job Roles", "Button");
    }

    async addJobRole() {
        await this.validateElementVisibility(this.selectors.addJobRoleBtn, "Add Role Job");
        await this.click(this.selectors.addJobRoleBtn, "Add Role Job", "Button");
    }

    // async addJobRole_SearchField(data: string) {
    //     await this.retrieveData(this.selectors.listOfPeopleJobroles, "../data/peopleJobRoles.json");
    //     await this.type(this.selectors.jobRoleSearchField, "Search Field", data);
    //     await this.keyboardAction(this.selectors.jobRoleSearchField, "Enter", "Search Field", data);
    //     await this.spinnerDisappear();
    // }

    async verify_JobRole(data: string) {
        await this.spinnerDisappear();
        await this.validateElementVisibility(this.selectors.jobRoleVerification(data), data);
    }

    async jobTitleExpandButton() {
        await this.validateElementVisibility(this.selectors.jobTitleExpandBtn, "Job Title");
        await this.wait('minWait');
        await this.mouseHover(this.selectors.jobTitleExpandBtn, "Job Title");
        await this.click(this.selectors.jobTitleExpandBtn, "Job Title", "Button");
    }

    async addJobTitle_Button() {
        await this.click(this.selectors.addJobTitleBtn, "Add Job Title", "Button");
    }

    // async jobtitle_SearchField(data: string) {
    //     await this.retrieveData(this.selectors.listOfPeopleJobtitle, "../data/peopleJobtitle.json");
    //     await this.type(this.selectors.jobTitleSearchField, "Search Field", data);
    //     await this.keyboardAction(this.selectors.jobTitleSearchField, "Enter", "Search Field", data);
    //     await this.spinnerDisappear();
    // }

    async retrieveData(locator: string, filepath: string) {
        const length = await this.page.locator(locator).count();
        const data: string[] = [];

        for (let i = 0; i < length; i++) {
            const personData = await this.page.locator(locator).nth(i).innerHTML();
            if (personData) {
                data.push(personData.trim());
            }
        }
        fs.writeFileSync(path.join(__dirname, filepath), JSON.stringify(data, null, 2));
    }



    async verify_JobTitile(data: string) {
        await this.spinnerDisappear();
        await this.validateElementVisibility(this.selectors.jobTitleVerification(data), data);
    }

    // public async clickOnTypeAndSelectType(option: "E-Learning" | "Classroom" | "Virtual Class" | "Learning Path" | "Certification") {
    //     await this.mouseHover(this.selectors.typeBtn, "Type");
    //     await this.click(this.selectors.typeBtn, "Type", "Button");
    //     switch (option) {
    //         case "E-Learning":
    //             await this.click(this.selectors.cancellationTypes("E-Learning"), "E-Learning", "Dropdown");
    //             break;
    //         case "Certification":
    //             await this.click(this.selectors.cancellationTypes("Certification"), "E-Learning", "Dropdown");
    //             break;
    //         case "Classroom":
    //             await this.click(this.selectors.cancellationTypes("Classroom"), "E-Learning", "Dropdown");
    //             break;
    //         case "Learning Path":
    //             await this.click(this.selectors.cancellationTypes("Learning Path"), "E-Learning", "Dropdown");
    //             break;
    //         case "Virtual Class":
    //             await this.click(this.selectors.cancellationTypes("Virtual Class"), "E-Learning", "Dropdown");
    //             break;
    //     }
    // }

    public async clickAddAnotherPolicy() {
        await this.mouseHover(this.selectors.addAnotherPolicyButton, "Add Another Policy");
        await this.click(this.selectors.addAnotherPolicyButton, "Add Another Policy", "Button");
        await this.wait("minWait")
    }

    public async clickLanuageExpandButton() {
        await this.validateElementVisibility(this.selectors.languageExpanBtn, "Language");
        await this.click(this.selectors.languageExpanBtn, "Language", "Button");
    }

    public async clickCheckBox() {
        const checkboxes = await this.page.$$(this.selectors.languageCheckBox);
        if (checkboxes.length === 0) {
            console.log('No checkboxes found.');
            return;
        }
        while (checkboxes.length > 0) {
            const randomIndex = Math.floor(Math.random() * checkboxes.length);
            const randomCheckbox = checkboxes[randomIndex];
            const isDisabled = await randomCheckbox.evaluate((el) => el.hasAttribute('disabled'));
            if (!isDisabled) {
                await randomCheckbox.hover();
                await randomCheckbox.click();
                await this.spinnerDisappear();
                console.log('Clicked a checkbox.');
                break;
            } else {
                checkboxes.splice(randomIndex, 1);
                console.log('Found a disabled checkbox, trying another.');
            }
        }
        if (checkboxes.length === 0) {
            console.log('All checkboxes are disabled.');
        }

    }

    public async clickEquipmentButton() {
        await this.validateElementVisibility(this.selectors.equipmentExpandBtn, "Equipment");
        await this.click(this.selectors.equipmentExpandBtn, "Equipment", "Button");
    }
    public async equipmentExpandButton() {
        await this.validateElementVisibility(this.selectors.equipmentExpandBtn, "Equipment");
        await this.click(this.selectors.equipmentExpandBtn, "Equipment", "Button");
    }

    public async clickAddEquipment() {
        await this.click(this.selectors.addEquipmentBtn, "Add Equipment", "Button");
    }

    public async enterEquipmentName(data: string) {
        await this.validateElementVisibility(this.selectors.equipmentname, "Name");
        await this.type(this.selectors.equipmentname, "Name", data)
    }

    public async verifyEquipment(data: string) {
        await this.typeAndEnter(this.selectors.equipmentSearchInput, "Search Input", data)
        await this.spinnerDisappear();
    }
    async tagsSearchField(data: string) {
        await this.retrieveData(this.selectors.newOfTag(data), filePath.tags)
        await this.type(this.selectors.tagsSearchField, "Search Field", data);
        await this.keyboardAction(this.selectors.tagsSearchField, "Enter", "Search Field", data);
        await this.spinnerDisappear();
    }
	
       async department_SearchField(data: string) {
        await this.retrieveData(this.selectors.newOfPeopleDepartment(data), filePath.department)
        await this.type(this.selectors.departmentSearchField, "Search Field", data);
        await this.keyboardAction(this.selectors.departmentSearchField, "Enter", "Search Field", data);
        await this.spinnerDisappear();
    }
	   async addEmploymentType_SearchButton(data: string) {
        await this.retrieveData(this.selectors.newOfPeopleEmployment(data), filePath.empType)
        await this.type(this.selectors.employmentTypeSearchField, "Search Field", data);
        await this.keyboardAction(this.selectors.employmentTypeSearchField, "Enter", "Search Field", data);
        await this.spinnerDisappear();
    }
	  async userType_SearchButton(data: string) {
        await this.retrieveData(this.selectors.newOfPeopleUsertypes(data), filePath.userType);
        await this.type(this.selectors.userTypeSearchField, "Search Field", data);
        await this.keyboardAction(this.selectors.userTypeSearchField, "Enter", "Search Field", data);
        await this.spinnerDisappear();
    }
		
	 async addJobRole_SearchField(data: string) {
        await this.retrieveData(this.selectors.newOfPeopleJobroles(data), filePath.jobRole);
        await this.type(this.selectors.jobRoleSearchField, "Search Field", data);
        await this.keyboardAction(this.selectors.jobRoleSearchField, "Enter", "Search Field", data);
        await this.spinnerDisappear();
    }
		
	   async jobtitle_SearchField(data: string) {
        await this.retrieveData(this.selectors.newOfPeopleJobtitle(data), filePath.jobTitle);
        await this.type(this.selectors.jobTitleSearchField, "Search Field", data);
        await this.keyboardAction(this.selectors.jobTitleSearchField, "Enter", "Search Field", data);
        await this.spinnerDisappear();
    }
	   async ceuTypeSearchField(data: string) {
        await this.retrieveData(this.selectors.newofCEUType(data), filePath.ceuData)
        await this.type(this.selectors.ceuTypeSearchField, "Search Field", data);
        await this.keyboardAction(this.selectors.ceuTypeSearchField, "Enter", "Search Field", data);
    }
	
	  async ceuProviderSearchField(data: string) {
        await this.retrieveData(this.selectors.newofCEUProvider(data), filePath.ceuProvider)
        await this.type(this.selectors.ceuProviderSearchField, "Search Field", data);
        await this.keyboardAction(this.selectors.ceuProviderSearchField, "Enter", "Search Field", data);
    }
 
    public async verifyLanguageRadioBtn() {
        const radioButtons = await this.page.locator(this.selectors.languageDotRadioBtn);
        const count = await radioButtons.count();
        expect(count).toBe(2);
        for (let i = 0; i < count; i++) {
            const radioButton = radioButtons.nth(i);
            const isDisabled = await radioButton.isDisabled();
            const isDisabledByClass = await radioButton.evaluate(el => el.classList.contains('disabled'));
            console.log(`Radio Button ${i + 1} is disabled: ${isDisabled || isDisabledByClass}`);
            if (i === 0) {
                expect(isDisabled || isDisabledByClass).toBeTruthy();
            } else if (i === 1) {
                expect(isDisabled || isDisabledByClass).toBeFalsy();
            }
        }
    }

    public async toggleSwitchInCurrency(data: string, action: string) {
        await this.wait("minWait")
        await this.click(this.selectors.currencyHeader, "Currency Header", "Button")
        await this.click(this.selectors.loadMoreInCurrencyList, "Load More", "Button")
        await this.wait("minWait")
        const toggleSwitch = this.page.locator(this.selectors.toggleSwitchInCurrency(data))
        if (action === "enable") {
            await toggleSwitch.nth(0).click();
        } else if (action === "disable") {
            await toggleSwitch.nth(1).click();
        }
        await this.wait("minWait")
    }
    // public async clickOnTypeAndSelectType(option: "E-Learning" | "Classroom" | "Virtual Class" | "Learning Path" | "Certification") {
    //     // Generate random values for days to start and percentage to deduct
    //     const randomDaysToStart = Math.floor(Math.random() * (200 - 10 + 1)) + 10; // Range: 10-200
    //     const randomPercentageToDeduct = Math.floor(Math.random() * (20 - 1 + 1)) + 1; // Range: 1-20
    //     await this.mouseHover(this.selectors.typeBtn, "Type");
    //     await this.click(this.selectors.typeBtn, "Type", "Button");
    //     const locator = this.page.locator(this.selectors.cancellationTypes(option)).last();
    //     if (!(await locator.isVisible())) {
    //         console.log(`Option "${option}" is already used or not available.`);
    //         return;
    //     }
    //     switch (option) {
    //         case "E-Learning":
    //             await locator.click();
    //             await this.type(this.selectors.percentageToDeduct, "Percentage to Deduct", randomPercentageToDeduct.toString());
    //             break;
    //         case "Certification":
    //             await locator.click();
    //             await this.type(this.selectors.percentageToDeduct, "Percentage to Deduct", randomPercentageToDeduct.toString());
    //             break;
    //         case "Learning Path":
    //             await locator.click();
    //             await this.type(this.selectors.percentageToDeduct, "Percentage to Deduct", randomPercentageToDeduct.toString());
    //             break;
    //         case "Classroom":
    //             await locator.click();
    //             await this.type(this.selectors.daysToStart, "Days to Start", randomDaysToStart.toString());
    //             await this.type(this.selectors.percentageToDeduct, "Percentage to Deduct", randomPercentageToDeduct.toString());
    //             break;
    //         case "Virtual Class":
    //             await locator.click();
    //             await this.type(this.selectors.daysToStart, "Days to Start", randomDaysToStart.toString());
    //             await this.type(this.selectors.percentageToDeduct, "Percentage to Deduct", randomPercentageToDeduct.toString());
    //             break;
    //     }
    // }
    public async currencyList() {
        await this.click(this.selectors.loadMoreInCurrencyList, "Load More", "Button")
        await this.wait("minWait")
         for (const options of await this.page.locator(this.selectors.currencyList).all()) {
             const value = await options.innerText();
             console.log(value)
         }
     }

     public async clickOnTypeAndSelectType(option: "E-Learning" | "Classroom" | "Virtual Class" | "Learning Path" | "Certification") {
        // Generate random values for days to start and percentage to deduct
        const randomDaysToStart = Math.floor(Math.random() * (200 - 10 + 1)) + 10; // Range: 10-200
        const randomPercentageToDeduct = Math.floor(Math.random() * (20 - 1 + 1)) + 1; // Range: 1-20
        await this.mouseHover(this.selectors.typeBtn, "Type");
        await this.click(this.selectors.typeBtn, "Type", "Button");
        const locator = this.page.locator(this.selectors.cancellationTypes(option)).last();
        if (!(await locator.isVisible())) {
            console.log(`Option "${option}" is already used or not available.`);
            return;
        }
        switch (option) {
            case "E-Learning":
                await locator.click();
                await this.type(this.selectors.percentageToDeduct, "Percentage to Deduct", randomPercentageToDeduct.toString());
                break;
            case "Certification":
                await locator.click();
                await this.type(this.selectors.percentageToDeduct, "Percentage to Deduct", randomPercentageToDeduct.toString());
                break;
            case "Learning Path":
                await locator.click();
                await this.type(this.selectors.percentageToDeduct, "Percentage to Deduct", randomPercentageToDeduct.toString());
                break;
            case "Classroom":
                await locator.click();
                await this.type(this.selectors.daysToStart, "Days to Start", randomDaysToStart.toString());
                await this.type(this.selectors.percentageToDeduct, "Percentage to Deduct", randomPercentageToDeduct.toString());
                break;
            case "Virtual Class":
                await locator.click();
                await this.type(this.selectors.daysToStart, "Days to Start", randomDaysToStart.toString());
                await this.type(this.selectors.percentageToDeduct, "Percentage to Deduct", randomPercentageToDeduct.toString());
                break;
        }
    }
    //edit icon in category
    public async clickEditIcon(data:string) {
        await this.wait("minWait");
        await this.mouseHover(this.selectors.categoryVerification(data),"Category Name");
        await this.click(this.selectors.editIcon(data), "Edit Icon", "Icon")
    }

}
