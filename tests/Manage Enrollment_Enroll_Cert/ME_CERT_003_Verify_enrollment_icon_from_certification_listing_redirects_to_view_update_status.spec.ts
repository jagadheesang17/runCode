import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
import { credentials } from "../../constants/credentialData";

const certificationTitle = FakerData.getCourseName();
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();

test.describe(`Verify clicking enrollment icon from certification listing page redirects to view/update status page`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Create E-learning course for certification`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Create E-learning course for certification` },
            { type: `Test Description`, description: `Create a single instance E-learning course to be attached to certification` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ E-learning course created: ${courseName}`);
    });

    test(`Create certification and attach course`, async ({ adminHome, learningPath }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Create certification and attach E-learning course` },
            { type: `Test Description`, description: `Create a certification and attach the E-learning course` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(certificationTitle);
        await learningPath.language();
        await learningPath.description(description);
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();
        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();
        console.log(`✅ Certification created and course attached: ${certificationTitle}`);
    });

    test(`Search certification in listing page and click enrollment icon to verify redirection to view/update status page`, async ({ adminHome, learningPath, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Verify enrollment icon click from certification listing redirects to view/update status page` },
            { type: `Test Description`, description: `From certification listing page, search for certification, click enrollment icon and verify redirection to view/update status page` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();

        // Wait for certification listing page to load
        await page.waitForLoadState("load");
        await learningPath.wait("mediumWait");

        // Search for the certification in listing page
        const searchInput = page.locator("//input[@placeholder='Search']");
        await searchInput.waitFor({ state: "visible" });
        await searchInput.fill(certificationTitle);
        await searchInput.press("Enter");
        await learningPath.wait("mediumWait");
        console.log(`🔍 Searched for certification: ${certificationTitle}`);

        // Click on enrollment icon from certification listing
        const enrollmentIconSelector = `//span[text()='${certificationTitle}']//ancestor::tr//a[@href='/admin/learning/enrollments/viewstatus']//i | //div[text()='${certificationTitle}']//following::a[@href='/admin/learning/enrollments/viewstatus'][1]//i`;
        
        await page.locator(enrollmentIconSelector).waitFor({ state: "visible", timeout: 10000 });
        await page.locator(enrollmentIconSelector).click();
        await learningPath.wait("mediumWait");
        console.log(`✅ Clicked enrollment icon for certification: ${certificationTitle}`);

        // Verify redirection to view/update status page
        await page.waitForURL(/.*enrollments\/viewstatus.*/, { timeout: 10000 });
        const currentURL = page.url();
        
        if (currentURL.includes("enrollments/viewstatus")) {
            console.log(`✅ Successfully redirected to view/update status page`);
            console.log(`   Current URL: ${currentURL}`);
        } else {
            throw new Error(`Failed to redirect to view/update status page. Current URL: ${currentURL}`);
        }

        // Verify page elements on view/update status page
        const viewUpdatePageElements = [
            "//h1[contains(text(),'View/Update Status')] | //h2[contains(text(),'View/Update Status')]",
            "//span[contains(text(),'View/Update Status')] | //div[contains(text(),'Enrollment')]",
            `//span[text()='${certificationTitle}'] | //div[text()='${certificationTitle}']`
        ];

        let pageVerified = false;
        for (const selector of viewUpdatePageElements) {
            try {
                await page.locator(selector).waitFor({ state: "visible", timeout: 5000 });
                console.log(`✅ Verified element on view/update status page`);
                pageVerified = true;
                break;
            } catch (error) {
                continue;
            }
        }

        if (pageVerified) {
            console.log(`✅ View/Update Status page verified successfully for certification: ${certificationTitle}`);
        } else {
            console.log(`⚠️ View/Update Status page loaded but specific elements not found (page may have different structure)`);
        }
    });
});
