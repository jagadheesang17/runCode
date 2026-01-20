import { test } from "../../../../customFixtures/expertusFixture";
import { FakerData,getRandomIns } from "../../../../utils/fakerUtils";
import { credentials } from "../../../../constants/credentialData";
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
let domain: any
const courseNames: string[] = [];
let sharedInstanceName: string | null = null;
//test.use({ storageState: "logins/expertuslearnerLog.json"})
test.describe(`Verify the Select Class functionality on the Enrollment page for the Training Plan.`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Creation of single instance-elearning`, async ({ adminHome, createCourse, contentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `Creation of single instance-elearning` },
            { type: `Test Description`, description: `Creation of single instance-elearning` }
        );
        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.clickMenu("Course");
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.selectdeliveryType("Classroom")
        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown()
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.editcourse();
        await createCourse.addInstances();
        async function addinstance(deliveryType: string) {
            await createCourse.selectInstanceDeliveryType(deliveryType);
        }
        await addinstance("Classroom");
        await createCourse.bulkClassCreation("2","manual",courseName);
        sharedInstanceName = getRandomIns();
    })
    const title: string = FakerData.getCourseName();
    test(`Creation of Certification with single instance and enrollment through select class`, async ({ adminHome, learningPath, createCourse ,enrollHome}) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `Creation of Certification with single instance` },
            { type: `Test Description`, description: `Creation of Certification with single instance` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(title);
        await learningPath.language();
        await learningPath.description(description);
        await learningPath.registractionEnds();
        await learningPath.clickExpiresButton();
        await learningPath.clickSaveAsDraftBtn();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        //admin enrollment
        await adminHome.menuButton()
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectByOption("Certification");
        await enrollHome.selectBycourse(title);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.TEAMUSER1.username)
        //await enrollHome.enterSearchUser(credentials.TEAMUSER2.username)
        await enrollHome.selectclassBtn();
        await enrollHome.learnerforSC(credentials.TEAMUSER1.username);
        await enrollHome.selectInstance(courseName);
        // const instance=getRandomIns();
        // console.log(instance);
        await enrollHome.searchCourseForSC(sharedInstanceName);
    })
    test(`Confirm that a learner can successfully register for and class through a select class funtionality
        .`, async ({ learnerHome, catalog, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `Confirm that a learner can successfully register for and complete a certification through a single-instance course.` },
            { type: `Test Description`, description: `Confirm that a learner can successfully register for and complete a certification through a single-instance course.` }
     );
     await learnerHome.learnerLogin("TEAMUSER1", "LeanrerPortal");
      await catalog.clickMyLearning();
        await catalog.searchMyLearning(sharedInstanceName);
        await catalog.clickCourseInMyLearning(sharedInstanceName);
        await catalog.verifyStatus("Enrolled");
    })
})