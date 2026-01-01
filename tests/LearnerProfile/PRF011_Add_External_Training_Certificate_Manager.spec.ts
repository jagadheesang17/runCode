import { credentials } from '../../constants/credentialData';
import { test } from '../../customFixtures/expertusFixture'
import { FakerData } from '../../utils/fakerUtils'; ``
import { FilterUtils } from "../../utils/filterUtils";

const certificate = FakerData.getcertificationTitle();
let learnerUsername = credentials.LEARNERUSERNAME.username;

test.describe(`Add_External_Training_Certificate`, () => {
    test.describe.configure({ mode: "serial" });

    test(`Test1_Add_External_Training_Certificate_Manager`, async ({ profile, learnerHome }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Vidya` },
            { type: `TestCase`, description: `Add External Training Certificate` },
            { type: `Test Description`, description: `Learner adds external training certificate for manager verification` }

        );

        await learnerHome.learnerLogin("LEARNERUSERNAME", "Portal");
        await profile.clickProfile();
        await profile.detailsTab();
        await profile.certificateVerificationbyManager(certificate, "Manager User");
        await profile.clickSave();
        await profile.verifySavedChanges();
    })


    test(`Test2_Approve the External Training Certificate as Manager `, async ({ learnerHome, page, context }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `Approve External Training Certificate` },
            { type: `Test Description`, description: `Manager approves the external training certificate from Collaboration Hub` }

        );
        await learnerHome.learnerLogin("MANAGERNAME", "DefaultPortal");
        await learnerHome.selectCollaborationHub();
        const filterUtils = new FilterUtils(page, context);

        await filterUtils.applyMultipleFilters([
            // { fieldName: "Status", optionValue: "Pending" },
            { fieldName: "Training Type", optionValue: "External Training" }
        ]);
        await learnerHome.verifyAndClickEyeicon(certificate, learnerUsername);
        await learnerHome.clickApproveButton();
        await learnerHome.verifyApprovalSuccessModal();    

    })


    test(`Test3 Verify verify that the Approved is getting displayed after manager approves the certificate `, async ({ learnerHome,profile }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `Verify Certificate Approval Status` },
            { type: `Test Description`, description: `Verify approved status is displayed in learner profile after manager approval` }

        );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "Portal");
        await profile.clickProfile();
        await profile.detailsTab();
        await profile.verifyExternalCertificateStatus(certificate, "Approved");
        await profile.deleteExternalTraining(certificate);
    })



});