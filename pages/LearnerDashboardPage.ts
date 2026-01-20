import { FakerData, getCurrentDateFormatted } from "../utils/fakerUtils";

import { BrowserContext, expect, Locator, Page } from "@playwright/test";
import { LearnerHomePage } from "./LearnerHomePage";
import { th } from "@faker-js/faker";
import { verify } from 'crypto';

export class LearnerDashboardPage extends LearnerHomePage {
  public selectors = {
    ...this.selectors,
    learningPathAndCertification:
      "//div[@id='mydashboard']//div[text()='Learning path / Certification']",
    certification: "a:text-is('Certification')",
    certificationInput: "//input[@id='exp-searchundefined-field']",
    verifyText: (titleName: string) => `//div[text()='${titleName}']`,
    recertifyIcon: (course: string) =>
      `//div[text()='${course}']//following::i[contains(@class,'certificate')]`,
    pendingLabel: "//span[contains(text(),'Pending')]",
    verifyPendingCourse: (course: string) =>
      `//span[contains(text(),'Pending')]//following::div[contains(text(),'${course}')]`,
    mandatoryText: "//div[text()='Mandatory']",  //Not in use
    // complianceText: "//div[text()='Compliance']", //Not in use
    mdtryandcmplText: "//div[text()='Mandatory' or text()='Compliance']",
    verifyCertificate: (cerTitle: string) =>
      `//span[contains(text(),'To complete')]/following::div[text()='${cerTitle}']`,
    //Learning History
    learningHistory: "//div[@id='mydashboard']//div[text()='Learning History']",
    courseInput: "#exp-searchlnr-search input",
    //Bookmark :-
    bookmarkLink: `//div[text()='Bookmarks']`,
    bookmarkSearchIcon: `//input[@id='exp-searchbookmarkeditems-search-field'] `,
    bookmarkVerification: (title: any) =>
      `//div[@id='bookmarks']//h5[text()='${title}']`,
    removeBookmark: (title: any) =>
      `(//h5[text()='${title}']//following::i[@aria-label='bookmarked'])[1]`,
    removeBookmarkPopup: `//button[text()='Yes']`,
    boomarkPageLinks: (linkName: string) => `//a[text()='${linkName}']`, //Content|Certification|Learning Path
    bookmarkedDate: (courseName: string) => `(//h5[text()='${courseName}']//following::small[@class='rawtxt'][contains(text(),'Bookmarked On')])[1]`,

    //Learner Dashboard Page
    dashboardItems: (itemName: string) =>
      `//div[@id='mydashboard']//div[text()='${itemName}']`,
    inaTabs: (tabName: String) => `//a[contains(text(),'${tabName}')]`,
    reminderBuckets: (bucket: String) => `//p[contains(text(),'${bucket}')]`,
    verifyTitle: (title: string) =>
      `//p[contains(text(),'List of class that have been changed')]//following::p[contains(text(),'${title}')]`,

    //click more on TP

    clickMore: (data: string) =>
      `(//div[text()='${data}']//following::i[@aria-label='More'])[1]`,
    titleClick: (title: string) => `(//div[contains(text(),'${title}')])[1]`,

    FilterInLearningHistory: `(//span[text()='Learning History']/following::div[text()='Filters'])[1]`,

    searchResult: (title: string, status: string) => `(//h5[text()='${title}']/following::div[text()=' ${status}'])[1]`,

    clickSearchedResult: (title: string, status: string) => `(//h5[text()='${title}']/following::div[text()=' ${status}'])[1]/preceding::h5[text()='${title}']`,
    myCertificateLink: `//div[text()='My Certificates']`,
    selectCertificationType: (cerTitle: string) => `//a[contains(text(),'${cerTitle}')]`,
    filterbtn: `//button[@id='undefined-filters-trigger']`,
    fromdate: `//input[@id='mycertificate_date_range_filter-from-input']`,
    todate: `//input[@id='mycertificate_date_range_filter-to-input']`,
    applyBtn: `//button[text()='Apply']`,
    completedCertificates: `//h5[contains(@class,'title_active')]`,
    resultCourse_TP: (data: string) => `//h5[text()='${data}']`,
    courseStatus: (courseName: string, status: string) => `//h5[text()='${courseName}']//following::div[contains(text(),'${status}')]`,
    learninghrs: `(//h5[text()='Jan - Dec 2025']//following::td[text()='Actual']//following::td)[1]`,
    assignmentTypeChart: `//canvas[@id='assignment-type-chart']`,
    trainingTypeChart: `//canvas[@id='training-type-chart']`,
    deliveryTypeChart: `//canvas[@id='delivery-type-chart']`,
    overAllLink: `//a[text()='Overall']`,
    actionCenter: `//h5[text()='Action Center']`,
    wishListLink: `//canvas[@id='overallwishlist-chart']`,
    wishListCount: `(//div[text()='Added to Wishlist']//following::div)[1]`,
    editPlaylist: (playlistName: string) => `(//p[contains(text(),'${playlistName}')]//following::i)[1]`,
    verifyContentInPlaylist: (contentName: string) => `//span[text()='${contentName}']`,
    addedOnDate: `(//div[@class='field_title' and contains(text(),'Added on :')])[1]`,
    completedOnDate: `//div[contains(@class,'d-flex') and contains(text(),'Completed On :')]`,
    learningpathAndCertificationLink:`//a[text()='Learning path / Certification']`,

  };

