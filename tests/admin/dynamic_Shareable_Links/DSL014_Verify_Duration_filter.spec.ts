import { test } from "../../../customFixtures/expertusFixture";

test.describe('DSL014 - Verify Duration filter in Dynamic Shareable Links', () => {

    const domain = "newprod";

    test("DSL014 - Verify Duration filter dropdown values", async ({ adminHome, dynamicShareableLinks }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL014_Verify_duration_dropdown_values' },
            { type: 'Test Description', description: 'Verify whether the following dropdown values are displayed in Duration filter: Short (less than 30mins), Medium (30 minutes to 1 hour), Long (More than 1 hour)' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption(domain);
        
        const expectedDurations = [
            "Short (Less than 30 mins)",
            "Medium (30 mins to 1 hour)",
            "Long (more than 1 hour)"
        ]; //Newprod dataset
        await dynamicShareableLinks.clickDurationDropdown();
        await dynamicShareableLinks.verifyDurationFilterOptions(expectedDurations);
    });

});
