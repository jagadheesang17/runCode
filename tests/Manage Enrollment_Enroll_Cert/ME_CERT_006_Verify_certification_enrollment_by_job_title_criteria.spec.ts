import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
import { readDataFromCSV } from "../../utils/csvUtil";

/**
 * @description: Test suite to verify certification enrollment filtered by job title criteria
 * @author: Jagadish
 * @createdOn: November 21, 2025
 */

const firstName1 = FakerData.getFirstName();
const lastName1 = FakerData.getLastName();
const email1 = `${firstName1.toLowerCase()}.${lastName1.toLowerCase()}@test.com`;
const username1 = `${firstName1.toLowerCase()}_${lastName1.toLowerCase()}`;

const firstName2 = FakerData.getFirstName();
const lastName2 = FakerData.getLastName();
const email2 = `${firstName2.toLowerCase()}.${lastName2.toLowerCase()}@test.com`;
const username2 = `${firstName2.toLowerCase()}_${lastName2.toLowerCase()}`;

let jobTitleName: string;
let courseName: string;
let certificationName: string;
const description = FakerData.getDescription();

test.describe("Verify certification enrollment by job title criteria", () => {
    test.describe.configure({ mode: "serial" });

    test("Test 1: Create user 1 with job title", async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_CERT_006_TC001 - Create User 1 with Job Title` },
            { type: `Test Description`, description: `Create first user and assign job title` }
        );

        const csvFilePath = './data/US_address.csv';
        const data = await readDataFromCSV(csvFilePath);
        const row = data[0];
        const { country, state, timezone, address1, address2, city, zipcode } = row;

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.clickCreateUser();
        await createUser.verifyCreateUserLabel();
        await createUser.uncheckInheritAddressIfPresent();
        await createUser.uncheckInheritEmergencyContactIfPresent();
        await createUser.uncheckAutoGenerateUsernameIfPresent();
        await createUser.enter("first_name", firstName1);
        await createUser.enter("last_name", lastName1);
        await createUser.enter("email", email1);
        await createUser.enter("username", username1);
        await createUser.enter("user-password", "Welcome1@");
        await createUser.typeAddress("Address 1", FakerData.getAddress());
        await createUser.typeAddress("Address 2", FakerData.getAddress());
        await createUser.select("Country", country);
        await createUser.select("State/Province", state);
        await createUser.select("Time Zone", timezone);
        await createUser.enter("user-city", city);
        await createUser.enter("user-zipcode", zipcode);

        // Select job title and store the name
        jobTitleName = await createUser.selectjobTitle("jobtitle");
        console.log(`✅ Job title selected and stored: ${jobTitleName}`);

        await createUser.clickSave();
        await createUser.clickProceed("Proceed");
        await createUser.verifyUserCreationSuccessMessage();
        console.log(`✅ User 1 created: ${username1} with job title: ${jobTitleName}`);
    });

    test("Test 2: Create user 2 without job title initially", async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_CERT_006_TC002 - Create User 2` },
            { type: `Test Description`, description: `Create second user without job title` }
        );

        const csvFilePath = './data/US_address.csv';
        const data = await readDataFromCSV(csvFilePath);
        const row = data[1];
        const { country, state, timezone, address1, address2, city, zipcode } = row;

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.clickCreateUser();
        await createUser.verifyCreateUserLabel();
        await createUser.uncheckInheritAddressIfPresent();
        await createUser.uncheckInheritEmergencyContactIfPresent();
        await createUser.uncheckAutoGenerateUsernameIfPresent();
        await createUser.enter("first_name", firstName2);
        await createUser.enter("last_name", lastName2);
        await createUser.enter("email", email2);
        await createUser.enter("username", username2);
        await createUser.enter("user-password", "Welcome1@");
        await createUser.typeAddress("Address 1", FakerData.getAddress());
        await createUser.typeAddress("Address 2", FakerData.getAddress());
        await createUser.select("Country", country);
        await createUser.select("State/Province", state);
        await createUser.select("Time Zone", timezone);
        await createUser.enter("user-city", city);
        await createUser.enter("user-zipcode", zipcode);

        await createUser.clickSave();
        await createUser.clickProceed("Proceed");
        await createUser.verifyUserCreationSuccessMessage();
        console.log(`✅ User 2 created: ${username2}`);
    });

    test("Test 3: Edit user 2 to assign same job title as user 1", async ({ adminHome, createUser, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_CERT_006_TC003 - Assign Job Title to User 2` },
            { type: `Test Description`, description: `Edit user 2 and assign the same job title as user 1` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();

        await createUser.userSearchField(username2);
        await createUser.editIcon();

        // Uncheck auto-generation and inheritance checkboxes
        await createUser.uncheckInheritAddressIfPresent();
        await createUser.uncheckInheritEmergencyContactIfPresent();
        await createUser.uncheckAutoGenerateUsernameIfPresent();

        // Assign same job title as user 1
        const jobTitleFieldSelector = "//label[text()='Job Title']/following::div[@id='user-jobtitle']//input";
        await page.waitForSelector(jobTitleFieldSelector, { timeout: 5000 });
        await page.locator(jobTitleFieldSelector).click();
        await page.locator(jobTitleFieldSelector).pressSequentially(jobTitleName, { delay: 100 });
        await page.waitForTimeout(1000);
        
        const jobTitleOptionSelector = `//li[contains(text(),'${jobTitleName}')]`;
        await page.waitForSelector(jobTitleOptionSelector, { timeout: 5000 });
        await page.locator(jobTitleOptionSelector).click();
        await createUser.wait("minWait");

        console.log(`✅ Job title assigned to user 2: ${jobTitleName}`);

        await page.waitForTimeout(1000);
        await createUser.wait("minWait");
        await createUser.updateUser();
        await createUser.wait("minWait");
        console.log(`✅ User 2 updated with job title: ${jobTitleName}`);
    });

    test("Test 4: Create E-learning course", async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_CERT_006_TC004 - Create E-learning Course` },
            { type: `Test Description`, description: `Create an E-learning course to attach to certification` }
        );

        courseName = FakerData.getCourseName();

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

    test("Test 5: Create certification and attach the course", async ({ adminHome, learningPath }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_CERT_006_TC005 - Create Certification` },
            { type: `Test Description`, description: `Create certification and attach the E-learning course` }
        );

        certificationName = FakerData.getcertificationTitle();

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCertification();
        await learningPath.clickCreateCertification();
        await learningPath.title(certificationName);
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
        console.log(`✅ Certification created and published: ${certificationName}`);
    });

    test("Test 6: Enroll users by job title criteria", async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_CERT_006_TC006 - Enroll by Job Title Criteria` },
            { type: `Test Description`, description: `Use job title criteria to enroll users in certification` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        
        // Select Certification from dropdown
        await enrollHome.selectByOption("Certification");
        console.log(`✅ Selected enrollment type: Certification`);

        // Select the certification
        await enrollHome.selectBycourse(certificationName);
        console.log(`✅ Selected certification: ${certificationName}`);

        // Click Select Learner button
        await enrollHome.clickSelectedLearner();
        console.log(`✅ Clicked Select Learner button`);

        // Enroll by job title criteria
        await enrollHome.wait("minWait");
        const enrollByCriteriaDropDownSelector = `//label[text()='Enroll By Criteria']//following::button[contains(@data-id,'enroll-group')]`;
        const buttons = await page.locator(enrollByCriteriaDropDownSelector);
        const buttonsCount = await buttons.count();

        for (let i = 0; i < buttonsCount; i++) {
            const button = buttons.nth(i);
            if (i === 0) {
                await button.click();
                await enrollHome.wait("minWait");
                
                // Select "By Job Title"
                const byJobTitleSelector = `//span[text()='By Job Title']`;
                await page.waitForSelector(byJobTitleSelector, { timeout: 5000 });
                await page.locator(byJobTitleSelector).click();
                console.log(`✅ Selected 'By Job Title' criteria`);
            } else if (i === 1) {
                await button.click();
                await enrollHome.wait("minWait");
                
                // Select specific job title
                const jobTitleOptionSelector = `//span[text()='${jobTitleName}']`;
                await page.waitForSelector(jobTitleOptionSelector, { timeout: 5000 });
                await page.locator(jobTitleOptionSelector).click();
                console.log(`✅ Selected job title: ${jobTitleName}`);
                
                // Click Apply
                const applyButtonSelector = `//span[text()='Apply']`;
                await page.waitForSelector(applyButtonSelector, { timeout: 5000 });
                await page.locator(applyButtonSelector).click();
                await enrollHome.wait("minWait");
            }
        }

        console.log(`✅ Enrollment by job title criteria completed`);
    });

    test("Test 7: Verify user 1 is enrolled in certification", async ({ learnerHome, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_CERT_006_TC007 - Verify User 1 Enrollment` },
            { type: `Test Description`, description: `Verify that user 1 is successfully enrolled in the certification` }
        );

        await learnerHome.basicLogin(username1, "LearnerPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.searchCertification(certificationName);
        await dashboard.verifyTheEnrolledCertification(certificationName);
        console.log(`✅ User 1 (${username1}) is enrolled in certification`);
    });

    test("Test 8: Verify user 2 is enrolled in certification", async ({ learnerHome, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_CERT_006_TC008 - Verify User 2 Enrollment` },
            { type: `Test Description`, description: `Verify that user 2 is successfully enrolled in the certification` }
        );

        await learnerHome.basicLogin(username2, "LearnerPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.searchCertification(certificationName);
        await dashboard.verifyTheEnrolledCertification(certificationName);
        console.log(`✅ User 2 (${username2}) is enrolled in certification`);
    });
});
