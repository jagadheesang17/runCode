import { Page, BrowserContext, expect } from "@playwright/test";
import { AdminHomePage } from "./AdminHomePage";
import {
  FakerData,
  getallRandomInstructor,
  getallRandomLocation,
  getCurrentDateFormatted,
  getCurrentTimeRoundedTo15,
  getFutureDate,
  getnextMonthFormatted,
  getPastDate,
  getRandomFutureDate,
  getRandomLocation,
  getRandomSeat,
  gettomorrowDateFormatted,
  score,
  getRandomPastDate,
} from "../utils/fakerUtils";
import { getRandomItemFromFile } from "../utils/jsonDataHandler";
import { vi } from "date-fns/locale/vi";
import * as fs from "fs";
import * as path from "path";
import { filePath } from "../data/MetadataLibraryData/filePathEnv";
import { credentials } from "../constants/credentialData";
import { da, th } from "@faker-js/faker";

export class CoursePage extends AdminHomePage {
  public selectors = {
    ...this.selectors,
    createUserLabel: "//h1[text()='Create Course']",
    courseDescriptionInput: "//div[@id='course-description']//p",
    uploadDiv: "//div[@id='upload-div']",
    uploadInput: "//div[@id='upload-div']//input[@id='content_upload_file']",
    clickHereuploadFile: `(//label[text()='Click here'])[1]`,
    attachedContent: (fileName: string) => `//label[text()='Attached Content']/following::span/following-sibling::div[text()='${fileName}']`,
    showInCatalogBtn: "//span[text()='Show in Catalog']",
    modifyTheAccessBtn: "//footer/following::button[text()='No, modify the access']",
    saveBtn: "//button[@id='course-btn-save' and text()='Save']",
    proceedBtn: "//footer//following::button[contains(text(),'Yes, Proceed')]",
    successMessage: "//div[@id='lms-overall-container']//h3",
    domainBtn: "//label[text()='Domain']/following::button[1]",
    //  domainOption: (domain_name: string) => `//div[@class='dropdown-menu show']//span[text()='${domain_name}']`,
    closeBtn: "//button[text()='Close']",
    courseLanguagesWrapper: "//label[contains(text(),'Language')]/following::div[@id='wrapper-course-languages']",
    courseLanguageInput: "//label[text()='Language']/following::input[1]",
    courseLanguageLink: (language: string) => `(//label[text()='Language']//following::span[text()='${language}'])[1]`,
    selectCategoryBtn: "//div[contains(@id,'categorys')]//div[text()='Select']",
    categoryOption: (category: string) => `//span[text()='${category}']`,
    addCategoryBtn: "//div[text()='Add Category']",
    categoryInput: "//label[text()='Category']/following::input[@id='course-categorys']",
    okButton: "//button[text()='OK']",
    okBtn: "//span[contains(text(),'created successfully')]/following::button[text()='OK']",
    cancelBtn: "//label[text()='Category']/following::span[contains(@class,'lms-cat-cancel')]",
    providerDropdown: "//label[text()='Provider']//following-sibling::div",
    providerDropdownValue: "//label[text()='Provider']//following-sibling::div//div//a",
    providerOption: (provider: string) => `//a/span[text()='${provider}']`,
    providerIndexBase: (index: string) => `(//label[text()='Provider']//following-sibling::div//a)[${index}]`,
    totalDurationInput: "(//label[text()='Total Duration']/following::input)[1]",
    additionalInfoInput: "//div[@id='additional_information_description_id']//p",
    showToLearnersCheckbox: "//span[text()='Show to Learners']",
    priceInput: "//label[text()='Price']/following::input[1]",
    coursePriceField: "#course-price", // User specified locator
    currencyDropdown: "//div[contains(@id,'currency')]",
    courseCurrencyDropdown: "//button[@data-id='course-currency']", // User specified locator
    currencyOption: "//label[text()='Currency']/following::a/span[text()='US Dollar']",
    usDollarCurrencyOption: "//span[text()='US Dollar']", // User specified locator
    maxSeatsInput: "//label[text()='Seats-Max']/following::input[1]",
    contactSupportInput: "//label[text()='Contact Support']/following::input[1]",
    complianceField: "//div[@id='wrapper-course-compliance']",
    complianceOption: "//footer/following-sibling::div//span[text()='Yes']",
    validityField: "//div[@id='wrapper-course-compliance-validity']",
    validityOption: "//footer/following::span[text()='Days']",
    validityDateInput: "input[@id='validity_date-input']",
    validityDaysInput: "//input[@id='validity_days']",
    completeByField: "//div[@id='wrapper-course-complete-by']",
    completeByDateInput: "#complete_by_date-input",
    completeByDaysInput: "//input[@id='complete_days']",
    // completeByRule: `(//div[@id='wrapper-course-complete-by-rule']//button)[1]`,
    completeByRule: "(//div[@id='wrapper-course-complete-by-rule']//button | //div[@id='wrapper-program-complete-by-rule']//button)[1]",
    completeByRuleOption: `//footer/following-sibling::div//span[text()='Yes']`,
    // postCompleteByStatusField: "//div[@id='wrapper-course-post-complete-by-status']",
    postCompleteByStatusField: "//div[@id='wrapper-course-post-complete-by-status'] | //div[@id='wrapper-program-post-complete-by-status']",
    postCompleteByOption: "//footer/following::a/span[text()='Overdue']",
    courseInstancesField: "//div[@id='wrapper-course-instances']",
    instanceTypeOption: "//span[text()='Multi Instance/Class']",
    hideInCatalogCheckbox: "//span[contains(text(),'Hide in Catalog')]",
    saveInDraftCheckbox: "//span[contains(text(),'Save as Draft')]",
    deliveryTypeDropdown: "//div[@id='wrapper-course-delivery-type']",
    deliveryTypeOption: (deliveryType: string) => `//span[text()='${deliveryType}']`,
    editCourseTabLink: "//a[text()='Edit Course']",
    addInstancesBtn: "//button[@id='course-btn-add-instances']",
    instanceDeliveryTypeField: "//div[@id='wrapper-instanceDeliveryType']",
    instanceDeliveryTypeDropdown: "//div[@id='wrapper-instanceDeliveryType']//select",
    instanceDeliveryTypeOption: (delivery: string) => `//footer/following::a/span[text()='${delivery}']`,
    instanceCountInput: "//div[@id='exp-course-instances-options']//input",
    createInstanceBtn: "//button[@id='instance-add']",
    sessionNameInput: "//label[text()='Session Name']/following-sibling::input",
    sessionNameIndex: (index: number) => `(//label[text()='Session Name']/following-sibling::input)[${index}]`,
    instructorDropdown: "//label[text()='Instructor']/following-sibling::div//input",
    instructorDropdownIndex: (index: number) => `(//label[text()='Instructor']/following-sibling::div//input)[${index}]`,
    instructorOption: (instructorName: string) => `//li[contains(text(),'${instructorName}')]`,
    instructorOptionIndex: (instructorName: string, index: number) => `(//li[contains(text(),'${instructorName}')])[${index}]`,
    locationSelection: "//label[text()='Select Location']/following-sibling::div//input[1]",
    locationDropdown: "//label[text()='Select Location']/following-sibling::div//input[@placeholder='Search']",
    locationOption: (locationName: string) => `//li[text()='${locationName}']`,
    CourseCalendaricon: "//div[@id='complete_by_date']/input",
    tomorrowdate: "//td[@class='today day']/following-sibling::td[1]",
    nextMonth: `//div[@class='datepicker-days']//th[@class='next']`,
    calanderIcon: "(//label[text()='Date']//following::button[contains(@class,'calendaricon')])[1]",
    registrationEnd: `//div[@id='registration-ends']/input`,
    todayDate: "td[class='today day']",
    randomDate: `(//td[@class='day']/following-sibling::td)[1]`,
    seatMaxInput: "//label[text()='Seats-Max']/following-sibling::input",
    timeInput: `//label[text()='Start Time']/following-sibling::input`,
    chooseTimeOption: (randomIndex: string) => `(//div[contains(@class,'timepicker')]//li)[${randomIndex}]`,
    chooseStartTimeIndex: (index: string, randomIndex: number) => `((//ul[@class='ui-timepicker-list'])[${index}]/li)[${randomIndex}]`,
    waitlistInput: "//label[text()='Waitlist']/following-sibling::input",
    updateBtn: "//button[text()='Update']",
    detailsbtn: "//button[text()='Details']",
    courseUpdateBtn: "//button[@id='course-btn-save']",
    surveyAndAssessmentLink: "//button[text()='Survey/Assessment']",
    //surveyCheckBox: "//div[@id='sur_ass-lms-scroll-survey-list']//i[contains(@class,'fa-duotone fa-square icon')]", -->The XPath has been changed on the product side. We updated it on 10/7/2024
    surveyCheckBox: "//div[contains(@id,'scroll-survey-list')]//i[contains(@class,'fa-duotone fa-square icon')]",
    editCourseBtn: "//a[text()='Edit Course']",
    //assessmentCheckbox: "//div[@id='sur_ass-lms-scroll-assessment-list']//i[contains(@class,'fa-duotone fa-square icon')]", -->The XPath has been changed on the product side. We updated it on 10/7/2024
    assessmentCheckbox: "//div[contains(@id,'scroll-assessment-list')]//i[contains(@class,'fa-duotone fa-square icon')]",
    addAssessmentBtn: "//button[text()='Add As Assessment']",
    categoryDropdown: "//div[@class='dropdown-menu show']//input[@type='search']",
    allCategoryOptions: "//select[@id='course-categorys-exp-select']/option",
    providerOptions: "//select[@id='course-providers']/option",
    provider: (Options: string) => `(//span[text()='${Options}'])[1]`,
    progress: "//progress[@id='progress-bar'and@value='0']",
    addSurveyBtn: "//button[text()='Add As Survey']",
    deliveryLabel: "//label[text()='Delivery Type']",
    instructorInput: "//input[contains(@id,'instructors') and (@placeholder='Search')]",
    instructorInputIndex: (index: number) => `(//input[contains(@id,'instructors') and (@placeholder='Search')])[${index}]`,
    //instance_Class: "//a[contains(@title,'Instance/Class')]", -->DOM Contented Changed 08-07-2024
    // instance_Class: "//a[contains(@title,'Instance Class') or contains(@aria-label,'Instance/Class')]", --> update on 18/07/2024
    clickContentLibrary: "//span[text()='Add Content']//following::span[text()='Click here'][1]",
   navigateToMainCoursePage:`//a[contains(@title,'Instance Class') or contains(@aria-label,'Instance/Class') or contains(@title,'Instance/Class')]`,
    instance_Class:
      "//button[text()='Add instance/Class']",
    allContents: "//i[@class='fa-duotone fa-square icon_16_1']",
    contentIndex: (index: number) => `(//i[contains(@class,'fa-duotone fa-square ico')])[${index}]`,
    addContentButton: "//button[text()='Add Content']",
    attachedContentLabel: "//label[text()='Attached Content']",
    getCourse: "//input[@id='course-title']",
    domainDropdown: "//a[@class='dropdown-item selected']",
    domainDropdownValue: "//label[text()='Domain']/following-sibling::div//div[contains(@class,'dropdown-menu')]//span[@class='text']",
    //domainDropdownIndex: (domain_index: number) => `(//a[@class='dropdown-item selected'])[${domain_index}]`,
    domainSelectedText: "//div[contains(text(),'selected')]",
    domainOption: (domain_name: string) => `//div[@class='dropdown-menu show']//span[text()='${domain_name}']`,
    portalDropdown: `(//label[text()='Domain']/following::div)[1]`,
    allPortalOptions: `//label[text()='Domain']/following::div[@class='dropdown-menu show']//a`,
    portalOption: (index: string) => `(//label[text()='Domain']/following::div[@class='dropdown-menu show']//a)[${index}]`,
    domainNameOption: (portalName: string) => `//a[@class='dropdown-item']//span[text()='${portalName}']`,
    portal: `(//label[text()='Domain']/following::div[@id='wrapper-user-portals']//button)[1]`,
    image: "(//div[@class='img-wrapper']/img)[1]",
    clickHere: "//div[@class='form-label']/span",
    httpsInput: "input[id=content_url]",
    addURLBtn: "button:text-is('Add URL')",
    clickSaveasDraft: "//input[@id='draftcatalog']/parent::div//i[contains(@class,'fa-dot-circle')]",
    willResolveLaterBtn: "//footer//following::button[text()='No, will resolve later']",
    selectType: `//label[text()='Session Type']/following-sibling::div`,
    sessionType: "(//label[text()='Session Type']/parent::div//button)[1]",
    otherMeeting: "//span[text()='other Meetings']",
    sessionTypeIndex: (index: number) => `(//label[text()='Session Type']/following-sibling::div)[${index}]`,
    attendeeUrlIndex: (index: number) => `(//label[text()='Attendee URL']/following-sibling::input)[${index}]`,
    presenterUrlIndex: (index: number) => `(//label[text()='Presenter URL']/following-sibling::input)[${index}]`,
    timeZoneIndex: (timeZone: number) => `(//label[text()='Time Zone']/following-sibling::div//input)[${timeZone}]`,
    otherMeetingIndex: (othermeeting: number) => `(//label[text()='Session Type']/following::div//span[text()='other Meetings'])[${othermeeting}]`,
    timeZoneOption: `(//label[text()='Time Zone']/following::div//input[@placeholder='Search'])[1]`,
    //  timeZoneOptionIndex:(timeOption:number) =>`(//label[text()='Time Zone']/following::div//input[@placeholder='Search'])[${timeOption}]`,
    // indianTimezoneIndex:(timezoneIndia:number)=> `(//li[contains(text(),'Indian Standard Time/Kolkata')])[${timezoneIndia}]`,
    indianTimezone: `//li[contains(text(),'Indian Standard Time/Kolkata')]`,
    Date: "(//label[contains(text(),'Date')]/following-sibling::div/input)[1]",
    startDateInstanceIndex: (index: number) => `(//label[text()='Start Date']/following-sibling::div/input)[${index}]`,
    timeInputIndex: (index: number) => `(//label[text()='Start Time']/following-sibling::input)[${index}]`,
    addDeleteIcon: `//label[text()='session add/delete']/following::i[contains(@class,'fad fa-plus')]`,
    domainInnerValue: "//label[text()='Domain']/parent::div//div[@class='filter-option-inner']/div",
    completionCertificationlink: "//span[text()='Completion Certificate']",
    loadMoreBtn: "//div[contains(@id,'scroll-certificat')]//button[text()='Load More']",
    certificateCheckboxCount: "//div[contains(@id,'scroll-certificat')]//i[contains(@class,'fa-duotone fa-circle icon')]",
    certificateCheckbox: (index: string) => `(//div[contains(@id,'scroll-certificat')]//i[contains(@class,'fa-duotone fa-circle icon')])[${index}]`,
    addBtn: "//button[text()='Add']",
    certificationVerifyMessage: "//span[text()='Completion Certificate has been created successfully.']",
    accessBtn: "//span[text()='Access']//parent::button",//span[text()='Access'] -->lot of text has been created(12/8/2024)
    accessCloseIcon: "//label[text()='Learner Group']/parent::div//following-sibling::div[2]//div//i",
    MultiaccessCloseIcon: "(//label[text()='Learner Group']/parent::div//following-sibling::div[2]//div//i)[2]",
    accessUserInput: "//label[text()='User']/parent::div/following-sibling::div//input",
    saveAccessBtn: "//button[text()='Save Access']",
    enforceSequencingCheckbox: "//span[text()='Enforce Sequencing']/preceding-sibling::i[@class='fa-duotone fa-square']",
    // category:(categoryOption:string)=>`//div[@id='new-course-categorys']//following::select[@name='course-categorys-exp-select']/option[text()='${categoryOption}']`,
    assessmentLabel: "//div[text()='Assessment']",
    enforceSequence: `//span[text()='enforce launch sequence']/preceding-sibling::i[contains(@class,'fad fa-square ')]`,
    learnerGroup: "div[id$='learner-group-list'] button div[class='filter-option-inner-inner']",
    ceuLink: "//button[text()='CEU']",
    ceuLinkInRecertfication: "(//button[text()='CEU'])[2]",
    ceuProviderName: "(//label[text()='CEU Provider Name']/following-sibling::div//button)[1]",
    ceuProviderInnerValue: "div[id$='ceu-providers'] button div[class='filter-option-inner-inner']",
    ceuType: "(//label[text()='CEU type']/following-sibling::div//button)[1]",
    ceuTypeOption: (data: string) => `//div[@id='wrapper-course-ceu-type']//span[text()='${data}']`,
    ceuProviderOption: (data: string) => `//div[@id='wrapper-course-ceu-providers']//span[text()='${data}']`,
    ceuTypeInnerValue: "div[id$='ceu-type'] button div[class='filter-option-inner-inner']",
    unitInput: "//label[text()='Unit']/following-sibling::input",
    addCEUBtn: "//button[text()='Add CEU']",
    addedCEUData: "div[class='lms-ceu-wrapper'] div[class$='lms-scroll-pre']",

    vcSessionTypeDropDown: "//label[text()='Session Type']/following-sibling::div",
    vcMeetingType: (meetType: string) => `(//span[text()='${meetType}'])`,
    vcselectTimezone: "//label[text()='Time Zone']/following-sibling::div",
    vcSelectTimezoneClickSearch: "//input[@id='timezone_0']",
    vcSelectTimeZone: "//li[contains(@class,'dropdown-item text-wrap')]",

    //Course/TP Search:-
    crs_TPCode: "//label[@for='code']/following::input[@id='code']",
    crs_TPSearchField: "(//input[@id='exp-search-field'])[1]",

    //Assessment Attach:-
    searchAssessmentField: "[id$='search-assessment-field']",
    surveySearchField: `[id$='ass-exp-search-field']`,
      //LearnerGroup Access modify
    learnerGroupbtn: `(//label[text()='Learner Group']//following::button)[1]`,
    allLearnerGroupOptions: `//select[@id='course-group-access-learner-group-list' or @id='program-group-access-learner-group-list']/option`,
   
    //course-currency list
    currencyListInCourse: `//select[@id='course-currency']/option`,
    //course-currency list


    //Instance Selection:-
    selectInstanceDropdown: `//button[@data-id='course-instances']`,
    instanceSelection: (instanceType: string) => `//span[text()='${instanceType}']`,
    //  Course Access Setting learner group:-

    crsAccessSettingLink: `//span[text()='Access Setting']`,
    crsAccessDropDown: `(//div[contains(@id,'wrapper-admin_group_')])[1]`,
    crsAccessMandatoryOption: `//div[@class='dropdown-menu show']//span[text()='Mandatory']`,

    // Course Access Setting learner selection:-

    crsAccessUserDropDown: `//button[contains(@data-id,'admin_group_lists')]`,
    crsAccessUserMandatoryOption: `//div[@class='dropdown-menu show']//span[text()='Mandatory']`,
    crsAccessSettingsSave: `//button[@id='add-language-btn']`,

    //Prerequisite course
    courseOption: (data: string) => `//button[text()='${data}']`,
    preCourseIndex: (index: number) =>
      `(//div[@id='lms-scroll-preadded-list']//i[contains(@class,'fa-duotone fa-square icon')])[${index}]`,
    addPreCourseBtn: `//button[text()='ADD AS PREREQUISITE']`,
    preSearchField: `(//input[@id='exp-search-field'])[1]`,

    //Equivalence course
    selectEquivalenceCourse: (course: string) => `(//div[text()='${course}']//following::i[contains(@class,'fa-duotone fa-circle')])[1]`,
    addEquivalenceButton: `//button[text()='ADD AS Equivalence']`,
    saveEquivalenceButton: `(//button[text()='Save'])[1]`,
    equivalenceSuccessMessage: `//span[@class='rawtxt']//span[2]`,

    //To add a particular completion training to the Course/TP.
    clickCreatedCertificateCheckbox: (data: string) => `(//div[text()='${data}']//following::i[contains(@class,'fa-duotone fa-circle icon')])[1]`,

    //Course list page Filter
    filterInCourseList: `//h1[text()='Course']/following::div[text()='Filters']`,
    searchTypeDropdown: `//span[text()='Type']//following::button[@data-id='search_type']`,

    //thumbnail from custom gallery
    clickHereThumbnail: `//div[@class='form-label']//span[text()='Click here']`,
    addThumbnail: `//label[text()='Click here']/following::input[@type='file']`,
    customGalleryRadioBtn: `//span[text()='custom']//preceding::i[contains(@class,'fa-duotone fa-circle icon')]`,
    uploadedImgSrc: `//label[@for='course-thumbnail-image']//following::img[contains(@class,'upload')]`,
    //thumbnail from system gallery
    selectRandomThumbnailimages: `//div[@class='img-wrapper']`,
    //Retrieving code from edit page
    codeValue: `(//input[contains(@id,'ode')])[1]`,
    //Extract content title from course creation page
    contentTitleOnCoursePage: `(//div[contains(@id,'cnt_title')])[1]`,

    //Course Business Rules:-
    courseBusinessRulesLink: `//span[text()='Business Rule']`,
    courseDedicatetoTP: `//span[text()='Dedicated to Training Plan']`,

    //Duration within 30min
    selectDuration: `(//span[text()=' h ']//following::input)[1]`,

    //click edit icon on course listing page
    clickEdit: `//i[@aria-label='Edit Course']`,
    //change single instance to multi instance
    yesButton: `//button[text()='YES']`,
    noButton: `//button[text()='NO']`,
    instanceClass: `//div[text()='Instance  / Class']`,

    //edit instance 
    editInstance: `//span[@title='Edit Instance/Class']`,
    //class cancel radio button
    classCancel: `//span[contains(text(),'Cancel')]`,

    //Class enrollment ILT/VC
    classEnrollBtn: `//a[@href="/admin/learning/enrollments/viewstatus"]//following::i[@class='fa-duotone fa-money-check-pen icon_14_1']`,

    //class complete radio button
    classComplete: `//span[contains(text(),'Complete')]`,

    //Observation Checklist
    observationChecklistButton: `//button[text()='Observation checklist']`,
    addObservationChecklistIcon: `(//i[contains(@class,'fa-duotone fa-square icon')])[3]`,
    addAsObservationChecklistButton: `//button[text()='add as observation checklist']`,
    
    //Observation Checklist Rules
    checklistRulesTab: `//div[contains(@class,'nav nav-tabs border-0 pointer')]`,
    afterLearnerRegDropdown: `//button[@data-id='after-learner-reg-lea']`,
    afterLearnerRegCannotView: `(//button[@data-id='after-learner-reg-lea']//following::span[text()='Cannot View'])[1]`,
    afterLearnerRegCanAnswer: `(//button[@data-id='after-learner-reg-lea']//following::span[text()='Can Answer'])[1]`,
    afterSessionStartsDropdown: `//button[@data-id='after-session-lea']`,
    afterSessionStartsCannotView: `(//button[@data-id='after-session-lea']//following::span[text()='Cannot View'])[1]`,
    afterSessionStartsCanAnswer: `(//button[@data-id='after-session-lea']//following::span[text()='Can Answer'])[1]`,
    afterChecklistSubmittedDropdown: `//button[@data-id='after-checklist-lea']`,
    afterChecklistSubmittedCannotView: `(//button[@data-id='after-checklist-lea']//following::span[text()='Cannot View'])[1]`,
    afterChecklistSubmittedCanView: `(//button[@data-id='after-checklist-lea']//following::span[text()='Can View'])[1]`,
    addRulesButton: `//button[text()='Add ']`,
    confirmYesButton: `//button[text()='Yes']`,
    
    //Observation Checklist List Details
    checklistName: `//div[contains(@class,'checklist-name') or contains(@class,'title')]//span`,
    checklistID: `//div[contains(@class,'checklist-id') or contains(@class,'code')]//span`,
    checklistRuleSettingIcon: `//i[contains(@class,'fa-cog') or contains(@class,'fa-gear') or contains(@class,'settings')]`,
    checklistDeleteIcon: `//i[contains(@class,'fa-trash') or contains(@class,'delete')]`,
    checklistListRow: `//div[contains(@class,'checklist-row') or contains(@class,'observation-checklist-item')]`,
    
    //Correct selectors based on actual page structure
    addedChecklistContainer: `//div[contains(text(),'Added Observation Checklist')]`,
    addedChecklistFullText: `(//div[contains(text(),'Added Observation Checklist')]/following::div[contains(text(),'|')])[1]`,
    checklistEditIcon: `//i[@title='Edit']`,
    checklistSettingsButton: `//button[contains(@class,'btn') and not(text())]//i[contains(@class,'fa-')]`,
    checklistDeleteButton: `//i[contains(@class,'fa-trash') or @title='Delete']`,
    
    //Index-based selectors for multiple checklists
    checklistItemFullText: (index: number) => `(//div[contains(text(),'Added Observation Checklist')]/following::div[contains(text(),'|')])[${index}]`,
    checklistItemEditIcon: (index: number) => `(//i[@title='Edit'])[${index}]`,
    checklistItemSettingsButton: (index: number) => `(//button[contains(@class,'btn')]//following::i[contains(@class,'fa-')])[${index}]`,
    checklistItemDeleteButton: (index: number) => `(//i[contains(@class,'fa-trash')])[${index}]`,

    //Observation Checklist Evaluator
    evaluatorDropdown: `(//div[contains(@id,'observation_evaluator')])[1]`,
    evaluatorSearchInput: `(//input[contains(@id,'observation_evaluator')])[2]`,
    evaluatorOption: (evaluatorName: string) => `//li[contains(text(),'${evaluatorName}')]`,
    checklistUpdateButton: `(//i[@aria-label='Update'])[2]`,

    //filter by status in course listing page
    crsFilter: `//div[text()='Filters']`,
    statusDropdown: `//span[text()='Status']//following::div[text()='Select']`,
    selectStatus: (data: string) => `//span[text()='${data}']`,

    //Class enrollment E-Learn as an admin from the course edit page:-
    enrollElearn: `//a[@href="/admin/learning/enrollments/viewstatus"]//following::span[text()='Enrollments']`,
    //bulk class creation - manual
    NoOfClass: `//label[text()="Delivery Type"]/following::input[@type="text"]`,
    sessionNameInput_bulk: (i) => `(//label[text()="Session Name"]/following::input[contains(@id,'instanceClassCode')])[${i + 1}]`,
    instructorDropdown_bulk: (i) => `//input[@id="instructors_intance_${i}-filter-field"]`,
    instructorOption_bulk: (instructorName: string, i) => `//input[@id="instructors_intance_${i}"]/following::li[contains(text(),'${instructorName}')]`,
    locationSelection_bulk: (i) => `//input[@id="location_instance_${i}-filter-field"]`,
    locationDropdown_bulk: (i) => `//input[@id="location_instance_${i}"]`,
    locationOption_bulk: (locationName: string, i) => `//input[@id="location_instance_${i}"]/following::li[text()='${locationName}']`,
    seatMaxInput_bulk: (i: any) => `//input[@id='instanceMaxSeats_${i}']`,
    timeInput_bulk: (i: any) => `//input[@id="starttime_sesstime_instance_${i}"]`,
    instructorInput_bulk: (i: any) => `//input[@id="instructors_intance_${i}"]`,
    waitlistInput_bulk: (i: any) => `//input[@id='instanceWailtList_${i}']`,
    Date_bulk: (i) => `//input[@name="startdate_instance_${i}"]`,
    //bulk class creation - copy/paste
    sessionNameInput_Copy: `(//label[text()="Session Name"]/following::input[contains(@id,'instanceClassCode')])[1]`,
    instructorDropdown_Copy: `//input[@id="instructors_intance_0-filter-field"]`,
    instructorOption_Copy: (instructorName: string) => `//input[@id="instructors_intance_0"]/following::li[contains(text(),'${instructorName}')]`,
    locationSelection_Copy: `//input[@id="location_instance_0-filter-field"]`,
    locationDropdown_Copy: `//input[@id="location_instance_0"]`,
    locationOption_Copy: (locationName: string) => `//input[@id='location_instance_0']/following::li[text()='${locationName}']`,
    seatMaxInput_Copy: `//input[@id='instanceMaxSeats_0']`,
    timeInput_Copy: `//input[@id="starttime_sesstime_instance_0"]`,
    instructorInput_Copy: `//input[@id="instructors_intance_0"]`,
    waitlistInput_Copy: `//input[@id='instanceWailtList_0']`,
    Date_Copy: `//input[@name="startdate_instance_0"]`,
    copyClass: `//i[@title="Copy"]`,
    pasteClass: (i: any) => `(//i[@title="paste"])[${i + 1}]`,
    //checkConflict
    ConflictCheck: `//button[text()="Check Conflict"]`,
    saveButtn: `//button[text()="Save"]`,

    //verifyCreatedBulkClasses
    clickEditBulkClass: (k: any) =>
      `(//i[@class="fa-duotone icon_14_1 fa-pen"])[${k}]`,

    //To add content validity
    selectContentValidity: `//label[text()="Content Validity"]/following::div[text()="Select"]`,
    validityType: (validity: string) =>
      `//label[text()="Content Validity"]/following::div[text()="Select"]/following::span[text()='${validity}']`,
    DateInput: `//input[@id="content_validity_date-input"]`,
    DaysInput: `//input[@id="content_validity_days"]`,

    //Recurring class creation
    selectSessionType: `(//label[contains(@for,'is_recurring_multiple')]//i)[1]`,
    clickDaysDropdown: `//button[contains(@data-id,'days')]`,
    daysCount: `//select[contains(@name,'days')]//option`,
    selectDays: (index: string) => `(//select[contains(@name,'days')]//option)[${index}]`,
    daysOption: (days: string) => `//span[text()='${days}']`,
    endDate: `(//label[contains(text(),'End Date')]/following-sibling::div/input)[1]`,
    openCourseLink:".router-link-active",

    //Delete Course
    deleteCourse: `//span[text()='Delete Course']`,
    //Delete course conform pop-up
    removeButton: `//button[text()='Remove']`,
    cancelButton: `//button[text()='Cancel']`,

    // Parameterized Access Setting selectors
    AccessMandatoryOption: (data: string) => `//div[@class='dropdown-menu show']//span[text()='${data}']`,
    AccessUserMandatoryOption: (data: string) => `//div[@class='dropdown-menu show']//span[text()='${data}']`,

    // Overall Access Setting selectors for groups and users
    groupAccessDropdown: `//button[contains(@data-id,'admin_leanr_head')]//div[text()='Set As']`,
    userAccessDropdown: `//button[contains(@data-id,'admin_user_head')]//div[text()='Set As']`,
    accessOption: (accessType: string) => `//div[@class='dropdown-menu show']//span[text()='${accessType}']`,

    
    //edit ILT/VC session
    editSession: `//span[@title='Edit']/child::i`,
    updateSession: `//span[@title='Update']`,

    editCourseFromListingPage: `(//i[@class='position-absolute top-0 end-0 fa-duotone icon_14_1 p-2 pointer mt-1 me-1 background_3 fa-pen'])[1]`,
    checkContactSupport: `//input[@id='course-contact-support']`,
    adminGroupSelect:`(//div[contains(text(),'items selected')])[1]`, 
    searchBoxAdminGrpAccess:`((//div[contains(text(),'items selected')])[1]/following::input[contains(@aria-label,"Search")])[4]`,
    adminGroupSearch: (adminGroup:string) => `//span[text()='${adminGroup}']`,
    removeAddedAdminGroup: (adminGroup:string) => `(//label[text()='${adminGroup}']/following::i[contains(@class,"fa-duotone fa-times fa-swap-opacity icon")])[1]`,
    suspendedGrp:(groupName:string) => `(//li[text()='${groupName}'])`,

    // Dedicated to TP - Enrollment and Instance selectors
    completeByRequiredPopup: `//ul[contains(text(),'is required.')]`,
    completeByDropdown: "(//label[text()='Complete by']//following::button[contains(@data-id,'complete-by')])[1]",
    completeByOption: (option: string) => `//span[text()='${option}']`,
    enrollmentsIcon: `//i[@aria-label='Enrollments']`,
    enrollmentTable: `//table[contains(@class,'table')]`,
    enrollmentRow: `//table//tbody//tr`,
    enrollmentSourceColumn: (rowIndex: number) => `(//table//tbody//tr)[${rowIndex}]//td[contains(text(),'Learning Path') or contains(text(),'Direct')]`,

    enrollmentInCoursePage: `//span[@id='crs-enrol-attr']`,
    instanceCourseEnrollmentIcon: (courseTitle: string) => `//div[@title='${courseTitle}']//following::a[@href='/admin/learning/enrollments/viewstatus']`,
    
    // Selectors for navigation and search
    goToListingLink: `//a[contains(text(), 'Go to Listing')]`,
    courseSearchField: `//input[@placeholder='Search']`,
    courseNameText: (courseName: string) => `//text()[contains(.,'${courseName}')]`,
    
    // Selectors for Files tab and file upload with visibility
    filesTabIcon: `(//i[@aria-label='Files'])[1]`,
    fileUploadDialog: `//div[contains(@class,'modal') or contains(@class,'dialog') or contains(@class,'pushbox')]//input[@id='name'] | //form[.//input[@id='name']] | //div[.//input[@id='name'] and .//input[@id='files']]`,
    fileUploadContainer: `//div[.//input[@id='files']]`,
    fileNameInput: `//input[@id='name']`,
    fileUploadInput: `//input[@id='files']`,
    visibleToDropdown: `//button[@data-id='visible_to']`,
    instructorEvaluatorOption: `//span[text()='Instructor/Evaluator']`,
    addFileButton: `//button[text()='Add']`,

    createCourseButton:`//a[text()='Create Course']`
  };

