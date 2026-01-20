import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';
import { credentials } from "../../../constants/credentialData";
import { createILTMultiInstance } from "../../../api/apiTestIntegration/courseCreation/createCourseAPI";

const courseName = FakerData.getCourseName();
let instanceNames: string[] = [];

test.describe.serial(`TECRS29 - Verify that instances which has no enrollments should not get listed in the FROM list`, async () => {

    test(`Create course with 3 ILT instances using API`, async ({ }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS29 - Step 1: Create Course with 3 ILT Instances` },
            { type: `Test Description`, description: `Create ILT course with 3 instances using API` }
        );

        // Create 3 instances - only 1st will have enrollment
        instanceNames = await createILTMultiInstance(courseName, "published", 3, "future");
        
        console.log(`✅ Course created with 3 ILT instances: ${instanceNames.join(', ')}`);
    });

    test(`Enroll learner only in first instance`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS29 - Step 2: Enroll Learner in First Instance Only` },
            { type: `Test Description`, description: `Enroll learner in first instance only (2nd and 3rd instances will have no enrollments)` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");
        
        await enrollHome.selectBycourse(instanceNames[0]);
        await enrollHome.clickSelectedLearner();
        await enrollHome.enterSearchUser(credentials.LEARNERUSERNAME.username);
        await enrollHome.clickEnrollBtn();
        await enrollHome.verifytoastMessage();
        
        console.log(`✅ Learner enrolled only in first instance: ${instanceNames[0]}`);
        console.log(`   Instance 2 (${instanceNames[1]}) and Instance 3 (${instanceNames[2]}) have NO enrollments`);
    });

    test(`Verify instances with no enrollments are NOT listed in FROM dropdown`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Divya` },
            { type: `TestCase`, description: `TECRS29 - Step 3: Verify Empty Instances Not in FROM List` },
            { type: `Test Description`, description: `Verify that instances with no enrollments do not appear in the FROM dropdown list` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickEnrollmentMenu();
        await adminHome.clickEnroll();
        await enrollHome.wait("mediumWait");
        
        await enrollHome.selectEnrollmentOption("Transfer Enrollment - Course");
        await enrollHome.searchCourseForTransfer(courseName);
        await enrollHome.clearFilterCrossMarks();
        
        await enrollHome.selectSourceInstance(instanceNames[1]);

    });

});
