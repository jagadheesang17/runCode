import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { updateCronDataJSON } from "../../../utils/jsonDataHandler";
import { URLConstants } from "../../../constants/urlConstants";
import { certificationExpiry_CronJob } from "../DB/DBJobs";

const courseName = FakerData.getCourseName();
const recertificationCourseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const portal = URLConstants.portal1;

test.describe(`TP068_Verify_certification_expiration_with_anniversary_date`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Create E-learning course for certification`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create E-learning course for certification` },
            { type: `Test Description`, description: `Create single instance E-learning course to be attached to certification` }
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
        await createCourse.selectDomainOption(portal);
        await createCourse.contentLibrary(); // Default YouTube content will be attached
        await createCourse.clickHere();
        await createCourse.selectImage();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Successfully created course: ${courseName}`);
    });

    test(`Create E-learning course for recertification`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create E-learning course for recertification` },
            { type: `Test Description`, description: `Create single instance E-learning course to be attached to recertification manually` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", recertificationCourseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.selectDomainOption(portal);
        await createCourse.contentLibrary(); // Default YouTube content will be attached
        await createCourse.clickHere();
        await createCourse.selectImage();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Successfully created recertification course: ${recertificationCourseName}`);
    });

    const titleAnniversaryDate = ("CERT_Anniversary_" + FakerData.getCourseName());
    test(`Create certification with Anniversary Date expiration`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create certification with Anniversary Date expiration` },
            { type: `Test Description`, description: `Create certification with expiry based on anniversary date (Completion Date, Fixed Date, 1 year)` }
        );

        const newData = {
            TP068: titleAnniversaryDate
        };
        updateCronDataJSON(newData);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(titleAnniversaryDate);
        await learningPath.description(description);
        await learningPath.language();
        await learningPath.hasRecertification();
        
        // Set expiration with Anniversary Date
        console.log(`🔄 Setting expiration with Anniversary Date - Completion Date, Fixed Date, 1 year`);
        await learningPath.clickExpiresDropdown();
        await learningPath.clickExpiresButtonWithType("Anniversary Date", {
            anniversaryType: "Completion Date",
            anniversaryRange: "Fixed Date",
            afterYears: "1"
        });
        
        await learningPath.clickSaveAsDraftBtn();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        
        // Add course to certification
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        
        // Add recertification course
        await learningPath.clickDetailTab();
        await learningPath.addRecertificationCourse();
        await learningPath.chooseRecertificationMethod("Add Courses Manually");
        await learningPath.searchAndClickCourseCheckBox(recertificationCourseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.saveRecertification(recertificationCourseName);
        await learningPath.description(description);
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        
        // Add completion certificate
        await learningPath.clickEditCertification();
        await createCourse.clickCompletionCertificate();
        await createCourse.clickCertificateCheckBox();
        await createCourse.clickAdd();
        await learningPath.description(description);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        
        console.log(`✅ Successfully created certification with Anniversary Date expiration: ${titleAnniversaryDate}`);
    });

    test(`Verify learner can enroll and complete certification with Anniversary Date expiry`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify learner enrollment and completion for Anniversary Date certification` },
            { type: `Test Description`, description: `Learner enrolls, completes certification, and receives certificate` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "Default");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(titleAnniversaryDate);
        await catalog.clickEnrollButton();
        await catalog.clickViewCertificationDetails();
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.clickViewCertificate();
        
        console.log(`✅ Learner completed certification with Anniversary Date: ${titleAnniversaryDate}`);
    });

    test(`Run cron job to verify certification expiry`, async ({ }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Run cron job to make certification expire` },
            { type: `Test Description`, description: `Execute certification expiry cron job to process expiration logic for anniversary date` }
        );

        await certificationExpiry_CronJob();
        console.log(`✅ Certification expiry cron job executed successfully for Anniversary Date`);
    });
});
