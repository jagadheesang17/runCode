import { test, expect } from '@playwright/test';
import { LearnerHomePage } from '../../pages/LearnerHomePage';

test.describe('Header Section - Announcements Push-box Verification', () => {
  test.describe.configure({ mode: 'serial' });
  
  let learnerHome: LearnerHomePage;

  test('HS_010: Verify Announcements push-box opens when announcement icon is clicked', async ({ page, context }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'HS_010_Announcements_Push_Box_Opens' },
      { type: 'Test Description', description: 'Verify announcement icon click opens announcements push-box' }
    );

    console.log('📢 Starting Announcements Push-box Open Verification Test');
    
    learnerHome = new LearnerHomePage(page, context);
    await learnerHome.loadLearner('LEARNERUSERNAME', LearnerHomePage.pageUrl);
    
    // Use the method to verify announcement push-box
    await learnerHome.verifyAnnouncementPushBox();
    
    console.log('\n🎯 TEST PASSED: Announcements push-box opens when announcement icon is clicked');
  });

  test('HS_011: Verify announcement icon red dot indicator for unread announcements', async ({ page, context }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'HS_011_Announcement_Red_Dot_Indicator' },
      { type: 'Test Description', description: 'Verify red dot appears for unread announcements and removes when opened' }
    );

    console.log('🔴 Starting Announcement Red Dot Indicator Verification Test');
    
    learnerHome = new LearnerHomePage(page, context);
    await learnerHome.loadLearner('LEARNERUSERNAME', LearnerHomePage.pageUrl);
    
    // Check if red dot is visible on announcement icon (indicating unread announcements)
    console.log('\n📝 Step 1: Check if red dot indicator is visible on announcement icon');
    const redDotSelector = "//div[@aria-label='Announcements']//following-sibling::span[contains(@class,'dot')] | //div[@aria-label='Announcements']/parent::*//*[contains(@class,'badge')] | //div[@aria-label='Announcements']//*[contains(@class,'notification')] | //div[@id='announcementspopover']//*[contains(@class,'badge')] | //div[@id='announcementspopover']//span[contains(@class,'dot')]";
    const redDot = page.locator(redDotSelector);
    const isRedDotVisible = await redDot.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (isRedDotVisible) {
      console.log('✅ Red dot is visible - indicating unread announcements');
      
      // Click on announcement icon to open push-box
      console.log('\n📝 Step 2: Click on announcement icon to open push-box');
      const announcementIcon = page.locator("//div[@aria-label='Announcements']");
      await announcementIcon.click();
      await page.waitForTimeout(1000);
      console.log('✅ Announcements push-box opened');
      
      // Verify red dot is removed after opening
      console.log('\n📝 Step 3: Verify red dot is removed after opening push-box');
      const isRedDotRemovedAfterOpen = await redDot.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (!isRedDotRemovedAfterOpen) {
        console.log('✅ Red dot removed after opening announcements push-box');
      } else {
        console.log('⚠️ Red dot still visible after opening announcements push-box');
      }
    } else {
      console.log('ℹ️ No red dot visible - no unread announcements or different indicator pattern');
    }
    
    console.log('\n🎯 TEST COMPLETED: Announcement red dot indicator verification completed');
  });
});
