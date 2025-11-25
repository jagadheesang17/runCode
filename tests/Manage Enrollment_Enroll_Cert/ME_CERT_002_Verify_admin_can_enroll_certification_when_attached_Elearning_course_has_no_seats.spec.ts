import { credentials } from "../../constants/credentialData";
import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const certificationTitle = FakerData.getCourseName() + "-CERT";

test.describe(`Verify admin can enroll certification when attached E-learning course has no seats`, async () => {
    test.describe.configure({ mode: "serial" });
    
    test(`Test 1: Create E-learning course with 1 seat and enroll one learner`, async ({ adminHome, createCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Create E-learning course with 1 seat and enroll one learner` },
            { type: `Test Description`, description: `Create E-learning course with max seat 1 and enroll TEAMUSER1 to fill the seat` }
        );
        
        console.log("🔄 Creating E-learning course with 1 seat...");
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name :" + description);
        await createCourse.setSeatsMax('1');
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log("✅ E-learning course created with 1 seat: " + courseName);
        
        // Admin enrollment flow - enroll first learner to fill the seat
        console.log("🔄 Enrolling TEAMUSER1 to fill the seat...");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.TEAMUSER1.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.clickGotoHome();
        console.log("✅ TEAMUSER1 enrolled - E-learning course now has no available seats");
    });

    test(`Test 2: Create certification and attach the E-learning course with no seats`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Create certification and attach E-learning course with no available seats` },
            { type: `Test Description`, description: `Create certification and attach the E-learning course that has 0 available seats` }
        );

        console.log("🔄 Creating certification and attaching E-learning course with no seats...");
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(certificationTitle);
        await learningPath.description(description);
        await learningPath.language();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        console.log("✅ Certification created with E-learning course attached: " + certificationTitle);
        console.log("✅ Attached E-learning course '" + courseName + "' has 0 available seats (1/1 filled)");
    });

    test(`Test 3: Verify admin can enroll learner to certification despite no seats in attached E-learning course`, async ({ adminHome, enrollHome, learnerHome, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Admin enrolls learner to certification with no seats in E-learning course` },
            { type: `Test Description`, description: `Verify admin can successfully enroll LEARNERUSERNAME to certification even though attached E-learning course has no available seats` }
        );

        console.log("🔄 Admin enrolling learner to certification (E-learning course has no seats)...");
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectByOption("Certification");
        await enrollHome.selectBycourse(certificationTitle);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        console.log("✅ Admin successfully enrolled LEARNERUSERNAME to certification");
        console.log("✅ Enrollment succeeded despite E-learning course having no available seats");

        // Verify learner can see the enrolled certification
        console.log("🔄 Verifying learner can see enrolled certification...");
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.searchCertification(certificationTitle);
        await dashboard.verifyTheEnrolledCertification(certificationTitle);
        console.log("✅ Learner can see enrolled certification in dashboard");
        console.log("✅ TEST PASSED: Admin can enroll certification when attached E-learning course has no seats");
    });
});
