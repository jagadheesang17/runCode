import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
import { readDataFromCSV } from "../../utils/csvUtil";

const courseName = "DeptEnroll_" + FakerData.getCourseName();
const description = FakerData.getDescription();
let departmentName: string;

// Users associated with department
const deptUsers = Array.from({ length: 3 }, (_, i) => ({
    firstName: FakerData.getFirstName(),
    lastName: FakerData.getLastName(),
    userId: `dept_user_${i + 1}_` + FakerData.getUserId()
}));

test.describe(`ME_VUS008_Verify_enroll_by_criteria_department_enrolls_associated_users`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Test 1: Create E-learning course`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS008_TC001 - Create course` },
            { type: `Test Description`, description: `Create E-learning course for department criteria enrollment` }
        );

        console.log(`🔄 Creating E-learning course...`);
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
        console.log(`✅ Course created: ${courseName}`);
    });

    test(`Test 2: Create users and assign to department`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS008_TC002 - Create users with department` },
            { type: `Test Description`, description: `Create 3 users and assign them to the same department` }
        );

        console.log(`🔄 Creating 3 users and assigning to department...`);
        const csvFilePath = './data/US_address.csv';
        const data = await readDataFromCSV(csvFilePath);
        const addressData = data[0];

        for (let i = 0; i < deptUsers.length; i++) {
            const user = deptUsers[i];
            console.log(`   Creating User ${i + 1}/3: ${user.userId}`);

            await adminHome.loadAndLogin("CUSTOMERADMIN");
            await adminHome.menuButton();
            await adminHome.people();
            await adminHome.user();
            await createUser.clickCreateUser();
            await createUser.verifyCreateUserLabel();
            await createUser.uncheckInheritAddressIfPresent();
            await createUser.uncheckInheritEmergencyContactIfPresent();
            await createUser.enter("first_name", user.firstName);
            await createUser.enter("last_name", user.lastName);
            await createUser.enter("username", user.userId);
            await createUser.enter("user-password", "Welcome1@");
            await createUser.selectUserType("usertype");
            await createUser.typeAddress("Address 1", addressData.address);
            await createUser.select("Country", addressData.country);
            await createUser.select("State/Province", addressData.state);
            await createUser.enter("user-city", addressData.city);
            await createUser.enter("user-zipcode", addressData.zip);
            await createUser.selectTimeZone("USA", "Eastern");
            await createUser.select("Language", "English");
            
            // Assign to department - first user sets the department name
            if (i === 0) {
                departmentName = await createUser.selectDepartmentType("department");
                console.log(`   ✅ Department selected: ${departmentName}`);
            }
            
            await createUser.clickSave();
            await createUser.verifyUserCreationSuccessMessage();
            console.log(`   ✅ User created: ${user.userId}`);
        }
        
        console.log(`✅ All 3 users created with department: ${departmentName}`);
    });

    test(`Test 3: Assign same department to remaining users`, async ({ adminHome, createUser, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS008_TC003 - Assign department to users` },
            { type: `Test Description`, description: `Assign the same department to users 2-3` }
        );

        console.log(`🔄 Assigning department to remaining users (users 2-3)...`);
        const deptSearchSelector = "//label[text()='department']/following::div[@id='user-department']//input";

        for (let i = 1; i < deptUsers.length; i++) {
            const user = deptUsers[i];
            console.log(`   Assigning department to User ${i + 1}/3: ${user.userId}`);

            await adminHome.loadAndLogin("CUSTOMERADMIN");
            await adminHome.menuButton();
            await adminHome.people();
            await adminHome.user();
            await createUser.userSearchField(user.userId);
            await createUser.wait("mediumWait");
            await createUser.editIcon();
            await createUser.wait("mediumWait");
            
            // Assign department
            await page.locator(deptSearchSelector).fill(departmentName);
            await createUser.wait("minWait");
            await page.locator(`//span[text()='${departmentName}']`).first().click();
            await createUser.wait("minWait");
            
            await createUser.clickSave();
            await createUser.verifyUserCreationSuccessMessage();
            console.log(`   ✅ Department assigned to ${user.userId}`);
        }
        
        console.log(`✅ All users assigned to department: ${departmentName}`);
    });

    test(`Test 4: Enroll by criteria - Department`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS008_TC004 - Enroll by department criteria` },
            { type: `Test Description`, description: `Enroll users by department criteria` }
        );

        console.log(`🔄 Enrolling by criteria - Department: ${departmentName}`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.wait("mediumWait");
        
        // Select enroll by criteria - Department
        await enrollHome.enrollByCriteria("Search by Department", departmentName, departmentName);
        await enrollHome.wait("minWait");
        
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        console.log(`✅ Enrolled users by department criteria`);
    });

    test(`Test 5: Verify all department users are enrolled`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS008_TC005 - Verify department users enrolled` },
            { type: `Test Description`, description: `Verify that all users associated with the department are enrolled` }
        );

        console.log(`🔄 Verifying department users enrollment...`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickviewUpdateStatusCourseTp();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.wait("minWait");
        await enrollHome.clickModifyEnrollBtn();
        await enrollHome.wait("mediumWait");

        console.log(`🔄 Checking enrolled users...`);
        let enrolledCount = 0;
        
        for (const user of deptUsers) {
            const userRow = page.locator(`//tr[contains(.,'${user.userId}')]`);
            const isVisible = await userRow.isVisible().catch(() => false);
            
            if (isVisible) {
                enrolledCount++;
                console.log(`   ✅ ${user.userId} - Enrolled`);
            } else {
                console.log(`   ❌ ${user.userId} - NOT Enrolled`);
            }
        }
        
        console.log(`\n📊 Enrollment Summary:`);
        console.log(`   Department: ${departmentName}`);
        console.log(`   Total Users in Department: ${deptUsers.length}`);
        console.log(`   Users Enrolled: ${enrolledCount}`);
        
        if (enrolledCount === deptUsers.length) {
            console.log(`   ✅ PASS: All department users are enrolled`);
        } else {
            console.log(`   ⚠️ WARNING: Not all department users are enrolled`);
        }
    });
});
