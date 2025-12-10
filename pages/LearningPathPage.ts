import path from "path";
import { PlaywrightWrapper } from "../utils/playwright";
import { AdminHomePage } from "./AdminHomePage";

import { FakerData, getCurrentDateFormatted, gettomorrowDateFormatted } from "../utils/fakerUtils";
import { create } from "domain";
import { FilterUtils } from "../utils/filterUtils";

export class LearningPathPage extends AdminHomePage {

    public selectors = {
        ...this.selectors,
        createLearningPathBtn: "//button[text()='CREATE LEARNING PATH']",
        title: "//input[@id='program-title']",
        languageBtn: "(//label[text()='Language']//parent::div//button)[1]",
        language: (data: string) => `//a//span[text()='${data}']`,
        description: "//div[@id='program-description']//p",
        saveBtn: "//button[@id='program-btn-save']",
        //  proceedBtn: "//button[text()='Yes, Proceed']", //commented on 24-02-2025
        proceedBtn: "//footer//following::button[contains(text(),'Yes, Proceed')]",
        //reCertificationAddCourseBtn: "(//button[text()='Add Selected Course'])[2]",
        addCourseBtn: "//button[contains(text(),'Add Course')]",
        addCourseCheckBox: "//i[contains(@class,'fa-duotone fa-square icon')]",
        courseChexbox: (course: string) => `(//div[text()='${course}']//following::i[contains(@class,'square icon')])[1]`,
        checkBox: (index: string) => `(//i[contains(@class,'fa-duotone fa-square icon')])[${index}]`,
        addSelectedCourseBtn: "//button[text()='Add Selected Course']",
        detailsTab: "//button[text()='Details']",
        catalogBtn: "(//label[@for='publishedcatalog']/i[contains(@class,'fa-circle icon')])[1]",
        updateBtn: "//button[text()='Update']",
        editLearningPathBtn: "//a[text()='Edit Learning Path']",
        addCourseSearchInput: "input[id^='program-structure-title-search']",
        successMessage: "//div[@id='lms-overall-container']//h3",
        createCertification: "//button[text()='CREATE CERTIFICATION']",
        createLearningPath: "//button[text()='CREATE LEARNING PATH']",
        editCertification: "//a[text()='Edit Certification']",
        hasRecertification: "//span[text()='Has Recertification']/preceding::i[contains(@class,'fad fa-square icon')]",
        //expiresBtn: "//label[text()='Expires']/parent::div//button[contains(@class,'customselectpicker')]", ---->Label has been changed
        expiresBtn: "(//label[text()='Expiry Based On']/parent::span//following-sibling::div//button)[1]",
        recertExpiresBtn: "(//label[contains(text(),'Recertification')]//following::button[@data-id='program-recert-compliance-validity'])[1]",
        //expiresInput: "//label[text()='Expires']/parent::div/input",
        expiresInput: "//input[@id='validity_days' or @id='expires_in_value']",
        daysLocator: "//span[text()='Days']",
        specificDateLocator: "//span[text()='Specific Date']",
        completionDateDDValue: "//span[text()='Completion Date']",
        complilanceOption: "div[id$='course-compliance-option'] button[class$='title']",
        recertExpiresInput: "//input[@id='program-recert-expires-days']",
        recertComplianceOption: "//label[contains(text(),'Recertification')]//following::button[@data-id='recert-course-compliance-option']",
        recertCompletionDateDDValue: "(//label[contains(text(),'Recertification')]//following::span[text()='Completion Date'])[1]",
        recertDaysLocator: "(//label[contains(text(),'Recertification')]//following::span[text()='Days'])[1]",

        // Recertification Complete by Rule selectors
        recertCompleteByRuleBtn: "//label[contains(text(),'Recertification')]//following::button[@data-id='program-recert-complete-by-rule']",
        recertCompleteByRuleYesOption: "//label[contains(text(),'Recertification')]//following::span[text()='Yes']",
        recertCompleteByDropdown: "//label[contains(text(),'Recertification')]//following::button[@data-id='program-recert-complete-by']",
        recertCompleteByDateOption: "(//label[contains(text(),'Recertification')]//following::span[text()='Date'])[2]",
        recertCompleteByDaysFromEnrollmentOption: "//label[contains(text(),'Recertification')]//following::span[text()='Days from enrollment']",
        recertCompleteByDaysFromHireOption: "//label[contains(text(),'Recertification')]//following::span[text()='Days from hire']",
        recertCompleteDaysInput: "//label[contains(text(),'Recertification')]//following::input[@id='program-recert-complete-days']",
        recertCompleteByDateInput: "//label[contains(text(),'Recertification')]//following::input[@id='program-recert-complete-by-date-input']",

        // Anniversary Date selectors
        anniversaryDateLocator: "//span[text()='Anniversary Date']",
        anniversaryTypeDropdown: "//div[@id='wrapper-anniversary-type']",
        anniversaryTypeOption: (value: string) => `//span[text()='${value}']`,
        anniversaryRangeDropdown: "#wrapper-anniversary-range",
        anniversaryRangeOption: (value: string) => `//span[text()='${value}']`,
        afterYearsInput: "//label[text()='After Years']//following::input[1]",
        validityDateInput: "#validity_date-input",

        // Period Range selectors
        periodDropdown: "//button[@data-id='period-value']",
        periodOption: (value: string) => `//span[text()='${value}']`,
        periodYearsInput: "//label[text()='After Years']//following::input[1]",

        // Recertification expiry selectors
        recertSpecificDateLocator: "(//label[contains(text(),'Recertification')]//following::span[text()='Specific Date'])[1]",
        recertAnniversaryRangeOption: (value: string) => `(//label[contains(text(),'Recertification')]//following::span[text()='${value}'])[1]`,
        recertPeriodOption: (value: string) => `(//label[contains(text(),'Recertification')]//following::span[text()='${value}'])[1]`,
        recertAnniversaryTypeOption: (value: string) => `(//label[contains(text(),'Recertification')]//following::span[text()='${value}'])[1]`,
        recertAnniversaryDateLocator: "(//label[contains(text(),'Recertification')]//following::span[text()='Anniversary Date'])[1]",
        recertAnniversaryTypeDropdown: "(//label[contains(text(),'Recertification')]//following::button[@data-id='recert-anniversary-type'])[1]",
        recertAnniversaryRangeDropdown: "(//label[contains(text(),'Recertification')]//following::button[@data-id='recert-anniversary-range'])[1]",
        recertAfterYearsInput: "(//label[contains(text(),'Recertification')]//following::input[@id='fieldsMetadata.after_years.id'])[1]",
        recertValidityDateInput: "(//label[contains(text(),'Recertification')]//following::input[@id='recert_validity_date-input'])[1]",
        recertPeriodDropdown: "(//label[contains(text(),'Recertification')]//following::button[@data-id='recert-period-value'])[1]",
        recertPeriodYearsInput: "(//label[contains(text(),'Recertification')]//following::input[@id='fieldsMetadata.after_years.id'])[1]",
        monthsLocator: "//span[text()='Months']",
        yearsLocator: "//span[text()='Years']",
        price: "input#program-price",
        saveAsDraftCheckbox: "//span[text()='Save as Draft']/preceding::i[1]",
        currencyButton: "(//label[text()='Currency']/parent::div//button)[1]",
        currencyCount: "//label[text()='Currency']/parent::div//span[@class='text']",
        currencyIndex: (index: any) => `(//label[text()='Currency']/parent::div//span[@class='text'])[${index}]`,
        complianceBtn: "(//label[text()='Compliance']/parent::div//button)[1]",
        complianceYesBtn: "//footer//following::span[text()='Yes']",
        completeByRuleBtn: "(//label[text()='Complete by Rule']/parent::div//button)[1]",
        completeByInput: "//label[text()='Complete by']/parent::div//input",
        registractionEndsInput: "input#registration-ends-input",
        enforceLabel: "//span[text()='Enforce Sequencing']",
        enforceSequencingCheckbox: "//span[text()='Enforce Sequencing']/preceding-sibling::i[@class='fa-duotone fa-square']",
        recertificationAddCourse: "//label[text()='Recertification ']/parent::div//following-sibling::div//button[text()=' Add Course']",
        recertificationSaveBtn: "//label[text()='Recertification ']/parent::div//following-sibling::div//button[text()='Save']",
        verifyRecertificationCourse: (course: string) => `//label[text()='Recertification ']/parent::div//following-sibling::div//span[text()='${course}']`,
        usCurrency: "//span[text()='US Dollar']",
        domainDropdown: "//a[@class='dropdown-item selected']",
        domainDropdownValue: "//label[text()='Domain']/following-sibling::div//div[contains(@class,'dropdown-menu')]//span[@class='text']",
        domainSelectedText: "//div[contains(text(),'selected')]",
        domainOption: (domain_name: string) => `//div[@class='dropdown-menu show']//span[text()='${domain_name}']`,
        codeInput: `//label[text()='CODE']/following-sibling::input`,

        //select all courses in the TP
        checkAllCourse: `//label[contains(@for,'courseCheckAll')]`,

        //For Program Modules
        tpWithModulesCheckBox: `//span[text()='Training Plan With Modules']//preceding::i[@class='fa-duotone fa-square']`,
        moduleExpandIcon: `//*[contains(text(),'module')]//following::i[contains(@class,'lms-chevron-up-down')]`,
        addNewModuleBtn: `//button[text()=' Add New Module']`,
        moduleEditIcon: `//div[contains(text(),'module')]//preceding::i[@aria-label='Edit']`,
        moduleNameInput: `//input[contains(@id,'module_name_text')]`,
        moduleUpdateIcon: `//i[@aria-label='Update']`,
        updateCEU:`//i[@class='fa-duotone fa-pen pointer icon_14_1']`,

        //Attaching the different course to the recertification module:-
        // Choose Course Manually:-
        addCourseManually: `//span[text()='Add Courses Manually']`,
        addCourseManuallyRadioBtn: `//span[text()='Add Courses Manually']//preceding-sibling::i[contains(@class,'fa-circle')]`,
        copyFromCertificationPath: `//span[text()='Copy from certification path']`,
        copyFromCertificationPathRadioBtn: `//span[text()='Copy from certification path']//preceding-sibling::i[contains(@class,'fa-circle')]`,
        // Save button :-
        saveButton: `//button[text()='SAVE']`,

        //Course management in TP - Reorder, Delete, Optional
        courseReorderIcon: (courseName: string) => `(//span[text()='${courseName}']//following::i[@aria-label='Reorder'])[1]`,
        courseDeleteIcon: (courseName: string) => `(//span[text()='${courseName}']//following::i[@aria-label='Delete'])[1]`,
        courseRequiredCheckbox: (courseName: string) => `//span[text()='${courseName}']//following::i[contains(@class,'fa-square-check')]`,
        allCourseRequiredCheckboxes: (courseName: string) => `(//span[text()='${courseName}']//following::i[contains(@class,'fa-square-check')])[1]`,
        completionRequiredInput: `//input[@name='completionrequired']`,
        filterIcon: `(//div[text()='Filters'])[1]`,
        noMatchingResultMessage: `//h3[text()='No matching result found.']`,
        
        // Version Management selectors
        addVersionBtn: `//button[text()='Add Version']`,
        unselectAllCheckbox: `//span[text()='Unselect All']//preceding::i[contains(@class,'fa-square-check')]`,
        versionFormLabels: `//span[contains(@class,'form-label')]`,
        versionCheckbox: (label: string) => `//span[contains(@class,'form-label') and contains(text(),'${label}')]//preceding-sibling::i[contains(@class,'fa-square icon')]`,
        createVersionBtn: `//button[text()='Create']`,
        versionLabel: (versionNumber: string) => `//span[text()='Version: ${versionNumber}']`,
        yesBtn: `//button[text()='Yes']`,
        publishConfirmationMessage: `//b[text()='This action cannot be reversed. Are you sure you want to publish this Training plan?']`,
        publishVersionMessage: `//span[contains(text(),'By publishing this new version of the training plan, the previous version will become inactive. New enrollments will be allowed only to the new version, however you can transfer the previous enrollments to the new version from enrollments page.')]`,
        versionHistoryTitle: (version: string, title: string) => `//div[text()='Version: ${version}']//preceding::div[@title='${title}']`,
        
        // Enroll Again popup selectors
        enrollAgainPopupMessage: "//div[text()='The following courses can't be added to the learning path since it doesn't allow Enroll Again.']",
        enrollAgainPopupCourseName: (courseName: string) => `//footer//following::div[text()='${courseName}']`,
        enrollAgainPopupOKButton: "//footer//following::button[text()='OK']",
        
        // Recertification Enroll Again popup selectors
        recertEnrollAgainPopupMessage: "//div[text()='The following courses cannot be added to the re-certification because they do not support the enroll again functionality.']",
        versionEyeIcon: (title: string) => `//div[@title='${title}']//following::i[contains(@class,'fa-duotone pointer')]`,
        transferEnrollmentsBtn: `//button[text()='Transfer Enrollments']`,
        selectAllLearnersCheckbox: `//label[contains(@for,'selectalllearners')]`,
        transferLearnersBtn: `//button[text()='Transfer Learners']`,
        transferConfirmationMessage: `//span[text()='Transferring the learner to the new training will remove the enrollment of the existing training? Are you sure you want to transfer the selected learners?']`,
        editIconTP:(title: string) => `(//div[text()='${title}']//following::div[contains(@aria-label,'Edit')])[1]`,
        
        // Clone Learning Path selectors
        cloneIcon: (title: string) => `(//div[text()='${title}']//following::div[contains(@aria-label,'Copy')])[1]`,
        cloneFormLabels: `//span[@class='ms-1 rawtxt']`,
        cloneUnselectAllCheckbox: `//span[text()='Unselect All']//preceding::i[contains(@class,'fa-square-check')]`,
        clonePopupCheckbox: (label: string) => `//span[contains(@class,'ms-1 rawtxt') and contains(text(),'${label}')]//preceding-sibling::i[contains(@class,'fa-square icon')]`,
        createCopyBtn: `//button[text()='Create Copy']`,
        enrollments:`(//span[text()='Enrollments'])[2]`,
                saveRevalidate:`(//button[text()='Save'])[1]`,

                ceuCheckbox:`//i[@class='fa-duotone fa-square icon_16_1']`,
                addedCEU:`(//div[text()='Select']/following::span[@data-bs-toggle='tooltip'])[1]`,

                updateCEUUnit:`//input[@class='form-control form_field_active w-75']`,
                clickTickIcon:`//i[@class='fa-duotone fa-check icon_14_1']`,
                //Attaching the different course to the recertification module:-
        // Choose Course Manually:-
        checkRevalidateInCertification:`//span[text()='check to enable certification re-validation']/preceding::i[contains(@class,'square icon')]`,
                saveButton2: `(//button[text()='Save'])[1]`,
    
    };

	
    //Adding course manually to the recertification module:-
    async addCourseManually() {
        await this.validateElementVisibility(this.selectors.addCourseManually, "Add Course Manually");
        await this.click(this.selectors.addCourseManually, "Add Course Manually", "Button");
        await this.click(this.selectors.saveButton, "Save Button", "Button")
    }

