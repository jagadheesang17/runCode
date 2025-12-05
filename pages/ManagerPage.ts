import { expect } from "@playwright/test";
import { FakerData } from "../utils/fakerUtils";
import { LearnerHomePage } from "./LearnerHomePage";
import { PlaywrightWrapper } from "../utils/playwright";

export class ManagerPage extends PlaywrightWrapper {
  public selectors = {
    searchCourse: `//input[@id='exp-searchcatalog-search-field']`,
    recommendIcon: (courseName: string) =>
      `(//div[text()='${courseName}']/following::i)[1]`,
    directandIndirect: (option: string) =>
      `(//span[text()='${option}']/preceding-sibling::i)[1]`,
    selectTeamMember: `//span[text()='Select Team members']`,
    additionalInfo: `//textarea[@id='email-message']`,
    sendMeCopy: `(//span[text()='Send me a copy']/preceding-sibling::i)[2]`,
    recommendLearning: `//span[text()='Recommend Learning']`,
    toastmessage: `//span[text()='Recommended successfully']`,
    okButton: `(//span[text()='Recommended successfully']/following::button)[1]`,
    selectDropdown: `//input[@id='select-team-filter-field']`,
    searchUser: `//input[@id='select-team']`,
    closebutton: `//div[contains(@id,'simplemodal')]//i[contains(@class,'fa-duotone fa-times')]`,
    teamUseroption: (user: string) => `//li[contains(text(),'${user}')]`,
    filter: `(//h2[text()='My Team']/following::div[text()='Filters'])[1]`,
    selectReportee: (data: string) =>
      `(//span[text()='${data}']/preceding-sibling::i)[2]`,
    reporteeName: `(//div[contains(@class,'inactive text-capitalize pointer')])[1]`,
    search: `//input[@id='exp-searchmyteam-lnrsearch-field']`,
    searchResult: `//div[@class='lms-scroll-results']//li`,
    reportee: (data: string) =>
      `(//div[@class='text-uppercase icontxt']/span[text()='${data} Reportee'])[1]`,
    userData: `(//div[@class='h2_inactive text-capitalize pointer'])[1]`,
    applyButton: `//button[text()='Apply']`,
    viewLearning: (user: string) => `(//div[text()='${user}']/following::i)[1]`,
    allCertandTP: (courseType: string) => `//a[text()='${courseType}']`,
    allCourses: `//h5[contains(@class,'text-truncate text-truncate field')]`,
    //Guide team(Enrollment by Manager)
    guideTeam: (courseName: string) =>
      `(//div[text()='${courseName}']/following::i[@aria-label='Guide Team'])[1]`,
    viewUpdateStatus: `(//i[@aria-label='View Update Status'])[1]`,
    searchTeamUser: `#exp-searchmyteam-lnrsearch-field`,
    // Address fields
    address1Input: "//label[text()='Address 1']/following-sibling::input",
    // Country dropdown
    Countrydropdown: "//label[text()='Country']/following::button[1]",
    CountryInput: "//label[text()='Country']/following::input[1]",
    CountryOption: (Option: string) => `//span[text()='${Option}']`,
    // State dropdown
    statedropdown: "//label[text()='State/Province']/following::button[1]",
    stateInput: "//label[text()='State/Province']/following::input[1]",
    stateOption: (Option: string) => `//span[text()='${Option}']`,
  };

  async enterSearchCourse(data: string) {
    await this.page.mouse.wheel(0, 800);
    await this.page.keyboard.press("PageDown");
    await this.validateElementVisibility(
      this.selectors.searchCourse,
      "Search Text Field"
    );
    await this.typeAndEnter(this.selectors.searchCourse, "Search Course",data);
  }

  async clickrecommendIcon(data: string) {
    await this.click(
      this.selectors.recommendIcon(data),
      "Recommend Course",
      "Icon"
    );
  }

