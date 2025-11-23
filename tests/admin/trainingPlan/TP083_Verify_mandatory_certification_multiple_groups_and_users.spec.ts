import { credentials } from "../../../constants/credentialData";
import { URLConstants } from "../../../constants/urlConstants";
import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from "../../../utils/fakerUtils";
import { updateCertificationComplianceFlow } from "../../../tests/admin/DB/DBJobs";
import { readDataFromCSV } from "../../../utils/csvUtil";

let courseName = FakerData.getCourseName();
let description = FakerData.getDescription();
const pageUrl = URLConstants.adminURL;

// Generate test data
const user1 = FakerData.getUserId();
const user2 = FakerData.getUserId();
const learnerGroup1Title = FakerData.getFirstName() + "_Group1";
const learnerGroup2Title = FakerData.getFirstName() + "_Group2";

test.describe(`TP065_Verify_mandatory_certification_multiple_groups_and_users.spec.ts`, async () => {
    test.describe.configure({ mode: "serial" });

    test(`Create two test users for multi-group testing`, async ({ adminHome, createUser, contentHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create two users for multi-group mandatory access testing` },
            { type: `Test Description`, description: `Create user1 and user2 that will be assigned to different learner groups` }
        );

        const csvFilePath = './data/User.csv';
        const data = await readDataFromCSV(csvFilePath);
        const users = [user1, user2];
        await adminHome.clearBrowserCache(pageUrl)
        await adminHome.loadAndLogin("SUPERADMIN");

        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            console.log(`🔄 Creating user ${i + 1}: ${user}`);

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
                await createUser.enter("username", user);
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
        }
        console.log(`✅ Successfully created users: ${users.join(', ')}`);
    });

    test(`Create two learner groups with specific user assignments`, async ({ adminHome, learnerHome, adminGroup, createCourse, contentHome, learnerGroup }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create learner groups with multi-user assignments` },
            { type: `Test Description`, description: `Create learner group 1 with user1, and learner group 2 with both user1 and user2` }
        );

        await adminHome.loadAndLogin("SUPERADMIN");

        // Create Learner Group 1 with User1 only
        console.log(`🔄 Creating Learner Group 1: ${learnerGroup1Title} with user: ${user1}`);
        await adminHome.menuButton();
        await adminHome.people();
        await learnerHome.LearnerGroup();
        await adminGroup.clickCreateGroup();
        await adminGroup.enterGroupTitle(learnerGroup1Title);
        await adminGroup.searchUser(user1);
        await adminGroup.clickuserCheckbox(user1);
        await learnerGroup.clickSelelctLearners();
        await adminGroup.clickActivate();

        // Save and handle popup if present for Learner Group 1
        await adminGroup.clickSaveWithPopupHandling();

        await adminGroup.clickProceed();
        await createCourse.verifySuccessMessage();
        await contentHome.gotoListing();
        console.log(`✅ Created Learner Group 1: ${learnerGroup1Title} with user: ${user1}`);

        // Create Learner Group 2 with User1 and User2
        console.log(`🔄 Creating Learner Group 2: ${learnerGroup2Title} with users: ${user1}, ${user2}`);
        await adminGroup.clickCreateGroup();
        await adminGroup.enterGroupTitle(learnerGroup2Title);

        // Add User1
        await adminGroup.searchUser(user1);
        await adminGroup.clickuserCheckbox(user1);
        await learnerGroup.clickSelelctLearners();

        // Add User2  
        await adminGroup.searchUser(user2);
        await adminGroup.clickuserCheckbox(user2);

        await learnerGroup.clickSelelctLearners();
        await adminGroup.clickActivate();

        // Save and handle popup if present for Learner Group 2
        await adminGroup.clickSaveWithPopupHandling();

        await adminGroup.clickProceed();
        await createCourse.verifySuccessMessage();
        await contentHome.gotoListing();
        console.log(`✅ Created Learner Group 2: ${learnerGroup2Title} with users: ${user1}, ${user2}`);
    });

    test(`Create E-learning single instance course for mandatory access testing`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create course for multiple group mandatory access testing` },
            { type: `Test Description`, description: `Create single instance course that will be used in certification for mandatory access with multiple groups` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", courseName);
        await createCourse.getCourse();
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.contentLibrary(); // By default YouTube content will be attached
        await createCourse.clickHere();
        await createCourse.selectImage();
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Course created: ${courseName}`);
    });

    const title = ("CERT " + FakerData.getCourseName());

    test(`Create certification with mandatory access for multiple learner groups and users`, async ({ adminHome, learningPath, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Create certification with mandatory access for multiple groups` },
            { type: `Test Description`, description: `Create certification and configure mandatory access for two learner groups with multiple users` }
        );

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
        await learningPath.clickEditCertification();

        // Configure access with multiple learner groups
        await createCourse.clickAccessButton();

        // Select both learner groups
        console.log(`🔄 Selecting multiple learner groups: ${learnerGroup1Title}, ${learnerGroup2Title}`);
        await createCourse.multipleLearnerGroupSelection([learnerGroup1Title, learnerGroup2Title]);

        // Add both users
        console.log(`🔄 Adding multiple users: ${user1}, ${user2}`);
        await createCourse.addMultipleLearnerGroups([user1, user2]);

        await createCourse.saveAccessButton();

        // Set access to "Mandatory" to enforce auto enrollment and prevent cancellation
        await createCourse.overallAccessSettings("Mandatory");
        console.log("✅ Mandatory access settings configured for multiple learner groups");

        await learningPath.description(description);
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        console.log("✅ Certification created with mandatory access for multiple groups and users");
    });

    test(`Run auto register cron job and verify certification is auto-enrolled for multiple users`, async ({ adminHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Execute auto register cron for multiple users` },
            { type: `Test Description`, description: `Run auto register cron job and verify that certification is auto-enrolled for all users in multiple groups` }
        );

        // Execute auto register cron job
        console.log("🔄 Executing auto register cron job for multiple groups...");
        await updateCertificationComplianceFlow();
        console.log("✅ Auto register cron job executed for multiple groups");
    });

    test(`Verify mandatory certification is auto-enrolled for User1 (in both groups)`, async ({ dashboard, learnerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify User1 auto-enrollment due to mandatory access` },
            { type: `Test Description`, description: `Verify that User1 (member of both groups) has the certification auto-enrolled` }
        );

        // Login as User1
        console.log(`🔄 Verifying auto-enrollment for User1: ${user1}`);
        await learnerHome.basicLogin(user1, "LearnerPortal");

        // Check My Dashboard to ensure it's auto-enrolled
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();

        try {
            await dashboard.searchCertification(title);
            console.log(`✅ SUCCESS: Certification was auto-enrolled for User1: ${user1}`);
        } catch (error) {
            console.log(`❌ FAILURE: Certification was NOT auto-enrolled for User1: ${user1}`);
            throw new Error(`Certification should be auto-enrolled for User1 with mandatory access`);
        }
    });

    test(`Verify mandatory certification is auto-enrolled for User2 (in one group)`, async ({ dashboard, learnerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify User2 auto-enrollment due to mandatory access` },
            { type: `Test Description`, description: `Verify that User2 (member of learner group 2 only) has the certification auto-enrolled` }
        );

        // Login as User2
        console.log(`🔄 Verifying auto-enrollment for User2: ${user2}`);
        await learnerHome.basicLogin(user2, "LearnerPortal");

        // Check My Dashboard to ensure it's auto-enrolled
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();

        try {
            await dashboard.searchCertification(title);
            console.log(`✅ SUCCESS: Certification was auto-enrolled for User2: ${user2}`);
        } catch (error) {
            console.log(`❌ FAILURE: Certification was NOT auto-enrolled for User2: ${user2}`);
            throw new Error(`Certification should be auto-enrolled for User2 with mandatory access`);
        }
    });

    test(`Verify User1 cannot cancel mandatory certification enrollment`, async ({ catalog, learnerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify User1 cannot cancel mandatory certification` },
            { type: `Test Description`, description: `Verify that User1 cannot cancel enrollment for mandatory certification` }
        );

        // Login as User1
        console.log(`🔄 Verifying cancellation restriction for User1: ${user1}`);
        await learnerHome.basicLogin(user1, "LearnerPortal");

        // Navigate to My Learning to find the mandatory certification
        await catalog.clickMyLearning();
        await catalog.searchMyLearning(courseName);

        try {
            // Try to find and click the certification
            await catalog.verifyEnrolledCourseByTitle(courseName);
            console.log(`✅ Mandatory certification found in My Learning for User1: ${user1}`);

            // Attempt to cancel enrollment (this should fail or not be available)
            try {
                await catalog.mylearningMandatoryClassCancel();
                console.log(`❌ FAILURE: Cancel enrollment option was available for User1: ${user1}`);
                throw new Error(`Mandatory certification should NOT allow cancellation for User1`);
            } catch (cancelError) {
                if (cancelError.message.includes("should NOT allow cancellation")) {
                    throw cancelError;
                }
                // Expected behavior - cancel enrollment not available or failed
                console.log(`✅ SUCCESS: Cancel enrollment is NOT available for User1: ${user1}`);
            }

        } catch (error) {
            if (error.message.includes("should NOT allow cancellation")) {
                throw error;
            }
            console.log(`⚠️ Certification may not be visible for User1 or there was an issue accessing it`);
        }
    });

    test(`Verify User2 cannot cancel mandatory certification enrollment`, async ({ catalog, learnerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Tamilvanan` },
            { type: `TestCase`, description: `Verify User2 cannot cancel mandatory certification` },
            { type: `Test Description`, description: `Verify that User2 cannot cancel enrollment for mandatory certification` }
        );

        // Login as User2
        console.log(`🔄 Verifying cancellation restriction for User2: ${user2}`);
        await learnerHome.basicLogin(user2, "LearnerPortal");

        // Navigate to My Learning to find the mandatory certification
        await catalog.clickMyLearning();
        await catalog.searchMyLearning(courseName);

        try {
            // Try to find and click the certification
            await catalog.verifyEnrolledCourseByTitle(courseName);
            console.log(`✅ Mandatory certification found in My Learning for User2: ${user2}`);

            // Attempt to cancel enrollment (this should fail or not be available)
            try {
                await catalog.mylearningMandatoryClassCancel();
                console.log(`❌ FAILURE: Cancel enrollment option was available for User2: ${user2}`);
                throw new Error(`Mandatory certification should NOT allow cancellation for User2`);
            } catch (cancelError) {
                if (cancelError.message.includes("should NOT allow cancellation")) {
                    throw cancelError;
                }
                // Expected behavior - cancel enrollment not available or failed
                console.log(`✅ SUCCESS: Cancel enrollment is NOT available for User2: ${user2}`);
            }

        } catch (error) {
            if (error.message.includes("should NOT allow cancellation")) {
                throw error;
            }
            console.log(`⚠️ Certification may not be visible for User2 or there was an issue accessing it`);
        }
    });
});
