import { Page, expect, BrowserContext } from "@playwright/test";
import { LearnerHomePage } from "./LearnerHomePage";
import { FakerData, getCCnumber, getPonumber } from "../utils/fakerUtils";
import { saveDataToJsonFile } from "../utils/jsonDataHandler";
import { Certificate } from "crypto";
import { th } from "@faker-js/faker";
//import { VideoPlayer } from "../utils/videoplayerUtils";
//import { playAndForwardVideo } from "../utils/videoplayerUtils";

export class CatalogPage extends LearnerHomePage {
  public selectors = {
        ...this.selectors,
        searchInput: `//input[@id="exp-searchcatalog-search-field"]`,
        searchlearningInput: `//input[@id="exp-searchenr-search-field"]`,
        mostRecentMenuItem: `//div[text()="Most Recent"]`,
        createdCourse: ` //div[text()='Most Recent']/following::li[1]`,
        moreButton: (course: string) => `(//div[text()="${course}"]/following::a/i)[1]`,
        enrollIcon: `//div[text()='Most Recent']//following::i[contains(@class,'tooltipIcon fa-duotone')][1]`,
        courseToEnroll: (course: string) => `//span[text()='${course}']//following::i[contains(@class,'fa-circle icon')]`,
        selectCourse: (course: string, index: number) => `(//span[text()='${course}']//following::i[contains(@class,'fa-circle icon')])[${index}]`,
        enrollButton: `//span[text()='Enroll']`,
        requestApproval: `//span[text()='Request approval']`,
        approvalcostcenter: `//input[@id='cc']`,
        submitRequest: `//button[text()='Submit request']`,
        closeBtn: `(//button[text()='Close'])[1]`,
        //launchButton:`//button[text()="Launch Content"]`,
        completedButton: `//a[contains(text(),"Completed")]`,
        completedCourse: (name: string) => `(//*[text()="${name}"])[1]`,
        filterField: `//h1[text()='Catalog']/following::div[text()='Filters']`,
        // searchButton: `(//span[text()='Tags']/following::div[text()='Select'])[1]`,
        searchButton:`//input[contains(@id,'catalog_search')]`,
        // selectTagnames: `//div[contains(@class,'dropdown-menu show')]//input`,

        selectTagnames:`//input[@id='catalog_search_tags']`,
        // reultantTagname: (tagname: string) => `//a[contains(@class,'dropdown-item active')]//span[text()='${tagname}']`,
        resultantTagname:(tagname: string) =>`//li[text()='${tagname}']`,
        applyButton: `//button[text()='Apply']`,
        viewCourseDetails: `//button[text()='View Course Details']`,
        launchButton: `(//div//i[@aria-label='Click to play'])[1]`,
        saveLearningStatus: "//button[text()='Save Learning Status']",
        verificationEnrollment: "//span[text()='View Certificate']",
        unsupportMedia: "//div[contains(text(), 'The media could not be loaded')]",
        posterElement: `//button[@class='vjs-big-play-button']//span[1]`,
        viewCertificationDetailsBtn: "//button[text()='View Certification Details']",
        viewlearningPathDetailsBtn: "//button[text()='View Learning Path Details']",
        viewCertificateBtn: "//div[text()='modules/courses']/parent::div//span[text()='View Certificate']",
        okBtn: "//button[text()='Ok']",
        addToCart: `//span[text()='Add to cart']`,
        contentLaunchBtn: "//button//span[text()='Launch']",
        contentsLabel: "//button[text()='Save Learning Status']//following::span[contains(text(),'Content')]",
        completedVideo: "//span[text()='100%']",
        expiredContent: "//span[text()='Expired']",
        recertifyBtn: "//span[text()='Recertify']",
        shoppingCardIcon: "//div[@aria-label='shopping cart']//i[contains(@class,'cart-shopping')]",
        addedToCartBtn: "//span[text()='Added to Cart']",
        proceedToCheckoutBtn: "//button[text()=' Proceed to checkout']",
        resultNotFound: `(//div[@id='most_recent']/following::div[text()='No results found.'])[1]`,
        checkBox: `//i[contains(@class,'fa-circle icon') ]`,
        RadioBtn: `//i[contains(@class,'fa-square icon')]`,
        assessmentDropdown: `[id^='wrapper-ques'] button[data-bs-toggle='dropdown']`,
        questionInput: `div[class='question-wrapper'] input[type=text]`,
        starIcon: `//i[contains(@class,'fa-star icon')]`,
        submitMyAnswerBtn: `div[class^='pagination-wrapper'] span:text-is('Submit my Answers')`,
        submitSurveyBtn: `div[class^='pagination-wrapper'] span:text-is('submit survey')`,
        filterDeliverytype: (delivery: string) => `//span[text()='${delivery}']/preceding-sibling::i[1]`,
        multiInstancefilter: `(//div[text()='Filters'])[1]`,
        clickPlayIcon: `(//a[contains(@class,'launch-content')])[1]`,
        //doneBtn: `//span[text()='done']`, --> Element has been changed (06/08/2024)
        //doneBtn: `//button[text()='Done']`,
        doneBtn: `//i[contains(@class,'fa-circle-check icon')]//following::button[text()='Done']`,
        //recievedScore: `//span[text()='Score:']//parent::div`, Element has been changed (06/08/2024)
        //recievedScore: `//div[contains(text(),'Score:')]`
        recievedScore: `//i[contains(@class,'fa-circle-check icon')]//following::div[contains(text(),'Score:')]`,
        surveyPlayBtn: "//i[contains(@class,'fa-file-edit')]//parent::div//following-sibling::div//i",
        noCertificate: "//span[text()='Completion certificate not attached to this training.']",
        certificateCloseIcon: "//i[contains(@class,'pointer ms-auto')]",
        secondaryCourse: (course: string) => `//div[contains(text(),'${course}')]`,
        completePreviousContent: "//div[contains(text(),'You need to complete the previous content')]",
        recommendationLink: `//a[text()='Recommendations']`,
        verifyRecommendCourse: (course: string) => `//div[text()='${course}']`,
        overDueText: "//*[text()='Overdue']",
        contentLabel: `//span[contains(text(),'Content')]`,
        surveyDoneButton: `//div[text()='Thank you for completing the survey.']/following::button[text()='Done']`,

        //Negative Assessment 
        negAnsDoneButton: `//div[text()="Sorry! You didn't pass the assessment."]//following::button[text()='Done']`,

        //TP-Reenroll
        reenrollbutton: `//span[text()='re-enroll']`,
        incompleteText: `//*[text()='Incomplete']`, //Arivu is changed from span to *
        tpCompletedText: `//span[text()='Completed']`,
        tpPreAssbutton: `//span[text()='Pre Assessment ']//parent::div//span[text()='Launch']`,
        tpPostAssbutton: `//span[text()='Assessment/Survey ']//parent::div//span[text()='Launch']`,
        tpCourseExpandIcon: `//i[contains(@class,'fa-chevron-down fa')]`,

        // Catalog-No results found message:-
        noResultFound_MostRecent: `//div[@id='most_recent']//div[text()='No results found.']`,

        //Survey 
        textareaInput: `textarea[class^='form-control']`,
        sumbitSurveyBtn: `//span[text()='submit survey']`,

        //TP Course Filter:-
        clickTPCourseFilter: `//div[text()='Filters']`,
        clickTPCourseDeliveryFilter: (data: string) => `(//span[text()='${data}']//preceding-sibling::i)[2]`,
        clickTPCourseApplyButton: `//button[text()='Apply']`,
        selectTPCourse: `//div[contains(text(),'Seats')]//following::div[contains(@class,'custom-radio')]`,
        clickTPSelectedCourseRegisterButton: `//button[contains(text(),'Enroll')]`,

        toCompleteORCompleteEnrolledCourse: `(//*[(@id='carousel-completed' or @id='carousel-tocomplete')]//h5[starts-with(@class, 'card-title')])[1]`,
        //completeEnrolledCourse: `#carousel-completed h5[class^='card-title']`,
        enrolledCourseCode: `//span[contains(text(),'code:')]/following-sibling::span`,

        //Video Content:-
        endVideoTime: `//span[text()='0:00' and @class='vjs-remaining-time-display']`,

        //MyLearning:-
        noResultFound: `//div[text()='No results found.']`,
        courseIncompleteText: `//div[text()='In complete']`,
        mylearningViewClassDetails: (clsTitle: string) => `(//h5[text()='${clsTitle}'])`, //To navigate to class details
        mandatoryText: `//div[text()='Mandatory']`,
        contentPlayBtn: `(//i[@aria-label='Click to play'])[1]`,

        //admin enrollments:-
        noResultFound_Mylearning: `//div[text()='No results found.']`,

        //myLearningClassCancel:-
        mylearningClassCancel: ` //span[text()='Cancel Enrollment']`,
        mylearningcancelreason: `//input[@id='cancel_reason']`,
        mylearningyesbutton: `//button[text()='Yes']`,
        mylearningcancelverification: `//span[text()='Canceled']`,
        mandatoryAlertMessage: `//span[text()='This training is Mandatory and cannot be canceled']`,

        //myLearningChangeClass:-
        mylearningChangeClass: `//span[text()='Change Class/Instance']`,

        //click course on details page for prerequisite
        clickCourseDetailsPage: (course: string) => `//span[contains(@class,'field_title') and text()='${course}']`,

        //Confirmation popup for Equivalence course
        confimationPopupEql: (option: string) => `//span[contains(text(),'You have been granted completion')]//following::button[text()='${option}']`,
        grantedMessageForEql: `//span[@class='rawtxt']//span[2]`,

        //Prerequisite mandatory message
        prerequisiteMandatoryMessage: `//div[contains(@class,'ustify-content-center information_text')]//span`,

        //verify thumbnail img
        thumbnailImgSrc: `//div[contains(@class,'card-body')]//img`,

        //content play based on name
        contentPlay: (contentName: string) => `(//div[text()='${contentName}']//following::i[@aria-label='Click to play'])[1]`,
        statusOnDetailsPage: `//div[contains(@class,'card-header')]//span`,

        //verifyTPOverallProgress:-
        tpOverallProgressPercentage: `(//div[text()='About This Course']//following::span[contains(@class,'progress__value')])[1]`,

        //To verify TP course status whether completed/incompleted
        tpCourseStatus: (data: string, status: string) => `(//span[contains(text(),'${data}')]//following::div[text()='${status}'])[1]`,

        //Verifying attached content progress value in course details page
        contentProgressValue: (data: string) => `(//div[text()='${data}']//following::span[contains(@class,'progress__value')])[1]`,

        //catalog items
        learnWithinMins: `//div[text()="Learn within 30 mins"]`,
        watchItAgain: `//div[text()="Watch it again"]`,
        //verifyContentValdity
        ContentExpireCheck: `//span[text()=" can no longer be launched as the validity has expired or there are no attempts left."]`,

        //Bookmark Functionality:-
        specificContentBookmark: (clsName: string) => `//div[text()='${clsName}']/following::i[contains(@id,'bookmark')]`,
        // classBookmark:`//div[@id='enrolled_catalog']//span/i[@aria-label='Bookmark']`
        classBookmark: (clsName: string) => `(//span[text()='${clsName}']//following::i[contains(@aria-label,'Bookmark')])[1]`,

        //Verifying no seats left message on leaner side
        noSeatLeftPopupMsg: `//div[contains(@class,'information_text')]//span`,
        seatFullOnDetailsPage: (courseName: string) => `(//span[text()='${courseName}']//following::span[contains(@class,'rawtxt ')])[1]`,
        selectCourseRadioBtn: (courseName: string) => `(//span[text()='${courseName}']//following::div[contains(@class,'custom-radio')])[1]`,
        //for selecting second course in program module
        clickNextCourse: (data: string) => `//span[contains(text(),'${data}')]`,
        //recurring session creation
        sessionConflictPopup: `//span[contains(text(),'Session has conflict')]`,

        DCLNotEnrolledMessage: "//span[contains(text(), 'You are not enrolled in the class')]",

            clickCourse:(data: string) =>`(//div[text()='${data}'])[1]`,

            costcenterValue:`//input[@id='cc']`


    };
  constructor(page: Page, context: BrowserContext) {
    super(page, context);
  }

