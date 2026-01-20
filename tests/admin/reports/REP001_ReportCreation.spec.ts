import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';

const courseName = "EL" + FakerData.getCourseName();
const description = FakerData.getDescription();
const reportName = "Report " + FakerData.getCourseName();
const reportDescription = "Report Description " + FakerData.getDescription();
let createdCode: any;
let selectedCategory: string;

test.describe(`Report Creation and Verification Test Suite`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Create Course For Single Instance through UI`, async ({ adminHome, createCourse, contentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create the course as Single instance for report verification` },
            { type: `Test Description`, description: `Verify that course should be created for Single instance and code extracted` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
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
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await contentHome.gotoListing();
        await createCourse.catalogSearch(courseName);
        createdCode = await createCourse.retriveCode();
        console.log("Extracted Course Code is : " + createdCode);
    });

    test(`Create Report Template`, async ({ adminHome, reportPage, contentHome,createCourse}) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create report template for catalog verification` },
            { type: `Test Description`, description: `Verify that report template should be created successfully` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await reportPage.navigateToReportsDashboard();
        // Verify Quick Reports heading
        await reportPage.verifyQuickReportsHeading();

        // Click Create Report Template
        await reportPage.clickCreateReportTemplate();

        // Verify Create Report Template heading
        await reportPage.verifyCreateReportTemplateHeading();

        // Enter report name
        await reportPage.enterReportName(reportName);

        // Select report category and store the selected value
        selectedCategory = await reportPage.selectReportCategory("Catalog");

        // Select report visibility
        await reportPage.selectReportVisibility("System admin");

        // Select report type
        await reportPage.selectReportType("Standard");

        // Enter description
        await reportPage.enterDescription(reportDescription);

        // Configuration steps
        // Step 1 - Choose columns
        await reportPage.configureStep1ChooseColumns(selectedCategory);

        // Step 2 - Launch values
      //  await reportPage.configureStep2LaunchValues();

        // Step 3 - Pre applied filters
        await reportPage.configureStep3PreAppliedFilters(selectedCategory);

        // Configure where text filters
        await reportPage.configureWhereTextFilters();

        // Click preview
        await reportPage.clickPreview();

        // Click save
        await reportPage.clickSave();

        // Verify success message
         await reportPage.verifySuccessMessage();

        // Click go to listing
        await contentHome.gotoListing();


        //Launch report and verify created course code

            // Click report category button
        await reportPage.clickReportCategoryButton(selectedCategory);

        // Click launch button
        await reportPage.clickLaunch(reportName);

        // Verify course code is present on the report page
        await reportPage.verifyCourseCodePresent(createdCode);

        console.log(`Report verification completed successfully. Course code ${createdCode} found in ${selectedCategory} report.`);

    });

});
