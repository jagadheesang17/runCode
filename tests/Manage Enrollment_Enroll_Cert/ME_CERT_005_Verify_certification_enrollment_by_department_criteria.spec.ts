import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
import { readDataFromCSV } from "../../utils/csvUtil";

const user1FirstName = FakerData.getFirstName();
const user1LastName = FakerData.getLastName();
const user1Id = FakerData.getUserId();

const user2FirstName = FakerData.getFirstName();
const user2LastName = FakerData.getLastName();
const user2Id = FakerData.getUserId();

const certificationTitle = FakerData.getCourseName();
const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
let departmentName: string;

test.describe(`Verify certification enrollment by department criteria`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Create first user with department`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Create first user with department` },
            { type: `Test Description`, description: `Create first user to be assigned to department` }
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
        
        // Select department and store the value
        departmentName = await createUser.selectDepartmentType("department");
        console.log(`✅ User 1 created with department: ${departmentName}`);
        
        await createUser.clickSave();
        console.log(`✅ User 1 created: ${user1Id}`);
    });

    test(`Create second user with same department`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Create second user with same department` },
            { type: `Test Description`, description: `Create second user to be assigned to the same department` }
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

    test(`Assign same department to second user`, async ({ adminHome, createUser, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Assign department to second user` },
            { type: `Test Description`, description: `Edit second user and assign the same department as first user` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.people();
        await adminHome.user();
        await createUser.userSearchField(user2Id);
        await createUser.clickeditUser();
        
        // Select department for user 2 using department filter field
        const deptSearchSelector = "//label[text()='department']/following::div[@id='user-department']//input";
        await page.locator(deptSearchSelector).pressSequentially(departmentName, { delay: 100 });
        await page.waitForTimeout(2000);
        await page.locator(`(//div[@id='user-department-filter-lms-scroll-results']//li)[1]`).click();
        await page.waitForTimeout(1000);
        await createUser.wait("minWait");
        await createUser.updateUser();
        console.log(`✅ User 2 assigned to department: ${departmentName}`);
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

    test(`Enroll certification by department criteria`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `Enroll certification by department criteria` },
            { type: `Test Description`, description: `Navigate to enrollment, select certification, and enroll using department criteria` }
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

        // Use Enroll By Criteria - Department
        await enrollHome.wait("minWait");
        
        // Click the first dropdown for "Enroll By Criteria"
        const criteriaDropdowns = await page.locator("//label[text()='Enroll By Criteria']//following::button[contains(@data-id,'enroll-group')]");
        const firstDropdown = criteriaDropdowns.first();
        await firstDropdown.click();
        await enrollHome.wait("minWait");
        
        // Select "By Department"
        await page.locator("//span[text()='By Department']").click();
        console.log(`✅ Selected criteria: By Department`);
        
        await enrollHome.wait("minWait");
        
        // Click the second dropdown to select specific department
        const secondDropdown = criteriaDropdowns.nth(1);
        await secondDropdown.click();
        await enrollHome.wait("minWait");
        
        // Select the department
        await page.locator(`//span[text()='${departmentName}']`).click();
        console.log(`✅ Selected department: ${departmentName}`);
        
        // Click Enroll button
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        console.log(`✅ Successfully enrolled certification for department: ${departmentName}`);
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
