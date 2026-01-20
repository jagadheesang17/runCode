import path from "path";
import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from "../../../utils/fakerUtils"
import { credentialConstants } from "../../../constants/credentialConstants";
import { updateCronDataJSON } from "../../../utils/jsonDataHandler";
import { updateSingleInstanceAutoRegister } from "../DB/DBJobs";
import { URLConstants } from "../../../constants/urlConstants";
import { credentials } from "../../../constants/credentialData";


let courseName = ("Cron " + FakerData.getCourseName());
const user = credentials.LEARNERUSERNAME.username
test.describe(`Verify Elearning compliance course flow`, async () => {
    test.describe.configure({ mode: "serial" });
    test(`Course Creation for  E-Learning work flow`, async ({ adminHome, createCourse, editCourse, learningPath }) => {
        test.info().annotations.push(
            { type: 'Author', description: 'Ajay Michael' },
            { type: 'TestCase', description: 'Course Creation for  E-Learning work flow' },
            { type: 'Test Description', description: "Verifying E-Learning workflow" }
        );

        const newData = {
            CRS005: courseName
        }
        updateCronDataJSON(newData)
        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name :" + courseName);
        await createCourse.selectDomainOption("automationtenant");
        await createCourse.providerDropdown();
        await createCourse.clickregistrationEnds();
        await createCourse.selectCompliance();
        await learningPath.clickExpiresButton();
        //@reminder- Validaity Field has been removed (19/09/2024)
        //     await createCourse.selectValidity();
        //    await createCourse.daysOfValidity("1"); 
        await createCourse.selectCompleteBy();
        await createCourse.selectCompleteByDate();
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
       await createCourse.modifyTheAccess();
       await createCourse.clickAccessButton();
        await createCourse.specificLearnerGroupSelection(URLConstants.LearnerGroup1);
        await createCourse.addSingleLearnerGroup(user);
        await createCourse.saveAccessButton();
        await editCourse.clickClose();
        await createCourse.typeDescription("This is a new course by name :" + courseName);
        //await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

    })

    test(`Test to execute CRON JOB`, async ({ }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Ajay Michael` },
            { type: `TestCase`, description: `Test to execute CRON JOB` },
            { type: `Test Description`, description: `Verify the CRON Job` }
        );


        await updateSingleInstanceAutoRegister();
    })

})