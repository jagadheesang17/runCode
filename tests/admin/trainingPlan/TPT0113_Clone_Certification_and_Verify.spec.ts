import { credentials } from "../../../constants/credentialData";
import { URLConstants } from "../../../constants/urlConstants";
import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const certificationTitle = ("Cert_Clone_" + FakerData.getCourseName());
const learnerUser = credentials.LEARNERUSERNAME.username;
let actualClonedTitle: string;

test.describe(`TP0113: Clone Certification and Verify`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Step 1: Create Single Instance Elearning Course`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create Single Instance Elearning Course` },
            { type: `Test Description`, description: `Create a course to attach to certification` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
    });

    test(`Step 2: Create Certification and Attach Course`, async ({ createCourse, contentHome, learningPath, adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create Certification with EL Course` },
            { type: `Test Description`, description: `Create Certification and attach the created course` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(certificationTitle);
        await learningPath.language();
        await learningPath.description(description);
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await learningPath.verifySuccessMessage();
        await contentHome.gotoListing();
        await learningPath.clickCloneIcon(certificationTitle);
        
        // Get available clone options
        const cloneLabels = await learningPath.getCloneFormLabels();
        console.log("Available clone options:", cloneLabels);        
        // Click Create Copy button
        await learningPath.clickCreateCopy();
        actualClonedTitle = await learningPath.verifyClonedTitle(certificationTitle);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await learningPath.verifySuccessMessage();
    });

    test(`Step 3: Learner Enrollment and Completion of Cloned Certification`, async ({ adminHome, learningPath, createCourse, learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Enroll and Complete Cloned Certification` },
            { type: `Test Description`, description: `Learner enrolls and completes the cloned certification` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(actualClonedTitle);
        await catalog.clickEnrollButton();
        await catalog.clickViewCertificationDetails();
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.saveLearningStatus();
        
        console.log(`✅ Successfully enrolled and completed the cloned Certification: ${actualClonedTitle}`);
    });
});
