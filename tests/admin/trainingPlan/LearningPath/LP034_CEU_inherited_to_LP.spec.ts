import { test } from '../../../../customFixtures/expertusFixture'
import { FakerData } from '../../../../utils/fakerUtils';
import { readDataFromCSV } from '../../../../utils/csvUtil';
import { logADefectInJira } from '../../../../jira/log-a-defect';

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
let CEUVALUE: string;
let CEUPROVIDER: string;
let jiraIssueKey: string | undefined; // Declare jiraIssueKey at the top level
let returnedValue:string;

test.describe(`Verify_the_CEU_which_is_inherited_from_course_to_learningpath_and_update_and_verify_them_from_learnerside_after_enrollmengt`, async () => {
    test.describe.configure({ mode: 'serial' })

    test(`Creating the EL course with CEU`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Balasundar` },
            { type: `TestCase`, description: `TP Prerequisite Course1 Elearning` },
            { type: `Test Description`, description: `Verify that course should be created successfully` }

        );

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name :" + description);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.modifyTheAccess();
        await createCourse.clickCEULink();
        CEUPROVIDER = await createCourse.fillCEUProviderType();
        console.log(CEUPROVIDER);
        CEUVALUE = await createCourse.fillCEUType();
        console.log(CEUVALUE);
        await createCourse.fillUnit();
        await createCourse.clickAddCEUButton();
        await createCourse.clickDetailButton();
        await createCourse.typeDescription("This is a new course by name :" + description);

        // await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

    })
    let title = FakerData.getCourseName();
    //let title="Primary Microchip Bypass";

    test(`Attaching that created course and verifying the inherited CEU from that course and Update to new unit `, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `LP Creation with pre and post assessment attached` },
            { type: `Test Description`, description: `LP Creation with pre and post assessment attached` }
        )

        await adminHome.loadAndLogin("CUSTOMERADMIN1")
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
        await learningPath.title(title);
        await learningPath.description(description);
        await learningPath.language();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
          await createCourse.clickCEULink();
        await learningPath.checkCEU();
        await learningPath.verifyInheritedCEUFromCourse(CEUPROVIDER)
         returnedValue=await learningPath.updateCEUUnit();
         console.log(returnedValue);
         

         await learningPath.clickDetailTab();

        await learningPath.clickCatalogBtn();
                await learningPath.clickUpdateBtn();

        //   await createCourse.okBtn();
        // await learningPath.description(description);
        // await learningPath.clickUpdateBtn();

        await learningPath.verifySuccessMessage();
      

      
    }
)



    test(`Verify that updated CEU unit in course details page from the learner side`, async ({ learnerHome, catalog }) => {


        await learnerHome.learnerLogin("LEARNERUSERNAME", "LeanrerPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(title);
        await catalog.clickEnrollButton();
        await catalog.clickViewLearningPathDetails();
        await catalog.verifyUpdatedCEUUnitFromDetailsPage(returnedValue);

})})