  //To Navigate to Bookmark->Content/Certification/Learning Path pages
  async navigateBookmarkLinks(linkName: string) {
    await this.wait("minWait");
    await this.click(
      this.selectors.boomarkPageLinks(linkName),
      "Bookmark Page Link",
      "Link"
    );
  }

  async clickBookmarkLink() {
    await this.wait("mediumWait");
    await this.click(this.selectors.bookmarkLink, "Bookmark Link", "Link");
  }

  async bookMarkSearch(title: string) {
    await this.spinnerDisappear();
    await this.wait("minWait");
    await this.click(
      this.selectors.bookmarkSearchIcon,
      "Bookmark Link",
      "Link"
    );
    await this.typeAndEnter(
      this.selectors.bookmarkSearchIcon,
      "Search Text",
      title
    );
  }

  async bookmarkVerification(title: any) {
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.bookmarkVerification(title),
      "Bookmark Verification"
    );
    await this.mouseHoverandClick(
      this.selectors.bookmarkVerification(title),
      this.selectors.bookmarkVerification(title),
      "Bookmark Search",
      "Bookmark Search"
    );
  }
  async bookmarkRemove(title: any) {
    await this.spinnerDisappear();
    await this.wait("minWait");
    await this.click(
      this.selectors.bookmarkSearchIcon,
      "Bookmark Link",
      "Link"
    );
    await this.typeAndEnter(
      this.selectors.bookmarkSearchIcon,
      "Search Text",
      title
    );
    await this.click(
      this.selectors.removeBookmark(title),
      "Bookmark Removed",
      "Bookmark Icon"
    );
    await this.click(
      this.selectors.removeBookmarkPopup,
      "Remove Bookmark",
      "Popup"
    );
  }
  async clickLearningPath_And_Certification() {
    await this.wait("maxWait");
    await this.validateElementVisibility(
      this.selectors.learningPathAndCertification,
      "LearningPath and Certification"
    );
    await this.wait("maxWait");
    await this.click(
      this.selectors.learningPathAndCertification,
      "LearningPath and Certification",
      "Button"
    );
  }

  //Course search in learning history
  async learningHistoryCourseSearch(data: string) {
    await this.validateElementVisibility(
      this.selectors.courseInput,
      "Search Field"
    );
    await this.typeAndEnter(this.selectors.courseInput, "Search Field", data);
    await this.wait("maxWait");
  }

  async clickCertificationLink() {
    await this.page.waitForLoadState("load");
    await this.validateElementVisibility(
      this.selectors.certification,
      "Certification"
    );
    await this.wait("mediumWait");
    await this.click(this.selectors.certification, "Certification", "Link");
    await this.wait("mediumWait");
  }

  async clickRecertifyIcon(data: string) {
    await this.mouseHover(this.selectors.recertifyIcon(data), "Recertify Icon");
    await this.click(
      this.selectors.recertifyIcon(data),
      "Recertify Icon",
      "Icon"
    );
  }

  async searchCertification(data: string) {
    await this.validateElementVisibility(
      this.selectors.certificationInput,
      "Search Field"
    );
    await this.page
      .locator("//span[contains(text(),'To complete')]")
      .scrollIntoViewIfNeeded();
    await this.wait("maxWait");
    await this.typeAndEnter(
      this.selectors.certificationInput,
      "Search Field",
      data
    );
    await this.wait("mediumWait");
  }

  async verifyTOCompleteCert(cerTitle: string) {
    await this.validateElementVisibility(
      this.selectors.verifyCertificate(cerTitle),
      "Certificate"
    );
  }

  async clickCertificateTitle(cerTitle: string) {
    await this.wait("maxWait");
    await this.click(
      this.selectors.verifyCertificate(cerTitle),
      "Certificate",
      "Link"
    );
  }

  async verifyComplianceCourse() {
    await this.wait("mediumWait");
    let visibleCompliance = await this.page
      .locator(this.selectors.mdtryandcmplText)
      .nth(0)
      .innerText({ timeout: 10000 });
    expect(visibleCompliance).toBe("COMPLIANCE");
  }

  async verifyTheEnrolledCertification(data: string) {
    await this.validateElementVisibility(
      this.selectors.verifyText(data),
      "Certification"
    );
    await this.wait("maxWait");
    await this.verification(this.selectors.verifyText(data), data);
  }

  async pendingTab(course: string) {
    await this.wait("mediumWait");
    //await this.mouseHover(this.selectors.pendingLabel, "Pending");
    await this.fillAndEnter(this.selectors.certificationInput, "Input", course);
    await this.validateElementVisibility(
      this.selectors.pendingLabel,
      "Pending"
    );
    await this.verification(this.selectors.verifyPendingCourse(course), course);
  }

  /**
   * Verify learning type (certification/learning path/course) and its status
   * @param name - The name of the certification/learning path/course
   * @param status - The expected status (e.g., 'Yet to start', 'In Progress', 'Completed')
   */
  async verifyLearningTypeAndStatus(name: string, status: string) {
    await this.wait("minWait");
    const statusLocator = `//h5[text()='${name}']//following::div[@class='subtext text-uppercase']//span`;
    const statusElement = this.page.locator(statusLocator);
    await this.validateElementVisibility(statusLocator, `Status for ${name}`);
    const actualStatus = await statusElement.innerText();
    expect(actualStatus.trim().toLowerCase()).toContain(status.toLowerCase());
    console.log(`✅ Verified ${name} status: ${actualStatus}`);
  }

  //Dashboard Items
  async selectDashboardItems(itemName: string) {
    await this.validateElementVisibility(
      this.selectors.dashboardItems(itemName),
      "Dashboard"
    );
    await this.click(
      this.selectors.dashboardItems(itemName),
      "itemName",
      "link"
    );
  }

  /**
   * Click edit icon for a specific playlist
   * @param playlistName - Name of the playlist to edit
   */
  async clickEditPlaylist(playlistName: string) {
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.editPlaylist(playlistName),
      `Edit Playlist: ${playlistName}`
    );
    await this.click(
      this.selectors.editPlaylist(playlistName),
      `Edit ${playlistName}`,
      "Icon"
    );
    await this.wait("mediumWait");
  }

  /**
   * Verify content exists in playlist (handles multiple matches)
   * @param contentName - Name of the content to verify
   */
  async verifyContentInPlaylist(contentName: string) {
    await this.wait("minWait");
    const contentLocator = this.page.locator(this.selectors.verifyContentInPlaylist(contentName));
    const count = await contentLocator.count();

    if (count > 0) {
      console.log(`✅ Content "${contentName}" found in playlist (${count} match${count > 1 ? 'es' : ''})`);
      await this.validateElementVisibility(
        this.selectors.verifyContentInPlaylist(contentName),
        `Content: ${contentName}`
      );
      await this.verification(
        this.selectors.verifyContentInPlaylist(contentName),
        contentName
      );
    } else {
      throw new Error(`❌ Content "${contentName}" not found in playlist`);
    }
  }

  /**
   * Verify "Added on" date is present in playlist
   */
  async verifyAddedOnDate() {
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.addedOnDate,
      "Added on Date"
    );
    const dateText = await this.page.locator(this.selectors.addedOnDate).innerText();
    console.log(`✅ Added on date is present: ${dateText}`);
  }

  /**
   * Verify "Completed On" date is present
   */
  async verifyCompletedOnDate() {
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.completedOnDate,
      "Completed On Date"
    );
    const dateText = await this.page.locator(this.selectors.completedOnDate).innerText();
    console.log(`✅ Completed On date is present: ${dateText}`);
  }

  //INA tabs
  async selectINATabs(tabName: string) {
    await this.validateElementVisibility(
      this.selectors.inaTabs(tabName),
      "INA"
    );
    await this.click(this.selectors.inaTabs(tabName), "tabName", "tab");
  }

  //INA reminder buckets
  async verifyINAReminder(bucket: string, title: string) {
    await this.validateElementVisibility(
      this.selectors.reminderBuckets(bucket),
      "Sub Title"
    );
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.verifyTitle(title),
      title
    );
  }

  async clickMoreonTP(title: string) {
    await this.validateElementVisibility(
      this.selectors.clickMore(title),
      "Click More"
    );
    await this.click(this.selectors.clickMore(title), "Click More", "Link");
  }

  async clickTitle(title: string) {
    await this.wait("minWait");
    await this.mouseHover(this.selectors.titleClick(title), "Title");
    await this.click(this.selectors.titleClick(title), "Title", "");
  }


  async clickLearningHistory() {
    await this.click(this.selectors.learningHistory, "Learning History", "Link");

  }
  async clickTabsInsideTheLearningHistory(tabName: String) {
    await this.validateElementVisibility(this.selectors.inaTabs(tabName), "Tab");
    await this.click(this.selectors.inaTabs(tabName), "Tab", "Tab");

  }

  async verifyTheStatusInLearningHistory(name: string, status: string) {
    await this.learningHistoryCourseSearch(name);
    try {
      if (await this.page.locator(this.selectors.searchResult(name, status)).isVisible()) {
        await this.click(this.selectors.clickSearchedResult(name, status), "Click More", "Link");
      }
    } catch {
      throw new Error(`The status '${status}' for '${name}' not found in Learning History.`);
    }



  }

  async selectCertificateType(cerTitle: string) {
    await this.wait("maxWait");
    await this.validateElementVisibility(this.selectors.myCertificateLink, "My Certificate");
    await this.click(this.selectors.myCertificateLink, "My Certificate", "Link");
    await this.validateElementVisibility(this.selectors.selectCertificationType(cerTitle), "Certificate Type");
    await this.click(this.selectors.selectCertificationType(cerTitle), "Certificate Type", "Link");
  }

  async filterByTodaysDate() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    const todayDate = `${month}/${day}/${year}`;
    await this.wait("minWait");
    await this.click(this.selectors.filterbtn, "Filter", "Button");
    await this.wait("minWait");
    await this.typeAndEnter(this.selectors.fromdate, "From Date", todayDate);
    await this.wait("minWait");
    await this.typeAndEnter(this.selectors.todate, "To Date", todayDate);
    await this.wait("minWait");
    await this.click(this.selectors.applyBtn, "Apply", "Button");
  }

  async verifyCompletedCertificate(certificateTitle: string) {
    await this.wait("minWait");
    await this.spinnerDisappear();
    const completedCertificates = await this.page.locator(this.selectors.completedCertificates).allTextContents();
    console.log(`✅ Total completed certificates found: ${completedCertificates.length}`);
    console.log(`Certificate titles: ${completedCertificates.join(', ')}`);
    const isCertificatePresent = completedCertificates.some(cert => cert.includes(certificateTitle));
    if (!isCertificatePresent) {
      throw new Error(`Certificate "${certificateTitle}" not found in completed certificates. Available certificates: ${completedCertificates.join(', ')}`);
    }
    console.log(`✅ Certificate "${certificateTitle}" is present in completed certificates`);
  }

  async vaidatVisibleCourse_Program(data: string, status: string) {
    await this.wait("maxWait");
    await this.validateElementVisibility(
      this.selectors.courseStatus(data, status),
      "Course/Training Plan with Status"
    );
    await this.verification(this.selectors.courseStatus(data, status), status);
  }

  /**
   * Verify enrollment type (Mandatory/Optional) in learner My Learning
   * @param enrollmentType - "Mandatory" or "Optional"
   * If "Mandatory": Verifies "Mandatory" text is visible
   * If "Optional": Verifies "Mandatory" text is NOT visible
   */
  async verifyEnrollmentType(enrollmentType: string) {
    await this.wait("minWait");

    if (enrollmentType.toLowerCase() === "mandatory") {
      // Verify Mandatory text is visible
      await this.validateElementVisibility(
        this.selectors.mandatoryText,
        "Mandatory Text"
      );
      await this.verification(this.selectors.mandatoryText, "Mandatory");
      console.log(`✅ Mandatory text verified - Enrollment type is Mandatory`);
    } else if (enrollmentType.toLowerCase() === "optional") {
      // Verify Mandatory text is NOT visible
      const isMandatoryVisible = await this.page.locator(this.selectors.mandatoryText).isVisible();
      if (isMandatoryVisible) {
        throw new Error(`Mandatory text is visible, but expected Optional enrollment type`);
      }
      console.log(`✅ Mandatory text not visible - Enrollment type is Optional`);
    } else {
      throw new Error(`Invalid enrollment type: ${enrollmentType}. Expected "Mandatory" or "Optional"`);
    }
  }

  async getLearningHours(): Promise<string> {
    await this.wait("minWait");
    const learningHours = await this.page.locator(this.selectors.learninghrs).innerText();
    console.log(`📊 Total Learning Hours: ${learningHours}`);

    // Validate learning hours is not 0
    if (learningHours === "0" || learningHours === "0.00" || parseFloat(learningHours) === 0) {
      throw new Error(`Learning hours should not be 0. Current value: ${learningHours}`);
    }

    return learningHours;
  }

  async verifyAssignmentTypeChart() {
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.assignmentTypeChart,
      "Assignment Type Chart"
    );
    console.log(`✅ Assignment Type Chart is displayed`);
  }

  async verifyTrainingTypeChart() {
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.trainingTypeChart,
      "Training Type Chart"
    );
    console.log(`✅ Training Type Chart is displayed`);
  }

  async verifyDeliveryTypeChart() {
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.deliveryTypeChart,
      "Delivery Type Chart"
    );
    console.log(`✅ Delivery Type Chart is displayed`);
  }

  async clickOverallLink() {
    await this.wait("minWait");
    await this.click(this.selectors.overAllLink, "Overall Link", "Link");
  }

  async verifyActionCenter() {
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.actionCenter,
      "Action Center"
    );
    console.log(`✅ Action Center is displayed`);
  }
  async verifyWishListChartAndGetCount(): Promise<string> {
    await this.wait("minWait");
    await this.validateElementVisibility(
      this.selectors.wishListLink,
      "Wish List Chart"
    );
    console.log(`✅ Wish List Chart is displayed`);

    const wishlistCount = await this.page.locator(this.selectors.wishListCount).innerText();
    console.log(`📊 Wishlist Count: ${wishlistCount}`);
    return wishlistCount;
  }

  /**
 * Verify that all bookmark sections are displayed
 * Validates Course, Content, Certification, and Learning Path sections
 * Note: Course should have 2 matches
 */
  async verifyBookmarkSections() {
    await this.wait("minWait");

    const sections = ["Course", "Content", "Certification", "Learning Path"];

    for (const section of sections) {
      const sectionLocator = this.page.locator(this.selectors.boomarkPageLinks(section));
      const count = await sectionLocator.count();

      if (section === "Course") {
        // Course should have 2 matches
        if (count !== 2) {
          throw new Error(`Expected 2 matches for "${section}" but found ${count}`);
        }
        console.log(`✅ Verified "${section}" section: 2 matches found`);
      } else {
        // Other sections should have at least 1 match
        if (count < 1) {
          throw new Error(`"${section}" section not found in Bookmarks`);
        }
        await this.validateElementVisibility(
          this.selectors.boomarkPageLinks(section),
          `${section} Section`
        );
        console.log(`✅ Verified "${section}" section is displayed`);
      }
    }

    console.log(`✅ All bookmark sections verified: Course (2 matches), Content, Certification, Learning Path`);
  }

  /**
   * Verify bookmarked date is displayed with current date
   * @param courseName - The name of the bookmarked course
   */
  async verifyBookmarkedDate(courseName: string) {
    await this.wait("minWait");

    // Get current date in format: Dec 26, 2025
    const today = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = monthNames[today.getMonth()];
    const day = today.getDate();
    const year = today.getFullYear();
    const expectedDate = `${month} ${day}, ${year}`;

    const bookmarkedDateLocator = this.selectors.bookmarkedDate(courseName);
    await this.validateElementVisibility(bookmarkedDateLocator, `Bookmarked Date for ${courseName}`);

    const bookmarkedText = await this.page.locator(bookmarkedDateLocator).innerText();
    console.log(`📅 Bookmarked text: ${bookmarkedText}`);

    if (!bookmarkedText.includes(expectedDate)) {
      throw new Error(`Expected bookmarked date "${expectedDate}" not found. Actual text: "${bookmarkedText}"`);
    }

    console.log(`✅ Verified bookmarked date for "${courseName}": ${expectedDate}`);
  }


  async clickLearningpathAndCertificationLink() {
    await this.wait("maxWait");
    await this.validateElementVisibility(this.selectors.learningpathAndCertificationLink, "Learningpath And Certification Link");
    await this.click(this.selectors.learningpathAndCertificationLink, "Learningpath And Certification Link", "Link");
  }

  /**
   * Verify My Certificates section displays a specific - Course | TP | Certification
  */
  async verifyMyCertificatesSection(trainingPlanName: string) {
    await this.wait("minWait");
    await this.validateElementVisibility(this.selectors.resultCourse_TP(trainingPlanName),"My Certificates Section");
    console.log(`✅ My Certificates section is displayed`);

  }
}