import { defineConfig, devices } from '@playwright/test';

let jiraIssueKeys: string[] = [];
const timestamp = Date.now();
const reportDir = `./reporter/playwright-reports-${timestamp}`;

//If false qa will run,if its true automation environment will run
export let environmentSetup: "qa" | "dev" | "automation" | "qaProduction" | "automationtenant" = 'automationtenant';
export default defineConfig({
 timeout: 700000,  
  expect: { timeout: 10000 }, // 10 sec for assertions
  
 
  testDir: './tests',
//  globalSetup: require.resolve('./global-setup.ts'),



  fullyParallel: false,
  retries: 0,
  workers: 1,
  repeatEach: 0,

  reporter: [['html', { outputFolder: reportDir, open: 'always' }], ['line'], ["allure-playwright"]],
  //reporter: [['html', { open: 'always' }]],
  use: {
    actionTimeout: 100000, // or set to 30000 if you prefer the original value
    trace: 'on',
    headless: false,
    screenshot: "on",
    video: 'on',
    ignoreHTTPSErrors: true,
    bypassCSP: true,
  },

  //  // testMatch: [
  // //   '*/tests/admin/adminGroups_CustomerAdminGroupUserCreation/**/*.spec.ts',
  // //   '*/tests/admin/adminGroups_addinguserstodefaultAdminGroups/**/*.spec.ts',
  // //   '*/tests/admin/adminGroups2/**/*.spec.ts',
  // //  '*/tests/admin/customrolecreation/**/*.spec.ts',
  // //   // '*/tests/admin/metadataLibrary/**/*.spec.ts',
  // //   '*/tests/admin/location/**/*.spec.ts',
  // // '*/tests/admin/admin_Enrollments/**/*.spec.ts',
  // //   '*/tests/admin/completionCertificate/**/*.spec.ts',
  // //   '*/tests/admin/assessment/**/*.spec.ts',
  // //   '*/tests/admin/survey/**/*.spec.ts',
  // //   '*/tests/admin/content/**/*.spec.ts',
  // //     '*/tests/admin/organization/**/*.spec.ts',
  // //  '*/tests/admin/peoplemodule_user/**/*.spec.ts',
  // //   '*/tests/admin/quickaccess/**/*.spec.ts',
  // //   '*/tests/admin/communication/**/*.spec.ts',
  // //   '*/tests/admin/learnerGroup/**/*.spec.ts',
  // // '*/tests/admin/announcement/**/*.spec.ts',
  // // '*/tests/admin/course/**/*.spec.ts',
  // // '*/tests/admin/banner/**/*.spec.ts',
  // // '*/tests/admin/dynamic_Shareable_Links/**/*.spec.ts',
  // // '*/tests/admin/trainingPlan/**/*.spec.ts',
  // //   '*/tests/admin/managerApproval/**/*.spec.ts',
  // //   '*/tests/admin/dedicatedToTP/**/*.spec.ts',
  //     '*/tests/Collaboration-Hub/**/*.spec.ts',
  // //     '*/tests/LearnerSide/**/*.spec.ts',
  // //     '*/tests/Instructor/**/*.spec.ts',
  // //     '*/tests/LearnerProfile/**/*.spec.ts',
  // //    '*/tests/ReEnroll/**/*.spec.ts',
  // //   '*/tests/EnrollmentByManager/**/*.spec.ts',
  // //    '*/tests/dynamic_Shareable_Links/**/*.spec.ts', 
  // //   // '*/tests/Terms_and_Conditions/**/*.spec.ts',  
  // //   // '*/tests/SSO/**/*.spec.ts',
  // //   '*/api/apiTestIntegration/**/*.spec.ts',
  // //   '*/tests/organization/**/*.spec.ts',
  // //   '*/tests/admin/address_inheritance/**/*.spec.ts',
//
// // ],
  projects: [
    /* {
      name: 'Chromium',
      use: {
        ...devices['Desktop Chromium'],
        ignoreHTTPSErrors: true,
        headless: false,
        video: 'on',
        screenshot: "on",
        viewport: null,
        launchOptions: {
          slowMo: 300,
          args: ["--start-maximized"]
        },


      }

    }, */
    {
      name: 'chrome',
      use: {
        browserName: 'chromium', ...devices['Desktop Chromium'], channel: 'chrome', headless: false,
        viewport: null,
        launchOptions: {
          slowMo: 150,
          args: ["--start-maximized", "--disable-web-security", "--incognito"]
        }
      }
    },
    // {
    //   name: 'firefox',
    //   use: {
    //     browserName: 'firefox',
    //     ...devices['Desktop Firefox'],
    //     channel: 'firefox',
    //     headless: false,

    //     launchOptions: {
    //       slowMo: 400, 
    //       args: [
    //         '--start-maximized',
    //         '--private',
    //         '--disable-web-security',
    //       ],
    //     },
    //     viewport: { width: 1530, height: 740 },
    //   },
    // },
    ...(
      true ? [{
        name: 'Verification',
        testDir: './zCronVerification',
        use: {

          headless: false,
          ...devices['Desktop Chromium'],
          viewport: null,
          launchOptions: {
            slowMo: 300,
            args: ["--start-maximized"]
          }
        }
      },] : []
    ), ...(
      true ? [{
        name: 'API Testing',
        testDir: './api',

        use: {
          headless: false,
          ...devices['Desktop Chromium'],
          viewport: null,
          launchOptions: {
            slowMo: 300,
            args: ["--start-maximized"]
          }

        }
      },] : []
    ),
  ],



});
