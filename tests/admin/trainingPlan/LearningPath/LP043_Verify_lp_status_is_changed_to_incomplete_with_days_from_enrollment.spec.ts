import { test } from "../../../../customFixtures/expertusFixture";
import { FakerData } from "../../../../utils/fakerUtils";
import { updateCronDataJSON } from "../../../../utils/jsonDataHandler";
import {programEnrollmentIncompleteCron } from "../../DB/DBJobs";

let courseName = FakerData.getCourseName();
const description = FakerData.getDescription();

test.describe(`TP047_Verify_lp_status_is_changed_to_incomplete_with_days_from_enrollment.spec.ts`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Creation of Elearning`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Creation of Elearning` },
            { type: `Test Description`, description: `Verify that course should be created successfully` }
        );

        const newData = {
            TP047a: courseName
        }

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course,:" + description);
        await createCourse.contentLibrary();  //Default Youtube content will be added to the course
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Successfully created course: ${courseName}`);
    })

    let title = ("LP_incomplete_days_from_enrollment" + " " + FakerData.getCourseName());

    test(`Create Learning Path with Days from Enrollment and incomplete`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create Learning Path with Days from Enrollment` },
            { type: `Test Description`, description: `Create learning path with Complete by Days from Enrollment and post complete by incomplete` }
        )

        const newData = {
            TP047: title
        }
        updateCronDataJSON(newData)

        console.log(`🔄 Creating learning path: ${title}`);
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
        await learningPath.title(title);
        await learningPath.description(description);
        await learningPath.language();

        console.log(`🔄 Setting Complete by Rule with Days from Enrollment`);
        await createCourse.clickregistrationEnds();
        await createCourse.selectCompleteByRule();

        // Select Days from Enrollment
        await createCourse.selectCompleteByOption("Days from enrollment");

        console.log(`🔄 Setting days of validity to 1 day`);
        await createCourse.daysOfValidity("1");

        console.log(`🔄 Keeping Post Complete by as default Incomplete (not selecting Overdue)`);
        // Don't select any Post Complete by option - it will remain as default "Incomplete"

        await learningPath.clickSave();
        await learningPath.clickProceedBtn();

        console.log(`🔄 Adding course to learning path`);
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();

        console.log(`🔄 Publishing learning path to catalog`);
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();

        console.log(`✅ Successfully created learning path with Days from Enrollment: ${title}`);
        console.log(`   Complete by: 1 day from enrollment`);
        console.log(`   Post Complete by: Incomplete (default)`);
    })

    test(`Verify LP enroll flow in the learner side`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify LP enroll flow in the learner side` },
            { type: `Test Description`, description: `Verify LP enroll flow in the learner side` }
        );

        console.log(`🔄 Learner enrolling in learning path`);
        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(title);
        await catalog.clickEnrollButton();
        await catalog.clickViewLearningPathDetails();
        console.log(`✅ Learner successfully enrolled in learning path`);
    })

    test(`Test to execute CRON JOB`, async ({ }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Test to execute CRON JOB` },
            { type: `Test Description`, description: `Verify the CRON Job to change status to incomplete` }
        );

        console.log(`🔄 Executing CRON job to change LP status to incomplete`);
        await programEnrollmentIncompleteCron();
        console.log(`✅ CRON job executed successfully`);
    })

    test(`Verify LP status changed to Incomplete`, async ({ learnerHome, dashboard, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify LP status changed to Incomplete` },
            { type: `Test Description`, description: `Verify that learning path status is changed to incomplete after days from enrollment expired` }
        );

        console.log(`🔄 Verifying learning path status is incomplete`);
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.searchCertification(title);
        await dashboard.verifyTheEnrolledCertification(title);
        await dashboard.clickTitle(title);
        await catalog.verifyStatus("Incomplete");
        console.log(`✅ Learning path status successfully changed to INCOMPLETE`);
    })
})
