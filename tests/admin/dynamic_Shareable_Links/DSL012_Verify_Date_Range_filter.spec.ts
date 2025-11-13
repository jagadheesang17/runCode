import { test } from "../../../customFixtures/expertusFixture";

test.describe('DSL012 - Verify Date Range filter in Dynamic Shareable Links', () => {

    const domain = "newprod";

    test("DSL012a - Verify date range filter is displayed and past dates are disabled", async ({ adminHome, dynamicShareableLinks }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL012a_Verify_date_range_filter_and_past_dates' },
            { type: 'Test Description', description: 'Verify date range filter is displayed and past dates are disabled in From Date section' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption(domain);
        await dynamicShareableLinks.verifyDateRangeFilterDisplayed();
        await dynamicShareableLinks.clickFromDateInput();
        await dynamicShareableLinks.verifyPastDatesDisabled();
    });

    test("DSL012b - Verify To date depends upon From Date", async ({ adminHome, dynamicShareableLinks }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL012b_Verify_to_date_depends_on_from_date' },
            { type: 'Test Description', description: 'Verify whether the To date depends upon the From Date' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption(domain);
        await dynamicShareableLinks.selectFromDate();
        await dynamicShareableLinks.verifyToDateValidation();
    });

    test("DSL012c - Verify date range filter displays for Classroom or Virtual Class", async ({ adminHome, dynamicShareableLinks }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL012c_Verify_date_range_for_classroom_virtual' },
            { type: 'Test Description', description: 'Verify whether the Date range filter is getting displayed when the delivery type is Classroom or Virtual Class' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption(domain);
        await dynamicShareableLinks.selectDeliveryType("Classroom");
        await dynamicShareableLinks.verifyDateRangeFilterDisplayed();
    });

});
