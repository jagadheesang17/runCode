import { Page, BrowserContext, expect } from "@playwright/test";
import { AdminHomePage } from "./AdminHomePage";
import {
  FakerData,
  getallRandomInstructor,
  getallRandomLocation,
  getCurrentDateFormatted,
  getFutureDate,
  getnextMonthFormatted,
  getPastDate,
  getRandomFutureDate,
  getRandomLocation,
  getRandomSeat,
  gettomorrowDateFormatted,
  score,
} from "../utils/fakerUtils";
import { getRandomItemFromFile } from "../utils/jsonDataHandler";
import { vi } from "date-fns/locale/vi";
import * as fs from "fs";
import * as path from "path";
import { filePath } from "../data/MetadataLibraryData/filePathEnv";
import { credentials } from "../constants/credentialData";

export class CoursePage extends AdminHomePage {
  public selectors = {
    ...this.selectors,
    createUserLabel: "//h1[text()='Create Course']",
    courseDescriptionInput: "//div[@id='course-description']//p",
    uploadDiv: "//div[@id='upload-div']",
    uploadInput: "//div[@id='upload-div']//input[@id='content_upload_file']",
    clickHereuploadFile: `(//label[text()='Click here'])[1]`,
    attachedContent: (fileName: string) =>
      `//label[text()='Attached Content']/following::span/following-sibling::div[text()='${fileName}']`,
    showInCatalogBtn: "//span[text()='Show in Catalog']",
    modifyTheAccessBtn:
      "//footer/following::button[text()='No, modify the access']",
    saveBtn: "//button[@id='course-btn-save' and text()='Save']",
    proceedBtn: "//footer//following::button[contains(text(),'Yes, Proceed')]",
    successMessage: "//div[@id='lms-overall-container']//h3",
    domainBtn: "//label[text()='Domain']/following::button[1]",
    //  domainOption: (domain_name: string) => `//div[@class='dropdown-menu show']//span[text()='${domain_name}']`,
    closeBtn: "//button[text()='Close']",
    courseLanguagesWrapper:
      "//label[contains(text(),'Language')]/following::div[@id='wrapper-course-languages']",
    courseLanguageInput: "//label[text()='Language']/following::input[1]",
    courseLanguageLink: (language: string) =>
      `(//label[text()='Language']//following::span[text()='${language}'])[1]`,
    selectCategoryBtn: "//div[contains(@id,'categorys')]//div[text()='Select']",
    categoryOption: (category: string) => `//span[text()='${category}']`,
    addCategoryBtn: "//div[text()='Add Category']",
    categoryInput:
      "//label[text()='Category']/following::input[@id='course-categorys']",
    okButton: "//button[text()='OK']",
    okBtn:
      "//span[contains(text(),'created successfully')]/following::button[text()='OK']",
    cancelBtn:
      "//label[text()='Category']/following::span[contains(@class,'lms-cat-cancel')]",
    providerDropdown: "//label[text()='Provider']//following-sibling::div",
    providerDropdownValue:
      "//label[text()='Provider']//following-sibling::div//div//a",
    providerOption: (provider: string) => `//a/span[text()='${provider}']`,
    providerIndexBase: (index: string) =>
      `(//label[text()='Provider']//following-sibling::div//a)[${index}]`,
    totalDurationInput:
      "(//label[text()='Total Duration']/following::input)[1]",
    additionalInfoInput:
      "//div[@id='additional_information_description_id']//p",
    priceInput: "//label[text()='Price']/following::input[1]",
    currencyDropdown: "//div[contains(@id,'currency')]",
    currencyOption:
      "//label[text()='Currency']/following::a/span[text()='US Dollar']",
    maxSeatsInput: "//label[text()='Seats-Max']/following::input[1]",
    contactSupportInput:
      "//label[text()='Contact Support']/following::input[1]",
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
    completeByRule:
      "(//div[@id='wrapper-course-complete-by-rule']//button | //div[@id='wrapper-program-complete-by-rule']//button)[1]",
    completeByRuleOption: `//footer/following-sibling::div//span[text()='Yes']`,
    // postCompleteByStatusField: "//div[@id='wrapper-course-post-complete-by-status']",
    postCompleteByStatusField:
      "//div[@id='wrapper-course-post-complete-by-status'] | //div[@id='wrapper-program-post-complete-by-status']",
    postCompleteByOption: "//footer/following::a/span[text()='Overdue']",
    courseInstancesField: "//div[@id='wrapper-course-instances']",
    instanceTypeOption: "//span[text()='Multi Instance/Class']",
    hideInCatalogCheckbox: "//span[contains(text(),'Hide in Catalog')]",
    saveInDraftCheckbox: "//span[contains(text(),'Save as Draft')]",
    deliveryTypeDropdown: "//div[@id='wrapper-course-delivery-type']",
    deliveryTypeOption: (deliveryType: string) =>
      `//span[text()='${deliveryType}']`,
    editCourseTabLink: "//a[text()='Edit Course']",
    addInstancesBtn: "//button[@id='course-btn-add-instances']",
    instanceDeliveryTypeField: "//div[@id='wrapper-instanceDeliveryType']",
    instanceDeliveryTypeOption: (delivery: string) =>
      `//footer/following::a/span[text()='${delivery}']`,
    instanceCountInput: "//div[@id='exp-course-instances-options']//input",
    createInstanceBtn: "//button[@id='instance-add']",
    sessionNameInput: "//label[text()='Session Name']/following-sibling::input",
    sessionNameIndex: (index: number) =>
      `(//label[text()='Session Name']/following-sibling::input)[${index}]`,

    instructorDropdown:
      "(//label[text()='Instructor']/following-sibling::div//input)[1]",
    instructorDropdownIndex: (index: number) =>
      `(//label[text()='Instructor']/following-sibling::div//input)[${index}]`,
    instructorOption: (instructorName: string) =>
      `//li[contains(text(),'${instructorName}')]`,
    instructorOptionIndex: (instructorName: string, index: number) =>
      `(//li[contains(text(),'${instructorName}')])[${index}]`,
    locationSelection:
      "//label[text()='Select Location']/following-sibling::div//input[1]",
    locationDropdown:
      "//label[text()='Select Location']/following-sibling::div//input[@placeholder='Search']",
    locationOption: (locationName: string) => `//li[text()='${locationName}']`,
    CourseCalendaricon: "//div[@id='complete_by_date']/input",
    tomorrowdate: "//td[@class='today day']/following-sibling::td[1]",
    nextMonth: `//div[@class='datepicker-days']//th[@class='next']`,
    calanderIcon:
      "(//label[text()='Date']//following::button[contains(@class,'calendaricon')])[1]",
    registrationEnd: `//div[@id='registration-ends']/input`,
    todayDate: "td[class='today day']",
    randomDate: `(//td[@class='day']/following-sibling::td)[1]`,
    seatMaxInput: "//label[text()='Seats-Max']/following-sibling::input",
    timeInput: `//label[text()='Start Time']/following-sibling::input`,
    chooseTimeOption: (randomIndex: string) =>
      `(//div[contains(@class,'timepicker')]//li)[${randomIndex}]`,
    chooseStartTimeIndex: (index: string, randomIndex: number) =>
      `((//ul[@class='ui-timepicker-list'])[${index}]/li)[${randomIndex}]`,
    waitlistInput: "//label[text()='Waitlist']/following-sibling::input",
    updateBtn: "//button[text()='Update']",
    detailsbtn: "//button[text()='Details']",
    courseUpdateBtn: "//button[@id='course-btn-save']",
    surveyAndAssessmentLink: "//button[text()='Survey/Assessment']",
    //surveyCheckBox: "//div[@id='sur_ass-lms-scroll-survey-list']//i[contains(@class,'fa-duotone fa-square icon')]", -->The XPath has been changed on the product side. We updated it on 10/7/2024
    surveyCheckBox:
      "//div[contains(@id,'scroll-survey-list')]//i[contains(@class,'fa-duotone fa-square icon')]",
    editCourseBtn: "//a[text()='Edit Course']",
    //assessmentCheckbox: "//div[@id='sur_ass-lms-scroll-assessment-list']//i[contains(@class,'fa-duotone fa-square icon')]", -->The XPath has been changed on the product side. We updated it on 10/7/2024
    assessmentCheckbox:
      "//div[contains(@id,'scroll-assessment-list')]//i[contains(@class,'fa-duotone fa-square icon')]",
    addAssessmentBtn: "//button[text()='Add As Assessment']",
    categoryDropdown:
      "//div[@class='dropdown-menu show']//input[@type='search']",
    allCategoryOptions: "//select[@id='course-categorys-exp-select']/option",
    providerOptions: "//select[@id='course-providers']/option",
    provider: (Options: string) => `(//span[text()='${Options}'])[1]`,
    progress: "//progress[@id='progress-bar'and@value='0']",
    addSurveyBtn: "//button[text()='Add As Survey']",
    deliveryLabel: "//label[text()='Delivery Type']",
    instructorInput:
      "//input[contains(@id,'instructors') and (@placeholder='Search')]",
    instructorInputIndex: (index: number) =>
      `(//input[contains(@id,'instructors') and (@placeholder='Search')])[${index}]`,
    //instance_Class: "//a[contains(@title,'Instance/Class')]", -->DOM Contented Changed 08-07-2024
    // instance_Class: "//a[contains(@title,'Instance Class') or contains(@aria-label,'Instance/Class')]", --> update on 18/07/2024
    instance_Class:
      "//a[contains(@title,'Instance Class') or contains(@aria-label,'Instance/Class') or contains(@title,'Instance/Class')]",
    clickContentLibrary:
      "//span[text()='Add Content']//following::span[text()='Click here'][1]",
    allContents: "//i[@class='fa-duotone fa-square icon_16_1']",
    contentIndex: (index: number) =>
      `(//i[contains(@class,'fa-duotone fa-square ico')])[${index}]`,
    addContentButton: "//button[text()='Add Content']",
    attachedContentLabel: "//label[text()='Attached Content']",
    getCourse: "//input[@id='course-title']",
    domainDropdown: "//a[@class='dropdown-item selected']",
    domainDropdownValue:
      "//label[text()='Domain']/following-sibling::div//div[contains(@class,'dropdown-menu')]//span[@class='text']",
    //domainDropdownIndex: (domain_index: number) => `(//a[@class='dropdown-item selected'])[${domain_index}]`,
    domainSelectedText: "//div[contains(text(),'selected')]",
    domainOption: (domain_name: string) =>
      `//div[@class='dropdown-menu show']//span[text()='${domain_name}']`,
    portalDropdown: `(//label[text()='Domain']/following::div)[1]`,
    allPortalOptions: `//label[text()='Domain']/following::div[@class='dropdown-menu show']//a`,
    portalOption: (index: string) =>
      `(//label[text()='Domain']/following::div[@class='dropdown-menu show']//a)[${index}]`,
    domainNameOption: (portalName: string) =>
      `//a[@class='dropdown-item']//span[text()='${portalName}']`,
    portal: `(//label[text()='Domain']/following::div[@id='wrapper-user-portals']//button)[1]`,
    image: "(//div[@class='img-wrapper']/img)[1]",
    clickHere: "//div[@class='form-label']/span",
    httpsInput: "input[id=content_url]",
    addURLBtn: "button:text-is('Add URL')",
    clickSaveasDraft:
      "//input[@id='draftcatalog']/parent::div//i[contains(@class,'fa-dot-circle')]",
    willResolveLaterBtn:
      "//footer//following::button[text()='No, will resolve later']",
    selectType: `//label[text()='Session Type']/following-sibling::div`,
    sessionType: "(//label[text()='Session Type']/parent::div//button)[1]",
    otherMeeting: "//span[text()='other Meetings']",
    sessionTypeIndex: (index: number) =>
      `(//label[text()='Session Type']/following-sibling::div)[${index}]`,
    attendeeUrlIndex: (index: number) =>
      `(//label[text()='Attendee URL']/following-sibling::input)[${index}]`,
    presenterUrlIndex: (index: number) =>
      `(//label[text()='Presenter URL']/following-sibling::input)[${index}]`,
    timeZoneIndex: (timeZone: number) =>
      `(//label[text()='Time Zone']/following-sibling::div//input)[${timeZone}]`,
    otherMeetingIndex: (othermeeting: number) =>
      `(//label[text()='Session Type']/following::div//span[text()='other Meetings'])[${othermeeting}]`,
    timeZoneOption: `(//label[text()='Time Zone']/following::div//input[@placeholder='Search'])[1]`,
    //  timeZoneOptionIndex:(timeOption:number) =>`(//label[text()='Time Zone']/following::div//input[@placeholder='Search'])[${timeOption}]`,
    // indianTimezoneIndex:(timezoneIndia:number)=> `(//li[contains(text(),'Indian Standard Time/Kolkata')])[${timezoneIndia}]`,
    indianTimezone: `//li[contains(text(),'Indian Standard Time/Kolkata')]`,
    Date: "(//label[contains(text(),'Date')]/following-sibling::div/input)[1]",
    startDateInstanceIndex: (index: number) =>
      `(//label[text()='Start Date']/following-sibling::div/input)[${index}]`,
    timeInputIndex: (index: number) =>
      `(//label[text()='Start Time']/following-sibling::input)[${index}]`,
    addDeleteIcon: `//label[text()='session add/delete']/following::i[contains(@class,'fad fa-plus')]`,
    domainInnerValue:
      "//label[text()='Domain']/parent::div//div[@class='filter-option-inner']/div",
    completionCertificationlink: "//span[text()='Completion Certificate']",
    loadMoreBtn:
      "//div[contains(@id,'scroll-certificat')]//button[text()='Load More']",
    certificateCheckboxCount:
      "//div[contains(@id,'scroll-certificat')]//i[contains(@class,'fa-duotone fa-circle icon')]",
    certificateCheckbox: (index: string) =>
      `(//div[contains(@id,'scroll-certificat')]//i[contains(@class,'fa-duotone fa-circle icon')])[${index}]`,
    addBtn: "//button[text()='Add']",
    certificationVerifyMessage:
      "//span[text()='Completion Certificate has been created successfully.']",
    accessBtn: "//span[text()='Access']//parent::button", //span[text()='Access'] -->lot of text has been created(12/8/2024)
    accessCloseIcon:
      "//label[text()='Learner Group']/parent::div//following-sibling::div[2]//div//i",
    MultiaccessCloseIcon:
      "(//label[text()='Learner Group']/parent::div//following-sibling::div[2]//div//i)[2]",
    accessUserInput:
      "//label[text()='User']/parent::div/following-sibling::div//input",
    saveAccessBtn: "//button[text()='Save Access']",
    enforceSequencingCheckbox:
      "//span[text()='Enforce Sequencing']/preceding-sibling::i[@class='fa-duotone fa-square']",
    // category:(categoryOption:string)=>`//div[@id='new-course-categorys']//following::select[@name='course-categorys-exp-select']/option[text()='${categoryOption}']`,
    assessmentLabel: "//div[text()='Assessment']",
    enforceSequence: `//span[text()='enforce launch sequence']/preceding-sibling::i[contains(@class,'fad fa-square ')]`,
    learnerGroup:
      "div[id$='learner-group-list'] button div[class='filter-option-inner-inner']",
    ceuLink: "//button[text()='CEU']",
    ceuProviderName:
      "(//label[text()='CEU Provider Name']/following-sibling::div//button)[1]",
    ceuProviderInnerValue:
      "div[id$='ceu-providers'] button div[class='filter-option-inner-inner']",
    ceuType: "(//label[text()='CEU type']/following-sibling::div//button)[1]",
    ceuTypeOption: (data: string) =>
      `//div[@id='wrapper-course-ceu-type']//span[text()='${data}']`,
    ceuProviderOption: (data: string) =>
      `//div[@id='wrapper-course-ceu-providers']//span[text()='${data}']`,
    ceuTypeInnerValue:
      "div[id$='ceu-type'] button div[class='filter-option-inner-inner']",
    unitInput: "//label[text()='Unit']/following-sibling::input",
    addCEUBtn: "//button[text()='Add CEU']",
    addedCEUData: "div[class='lms-ceu-wrapper'] div[class$='lms-scroll-pre']",

    vcSessionTypeDropDown:
      "//label[text()='Session Type']/following-sibling::div",
    vcMeetingType: (meetType: string) => `(//span[text()='${meetType}'])`,
    vcselectTimezone: "//label[text()='Time Zone']/following-sibling::div",
    vcSelectTimezoneClickSearch: "//input[@id='timezone_0']",
    vcSelectTimeZone: "//li[contains(@class,'dropdown-item text-wrap')]",

    //Course/TP Search:-
    crs_TPCode: "(//span[text()='CODE:']/following-sibling::span)[1]",
    crs_TPSearchField: "//input[@id='exp-search-field']",

    //Assessment Attach:-
    searchAssessmentField: "[id$='search-assessment-field']",
    surveySearchField: `[id$='ass-exp-search-field']`,

    //LearnerGroup Access modify
    learnerGroupbtn: `(//label[text()='Learner Group']//following::button)[1]`,
    allLearnerGroupOptions: `//select[@id='course-group-access-learner-group-list' or @id='program-group-access-learner-group-list']/option`,

    //course-currency list
    currencyListInCourse: `//select[@id='course-currency']/option`,

    //Instance Selection:-
    selectInstanceDropdown: `//button[@data-id='course-instances']`,
    instanceSelection: (instanceType: string) =>
      `//span[text()='${instanceType}']`,
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
    selectEquivalenceCourse: (course: string) =>
      `(//div[text()='${course}']//following::i[contains(@class,'fa-duotone fa-circle')])[1]`,
    addEquivalenceButton: `//button[text()='ADD AS Equivalence']`,
    saveEquivalenceButton: `(//button[text()='Save'])[1]`,
    equivalenceSuccessMessage: `//span[@class='rawtxt']//span[2]`,

    //To add a particular completion training to the Course/TP.
    clickCreatedCertificateCheckbox: (data: string) =>
      `(//div[text()='${data}']//following::i[contains(@class,'fa-duotone fa-circle icon')])[1]`,

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

    //filter by status in course listing page
    crsFilter: `//div[text()='Filters']`,
    statusDropdown: `//span[text()='Status']//following::div[text()='Select']`,
    selectStatus: (data: string) => `//span[text()='${data}']`,

    //Class enrollment E-Learn as an admin from the course edit page:-
    enrollElearn: `//a[@href="/admin/learning/enrollments/viewstatus"]//following::span[text()='Enrollments']`,
    //bulk class creation - manual
    NoOfClass: `//label[text()="Delivery Type"]/following::input[@type="text"]`,
    sessionNameInput_bulk: (i) =>
      `(//label[text()="Session Name"]/following::input[contains(@id,'instanceClassCode')])[${
        i + 1
      }]`,
    instructorDropdown_bulk: (i) =>
      `//input[@id="instructors_intance_${i}-filter-field"]`,
    instructorOption_bulk: (instructorName: string, i) =>
      `//input[@id="instructors_intance_${i}"]/following::li[contains(text(),'${instructorName}')]`,
    locationSelection_bulk: (i) =>
      `//input[@id="location_instance_${i}-filter-field"]`,
    locationDropdown_bulk: (i) => `//input[@id="location_instance_${i}"]`,
    locationOption_bulk: (locationName: string, i) =>
      `//input[@id="location_instance_${i}"]/following::li[text()='${locationName}']`,
    seatMaxInput_bulk: (i: any) => `//input[@id='instanceMaxSeats_${i}']`,
    timeInput_bulk: (i: any) =>
      `//input[@id="starttime_sesstime_instance_${i}"]`,
    instructorInput_bulk: (i: any) => `//input[@id="instructors_intance_${i}"]`,
    waitlistInput_bulk: (i: any) => `//input[@id='instanceWailtList_${i}']`,
    Date_bulk: (i) => `//input[@name="startdate_instance_${i}"]`,
    //bulk class creation - copy/paste
    sessionNameInput_Copy: `(//label[text()="Session Name"]/following::input[contains(@id,'instanceClassCode')])[1]`,
    instructorDropdown_Copy: `//input[@id="instructors_intance_0-filter-field"]`,
    instructorOption_Copy: (instructorName: string) =>
      `//input[@id="instructors_intance_0"]/following::li[contains(text(),'${instructorName}')]`,
    locationSelection_Copy: `//input[@id="location_instance_0-filter-field"]`,
    locationDropdown_Copy: `//input[@id="location_instance_0"]`,
    locationOption_Copy: (locationName: string) =>
      `//input[@id='location_instance_0']/following::li[text()='${locationName}']`,
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
    selectDays: (index: string) =>
      `(//select[contains(@name,'days')]//option)[${index}]`,
    daysOption: (days: string) => `//span[text()='${days}']`,
    endDate: `(//label[contains(text(),'End Date')]/following-sibling::div/input)[1]`,

    //Delete Course
    deleteCourse: `//span[text()='Delete Course']`,
    //Delete course conform pop-up
    removeButton: `//button[text()='Remove']`,
    cancelButton: `//button[text()='Cancel']`,

    //edit instance from course listing page
    instanceIcon: `//i[@aria-label='Instances']`,
    editInstanceFromCrsList: `//i[@aria-label='Instances']//following::i[@aria-label='Edit Course']`,

    //edit ILT/VC session
    editSession: `//span[@title='Edit']/child::i`,
    updateSession: `//span[@title='Update']`,

    editCourseFromListingPage: `//i[@class='position-absolute top-0 end-0 fa-duotone icon_14_1 p-2 pointer mt-1 me-1 background_3 fa-pen']`,
    checkContactSupport: `//input[@id='course-contact-support']`,
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

  //Bulk class creation
  async bulkClassCreation(classNos: any, mode: "manual" | "copy/paste",title:string) {
    await this.click(this.selectors.NoOfClass, "TextBox", "click");
    await this.keyboardType(this.selectors.NoOfClass, classNos);
    await this.clickCreateInstance();
    switch (mode) {
      case "manual":
        // const totalClasses = parseInt(classNos);
        const allSessionNames: string[] = [];

        for (let i = 0; i < classNos; i++) {
          let str=title+"_"+FakerData.getSession();
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
          }
        }
        const filePath = path.join(__dirname, '../data/instanceNames.json');
                fs.writeFileSync(filePath, JSON.stringify(allSessionNames, null, 2), 'utf-8');

        await this.checkConflict();
        //console.log("next");
        break;
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
          `(//div[contains(@class,'timepicker')]//li[text()='${timeToSelect}'])[${
            i + 1
          }]`
        )
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

  //edit instance on course edit page
  async clickEditInstance() {
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
    let value = await this.page.locator(this.selectors.crs_TPCode).innerHTML();
    return value;
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
    await this.wait("minWait");
    await this.verification(this.selectors.successMessage, "successfully");
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
    await this.spinnerDisappear();
    const closeButton = this.page.locator(this.selectors.closeBtn);
    await this.wait("mediumWait");
    if (await closeButton.isVisible()) {
      await closeButton.click({ force: true });
    }
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

  async selectDaysfromEnrollment() {
    await this.click(
      this.selectors.chooseTimeOption("Days from Enrollment"),
      "Days from Enrollment",
      "Dropdown"
    );
  }

  async selectDaysfromHire() {
    await this.click(
      this.selectors.chooseTimeOption("Days from Hire"),
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
    await this.validateElementVisibility(
      this.selectors.addInstancesBtn,
      "Add Instances"
    );
    await this.mouseHover(this.selectors.addInstancesBtn, "Add Instances");
    await this.click(this.selectors.addInstancesBtn, "Add Instances", "Button");
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

  async selectLocation() {
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
    const date = gettomorrowDateFormatted();
    await this.keyboardType(this.selectors.Date, date);
  }

  async enterpastDateValue() {
    const date = getPastDate();
    await this.keyboardType(this.selectors.Date, date);
  }
  async enterfutureDateValue() {
    const date = getFutureDate();
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

  public async startandEndTime() {
    await this.click(this.selectors.timeInput, "Start Time Input", "Input");
    await this.wait("minWait");
    /* const list = await this.page.locator("(//div[contains(@class,'timepicker')]//li)").allTextContents();
        console.log(list); */
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
          `(//div[contains(@class,'timepicker')]//li[text()='${timeToSelect}'])`
        )
        .click();
      /* for (const time of list) {
                if (time >= timeToSelect) {
                    console.log('Selecting time:', time);
                    await this.page.locator(`(//div[contains(@class,'timepicker')]//li[text()='${time}'])`).click();
                    break;
                }
            } */
    }
    await selectNextAvailableTime.call(this);

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
  }
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
    await this.mouseHover(this.selectors.editCourseBtn, "editcourse");
    await this.click(this.selectors.editCourseBtn, "editcourse", "button");
    await this.wait("mediumWait");
  }

  async clickinstanceClass() {
    await this.wait("mediumWait");
    await this.page.waitForSelector(this.selectors.instance_Class);
    await this.click(
      this.selectors.instance_Class,
      "Edit Instance Class",
      "Button"
    );
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
      | any
  ) {
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
    await this.click(
      this.selectors.assessmentCheckbox,
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

  async providerDropdown() {
    await this.click(this.selectors.providerDropdown, "dropdown", "button");
    const providerElements = this.page.locator(
      this.selectors.providerDropdownValue
    );
    //  const randomIndex = Math.floor(Math.random() * await providerElements.count());
    const randomIndex =
      Math.floor(Math.random() * ((await providerElements.count()) - 1)) + 1;
    // await this.click(this.selectors.providerDropdown, "dropdown", "button")
    await this.click(
      this.selectors.providerIndexBase(randomIndex),
      "option",
      "button"
    );
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

  async selectMeetingType(
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
      gettomorrowDateFormatted()
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
    const closeIcon = this.page.locator(this.selectors.accessCloseIcon);
    const count = await closeIcon.count();
    console.log(count);
    console.log("learner groups : " + count);
    for (let i = 1; i < count; i++) {
      await this.mouseHover(this.selectors.MultiaccessCloseIcon, "close Icon");
      await this.page
        .locator(this.selectors.MultiaccessCloseIcon)
        .click({ force: true });
      await this.page.waitForTimeout(100);
    }
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

  async uploadVideoByLink(videoUrl: string) {
    await this.mouseHover(this.selectors.httpsInput, "https input");
    await this.keyboardType(this.selectors.httpsInput, videoUrl);
    await this.wait("minWait");
    await this.click(this.selectors.addURLBtn, "Add URL", "Button");
    await this.wait("maxWait");
  }

  async specificLearnerGroupSelection(learnerGroupName: string) {
    // await this.wait('minWait')
    // if (await this.page.locator(this.selectors.modifyTheAccessBtn).isVisible({ timeout: 10000 })) {
    //     await this.mouseHover(this.selectors.modifyTheAccessBtn, "No, Modify The Access");
    //     await this.click(this.selectors.modifyTheAccessBtn, "No, Modify The Access", "Button");
    // }
    // await this.spinnerDisappear();
    // await this.wait("mediumWait")
    // await this.click(this.selectors.learnerGroupbtn, "Portal", "dropdown");
    // for (const options of await this.page.locator(this.selectors.allLearnerGroupOptions).all()) {
    //     const value = await options.innerText();
    //     console.log(value)
    //     if (value !== learnerGroupName) {

    //         await this.page.locator(`//footer//following::span[@class='text' and text()='${value}']`).nth(0).click();
    //     }
    // }
    // await this.click(this.selectors.learnerGroupbtn, "Portal", "dropdown");
    await this.spinnerDisappear();
    await this.wait("mediumWait");
    await this.click(this.selectors.learnerGroupbtn, "Portal", "dropdown");
    for (const options of await this.page
      .locator(this.selectors.allLearnerGroupOptions)
      .all()) {
      const value = await options.innerText();
      console.log(value);
      if (value !== learnerGroupName) {
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
}
