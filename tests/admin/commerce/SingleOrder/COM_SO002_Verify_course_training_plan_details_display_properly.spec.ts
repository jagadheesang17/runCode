import { test } from "../../../../customFixtures/expertusFixture";
import { FakerData } from "../../../../utils/fakerUtils";
import { credentials } from "../../../../constants/credentialData";
import { createILTMultiInstance } from "../../../../api/apiTestIntegration/courseCreation/createCourseAPI";

const courseName = FakerData.getCourseName();


test.describe(`SO002_Verify_course_training_plan_details_display_properly`, () => {
    test.describe.configure({ mode: "serial" });
    test(`Test 1: Verify course details display properly in single order`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Jagadish` },
            { type: `TestCase`, description: `SO002_TC002 - Verify course/training plan details , Verifying Filter Tab & Clear section button` },
            { type: `Test Description`, description: `Verify delivery type icons, title, code, language, enrollments, seats, date, location, price, checkbox` }
        );
        const price = "200";
        const currency = "usd";
        console.log(`🔄 Creating ILT course with pricing...`);
        const instanceNames = await createILTMultiInstance(courseName, "published", 2, "future","50", price, currency);
        console.log(`✅ ILT course created: ${instanceNames[0]}`);

        await adminHome.loadAndLogin("CUSTOMERADMIN")
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickCreateOrder();
        await enrollHome.filterBy();
        await enrollHome.validateLoadMoreButton();
        await enrollHome.clearFilters();
        await enrollHome.selectBycourse(instanceNames[0],"paid");  
        await enrollHome.verifyDeliveryTypeIcons(instanceNames[0], price,currency);
        await enrollHome.clickClearSectionButton();
        await enrollHome.verifyCoursesAre("NotSelected");
    });
});