  //Play Assessment Video:-
  async playAssessmentVideo() {
    //jagadish
    await this.page.evaluate(() => {
      return Promise.all(
        Array.from(document.querySelectorAll("video")).map((video) => {
          return new Promise<void>((resolve) => {
            video.muted = true;
            video.play();
            video.onended = () => resolve();
            if (video.ended) {
              resolve();
            }
          });
        })
      );
    });
  }

  //To Bookmark specific content:-
  async bookmarkSpecificContent(contName: any) {
    await this.spinnerDisappear();
    await this.wait("mediumWait");
    await this.validateElementVisibility(
      this.selectors.specificContentBookmark(contName),
      "Content Bookmark Icon"
    );
    await this.click(
      this.selectors.specificContentBookmark(contName),
      "Bookmarked the content",
      "Icon"
    );
  }
  //To Bookmark the class:-
  async bookmarkClass(clsName: string) {
    await this.spinnerDisappear();
    await this.wait("mediumWait");
    await this.validateElementVisibility(
      this.selectors.classBookmark,
      "Class Bookmark Icon"
    );
    await this.click(
      this.selectors.classBookmark(clsName),
      "Bookmarked the Class",
      "Icon"
    );
  }

  //To register the course from learnWithin30Mins section
  async learnWithin30Mins() {
    await this.validateElementVisibility(
      this.selectors.learnWithinMins,
      "Learn within 30 mins"
    );
    await this.mouseHover(
      this.selectors.learnWithinMins,
      "Learn within 30 mins"
    );
  }

