  import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";
import {nonComplianceCertificationExpiry_CronJob } from "../DB/DBJobs";
import { en } from "@faker-js/faker";
let courseName1 = FakerData.getCourseName();
let courseName2 = FakerData.getCourseName();

const description = FakerData.getDescription();

  test(`Verify_the_EL_course_status_when_those_are_attached_to_the_learning_path_and_when_the_admin_enrolls_the_learning_path`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
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

    test(`Creation of Certification and Enable Certification revalidate`, async ({ adminHome, learningPath, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Certification Creation with pre and post assessment attached` },
            { type: `Test Description`, description: `Certification Creation with pre and post assessment attached` }
        )

        await adminHome.loadAndLogin("CUSTOMERADMIN1")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(title);
        await learningPath.description(description);
        await learningPath.language();
        await learningPath.hasRecertification();
        await learningPath.clickExpiresButton()
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
         await learningPath.addRecertificationCourse();
        await learningPath.chooseRecertificationMethod("Copy from certification path");
        await learningPath.saveRecertificationMultipleCourses([courseName1, courseName2]);

        await createCourse.clickCatalog()
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

    })
    test(`Complete the certification`, async ({ learnerHome, catalog, dashboard }) => {


        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickCatalog();
        await catalog.searchCatalog(title);
        await catalog.clickEnrollButton();
        await catalog.clickViewCertificationDetails();
        await catalog.saveLearningStatus();
        await catalog.clickOnNextCourse(courseName2);
        await catalog.saveLearningStatus();

    })

    test(`Cron job to make certification expiry`, async ({ }) => {

        await certificationExpiry_CronJob();
    })

     test(`Re-validate the certification and complete it as a learner`, async ({ adminHome, enrollHome, catalog, editCourse, learnerHome }) => {

        await adminHome.loadAndLogin("CUSTOMERADMIN1")
        await adminHome.menuButton()
        await adminHome.wait("maxWait");
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectByOption("Certification");
        await enrollHome.selectBycourse(title);
        
        // Wait for certification status to change from Completed to Expired after cron job (approx 2 mins)
        console.log("⏳ Waiting 2 minutes for certification to expire...");
        await adminHome.page.waitForTimeout(120000); // Wait 2 minutes
        
        await enrollHome.clickViewLearner();
        
        
        
        await enrollHome.selectEnrollOrCancel("Recertify");
        await enrollHome.saveBtn();
        await enrollHome.clickModifyEnrollBtn();
        await enrollHome.selectCertificationType("Certification");
        await enrollHome.verifyStatusInManageEnrollment("Enrolled");


        await enrollHome.manageEnrollment("View Status/Enroll Learner to TP Courses");
        await enrollHome.searchUser(credentials.LEARNERUSERNAME.username)
        await enrollHome.clickSearchUserCheckbox(credentials.LEARNERUSERNAME.username)

        await enrollHome.clickSelectLearner();
        await enrollHome.searchandSelectTP(title)
        await enrollHome.checkRecertificationCheckbox()
        // await enrollHome.selectCls();
        
        // Verify status for all courses added to the TP in one call
        await enrollHome.verifyInstanceStatus([courseName1, courseName2], "Enrolled");



     })