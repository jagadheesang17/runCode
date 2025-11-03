import { test } from '../../customFixtures/expertusFixture';
import { FakerData } from '../../utils/fakerUtils';
import * as testData from '../../data/MetadataLibraryData/testData.json';

test(`Verify that the admin able to access the Learner Group Create/Edit option from Quick Access`, async ({ adminHome, learnerGroup }) => {
    test.info().annotations.push(
        { type: `Author`, description: `Jagadish` },
        { type: `TestCase`, description: `QA001 - Learner Group Quick Access Navigation and Creation` },
        { type: `Test Description`, description: `Verify admin can access Learner Group Create option via Quick Access and successfully create a learner group` }
    );

    const groupTitle = FakerData.getFirstName() + "_QuickAccessGroup";

        try {
            await adminHome.loadAndLogin("CUSTOMERADMIN");
            console.log('Successfully logged in as Customer Admin');

            await learnerGroup.navigateToLearnerGroupQuickAccess();
            console.log('Successfully navigated to Learner Group creation via Quick Access');

            console.log('Navigated to Create Learner Group page');

            await learnerGroup.enterGroupTitle(groupTitle);
            console.log(`Entered group title: ${groupTitle}`);

            await learnerGroup.selectDepartment(testData.department);
            console.log(`Selected department: ${testData.department}`);

            await learnerGroup.clickActivateToggle();
            console.log('Activated the learner group');

            await learnerGroup.clickSaveButton();
            console.log('Clicked Save button');

            await learnerGroup.confirmGroupCreation();
            console.log('Confirmed group creation');

            await learnerGroup.clickProceedButton();
            console.log('Clicked Proceed button');

            await learnerGroup.clickGoToListing();
            console.log('Navigated to listing page');

            await learnerGroup.searchGroup(groupTitle);
            console.log(`Searched and found the created group: ${groupTitle}`);

            console.log('Successfully completed learner group creation via Quick Access');

    } catch (error) {
        console.error(`Test failed at step: ${error.message}`);
        throw error;
    }
});