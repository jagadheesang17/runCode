import { create } from "domain";
import { test } from "../../../customFixtures/expertusFixture"
import { CostcenterPage } from "../../../pages/CostcenterPage";
import { FakerData } from '../../../utils/fakerUtils';
import { readDataFromCSV } from "../../../utils/csvUtil";
import { credentials } from "../../../constants/credentialData";


const courseName = FakerData.getCourseName();
const instructorName = credentials.INSTRUCTORNAME.username
const price = FakerData.getPrice();
const sessionName = FakerData.getSession();

test.describe(`Verify manager approved ILT course is available on the learner side`, async () => {
    test.describe.configure({ mode: 'serial' })
    test(`Single ILT instance with Manager Approval Enabled`, async ({ adminHome, createCourse, editCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Single ILT instance with Manager Approval Enabled` },
            { type: `Test Description`, description: `Single ILT instance with Manager Approval Enabled` }

        );
        //Faker data:
        await adminHome.loadAndLogin("CUSTOMERADMIN"); //Need to user learner admin which is not having location data
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectdeliveryType("Classroom")
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("This is a new course by name :" + courseName);
        await createCourse.enterPrice(price);
        await createCourse.selectCurrency();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await createCourse.clickEditCourseTabs();
        await editCourse.clickManagerApproval();
        await editCourse.verifyInheritanceMessage();
        await editCourse.verifyapprovaluserType("Internal Users")
        await editCourse.clickinternalManager("Either Direct or Other Manager")
        await editCourse.clickapprovaluserType("External Users")
        await editCourse.saveApproval()
        await createCourse.typeDescription("  Added Manager Approval")
        // await createCourse.clickUpdate()
        // await createCourse.verifySuccessMessage()
        // await createCourse.clickEditCourseTabs();
        await createCourse.addInstances();
        async function addinstance(deliveryType: string) {
            await createCourse.selectInstanceDeliveryType(deliveryType);
            await createCourse.clickCreateInstance();
        }
        await addinstance("Classroom");
        await createCourse.enterSessionName(sessionName);
        await createCourse.enterDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.setMaxSeat();
        await createCourse.typeDescription("Created new Instance")
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    })

    test(`Ensure that a learner is able to register for a course that requires manager approval`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Ensure that a learner is able to register for a course that requires manager approval` },
            { type: `Test Description`, description: `Ensure that a learner is able to register for a course that requires manager approval` }
        );
        await learnerHome.learnerLogin("TEAMUSER2", "DefaultPortal");
        await learnerHome.clickCatalog();
        await catalog.mostRecent();
        await catalog.searchCatalog(courseName);
        await catalog.clickMoreonCourse(courseName);
        await catalog.clickSelectcourse(courseName);
         await catalog.clickRequestapproval();
       // await catalog.clickRequestClass();
        await catalog.requstcostCenterdetails();
    })


    test(`Ensure that the manager is able to successfully approve the given request`, async ({ managerHome,location,profile,learnerHome, createUser, editCourse }) => {
        const csvFilePath = './data/User.csv';
        const data = await readDataFromCSV(csvFilePath);

        for (const row of data) {
            const { country, state, timezone, currency, city, zipcode } = row;
            test.info().annotations.push(
                { type: `Author`, description: `Tamilvanan` },
                { type: `TestCase`, description: `Ensure that the manager is able to successfully approve the given request` },
                { type: `Test Description`, description: `Ensure that the manager is able to successfully approve the given request` }
            );
            await learnerHome.learnerLogin("MANAGERNAME", "DefaultPortal");
            await learnerHome.selectCollaborationHub();
            await learnerHome.searchApprovalCourse(courseName)
            await learnerHome.clickApprove(courseName);
        await createUser.enter("firstName", FakerData.getFirstName());
            await createUser.enter("lastName", FakerData.getLastName());
                await managerHome.enterAddress1(FakerData.getAddress());
       await managerHome.selectCountry(country)
            await managerHome.selectState(state)
            await profile.city()
            await location.enterZipcode(zipcode)
            await learnerHome.proceedAndVerify();
            await editCourse.clickClose()
        }
    });

    test(`Verify manager approved ILT course is available on the learner side`, async ({ learnerHome, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify manager approved ILT course is available on the learner side` },
            { type: `Test Description`, description: `Verify manager approved ILT course is available on the learner side` }
        );
        await learnerHome.learnerLogin("TEAMUSER2", "DefaultPortal");
        await learnerHome.clickMyLearning();
        await catalog.searchMyLearning(courseName);
        await catalog.verifyCompletedCourse(courseName);

    });
})
