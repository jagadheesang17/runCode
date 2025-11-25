import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";
import { credentials } from "../../../constants/credentialData";

const courseName = FakerData.getRandomTitle();
const title = FakerData.getRandomTitle();
const title1 = FakerData.getRandomTitle();
const title2 = FakerData.getRandomTitle();
test(`EVerfiy whether transfer learner to other version button is not enabled if the content is not attached with course`, async ({ adminHome, contentHome, bannerHome, createCourse, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `Verfiy whether transfer learner to other version button is not enabled if the content is not attached with course` },
        { type: `Test Description`, description: `Verfiy whether transfer learner to other version button is not enabled if the content is not attached with course` }
    );
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
    await contentHome.clickEditContent();
    await contentHome.clickAddVersionBtn();
    await contentHome.uploadContent("Original_recording5.mp4");
    await bannerHome.clickPublish();
    await contentHome.clickEditContent();
    await contentHome.verifyTransferLearnerBtnForNonAssociatedContent();

})
test(`Verfiy whether transfer learner to other version button is not enabled when the content attached course is not having enrollments`, async ({ adminHome, contentHome, bannerHome, createCourse, SurveyAssessment }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `Verfiy whether transfer learner to other version button is not enabled when the content attached course is not having enrollments` },
        { type: `Test Description`, description: `Verfiy whether transfer learner to other version button is not enabled when the content attached course is not having enrollments` }
    );
    await adminHome.loadAndLogin("LEARNERADMIN");
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickContentmenu();
    await contentHome.clickCreateContent();
    await contentHome.enter("content-title", title1);
    await contentHome.enterDescription("Sample video content for " + title1);
    await contentHome.uploadContent("samplevideo.mp4");
    await bannerHome.clickPublish();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();
    await createCourse.clickCreateCourse();
    await createCourse.verifyCreateUserLabel("CREATE COURSE");
    await createCourse.enter("course-title", FakerData.getRandomTitle());
    await createCourse.selectLanguage("English");
    await createCourse.typeDescription("This is a new course by name :" + FakerData.getDescription());
    await createCourse.contentLibrary(title1);
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickContentmenu();
    await contentHome.contentVisiblity(title1);
    await contentHome.clickEditContentOnListing();
    await contentHome.clickAddVersionBtn();
    await contentHome.uploadContent("Original_recording5.mp4");
    await bannerHome.clickPublish();
    await contentHome.clickEditContent();
    await contentHome.verifyTransferLearnerBtn();

})

test.only(`Verfiy whether transfer learner to other version button is enabled only when Content is associated to the class, Learners are enrolled in the class and Content has more than one version`, async ({ adminHome, contentHome, bannerHome, createCourse, enrollHome }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Divya` },
        { type: `TestCase`, description: `Verfiy whether transfer learner to other version button is enabled only when Content is associated to the class, Learners are enrolled in the class and Content has more than one version` },
        { type: `Test Description`, description: `Verfiy whether transfer learner to other version button is enabled only when Content is associated to the class, Learners are enrolled in the class and Content has more than one version` }
    );
    await adminHome.loadAndLogin("LEARNERADMIN");
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickContentmenu();
    await contentHome.clickCreateContent();
    await contentHome.enter("content-title", title2);
    await contentHome.enterDescription("Sample video content for " + title2);
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
    await createCourse.contentLibrary(title2);
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    await adminHome.menuButton();
    await adminHome.clickEnrollmentMenu();
    await adminHome.clickEnroll();
    await enrollHome.selectBycourse(courseName)
    await enrollHome.clickSelectedLearner();
    await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username)
    await enrollHome.clickEnrollBtn();
    await enrollHome.verifytoastMessage()
    await adminHome.page.reload();
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickContentmenu();
    await contentHome.contentVisiblity(title2);
    await contentHome.clickEditContentOnListing();
    await contentHome.clickAddVersionBtn();
    await contentHome.uploadContent("Original_recording5.mp4");
    await bannerHome.clickPublish();
    await contentHome.clickEditContent();
    await contentHome.verifyTransferLearnerBtnEnabled();

})