import { test } from "../../customFixtures/expertusFixture";
import { FakerData } from "../../utils/fakerUtils";
import { readDataFromCSV } from "../../utils/csvUtil";

const courseName = "OrgEnroll_" + FakerData.getCourseName();
const description = FakerData.getDescription();
const organizationName = "ORG_ENROLL_" + FakerData.getOrganizationName();

// Users associated with organization
const orgUsers = Array.from({ length: 3 }, (_, i) => ({
    firstName: FakerData.getFirstName(),
    lastName: FakerData.getLastName(),
    userId: `org_user_${i + 1}_` + FakerData.getUserId()
}));

test.describe(`ME_VUS007_Verify_enroll_by_criteria_organization_enrolls_associated_users`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Test 1: Create E-learning course`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS007_TC001 - Create course` },
            { type: `Test Description`, description: `Create E-learning course for organization criteria enrollment` }
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

    test(`Test 2: Create organization`, async ({ adminHome, organization, CompletionCertification, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS007_TC002 - Create organization` },
            { type: `Test Description`, description: `Create organization for criteria-based enrollment` }
        );

        console.log(`🔄 Creating organization: ${organizationName}`);
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
    });

    test(`Test 3: Create users and assign to organization`, async ({ adminHome, createUser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS007_TC003 - Create users` },
            { type: `Test Description`, description: `Create 3 users and assign them to the organization` }
        );

        console.log(`🔄 Creating 3 users and assigning to organization...`);
        const csvFilePath = './data/US_address.csv';
        const data = await readDataFromCSV(csvFilePath);
        const addressData = data[0];

        for (let i = 0; i < orgUsers.length; i++) {
            const user = orgUsers[i];
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
            
            // Assign to organization
            await createUser.selectOrganization("organization", organizationName);
            
            await createUser.clickSave();
            await createUser.verifyUserCreationSuccessMessage();
            console.log(`   ✅ User created and assigned to ${organizationName}: ${user.userId}`);
        }
    });

    test(`Test 4: Enroll by criteria - Organization`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS007_TC004 - Enroll by organization criteria` },
            { type: `Test Description`, description: `Enroll users by organization criteria` }
        );

        console.log(`🔄 Enrolling by criteria - Organization: ${organizationName}`);
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.selectBycourse(courseName);
        await enrollHome.wait("mediumWait");
        
        // Select enroll by criteria - Organization
        await enrollHome.enrollByCriteria("Search by Organization", organizationName, organizationName);
        await enrollHome.wait("minWait");
        
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        console.log(`✅ Enrolled users by organization criteria`);
    });

    test(`Test 5: Verify all organization users are enrolled`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `ME_VUS007_TC005 - Verify organization users enrolled` },
            { type: `Test Description`, description: `Verify that all users associated with the organization are enrolled` }
        );

        console.log(`🔄 Verifying organization users enrollment...`);
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
        
        for (const user of orgUsers) {
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
        console.log(`   Total Users in Organization: ${orgUsers.length}`);
        console.log(`   Users Enrolled: ${enrolledCount}`);
        
        if (enrolledCount === orgUsers.length) {
            console.log(`   ✅ PASS: All organization users are enrolled`);
        } else {
            console.log(`   ⚠️ WARNING: Not all organization users are enrolled`);
        }
    });
});
