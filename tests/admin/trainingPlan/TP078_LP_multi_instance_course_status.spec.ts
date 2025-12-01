import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";

const courseName = "API " + FakerData.getCourseName();
const class2 = "Classroom " + FakerData.getCourseName();
const class1 = "VirtualClass " + FakerData.getCourseName();
const description = FakerData.getDescription();
let createdCode: any
let access_token: string
let user = credentials.LEARNERUSERNAME.username

const sessionName = FakerData.getSession();
const elCourseName = ("Elearning" + " " + FakerData.getCourseName());
let tag: any
const instructorName = credentials.INSTRUCTORNAME.username

test.describe(`Verify_the_Multi_Instance_coutrse_status_when_those_are_attached_to_the_learning_path_and_when_the_admin_enrolls_the_learning_path`, () => {
  test.describe.configure({ mode: "serial" });
  test(`Multiple Course Creation for Classroom`, async ({ adminHome, createCourse, editCourse, contentHome, catalog }) => {
    test.info().annotations.push(
      { type: `Author`, description: `Balasundar` },
      { type: `TestCase`, description: `Create the course as multiple instance` },
      { type: `Test Description`, description: `Verify that course should be created as multiple instance when ILT or VC delivery type is chosen` }
    );
      
        // Login and create classroom-based multi-instance course
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.clickMenu("Course");
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        
        // Fill course basic information
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("ILT/VC multi-instance catalog test: " + description);
        
        // Select Classroom delivery type (ILT)
        await createCourse.selectdeliveryType("Classroom");
        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown();
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        
        // Save course
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        
        // Add tags for catalog filtering
        await createCourse.editcourse();
        await editCourse.clickClose();
        
        await createCourse.typeDescription("ILT/VC multi-instance catalog test: " + description);

        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        
        // Add Classroom (ILT) instance
        await createCourse.clickEditCourseTabs();
        await createCourse.addInstances();
        
        async function addinstance(deliveryType: string) {
            await createCourse.selectInstanceDeliveryType(deliveryType);
            await createCourse.clickCreateInstance();
        }
        
        await addinstance("Classroom");
        await createCourse.enter("course-title", class1);

        await createCourse.enterSessionName(sessionName);
        await createCourse.setMaxSeat();
        await createCourse.enterDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        
        console.log("Classroom (ILT) instance created successfully");
        
        // Add Virtual Class (VC) instance
         await createCourse.navigateToListingAndSearchCourse(courseName);
        await createCourse.addInstances();
        await addinstance("Virtual Class");
        await createCourse.enter("course-title", class2);

        await createCourse.selectMeetingType(instructorName, courseName, 1);
        await createCourse.typeAdditionalInfo();
        await createCourse.setMaxSeat();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        
        console.log("Virtual Class (VC) instance created successfully");
        
        // Add E-Learning instance for comparison
        await createCourse.navigateToListingAndSearchCourse(courseName);
        await createCourse.addInstances();
        await addinstance("E-Learning");
        await createCourse.enter("course-title", elCourseName);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        
        console.log("ILT/VC/E-Learning multi-instance course created: " + courseName);
  })
  let title = FakerData.getCourseName();
  //let title="Primary Microchip Bypass";

  test(`Creation of Certification with that created multi-instance course`, async ({ adminHome, learningPath, createCourse, editCourse }) => {
    

    await adminHome.loadAndLogin("CUSTOMERADMIN1")
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickLearningPath();
    await learningPath.clickCreateLearningPath();
    await learningPath.title(title);
    await learningPath.description(description);
    await learningPath.language();
    await learningPath.clickSaveAsDraftBtn();
    await learningPath.clickSave();
    await learningPath.clickProceedBtn();
    await learningPath.clickAddCourse();
    await learningPath.searchAndClickCourseCheckBox(courseName);

    await learningPath.clickAddSelectCourse();
    await learningPath.clickDetailTab();
    await createCourse.clickCatalog()
    await createCourse.clickUpdate();
    await createCourse.verifySuccessMessage();

  })

  test(`Verify that multi instance course and Enroll the required instance from Learning Path`, async ({ adminHome, enrollHome, catalog, editCourse, learnerHome }) => {

    await adminHome.loadAndLogin("CUSTOMERADMIN1")
    await adminHome.menuButton()
    await adminHome.clickEnrollmentMenu();
    await adminHome.clickEnroll();
    await enrollHome.selectByOption("Learning Path");
    await enrollHome.selectBycourse(title)
    await enrollHome.clickSelectedLearner();
    await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
    await enrollHome.clickEnrollBtn();

    await enrollHome.clickModifyEnrollBtn();

    await enrollHome.manageEnrollment("View Status/Enroll Learner to TP Courses");
    await enrollHome.searchUser(credentials.LEARNERUSERNAME.username)
    await enrollHome.clickSearchUserCheckbox(credentials.LEARNERUSERNAME.username)

    await enrollHome.clickSelectLearner();
    await enrollHome.searchandSelectTP(title)
    await enrollHome.selectCls();

    // Verify courses inside TP and enroll the EL course
    await enrollHome.verifyTPHasCourses([class1,class2,elCourseName]);
    await enrollHome.enrollCourseByName(elCourseName);

    await enrollHome.searchUser(credentials.LEARNERUSERNAME.username)
    await enrollHome.clickSearchUserCheckbox(credentials.LEARNERUSERNAME.username)

    await enrollHome.clickSelectLearner();
    await enrollHome.searchandSelectTP(title)
    await enrollHome.selectCls();

    await enrollHome.verifyCourseEnrolledInTP(elCourseName)



  })
})