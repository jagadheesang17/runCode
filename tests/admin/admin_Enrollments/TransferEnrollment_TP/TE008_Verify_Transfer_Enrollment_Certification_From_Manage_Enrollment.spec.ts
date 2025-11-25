import { credentials } from "../../../../constants/credentialData";
import { test } from "../../../../customFixtures/expertusFixture";
import { FakerData } from "../../../../utils/fakerUtils";

let courseName = FakerData.getCourseName();
let description = FakerData.getDescription();
let domain: any;
let certTitle = FakerData.getCourseName();
let certTitleVersion2 = certTitle + " - Version 2";

test.describe(`TE008_Verify_Transfer_Enrollment_Certification_From_Manage_Enrollment`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Creation of E-learning single instance`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create the course as Single instance` },
            { type: `Test Description`, description: `Create course for certification version testing` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.getCourse();
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.contentLibrary(); //By default Youtube content will be attached
        await createCourse.clickHere();
        await createCourse.selectImage();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
    });

    test(`Create Certification, Add Version, and Transfer from Manage Enrollment`, async ({ adminHome, learningPath, createCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create Certification, add version, and transfer via Manage Enrollment` },
            { type: `Test Description`, description: `Verify Certification version creation and transfer enrollments from Manage Enrollment menu` }
        );

        // Create Certification
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(certTitle);
        await learningPath.description(description);
        await learningPath.language();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await learningPath.verifySuccessMessage();

        // Enroll learner to version 1
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectByOption("Certification");
        await enrollHome.selectBycourse(certTitle);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.TEAMUSER1.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();

        // Add Version 2
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await createCourse.catalogSearch(certTitle);
        await learningPath.clickEditIconFromTPListing(certTitle);

        // Click Add Version button
        await learningPath.clickAddVersionBtn();

        // Directly click Create button (no unselect needed for now)
        await learningPath.clickCreateVersionBtn();

        // Update title with version 2
        await learningPath.title(certTitleVersion2);

        // Click catalog and update
        await createCourse.clickCatalog();
            // Verify version changed to Version 2
        await learningPath.verifyVersionNumber("2");
        await createCourse.clickUpdate();

        // Verify confirmation popup messages
        await learningPath.verifyPublishConfirmationPopup();

        // Click Yes button
        await learningPath.clickYesBtn();

        // Verify success message
        await learningPath.verifySuccessMessage();    
        // Transfer enrollments via Manage Enrollment menu
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.manageEnrollment("Transfer Enrollment - Training Plan");
        await enrollHome.selectByOption("Certification");
        await enrollHome.selectBycourse(certTitle);
        await enrollHome.clickViewLearner();
        await learningPath.selectAllLearners();
        await learningPath.clickTransferLearnersBtn();
        await learningPath.verifyTransferConfirmationPopup();

        // Click Yes to confirm transfer
        await learningPath.clickYesBtn();

        console.log("✅ Successfully completed Certification version management and enrollment transfer via Manage Enrollment");
    });

    test(`Verify learner enrollment in new version`, async ({ learnerHome, catalog, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Confirm learner enrollment transferred to new version` },
            { type: `Test Description`, description: `Verify learner can access the new version of Certification` }
        );

        await learnerHome.learnerLogin("TEAMUSER1", "LearnerPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
         await dashboard.clickCertificationLink();
        await dashboard.searchCertification(certTitleVersion2);
        await dashboard.verifyTheEnrolledCertification(certTitleVersion2);
        await catalog.clickMoreonCourse(certTitleVersion2);
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.clickViewCertificate();
    });
});
