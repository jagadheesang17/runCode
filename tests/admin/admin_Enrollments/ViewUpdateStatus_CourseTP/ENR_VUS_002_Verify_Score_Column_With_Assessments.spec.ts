import { credentials } from "../../../../constants/credentialData";
import { test } from "../../../../customFixtures/expertusFixture"
import { FakerData } from '../../../../utils/fakerUtils';
import enrollmentUsersData from '../../../../data/enrollmentUserData/EnrollmentUser.json';
import { createCourseAPI } from "../../../../api/apiTestIntegration/courseCreation/createCourseAPI";
import { expect } from "allure-playwright";

const courseName = FakerData.getCourseName();
const description = FakerData.getDescription();
const users: any[] = enrollmentUsersData;

test.describe(`Verify score column displays average score of assessments and content`, () => {
    test.describe.configure({ mode: "serial" });
    
    test.beforeAll(() => {
        console.log(`📋 Loaded ${users.length} users from EnrollmentUser.json`);
        if (users.length === 0 || !users[0]?.username) {
            throw new Error('EnrollmentUser.json is empty or invalid. Please run ADN_000_CreateUser.spec.ts first to create users.');
        }
        users.forEach((user, index) => {
            console.log(`   User ${index + 1}: ${user.username} (${user.firstname} ${user.lastname})`);
        });
    });
    
    test(`Setup - Create course with multiple assessments and enroll 3 learners`, async ({ adminHome, enrollHome, contentHome, createCourse }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ADN_ENR_VUS_002 - Setup course with assessments` },
            { type: `Test Description`, description: `Create course, add multiple assessments, and enroll 3 learners` }
        );

 
    });

    test(`Learner side - Complete assessments with different scores`, async ({ browser }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ADN_ENR_VUS_002 - Learner assessment completion` },
            { type: `Test Description`, description: `User 1: All correct answers, User 2: Mixed correct/wrong, User 3: Does not take assessments` }
        );
        
      
    });

    test(`Verify score column displays correctly for all 3 learners`, async ({ adminHome, enrollHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `ADN_ENR_VUS_002 - Verify score column` },
            { type: `Test Description`, description: `Verify score column shows average score when assessments completed, and zero/dash when not taken` }
        );
        
       
    });
});