  //To launch the already completed course from watchItAgain section
  async watchItAgain() {
    await this.validateElementVisibility(
      this.selectors.watchItAgain,
      "Learn within 30 mins"
    );
    await this.mouseHover(this.selectors.watchItAgain, "Learn within 30 mins");
  }

  //launchContentFromMylearningListingPage
  async launchContentFromMylearning() {
    await this.wait("mediumWait");
    await this.validateElementVisibility(
      this.selectors.contentPlayBtn,
      "Content Play"
    );
    await this.click(this.selectors.contentPlayBtn, "Content Play", "Button");
  }

  //Verifying attached content progress value in course details page
  async verifyContentProgressValue(contentName: string) {
    await this.wait("minWait");
    await this.verification(
      this.selectors.contentProgressValue(contentName),
      "100%"
    );
  }

  //verifyTPOverallProgress:-
  public async verifyTPOverallProgressPercentage() {
    await this.verification(this.selectors.tpOverallProgressPercentage, "100%");
  }
  //To verify TP course status whether completed/incompleted
  public async verifytpCourseStatus(data: string, status: string) {
    await this.verification(
      this.selectors.tpCourseStatus(data, status),
      status
    );
  }

  public async clickEqlConfirmationPopup(option: string) {
    await this.validateElementVisibility(
      this.selectors.confimationPopupEql(option),
      "Equivalence Confirmation PopUp"
    );
    await this.click(
      this.selectors.confimationPopupEql(option),
      "Equivalence Confirmation PopUp",
      "Button"
    );
    await this.wait(`maxWait`);
  }
  public async verifyEquivalenceGrantedMessage() {
    await this.verification(
      this.selectors.grantedMessageForEql,
      "YOU HAVE BEEN GRANTED COMPLETION FOR THIS COURSE"
    );
  }
  public async verifyPrerequisiteMandatoryMessage(data?: string) {
    if (data == "Training Plan") {
      await this.verification(
        this.selectors.prerequisiteMandatoryMessage,
        "prerequisite training needs to be completed."
      );
      await this.click(
        this.selectors.okBtn,
        "Prerequisite Mandatory Message",
        "Button"
      );
    } else {
      await this.verification(
        this.selectors.prerequisiteMandatoryMessage,
        "Prerequisite course needs to be completed."
      );
      await this.click(
        this.selectors.okBtn,
        "Prerequisite Mandatory Message",
        "Button"
      );
    }
  }

  //To register Prereq/Equilance course from the course details page.
  public async clickCourseOnDetailsPage(courseName: string) {
    await this.validateElementVisibility(
      this.selectors.clickCourseDetailsPage(courseName),
      "Link"
    );
    await this.click(
      this.selectors.clickCourseDetailsPage(courseName),
      "My Learning",
      "Link"
    );
    await this.page.waitForLoadState("load");
  }

  //learner switches from one class to another class
  async changeClass() {
    await this.wait("mediumWait");
    await this.click(
      this.selectors.mylearningChangeClass,
      "Change Class Option",
      "Link"
    );
  }
  //Change class confirmation:-
  async verifyChangeClass() {
    let result = await this.page
      .locator(this.selectors.okBtn)
      .nth(0)
      .innerText();
    expect(result).toContain("Success");
    await this.click(this.selectors.okBtn, "Confirm Popup", "Button");
  }

  async playVimeo() {
    //This method will allow the video to play until it reaches 0 seconds remaining.

    await this.page.waitForLoadState("load");
    await this.wait("maxWait");
    await this.spinnerDisappear();
    let content = this.page.locator(this.selectors.contentLabel);
    if (await content.isVisible({ timeout: 20000 })) {
      await this.wait("mediumWait");
      await content.scrollIntoViewIfNeeded();
    }
    const playButton = "//button[@title='Play Video']";
    await this.page.locator(playButton).hover({ force: true });
    await this.page.focus(playButton, { strict: true });
    await this.page.click(playButton, { force: true });
    await this.wait("mediumWait");
    let videoCompletion = this.page.locator(this.selectors.endVideoTime);
    await expect(videoCompletion).toHaveCount(1, { timeout: 60000 });
  }

  async verifyEnrolledCourseByTitle(couseName: string) {
    await this.wait("minWait");
    await this.click(
      this.selectors.toCompleteORCompleteEnrolledCourse,
      couseName,
      "Link"
    );
    await this.spinnerDisappear();
  }

  //Navigate to the course details from my learning:-
  async mylearningViewClassDetails(clsTitle: string) {
    await this.click(
      this.selectors.mylearningViewClassDetails(clsTitle),
      "MyLearning Class Title",
      "Link"
    );
  }

  //Mandatory text verification:-
  async mandatoryTextVerification() {
    let result = await this.page
      .locator(this.selectors.mandatoryText)
      .nth(0)
      .innerText();
    expect(result).toContain("MANDATORY");
  }

  async tpCourseSearch(data: string) {
    await this.click(
      this.selectors.clickTPCourseFilter,
      "Filter",
      "TP Course Filter Link"
    );
    await this.click(
      this.selectors.clickTPCourseDeliveryFilter(data),
      "Filter",
      "Checkbox"
    );
    await this.click(
      this.selectors.clickTPCourseApplyButton,
      "TP Course Filter Apply",
      "Button"
    );
    await this.wait("minWait");
  }

  async mylearningNoResultsFound() {
    await this.validateElementVisibility(
      this.selectors.noResultFound,
      "No Result Found"
    );
    let result = await this.page
      .locator(this.selectors.noResultFound)
      .nth(0)
      .innerText();
    expect(result).toContain("No results found");
  }

  async mylearningClassCancel() {
    await this.wait("minWait");
    await this.click(
      this.selectors.mylearningClassCancel,
      "Cancel Enrollment",
      "Button"
    );
    await this.type(
      this.selectors.mylearningcancelreason,
      "Cancel Reason",
      "Simply cancelling the record"
    );
    await this.click(
      this.selectors.mylearningyesbutton,
      "Yes button",
      "Button"
    );
    await this.wait("maxWait");
    let result = await this.page
      .locator(this.selectors.mylearningcancelverification)
      .nth(0)
      .innerText();
    expect(result).toContain("CANCELED");
  }

