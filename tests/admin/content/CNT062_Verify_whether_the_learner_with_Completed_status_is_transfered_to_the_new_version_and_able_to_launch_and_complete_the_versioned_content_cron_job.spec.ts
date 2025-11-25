import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";
import { credentials } from "../../../constants/credentialData";
import { contentTransfer } from "../DB/DBJobs";
import { ne } from "@faker-js/faker";
let courseName: any="";
let title : any ="";
let newTitle: any ="";
let version: any = "";
test(`Verify whether the content has been created and added to the course  `, async ({ adminHome, contentHome, bannerHome, createCourse, enrollHome }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `Verify whether the content has been created and added to the courses` },
        { type: `Test Description`, description: `Verify whether the content has been created and added to the course` }
    );
    courseName = FakerData.getCourseName();
    newTitle = FakerData.getRandomTitle();
    title = FakerData.getRandomTitle();
    await adminHome.loadAndLogin("LEARNERADMIN");
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickContentmenu();
    await contentHome.clickCreateContent();
    await contentHome.enter("content-title", title);
    await contentHome.enterDescription("Sample video content for " + title);
    await contentHome.uploadContent("samplevideo.mp4");
    await bannerHome.clickPublish();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();
    await createCourse.clickCreateCourse();
    await createCourse.verifyCreateUserLabel("CREATE COURSE");
    await createCourse.enter("course-title", courseName);
    await createCourse.selectLanguage("English");
    await createCourse.typeDescription("This is a new course by name :" + FakerData.getDescription());
    await createCourse.contentLibrary(title);
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    await adminHome.menuButton();
    await adminHome.clickEnrollmentMenu();
    await adminHome.clickEnroll();
    await enrollHome.selectBycourse(courseName);
    await enrollHome.clickSelectedLearner();
    await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
    await enrollHome.clickEnrollBtn();
    await enrollHome.verifytoastMessage();
    await adminHome.page.reload();
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickContentmenu();
    await contentHome.contentVisiblity(title);
    await contentHome.clickEditContentOnListing();
    await contentHome.clickAddVersionBtn();
    await contentHome.enter("content-title", newTitle  );
    await contentHome.uploadContent("Original_recording5.mp4");
    await bannerHome.clickPublish();
    await contentHome.clickEditContent();
    version = await contentHome.getNewVersionNumber();
    await contentHome.clickTransferLearnerBtn();
    await contentHome.verifyTransferLearnerPopUp();
    await contentHome.clickTransferFrom();
    await contentHome.selectContentVersion(version);
    await contentHome.selectclass(courseName);
    await contentHome.selectLearnerStatus('Completed');
    await contentHome.clickAddBtnTransferEnrollment();
    await contentHome.clickTransferLearnerbtn();
})
test(`Verify that the non transferred content available in the course details page and verify able to launch and complete the course `, async ({ learnerHome, catalog }) => {
           await learnerHome.learnerLogin("LearnerGroup1user", "DefaultPortal");
           await catalog.clickMyLearning();
           await catalog.searchMyLearning("Solid state Program");
           await catalog.clickCourseInMyLearning("Solid state Program");
           await catalog.clickLaunchButton();
           await catalog.saveLearningStatus();
           await catalog.verifyCompletedCourse("Completed");
           await catalog.verifyContentProgressValue(title,"100%");

           
 })                

test(`Cron Job to transfer learner`, async ({  }) => 
                {
                       await contentTransfer();
                   });



test(`Verify that the transferred content available in the course details page and verify able to launch and complete the course from the completed status `, async ({ learnerHome, catalog }) => {
           await learnerHome.learnerLogin("LearnerGroup1user", "DefaultPortal");
           await catalog.clickMyLearning();
           await catalog.searchMyLearning(courseName);
           await catalog.clickCompletedButton();
           await catalog.clickCourseInMyLearning(courseName);
           await catalog.verifyCContentTitle(newTitle);
           await catalog.verifyContentVersion(version);
           await catalog.verifyContentProgressValue(newTitle,"0%");
           await catalog.clickLaunchButton();
           await catalog.saveLearningStatus();
           await catalog.verifyCompletedCourse("Completed");

           
 })                
