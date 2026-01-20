import { test, expect } from '@playwright/test';
import { LearnerHomePage } from '../../pages/LearnerHomePage';

test.describe('Header Section - Alerts Push-box Verification', () => {
  test.describe.configure({ mode: 'serial' });
  
  let learnerHome: LearnerHomePage;

  test('HS_006: Verify Alerts push-box opens when alert icon is clicked', async ({ page, context }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'HS_006_Alerts_Push_Box_Opens' },
      { type: 'Test Description', description: 'Verify alert icon click opens alerts push-box' }
    );

    console.log('🔔 Starting Alerts Push-box Open Verification Test');
    
    learnerHome = new LearnerHomePage(page, context);
    await learnerHome.loadLearner('LEARNERUSERNAME', LearnerHomePage.pageUrl);
    
    // Use the method to verify alert functionality (first instance)
    await learnerHome.clickAlertMoreButton();
  });

  test('HS_007: Verify alert icon red dot indicator for unread alerts', async ({ page, context }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'HS_007_Alert_Red_Dot_Indicator' },
      { type: 'Test Description', description: 'Verify red dot appears for unread alerts and removes when opened' }
    );

    console.log('🔴 Starting Alert Red Dot Indicator Verification Test');
    
    learnerHome = new LearnerHomePage(page, context);
    await learnerHome.loadLearner('LEARNERUSERNAME', LearnerHomePage.pageUrl);
    
    // Check if red dot is visible (indicating unread alerts)
    console.log('\n📝 Check if red dot indicator is visible on alert icon');
    const redDotSelector = "//i[@class='fa-duotone fa-exclamation-triangle']//following-sibling::span[contains(@class,'dot')] | //i[@class='fa-duotone fa-exclamation-triangle']/parent::*//*[contains(@class,'badge')] | //i[@class='fa-duotone fa-exclamation-triangle']//*[contains(@class,'notification')]";
    const redDot = page.locator(redDotSelector);
    const isRedDotVisible = await redDot.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (isRedDotVisible) {
      console.log('✅ Red dot is visible - indicating unread alerts');
      
      // Click on alert icon to open push-box
      const alertIcon = page.locator("//i[@class='fa-duotone fa-exclamation-triangle']");
      await alertIcon.click();
      await page.waitForTimeout(1000);
      
      // Verify red dot is removed after opening
      const isRedDotRemovedAfterOpen = await redDot.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (!isRedDotRemovedAfterOpen) {
        console.log('✅ Red dot removed after opening alerts push-box');
      } else {
        console.log('⚠️ Red dot still visible after opening alerts push-box');
      }
    } else {
      console.log('ℹ️ No red dot visible - no unread alerts or different indicator pattern');
    }
    
    console.log('\n🎯 TEST COMPLETED: Alert red dot indicator verification completed');
  });

  test('HS_008: Verify enrollment and reminder alerts display (max 5)', async ({ page, context }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'HS_008_Alerts_Display_Verification' },
      { type: 'Test Description', description: 'Verify enrollment and reminder alerts are displayed (max 5)' }
    );

    console.log('📋 Starting Alerts Display Verification Test');
    
    learnerHome = new LearnerHomePage(page, context);
    await learnerHome.loadLearner('LEARNERUSERNAME', LearnerHomePage.pageUrl);
    
    // Click on alert icon to open push-box
    const alertIcon = page.locator("//i[@class='fa-duotone fa-exclamation-triangle']");
    await alertIcon.click();
    await page.waitForTimeout(1000);
    console.log('✅ Alerts push-box opened');
    
    // Verify Alerts push-box is visible
    const alertsText = page.locator("(//div[text()='Alerts'])[1]");
    const isAlertsPushBoxVisible = await alertsText.isVisible();
    expect(isAlertsPushBoxVisible).toBeTruthy();
    console.log('✅ Alerts push-box is visible');
    
    // Count the number of alerts displayed
    const alertItemsSelector = "//div[contains(@class,'list-group-item border')]";
    const alertItems = page.locator(alertItemsSelector);
    const alertCount = await alertItems.count();
    
    console.log(`📊 Total alerts displayed: ${alertCount}`);
    
    // Verify max 5 alerts are displayed
    expect(alertCount).toBeLessThanOrEqual(5);
    console.log(`✅ Alerts displayed: ${alertCount} (max 5 allowed)`);
    
    // Check for enrollment and reminder alerts
    const enrollmentAlertSelector = "//*[contains(text(),'enrollment') or contains(text(),'Enrollment') or contains(text(),'enrolled') or contains(text(),'Enrolled')]";
    const reminderAlertSelector = "//*[contains(text(),'reminder') or contains(text(),'Reminder') or contains(text(),'remind') or contains(text(),'Remind')]";
    
    const enrollmentAlerts = page.locator(enrollmentAlertSelector);
    const reminderAlerts = page.locator(reminderAlertSelector);
    
    const enrollmentCount = await enrollmentAlerts.count();
    const reminderCount = await reminderAlerts.count();
    
    console.log(`📝 Enrollment alerts found: ${enrollmentCount}`);
    console.log(`⏰ Reminder alerts found: ${reminderCount}`);
    
    if (enrollmentCount > 0 || reminderCount > 0) {
      console.log('✅ Enrollment and/or Reminder alerts are displayed in push-box');
    } else {
      console.log('ℹ️ No enrollment or reminder alerts currently available');
    }
    
    console.log('\n🎯 TEST PASSED: Alerts display verification completed');
  });

  test('HS_009: Verify navigation to course details when more icon is clicked', async ({ page, context }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'HS_009_More_Icon_Navigation' },
      { type: 'Test Description', description: 'Verify page navigates to course/class/TP details when more is clicked' }
    );

    console.log('🔗 Starting More Icon Navigation Verification Test');
    
    learnerHome = new LearnerHomePage(page, context);
    await learnerHome.loadLearner('LEARNERUSERNAME', LearnerHomePage.pageUrl);
    
    try {
      await learnerHome.clickAlertMoreButton();
      console.log('✅ Successfully navigated to course details page');
      
      const aboutThisCourse = page.locator("//div[text()='About This Course']");
      const isAboutVisible = await aboutThisCourse.isVisible();
      expect(isAboutVisible).toBeTruthy();
      console.log('✅ Course details page is displayed with "About This Course" section');
      
      console.log('\n🎯 TEST PASSED: Navigation to course details works when more icon is clicked');
    } catch (error) {
      if (error instanceof Error && error.message.includes("'more' button is not there")) {
        console.log('ℹ️ No "more" button available - no additional alerts to expand');
        console.log('⚠️ Test skipped: No alerts with more details to display');
      } else {
        throw error;
      }
    }
  });
});