    async clickCreateLearningPath() {
        await this.validateElementVisibility(this.selectors.createLearningPathBtn, "Learning Path");
        await this.mouseHover(this.selectors.createLearningPathBtn, "Learning Path Button")
        await this.click(this.selectors.createLearningPathBtn, "Learning Path", "Button");

    }

    async clickCreateCertification() {
        await this.wait("minWait")
        const createCertification = this.page.locator(this.selectors.createCertification);
        await this.validateElementVisibility(this.selectors.createCertification, "Create Certification");
        await createCertification.click({ force: true });
    }

    async title(data: string) {
        await this.validateElementVisibility(this.selectors.title, "Title");
        await this.type(this.selectors.title, "Title", data);
    }

    async language() {
        const data = "English"
        await this.click(this.selectors.languageBtn, "Language", "Button");
        await this.click(this.selectors.language(data), "Language", "Button");
    }

    async hasRecertification() {
        await this.click(this.selectors.hasRecertification, "Has Recertification", "Check Box");
    }

    async clickExpiresButton() {
        await this.click(this.selectors.expiresBtn, "Expires", "Button");
        await this.click(this.selectors.completionDateDDValue, "Completion Date", "Button");
        await this.type(this.selectors.expiresInput, "Expires Input", "1");
        await this.click(this.selectors.complilanceOption, "complilanceOption", "DD Button");
        await this.click(this.selectors.daysLocator, "Day", "DD Value")
    }

/*************  ✨ Windsurf Command ⭐  *************/
/*******  86c2f0e0-0dd5-4aa4-bd32-4a295dec8349  *******/
    async clickReCertExpiresButton() {
        await this.wait("minWait");
        await this.page.locator(this.selectors.recertExpiresBtn).scrollIntoViewIfNeeded();
        await this.click(this.selectors.recertExpiresBtn, "Recertification Expires", "Button");
        await this.click(this.selectors.recertCompletionDateDDValue, "Recertification Completion Date", "Button");
        await this.type(this.selectors.recertExpiresInput, "Recertification Expires Input", "1");
        await this.click(this.selectors.recertComplianceOption, "Recertification Compliance Option", "DD Button");
        await this.click(this.selectors.recertDaysLocator, "Recertification Day", "DD Value");
        console.log("✅ Set recertification expiry: Completion Date, 1 Day");
    }

