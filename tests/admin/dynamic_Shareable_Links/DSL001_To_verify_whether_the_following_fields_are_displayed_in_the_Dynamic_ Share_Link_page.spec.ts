import { test } from "../../../customFixtures/expertusFixture"

test.describe('DSL001 - Verify Dynamic Shareable Links page elements', () => {
   const elementsToVerify = [
        'Search By',
        'Search',
        'Category',
        'Training Type',
        'Delivery Type',
        'Duration',
        'Manager Approval',
        'Tags',
        'Language',
        'Country',
        'Location',
        'Rating',
        'Price',
        'CEU Provider',
        'Skills',
        'Paid',
        'Free',
        'From',
        'To',
        'Clear',
        'Generate URL',
    ];



test("DSL001 - Verify all fields are displayed in Dynamic Share Link page", async ({ adminHome, dynamicShareableLinks }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL001_Verify_all_fields_displayed_in_DSL_page' },
            { type: 'Test Description', description: 'Verify all required fields are displayed in the Dynamic Share Link page' }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.verifyElements(['Domain']);
        await dynamicShareableLinks.selectDomainOption("newprod");
        await dynamicShareableLinks.verifyElements(elementsToVerify);
        console.log('*** DSL001: All elements verified successfully');
    });

});