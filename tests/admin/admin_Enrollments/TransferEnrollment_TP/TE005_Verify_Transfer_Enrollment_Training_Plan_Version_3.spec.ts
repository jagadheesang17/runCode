import { credentials } from "../../../../constants/credentialData";
import { test } from "../../../../customFixtures/expertusFixture";
import { FakerData } from "../../../../utils/fakerUtils";

let courseName = FakerData.getCourseName();
let description = FakerData.getDescription();
let domain: any;
let lpTitle = FakerData.getCourseName();
let lpTitleVersion2 = lpTitle + " - Version 2";
let lpTitleVersion3 = lpTitle + " - Version 3";

test.describe(`TE005_Verify_Transfer_Enrollment_Training_Plan_Version_3`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Creation of E-learning single instance`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create the course as Single instance` },
            { type: `Test Description`, description: `Create course for learning path version testing` }
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

    test(`Create Learning Path, Add Version 2, Version 3, and Transfer from Manage Enrollment`, async ({ adminHome, learningPath, createCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create Learning Path, add version 2 and 3, transfer via Manage Enrollment` },
            { type: `Test Description`, description: `Verify Learning Path version 3 creation and transfer enrollments from Manage Enrollment menu` }
        );

        // Create Learning Path
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
        await learningPath.title(lpTitle);
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
        await enrollHome.selectByOption("Learning Path");
        await enrollHome.selectBycourse(lpTitle);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.TEAMUSER1.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();

        // Add Version 2
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await createCourse.catalogSearch(lpTitle);
        await learningPath.clickEditIconFromTPListing(lpTitle);

        // Click Add Version button
        await learningPath.clickAddVersionBtn();

        // Directly click Create button (no unselect needed for now)
        await learningPath.clickCreateVersionBtn();

        // Update title with version 2
        await learningPath.title(lpTitleVersion2);

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
        
        // Transfer enrollments from version 1 to version 2 via Manage Enrollment menu
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.manageEnrollment("Transfer Enrollment - Training Plan");
        await enrollHome.selectBycourse(lpTitle);
        await enrollHome.clickViewLearner();
        await learningPath.selectAllLearners();
        await learningPath.clickTransferLearnersBtn();
        await learningPath.verifyTransferConfirmationPopup();

        // Click Yes to confirm transfer
        await learningPath.clickYesBtn();

        console.log("✅ Successfully transferred enrollments from Version 1 to Version 2");

        // Add Version 3
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await createCourse.catalogSearch(lpTitleVersion2);
        await learningPath.clickEditIconFromTPListing(lpTitleVersion2);

        // Click Add Version button for version 3
        await learningPath.clickAddVersionBtn();

        // Directly click Create button (no unselect needed for now)
        await learningPath.clickCreateVersionBtn();

        // Update title with version 3
        await learningPath.title(lpTitleVersion3);

        // Click catalog and update
        await createCourse.clickCatalog();
        // Verify version changed to Version 3
        await learningPath.verifyVersionNumber("3");
        await createCourse.clickUpdate();

        // Verify confirmation popup messages
        await learningPath.verifyPublishConfirmationPopup();

        // Click Yes button
        await learningPath.clickYesBtn();

        // Verify success message
        await learningPath.verifySuccessMessage();

        // Transfer enrollments from version 2 to version 3 via Manage Enrollment menu
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.manageEnrollment("Transfer Enrollment - Training Plan");
        await enrollHome.selectBycourse(lpTitleVersion2);
        await enrollHome.clickViewLearner();
        await learningPath.selectAllLearners();
        await learningPath.clickTransferLearnersBtn();
        await learningPath.verifyTransferConfirmationPopup();

        // Click Yes to confirm transfer
        await learningPath.clickYesBtn();

        console.log("✅ Successfully completed Learning Path version 3 management and enrollment transfer via Manage Enrollment");
    });

    test(`Verify learner enrollment in version 3`, async ({ learnerHome, catalog, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Confirm learner enrollment transferred to version 3` },
            { type: `Test Description`, description: `Verify learner can access the version 3 of Learning Path` }
        );

        await learnerHome.learnerLogin("TEAMUSER1", "LearnerPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.searchCertification(lpTitleVersion3);
        await dashboard.verifyTheEnrolledCertification(lpTitleVersion3);
        await catalog.clickMoreonCourse(lpTitleVersion3);
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.clickViewCertificate();
    });
});