    async clickExpiresDropdown() {
        await this.click(this.selectors.expiresBtn, "Expires", "Button");
        await this.wait("minWait");
    }
    async clickReCertExpiresDropdown() {
        await this.wait("minWait");
        await this.page.locator(this.selectors.recertExpiresBtn).scrollIntoViewIfNeeded();
        await this.click(this.selectors.recertExpiresBtn, "Expires", "Button");
        await this.wait("minWait");
    }
    /**
     * Click Expires Button with runtime expiry type option
     * @param expiryType - "Specific Date" or "Anniversary Date"
     * @param options - Configuration options based on expiry type
     * - For "Specific Date": no additional options needed (uses getTomorrowdateFormatted)
     * - For "Anniversary Date": 
     *   - anniversaryType: "Birth Date" | "Hire Date" | "Enrollment Date" | "Completion Date"
     *   - anniversaryRange: "Fixed Date" | "Period Range"
     *   - afterYears: string (number of years for Fixed Date)
     *   - period: "Month" | "Quarter" | "Year" (required for Period Range)
     *   - periodYears: string (number of years for Period Range)
     */

    async clickExpiresButtonWithType(
        expiryType: "Specific Date" | "Anniversary Date",
        options?: {
            anniversaryType?: "Birth Date" | "hire date" | "Enrollment Date" | "Completion Date";
            anniversaryRange?: "Fixed Date" | "Period Range";
            afterYears?: string;
            period?: "Month" | "Quarter" | "Year";
            periodYears?: string;
        }
    ) {
        console.log(`🔄 Setting expiry type: ${expiryType}`)

        if (expiryType === "Specific Date") {
            // Select Specific Date option
            await this.click(this.selectors.specificDateLocator, "Specific Date", "Option");
            await this.wait("minWait");
            // Enter tomorrow's date
            const tomorrowDate = gettomorrowDateFormatted();
            await this.typeAndEnter(this.selectors.validityDateInput, "Validity Date", tomorrowDate);
            console.log(`✅ Set Specific Date: ${tomorrowDate}`);
             await this.wait("minWait");

        } else if (expiryType === "Anniversary Date") {
            // Select Anniversary Date option
            await this.click(this.selectors.anniversaryDateLocator, "Anniversary Date", "Option");
            await this.wait("minWait");

            if (!options?.anniversaryType || !options?.anniversaryRange) {
                throw new Error("Anniversary Date requires anniversaryType and anniversaryRange options");
            }

            // Select Anniversary Type (Birth Date, Hire Date, Enrollment Date, Completion Date)
            console.log(`🔄 Selecting Anniversary Type: ${options.anniversaryType}`);
            await this.click(this.selectors.anniversaryTypeDropdown, "Anniversary Type", "Dropdown");
            await this.wait("minWait");
            await this.click(
                this.selectors.anniversaryTypeOption(options.anniversaryType),
                options.anniversaryType,
                "Option"
            );

            // Select Anniversary Range (Fixed Date, Period Range)
            console.log(`🔄 Selecting Anniversary Range: ${options.anniversaryRange}`);
            await this.click(this.selectors.anniversaryRangeDropdown, "Anniversary Range", "Dropdown");
            await this.wait("minWait");
            await this.click(
                this.selectors.anniversaryRangeOption(options.anniversaryRange),
                options.anniversaryRange,
                "Option"
            );

            // Handle Fixed Date or Period Range
            if (options.anniversaryRange === "Fixed Date") {
                if (!options.afterYears) {
                    throw new Error("Fixed Date requires afterYears option");
                }
                // Enter After Years for Fixed Date
                console.log(`🔄 Setting After Years: ${options.afterYears}`);
                await this.type(this.selectors.afterYearsInput, "After Years", options.afterYears);
                console.log(`✅ Set Anniversary Date - Type: ${options.anniversaryType}, Range: Fixed Date, After Years: ${options.afterYears}`);

            } else if (options.anniversaryRange === "Period Range") {
                if (!options.period || !options.periodYears) {
                    throw new Error("Period Range requires period (Month/Quarter/Year) and periodYears options");
                }

                // Select Period (Month, Quarter, Year)
                console.log(`🔄 Selecting Period: ${options.period}`);
                await this.click(this.selectors.periodDropdown, "Period", "Dropdown");
                await this.wait("minWait");
                await this.click(
                    this.selectors.periodOption(options.period),
                    options.period,
                    "Option"
                );

                // Enter Period Years
                console.log(`🔄 Setting Period Years: ${options.periodYears}`);
                await this.type(this.selectors.afterYearsInput, "Period Years", options.periodYears);
                console.log(`✅ Set Anniversary Date - Type: ${options.anniversaryType}, Range: Period Range, Period: ${options.period}, Years: ${options.periodYears}`);
            }
        }
    }

    /**
     * Click Recertification Expires Button with runtime expiry type option
     * @param expiryType - "Specific Date" or "Anniversary Date"
     * @param options - Configuration options based on expiry type
     * - For "Specific Date": no additional options needed (uses getTomorrowdateFormatted)
     * - For "Anniversary Date": 
     *   - anniversaryType: "Birth Date" | "Hire Date" | "Enrollment Date" | "Completion Date"
     *   - anniversaryRange: "Fixed Date" | "Period Range"
     *   - afterYears: string (number of years for Fixed Date)
     *   - period: "Month" | "Quarter" | "Year" (required for Period Range)
     *   - periodYears: string (number of years for Period Range)
     */
    async clickReCertExpiresButtonWithType(
        expiryType: "Specific Date" | "Anniversary Date",
        options?: {
            anniversaryType?: "Birth date" | "Hire date" | "Enrollment" | "Completion";
            anniversaryRange?: "Fixed Date" | "Period Range";
            afterYears?: string;
            period?: "Month" | "Quarter" | "Year";
            periodYears?: string;
        }
    ) {
        console.log(`🔄 Setting recertification expiry type: ${expiryType}`);

        if (expiryType === "Specific Date") {
            // Select Specific Date option for recertification
            await this.click(this.selectors.recertSpecificDateLocator, "Recertification Specific Date", "Option");
            await this.wait("minWait");

            // Enter tomorrow's date
            const tomorrowDate = gettomorrowDateFormatted();
            await this.type(this.selectors.recertValidityDateInput, "Recertification Validity Date", tomorrowDate);
            console.log(`✅ Set Recertification Specific Date: ${tomorrowDate}`);

        } else if (expiryType === "Anniversary Date") {
            // Select Anniversary Date option for recertification
            await this.click(this.selectors.recertAnniversaryDateLocator, "Recertification Anniversary Date", "Option");
            await this.wait("minWait");

            if (!options?.anniversaryType || !options?.anniversaryRange) {
                throw new Error("Anniversary Date requires anniversaryType and anniversaryRange options");
            }

            // Select Anniversary Type (Birth Date, Hire Date, Enrollment Date, Completion Date)
            console.log(`🔄 Selecting Recertification Anniversary Type: ${options.anniversaryType}`);
            await this.click(this.selectors.recertAnniversaryTypeDropdown, "Recertification Anniversary Type", "Dropdown");
            await this.wait("minWait");
            await this.click(
                this.selectors.recertAnniversaryTypeOption(options.anniversaryType),
                options.anniversaryType,
                "Option"
            );

            // Select Anniversary Range (Fixed Date, Period Range)
            console.log(`🔄 Selecting Recertification Anniversary Range: ${options.anniversaryRange}`);
            await this.click(this.selectors.recertAnniversaryRangeDropdown, "Recertification Anniversary Range", "Dropdown");
            await this.wait("minWait");
            await this.click(
                this.selectors.recertAnniversaryRangeOption(options.anniversaryRange),
                options.anniversaryRange,
                "Option"
            );

            // Handle Fixed Date or Period Range
            if (options.anniversaryRange === "Fixed Date") {
                if (!options.afterYears) {
                    throw new Error("Fixed Date requires afterYears option");
                }
                // Enter After Years for Fixed Date
                console.log(`🔄 Setting Recertification After Years: ${options.afterYears}`);
                await this.type(this.selectors.recertAfterYearsInput, "Recertification After Years", options.afterYears);
                console.log(`✅ Set Recertification Anniversary Date - Type: ${options.anniversaryType}, Range: Fixed Date, After Years: ${options.afterYears}`);

            } else if (options.anniversaryRange === "Period Range") {
                if (!options.period || !options.periodYears) {
                    throw new Error("Period Range requires period (Month/Quarter/Year) and periodYears options");
                }

                // Select Period (Month, Quarter, Year)
                console.log(`🔄 Selecting Recertification Period: ${options.period}`);
                await this.click(this.selectors.recertPeriodDropdown, "Recertification Period", "Dropdown");
                await this.wait("minWait");
                await this.click(
                    this.selectors.recertPeriodOption(options.period),
                    options.period,
                    "Option"
                );

                // Enter Period Years
                console.log(`🔄 Setting Recertification Period Years: ${options.periodYears}`);
                await this.type(this.selectors.recertPeriodYearsInput, "Recertification Period Years", options.periodYears);
                console.log(`✅ Set Recertification Anniversary Date - Type: ${options.anniversaryType}, Range: Period Range, Period: ${options.period}, Years: ${options.periodYears}`);
            }
        }
    }

