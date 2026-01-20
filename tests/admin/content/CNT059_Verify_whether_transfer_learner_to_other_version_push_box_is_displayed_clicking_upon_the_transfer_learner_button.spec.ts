import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils";
import { credentials } from "../../../constants/credentialData";

const courseName = FakerData.getRandomTitle();
const title = FakerData.getRandomTitle();
test(`Verify whether transfer learner to other version push box is displayed clicking upon the transfer learner button`, async ({ adminHome, contentHome, bannerHome, createCourse, enrollHome }) => {
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
    await enrollHome.selectBycourse(courseName)
    await enrollHome.clickSelectedLearner();
    await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username)
    await enrollHome.clickEnrollBtn();
    await enrollHome.verifytoastMessage()
    await adminHome.page.reload();
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickContentmenu();
    await contentHome.contentVisiblity(title);
    await contentHome.clickEditContentOnListing();
    await contentHome.clickAddVersionBtn();
    await contentHome.uploadContent("Original_recording5.mp4");
    await bannerHome.clickPublish();
    await contentHome.clickEditContent();
    await contentHome.clickTransferLearnerBtn();
    await contentHome.verifyTransferLearnerPopUp();

})