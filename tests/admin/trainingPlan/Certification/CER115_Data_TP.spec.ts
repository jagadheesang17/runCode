import { test } from "../../../../customFixtures/expertusFixture";
import { ContentHomePage } from "../../../../pages/ContentPage";
import { FakerData } from "../../../../utils/fakerUtils";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
let domain: any
const courseNames: string[] = [];
//test.use({ storageState: "logins/expertuslearnerLog.json"})
test.describe(`Certification_with_single_instance_behavior_Enrolled_tab`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Creation of single instance-elearning`, async ({ adminHome, createCourse, contentHome }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Ajay Michael` },
            { type: `TestCase`, description: `Creation of single instance-elearning` },
            { type: `Test Description`, description: `Creation of single instance-elearning` }

        );

        await adminHome.loadAndLogin("CUSTOMERADMIN")

        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        for (let i = 0; i < 10; i++) {
            const courseName = FakerData.getCourseName();
            courseNames.push(courseName);
            await createCourse.clickCreateCourse();
            await createCourse.verifyCreateUserLabel("CREATE COURSE");
            await createCourse.enter("course-title", courseName);
            await createCourse.getCourse();
            await createCourse.selectLanguage("English");
            await createCourse.typeDescription(description);
            //  domain = await createCourse.selectPortal();
            //  console.log(`${domain}`);
            await createCourse.contentLibrary();
            await createCourse.clickHere();
            await createCourse.selectImage();
            await createCourse.clickCatalog();
            await createCourse.clickSave();
            await createCourse.clickProceed();
            await createCourse.verifySuccessMessage();
            await createCourse.editcourse();
            await createCourse.clickCompletionCertificate();
            await createCourse.clickCertificateCheckBox();
            await createCourse.clickAdd();
                    await createCourse.typeDescription(description);
            await createCourse.clickCatalog();
            await createCourse.clickUpdate();
            await createCourse.verifySuccessMessage();
            await contentHome.gotoListing();


        }
    })

    const title = FakerData.getCourseName();
    test(`Creation of Certification with single instance`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Ajay Michael` },
            { type: `TestCase`, description: `Creation of Certification with single instance` },
            { type: `Test Description`, description: `Creation of Certification with single instance` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(title);
        await learningPath.description(description);
        await learningPath.language();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        for (const courseName of courseNames) {
            await learningPath.clickAddCourse();
            await learningPath.searchAndClickCourseCheckBox(courseName);
            await learningPath.clickAddSelectCourse();
        }
       
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        await learningPath.clickEditCertification();
        await createCourse.clickCompletionCertificate();
        await createCourse.clickCertificateCheckBox();
        await createCourse.clickAdd();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

    })

})