    async description(data: string) {
        await this.wait("mediumWait");
        await this.type(this.selectors.description, "Description", data)
    }
    async selectSpecificPortal(portal: string) {
        const text = await this.page.innerText(this.selectors.domainSelectedText);
        console.log(text);
        if (text.includes('selected')) {
            //const dropdownItems = this.page.locator(this.selectors.domainDropdown);
            await this.click(this.selectors.domainSelectedText, "dropdown", "button")
            const dropdownValues = await this.page.locator(this.selectors.domainDropdownValue).allInnerTexts();
            for (let index = 0; index < dropdownValues.length; index++) {
                const value = dropdownValues[index];
                if (value !== portal) {
                    await this.click(`//div[@id='wrapper-program-portals' or @id='wrapper-course-portals']//span[@class='text' and text()='${value}']`, "Domain", "Dropdown");
                }
            }

        }
    }

    async clickSave() {
        await this.click(this.selectors.saveBtn, "Save", "Button");
        await this.wait("minWait");
        await this.spinnerDisappear();
    }

    async clickProceedBtn() {
        await this.wait("maxWait");  //Added by arivu for checking purpose
        await this.validateElementVisibility(this.selectors.proceedBtn, "Proceed Button");
        await this.click(this.selectors.proceedBtn, "Proceed Button", "Button");
        await this.wait("maxWait"); //Added by arivu for checking purpose
    }

    /*  async recertificationclickAddCourse() {
         await this.validateElementVisibility(this.selectors.reCertificationAddCourseBtn, "Add Course Button");
         await this.mouseHover(this.selectors.reCertificationAddCourseBtn, "Add Course Button");
         //await this.click(this.selectors.addCourseBtn, "Add Course Button", "Button");
         await this.page.locator(this.selectors.reCertificationAddCourseBtn).click({ force: true })
     } */

    async clickAddCourse() {
        await this.wait("maxWait") //Added by arivu for checking purpose
        await this.page.locator(this.selectors.addCourseBtn).last().isVisible({ timeout: 15000 });
        await this.page.locator(this.selectors.addCourseBtn).last().scrollIntoViewIfNeeded();
        //await this.click(this.selectors.addCourseBtn, "Add Course Button", "Button");
        await this.page.locator(this.selectors.addCourseBtn).last().click({ force: true })
    }

    async searchAndClickCourseCheckBox(data: string) {
      //  await this.typeAndEnter(this.selectors.addCourseSearchInput, "Course Serach Input", data) --> changed in new update('16/07/2024')
        //"//input[contains(@id,'program-structure-title-search')]"
        const addCourseInput = this.page.locator(this.selectors.addCourseSearchInput).last();
        await addCourseInput.fill(''); // Clear any existing text
        await addCourseInput.focus(),
            await this.page.keyboard.type(data, { delay: 800 })
        await this.page.keyboard.press('Enter');

        await this.wait('minWait');
        await this.click(this.selectors.courseChexbox(data), data, "CheckBox")
        // const count = await this.page.locator(this.selectors.addCourseCheckBox).count();
        // function getRandomNumber(min: number, max: number): number {
        //     return Math.floor(Math.random() * (max - min + 1)) + min;
        // }
        // const randomNumber = getRandomNumber(2, count);
        // await this.mouseHover(this.selectors.checkBox(randomNumber), "Add Course CheckBox");
        // await this.click(this.selectors.checkBox(randomNumber), "Add Course CheckBox", "ChexkBox");
    }

    async enterPrice(priceValue: string = FakerData.getPrice()) {
        await this.type(this.selectors.price, "price", priceValue);
    }
    async clickAddSelectCourse() {
        await this.click(this.selectors.addSelectedCourseBtn, "Add Select Course", "Button");
        await this.wait('minWait');
        const count = await this.page.locator("//span[@class='text-truncate']").count();
        for (let index = 0; index < count; index++) {
            const text = await this.page.locator("//span[@class='text-truncate']").nth(index).innerText();
            console.log("Selected Course =" + text);
        }
    }

    /**
     * Reorder a course by dragging it down to another position
     * @param sourceCourse - Name of the course to reorder
     * @param targetCourse - Name of the course to drag to (below)
     */
    async reorderCourse(sourceCourse: string, targetCourse: string) {
        console.log(`🔄 Reordering course: "${sourceCourse}" below "${targetCourse}"`);

        const reorderIcon = this.page.locator(this.selectors.courseReorderIcon(sourceCourse));
        const targetElement = this.page.locator(`//span[text()='${targetCourse}']`);

        await reorderIcon.scrollIntoViewIfNeeded();
        await this.wait("minWait");

        // Perform drag and drop
        await reorderIcon.hover();
        await this.page.mouse.down();
        await this.wait("minWait");
        await targetElement.hover();
        await this.page.mouse.up();
        await this.wait("minWait");

        console.log(`✅ Successfully reordered course: "${sourceCourse}"`);
    }

    /**
     * Delete a course from the learning path
     * @param courseName - Name of the course to delete
     */
    async deleteCourse(courseName: string) {
        console.log(`🔄 Deleting course: "${courseName}"`);

        const deleteIcon = this.page.locator(this.selectors.courseDeleteIcon(courseName));
        await deleteIcon.scrollIntoViewIfNeeded();
        await this.wait("minWait");
        await deleteIcon.click();
        await this.wait("minWait");

        console.log(`✅ Successfully deleted course: "${courseName}"`);
    }

    /**
     * Uncheck required checkbox to make a course optional
     * @param courseName - Name of the course to make optional
     */
    async makeCourseOptional(courseName: string) {
        console.log(`🔄 Making course optional: "${courseName}"`);

        const requiredCheckbox = this.page.locator(this.selectors.courseRequiredCheckbox(courseName));
        await requiredCheckbox.scrollIntoViewIfNeeded();
        await this.wait("minWait");
        await requiredCheckbox.click();
        await this.wait("minWait");

        console.log(`✅ Successfully made course optional: "${courseName}"`);
    }

