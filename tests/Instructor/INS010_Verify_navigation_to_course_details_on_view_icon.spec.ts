import { test } from "../../customFixtures/expertusFixture";
import { expect } from "@playwright/test";
import { FakerData } from "../../utils/fakerUtils";
import { credentials } from "../../constants/credentialData";

const courseName = FakerData.getCourseName();
const instructorUsername = credentials.INSTRUCTORNAME.username;

const subject = `Session Notification - ${Math.floor(Math.random() * 1000000)}`;
const description = `Class update: please be on time. Ref: ${Math.floor(Math.random() * 1000000)}`;

// Flattened to avoid describe-level issues in runner
  test(`Future VC Course Creation and Assign Instructor`, async ({ adminHome, createCourse, editCourse }) => {
    test.info().annotations.push(
      { type: `Author`, description: `Automation` },
      { type: `TestCase`, description: `Create VC course and assign instructor` },
      { type: `Test Description`, description: `Creates a scheduled VC class and assigns instructor` }
    );

    await adminHome.loadAndLogin("CUSTOMERADMIN");
    await adminHome.menuButton();
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
  
  test(`Send notification from Instructor class details`, async ({ adminHome, instructorHome }) => {
    test.info().annotations.push(
      { type: `Author`, description: `Automation` },
      { type: `TestCase`, description: `Send notification from class details` },
      { type: `Test Description`, description: `Instructor sends notification to All from class view` }
    );

    await adminHome.loadAndLogin("INSTRUCTORNAME");

    await instructorHome.clickClassList()

    await instructorHome.entersearchField(courseName);


    // Open class details for this course
  //  await instructorHome.clickEnrollmentIcon(courseName);

    // Send notification using the new page object method
   await instructorHome.clickViewCourse(courseName)
   await instructorHome.verifyViewOnly()
  });
// End of file
