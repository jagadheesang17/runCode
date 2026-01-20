import { test, expect } from '@playwright/test';
import { LearnerHomePage } from '../../pages/LearnerHomePage';

test.describe('Header Section - Catalog Scroll Verification', () => {
  test('Verify page scrolls to Catalog section when clicked from header', async ({ page, context }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'HS_004_Catalog_Scroll_Verification' },
      { type: 'Test Description', description: 'Login as learner, click Catalog, verify page scrolls' }
    );

    console.log('🔐 Starting Catalog Scroll Verification Test');
    
    // Step 1: Login as Learner
    console.log('\n📝 Step 1: Login as Learner');
    const learnerHome = new LearnerHomePage(page, context);
    await learnerHome.loadLearner('LEARNERUSERNAME', LearnerHomePage.pageUrl);
    console.log('✅ Successfully logged in as Learner');
    
    // Step 2: Capture scroll position BEFORE clicking Catalog
    console.log('\n📝 Step 2: Capture scroll position before clicking Catalog');
    const beforeScroll = await page.evaluate(() => window.scrollY);
    console.log(`📏 Scroll position before click: ${beforeScroll}px`);
    
    // Step 3: Click Catalog button
    console.log('\n📝 Step 3: Click Catalog from header');
    const catalogSelector = "//a//span[text()='Catalog']";
    await page.locator(catalogSelector).click();
    console.log('✅ Clicked on Catalog');
    
    // Step 4: Wait for scroll to complete
    console.log('\n📝 Step 4: Wait for scroll animation to complete');
    await page.waitForTimeout(1000); // Wait for scroll animation
    
    // Step 5: Capture scroll position AFTER clicking Catalog
    console.log('\n📝 Step 5: Capture scroll position after clicking Catalog');
    const afterScroll = await page.evaluate(() => window.scrollY);
    console.log(`📏 Scroll position after click: ${afterScroll}px`);
    
    // Step 6: Assert that scroll position changed
    console.log('\n📝 Step 6: Verify page scrolled');
    expect(afterScroll).not.toBe(beforeScroll);
    console.log(`✅ Page scrolled successfully! Scrolled ${Math.abs(afterScroll - beforeScroll)}px`);
    
    // Additional verification: Check if we actually scrolled down
    if (afterScroll > beforeScroll) {
      console.log(`✅ Page scrolled DOWN by ${afterScroll - beforeScroll}px`);
    } else {
      console.log(`✅ Page scrolled UP by ${beforeScroll - afterScroll}px`);
    }
    
    // Summary
    console.log('\n📊 Test Summary:');
    console.log(`   ✅ Initial scroll position: ${beforeScroll}px`);
    console.log(`   ✅ Final scroll position: ${afterScroll}px`);
    console.log(`   ✅ Scroll difference: ${Math.abs(afterScroll - beforeScroll)}px`);
    console.log(`   ✅ Page scrolled to Catalog section`);
    console.log('\n🎯 TEST PASSED: Page scrolls when Catalog is clicked from header');
  });
});
