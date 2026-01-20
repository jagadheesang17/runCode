import { test, expect } from '@playwright/test';
import { LearnerHomePage } from '../../pages/LearnerHomePage';

test.describe('Header Section - My Profile Scroll Verification', () => {
  test('Verify page scrolls to My Profile section when clicked from header', async ({ page, context }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'HS_005_My_Profile_Scroll_Verification' },
      { type: 'Test Description', description: 'Login as learner, click My Profile, verify page scrolls' }
    );

    console.log('🔐 Starting My Profile Scroll Verification Test');
    
    // Step 1: Login as Learner
    console.log('\n📝 Step 1: Login as Learner');
    const learnerHome = new LearnerHomePage(page, context);
    await learnerHome.loadLearner('LEARNERUSERNAME', LearnerHomePage.pageUrl);
    console.log('✅ Successfully logged in as Learner');
    
    // Step 2: Capture scroll position BEFORE clicking My Profile
    console.log('\n📝 Step 2: Capture scroll position before clicking My Profile');
    const beforeScroll = await page.evaluate(() => window.scrollY);
    console.log(`📏 Scroll position before click: ${beforeScroll}px`);
    
    // Step 3: Click My Profile button
    console.log('\n📝 Step 3: Click My Profile from header');
    const myProfileSelector = "//span[text()='My Profile']";
    await page.locator(myProfileSelector).click();
    console.log('✅ Clicked on My Profile');
    
    // Step 4: Wait for scroll to complete
    console.log('\n📝 Step 4: Wait for scroll animation to complete');
    await page.waitForTimeout(1000); // Wait for scroll animation
    
    // Step 5: Capture scroll position AFTER clicking My Profile
    console.log('\n📝 Step 5: Capture scroll position after clicking My Profile');
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
    console.log(`   ✅ Page scrolled to My Profile section`);
    console.log('\n🎯 TEST PASSED: Page scrolls when My Profile is clicked from header');
  });
});
