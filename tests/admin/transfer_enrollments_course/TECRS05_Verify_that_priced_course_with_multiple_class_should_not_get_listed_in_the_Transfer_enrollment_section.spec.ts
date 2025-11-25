import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";

const pricedCourseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const instructorName = credentials.INSTRUCTORNAME.username;
const price = FakerData.getPrice();
let instance1Name: string;
let instance2Name: string;

test.describe.serial(`TECRS05 - Verify priced course with multiple classes not listed in Transfer Enrollment`, async () => {

    test(`Create priced multi-instance course with two ILT instances`, async ({ adminHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS05 - Step 1: Create Priced Multi-Instance Course` },
            { type: `Test Description`, description: `Create a priced course with two ILT instances` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();
        await createCourse.verifyCreateUserLabel("CREATE COURSE");
        await createCourse.enter("course-title", pricedCourseName);
        await createCourse.selectLanguage("English");
        await createCourse.typeDescription(description);
        await createCourse.selectdeliveryType("Classroom");
        await createCourse.handleCategoryADropdown();
        await createCourse.providerDropdown();
        await createCourse.selectTotalDuration();
        await createCourse.typeAdditionalInfo();
        
        // Set price for the course
        await createCourse.enterPrice(price);
        await createCourse.selectCurrency();
        
        await createCourse.clickCatalog();
        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.clickEditCourseTabs();
        
        // Add first ILT instance
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        instance1Name = FakerData.getSession();
        await createCourse.enterSessionName(instance1Name);
        await createCourse.setMaxSeat();
        await createCourse.enterDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
        await createCourse.clickEditCourseTabs();
        await createCourse.clicLickToSwitchCrsPage();
        await createCourse.wait("mediumWait");
        
        // Add second ILT instance
        await createCourse.addInstances();
        await createCourse.selectInstanceDeliveryType("Classroom");
        await createCourse.clickCreateInstance();
        instance2Name = FakerData.getSession();
        await createCourse.enterSessionName(instance2Name);
        await createCourse.setMaxSeat();
        await createCourse.enterDateValue();
        await createCourse.startandEndTime();
        await createCourse.selectInstructor(instructorName);
        await createCourse.selectLocation();
        await createCourse.wait("mediumWait");
        
        await createCourse.clickCatalog();
        await createCourse.clickUpdate();
        await createCourse.verifySuccessMessage();
    });


    test(`Verify priced multi-instance course is NOT listed in Transfer Enrollment section`, async ({ adminHome, enrollHome, page }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS05 - Step 3: Verify Course Not Listed` },
            { type: `Test Description`, description: `Verify that priced course with multiple instances does not appear in Transfer Enrollment section` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await enrollHome.wait("mediumWait");
        
        // Click Transfer Enrollment - Course option
        await enrollHome.clickTransferEnrollmentOption();
        
        // Search for the priced course using existing method
        await enrollHome.wait("minWait");
        await page.locator(`//input[contains(@id,'enrtfr-search-selecttraining-field') or @placeholder='Search']`).fill(pricedCourseName);
        await page.keyboard.press('Enter');
        await enrollHome.wait("mediumWait");
        
        // Verify course is NOT in the results
        const courseResult = page.locator(`//span[contains(text(),'${pricedCourseName}')] | //td[contains(text(),'${pricedCourseName}')] | //div[contains(text(),'${pricedCourseName}')]`);
        const isVisible = await courseResult.isVisible().catch(() => false);
        
        if (!isVisible) {
            console.log(`✅ Priced multi-instance course '${pricedCourseName}' is NOT listed in Transfer Enrollment (as expected)`);
        } else {
            throw new Error(`❌ Priced multi-instance course '${pricedCourseName}' is listed in Transfer Enrollment but should not be`);
        }
    });

});