  async mylearningMandatoryClassCancel() {
    await this.wait("minWait");
    await this.click(
      this.selectors.mylearningClassCancel,
      "Cancel Enrollment",
      "Button"
    );
    let result = await this.page
      .locator(this.selectors.mandatoryAlertMessage)
      .nth(0)
      .innerText();
    expect(result).toContain(
      "This training is Mandatory and cannot be canceled"
    );
  }

  async tpCourseSelection() {
    await this.wait("minWait");
    await this.click(
      this.selectors.selectTPCourse,
      "TP Course Selection",
      "Radio Button"
    );
  }

  async tpSelectedCourseRegister() {
    await this.click(
      this.selectors.clickTPSelectedCourseRegisterButton,
      "TP Selected Course Selection",
      "Button"
    );
    await this.wait("mediumWait");
  }
  async searchCatalog(data: string) {
    await this.wait("minWait");
    const searchSelector = this.selectors.searchInput;
    await this.type(searchSelector, "Search Field", data);
    await this.keyboardAction(searchSelector, "Enter", "Input", "Search Field");
    await this.page.waitForTimeout(10000);
  }

  async noResultFound() {
    await this.validateElementVisibility(
      this.selectors.noResultFound_MostRecent,
      "No Result Found"
    );
    let result = await this.getInnerText(
      this.selectors.noResultFound_MostRecent
    );
    expect(result).toContain("No results found");
    await this.wait("mediumWait");
  }

  async clickRecommendation() {
    await this.click(
      this.selectors.recommendationLink,
      "Recommendations",
      "Link"
    );
  }

  async verifyCourserecommemnded(course: string) {
    this.validateElementVisibility(
      this.selectors.verifyRecommendCourse(course),
      "course"
    );
    await this.mouseHover(this.selectors.verifyRecommendCourse(course), "Text");
  }

  async cronstoragejson(filepath: string, data: string) {
    saveDataToJsonFile(filepath, data);
  }

  async mostRecent() {
    await this.page.keyboard.press("PageDown");
    await this.wait("minWait");
    await this.page.keyboard.press("PageDown");
    await this.validateElementVisibility(
      this.selectors.mostRecentMenuItem,
      "Most Recent"
    );
    await this.mouseHover(this.selectors.mostRecentMenuItem, "Most Recent");
  }

  async verifyOverdue(data: string) {
    await this.wait("maxWait");
    await this.mouseHover(
      this.selectors.completedCourse(data),
      "Overdue Course/TP"
    );
    await this.validateElementVisibility(this.selectors.overDueText, "Overdue");
    await this.verification(this.selectors.overDueText, "Overdue");
  }

  async vertifyTPIncomplete(data?: string) {
    await this.wait("maxWait");
    // await this.mouseHover(this.selectors.completedCourse(data), "Incomplete Course/TP");
    await this.validateElementVisibility(
      this.selectors.incompleteText,
      "Incomplete"
    );
    await this.verification(this.selectors.incompleteText, "Incomplete");
  }

