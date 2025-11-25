import { test } from "../../../customFixtures/expertusFixture";
import { FakerData } from '../../../utils/fakerUtils';

test.describe('CC011 - Verify Change Log functionality', () => {

    const title = FakerData.getcertificationTitle();

    test("CC011 - Verify Change Log section display, modifications capture and close functionality", async ({ adminHome, CompletionCertification,exportPage }) => {
        
        test.info().annotations.push(
            { type: 'Author', description: 'Kathir A' },
            { type: 'TestCase', description: 'CC011_Verify_change_log_functionality' },
            { type: 'Test Description', description: 'Verify whether the Change Log section is displayed, modifications are captured and closed when icon is clicked' }
        );

        await adminHome.loadAndLogin("CUSTOMERADMIN");
        await adminHome.menuButton();
        await adminHome.clickLearningMenu();
        await adminHome.clickCompletionCertification();
        await CompletionCertification.clickCreateCompletionCertificate();
        
        await CompletionCertification.clickTemplateType();
        await CompletionCertification.title(title);
        await CompletionCertification.designCertificate(FakerData.getDescription());
        await CompletionCertification.clickPublish();
        await CompletionCertification.clickProceed();
        await CompletionCertification.clickEditCertificate();
        await CompletionCertification.clickExpandChangeLog();
        await CompletionCertification.verifyChangeLogDisplayed();
        await CompletionCertification.verifyFilterSortOptions();
        
        const changeLogData = await CompletionCertification.getChangeLogData();
        console.log(`Successfully extracted ${changeLogData.length} change log entries from UI`);

        await exportPage.clickExportAs("Excel");
        await exportPage.validateExported("Excel", "changeLogData");

        await CompletionCertification.clickCollapseChangeLog();
        await CompletionCertification.verifyChangeLogClosed();
    });
});