    /**
     * Randomly uncheck required checkboxes for a specified number of courses
     * @param count - Number of courses to make optional
     * @param courseNames - Array of course names to choose from
     * @returns Array of indices that were made optional
     */
    async makeRandomCoursesOptional(count: number, courseNames: string[]): Promise<number[]> {
        console.log(`🔄 Making ${count} random courses optional from ${courseNames.length} courses`);

        if (courseNames.length < count) {
            console.log(`⚠️ Warning: Only ${courseNames.length} courses available, requested ${count}`);
            count = courseNames.length;
        }

        const selectedIndices: number[] = [];
        const usedIndices = new Set<number>();

        // Generate random unique indices
        while (selectedIndices.length < count) {
            const randomIndex = Math.floor(Math.random() * courseNames.length);
            if (!usedIndices.has(randomIndex)) {
                usedIndices.add(randomIndex);
                selectedIndices.push(randomIndex);
            }
        }

        // Uncheck selected checkboxes
        for (const index of selectedIndices) {
            const courseName = courseNames[index];
            console.log(`Unchecking course: "${courseName}" at index: ${index}`);
            const checkbox = this.page.locator(this.selectors.allCourseRequiredCheckboxes(courseName));
            await checkbox.scrollIntoViewIfNeeded();
            await checkbox.click();
            await this.wait("minWait");
        }

        console.log(`✅ Successfully made ${count} courses optional at indices: ${selectedIndices.join(', ')}`);
        return selectedIndices;
    }

    /**
     * Uncheck required checkboxes for the last N courses
     * @param count - Number of courses from the end to make optional
     * @param courseNames - Array of course names in order
     * @returns Array of indices that were made optional
     */
    async makeLastCoursesOptional(count: number, courseNames: string[]): Promise<number[]> {
        console.log(`🔄 Making last ${count} courses optional from ${courseNames.length} courses`);

        if (courseNames.length < count) {
            console.log(`⚠️ Warning: Only ${courseNames.length} courses available, requested ${count}`);
            count = courseNames.length;
        }

        const selectedIndices: number[] = [];

        // Get indices of last N courses
        const startIndex = courseNames.length - count;
        for (let i = startIndex; i < courseNames.length; i++) {
            selectedIndices.push(i);
        }

        // Uncheck selected checkboxes
        for (const index of selectedIndices) {
            const courseName = courseNames[index];
            console.log(`Unchecking course: "${courseName}" at index: ${index} (position ${index + 1}/${courseNames.length})`);
            const checkbox = this.page.locator(this.selectors.allCourseRequiredCheckboxes(courseName));
            await checkbox.scrollIntoViewIfNeeded();
            await checkbox.click();
            await this.wait("minWait");
        }

        console.log(`✅ Successfully made last ${count} courses optional at indices: ${selectedIndices.join(', ')}`);
        return selectedIndices;
    }

    /**
     * Set completion required on an optional course
     * @param index - Index of the completion required input (default: 0 for first optional course)
     * @param completionValue - Number value to enter in the completion required field (default: 1)
     */
    async setCompletionRequired(completionValue: string) {
        await this.wait("minWait");
        await this.type(this.selectors.completionRequiredInput, "Completion Required Input", completionValue);

    }

    /**
     * Capture all course titles in the learning path structure
     * @returns Array of course names in order
     */
    async captureCourseTitles(): Promise<string[]> {
        console.log(`🔄 Capturing all course titles`);

        const courseTitles = await this.page.locator(`//span[@class='text-truncate']`).allTextContents();
        const cleanedTitles = courseTitles.map(title => title.trim()).filter(title => title.length > 0);

        console.log(`📋 Captured ${cleanedTitles.length} course titles:`, cleanedTitles);
        return cleanedTitles;
    }

    async clickEnforceCheckbox() {
        let enforceCheckbox = this.selectors.enforceSequencingCheckbox
        await this.validateElementVisibility(this.selectors.enforceLabel, "Enforce Sequence");
        await this.wait('minWait');
        await this.mouseHover(this.selectors.enforceLabel, "Enforce Sequence");
        await this.click(enforceCheckbox, "Enforce Sequence", "Checkbox");
    }

    async clickDetailTab() {
        await this.validateElementVisibility(this.selectors.detailsTab, "Details");
        await this.wait('mediumWait')
        await this.page.keyboard.press('PageUp');
        await this.click(this.selectors.detailsTab, "Details", "Button");
    }

    async clickCatalogBtn() {
        await this.mouseHover(this.selectors.catalogBtn, "Show Catalog");
        await this.click(this.selectors.catalogBtn, "Show Catalog", "Button");
    }
    async clickCurrency() {
        await this.click(this.selectors.currencyButton, "Currency", "Button");
        //const count = await this.page.locator(this.selectors.currencyCount).count();
        // const randomCount = Math.floor(Math.random() * (count)) + 1;
        //await this.click(this.selectors.currencyIndex(randomCount), "Currency", "DropDown")
        await this.click(this.selectors.usCurrency, "US Dollar", "DropDown")

    }

    async clickUpdateBtn() {
        await this.mouseHover(this.selectors.updateBtn, "Update");
        await this.click(this.selectors.updateBtn, "Update", "Button");
        await this.spinnerDisappear();
    }

    async verifySuccessMessage() {
        await this.verification(this.selectors.successMessage, "successfully.");
    }

    async clickEditCertification() {
        await this.validateElementVisibility(this.selectors.editCertification, "Edit Certification");
        await this.click(this.selectors.editCertification, "Edit Certification", "Button");
        await this.wait("minWait");
    }

    async clickSaveAsDraftBtn() {

        await this.mouseHover(this.selectors.saveAsDraftCheckbox, "Save As Draft");
        await this.click(this.selectors.saveAsDraftCheckbox, "Save As Draft", "CheckBox");
    }

    async clickEditLearningPath() {
        await this.mouseHover(this.selectors.editLearningPathBtn, "Edit Learning Path");
        await this.click(this.selectors.editLearningPathBtn, "Edit Learning Path", "Button");
    }

    /**
     * Verify if Manager Approval tab is visible
     * @returns Promise<boolean> - true if visible, false if not visible
     */
    async managerApprovalVisible(): Promise<boolean> {
        await this.wait("minWait");
        try {
            const isVisible = await this.page.locator("//span[text()='Manager Approval']").isVisible();
            return isVisible;
        } catch (error) {
            console.log("Error checking Manager Approval tab visibility:", error);
            return false;
        }
    }

    async clickAndSelectCompliance() {
        await this.mouseHover(this.selectors.complianceBtn, "Compliance");
        await this.click(this.selectors.complianceBtn, "Compliance", "Button");
        await this.click(this.selectors.complianceYesBtn, "Compliance", "Button");
    }

    async clickAndSelectCompleteByRule() {
        await this.keyboardType(this.selectors.completeByInput, gettomorrowDateFormatted());
    }

    /**
     * Click and select recertification complete by rule with different options
     * @param completeByType - "Date" | "Days from enrollment" | "Days from hire"
     */
    async clickAndSelectRecertCompleteByRule(completeByType: "Date" | "Days from enrollment" | "Days from hire") {
        console.log(`🔄 Setting recertification complete by rule: ${completeByType}`);

        await this.wait("minWait");
        await this.click(this.selectors.recertCompleteByRuleBtn, "Recertification Complete by Rule", "Button");
        await this.click(this.selectors.recertCompleteByRuleYesOption, "Yes", "Option");
        await this.wait("minWait");

        await this.click(this.selectors.recertCompleteByDropdown, "Recertification Complete By", "Dropdown");
        await this.wait("minWait");

        if (completeByType === "Date") {
            await this.click(this.selectors.recertCompleteByDateOption, "Date", "Option");
            await this.wait("minWait");
            const tomorrowDate = gettomorrowDateFormatted();
            await this.typeAndEnter(this.selectors.recertCompleteByDateInput, "Recertification Complete By Date", tomorrowDate);
            console.log(`✅ Set recertification complete by Date: ${tomorrowDate}`);
        } else if (completeByType === "Days from enrollment") {
            await this.click(this.selectors.recertCompleteByDaysFromEnrollmentOption, "Days from enrollment", "Option");
            await this.wait("minWait");
            await this.type(this.selectors.recertCompleteDaysInput, "Recertification Complete Days", "1");
            console.log(`✅ Set recertification complete by Days from enrollment: 1`);
        } else if (completeByType === "Days from hire") {
            await this.click(this.selectors.recertCompleteByDaysFromHireOption, "Days from hire", "Option");
            await this.wait("minWait");
            await this.type(this.selectors.recertCompleteDaysInput, "Recertification Complete Days", "1");
            console.log(`✅ Set recertification complete by Days from hire: 1`);
        }
    }

