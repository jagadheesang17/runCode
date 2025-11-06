import { test } from "../../../customFixtures/expertusFixture";

test.describe('DSL010 - Verify Rating filter in Dynamic Shareable Links', () => {

    const domain = "newprod";

    test("DSL010a - Verify rating filter displays and filters trainings correctly", async ({ adminHome, dynamicShareableLinks }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL010a_Verify_rating_filter_functionality' },
            { type: 'Test Description', description: 'Verify rating is displayed and trainings with selected rating are listed after URL is pasted' }
        );

        // Admin Login and Navigation
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption(domain);
        await dynamicShareableLinks.verifyRatingDisplayed();
        await dynamicShareableLinks.selectRating("4");
        const generatedURL = await dynamicShareableLinks.clickGenerateURL;
        // await dynamicShareableLinks.openGeneratedURL(generatedURL);
        await dynamicShareableLinks.verifyTrainingsWithSelectedRating("4");
    });

    test("DSL010b - Verify admin can share URL when rating is disabled", async ({ adminHome, dynamicShareableLinks }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL010b_Verify_share_url_when_rating_disabled' },
            { type: 'Test Description', description: 'Verify whether the admin can share the URL even when the rating is disabled' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption(domain);
        await dynamicShareableLinks.verifyURLGeneratedWhenRatingDisabled();
    });

});
