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


    test(`Test2_Reject the External Training Certificate as Manager `, async ({ learnerHome, page, context }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `Reject External Training Certificate` },
            { type: `Test Description`, description: `Manager rejects the external training certificate from Collaboration Hub` }

        );
        await learnerHome.learnerLogin("MANAGERNAME", "DefaultPortal");
        await learnerHome.selectCollaborationHub();
        await learnerHome.searchExternalTraining(certificate);
        await learnerHome.verifyAndClickEyeicon(certificate, learnerUsername);
        
        await learnerHome.clickRejectButton();
        await learnerHome.verifyRejectionSuccessModal();

    })


    test(`Test3 Verify verify that the Rejected is getting displayed after manager rejects the certificate `, async ({ learnerHome,profile }) => {

        test.info().annotations.push(
            { type: `Author`, description: `Kathir A` },
            { type: `TestCase`, description: `Verify Certificate Rejection Status` },
            { type: `Test Description`, description: `Verify rejected status is displayed in learner profile after manager rejection` }

        );
        await learnerHome.learnerLogin("LEARNERUSERNAME", "Portal");
        await profile.clickProfile();
        await profile.detailsTab();
        await profile.verifyExternalCertificateStatus(certificate, "Rejected");

    })



});