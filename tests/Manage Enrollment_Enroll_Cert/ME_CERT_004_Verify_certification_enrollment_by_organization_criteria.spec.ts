import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
import { readDataFromCSV } from "../../utils/csvUtil";

const user1FirstName = FakerData.getFirstName();
const user1LastName = FakerData.getLastName();
const user1Id = FakerData.getUserId();

const user2FirstName = FakerData.getFirstName();
const user2LastName = FakerData.getLastName();
const user2Id = FakerData.getUserId();

const organizationName = "ORG_" + FakerData.getOrganizationName();
const certificationTitle = FakerData.getCourseName();
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();

test.describe(`Verify certification enrollment by organization criteria`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Create first user for organization enrollment`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Create first user` },
            { type: `Test Description`, description: `Create first user to be added to organization` }
        );

        const csvFilePath = './data/US_address.csv';
        const data = await readDataFromCSV(csvFilePath);
        const addressData = data[0];

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.clickCreateUser();
        await createUser.verifyCreateUserLabel();
        await createUser.uncheckInheritAddressIfPresent();
        await createUser.uncheckInheritEmergencyContactIfPresent();
        await createUser.uncheckAutoGenerateUsernameIfPresent();
        await createUser.enter("first_name", user1FirstName);
        await createUser.enter("last_name", user1LastName);
        await createUser.enter("username", user1Id);
        await createUser.enter("user-password", "Welcome1@");
        await createUser.enter("email", FakerData.getEmail());
        await createUser.typeAddress("Address 1", FakerData.getAddress());
        await createUser.typeAddress("Address 2", FakerData.getAddress());
        await createUser.select("Country", addressData.country);
        await createUser.select("State/Province", addressData.state);
        await createUser.select("Time Zone", addressData.timezone);
        await createUser.enter("user-city", addressData.city);
        await createUser.enter("user-zipcode", addressData.zipcode);
        await createUser.clickSave();
        console.log(`✅ User 1 created: ${user1Id}`);
    });

    test(`Create second user for organization enrollment`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Create second user` },
            { type: `Test Description`, description: `Create second user to be added to organization` }
        );

        const csvFilePath = './data/US_address.csv';
        const data = await readDataFromCSV(csvFilePath);
        const addressData = data[0];

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.clickCreateUser();
        await createUser.verifyCreateUserLabel();
        await createUser.uncheckInheritAddressIfPresent();
        await createUser.uncheckInheritEmergencyContactIfPresent();
        await createUser.uncheckAutoGenerateUsernameIfPresent();
        await createUser.enter("first_name", user2FirstName);
        await createUser.enter("last_name", user2LastName);
        await createUser.enter("username", user2Id);
        await createUser.enter("user-password", "Welcome1@");
        await createUser.enter("email", FakerData.getEmail());
        await createUser.typeAddress("Address 1", FakerData.getAddress());
        await createUser.typeAddress("Address 2", FakerData.getAddress());
        await createUser.select("Country", addressData.country);
        await createUser.select("State/Province", addressData.state);
        await createUser.select("Time Zone", addressData.timezone);
        await createUser.enter("user-city", addressData.city);
        await createUser.enter("user-zipcode", addressData.zipcode);
        await createUser.clickSave();
        console.log(`✅ User 2 created: ${user2Id}`);
    });

    test(`Create organization and add both users`, async ({ adminHome, organization, CompletionCertification, createCourse, createUser, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Create organization and assign users` },
            { type: `Test Description`, description: `Create organization and add both created users to it` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await organization.organizationMenu();
        await organization.createOrganization();
        await organization.enterName(organizationName);
        await organization.selectOrgType("Internal");
        await organization.typeDescription();
        await organization.clickSave();
        await CompletionCertification.clickProceed();
        await createCourse.verifySuccessMessage();
        console.log(`✅ Organization created: ${organizationName}`);

        // Add User 1 to organization
        console.log(`🔄 Adding User 1 to organization: ${user1Id}`);
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.userSearchField(user1Id);
        await createUser.clickeditUser();
        
        // Search and select organization for user 1
        const orgSearchSelector = "//input[@id='user-organization-filter-field']";
        await page.locator(orgSearchSelector).pressSequentially(organizationName, { delay: 100 });
        await page.waitForTimeout(2000);
        await page.locator(`//div[contains(@id,'user-organization-filter')]//li[contains(text(),'${organizationName}')]`).first().click();
        await page.waitForTimeout(1000);
        await createUser.wait("minWait");
        await createUser.updateUser();
        console.log(`✅ User 1 added to organization: ${user1Id}`);

        // Add User 2 to organization
        console.log(`🔄 Adding User 2 to organization: ${user2Id}`);
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.userSearchField(user2Id);
        await createUser.clickeditUser();
        
        // Search and select organization for user 2
        await page.locator(orgSearchSelector).pressSequentially(organizationName, { delay: 100 });
        await page.waitForTimeout(2000);
        await page.locator(`//div[contains(@id,'user-organization-filter')]//li[contains(text(),'${organizationName}')]`).first().click();
        await page.waitForTimeout(1000);
        await createUser.wait("minWait");
        await createUser.updateUser();
        console.log(`✅ User 2 added to organization: ${user2Id}`);
    });

    test(`Create E-learning course for certification`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Create E-learning course` },
            { type: `Test Description`, description: `Create E-learning course to attach to certification` }
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
            { type: `TestCase`, description: `Create certification` },
            { type: `Test Description`, description: `Create certification and attach E-learning course` }
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
        console.log(`✅ Certification created: ${certificationTitle}`);
    });

    test(`Enroll certification by organization criteria`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Enroll certification by organization criteria` },
            { type: `Test Description`, description: `Navigate to enrollment, select certification, and enroll using organization criteria` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        
        // Select Certification from dropdown
        await enrollHome.selectByOption("Certification");
        console.log(`✅ Selected enrollment type: Certification`);

        // Select the certification
        await enrollHome.selectBycourse(certificationTitle);
        console.log(`✅ Selected certification: ${certificationTitle}`);

        // Click Select Learner button
        await enrollHome.clickSelectedLearner();
        console.log(`✅ Clicked Select Learner button`);

        // Use Enroll By Criteria - Organization
        await enrollHome.wait("minWait");
        
        // Click the first dropdown for "Enroll By Criteria"
        const criteriaDropdowns = await page.locator("//label[text()='Enroll By Criteria']//following::button[contains(@data-id,'enroll-group')]");
        const firstDropdown = criteriaDropdowns.first();
        await firstDropdown.click();
        await enrollHome.wait("minWait");
        
        // Select "By Organization"
        await page.locator("//span[text()='By Organization']").click();
        console.log(`✅ Selected criteria: By Organization`);
        
        await enrollHome.wait("minWait");
        
        // Click the second dropdown to select specific organization
        const secondDropdown = criteriaDropdowns.nth(1);
        await secondDropdown.click();
        await enrollHome.wait("minWait");
        
        // Select the organization
        await page.locator(`//span[text()='${organizationName}']`).click();
        console.log(`✅ Selected organization: ${organizationName}`);
        
        // Click Enroll button
        await enrollHome.clickEnrollBtn();
       // await enrollHome.verifytoastMessage();
        console.log(`✅ Successfully enrolled certification for organization: ${organizationName}`);
    });

    test(`Verify User 1 is enrolled in certification`, async ({ learnerHome, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Verify User 1 enrollment` },
            { type: `Test Description`, description: `Verify that User 1 has the certification enrolled` }
        );

        await learnerHome.basicLogin(user1Id, "LearnerPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.searchCertification(certificationTitle);
        await dashboard.verifyTheEnrolledCertification(certificationTitle);
        console.log(`✅ User 1 (${user1Id}) successfully enrolled in certification: ${certificationTitle}`);
    });

    test(`Verify User 2 is enrolled in certification`, async ({ learnerHome, dashboard }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Verify User 2 enrollment` },
            { type: `Test Description`, description: `Verify that User 2 has the certification enrolled` }
        );

        await learnerHome.basicLogin(user2Id, "LearnerPortal");
        await learnerHome.clickDashboardLink();
        await dashboard.clickLearningPath_And_Certification();
        await dashboard.clickCertificationLink();
        await dashboard.searchCertification(certificationTitle);
        await dashboard.verifyTheEnrolledCertification(certificationTitle);
        console.log(`✅ User 2 (${user2Id}) successfully enrolled in certification: ${certificationTitle}`);
    });
});
