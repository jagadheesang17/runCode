import { test } from "../../customFixtures/expertusFixture"
import { FakerData } from '../../utils/fakerUtils';


const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const certificartionDescription=FakerData.getDescription();
const title = FakerData.getcertificationTitle();

test.describe.configure({ mode: "serial" });
test.skip(`Ensure that learner able to view the completion certificate in the certificartions section under One Profile`, async ({ adminHome,createCourse, contentHome,CompletionCertification }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Creation of a new completion certificate and added to the e-learning course` },
        { type: `Test Description`, description: `Creation of a new completion certificate and added to the e-learning course` }
    );
    await adminHome.loadAndLogin("CUSTOMERADMIN")
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCompletionCertification();
    await CompletionCertification.clickCreateCompletionCertificate();
    await CompletionCertification.verify_CompletionCertificateLabel();
    await CompletionCertification.clickTemplateType();
    await CompletionCertification.title(title);
    await CompletionCertification.designCertificate(certificartionDescription);
    await CompletionCertification.clickPublish();
    await CompletionCertification.clickProceed();
    await CompletionCertification.verifyCeritificateSuccessMessage();
    await contentHome.gotoListing();
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickCourseLink();
    await createCourse.clickCreateCourse();
    await createCourse.verifyCreateUserLabel("CREATE COURSE");
    await createCourse.enter("course-title", courseName);
    await createCourse.selectLanguage("English");
    await createCourse.typeDescription("This is a new course by name :" + description);
    await createCourse.contentLibrary();
    await createCourse.clickCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();
    await createCourse.verifySuccessMessage();
    await createCourse.editcourse();
    await createCourse.clickCompletionCertificate();
    await createCourse.clickSpecificCertificateCheckBox(title);
    await createCourse.clickAdd();
    await createCourse.clickCatalog();
    await createCourse.clickUpdate();
    await createCourse.verifySuccessMessage()
})


test.skip(`Verify that learner able to view the completion crertificate in the certificartions section under One Profile`, async ({ learnerHome, profile,catalog }) => {

    test.info().annotations.push(
        { type: `Author`, description: `Tamilvanan` },
        { type: `TestCase`, description: `Verify that learner able to view the completion crertificate` },
        { type: `Test Description`, description: `Verify that learner able to view the completion crertificate` }
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
    await profile.clickProfile();
    await profile.clickViewCertificateInOneProfile(courseName,certificartionDescription)
})