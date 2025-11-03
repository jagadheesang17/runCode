import { test } from "../../../customFixtures/expertusFixture"

test.describe('CC003 - Verify whether by default Published tab is displayed', () => {

    test(`Verify_whether_by_default_Published_tab_is_displayed_when_navigating_to_Completion_Certificate_listing_page`, async ({ adminHome, CompletionCertification }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `Verify_whether_by_default_Published_tab_is_displayed` },
            { type: `Test Description`, description: `Verify whether by default Published tab is displayed when navigating to Completion Certificate listing page` }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCompletionCertification();
        await CompletionCertification.verifyAllTabsAreVisible();
        await CompletionCertification.verifyPublishedTabIsActive();
        await CompletionCertification.verifyInactiveTabsExist();
        const publishedTabText = await CompletionCertification.getPublishedTabText();
        console.log('Successfully verified that Published tab is displayed by default');
        console.log(`Published tab shows: ${publishedTabText}`);
    });

});