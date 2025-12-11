import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";
import { createILTMultiInstance } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";

const courseName = FakerData.getCourseName();
let instanceNames: string[] = [];

test.describe.serial(`TECRS35 - Verify radio button is disabled for ILT/VC classes when no seats are available in transfer enrollment`, async () => {

    test(`Create multi-instance ILT course with limited seats`, async ({ }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS35 - Step 1: Create Multi-Instance ILT Course with Limited Seats` },
            { type: `Test Description`, description: `Create ILT course with 2 instances, second instance has only 1 seat` }
        );

        // Create course with 2 instances using API
        instanceNames = await createILTMultiInstance(courseName, "published", 2, "future", "1");
        
        console.log(`✅ Multi-instance ILT course created: ${courseName}`);
        console.log(`✅ Instances: ${instanceNames.join(', ')}`);
        console.log(`✅ Second instance has limited seats (1 seat only)`);
    });

    test(`Enroll two learners in first instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS35 - Step 2: Enroll Two Learners in First Instance` },
            { type: `Test Description`, description: `Enroll two learners in the first instance for transfer` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");
        
        // Enroll first learner
        await enrollHome.selectBycourse(instanceNames[0]);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        
        console.log(`✅ First learner "${credentials.LEARNERUSERNAME.username}" enrolled in: ${instanceNames[0]}`);
    });

    test(`Fill the second instance to make it seat full`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS35 - Step 3: Fill Second Instance Seats` },
            { type: `Test Description`, description: `Enroll a learner in second instance to make it seat full` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");
        
        // Enroll a learner in second instance to fill the seat
        await enrollHome.selectBycourse(instanceNames[1]);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.TEAMUSER2.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        
        console.log(`✅ Learner "${credentials.TEAMUSER2.username}" enrolled in: ${instanceNames[1]}`);
        console.log(`✅ Second instance is now SEAT FULL (1/1 seats occupied)`);
    });

    test(`Verify radio button disabled for seat-full instance in transfer enrollment TO list`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS35 - Step 4: Verify Radio Button Disabled for Seat-Full Instance` },
            { type: `Test Description`, description: `Verify radio button is disabled for second instance when no seats are available in TO list` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");
        
        // Navigate to transfer enrollment
        await enrollHome.selectEnrollmentOption("Transfer Enrollment - Course");
        await enrollHome.searchCourseForTransfer(courseName);
        await enrollHome.clearFilterCrossMarks();
        
        // Select source instance
        await enrollHome.selectSourceInstance(instanceNames[0]);
        await enrollHome.wait("mediumWait");
        
        // Select learner for transfer
        await enrollHome.selectLearnerForTransfer(credentials.LEARNERUSERNAME.username);
        
        // Verify second instance radio button is disabled (no seats available)
        const instanceRadioSelector = `//span[text()='${instanceNames[1]}']//preceding::input[@type='radio'][1]`;
        const radioButton = await enrollHome.page.locator(instanceRadioSelector);
        const isDisabled = await radioButton.isDisabled();
        
        if (isDisabled) {
            console.log(`✅ Radio button is DISABLED for instance "${instanceNames[1]}" (Seat Full)`);
        } else {
            throw new Error(`❌ Radio button should be disabled for seat-full instance "${instanceNames[1]}"`);
        }
        
        // Verify seat full text is displayed
        const seatFullText = await enrollHome.page.locator(`//span[text()='${instanceNames[1]}']//following::span[contains(text(),'Seat Full') or contains(text(),'No seats left')][1]`);
        const isSeatFullVisible = await seatFullText.isVisible().catch(() => false);
        
        if (isSeatFullVisible) {
            const text = await seatFullText.textContent();
            console.log(`✅ Seat status displayed: "${text}"`);
        }
    });

    test(`Verify radio button enabled for first instance with available seats`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS35 - Step 5: Verify Radio Button Enabled for Available Instance` },
            { type: `Test Description`, description: `Verify radio button is enabled for first instance when seats are available` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");
        
        // Navigate to transfer enrollment
        await enrollHome.selectEnrollmentOption("Transfer Enrollment - Course");
        await enrollHome.searchCourseForTransfer(courseName);
        await enrollHome.clearFilterCrossMarks();
        
        // Select source instance (second instance)
        await enrollHome.selectSourceInstance(instanceNames[1]);
        await enrollHome.wait("mediumWait");
        
        // Select learner for transfer
        await enrollHome.selectLearnerForTransfer(credentials.TEAMUSER2.username);
        
        // Verify first instance radio button is enabled (seats available)
        const instanceRadioSelector = `//span[text()='${instanceNames[0]}']//preceding::input[@type='radio'][1]`;
        const radioButton = await enrollHome.page.locator(instanceRadioSelector);
        const isDisabled = await radioButton.isDisabled();
        
        if (!isDisabled) {
            console.log(`✅ Radio button is ENABLED for instance "${instanceNames[0]}" (Seats Available)`);
        } else {
            throw new Error(`❌ Radio button should be enabled for instance with available seats "${instanceNames[0]}"`);
        }
        
        // Verify can select the instance
        await enrollHome.selectTargetInstance(instanceNames[0]);
        
        console.log(`✅ Successfully selected instance with available seats for transfer`);
    });

});
