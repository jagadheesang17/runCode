import { credentials } from "../../../constants/credentialData";
import { test } from "../../../customFixtures/expertusFixture";
import { EditCoursePage } from "../../../pages/EditCoursePage";
import { FakerData } from "../../../utils/fakerUtils";

let courseName = FakerData.getCourseName();
let description = FakerData.getDescription();
let domain: any
test.describe(`Verify_that_the_learner_is_able_to_launch_and_complete_a_certification_that_was_revoked_by_the_admin.spec.ts`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Creation of E-learning single instance `, async ({ adminHome, createCourse, learningPath, enrollHome }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Anuradha` },
            { type: `TestCase`, description: `Create the course as Single instance` },
            { type: `Test Description`, description: `Verify portal1 course is not availble to portal2 users` }

        );
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.getCourse();
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        domain = await createCourse.selectPortal();
        console.log(`${domain}`);
        await createCourse.contentLibrary(); //By default Youtube content will be attached
        await createCourse.clickHere();
        await createCourse.selectImage();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

    })
    const title = FakerData.getCourseName();

    test(`Certification enroll and completion with single instance`, async ({ adminHome, learningPath, createCourse, enrollHome, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Anuradha` },
            { type: `TestCase`, description: `Certification enroll and completion with single instance` },
            { type: `Test Description`, description: `Verify Certification enroll and completion with single instance` }
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
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        await learningPath.clickEditCertification();
        // await learningPath.getCodeValue();
        await createCourse.clickCompletionCertificate();
        await createCourse.clickCertificateCheckBox();
        await createCourse.clickAdd();
           await learningPath.description(description);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        await adminHome.menuButton()
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectByOption("Certification");
        await enrollHome.selectBycourse(title)
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username)
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        // await enrollHome.clickModifyEnrollBtn();
        // await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username)
        // await enrollHome.selectEnrollOrCancel("Completed");
        // await enrollHome.completionDateInAdminEnrollment();
        // await editCourse.saveAccess();
        // await enrollHome.verifytoastMessage()
    
    })

    test(`Confirm that a learner can successfully register for and complete a certification through a single-instance course.`, async ({ learnerHome, catalog, dashboard }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Anuradha` },
            { type: `TestCase`, description: `Confirm that a learner can successfully register for and complete a certification through a single-instance course.` },
            { type: `Test Description`, description: `Confirm that a learner can successfully register for and complete a certification through a single-instance course.` }
     );
     await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
     await learnerHome.clickDashboardLink();
     await dashboard.clickLearningPath_And_Certification();
     await dashboard.clickCertificationLink();
     await dashboard.searchCertification(title);
     await dashboard.verifyTheEnrolledCertification(title);
      await catalog.clickMoreonCourse(title);

     await catalog.clickLaunchButton();
     await catalog.saveLearningStatus();
     await catalog.clickViewCertificate();
    })


    test(`Admin marking Revoke status to the learner`, async ({ adminHome,createCourse, enrollHome, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Anuradha` },
            { type: `TestCase`, description: `Admin marking Revoke status to the learner` },
            { type: `Test Description`, description: `Verify that the learner enrollment status is marked as Revoke by admin.` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectByOption("Certification");
        await enrollHome.selectBycourse(title)
        await enrollHome.clickViewLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username)
        await enrollHome.selectEnrollOrCancel("Revoke");
        await enrollHome.enterReasonAndSubmit();
        await enrollHome.verifytoastMessage();

    })

    test(`Confirm that a learner can successfully re-register for the revoked certification.`, async ({ learnerHome, catalog, dashboard }) => {

            test.info().annotations.push(
                { type: `Author`, description: `Anuradha` },
                { type: `TestCase`, description: `Confirm that a learner can successfully re-register for the revoked certification.` },
                { type: `Test Description`, description: `Confirm that a learner can successfully re-register for the revoked certification.` }
         );
         await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
         await learnerHome.clickDashboardLink();
         await dashboard.clickLearningPath_And_Certification();
         await dashboard.clickCertificationLink();
         await dashboard.searchCertification(title);
         await dashboard.verifyTheEnrolledCertification(title);
         await catalog.clickMoreonCourse(title);
         await catalog.clickEnroll();
         await catalog.clickLaunchButton();
         await catalog.saveLearningStatus();
         //await catalog.clickViewCertificate();
        })
})