    async addRecertificationCourse() {
        await this.mouseHover(this.selectors.recertificationAddCourse, "Add Course");
        await this.click(this.selectors.recertificationAddCourse, "Add Course", "Button");
    }

    /**
     * Choose preferred method for recertification course
     * @param method - "Copy from certification path" (default) or "Add Courses Manually"
     */
    async chooseRecertificationMethod(method: "Copy from certification path" | "Add Courses Manually" = "Copy from certification path") {
        await this.wait("minWait");

        console.log(`🔄 Choosing recertification method: ${method}`);

        if (method === "Copy from certification path") {
            // Check if already selected, if not click it
            const isVisible = await this.page.locator(this.selectors.copyFromCertificationPath).isVisible();
            if (isVisible) {
                console.log(`✅ Copy from certification path is default, clicking Save`);
                await this.wait("minWait");
                await this.click(this.selectors.saveButton, "Save Button", "Button");
            }
        } else if (method === "Add Courses Manually") {
            // Click Add Courses Manually radio button
            await this.validateElementVisibility(this.selectors.addCourseManually, "Add Courses Manually");
            await this.click(this.selectors.addCourseManuallyRadioBtn, "Add Courses Manually", "Radio Button");
            await this.wait("minWait");
            console.log(`✅ Selected Add Courses Manually`);
            await this.click(this.selectors.saveButton, "Save Button", "Button");
        }

        console.log(`✅ Recertification method selected: ${method}`);
    }

    async getCodeValue() {
        await this.validateElementVisibility(this.selectors.codeInput, "Code");
        await this.wait('mediumWait');
        const inner = await this.getInnerText("//label[text()='CODE']/parent::div");
        console.log(inner);
        return inner;

        /*   let codeValue = await this.fetchattribute(this.selectors.codeInput, "placeholder");
          console.log(codeValue); */
        //return codeValue
        /* const locator = '#code';  // Example selector

        // Retrieve and log all attributes
        const attributes = await this.page.evaluate((selector: string) => {
            const element = document.querySelector(selector);

            if (element) {
                // Convert attributes to an object and log it
                const attrs = Array.from(element.attributes).reduce((acc: any, attr) => {
                    acc[attr.name] = attr.value;
                    return acc;
                }, {});
                console.log('Element Attributes:', attrs);
                return attrs;
            } else {
                console.log('Element not found.');
                return {};
            }
        }, locator);
        console.log(attributes); */

        /*  const field = this.page.locator('#code');
 
         const _attribute = await field.getAttribute('placeholder');
         const _attributeV = await field.getAttribute('value');
         console.log(_attribute);
         console.log(_attributeV); */



    }

    async saveRecertification(data: string) {
        await this.mouseHover(this.selectors.recertificationSaveBtn, "Save");
        await this.click(this.selectors.recertificationSaveBtn, "Save", "Button");
        await this.verification(this.selectors.verifyRecertificationCourse(data), data);
    }

    async saveRecertificationMultipleCourses(courses: string[]) {
        await this.mouseHover(this.selectors.recertificationSaveBtn, "Save");
        await this.click(this.selectors.recertificationSaveBtn, "Save", "Button");
        
        for (const course of courses) {
            await this.verification(this.selectors.verifyRecertificationCourse(course), course);
            console.log(`✅ Verified recertification course: ${course}`);
        }
        console.log(`✅ Successfully verified ${courses.length} recertification courses`);
    }

    async registractionEnds() {
        await this.keyboardType(this.selectors.registractionEndsInput, gettomorrowDateFormatted());
    }

    //For selecting all recent courses in TP
    async selectAllCourses() {
        await this.validateElementVisibility(this.selectors.checkAllCourse, "Check all the courses");
        await this.click(this.selectors.checkAllCourse, "Check all the courses", "CheckBox");
        await this.wait("minWait");
    }

    //To create a module
    async tpWithModulesToAttachRandomCourse() {
        await this.wait("minWait")
        await this.validateElementVisibility(this.selectors.tpWithModulesCheckBox, "TP With Modules");
        await this.click(this.selectors.tpWithModulesCheckBox, "TP With Modules", "CheckBox");
        await this.page.locator(this.selectors.moduleExpandIcon).click({ force: true })
        await this.wait("minWait")
        await this.spinnerDisappear();
        await this.page.locator(this.selectors.addCourseBtn).last().isVisible({ timeout: 10000 });
        await this.page.locator(this.selectors.addCourseBtn).last().scrollIntoViewIfNeeded();
        await this.page.locator(this.selectors.addCourseBtn).last().click({ force: true })
        await this.validateElementVisibility(this.selectors.checkAllCourse, "Check all the courses");
        await this.click(this.selectors.checkAllCourse, "Check all the courses", "CheckBox");
        await this.wait("minWait");
        await this.click(this.selectors.addSelectedCourseBtn, "Add Select Course", "Button");
        await this.wait('minWait');
        await this.click(this.selectors.addNewModuleBtn, "Add Module", "Button");
        await this.wait('minWait');
        const buttons = await this.page.locator(this.selectors.moduleExpandIcon)
        const buttonsCount = await buttons.count();
        for (let i = 1; i < buttonsCount; i++) {
            const button = buttons.nth(i);
            await button.click();
            await this.wait("minWait")
            await this.page.locator(this.selectors.addCourseBtn).last().scrollIntoViewIfNeeded();
            await this.page.locator(this.selectors.addCourseBtn).last().click({ force: true })
            await this.wait("minWait")
            await this.page.locator(this.selectors.checkAllCourse).last().scrollIntoViewIfNeeded();
            await this.page.locator(this.selectors.checkAllCourse).last().click({ force: true })
            await this.wait("minWait");
            await this.page.locator(this.selectors.addSelectedCourseBtn).last().click({ force: true })
            await this.wait('mediumWait');
        }
    }

    //Attach course to the module:-   
    async tpWithModulesToAttachCreatedCourse() {
        await this.wait("minWait")
        await this.page.locator(this.selectors.tpWithModulesCheckBox).last().click({ force: true })
        await this.wait("minWait")
        await this.page.locator(this.selectors.moduleExpandIcon).last().click({ force: true })

    }

    /**
     * Click Add New Module button to add another module
     */
    async clickAddNewModule() {
        await this.wait("minWait");
        await this.validateElementVisibility(this.selectors.addNewModuleBtn, "Add New Module Button");
        await this.click(this.selectors.addNewModuleBtn, "Add New Module", "Button");
        await this.wait("minWait");
        console.log("✅ Clicked Add New Module button");
    }

    /**
     * Click module expand icon to expand/collapse module
     * @param index - Index of the module (0-based)
     */
    async clickModuleExpandIcon(index: number) {
        await this.wait("minWait");
        const moduleExpandIcons = this.page.locator(this.selectors.moduleExpandIcon);
        const count = await moduleExpandIcons.count();

        if (index < count) {
            await moduleExpandIcons.nth(index).scrollIntoViewIfNeeded();
            await moduleExpandIcons.nth(index).click({ force: true });
            await this.wait("minWait");
            console.log(`✅ Clicked module expand icon at index ${index}`);
        } else {
            console.log(`⚠️ Module expand icon at index ${index} not found. Total count: ${count}`);
        }
    }

