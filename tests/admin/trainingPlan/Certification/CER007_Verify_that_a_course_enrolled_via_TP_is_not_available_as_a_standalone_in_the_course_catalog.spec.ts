import { test } from "../../../../customFixtures/expertusFixture"
import { FakerData } from '../../../../utils/fakerUtils';

const courseName = FakerData.getCourseName();
const TPName = "Rollback" +" " +FakerData.getCourseName();
const description = FakerData.getDescription();
let contentName:any;

//Learner completes the course under a TP then search for the course in catalog and verify the course is not available in catalog

test.describe(`confirm_that_the_rollback_occurs_successfully_when_a_learner_completes_the_course_and_then_registers_for_the_certification.`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Creation of Single Instance Elearning with Youtube content`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Creation of Single Instance Elearning with Youtube content` },
            { type: `Test Description`, description: `Creation of Single Instance Elearning with Youtube content` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name :" + description);
        await createCourse.contentLibrary();//Youtube content is attached here
        contentName= await createCourse.getAttachedContentName()
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
    })

    test(`Learner registration and completion of a single eLearning course.`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Learner registration and completion of a single eLearning course` },
            { type: `Test Description`, description: `Learner registration and completion of a single eLearning course` }
        );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(courseName);
        await catalog.clickMoreonCourse(courseName);
        await catalog.clickSelectcourse(courseName);
        await catalog.clickEnroll();
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.clickMyLearning();
        await catalog.clickCompletedButton();
        await catalog.searchMyLearning(courseName);
        await catalog.verifyCompletedCourse(courseName);
    })

    test(`Creation of a certification with a single eLearning course attached`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Creation of a certification with a single eLearning course attached` },
            { type: `Test Description`, description: `Creation of a certification with a single eLearning course attached` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(TPName);
        await learningPath.description(description);
        await learningPath.language();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        await learningPath.clickEditCertification();
        // await learningPath.getCodeValue();
        await createCourse.clickCompletionCertificate();
        await createCourse.clickCertificateCheckBox();
        await createCourse.clickAdd();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

    })

    test(`Confirm that a learner can successfully register for and complete a certification through a single-instance course.`, async ({ learnerHome, catalog, dashboard }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Confirm that a learner can successfully register for and complete a certification through a single-instance course.` },
            { type: `Test Description`, description: `Confirm that a learner can successfully register for and complete a certification through a single-instance course.` }

        );
        //let  TPName="Rollback Redundant Sensor Calculate_Copy_Copy";
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(TPName);
        await catalog.clickEnrollButton();
        await catalog.clickViewCertificationDetails();
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.clickViewCertificate();
       // await catalog.verifyCompletedCourse(TPName);
        await catalog.verifyStatus("Completed") ;  //TP status   
        await catalog.verifyTPOverallProgressPercentage(); //TP overall percentage verification
        await catalog.verifytpCourseStatus(TPName,"Completed"); //TP particular course status
        await catalog.verifyContentProgressValue(contentName); //Content progress value verification     
 })
 test(`Learner registration and search for the already enrolled eLearning course.`, async ({ learnerHome, catalog }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Arivazhagan P` },
        { type: `TestCase`, description: `Learner registration and search for the already enrolled eLearning course.` },
        { type: `Test Description`, description: `Learner registration and search for the already enrolled eLearning course.` }
    );

    //let courseName="Arivazhagan Course 1";
    await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
    await learnerHome.clickCatalog();
    await catalog.mostRecent();
    await catalog.searchCatalog(courseName);
    await catalog.mylearningNoResultsFound();
   
})


})