  async verifydirectandIndirect(data: string) {
    const selected = await this.page
      .locator(this.selectors.directandIndirect(data))
      .isChecked();
    expect(selected).toBeTruthy();
  }

  async enterAdditionalInfo() {
    await this.keyboardType(
      this.selectors.additionalInfo,
      FakerData.getDescription()
    );
    await this.wait("minWait");
  }

  async clickSendMeCopy() {
    await this.click(this.selectors.sendMeCopy, "Send Me Copy ", "Button");
  }
  async clickRecommendLearning() {
    await this.click(
      this.selectors.recommendLearning,
      "RecommendLearning ",
      "Button"
    );
  }

  async verifytoastmsg() {
    await this.verification(this.selectors.toastmessage, "successfully");
    await this.wait("maxWait");
    await this.validateElementVisibility(this.selectors.okButton, "Ok Button");
    await this.click(this.selectors.okButton, "OK", "button");
  }

  async selectTeam() {
    await this.click(
      this.selectors.selectTeamMember,
      "Team Memeber",
      "Checkbox"
    );
    // await this.wait('maxWait');
  }

  async selectTeamUser(data: string) {
    // await this.wait('mediumWait');
    await this.waitSelector(this.selectors.selectDropdown);
    await this.click(this.selectors.selectDropdown, "Team User", "dropdown");
    await this.wait("mediumWait");
    /*  this.page.once('response', async response => {
             console.log(`Response received from: ${response.url()}`);
             console.log(`Response status: ${response.status()}`);
             console.log(`Response headers: ${JSON.stringify(response.headers())}`);
             console.log(`Response body: ${await response.text()}`);
         }) */
    await this.keyboardType(this.selectors.searchUser, data);
    // await this.wait('maxWait')
    const fallbackSelector = "li #list_undefined";
    await this.waitSelector(fallbackSelector);
    const isFallbackPresent = await this.page
      .locator(fallbackSelector)
      .isVisible();

    if (isFallbackPresent) {
      await this.click(fallbackSelector, "Team user ", "Fallback Dropdown");
    } else {
      console.warn(
        `Fallback element with selector ${fallbackSelector} not found.`
      );
    }

    //     }
    //     catch{
    //     await this.click(this.selectors.closebutton,"Close","Icon")
    //     await this.page.reload();
    //     this.clickrecommendIcon(courseName);
    //     this.selectTeam();
    //     await this.click(this.selectors.selectDropdown,"Team User","dropdown")
    //     await this.keyboardType(this.selectors.searchUser,data)
    //     await this.mouseHover(this.selectors.teamUseroption(data),"Team user Dropdown")
    // }
    // await this.click(this.selectors.teamUseroption(data),"Team user ","Dropdown")
  }

  async clickFilter(reportee: string) {
    await this.click(this.selectors.filter, "Filter", "Search box");
    await this.click(
      this.selectors.selectReportee(reportee),
      "Select reportee",
      "dropdown"
    );
    await this.click(this.selectors.applyButton, "Apply", "Button");
  }
  async verifyReportee(user: string, reportee: string) {
    // await this.validateElementVisibility(this.selectors.reportee(reportee), reportee)
    // await this.verification(this.selectors.userData, user)
    //other method
    const searchUser = this.selectors.search;
    await this.type(searchUser, "Textfield", user);
    await this.mouseHover(this.selectors.searchResult, "Select User");
    await this.click(this.selectors.searchResult, "Select User", "dropdown");
    await this.wait("minWait");
    const count = this.page.locator(this.selectors.reporteeName).count;
    console.log(count);
    await this.validateElementVisibility(this.selectors.reporteeName, reportee);
    const user1 = await this.getInnerText(this.selectors.reporteeName);
    await this.verification(this.selectors.userData, user1);
  }

