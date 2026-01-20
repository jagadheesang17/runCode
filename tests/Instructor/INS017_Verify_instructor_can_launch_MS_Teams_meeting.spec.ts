import { test } from "../../customFixtures/expertusFixture";
import { Page } from "@playwright/test";
import { FakerData } from "../../utils/fakerUtils";
import { readDataFromCSV } from "../../utils/csvUtil";

const instructorUsername = FakerData.getUserId();
const firstName = FakerData.getFirstName();
const lastName = FakerData.getLastName();
const vcCourseName = "VC_Teams_" + FakerData.getCourseName();

// Sample Microsoft Teams attendee URL (public meetup-join format)
const TEAMS_URL = "https://teams.microsoft.com/l/meetup-join/19%3ameeting_demo%40123/0?context=%7b%7d";

/**
 * Verify whether the host/instructor is able to launch the MS Teams meeting
 */

test.describe("INS017_Verify_instructor_can_launch_MS_Teams_meeting", () => {
  test.describe.configure({ mode: "serial" });

  test("Test 1: Create instructor user", async ({ adminHome, createUser }) => {
    await adminHome.loadAndLogin("CUSTOMERADMIN");
    await adminHome.clickMenu("User");
    await createUser.verifyCreateUserLabel();

    const csvFilePath = './data/User.csv';
    const data = await readDataFromCSV(csvFilePath);
    const row = data[0];
    const { country, state, timezone, currency, city, zipcode } = row;

    await createUser.uncheckInheritAddressIfPresent();
    await createUser.uncheckInheritEmergencyContactIfPresent();
    await createUser.uncheckAutoGenerateUsernameIfPresent();

    await createUser.enter("first_name", firstName);
    await createUser.enter("last_name", lastName);
    await createUser.enter("username", instructorUsername);
    await createUser.enter("user-password", "Welcome1@");
    await createUser.enter("email", instructorUsername);
    await createUser.enter("user-phone", FakerData.getMobileNumber());
    await createUser.typeAddress("Address 1", FakerData.getAddress());
    await createUser.typeAddress("Address 2", FakerData.getAddress());
    await createUser.select("Country", country);
    await createUser.select("State/Province", state);
    await createUser.select("Time Zone", timezone);
    await createUser.select("Currency", currency);
    await createUser.enter("user-city", city);
    await createUser.enter("user-zipcode", zipcode);
    await createUser.enter("user-mobile", FakerData.getMobileNumber());

    await createUser.clickRolesButton("Instructor");
    await createUser.clickSave();
    await createUser.verifyUserCreationSuccessMessage();
  });

  test("Test 2: Create VC course (MS Teams) and assign instructor", async ({ adminHome, createCourse, editCourse, instructorHome }) => {
    await adminHome.loadAndLogin("CUSTOMERADMIN");
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();

    await createCourse.clickCreateCourse();
    await createCourse.verifyCreateUserLabel("CREATE COURSE");
    await createCourse.enter("course-title", vcCourseName);
    await createCourse.selectLanguage("English");
    await createCourse.typeDescription("MS Teams meeting launch");

    await createCourse.selectdeliveryType("Virtual Class");
    await createCourse.handleCategoryADropdown();
    await createCourse.providerDropdown();
    await createCourse.selectTotalDuration();
    await createCourse.typeAdditionalInfo();
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();

    await createCourse.editcourse();
    await editCourse.clickTagMenu();
    await editCourse.selectTags();

    await createCourse.addInstances();
    await createCourse.selectInstanceDeliveryType("Virtual Class");
    await createCourse.clickCreateInstance();

    await createCourse.selectMeetingTypeWithRoundedTime(instructorUsername, vcCourseName, 1);
    await createCourse.click(createCourse.selectors.timeInput, "Start Time", "Input");
    const startTime = await instructorHome.selectStartTimeNearCurrent(1);
    await instructorHome.setEndTimeOneHourAfterStart(startTime, "//input[contains(@class,'end time')]");
    await createCourse.setAttendeeUrlForIndex(1, TEAMS_URL);
    await createCourse.setPresenterUrlForIndex(1, TEAMS_URL);

    await createCourse.clickCatalog();
    await createCourse.clickUpdate();
    await createCourse.verifySuccessMessage();
  });

  test("Test 3: Host/Instructor launches MS Teams meeting", async ({ learnerHome, instructorHome }) => {
    await learnerHome.basicLogin(instructorUsername, "DefaultPortal");
    await instructorHome.verifyInstructorPage();
    await instructorHome.clickClassesList();
     await instructorHome.clickFilter();
     await instructorHome.clearFilter();
      await instructorHome.clickFilter();
     await instructorHome.entersearchField(vcCourseName);
    await instructorHome.verifyCourseName(vcCourseName);

    const meetingPage: Page = await instructorHome.clickLaunchMeetingAndVerifyNewTab(vcCourseName);
    const ok = await instructorHome.verifyMeetingScreenLoaded(meetingPage);
    if (!ok) throw new Error("Meeting screen not verified for MS Teams");
    await meetingPage.close();
  });
});