  async verifyCourseIncomplete(data: string) {
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.courseIncompleteText,
      "In complete"
    );
    await this.verification(this.selectors.courseIncompleteText, "In complete");
  }

  async clickMoreonCourse(courseName: string) {
    await this.wait("minWait");
    await this.mouseHover(
      this.selectors.clickCourse(courseName),
      "More on Course"
    );
    await this.click(
      this.selectors.clickCourse(courseName),
      "More on Course",
      "icon"
    );
  }
  async clickcourseTypeFilter() {
    await this.click(
      this.selectors.multiInstancefilter,
      "Filter Delivery type",
      "checkbox"
    );
  }

  async clickEnrollButton() {
    await this.page
      .locator(this.selectors.createdCourse)
      .scrollIntoViewIfNeeded();
    const enrollButtonSelector = this.selectors.enrollIcon;
    await this.page.locator(enrollButtonSelector).scrollIntoViewIfNeeded();
    await this.validateElementVisibility(enrollButtonSelector, "Course");
    await this.click(enrollButtonSelector, "Enrolling Course", "Button");
    await this.page.waitForLoadState();
  }

  async clickSelectcourse(course: string) {
    await this.wait("mediumWait");
    const count = await this.page
      .locator(this.selectors.courseToEnroll(course))
      .count();
    const randomIndex = Math.floor(Math.random() * count) + 1;
    await this.click(
      this.selectors.selectCourse(course, randomIndex),
      "Checkbox",
      "Button"
    );
  }

  async clickEnroll() {
    await this.click(this.selectors.enrollButton, "Enroll", "Button");
    await this.spinnerDisappear();
    const cancelEnrollmentBtn = this.page.locator(
      "//span[text()='Cancel Enrollment']"
    );
    await this.wait("maxWait");
    // await this.validateElementVisibility(cancelEnrollmentBtn, "Cancel Enrollement");
    /* this.page.on('console', msg => {
            console.log(`Console Log: ${msg.text()}`);
        }); */
  }
  async clickRequestapproval() {
    await this.click(
      this.selectors.requestApproval,
      "Request Approval",
      "Button"
    );
  }

  async clickRequestClass() {
    await this.validateElementVisibility(
      this.selectors.requestClass,
      "Request Class"
    );
    await this.click(
      this.selectors.requestClass,
      "Request Class",
      "Button"
    );
  }



  async requstcostCenterdetails() {
    await this.validateElementVisibility(
      this.selectors.approvalcostcenter,
      "Approval POPup"
    );
    await this.type(
      this.selectors.approvalcostcenter,
      "Approval POPup",
      getCCnumber()
    ); //const center number of 10 digits
    await this.click(this.selectors.submitRequest, "Submit Request", "Button");
    await this.click(this.selectors.closeBtn, "Close", "Button");
  }

  async clickRecertify() {
    await this.validateElementVisibility(
      this.selectors.recertifyBtn,
      "Recertify"
    );
    await this.click(this.selectors.recertifyBtn, "Recertify", "Button");
    await this.validateElementVisibility(
      this.selectors.viewCertificateBtn,
      "View Certificate"
    );
    await this.page
      .locator(this.selectors.completedVideo)
      .scrollIntoViewIfNeeded({ timeout: 5000 });
    await this.wait("mediumWait");
  }

  //Recertification button click:-
  async clickRecertifyButton() {
    await this.validateElementVisibility(
      this.selectors.recertifyBtn,
      "Recertify"
    );
    await this.click(this.selectors.recertifyBtn, "Recertify", "Button");
    //await this.page.waitForTimeout(20000)
    await this.wait("maxWait");
    await this.page.reload(); //Added by Arivu temporarily to avoid the error "Recertification button is not clickable"
    await this.page.waitForLoadState("load");
  }
  // async clickLaunchButton() {

  //    // playAndForwardVideo(this.selectors.launchButton)
  //     const launchButtonSelector = this.selectors.launchButton;
  //     await this.validateElementVisibility(launchButtonSelector,"Play Button");
  //     await this.mouseHover(launchButtonSelector, "Launch Button")
  //     await this.click(launchButtonSelector, "Launch Button", "Button");
  //     try {
  //         await this.wait('mediumWait');
  //         await this.validateElementVisibility("//span[text()='0:00']", "time")
  //     } catch (error) {
  //         console.log("Its not a video content")

  //     }
  // }

  // async saveLearningStatus(){
  //     await this.click(this.selectors.saveLearningStatus,"save","button")
  // }

  async clickLaunchButton() {
    await this.page.waitForLoadState("load");
    await this.wait("maxWait");
    await this.spinnerDisappear();
    let content = this.page.locator(this.selectors.contentLabel);
    if (await content.isVisible({ timeout: 20000 })) {
      await this.wait("mediumWait");
      await content.scrollIntoViewIfNeeded();
    }
    const playButton = "//button[@title='Play Video']";
    /*  const myElement = document.querySelector("#movie_player") as HTMLElement; 
         myElement.addEventListener("click", (event) => {
             myElement.click()
           }); */
    await this.page.locator(playButton).hover({ force: true });
    await this.page.focus(playButton, { strict: true });
    await this.page.click(playButton, { force: true });
    await this.wait("maxWait");
    await this.wait("mediumWait");
  }

  async clickSecondaryCourse(course: string, text?: string) {
    await this.validateElementVisibility(
      this.selectors.secondaryCourse(course),
      course
    );
    await this.wait("minWait");
    await this.click(this.selectors.secondaryCourse(course), course, "List");
    await this.wait("mediumWait");
    if (text === "Verification") {
      let courseVisible = this.page.locator(
        this.selectors.completePreviousContent
      );
      await expect(courseVisible).toBeVisible();
      console.error(
        "You need to complete the previous content to launch this content."
      );
    }
  }

  async saveLearningStatus() {
    await this.click(this.selectors.saveLearningStatus, "save", "button");
    //await this.validateElementVisibility(this.selectors.verificationEnrollment, "button");
    await this.spinnerDisappear();
    await this.page.keyboard.press("PageDown");
    const playButton = "//button[@title='Play Video']";
    let content = this.page.locator(this.selectors.contentLabel);
    await this.page.locator(playButton).isVisible();
    const completed = this.page.locator(this.selectors.completedVideo).last();
    try {
      await this.validateElementVisibility(
        this.selectors.contentLabel,
        "Content"
      );
      if (await content.isVisible({ timeout: 20000 })) {
        await content.scrollIntoViewIfNeeded();
      }

      if (await completed.isVisible()) {
        await completed.scrollIntoViewIfNeeded();
        console.log("The Video Has Completed");
      } else {
        await this.clickLaunchButton();
        await this.saveLearningStatus();
      }
    } catch (error) {
      console.log("Try to launch the button");
    }
  }

  //This method is used to play and save the content in Bookmark->content page
  async saveLearningStatusBookmark() {
    await this.click(this.selectors.saveLearningStatus, "save", "button");
    //await this.validateElementVisibility(this.selectors.verificationEnrollment, "button");
    await this.spinnerDisappear();
  }

  async searchMyLearning(data: string) {
    const searchSelector = this.selectors.searchlearningInput;
    await this.typeAndEnter(searchSelector, "Search Field", data);
    //await this.keyboardAction(searchSelector, "Enter", "Input", "Search Field");
    await this.page.waitForTimeout(10000);
  }

  async verifyEnrolledCourseByCODE(code: string) {
    await this.wait("minWait");
    await this.click(
      this.selectors.toCompleteORCompleteEnrolledCourse,
      code,
      "Link"
    );
    await this.spinnerDisappear();
    await this.verification(this.selectors.enrolledCourseCode, code);
  }

  async clicksaveLearningStatus() {
    await this.click(this.selectors.saveLearningStatus, "save", "button");
    await this.validateElementVisibility(
      this.selectors.verificationEnrollment,
      "button"
    );
    await this.spinnerDisappear();
    const completed = this.page.locator(this.selectors.completedVideo);
    try {
      if (await completed.isVisible()) {
        await completed.hover({ force: true });
        console.log("The Video Has Completed");
      }
    } catch (error) {
      console.log("Try to launch the button");
    }
  }
  async clickCompletedButton() {
    await this.wait("mediumWait");
    const name = "Completed Button";
    const completedButtonSelector = this.selectors.completedButton;
    await this.mouseHover(completedButtonSelector, name);
    await this.validateElementVisibility(completedButtonSelector, name);
    await this.click(completedButtonSelector, name, "Button");
    await this.wait("mediumWait");
  }

  async verifyCompletedCourse(name: string) {
    await this.wait("maxWait"); //Added by Arivu
    const completedCourseSelector = this.selectors.completedCourse(name);
    await this.mouseHover(completedCourseSelector, "Text");
  }

  async verifyExpiredContent() {
    await this.validateElementVisibility(
      this.selectors.expiredContent,
      "Expired"
    );
    await this.verification(this.selectors.expiredContent, "Expired");
  }
  async clickFilter() {
    //  await this.page.reload();
    await this.wait("maxWait");
    await this.validateElementVisibility(
      this.selectors.filterField,
      "Filter Search"
    );
    // await this.wait('mediumWait');
    await this.click(this.selectors.filterField, "Filter Search", "clicked");
  }

  async clickDeliveryType(typeName: string) {
    await this.click(
      this.selectors.filterDeliverytype(typeName),
      "Delivery type ",
      "Filter"
    );
  }

  /* async enterSearchFilter(tagName:string): Promise<string> {
        const tags = ["Empower", "Facilitate", "card", "matrix", "Testing", "Evolve schemas"];
        const randomIndex = Math.floor(Math.random() * tags.length); // Corrected random index generation
        const randomTag = tags[randomIndex];
        await this.click(this.selectors.searchButton, "Tagname", "Field")
        await this.keyboardType(this.selectors.selectTagnames, "Tagname")
        console.log(randomTag)
        return tagName;
    } */
  async selectresultantTags(tagName: string) {
    await this.wait("mediumWait");
    await this.click(this.selectors.searchButton, "Tagname", "Field");
    await this.wait("maxWait");
    await this.keyboardType(this.selectors.selectTagnames, tagName);
    //   await this.page.keyboard.press("Enter");
    //  await this.wait('minWait');
    await this.mouseHover(this.selectors.reultantTagname(tagName), "Tags");
    await this.validateElementVisibility(
      this.selectors.reultantTagname(tagName),
      "Tags"
    );
    await this.click(
      this.selectors.reultantTagname(tagName),
      "Tags",
      "selected"
    );
  }
  async clickApply() {
    await this.mouseHover(this.selectors.applyButton, "Apply");
    await this.click(this.selectors.applyButton, "Apply", "Button");
  }
  async viewCoursedetails() {
    await this.click(
      this.selectors.viewCourseDetails,
      "Coursedetails",
      "Button"
    );
    await this.wait("mediumWait");
  }
  async clickViewCertificationDetails() {
    await this.validateElementVisibility(
      this.selectors.viewCertificationDetailsBtn,
      "View Certification Details"
    );
    await this.click(
      this.selectors.viewCertificationDetailsBtn,
      "View Certification Details",
      "Button"
    );
    await this.page.waitForLoadState("load");
    await this.wait("mediumWait");
  }
  async clickViewLearningPathDetails() {
    await this.validateElementVisibility(
      this.selectors.viewlearningPathDetailsBtn,
      "View Learning Path Details"
    );
    await this.click(
      this.selectors.viewlearningPathDetailsBtn,
      "View Learning Path Details",
      "Button"
    );
    await this.page.waitForLoadState("load");
  }
  async clickOkButton() {
    await this.validateElementVisibility(
      this.selectors.okBtn,
      "View Certification Details"
    );
    await this.click(
      this.selectors.okBtn,
      "View Certification Details",
      "Button"
    );
    await this.page.waitForLoadState("load");
  }
  async verifyAddedToCart() {
    await this.validateElementVisibility(
      this.selectors.addedToCartBtn,
      "Added to Cart"
    );
    await this.verification(this.selectors.addedToCartBtn, "Added to Cart");
  }

  async clickTPCourseExpandIcon() {
    await this.wait("minWait");
    await this.click(this.selectors.tpCourseExpandIcon, "Expand Icon", "Icon");
  }

  async clickContentLaunchButton() {
    await this.mouseHover(this.selectors.contentLaunchBtn, "Launch");
    await this.click(this.selectors.contentLaunchBtn, "Launch", "Button");
    await this.spinnerDisappear();
  }

  async clickViewCertificate() {
    await this.mouseHover(
      this.selectors.viewCertificateBtn,
      "View Certificate"
    );
    await this.click(
      this.selectors.viewCertificateBtn,
      "View Certificate",
      "Button"
    );
    await this.wait("minWait");
  }

  public async addToCart() {
    await this.validateElementVisibility(
      this.selectors.addToCart,
      "Add to cart"
    );
    await this.wait("mediumWait");
    await this.click(this.selectors.addToCart, "Add to cart", "Button");
  }

  public async clickShoppingCartIcon() {
    await this.mouseHover(
      this.selectors.shoppingCardIcon,
      "Shopping Cart Icon"
    );
    await this.click(
      this.selectors.shoppingCardIcon,
      "Shopping Cart Icon",
      "Icon"
    );
  }

  public async clickProceedToCheckout() {
    await this.validateElementVisibility(
      this.selectors.proceedToCheckoutBtn,
      "Proceed To Checkout"
    );
    await this.click(
      this.selectors.proceedToCheckoutBtn,
      "Proceed To Checkout",
      "Button"
    );
  }

  public async handlingAdditionalContents() {
    await this.mouseHover(this.selectors.contentsLabel, "Contents");
    await this.click("", "", "");
  }

  public async verifyCourse(courseName: string) {
    const result = await this.getInnerText(this.selectors.resultNotFound);
    expect(result).not.toContain(courseName);
  }

  public async writeContent() {
    await this.wait("mediumWait");
    let checkBox = this.page.locator(this.selectors.checkBox);
    let checkBoxCount = await checkBox.count();
    let radioIcon = this.page.locator(this.selectors.RadioBtn);
    let radioIconCount = await radioIcon.count();
    let dropdown = this.page.locator(this.selectors.assessmentDropdown);
    let dropDownCount = await dropdown.count();
    let dropdownValue = this.page.locator("[id^='wrapper-ques'] a");
    let input = this.page.locator(this.selectors.questionInput);
    let inputCount = await input.count();
    let starIcon = this.page.locator(this.selectors.starIcon);
    let starIconCount = await starIcon.count();
    let textareaField = this.page.locator(this.selectors.textareaInput);
    let textareaCount = textareaField.count();
    await this.wait("mediumWait");
    if (await checkBox.nth(0).isVisible()) {
      for (let index = 0; index < checkBoxCount; index++) {
        if (index % 2 == 0) {
          await checkBox.nth(index).click();
        }
      }
    }

    await this.wait("minWait");
    if (await radioIcon.nth(0).isVisible()) {
      for (let index = 0; index < radioIconCount; index++) {
        if (index % 2 == 0) {
          await radioIcon.nth(index).click();
        }
      }
    }
    await this.wait("minWait");
    if (await dropdown.nth(0).isVisible()) {
      let printedIndices: number[] = [];
      for (let i = 0; i < dropDownCount; i++) {
        await dropdown.nth(i).click();
        for (let index = 0; index < (await dropdownValue.count()); index++) {
          if (index % 2 === 0) {
            if (!printedIndices.includes(index)) {
              printedIndices.push(index);
              await dropdownValue.nth(index).click();
              break;
            }
          }
        }
      }
    }
    await this.wait("minWait");
    if (await input.nth(0).isVisible()) {
      for (let index = 0; index < inputCount; index++) {
        await input.nth(index).fill(FakerData.getDescription());
      }
    }
    await this.wait("minWait");
    if (await starIcon.nth(0).isVisible()) {
      let groupSize = 5;

      for (
        let groupIndex = 0;
        groupIndex < Math.ceil(starIconCount / groupSize);
        groupIndex++
      ) {
        let startIndex = groupIndex * groupSize;
        let endIndex = Math.min(
          (groupIndex + 1) * groupSize - 1,
          starIconCount - 1
        );
        let randomIndex1 =
          Math.floor(Math.random() * (endIndex - startIndex + 1)) + startIndex;
        let randomIndex2 =
          Math.floor(Math.random() * (endIndex - startIndex + 1)) + startIndex;
        while (randomIndex1 === randomIndex2) {
          randomIndex2 =
            Math.floor(Math.random() * (endIndex - startIndex + 1)) +
            startIndex;
        }
        starIcon.nth(randomIndex1).click();
        await this.wait("minWait");
        starIcon.nth(randomIndex2).click();
      }
    }
    await this.wait("minWait");
    if (await textareaField.nth(0).isVisible()) {
      for (let index = 0; index < (await textareaCount); index++) {
        await textareaField.nth(index).fill(FakerData.getDescription());
      }
    }
  }

  public async negativeWriteContent() {
    await this.wait("mediumWait");
    let checkBox = this.page.locator(this.selectors.checkBox);
    let checkBoxCount = await checkBox.count();
    let radioIcon = this.page.locator(this.selectors.RadioBtn);
    let radioIconCount = await radioIcon.count();
    let dropdown = this.page.locator(this.selectors.assessmentDropdown);
    let dropDownCount = await dropdown.count();
    let dropdownValue = this.page.locator("[id^='wrapper-ques'] a");
    let input = this.page.locator(this.selectors.questionInput);
    let inputCount = await input.count();
    let starIcon = this.page.locator(this.selectors.starIcon);
    let starIconCount = await starIcon.count();
    await this.wait("mediumWait");
    if (await checkBox.nth(0).isVisible()) {
      for (let index = 0; index < checkBoxCount; index++) {
        if (index % 2 == 1) {
          await checkBox.nth(index).click();
        }
      }
    }

    await this.wait("minWait");
    if (await radioIcon.nth(0).isVisible()) {
      for (let index = 0; index < radioIconCount; index++) {
        if (index % 2 == 1) {
          await radioIcon.nth(index).click();
        }
      }
    }
    await this.wait("minWait");
    if (await dropdown.nth(0).isVisible()) {
      let printedIndices: number[] = [];
      for (let i = 0; i < dropDownCount; i++) {
        await dropdown.nth(i).click();
        for (let index = 0; index < (await dropdownValue.count()); index++) {
          if (index % 2 === 1) {
            if (!printedIndices.includes(index)) {
              printedIndices.push(index);
              await dropdownValue.nth(index).click();
              break;
            }
          }
        }
      }
    }
    await this.wait("minWait");
    if (await input.nth(0).isVisible()) {
      for (let index = 0; index < inputCount; index++) {
        await input.nth(index).fill(FakerData.getDescription());
      }
    }
    await this.wait("minWait");
    if (await starIcon.nth(0).isVisible()) {
      let groupSize = 5;

      for (
        let groupIndex = 0;
        groupIndex < Math.ceil(starIconCount / groupSize);
        groupIndex++
      ) {
        let startIndex = groupIndex * groupSize;
        let endIndex = Math.min(
          (groupIndex + 1) * groupSize - 1,
          starIconCount - 1
        );
        let randomIndex1 =
          Math.floor(Math.random() * (endIndex - startIndex + 1)) + startIndex;
        for (let index = 0; index < 1; index++) {
          await starIcon.nth(randomIndex1).click();
          await this.wait("minWait");
        }
      }
    }
  }

  async clickSubmitSurvey() {
    let submitSurvey = this.page.locator(this.selectors.sumbitSurveyBtn);
    if (await submitSurvey.isVisible()) {
      await this.mouseHover(this.selectors.sumbitSurveyBtn, "Submit My Answer");
      await this.click(
        this.selectors.sumbitSurveyBtn,
        "Submit My Answer",
        "Button"
      );
      await this.wait(`mediumWait`);
      await this.spinnerDisappear();
    }
  }
  async surveyPlayButton() {
    await this.wait("mediumWait");
    //   await this.page.locator(this.selectors.surveyPlayBtn).scrollIntoViewIfNeeded({timeout:5000})
    await this.page.mouse.wheel(0, -300);
    await this.validateElementVisibility(
      this.selectors.surveyPlayBtn,
      "Survey Button"
    );
    await this.click(this.selectors.surveyPlayBtn, "Survey", "Button");
  }
  async submitMyAnswer() {
    let submitBtn = this.page.locator(this.selectors.submitMyAnswerBtn);

    let scoreVisible = this.page.locator(this.selectors.recievedScore);
    if (await submitBtn.isVisible()) {
      await this.click(
        this.selectors.submitMyAnswerBtn,
        "Submit My Answer",
        "Button"
      );
      await this.wait(`mediumWait`);
      if (await scoreVisible.isVisible()) {
        let score = await this.getInnerText(this.selectors.recievedScore);
        console.log(score);
      }
      await this.wait(`minWait`);
      let negativeAnsDoneButton = this.page.locator(
        this.selectors.negAnsDoneButton
      );
      await this.wait(`minWait`);
      //     if (await negativeAnsDoneButton.isVisible()) {
      //         await this.click(this.selectors.negAnsDoneButton, "Done", "Button");
      //     } else {
      //         await this.click(this.selectors.doneBtn, "Done", "Button");
      //     }
    }
  }
  async surveySumbitBtn() {
    let surveySubmitBtn = this.page.locator(this.selectors.submitSurveyBtn);
    if (await surveySubmitBtn.isVisible()) {
      await this.click(this.selectors.submitSurveyBtn, "Survey", "Button");
      await this.wait(`minWait`);
      await this.click(
        this.selectors.surveyDoneButton,
        "TP Survey Done Button",
        "Button"
      );
      await this.spinnerDisappear();
    }
  }
  async clickReenroll() {
    let verification = this.page
      .locator(this.selectors.incompleteText)
      .innerHTML();
    expect("Incomplete").toContain(await verification);
    await this.validateElementVisibility(
      this.selectors.reenrollbutton,
      "re-enroll button is visible"
    );
    await this.click(this.selectors.reenrollbutton, "TP re-enroll", "Button");
  }

  async tpCompleteionVerification() {
    let verification = this.page
      .locator(this.selectors.tpCompletedText)
      .innerHTML();
    expect("Completed").toContain(await verification);
  }

  async tpPreAssessmentLaunch() {
    await this.validateElementVisibility(
      this.selectors.tpPreAssbutton,
      "tpPreassessmentButton"
    );
    await this.click(
      this.selectors.tpPreAssbutton,
      "tpPreassessmentButton",
      "Button"
    );
    await this.spinnerDisappear();
  }

  async tpPostAssessmentLaunch() {
    await this.validateElementVisibility(
      this.selectors.tpPostAssbutton,
      "tpPostassessmentButton"
    );
    await this.click(
      this.selectors.tpPostAssbutton,
      "tpPostassessmentButton",
      "Button"
    );
    await this.spinnerDisappear();
  }

  //No result found in mylearning->To Complete
  async noResultFoundOnMyLearning() {
    await this.validateElementVisibility(
      this.selectors.noResultFound_Mylearning,
      "No Result Found"
    );
    let result = await this.getInnerText(
      this.selectors.noResultFound_Mylearning
    );
    expect(result).toContain("No results found");
  }
  async verifyThumbnailImage(data: string) {
    const lnrSrcValue = await this.page
      .locator(this.selectors.thumbnailImgSrc)
      .getAttribute("src");
    console.log("Displayed image:", lnrSrcValue);
    expect(lnrSrcValue).toMatch(/\.(png|jpg)$/i);
  }

  //for playing multi conent playing based on content title
  async contentPlayByName(data: string) {
    await this.wait("mediumWait");
    await this.validateElementVisibility(
      this.selectors.contentPlay(data),
      "Content Play"
    );
    await this.click(
      this.selectors.contentPlay(data),
      "Content Play",
      "Button"
    );
  }

  //Learnerside->Course Completion Status
  async verifyStatus(data: string) {
    await this.wait("maxWait");
    await this.validateElementVisibility(
      this.selectors.statusOnDetailsPage,
      "Enrollment Status"
    );
    await this.verification(this.selectors.statusOnDetailsPage, data);
  }

  //For checking content expired based on given date
  async verifyFailedMessage() {
    await this.wait("mediumWait");
    await this.page.mouse.wheel(0, 500);

    await this.verification(
      this.selectors.ContentExpireCheck,
      " can no longer be launched as the validity has expired or there are no attempts left."
    );
  }

  //Verifying no seats left message on leaner side
  async verifySeatStatus() {
    await this.wait("mediumWait");
    await this.validateElementVisibility(
      this.selectors.noSeatLeftPopupMsg,
      "No seat left"
    );
    await this.verification(this.selectors.noSeatLeftPopupMsg, "No seat");
    await this.click(this.selectors.okBtn, "Ok", "Button");
  }
  async verifySeatFullText(courseName: string) {
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.seatFullOnDetailsPage(courseName),
      "Seat Full"
    );
    await this.page
      .locator(this.selectors.selectCourseRadioBtn(courseName))
      .scrollIntoViewIfNeeded();
    await this.verification(
      this.selectors.seatFullOnDetailsPage(courseName),
      "Seats Full"
    );
    await this.page
      .locator(this.selectors.selectCourseRadioBtn(courseName))
      .isDisabled();
  }
  //for selecting second course in program module
  async clickOnNextCourse(data: string) {
    await this.wait("minWait");
    //const courseName=data.toLowerCase()
    await this.click(
      this.selectors.clickNextCourse(data),
      "Select Next course",
      "Link"
    );
    await this.wait("maxWait");
  }

  async clickSessionConflictPopup() {
    await this.wait("minWait");
    const sessionConflict = this.page.locator(
      this.selectors.sessionConflictPopup
    );
    if (await sessionConflict.isVisible()) {
      await this.click(
        this.selectors.mylearningyesbutton,
        "Session Conflict Popup",
        "Button"
      );
      await this.wait("maxWait");
    } else {
      console.log("No Session Conflict Popup");
    }
    await this.wait("mediumWait");
  }
  //Click course in my learning
  async clickCourseInMyLearning(coursename: string) {
    await this.wait("minWait");
    await this.click(
      this.selectors.toCompleteORCompleteEnrolledCourse,
      coursename,
      "Link"
    );
    await this.spinnerDisappear();
  }

  //DCL verification msg

  async dclmesageVerification() {
    await this.validateElementVisibility(
      this.selectors.DCLNotEnrolledMessage,
      "DCL message"
    );
    await this.verification(
      this.selectors.DCLNotEnrolledMessage,
      "You are not enrolled in the class"
    );
    await this.clickOkButton();
  }

  // Wishlist Functionality Methods

  /**
   * Add course to wishlist by clicking the wishlist icon
   */
  async addtoWishlist() {
    await this.wait("mediumWait");
    await this.spinnerDisappear();
    try {
      // Try wishlist icon first
      const wishlistIcon = this.page.locator(this.selectors.wishlistIcon);
      if (await wishlistIcon.isVisible()) {
        await this.click(this.selectors.wishlistIcon, "Add to Wishlist", "Icon");
      } else {
        // Try wishlist button as fallback
        await this.click(this.selectors.wishlistButton, "Add to Wishlist", "Button");
      }
      await this.wait("minWait");
      await this.spinnerDisappear();
    } catch (error) {
      console.log("Error adding to wishlist: " + error);
      throw error;
    }
  }

  /**
   * Verify that a course has been added to wishlist
   * @param courseName - Name of the course to verify
   */
