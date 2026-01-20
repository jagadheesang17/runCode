import { test } from '../../../customFixtures/expertusFixture';
import { expect } from '@playwright/test';
import { generateOauthToken } from '../../../api/accessToken';
import { userCreation } from '../../../api/userAPI';
import { userCreationData } from '../../../data/apiData/formData';
import { FakerData } from '../../../utils/fakerUtils';
// TODO: Import your page objects here, e.g.:
// import { AdminHomePage } from '../../../pages/AdminHomePage';
// import { EnrollHomePage } from '../../../pages/EnrollHomePage';
        const courseName = `Commerce Order Course - ${FakerData.getCourseName()}`;

const user1Username = `api_user_1_${Date.now()}`;
const user2Username = `api_user_2_${Date.now()}`;
const user3Username = `api_user_3_${Date.now()}`;

test.describe('Commerce Multiple Order - Setup', () => {
	test('Create 3 users via API and store usernames', async () => {
		const accessToken = await generateOauthToken();
		const authorization = { Authorization: accessToken };

        const userId1 = await userCreation(userCreationData(user1Username), authorization);
        expect(userId1).toBeTruthy();
        console.log("Created User 1:", { id: userId1, username: user1Username });

        const userId2 = await userCreation(userCreationData(user2Username), authorization);
        expect(userId2).toBeTruthy();
        console.log("Created User 2:", { id: userId2, username: user2Username });

        const userId3 = await userCreation(userCreationData(user3Username), authorization);
        expect(userId3).toBeTruthy();
        console.log("Created User 3:", { id: userId3, username: user3Username });

	});

    test('Create an E-Learning course for ordering', async ({ adminHome, createCourse, learningPath }) => {
        const description = FakerData.getDescription();

        test.info().annotations.push(
            { type: 'Author', description: 'QA Automation Team' },
            { type: 'TestCase', description: 'CMO_Course_Creation' },
            { type: 'Test Description', description: 'Create a simple E-Learning course to use in multiple order flow' }
        );

        await adminHome.loadAndLogin('CUSTOMERADMIN');
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCourseLink();
        await createCourse.clickCreateCourse();

        await createCourse.verifyCreateUserLabel('CREATE COURSE');
        await createCourse.enter('course-title', courseName);
        await createCourse.selectLanguage('English');
        await createCourse.typeDescription('Commerce flow course: ' + description);

        // Set price and currency to make this a paid course
        await createCourse.enterPrice('100');
        await createCourse.selectCurrency();

        // Attach content and set catalog visibility
        await createCourse.contentLibrary();
        await createCourse.clickCatalog();

        await createCourse.clickSave();
        await createCourse.clickProceed();
        await createCourse.verifySuccessMessage();

        console.log('Created course for multi-order:', courseName);
    });

      test('multiple order', async ({ adminHome, enrollHome,costCenter, page }) => {
    test.info().annotations.push(
        { type: `Author`, description: `QA Automation Team` },
        { type: `TestCase`, description: `CMO_Multiple_Order_Setup` },
        { type: `Test Description`, description: `Setup multiple order with 3 users` }
    );
    await adminHome.loadAndLogin("CUSTOMERADMIN");
    // Admin enrolls learner to the course
    await adminHome.menuButton();
    await adminHome.clickEnrollmentMenu();
    console.log("Navigated to Enrollment Menu");
    await enrollHome.clickEnroll();
    await enrollHome.selectEnrollmentOption("Create Order"); 
    await enrollHome.clickOnMultipleLearner();
    await enrollHome.searchUser(courseName) 
    await enrollHome.clickOnfirstCheckboxInEnrollmenPage();
    await enrollHome.clickSelectedLearner()
     var i=1
    for (const username of [user1Username, user2Username, user3Username]) {
       
        await enrollHome.searchUser(username);
        await enrollHome.clickLearnerchkboxByIndex(i);
        console.log(`Selected user: ${username}`);
        i++;
      }

      await enrollHome.checkout();
      console.log("Completed multiple order setup for 3 users.");

await enrollHome.selectDomainForCheckout("automationtenant");
await costCenter.billingDetails("United States", "Alaska")

await costCenter.calculateTax();
await costCenter.orderApproval();


      });
      
//export { user1Username, user2Username, user3Username };

    });
