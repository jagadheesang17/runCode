import { Page, BrowserContext, expect } from "@playwright/test";
import { LearnerHomePage } from "./LearnerHomePage";
import { da } from "@faker-js/faker";
import { time } from "console";
import { stat } from "fs";
import { FakerData, generateCreditScore, getCurrentDateFormatted, getFutureDate, getFutureyear, getPastDate } from "../utils/fakerUtils";
import { getDayOfYear } from "date-fns/fp/getDayOfYear";
import { getYear } from "date-fns";
import { Certificate } from 'crypto';

export class ProfilePage extends LearnerHomePage {
    public selectors = {
        ...this.selectors,
        profileSettings: "(//div[@id='accountsetttings'])[1]",
        profileDetailsTab: "//a[text()='Details']",
        skillTab: "(//h5[text()='Skills']/following-sibling::i[contains(@class, 'fa-pencil')])[1]",
        nameDetails: "//h5[text()='Name and Details']/following::i[1]",
        addIcon: "//span[text()='Add']",
        skillNameField: "//label[text()='Skills']/following::input[@id='skill_name']",
        proficiencyField: "//label[text()='Proficiency']/following::input[@id='proficiency']",
        showToAllSkills: "(//span[text()='Show To All']/preceding-sibling::i)[2]",
        saveskills: "//button[text()='Save']",
        verifySkills: "//span[contains(text(),'saved')]",
        imgUpload: "//div//input[@id='userfiles']",
        confirmUpload: `//button[@id='cropSubmit']`,
        // saveNameDetails: "//button[text()='Save']",
        preference: "//a[text()='preferences']",
        preferenceTimeZone: "//div[@id='wrapper-lnr_timezone']",
        TimeZoneSearch: "//label[text()='TimeZone']/following::input[1]",
        oneProfile: "//a[text()='ONE-Profile']",
        oneProfileClick: "(//a[text()='Click Here'])[1]",
        oneProfilePage: "//h1[text()='One-Profile CEU Summary']",
        timezoneOptions: (option: string) => `(//span[contains(text(),'${option}')])[1]`,
        PreferenceLanguagesWrapper: "//label[text()='Language']/following::div[@id='wrapper-lnr_languages']",
        PreferenceLanguageInput: `//label[text()='Language']/following::input[1]`,
        PreferenceLanguage: (language: string) => `(//label[text()='Language']//following::span[text()='${language}'])[1]`,
        PreferenceCurrency: "//label[text()='Currency']/following::div[@id='wrapper-lnr_currency']",
        PreferenceCurrencyInput: "//label[text()='Currency']/following::input[1]",
        PreferenceCurrencyOption: (Option: string) => `//span[text()='${Option}']`,
        PreferenceCountry: "//label[text()='Country']/following::div[@id='wrapper-lnr_country']",
        PreferenceCountryInput: "//label[text()='Country']/following::input[1]",
        PreferenceCountryOption: (Option: string) => `//span[text()='${Option}']`,
        PreferenceStateOption: (Option: string) => `//span[text()='${Option}']`,
        PreferenceState: "//label[text()='Country']/following::div[@id='wrapper-lnr_state']",
        PreferenceStateInput: "//label[text()='State/Province']/following::input[1]",
        City: `//label[text()='City']/following::input[1]`,
        PreferenceDateFormat: "//label[text()='Date Format']/following::div[@id='wrapper-date_format']",
        PreferenceDateFormatInput: "//label[text()='Date Format']/following::input[1]",
        PreferenceDateFormatOption: (Option: string) => `//span[text()='${Option}']`,
        PreferenceDetailsPage: "//label[text()='Details page view']/following::div[@id='wrapper-details_page']",
        PreferenceDetailsPageInput: "//label[text()='Details page view']/following::input[1]",
        PreferenceDetailsPageOption: (Option: string) => `//span[text()='${Option}']`,
        ceuType: `//div[@id='wrapper-ceu_type']`,
        ceuOption: "//div[@id='wrapper-ceu_type']//li",
        PreferenceCreditPeriod: "//label[text()='Credit Period']/following::div[@id='wrapper-credit_period']",
        PreferenceCreditPeriodOption: (Option: string) => `(//span[text()='${Option}'])[1]`,
        CreditScore: "//label[text()='Target Credit']/following::input[1]",
        //PreferenceCreditPeriod:"//label[text()='Credit Period']/following::div[@id='wrapper-credit_period']",
        PreferenceAddress1: "//input[@id='address1']",
        PreferenceAddress2: "//input[@id='address2']",
        PreferenceZipcode: "//input[@id='zipcode']",
        PreferenceMobile: "//input[@id='mobile_number']",
        PreferencePhone: "//input[@id='phone_number']",
        PreferenceDepartment: "//label[text()='Department']/following::div[@id='wrapper-department']",
        PreferenceDepartmentInput: "//label[text()='Department']/following::input[1]",
        PreferenceDepartmentOption: (Option: string) => `//span[text()='${Option}']`,
        PreferenceEmployeeId: "//label[text()='Employee Id']/following::input[@id='target_credit']",
        PreferenceEmployeeType: "(//label[text()='Employee Type']/parent::div//button)[1]",
        PreferenceEmployeeTypeInput: "//label[text()='Employee Type']/following::input[1]",
        PreferenceEmployeeTypeOptions: (Option: string) => `//span[text()='${Option}']`,
        PreferenceJobRole: "//label[text()='Job Role']/following::div[@id='wrapper-job_role']",
        PreferenceJobRoleInput: "//label[text()='Job Role']/following::input[1]",
        PreferenceJobRoleOptions: (Option: string) => `//span[text()='${Option}']`,
        PreferenceJobTitle: "//label[text()='Job Title']/following::div[@id='wrapper-job_title']",
        PreferenceJobtitleInput: "//label[text()='Job Title']/following::input[1]",
        PreferenceJobtitleOptions: (Option: string) => `//span[text()='${Option}']`,
        PreferenceOrganization: "//label[text()='Organization']/following::div[@id='wrapper-organization']",
        PreferenceOrganizationInput: "//label[text()='Organization']/following::input[1]",
        PreferenceOrganiationOptions: (Option: string) => `//span[text()='${Option}']`,
        PreferenceUserType: "//label[text()='User Type']/following::div[@id='wrapper-user_type']",
        PreferenceUserTypeInput: "//label[text()='User Type']/following::input[1]",
        PreferenceUserTypeOptions: (Option: string) => `//span[text()='${Option}']`,
        PreferenceCreditTypeInput: "//label[text()='Credit Period']/following::input[1]",
        saveButton: "//button[text()='Save']",
        education: "(//h5[text()='Education']/following-sibling::i)[1]",
        addEducation: "//span[text()='Add']/preceding-sibling::i",
        verifyChanges: `//span[text()='Your changes have been saved']`,
        Language: "//select[@id='lnr_languages']/option",
        Currency: " //select[@id='lnr_currency']/option",
        Country: " //select[@id='lnr_country']/option",
        State: " //select[@id='lnr_state']/option",
        date: " //select[@id='date_format']/option",
        Details: "//select[@id='details_page']/option",
        Department: "//select[@id='department']/option",
        EmployeeType: "//div[@id='wrapper-employee_type']//li/a",
        JobRole: "//select[@id='job_role']/option",
        JobTitle: "//select[@id='job_title']/option",
        Organization: "//select[@id='organization']/option",
        UserType: "//select[@id='user_type']/option",
        oneProfileInfo: (data: string) => `(//div[contains(text(),'${data}')]//parent::div)[1]`,
        editAwards: "(//h5[text()='Awards']/following-sibling::i[contains(@class, 'fa-pencil')])[1]",
        awardYear: "//input[@id='userawardyear-input']",
        awardName: "//input[@id='userawardname']",
        company: "//input[@id='userawardcompany']",
        location: "//input[@id='userawardlocation']",
        upload: "//label[text()='Upload Certificate ']",
        // saveAwards: "//button[text()='Save']",
        fromDate: "//input[@id='education_from_date-input']",
        toDate: "//input[@id='education_to_date-input']",
        qualification: "//input[@id='qualification']",
        specialization: "//input[@id='specialization']",
        school: "//input[@id='school']",
        workExp: "(//h5[text()='Work Experience']/following-sibling::i)[1]",
        addWorkExp: "//span[text()='Add']/preceding-sibling::i",
        fromWDate: "//input[@id='workexp_from_date-input']",
        toWDate: "//input[@id='workexp_to_date-input']",
        designation: "//label[text()='Designation']//following-sibling::input",
        companyName: "//label[text()='Company']//following-sibling::input",
        locationName: "//label[text()='Location']//following-sibling::input",
        interests: "(//h5[text()='Interests']/following-sibling::i)[1]",
        interestsTitle: "//input[@id='interests']",
        interestTitleOption: (index: number) => `(//input[@id='interests'])[${index}]`,
        addInterest: "(//label[text()='Interests']/following::i)[1]",
        externalTraining: "(//h5[text()='External Training']/following-sibling::i)[1]",
        externalTrainingHeading: "//h5[@class='mb-0 h2_inactive' and text()='External Training']",
        verifyCertificate: "//span[text()='Verify Certificate By']",
        //  selectVerification: "//select[@id='selectedVerificationBy']",
        verifyBy: `//div[@id='wrapper-verify_by']`,
        selectManger: (userType: string) => `//div[@id='wrapper-verify_by']//span[text()='${userType}']`,
        managerOption: `//div[@id='wrapper-selectManager']`,
        managerOpt: (manager: string) => `//span[ @class='text' and contains(text(),'${manager}')]`,
        name: "//input[@id='trainingUserName']",
        othersName: `//input[@id='other_user_name']`,
        titleField: "(//input[@id='title'])[1]",
        issuedBy: "(//input[@id='company'])[1]",
        certificateNumber: "(//input[@id='certificate_number'])[1]",
        //completedOn: "//div[@id='complete_on']//button",
        completedOn: "//input[@id='completed_on-input']",
        //validityFrom: "//div[@id='validity_from']//button",
        validityFrom: "//input[@id='valid_from-input']",
        //validityTo: "//div[@id='validity_to']//button",
        validityTo: "//input[@id='valid_to-input']",
        uploadCert: `//span[text()='Upload Certificate']`,
        emailId: `//input[@id='email']`,
        //for viewing completion certificate
        clickViewCertificate: (data: string) => `//div[text()='${data}']//following::button[1]`,
        verifyCertificateDescription: `//div[contains(@id,'completioncertificate')]//p`,

        ////for address validation need to add more fields///////
        dropdownToggle: (label: string) => `(//label[text()='${label}']/following::button[@data-bs-toggle='dropdown'])[1]`,
        dropdownSearchInput: (label: string) => `(//label[text()='${label}']/following::input[@type='search'])[1]`,
        dropdownOption: (data: string) => `//span[text()='${data}']`,
        addressInput: (label: string) => `(//label[contains(text(),'${label}')]/following::input[contains(@id,'addres')])[1]`,
        inputField: (name: string) => `//input[@id="${name}"]`,
        approvalStatus: (certificate: string, status: string) => `(//span[text()='${certificate}']//following::span[text()='${status}'])[1]`,
        deleteExternalTraining: (certificate: string) => `(//span[text()='${certificate}']//following::i[contains(@class,'trash')])[1]`,


    }
    constructor(page: Page, context: BrowserContext) {
        super(page, context);
    }
    //for viewing the completion certificate
    async clickViewCertificateInOneProfile(courseName: string, data: string) {
        await this.click(this.selectors.oneProfile, "one-profile", "button");
        await this.wait('minWait');
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.click(this.selectors.oneProfileClick, "Click here", "link")
        ]);
        await newPage.waitForLoadState('load');
        await newPage.waitForSelector(this.selectors.oneProfilePage);
        await newPage.click(this.selectors.clickViewCertificate(courseName))
        await newPage.locator(this.selectors.verifyCertificateDescription).scrollIntoViewIfNeeded()
        const description = await newPage.textContent(this.selectors.verifyCertificateDescription)
        expect(description).toContain(data)
    }

    async clickProfile() {
        await this.validateElementVisibility(this.selectors.profileSettings, "profile")
        await this.wait('minWait');
        await this.click(this.selectors.profileSettings, "ProfileIMG", "IMG");
        await this.wait('mediumWait');
    }
    async detailsTab() {
        await this.click(this.selectors.profileDetailsTab, "details", "tab")
    }
    async preferenceTab() {
        await this.click(this.selectors.preference, "preference", "tab")
    }
    async preferenceTimeZone(timezone: string) {

        await this.click(this.selectors.preferenceTimeZone, "timezone", "dropdown")
        await this.type(this.selectors.TimeZoneSearch, "dropdown", timezone)
        await this.mouseHover(this.selectors.timezoneOptions(timezone), timezone);
        //await this.waitForSelector(this.selectors.timezoneOptions(timezone))
        await this.click(this.selectors.timezoneOptions(timezone), "dropdownOptions", "button")
    }
    async selectLanguage() {
        let language = "English"
        await this.click(this.selectors.PreferenceLanguagesWrapper, "Language", "Field");
        await this.type(this.selectors.PreferenceLanguageInput, "Language", language)
        await this.mouseHover(this.selectors.PreferenceLanguage(language), language);
        await this.click(this.selectors.PreferenceLanguage(language), language, "Button");


        // const Language = await this.page.$$(this.selectors.Language);
        // const count= Language.length;
        // const randomIndex = Math.floor(Math.random() *count)+1;
        // console.log(randomIndex)
        // const randomElement = Language[count].innerText();
        // const randomOptions = await randomElement
        // const trimmedRandomOption: string = randomOptions?.trim() || '';       
        // await this.type(this.selectors.PreferenceLanguageInput, "Input Field", trimmedRandomOption);
        // await this.mouseHover(this.selectors.PreferenceLanguage(trimmedRandomOption), trimmedRandomOption);
        // await this.click(this.selectors.PreferenceLanguage(trimmedRandomOption), trimmedRandomOption, "Button");

    }
    async selectCurrency() {
        const Currency = await this.page.$$(this.selectors.Currency);
        const randomIndex = Math.floor(Math.random() * Currency.length);
        const randomElement = Currency[randomIndex].textContent();
        const randomOptions = await randomElement
        const trimmedRandomOption: string = randomOptions?.trim() || '';
        await this.click(this.selectors.PreferenceCurrency, "Language", "Field");
        await this.type(this.selectors.PreferenceCurrencyInput, "Input Field", trimmedRandomOption);
        await this.mouseHover(this.selectors.PreferenceCurrencyOption(trimmedRandomOption), trimmedRandomOption);
        await this.click(this.selectors.PreferenceCurrencyOption(trimmedRandomOption), trimmedRandomOption, "Button");

    }
    async selectCountry() {
        const Country = await this.page.$$(this.selectors.Country);
        const randomIndex = Math.floor(Math.random() * Country.length);
        const randomElement = Country[randomIndex].textContent();
        const randomOptions = await randomElement
        const trimmedRandomOption: string = randomOptions?.trim() || '';
        await this.click(this.selectors.PreferenceCountry, "Language", "Field");
        await this.type(this.selectors.PreferenceCountryInput, "Input Field", trimmedRandomOption);
        await this.mouseHover(this.selectors.PreferenceCountryOption(trimmedRandomOption), trimmedRandomOption);
        await this.click(this.selectors.PreferenceCountryOption(trimmedRandomOption), trimmedRandomOption, "Button");

    }
    async selectState() {
        const state = await this.page.$$(this.selectors.State);
        const randomIndex = Math.floor(Math.random() * state.length);
        const randomElement = state[randomIndex].textContent();
        const randomOptions = await randomElement
        const trimmedRandomOption: string = randomOptions || '';
        await this.click(this.selectors.PreferenceState, "Language", "Field");
        await this.type(this.selectors.PreferenceStateInput, "Input Field", trimmedRandomOption);
        await this.mouseHover(this.selectors.PreferenceStateOption(trimmedRandomOption), trimmedRandomOption);
        await this.click(this.selectors.PreferenceStateOption(trimmedRandomOption), trimmedRandomOption, "Button");

    }
    async city() {
        await this.type(this.selectors.City, "City", FakerData.randomCityName())
    }
    async address1() {
        await this.type(this.selectors.PreferenceAddress1, "Address1", FakerData.getAddress());
    }
    async address2() {
        await this.type(this.selectors.PreferenceAddress2, "Address2", FakerData.getAddress());
    }
    async zipcode() {
        await this.type(this.selectors.PreferenceZipcode, "Zipcode", FakerData.getPinCode());
    }
    async mobile() {
        await this.type(this.selectors.PreferenceMobile, "Mobile", FakerData.getMobileNumber());
    }
    async phone() {
        await this.type(this.selectors.PreferencePhone, "Phone", FakerData.getMobileNumber());
    }
    async employeeId() {
        await this.type(this.selectors.PreferenceEmployeeId, "Employee Id", FakerData.getEmployeeid());
    }

    async selectDateFormat() {
        const date = await this.page.$$(this.selectors.date);
        const randomIndex = Math.floor(Math.random() * date.length);
        const randomElement = date[randomIndex].textContent();
        const randomOptions = await randomElement
        const trimmedRandomOption: string = randomOptions?.trim() || '';
        await this.click(this.selectors.PreferenceDateFormat, "DateFormat", "Field");
        await this.type(this.selectors.PreferenceDateFormatInput, "Input Field", trimmedRandomOption);
        await this.mouseHover(this.selectors.PreferenceDateFormatOption(trimmedRandomOption), trimmedRandomOption);
        await this.click(this.selectors.PreferenceDateFormatOption(trimmedRandomOption), trimmedRandomOption, "Button");

    }
    async selectDetailsPage() {
        const Details = await this.page.$$(this.selectors.Details);
        const randomIndex = Math.floor(Math.random() * Details.length);
        const randomElement = Details[randomIndex].textContent();
        const randomOptions = await randomElement
        const trimmedRandomOption: string = randomOptions?.trim() || '';
        await this.click(this.selectors.PreferenceDetailsPage, "DateFormat", "Field");
        await this.type(this.selectors.PreferenceDetailsPageInput, "Input Field", trimmedRandomOption);
        await this.mouseHover(this.selectors.PreferenceDetailsPageOption(trimmedRandomOption), trimmedRandomOption);
        await this.click(this.selectors.PreferenceDetailsPageOption(trimmedRandomOption), trimmedRandomOption, "Button");

    }
    async addAwards() {
        await this.click(this.selectors.editAwards, "Edit", "Icon");
        await this.click(this.selectors.addIcon, "Add", "Icon");
        await this.keyboardType(this.selectors.awardYear, FakerData.getcurrentYear());
        await this.type(this.selectors.awardName, "Awards Name", FakerData.getAwardName());
        await this.type(this.selectors.company, "Company", FakerData.getOrganizationName());
        await this.type(this.selectors.location, "Location", FakerData.getLocationName());
        await this.uploadFile(this.selectors.upload, "../data/sample.pdf");
        await this.click(this.selectors.showToAllSkills, "Show to All", "Link");

    }

    async addInterests() {
        await this.click(this.selectors.interests, "Interests", "Icon");
        await this.click(this.selectors.addIcon, "Add", "Icon");
        await this.type(this.selectors.interestTitleOption(1), "Enter Interest", FakerData.jobRole());
        await this.click(this.selectors.addInterest, "Add", "Icon");
        await this.type(this.selectors.interestTitleOption(2), "Enter Interest", FakerData.jobRole());
        await this.click(this.selectors.showToAllSkills, "Show To All", "Checkbox");
    }

    async certificateVerificationbyManager(Certificate:string,managerUser: string) {
        await this.click(this.selectors.externalTraining, "External Training", "Icon");
        await this.click(this.selectors.addIcon, "Add", "Icon");
        await this.type(this.selectors.titleField, "Title",Certificate);
        await this.type(this.selectors.issuedBy, "Issued By", FakerData.getOrganizationName());
        await this.type(this.selectors.certificateNumber, "Certificate Number", FakerData.getCertificationNumber());
        await this.typeAndEnter(this.selectors.completedOn, "Completed On", getCurrentDateFormatted());
        await this.typeAndEnter(this.selectors.validityFrom, "Valid From", getCurrentDateFormatted());
        await this.typeAndEnter(this.selectors.validityTo, "Validity To", getFutureDate());
        await this.uploadFile(this.selectors.uploadCert, "../data/sample.pdf");
        await this.click(this.selectors.verifyCertificate, "Verify Certificate By", "Checkbox");
        await this.click(this.selectors.verifyBy, "Manager/Other", "Dropdown")
        await this.click(this.selectors.selectManger("Manager"), "Manager", "Option")
        await this.click(this.selectors.managerOption, "Manager option", "Dropdown")
        //await this.click(this.selectors.managerOpt(managerUser),"Manager","Option")  
        await this.click(this.selectors.showToAllSkills, "Show To All", "Checkbox");
    }

    async certificateVerificationbyOther(email:string) {
        await this.click(this.selectors.externalTraining, "External Training", "Icon");
        await this.click(this.selectors.addIcon, "Add", "Icon");
        await this.type(this.selectors.titleField, "Title", FakerData.getcertificationTitle());
        await this.type(this.selectors.issuedBy, "Issued By", FakerData.getOrganizationName());
        await this.type(this.selectors.certificateNumber, "Certificate Number", FakerData.getCertificationNumber());
        await this.typeAndEnter(this.selectors.completedOn, "Completed On", getCurrentDateFormatted());
        await this.typeAndEnter(this.selectors.validityFrom, "Valid From", getCurrentDateFormatted());
        await this.typeAndEnter(this.selectors.validityTo, "Validity To", getFutureDate());
        await this.uploadFile(this.selectors.uploadCert, "../data/sample.pdf")
        await this.click(this.selectors.verifyCertificate, "Verify Certificate By", "Checkbox");
        await this.click(this.selectors.verifyBy, "Manager/others", "Dropdown")
        await this.click(this.selectors.selectManger("Others"), "Other", "Option")
        await this.type(this.selectors.othersName, "Name", FakerData.getFirstName());
        await this.type(this.selectors.emailId, "E-Mail", email)
        await this.click(this.selectors.showToAllSkills, "Show To All", "Checkbox");
    }




    async selectDepartment() {
        const Department = await this.page.$$(this.selectors.Department);
        const randomIndex = Math.floor(Math.random() * Department.length);
        const randomElement = Department[randomIndex].textContent();
        const randomOptions = await randomElement
        const trimmedRandomOption: string = randomOptions?.trim() || '';
        await this.click(this.selectors.PreferenceDepartment, "Department", "Field");
        await this.type(this.selectors.PreferenceDepartmentInput, "Input Field", trimmedRandomOption);
        await this.mouseHover(this.selectors.PreferenceDepartmentOption(trimmedRandomOption), trimmedRandomOption);
        await this.click(this.selectors.PreferenceDepartmentOption(trimmedRandomOption), trimmedRandomOption, "Button");
    }
    async selectEmployeeType() {
        await this.click(this.selectors.PreferenceEmployeeType, "Employee Type", "Field");
        const EmployeeCount = await this.page.locator(this.selectors.EmployeeType).count()
        const randomIndex = Math.floor(Math.random() * EmployeeCount + 1);
        await this.click(`(${this.selectors.EmployeeType})[${randomIndex}]`, "EmployeeType", "Dropdown");


    }
    async selectJobRole() {
        const JobRole = await this.page.$$(this.selectors.JobRole);
        const randomIndex = Math.floor(Math.random() * JobRole.length);
        const randomElement = JobRole[randomIndex].textContent();
        const randomOptions = await randomElement
        const trimmedRandomOption: string = randomOptions?.trim() || '';
        await this.click(this.selectors.PreferenceJobRole, "Job Role", "Field");
        await this.type(this.selectors.PreferenceJobRoleInput, "Input Field", trimmedRandomOption);
        await this.mouseHover(this.selectors.PreferenceJobRoleOptions(trimmedRandomOption), trimmedRandomOption);
        await this.click(this.selectors.PreferenceJobRoleOptions(trimmedRandomOption), trimmedRandomOption, "Button");
    }
    async selectJobTitle() {
        const JobTitle = await this.page.$$(this.selectors.JobTitle);
        const randomIndex = Math.floor(Math.random() * JobTitle.length);
        const randomElement = JobTitle[randomIndex].textContent();
        const randomOptions = await randomElement
        const trimmedRandomOption: string = randomOptions?.trim() || '';
        await this.click(this.selectors.PreferenceJobTitle, "Job Title", "Field");
        await this.type(this.selectors.PreferenceJobtitleInput, "Input Field", trimmedRandomOption);
        await this.mouseHover(this.selectors.PreferenceJobtitleOptions(trimmedRandomOption), trimmedRandomOption);
        await this.click(this.selectors.PreferenceJobtitleOptions(trimmedRandomOption), trimmedRandomOption, "Button");
    }
    async selectOrganization() {
        const organization = await this.page.$$(this.selectors.Organization);
        const randomIndex = Math.floor(Math.random() * organization.length);
        const randomElement = organization[randomIndex].textContent();
        const randomOptions = await randomElement
        const trimmedRandomOption: string = randomOptions?.trim() || '';
        await this.click(this.selectors.PreferenceOrganization, "Organization", "Field");
        await this.type(this.selectors.PreferenceOrganizationInput, "Input Field", trimmedRandomOption);
        await this.mouseHover(this.selectors.PreferenceOrganiationOptions(trimmedRandomOption), trimmedRandomOption);
        await this.click(this.selectors.PreferenceOrganiationOptions(trimmedRandomOption), trimmedRandomOption, "Button");
    }
    async selectUserType() {
        const UserType = await this.page.$$(this.selectors.UserType);
        const randomIndex = Math.floor(Math.random() * UserType.length);
        const randomElement = UserType[randomIndex].textContent();
        const randomOptions = await randomElement
        const trimmedRandomOption: string = randomOptions?.trim() || '';
        await this.click(this.selectors.PreferenceUserType, "User Type", "Field");
        await this.type(this.selectors.PreferenceUserTypeInput, "Input Field", trimmedRandomOption);
        await this.type(this.selectors.PreferenceUserTypeInput, "Input Field", trimmedRandomOption);
        await this.mouseHover(this.selectors.PreferenceUserTypeOptions(trimmedRandomOption), trimmedRandomOption);
        await this.click(this.selectors.PreferenceUserTypeOptions(trimmedRandomOption), trimmedRandomOption, "Button");
    }

    async ceuType() {
        await this.click(this.selectors.ceuType, "CEUTYPE", "dropdown");
        let count = await this.page.locator(this.selectors.ceuOption).count();
        let rNum = Math.floor(Math.random() * count) + 1
        await this.click(`(${this.selectors.ceuOption})[${rNum}]`, "CEUType", "option")
    }

    async creditPeriod(month: string) {
        await this.click(this.selectors.PreferenceCreditPeriod, "creditperiod", "dropdown");
        //  await this.type(this.selectors.PreferenceCreditTypeInput, "Input Field", month);
        await this.mouseHover(this.selectors.PreferenceCreditPeriodOption(month), month);
        await this.click(this.selectors.PreferenceCreditPeriodOption(month), "CreditPeriodOptions", "Button");
    }
    async creditScore() {
        const score: any = generateCreditScore();
        await this.type(this.selectors.CreditScore, "CreditScore", score.toString());
    }

    async clickSave() {
        //await this.waitForl(this.selectors.clickSave)
        await this.validateElementVisibility(this.selectors.saveButton, "save");
        await this.click(this.selectors.saveButton, "save", "button");
        await this.wait('mediumWait');
        //console.log(await this.getInnerText("label:text-is('Name') + div"));


    }

    async addSkills() {
        await this.click(this.selectors.skillTab, "skills", "button");
        await this.validateElementVisibility(this.selectors.addIcon, "skillNameField");
        await this.click(this.selectors.addIcon, "addskill", "button");
        await this.validateElementVisibility(this.selectors.skillNameField, "skillNameField");
        await this.type(this.selectors.skillNameField, "skillNameField", FakerData.getRandomSkill());
        await this.type(this.selectors.proficiencyField, "proficiencyField", FakerData.getRandomSkill());
        await this.click(this.selectors.showToAllSkills, "showToAllSkills", "Checkbox");
        await this.click(this.selectors.saveButton, "Saveskills", "button");
        await this.wait('minWait');
        await this.validateElementVisibility(this.selectors.verifySkills, "verification message");

    }
    async addImg() {
        const path = "../data/Profilepic.jpg"
        await this.click(this.selectors.nameDetails, "nameoption", "button");
        await this.uploadFile(this.selectors.imgUpload, path);
        await this.validateElementVisibility(this.selectors.confirmUpload, "Upload");
        await this.click(this.selectors.confirmUpload, "Upload", "button");
        await this.click(this.selectors.showToAllSkills, "showToAllSkills", "Checkbox");
    }
    async oneProfile() {
        await this.click(this.selectors.oneProfile, "one-profile", "button");
        await this.wait('minWait');
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.click(this.selectors.oneProfileClick, "Click here", "link")
        ]);

        await newPage.waitForLoadState('load');
        await newPage.waitForSelector(this.selectors.oneProfilePage);
        const title = await newPage.title();
        console.log(title);

        if (title.includes("ONE")) {
            console.log("One-profile tab opened");
        } else {
            console.error("One-profile tab not opened");
        }

        const verifyText = async (data: string) => {
            const info = await newPage.locator(this.selectors.oneProfileInfo(data)).allTextContents();
            await newPage.waitForTimeout(2000);
            console.log(info);
        };
        await newPage.waitForTimeout(5000);
        await verifyText("Employee Id");
        await verifyText("Email");
        await verifyText("Phone");

    }
    async chooseLanguage() {
        const options = this.selectors.languageDropdown;
        const optionsCount = await options.count();
        for (let i = 0; i < optionsCount; i++) {
            await this.click(this.selectors.language, "Language", "Dropdown");
            await options.nth(i).click();
            await this.page.waitForTimeout(1000);
        }

    }

    async timezone(city: string) {
        await this.click(this.selectors.timezone, "Timezone", "Dropdown");
        await this.type(this.selectors.timezoneSearchbox, "Timezone", city);
    }

    async currency(currency: string) {
        await this.click(this.selectors.currency, "Currency", "Dropdown");
        await this.type(this.selectors.currencyInput, "Currency", currency);
        await this.click(`//span[text()='${currency}']`, "Currency", "Dropdown");
    }

    async country(country: string) {
        await this.click(this.selectors.country, "United States", "Dropdown");
        await this.type(this.selectors.countryInput, "Country", country);
        await this.click(`//a/span[text()='${country}']`, "Country", "Dropdpwn");
    }

    async state(state: string) {
        await this.click(this.selectors.state, "State", "Dropdown");
        await this.type(this.selectors.stateInput, "State", state);
        await this.click(`//a/span[text()='${state}']`, "State", "Dropdown");
    }

    async cityDropdown(city: string) {
        await this.click(this.selectors.cityInput, "City", "Textbox");
        await this.type(this.selectors.cityInput, "City", city)
    }

    async dateFormat() {
        await this.click(this.selectors.date, "Date Format", "Dropdown");
        await this.click(this.selectors.dateFormat, "Date Format", "Dropdown");

    }

    async details(data: string) {
        await this.click(this.selectors.detailsPageView, "Details Page View", "Dropdown");
        await this.click(`//a/span[text()='${data}']`, "Details Page View", "Dropddown");
    }

    async creditFrom(month: string) {
        await this.click(this.selectors.creditPeriodFrom, "From", "Dropdown");
        await this.click(`(//a/span[text()='${month}'])[1]`, "From", "Dropdown");
    }

    async creditTo(month: string) {
        await this.click(this.selectors.creditPeriodTo, "To", "Dropdown");
        await this.click(`//div[@id='wrapper-credit_period1']//span[text()='${month}']`, "To", "Dropdown");
    }

    async targetCredit(target: string) {
        await this.type(this.selectors.targetCredit, "Target Credit", target);
    }

    async otherDetails(address1: string, address2: string, zipcode: string, mobile: string, phone: string, dept: string, id: string, empType: string,
        jobRole: string, jobTitle: string, organization: string, userType: string
    ) {
        await this.type(this.selectors.address1, "Address1", address1);
        await this.type(this.selectors.address2, "Address2", address2);
        await this.type(this.selectors.zipcode, "Zipcode", zipcode);
        await this.type(this.selectors.mobile, "Mobile Number", mobile);
        await this.type(this.selectors.phone, "Phone Number", phone);
        await this.click(this.selectors.department, "Department", "Dropdown");
        await this.type(this.selectors.departmentInput, "Department Input", dept);
        await this.click(`//a/span[text()='${dept}']`, "Department", "Dropdown");
        await this.type(this.selectors.employeeId, "Employee ID", id);
        await this.click(this.selectors.employeeType, "Employee Type", "Dropdown");
        await this.type(this.selectors.empTypeInput, "Employee Type", empType);
        await this.click(`//span[text()='${empType}']`, "Employee Type", "Dropdown");
        await this.click(this.selectors.jobRole, "Job Role", "Dropdown");
        await this.type(this.selectors.jobRoleInput, "Job Role", jobRole);
        await this.click(`//span[text()='${jobRole}']`, "Job Role", "Dropdown");
        await this.click(this.selectors.jobTitle, "Job Title", "Dropdown");
        await this.type(this.selectors.jobTitleInput, "Job Title", jobTitle);
        await this.click(`//span[text()='${jobTitle}']`, "Job Title", "Dropdown");
        await this.click(this.selectors.organization, "Organization", "Dropdown");
        await this.type(this.selectors.organizationInput, "Organization", organization);
        await this.click(`//span[text()='${organization}']`, "Organization", "Dropdown");
        await this.click(this.selectors.userType, "User Type", "Dropdown");
        await this.type(this.selectors.userTypeInput, "User Type", userType);
        await this.click(`//span[text()='${userType}']`, "User Type", "Dropdown");
        //terms
    }

    async addEducation() {
        await this.click(this.selectors.education, "Education", "Edit Icon");
        await this.click(this.selectors.addEducation, "Add", "Plus Icon");
        await this.typeAndEnter(this.selectors.fromDate, "From Date", getPastDate());
        await this.typeAndEnter(this.selectors.toDate, "To Date", FakerData.getQualification().graduationDate);
        await this.type(this.selectors.qualification, "Qualification", FakerData.getQualification().degree);
        await this.type(this.selectors.specialization, "Specialization", FakerData.getQualification().fieldOfStudy);
        await this.type(this.selectors.school, "School", FakerData.getQualification().institution);
        await this.validateElementVisibility(this.selectors.showToAllSkills, "Show To All");
        await this.click(this.selectors.showToAllSkills, "Show To All", "Checkbox");
    }

    async addWorkExperience() {
        await this.click(this.selectors.workExp, "Work Experience", "Edit Icon");
        await this.click(this.selectors.addWorkExp, "Add", "Plus Icon");
        await this.type(this.selectors.fromWDate, "From Date", getPastDate());
        await this.type(this.selectors.toWDate, "To Date", getCurrentDateFormatted());
        await this.type(this.selectors.designation, "Designation", FakerData.jobRole());
        await this.type(this.selectors.companyName, "Company", FakerData.getOrganizationName());
        await this.type(this.selectors.locationName, "Location", FakerData.getLocationName());
        await this.click(this.selectors.showToAllSkills, "Show To All", "Checkbox");
    }

    async verifySavedChanges() {
        await this.verification(this.selectors.verifyChanges, "Saved")
    }


    ///For user address verification
    public async select(country?: any, state?: any, timezone?: any) {
        await this.wait("mediumWait")
        const select = async (label: string, data: string) => {
            const toggleSelector = this.selectors.dropdownToggle(label);
            await this.click(toggleSelector, label, 'Dropdown');
            await this.wait("minWait")
            console.log("The country is:" + data)
            await this.type(this.selectors.dropdownSearchInput(label), label, data);
            const optionSelector = this.selectors.dropdownOption(data);
            await this.click(optionSelector, data, 'DropDown');
            await this.verification(toggleSelector, data);
        }
        await select("Country", country);
        await select("State/Province", state);
        await select("TimeZone", timezone);
    }
    async typeAddress(label: string, data: string) {
        const selector = this.selectors.addressInput(label);
        await this.type(selector, "Address", data);
    }
    async enter(name: string, data: string) {
        const selector = this.selectors.inputField(name);
        await this.type(selector, name, data);
    }

    /**
     * Verify external certificate approval status
     * @param certificate - The certificate/training name to locate
     * @param approved - The expected approval status (e.g., "Approved", "Rejected", "Pending")
     */
    async verifyExternalCertificateStatus(certificate: string, approved: string) {
        await this.wait("minWait");
        await this.validateElementVisibility(
            this.selectors.approvalStatus(certificate, approved),
            `${approved} Status`
        );
          await this.wait("maxWait");
        console.log(`✅ Verified: External certificate '${certificate}' has status '${approved}'`);
    }

    /**
     * Delete external training certificate by certificate name
     * @param certificate - Name of the certificate to delete
     */
    async deleteExternalTraining(certificate: string) {
        await this.wait("maxWait");
        console.log(`Attempting to delete external training certificate: '${certificate}'`);
        await this.validateElementVisibility(this.selectors.deleteExternalTraining(certificate),`Delete icon for ${certificate}`);
        await this.click(this.selectors.deleteExternalTraining(certificate),`Delete ${certificate}`,"Icon");
        await this.wait("minWait");
        console.log(`✅ Deleted external training certificate: '${certificate}'`);
    }

    /**
     * Verify External Training section is visible in learner profile
     */
    async verifyExternalTrainingIsVisible() {
        await this.wait("minWait");
        await this.validateElementVisibility(
            this.selectors.externalTrainingHeading,
            "External Training Section"
        );
        console.log("✅ External Training section is visible in profile");
    }

    /**
     * Verify External Training section is NOT visible in learner profile
     */
    async verifyExternalTrainingIsNotVisible() {
        await this.wait("minWait");
        const isVisible = await this.page.locator(this.selectors.externalTrainingHeading).isVisible();
        
        if (isVisible) {
            throw new Error("❌ External Training section is visible but should not be!");
        }
        
        console.log("✅ External Training section is NOT visible in profile (as expected)");
    }

     

}