async verifyAddedToWishlist(courseName: string) {
  await this.wait("mediumWait");
  try {
    const addedIcon = this.page.locator(this.selectors.addedToWishlist);
    await this.page.reload();
    await this.wait("mediumWait");
    if (await addedIcon.isVisible()) {
      console.log(`Course "${courseName}" successfully added to wishlist`);
    } else {
      // Wait and check again after reload, as UI may take time to update
      await this.wait("mediumWait");
      if (await addedIcon.isVisible({ timeout: 5000 })) {
        console.log(`Course "${courseName}" successfully added to wishlist (after wait)`);
      } else {
        console.log(`Course "${courseName}" not added to wishlist`);
      }
    }
  } catch (error) {
    console.error(`Error verifying added to wishlist for "${courseName}": ${error}`);
    throw error;
  }
}


  /**
   * Navigate to wishlist section and search for a course
   * @param courseName - Name of the course to search in wishlist
   */
  async wishlistCatalog(courseName: string) {
    await this.wait("mediumWait");
    try {
      // Click on wishlist section
      await this.click(this.selectors.wishlistSection, "Wishlist Section", "Link");
      await this.wait("mediumWait");
      await this.spinnerDisappear();
      
      // Search for the course in wishlist
      const searchInput = this.page.locator(this.selectors.searchInput);
      if (await searchInput.isVisible()) {
        await this.typeAndEnter(this.selectors.searchInput, "Search in Wishlist", courseName);
        await this.wait("mediumWait");
      }
      
      // Verify course is present in wishlist
      await this.validateElementVisibility(
        this.selectors.wishlistVerification(courseName),
        `Course "${courseName}" in Wishlist`
      );
    } catch (error) {
      console.log("Error navigating wishlist catalog: " + error);
      throw error;
    }
  }

  /**
   * Remove course from wishlist
   */
  async removewishlist() {
    await this.wait("mediumWait");
    await this.spinnerDisappear();
    try {
      // Click remove from wishlist button
      await this.click(this.selectors.addedToWishlist, "Remove from Wishlist", "Button");
      await this.wait("minWait");
      await this.spinnerDisappear();
    } catch (error) {
      console.log("Error removing from wishlist: " + error);
      throw error;
    }
  }

  /**
   * Verify that a course has been removed from wishlist
   * @param courseName - Name of the course to verify removal
   */
  async verifyremoveWishlistTraining(courseName: string) {
    await this.wait("mediumWait");
  try {
    const addedIcon = this.page.locator(this.selectors.addedToWishlist);
    await expect(addedIcon).not.toBeVisible();
    console.log(`Course "${courseName}" successfully removed from wishlist`);
  } catch (error) {
    console.error(`Error verifying removed from wishlist for "${courseName}": ${error}`);
    throw error;
  }
  }

   async verifyCostCentrerInApprovalPopup(value: string) {
        await this.verificationInputValue(this.selectors.costcenterValue,value);
    }
}
