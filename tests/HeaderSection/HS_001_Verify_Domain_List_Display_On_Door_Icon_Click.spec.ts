import { test } from '../../customFixtures/expertusFixture';

test.describe('Header Section - Domain List Display Verification', () => {
  test('Verify domain list displays when door icon is clicked', async ({ adminHome }) => {
    test.info().annotations.push(
      { type: 'Author', description: 'QA Automation Team' },
      { type: 'TestCase', description: 'HS_001_Domain_Door_Icon_Verification' },
      { type: 'Test Description', description: 'Login, click Admin Home, then click Go to domain icon' }
    );

    await adminHome.loadAndLogin('CUSTOMERADMIN');
    await adminHome.clickOnAdminHome();
    await adminHome.gotodomainVerification();
  });
});