  //div[text()='Learner user']/following::i)[1]
  async clickViewLearning(user: string) {
    const searchUser = this.selectors.search;
    await this.type(searchUser, "Textfield", user);
    await this.mouseHover(this.selectors.searchResult, "Select User");
    await this.click(this.selectors.searchResult, "Select User", "dropdown");
    await this.wait("minWait");
    const count = await this.page.locator(this.selectors.reporteeName).count();
    console.log(count);
    await this.validateElementVisibility(
      this.selectors.reporteeName,
      "reportee"
    );
    const user1 = await this.page
      .locator(this.selectors.reporteeName)
      .innerHTML();
    console.log(user1);
    await this.validateElementVisibility(
      this.selectors.viewLearning(user1),
      "View Learning"
    );
    await this.mouseHover(this.selectors.viewLearning(user1), "View Learning");
    await this.click(
      this.selectors.viewLearning(user1),
      "View Learning",
      "Icon"
    );
  }

  async verifyallCourses(courseType: string) {
    await this.click(
      this.selectors.allCertandTP(courseType),
      `${courseType}`,
      "Tab"
    );
    await this.wait("mediumWait");
    const allCourse = await this.page.locator(this.selectors.allCourses).all();
    for (const course of allCourse) {
      const courseName = await course.innerHTML();
      console.log(courseName);
      expect(courseName).toBeTruthy;
    }
  }

  async clickGuideTeamIcon(data: string) {
    await this.wait("mediumWait");
    await this.page.mouse.wheel(0, 400);
    await this.validateElementVisibility(
      this.selectors.guideTeam(data),
      "Guide Team"
    );
    //await this.page.locator(this.selectors.guideTeam(data)).scrollIntoViewIfNeeded();
    await this.page.mouse.wheel(0, 500);
    await this.mouseHover(this.selectors.guideTeam(data), "Guide Team");
    await this.page
      .locator(this.selectors.guideTeam(data))
      .click({ force: true });
    // await this.click(this.selectors.guideTeam(data), `Guide Type`, "Link")
    await this.page.waitForLoadState("load");
    await this.wait("maxWait");
  }
  async clickTeamEnrollementStatus() {
    await this.wait("mediumWait");
    await this.validateElementVisibility(
      this.selectors.viewUpdateStatus,
      "Team Enrollment Status"
    );
    await this.click(
      this.selectors.viewUpdateStatus,
      `Team Enrollment Status`,
      "Link"
    );
    await this.page.waitForLoadState("load");
    await this.wait("maxWait");
  }
  public async searchTeamUser(data: string) {
    await this.wait("minWait");
    await this.page.locator(this.selectors.searchTeamUser).scrollIntoViewIfNeeded();
    await this.typeAndEnter(
      this.selectors.searchTeamUser,
      "Search Team User",
      data
    );
    await this.wait("minWait");
    await this.page.mouse.wheel(0, 150);
  }

  /**
   * Enter address in Address 1 field
   * @param address - The address value to enter
   */
  public async enterAddress1(address: string) {
    await this.wait("minWait");
    await this.type(this.selectors.address1Input, "Address 1", address);
  }

  /**
   * Select country from dropdown
   * @param country - The country name to select
   */
  public async selectCountry(country: string) {
    await this.wait("minWait");
    await this.click(this.selectors.Countrydropdown, "Country", "Dropdown");
    await this.type(this.selectors.CountryInput, "Country Input", country);
    await this.wait("minWait");
    await this.mouseHover(this.selectors.CountryOption(country), country);
    await this.click(this.selectors.CountryOption(country), country, "Option");
  }

  /**
   * Select state from dropdown
   * @param state - The state/province name to select
   */
  public async selectState(state: string) {
    await this.wait("minWait");
    await this.click(this.selectors.statedropdown, "State/Province", "Dropdown");
    await this.type(this.selectors.stateInput, "State Input", state);
    await this.wait("minWait");
    await this.mouseHover(this.selectors.stateOption(state), state);
    await this.click(this.selectors.stateOption(state), state, "Option");
  }
}
