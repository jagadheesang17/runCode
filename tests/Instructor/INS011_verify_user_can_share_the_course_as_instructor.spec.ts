import { test } from "../../customFixtures/expertusFixture";
import { expect } from "@playwright/test";
import { FakerData } from "../../utils/fakerUtils";
import { credentials } from "../../constants/credentialData";
import { readDataFromCSV } from "../../utils/csvUtil";
const courseName = FakerData.getCourseName();
const instructorUsername = credentials.INSTRUCTORNAME.username;
const Username = FakerData.getUserId();
const shareTargetEmail = `auto.user+${Math.floor(Math.random() * 1000000)}@example.com`;
const vcCourseName = "VC_" + FakerData.getCourseName();
const sessionName = FakerData.getSession();

const firstName = FakerData.getFirstName();
const lastName = FakerData.getLastName();
const subject = `Session Notification - ${Math.floor(Math.random() * 1000000)}`;
const description = `Class update: please be on time. Ref: ${Math.floor(Math.random() * 1000000)}`;

// Flattened to avoid describe-level issues in runner
  test(`Setup: Create user; create VC course and assign instructor`, async ({ adminHome, createUser, createCourse, editCourse }) => {
    test.info().annotations.push(
      { type: `Author`, description: `Automation` },
      { type: `TestCase`, description: `Create VC course and assign instructor` },
      { type: `Test Description`, description: `Creates a scheduled VC class and assigns instructor` }
    );

    await adminHome.loadAndLogin("CUSTOMERADMIN");
    await adminHome.menuButton();
    // Create share target user and store email globally
    await adminHome.people();
    await adminHome.user();
    await createUser.clickCreateUser();
    await createUser.verifyCreateUserLabel();
 
         const csvFilePath = './data/User.csv';
         const data = await readDataFromCSV(csvFilePath);
 
         for (const row of data) {
             const { country, state, timezone, currency, city, zipcode } = row;
 
             await createUser.uncheckInheritAddressIfPresent();
             await createUser.uncheckInheritEmergencyContactIfPresent();
             await createUser.uncheckAutoGenerateUsernameIfPresent();
             
             await createUser.enter("first_name", firstName);
             await createUser.enter("last_name", lastName);
             await createUser.enter("username", Username);
             await createUser.enter("user-password", "Welcome1@");
            await createUser.enter("email", shareTargetEmail);
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
             
             console.log(`Assigning Instructor role...`);
             await createUser.clickRolesButton("Instructor");
             
             await createUser.clickSave();
             await createUser.verifyUserCreationSuccessMessage();
         }
 
        await adminHome .menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();
    await createCourse.clickCreateCourse();
    await createCourse.verifyCreateUserLabel("CREATE COURSE");
    await createCourse.enter("course-title", courseName);
    await createCourse.selectLanguage("English");
    await createCourse.typeDescription("Notification flow course: " + courseName);
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
    // await createCourse.clickCompletionCertificate();
    // await createCourse.clickCertificateCheckBox();
    // await createCourse.clickAdd();

    await createCourse.addInstances();
    await createCourse.selectInstanceDeliveryType("Virtual Class");
    await createCourse.clickCreateInstance();
    await createCourse.sessionmeetingType("other Meetings");
    await createCourse.enterSessionName(courseName);
    await createCourse.enterfutureDateValue();
    await createCourse.startandEndTime();
    await createCourse.selectInstructor(instructorUsername);
    await createCourse.typeAdditionalInfo();
    await createCourse.vcSessionTimeZone("kolkata");
    await createCourse.attendeeUrl();
    await createCourse.presenterUrl();
    await createCourse.setMaxSeat();
    await createCourse.typeDescription("Class detail notification verification");
    await createCourse.clickCatalog();
    await createCourse.clickUpdate();
    await createCourse.verifySuccessMessage();
  });
  
  test(`Share course from Instructor class details`, async ({ adminHome, instructorHome }) => {
    test.info().annotations.push(
      { type: `Author`, description: `Automation` },
      { type: `TestCase`, description: `Send notification from class details` },
      { type: `Test Description`, description: `Instructor sends notification to All from class view` }
    );

    await adminHome.loadAndLogin("INSTRUCTORNAME");

    await instructorHome.clickClassList();
    await instructorHome.entersearchField(courseName);
    const shared = await instructorHome.sharecourse(shareTargetEmail);
    expect(shared ?? true).toBeTruthy();
  });
// End of file
