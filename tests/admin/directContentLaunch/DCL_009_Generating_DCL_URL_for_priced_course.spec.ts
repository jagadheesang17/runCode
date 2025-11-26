import { credentials } from "../../../constants/credentialData";
import { test } from "../../../customFixtures/expertusFixture"
import { LearnerHomePage } from "../../../pages/LearnerHomePage";
import { FakerData } from '../../../utils/fakerUtils';


//course creation fuctions 
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription()
let URL: any
let createdCode: any
const price = FakerData.getPrice();

test.describe.configure({ mode: "serial" });
test(`creation of course in Hide in catalog and generate Direct content url`, async ({ contentHome, adminHome, createCourse, directContent, costCenter, enrollHome }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Nithya` },
        { type: `TestCase`, description: `creation of course in Hide in catalog and generate Direct content url` },
        { type: `Test Description`, description: `creation of course in Hide in catalog and generate Direct content url` }
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
    await createCourse.enterPrice(price);
    await createCourse.selectCurrency();
    await createCourse.contentLibrary();//Youtube content is attached here
    await createCourse.clickHideinCatalog();
    await createCourse.clickSave();
    await createCourse.clickProceed();

    await createCourse.verifySuccessMessage();
    //  await contentHome.gotoListing();
    // await createCourse.catalogSearch(courseName)
    // createdCode = await createCourse.retriveCode()
    // console.log("Extracted Code is : " + createdCode);
    await adminHome.menuButton()
    await adminHome.clickEnrollmentMenu();
    await adminHome.clickEnroll();
    await enrollHome.manageEnrollment("Create Order")
    await enrollHome.selectMulticourseForSingleOrder(courseName)
    await enrollHome.clickSelectedLearner();
    await enrollHome.enterSearchUserForSingleOrder(credentials.LEARNERUSERNAME.username)
    await enrollHome.clickCheckoutButton();
    await costCenter.billingDetails("United States", "Alaska")
    await enrollHome.clickCalculateTaxButton()
    await enrollHome.paymentMethod("Cost center");
    await costCenter.fillCostCenterInput();
    await costCenter.clickTermsandCondition();
    await enrollHome.clickApproveOrder()
    await enrollHome.orderSuccessMsg();
    await adminHome.menuButton();
    await adminHome.clickLearningMenu();
    await adminHome.clickDirectContentLaunchLink();
    await directContent.clickdomaindropdown("newprod");
    await directContent.searchfield(courseName);
    await directContent.generateURL();
    URL = await directContent.copyURL();
    await directContent.verifySuccessMessage();




})

test(`Launching the content through direct content launch in learner side`, async ({ learnerHome, catalog }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Nithya` },
        { type: `TestCase`, description: `Confirm that YouTube content functions correctly and as expected` },
        { type: `Test Description`, description: `Confirm that YouTube content functions correctly and as expected` }
    );
    await learnerHome.launchDCL(URL)
    await learnerHome.DirectContentLogin("LEARNERUSERNAME");
    // await catalog.dclmesageVerification();
    // await catalog.clickSelectcourse(courseName);
    // await catalog.clickEnroll();
    await catalog.clickLaunchButton();
    await catalog.saveLearningStatus();
    await catalog.clickMyLearning();
    await catalog.clickCompletedButton();
    await catalog.searchMyLearning(courseName);
    await catalog.verifyCompletedCourse(courseName);

})






// test(`Confirm that YouTube content functions correctly and as expected.`, async ({ learnerHome, catalog }) => {
//         test.info().annotations.push(
//             { type: `Author`, description: `Ajay Michael` },
//             { type: `TestCase`, description: `Confirm that YouTube content functions correctly and as expected` },
//             { type: `Test Description`, description: `Confirm that YouTube content functions correctly and as expected` }
//         );
//         await learnerHome.learnerLogin("LEARNERUSERNAME", "DefaultPortal");
//         await learnerHome.clickCatalog();
//         await catalog.mostRecent();
//         await catalog.searchCatalog(courseName);
//         await catalog.clickMoreonCourse(courseName);
//         await catalog.clickSelectcourse(courseName);
//         await catalog.clickEnroll();
//         await catalog.clickLaunchButton();
//         await catalog.saveLearningStatus();
//         await catalog.clickMyLearning();
//         await catalog.clickCompletedButton();
//         await catalog.searchMyLearning(courseName);
//         await catalog.verifyCompletedCourse(courseName);
//     })