    /**
     * Edit module name by clicking edit icon, entering new name, and updating
     * @param moduleIndex - Index of the module to edit (0-based)
     * @param newModuleName - New name for the module
     */
    async editModuleName(moduleIndex: number, newModuleName: string) {
        await this.wait("minWait");

        // Get all edit icons
        const editIcons = this.page.locator(this.selectors.moduleEditIcon);
        const editIconCount = await editIcons.count();

        if (moduleIndex < editIconCount) {
            // Click edit icon
            console.log(`🔄 Editing module ${moduleIndex + 1} name to: ${newModuleName}`);
            await editIcons.nth(moduleIndex).scrollIntoViewIfNeeded();
            await editIcons.nth(moduleIndex).click({ force: true });
            await this.wait("minWait");

            // Enter new module name
            const nameInputs = this.page.locator(this.selectors.moduleNameInput);
            await nameInputs.nth(moduleIndex).clear();
            await nameInputs.nth(moduleIndex).fill(newModuleName);
            await this.wait("minWait");

            // Click update icon
            const updateIcons = this.page.locator(this.selectors.moduleUpdateIcon);
            await updateIcons.nth(moduleIndex).click({ force: true });
            await this.wait("minWait");

            console.log(`✅ Successfully updated module ${moduleIndex + 1} name to: ${newModuleName}`);
        } else {
            console.log(`⚠️ Module edit icon at index ${moduleIndex} not found. Total count: ${editIconCount}`);
        }
    }

    /**
     * Add course to a specific module
     * @param courseName - Name of the course to add
     * @param moduleIndex - Index of the module (0-based)
     */
    async addCourseToModule(courseName: string, moduleIndex: number) {
        await this.wait("minWait");
        console.log(`🔄 Adding course "${courseName}" to module ${moduleIndex + 1}`);

        // Click Add Course button for the specific module
        const addCourseButtons = this.page.locator(this.selectors.addCourseBtn);
        await addCourseButtons.nth(moduleIndex).scrollIntoViewIfNeeded();
        await addCourseButtons.nth(moduleIndex).click({ force: true });
        await this.wait("mediumWait");

        // Search for the course
        const addCourseInput = this.page.locator(this.selectors.addCourseSearchInput).last();
        await addCourseInput.focus();
        await this.page.keyboard.type(courseName, { delay: 800 });
        await this.page.keyboard.press('Enter');
        await this.wait('minWait');

        // Click course checkbox using courseCheckbox selector for multi-element
        const courseCheckboxes = this.page.locator(this.selectors.checkAllCourse);
        const checkboxCount = await courseCheckboxes.count();
        console.log(`📊 Found ${checkboxCount} course checkboxes`);

        if (moduleIndex < checkboxCount) {
            await courseCheckboxes.nth(moduleIndex).scrollIntoViewIfNeeded();
            await courseCheckboxes.nth(moduleIndex).click({ force: true });
            await this.wait("minWait");
            console.log(`✅ Clicked course checkbox at index ${moduleIndex}`);
        } else {
            console.log(`⚠️ Checkbox at index ${moduleIndex} not found, using last checkbox`);
            await courseCheckboxes.last().scrollIntoViewIfNeeded();
            await courseCheckboxes.last().click({ force: true });
            await this.wait("minWait");
        }

        // Click Add Selected Course button
        const addSelectedCourseButtons = this.page.locator(this.selectors.addSelectedCourseBtn);
        await addSelectedCourseButtons.last().scrollIntoViewIfNeeded();
        await addSelectedCourseButtons.last().click({ force: true });
        await this.wait('minWait');

        // Log selected course
        const courseElements = this.page.locator("//span[@class='text-truncate']");
        const courseCount = await courseElements.count();
        if (courseCount > 0) {
            const selectedCourseText = await courseElements.last().innerText();
            console.log(`Selected Course in Module ${moduleIndex + 1} = ${selectedCourseText}`);
        }

        console.log(`✅ Successfully added course "${courseName}" to module ${moduleIndex + 1}`);
    }

    async verifyLPInFilteredResults(lpName: string): Promise<boolean> {
        await this.wait("mediumWait");
        const lpElements = await this.page.locator("//div[@class='text-truncate']").allTextContents();
        console.log("📋 Learning Paths in results:", lpElements);

        const isLPPresent = lpElements.some(lp => lp.includes(lpName));

        if (isLPPresent) {
            console.log(`✅ SUCCESS: Learning Path "${lpName}" is present in filtered results`);
            return true;
        } else {
            throw new Error(`❌ FAILURE: Learning Path "${lpName}" is NOT present in filtered results`);
        }
    }

    async verifyNoMatchingResultFound(): Promise<void> {
        await this.wait("mediumWait");
        await this.validateElementVisibility(this.selectors.noMatchingResultMessage, "No matching result found");
        console.log("✅ Verified 'No matching result found' message is displayed");
    }

    public async clickFilterIcon() {
        await this.wait("minWait");
        await this.click(this.selectors.filterIcon, "Filter Icon", "Icon");
    }

    // Version Management methods
    async clickAddVersionBtn() {
        await this.validateElementVisibility(this.selectors.addVersionBtn, "Add Version Button");
        await this.click(this.selectors.addVersionBtn, "Add Version", "Button");
        await this.wait("minWait");
        console.log("✅ Clicked Add Version button");
    }

    async unselectAllVersionOptions() {
        await this.click(this.selectors.unselectAllCheckbox, "Unselect All", "Checkbox");
        await this.wait("minWait");
        console.log("✅ Unselected all version options");
    }

    async getVersionFormLabels(): Promise<string[]> {
        const labels = await this.page.locator(this.selectors.versionFormLabels).allTextContents();
        console.log("📋 Available version form labels:", labels);
        return labels;
    }

    async selectVersionOption(label: string) {
        await this.click(this.selectors.versionCheckbox(label), label, "Checkbox");
        await this.wait("minWait");
        console.log(`✅ Selected version option: ${label}`);
    }

    async clickCreateVersionBtn() {
        await this.click(this.selectors.createVersionBtn, "Create", "Button");
        await this.wait("maxWait");
        await this.wait("maxWait");
        console.log("✅ Clicked Create version button");
    }

    async verifyVersionNumber(versionNumber: string) {
        await this.validateElementVisibility(this.selectors.versionLabel(versionNumber), `Version: ${versionNumber}`);
        console.log(`✅ Verified version changed to: ${versionNumber}`);
    }

    async updateTitleWithVersion(newTitle: string) {
        await this.page.locator(this.selectors.title).clear();
        await this.type(this.selectors.title, "Title", newTitle);
        console.log(`✅ Updated title to: ${newTitle}`);
    }

    async verifyPublishConfirmationPopup() {
        await this.validateElementVisibility(this.selectors.publishConfirmationMessage, "Publish Confirmation Message");
        await this.validateElementVisibility(this.selectors.publishVersionMessage, "Publish Version Message");
        console.log("✅ Verified publish confirmation popup messages");
    }

    async clickYesBtn() {
        await this.click(this.selectors.yesBtn, "Yes", "Button");
        await this.wait("mediumWait");
        console.log("✅ Clicked Yes button");
    }

    async getVersionHistoryTitle(version: string, lpTitle: string): Promise<string> {
        const titleLocator = `//div[text()='Version: ${version}']//preceding::div[contains(@title,'${lpTitle}')]`;
        const titleElement = await this.page.locator(titleLocator).first();
        const title = await titleElement.getAttribute('title') || "";
        console.log(`📋 Version ${version} title: ${title}`);
        return title;
    }

    async clickVersionEyeIcon(title: string) {
        await this.click(this.selectors.versionEyeIcon(title), "Eye Icon", "Icon");
        await this.wait("minWait");
        console.log(`✅ Clicked eye icon for: ${title}`);
    }

    async clickTransferEnrollmentsBtn() {
        await this.validateElementVisibility(this.selectors.transferEnrollmentsBtn, "Transfer Enrollments Button");
        await this.click(this.selectors.transferEnrollmentsBtn, "Transfer Enrollments", "Button");
        await this.wait("minWait");
        console.log("✅ Clicked Transfer Enrollments button");
    }

    async selectAllLearners() {
        await this.click(this.selectors.selectAllLearnersCheckbox, "Select All Learners", "Checkbox");
        await this.wait("minWait");
        console.log("✅ Selected all learners");
    }

    async clickTransferLearnersBtn() {
        await this.click(this.selectors.transferLearnersBtn, "Transfer Learners", "Button");
        await this.wait("minWait");
        console.log("✅ Clicked Transfer Learners button");
    }

    async verifyTransferConfirmationPopup() {
        await this.validateElementVisibility(this.selectors.transferConfirmationMessage, "Transfer Confirmation Message");
        console.log("✅ Verified transfer confirmation popup message");
    }

