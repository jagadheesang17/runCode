import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { updateCronDataJSON } from "../../../utils/jsonDataHandler";
import { URLConstants } from "../../../constants/urlConstants";
import { nonComplianceCertificationExpiry_CronJob, updateCertificationComplianceFlow } from "../DB/DBJobs";
import { readDataFromCSV } from "../../../utils/csvUtil";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const portal = URLConstants.portal1;
const pageUrl = URLConstants.adminURL;

// Generate test data
const user1 = FakerData.getUserId();
const learnerGroupTitle = FakerData.getFirstName() + "_AutoRegGroup";

test.describe(`TPT078_Verify_certification_auto_enrollment_after_expiry_with_mandatory_access`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Create test user for mandatory certification testing`, async ({ adminHome, createUser, contentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create user for mandatory access testing` },
            { type: `Test Description`, description: `Create user1 that will be assigned to learner group for mandatory certification auto-enrollment` }
        );

        const csvFilePath = './data/User.csv';
        const data = await readDataFromCSV(csvFilePath);
        await adminHome.clearBrowserCache(pageUrl);
        await adminHome.loadAndLogin("SUPERADMIN");

        console.log(`🔄 Creating user: ${user1}`);

        for (const row of data) {
            const { country, state, timezone, currency, city, zipcode } = row;

            await adminHome.menuButton();
            await adminHome.people();
            await adminHome.user();
            await createUser.clickCreateUser();
            await createUser.verifyCreateUserLabel();
            await createUser.uncheckInheritAddressIfPresent();
            await createUser.uncheckInheritEmergencyContactIfPresent();
            await createUser.uncheckAutoGenerateUsernameIfPresent();
            await createUser.enter("first_name", FakerData.getFirstName());
            await createUser.enter("last_name", FakerData.getLastName());
            await createUser.enter("username", user1);
            await createUser.enter("user-password", "Welcome1@");
            await createUser.enter("email", FakerData.getEmail());
            await createUser.enter("user-phone", FakerData.getMobileNumber());
            await createUser.typeAddress("Address 1", FakerData.getAddress());
            await createUser.typeAddress("Address 2", FakerData.getAddress());
            await createUser.select("Country", country);
            await createUser.select("State/Province", state);
            await createUser.select("Time Zone", timezone);
            await createUser.select("Currency", currency);
            await createUser.enter("user-city", city);
            await createUser.enter("user-zipcode", zipcode);
            await createUser.enter("user-mobile", FakerData.getMobileNumber());
            await createUser.clickSave();
            await createUser.verifyUserCreationSuccessMessage();
            await adminHome.page.reload();
            break; // Only process first row of CSV data
        }
        console.log(`✅ Successfully created user: ${user1}`);
    });

    test(`Create learner group with user assignment`, async ({ adminHome, learnerHome, adminGroup, createCourse, contentHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create learner group with user assignment` },
            { type: `Test Description`, description: `Create learner group and assign user1 for mandatory certification testing` }
        );

        await adminHome.loadAndLogin("SUPERADMIN");

        console.log(`🔄 Creating Learner Group: ${learnerGroupTitle} with user: ${user1}`);
        await adminHome.menuButton();
        await adminHome.people();
        await learnerHome.LearnerGroup();
        await adminGroup.clickCreateGroup();
        await adminGroup.enterGroupTitle(learnerGroupTitle);
        await adminGroup.searchUser(user1);
        await adminGroup.clickuserCheckbox(user1);
        await learnerGroup.clickSelelctLearners();
        await adminGroup.clickActivate();

        // Save and handle popup if present
        await adminGroup.clickSaveWithPopupHandling();

        await adminGroup.clickProceed();
        await createCourse.verifySuccessMessage();
        await contentHome.gotoListing();
        console.log(`✅ Created Learner Group: ${learnerGroupTitle} with user: ${user1}`);
    });

    test(`Create E-learning course for certification at single module level`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create E-learning course for certification` },
            { type: `Test Description`, description: `Create single instance E-learning course to be attached to certification at module level` }
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
        await createCourse.selectDomainOption(portal);
        await createCourse.contentLibrary(); // Default YouTube content will be attached
        await createCourse.clickHere();
        await createCourse.selectImage();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Successfully created course: ${courseName}`);
    });

    const certificationTitle = ("CERT_MandatoryAutoReg_" + FakerData.getCourseName());
    test(`Create certification with Specific Date expiration and mandatory group access at single module level`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create certification with Specific Date expiration and mandatory access` },
            { type: `Test Description`, description: `Create certification with expiry based on specific date, set mandatory group access, and add course at single module level` }
        );

        const newData = {
            TP078: certificationTitle
        };
        updateCronDataJSON(newData);

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(certificationTitle);
        await learningPath.description(description);
        await learningPath.language();
        await learningPath.hasRecertification();

        // Set expiration with Specific Date
        console.log(`🔄 Setting expiration with Specific Date`);
        await learningPath.clickExpiresDropdown();
        await learningPath.clickExpiresButtonWithType("Specific Date");

        await learningPath.clickSaveAsDraftBtn();
        await learningPath.clickSave();
        await learningPath.clickProceedBtn();

        // Enable Training Plan with Modules and add course at single module level
        console.log(`🔄 Adding course at single module level`);
        await learningPath.tpWithModulesToAttachCreatedCourse();
        await learningPath.clickAddCourse();
        await learningPath.searchAndClickCourseCheckBox(courseName);
        await learningPath.clickAddSelectCourse();

        await learningPath.clickDetailTab();
        await learningPath.clickCatalogBtn();
        await learningPath.clickUpdateBtn();
        await learningPath.verifySuccessMessage();

        // Set mandatory group access
        console.log(`🔄 Setting mandatory group access for learner group: ${learnerGroupTitle}`);
        await learningPath.clickEditCertification();
        await createCourse.clickAccessButton();
        await createCourse.specificLearnerGroupSelection(learnerGroupTitle);
        await createCourse.addSingleLearnerGroup(user1);
        await createCourse.saveAccessButton();
        await createCourse.accessSettings("Mandatory");
        
        // Add completion certificate
        await createCourse.clickCompletionCertificate();
        await createCourse.clickCertificateCheckBox();
        await createCourse.clickAdd();
        await learningPath.description(description);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();

        console.log(`✅ Successfully created certification with Specific Date expiration and mandatory group access at single module level: ${certificationTitle}`);
    });

    test(`Execute auto register cron job for initial mandatory enrollment`, async ({ }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Execute auto register cron job for initial enrollment` },
            { type: `Test Description`, description: `Execute auto register cron job to auto-enroll learner in mandatory certification` }
        );

        console.log(`🔄 Executing auto register cron job for initial enrollment...`);
        await updateCertificationComplianceFlow();
        console.log(`✅ Auto register cron job executed successfully`);
    });

    test(`Verify learner auto-enrolled and complete certification`, async ({ learnerHome, catalog, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify learner auto-enrollment and complete certification` },
            { type: `Test Description`, description: `Verify learner is auto-enrolled due to mandatory access, then complete the certification` }
        );

        console.log(`🔄 Verifying auto-enrollment and completing certification for user: ${user1}`);
        await learnerHome.basicLogin(user1, "DefaultPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.searchCertification(certificationTitle);
        await dashboard.verifyTheEnrolledCertification(certificationTitle);
        await dashboard.clickTitle(certificationTitle);
        
        // Verify mandatory label
        await catalog.mandatoryTextVerification();
        console.log(`✅ Verified mandatory label on certification`);
        
        // Complete the certification
        await catalog.verifytpCourseStatus(certificationTitle, "Enrolled");
        await catalog.clickLaunchButton();
        await catalog.saveLearningStatus();
        await catalog.verifyStatus("Completed");
        await catalog.clickViewCertificate();
        console.log(`✅ Learner completed certification: ${certificationTitle}`);
    });

    test(`Execute certification expiry cron job`, async ({ }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Execute certification expiry cron job` },
            { type: `Test Description`, description: `Execute certification expiry cron job to make certification expire` }
        );

        console.log(`🔄 Executing certification expiry cron job...`);
        await nonComplianceCertificationExpiry_CronJob();
        console.log(`✅ Certification expiry cron job executed successfully`);
    });

    test(`Verify certification has expired status after cron execution`, async ({ learnerHome, dashboard, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify certification expired status` },
            { type: `Test Description`, description: `Verify that certification shows expired status in learner dashboard after cron job execution` }
        );

        await learnerHome.basicLogin(user1, "DefaultPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.searchCertification(certificationTitle);
        await dashboard.verifyTheEnrolledCertification(certificationTitle);
        await dashboard.clickTitle(certificationTitle);
        await catalog.verifyStatus("Expired");
        console.log(`✅ Successfully verified certification expired status for user ${user1}: ${certificationTitle}`);
    });

    test(`Execute auto register cron job again to verify no auto re-enrollment`, async ({ }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Execute auto register cron job after certification expiry` },
            { type: `Test Description`, description: `Execute auto register cron job after expiry to verify learner does NOT get auto re-enrolled in expired certification` }
        );

        console.log(`🔄 Executing auto register cron job after expiry...`);
        await updateCertificationComplianceFlow();
        console.log(`✅ Auto register cron job executed successfully after expiry`);
    });

    test(`Verify learner is NOT auto re-enrolled in expired certification`, async ({ learnerHome, dashboard, catalog }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify no auto re-enrollment after expiry` },
            { type: `Test Description`, description: `Verify that learner is NOT auto re-enrolled in expired mandatory certification after auto register cron execution` }
        );

        await learnerHome.basicLogin(user1, "DefaultPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.searchCertification(certificationTitle);
        await dashboard.verifyTheEnrolledCertification(certificationTitle);
        await dashboard.clickTitle(certificationTitle);
        
        // Verify certification still shows Expired status (not re-enrolled)
        await catalog.verifyStatus("Expired");
        console.log(`✅ Successfully verified user ${user1} is NOT auto re-enrolled - certification remains Expired: ${certificationTitle}`);
        console.log(`✅ Test completed: Auto register cron does not re-enroll users in expired mandatory certifications`);
    });
});
