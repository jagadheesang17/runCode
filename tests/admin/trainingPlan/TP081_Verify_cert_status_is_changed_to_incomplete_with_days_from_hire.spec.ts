import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { updateCronDataJSON } from "../../../utils/jsonDataHandler";
import { programEnrollmentIncompleteCron } from "../DB/DBJobs";

let courseName = FakerData.getCourseName();
const description = FakerData.getDescription();

test.describe(`TP063_Verify_cert_status_is_changed_to_incomplete_with_days_from_hire.spec.ts`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Creation of Elearning`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Creation of Elearning` },
            { type: `Test Description`, description: `Verify that course should be created successfully` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course,:" + description);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Successfully created course: ${courseName}`);
    })

    let title = ("CERT_incomplete_days_from_hire" + " " + FakerData.getCourseName());

    test(`Create Certification with Days from Hire and incomplete`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create Certification with Days from Hire` },
            { type: `Test Description`, description: `Create certification with Complete by Days from Hire and post complete by incomplete` }
        )

        console.log(`🔄 Creating certification: ${title}`);
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(title);
        await learningPath.description(description);
        await learningPath.language();

        console.log(`🔄 Setting Complete by Rule with Days from Hire`);
        await createCourse.clickregistrationEnds();
        await createCourse.selectCompleteByRule();

        // Select Days from Hire
        await createCourse.selectCompleteByOption("Days from hire");

        console.log(`🔄 Setting days of validity to 1 day`);
        await createCourse.completByDays("1");

        console.log(`🔄 Keeping Post Complete by as default Incomplete (not selecting Overdue)`);
        // Don't select any Post Complete by option - it will remain as default "Incomplete"

        await learningPath.clickSave();
        await learningPath.clickProceedBtn();

        console.log(`🔄 Adding course to certification`);
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();

        console.log(`🔄 Publishing certification to catalog`);
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();

        console.log(`✅ Successfully created certification with Days from Hire: ${title}`);
        console.log(`   Complete by: 1 day from hire`);
        console.log(`   Post Complete by: Incomplete`);
    })

    test(`Verify certification enroll flow in the learner side`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify certification enroll flow in the learner side` },
            { type: `Test Description`, description: `Verify certification enroll flow in the learner side` }
        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(title);
        await catalog.clickEnrollButton();
        await catalog.clickViewCertificationDetails();
        console.log(`✅ Successfully enrolled in certification: ${title}`);
    })

    test(`Run the cron job to change certification status to incomplete`, async () => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Run cron job to mark certification as incomplete` },
            { type: `Test Description`, description: `Execute program enrollment cron to update certification status to incomplete` }
        );

        console.log(`🔄 Running program enrollment cron job...`);
        await programEnrollmentIncompleteCron();
        console.log(`✅ Cron job executed successfully`);
    })

    test(`Verify the certification status is changed to incomplete in learner's My Learning`, async ({ learnerHome, dashboard, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify certification status changed to incomplete` },
            { type: `Test Description`, description: `Verify that certification status shows as incomplete in learner's My Learning after complete by date passes` }
        );

        console.log(`🔄 Logging in as learner and checking certification status`);
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.searchCertification(title);
        await dashboard.verifyTheEnrolledCertification(title);
        await dashboard.clickTitle(title);
        await catalog.verifyStatus("Incomplete");
        console.log(`✅ Certification status verified as Incomplete`);
    })
})
