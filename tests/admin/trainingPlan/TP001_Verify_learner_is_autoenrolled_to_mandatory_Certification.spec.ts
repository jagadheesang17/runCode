import { credentials } from "../../../constants/credentialData";
import { URLConstants } from "../../../constants/urlConstants";
import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { updateCronDataJSON } from "../../../utils/jsonDataHandler";
import { updateCertificationComplianceFlow } from "../DB/DBJobs";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const user = credentials.LEARNERUSERNAME.username
test.describe(`Verify learner is autoenrolled to mandatory Certification`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Single Instance Elearning Course`, async ({ adminHome, createCourse}) => {
        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Single Instance Elearning Course` },
            { type: `Test Description`, description: `Single Instance Elearning Course` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN")
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

    })


   const title = ("Cron" + FakerData.getCourseName());

    test(`Mandatory Certification with Single Instance Elearning Course`, async ({ learningPath, adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Mandatory Certification with Single Instance Elearning Course` },
            { type: `Test Description`, description: `Mandatory Certification with Single Instance Elearning Course` }
        );
        const newData = {
           TP001: title
        }
       updateCronDataJSON(newData)

       // let courseName="Virtual Program Index";

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
        await learningPath.clickEditCertification();
        await createCourse.clickAccessButton();
        await createCourse.specificLearnerGroupSelection(URLConstants.LearnerGroup1);
        await createCourse.addSingleLearnerGroup(user);
        await createCourse.saveAccessButton();
        await createCourse. crsAccessSettings();
        await createCourse.clickDetailButton()
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    })


    test(`Test to execute CRON JOB`, async ({ }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Arivazhagan P` },
            { type: `TestCase`, description: `Test to execute CRON JOB` },
            { type: `Test Description`, description: `Verify the CRON Job` }
        );

        await updateCertificationComplianceFlow();

    })
})