import { test } from '../../customFixtures/expertusFixture'
import { FakerData } from '../../utils/fakerUtils';
import { readDataFromCSV } from '../../utils/csvUtil';
import { logADefectInJira } from '../../jira/log-a-defect';

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
let CEUVALUE: string;
let CEUPROVIDER: string;
let jiraIssueKey: string | undefined; // Declare jiraIssueKey at the top level

test.describe(`TC110 Add Preferernce`, async () => {
    test.describe.configure({ mode: 'serial' })

    test(`TC060_TP_Prerequisite_Course1_Elearning`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Ajay Michael` },
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
        await createCourse.clickDetailButton()
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

    })

    test(`Verify from learner site`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Ajay Michael` },
            { type: `TestCase`, description: `TC052_Learner Side Course Enrollment` },
            { type: `Test Description`, description: `Verify that course should be created for Single instance` }
        );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(courseName);
        await catalog.clickMoreonCourse(courseName);
        await catalog.clickSelectcourse(courseName);
        await catalog.clickEnroll();
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
    })
    test(`TC110_Adding Preference Details`, async ({ learnerHome, profile, createUser }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Ajay Michael` },
            { type: `TestCase`, description: `Adding Preference Details` },
            { type: `Test Description`, description: `Verify that learner can add the preference details successfully` }
        );
        const csvFilePath = './data/User.csv';
        const data = await readDataFromCSV(csvFilePath);
        for (const row of data) {
            const { country, state, timezone, currency, city, zipcode } = row;
            {
                await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
                await profile.clickProfile();
                await profile.preferenceTab();
                await profile.preferenceTimeZone("GMT");
                await profile.selectLanguage()
                await profile.selectCurrency()
                await profile.selectCountry()
                await profile.city()
                await profile.selectDateFormat();
                await profile.selectDetailsPage()
                await profile.ceuType();
                await profile.creditPeriod("March")
                await profile.creditScore()
                await profile.address1()
                await profile.address2()
                await profile.zipcode()
                await profile.mobile()
                await profile.phone()
                await profile.selectDepartment()
                await profile.employeeId()
                await profile.selectEmployeeType();
                await profile.selectJobRole();
                await profile.selectJobTitle();
                await profile.selectOrganization()
                await profile.selectUserType()
                await profile.clickSave()
                await profile.verifySavedChanges()

            }
        }

    })

})
// test.afterEach(async ({}, testInfo) => {
//     jiraIssueKey = await logADefectInJira(testInfo);

// });
//  test.afterAll(async ({},testInfo) => {
//         if (jiraIssueKey) {
//         // Replace with the actual folder path
//             await updateJiraIssue(jiraIssueKey, 'C:/New folder(2)/ExpertusOne/test-results/**/test-*.png');
//         }
//     });