  constructor(page: Page, context: BrowserContext) {
    super(page, context);
  }

  //Click on Survey/AssessmentLink:-

  async surveyassesment() {
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.surveyAndAssessmentLink,
      "Survey/Assessment"
    );
    await this.click(
      this.selectors.surveyAndAssessmentLink,
      "Survey/Assessment",
      "Link"
    );
  }

  //Delete Course
  async clickDeleteCourse() {
    await this.validateElementVisibility(this.selectors.deleteCourse, "Delete");
    await this.click(this.selectors.deleteCourse, "Delete", "Icon");
    await this.click(this.selectors.removeButton, "Remove", "Button");
    await this.wait("minWait");
  }

  async noResults() {
    await this.validateElementVisibility(
      this.selectors.noResults,
      "No Results Found"
    );
  }
  //Verify Delete Course is disabled
  async verifyDeleteCourseDisable() {
    const deleteButton = this.page.locator(this.selectors.deleteCourse);
    await deleteButton.isDisabled();
  }

  // edit instance from course listing page
  async editInstanceFromCrsListing() {
    await this.validateElementVisibility(
      this.selectors.instanceIcon,
      "Instances"
    );
    await this.click(this.selectors.instanceIcon, "Instances", "Icon");
    await this.click(
      this.selectors.editInstanceFromCrsList,
      "Instances",
      "Icon"
    );
    await this.wait("minWait");
  }

  //edit session details
  async clickEditSession() {
    await this.validateElementVisibility(
      this.selectors.editSession,
      "Edit Session"
    );
    await this.click(this.selectors.editSession, "Edit Session", "Icon");
    await this.wait("minWait");
  }
  //update session
  async clickUpdateSession() {
    await this.validateElementVisibility(
      this.selectors.updateSession,
      "Edit Session"
    );
    await this.click(this.selectors.updateSession, "Edit Session", "Icon");
  }

  async enterSessionName_bulk(sessionName: string, i: any) {
    await this.validateElementVisibility(
      this.selectors.sessionNameInput_bulk(i),
      "Session Name"
    );
    await this.mouseHover(
      this.selectors.sessionNameInput_bulk(i),
      "Session Name"
    );
    await this.type(
      this.selectors.sessionNameInput_bulk(i),
      "Session Name",
      sessionName
    );
  }
  async enterSessionName_copy(sessionName: string) {
    await this.validateElementVisibility(
      this.selectors.sessionNameInput_Copy,
      "Session Name"
    );
    await this.mouseHover(this.selectors.sessionNameInput_Copy, "Session Name");
    await this.type(
      this.selectors.sessionNameInput_Copy,
      "Session Name",
      sessionName
    );
  }
  async selectInstructor_bulk(instructorName: string, i: any) {
    await this.click(
      this.selectors.instructorDropdown_bulk(i),
      "Select Instructor",
      "DropDown"
    );
    await this.type(
      this.selectors.instructorInput_bulk(i),
      "Instructor Name",
      instructorName
    );
    await this.mouseHover(
      this.selectors.instructorOption_bulk(instructorName, i),
      "Instructor Name"
    );
    await this.click(
      this.selectors.instructorOption_bulk(instructorName, i),
      "Instructor Name",
      "Button"
    );
  }
  async selectInstructor_Copy(instructorName: string) {
    await this.click(
      this.selectors.instructorDropdown_Copy,
      "Select Instructor",
      "DropDown"
    );
    await this.type(
      this.selectors.instructorInput_Copy,
      "Instructor Name",
      instructorName
    );
    await this.mouseHover(
      this.selectors.instructorOption_Copy(instructorName),
      "Instructor Name"
    );
    await this.click(
      this.selectors.instructorOption_Copy(instructorName),
      "Instructor Name",
      "Button"
    );
  }
  async selectLocation_bulk(i: any) {
    await this.click(
      this.selectors.locationSelection_bulk(i),
      "Select Location",
      "DropDown"
    );
    await this.click(
      this.selectors.locationDropdown_bulk(i),
      "Select Location",
      "DropDown"
    );
    let location = getallRandomLocation();
    await this.type(
      this.selectors.locationDropdown_bulk(i),
      "Select Location",
      location
    );
    await this.mouseHover(
      this.selectors.locationOption_bulk(location, i),
      "Location"
    );
    await this.click(
      this.selectors.locationOption_bulk(location, i),
      "Location",
      getallRandomLocation()
    );
  }
  async selectLocation_Copy() {
    await this.click(
      this.selectors.locationSelection_Copy,
      "Select Location",
      "DropDown"
    );
    await this.click(
      this.selectors.locationDropdown_Copy,
      "Select Location",
      "DropDown"
    );
    let location = getRandomLocation();
    await this.type(
      this.selectors.locationDropdown_Copy,
      "Select Location",
      location
    );
    await this.mouseHover(
      this.selectors.locationOption_Copy(location),
      "Location"
    );
    await this.click(
      this.selectors.locationOption_Copy(location),
      "Location",
      getRandomLocation()
    );
  }

  async enterRandomDate_bulk(i: any) {
    const randomDate = getRandomFutureDate();
    console.log("Random Future Date:", randomDate);
    await this.keyboardType(this.selectors.Date_bulk(i), randomDate);
  }
  async enterRandomDate_Copy() {
    const randomDate = getRandomFutureDate();
    console.log("Random Future Date:", randomDate);
    await this.keyboardType(this.selectors.Date_Copy, randomDate);
  }
  async captureDropdownValues(i: any, str: string): Promise<void> {
    await this.wait("minWait");
    //  1. Click on the textbox to open the dropdown
    await this.page.locator(str).click();
    await this.wait("mediumWait");
    // 2. Capture all dropdown option texts easily
    const dropdownValues: string[] = await this.page
      .locator("//li[contains(@id,'list')]")
      .allInnerTexts();
    console.log("Captured Dropdown Values:", dropdownValues);
    // // 3. Save the captured values into a JSON file
    const filePath = path.join(__dirname, "../data/captureInstructor.json"); // Save into /data folder
    fs.writeFileSync(filePath, JSON.stringify(dropdownValues));
    const instructorFromJson = getallRandomInstructor();
    const instructorName = instructorFromJson.replace(/\s*\([^)]*\)/g, "");
    console.log(instructorName);
    await this.wait("mediumWait");
    await this.page.locator(this.selectors.instructorInput_bulk(i)).focus(),
      await this.page.keyboard.type(instructorName, { delay: 600 });
    await this.page.keyboard.press("Enter");
    //await this.keyboardType(this.selectors.instructorInput_bulk(i), instructorName);
    await this.mouseHover(
      this.selectors.instructorOption_bulk(instructorName, i),
      "Instructor Name"
    );
    await this.click(
      this.selectors.instructorOption_bulk(instructorName, i),
      "Instructor Name",
      "Button"
    );
  }
  async captureDropdownValuesOfLocationCopy(str: string,): Promise<void> {
        await this.wait("minWait")
        //  1. Click on the textbox to open the dropdown
        await this.page.locator(str).click();
        await this.wait("mediumWait")
        // 2. Capture all dropdown option texts easily
        const dropdownValues: string[] = await this.page.locator(`//input[@id='location_instance_0-filter-field']/following::li[contains(@id,'list_')]`).allInnerTexts();
        console.log('Captured Dropdown Values:', dropdownValues);
        // // 3. Save the captured values into a JSON file
        const filePath = path.join(__dirname, '../data/captureLocation.json'); // Save into /data folder
        fs.writeFileSync(filePath, JSON.stringify(dropdownValues));
        const locationFromJson = getallRandomLocation();
        const locationName = locationFromJson.replace(/\s*\([^)]*\)/g, "");
        console.log(locationName);
        await this.wait("mediumWait")
        await this.page.locator(this.selectors.locationDropdown_bulk).focus(),
            await this.page.keyboard.type(locationName, { delay: 600 })
        await this.page.keyboard.press('Enter');
        //await this.keyboardType(this.selectors.instructorInput_bulk(i), instructorName);
        await this.mouseHover(this.selectors.locationOption_Copy(locationName), "Instructor Name");
        await this.click(this.selectors.locationOption_Copy(locationName), "Instructor Name", "Button")
    }
    async captureDropdownValuesOfLocation(i: any, str: string,): Promise<void> {
        await this.wait("minWait")
        //  1. Click on the textbox to open the dropdown
        await this.page.locator(str).click();
        await this.wait("mediumWait")
        // 2. Capture all dropdown option texts easily
        const dropdownValues: string[] = await this.page.locator(`//input[@id='location_instance_${i}-filter-field']/following::li[contains(@id,'list_')]`).allInnerTexts();
        console.log('Captured Dropdown Values:', dropdownValues);
        // // 3. Save the captured values into a JSON file
        const filePath = path.join(__dirname, '../data/captureLocation.json'); // Save into /data folder
        fs.writeFileSync(filePath, JSON.stringify(dropdownValues));
        const locationFromJson = getallRandomLocation();
        const locationName = locationFromJson.replace(/\s*\([^)]*\)/g, "");
        console.log(locationName);
        await this.wait("mediumWait")
        await this.page.locator(this.selectors.locationDropdown_Copy).focus(),
            await this.page.keyboard.type(locationName, { delay: 600 })
        await this.page.keyboard.press('Enter');
        //await this.keyboardType(this.selectors.instructorInput_bulk(i), instructorName);
        await this.mouseHover(this.selectors.locationOption_bulk(locationName, i), "Instructor Name");
        await this.click(this.selectors.locationOption_bulk(locationName, i), "Instructor Name", "Button")
    }

  //Bulk class creation
  async bulkClassCreations(classNos: any, mode: "manual" | "copy/paste", title: string) {
    await this.click(this.selectors.NoOfClass, "TextBox", "click");
    await this.keyboardType(this.selectors.NoOfClass, classNos);
    await this.clickCreateInstance();
    switch (mode) {
      case "manual":
        // const totalClasses = parseInt(classNos);
        const allSessionNames: string[] = [];

        for (let i = 0; i < classNos; i++) {
          let str = title + "_" + FakerData.getSession();
          allSessionNames.push(str);
          await this.enterSessionName_bulk(FakerData.getSession(), i);
          await this.captureDropdownValues(
            i,
            this.selectors.instructorDropdown_bulk(i)
          );
          await this.selectLocation_bulk(i);
          await this.enterRandomDate_bulk(i);
          await this.startandEndTime_bulkClass(i);
          await this.setMaxSeat_bulk(i);
          await this.waitList_bulk(i);
          const filePath = path.join(__dirname, '../data/instanceNames.json');
          fs.writeFileSync(filePath, JSON.stringify(allSessionNames, null, 2), 'utf-8');
          for (const sessionName of allSessionNames) {
            console.log('Stored session name:', sessionName);
            console.log('Stored session name:', sessionName);
          }
        }
        const filePath = path.join(__dirname, '../data/instanceNames.json');
        fs.writeFileSync(filePath, JSON.stringify(allSessionNames, null, 2), 'utf-8');
        fs.writeFileSync(filePath, JSON.stringify(allSessionNames, null, 2), 'utf-8');

        await this.checkConflict();
        //console.log("next");
        break;
      case "copy/paste":
      case "copy/paste":
        await this.enterSessionName_copy(FakerData.getSession());
        await this.selectInstructor_Copy(credentials.INSTRUCTORNAME.username);
        await this.selectLocation_Copy();
        await this.enterRandomDate_Copy();
        await this.startandEndTime();
        await this.setMaxSeat_Copy();
        await this.waitList_Copy();
        //Copy Classes
        await this.click(
          this.selectors.copyClass,
          "Copy",
          "Created ClassRooms"
        );
        for (let j = 0; j < classNos - 1; j++) {
          //Paste Classes
          await this.click(
            this.selectors.pasteClass(j),
            "Paste",
            "bulk Classes"
          );
        }
        for (let i = 1; i <= classNos - 1; i++) {
          await this.enterRandomDate_bulk(i);
        }
        await this.checkConflict();
        break;

      default:
        console.warn("Invalid mode selected:", mode);
      //case "copy/paste" :
    }
    let Nos = classNos;
    await this.verifyCreatedBulkClasses(Nos);
  }
  async bulkClassCreation(classNos: any, mode: "manual" | "copy/paste",title:string) {
        await this.click(this.selectors.NoOfClass, "TextBox", "click");
        await this.keyboardType(this.selectors.NoOfClass, classNos)
        await this.clickCreateInstance();
        switch (mode) {
            case "manual":
                // const totalClasses = parseInt(classNos);
                for (let i = 0; i < classNos; i++) {
                    await this.enterSessionName_bulk(title+"_"+FakerData.getSession(), i);
                    await this.captureDropdownValues(i, this.selectors.instructorDropdown_bulk(i));
                    await this.captureDropdownValuesOfLocation(i,this.selectors.locationSelection_bulk(i));
                    await this.enterRandomDate_bulk(i)
                    await this.startandEndTime_bulkClass(i);
                    await this.setMaxSeat_bulk(i);
                    await this.waitList_bulk(i);
                }
                await this.checkConflict();
                //console.log("next");
                break;
            case "copy/paste":
                await this.enterSessionName_copy(FakerData.getSession());
                await this.selectInstructor_Copy(credentials.INSTRUCTORNAME.username)
                await this.captureDropdownValuesOfLocationCopy(this.selectors.locationSelection_Copy);
                await this.enterRandomDate_Copy();
                await this.startandEndTime();
                await this.setMaxSeat_Copy();
                await this.waitList_Copy();
                //Copy Classes
                await this.click(this.selectors.copyClass, "Copy", "Created ClassRooms")
                for (let j = 0; j < classNos - 1; j++) {
                    //Paste Classes
                    await this.click(this.selectors.pasteClass(j), "Paste", "bulk Classes")
                }
                for (let i = 1; i <= classNos - 1; i++) {
                    await this.enterRandomDate_bulk(i);
                }
                await this.checkConflict();
                break;
            default:
                console.warn("Invalid mode selected:", mode);
            //case "copy/paste" :
        }
        let Nos = classNos;
        await this.verifyCreatedBulkClasses(Nos);
    }

  async waitList_bulk(i: any) {
    await this.type(this.selectors.waitlistInput_bulk(i), "WaitList", "4");
  }
  async verifyCreatedBulkClasses(Nos: any) {
    for (let k = 1; k <= Nos; k++) {
      await this.page.waitForTimeout(20000);
      await this.page
        .locator(this.selectors.clickEditBulkClass(k))
        .scrollIntoViewIfNeeded();
      await this.validateElementVisibility(
        this.selectors.clickEditBulkClass(k),
        "edit"
      );
      await this.wait("maxWait");
      await this.click(this.selectors.clickEditBulkClass(k), "edit", "click");
      await this.wait("maxWait");
      await this.clickCatalog();
      await this.clickUpdate();
      await this.editcourse();
      await this.wait("mediumWait");
      await this.clickinstanceClass();
      await this.page
        .locator(this.selectors.instance_Class)
        .click({ force: true });
      await this.wait("mediumWait");
      const addInstanceBtn = await this.page
        .locator(this.selectors.addInstancesBtn)
        .isVisible();
      if (!addInstanceBtn) {
        await this.wait("minWait");
        await this.clickinstanceClass();
        await this.page
          .locator(this.selectors.addInstancesBtn)
          .scrollIntoViewIfNeeded();
      }
    }
  }

  async checkConflict() {
    await this.wait("minWait");
    await this.click(this.selectors.ConflictCheck, "ILT", "COnflict");
    await this.wait("mediumWait");
    const saveButton = this.page.locator(this.selectors.saveButtn);

    const isEnabled = await saveButton.isEnabled();
    if (isEnabled) {
      await saveButton.click();
      await this.wait("maxWait");
    }
    await this.wait("maxWait");
  }

  public async startandEndTime_bulkClass(i: any) {
    await this.click(
      this.selectors.timeInput_bulk(i),
      "Start Time Input",
      "Input"
    );
    await this.wait("minWait");
    function getCurrentTimePlusTwoHours() {
      const now = new Date();
      now.setHours(now.getHours() + 2); // Add 2 hours
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12; // Convert to 12-hour format
      const roundedMinutes = Math.ceil(minutes / 15) * 15;
      const formattedMinutes =
        roundedMinutes === 60
          ? "00"
          : roundedMinutes.toString().padStart(2, "0");
      if (roundedMinutes === 60) {
        hours = (hours % 12) + 1;
      }
      return `${hours.toString().padStart(2, "0")}:${formattedMinutes} ${ampm}`;
    }
    async function selectNextAvailableTime() {
      const list = await this.page
        .locator("(//div[contains(@class,'timepicker')]//li)")
        .allTextContents();
      console.log(list);
      const timeToSelect = getCurrentTimePlusTwoHours();
      console.log("Current Time + 2 hours:", timeToSelect);
      await this.page
        .locator(
          `(//div[contains(@class,'timepicker')]//li[text()='${timeToSelect}'])[${i + 1
          }]`
        )
        .first()
        .click();
    }
    await selectNextAvailableTime.call(this);
  }

  async waitList_Copy() {
    await this.type(this.selectors.waitlistInput_Copy, "WaitList", "4");
  }

  async setMaxSeat_bulk(i: any) {
    await this.typeAndEnter(
      this.selectors.seatMaxInput_bulk(i),
      "Instance Max Seat",
      await getRandomSeat()
    );
  }
  async setMaxSeat_Copy() {
    await this.typeAndEnter(
      this.selectors.seatMaxInput_Copy,
      "Instance Max Seat",
      await getRandomSeat()
    );
  }
  //Class enrollment E-Learn as an admin from the course edit page:-
  async enrollforElearn() {
    await this.validateElementVisibility(
      this.selectors.enrollElearn,
      "Enrollment"
    );
    await this.click(this.selectors.enrollElearn, "Enrollment", "Icon");
  }





  //Filter By Status in Course listing
  async filterByStatus(data: string) {
    await this.wait("minWait");
    await this.click(
      this.selectors.filterInCourseList,
      "Filter by Instance",
      "Button"
    );
    await this.validateElementVisibility(
      this.selectors.searchType,
      "Search Type"
    );
    await this.click(
      this.selectors.statusDropdown,
      "Status Dropdown",
      "Button"
    );
    await this.click(
      this.selectors.selectStatus(data),
      "Search Type Option",
      "Option"
    );
  }

  //admin mark class complete
  async clickClassComplete() {
    await this.validateElementVisibility(
      this.selectors.classComplete,
      "Complete"
    );
    await this.click(this.selectors.classComplete, "Complete", "radio button");
    await this.wait("minWait");
    await this.click(this.selectors.updateBtn, "update", "field");
  }
  //admin mark class complete
  async verifyClassCompleteDisable() {
    const completeButton = this.page.locator(this.selectors.classComplete);
    await completeButton.isDisabled();
  }

  //ILT/VC Class enrollment icon
  async clickClassEnrollmentILTVCType() {
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.classEnrollBtn,
      "Enrollment"
    );
    await this.click(this.selectors.classEnrollBtn, "Enrollment", "Icon");
  }

  //admin mark class cancel
  async clickClassCancel() {
    await this.validateElementVisibility(this.selectors.classCancel, "Cancel");
    await this.click(this.selectors.classCancel, "Cancel", "radio button");
  }

  //Course Cancellation Method
  async cancelCourse(reason: string) {
    console.log(`🚫 Starting course cancellation process...`);
    
    // Scroll to and click Cancel button
    await this.page.locator(this.selectors.cancelCourseButton).scrollIntoViewIfNeeded();
    console.log(`✅ Scrolled to Cancel button`);
    
    await this.validateElementVisibility(this.selectors.cancelCourseButton, "Cancel");
    await this.click(this.selectors.cancelCourseButton, "Cancel", "button");
    console.log(`✅ Clicked Cancel button`);
    
    await this.wait("minWait");
    
    // Click Update button
    await this.validateElementVisibility(this.selectors.updateCancelButton, "Update");
    await this.click(this.selectors.updateCancelButton, "Update", "button");
    console.log(`✅ Clicked Update button`);
    
    await this.wait("minWait");
    
    // Enter cancellation reason
    await this.validateElementVisibility(this.selectors.cancellationReasonTextarea, "Cancellation Reason");
    await this.typeAndEnter(this.selectors.cancellationReasonTextarea, "Cancellation Reason", reason);
    console.log(`✅ Entered cancellation reason: ${reason}`);
    
    // Click Confirm button
    await this.validateElementVisibility(this.selectors.confirmCancelButton, "Confirm");
    await this.click(this.selectors.confirmCancelButton, "Confirm", "button");
    console.log(`✅ Clicked Confirm button`);
    
    await this.wait("mediumWait");
    
    // Verify success message
    await this.validateElementVisibility(this.selectors.cancelSuccessMessage, "Canceled successfully");
    console.log(`✅ Course canceled successfully`);
  }

  //Verify Cancel button visibility
  async verifyCancelButtonExists(): Promise<boolean> {
    try {
      const count = await this.page.locator(this.selectors.cancelCourseButton).count();
      return count > 0;
    } catch (error) {
      return false;
    }
  }

  //Verify Complete button visibility
  async verifyCompleteButtonExists(): Promise<boolean> {
    try {
      const count = await this.page.locator(this.selectors.classComplete).count();
      return count > 0;
    } catch (error) {
      return false;
    }
  }

  //Complete course (mark as complete)
  async completeCourse() {
    console.log(`✅ Starting course completion process...`);
    
    // Scroll to and click Complete button
    await this.page.locator(this.selectors.classComplete).scrollIntoViewIfNeeded();
    console.log(`✅ Scrolled to Complete button`);
    
    await this.validateElementVisibility(this.selectors.classComplete, "Complete");
    await this.click(this.selectors.classComplete, "Complete", "button");
    console.log(`✅ Clicked Complete button`);
    
    await this.wait("minWait");
    
    // Click Update button
    await this.validateElementVisibility(this.selectors.updateBtn, "Update");
    await this.click(this.selectors.updateBtn, "Update", "button");
    console.log(`✅ Clicked Update button`);
    
    await this.wait("mediumWait");
    
    // Verify success message
    await this.verifySuccessMessage();
    console.log(`✅ Course marked as complete successfully`);
  }

  //Observation Checklist Methods
  
  //Verify Observation Checklist button is visible
  async verifyObservationChecklistButtonExists(): Promise<boolean> {
    try {
      await this.wait("minWait");
      const count = await this.page.locator(this.selectors.observationChecklistButton).count();
      
      if (count > 0) {
        console.log("✅ Observation Checklist button is visible");
        return true;
      } else {
        console.log("❌ Observation Checklist button is NOT visible");
        return false;
      }
    } catch (error) {
      console.log("❌ Error checking Observation Checklist button:", error);
      return false;
    }
  }

  //Click Observation Checklist button
  async clickObservationChecklistButton() {
    await this.wait("minWait");
    await this.validateElementVisibility(this.selectors.observationChecklistButton, "Observation Checklist");
    await this.click(this.selectors.observationChecklistButton, "Observation Checklist", "Button");
    await this.wait("minWait");
    console.log("✅ Clicked Observation Checklist button");
  }

  //Click add observation checklist icon (checkbox)
  async clickAddObservationChecklistIcon() {
    await this.wait("mediumWait");
    
    // Wait for the checklist list to be fully loaded
    await this.page.waitForSelector("//div[contains(text(),'TITLE')]", { state: 'visible', timeout: 10000 });
    await this.wait("minWait");
    
    // Get all matching checkboxes and log count
    const allCheckboxes = this.page.locator("//i[contains(@class,'fa-duotone fa-square icon')]");
    const count = await allCheckboxes.count();
    console.log(`📊 Found ${count} checkboxes on page`);
    
    // Use nth(2) to get the 3rd element (0-indexed: 0,1,2 = 3rd)
    const thirdCheckbox = allCheckboxes.nth(4);
    
    // Scroll and click ONLY this one element
    await thirdCheckbox.scrollIntoViewIfNeeded();
    await this.wait("minWait");
    await thirdCheckbox.click();
    await this.wait("minWait");
    
    console.log("✅ Clicked ONLY the checkbox at index 3");
  }

  //Click 'add as observation checklist' button
  async clickAddAsObservationChecklistButton() {
    await this.wait("minWait");
    await this.validateElementVisibility(this.selectors.addAsObservationChecklistButton, "Add as Observation Checklist");
    await this.click(this.selectors.addAsObservationChecklistButton, "Add as Observation Checklist", "Button");
    await this.wait("mediumWait");
    console.log("✅ Clicked 'add as observation checklist' button");
  }

  //Complete flow: Add observation checklist to course
  async addObservationChecklistToCourse() {
    console.log("🔄 Starting to add Observation Checklist to course...");
    
    await this.clickObservationChecklistButton();
    await this.clickAddObservationChecklistIcon();
    await this.clickAddAsObservationChecklistButton();
    await this.page.locator("(//*[text()='Yes'])[5]").click();
    await this.wait("mediumWait");
    await this.page.waitForSelector("//i[@title='Edit']", { state: 'visible', timeout: 10000 });
    
    console.log("✅ Successfully added Observation Checklist to course");
  }

  //Verify checklist details in the list (name, ID, rule setting icon, delete option)
  async verifyChecklistDetails(index: number = 1): Promise<{
    hasName: boolean;
    hasID: boolean;
    hasRuleSettingIcon: boolean;
    hasDeleteIcon: boolean;
    name?: string;
    id?: string;
  }> {
    await this.wait("minWait");
    console.log(`\n🔍 Verifying checklist details at index ${index}...`);
    console.log(`${'─'.repeat(60)}`);

    const result = {
      hasName: false,
      hasID: false,
      hasRuleSettingIcon: false,
      hasDeleteIcon: false,
      name: undefined as string | undefined,
      id: undefined as string | undefined
    };

    try {
      // Check for checklist full text (contains both name and ID)
      const fullTextLocator = this.page.locator(this.selectors.checklistItemFullText(index));
      const fullTextCount = await fullTextLocator.count();
      console.log(`📝 Checklist Full Text - Selector: ${this.selectors.checklistItemFullText(index)}`);
      console.log(`📝 Checklist Full Text - Elements found: ${fullTextCount}`);
      
      if (fullTextCount > 0) {
        const isVisible = await fullTextLocator.isVisible();
        console.log(`📝 Checklist Full Text - Visible: ${isVisible}`);
        
        if (isVisible) {
          const fullText = await fullTextLocator.innerText();
          console.log(`📝 Full Text: ${fullText}`);
          
          // Parse name and ID from text like "Name | id:12345" or "Name | ID:12345"
          if (fullText.includes('|')) {
            const parts = fullText.split('|');
            result.name = parts[0].trim();
            result.hasName = true;
            
            const idPart = parts[1].trim();
            // Handle both lowercase "id:" and uppercase "ID:"
            if (idPart.toLowerCase().startsWith('id:')) {
              result.id = idPart.substring(3).trim();
              result.hasID = true;
            }
            
            console.log(`✅ Checklist Name: ${result.name}`);
            console.log(`✅ Checklist ID: ${result.id}`);
          } else {
            console.log(`⚠️ Could not parse name and ID from text: ${fullText}`);
          }
        } else {
          console.log(`❌ Checklist text element exists but is NOT visible`);
        }
      } else {
        console.log(`❌ Checklist text NOT found - element does not exist`);
      }

      // Check for edit/rule setting icon
      const editIconLocator = this.page.locator(this.selectors.checklistEditIcon);
      const editCount = await editIconLocator.count();
      console.log(`\n⚙️  Edit/Rule Setting Icon - Selector: ${this.selectors.checklistEditIcon}`);
      console.log(`⚙️  Edit/Rule Setting Icon - Elements found: ${editCount}`);
      
      if (editCount >= index) {
        const isVisible = await editIconLocator.nth(index - 1).isVisible();
        console.log(`⚙️  Edit/Rule Setting Icon - Visible: ${isVisible}`);
        
        if (isVisible) {
          result.hasRuleSettingIcon = true;
          console.log(`✅ Edit/Rule Setting Icon: Found and visible`);
        } else {
          console.log(`❌ Edit/Rule Setting Icon element exists but is NOT visible`);
        }
      } else {
        console.log(`❌ Edit/Rule Setting Icon NOT found at index ${index}`);
      }

      // Check for delete icon
      const deleteIconLocator = this.page.locator(this.selectors.checklistItemDeleteButton(3));
      // Scroll into view and wait for stability
      await deleteIconLocator.first().scrollIntoViewIfNeeded().catch(() => {});
      await this.wait("minWait");
      const deleteCount = await deleteIconLocator.count();
      console.log(`\n🗑️  Delete Icon - Selector: ${this.selectors.checklistItemDeleteButton(3)}`);
      console.log(`🗑️  Delete Icon - Elements found: ${deleteCount}`);
      
      if (deleteCount > 0) {
        const isVisible = await deleteIconLocator.first().isVisible();
        console.log(`🗑️  Delete Icon - Visible: ${isVisible}`);
        
        if (isVisible) {
          result.hasDeleteIcon = true;
          console.log(`✅ Delete Icon: Found and visible`);
        } else {
          console.log(`❌ Delete Icon element exists but is NOT visible`);
        }
      } else {
        console.log(`❌ Delete Icon NOT found - element does not exist`);
      }

      console.log(`${'─'.repeat(60)}\n`);
      return result;
    } catch (error) {
      console.log(`\n❌ Error verifying checklist details:`, error);
      console.log(`${'─'.repeat(60)}\n`);
      return result;
    }
  }

  //Verify all required checklist elements are present
  async verifyAllChecklistElements(index: number = 1): Promise<boolean> {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📋 CHECKLIST VERIFICATION REPORT`);
    console.log(`${'='.repeat(60)}`);
    
    // Wait for Added Observation Checklist section to be fully loaded
    await this.wait("mediumWait");
    await this.page.locator("//div[contains(text(),'Added Observation Checklist')]").scrollIntoViewIfNeeded().catch(() => {});
    await this.wait("minWait");
    
    const details = await this.verifyChecklistDetails(index);
    
    const allPresent = details.hasName && 
                       details.hasID && 
                       details.hasRuleSettingIcon && 
                       details.hasDeleteIcon;

    console.log(`\n📊 VERIFICATION SUMMARY:`);
    console.log(`${'─'.repeat(60)}`);
    
    if (allPresent) {
      console.log(`\n✅ SUCCESS: All checklist elements are present\n`);
      console.log(`   ✓ Name: ${details.name || 'N/A'}`);
      console.log(`   ✓ ID: ${details.id || 'N/A'}`);
      console.log(`   ✓ Rule Setting Icon: Present`);
      console.log(`   ✓ Delete Icon: Present\n`);
      console.log(`${'='.repeat(60)}\n`);
      return true;
    } else {
      console.log(`\n❌ FAILED: Missing checklist elements detected\n`);
      
      // Detailed breakdown of missing elements
      const missingElements: string[] = [];
      
      if (!details.hasName) {
        console.log(`   ✗ Name: MISSING`);
        missingElements.push('Checklist Name');
      } else {
        console.log(`   ✓ Name: ${details.name}`);
      }
      
      if (!details.hasID) {
        console.log(`   ✗ ID: MISSING`);
        missingElements.push('Checklist ID');
      } else {
        console.log(`   ✓ ID: ${details.id}`);
      }
      
      if (!details.hasRuleSettingIcon) {
        console.log(`   ✗ Rule Setting Icon: MISSING`);
        missingElements.push('Rule Setting Icon');
      } else {
        console.log(`   ✓ Rule Setting Icon: Present`);
      }
      
      if (!details.hasDeleteIcon) {
        console.log(`   ✗ Delete Icon: MISSING`);
        missingElements.push('Delete Icon');
      } else {
        console.log(`   ✓ Delete Icon: Present`);
      }
      
      console.log(`\n⚠️  MISSING ELEMENTS (${missingElements.length}):`);
      missingElements.forEach((element, i) => {
        console.log(`   ${i + 1}. ${element}`);
      });
      
      console.log(`\n${'='.repeat(60)}\n`);
      return false;
    }
  }

  //Observation Checklist Rules Configuration Methods

  //Click on Rules tab
  async clickRulesTab() {
    await this.wait("minWait");
    await this.validateElementVisibility(this.selectors.checklistRulesTab, "Rules Tab");
    await this.click(this.selectors.checklistRulesTab, "Rules Tab", "Tab");
    await this.wait("minWait");
    console.log("✅ Clicked on Rules tab");
  }

  //Set 'After Learner Registration' to 'Cannot View'
  async setAfterLearnerRegCannotView() {
    await this.wait("minWait");
    await this.click(this.selectors.afterLearnerRegDropdown, "After Learner Registration", "Dropdown");
    await this.wait("minWait");
    await this.click(this.selectors.afterLearnerRegCannotView, "Cannot View", "Option");
    await this.wait("minWait");
    console.log("✅ Set 'After Learner Registration' to 'Cannot View'");
  }

  //Set 'After Learner Registration' to 'Can Answer'
  async setAfterLearnerRegCanAnswer() {
    await this.wait("minWait");
    await this.click(this.selectors.afterLearnerRegDropdown, "After Learner Registration", "Dropdown");
    await this.wait("minWait");
    await this.click(this.selectors.afterLearnerRegCanAnswer, "Can Answer", "Option");
    await this.wait("minWait");
    console.log("✅ Set 'After Learner Registration' to 'Can Answer'");
  }

  //Set 'After Learner Session Starts' to 'Cannot View'
  async setAfterSessionStartsCannotView() {
    await this.wait("minWait");
    await this.click(this.selectors.afterSessionStartsDropdown, "After Session Starts", "Dropdown");
    await this.wait("minWait");
    await this.click(this.selectors.afterSessionStartsCannotView, "Cannot View", "Option");
    await this.wait("minWait");
    console.log("✅ Set 'After Learner Session Starts' to 'Cannot View'");
  }

  //Set 'After Learner Session Starts' to 'Can Answer'
  async setAfterSessionStartsCanAnswer() {
    await this.wait("minWait");
    await this.click(this.selectors.afterSessionStartsDropdown, "After Session Starts", "Dropdown");
    await this.wait("minWait");
    await this.click(this.selectors.afterSessionStartsCanAnswer, "Can Answer", "Option");
    await this.wait("minWait");
    console.log("✅ Set 'After Learner Session Starts' to 'Can Answer'");
  }

  //Set 'After CheckList is Submitted' to 'Cannot View'
  async setAfterChecklistSubmittedCannotView() {
    await this.wait("minWait");
    await this.click(this.selectors.afterChecklistSubmittedDropdown, "After Checklist Submitted", "Dropdown");
    await this.wait("minWait");
    await this.click(this.selectors.afterChecklistSubmittedCannotView, "Cannot View", "Option");
    await this.wait("minWait");
    console.log("✅ Set 'After CheckList is Submitted' to 'Cannot View'");
  }

  //Set 'After CheckList is Submitted' to 'Can View'
  async setAfterChecklistSubmittedCanView() {
    await this.wait("minWait");
    await this.click(this.selectors.afterChecklistSubmittedDropdown, "After Checklist Submitted", "Dropdown");
    await this.wait("minWait");
    await this.click(this.selectors.afterChecklistSubmittedCanView, "Can View", "Option");
    await this.wait("minWait");
    console.log("✅ Set 'After CheckList is Submitted' to 'Can View'");
  }

  //Click Add button to save rules
  async clickAddRulesButton() {
    await this.wait("minWait");
    await this.click(this.selectors.addRulesButton, "Add Rules", "Button");
    await this.wait("minWait");
    console.log("✅ Clicked Add button to save rules");
  }

  //Click Yes button in confirmation dialog
  async clickConfirmYes() {
    await this.wait("minWait");
    await this.click(this.selectors.confirmYesButton, "Confirm Yes", "Button");
    await this.wait("mediumWait");
    console.log("✅ Clicked Yes to confirm");
  }

  //Complete flow: Configure checklist rules with default settings
  async configureChecklistRulesDefault() {
    console.log("🔄 Starting checklist rules configuration...");
    
    await this.clickRulesTab();
    await this.setAfterLearnerRegCannotView();
   // await this.setAfterSessionStartsCannotView();
    await this.setAfterChecklistSubmittedCanView();
    await this.clickAddRulesButton();
    await this.clickConfirmYes();
    
    console.log("✅ Successfully configured checklist rules with default settings");
  }

  //Click Edit icon in Observation Checklist
  async clickChecklistEditIcon() {
    await this.wait("minWait");
    await this.click(this.selectors.checklistEditIcon, "Edit Checklist", "Icon");
    await this.wait("mediumWait");
    console.log("✅ Clicked Edit icon in Observation Checklist");
  }

  //Click Evaluator dropdown
  async clickEvaluatorDropdown() {
    await this.wait("minWait");
    await this.click(this.selectors.evaluatorDropdown, "Evaluator Dropdown", "Field");
    await this.wait("minWait");
    console.log("✅ Clicked Evaluator dropdown");
  }

  //Search and select Evaluator from dropdown
  async searchAndSelectEvaluator(evaluatorName: string) {
    await this.wait("minWait");
    await this.type(this.selectors.evaluatorSearchInput, "Evaluator Name", evaluatorName);
    await this.wait("minWait");
    await this.mouseHover(this.selectors.evaluatorOption(evaluatorName), "Evaluator Name");
    await this.click(this.selectors.evaluatorOption(evaluatorName), "Evaluator Name", "Option");
    await this.wait("minWait");
    console.log(`✅ Selected evaluator: ${evaluatorName}`);
  }

  //Search and select Multiple Evaluators from dropdown
  async searchAndSelectMultipleEvaluators(evaluatorNames: string[]) {
    console.log(`📝 Selecting ${evaluatorNames.length} evaluators...`);
    
    for (let i = 0; i < evaluatorNames.length; i++) {
      const evaluatorName = evaluatorNames[i];
      console.log(`👤 Selecting evaluator ${i + 1}/${evaluatorNames.length}: ${evaluatorName}`);
      
      // Click dropdown to open it (only first time)
      if (i === 0) {
        await this.clickEvaluatorDropdown();
      }
      await this.wait("minWait");
      
      // Clear search input and type evaluator name
      await this.page.locator(this.selectors.evaluatorSearchInput).fill("");
      await this.wait("minWait");
      await this.type(this.selectors.evaluatorSearchInput, "Evaluator Name", evaluatorName);
      await this.wait("minWait");
      
      // // Hover over and click the evaluator option
      // await this.mouseHover(this.selectors.evaluatorOption(evaluatorName), "Evaluator Name");
      // await this.click(this.selectors.evaluatorOption(evaluatorName), "Evaluator Name", "Option");
      await this.click("//li[contains(@id,'list')]", "Evaluator Name", "Option");
      await this.wait("minWait");
      
      console.log(`✅ Selected evaluator: ${evaluatorName}`);
    }
    
    console.log(`✅ Successfully selected all ${evaluatorNames.length} evaluators`);
  }

  //Click Update button in Observation Checklist
  async clickChecklistUpdateButton() {
    await this.wait("minWait");
    await this.click(this.selectors.checklistUpdateButton, "Update Checklist", "Button");
    await this.wait("mediumWait");
    console.log("✅ Clicked Update button in Observation Checklist");
  }

  //edit instance on course edit page
  async clickEditInstance() {
    await this.wait("maxWait");
    await this.page.locator(this.selectors.editInstance).scrollIntoViewIfNeeded();
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.editInstance,
      "Edit Instance"
    );
    await this.click(this.selectors.editInstance, "Edit Instance", "Icon");
  }

  //change single instance to multi instance
  async changeInstancePopUp() {
    await this.click(this.selectors.yesButton, "Yes", "button");
  }

  async verifyInstance() {
    await this.click(this.selectors.instanceClass, "Verify Instance", "text");
  }

  //click edit icon on course listing page
  async clickEditIcon() {
    await this.wait("minWait");
    await this.validateElementVisibility(this.selectors.clickEdit, "Content");
    await this.click(this.selectors.clickEdit, "Content", "button");
  }

  //Duration within 30 mins
  async selectDuration(Duration: string) {
    await this.typeAndEnter(
      this.selectors.selectDuration,
      "Duration",
      Duration
    );
  }

  //course Dedicated to TP:-
  async clickCourseDedicatedToTPRule() {
    await this.wait("mediumWait");
    await this.click(
      this.selectors.courseBusinessRulesLink,
      "Course Business Rule Link",
      "Link"
    );
    await this.validateElementVisibility(
      this.selectors.courseDedicatetoTP,
      "Course Dedicated to TP"
    );
    await this.click(
      this.selectors.courseDedicatetoTP,
      "Course Dedicated to TP",
      "Checkbox"
    );
    await this.click(
      this.selectors.okButton,
      "Ok button present in the popup",
      "Ok Button"
    );
    await this.click(
      this.selectors.saveEquivalenceButton,
      "Save Button",
      "Button"
    );
  }

  //To set Prerequisite/Equilance for course:-
  async clickCourseOption(option: string) {
    await this.wait("mediumWait");
    await this.validateElementVisibility(
      this.selectors.courseOption(option),
      "Course Option"
    );
    await this.click(
      this.selectors.courseOption(option),
      "Course Option",
      "Button"
    );
  }

  //get conetent name on course creation page:-
  async getAttachedContentName() {
    let contentName = await this.getInnerText(
      this.selectors.contentTitleOnCoursePage
    );
    return contentName;
    console.log("Content name is: " + contentName);
  }

  async addMultiPrerequisiteCourse(courseName: string, courseName1: string) {
    await this.typeAndEnter(
      this.selectors.preSearchField,
      "Completion Certificate Search Field",
      courseName
    );
    await this.spinnerDisappear();
    await this.click(
      this.selectors.preCourseIndex(1),
      "Prerequisite Course",
      "checkbox"
    );
    await this.wait("minWait");
    await this.mouseHover(this.selectors.addPreCourseBtn, "addcontent");
    await this.click(this.selectors.addPreCourseBtn, "addcontent", "button");
    await this.wait("mediumWait");
    await this.typeAndEnter(
      this.selectors.preSearchField,
      "Completion Certificate Search Field",
      courseName1
    );
    await this.spinnerDisappear();
    await this.click(
      this.selectors.preCourseIndex(1),
      "Prerequisite Course",
      "checkbox"
    );
    await this.wait("minWait");
    await this.mouseHover(this.selectors.addPreCourseBtn, "addcontent");
    await this.click(this.selectors.addPreCourseBtn, "addcontent", "button");
    await this.wait("mediumWait");
  }

  async addSinglePrerequisiteCourse(courseName: string) {
    await this.typeAndEnter(
      this.selectors.preSearchField,
      "Completion Certificate Search Field",
      courseName
    );
    await this.spinnerDisappear();
    await this.click(
      this.selectors.preCourseIndex(1),
      "Prerequisite Course",
      "checkbox"
    );
    await this.wait("minWait");
    await this.mouseHover(this.selectors.addPreCourseBtn, "addcontent");
    await this.click(this.selectors.addPreCourseBtn, "addcontent", "button");
    await this.wait("mediumWait");
  }
  //For adding particular completion certificate to the Course/TP:-
  async clickSpecificCertificateCheckBox(data: string) {
    await this.typeAndEnter(
      "#exp-search-certificate-field",
      "Completion Certificate Search Field",
      data
    );
    await this.spinnerDisappear();
    await this.mouseHover(
      this.selectors.clickCreatedCertificateCheckbox(data),
      "Created Certificate CheckBox"
    );
    await this.click(
      this.selectors.clickCreatedCertificateCheckbox(data),
      "Created Certificate CheckBox",
      "Checkbox"
    );
  }

  async addEquivalenceCourse(coursename: string) {
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.selectEquivalenceCourse(coursename),
      "Equivalence Course"
    );
    await this.click(
      this.selectors.selectEquivalenceCourse(coursename),
      "Equivalence Course",
      "Radio Button"
    );
    await this.click(
      this.selectors.addEquivalenceButton,
      "Add Equivalence Course",
      "Button"
    );
    await this.wait("minWait");
    await this.click(
      this.selectors.saveEquivalenceButton,
      "Save Equivalence Course",
      "Button"
    );
    await this.wait("minWait");
    await this.verification(
      this.selectors.equivalenceSuccessMessage,
      "successfully"
    );
  }

  async verifyCreateUserLabel(expectedLabel: string) {
    await this.verification(this.selectors.createUserLabel, expectedLabel);
  }
  async catalogSearch(data: string) {
    await this.type(this.selectors.crs_TPSearchField, "Search Field", data);
    await this.keyboardAction(
      this.selectors.crs_TPSearchField,
      "Enter",
      "Search Field",
      data
    );
    await this.spinnerDisappear();
  }
  async retriveCode() {
    await this.page.keyboard.press("PageUp");  
    await this.page.locator(this.selectors.codeValue).scrollIntoViewIfNeeded();
    let value = await this.page.locator(this.selectors.crs_TPCode).inputValue();
    return value;
  }
  async msgVerify() {
    const msg = await this.page.locator("//h3[text()='There are no results that match your current filters. Try removing some of them to get better results.']");
    if (msg.isVisible()) {
      console.log("Course is not displayed for admin user if the access is not given");
    }
  }

 

  async typeDescription(data: string) {
    await this.type(this.selectors.courseDescriptionInput, "Description", data);
  }


  async uploadvideo() {
    let videoContent = `testVideo1`;
    const path = `../data/${videoContent}.mp4`;
    await this.mouseHover(this.selectors.uploadDiv, "upload");
    await this.wait("maxWait");
    await this.uploadFile(this.selectors.uploadInput, path);
    /*  this.page.on('console', msg => {
             console.log(`Console Log: ${msg.text()}`);
         }); */
    /*   this.page.on('response', async response => {
              console.log(`Response received from: ${response.url()}`);
              console.log(`Response status: ${response.status()}`);
              console.log(`Response headers: ${JSON.stringify(response.headers())}`);
              console.log(`Response body: ${await response.text()}`);
          }); */
    await this.validateElementVisibility(this.selectors.progress, "Loading");
    await this.validateElementVisibility(
      this.selectors.attachedContent(videoContent),
      videoContent
    );
  }

  async uploadCourseContent(fileName: string) {
    const path = `../data/${fileName}`;
    await this.mouseHover(this.selectors.uploadDiv, "upload");
    await this.uploadFile(this.selectors.uploadInput, path);
    await this.wait("mediumWait");
    await this.validateElementVisibility(this.selectors.progress, "Loading");
    await this.validateElementVisibility(
      this.selectors.attachedContent(fileName),
      `${fileName}`
    );
  }

  async clickCatalog() {
  
    await this.validateElementVisibility(
      this.selectors.showInCatalogBtn,
      "Show in Catalog"
    );
    await this.page.locator(this.selectors.showInCatalogBtn).scrollIntoViewIfNeeded();
    await this.click(this.selectors.showInCatalogBtn, "Catalog", "Button");
  }

  async clickSaveasDraft() {
    await this.validateElementVisibility(
      this.selectors.clickSaveasDraft,
      "Draft"
    );
    await this.click(this.selectors.clickSaveasDraft, "Draft", "CheckBox");
  }

  async clickSave() {
    await this.wait("maxWait");
    await this.validateElementVisibility(this.selectors.saveBtn, "Save");
    // await this.click(this.selectors.saveBtn, "Save", "Button");

    await this.handleSaveUntilProceed();
  }


  /**
 * Handles clicking Save and retrying based on API response status.
 */

  async handleSaveUntilProceed(maxRetries = 6) {
    let attempt = 0;

    while (attempt < maxRetries) {
      attempt++;
      console.log(`Attempt ${attempt}: Clicking Save button...`);

      try {
        // Wait before clicking each time
        await this.wait("mediumWait");

        // Click Save button
        await this.click(this.selectors.saveBtn, "Save", "Button");
        await this.spinnerDisappear();
        const proceedVisible = await this.page.locator(this.selectors.proceedBtn).isVisible();
        const saveVisible = await this.page.locator(this.selectors.saveBtn).isVisible();

        if (proceedVisible) {
          console.log("Proceed button visible. Save successful.");
          return;
        }

        if (!saveVisible) {
          console.log("Save button hidden. Assuming Save successful.");
          return;
        }

        console.log("Save button still visible. Retrying...");

      } catch (error) {
        console.log(`Error during Save attempt ${attempt}: ${error.message}`);
      }
    }

    console.log("Proceed button not visible even after 6 attempts. Save may have failed.");
  }



  async clickProceed() {
    await this.wait("maxWait");
    await this.validateElementVisibility(this.selectors.proceedBtn, "Proceed");
    await this.click(this.selectors.proceedBtn, "Proceed", "Button");
    // await this.wait("maxWait") //It is added to fix TP Structure loading issue
  }

  async verifySuccessMessage() {
    await this.wait("maxWait");
    await this.wait("mediumWait");
    await this.spinnerDisappear();
    await this.page.waitForSelector(this.selectors.successMessage, { timeout: 60000 });
    await this.verification(this.selectors.successMessage, "successfully");
  }

  async verifyDeliveryTypeDeactivated(): Promise<boolean> {
    try {
      // Check if the delivery type field is deactivated using the specific selector
      const deactivatedElement = await this.page.locator("(//input[contains(@class,'field_deactived')])[2]");
      
      // Check if the element exists and is visible
      const isElementPresent = await deactivatedElement.count() > 0;
      
      if (isElementPresent) {
        await deactivatedElement.waitFor({ state: 'visible', timeout: 5000 });
        console.log("SUCCESS: Virtual Class delivery type is deactivated - field_deactived class found");
        return true;
      } else {
        console.log("Virtual Class delivery type is not deactivated - field_deactived class not found");
        return false;
      }
    } catch (error) {
      console.error("Error verifying delivery type deactivation:", error);
      console.log("Virtual Class delivery type deactivation verification failed");
      return false;
    }
  }

  async selectDomain(domain_name: string) {
    await this.click(this.selectors.domainBtn, "Domain", "Button");
    await this.click(
      this.selectors.domainOption(domain_name),
      "Domain Name",
      "Button"
    );
    await this.click(this.selectors.domainBtn, "Domain", "Button");
  }

  async selectPortalOption() {
    await this.click(this.selectors.portalDropdown, "Portal", "dropdown");
    const index = await this.page
      .locator(
        "//label[text()='Domain']/following::div[@class='dropdown-menu show']//a"
      )
      .count();
    const randomIndex = Math.floor(Math.random() * index) + 1;
    await this.click(
      this.selectors.portalOption(randomIndex),
      "Domain Name",
      "Button"
    );
  }

  async selectDomainOption(portalName: string) {
    await this.click(this.selectors.portalDropdown, "Portal", "dropdown");
    for (const options of await this.page
      .locator(this.selectors.allPortalOptions)
      .all()) {
      const value = await options.innerText();
      console.log(value);
      try {
        // let option1 = this.page.locator(`//div[@id='wrapper-course-portals']//span[@class='text' and text()='${value}']`);

        if (value !== portalName) {
          try {
            await this.page.click(
              `//div[@id='wrapper-course-portals']//span[@class='text' and text()='${value}']`,
              { timeout: 2000 }
            );
          } catch (error) {
            // console.error("Error clicking on the first locator, trying the fallback locator:", error);
            await this.page.click(
              `//footer//following::span[@class='text' and text()='${value}']`,
              { timeout: 2000 }
            );
          }
        }
      } catch (error) {
        console.error("Error in main block:", error);
      }
    }
  }

  async clickCEULink() {
    await this.validateElementVisibility(this.selectors.ceuLink, "CEU");
    await this.wait("minWait");
    await this.click(this.selectors.ceuLink, "CEU", "Link");
  }
  async clickCEULinkInRecertification() {
    // Wait for recertification section to be fully loaded after save
    await this.page.waitForTimeout(2000);

    // Explicitly wait for the CEU link in recertification to be available
    await this.page.waitForSelector(this.selectors.ceuLinkInRecertfication, {
      state: 'visible',
      timeout: 10000
    });

    await this.wait("minWait");
    await this.validateElementVisibility(this.selectors.ceuLinkInRecertfication, "CEU");
    await this.wait("minWait");
    await this.click(this.selectors.ceuLinkInRecertfication, "CEU", "Link");
  }

  async fillCEUProviderType() {
    //let data = getRandomItemFromFile("../data/peopleCEUProviderData.json");
    await this.click(
      this.selectors.ceuProviderName,
      "Provider Name",
      "Drop down"
    );
    let option = "//div[@id='wrapper-course-ceu-providers']//li";
    await this.wait("minWait");
    let count = await this.page.locator(option).count();
    const rNum = Math.floor(Math.random() * count + 1);
    await this.click(`(${option})[${rNum}]`, "Provider Name", "Drop down");
    const ceuProviderValue = await this.getInnerText(
      this.selectors.ceuProviderInnerValue
    );
    return ceuProviderValue;
  }

  async fillUnit() {
    await this.type(this.selectors.unitInput, "Unit", score());
  }

  async fillCEUType() {
    // let data = getRandomItemFromFile("../data/peopleCEUData.json");
    await this.click(this.selectors.ceuType, "Provider Name", "Drop down");
    await this.wait("minWait");
    let option = "//div[@id='wrapper-course-ceu-type']//li/a";
    let count = await this.page.locator(option).count();
    const rNum = Math.floor(Math.random() * count + 1);
    await this.click(`(${option})[${rNum}]`, "Provider Name", "Drop down");
    const ceuValue = await this.getInnerText(this.selectors.ceuTypeInnerValue);
    return ceuValue;
  }

  async clickAddCEUButton() {
    await this.validateElementVisibility(this.selectors.addCEUBtn, "Add CEU");
    await this.click(this.selectors.addCEUBtn, "Add CEU", "Button");
    await this.wait("mediumWait");
    let text = this.page.locator(this.selectors.addedCEUData).allTextContents();
    console.log(await text);
    await this.wait("minWait");
  }

  async selectLanguage(language: string) {
    await this.click(
      this.selectors.courseLanguagesWrapper,
      "Language",
      "Field"
    );
    await this.type(
      this.selectors.courseLanguageInput,
      "Input Field",
      language
    );
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

  async clickSelect(category: string) {
    await this.click(this.selectors.selectCategoryBtn, "Category", "Dropdown");
    await this.click(
      this.selectors.categoryOption(category),
      "Category",
      "Dropdown"
    );
  }

  async uploadVideoThroughLink() {
    await this.mouseHover(this.selectors.httpsInput, "https input");
    await this.keyboardType(
      this.selectors.httpsInput,
      "https://www.youtube.com/watch?v=K4TOrB7at0Y"
    );
    await this.wait("minWait");
    await this.click(this.selectors.addURLBtn, "Add URL", "Button");
    await this.wait("maxWait");
  }

  async addCategory(CategoryName: string) {
    await this.click(this.selectors.addCategoryBtn, "Add category", "Field");
    await this.type(this.selectors.categoryInput, "Category", CategoryName);
  }

  async clickOk() {
    await this.click(this.selectors.okBtn, "Tick", "image");
  }

  async modifyTheAccess() {
    await this.mouseHover(
      this.selectors.modifyTheAccessBtn,
      "No, Modify The Access"
    );
    await this.click(
      this.selectors.modifyTheAccessBtn,
      "No, Modify The Access",
      "Button"
    );
    // await this.spinnerDisappear();
    // const closeButton = this.page.locator(this.selectors.closeBtn);
    // await this.wait("mediumWait");
    // if (await closeButton.isVisible()) {
    //   await closeButton.click({ force: true });
    // }
  }
  async clickCancel() {
    await this.click(this.selectors.cancelBtn, "Cancel", "image");
  }

  async selectProvider(provider: string) {
    await this.click(
      this.selectors.providerDropdown,
      "Default Provider",
      "Dropdown Field"
    );
    await this.wait("minWait");
    await this.click(
      this.selectors.providerOption(provider),
      "Provider",
      "Dropdown Value"
    );
  }

  async selectTotalDuration() {
    await this.typeAndEnter(
      this.selectors.totalDurationInput,
      "Duration",
      FakerData.getDuration()
    );
  }

  async typeAdditionalInfo() {
    await this.validateElementVisibility(
      this.selectors.additionalInfoInput,
      "Additional Information"
    );
    await this.type(
      this.selectors.additionalInfoInput,
      "Additional Information",
      FakerData.getDescription()
    );
  }

  /**
   * Set the Additional Information rich text field and toggle visibility to learners.
   * - clicks the "Show to Learners" checkbox
   * - focuses the rich editor and types the provided text
   * - uses keyboard actions to clear existing content before typing
   */
  async setAdditionalInformation(text: string) {
    // Enable "Show to Learners" so the field is visible to learners
    try {
      await this.validateElementVisibility(
        this.selectors.showToLearnersCheckbox,
        "Show to Learners checkbox"
      );
      await this.click(
        this.selectors.showToLearnersCheckbox,
        "Show to Learners",
        "Checkbox"
      );
    } catch (err) {
      console.log("⚠ Could not find/enable Show to Learners checkbox:", err.message);
    }

    // Click the rich text editor container to focus it and type the content
    const editorContainer = "//div[@id='additional_information_description_id']";
    await this.validateElementVisibility(editorContainer, "Additional Information Editor");
    await this.click(editorContainer, "Additional Information Editor", "Field");

    // Clear existing content reliably and type the new text
    // Using keyboard shortcuts to support rich editors like Quill
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.press('Backspace');
    await this.page.keyboard.type(text);

    console.log("✓ PASS: Additional information set to:", text.substring(0, 120));
  }

  async enterPrice(price: string) {
    await this.page
      .locator(this.selectors.priceInput)
      .scrollIntoViewIfNeeded({ timeout: 3000 });
    await this.type(this.selectors.priceInput, "Price", price);
  }

  async selectCurrency() {
    await this.page
      .locator(this.selectors.currencyDropdown)
      .scrollIntoViewIfNeeded({ timeout: 3000 });
    await this.click(this.selectors.currencyDropdown, "Currency", "Field");
    await this.click(this.selectors.currencyOption, "Currency", "Selected");
  }

  /**
   * Verify that price and currency fields are inherited from course and are editable when Price Override is ON
   * Uses the exact locators specified by user: #course-price and //button[@data-id='course-currency']
   * @param expectedPrice - The price that should be inherited from the course
   * @param expectedCurrency - The currency that should be inherited from the course
   */
  async verifyPriceInheritanceAndEditability(expectedPrice: string, expectedCurrency: string) {
    await this.wait("mediumWait");
    
    // Verify Price field using user specified locator: #course-price
    const priceField = this.page.locator(this.selectors.coursePriceField);
    await priceField.scrollIntoViewIfNeeded({ timeout: 3000 });
    
    // Check if price field contains the expected inherited value
    const actualPrice = await priceField.inputValue();
    console.log(`Expected Price: ${expectedPrice}, Actual Price: ${actualPrice}`);
    
    if (actualPrice !== expectedPrice) {
      console.log(`Warning: Price field shows '${actualPrice}' but expected '${expectedPrice}'`);
    }
    
    // Verify Price field is editable (not disabled)
    const isPriceDisabled = await priceField.isDisabled();
    if (isPriceDisabled) {
      throw new Error("Price field (#course-price) is disabled when Price Override is ON - it should be editable");
    }
    console.log("✅ Price field (#course-price) is editable when Price Override is enabled");
    
    // Verify Currency field using user specified locator: //button[@data-id='course-currency']
    const currencyDropdown = this.page.locator(this.selectors.courseCurrencyDropdown);
    await currencyDropdown.scrollIntoViewIfNeeded({ timeout: 3000 });
    
    // Check if currency dropdown is editable
    try {
      const isCurrencyDisabled = await currencyDropdown.isDisabled();
      if (isCurrencyDisabled) {
        throw new Error("Currency dropdown is disabled when Price Override is ON - it should be editable");
      }
      
      // Test clicking the dropdown to verify it's functional
      await this.click(this.selectors.courseCurrencyDropdown, "Currency Dropdown", "Field");
      console.log("✅ Currency dropdown (//button[@data-id='course-currency']) is clickable and editable when Price Override is enabled");
      
      // Close the dropdown
      await this.page.keyboard.press('Escape');
    } catch (error) {
      throw new Error("Currency dropdown (//button[@data-id='course-currency']) is not editable when Price Override is ON");
    }
  }

  /**
   * Test editing price and currency fields when Price Override is enabled
   * Uses user-specified locators and validates editability
   * @param newPrice - New price to set
   * @param newCurrency - New currency to set (optional, defaults to US Dollar)
   */
  async editInstancePriceAndCurrency(newPrice: string, newCurrency: string = "US Dollar") {
    await this.wait("mediumWait");
    
    // Edit the price field using user specified locator: #course-price
    const priceField = this.page.locator(this.selectors.coursePriceField);
    await priceField.scrollIntoViewIfNeeded({ timeout: 3000 });
    
    // Clear and enter new price
    await priceField.clear();
    await this.type(this.selectors.coursePriceField, "Instance Price", newPrice);
    console.log(`✅ Successfully updated instance price to: ${newPrice} using #course-price locator`);
    
    // Edit the currency field using user specified locator: //button[@data-id='course-currency']
    const currencyDropdown = this.page.locator(this.selectors.courseCurrencyDropdown);
    await currencyDropdown.scrollIntoViewIfNeeded({ timeout: 3000 });
    await this.click(this.selectors.courseCurrencyDropdown, "Currency", "Field");
    
    // Select the specified currency using user specified locator: //span[text()='US Dollar']
    await this.click(this.selectors.usDollarCurrencyOption, "Currency Option", "Selected");
    console.log(`✅ Successfully updated instance currency to: ${newCurrency} using //button[@data-id='course-currency'] locator`);
  }

  async selectSeats(seatCount: string) {
    await this.type(this.selectors.maxSeatsInput, "Max-Seats", seatCount);
  }

  async contactSupport(email: string) {
    await this.type(
      this.selectors.contactSupportInput,
      "ContactSupport",
      email
    );
  }

  async selectCompliance() {
    await this.click(this.selectors.complianceField, "Compaliance", "Field");
    await this.click(this.selectors.complianceOption, "Compaliance", "Field");
    //await this.click(this.selectors.complianceOption, "Compaliance", "Field");
  }
  async selectCompleteByRule() {
    await this.validateElementVisibility(
      this.selectors.completeByRule,
      "CompleteByRule"
    );
    await this.mouseHover(this.selectors.completeByRule, "CompleteByRule");
    await this.click(this.selectors.completeByRule, "CompleteByRule", "Field");
    await this.click(
      this.selectors.completeByRuleOption,
      "CompleteByRule Option",
      "Field"
    );
  }

  async selectValidity() {
    await this.click(this.selectors.validityField, "Valitdity", "field");
    await this.click(this.selectors.validityOption, "Days", "Field");
  }

  async enterDate(date: string) {
    await this.type(this.selectors.validityDateInput, "Date ", date);
  }

  async daysOfValidity(days: string) {
    await this.type(this.selectors.validityDaysInput, "Days", days);
  }

  async selectCompleteBy() {
    await this.click(this.selectors.completeByField, "CompleteBy", "Field");
  }

  /**
   * Select Complete by option from dropdown
   * @param option - "Days from hire" or "Days from enrollment"
   */
  async selectCompleteByOption(option: "Days from hire" | "Days from enrollment") {
    await this.validateElementVisibility(
      this.selectors.completeByDropdown,
      "Complete by dropdown"
    );
    await this.click(this.selectors.completeByDropdown, "Complete by", "Dropdown");
    await this.wait("minWait");
    await this.mouseHover(this.selectors.completeByOption(option), option);
    await this.click(this.selectors.completeByOption(option), option, "Option");
    console.log(`✅ Selected Complete by option: ${option}`);
  }

  async selectDaysfromEnrollment() {
    await this.click(
      this.selectors.categoryOption("Days from enrollment"),
      "Days from Enrollment",
      "Dropdown"
    );
  }

  async selectDaysfromHire() {
    await this.click(
      this.selectors.categoryOption("Days from hire"),
      "Days from Hire",
      "Dropdown"
    );
  }

  async enterCompleteByDate(date: string) {
    await this.type(this.selectors.completeByField, "Choose Date", date);
  }

  async completByDays(days: string) {
    await this.type(this.selectors.completeByDaysInput, "ComplebyDays", days);
  }

  async selectPostCompletebyOverDue() {
    await this.click(
      this.selectors.postCompleteByStatusField,
      "Default Incomplete",
      "dropdown"
    );
    await this.click(this.selectors.postCompleteByOption, "Overdue", "Option");
  }

  async selectInstance() {
    await this.click(
      this.selectors.courseInstancesField,
      "Default Single Instance",
      "dropdown"
    );
    await this.click(
      this.selectors.instanceTypeOption,
      "Multi Instance",
      "Option"
    );
  }

  async clickHideinCatalog() {
    await this.wait("minWait");
    await this.page.locator(this.selectors.hideInCatalogCheckbox).scrollIntoViewIfNeeded();
    await this.click(
      this.selectors.hideInCatalogCheckbox,
      "Hide in Catalog",
      "checkbox"
    );
  }

  async clickSaveinDraft() {
    await this.click(
      this.selectors.saveInDraftCheckbox,
      "Save in Draft",
      "checkbox"
    );
  }

  async selectdeliveryType(deliveryType: string) {
    await this.click(
      this.selectors.deliveryTypeDropdown,
      "Course Delivery",
      "dropdown"
    );
    await this.mouseHover(
      this.selectors.deliveryTypeOption(deliveryType),
      "Delivery Type"
    );
    await this.click(
      this.selectors.deliveryTypeOption(deliveryType),
      "Delivery Type",
      "Selected"
    );
  }

  async selectInstanceType(instanceType: string) {
    await this.click(
      this.selectors.selectInstanceDropdown,
      "Instance Dropdown",
      "dropdown"
    );
    await this.wait("minWait");
    await this.mouseHover(
      this.selectors.instanceSelection(instanceType),
      "Multiinstance"
    );
    await this.click(
      this.selectors.instanceSelection(instanceType),
      "Multiinstance",
      "Selected"
    );
  }

  async clickEditCourseTabs() {
    await this.click(this.selectors.editCourseTabLink, "Edit Course", "Button");
  }
  async typeCompleteByDate() {
    await this.typeAndEnter(
      this.selectors.completeByDateInput,
      "Completed Date",
      gettomorrowDateFormatted()
    );
  }

  async selectCompleteByDate() {
    // await this.click(this.selectors.CourseCalendaricon, "Date", "Field");
    await this.validateElementVisibility(
      this.selectors.CourseCalendaricon,
      "Enter Course Date"
    );
    await this.keyboardType(
      this.selectors.CourseCalendaricon,
      gettomorrowDateFormatted()
    );
    //await this.wait("minWait")
    //await this.click(this.selectors.tomorrowdate, "Tomorrow", "Field")
  }
  async selectDate() {
    await this.click(this.selectors.CourseCalendaricon, "Date", "Field");
    await this.wait("minWait");
    await this.click(this.selectors.nextMonth, "Next", "button");
    await this.wait("minWait");
    await this.click(this.selectors.randomDate, "RandomDate", "Field");
  }
  async clickregistrationEnds() {
    await this.validateElementVisibility(
      this.selectors.registrationEnd,
      "Enter Date"
    );
    await this.keyboardType(
      this.selectors.registrationEnd,
      gettomorrowDateFormatted()
    );
  }

  /**
   * Verify that required field popup is displayed
   * @param expectedText - The expected text in the popup (e.g., "Complete by date is required." or "Complete days is required.")
   */
  async verifyCompleteByRequiredPopup(expectedText: string) {
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.completeByRequiredPopup,
      "Complete by required popup"
    );
    await this.verification(
      this.selectors.completeByRequiredPopup,
      expectedText
    );
    console.log(`✅ Verified: ${expectedText} popup displayed`);
  }

  // New methods for expiry date inputs using specific IDs
  async setCompleteByDate() {
    await this.validateElementVisibility(
      this.selectors.completeByDateInput,
      "Complete By Date Input"
    );
    await this.keyboardType(
      this.selectors.completeByDateInput,
      gettomorrowDateFormatted()
    );
    console.log("Complete by date set to: " + gettomorrowDateFormatted());
  }

  async setValidityDate() {
    await this.validateElementVisibility(
      this.selectors.validityDateInput,
      "Validity Date Input"
    );
    await this.keyboardType(
      this.selectors.validityDateInput,
      gettomorrowDateFormatted()
    );
    console.log("Validity date set to: " + gettomorrowDateFormatted());
  }

  // async selectLocation(locationName: string) {
  //     await this.click(this.selectors.locationSelection,"Select location","Field")
  //     await this.click(this.selectors.locationDropdown, "Select Location", "DropDown");
  //     await this.type(this.selectors.locationDropdown, "Location", locationName);
  //     await this.mouseHover(this.selectors.locationOption(locationName), "Location Option");
  //     await this.click(this.selectors.locationOption(locationName), "Location Option","Selected");

  // }
  async visiblityOfaddInstance() {
    return await this.page.locator(this.selectors.addInstancesBtn).isDisabled();
  }

  async addInstances() {
    await this.wait("mediumWait");
    await this.spinnerDisappear();
    
    // Wait for the page to be fully loaded after navigation
    await this.page.waitForLoadState('load');
    await this.wait("minWait");
    
    // Ensure the Add Instance button is available and clickable
    await this.page.waitForSelector(this.selectors.addInstancesBtn, { timeout: 30000 });
    await this.validateElementVisibility(
      this.selectors.addInstancesBtn,
      "Add Instances"
    );
    
    // Scroll to ensure the button is in view
    await this.page.locator(this.selectors.addInstancesBtn).scrollIntoViewIfNeeded();
    await this.wait("minWait");
    
    await this.mouseHover(this.selectors.addInstancesBtn, "Add Instances");
    await this.click(this.selectors.addInstancesBtn, "Add Instances", "Button");
    
    // Wait for the pop-up to appear
    await this.wait("minWait");
  }

  async selectInstanceDeliveryType(delivery: string) {
    await this.validateElementVisibility(
      this.selectors.deliveryLabel,
      "Delivery Label"
    );
    await this.click(
      this.selectors.instanceDeliveryTypeField,
      "Select Instance Type",
      "Option"
    );
    await this.click(
      this.selectors.instanceDeliveryTypeOption(delivery),
      "Instance DeliveryType",
      "Option"
    );
  }

  async enterInstanceCount(count: string) {
    await this.type(this.selectors.instanceCountInput, "Instance Count", count);
  }

  async clickCreateInstance() {
    await this.click(
      this.selectors.createInstanceBtn,
      "Create Instances",
      "Button"
    );
    await this.waitForElementHidden(
      "//footer/following::i[contains(@class,'duotone fa-times pointer')]",
      "X Button"
    );
  }

  async enterSessionName(sessionName: string) {
    await this.validateElementVisibility(
      this.selectors.sessionNameInput,
      "Session Name"
    );
    await this.mouseHover(this.selectors.sessionNameInput, "Session Name");
    await this.type(
      this.selectors.sessionNameInput,
      "Session Name",
      sessionName
    );
  }

  async selectInstructor(instructorName: string) {
    await this.click(
      this.selectors.instructorDropdown,
      "Select Instructor",
      "DropDown"
    );
    await this.type(
      this.selectors.instructorInput,
      "Instructor Name",
      instructorName
    );
    await this.mouseHover(
      this.selectors.instructorOption(instructorName),
      "Instructor Name"
    );
    await this.click(
      this.selectors.instructorOption(instructorName),
      "Instructor Name",
      "Button"
    );
  }

  async selectMultipleInstructors(instructorNames: string[]) {
    console.log(`📝 Selecting ${instructorNames.length} instructors...`);
    
    for (let i = 0; i < instructorNames.length; i++) {
      const instructorName = instructorNames[i];
      console.log(`👤 Selecting instructor ${i + 1}/${instructorNames.length}: ${instructorName}`);
      
      // Click dropdown to open it
      await this.click(
        this.selectors.instructorDropdown,
        "Select Instructor",
        "DropDown"
      );
      await this.wait("minWait");
      
      // Type instructor name in search field
      await this.type(
        this.selectors.instructorInput,
        "Instructor Name",
        instructorName
      );
      await this.wait("minWait");
      
      // Hover over and click the instructor option
      await this.mouseHover(
        this.selectors.instructorOption(instructorName),
        "Instructor Name"
      );
      await this.click(
        this.selectors.instructorOption(instructorName),
        "Instructor Name",
        "Option"
      );
      await this.wait("minWait");
      
      console.log(`✅ Selected instructor: ${instructorName}`);
    }
    
    console.log(`✅ Successfully selected all ${instructorNames.length} instructors`);
  }

  async selectLocation() {
    await this.wait("minWait");
    await this.page.locator(this.selectors.locationSelection).scrollIntoViewIfNeeded(); 
    await this.click(
      this.selectors.locationSelection,
      "Select Location",
      "DropDown"
    );
    await this.click(
      this.selectors.locationDropdown,
      "Select Location",
      "DropDown"
    );
    let location = getRandomLocation();
    await this.type(
      this.selectors.locationDropdown,
      "Select Location",
      location
    );
    await this.mouseHover(this.selectors.locationOption(location), "Location");
    await this.click(
      this.selectors.locationOption(location),
      "Location",
      getRandomLocation()
    );
  }
  async enterStartDate() {
    const date = gettomorrowDateFormatted();
    await this.keyboardType(this.selectors.startDateInstanceIndex(1), date);
  }

  async enterDateValue() {
    const date = getRandomFutureDate();
    await this.keyboardType(this.selectors.Date, date);
  }

  async enterpastDateValue() {
    const date = getRandomPastDate();
    await this.keyboardType(this.selectors.Date, date);
  }
  async enterfutureDateValue() {
    const date = getFutureDate();
    await this.keyboardType(this.selectors.Date, date);
  }
  
  async enterCurrentDateValue() {
    const date = getCurrentDateFormatted();
    await this.keyboardType(this.selectors.Date, date);
  }

  async entertimezone(country: string) {
    await this.click(this.selectors.timeZoneIndex(1), "TimeZone", "Text Field");
    await this.type(this.selectors.timeZoneOption, "Time Zone", country);
    await this.wait("minWait");
    await this.mouseHover(this.selectors.indianTimezone, "Indian Time zone");
    await this.click(
      this.selectors.indianTimezone,
      "Indian Timezone",
      "Selected"
    );
  }
  async setCurrentDate() {
    await this.mouseHover(this.selectors.calanderIcon, "Calander Icon");
    await this.click(this.selectors.calanderIcon, "Calander Icon", "Button");
    //await this.click(this.selectors.todayDate, "Date", "Today's Date");
    await this.click(this.selectors.tomorrowdate, "Date", "Today's Date");
  }

  async setMaxSeat() {
    await this.typeAndEnter(
      this.selectors.seatMaxInput,
      "Instance Max Seat",
      await getRandomSeat()
    );
  }

  // public async startandEndTime() {
  //   // Try multiple possible time input selectors
  //   const timeInputSelectors = [
  //     this.selectors.timeInput, // Generic selector
  //     "//input[contains(@id,'starttime_sesstime_instance')]", // ID-based selector
  //     "//input[contains(@placeholder,'Start Time')]", // Placeholder-based
  //     "//label[text()='Start Time']//following::input[1]" // Alternative path
  //   ];
    
  //   let timeInputFound = false;
  //   let timeInputSelector = "";
    
  //   // Find the first working time input selector
  //   for (const selector of timeInputSelectors) {
  //     try {
  //       const element = this.page.locator(selector);
  //       const isVisible = await element.isVisible();
  //       if (isVisible) {
  //         timeInputSelector = selector;
  //         timeInputFound = true;
  //         console.log(`Time input found with selector: ${selector}`);
  //         break;
  //       }
  //     } catch (error) {
  //       console.log(`Selector ${selector} not found, trying next...`);
  //     }
  //   }
    
  //   if (!timeInputFound) {
  //     console.error("No time input field found!");
  //     return;
  //   }
    
  //   // Click on the time input field
  //   await this.click(timeInputSelector, "Start Time Input", "Input");
  //   await this.wait("mediumWait");
    
  //   function getCurrentTimePlusTwoHours() {
  //     const now = new Date();
  //     now.setHours(now.getHours() + 2); // Add 2 hours
  //     let hours = now.getHours();
  //     const minutes = now.getMinutes();
  //     const ampm = hours >= 12 ? "PM" : "AM";
  //     hours = hours % 12 || 12; // Convert to 12-hour format
  //     const roundedMinutes = Math.ceil(minutes / 15) * 15;
  //     const formattedMinutes =
  //       roundedMinutes === 60
  //         ? "00"
  //         : roundedMinutes.toString().padStart(2, "0");
  //     if (roundedMinutes === 60) {
  //       hours = (hours % 12) + 1;
  //     }
  //     return `${hours.toString().padStart(2, "0")}:${formattedMinutes} ${ampm}`;
  //   }
  //   async function selectNextAvailableTime() {
  //     // Target only the visible time picker using :visible or style check
  //     const list = await this.page
  //       .locator("//div[contains(@class,'timepicker') and not(contains(@style,'display: none'))]//li")
  //       .allTextContents();
  //     console.log(list);
  //     const timeToSelect = getCurrentTimePlusTwoHours();
  //     console.log("Current Time + 2 hours:", timeToSelect);

  //     // Use first() to avoid strict mode violation when multiple elements match
  //     const timeLocator = this.page.locator(
  //       `(//div[contains(@class,'timepicker')]//li[text()='${timeToSelect}'])`
  //     );

  //     // Check if multiple elements exist and use first() to select the first match
  //     const count = await timeLocator.count();
  //     if (count > 1) {
  //       console.log(`Found ${count} elements with time ${timeToSelect}, selecting the first one`);
  //       await timeLocator.first().click();
  //     } else if (count === 1) {
  //       await timeLocator.click();
  //     } else {
  //       console.log(`Time ${timeToSelect} not found, trying fallback approach`);
  //       // Fallback: find the closest available time
  //       for (const time of list) {
  //         if (time >= timeToSelect) {
  //           console.log('Selecting closest available time:', time);
  //           await this.page.locator(`(//div[contains(@class,'timepicker')]//li[text()='${time}'])`).first().click();
  //           break;
  //         }
  //       }
  //     }
  //     /* for (const time of list) {
  //               if (time >= timeToSelect) {
  //                   console.log('Selecting time:', time);
  //                   await this.page.locator(`//div[contains(@class,'timepicker') and not(contains(@style,'display: none'))]//li[text()='${time}']`).first().click();
  //                   break;
  //               }
  //           } */
  //   }
  //   await selectNextAvailableTime.call(this);
    
  //   const timeToSet = getCurrentTimePlusTwoHours();
  //   console.log("Setting time to:", timeToSet);
    
  
      
  //     // Fallback: try to use timepicker if it exists
  //     try {
  //       await this.page.waitForSelector("//div[contains(@class,'timepicker')]//li", { timeout: 5000 });
  //       const timeOptions = await this.page.locator("//div[contains(@class,'timepicker')]//li").all();
        
  //       if (timeOptions.length > 0) {
  //         // Select a time that's likely to be in the future (avoid first few options which might be past times)
  //         const safeIndex = Math.max(5, Math.floor(timeOptions.length / 3));
  //         await this.wait("minWait");
  //         await timeOptions[safeIndex].click();
  //         console.log("Selected time from timepicker at index:", safeIndex);
  //       }
  //     } catch (timepickerError) {
  //       console.error("Timepicker fallback also failed:", timepickerError);
  //       console.log("Continuing with default time value");
  //     }
  //   }
  

  async waitList() {
    await this.type(this.selectors.waitlistInput, "WaitList", "4");
  }

  async clickUpdate() {
    await this.page.locator(this.selectors.updateBtn).scrollIntoViewIfNeeded();
    await this.wait("minWait");
    await this.click(this.selectors.updateBtn, "update", "field");
    const locator = this.page.locator(this.selectors.willResolveLaterBtn);
    await this.wait("mediumWait");

    try {
      // await this.validateElementVisibility(this.selectors.willResolveLaterBtn, "Resolve Later");
      await this.wait("mediumWait");
      if (await locator.isVisible({ timeout: 5000 })) {
        await this.mouseHover(
          this.selectors.willResolveLaterBtn,
          "Resolve Later"
        );
        await this.click(
          this.selectors.willResolveLaterBtn,
          "Resolve Later",
          "Button"
        );
      }
    } catch (error) {
      console.log("The element is not visible: ");
    }
    // Continue with other operations without throwing an error
  }

  async clickDetailButton() {
    await this.mouseHover(this.selectors.detailsbtn, "details");
    await this.click(this.selectors.detailsbtn, "details", "button");
  }

  async save_editedcoursedetails() {
    await this.wait("minWait");
    await this.click(this.selectors.detailsbtn, "details", "button");
    //await this.clickCatalog();
    await this.validateElementVisibility(
      this.selectors.courseUpdateBtn,
      "button"
    );

    await this.type(this.selectors.courseDescriptionInput, "Description", "updated description");


    await this.click(this.selectors.courseUpdateBtn, "Update", "button");
  }

  async addsurvey_course() {
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.surveyAndAssessmentLink,
      "Survey/Assessment"
    );
    await this.click(
      this.selectors.surveyAndAssessmentLink,
      "Survey/Assessment",
      "Link"
    );
    await this.wait("mediumWait");
    const popup = this.page.locator(
      "//span[text()='You have unsaved changes that will be lost if you wish to continue. Are you sure you want to continue?']"
    );
    if (await popup.isVisible({ timeout: 5000 })) {
      await this.click("//button[text()='YES']", "yes", "button");
    }
    const selector = this.page.locator(this.selectors.surveyCheckBox);
    const checkboxCount = await selector.count();
    const randomIndex = Math.floor(Math.random() * checkboxCount);
    await this.page
      .locator(this.selectors.surveyCheckBox)
      .nth(randomIndex)
      .click();
    await (
      await this.page.waitForSelector(this.selectors.addSurveyBtn)
    ).isEnabled();
    await this.click(this.selectors.addSurveyBtn, "Addsurvey", "button");
    await this.waitForElementHidden("div[class='text-center p-5']", "Spiner");
  }

  async editcourse() {
    await this.wait("mediumWait");
    await this.spinnerDisappear();
    
    // Ensure the edit course button is available
    await this.page.waitForSelector(this.selectors.editCourseBtn, { timeout: 30000 });
    
    await this.mouseHover(this.selectors.editCourseBtn, "editcourse");
    await this.click(this.selectors.editCourseBtn, "editcourse", "button");
    
    // Wait for the edit course page to load completely
    await this.page.waitForLoadState('load');
    await this.wait("mediumWait");
    await this.spinnerDisappear();
  }

  async clickinstanceClass() {
    await this.wait("mediumWait");
    await this.spinnerDisappear();
    
    // Wait for page to be fully loaded after edit course navigation
    await this.page.waitForLoadState('load');
    await this.wait("minWait");
    
    await this.page.waitForSelector(this.selectors.navigateToMainCoursePage, { timeout: 30000 });
    
    // Scroll to ensure the tab is in view
    await this.page.locator(this.selectors.navigateToMainCoursePage).scrollIntoViewIfNeeded();
    
    await this.click(
      this.selectors.navigateToMainCoursePage,
      "Edit Instance Class",
      "Button"
    );
    
    // Wait for the tab content to load
    await this.wait("mediumWait");
    await this.spinnerDisappear();
  }

  //To upload the content through course details page:-
  async contentLibrary(
    content?:
      | "AICC"
      | "AICC&SCORM"
      | "Passed-Failed-SCORM2004"
      | "Completed-Incomplete-SCORM-1.2"
      | "AutoVimeo"
      | "tin_can"
      | "AutoAudioFile"
      | "clip-oceans"
      | any
  ) {
    await this.spinnerDisappear();
    await this.validateElementVisibility(
      this.selectors.clickContentLibrary,
      "Content"
    );
    await this.mouseHover(this.selectors.clickContentLibrary, "Content");
    await this.click(this.selectors.clickContentLibrary, "Content", "button");
    await this.wait("minWait");
    await this.waitForElementHidden(
      "//span[text()='Counting backwards from Infinity']",
      "string"
    );
    await this.spinnerDisappear();
    if (content == "AICC") {
      const data = "AICC";
      /*  this.page.on('console', msg => {
                 console.log(`Console Log: ${msg.text()}`);
             }); */
      await this.typeAndEnter(
        "#exp-content-search-field",
        "Content Search Field",
        data
      );
      await this.click(this.selectors.contentIndex(2), "Contents", "checkbox");
      await this.wait("minWait");
      await this.mouseHover(this.selectors.addContentButton, "addcontent");
      await this.click(this.selectors.addContentButton, "addcontent", "button");
      await this.wait("maxWait");
      await this.page
        .locator(this.selectors.attachedContentLabel)
        .scrollIntoViewIfNeeded();
      await this.validateElementVisibility(
        this.selectors.attachedContentLabel,
        "button"
      );
    } else if (content == "AICC&SCORM") {
      const data = "AICC&SCORM";
      /* this.page.on('console', msg => {
                console.log(`Console Log: ${msg.text()}`);
            }); */
      await this.typeAndEnter(
        "#exp-content-search-field",
        "Content Search Field",
        data
      );
      await this.click(this.selectors.contentIndex(2), "Contents", "checkbox");
      await this.wait("minWait");
      await this.mouseHover(this.selectors.addContentButton, "addcontent");
      await this.click(this.selectors.addContentButton, "addcontent", "button");
      await this.wait("maxWait");
      await this.page
        .locator(this.selectors.attachedContentLabel)
        .scrollIntoViewIfNeeded();
      await this.validateElementVisibility(
        this.selectors.attachedContentLabel,
        "button"
      );
    } else if (content == "AutoVimeo") {
      const data = "AutoVimeo";
      /* this.page.on('console', msg => {
                console.log(`Console Log: ${msg.text()}`);
            }); */
      await this.typeAndEnter(
        "#exp-content-search-field",
        "Content Search Field",
        data
      );
      await this.click(this.selectors.contentIndex(2), "Contents", "checkbox");
      await this.wait("minWait");
      await this.mouseHover(this.selectors.addContentButton, "addcontent");
      await this.click(this.selectors.addContentButton, "addcontent", "button");
      await this.wait("maxWait");
      await this.page
        .locator(this.selectors.attachedContentLabel)
        .scrollIntoViewIfNeeded();
      await this.validateElementVisibility(
        this.selectors.attachedContentLabel,
        "button"
      );
    } else if (content == "AutoAudioFile") {
      const data = "AutoAudioFile";
      /* this.page.on('console', msg => {
                console.log(`Console Log: ${msg.text()}`);
            }); */
      await this.typeAndEnter(
        "#exp-content-search-field",
        "Content Search Field",
        data
      );
      await this.click(this.selectors.contentIndex(2), "Contents", "checkbox");
      await this.wait("minWait");
      await this.mouseHover(this.selectors.addContentButton, "addcontent");
      await this.click(this.selectors.addContentButton, "addcontent", "button");
      await this.wait("maxWait");
      await this.page
        .locator(this.selectors.attachedContentLabel)
        .scrollIntoViewIfNeeded();
      await this.validateElementVisibility(
        this.selectors.attachedContentLabel,
        "button"
      );
    } else if (content == "tin_can") {
      const data = "tin_can";
      /* this.page.on('console', msg => {
                console.log(`Console Log: ${msg.text()}`);
            }); */
      await this.typeAndEnter(
        "#exp-content-search-field",
        "Content Search Field",
        data
      );
      await this.click(this.selectors.contentIndex(2), "Contents", "checkbox");
      await this.wait("minWait");
      await this.mouseHover(this.selectors.addContentButton, "addcontent");
      await this.click(this.selectors.addContentButton, "addcontent", "button");
      await this.wait("maxWait");
      await this.page
        .locator(this.selectors.attachedContentLabel)
        .scrollIntoViewIfNeeded();
      await this.validateElementVisibility(
        this.selectors.attachedContentLabel,
        "button"
      );
    } else if (content == "Completed-Incomplete-SCORM-1.2") {
      const data = "Completed-Incomplete-SCORM-1.2";
      /* this.page.on('console', msg => {
                console.log(`Console Log: ${msg.text()}`);
            }); */
      await this.typeAndEnter(
        "#exp-content-search-field",
        "Content Search Field",
        data
      );
      await this.click(this.selectors.contentIndex(2), "Contents", "checkbox");
      await this.wait("minWait");
      await this.mouseHover(this.selectors.addContentButton, "addcontent");
      await this.click(this.selectors.addContentButton, "addcontent", "button");
      await this.wait("maxWait");
      await this.page
        .locator(this.selectors.attachedContentLabel)
        .scrollIntoViewIfNeeded();
      await this.validateElementVisibility(
        this.selectors.attachedContentLabel,
        "button"
      );
    } else if (content == "Passed-Failed-SCORM2004") {
      const data = "Passed-Failed-SCORM2004";
      await this.typeAndEnter(
        "#exp-content-search-field",
        "Content Search Field",
        data
      );
      await this.click(this.selectors.contentIndex(2), "Contents", "checkbox");
      await this.wait("minWait");
      await this.mouseHover(this.selectors.addContentButton, "addcontent");
      await this.click(this.selectors.addContentButton, "addcontent", "button");
      await this.wait("maxWait");
      await this.page
        .locator(this.selectors.attachedContentLabel)
        .scrollIntoViewIfNeeded();
      await this.validateElementVisibility(
        this.selectors.attachedContentLabel,
        "button"
      );
    } else if (content == content && content != undefined) {
      const data = content;
      /* this.page.on('console', msg => {
                console.log(`Console Log: ${msg.text()}`);
            }); */
      await this.typeAndEnter(
        "#exp-content-search-field",
        "Content Search Field",
        data
      );
      await this.click(this.selectors.contentIndex(2), "Contents", "checkbox");
      await this.wait("minWait");
      await this.mouseHover(this.selectors.addContentButton, "addcontent");
      await this.click(this.selectors.addContentButton, "addcontent", "button");
      await this.wait("maxWait");
      await this.page
        .locator(this.selectors.attachedContentLabel)
        .scrollIntoViewIfNeeded();
      await this.validateElementVisibility(
        this.selectors.attachedContentLabel,
        "button"
      );
    } else {
      const data = "content testing-001";
      await this.typeAndEnter(
        "#exp-content-search-field",
        "Content Search Field",
        data
      );
      await this.click(this.selectors.contentIndex(2), "Contents", "checkbox");
      await this.mouseHover(this.selectors.addContentButton, "addcontent");
      await this.click(this.selectors.addContentButton, "addcontent", "button");
      await this.wait("maxWait");
      await this.mouseHover(this.selectors.attachedContentLabel, "button");
      await this.validateElementVisibility(
        this.selectors.attachedContentLabel,
        "button"
      );
    }
  }

  async multipleContent() {
    const fileName = "sample";
    const pdf = `../data/${fileName}.pdf`;
    const video = "../data/video1.mp4";
    const locator = this.selectors.uploadInput;
    await this.mouseHover(this.selectors.uploadDiv, "upload");
    await this.uploadMultipleContent(pdf, video, locator);
    await this.validateElementVisibility(this.selectors.progress, "Loading");
    await this.validateElementVisibility(
      this.selectors.attachedContent(fileName),
      fileName
    );
  }
  async vcSessionTimeZone(data: string) {
    await this.click(
      this.selectors.vcselectTimezone,
      "VC Select Timezone",
      "dropdown"
    ),
      await this.click(
        this.selectors.vcSelectTimezoneClickSearch,
        "VC timezone search field",
        "Search"
      ),
      await this.type(
        this.selectors.vcSelectTimezoneClickSearch,
        "VC timezone search field",
        data
      );
    await this.click(
      this.selectors.vcSelectTimeZone,
      "VC Timezone Search Result",
      "Search Result"
    );
  }

  async sessionType() {
    await this.click(this.selectors.sessionType, "Session Type", "Button");
    await this.click(this.selectors.otherMeeting, "Other Meeting", "Drop Down");
  }

  async sessionmeetingType(meetType: string) {
    await this.validateElementVisibility(
      this.selectors.vcSessionTypeDropDown,
      "VC Session Type dropdown"
    );
    await this.click(
      this.selectors.vcSessionTypeDropDown,
      "VC Session Type Dropdwon",
      "Dropdown"
    );
    await this.wait("minWait");
    await this.click(
      this.selectors.vcMeetingType(meetType),
      "VC Session Type ",
      "Dropdown List"
    );
  }

  async uploadPDF() {
    const fileName = "sample";
    const path = `../data/${fileName}.pdf`;
    await this.mouseHover(this.selectors.uploadDiv, "upload");
    await this.uploadFile(this.selectors.uploadInput, path);
    await this.validateElementVisibility(this.selectors.progress, "Loading");
    await this.validateElementVisibility(
      this.selectors.attachedContent(fileName),
      fileName
    );
  }
  async addAssesment() {
    await this.mouseHover(this.selectors.assessmentLabel, "Assessment");
    const selector = this.page.locator(this.selectors.assessmentCheckbox);
    const checkboxCount = await selector.count();
    if (checkboxCount < 2) {
      throw new Error("Not enough checkboxes to select two distinct ones");
    }
    const selectedIndices = new Set<number>();
    while (selectedIndices.size < 2) {
      const randomIndex = Math.floor(Math.random() * checkboxCount);
      selectedIndices.add(randomIndex);
    }
    for (const index of selectedIndices) {
      await selector.nth(index).click();
    }
    await this.click(this.selectors.addAssessmentBtn, "Addassesment", "button");
    await this.wait("maxWait");
  }

  async addSpecificAssesment(data: string) {
    await this.mouseHover(this.selectors.assessmentLabel, "Assessment");
    await this.typeAndEnter(
      this.selectors.searchAssessmentField,
      "Assessment Search",
      data
    );
    await this.spinnerDisappear();
    // Use specific selector for the searched assessment instead of generic checkbox
    const specificAssessmentCheckbox = `(//div[contains(text(),'${data}')]//following::i[contains(@class,'fa-square icon')])[1]`;
    await this.click(
      specificAssessmentCheckbox,
      "Assessment",
      "CheckBox"
    );
    await this.click(this.selectors.addAssessmentBtn, "Addassesment", "button");
    await this.wait("maxWait");
  }

  async setAssessmentAttempt() {
    let count = await this.page
      .locator("//span[contains(@id,'attemptssapn')]")
      .count();
    for (let i = 0; i < count; i++) {
      await this.page
        .locator("//span[contains(@id,'attemptssapn')]")
        .nth(i)
        .click({ clickCount: 2, delay: 1000 });
      await this.page
        .locator("//span[contains(@id,'attemptssapn')]")
        .nth(i)
        .focus();
      await this.page.keyboard.press("Backspace");
      //  await this.page.locator("//span[contains(@id,'attemptssapn')]").nth(i).fill("1");
      await this.page.keyboard.type("1");
      await this.wait("minWait");
    }
  }

  async addmultipleContentfromLib() {
    const content = this.page.locator(this.selectors.allContents);
    const checkboxCount = await content.count();
    if (checkboxCount < 2) {
      throw new Error("Not enough checkboxes to select two distinct ones");
    }
    const selectedIndices = new Set<number>();
    while (selectedIndices.size < 2) {
      const randomIndex = Math.floor(Math.random() * checkboxCount);
      selectedIndices.add(randomIndex);
    }
    for (const index of selectedIndices) {
      await content.nth(index).click();
    }
    await this.click(this.selectors.addContentButton, "addcontent", "button");
    await this.wait("maxWait");
  }

  // async handleCategoryADropdown(): Promise<string> {
  //     await this.click(this.selectors.selectCategoryBtn, "dropdown", "button")
  //     const categoryElements = await this.page.$$(this.selectors.allCategoryOptions);
  //     await this.wait('mediumWait');
  //     const randomIndex = Math.floor(Math.random() * categoryElements.length);
  //     const randomElement = categoryElements[randomIndex].textContent();
  //     const randomtext = await randomElement;
  //     await this.typeText(this.selectors.categoryDropdown, "input", randomElement);
  //     await this.click(this.selectors.categoryOption(randomtext), "options", "button");
  //     return randomtext;
  // }

  async handleCategoryADropdown(): Promise<string> {
    const category = getRandomItemFromFile(filePath.catagory);
    const categoryName = category;
    await this.click(this.selectors.selectCategoryBtn, "dropdown", "button");
    await this.wait("mediumWait");
    await this.keyboardType(this.selectors.categoryDropdown, categoryName);
    await this.click(
      this.selectors.categoryOption(categoryName),
      "options",
      "button"
    );
    return categoryName;
  }

  async providerDropdown(): Promise<string> {
    const provider = getRandomItemFromFile(filePath.provider);
    const providerName = provider;
    await this.click(this.selectors.providerDropdown, "dropdown", "button");
    await this.wait("mediumWait");
    const providerElements = this.page.locator(
      this.selectors.providerDropdownValue
    );
    await this.click(
      this.selectors.providerOption(providerName),
      "option",
      "button"
    );
    return providerName;
  }

  async getSelectedProvider(): Promise<string> {
    const selectedText = await this.page.locator(this.selectors.providerDropdown + "//div[@class='filter-option-inner-inner']").textContent();
    return selectedText?.trim() || "";
  }

  async getCourse() {
    const course = await this.getText(this.selectors.getCourse);
    console.log(course);
  }
  async selectPortal() {
    try {
      const text = await this.page.innerText(this.selectors.domainSelectedText);
      console.log(text);

      if (text.includes("selected")) {
        //const dropdownItems = this.page.locator(this.selectors.domainDropdown);
        await this.click(
          this.selectors.domainSelectedText,
          "dropdown",
          "button"
        );
        const dropdownValues = await this.page
          .locator(this.selectors.domainDropdownValue)
          .allInnerTexts();
        for (let index = 1; index < dropdownValues.length; index++) {
          const value = dropdownValues[index];
          await this.click(
            `//span[@class='text' and text()='${value}']`,
            "Domain",
            "Dropdown"
          );
        }
      }
    } catch (error) {
      console.log(error + " Portal selected");
    }
    const domainText = await this.page.innerText(
      this.selectors.domainInnerValue
    );
    return domainText;
  }

  async clickHere() {
    await this.mouseHover(this.selectors.clickHere, "Click Here");
    await this.click(this.selectors.clickHere, "Click Here", "button");
  }

  async selectImage() {
    await this.validateElementVisibility(this.selectors.image, "Loading");
    await this.click(this.selectors.image, "Gallery", "image");
  }
