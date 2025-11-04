import { test } from "../../../customFixtures/expertusFixture";

test.describe('DSL003 - Verify Search by Criteria functionality in Dynamic Shareable Links', () => {

    const domain="newprod";
    test("DSL003a - To verify whether the -ALL, Title, Code, Description fields- are displayed in the Search by Criteria", async ({ adminHome, dynamicShareableLinks }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL003a_Verify_search_by_criteria_options' },
            { type: 'Test Description', description: 'Verify that ALL, Title, Code, Description options are displayed in Search by Criteria dropdown' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption(domain);
        
        const searchByOptions = await dynamicShareableLinks.getSearchByOptions();
        const expectedOptions = ['all', 'title', 'code', 'description'];

        await dynamicShareableLinks.validateSearchByOptions(searchByOptions, expectedOptions);

        
        console.log('All expected Search by Criteria options verified successfully');
    });

    test("DSL003b -To verify that the title matching to the entered text is getting displayed when Search by ,", async ({ adminHome, dynamicShareableLinks, page }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL003b_Verify_search_by_different_criteria' },
            { type: 'Test Description', description: 'Verify search functionality for Title, Code, Description, and ALL criteria using key-value pairs' }
        );

        // Key-value pairs for search criteria and terms
        const searchCriteria = {
            "title": "Digital",
            // "code": "Recurring session", 
            "description": "Cron Digital",
            "all": "automation"
        };

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption(domain);
        
        // Perform search by different criteria
        await dynamicShareableLinks.performSearchByCriteria(searchCriteria);
    });

    test("DSL003c - Verify autocomplete functionality", async ({ adminHome, dynamicShareableLinks, page }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL003c_Verify_autocomplete_functionality' },
            { type: 'Test Description', description: 'Verify that autocomplete dropdown appears when entering three letters in Search textbox' }
        );

        // 3-letter search criteria for autocomplete testing
        const searchCriteria = {
            "title": "Dig",
            // "code": "Rec", 
            "description": "Cro",
            "all": "aut"
        };

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption("newprod");
        
        // Loop through each search criteria for autocomplete testing
        for (const [searchBy, searchTerm] of Object.entries(searchCriteria)) {
            if (!searchTerm) {
                console.log(`⏭️ Skipping ${searchBy} - no search term provided`);
                continue;
            }
            
            console.log(`\n🔍 Testing Autocomplete for: ${searchBy} with term: "${searchTerm}"`);
            
            await dynamicShareableLinks.selectSearchByOption(searchBy);
            await dynamicShareableLinks.wait('minWait');
            
            await dynamicShareableLinks.enterSearchText(searchTerm);
            await dynamicShareableLinks.wait('mediumWait');
            
            // Verify search results are displayed using XPath
            const resultXPath = "//div[contains(@id,'dsl_search-lms-scroll-results')]//li";
            const resultElements = await page.locator(`xpath=${resultXPath}`).all();
            
            if (resultElements.length === 0) {
                throw new Error(`❌ No autocomplete results found for ${searchBy}: "${searchTerm}"`);
            }
            
            console.log(`✅ Autocomplete results visible for '${searchBy}' (${searchTerm}): ${resultElements.length} result(s) found`);
            
            await dynamicShareableLinks.clickClearButton();
            await dynamicShareableLinks.wait('minWait');
        }
        
        console.log('\n✅ All autocomplete functionality verified successfully with results displayed');
    });

    test("DSL003d - Verify autocomplete is not displayed for non-matching search text", async ({ adminHome, dynamicShareableLinks, page }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'DSL003d_Verify_autocomplete_not_displayed_for_non_matching_text' },
            { type: 'Test Description', description: 'Verify that autocomplete dropdown is NOT displayed when entered text does not match any records' }
        );

        // Non-matching search criteria (text that won't have results)
        const nonMatchingSearchCriteria = {
            "title": "XyZ",
            "code": "ZZZ", 
            "description": "z1234",
            "all": "1zzz"
        };

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.dynamicShareableLinks();
        await dynamicShareableLinks.selectDomainOption("newprod");
        
        for (const [searchBy, searchTerm] of Object.entries(nonMatchingSearchCriteria)) {
            if (!searchTerm) {
                console.log(`⏭️ Skipping ${searchBy} - no search term provided`);
                continue;
            }
            
            console.log(`\n🔍 Testing Non-matching Autocomplete for: ${searchBy} with term: "${searchTerm}"`);
            
            await dynamicShareableLinks.selectSearchByOption(searchBy);
            await dynamicShareableLinks.wait('minWait');
            
            await dynamicShareableLinks.enterSearchText(searchTerm);
            await dynamicShareableLinks.wait('mediumWait');

            const resultXPath = "//div[contains(@id,'dsl_search-lms-scroll-results')]//li";
            const resultElements = await page.locator(`xpath=${resultXPath}`).all();
            
            if (resultElements.length > 0) {
                throw new Error(`Unexpected autocomplete results found for non-matching ${searchBy}: "${searchTerm}" - Found ${resultElements.length} result(s)`);
            }
            
            console.log(`✅ No autocomplete results displayed for non-matching '${searchBy}' (${searchTerm}): Correctly handled`);
            
            await dynamicShareableLinks.clickClearButton();
            await dynamicShareableLinks.wait('minWait');
        }
        
        console.log('\n✅ All non-matching search criteria verified - Autocomplete NOT displayed for non-matching text');
    });

});
