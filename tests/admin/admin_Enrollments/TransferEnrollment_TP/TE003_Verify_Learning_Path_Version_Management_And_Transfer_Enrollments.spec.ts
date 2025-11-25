import { credentials } from "../../../../constants/credentialData";
import { test } from "../../../../customFixtures/expertusFixture";
import { FakerData } from "../../../../utils/fakerUtils";

let courseName = FakerData.getCourseName();
let description = FakerData.getDescription();
let domain: any;
let lpTitle = FakerData.getCourseName();
let lpTitleVersion2 = lpTitle + " - Version 2";

test.describe(`TE003_Verify_Learning_Path_Version_Management_And_Transfer_Enrollments`, async () => {
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

    test(`Create Learning Path and Add Version`, async ({ adminHome, learningPath, createCourse, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create Learning Path, add version, and verify version management` },
            { type: `Test Description`, description: `Verify Learning Path version creation, update, and transfer enrollments` }
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
        await createCourse.clickUpdate();
        
        // Verify confirmation popup messages
        await learningPath.verifyPublishConfirmationPopup();
        
        // Click Yes button
        await learningPath.clickYesBtn();
        
        // Verify success message
        await learningPath.verifySuccessMessage();
        
        // Edit learning path to access version history
        await learningPath.clickEditLearningPath();
        // Verify version changed to Version 2
        await learningPath.verifyVersionNumber("2");
        
        // Find version 1 learning path title
        const version1Title = await learningPath.getVersionHistoryTitle("1", lpTitle);
        console.log(`Version 1 Title: ${version1Title}`);
        
        // Click eye icon for version 1
        await learningPath.clickVersionEyeIcon(version1Title);
        
        // Click Transfer Enrollments button
        await learningPath.clickTransferEnrollmentsBtn();
        
        // Select all learners
        await learningPath.selectAllLearners();
        
        // Click Transfer Learners button
        await learningPath.clickTransferLearnersBtn();
        
        // Verify transfer confirmation popup
        await learningPath.verifyTransferConfirmationPopup();
        
        // Click Yes to confirm transfer
        await learningPath.clickYesBtn();
        
        console.log("✅ Successfully completed Learning Path version management and enrollment transfer");
    });

    test(`Verify learner enrollment in new version`, async ({ learnerHome, catalog, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Confirm learner enrollment transferred to new version` },
            { type: `Test Description`, description: `Verify learner can access the new version of Learning Path` }
        );
        
        await learnerHome.learnerLogin("TEAMUSER1", "LearnerPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.searchCertification(lpTitleVersion2);
        await dashboard.verifyTheEnrolledCertification(lpTitleVersion2);
        await catalog.clickMoreonCourse(lpTitleVersion2);
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.clickViewCertificate();
    });
});