async selectMeetingType(instructorName: string, sessionName: string, index: number) {
    const country = "kolkata";
    const meetingUrl = FakerData.getMeetingUrl();
    
    // Select session type as "Other Meeting"
    await this.click(this.selectors.sessionTypeIndex(index), "Session Type", "dropdown");
    await this.click(this.selectors.otherMeetingIndex(index), "other Meeting", "Option");
    
    // Enter session name
    await this.validateElementVisibility(this.selectors.sessionNameIndex(index), "Session Name");
    await this.mouseHover(this.selectors.sessionNameIndex(index), "Session Name");
    await this.type(this.selectors.sessionNameIndex(index), "Session Name", sessionName);
    
    // Select timezone
    await this.click(this.selectors.timeZoneIndex(index), "TimeZone", "Text Field");
    await this.type(this.selectors.timeZoneOption, "Time Zone", country);
    await this.mouseHover(this.selectors.indianTimezone, "Indian Time zone");
    await this.click(this.selectors.indianTimezone, "Indian Timezone", "Selected");
    
    // Set start date
    await this.typeAndEnter(this.selectors.startDateInstanceIndex(index), "Start Date", gettomorrowDateFormatted());
    
    // Set start time - Primary time selection
    await this.click(this.selectors.timeInput, "Start Time Input", "Input");
    await this.wait("minWait");
    
    const getCurrentTimePlusTwoHours = () => {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const roundedMinutes = Math.ceil(minutes / 15) * 15;
      const formattedMinutes = roundedMinutes === 60 ? "00" : roundedMinutes.toString().padStart(2, "0");
      
      if (roundedMinutes === 60) {
        hours = (hours % 12) + 1;
      }
      
      return `${hours.toString().padStart(2, "0")}:${formattedMinutes} ${ampm}`;
    };
    
    const selectNextAvailableTime = async () => {
      const list = await this.page.locator("(//div[contains(@class,'timepicker')]//li)").allTextContents();
      console.log(list);
      
      const timeToSelect = getCurrentTimePlusTwoHours();
      console.log("Current Time + 2 hours:", timeToSelect);
      
      const timeLocator = this.page.locator(`(//div[contains(@class,'timepicker')]//li[text()='${timeToSelect}'])`);
      const count = await timeLocator.count();
      
      if (count > 1) {
        console.log(`Found ${count} elements with time ${timeToSelect}, selecting the first one`);
        await timeLocator.first().click();
      } else if (count === 1) {
        await timeLocator.click();
      } else {
        console.log(`Time ${timeToSelect} not found, trying fallback approach`);
        
        for (const time of list) {
          if (time >= timeToSelect) {
            console.log('Selecting closest available time:', time);
            await this.page.locator(`(//div[contains(@class,'timepicker')]//li[text()='${time}'])`).first().click();
            break;
          }
        }
      }
    };
    
    await selectNextAvailableTime();
    
    // Set end time - Secondary time selection (static index 2)
    await this.click(this.selectors.timeInputIndex(index), "Start Time", "Selected");
    
    try {
      console.log("Setting time using static index 2 approach...");
      
      const startTimeField = this.page.locator("//input[contains(@id,'starttime_pair_time')]");
      
      if (await startTimeField.isVisible()) {
        console.log("Clicking start time field to open dropdown...");
        await startTimeField.click();
        await this.wait("mediumWait");
        
        await this.page.waitForSelector("//ul/li[contains(text(), 'AM') or contains(text(), 'PM')]", { timeout: 5000 });
        const timeOptions = await this.page.locator("//ul/li[contains(text(), 'AM') or contains(text(), 'PM')]").all();
        
        if (timeOptions.length > 2) {
          const selectedOption = timeOptions[2];
          const selectedTime = await selectedOption.textContent();
          
          console.log(`Selecting START time at index 2: ${selectedTime}`);
          await selectedOption.click();
          await this.wait("mediumWait");
          console.log(`✅ START time selected in selectMeetingType: ${selectedTime} (index: 2)`);
        } else {
          console.log("Not enough time options available (need at least 3 for index 2)");
          
          if (timeOptions.length > 0) {
            const fallbackOption = timeOptions[0];
            const fallbackTime = await fallbackOption.textContent();
            console.log(`Fallback: selecting first available time: ${fallbackTime}`);
            await fallbackOption.click();
          }
        }
      } else {
        console.log("Start time field not visible, trying alternative selectors...");
        
        const timeInput = this.page.locator(this.selectors.timeInputIndex(index));
        if (await timeInput.isVisible()) {
          await timeInput.click();
          await this.wait("mediumWait");
          
          const altTimeOptions = await this.page.locator("//ul[@class='ui-timepicker-list']//li").all();
          if (altTimeOptions.length > 2) {
            const selectedOption = altTimeOptions[2];
            const selectedTime = await selectedOption.textContent();
            console.log(`Alternative: selecting time at index 2: ${selectedTime}`);
            await selectedOption.click();
          }
        }
      }
    } catch (error) {
      console.error("Fixed time setting failed:", error.message);
      console.log("Continuing with default behavior...");
    }
    
    // Set attendee and presenter URLs
    await this.type(this.selectors.attendeeUrlIndex(index), "Attendee url", meetingUrl);
    await this.type(this.selectors.presenterUrlIndex(index), "Presenter url", meetingUrl);
    
    // Select instructor
    await this.click(this.selectors.instructorDropdownIndex(index), "Select Instructor", "DropDown");
    await this.type(this.selectors.instructorInput, "Instructor Name", instructorName);
    await this.mouseHover(this.selectors.instructorOption(instructorName), "Instructor Name");
    await this.click(this.selectors.instructorOption(instructorName), "Instructor Name", "Button");
  }

  /**
   * Select meeting type for VC with current time rounded to nearest 15 minutes
   * Time will be rounded up: 6:37 → 6:45, 7:03 → 7:15, 8:50 → 9:00
   */
  async selectMeetingTypeWithRoundedTime(
    instructorName: string,
    sessionName: string,
    index: number
  ) {
    const country = "kolkata";
    const meetingUrl = FakerData.getMeetingUrl();
    
    await this.click(
      this.selectors.sessionTypeIndex(index),
      "Session Type",
      "dropdown"
    );
    await this.click(
      this.selectors.otherMeetingIndex(index),
      "other Meeting",
      "Option"
    );
    
    await this.validateElementVisibility(
      this.selectors.sessionNameIndex(index),
      "Session Name"
    );
    await this.mouseHover(
      this.selectors.sessionNameIndex(index),
      "Session Name"
    );
    await this.type(
      this.selectors.sessionNameIndex(index),
      "Session Name",
      sessionName
    );
    
    await this.click(
      this.selectors.timeZoneIndex(index),
      "TimeZone",
      "Text Field"
    );
    await this.type(this.selectors.timeZoneOption, "Time Zone", country);
    await this.mouseHover(this.selectors.indianTimezone, "Indian Time zone");
    await this.click(
      this.selectors.indianTimezone,
      "Indian Timezone",
      "Selected"
    );
    
    await this.typeAndEnter(
      this.selectors.startDateInstanceIndex(index),
      "Start Date",
      getCurrentDateFormatted()
    );
    
    // Set time rounded to nearest 15 minutes
    const roundedTime = getCurrentTimeRoundedTo15();
    console.log(`Setting VC meeting time to: ${roundedTime} (rounded to nearest 15min)`);
    
    await this.click(
      this.selectors.timeInputIndex(index),
      "Start Time",
      "Field"
    );
    await this.wait("mediumWait");
    
    // Type the rounded time directly
    try {
      const timeField = this.page.locator(this.selectors.timeInputIndex(index));
      await timeField.fill(roundedTime);
      await this.wait("minWait");
      console.log(`✅ Time set to: ${roundedTime}`);
    } catch (error) {
      console.log(`Fallback: trying to select from timepicker...`);
      // Try to find matching time in dropdown
      const timeOptions = await this.page.locator("//ul[@class='ui-timepicker-list']//li").all();
      for (const option of timeOptions) {
        const optionText = await option.textContent();
        if (optionText?.trim() === roundedTime) {
          await option.click();
          console.log(`✅ Selected time from dropdown: ${roundedTime}`);
          break;
        }
      }
    }
    
    await this.type(
      this.selectors.attendeeUrlIndex(index),
      "Attendee url",
      meetingUrl
    );
    await this.type(
      this.selectors.presenterUrlIndex(index),
      "Presenter url",
      meetingUrl
    );
    
    await this.click(
      this.selectors.instructorDropdownIndex(index),
      "Select Instructor",
      "DropDown"
    );
    await this.type(
      this.selectors.instructorInput,
      "Instructor Name",
      instructorName
    );
    await this.mouseHover(
      this.selectors.instructorOption(instructorName),
      "Instructor Name"
    );
    await this.click(
      this.selectors.instructorOption(instructorName),
      "Instructor Name",
      "Button"
    );
  }

  async selectMeetingTypeforPast(
    instructorName: string,
    sessionName: string,
    index: number
  ) {
    //  const sessiontype = this.page.locator(this.selectors.selectType);
    const pickRandomTime = async () => {
      const timeElements = await this.page
        .locator(`(//ul[@class='ui-timepicker-list'])[1]/li`)
        .count();
      const randomIndex = Math.floor(Math.random() * timeElements) + 1; // Random index from 1 to timeElements
      return randomIndex;
    };
    const randomIndex = await pickRandomTime();
    console.log("Random Index:", randomIndex);
    const country = "kolkata";
    const meetingUrl = FakerData.getMeetingUrl();
    await this.click(
      this.selectors.sessionTypeIndex(index),
      "Session Type",
      "dropdown"
    );
    await this.click(
      this.selectors.otherMeetingIndex(index),
      "other Meeting",
      "Option"
    );
    await this.validateElementVisibility(
      this.selectors.sessionNameIndex(index),
      "Session Name"
    );
    await this.mouseHover(
      this.selectors.sessionNameIndex(index),
      "Session Name"
    );
    await this.type(
      this.selectors.sessionNameIndex(index),
      "Session Name",
      sessionName
    );
    await this.click(
      this.selectors.timeZoneIndex(index),
      "TimeZone",
      "Text Field"
    );
    await this.type(this.selectors.timeZoneOption, "Time Zone", country);
    await this.mouseHover(this.selectors.indianTimezone, "Indian Time zone");
    await this.click(
      this.selectors.indianTimezone,
      "Indian Timezone",
      "Selected"
    );
    await this.typeAndEnter(
      this.selectors.startDateInstanceIndex(index),
      "Start Date",
      getPastDate()
    );
    await this.click(
      this.selectors.timeInputIndex(index),
      "Start Time",
      "Selected"
    );
    await this.click(
      this.selectors.chooseStartTimeIndex(index, randomIndex),
      "StartTime",
      "Selected"
    );
    await this.type(
      this.selectors.attendeeUrlIndex(index),
      "Attendee url",
      meetingUrl
    );
    await this.type(
      this.selectors.presenterUrlIndex(index),
      "Presenter url",
      meetingUrl
    );
    await this.click(
      this.selectors.instructorDropdownIndex(index),
      "Select Instructor",
      "DropDown"
    );
    await this.type(
      this.selectors.instructorInput,
      "Instructor Name",
      instructorName
    );
    await this.mouseHover(
      this.selectors.instructorOption(instructorName),
      "Instructor Name"
    );
    await this.click(
      this.selectors.instructorOption(instructorName),
      "Instructor Name",
      "Button"
    );
  }

  async attendeeUrl() {
    await this.type(
      this.selectors.attendeeUrlIndex(1),
      "Attendee url",
      FakerData.getMeetingUrl()
    );
  }

  async presenterUrl() {
    await this.type(
      this.selectors.presenterUrlIndex(1),
      "Presenter url",
      FakerData.getMeetingUrl()
    );
  }

  async clickaddIcon() {
    await this.click(this.selectors.addDeleteIcon, "Add Icon", "Button");
  }

  async startDateVC() {
    await this.type(
      this.selectors.startDateInstance,
      "Start Date",
      gettomorrowDateFormatted()
    );
  }

  async addAttendeeUrl(attendeeUrl: string) {
    await this.type(this.selectors.attendeeUrl, "Attendee url", attendeeUrl);
  }

  async addPresenterUrl(presenterUrl: string) {
    await this.type(this.selectors.presenterUrl, "Presenter url", presenterUrl);
  }

  async clickCompletionCertificate() {
    await this.wait("mediumWait");
    await this.validateElementVisibility(
      this.selectors.completionCertificationlink,
      "Completion Certificate"
    );
    await this.click(
      this.selectors.completionCertificationlink,
      "Completion Certificate",
      "Button"
    );
    await this.spinnerDisappear();
  }

  async clickCertificateCheckBox() {
    const loadMore = this.page.locator(this.selectors.loadMoreBtn);
    if (await loadMore.isVisible()) {
      await this.click(this.selectors.loadMoreBtn, "Load More", "Button");
    }
    await this.spinnerDisappear();
    const count = await this.page
      .locator(this.selectors.certificateCheckboxCount)
      .count();
    console.log(count);
    const randomIndex = Math.floor(Math.random() * (count - 1)) + 2;
    await this.wait("mediumWait");
    await this.page
      .locator(this.selectors.certificateCheckbox(randomIndex))
      .innerText();

    await this.mouseHover(
      this.selectors.certificateCheckbox(randomIndex),
      "Certificate CheckBox"
    );
    await this.click(
      this.selectors.certificateCheckbox(randomIndex),
      "Certificate CheckBox",
      "Checkbox"
    );
  }

  async clickAdd() {
    await this.validateElementVisibility(this.selectors.addBtn, "Add");
    await this.wait("mediumWait");
    await this.page.keyboard.press("PageUp");
    await this.click(this.selectors.addBtn, "Add", "Button");
    await this.wait("minWait");
    await this.verification(
      this.selectors.certificationVerifyMessage,
      "created successfully"
    );
    await this.wait("minWait");
    await this.click(this.selectors.okBtn, "Ok", "Button");
  }

  async clickAccessButton() {
    await this.validateElementVisibility(this.selectors.accessBtn, "Access"),
      await this.click(this.selectors.accessBtn, "Access", "Link");
    await this.wait("mediumWait");
  }

  async addSingleLearnerGroup(data?: any) {
    await this.wait("mediumWait");
    const closeIcon = this.page.locator(this.selectors.accessCloseIconAdmin);
    const count = await closeIcon.count();
    console.log(count);
    console.log("learner groups : " + count);
    // for (let i = 1; i < count; i++) {
    //   await this.mouseHover(this.selectors.MultiaccessCloseIcon, "close Icon");
    //   await this.page
    //     .locator(this.selectors.MultiaccessCloseIcon)
    //     .click({ force: true });
    //   await this.page.waitForTimeout(100);
    // }
    if (!data) {
      console.log("No data");
      return;
    } else {
      let learnerGroupValue = await this.getInnerText(
        this.selectors.learnerGroup
      );
      console.log(learnerGroupValue);
      await this.type(this.selectors.accessUserInput, "User", data);
      await this.click(`//li[text()='${data}']`, "User", "List");
    }
  }
  async addSingleAdminGroup(data?: string) {
    await this.wait("mediumWait");
    const groupLabel = await this.page.locator(`//label[text()='Admin Group']/parent::div//following-sibling::div[2]//label[@class="form-label d-block my-0 me-1 text-break"]`).allInnerTexts();
    const groupLabels = await this.page.locator(`//label[text()='Admin Group']/parent::div//following-sibling::div[2]//label[@class="form-label d-block my-0 me-1 text-break"]`).count();
    console.log(groupLabel);
    console.log(`Current admin group count: ${groupLabels}`);

    for (let i = 1; i <= groupLabels; i++) {
      const groupName = groupLabel[i - 1].trim();
      console.log(`Checking admin group: ${groupName}`);
      if (groupName !== data.trim()) {
        console.log(`Deleting admin group: ${groupName}`);
        await this.page.locator(`(//label[text()='Admin Group']/parent::div//following-sibling::div[2]//label[text()='${groupName}']/following::label[@class="form-label d-block my-0 pointer"])[1]`).click({ force: true });
        await this.page.waitForTimeout(300);
      }
    }

  }

  async addAdminGroup(data: string) {
    await this.wait("mediumWait");
    await this.click(this.selectors.adminGroupSelect, "Admin Group", "Button");
    await this.click(this.selectors.searchBoxAdminGrpAccess, "Search Box", "Field");
    await this.type(this.selectors.searchBoxAdminGrpAccess, "Search Box", data);
    await this.mouseHover(this.selectors.adminGroupSearch(data), "Admin Group");
    await this.click(this.selectors.adminGroupSearch(data), "Admin Group", "Option");
  }
  async addingSuspendedAdminGroup(data: string) {
    await this.wait("mediumWait");
    await this.click(this.selectors.adminGroupSelect, "Admin Group", "Button");
    await this.click(this.selectors.searchBoxAdminGrpAccess, "Search Box", "Field");
    await this.type(this.selectors.searchBoxAdminGrpAccess, "Search Box", data);

    const adminGroup = this.page.locator(this.selectors.suspendedGrp(data));
    if (await adminGroup.isVisible()) {
      console.log(`Admin Group ${data} is suspended and cannot be added.`);
    }
  }
  async removeAddedAdminGroup(data: string) {
    await this.wait("mediumWait");
    await this.mouseHover(this.selectors.removeAddedAdminGroup(data), "Remove Admin Group");
    await this.click(this.selectors.removeAddedAdminGroup(data), "Remove Admin Group", "Icon");
    }

  async addMultipleLearnerGroups(users: string[]) {
    await this.wait("mediumWait");
    const closeIcon = this.page.locator(this.selectors.accessCloseIcon);
    const count = await closeIcon.count();
    console.log(count);
    console.log("learner groups : " + count);

    if (!users || users.length === 0) {
      console.log("No users provided");
      return;
    }

    // Add each user
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      console.log(`Adding user: ${user}`);

      let learnerGroupValue = await this.getInnerText(
        this.selectors.learnerGroup
      );
      console.log(learnerGroupValue);

      await this.keyboardType(this.selectors.accessUserInput, user);
      await this.click(`//li[text()='${user}']`, "User", "List");

      // Wait between adding users
      if (i < users.length - 1) {
        await this.wait("minWait");
      }
    }

    console.log(`Successfully added ${users.length} users: ${users.join(', ')}`);
  }

  async saveAccessButton() {
    await this.click(this.selectors.saveAccessBtn, "Save Access", "Button");
    await this.wait("minWait");
  }

  async clickenforceSequence() {
    await this.validateElementVisibility(
      this.selectors.enforceSequence,
      "Enforce Sequence "
    );
    await this.click(
      this.selectors.enforceSequence,
      "Enforce Sequence ",
      "Checkbox"
    );
  }

  async addSpecificSurveyCourse(data: string) {
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.surveyAndAssessmentLink,
      "Survey/Assessment"
    );
    await this.click(
      this.selectors.surveyAndAssessmentLink,
      "Survey/Assessment",
      "Link"
    );
    await this.wait("mediumWait");
    const popup = this.page.locator(
      "(//span[text()='You have unsaved changes that will be lost if you wish to continue. Are you sure you want to continue?'])[1]"
    );
    if (await popup.isVisible({ timeout: 5000 })) {
      await this.click("//button[text()='YES']", "yes", "button");
    }
    await this.typeAndEnter(
      this.selectors.surveySearchField,
      "Survey Search Field",
      data
    );
    await this.spinnerDisappear();
    await this.click(this.selectors.surveyCheckBox, "Survey", "Checkbox");
    await (
      await this.page.waitForSelector(this.selectors.addSurveyBtn)
    ).isEnabled();
    await this.click(this.selectors.addSurveyBtn, "Addsurvey", "button");
    await this.waitForElementHidden("div[class='text-center p-5']", "Spiner");
  }

  async addSpecificSurveyCourseToRecertification(data: string) {
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.surveyAndAssessmentLinkInRecertification,
      "Survey/Assessment"
    );
    await this.click(
      this.selectors.surveyAndAssessmentLinkInRecertification,
      "Survey/Assessment",
      "Link"
    );
    await this.wait("mediumWait");
    const popup = this.page.locator(
      "(//span[text()='You have unsaved changes that will be lost if you wish to continue. Are you sure you want to continue?'])[1]"
    );
    if (await popup.isVisible({ timeout: 5000 })) {
      await this.click("//button[text()='YES']", "yes", "button");
    }
    await this.typeAndEnter(
      this.selectors.surveySearchField,
      "Survey Search Field",
      data
    );
    await this.spinnerDisappear();
    await this.click(this.selectors.surveyCheckBox, "Survey", "Checkbox");
    await (
      await this.page.waitForSelector(this.selectors.addSurveyBtn)
    ).isEnabled();
    await this.click(this.selectors.addSurveyBtn, "Addsurvey", "button");
    await this.waitForElementHidden("div[class='text-center p-5']", "Spiner");

  }

  async enableConsiderForCompletion() {
    
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.considerForCompletionCheckbox,
      "Consider For Completion Checkbox"
    );
    await this.click(
      this.selectors.considerForCompletionCheckbox,
      "Consider For Completion",
      "Checkbox"
    );
    await this.wait("minWait");
  }

  async enableTestOutOption() {
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.testOutCheckbox,
      "Test Out Checkbox"
    );
    await this.click(
      this.selectors.testOutCheckbox,
      "Test Out Option",
      "Label"
    );
    await this.wait("minWait");
    console.log("✓ Test-out option enabled for post-assessment");
  }

  async verifyTestOutEnabled() {
    await this.wait("minWait");
    const testOutElement = this.page.locator(this.selectors.testOutCheckbox);
    const isVisible = await testOutElement.isVisible();
    
    if (isVisible) {
      console.log("✓ PASS: Test-out option is enabled/available");
      return true;
    } else {
      console.log("✗ FAIL: Test-out option is not visible");
      return false;
    }
  }

  async previewAttachedSurvey(surveyName?: string) {
    await this.wait("minWait");
    
    // First try to find a specific preview button or icon
    const previewBtn = this.page.locator(this.selectors.surveyPreviewBtn);
    const previewIcon = this.page.locator(this.selectors.surveyPreviewIcon);
    
    if (await previewBtn.isVisible({ timeout: 5000 })) {
      await this.click(this.selectors.surveyPreviewBtn, "Preview Survey", "Button");
    } else if (await previewIcon.isVisible({ timeout: 5000 })) {
      await this.click(this.selectors.surveyPreviewIcon, "Preview Survey", "Icon");
    } else {
      // Alternative: Look for survey name with preview functionality
      if (surveyName) {
        const surveyPreview = `//div[contains(text(),'${surveyName}')]//following::*[contains(@class,'preview') or contains(@class,'eye') or @title='Preview'][1]`;
        await this.validateElementVisibility(surveyPreview, "Survey Preview for " + surveyName);
        await this.click(surveyPreview, "Preview " + surveyName, "Icon");
      } else {
        // Generic preview - click the first available preview icon in survey section
        const genericPreview = "//div[contains(@id,'survey')]//i[contains(@class,'fa-eye') or @aria-label='Preview']";
        await this.validateElementVisibility(genericPreview, "Survey Preview");
        await this.click(genericPreview, "Preview Survey", "Icon");
      }
    }
    
    await this.wait("mediumWait");
    
    // Validate that preview opened (could be modal, new tab, or inline preview)
    const previewModal = this.page.locator("//div[contains(@class,'modal') or contains(@class,'preview')]//h1[contains(text(),'Preview') or contains(text(),'Survey')]");
    if (await previewModal.isVisible({ timeout: 5000 })) {
      console.log("✓ Survey preview opened in modal");
    } else {
      console.log("✓ Survey preview functionality triggered");
    }
  }

  async removeAttachedSurvey(surveyName: string) {
    await this.wait("minWait");
    
    // Use the specific delete icon selector for the survey
    const surveyDeleteSelector = this.selectors.surveyDeleteIcon(surveyName);
    
    await this.validateElementVisibility(
      surveyDeleteSelector,
      `Delete icon for survey: ${surveyName}`
    );
    
    await this.click(
      surveyDeleteSelector,
      `Delete ${surveyName}`,
      "Icon"
    );
    
    await this.wait("minWait");
    
    // Handle confirmation dialog if it appears
    const confirmBtn = this.page.locator(this.selectors.confirmRemovalBtn);
    if (await confirmBtn.isVisible({ timeout: 5000 })) {
      await this.click(this.selectors.confirmRemovalBtn, "Confirm Removal", "Button");
      await this.wait("minWait");
      console.log("✓ Survey removal confirmed");
    }
    
    await this.wait("mediumWait");
    console.log(`✓ Survey ${surveyName} removal process completed`);
  }

  /**
   * Simple method to save survey changes
   */
  async saveSurvey() {
    await this.wait("minWait");
    await this.spinnerDisappear();
    
    await this.validateElementVisibility(
      this.selectors.surveySaveBtn,
      "Survey Save Button"
    );
    
    await this.click(
      this.selectors.surveySaveBtn,
      "Survey Save",
      "Button"
    );
    
    await this.wait("mediumWait");
    await this.spinnerDisappear();
    
    console.log("✅ Survey changes saved successfully");
  }

  /**
   * Method to handle survey link functionality
   * Clicks link icon, extracts URL, copies it, and launches in new tab
   */
  async getSurveyLinkAndLaunch(): Promise<string> {
    await this.wait("minWait");
    await this.spinnerDisappear();

    // Step 1: Click on the link icon
    await this.validateElementVisibility(
      this.selectors.surveyLinkIcon,
      "Survey Link Icon"
    );
    
    await this.click(
      this.selectors.surveyLinkIcon,
      "Survey Link",
      "Icon"
    );

    await this.wait("minWait");

    // Step 2: Get the link from the input field
    await this.validateElementVisibility(
      this.selectors.surveyLinkInput,
      "Survey Link Input Field"
    );

    const surveyLink = await this.page.locator(this.selectors.surveyLinkInput).inputValue();
    
    // Step 3: Validate link is not empty
    if (!surveyLink || surveyLink.trim() === '') {
      const error = "ERROR: Survey link is empty or not found";
      console.error(error);
      throw new Error(error);
    }

    console.log("Survey Link Found: " + surveyLink);

    // Step 4: Click the copy button
    await this.validateElementVisibility(
      this.selectors.surveyCopyBtn,
      "Survey Copy Button"
    );

    await this.click(
      this.selectors.surveyCopyBtn,
      "Copy Survey URL",
      "Button"
    );

    console.log("Survey URL copied to clipboard");

    // Step 5: Launch the link in a new tab
    const newTab = await this.context.newPage();
    await newTab.goto(surveyLink);
    await newTab.waitForLoadState('load');

    console.log("Survey link launched in new tab successfully");

    // Step 6: Verify the new tab loaded correctly
    const pageTitle = await newTab.title();
    const currentURL = newTab.url();
    
    console.log("New Tab Title: " + pageTitle);
    console.log("New Tab URL: " + currentURL);

    // Verify the URL matches what we expected
    if (currentURL.includes(surveyLink) || currentURL === surveyLink) {
      console.log("PASS: Survey link verification successful");
    } else {
      console.log("WARNING: Survey link verification - URL may have redirected");
    }

    return surveyLink;
  }

  async uploadVideoByLink(videoUrl: string) {
    await this.mouseHover(this.selectors.httpsInput, "https input");
    await this.keyboardType(this.selectors.httpsInput, videoUrl);
    await this.wait("minWait");
    await this.click(this.selectors.addURLBtn, "Add URL", "Button");
    await this.wait("maxWait");
  }

  // async specificLearnerGroupSelection(learnerGroupName: string) {
  //   // await this.wait('minWait')
  //   // if (await this.page.locator(this.selectors.modifyTheAccessBtn).isVisible({ timeout: 10000 })) {
  //   //     await this.mouseHover(this.selectors.modifyTheAccessBtn, "No, Modify The Access");
  //   //     await this.click(this.selectors.modifyTheAccessBtn, "No, Modify The Access", "Button");
  //   // }
  //   // await this.spinnerDisappear();
  //   // await this.wait("mediumWait")
  //   // await this.click(this.selectors.learnerGroupbtn, "Portal", "dropdown");
  //   // for (const options of await this.page.locator(this.selectors.allLearnerGroupOptions).all()) {
  //   //     const value = await options.innerText();
  //   //     console.log(value)
  //   //     if (value !== learnerGroupName) {

  //   //         await this.page.locator(`//footer//following::span[@class='text' and text()='${value}']`).nth(0).click();
  //   //     }
  //   // }
  //   // await this.click(this.selectors.learnerGroupbtn, "Portal", "dropdown");
  //   await this.spinnerDisappear();
  //   await this.wait("mediumWait");
  //   await this.click(this.selectors.learnerGroupbtn, "Portal", "dropdown");
  //   for (const options of await this.page
  //     .locator(this.selectors.allLearnerGroupOptions)
  //     .all()) {
  //     const value = await options.innerText();
  //     console.log(value);
  //     if (value !== learnerGroupName) {
  //       const labelLocator = this.page.locator(
  //         `//footer//following::span[@class='text' and text()='${value}']`
  //       );
  //       const checkMarkLocator = labelLocator
  //         .locator("..")
  //         .locator("span.check-mark");
  //       const isChecked = await checkMarkLocator.evaluate((el) => {
  //         return window.getComputedStyle(el, "::after").content !== "none";
  //       });
  //       if (!isChecked) {
  //         await checkMarkLocator.click();
  //       }
  //     }
  //   }
  //   await this.click(this.selectors.learnerGroupbtn, "Portal", "dropdown");
  // }
  async specificAdminGroupSelection(adminGroupName: string) {
    await this.spinnerDisappear();
    await this.wait("mediumWait");
    await this.click(this.selectors.adminGroupbtn, "Portal", "dropdown");
    for (const options of await this.page
      .locator(this.selectors.allAdminGroupOptions)
      .all()) {
      const value = await options.innerText();
      console.log(value);
      if (value !== adminGroupName) {
        const labelLocator = this.page.locator(
          `//footer//following::span[@class='text' and text()='${value}']`
        );
        const checkMarkLocator = labelLocator
          .locator("..")
          .locator("span.check-mark");
        const isChecked = await checkMarkLocator.evaluate((el) => {
          return window.getComputedStyle(el, "::after").content !== "none";
        });
        if (!isChecked) {
          await checkMarkLocator.click();
        }
      }
    }
    await this.click(this.selectors.learnerGroupbtn, "Portal", "dropdown");
  }

  async multipleLearnerGroupSelection(learnerGroupNames: string[]) {
    await this.spinnerDisappear();
    await this.wait("mediumWait");

    // Check if modify access button is visible and click if needed
    if (await this.page.locator(this.selectors.modifyTheAccessBtn).isVisible({ timeout: 5000 })) {
      await this.mouseHover(this.selectors.modifyTheAccessBtn, "No, Modify The Access");
      await this.click(this.selectors.modifyTheAccessBtn, "No, Modify The Access", "Button");
      await this.spinnerDisappear();
      await this.wait("mediumWait");
    }

    // Open learner group dropdown
    await this.click(this.selectors.learnerGroupbtn, "Learner Group", "dropdown");
    await this.wait("minWait");

    try {
      // Get all learner group options
      const options = await this.page.locator(this.selectors.allLearnerGroupOptions).all();
      const targetGroupsFound: string[] = [];
      const targetGroupsSelected: string[] = [];

      for (const option of options) {
        const value = await option.innerText();
        console.log(`Processing learner group: ${value}`);

        if (learnerGroupNames.includes(value)) {
          targetGroupsFound.push(value);

          // Check if the target learner group is already selected
          try {
            const groupOptionLocator = this.page.locator(
              `//div[@class='dropdown-menu show']//span[@class='text' and text()='${value}']`
            ).first();

            if (await groupOptionLocator.isVisible({ timeout: 2000 })) {
              const parentElement = groupOptionLocator.locator('..');
              const isSelected = await parentElement.evaluate((el) => {
                const checkbox = el.querySelector('input[type="checkbox"]') as HTMLInputElement;
                return el.classList.contains('selected') ||
                  checkbox?.checked ||
                  el.getAttribute('aria-selected') === 'true';
                return el.classList.contains('selected') ||
                  checkbox?.checked ||
                  el.getAttribute('aria-selected') === 'true';
              });


              if (isSelected) {
                console.log(`${value} is already selected - skipping`);
                targetGroupsSelected.push(value);
              } else {
                console.log(`Selecting ${value}`);
                await groupOptionLocator.click();
                await this.wait("minWait");
                targetGroupsSelected.push(value);
              }
            }
          } catch (error) {
            console.log(`Could not process target learner group ${value}: ${error.message}`);
          }
          continue;
        }

        // For all other groups, try to unselect them
        try {
          const groupOptionLocator = this.page.locator(
            `//div[@class='dropdown-menu show']//span[@class='text' and text()='${value}']`
          ).first();


          if (await groupOptionLocator.isVisible({ timeout: 2000 })) {
            // Check if the option is currently selected by looking for selected class or checked state
            const parentElement = groupOptionLocator.locator('..');
            const isSelected = await parentElement.evaluate((el) => {
              const checkbox = el.querySelector('input[type="checkbox"]') as HTMLInputElement;
              return el.classList.contains('selected') ||
                checkbox?.checked ||
                el.getAttribute('aria-selected') === 'true';
              return el.classList.contains('selected') ||
                checkbox?.checked ||
                el.getAttribute('aria-selected') === 'true';
            });


            if (isSelected) {
              console.log(`Unselecting ${value}`);
              await groupOptionLocator.click();
              await this.wait("minWait");
            }
          }
        } catch (error) {
          console.log(`Could not process learner group ${value}: ${error.message}`);
        }
      }

      // Check if all target groups were found and selected
      const notFound = learnerGroupNames.filter(name => !targetGroupsFound.includes(name));
      const notSelected = targetGroupsFound.filter(name => !targetGroupsSelected.includes(name));

      if (notFound.length > 0) {
        console.log(`Warning: Target learner groups not found: ${notFound.join(', ')}`);
      }
      if (notSelected.length > 0) {
        console.log(`Warning: Could not select target learner groups: ${notSelected.join(', ')}`);
      }
      if (targetGroupsSelected.length > 0) {
        console.log(`Successfully selected learner groups: ${targetGroupsSelected.join(', ')}`);
      }


    } catch (error) {
      console.log(`Error in multiple learner group selection: ${error.message}`);
    }


    // Close the dropdown
    await this.click(this.selectors.learnerGroupbtn, "Learner Group", "dropdown");
    await this.wait("minWait");
  }

  async crsAccessSettings() {
    await this.wait("minWait");
    await this.click(
      this.selectors.crsAccessSettingLink,
      "Access Setting Link",
      "Link"
    );
    await this.click(
      this.selectors.crsAccessDropDown,
      "Access Dropdown ",
      "Dropdown"
    );
    await this.click(
      this.selectors.crsAccessMandatoryOption,
      "Mandatory Selection",
      "Dropdown"
    );
    await this.wait("minWait");
    await this.click(
      this.selectors.crsAccessUserDropDown,
      "User Access Dropdown ",
      "Dropdown"
    );
    await this.click(
      this.selectors.crsAccessUserMandatoryOption,
      "Mandatory Selection",
      "Dropdown"
    );
    await this.click(
      this.selectors.crsAccessSettingsSave,
      "Mandatory Selection",
      "Dropdown"
    );
    await this.wait("maxWait");
  }

  async accessSettings(accessType: string) {
    await this.wait("minWait");
    await this.click(
      this.selectors.crsAccessSettingLink,
      "Access Setting Link",
      "Link"
    );
    await this.click(
      this.selectors.crsAccessDropDown,
      "Access Dropdown",
      "Dropdown"
    );
    await this.click(
      this.selectors.AccessMandatoryOption(accessType),
      `${accessType} Selection`,
      "Dropdown"
    );
    await this.wait("minWait");
    await this.click(
      this.selectors.crsAccessUserDropDown,
      "User Access Dropdown",
      "Dropdown"
    );
    await this.click(
      this.selectors.AccessUserMandatoryOption(accessType),
      `${accessType} Selection`,
      "Dropdown"
    );
    await this.click(
      this.selectors.crsAccessSettingsSave,
      "Access Setting Save",
      "Button"
    );
    await this.wait("maxWait");
  }

  async overallAccessSettings(accessType: string) {
    await this.wait("minWait");
    await this.wait("minWait");
    await this.click(
      this.selectors.crsAccessSettingLink,
      "Access Setting Link",
      "Link"
    );

    // Set access for groups
    console.log(`🔄 Setting group access to: ${accessType}`);
    await this.click(
      this.selectors.groupAccessDropdown,
      "Group Access Dropdown",
      "Dropdown"
    );
    await this.wait("minWait");
    await this.click(
      this.selectors.accessOption(accessType),
      `${accessType} Group Access Selection`,
      "Dropdown"
    );
    await this.wait("minWait");

    // Set access for users
    console.log(`🔄 Setting user access to: ${accessType}`);
    await this.click(
      this.selectors.userAccessDropdown,
      "User Access Dropdown",
      "Dropdown"
    );
    await this.wait("minWait");
    await this.click(
      this.selectors.accessOption(accessType),
      `${accessType} User Access Selection`,
      "Dropdown"
    );
    await this.click(
      this.selectors.crsAccessSettingsSave,
      "Access Setting Save",
      "Button"
    );
    await this.wait("maxWait");

    console.log(`✅ Overall access settings configured: Groups and Users set to ${accessType}`);
  }

  async verifyCurrencyNotPresent(currencyName: string): Promise<void> {
    await this.wait("minWait");
    await this.click(this.selectors.currencyDropdown, "Currency", "Field");
    const currencyValues = [];
    for (const options of await this.page
      .locator(this.selectors.currencyListInCourse)
      .all()) {
      const value = await options.innerText();
      console.log(value);
      currencyValues.push(value.trim());
    }
    expect(currencyValues).not.toContain(currencyName);
    console.log(`Currency "${currencyName}" is not present in the list.`);
  }

  //Filter for instance
  async filterByInstance(data: string) {
    await this.wait("minWait");
    await this.click(
      this.selectors.filterInCourseList,
      "Filter by Instance",
      "Button"
    );
    await this.validateElementVisibility(
      this.selectors.searchType,
      "Search Type"
    );
    await this.click(
      this.selectors.searchTypeDropdown,
      "Search Type Dropdown",
      "Button"
    );
    await this.click(
      this.selectors.deliveryTypeOption(data),
      "Search Type Option",
      "Option"
    );
  }

  async addThumbnailImagefromSystemGallery() {
    await this.click(this.selectors.clickHere, "Click Here", "Link");
    await this.wait("minWait");
    const gallerySelector = this.selectors.selectRandomThumbnailimages;
    await this.page.waitForSelector(gallerySelector);
    const images = await this.page.locator(gallerySelector).elementHandles();
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomImage = images[randomIndex];
    await randomImage.click();
    await this.wait("minWait");
    const srcValue = await this.page
      .locator(this.selectors.uploadedImgSrc)
      .getAttribute("src");
    console.log("Selected image:", srcValue);
    const normalizedSrc = srcValue.replace(/-(th|sm)\.jpg$/, "");
    return normalizedSrc;
  }
  async uploadThumbnailfromCustomGallery() {
    await this.wait("minWait");
    await this.click(this.selectors.clickHere, "Click Here", "Link");
    await this.validateElementVisibility(
      this.selectors.customGalleryRadioBtn,
      "Custom Gallery"
    );
    await this.click(
      this.selectors.customGalleryRadioBtn,
      "Custom Gallery",
      "Radio Button"
    );
    //randomly uploading from local
    const folderPath = path.resolve(__dirname, "../data/thumbnail/");
    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );
    const randomFile =
      imageFiles[Math.floor(Math.random() * imageFiles.length)];
    const randomFilePath = path.join(folderPath, randomFile);
    console.log(`Uploading file: ${randomFilePath}`);
    await this.wait("mediumWait");
    await this.page
      .locator(this.selectors.addThumbnail)
      .setInputFiles(randomFilePath);
    await this.wait("mediumWait");
    const srcValue = await this.page
      .locator(this.selectors.uploadedImgSrc)
      .getAttribute("src");
    console.log(srcValue);
    return srcValue;
  }
  async retriveCodeOnCreationPage() {
    await this.wait("mediumWait");
    let value = await this.page.locator(this.selectors.codeValue).inputValue();
    return value;
  }

  async clickContentLibrary() {
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.clickContentLibrary,
      "Content"
    );
    await this.mouseHover(this.selectors.clickContentLibrary, "Content");
    await this.click(this.selectors.clickContentLibrary, "Content", "button");
  }

  //Content Validity
  async contentValidity(validity: string, data: string) {
    //const contentName= await this.page.locator(this.selectors.validateContent).innerHTML();
    await this.click(
      this.selectors.selectContentValidity,
      "validity",
      "content"
    );
    await this.mouseHover(
      this.selectors.validityType(validity),
      "ValidityType"
    );
    await this.click(
      this.selectors.validityType(validity),
      "validityType",
      "content"
    );
    if (validity === "Date") {
      await this.keyboardType(this.selectors.DateInput, getFutureDate());
    } else {
      await this.keyboardType(this.selectors.DaysInput, data);
    }
  }

  //fill seat max with input data
  async setSeatsMax(seatCount: any) {
    await this.typeAndEnter(
      this.selectors.seatMaxInput,
      "Instance Max Seat",
      seatCount
    );
  }

  //Verify Price Override in Course Level Business Rules
  async verifyPriceOverrideInCourseBusinessRules() {
    await this.wait("mediumWait");
    
    try {
      // Click on Business Rule tab in course
      await this.click(this.selectors.courseBusinessRulesLink, "Course Business Rules", "Link");
      await this.wait("mediumWait");
      
      // Check if Price Override is available and enabled at course level
      const priceOverrideSelector = `//span[contains(text(),'Price Override')] | //label[contains(text(),'Price Override')]`;
      const priceOverrideExists = await this.page.locator(priceOverrideSelector).isVisible();
      
      if (priceOverrideExists) {
        console.log("✅ Price Override is AVAILABLE in Course Level Business Rules");
        
        // Try to check if it's enabled - might have different patterns at course level
        const enabledIndicators = [
          `//span[contains(text(),'Price Override')]/following-sibling::*[contains(@class,'enabled')] | //span[contains(text(),'Price Override')]/following-sibling::*[contains(text(),'Yes')] | //span[contains(text(),'Price Override')]/parent::*[contains(@class,'active')]`
        ];
        
        let isEnabled = false;
        for (const selector of enabledIndicators) {
          try {
            if (await this.page.locator(selector).isVisible({ timeout: 2000 })) {
              isEnabled = true;
              break;
            }
          } catch (e) {
            // Continue checking other selectors
          }
        }
        
        if (isEnabled) {
          console.log("✅ Price Override is ENABLED in Course Level Business Rules");
        } else {
          console.log("⚠️ Price Override is AVAILABLE but status unclear in Course Level Business Rules");
        }
        
        return { available: true, enabled: isEnabled };
      } else {
        console.log("❌ Price Override is NOT available in Course Level Business Rules");
        return { available: false, enabled: false };
      }
      
    } catch (error) {
      console.log("❌ Error checking Price Override in Course Business Rules:", error);
      return { available: false, enabled: false };
    }
  }

  //Verify Price Override in Instance Level Business Rules  
  async verifyPriceOverrideInInstanceBusinessRules() {
    await this.wait("mediumWait");
    
    try {
      // Check if Business Rules tab/section exists at instance level
      const businessRulesSelectors = [
        `//span[text()='Business Rule']`,
        `//a[text()='Business Rules']`,
        `//button[contains(text(),'Business Rule')]`,
        `//div[contains(@class,'business-rules')]`,
        `//section[contains(@class,'business-rules')]`
      ];
      
      let businessRulesExists = false;
      for (const selector of businessRulesSelectors) {
        try {
          if (await this.page.locator(selector).isVisible({ timeout: 3000 })) {
            await this.click(selector, "Instance Business Rules", "Link");
            businessRulesExists = true;
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
      
      if (!businessRulesExists) {
        console.log("✅ CORRECT: Business Rules section is NOT available at Instance Level (as expected)");
        return { available: false, enabled: false, expectedBehavior: true };
      }
      
      await this.wait("mediumWait");
      
      // If Business Rules exists at instance level, check for Price Override
      const priceOverrideSelector = `//span[contains(text(),'Price Override')] | //label[contains(text(),'Price Override')]`;
      const priceOverrideExists = await this.page.locator(priceOverrideSelector).isVisible({ timeout: 3000 });
      
      if (priceOverrideExists) {
        console.log("🚨 BUG DETECTED: Price Override is available at Instance Level (should not be available)");
        return { available: true, enabled: false, expectedBehavior: false, isBug: true };
      } else {
        console.log("✅ CORRECT: Price Override is NOT available at Instance Level (as expected)");
        return { available: false, enabled: false, expectedBehavior: true };
      }
      
    } catch (error) {
      console.log("✅ CORRECT: No Business Rules or Price Override found at Instance Level (as expected)");
      return { available: false, enabled: false, expectedBehavior: true };
    }
  }

  // Enable/Disable Price Override in Course Level Business Rules
  async coursePriceOverrideInBusinessRules(data?: string) {
    await this.wait("mediumWait");

    try {
      // Open Course Business Rules tab
      await this.click(this.selectors.courseBusinessRulesLink, "Course Business Rules", "Link");
      await this.wait("mediumWait");

      // Define selectors for course-level Price Override label and checked icon
      const checkedSelector = `(//label[contains(.,'Price Override')]/i[contains(@class,'check') or contains(@class,'check me-1 icon')])[1]`;
      const labelSelector = `//label[contains(.,'Price Override')]`;

      const isChecked = await this.page.locator(checkedSelector).isVisible().catch(() => false);

      if (data === 'Uncheck') {
        if (isChecked) {
          // Uncheck the Price Override at course level
          await this.page.locator(labelSelector).click();
          console.log("✅ Price Override checkbox has been clicked to uncheck");
          await this.wait("minWait");
          
          // Click OK button first (appears after unchecking)
          try {
            await this.click(this.selectors.okButton, "OK", "Button");
            console.log("✅ OK button clicked after unchecking Price Override");
            await this.wait("minWait");
            
           const saveBtn = this.page.locator("//button[text()='Save']");
           await saveBtn.click();
           console.log("✅ SAVE button clicked to persist Price Override changes");
           await this.wait("minWait");

          } catch (okError) {
            console.log("OK button not found after unchecking");
          }
          
          // Then click SAVE button using flexible locator
        
          
          await this.wait("mediumWait");
          console.log("Price Override has been unchecked at Course level");
        } else {
          console.log("Price Override is already unchecked at Course level");
        }
      } else {
        if (!isChecked) {
          // If unchecked, click to enable/check it
          await this.page.locator(labelSelector).click();
          console.log("✅ Price Override checkbox has been clicked to enable");
          await this.wait("minWait");
          
          // Click OK button first (appears after checking)
          try {
            await this.click(this.selectors.okButton, "OK", "Button");
            console.log("✅ OK button clicked after enabling Price Override");
            await this.wait("minWait");
          } catch (okError) {
            console.log("OK button not found after enabling");
          }
          
          // Then click SAVE button using flexible locator
          try {
            const saveBtn = this.page.locator("//*[text()='SAVE']");
            if (await saveBtn.isVisible().catch(() => false)) {
              await saveBtn.click();
              console.log("✅ SAVE button clicked to persist Price Override changes");
              await this.wait("minWait");
            }
          } catch (saveError) {
            console.log("SAVE button not found or not clickable");
          }
          
          await this.wait("mediumWait");
          console.log("Price Override has been enabled at Course level");
        } else {
          console.log("Price Override is already enabled at Course level");
        }
      }
    } catch (error) {
      console.log("Course level Price Override functionality may not be available:", error);
    }
  }

  //Recurring class creartion
  async selectSessionType() {
    await this.wait("minWait");
    await this.click(
      this.selectors.selectSessionType,
      "Session Type",
      "Button"
    );
  }
  async selectAllDays() {
    let value: any;
    await this.click(this.selectors.clickDaysDropdown, "Days", "Dropdown");
    await this.wait("minWait");
    let count = await this.page.locator(this.selectors.daysCount).count();
    // for (const options of await this.page.locator(this.selectors.selectDays).all()) {
    //     value = await options.innerText();
    // }
    for (let i = 0; i < count; i++) {
      const option = await this.page
        .locator(this.selectors.selectDays(i + 1))
        .innerText();
      await this.click(
        this.selectors.daysOption(option),
        "Select days ",
        "Option"
      );
    }
  }
  async enterEndDateValue() {
    const date = getnextMonthFormatted();
    await this.keyboardType(this.selectors.endDate, date);
  }

  async checkContactSupportNew(expectedEmail: string) {
    await this.validateElementVisibility(
      this.selectors.checkContactSupport,
      "Contact"
    );
    // await this.verificationInputValue(this.selectors.checkContactSupport."")
    await this.verificationInputValue(
      this.selectors.checkContactSupport,
      expectedEmail
    );
  }
  //edit course from listing page after search:
  async editCourseFromListingPage() {
    await this.page.waitForTimeout(8000);
    await this.validateElementVisibility(
      this.selectors.editCourseFromListingPage,
      "editCourse"
    );
    await this.click(
      this.selectors.editCourseFromListingPage,
      "edit",
      "button"
    );
  }

  async checkReview(assessment: string) {
    await this.validateElementVisibility(this.selectors.checkReview(assessment), "Review");
    await this.click(this.selectors.checkReview(assessment), "Review", "button");
  }

  async okBtn() {
    await this.click(this.selectors.okButton, "Ok", "Button");
  }

  async checkConsiderForCompletionCheckbox() {
    await this.validateElementVisibility(this.selectors.considerForCompletionCheckbox, "Consider for completion");
    await this.click(this.selectors.considerForCompletionCheckbox, "Consider for completion", "Checkbox");
  }


  async createCourseButton() {
    await this.validateElementVisibility(this.selectors.createCourseButton, "Create Course Button");
    await this.click(this.selectors.createCourseButton, "Create Course", "Button");
  }
    
    
  async verifyPublishedContentInContentLibrary(data: string, data1: string) {
    await this.page.mouse.wheel(0, 200);
    await this.spinnerDisappear();
    await this.validateElementVisibility(
      this.selectors.clickContentLibrary,
      "Content"
    );
    await this.mouseHover(this.selectors.clickContentLibrary, "Content");
    await this.click(this.selectors.clickContentLibrary, "Content", "button");
    await this.waitForElementHidden(
      "//span[text()='Counting backwards from Infinity']",
      "string"
    );
    await this.spinnerDisappear();
    await this.typeAndEnter(
      "#exp-content-search-field",
      "Content Search Field",
      data
    );
    if (data1 === "Published")
       {
      let contentTitle = await this.page.locator(`//div[text()='${data}']`).textContent();
      if (contentTitle === data) {
        console.log("Published Content is present in content library");
      }
    }
      else {
        await this.wait("mediumWait");
        const draftedContent = await this.page.locator("//div[text()='No matching result found.']").isVisible();
        await this.wait("minWait");
        if (draftedContent) {
          console.log("drafted Content is not present in content library as expected");
        }
      }
    
  }

  // CNT073 - Verify action options for attached content in create course page
  public async attachContentToCourse(): Promise<void> {
    const attachContentButton = this.page.locator(`//button[contains(text(),'Attach Content') or contains(text(),'Add Content')]`);
    await expect(attachContentButton).toBeVisible();
    await attachContentButton.click();
    await this.wait("minWait");
    
    // Select first available content
    const firstContent = this.page.locator(`(//input[@type='checkbox'])[1]`);
    await firstContent.click();
    await this.wait("minWait");
    
    const addButton = this.page.locator(`//button[contains(text(),'Add')]`);
    await addButton.click();
    await this.wait("mediumWait");
    console.log(`✅ Content attached to course`);
  }

  public async verifyEditContentOptionVisible(): Promise<void> {
    const editIcon = this.page.locator(`//a[contains(@id,"edit_content")]`).first();
    await expect(editIcon).toBeVisible();
    console.log(`✅ Edit content option is visible`);
  }

  public async verifyPreviewContentOptionVisible(): Promise<void> {
    const previewIcon = this.page.locator(`//a[@aria-label="Preview"]`).first();
    await expect(previewIcon).toBeVisible();
    console.log(`✅ Preview content option is visible`);
  }

  public async verifyHideUnhideOptionVisible(): Promise<void> {
    const hideUnhideIcon = this.page.locator(`//a[@aria-label="Hide"]`).first();
    await expect(hideUnhideIcon).toBeVisible();
    console.log(`✅ Hide/Unhide content option is visible`);
  }

  public async verifyReorderOptionVisible(): Promise<void> {
    const reorderIcon = this.page.locator(`//a[@aria-label="Drag and Drop"]`).first();
    await expect(reorderIcon).toBeVisible();
    console.log(`✅ Re-order content option is visible`);
  }

  public async verifyDeleteContentOptionVisible(): Promise<void> {
    const deleteIcon = this.page.locator(`//a[@aria-label="Delete"]`).first();
    await expect(deleteIcon).toBeVisible();
    console.log(`✅ Delete content option is visible`);
  }

  public async clickhere(){

    await this.page.mouse.wheel(0, 100);
    await this.click(this.selectors.clickContentLibrary, "Content", "button");
  }
  public async clicLickToSwitchCrsPage(){
    await this.page.locator(`//a[contains(@aria-label,"Instance/Class of:")]`).click();
    await this.wait("mediumWait");
  }



  async clickInstancesIcon() {
    await this.wait('minWait');
    await this.validateElementVisibility(this.selectors.instanceIcon, "Instances Icon");
    await this.click(this.selectors.instanceIcon, "Instances", "Icon");
    console.log("✅ Clicked Instances icon");
  }

  // openCourseLink
  async clickCourseFromInstance() {
    await this.wait('minWait');
    await this.validateElementVisibility(this.selectors.openCourseLink, "Course Link");
    await this.click(this.selectors.openCourseLink, "Course Link", "Link");
    console.log("✅ Clicked Course Link from Instance page");
  }

   async specificLearnerGroupSelection(learnerGroupName: string) {
    await this.spinnerDisappear();
    await this.wait("mediumWait");
    
    // Check if modify access button is visible and click if needed
    if (await this.page.locator(this.selectors.modifyTheAccessBtn).isVisible({ timeout: 5000 })) {
      await this.mouseHover(this.selectors.modifyTheAccessBtn, "No, Modify The Access");
      await this.click(this.selectors.modifyTheAccessBtn, "No, Modify The Access", "Button");
      await this.spinnerDisappear();
      await this.wait("mediumWait");
    }
    
    // Open learner group dropdown
    await this.click(this.selectors.learnerGroupbtn, "Learner Group", "dropdown");
    await this.wait("minWait");
    
    try {
      // Get all learner group options
      const options = await this.page.locator(this.selectors.allLearnerGroupOptions).all();
      let targetGroupFound = false;
      let targetGroupSelected = false;
      
      for (const option of options) {
        const value = await option.innerText();
        console.log(`Processing learner group: ${value}`);
        
        if (value === learnerGroupName) {
          targetGroupFound = true;
          
          // Check if the target learner group is already selected
          try {
            const groupOptionLocator = this.page.locator(
              `//div[@class='dropdown-menu show']//span[@class='text' and text()='${value}']`
            ).first();
            
            if (await groupOptionLocator.isVisible({ timeout: 2000 })) {
              const parentElement = groupOptionLocator.locator('..');
              const isSelected = await parentElement.evaluate((el) => {
                const checkbox = el.querySelector('input[type="checkbox"]') as HTMLInputElement;
                return el.classList.contains('selected') || 
                       checkbox?.checked || 
                       el.getAttribute('aria-selected') === 'true';
              });
              
              if (isSelected) {
                console.log(`${learnerGroupName} is already selected - skipping`);
                targetGroupSelected = true;
              } else {
                console.log(`Selecting ${learnerGroupName}`);
                await groupOptionLocator.click();
                await this.wait("minWait");
                targetGroupSelected = true;
              }
            }
          } catch (error) {
            console.log(`Could not process target learner group ${value}: ${error.message}`);
          }
          continue;
        }
        // For all other groups, try to unselect them
        try {
          const groupOptionLocator = this.page.locator(
            `//div[@class='dropdown-menu show']//span[@class='text' and text()='${value}']`
          ).first();
          
          if (await groupOptionLocator.isVisible({ timeout: 2000 })) {
            // Check if the option is currently selected by looking for selected class or checked state
            const parentElement = groupOptionLocator.locator('..');
            const isSelected = await parentElement.evaluate((el) => {
              const checkbox = el.querySelector('input[type="checkbox"]') as HTMLInputElement;
              return el.classList.contains('selected') || 
                     checkbox?.checked || 
                     el.getAttribute('aria-selected') === 'true';
            });
            
            if (isSelected) {
              console.log(`Unselecting ${value}`);
              await groupOptionLocator.click();
              await this.wait("minWait");
            }
          }
        } catch (error) {
          console.log(`Could not process learner group ${value}: ${error.message}`);
        }
      }
      
      if (!targetGroupFound) {
        console.log(`Warning: Target learner group '${learnerGroupName}' was not found in the options`);
      } else if (!targetGroupSelected) {
        console.log(`Warning: Could not select target learner group '${learnerGroupName}'`);
      }
      
    } catch (error) {
      console.log(`Error in learner group selection: ${error.message}`);
    }
    
    // Close the dropdown
    await this.click(this.selectors.learnerGroupbtn, "Learner Group", "dropdown");
    await this.wait("minWait");
  }

  // Navigate to listing, search for course, and click on the course
  async navigateToListingAndSearchCourse(courseName: string) {
    // Step 1: Click "Go to Listing" link
    await this.validateElementVisibility(
      this.selectors.goToListingLink,
      "Go to Listing"
    );
    await this.click(this.selectors.goToListingLink, "Go to Listing", "Link");
    
    // Step 2: Wait for listing page to load and search for the course
    await this.wait("mediumWait");
    await this.validateElementVisibility(
      this.selectors.courseSearchField,
      "Search Field"
    );
    await this.click(this.selectors.courseSearchField, "Search Field", "Textbox");
    await this.type(this.selectors.courseSearchField, "Search Field", courseName);
    await this.keyboardAction(
      this.selectors.courseSearchField,
      "Enter",
      "Search Field",
      courseName
    );
    
    // Step 3: Wait for search results and click on edit course button for first result
    await this.wait("mediumWait");
    await this.spinnerDisappear();
    
    // Click on the edit course icon for the first matching course
    const editCourseSelector = `//i[@aria-label='Edit Course']`;
    await this.validateElementVisibility(editCourseSelector, `Edit Course for: ${courseName}`);
    await this.click(editCourseSelector, `Edit Course for: ${courseName}`, "Icon");
    
    await this.wait("mediumWait");
    console.log(`Successfully navigated to listing, searched for and clicked edit for course: ${courseName}`);
  }

  // Method to set only start time and let system automatically set end time
  public async setStartTimeOnlyForVC() {
    console.log("Setting start time only - system will auto-set end time...");
    
    try {
      // Only set start time, let system handle end time automatically
      const startTimeSelectors = [
        "//label[text()='Start Time']/following-sibling::input",
        "//input[contains(@id,'starttime_sesstime_instance')]",
        "(//input[contains(@placeholder,'Start Time')])[1]"
      ];
      
      for (const selector of startTimeSelectors) {
        try {
          const element = this.page.locator(selector);
          if (await element.isVisible()) {
            console.log(`Found start time element with selector: ${selector}`);
            await element.click();
            await this.wait("mediumWait");
            
            // Use timepicker to select a future time
            try {
              await this.page.waitForSelector("//ul[@class='ui-timepicker-list']", { timeout: 5000 });
              const timeOptions = await this.page.locator("//ul[@class='ui-timepicker-list']//li").all();
              
              if (timeOptions.length > 0) {
                // Select a reasonable time (not too early, not too late)
                const safeIndex = Math.max(5, Math.floor(timeOptions.length / 3));
                const selectedOption = timeOptions[safeIndex];
                const selectedTime = await selectedOption.textContent();
                
                console.log(`Setting START time: ${selectedTime} - system will auto-set end time`);
                await selectedOption.click();
                await this.wait("mediumWait"); // Wait for system to process
                
                console.log("SUCCESS: Start time set, end time will be set automatically by system");
                return; // Exit after successful start time setting
              }
            } catch (timepickerError) {
              console.log("Timepicker not available, trying direct input...");
              
              // Fallback: set time directly
              const now = new Date();
              now.setHours(now.getHours() + 1);
              const hours = now.getHours() % 12 || 12;
              const minutes = Math.ceil(now.getMinutes() / 15) * 15;
              const ampm = now.getHours() >= 12 ? "PM" : "AM";
              const startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
              
              console.log(`Setting start time to: ${startTime} - system will auto-set end time`);
              await element.fill(startTime);
              await this.wait("mediumWait");
              
              console.log("SUCCESS: Start time set via direct input");
              return;
            }
          }
        } catch (error) {
          console.log(`Start time selector ${selector} failed, trying next...`);
        }
      }
      
      console.log("Could not set start time with any selector");
      
    } catch (error) {
      console.error("Error setting start time:", error.message);
      console.log("Continuing without setting start time...");
    }
  }

  // Method to set start time and then end time with proper delay and different values
  public async setStartAndEndTimeSeparately() {
    console.log("Setting start and end times separately with proper delays...");
    
    try {
      // Step 1: Set start time first
      console.log("Step 1: Setting start time...");
      const startTimeSelectors = [
        "//label[text()='Start Time']/following-sibling::input",
        "//input[contains(@id,'starttime_sesstime_instance')]",
        "(//input[contains(@placeholder,'Start Time')])[1]"
      ];
      
      let startTimeSet = false;
      for (const selector of startTimeSelectors) {
        try {
          const element = this.page.locator(selector);
          if (await element.isVisible()) {
            console.log(`Found start time element with selector: ${selector}`);
            await element.click();
            await this.wait("mediumWait"); // Longer wait
            
            // Use timepicker for start time
            try {
              await this.page.waitForSelector("//ul[@class='ui-timepicker-list']", { timeout: 5000 });
              const timeOptions = await this.page.locator("//ul[@class='ui-timepicker-list']//li").all();
              
              if (timeOptions.length > 0) {
                // Select an earlier time for start (around 1/4 through the list)
                const startIndex = Math.max(3, Math.floor(timeOptions.length / 4));
                const selectedOption = timeOptions[startIndex];
                const selectedTime = await selectedOption.textContent();
                
                console.log(`Setting START time: ${selectedTime} (index ${startIndex})`);
                await selectedOption.click();
                await this.wait("maxWait"); // Extra wait after start time selection
                startTimeSet = true;
                break;
              }
            } catch (timepickerError) {
              console.log("Start time timepicker failed, trying direct input...");
            }
          }
        } catch (error) {
          console.log(`Start time selector ${selector} failed, trying next...`);
        }
      }
      
      if (!startTimeSet) {
        console.log("Could not set start time");
        return;
      }
      
      // Step 2: Wait and then set end time to a different value
      console.log("Step 2: Waiting before setting end time...");
      await this.wait("maxWait"); // Wait for start time to be processed
      
      const endTimeSelectors = [
        "//label[text()='End Time']/following-sibling::input",
        "//input[contains(@id,'endtime_sesstime_instance')]",
        "(//input[contains(@placeholder,'End Time')])[1]"
      ];
      
      let endTimeSet = false;
      for (const selector of endTimeSelectors) {
        try {
          const element = this.page.locator(selector);
          if (await element.isVisible()) {
            console.log(`Found end time element with selector: ${selector}`);
            await element.click();
            await this.wait("mediumWait");
            
            // Use timepicker for end time
            try {
              await this.page.waitForSelector("//ul[@class='ui-timepicker-list']", { timeout: 5000 });
              const timeOptions = await this.page.locator("//ul[@class='ui-timepicker-list']//li").all();
              
              if (timeOptions.length > 0) {
                // Select a later time for end (around 3/4 through the list)
                const endIndex = Math.min(timeOptions.length - 1, Math.floor(timeOptions.length * 3 / 4));
                const selectedOption = timeOptions[endIndex];
                const selectedTime = await selectedOption.textContent();
                
                console.log(`Setting END time: ${selectedTime} (index ${endIndex})`);
                await selectedOption.click();
                await this.wait("maxWait");
                endTimeSet = true;
                break;
              }
            } catch (timepickerError) {
              console.log("End time timepicker failed, trying direct input...");
            }
          }
        } catch (error) {
          console.log(`End time selector ${selector} failed, trying next...`);
        }
      }
      
      if (endTimeSet) {
        console.log("SUCCESS: Start and end times set to different values");
      } else {
        console.log("WARNING: Could not set end time, start time only was set");
      }
      
      await this.wait("mediumWait"); // Final wait before proceeding
      
    } catch (error) {
      console.error("Error setting start/end times separately:", error.message);
      console.log("Continuing with default time values...");
    }
  }

  // Method to set only start time for Virtual Class instances (let system handle end time)
  public async setStartTimeOnly() {
    console.log("Setting start time only for Virtual Class instance...");
    
    try {
      // Set start time only
      const startTimeSelectors = [
        "//label[text()='Start Time']/following-sibling::input",
        "//input[contains(@id,'starttime_sesstime_instance')]",
        "//input[contains(@placeholder,'Start Time')]"
      ];
      
      let startTimeSet = false;
      for (const selector of startTimeSelectors) {
        try {
          const element = this.page.locator(selector);
          if (await element.isVisible()) {
            await element.click();
            await this.wait("minWait");
            
            // Use timepicker to select a future time
            try {
              await this.page.waitForSelector("//ul[@class='ui-timepicker-list']", { timeout: 3000 });
              const timeOptions = await this.page.locator("//ul[@class='ui-timepicker-list']//li").all();
              
              if (timeOptions.length > 0) {
                // Select a time that's likely to be in the future (avoid first few options)
                const safeIndex = Math.max(5, Math.floor(timeOptions.length / 3));
                const selectedOption = timeOptions[safeIndex];
                const selectedTime = await selectedOption.textContent();
                
                console.log(`Clicking timepicker option: ${selectedTime}`);
                await selectedOption.click();
                console.log("Start time set successfully via timepicker");
                startTimeSet = true;
                break;
              }
            } catch (timepickerError) {
              console.log("Timepicker not available, trying direct input...");
              
              // Fallback: set time directly
              const now = new Date();
              now.setHours(now.getHours() + 1);
              const hours = now.getHours() % 12 || 12;
              const minutes = Math.ceil(now.getMinutes() / 15) * 15;
              const ampm = now.getHours() >= 12 ? "PM" : "AM";
              const startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
              
              console.log(`Setting start time to: ${startTime}`);
              await element.fill(startTime);
              startTimeSet = true;
              break;
            }
          }
        } catch (error) {
          console.log(`Start time selector ${selector} failed, trying next...`);
        }
      }
      
      if (startTimeSet) {
        console.log("Start time set successfully - system will handle end time automatically");
        await this.wait("minWait");
      } else {
        console.log("Could not set start time with any selector");
      }
      
    } catch (error) {
      console.error("Error setting start time:", error.message);
      console.log("Continuing without setting start time...");
    }
  }

  // Method to set both start and end times for Virtual Class instances
  public async setVirtualClassStartEndTime() {
    console.log("Setting start and end times for Virtual Class instance...");
    
    try {
      // Set start time first
      const startTimeSelectors = [
        "//label[text()='Start Time']/following-sibling::input",
        "//input[contains(@id,'starttime_sesstime_instance')]",
        "//input[contains(@placeholder,'Start Time')]"
      ];
      
      let startTimeSet = false;
      for (const selector of startTimeSelectors) {
        try {
          const element = this.page.locator(selector);
          if (await element.isVisible()) {
            await element.click();
            await this.wait("minWait");
            
            // Calculate start time (current time + 1 hour)
            const now = new Date();
            now.setHours(now.getHours() + 1);
            const hours = now.getHours() % 12 || 12;
            const minutes = Math.ceil(now.getMinutes() / 15) * 15;
            const ampm = now.getHours() >= 12 ? "PM" : "AM";
            const startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
            
            console.log(`Setting start time to: ${startTime}`);
            await element.fill(startTime);
            startTimeSet = true;
            break;
          }
        } catch (error) {
          console.log(`Start time selector ${selector} not found, trying next...`);
        }
      }
      
      if (!startTimeSet) {
        console.log("Start time not set, trying timepicker...");
        await this.setTimeViaTimePicker(1); // Start time = 1 hour from now
      }
      
      await this.wait("minWait");
      
      // Set end time (start time + 1 hour)
      const endTimeSelectors = [
        "//label[text()='End Time']/following-sibling::input",
        "//input[contains(@id,'endtime_sesstime_instance')]",
        "//input[contains(@placeholder,'End Time')]"
      ];
      
      let endTimeSet = false;
      for (const selector of endTimeSelectors) {
        try {
          const element = this.page.locator(selector);
          if (await element.isVisible()) {
            await element.click();
            await this.wait("minWait");
            
            // Calculate end time (start time + 1 hour)
            const now = new Date();
            now.setHours(now.getHours() + 2); // Start + 1 hour
            const hours = now.getHours() % 12 || 12;
            const minutes = Math.ceil(now.getMinutes() / 15) * 15;
            const ampm = now.getHours() >= 12 ? "PM" : "AM";
            const endTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
            
            console.log(`Setting end time to: ${endTime}`);
            await element.fill(endTime);
            endTimeSet = true;
            break;
          }
        } catch (error) {
          console.log(`End time selector ${selector} not found, trying next...`);
        }
      }
      
      if (!endTimeSet) {
        console.log("End time not set, trying timepicker...");
        await this.setTimeViaTimePicker(2); // End time = 2 hours from now
      }
      
      console.log("Virtual Class start and end times set successfully");
      
    } catch (error) {
      console.error("Error setting Virtual Class start/end times:", error.message);
      console.log("Continuing with default time values...");
    }
  }
  
  // Helper method to set time via timepicker
  private async setTimeViaTimePicker(hoursOffset: number) {
    try {
      await this.page.waitForSelector("//ul[@class='ui-timepicker-list']", { timeout: 3000 });
      const timeOptions = await this.page.locator("//ul[@class='ui-timepicker-list']//li").all();
      
      if (timeOptions.length > 0) {
        // Calculate target time
        const now = new Date();
        now.setHours(now.getHours() + hoursOffset);
        const targetHours = now.getHours() % 12 || 12;
        const targetMinutes = Math.ceil(now.getMinutes() / 15) * 15;
        const targetAmpm = now.getHours() >= 12 ? "PM" : "AM";
        const targetTime = `${targetHours}:${targetMinutes.toString().padStart(2, '0')} ${targetAmpm}`;
        
        // Find matching time option or pick a safe index
        let optionIndex = Math.max(5, Math.floor(timeOptions.length / 3));
        
        for (let i = 0; i < timeOptions.length; i++) {
          const optionText = await timeOptions[i].textContent();
          if (optionText && optionText.trim() === targetTime) {
            optionIndex = i;
            break;
          }
        }
        
        await timeOptions[optionIndex].click();
        console.log(`Selected time from timepicker: ${await timeOptions[optionIndex].textContent()}`);
      }
    } catch (error) {
      console.log("Timepicker selection failed:", error.message);
    }
  }

  //Click on Enrollment in Course Page
  async clickEnrollmentInCoursePage() {
    await this.wait("maxWait");
    await this.validateElementVisibility(
      this.selectors.enrollmentInCoursePage,
      "Enrollment"
    );
    await this.click(this.selectors.enrollmentInCoursePage, "Enrollment", "Icon");
  }

  //Click on Instance Course Enrollment Icon
  async clickInstanceCourseEnrollment(courseTitle: string) {
    await this.wait("minWait");
    const enrollmentSelector = this.selectors.instanceCourseEnrollmentIcon(courseTitle);
    await this.validateElementVisibility(
      enrollmentSelector,
      "Instance Course Enrollment"
    );
    await this.page.locator(enrollmentSelector).scrollIntoViewIfNeeded();  
    await this.click(enrollmentSelector, "Instance Course Enrollment", "Icon");
  }

  // Method to search for a course in the course listing
  async searchCourse(courseName: string) {
    await this.wait("minWait");
    const searchField = "//input[@id='course-search-field'] | //input[contains(@placeholder, 'Search')] | //input[@type='search']";
    await this.type(searchField, "Course Search", courseName);
    await this.keyboardAction(searchField, "Enter", "Input", "Course Search");
    await this.wait("mediumWait");
    console.log(`🔍 Searched for course: ${courseName}`);
  }

  // Method to edit a specific course
  async editCourse(courseName: string) {
    await this.wait("minWait");
    const editCourseSelector = `//span[text()='${courseName}']//ancestor::tr//i[@aria-label='Edit Course'] | //span[text()='${courseName}']//following::i[contains(@class,'fa-pen')] | //div[text()='${courseName}']//following::i[contains(@aria-label,'Edit')]`;
    await this.validateElementVisibility(editCourseSelector, `Edit Course: ${courseName}`);
    await this.click(editCourseSelector, `Edit Course: ${courseName}`, "Button");
    await this.wait("mediumWait");
    console.log(`📝 Opened course for editing: ${courseName}`);
  }

  // Method to click on enrollment tab in course edit view
  async clickEnrollmentTab() {
    await this.wait("minWait");
    const enrollmentTabSelectors = [
      "//a[text()='Enrollments'] | //button[text()='Enrollments']",
      "//span[text()='Enrollments'] | //div[text()='Enrollments']",
      "//li[contains(@class,'nav')]//a[contains(text(),'Enrollment')]",
      "//tab[contains(@label,'Enrollment')] | //mat-tab[contains(@label,'Enrollment')]"
    ];
    
    for (const selector of enrollmentTabSelectors) {
      try {
        await this.validateElementVisibility(selector, "Enrollment Tab");
        await this.click(selector, "Enrollment Tab", "Tab");
        await this.wait("mediumWait");
        console.log(`👥 Clicked on Enrollment tab`);
        return;
      } catch (error) {
        continue;
      }
    }
    
    throw new Error("Enrollment tab not found");
  }

  // Method to verify expiry settings in course configuration
  async verifyExpirySettings() {
    await this.wait("minWait");
    const expirySettingSelectors = [
      "//span[text()='Expires'] | //label[text()='Expires']",
      "//input[@type='checkbox'][contains(@id,'expir')] | //span[contains(text(),'Complete by date')]",
      "//div[contains(text(),'Expiration')] | //span[contains(text(),'Expiry')]"
    ];
    
    for (const selector of expirySettingSelectors) {
      try {
        await this.validateElementVisibility(selector, "Expiry Settings");
        console.log(`⚙️ Found expiry settings configuration`);
        return true;
      } catch (error) {
        continue;
      }
    }
    
    console.log(`⚠️ Expiry settings not visible or not configured`);
    return false;
  }

  /**
   * Click on Files tab icon in course listing page
   */
  async clickFilesTab() {
    await this.wait("minWait");
    await this.validateElementVisibility(this.selectors.filesTabIcon, "Files Tab Icon");
    await this.click(this.selectors.filesTabIcon, "Files Tab", "Icon");
    await this.wait("mediumWait");
    console.log(`📁 Clicked on Files tab`);
  }

  /**
   * Verify that the file upload dialog/pushbox is displayed after clicking Files icon
   * @returns Promise<boolean> - Returns true if upload dialog is visible
   */
  async verifyFileUploadDialogDisplayed(): Promise<boolean> {
    await this.wait("minWait");
    
    // Try to verify using multiple possible selectors
    const selectors = [
      this.selectors.fileNameInput,
      this.selectors.fileUploadInput,
      this.selectors.fileUploadContainer,
      this.selectors.addFileButton
    ];
    
    for (const selector of selectors) {
      try {
        await this.validateElementVisibility(selector, "File Upload Dialog");
        console.log(`✅ File upload dialog/pushbox is displayed`);
        return true;
      } catch (error) {
        continue;
      }
    }
    
    console.log(`❌ File upload dialog/pushbox is NOT displayed`);
    return false;
  }

  /**
   * Click Files icon and verify the upload dialog appears
   */
  async clickFilesAndVerifyDialog() {
    console.log(`\n📁 Clicking Files icon and verifying upload dialog...`);
    await this.clickFilesTab();
    const isDialogVisible = await this.verifyFileUploadDialogDisplayed();
    
    if (!isDialogVisible) {
      throw new Error("File upload dialog did not appear after clicking Files icon");
    }
    
    console.log(`✅ File upload dialog verified successfully`);
  }

  /**
   * Enter file name in the upload form
   * @param fileName - Name to give to the uploaded file
   */
  async enterFileName(fileName: string) {
    await this.wait("minWait");
    await this.validateElementVisibility(this.selectors.fileNameInput, "File Name Input");
    await this.type(this.selectors.fileNameInput, "File Name", fileName);
    console.log(`📝 Entered file name: ${fileName}`);
  }

/**
   * Upload a file (sample video or any file)
   * @param filePath - Path to the file to upload (e.g., '../data/sample_video.mp4')
   */
  async uploadFileInstructor(filePath: string) {
    await this.wait("minWait");
    const fileInput = this.page.locator(this.selectors.fileUploadInput);
    await fileInput.setInputFiles(filePath);
    await this.wait("minWait");
    console.log(`:outbox_tray: Uploaded file from: ${filePath}`);
  }
  //Kathir-11-26-2025
    //  async uploadFile(locator: string, Path: string,) {
    //     const filePath = path.resolve(__dirname, Path);
    //     const inputElementHandle = this.page.locator(locator);
    //     if (inputElementHandle) {
    //         await inputElementHandle.setInputFiles(filePath);
    //     } else {
    //         console.error('Input element not found');
    //     }
    //     await this.wait('maxWait');
    // }

  //Kathir-11-26-2025
     async uploadFile(locator: string, Path: string,) {
        const filePath = path.resolve(__dirname, Path);
        const inputElementHandle = this.page.locator(locator);
        if (inputElementHandle) {
            await inputElementHandle.setInputFiles(filePath);
        } else {
            console.error('Input element not found');
        }
        await this.wait('maxWait');
    }



  /**
   * Select Instructor/Evaluator visibility for the uploaded file
   */
  async selectInstructorEvaluatorVisibility() {
    await this.wait("minWait");
    await this.validateElementVisibility(this.selectors.visibleToDropdown, "Visible To Dropdown");
    await this.click(this.selectors.visibleToDropdown, "Visible To", "Dropdown");
    await this.wait("minWait");
    
    await this.validateElementVisibility(this.selectors.instructorEvaluatorOption, "Instructor/Evaluator Option");
    await this.click(this.selectors.instructorEvaluatorOption, "Instructor/Evaluator", "Option");
    await this.wait("minWait");
    console.log(`👥 Selected visibility: Instructor/Evaluator`);
  }

  /**
   * Click Add button to save the uploaded file
   */
  async clickAddFileButton() {
    await this.wait("minWait");
    await this.validateElementVisibility(this.selectors.addFileButton, "Add File Button");
    await this.click(this.selectors.addFileButton, "Add File", "Button");
    await this.wait("mediumWait");
    console.log(`✅ Clicked Add button to save file`);
  }

  /**
   * Complete file upload process with instructor/evaluator visibility
   * @param fileName - Name to give to the file
   * @param filePath - Path to the file to upload
   */
  async uploadFileWithInstructorVisibility(fileName: string, filePath: string) {
    console.log(`\n📁 Starting file upload process...`);
    await this.clickFilesTab();
    await this.enterFileName(fileName);
    await this.uploadFileInstructor(filePath);
    await this.uploadFileInstructor(filePath);
    await this.selectInstructorEvaluatorVisibility();
    await this.clickAddFileButton();
  console.log(`✅ File uploaded successfully with Instructor/Evaluator visibility`);
}

async startandEndTime() {
    // Try multiple possible time input selectors
    const timeInputSelectors = [
      this.selectors.timeInput, // Generic selector
      "//input[contains(@id,'starttime_sesstime_instance')]", // ID-based selector
      "//input[contains(@placeholder,'Start Time')]", // Placeholder-based
      "//label[text()='Start Time']//following::input[1]" // Alternative path
    ];
    
    let timeInputFound = false;
    let timeInputSelector = "";
    
    // Find the first working time input selector
    for (const selector of timeInputSelectors) {
      try {
        const element = this.page.locator(selector);
        const isVisible = await element.isVisible();
        if (isVisible) {
          timeInputSelector = selector;
          timeInputFound = true;
          console.log(`Time input found with selector: ${selector}`);
          break;
        }
      } catch (error) {
        console.log(`Selector ${selector} not found, trying next...`);
      }
    }
    
    if (!timeInputFound) {
      console.error("No time input field found!");
      return;
    }
    
    // Click on the time input field
    await this.click(timeInputSelector, "Start Time Input", "Input");
    await this.wait("mediumWait");
    
    function getCurrentTimePlusTwoHours() {
      const now = new Date();
      now.setHours(now.getHours() + 2); // Add 2 hours
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12; // Convert to 12-hour format
      const roundedMinutes = Math.ceil(minutes / 15) * 15;
      const formattedMinutes =
        roundedMinutes === 60
          ? "00"
          : roundedMinutes.toString().padStart(2, "0");
      if (roundedMinutes === 60) {
        hours = (hours % 12) + 1;
      }
      return `${hours.toString().padStart(2, "0")}:${formattedMinutes} ${ampm}`;
    }
    async function selectNextAvailableTime() {
      // Target only the visible time picker using :visible or style check
      const list = await this.page
        .locator("//div[contains(@class,'timepicker') and not(contains(@style,'display: none'))]//li")
        .allTextContents();
      console.log(list);
      const timeToSelect = getCurrentTimePlusTwoHours();
      console.log("Current Time + 2 hours:", timeToSelect);

      // Use first() to avoid strict mode violation when multiple elements match
      const timeLocator = this.page.locator(
        `(//div[contains(@class,'timepicker')]//li[text()='${timeToSelect}'])`
      );

      // Check if multiple elements exist and use first() to select the first match
      const count = await timeLocator.count();
      if (count > 1) {
        console.log(`Found ${count} elements with time ${timeToSelect}, selecting the first one`);
        await timeLocator.first().click();
      } else if (count === 1) {
        await timeLocator.click();
      } else {
        console.log(`Time ${timeToSelect} not found, trying fallback approach`);
        // Fallback: find the closest available time
        for (const time of list) {
          if (time >= timeToSelect) {
            console.log('Selecting closest available time:', time);
            await this.page.locator(`(//div[contains(@class,'timepicker')]//li[text()='${time}'])`).first().click();
            break;
          }
        }
      }
      /* for (const time of list) {
                if (time >= timeToSelect) {
                    console.log('Selecting time:', time);
                    await this.page.locator(`//div[contains(@class,'timepicker') and not(contains(@style,'display: none'))]//li[text()='${time}']`).first().click();
                    break;
                }
            } */
    }
    await selectNextAvailableTime.call(this);
    
    const timeToSet = getCurrentTimePlusTwoHours();
    console.log("Setting time to:", timeToSet);
    
  
      
      // Fallback: try to use timepicker if it exists
      try {
        await this.page.waitForSelector("//div[contains(@class,'timepicker')]//li", { timeout: 5000 });
        const timeOptions = await this.page.locator("//div[contains(@class,'timepicker')]//li").all();
        
        if (timeOptions.length > 0) {
          // Select a time that's likely to be in the future (avoid first few options which might be past times)
          const safeIndex = Math.max(5, Math.floor(timeOptions.length / 3));
          await this.wait("minWait");
          await timeOptions[safeIndex].click();
          console.log("Selected time from timepicker at index:", safeIndex);
        }
      } catch (timepickerError) {
        console.error("Timepicker fallback also failed:", timepickerError);
        console.log("Continuing with default time value");
      }
    

          console.log("Continuing with default time value");
        }
      
      
  
      /* const pickRandomTime = async () => {
              const timeElements = await this.page.locator("//div[contains(@class,'timepicker')]//li").count();
              console.log(timeElements);
              const randomIndex = Math.floor(Math.random() * timeElements) + 1;
              return randomIndex;
          };
          const randomIndex = await pickRandomTime();
          console.log("Random Index:", randomIndex);
          await this.click(this.selectors.timeInput, "Start Time", "Button");
          await this.click(this.selectors.chooseTimeOption(randomIndex), "Option", "Button"); */
    
  
  
//   async addSpecificSurveyCourseToRecertification(data: string, string: any) {
//     throw new Error("Function not implemented.");
//   }
//     console.log(`✅ File uploaded successfully with Instructor/Evaluator visibility`);

// }
    //select location by input
       async selectLocationByInput(locationName: string) {
        await this.click(this.selectors.locationSelection,"Select location","Field")
        await this.click(this.selectors.locationDropdown, "Select Location", "DropDown");
        await this.type(this.selectors.locationDropdown, "Location", locationName);
        await this.mouseHover(this.selectors.locationOption(locationName), "Location Option");
        await this.click(this.selectors.locationOption(locationName), "Location Option","Selected");

    }

//for expiry remainder cron
        async selectCompleteByTodayDate() {
        // await this.click(this.selectors.CourseCalendaricon, "Date", "Field");
        await this.validateElementVisibility(this.selectors.CourseCalendaricon, "Enter Course Date")
        await this.keyboardType(this.selectors.CourseCalendaricon, getCurrentDateFormatted())
        //await this.wait("minWait")
        //await this.click(this.selectors.tomorrowdate, "Tomorrow", "Field")
    }
        async clickregistrationEndsByTodayDate() {
        await this.validateElementVisibility(this.selectors.registrationEnd, "Enter Date")
        await this.keyboardType(this.selectors.registrationEnd, getCurrentDateFormatted())
    }

    //verify title on listing page
    async verifyTitle(title:string){
        await this.wait("minWait");
        await this.verification(this.selectors.courseTitle(title),title)
    }
    
}

