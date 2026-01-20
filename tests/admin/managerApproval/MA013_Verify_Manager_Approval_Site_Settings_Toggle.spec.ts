import { test } from "../../../customFixtures/expertusFixture"
import { FakerData } from '../../../utils/fakerUtils';

const courseName = "COURSE_" + FakerData.getCourseName();
const lpName = "LP_" + FakerData.getCourseName();
const certName = "CERT_" + FakerData.getCourseName();
const courseNameChecked = "COURSE_CHK_" + FakerData.getCourseName();
const lpNameChecked = "LP_CHK_" + FakerData.getCourseName();
const certNameChecked = "CERT_CHK_" + FakerData.getCourseName();

test.describe(`Verify Manager Approval site settings toggle behavior`, async () => {
    test.describe.configure({ mode: 'serial' })

    test(`Verify Manager Approval default state in Site Settings`, async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify Manager Approval default state in Site Settings` },
            { type: `Test Description`, description: `Check if Manager Approval is checked or unchecked by default in Site Settings` }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        
        // Navigate to Site Admin -> Admin Configuration -> Business Rules
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await adminHome.siteAdmin_Adminconfig();
        await siteAdmin.clickBusinessRulesEditIcon();
        
        // Verify Manager Approval state
        await siteAdmin.verifyManagerApprovalState(true);
    })

    test(`Uncheck Manager Approval in Site Settings if it is checked`, async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Uncheck Manager Approval in Site Settings` },
            { type: `Test Description`, description: `Uncheck Manager Approval toggle in Site Settings if it is currently checked` }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        
        // Navigate to Site Admin -> Admin Configuration -> Business Rules
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await adminHome.siteAdmin_Adminconfig();
        await siteAdmin.clickBusinessRulesEditIcon();
        
        // Uncheck Manager Approval
        await siteAdmin.uncheckManagerApproval();
    })

    test(`Verify Manager Approval is NOT visible when unchecked`, async ({ adminHome, createCourse, learningPath }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify Manager Approval not visible on Course, Learning Path, and Certification` },
            { type: `Test Description`, description: `Verify Manager Approval tab is not visible on Course, Learning Path, and Certification creation pages when site setting is unchecked` }
        );
        
        // Test Course
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("Test course to verify Manager Approval visibility");
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await createCourse.clickEditCourseTabs();
        
        let managerApprovalVisible = await createCourse.managerApprovalVisible();
        if (!managerApprovalVisible) {
            console.log("✓ Manager Approval tab is NOT visible on Course creation page (Expected)");
        } else {
            console.log("✗ Manager Approval tab IS visible on Course creation page (Unexpected)");
            throw new Error("Manager Approval tab should not be visible on Course when site setting is unchecked");
        }

        // Test Learning Path
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
        await learningPath.title(lpName);
        await learningPath.description("Test Learning Path to verify Manager Approval visibility");
        await learningPath.language();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        
        managerApprovalVisible = await learningPath.managerApprovalVisible();
        if (!managerApprovalVisible) {
            console.log("✓ Manager Approval tab is NOT visible on Learning Path creation page (Expected)");
        } else {
            console.log("✗ Manager Approval tab IS visible on Learning Path creation page (Unexpected)");
            throw new Error("Manager Approval tab should not be visible on Learning Path when site setting is unchecked");
        }

        // Test Certification
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(certName);
        await learningPath.description("Test Certification to verify Manager Approval visibility");
        await learningPath.language();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        
        managerApprovalVisible = await learningPath.managerApprovalVisible();
        if (!managerApprovalVisible) {
            console.log("✓ Manager Approval tab is NOT visible on Certification creation page (Expected)");
        } else {
            console.log("✗ Manager Approval tab IS visible on Certification creation page (Unexpected)");
            throw new Error("Manager Approval tab should not be visible on Certification when site setting is unchecked");
        }
    })

    test(`Check Manager Approval in Site Settings`, async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Check Manager Approval in Site Settings` },
            { type: `Test Description`, description: `Check Manager Approval toggle in Site Settings` }
        );
        
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        
        // Navigate to Site Admin -> Admin Configuration -> Business Rules
        await adminHome.menuButton();
        await adminHome.siteAdmin();
        await adminHome.siteAdmin_Adminconfig();
        await siteAdmin.clickBusinessRulesEditIcon();
        
        // Check Manager Approval
        await siteAdmin.checkManagerApproval();
    })

    test(`Verify Manager Approval IS visible when checked`, async ({ adminHome, createCourse, learningPath }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify Manager Approval visible on Course, Learning Path, and Certification` },
            { type: `Test Description`, description: `Verify Manager Approval tab is visible on Course, Learning Path, and Certification creation pages when site setting is checked` }
        );
        
        // Test Course
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseNameChecked);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription("Test course to verify Manager Approval visibility when checked");
        await createCourse.contentLibrary("AICC File containing a PPT - Storyline 11");
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        await createCourse.clickEditCourseTabs();
        
        let managerApprovalVisible = await createCourse.managerApprovalVisible();
        if (managerApprovalVisible) {
            console.log("✓ Manager Approval tab IS visible on Course creation page (Expected)");
        } else {
            console.log("✗ Manager Approval tab is NOT visible on Course creation page (Unexpected)");
            throw new Error("Manager Approval tab should be visible on Course when site setting is checked");
        }

        // Test Learning Path
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickLearningPath();
        await learningPath.clickCreateLearningPath();
        await learningPath.title(lpNameChecked);
        await learningPath.description("Test Learning Path to verify Manager Approval visibility when checked");
        await learningPath.language();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();
        
        managerApprovalVisible = await learningPath.managerApprovalVisible();
        if (managerApprovalVisible) {
            console.log("✓ Manager Approval tab IS visible on Learning Path creation page (Expected)");
        } else {
            console.log("✗ Manager Approval tab is NOT visible on Learning Path creation page (Unexpected)");
            throw new Error("Manager Approval tab should be visible on Learning Path when site setting is checked");
        }

        // Test Certification
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(certNameChecked);
        await learningPath.description("Test Certification to verify Manager Approval visibility when checked");
        await learningPath.language();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn()
        
        managerApprovalVisible = await learningPath.managerApprovalVisible();
        if (managerApprovalVisible) {
            console.log("✓ Manager Approval tab IS visible on Certification creation page (Expected)");
        } else {
            console.log("✗ Manager Approval tab is NOT visible on Certification creation page (Unexpected)");
            throw new Error("Manager Approval tab should be visible on Certification when site setting is checked");
        }
    })
    })