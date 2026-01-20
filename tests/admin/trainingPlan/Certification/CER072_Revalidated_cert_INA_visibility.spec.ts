import { create } from "domain";
import { test } from "../../../../customFixtures/expertusFixture";

import { FakerData } from '../../../../utils/fakerUtils';

import { credentials } from "../../../../constants/credentialData";
import { en } from "@faker-js/faker";



let courseName = FakerData.getCourseName();
const description = FakerData.getDescription();


test.describe(`Verify_that_when_the_learner_completes_the_revalidated_certification_the_status_changes_from_Completed_to_Expired`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Enable the Certificate revalidation option in site settings`, async ({ siteAdmin, adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Balasundar` },
            { type: `TestCase`, description: `Enable company login alone in site settings` },
            { type: `Test Description`, description: `Enable company login alone in site settings` }

        );
        await adminHome.loadAndLogin("SUPERADMIN");
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await adminHome.siteAdmin_Adminconfig();
        await siteAdmin.enableBusinessRulesAndCheckCertificationRevalidation();

    })
    test(`Creation of Elearning Course`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Creation of Elearning Course` },
            { type: `Test Description`, description: `Creation of Elearning Course` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN1")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course,:" + description);
        await createCourse.contentLibrary(); //By default Youtube content will be attached to the course
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

    })
    let title = FakerData.getCourseName();
    //let title="Primary Microchip Bypass";

    test(`Creation of Certification and Enable Certification revalidate`, async ({ adminHome, learningPath, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Certification Creation with pre and post assessment attached` },
            { type: `Test Description`, description: `Certification Creation with pre and post assessment attached` }
        )

        await adminHome.loadAndLogin("CUSTOMERADMIN1")
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
        await editCourse.clickBusinessRule();
        await learningPath.checkRevalidateInCertification();
        await createCourse.clickCatalog()
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

    })


    test(`Complete the certification`, async ({ learnerHome, catalog, dashboard }) => {


        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickCatalog();
        await catalog.searchCatalog(title);
        await catalog.clickEnrollButton();
        await catalog.clickViewCertificationDetails();
        await catalog.saveLearningStatus();
    })

    test(`Verify that the completed revalidated certification is visible in INA and that it gets removed once the learner completes the revalidated certification.`, async ({ adminHome, enrollHome, catalog, editCourse, learnerHome }) => {
        
        await adminHome.loadAndLogin("CUSTOMERADMIN1")
        await adminHome.menuButton()
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectByOption("Certification");
        await enrollHome.selectBycourse(title)
        await enrollHome.clickViewLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.selectEnrollOrCancel("Re-Validate");
        await enrollHome.enterReasonAndSubmit();
        await enrollHome.clickModifyEnrollBtn();
        await enrollHome.verifyPreviousEntryAsCompleted();

        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickINA();
        await learnerHome.clickLaunchTabInINA(title);
        await catalog.saveLearningStatus();

        await catalog.clickDashboardLink();

         await learnerHome.clickINA();
         await learnerHome.verifyTheCertificationRemovedAfterCompletion(title);



      


    })  
   
})