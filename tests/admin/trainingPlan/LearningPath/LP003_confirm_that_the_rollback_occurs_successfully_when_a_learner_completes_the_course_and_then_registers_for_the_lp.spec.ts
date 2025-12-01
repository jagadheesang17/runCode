import { test } from "../../../../customFixtures/expertusFixture"
import { FakerData } from '../../../../utils/fakerUtils';

const courseName = FakerData.getCourseName();
const TPName = "Rollback" +" " +FakerData.getCourseName();
const description = FakerData.getDescription();
let contentName:any;

//Same course is attached to tp
//Learner completes the course as standalone then register for TP.

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

    test(`Learning_Path_single_instance`, async ({ adminHome, learningPath, createCourse }) => {
            test.info().annotations.push(
                { type: `Author`, description: `Arivazhagan P` },
                { type: `TestCase`, description: `Learning_Path_single_instance` },
                { type: `Test Description`, description: `Learning_Path_single_instance` }
            )
    
            await adminHome.loadAndLogin("CUSTOMERADMIN")
            await adminHome.menuButton();
            await adminHome.clickLearningMenu();
            await adminHome.clickLearningPath();
            await learningPath.clickCreateLearningPath();
            await learningPath.title(TPName);
            await learningPath.description(description);
            await learningPath.language();
            await learningPath.clickSave();
            await learningPath.clickProceedBtn();
            await learningPath.clickAddCourse();
            await learningPath.searchAndClickCourseCheckBox(courseName);
            //await learningPath.searchAndClickCourseCheckBox("Redundant System Program");
            await learningPath.clickAddSelectCourse();
            await learningPath.clickDetailTab();
            await learningPath.clickCatalogBtn();
            await learningPath.clickUpdateBtn();
            await learningPath.verifySuccessMessage();
         //   await learningPath.clickEditLearningPath()
        //    await createCourse.clickDetailButton();
         //   await createCourse.clickUpdate();
         //   await createCourse.verifySuccessMessage();
        })

    test(`confirm_that_the_rollback_occurs_successfully_when_a_learner_completes_the_course_and_then_registers_for_the_certification.`, async ({ learnerHome, catalog, dashboard }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `confirm_that_the_rollback_occurs_successfully_when_a_learner_completes_the_course_and_then_registers_for_the_certification.` },
            { type: `Test Description`, description: `confirm_that_the_rollback_occurs_successfully_when_a_learner_completes_the_course_and_then_registers_for_the_certification.` }

        );
     //   let  TPName="Rollback Mobile Panel Input_Copy_Copy";
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(TPName);
        await catalog.clickEnrollButton();
        await catalog.clickViewLearningPathDetails()
        await catalog.verifyCompletedCourse(TPName);
        await catalog.verifyStatus("Completed") ;  //TP status   
        await catalog.verifyTPOverallProgressPercentage(); //TP overall percentage verification
        await catalog.verifytpCourseStatus(TPName,"Completed"); //TP particular course status
        await catalog.verifyContentProgressValue(contentName); //Content progress value verification     
 })
})