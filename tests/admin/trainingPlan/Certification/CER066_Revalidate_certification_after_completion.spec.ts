import { create } from "domain";
import { test } from "../../../../customFixtures/expertusFixture";
import { FakerData } from '../../../../utils/fakerUtils';

import { credentials } from "../../../../constants/credentialData";
import { en } from "@faker-js/faker";



let courseName = FakerData.getCourseName();
const description = FakerData.getDescription();


test.describe(`Verify_that_the_admin_is_able_to_revalidate_the_certification_after_the_learner_has_completed_the_original_certification`, async () => {
    test.describe.configure({ mode: "serial" });
test(`Enable the Certificate revalidation option in site settings`, async ({ siteAdmin,adminHome}) => {
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

    test(`Creation of Certification and Enable Certification revalidate`, async ({ adminHome, learningPath, createCourse,editCourse }) => {

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

    
    test(`Complete the certification as a learner`, async ({ learnerHome, catalog, dashboard }) => {


        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickCatalog();
        await catalog.searchCatalog(title);
        await catalog.clickEnrollButton();
        await catalog.clickViewCertificationDetails();
        await catalog.saveLearningStatus();
    })

 test(`Verify that the admin is able to revalidate the certification after the learner has completed the original certification`, async ({ adminHome, enrollHome, catalog,editCourse, learnerHome }) => {

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
        await enrollHome.verifyRevalidatedSuccessMessage(title);
        await enrollHome.clickModifyEnrollBtn();

          await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
          await learnerHome.clickMyLearning();
          await catalog.searchMyLearning(title);


    })
})