    async clickEditIconFromTPListing(lpName: string) {
        await this.wait("minWait");
        await this.click(this.selectors.editIconTP(lpName), `Edit Icon for ${lpName}`, "Icon");
        await this.wait("minWait");
        console.log(`✅ Clicked edit icon for Learning Path: ${lpName}`);
    }

    // Clone Learning Path methods
    async clickCloneIcon(lpTitle: string) {
        await this.wait("minWait");
        await this.click(this.selectors.cloneIcon(lpTitle), `Clone Icon for ${lpTitle}`, "Icon");
        await this.wait("minWait");
        console.log(`✅ Clicked clone icon for Learning Path: ${lpTitle}`);
    }


    async unselectAllCloneOptions() {
        await this.click(this.selectors.cloneUnselectAllCheckbox, "Unselect All", "Checkbox");
        await this.wait("minWait");
        console.log("✅ Unselected all clone options");
    }

    async getCloneFormLabels(): Promise<string[]> {
        const labels = await this.page.locator(this.selectors.cloneFormLabels).allTextContents();
        console.log("📋 Available clone form labels:", labels);
        return labels;
    }

    async selectCloneOption(label: string) {
        await this.click(this.selectors.clonePopupCheckbox(label), label, "Checkbox");
        await this.wait("minWait");
        console.log(`✅ Selected clone option: ${label}`);
    }

    async clickCreateCopy() {
        await this.click(this.selectors.createCopyBtn, "Create Copy", "Button");
        await this.wait("maxWait");
        await this.spinnerDisappear();
        console.log("✅ Clicked Create Copy button");
    }

    async verifyClonedTitle(originalTitle: string) {
        const expectedClonedTitle = `${originalTitle}_Copy`;
        const titleLocator = `//input[@id='program-title']`;
        await this.validateElementVisibility(titleLocator, "Title Input");
        
        // Get the actual value from the input field
        const actualTitle = await this.page.locator(titleLocator).inputValue();
        
        if (actualTitle === expectedClonedTitle) {
            console.log(`✅ Verified cloned title: ${expectedClonedTitle}`);
        } else {
            throw new Error(`❌ Title mismatch! Expected: "${expectedClonedTitle}", but got: "${actualTitle}"`);
        }
        return actualTitle;
    }
    public async clickEnrollmentsButton(){
        await this.wait("minWait");

        await this.click(this.selectors.enrollments, "Enrollments Button", "Button");
    }
    async checkRevalidateInCertification(){
        await this.validateElementVisibility(this.selectors.checkRevalidateInCertitfcation, "Re-validate in Certification")
        await this.click(this.selectors.checkRevalidateInCertitfcation, "Re-validate in Certification", "Checkbox")
        await this.wait('minWait');
        await this.click(this.selectors.saveButton2, "Save", "Button")
        await this.wait('minWait');
    }

    async verifyEnrollAgainPopupMessage() {
        await this.wait("minWait");
        await this.validateElementVisibility(
            this.selectors.enrollAgainPopupMessage,
            "Enroll Again Popup Message"
        );
        console.log("✅ Verified enroll again popup message is visible");
    }

    async verifyEnrollAgainPopupCourseName(courseName: string) {
        await this.wait("minWait");
        const courseNameLocator = this.selectors.enrollAgainPopupCourseName(courseName);
        await this.validateElementVisibility(
            courseNameLocator,
            `Course Name: ${courseName} in popup`
        );
        console.log(`✅ Verified course name '${courseName}' in popup`);
    }

    async clickEnrollAgainPopupOK() {
        await this.wait("minWait");
        await this.click(
            this.selectors.enrollAgainPopupOKButton,
            "OK Button",
            "Button"
        );
        await this.wait("minWait");
        console.log("✅ Clicked OK button on enroll again popup");
    }

    async verifyRecertEnrollAgainPopupMessage() {
        await this.validateElementVisibility(
            this.selectors.recertEnrollAgainPopupMessage,
            "Recertification Enroll Again Popup Message"
        );
        console.log("✅ Verified recertification enroll again popup message is visible");
    }

    async verifyRecertEnrollAgainPopupCourseName(courseName: string) {
        const courseNameLocator = this.selectors.enrollAgainPopupCourseName(courseName);
        await this.validateElementVisibility(
            courseNameLocator,
            `Course Name: ${courseName} in recert popup`
        );
        console.log(`✅ Verified course name '${courseName}' in recertification popup`);
    }

    async clickRecertEnrollAgainPopupOK() {
        await this.click(
            this.selectors.enrollAgainPopupOKButton,
            "OK Button",
            "Button"
        );
        await this.wait("minWait");
        console.log("✅ Clicked OK button on recertification enroll again popup");
    }

    /**
     * Apply Learning Path filters with optional parameters
     * @param filters - Object containing optional filter parameters
     * @param filters.category - Category filter value (searchable dropdown)
     * @param filters.currency - Currency filter value (searchable dropdown)
     * @param filters.language - Language filter value (searchable dropdown)
     * @param filters.tags - Tags filter value (searchable dropdown)
     * @param filters.provider - Provider filter value (searchable dropdown)
     * @param filters.status - Status filter value (without search dropdown)
     * @param filters.priceMin - Minimum price (text field)
     * @param filters.priceMax - Maximum price (text field)
     * @param filters.code - CODE filter value (search filter)
     * @param filters.course - Course filter value (search filter)
     */
    async applyLearningPathFilters(filters: {
        category?: string;
        currency?: string;
        language?: string;
        tags?: string;
        provider?: string;
        status?: string;
        priceMin?: string;
        priceMax?: string;
        code?: string;
        course?: string;
    } = {}) {
        const filterUtils = new FilterUtils(this.page, this.context);

        // Click filter icon to open filters
        await filterUtils.clickFilterIcon();
        await this.wait("minWait");
        console.log("🔍 Opened Learning Path filters");

        // Apply Category filter (searchable dropdown)
        if (filters.category) {
            await filterUtils.applySearchableDropdownFilter("Category", filters.category);
            console.log(`✅ Applied Category filter: ${filters.category}`);
        }

        // Apply Currency filter (searchable dropdown)
        if (filters.currency) {
            await filterUtils.applySearchableDropdownFilter("Currency", filters.currency);
            console.log(`✅ Applied Currency filter: ${filters.currency}`);
        }

        // Apply Language filter (searchable dropdown)
        if (filters.language) {
            await filterUtils.applySearchableDropdownFilter("Language", filters.language);
            console.log(`✅ Applied Language filter: ${filters.language}`);
        }

        // Apply Tags filter (searchable dropdown)
        if (filters.tags) {
            await filterUtils.applySearchableDropdownFilter("Tags", filters.tags);
            console.log(`✅ Applied Tags filter: ${filters.tags}`);
        }

        // Apply Provider filter (searchable dropdown)
        if (filters.provider) {
            await filterUtils.applySearchableDropdownFilter("Provider", filters.provider);
            console.log(`✅ Applied Provider filter: ${filters.provider}`);
        }

        // Apply Status filter (without search dropdown)
        if (filters.status) {
            await filterUtils.applyDefaultDropdownFilter("Status", filters.status);
            console.log(`✅ Applied Status filter: ${filters.status}`);
        }

        // Apply Price Min filter (text field)
        if (filters.priceMin) {
            await filterUtils.applyTextFieldFilter("Price Min", filters.priceMin);
            console.log(`✅ Applied Price Min filter: ${filters.priceMin}`);
        }

        // Apply Price Max filter (text field)
        if (filters.priceMax) {
            await filterUtils.applyTextFieldFilter("Price Max", filters.priceMax);
            console.log(`✅ Applied Price Max filter: ${filters.priceMax}`);
        }

        // Apply CODE filter (search filter)
        if (filters.code) {
            await filterUtils.searchAndSelectValue("CODE", filters.code);
            console.log(`✅ Applied CODE filter: ${filters.code}`);
        }

        // Apply Course filter (search filter)
        if (filters.course) {
            await filterUtils.searchAndSelectValue("Course", filters.course);
            console.log(`✅ Applied Course filter: ${filters.course}`);
        }

        // Click Apply button
        await filterUtils.clickApplyFilter();
        await this.wait("mediumWait");
        console.log("✅ Applied all Learning Path filters");
    }
}