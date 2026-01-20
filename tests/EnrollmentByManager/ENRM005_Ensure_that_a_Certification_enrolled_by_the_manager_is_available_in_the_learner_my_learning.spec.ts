import { credentials } from "../../constants/credentialData";
import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
const courseName = ("EL for" + " " + FakerData.getCourseName());
let createdCode: any
const description = FakerData.getDescription();
test.describe(`Confirm that Manager enrollment functions correctly and as expected for Certification`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Creation of Single Instance ELearning course`, async ({ adminHome, createCourse, contentHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Creation of Single Instance ELearning course` },
            { type: `Test Description`, description: `Creation of Single Instance ELearning course` }

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
        await createCourse.contentLibrary(); //By default Youtube content will be attached to the course
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
    })
    let title = ("Certification for" + " " + FakerData.getCourseName());
    test(`Creation of Learning path`, async ({ adminHome,contentHome, learningPath, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify_Certification_single_instance` },
            { type: `Test Description`, description: `Creating Certification single instance` }
        )

        await adminHome.loadAndLogin("CUSTOMERADMIN");
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
        await contentHome.gotoListing();
        await createCourse.catalogSearch(title)
        createdCode = await createCourse.retriveCode()
        console.log("Extracted Code is : " + createdCode);

    })
    test(`Ensure that the manager can successfully enrolled a Certification to a user.`, async ({ enrollHome, learnerHome, managerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Ensure that the manager can successfully enrolled a Certification to a user` },
            { type: `Test Description`, description: `Ensure that the manager can successfully enrolled a Certification to a user` }
        );
        await learnerHome.learnerLogin("MANAGERNAME", "DefaultPortal");
        await learnerHome.selectCollaborationHub();
        await managerHome.enterSearchCourse(createdCode);
        await managerHome.clickGuideTeamIcon(title);
        await enrollHome.selectEnroll();
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.TEAMUSER1.username)
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage()
    })


    test(`Confirm that a learner can successfully register the certification`, async ({ learnerHome, catalog, dashboard }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Confirm that a learner can successfully register the certification` },
            { type: `Test Description`, description: `Certification should be available in the enrolled tab` }

        );

        await learnerHome.learnerLogin("TEAMUSER1", "DefaultPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.searchCertification(title);
        await dashboard.verifyTheEnrolledCertification(title);
    })

})