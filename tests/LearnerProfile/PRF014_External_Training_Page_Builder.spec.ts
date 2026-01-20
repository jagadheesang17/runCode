import { test } from '../../customFixtures/expertusFixture'

test.describe(`External Training Display in Page Builder`, () => {
    test.describe.configure({ mode: "serial" });

    test(`PROF014_A_Prerequisite: Enable External Training in Page Builder`, async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `Enable External Training in Page Builder` },
            { type: `Test Description`, description: `Admin enables External Training in Learner Page Builder` }
        );

        // Login as admin and navigate to Site Admin
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await siteAdmin.siteAdmin();
        await siteAdmin.navigateToLearnerPageBuilder();
        await siteAdmin.selectTenantInPageBuilder("automationtenant");
        await siteAdmin.clickLearnerPageBuilderHeading();
        await siteAdmin.clickEditTemplate();
        await siteAdmin.expandMyProfileSection();
        await siteAdmin.enableExternalTraining();
        await siteAdmin.saveTemplate();
        console.log("✅ PROF014_A Prerequisite completed: External Training is now enabled");
    })

    test(`PROF014_A: Verify External Training is displayed in Profile after enabling in Page Builder`, async ({ profile, learnerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `Verify External Training Display - Enabled` },
            { type: `Test Description`, description: `Verify External Training section appears in learner profile after enabling in Page Builder` }
        );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "Portal");
        await profile.clickProfile();
        await profile.detailsTab();
        await profile.verifyExternalTrainingIsVisible();
        console.log("✅ PROF014_A passed: External Training is visible in learner profile");
    })

    test(`PROF014_B_Prerequisite: Disable External Training in Page Builder`, async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `Disable External Training in Page Builder` },
            { type: `Test Description`, description: `Admin disables External Training in Learner Page Builder` }
        );
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await siteAdmin.siteAdmin();
        
        await siteAdmin.navigateToLearnerPageBuilder();
        await siteAdmin.selectTenantInPageBuilder("automationtenant");
        await siteAdmin.clickLearnerPageBuilderHeading();
        await siteAdmin.clickEditTemplate();
        await siteAdmin.expandMyProfileSection();
        await siteAdmin.disableExternalTraining();
        await siteAdmin.saveTemplate();
        
        console.log("✅ PROF014_B Prerequisite completed: External Training is now disabled");
    })

    test(`PROF014_B: Verify External Training is NOT displayed in Profile after disabling in Page Builder`, async ({ profile, learnerHome }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `Verify External Training Display - Disabled` },
            { type: `Test Description`, description: `Verify External Training section does not appear in learner profile after disabling in Page Builder` }
        );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "Portal");
        await profile.clickProfile();
        await profile.detailsTab();
        await profile.verifyExternalTrainingIsNotVisible();
        
        console.log("✅ PROF014_B passed: External Training is NOT visible in learner profile");
    })

    test(`PROF014_Cleanup: Re-enable External Training in Page Builder`, async ({ adminHome, siteAdmin }) => {
        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `Re-enable External Training - Cleanup` },
            { type: `Test Description`, description: `Admin re-enables External Training to restore original state` }
        );

        // Login as admin and navigate to Site Admin
        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await siteAdmin.siteAdmin();
        
        await siteAdmin.navigateToLearnerPageBuilder();
        await siteAdmin.selectTenantInPageBuilder("automationtenant");
        await siteAdmin.clickLearnerPageBuilderHeading();
        await siteAdmin.clickEditTemplate();
        await siteAdmin.expandMyProfileSection();
        await siteAdmin.enableExternalTraining();
        await siteAdmin.saveTemplate();
        
        console.log("✅ PROF014 Cleanup completed: External Training is re-enabled for future tests");
    })
})
