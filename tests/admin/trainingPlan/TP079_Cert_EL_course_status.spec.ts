  import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";
let courseName1 = FakerData.getCourseName();
let courseName2 = FakerData.getCourseName();

const description = FakerData.getDescription();

  test(`Verify_the_EL_course_status_when_those_are_attached_to_the_Certification_and_when_the_admin_enrolls_the_certification`, async ({ adminHome, createCourse }) => {
        test(`Creation of two EL course`, async ({ adminHome, learningPath, createCourse, editCourse }) => {
    
    test.info().annotations.push(
            { type: `Author`, description: `Balasundar` },
            { type: `TestCase`, description: `Creation of Elearning Course` },
            { type: `Test Description`, description: `Creation of Elearning Course` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN1")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName1);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course,:" + description);
        await createCourse.contentLibrary(); //By default Youtube content will be attached to the course
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

        await createCourse.createCourseButton();
         await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName2);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course,:" + description);
        await createCourse.contentLibrary(); //By default Youtube content will be attached to the course
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

    })
    let title = FakerData.getCourseName();
    //let title="Primary Microchip Bypass";

    test(`Creation of Certification and attach that created 2 EL courses`, async ({ adminHome, learningPath, createCourse, editCourse }) => {
       
        await adminHome.loadAndLogin("CUSTOMERADMIN1")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(title);
        await learningPath.description(description);
        await learningPath.language();
        await learningPath.clickSaveAsDraftBtn();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName1);
        await learningPath.clickAddSelectCourse();

        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName2);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await createCourse.clickCatalog()
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

    })

     test(`Verify that EL course and Enroll the required instance from Certification path`, async ({ adminHome, enrollHome, catalog, editCourse, learnerHome }) => {

        await adminHome.loadAndLogin("CUSTOMERADMIN1")
        await adminHome.menuButton()
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectByOption("Certification");
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
        // await enrollHome.selectCls();
        
        // Verify status for all courses added to the TP in one call
        await enrollHome.verifyInstanceStatus([courseName1, courseName2], "Enrolled");



     })})