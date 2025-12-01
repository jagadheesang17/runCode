import { create } from "domain";
import { test } from "../../../customFixtures/expertusFixture";
import { readDataFromCSV } from '../../../utils/csvUtil';
import { FakerData } from '../../../utils/fakerUtils';
import { verify } from "crypto";
import { EditCoursePage } from "../../../pages/EditCoursePage";
import { credentials } from "../../../constants/credentialData";
import { en } from "@faker-js/faker";
import { nonComplianceCertificationExpiry_CronJob } from "../DB/DBJobs";
import { ca } from "date-fns/locale";



let courseName = FakerData.getCourseName();
const description = FakerData.getDescription();


test.describe(`Verify_the_address_which_is_inherited_from_organization`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Enable the Certtificate Revaliadte`, async ({ siteAdmin, adminHome }) => {
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

    test(`Creation of Certification with recertification path and Enable Certification revalidate`, async ({ adminHome, learningPath, createCourse, editCourse }) => {
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
        await learningPath.hasRecertification();
        await learningPath.clickExpiresButton()
        await learningPath.clickSaveAsDraftBtn();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await editCourse.clickBusinessRule();
        await learningPath.checkRevalidateInCertification();
          await learningPath.addRecertificationCourse();
        await learningPath.chooseRecertificationMethod("Copy from certification path");
        await learningPath.saveRecertification(courseName);
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


    test(`Re-validate the certification and complete it as a learner`, async ({ adminHome, enrollHome, catalog, editCourse, learnerHome }) => {

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
        await enrollHome.verifyPreviousEntryAsCompleted()

        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickMyLearning();
        await catalog.searchMyLearning(title);
        await catalog.launchContentFromMylearning();
        await catalog.saveLearningStatus();
        // await catalog.verifyStatus("Completed")




    })

    test(`Cron job to make certification expiry`, async ({ }) => {

        await nonComplianceCertificationExpiry_CronJob();
    })


    test(`Verify the certification status is expired in the learning history and complete it as a learner`, async ({ learnerHome, catalog, dashboard }) => {

        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await dashboard.clickLearningHistory();
        await dashboard.clickTabsInsideTheLearningHistory("Certification");
        await dashboard.verifyTheStatusInLearningHistory(title,"Expired");

        await catalog.clickRecertifyButton();
        await catalog.verifyStatus("Enrolled");
        await catalog.saveLearningStatus();

    })

    test(`Verify the admin able to revalidate the recertification after the certification has expired`, async ({ adminHome, enrollHome, catalog, editCourse, learnerHome }) => {

        await adminHome.loadAndLogin("CUSTOMERADMIN1")
        await adminHome.menuButton()
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectByOption("Certification");
        await enrollHome.selectBycourse(title)
        await enrollHome.clickViewLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);

        await enrollHome.selectCertificationType("Certification");
        await enrollHome.verifyStatusInManageEnrollment("Completed");

        await enrollHome.selectEnrollOrCancel("Re-Validate");
        await enrollHome.enterReasonAndSubmit();

    })
})